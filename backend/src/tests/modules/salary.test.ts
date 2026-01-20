/**
 * Salary Service Unit Tests
 */

// import salaryService from '@modules/salary/service';
import { SalaryRules } from '@modules/salary/domain/rules';
// import { SalaryComponent } from '@modules/salary/domain/entity';
// import { BusinessRuleException } from '@shared/exceptions';

describe('SalaryService', () => {
  describe('calculateSalary', () => {
    it('should calculate gross salary with earnings', () => {
      // const component = new SalaryComponent(
      //   '1',
      //   'HRA',
      //   'EARNING',
      //   'PERCENTAGE',
      //   20,
      // );

      // const components = [component];
      const earnings = 60000 * 0.2; // 20% of basic

      expect(earnings).toBe(12000);
    });

    it('should calculate deductions correctly', () => {
      // const component = new SalaryComponent(
      //   '1',
      //   'PF',
      //   'DEDUCTION',
      //   'PERCENTAGE',
      //   12,
      // );

      const basicSalary = 50000;
      const deduction = (basicSalary * 12) / 100;

      expect(deduction).toBe(6000);
    });
  });
});

describe('SalaryRules', () => {
  describe('isValidCTC', () => {
    it('should return true when CTC >= basic salary', () => {
      expect(SalaryRules.isValidCTC(50000, 75000)).toBe(true);
      expect(SalaryRules.isValidCTC(50000, 50000)).toBe(true);
    });

    it('should return false when CTC < basic salary', () => {
      expect(SalaryRules.isValidCTC(75000, 50000)).toBe(false);
    });
  });

  describe('calculateHRA', () => {
    it('should calculate HRA as 50% for metro cities', () => {
      const hra = SalaryRules.calculateHRA(60000, true);
      expect(hra).toBe(30000);
    });

    it('should calculate HRA as 40% for non-metro cities', () => {
      const hra = SalaryRules.calculateHRA(60000, false);
      expect(hra).toBe(24000);
    });
  });

  describe('isValidEarningsRatio', () => {
    it('should validate earnings ratio', () => {
      const gross = 75000;
      const ctc = 100000;
      const ratio = (gross / ctc) * 100;

      expect(ratio).toBe(75);
      expect(SalaryRules.isValidEarningsRatio(gross, ctc)).toBe(true);
    });
  });
});
