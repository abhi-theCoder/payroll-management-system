/**
 * Leave Policy Rules
 * Business logic for leave management policies
 */

import { LeaveRequestEntity, LeaveBalanceEntity } from './leave.entity';

export class LeaveValidationRules {
  /**
   * Check if dates overlap with existing approved leaves
   */
  static checkLeaveOverlap(
    newFromDate: Date,
    newToDate: Date,
    existingLeaves: Array<{ fromDate: Date; toDate: Date }>,
  ): boolean {
    return existingLeaves.some((leave) => {
      // Check if new leave overlaps with existing leave
      return newFromDate <= leave.toDate && newToDate >= leave.fromDate;
    });
  }

  /**
   * Calculate leave days excluding weekends
   */
  static calculateLeaveDays(
    fromDate: Date,
    toDate: Date,
    weekendDays: string[] = ['SATURDAY', 'SUNDAY'],
  ): number {
    let days = 0;
    let current = new Date(fromDate);

    while (current <= toDate) {
      const dayName = current.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
      if (!weekendDays.includes(dayName)) {
        days++;
      }
      current.setDate(current.getDate() + 1);
    }

    return days;
  }

  /**
   * Calculate leave days excluding holidays
   */
  static calculateLeaveDaysExcludingHolidays(
    fromDate: Date,
    toDate: Date,
    holidays: Date[] = [],
    weekendDays: string[] = ['SATURDAY', 'SUNDAY'],
  ): number {
    let days = 0;
    let current = new Date(fromDate);

    while (current <= toDate) {
      const dayName = current.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
      const isHoliday = holidays.some(
        (holiday) =>
          holiday.toDateString() === current.toDateString(),
      );

      if (!weekendDays.includes(dayName) && !isHoliday) {
        days++;
      }
      current.setDate(current.getDate() + 1);
    }

    return days;
  }

  /**
   * Validate leave request
   */
  static validateLeaveRequest(
    leaveRequest: LeaveRequestEntity,
    leaveBalance: LeaveBalanceEntity,
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate date range
    if (!leaveRequest.isValidDateRange()) {
      errors.push('From date must be before or equal to to date');
    }

    // Validate balance
    if (!leaveBalance.hasSufficientBalance(leaveRequest.days)) {
      errors.push(
        `Insufficient leave balance. Required: ${leaveRequest.days}, Available: ${leaveBalance.balance}`,
      );
    }

    // Validate reason
    if (!leaveRequest.reason || leaveRequest.reason.trim().length === 0) {
      errors.push('Reason is required');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Check if leave can be cancelled
   */
  static canCancelLeave(status: string, daysUntilLeave: number): boolean {
    // Cannot cancel if already started or less than 2 days notice
    if (daysUntilLeave <= 1) {
      return false;
    }
    return status === 'APPROVED';
  }
}

export class LeaveApprovalRules {
  /**
   * Get next approval level
   */
  static getNextApprovalLevel(currentLevel: number, totalLevels: number): number | null {
    if (currentLevel >= totalLevels) {
      return null;
    }
    return currentLevel + 1;
  }

  /**
   * Check if approval is complete (all levels approved)
   */
  static isApprovalComplete(
    approvals: Array<{ level: number; status: string }>,
    totalLevels: number,
  ): boolean {
    if (approvals.length !== totalLevels) {
      return false;
    }
    return approvals.every((approval) => approval.status === 'APPROVED');
  }

  /**
   * Check if approval is rejected at any level
   */
  static isRejected(approvals: Array<{ status: string }>): boolean {
    return approvals.some((approval) => approval.status === 'REJECTED');
  }

  /**
   * Calculate escalation status
   */
  static shouldEscalate(
    createdAt: Date,
    escalationDays: number,
    currentApprovalStatus: string,
  ): boolean {
    if (currentApprovalStatus !== 'PENDING') {
      return false;
    }

    const now = new Date();
    const daysPassed = Math.floor(
      (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24),
    );

    return daysPassed >= escalationDays;
  }
}

export class LeaveLOPRules {
  /**
   * Calculate salary deduction for LOP
   */
  static calculateLOPDeduction(
    totalDays: number,
    basicSalary: number,
  ): number {
    const salaryPerDay = basicSalary / 26; // Assuming 26 working days
    return totalDays * salaryPerDay;
  }

  /**
   * Check if LOP (Leave Without Pay) applies
   */
  static shouldApplyLOP(leaveTypeCode: string): boolean {
    return leaveTypeCode === 'LOP' || leaveTypeCode === 'UNPAID';
  }
}

export class LeaveCarryForwardRules {
  /**
   * Calculate carry forward balance
   */
  static calculateCarryForward(
    unusedBalance: number,
    carryForwardLimit: number,
    allowCarryForward: boolean,
  ): { carryForward: number; forfeited: number } {
    if (!allowCarryForward) {
      return { carryForward: 0, forfeited: unusedBalance };
    }

    const carryForward = Math.min(unusedBalance, carryForwardLimit);
    const forfeited = unusedBalance - carryForward;

    return { carryForward, forfeited };
  }
}
