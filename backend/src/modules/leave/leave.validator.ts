/**
 * Leave Validator
 * Input validation for leave operations
 */

import { z } from 'zod';

// ==================== LEAVE REQUEST VALIDATION ====================

export const ApplyLeaveSchema = z.object({
  leaveTypeId: z.string().min(1, 'Leave type is required'),
  fromDate: z.string().datetime('Invalid date format'),
  toDate: z.string().datetime('Invalid date format'),
  reason: z.string().min(5, 'Reason must be at least 5 characters'),
  documentUrl: z.string().url('Invalid document URL').optional(),
}).refine(
  (data) => new Date(data.fromDate) <= new Date(data.toDate),
  {
    message: 'From date must be before or equal to to date',
    path: ['fromDate'],
  },
);

export const ApproveLeaveSchema = z.object({
  leaveRequestId: z.string().min(1, 'Leave request ID is required'),
  remarks: z.string().optional(),
});

export const RejectLeaveSchema = z.object({
  leaveRequestId: z.string().min(1, 'Leave request ID is required'),
  remarks: z.string().min(5, 'Rejection reason must be at least 5 characters'),
});

// ==================== LEAVE TYPE VALIDATION ====================

export const CreateLeaveTypeSchema = z.object({
  name: z.string().min(1, 'Leave type name is required'),
  code: z.string().min(1, 'Leave type code is required').max(20),
  description: z.string().optional(),
  maxPerYear: z.number().min(0, 'Max per year must be positive'),
  carryForward: z.number().min(0, 'Carry forward must be non-negative'),
  isCarryForwardAllowed: z.boolean().optional().default(true),
  isPaid: z.boolean().optional().default(true),
  requiresDocument: z.boolean().optional().default(false),
});

// ==================== LEAVE POLICY VALIDATION ====================

export const UpdateLeavePolicySchema = z.object({
  policyName: z.string().optional(),
  companyName: z.string().optional(),
  financialYearStart: z.number().min(1).max(12).optional(),
  financialYearEnd: z.number().min(1).max(12).optional(),
  weekendDays: z.array(z.string()).optional(),
  holidayIds: z.array(z.string()).optional(),
  lopConfiguration: z.record(z.any()).optional(),
  encashmentRules: z.record(z.any()).optional(),
}).refine(
  (data) => {
    if (data.financialYearStart && data.financialYearEnd) {
      return data.financialYearStart <= data.financialYearEnd;
    }
    return true;
  },
  {
    message: 'Financial year start must be before or equal to end',
    path: ['financialYearStart'],
  },
);

// ==================== LEAVE APPROVAL GROUP VALIDATION ====================

export const UpdateLeaveApprovalGroupSchema = z.object({
  department: z.string().optional(),
  approvalLevels: z.number().min(1).max(5).optional(),
  approverIds: z.array(z.string()).optional(),
  escalationDays: z.number().min(1).optional(),
});

// ==================== TYPE EXPORTS ====================

export type ApplyLeaveInput = z.infer<typeof ApplyLeaveSchema>;
export type ApproveLeaveInput = z.infer<typeof ApproveLeaveSchema>;
export type RejectLeaveInput = z.infer<typeof RejectLeaveSchema>;
export type CreateLeaveTypeInput = z.infer<typeof CreateLeaveTypeSchema>;
export type UpdateLeavePolicyInput = z.infer<typeof UpdateLeavePolicySchema>;
export type UpdateLeaveApprovalGroupInput = z.infer<typeof UpdateLeaveApprovalGroupSchema>;
