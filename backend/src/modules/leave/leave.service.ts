/**
 * Leave Service
 * Business logic for leave management
 */

import { PrismaClient } from '@prisma/client';
import { LeaveRepository } from './leave.repository';
import { LeaveValidationRules, LeaveApprovalRules } from './domain/leave-policy.rules';
import { LeaveRequestEntity, LeaveBalanceEntity } from './domain/leave.entity';
import { ApplyLeaveInput, ApproveLeaveInput, RejectLeaveInput } from './leave.validator';

export class LeaveService {
  private repository: LeaveRepository;

  constructor(private prisma: PrismaClient) {
    this.repository = new LeaveRepository(prisma);
  }

  // ==================== APPLY LEAVE ====================

  async applyLeave(employeeId: string, input: ApplyLeaveInput) {
    // Get leave type
    const leaveType = await this.repository.getLeaveTypeById(input.leaveTypeId);
    if (!leaveType || !leaveType.active) {
      throw new Error('Invalid or inactive leave type');
    }

    // Get policy
    const policy = await this.repository.getLeavePolicy();
    if (!policy) {
      throw new Error('Leave policy not configured');
    }

    // Calculate leave days
    const daysToUse = LeaveValidationRules.calculateLeaveDaysExcludingHolidays(
      new Date(input.fromDate),
      new Date(input.toDate),
      [],
      policy.weekendDays as string[],
    );

    // Check for overlapping leaves
    const existingLeaves = await this.repository.getLeaveRequestsInDateRange(
      employeeId,
      new Date(input.fromDate),
      new Date(input.toDate),
      ['REJECTED', 'CANCELLED'],
    );

    if (existingLeaves.length > 0) {
      throw new Error('Leave dates overlap with existing leave requests');
    }

    // Get leave balance
    const year = new Date(input.fromDate).getFullYear();
    const balance = await this.repository.getLeaveBalance(
      employeeId,
      input.leaveTypeId,
      year,
    );

    if (!balance) {
      throw new Error('No leave balance available for this leave type');
    }

    // Validate leave request
    const leaveEntity = new LeaveRequestEntity(
      '',
      employeeId,
      input.leaveTypeId,
      new Date(input.fromDate),
      new Date(input.toDate),
      daysToUse,
      input.reason,
      'PENDING',
      new Date(),
      new Date(),
      input.documentUrl,
    );

    const balanceEntity = new LeaveBalanceEntity(
      balance.id,
      balance.employeeId,
      balance.leaveTypeId,
      balance.year,
      balance.total,
      balance.used,
      balance.balance,
      balance.carriedForward,
    );

    const validation = LeaveValidationRules.validateLeaveRequest(leaveEntity, balanceEntity);
    if (!validation.valid) {
      throw new Error(validation.errors.join(', '));
    }

    // Create leave request
    const leaveRequest = await this.repository.createLeaveRequest({
      employeeId,
      leaveTypeId: input.leaveTypeId,
      fromDate: new Date(input.fromDate),
      toDate: new Date(input.toDate),
      days: daysToUse,
      reason: input.reason,
      documentUrl: input.documentUrl,
    });

    // Create approval workflow
    const employee = await this.prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        leaveGroup: {
          include: {
            reviewers: {
              orderBy: { level: 'asc' }
            }
          }
        }
      }
    });

    if (employee?.leaveGroup?.reviewers?.length) {
      // Use group reviewers
      for (const reviewer of employee.leaveGroup.reviewers) {
        await this.repository.createLeaveApproval({
          leaveRequestId: leaveRequest.id,
          approverId: reviewer.reviewerId,
          level: reviewer.level,
        });
      }
    } else {
      // Fallback to department-based approval group
      const approvalGroup = await this.repository.getApprovalGroupByDepartment(
        employee?.department || 'DEFAULT',
      );

      if (approvalGroup) {
        // Create approval records for each level
        for (let level = 1; level <= approvalGroup.approvalLevels; level++) {
          const approverIndex = level - 1;
          if (approvalGroup.approverIds[approverIndex]) {
            await this.repository.createLeaveApproval({
              leaveRequestId: leaveRequest.id,
              approverId: approvalGroup.approverIds[approverIndex],
              level,
            });
          }
        }
      }
    }

    return leaveRequest;
  }

  // ==================== APPROVE LEAVE ====================

  async approveLeave(leaveRequestId: string, approverId: string, input: ApproveLeaveInput) {
    const leaveRequest = await this.repository.getLeaveRequestById(leaveRequestId);
    if (!leaveRequest) {
      throw new Error('Leave request not found');
    }

    if (leaveRequest.status !== 'PENDING') {
      throw new Error(`Cannot approve leave with status: ${leaveRequest.status}`);
    }

    // Get approval record for this approver
    const approval = leaveRequest.approvals.find(
      (a) => a.approverId === approverId && a.status === 'PENDING',
    );

    if (!approval) {
      throw new Error('No pending approval found for this approver');
    }

    // Update approval
    await this.repository.updateLeaveApproval(approval.id, {
      status: 'APPROVED',
      remarks: input.remarks,
      approvedAt: new Date(),
    });

    // Check if all approvals are complete
    const allApprovals = await this.repository.getLeaveApprovalsForRequest(leaveRequestId);
    const isComplete = LeaveApprovalRules.isApprovalComplete(
      allApprovals.map((a) => ({ level: a.level, status: a.status })),
      allApprovals.length,
    );

    if (isComplete) {
      // Update leave request status
      await this.repository.updateLeaveRequestStatus(leaveRequestId, 'APPROVED');

      // Update leave balance
      const currentYear = new Date(leaveRequest.fromDate).getFullYear();
      const balance = await this.repository.getLeaveBalance(
        leaveRequest.employeeId,
        leaveRequest.leaveTypeId,
        currentYear,
      );

      if (balance) {
        await this.repository.updateLeaveBalance(
          leaveRequest.employeeId,
          leaveRequest.leaveTypeId,
          currentYear,
          {
            used: balance.used + leaveRequest.days,
            balance: balance.balance - leaveRequest.days,
          },
        );
      }
    }

    return leaveRequest;
  }

  // ==================== REJECT LEAVE ====================

  async rejectLeave(leaveRequestId: string, approverId: string, input: RejectLeaveInput) {
    const leaveRequest = await this.repository.getLeaveRequestById(leaveRequestId);
    if (!leaveRequest) {
      throw new Error('Leave request not found');
    }

    if (leaveRequest.status !== 'PENDING') {
      throw new Error(`Cannot reject leave with status: ${leaveRequest.status}`);
    }

    // Get approval record for this approver
    const approval = leaveRequest.approvals.find(
      (a) => a.approverId === approverId && a.status === 'PENDING',
    );

    if (!approval) {
      throw new Error('No pending approval found for this approver');
    }

    // Update approval
    await this.repository.updateLeaveApproval(approval.id, {
      status: 'REJECTED',
      remarks: input.remarks,
      approvedAt: new Date(),
    });

    // Update leave request status (reject immediately on first rejection)
    await this.repository.updateLeaveRequestStatus(leaveRequestId, 'REJECTED');

    return leaveRequest;
  }

  // ==================== GET LEAVE BALANCE ====================

  async getLeaveBalance(employeeId: string) {
    const currentYear = new Date().getFullYear();
    let balances = await this.repository.getLeaveBalancesByEmployee(employeeId, currentYear);

    // Auto-initialize balances if they don't exist
    if (balances.length === 0) {
      const leaveTypes = await this.repository.getAllLeaveTypes(true);
      for (const type of leaveTypes) {
        await this.repository.createLeaveBalance({
          employeeId,
          leaveTypeId: type.id,
          year: currentYear,
          total: type.maxPerYear,
          used: 0,
          balance: type.maxPerYear,
          carriedForward: 0,
        });
      }
      // Fetch again after initialization
      balances = await this.repository.getLeaveBalancesByEmployee(employeeId, currentYear);
    }

    return {
      employeeId,
      year: currentYear,
      leaveTypes: balances.map((b) => ({
        leaveTypeId: b.leaveTypeId,
        leaveTypeName: b.leaveType.name,
        total: b.total,
        used: b.used,
        balance: b.balance,
        carriedForward: b.carriedForward,
      })),
    };
  }

  // ==================== GET LEAVE HISTORY ====================

  async getLeaveHistory(employeeId: string) {
    return this.repository.getLeaveHistoryByEmployee(employeeId);
  }

  // ==================== GET LEAVE TYPES ====================

  async getLeaveTypes() {
    return this.repository.getAllLeaveTypes(true); // active only
  }

  // ==================== GET PENDING LEAVES ====================

  async getPendingLeaves(filters?: {
    employeeId?: string;
    department?: string;
    leaveTypeId?: string;
  }) {
    return this.repository.getPendingLeaveRequests(filters);
  }

  // ==================== CANCEL LEAVE ====================

  async cancelLeave(leaveRequestId: string, employeeId: string) {
    const leaveRequest = await this.repository.getLeaveRequestById(leaveRequestId);
    if (!leaveRequest) {
      throw new Error('Leave request not found');
    }

    if (leaveRequest.employeeId !== employeeId) {
      throw new Error('Unauthorized to cancel this leave request');
    }

    if (!leaveRequest.approvals || leaveRequest.approvals.length === 0) {
      throw new Error('Cannot determine leave status');
    }

    // Calculate days until leave starts
    const today = new Date();
    const daysUntilLeave = Math.floor(
      (leaveRequest.fromDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (!LeaveValidationRules.canCancelLeave(leaveRequest.status, daysUntilLeave)) {
      throw new Error(
        'Leave can only be cancelled if approved and at least 2 days before start date',
      );
    }

    // Update leave request status
    await this.repository.updateLeaveRequestStatus(leaveRequestId, 'CANCELLED');

    // Update leave balance if it was approved
    if (leaveRequest.status === 'APPROVED') {
      const year = new Date(leaveRequest.fromDate).getFullYear();
      const balance = await this.repository.getLeaveBalance(
        leaveRequest.employeeId,
        leaveRequest.leaveTypeId,
        year,
      );

      if (balance) {
        await this.repository.updateLeaveBalance(
          leaveRequest.employeeId,
          leaveRequest.leaveTypeId,
          year,
          {
            used: balance.used - leaveRequest.days,
            balance: balance.balance + leaveRequest.days,
          },
        );
      }
    }

    return leaveRequest;
  }
}
