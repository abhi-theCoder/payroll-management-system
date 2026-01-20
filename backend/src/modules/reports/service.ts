import prisma from '@config/database';
import { NotFoundException } from '@shared/exceptions';

/**
 * Reports Service
 */
export class ReportsService {
  /**
   * Generate salary register report
   */
  async generateSalaryRegister(month: number, year: number, departmentFilter?: string): Promise<any> {
    const payrolls = await prisma.payroll.findMany({
      where: {
        month,
        year,
        employee: departmentFilter ? { department: departmentFilter } : undefined,
      },
      include: {
        employee: true,
      },
      orderBy: { employee: { employeeId: 'asc' } },
    });

    if (payrolls.length === 0) {
      throw new NotFoundException('No payroll records found for the specified period');
    }

    const data = payrolls.map((p) => ({
      employeeId: p.employee.employeeId,
      employeeName: `${p.employee.firstName} ${p.employee.lastName}`,
      department: p.employee.department,
      basicSalary: p.basicSalary,
      earnings: p.earnings,
      grossSalary: p.grossSalary,
      pfDeduction: p.pfDeduction,
      esiDeduction: p.esiDeduction,
      ptDeduction: p.ptDeduction,
      tdsDeduction: p.tdsDeduction,
      totalDeductions: p.deductions + p.pfDeduction + p.esiDeduction + p.ptDeduction + p.tdsDeduction,
      netSalary: p.netSalary,
    }));

    const summary = {
      totalRecords: payrolls.length,
      totalBasicSalary: data.reduce((sum, d) => sum + d.basicSalary, 0),
      totalEarnings: data.reduce((sum, d) => sum + d.earnings, 0),
      totalGrossSalary: data.reduce((sum, d) => sum + d.grossSalary, 0),
      totalPF: data.reduce((sum, d) => sum + d.pfDeduction, 0),
      totalESI: data.reduce((sum, d) => sum + d.esiDeduction, 0),
      totalPT: data.reduce((sum, d) => sum + d.ptDeduction, 0),
      totalTDS: data.reduce((sum, d) => sum + d.tdsDeduction, 0),
      totalDeductions: data.reduce((sum, d) => sum + d.totalDeductions, 0),
      totalNetSalary: data.reduce((sum, d) => sum + d.netSalary, 0),
    };

    return {
      reportType: 'SALARY_REGISTER',
      month,
      year,
      generatedAt: new Date(),
      department: departmentFilter || 'All',
      data,
      summary,
    };
  }

  /**
   * Generate bank transfer report
   */
  async generateBankTransferReport(month: number, year: number): Promise<any> {
    const payrolls = await prisma.payroll.findMany({
      where: {
        month,
        year,
        status: 'LOCKED',
      },
      include: {
        employee: true,
      },
      orderBy: { employee: { accountNumber: 'asc' } },
    });

    if (payrolls.length === 0) {
      throw new NotFoundException('No locked payrolls found for bank transfer');
    }

    const data = payrolls
      .filter((p) => p.employee.accountNumber)
      .map((p) => ({
        accountNumber: p.employee.accountNumber,
        accountHolder: `${p.employee.firstName} ${p.employee.lastName}`,
        ifscCode: p.employee.ifscCode,
        amount: p.netSalary,
        employeeId: p.employee.employeeId,
        reference: `SAL-${month}-${year}-${p.employee.employeeId}`,
      }));

    const summary = {
      totalRecords: data.length,
      totalAmount: data.reduce((sum, d) => sum + d.amount, 0),
      settlementDate: new Date(),
    };

    return {
      reportType: 'BANK_TRANSFER',
      month,
      year,
      generatedAt: new Date(),
      data,
      summary,
    };
  }

  /**
   * Generate compliance filing report
   */
  async generateComplianceFilingReport(month: number, year: number): Promise<any> {
    const records = await prisma.complianceRecord.findMany({
      where: { month, year },
      include: { employee: true },
    });

    if (records.length === 0) {
      throw new NotFoundException('No compliance records found for the specified period');
    }

    // Group by compliance type
    const byType: Record<string, any[]> = {};
    records.forEach((r) => {
      if (!byType[r.complianceType]) byType[r.complianceType] = [];
      byType[r.complianceType].push(r);
    });

    const summary: Record<string, number> = {};
    Object.entries(byType).forEach(([type, recs]) => {
      summary[type] = recs.reduce((sum, r) => sum + r.amount, 0);
    });

    return {
      reportType: 'COMPLIANCE_FILING',
      month,
      year,
      generatedAt: new Date(),
      byType,
      summary,
    };
  }

  /**
   * Generate tax summary report
   */
  async generateTaxSummaryReport(financialYear: string): Promise<any> {
    const declarations = await prisma.taxDeclaration.findMany({
      where: { financialYear },
      include: { employee: true },
    });

    if (declarations.length === 0) {
      throw new NotFoundException('No tax declarations found for FY ' + financialYear);
    }

    const data = declarations.map((d) => ({
      employeeId: d.employee.employeeId,
      employeeName: `${d.employee.firstName} ${d.employee.lastName}`,
      section80C: d.section80C,
      section80D: d.section80D,
      section80E: d.section80E,
      section80G: d.section80G,
      section80TTA: d.section80TTA,
      totalExemptions: d.totalExemptions,
      status: d.status,
    }));

    const summary = {
      totalEmployees: declarations.length,
      totalSection80C: data.reduce((sum, d) => sum + d.section80C, 0),
      totalSection80D: data.reduce((sum, d) => sum + d.section80D, 0),
      totalExemptions: data.reduce((sum, d) => sum + d.totalExemptions, 0),
    };

    return {
      reportType: 'TAX_SUMMARY',
      financialYear,
      generatedAt: new Date(),
      data,
      summary,
    };
  }

  /**
   * Generate payroll cost analysis report
   */
  async generateCostAnalysisReport(month: number, year: number): Promise<any> {
    const payrolls = await prisma.payroll.findMany({
      where: { month, year },
      include: { employee: true },
    });

    if (payrolls.length === 0) {
      throw new NotFoundException('No payroll records found for the specified period');
    }

    // Group by department
    const byDepartment: Record<string, any> = {};

    payrolls.forEach((p) => {
      const dept = p.employee.department || 'Unassigned';
      if (!byDepartment[dept]) {
        byDepartment[dept] = {
          employees: 0,
          basicSalary: 0,
          earnings: 0,
          grossSalary: 0,
          deductions: 0,
          netSalary: 0,
        };
      }

      byDepartment[dept].employees += 1;
      byDepartment[dept].basicSalary += p.basicSalary;
      byDepartment[dept].earnings += p.earnings;
      byDepartment[dept].grossSalary += p.grossSalary;
      byDepartment[dept].deductions += p.deductions + p.pfDeduction + p.esiDeduction + p.ptDeduction + p.tdsDeduction;
      byDepartment[dept].netSalary += p.netSalary;
    });

    const summary = {
      totalEmployees: payrolls.length,
      totalPayroll: payrolls.reduce((sum, p) => sum + p.grossSalary, 0),
      averagePayPerEmployee: payrolls.reduce((sum, p) => sum + p.netSalary, 0) / payrolls.length,
    };

    return {
      reportType: 'COST_ANALYSIS',
      month,
      year,
      generatedAt: new Date(),
      byDepartment,
      summary,
    };
  }

  /**
   * Generate attendance report
   */
  async generateAttendanceReport(month: number, year: number, employeeId?: string): Promise<any> {
    const where: any = {};

    if (employeeId) where.employeeId = employeeId;

    const payrolls = await prisma.payroll.findMany({
      where: {
        ...where,
        month,
        year,
      },
      include: { employee: true },
      orderBy: { employee: { employeeId: 'asc' } },
    });

    if (payrolls.length === 0) {
      throw new NotFoundException('No attendance records found for the specified period');
    }

    const data = payrolls.map((p) => ({
      employeeId: p.employee.employeeId,
      employeeName: `${p.employee.firstName} ${p.employee.lastName}`,
      daysWorked: p.daysWorked,
      daysPresent: p.daysPresent,
      daysAbsent: p.daysAbsent,
      daysLeave: p.daysLeave,
      attendancePercentage: ((p.daysPresent / (p.daysPresent + p.daysAbsent)) * 100).toFixed(2),
    }));

    return {
      reportType: 'ATTENDANCE_REPORT',
      month,
      year,
      generatedAt: new Date(),
      data,
    };
  }

  /**
   * Save report snapshot
   */
  async saveReportSnapshot(reportType: string, month: number, year: number, dataSnapshot: any): Promise<any> {
    return prisma.payrollReport.create({
      data: {
        reportType,
        month,
        year,
        generatedBy: 'SYSTEM',
        dataSnapshot,
      },
    });
  }
}

export default new ReportsService();
