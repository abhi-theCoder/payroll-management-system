/**
 * Payroll Domain - Business logic for payroll processing
 */

/**
 * Payroll Run Entity - Represents an entire payroll processing cycle
 */
export class PayrollRun {
  constructor(
    public id: string,
    public month: number,
    public year: number,
    public startDate: Date,
    public endDate: Date,
    public status: 'DRAFT' | 'PROCESSING' | 'PROCESSED' | 'LOCKED' | 'REJECTED' = 'DRAFT',
    public processedAt?: Date,
    public lockedAt?: Date,
    public rejectionReason?: string,
  ) {}

  /**
   * Can payroll be locked?
   */
  canLock(): boolean {
    return this.status === 'PROCESSED';
  }

  /**
   * Can payroll be modified?
   */
  canModify(): boolean {
    return this.status === 'DRAFT' || this.status === 'PROCESSING';
  }

  /**
   * Lock the payroll
   */
  lock(): void {
    if (!this.canLock()) {
      throw new Error(`Cannot lock payroll with status: ${this.status}`);
    }
    this.status = 'LOCKED';
    this.lockedAt = new Date();
  }

  /**
   * Mark as processed
   */
  markAsProcessed(): void {
    if (this.status !== 'PROCESSING') {
      throw new Error(`Cannot mark as processed. Current status: ${this.status}`);
    }
    this.status = 'PROCESSED';
    this.processedAt = new Date();
  }

  /**
   * Reject payroll
   */
  reject(reason: string): void {
    if (!this.canModify()) {
      throw new Error('Cannot reject locked payroll');
    }
    this.status = 'REJECTED';
    this.rejectionReason = reason;
  }
}

/**
 * Attendance Calculator
 */
export class AttendanceCalculator {
  /**
   * Calculate salary based on attendance
   */
  static calculateProportionalSalary(
    basicSalary: number,
    daysWorked: number,
    totalDaysInMonth: number = 30,
  ): number {
    return (basicSalary / totalDaysInMonth) * daysWorked;
  }

  /**
   * Get working days in month (considering weekends)
   */
  static getWorkingDaysInMonth(month: number, year: number): number {
    // const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    let workingDays = 0;

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month - 1, day);
      const dayOfWeek = date.getDay();

      // 0 = Sunday, 6 = Saturday
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        workingDays++;
      }
    }

    return workingDays;
  }
}

/**
 * Payroll Validation Rules
 */
export const PayrollValidationRules = {
  /**
   * Validate attendance data
   */
  validateAttendance(
    daysWorked: number,
    daysPresent: number,
    daysAbsent: number,
    daysLeave: number,
    totalWorkingDays: number,
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (daysWorked < 0) errors.push('Days worked cannot be negative');
    if (daysPresent < 0) errors.push('Days present cannot be negative');
    if (daysAbsent < 0) errors.push('Days absent cannot be negative');
    if (daysLeave < 0) errors.push('Days leave cannot be negative');

    const totalDays = daysPresent + daysAbsent + daysLeave;
    if (totalDays > totalWorkingDays) {
      errors.push(
        `Total attendance days (${totalDays}) cannot exceed working days (${totalWorkingDays})`,
      );
    }

    if (daysWorked > totalWorkingDays) {
      errors.push(`Days worked (${daysWorked}) cannot exceed total working days (${totalWorkingDays})`);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  /**
   * Validate salary calculations
   */
  validateSalaryCalculation(
    basicSalary: number,
    earnings: number,
    deductions: number,
    grossSalary: number,
    netSalary: number,
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (basicSalary <= 0) errors.push('Basic salary must be greater than 0');
    if (earnings < 0) errors.push('Earnings cannot be negative');
    if (deductions < 0) errors.push('Deductions cannot be negative');

    const expectedGross = basicSalary + earnings;
    const allowedDifference = 0.5; // Allow 50 paise difference due to rounding

    if (Math.abs(grossSalary - expectedGross) > allowedDifference) {
      errors.push(`Gross salary mismatch. Expected: ${expectedGross}, Got: ${grossSalary}`);
    }

    const expectedNet = grossSalary - deductions;
    if (Math.abs(netSalary - expectedNet) > allowedDifference) {
      errors.push(`Net salary mismatch. Expected: ${expectedNet}, Got: ${netSalary}`);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  /**
   * Ensure payroll is not processed multiple times (idempotency check)
   */
  isIdempotentSafe(existingPayroll: any): boolean {
    return !existingPayroll || existingPayroll.status === 'DRAFT' || existingPayroll.status === 'REJECTED';
  },
};

export default {
  PayrollRun,
  AttendanceCalculator,
  PayrollValidationRules,
};
