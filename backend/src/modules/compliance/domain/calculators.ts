// import { ComplianceCalculation } from '../dto';

/**
 * Compliance Calculator Interface
 */
export interface ComplianceCalculator {
  calculate(grossSalary: number, basicSalary: number): number;
  getName(): string;
}

/**
 * PF (Provident Fund) Calculator
 * Employee contribution: 12% of basic salary
 * Employer contribution: 12% of basic salary
 * Max exemption limit: Rs. 15000 per month
 */
export class PFCalculator implements ComplianceCalculator {
  private readonly EMPLOYEE_CONTRIBUTION_RATE = 0.12;
  private readonly MAX_SALARY_LIMIT = 250000; // Annual basic salary limit

  calculate(grossSalary: number, _basicSalary: number): number {
    const applicableSalary = Math.min(grossSalary, this.MAX_SALARY_LIMIT / 12);
    return Math.round(applicableSalary * this.EMPLOYEE_CONTRIBUTION_RATE * 100) / 100;
  }

  getName(): string {
    return 'Provident Fund (PF)';
  }
}

/**
 * ESI (Employee State Insurance) Calculator
 * Applicable if monthly salary < Rs. 21000 (threshold may vary by state)
 * Employee contribution: 0.75% of gross salary
 * Employer contribution: 3.25% of gross salary
 */
export class ESICalculator implements ComplianceCalculator {
  private readonly EMPLOYEE_CONTRIBUTION_RATE = 0.0075;
  private readonly SALARY_LIMIT = 21000;

  calculate(grossSalary: number, _basicSalary: number): number {
    if (grossSalary > this.SALARY_LIMIT) {
      return 0;
    }
    return Math.round(grossSalary * this.EMPLOYEE_CONTRIBUTION_RATE * 100) / 100;
  }

  getName(): string {
    return 'Employee State Insurance (ESI)';
  }
}

/**
 * Professional Tax (PT) Calculator
 * Varies by state and salary slab
 * For demonstration: Progressive slab-based calculation
 */
export class PTCalculator implements ComplianceCalculator {
  private readonly SALARY_SLABS = [
    { limit: 10000, tax: 0 },
    { limit: 20000, tax: 50 },
    { limit: 30000, tax: 100 },
    { limit: 50000, tax: 150 },
    { limit: 100000, tax: 200 },
    { limit: Infinity, tax: 300 },
  ];

  calculate(grossSalary: number, _basicSalary: number): number {
    for (const slab of this.SALARY_SLABS) {
      if (grossSalary <= slab.limit) {
        return slab.tax;
      }
    }
    return this.SALARY_SLABS[this.SALARY_SLABS.length - 1].tax;
  }

  getName(): string {
    return 'Professional Tax (PT)';
  }
}

/**
 * TDS (Tax Deducted at Source) Calculator
 * Simplified calculation based on annual income
 * Uses India tax slabs: FY 2024-25
 */
export class TDSCalculator implements ComplianceCalculator {
  private readonly ANNUAL_SALARY_MONTHS = 12;
  private readonly TAX_SLABS = [
    { limit: 250000, rate: 0 },
    { limit: 500000, rate: 0.05 },
    { limit: 1000000, rate: 0.2 },
    { limit: Infinity, rate: 0.3 },
  ];

  calculate(grossSalary: number, _basicSalary: number): number {
    const annualSalary = grossSalary * this.ANNUAL_SALARY_MONTHS;
    const taxableIncome = Math.max(0, annualSalary - 250000); // Standard deduction

    let annualTax = 0;

    for (let i = 0; i < this.TAX_SLABS.length - 1; i++) {
      const slab = this.TAX_SLABS[i];
      const nextSlab = this.TAX_SLABS[i + 1];

      if (taxableIncome > slab.limit) {
        const slabAmount = Math.min(taxableIncome, nextSlab.limit) - slab.limit;
        annualTax += slabAmount * slab.rate;
      }
    }

    // Handle the highest slab
    const lastSlab = this.TAX_SLABS[this.TAX_SLABS.length - 1];
    if (taxableIncome > lastSlab.limit) {
      annualTax += (taxableIncome - lastSlab.limit) * lastSlab.rate;
    }

    // Monthly TDS (approximately)
    const monthlyTDS = Math.round((annualTax / this.ANNUAL_SALARY_MONTHS) * 100) / 100;

    return monthlyTDS;
  }

  getName(): string {
    return 'Tax Deducted at Source (TDS)';
  }
}

/**
 * Compliance Calculator Factory
 */
export class ComplianceCalculatorFactory {
  private static calculators: Map<string, ComplianceCalculator> = new Map<string, ComplianceCalculator>([
    ['PF', new PFCalculator()],
    ['ESI', new ESICalculator()],
    ['PT', new PTCalculator()],
    ['TDS', new TDSCalculator()],
  ] as any);

  static getCalculator(type: string): ComplianceCalculator {
    const calculator = this.calculators.get(type.toUpperCase());
    if (!calculator) {
      throw new Error(`Unsupported compliance type: ${type}`);
    }
    return calculator;
  }

  static getAllCalculators(): Map<string, ComplianceCalculator> {
    return this.calculators;
  }
}

export default ComplianceCalculatorFactory;
