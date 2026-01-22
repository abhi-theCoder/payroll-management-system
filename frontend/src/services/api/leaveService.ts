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
  private basePath = '/leave';
  private groupPath = '/leave-groups';

  /**
   * Apply for leave
   */
  async applyLeave(input: ApplyLeaveInput): Promise<LeaveRequest> {
    const response = await client.post(`${this.basePath}/apply`, input);
    return (response.data as any).data;
  }

  /**
   * Get leave history for current employee
   */
  async getLeaveHistory(): Promise<LeaveRequest[]> {
    const response = await client.get<LeaveRequest[]>(`${this.basePath}/history`);
    return (response.data as any).data || [];
  }

  /**
   * Get leave balance for current employee
   */
  async getLeaveBalance(): Promise<LeaveBalance[]> {
    const response = await client.get<LeaveBalance[]>(`${this.basePath}/balance`);
    return (response.data as any).data || [];
  }

  /**
   * Get all active leave types
   */
  async getLeaveTypes(): Promise<LeaveType[]> {
    const response = await client.get<LeaveType[]>(`${this.basePath}/types`);
    return (response.data as any).data || [];
  }

  /**
   * Cancel leave request
   */
  async cancelLeave(leaveRequestId: string): Promise<LeaveRequest> {
    const response = await client.post(`${this.basePath}/${leaveRequestId}/cancel`);
    return (response.data as any).data;
  }

  /**
   * Get pending leave approvals (Admin/HR only)
   */
  async getPendingLeaves(filters?: {
    employeeId?: string;
    department?: string;
    leaveTypeId?: string;
  }): Promise<LeaveRequest[]> {
    const response = await client.get<LeaveRequest[]>(`${this.basePath}/pending`, { params: filters });
    return (response.data as any).data || [];
  }

  /**
   * Approve leave request (Admin/HR only)
   */
  async approveLeave(leaveRequestId: string, input: ApproveLeaveInput): Promise<LeaveRequest> {
    const response = await client.post(`${this.basePath}/${leaveRequestId}/approve`, input);
    return (response.data as any).data;
  }

  /**
   * Reject leave request (Admin/HR only)
   */
  async rejectLeave(leaveRequestId: string, input: RejectLeaveInput): Promise<LeaveRequest> {
    const response = await client.post(`${this.basePath}/${leaveRequestId}/reject`, input);
    return (response.data as any).data;
  }

  /**
   * Get leave policy (Admin only)
   */
  async getLeavePolicy(): Promise<LeavePolicy> {
    const response = await client.get(`${this.basePath}/settings/policy`);
    return (response.data as any).data;
  }

  /**
   * Update leave policy (Admin only)
   */
  async updateLeavePolicy(input: UpdatePolicyInput): Promise<LeavePolicy> {
    const response = await client.put(`${this.basePath}/settings/policy`, input);
    return (response.data as any).data;
  }

  /**
   * Get all leave groups
   */
  async getLeaveGroups(): Promise<any[]> {
    const response = await client.get<any[]>(this.groupPath);
    return (response.data as any).data || [];
  }

  /**
   * Create a new leave group
   */
  async createLeaveGroup(data: { name: string; description?: string }): Promise<any> {
    const response = await client.post(this.groupPath, data);
    return response.data;
  }

  /**
   * Assign a reviewer to a group
   */
  async assignReviewer(data: { leaveGroupId: string; reviewerId: string; level: number }): Promise<any> {
    const response = await client.post(`${this.groupPath}/assign-reviewer`, data);
    return response.data;
  }

  /**
   * Assign staff member to group
   */
  async assignStaff(data: { employeeId: string; leaveGroupId: string }): Promise<any> {
    if (data.leaveGroupId) {
      // Check if group has reviewers (this will also be validated on backend)
      const groups = await this.getLeaveGroups();
      const targetGroup = groups.find((g: any) => g.id === data.leaveGroupId);
      if (targetGroup && (!targetGroup.reviewers || targetGroup.reviewers.length === 0)) {
        throw new Error('At least one reviewer must be assigned to the group before adding staff members.');
      }
    }
    const response = await client.post(`${this.groupPath}/assign-staff`, data);
    return response.data;
  }

  /**
   * Get staff listing with group info
   */
  async getStaffListing(): Promise<any[]> {
    const response = await client.get<any[]>(`${this.groupPath}/staff/listing`);
    return response.data || [];
  }

  /**
   * Get eligible reviewers based on roles
   */
  async getEligibleReviewers(): Promise<any[]> {
    const response = await client.get<any[]>(`${this.groupPath}/reviewers/eligible`);
    return response.data || [];
  }


}

export default new LeaveService();
