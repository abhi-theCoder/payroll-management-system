/**
 * Leave Repository
 * Data access layer for leave operations
 */

import { PrismaClient } from '@prisma/client';
// import { LeaveRequestEntity, LeaveBalanceEntity, LeaveTypeEntity } from './domain/leave.entity';

export class LeaveRepository {
  constructor(private prisma: PrismaClient) { }

  // ==================== LEAVE REQUEST OPERATIONS ====================

  async createLeaveRequest(data: {
    employeeId: string;
    leaveTypeId: string;
    fromDate: Date;
    toDate: Date;
    days: number;
    reason: string;
    documentUrl?: string;
  }) {
    return this.prisma.leaveRequest.create({
      data: {
        ...data,
        status: 'PENDING',
      },
      include: {
        leaveType: true,
        approvals: true,
      },
    });
  }

  async getLeaveRequestById(id: string) {
    return this.prisma.leaveRequest.findUnique({
      where: { id },
      include: {
        leaveType: true,
        employee: true,
        approvals: {
          include: {
            approver: true,
          },
        },
      },
    });
  }

  async getPendingLeaveRequests(filters?: {
    employeeId?: string;
    department?: string;
    leaveTypeId?: string;
  }) {
    return this.prisma.leaveRequest.findMany({
      where: {
        status: 'PENDING',
        employee: {
          department: filters?.department,
        },
        leaveTypeId: filters?.leaveTypeId,
      },
      include: {
        employee: true,
        leaveType: true,
        approvals: {
          include: {
            approver: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getLeaveHistoryByEmployee(employeeId: string) {
    return this.prisma.leaveRequest.findMany({
      where: { employeeId },
      include: {
        leaveType: true,
        approvals: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateLeaveRequestStatus(
    id: string,
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED',
  ) {
    return this.prisma.leaveRequest.update({
      where: { id },
      data: { status, updatedAt: new Date() },
      include: {
        leaveType: true,
        approvals: true,
      },
    });
  }

  async getLeaveRequestsInDateRange(
    employeeId: string,
    fromDate: Date,
    toDate: Date,
    excludeStatus?: string[],
  ) {
    return this.prisma.leaveRequest.findMany({
      where: {
        employeeId,
        fromDate: {
          lte: toDate,
        },
        toDate: {
          gte: fromDate,
        },
        status: excludeStatus ? { notIn: excludeStatus } : undefined,
      },
    });
  }

  // ==================== LEAVE BALANCE OPERATIONS ====================

  async getLeaveBalance(
    employeeId: string,
    leaveTypeId: string,
    year: number,
  ) {
    return this.prisma.leaveBalance.findUnique({
      where: {
        employeeId_leaveTypeId_year: {
          employeeId,
          leaveTypeId,
          year,
        },
      },
    });
  }

  async getLeaveBalancesByEmployee(employeeId: string, year: number) {
    return this.prisma.leaveBalance.findMany({
      where: { employeeId, year },
      include: {
        leaveType: true,
      },
    });
  }

  async createLeaveBalance(data: {
    employeeId: string;
    leaveTypeId: string;
    year: number;
    total: number;
    used: number;
    balance: number;
    carriedForward?: number;
  }) {
    return this.prisma.leaveBalance.create({
      data: {
        ...data,
        carriedForward: data.carriedForward || 0,
      },
    });
  }

  async updateLeaveBalance(
    employeeId: string,
    leaveTypeId: string,
    year: number,
    data: {
      used?: number;
      balance?: number;
    },
  ) {
    return this.prisma.leaveBalance.update({
      where: {
        employeeId_leaveTypeId_year: {
          employeeId,
          leaveTypeId,
          year,
        },
      },
      data: {
        ...data,
        lastUpdated: new Date(),
      },
    });
  }

  // ==================== LEAVE TYPE OPERATIONS ====================

  async getLeaveTypeById(id: string) {
    return this.prisma.leaveType.findUnique({
      where: { id },
    });
  }

  async getLeaveTypeByCode(code: string) {
    return this.prisma.leaveType.findUnique({
      where: { code },
    });
  }

  async getAllLeaveTypes(active?: boolean) {
    return this.prisma.leaveType.findMany({
      where: active !== undefined ? { active } : undefined,
      orderBy: { name: 'asc' },
    });
  }

  async createLeaveType(data: {
    name: string;
    code: string;
    description?: string;
    maxPerYear: number;
    carryForward: number;
    isCarryForwardAllowed?: boolean;
    isPaid?: boolean;
    requiresDocument?: boolean;
  }) {
    return this.prisma.leaveType.create({
      data: {
        ...data,
        isCarryForwardAllowed: data.isCarryForwardAllowed ?? true,
        isPaid: data.isPaid ?? true,
        requiresDocument: data.requiresDocument ?? false,
      },
    });
  }

  // ==================== LEAVE APPROVAL OPERATIONS ====================

  async createLeaveApproval(data: {
    leaveRequestId: string;
    approverId: string;
    level: number;
    status?: string;
    remarks?: string;
  }) {
    return this.prisma.leaveApproval.create({
      data: {
        ...data,
        status: data.status || 'PENDING',
      },
      include: {
        approver: true,
      },
    });
  }

  async updateLeaveApproval(
    id: string,
    data: {
      status: string;
      remarks?: string;
      approvedAt?: Date;
    },
  ) {
    return this.prisma.leaveApproval.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: {
        approver: true,
      },
    });
  }

  async getLeaveApprovalsForRequest(leaveRequestId: string) {
    return this.prisma.leaveApproval.findMany({
      where: { leaveRequestId },
      include: {
        approver: true,
      },
      orderBy: { level: 'asc' },
    });
  }

  // ==================== LEAVE APPROVAL GROUP OPERATIONS ====================

  async getApprovalGroupByDepartment(department: string) {
    return this.prisma.leaveApprovalGroup.findUnique({
      where: { department },
    });
  }

  async getAllApprovalGroups(active?: boolean) {
    return this.prisma.leaveApprovalGroup.findMany({
      where: active !== undefined ? { active } : undefined,
    });
  }

  async createApprovalGroup(data: {
    department: string;
    approvalLevels: number;
    approverIds: string[];
    escalationDays?: number;
  }) {
    return this.prisma.leaveApprovalGroup.create({
      data: {
        ...data,
        escalationDays: data.escalationDays || 5,
      },
    });
  }

  async updateApprovalGroup(
    department: string,
    data: Partial<{
      approvalLevels: number;
      approverIds: string[];
      escalationDays: number;
      active: boolean;
    }>,
  ) {
    return this.prisma.leaveApprovalGroup.update({
      where: { department },
      data,
    });
  }

  // ==================== LEAVE POLICY OPERATIONS ====================

  async getLeavePolicy() {
    return this.prisma.leavePolicy.findFirst({
      where: { active: true },
    });
  }

  async updateLeavePolicy(data: any) {
    const existing = await this.prisma.leavePolicy.findFirst({
      where: { active: true },
    });

    if (existing) {
      return this.prisma.leavePolicy.update({
        where: { id: existing.id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });
    } else {
      return this.prisma.leavePolicy.create({
        data: {
          ...data,
          policyName: data.policyName || 'Default Leave Policy',
          companyName: data.companyName || 'Company',
          financialYearStart: data.financialYearStart || 4,
          financialYearEnd: data.financialYearEnd || 3,
          weekendDays: data.weekendDays || ['SATURDAY', 'SUNDAY'],
          holidayIds: data.holidayIds || [],
          lopConfiguration: data.lopConfiguration || {},
          encashmentRules: data.encashmentRules || {},
        },
      });
    }
  }
}
