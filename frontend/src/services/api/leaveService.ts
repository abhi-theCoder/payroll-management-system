/**
 * Leave Service
 * Frontend API client for leave management operations
 */

import client from './client';

export interface LeaveType {
  id: string;
  name: string;
  code: string;
  maxPerYear: number;
  carryForward: number;
  isPaid: boolean;
  requiresDocument: boolean;
}

export interface LeaveBalance {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  year: string;
  total: number;
  used: number;
  remaining: number;
  carriedForward: number;
  leaveType?: LeaveType;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  documentUrl?: string;
  createdAt: string;
  updatedAt: string;
  leaveType?: LeaveType;
  approvals?: LeaveApproval[];
}

export interface LeaveApproval {
  id: string;
  leaveRequestId: string;
  level: number;
  approverId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  remarks?: string;
  approvedAt?: string;
  createdAt: string;
}

export interface LeavePolicy {
  id: string;
  companyId: string;
  weekendDays: string[];
  financialYearStart: number;
  financialYearEnd: number;
  lopConfiguration: {
    deductionPercentage: number;
    applicableOnly: string[];
  };
  encashmentRules: {
    allowEncashment: boolean;
    maxEncashableDays: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ApplyLeaveInput {
  leaveTypeId: string;
  fromDate: string;
  toDate: string;
  reason: string;
  documentUrl?: string;
}

export interface ApproveLeaveInput {
  remarks?: string;
}

export interface RejectLeaveInput {
  reason: string;
}

export interface UpdatePolicyInput {
  weekendDays?: string[];
  financialYearStart?: number;
  financialYearEnd?: number;
  lopConfiguration?: {
    deductionPercentage: number;
    applicableOnly: string[];
  };
  encashmentRules?: {
    allowEncashment: boolean;
    maxEncashableDays: number;
  };
}

class LeaveService {
  private basePath = '/api/leaves';

  /**
   * Apply for leave
   */
  async applyLeave(input: ApplyLeaveInput): Promise<LeaveRequest> {
    const response = await client.post(`${this.basePath}/apply`, input);
    return response.data.data;
  }

  /**
   * Get leave history for current employee
   */
  async getLeaveHistory(): Promise<LeaveRequest[]> {
    const response = await client.get(`${this.basePath}/history`);
    return response.data.data || [];
  }

  /**
   * Get leave balance for current employee
   */
  async getLeaveBalance(): Promise<LeaveBalance[]> {
    const response = await client.get(`${this.basePath}/balance`);
    return response.data.data || [];
  }

  /**
   * Cancel leave request
   */
  async cancelLeave(leaveRequestId: string): Promise<LeaveRequest> {
    const response = await client.post(`${this.basePath}/${leaveRequestId}/cancel`);
    return response.data.data;
  }

  /**
   * Get pending leave approvals (Admin/HR only)
   */
  async getPendingLeaves(filters?: {
    employeeId?: string;
    department?: string;
    leaveTypeId?: string;
  }): Promise<LeaveRequest[]> {
    const response = await client.get(`${this.basePath}/pending`, { params: filters });
    return response.data.data || [];
  }

  /**
   * Approve leave request (Admin/HR only)
   */
  async approveLeave(leaveRequestId: string, input: ApproveLeaveInput): Promise<LeaveRequest> {
    const response = await client.post(`${this.basePath}/${leaveRequestId}/approve`, input);
    return response.data.data;
  }

  /**
   * Reject leave request (Admin/HR only)
   */
  async rejectLeave(leaveRequestId: string, input: RejectLeaveInput): Promise<LeaveRequest> {
    const response = await client.post(`${this.basePath}/${leaveRequestId}/reject`, input);
    return response.data.data;
  }

  /**
   * Get leave policy (Admin only)
   */
  async getLeavePolicy(): Promise<LeavePolicy> {
    const response = await client.get(`${this.basePath}/settings/policy`);
    return response.data.data;
  }

  /**
   * Update leave policy (Admin only)
   */
  async updateLeavePolicy(input: UpdatePolicyInput): Promise<LeavePolicy> {
    const response = await client.put(`${this.basePath}/settings/policy`, input);
    return response.data.data;
  }
}

export default new LeaveService();
