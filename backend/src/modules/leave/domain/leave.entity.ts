/**
 * Leave Entity
 * Core leave request entity with validation
 */

export class LeaveRequestEntity {
  constructor(
    public id: string,
    public employeeId: string,
    public leaveTypeId: string,
    public fromDate: Date,
    public toDate: Date,
    public days: number,
    public reason: string,
    public status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED',
    public createdAt: Date,
    public updatedAt: Date,
    public documentUrl?: string,
  ) {}

  /**
   * Check if leave dates are valid
   */
  isValidDateRange(): boolean {
    return this.fromDate <= this.toDate;
  }

  /**
   * Check if leave request can be cancelled
   */
  canBeCancelled(): boolean {
    return this.status === 'PENDING' || this.status === 'APPROVED';
  }

  /**
   * Check if leave request can be modified
   */
  canBeModified(): boolean {
    return this.status === 'PENDING';
  }
}

export class LeaveBalanceEntity {
  constructor(
    public id: string,
    public employeeId: string,
    public leaveTypeId: string,
    public year: number,
    public total: number,
    public used: number,
    public balance: number,
    public carriedForward: number = 0,
  ) {}

  /**
   * Check if sufficient balance exists
   */
  hasSufficientBalance(requiredDays: number): boolean {
    return this.balance >= requiredDays;
  }

  /**
   * Calculate remaining balance after using leave
   */
  deductLeave(days: number): number {
    if (!this.hasSufficientBalance(days)) {
      throw new Error('Insufficient leave balance');
    }
    this.used += days;
    this.balance -= days;
    return this.balance;
  }

  /**
   * Add leave back (for cancellation)
   */
  addLeaveBack(days: number): number {
    this.used -= days;
    this.balance += days;
    return this.balance;
  }
}

export class LeaveTypeEntity {
  constructor(
    public id: string,
    public name: string,
    public code: string,
    public maxPerYear: number,
    public carryForward: number,
    public isCarryForwardAllowed: boolean,
    public isPaid: boolean,
    public requiresDocument: boolean,
    public active: boolean,
  ) {}

  /**
   * Check if this is a paid leave type
   */
  isPaidLeave(): boolean {
    return this.isPaid;
  }

  /**
   * Check if documentation is required
   */
  requiresDocumentation(): boolean {
    return this.requiresDocument;
  }
}
