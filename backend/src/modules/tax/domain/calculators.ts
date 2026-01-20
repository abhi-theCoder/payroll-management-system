/**
 * Tax Calculation Domain - Strategy Pattern
 */

/**
 * Tax calculation strategy interface
 */
export interface TaxCalculationStrategy {
  calculate(grossSalary: number, basicSalary: number): TaxCalculationResult;
}

export interface TaxCalculationResult {
  annualTDS: number;
  monthlyTDS: number;
  taxableIncome: number;
  deductions: number;
}

/**
 * India Tax Strategy (FY 2024-25)
 */
export class IndiaTaxStrategy implements TaxCalculationStrategy {
  private readonly STANDARD_DEDUCTION = 50000;
  private readonly ANNUAL_SALARY_MONTHS = 12;
  private readonly TAX_SLABS = [
    { limit: 250000, rate: 0 },
    { limit: 500000, rate: 0.05 },
    { limit: 1000000, rate: 0.2 },
    { limit: Infinity, rate: 0.3 },
  ];

  calculate(grossSalary: number, _basicSalary: number): TaxCalculationResult {
    const annualSalary = grossSalary * this.ANNUAL_SALARY_MONTHS;

    // Calculate taxable income (annual salary - standard deduction)
    const taxableIncome = Math.max(0, annualSalary - this.STANDARD_DEDUCTION);

    // Calculate tax based on slabs
    let annualTax = 0;

    for (let i = 0; i < this.TAX_SLABS.length - 1; i++) {
      const currentSlab = this.TAX_SLABS[i];
      const nextSlab = this.TAX_SLABS[i + 1];

      if (taxableIncome > currentSlab.limit) {
        const slabAmount = Math.min(taxableIncome, nextSlab.limit) - currentSlab.limit;
        annualTax += slabAmount * currentSlab.rate;
      }
    }

    // Handle highest slab
    const lastSlab = this.TAX_SLABS[this.TAX_SLABS.length - 1];
    if (taxableIncome > lastSlab.limit) {
      annualTax += (taxableIncome - lastSlab.limit) * lastSlab.rate;
    }

    // Add health and education cess (4%)
    const cessAmount = annualTax * 0.04;
    annualTax += cessAmount;

    // Monthly TDS
    const monthlyTDS = Math.round((annualTax / this.ANNUAL_SALARY_MONTHS) * 100) / 100;

    return {
      annualTDS: annualTax,
      monthlyTDS,
      taxableIncome,
      deductions: this.STANDARD_DEDUCTION,
    };
  }
}

/**
 * Exemption Rules Calculator
 */
export class ExemptionCalculator {
  private readonly EXEMPTION_LIMITS: Record<string, number> = {
    '80C': 150000,  // Investments
    '80D': 50000,   // Health insurance (increased to 75000 for senior citizens)
    '80E': 50000,   // Education loan
    '80G': 100000,  // Donations
    '80TTA': 10000, // Savings account interest
  };

  /**
   * Calculate total exemptions
   */
  calculateTotalExemptions(declarations: Record<string, number>): number {
    let totalExemptions = 0;

    for (const [section, amount] of Object.entries(declarations)) {
      const limit = this.EXEMPTION_LIMITS[section] || 0;
      totalExemptions += Math.min(amount, limit);
    }

    return totalExemptions;
  }

  /**
   * Get exemption details for a section
   */
  getExemptionDetail(section: string, amount: number): { claimed: number; limit: number; allowed: number } {
    const limit = this.EXEMPTION_LIMITS[section] || 0;
    const allowed = Math.min(amount, limit);

    return {
      claimed: amount,
      limit,
      allowed,
    };
  }

  /**
   * Calculate tax savings from exemptions
   */
  calculateTaxSavings(exemptionAmount: number, taxRate: number): number {
    return exemptionAmount * taxRate;
  }
}

/**
 * Annual Tax Projection Calculator
 */
export class AnnualTaxProjection {
  constructor(
    private strategy: TaxCalculationStrategy,
    private exemptionCalculator: ExemptionCalculator,
  ) {}

  /**
   * Project annual tax based on current month's salary and exemptions
   */
  projectAnnualTax(
    monthlyGrossSalary: number,
    monthlyBasic: number,
    exemptions: Record<string, number>,
    monthsWorked: number = 12,
  ): {
    projectedGrossSalary: number;
    projectedTaxableIncome: number;
    projectedTax: number;
    projectedMonthlyTDS: number;
    taxSavingFromExemptions: number;
  } {
    const projectedGrossSalary = monthlyGrossSalary * monthsWorked;
    const result = this.strategy.calculate(monthlyGrossSalary, monthlyBasic);
    const totalExemptions = this.exemptionCalculator.calculateTotalExemptions(exemptions);

    // Average tax rate (simplified: using higher slab rate for calculation)
    const averageTaxRate = 0.2;
    const taxSavingFromExemptions = this.exemptionCalculator.calculateTaxSavings(totalExemptions, averageTaxRate);

    return {
      projectedGrossSalary,
      projectedTaxableIncome: result.taxableIncome - totalExemptions,
      projectedTax: result.annualTDS - taxSavingFromExemptions,
      projectedMonthlyTDS: (result.annualTDS - taxSavingFromExemptions) / monthsWorked,
      taxSavingFromExemptions,
    };
  }
}

export default {
  IndiaTaxStrategy,
  ExemptionCalculator,
  AnnualTaxProjection,
};
