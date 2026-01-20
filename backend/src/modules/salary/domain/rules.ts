/**
 * Salary Structure Rules - Domain-specific business rules
 */

/**
 * Rules for salary structure validation and calculation
 */
export const SalaryRules = {
  /**
   * Check if CTC is valid compared to basic salary
   */
  isValidCTC(basicSalary: number, ctc: number): boolean {
    return ctc >= basicSalary;
  },

  /**
   * Calculate HRA based on basic salary (typical formula: 50% in metro, 40% in non-metro)
   */
  calculateHRA(basicSalary: number, isMetroCity: boolean = true): number {
    const percentage = isMetroCity ? 50 : 40;
    return roundToTwo((percentage / 100) * basicSalary);
  },

  /**
   * Calculate DA (Dearness Allowance) based on basic salary
   */
  calculateDA(basicSalary: number, daPercentage: number = 15): number {
    return roundToTwo((daPercentage / 100) * basicSalary);
  },

  /**
   * Check if earnings cover at least 60% of CTC (compliance rule)
   */
  isValidEarningsRatio(grossEarnings: number, ctc: number): boolean {
    const ratio = (grossEarnings / ctc) * 100;
    return ratio >= 60;
  },

  /**
   * Validate deduction limits (deductions should not exceed 50% of gross)
   */
  isValidDeductionLimit(deductions: number, grossSalary: number): boolean {
    const ratio = (deductions / grossSalary) * 100;
    return ratio <= 50;
  },

  /**
   * Calculate take-home based on monthly expenses
   */
  validateMonthlyExpenses(netSalary: number, minimumThreshold: number = 10000): boolean {
    return netSalary >= minimumThreshold;
  },

  /**
   * Check if salary structure is within organization limits
   */
  isWithinOrgLimits(ctc: number, maxAllowedCTC: number = 5000000): boolean {
    return ctc <= maxAllowedCTC;
  },
};

/**
 * Helper function
 */
function roundToTwo(value: number): number {
  return Math.round(value * 100) / 100;
}

export default SalaryRules;
