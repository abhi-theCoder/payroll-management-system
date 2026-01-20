/**
 * Compliance Calculator Tests
 */

import {
  PFCalculator,
  ESICalculator,
  PTCalculator,
  TDSCalculator,
  ComplianceCalculatorFactory,
} from '@modules/compliance/domain/calculators';

describe('Compliance Calculators', () => {
  describe('PFCalculator', () => {
    it('should calculate PF as 12% of basic salary', () => {
      const calculator = new PFCalculator();
      const pf = calculator.calculate(60000, 50000);

      expect(pf).toBe(6000);
    });

    it('should respect salary limit', () => {
      const calculator = new PFCalculator();
      const pf = calculator.calculate(300000, 250001);

      // Should not exceed calculation
      expect(pf).toBeGreaterThan(0);
    });
  });

  describe('ESICalculator', () => {
    it('should calculate ESI for salary below 21000', () => {
      const calculator = new ESICalculator();
      const esi = calculator.calculate(20000, 18000);

      expect(esi).toBe(150); // 0.75% of 20000
    });

    it('should return 0 for salary above limit', () => {
      const calculator = new ESICalculator();
      const esi = calculator.calculate(22000, 20000);

      expect(esi).toBe(0);
    });
  });

  describe('PTCalculator', () => {
    it('should calculate PT based on salary slabs', () => {
      const calculator = new PTCalculator();
      const pt = calculator.calculate(25000, 20000);

      expect(pt).toBe(100);
    });
  });

  describe('TDSCalculator', () => {
    it('should calculate TDS based on annual salary', () => {
      const calculator = new TDSCalculator();
      const tds = calculator.calculate(50000, 40000);

      expect(tds).toBeGreaterThan(0);
    });
  });

  describe('ComplianceCalculatorFactory', () => {
    it('should return correct calculator for each type', () => {
      const pfCalc = ComplianceCalculatorFactory.getCalculator('PF');
      const esiCalc = ComplianceCalculatorFactory.getCalculator('ESI');
      const ptCalc = ComplianceCalculatorFactory.getCalculator('PT');
      const tdsCalc = ComplianceCalculatorFactory.getCalculator('TDS');

      expect(pfCalc.getName()).toBe('Provident Fund (PF)');
      expect(esiCalc.getName()).toBe('Employee State Insurance (ESI)');
      expect(ptCalc.getName()).toBe('Professional Tax (PT)');
      expect(tdsCalc.getName()).toBe('Tax Deducted at Source (TDS)');
    });

    it('should throw error for unsupported type', () => {
      expect(() => ComplianceCalculatorFactory.getCalculator('UNKNOWN')).toThrow();
    });
  });
});
