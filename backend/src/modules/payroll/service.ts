import prisma from '@config/database';
import { NotFoundException, PayrollException, PayrollLockedException, ValidationException } from '@shared/exceptions';
import { ProcessPayrollRequest, PayrollCalculationData } from './dto';
import { AttendanceCalculator, PayrollValidationRules } from './domain/entity';
import salaryService from '@modules/salary/service';
import complianceService from '@modules/compliance/service';
import logger from '@config/logger';

/**
 * Payroll Service - Core payroll processing logic
 * Handles atomic, idempotent, and auditable payroll runs
 */
export class PayrollService {
  /**
   * Process payroll for month/year
   * This is the main entry point - handles full payroll cycle
   */
  async processPayroll(data: ProcessPayrollRequest): Promise<{
    payrollRunId: string;
    processedCount: number;
    failureCount: number;
    details: any[];
  }> {
    logger.info(`Starting payroll processing for ${data.month}/${data.year}`);

    // Check if payroll already exists
    // const existingPayrolls = await prisma.payroll.findMany({
    //   where: {
    //     month: data.month,
    //     year: data.year,
    //   },
    // });

    // Get employees to process
    let employees;
    if (data.employeeIds && data.employeeIds.length > 0) {
      employees = await prisma.employee.findMany({
        where: {
          id: { in: data.employeeIds },
          status: 'ACTIVE',
        },
        include: {
          salaryStructures: {
            where: { isActive: true },
          },
        },
      });
    } else {
      employees = await prisma.employee.findMany({
        where: { status: 'ACTIVE' },
        include: {
          salaryStructures: {
            where: { isActive: true },
          },
        },
      });
    }

    if (employees.length === 0) {
      throw new NotFoundException('No active employees found for payroll processing');
    }

    const results: any[] = [];
    let processedCount = 0;
    let failureCount = 0;

    // Process each employee in transaction
    for (const employee of employees) {
      try {
        const result = await this.processEmployeePayroll(employee, data.month, data.year);
        results.push({
          employeeId: employee.id,
          employeeCode: employee.employeeId,
          status: 'SUCCESS',
          data: result,
        });
        processedCount++;
      } catch (error) {
        logger.error(
          { error, employeeId: employee.id },
          `Failed to process payroll for employee ${employee.employeeId}`,
        );
        failureCount++;
        results.push({
          employeeId: employee.id,
          employeeCode: employee.employeeId,
          status: 'FAILED',
          error: (error as Error).message,
        });
      }
    }

    logger.info(
      `Payroll processing completed. Processed: ${processedCount}, Failed: ${failureCount}`,
    );

    return {
      payrollRunId: `PR-${data.month}-${data.year}`,
      processedCount,
      failureCount,
      details: results,
    };
  }

  /**
   * Process payroll for single employee
   */
  private async processEmployeePayroll(
    employee: any,
    month: number,
    year: number,
  ): Promise<PayrollCalculationData> {
    const activeSalaryStructure = employee.salaryStructures[0];

    if (!activeSalaryStructure) {
      throw new PayrollException(
        `No active salary structure found for employee ${employee.employeeId}`,
      );
    }

    // Check for existing payroll
    const existingPayroll = await prisma.payroll.findUnique({
      where: {
        employeeId_month_year: {
          employeeId: employee.id,
          month,
          year,
        },
      },
    });

    // Idempotency: Fail if payroll already locked
    if (existingPayroll?.status === 'LOCKED') {
      throw new PayrollLockedException(
        `Payroll already locked for ${employee.employeeId}`,
      );
    }

    // Get attendance data
    const attendance = await this.getAttendanceData(employee.id, month, year);

    // Get leave data
    // const leaves = await this.getLeaveData(employee.id, month, year);

    // Calculate working days
    const workingDaysInMonth = AttendanceCalculator.getWorkingDaysInMonth(month, year);

    // Validate attendance
    const attendanceValidation = PayrollValidationRules.validateAttendance(
      attendance.daysWorked,
      attendance.daysPresent,
      attendance.daysAbsent,
      attendance.daysLeave,
      workingDaysInMonth,
    );

    if (!attendanceValidation.valid) {
      throw new ValidationException('Attendance validation failed', {
        errors: attendanceValidation.errors,
      });
    }

    // Calculate salary with attendance adjustments
    const salaryCalculation = await salaryService.calculateSalary(
      activeSalaryStructure.id,
      {
        basicSalary: activeSalaryStructure.basicSalary,
      },
    );

    // Apply attendance factor
    const attendanceFactor = attendance.daysWorked / workingDaysInMonth;
    const adjustedGrossSalary = salaryCalculation.grossSalary * attendanceFactor;
    const adjustedDeductions = salaryCalculation.deductions * attendanceFactor;
    const adjustedNetSalary = adjustedGrossSalary - adjustedDeductions;

    // Calculate compliance deductions
    const complianceDeductions = await complianceService.calculateComplianceDeductions(
      adjustedGrossSalary,
      activeSalaryStructure.basicSalary * attendanceFactor,
      employee.id,
    );

    // Validate salary calculations
    const salaryValidation = PayrollValidationRules.validateSalaryCalculation(
      activeSalaryStructure.basicSalary * attendanceFactor,
      salaryCalculation.earnings * attendanceFactor,
      adjustedDeductions,
      adjustedGrossSalary,
      adjustedNetSalary,
    );

    if (!salaryValidation.valid) {
      throw new ValidationException('Salary calculation validation failed', {
        errors: salaryValidation.errors,
      });
    }

    // Create or update payroll record in transaction
    const payroll = await prisma.$transaction(async (tx:any) => {
      // Delete existing draft payroll if any
      if (existingPayroll && (existingPayroll.status === 'DRAFT' || existingPayroll.status === 'REJECTED')) {
        await tx.payroll.delete({ where: { id: existingPayroll.id } });
      }

      // Create new payroll
      const newPayroll = await tx.payroll.create({
        data: {
          employeeId: employee.id,
          salaryStructureId: activeSalaryStructure.id,
          month,
          year,
          status: 'PROCESSED',
          basicSalary: activeSalaryStructure.basicSalary * attendanceFactor,
          earnings: salaryCalculation.earnings * attendanceFactor,
          deductions: adjustedDeductions,
          grossSalary: adjustedGrossSalary,
          netSalary: adjustedNetSalary,
          pfDeduction: complianceDeductions['PF'] || 0,
          esiDeduction: complianceDeductions['ESI'] || 0,
          ptDeduction: complianceDeductions['PT'] || 0,
          tdsDeduction: complianceDeductions['TDS'] || 0,
          daysWorked: attendance.daysWorked,
          daysPresent: attendance.daysPresent,
          daysAbsent: attendance.daysAbsent,
          daysLeave: attendance.daysLeave,
          processedAt: new Date(),
        },
      });

      // Create payroll components
      if (salaryCalculation.components && Object.keys(salaryCalculation.components).length > 0) {
        await tx.payrollComponent.createMany({
          data: Object.entries(salaryCalculation.components).map(([componentName, amount]) => ({
            payrollId: newPayroll.id,
            componentName,
            amount: (amount as number) * attendanceFactor,
            type: this.getComponentType(componentName),
          })),
        });
      }

      return newPayroll;
    });

    return {
      employeeId: employee.id,
      basicSalary: payroll.basicSalary,
      daysWorked: payroll.daysWorked,
      daysPresent: payroll.daysPresent,
      daysAbsent: payroll.daysAbsent,
      daysLeave: payroll.daysLeave,
      earnings: payroll.earnings,
      deductions: payroll.deductions,
      grossSalary: payroll.grossSalary,
      netSalary: payroll.netSalary,
      components: salaryCalculation.components,
      compliance: {
        PF: payroll.pfDeduction,
        ESI: payroll.esiDeduction,
        PT: payroll.ptDeduction,
        TDS: payroll.tdsDeduction,
      },
    };
  }

  /**
   * Get payroll for employee
   */
  async getPayroll(id: string): Promise<any> {
    const payroll = await prisma.payroll.findUnique({
      where: { id },
      include: {
        payrollComponents: true,
        employee: true,
      },
    });

    if (!payroll) {
      throw new NotFoundException('Payroll', id);
    }

    return payroll;
  }

  /**
   * Get payroll for employee by month/year
   */
  async getEmployeePayroll(employeeId: string, month: number, year: number): Promise<any> {
    const payroll = await prisma.payroll.findUnique({
      where: {
        employeeId_month_year: {
          employeeId,
          month,
          year,
        },
      },
      include: {
        payrollComponents: true,
        employee: true,
      },
    });

    if (!payroll) {
      throw new NotFoundException(
        `Payroll for employee ${employeeId} in ${month}/${year}`,
      );
    }

    return payroll;
  }

  /**
   * Get all payrolls for employee
   */
  async getEmployeePayrolls(employeeId: string, limit = 12): Promise<any[]> {
    return prisma.payroll.findMany({
      where: { employeeId },
      include: { payrollComponents: true },
      orderBy: { year: 'desc' },
      take: limit,
    });
  }

  /**
   * Lock payroll
   */
  async lockPayroll(id: string): Promise<any> {
    const payroll = await prisma.payroll.findUnique({
      where: { id },
    });

    if (!payroll) {
      throw new NotFoundException('Payroll', id);
    }

    if (payroll.status !== 'PROCESSED') {
      throw new PayrollException(
        `Cannot lock payroll with status ${payroll.status}. Only PROCESSED payrolls can be locked.`,
      );
    }

    return prisma.payroll.update({
      where: { id },
      data: {
        status: 'LOCKED',
        lockedAt: new Date(),
      },
    });
  }

  /**
   * Reject payroll
   */
  async rejectPayroll(id: string, reason: string): Promise<any> {
    const payroll = await prisma.payroll.findUnique({
      where: { id },
    });

    if (!payroll) {
      throw new NotFoundException('Payroll', id);
    }

    if (payroll.status === 'LOCKED') {
      throw new PayrollLockedException('Cannot reject locked payroll');
    }

    return prisma.payroll.update({
      where: { id },
      data: {
        status: 'REJECTED',
        rejectionReason: reason,
      },
    });
  }

  /**
   * Get attendance data for month
   */
  private async getAttendanceData(
    employeeId: string,
    month: number,
    year: number,
  ): Promise<{ daysWorked: number; daysPresent: number; daysAbsent: number; daysLeave: number }> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const attendance = await prisma.attendance.findMany({
      where: {
        employeeId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    let daysPresent = 0;
    let daysAbsent = 0;
    let daysLeave = 0;

    attendance.forEach((att:any) => {
      if (att.status === 'PRESENT' || att.status === 'HALF_DAY') {
        daysPresent += att.status === 'HALF_DAY' ? 0.5 : 1;
      } else if (att.status === 'ABSENT') {
        daysAbsent += 1;
      } else if (att.status === 'LEAVE') {
        daysLeave += 1;
      }
    });

    // const workingDays = AttendanceCalculator.getWorkingDaysInMonth(month, year);
    const daysWorked = daysPresent;

    return {
      daysWorked,
      daysPresent,
      daysAbsent,
      daysLeave,
    };
  }

  /**
   * Get leave data for month
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // private async _getLeaveData(
  //   employeeId: string,
  //   month: number,
  //   year: number,
  // ): Promise<{ totalLeaveDays: number; leaveBreakdown: Record<string, number> }> {
  //   const startDate = new Date(year, month - 1, 1);
  //   const endDate = new Date(year, month, 0);

  //   const leaves = await prisma.leave.findMany({
  //     where: {
  //       employeeId,
  //       status: 'APPROVED',
  //       startDate: { lte: endDate },
  //       endDate: { gte: startDate },
  //     },
  //   });

  //   const leaveBreakdown: Record<string, number> = {};
  //   let totalLeaveDays = 0;

  //   leaves.forEach((leave) => {
  //     leaveBreakdown[leave.leaveType] = (leaveBreakdown[leave.leaveType] || 0) + leave.daysUsed;
  //     totalLeaveDays += leave.daysUsed;
  //   });

  //   return {
  //     totalLeaveDays,
  //     leaveBreakdown,
  //   };
  // }

  /**
   * Get component type
   */
  private getComponentType(componentName: string): 'EARNING' | 'DEDUCTION' {
    const deductionKeywords = ['PF', 'ESI', 'Professional', 'TDS', 'Insurance', 'Tax'];
    return deductionKeywords.some((keyword) =>
      componentName.toUpperCase().includes(keyword),
    )
      ? 'DEDUCTION'
      : 'EARNING';
  }
}

export default new PayrollService();
