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
  CreateLeaveTypeSchema,
  UpdateLeavePolicySchema,
} from './leave.validator';
import { PrismaClient } from '@prisma/client';
import { AuditLogger } from '@shared/utils/audit';

export class LeaveController {
  private leaveService: LeaveService;

  constructor(
    private prisma: PrismaClient,
    private auditLogger: AuditLogger,
  ) {
    this.leaveService = new LeaveService(prisma);
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

      const employeeId = (req as any).user.employeeId;
      const leaveRequest = await this.leaveService.applyLeave(
        employeeId,
        validation.data,
      );

      await this.auditLogger.log({
        action: 'CREATE',
        entity: 'LeaveRequest',
        entityId: leaveRequest.id,
        userId: (req as any).user.id,
        changes: {
          status: 'PENDING',
          days: leaveRequest.days,
        },
      });

      res.status(201).json({
        success: true,
        data: leaveRequest,
      });
    } catch (error: any) {
      res.status(400).json({
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
      const employeeId = (req as any).user.employeeId;
      const history = await this.leaveService.getLeaveHistory(employeeId);

      res.status(200).json({
        success: true,
        data: history,
      });
    } catch (error: any) {
      res.status(400).json({
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
      const employeeId = (req as any).user.employeeId;
      const balance = await this.leaveService.getLeaveBalance(employeeId);

      res.status(200).json({
        success: true,
        data: balance,
      });
    } catch (error: any) {
      res.status(400).json({
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
      const employeeId = (req as any).user.employeeId;
      const cancelledLeave = await this.leaveService.cancelLeave(id, employeeId);

      await this.auditLogger.log({
        action: 'CANCEL',
        entity: 'LeaveRequest',
        entityId: id,
        userId: (req as any).user.id,
      });

      res.status(200).json({
        success: true,
        data: cancelledLeave,
      });
    } catch (error: any) {
      res.status(400).json({
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

      res.status(200).json({
        success: true,
        data: pending,
      });
    } catch (error: any) {
      res.status(400).json({
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
        entity: 'LeaveRequest',
        entityId: id,
        userId: (req as any).user.id,
        changes: { remarks: validation.data.remarks },
      });

      res.status(200).json({
        success: true,
        data: approvedLeave,
      });
    } catch (error: any) {
      res.status(400).json({
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
        entity: 'LeaveRequest',
        entityId: id,
        userId: (req as any).user.id,
        changes: { remarks: validation.data.remarks },
      });

      res.status(200).json({
        success: true,
        data: rejectedLeave,
      });
    } catch (error: any) {
      res.status(400).json({
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
        entity: 'LeavePolicy',
        entityId: updatedPolicy.id,
        userId: (req as any).user.id,
        changes: validation.data,
      });

      res.status(200).json({
        success: true,
        data: updatedPolicy,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Get leave policy
   * GET /leaves/settings/policy
   */
  async getLeavePolicy(req: Request, res: Response) {
    try {
      const repository = new (require('./leave.repository').LeaveRepository)(this.prisma);
      const policy = await repository.getLeavePolicy();

      res.status(200).json({
        success: true,
        data: policy,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
}
