/**
 * Leave Management DTOs
 * Data Transfer Objects for Leave Module
 */

// ==================== LEAVE TYPE DTOs ====================

export class LeaveTypeDto {
  id: string;
  name: string;
  code: string;
  description?: string;
  maxPerYear: number;
  carryForward: number;
  isCarryForwardAllowed: boolean;
  isPaid: boolean;
  requiresDocument: boolean;
  active: boolean;
}

export class CreateLeaveTypeRequest {
  name: string;
  code: string;
  description?: string;
  maxPerYear: number;
  carryForward: number;
  isCarryForwardAllowed?: boolean;
  isPaid?: boolean;
  requiresDocument?: boolean;
}

// ==================== LEAVE REQUEST DTOs ====================

export class ApplyLeaveRequest {
  leaveTypeId: string;
  fromDate: Date;
  toDate: Date;
  reason: string;
  documentUrl?: string;
}

export class LeaveRequestDto {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  fromDate: Date;
  toDate: Date;
  days: number;
  reason: string;
  documentUrl?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
}

// ==================== LEAVE APPROVAL DTOs ====================

export class ApproveLeaveRequest {
  leaveRequestId: string;
  remarks?: string;
}

export class RejectLeaveRequest {
  leaveRequestId: string;
  remarks: string;
}

export class LeaveApprovalDto {
  id: string;
  leaveRequestId: string;
  approverId: string;
  level: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  remarks?: string;
  approvedAt?: Date;
}

// ==================== LEAVE BALANCE DTOs ====================

export class LeaveBalanceDto {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  year: number;
  total: number;
  used: number;
  balance: number;
  carriedForward: number;
}

// ==================== LEAVE POLICY DTOs ====================

export class LeavePolicyDto {
  id: string;
  policyName: string;
  companyName: string;
  financialYearStart: number;
  financialYearEnd: number;
  weekendDays: string[];
  holidayIds: string[];
  lopConfiguration: Record<string, any>;
  encashmentRules: Record<string, any>;
  active: boolean;
}

export class UpdateLeavePolicyRequest {
  policyName?: string;
  companyName?: string;
  financialYearStart?: number;
  financialYearEnd?: number;
  weekendDays?: string[];
  holidayIds?: string[];
  lopConfiguration?: Record<string, any>;
  encashmentRules?: Record<string, any>;
}

// ==================== LEAVE APPROVAL GROUP DTOs ====================

export class LeaveApprovalGroupDto {
  id: string;
  department: string;
  approvalLevels: number;
  approverIds: string[];
  escalationDays: number;
  active: boolean;
}

export class UpdateLeaveApprovalGroupRequest {
  department?: string;
  approvalLevels?: number;
  approverIds?: string[];
  escalationDays?: number;
}

// ==================== RESPONSE DTOs ====================

export class LeaveBalanceResponseDto {
  employeeId: string;
  leaveTypes: Array<{
    leaveTypeId: string;
    leaveTypeName: string;
    total: number;
    used: number;
    balance: number;
    carriedForward: number;
  }>;
}

export class PendingLeaveResponseDto {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: string;
  fromDate: Date;
  toDate: Date;
  days: number;
  reason: string;
  status: string;
  appliedAt: Date;
  approvalStatus: Array<{
    level: number;
    approverId: string;
    approverName: string;
    status: string;
  }>;
}
