import prisma from '@config/database';
import { NotFoundException, ComplianceCalculationException } from '@shared/exceptions';
import { CreateComplianceRecordRequest } from './dto';
import { ComplianceCalculatorFactory } from './domain/calculators';

/**
 * Compliance Service
 */
export class ComplianceService {
  /**
   * Calculate compliance deductions for a payroll
   */
  async calculateComplianceDeductions(
    grossSalary: number,
    basicSalary: number,
    employeeId: string,
  ): Promise<Record<string, number>> {
    const deductions: Record<string, number> = {};

    try {
      // Calculate PF
      const pfCalculator = ComplianceCalculatorFactory.getCalculator('PF');
      deductions['PF'] = pfCalculator.calculate(grossSalary, basicSalary);

      // Calculate ESI
      const esiCalculator = ComplianceCalculatorFactory.getCalculator('ESI');
      deductions['ESI'] = esiCalculator.calculate(grossSalary, basicSalary);

      // Calculate PT
      const ptCalculator = ComplianceCalculatorFactory.getCalculator('PT');
      deductions['PT'] = ptCalculator.calculate(grossSalary, basicSalary);

      // Calculate TDS
      const tdsCalculator = ComplianceCalculatorFactory.getCalculator('TDS');
      deductions['TDS'] = tdsCalculator.calculate(grossSalary, basicSalary);

      return deductions;
    } catch (error) {
      throw new ComplianceCalculationException(
        `Failed to calculate compliance deductions for employee ${employeeId}: ${(error as Error).message}`,
      );
    }
  }

  /**
   * Create compliance record
   */
  async createComplianceRecord(data: CreateComplianceRecordRequest): Promise<any> {
    const employee = await prisma.employee.findUnique({
      where: { id: data.employeeId },
    });

    if (!employee) {
      throw new NotFoundException('Employee', data.employeeId);
    }

    const record = await prisma.complianceRecord.create({
      data: {
        ...data,
        status: 'PENDING',
      },
    });

    return record;
  }

  /**
   * Get compliance record
   */
  async getComplianceRecord(id: string): Promise<any> {
    const record = await prisma.complianceRecord.findUnique({
      where: { id },
    });

    if (!record) {
      throw new NotFoundException('Compliance Record', id);
    }

    return record;
  }

  /**
   * Get employee compliance records
   */
  async getEmployeeComplianceRecords(
    employeeId: string,
    month?: number,
    year?: number,
  ): Promise<any[]> {
    const where: any = { employeeId };

    if (month) where.month = month;
    if (year) where.year = year;

    return prisma.complianceRecord.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get compliance records by type
   */
  async getComplianceRecordsByType(
    complianceType: string,
    month: number,
    year: number,
  ): Promise<any[]> {
    return prisma.complianceRecord.findMany({
      where: {
        complianceType,
        month,
        year,
      },
      include: {
        employee: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Mark compliance record as filed
   */
  async markAsFiled(id: string): Promise<any> {
    const record = await prisma.complianceRecord.findUnique({
      where: { id },
    });

    if (!record) {
      throw new NotFoundException('Compliance Record', id);
    }

    return prisma.complianceRecord.update({
      where: { id },
      data: {
        status: 'FILED',
        filedAt: new Date(),
      },
    });
  }

  /**
   * Generate compliance filing report for month/year
   */
  async generateComplianceReport(month: number, year: number): Promise<any> {
    const records = await prisma.complianceRecord.findMany({
      where: { month, year },
      include: { employee: true },
      orderBy: { complianceType: 'asc' },
    });

    if (records.length === 0) {
      throw new NotFoundException('No compliance records found for the specified period');
    }

    // Group by compliance type
    const grouped: Record<string, any[]> = {};
    records.forEach((record:any) => {
      if (!grouped[record.complianceType]) {
        grouped[record.complianceType] = [];
      }
      grouped[record.complianceType].push(record);
    });

    // Calculate totals
    const summary: Record<string, number> = {};
    Object.entries(grouped).forEach(([type, recs]) => {
      summary[type] = recs.reduce((sum, r) => sum + r.amount, 0);
    });

    return {
      month,
      year,
      generatedAt: new Date(),
      totalRecords: records.length,
      byType: grouped,
      summary,
    };
  }
}

export default new ComplianceService();
