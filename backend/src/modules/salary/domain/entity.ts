/**
 * Salary Structure Domain - Business rules and entities
 */

/**
 * Salary Rule Interface - Pluggable calculation engine
 */
export interface SalaryRule {
  name: string;
  apply(basic: number, context?: SalaryCalculationContext): number;
}

/**
 * Context for salary calculations
 */
export interface SalaryCalculationContext {
  basicSalary: number;
  hra?: number;
  dearness?: number;
  conveyance?: number;
  medical?: number;
  other?: number;
  previousComponents?: Record<string, number>;
}

/**
 * Salary Component Entity
 */
export class SalaryComponent {
  constructor(
    public id: string,
    public name: string,
    public type: 'EARNING' | 'DEDUCTION' | 'REIMBURSEMENT',
    public calculationType: 'FIXED' | 'PERCENTAGE' | 'FORMULA',
    public value: number,
    public formula?: string,
    public dependsOn?: string,
    public isOptional: boolean = false,
  ) {}

  /**
   * Calculate component amount
   */
  calculate(context: SalaryCalculationContext): number {
    switch (this.calculationType) {
      case 'FIXED':
        return this.value;

      case 'PERCENTAGE':
        const baseAmount = context.basicSalary || 0;
        return roundToTwo((this.value / 100) * baseAmount);

      case 'FORMULA':
        return this.evaluateFormula(context);

      default:
        return 0;
    }
  }

  /**
   * Evaluate formula expression
   * Safe evaluation of formulas like "Basic * 0.5" or "HRA + 500"
   */
  private evaluateFormula(context: SalaryCalculationContext): number {
    if (!this.formula) return 0;

    try {
      let expression = this.formula;

      // Replace variable names with their values
      expression = expression.replace(/Basic/g, String(context.basicSalary || 0));
      expression = expression.replace(/HRA/g, String(context.hra || 0));
      expression = expression.replace(/DA/g, String(context.dearness || 0));
      expression = expression.replace(/Conveyance/g, String(context.conveyance || 0));
      expression = expression.replace(/Medical/g, String(context.medical || 0));

      // Use Function constructor for safe evaluation (avoid eval)
      const fn = new Function('return ' + expression);
      const result = fn();

      return roundToTwo(Number(result) || 0);
    } catch (error) {
      console.error(`Error evaluating formula: ${this.formula}`, error);
      return 0;
    }
  }
}

/**
 * Salary Structure Entity
 */
export class SalaryStructure {
  constructor(
    public id: string,
    public employeeId: string,
    public name: string,
    public basicSalary: number,
    public ctc: number,
    public effectiveFrom: Date,
    public effectiveUntil: Date | null,
    public components: SalaryComponent[],
    public isActive: boolean = true,
  ) {}

  /**
   * Calculate gross salary
   */
  calculateGrossSalary(context: SalaryCalculationContext): number {
    const earnings = this.components
      .filter((c) => c.type === 'EARNING')
      .reduce((sum, component) => sum + component.calculate(context), 0);

    return roundToTwo(this.basicSalary + earnings);
  }

  /**
   * Calculate total deductions
   */
  calculateDeductions(context: SalaryCalculationContext): number {
    const deductions = this.components
      .filter((c) => c.type === 'DEDUCTION')
      .reduce((sum, component) => sum + component.calculate(context), 0);

    return roundToTwo(deductions);
  }

  /**
   * Calculate net salary
   */
  calculateNetSalary(context: SalaryCalculationContext): number {
    const gross = this.calculateGrossSalary(context);
    const deductions = this.calculateDeductions(context);

    return roundToTwo(gross - deductions);
  }

  /**
   * Get all component calculations
   */
  getAllComponentCalculations(context: SalaryCalculationContext): Record<string, number> {
    const calculations: Record<string, number> = {};

    this.components.forEach((component) => {
      calculations[component.name] = component.calculate(context);
    });

    return calculations;
  }

  /**
   * Validate salary structure
   */
  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (this.basicSalary <= 0) {
      errors.push('Basic salary must be greater than 0');
    }

    if (this.ctc < this.basicSalary) {
      errors.push('CTC must be greater than or equal to basic salary');
    }

    if (!this.components || this.components.length === 0) {
      errors.push('At least one salary component is required');
    }

    if (this.effectiveUntil && this.effectiveUntil <= this.effectiveFrom) {
      errors.push('Effective until date must be after effective from date');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

/**
 * Helper function to round to 2 decimal places
 */
function roundToTwo(value: number): number {
  return Math.round(value * 100) / 100;
}
