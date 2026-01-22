/**
 * Leave Controller
 * HTTP request handlers for leave operations
 */

import { Request, Response } from 'express';
import { LeaveService } from './leave.service';
import {
  ApplyLeaveSchema,
  ApproveLeaveSchema,
  RejectLeaveSchema,
  // CreateLeaveTypeSchema,
  UpdateLeavePolicySchema,
} from './leave.validator';
import { PrismaClient } from '@prisma/client';
import { AuditLogger } from '@shared/utils/audit';
import employeeService from '../employee/service';

export class LeaveController {
  private leaveService: LeaveService;

  constructor(
    private prisma: PrismaClient,
    private auditLogger: AuditLogger,
  ) {
    this.leaveService = new LeaveService(prisma);
  }

  /**
   * Helper to get employeeId from userId
   */
  private async getEmployeeId(userId: string): Promise<string> {
    const employee = await employeeService.getEmployeeByUserId(userId);
    if (!employee) {
      throw new Error('Employee record not found for this user');
    }
    return employee.id;
  }

  // ==================== EMPLOYEE ENDPOINTS ====================

  /**
   * Apply for leave
   * POST /leaves/apply
   */
  async applyLeave(req: Request, res: Response) {
    try {
      const validation = ApplyLeaveSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          errors: validation.error.errors,
        });
      }

      const userId = (req as any).user.id;
      const employeeId = await this.getEmployeeId(userId);
      const leaveRequest = await this.leaveService.applyLeave(
        employeeId,
        validation.data,
      );

      await this.auditLogger.log({
        action: 'CREATE',
        module: 'LeaveManagement',
        resourceType: 'LeaveRequest',
        resourceId: leaveRequest.id,
        status: 'SUCCESS',
        userId: (req as any).user.id,
        changes: {
          status: 'PENDING',
          days: leaveRequest.days,
        },
      });

      return res.status(201).json({
        success: true,
        data: leaveRequest,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Get leave history
   * GET /leaves/history
   */
  async getLeaveHistory(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const employeeId = await this.getEmployeeId(userId);
      const history = await this.leaveService.getLeaveHistory(employeeId);

      return res.status(200).json({
        success: true,
        data: history,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Get leave balance
   * GET /leaves/balance
   */
  async getLeaveBalance(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const employeeId = await this.getEmployeeId(userId);
      const balance = await this.leaveService.getLeaveBalance(employeeId);

      return res.status(200).json({
        success: true,
        data: balance,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Get leave types
   * GET /leaves/types
   */
  async getLeaveTypes(_req: Request, res: Response) {
    try {
      const types = await this.leaveService.getLeaveTypes();

      return res.status(200).json({
        success: true,
        data: types,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Cancel leave request
   * POST /leaves/:id/cancel
   */
  async cancelLeave(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      const employeeId = await this.getEmployeeId(userId);
      const cancelledLeave = await this.leaveService.cancelLeave(id, employeeId);

      await this.auditLogger.log({
        action: 'CANCEL',
        module: 'LeaveManagement',
        resourceType: 'LeaveRequest',
        resourceId: id,
        status: 'SUCCESS',
        userId: (req as any).user.id,
      });

      return res.status(200).json({
        success: true,
        data: cancelledLeave,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  // ==================== ADMIN / HR ENDPOINTS ====================

  /**
   * Get pending leave requests
   * GET /leaves/pending
   */
  async getPendingLeaves(req: Request, res: Response) {
    try {
      const { department, leaveTypeId } = req.query;

      const pending = await this.leaveService.getPendingLeaves({
        department: department as string,
        leaveTypeId: leaveTypeId as string,
      });

      return res.status(200).json({
        success: true,
        data: pending,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Approve leave request
   * POST /leaves/:id/approve
   */
  async approveLeave(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const validation = ApproveLeaveSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          success: false,
          errors: validation.error.errors,
        });
      }

      const approverId = (req as any).user.id;
      const approvedLeave = await this.leaveService.approveLeave(
        id,
        approverId,
        validation.data,
      );

      await this.auditLogger.log({
        action: 'APPROVE',
        module: 'LeaveManagement',
        resourceType: 'LeaveRequest',
        resourceId: id,
        status: 'SUCCESS',
        userId: (req as any).user.id,
        changes: { remarks: validation.data.remarks },
      });

      return res.status(200).json({
        success: true,
        data: approvedLeave,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Reject leave request
   * POST /leaves/:id/reject
   */
  async rejectLeave(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const validation = RejectLeaveSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          success: false,
          errors: validation.error.errors,
        });
      }

      const approverId = (req as any).user.id;
      const rejectedLeave = await this.leaveService.rejectLeave(
        id,
        approverId,
        validation.data,
      );

      await this.auditLogger.log({
        action: 'REJECT',
        module: 'LeaveManagement',
        resourceType: 'LeaveRequest',
        resourceId: id,
        status: 'SUCCESS',
        userId: (req as any).user.id,
        changes: { remarks: validation.data.remarks },
      });

      return res.status(200).json({
        success: true,
        data: rejectedLeave,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  // ==================== ADMIN SETTINGS ENDPOINTS ====================

  /**
   * Update leave policy
   * PUT /leaves/settings/policy
   */
  async updateLeavePolicy(req: Request, res: Response) {
    try {
      const validation = UpdateLeavePolicySchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          success: false,
          errors: validation.error.errors,
        });
      }

      const repository = new (require('./leave.repository').LeaveRepository)(this.prisma);
      const updatedPolicy = await repository.updateLeavePolicy(validation.data);

      await this.auditLogger.log({
        action: 'UPDATE',
        module: 'LeaveManagement',
        resourceType: 'LeavePolicy',
        resourceId: updatedPolicy.id,
        status: 'SUCCESS',
        userId: (req as any).user.id,
        changes: validation.data,
      });

      return res.status(200).json({
        success: true,
        data: updatedPolicy,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Get leave policy
   * GET /leaves/settings/policy
   */
  async getLeavePolicy(_req: Request, res: Response) {
    try {
      const repository = new (require('./leave.repository').LeaveRepository)(this.prisma);
      const policy = await repository.getLeavePolicy();

      return res.status(200).json({
        success: true,
        data: policy,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
}
