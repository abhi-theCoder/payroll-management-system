import prisma from '@config/database';
import { NotFoundException } from '@shared/exceptions';

/**
 * Payslip Service
 */
export class PayslipService {
  /**
   * Generate payslip for payroll
   */
  async generatePayslip(payrollId: string): Promise<any> {
    const payroll = await prisma.payroll.findUnique({
      where: { id: payrollId },
      include: {
        employee: {
          include: { user: true },
        },
        salaryStructure: {
          include: { components: true },
        },
        payrollComponents: true,
      },
    });

    if (!payroll) {
      throw new NotFoundException('Payroll', payrollId);
    }

    // Check if payslip already exists
    let payslip = await prisma.payslip.findUnique({
      where: { payrollId },
    });

    if (!payslip) {
      payslip = await prisma.payslip.create({
        data: {
          payrollId,
          employeeId: payroll.employeeId,
          status: 'GENERATED',
        },
      });
    }

    return this.formatPayslip(payroll, payslip);
  }

  /**
   * Get payslip
   */
  async getPayslip(id: string): Promise<any> {
    const payslip = await prisma.payslip.findUnique({
      where: { id },
      include: {
        payroll: {
          include: {
            employee: {
              include: { user: true },
            },
            salaryStructure: {
              include: { components: true },
            },
            payrollComponents: true,
          },
        },
      },
    });

    if (!payslip) {
      throw new NotFoundException('Payslip', id);
    }

    return this.formatPayslip(payslip.payroll, payslip);
  }

  /**
   * Get payslip by payroll ID
   */
  async getPayslipByPayrollId(payrollId: string): Promise<any> {
    const payslip = await prisma.payslip.findUnique({
      where: { payrollId },
      include: {
        payroll: {
          include: {
            employee: {
              include: { user: true },
            },
            salaryStructure: {
              include: { components: true },
            },
            payrollComponents: true,
          },
        },
      },
    });

    if (!payslip) {
      throw new NotFoundException('Payslip for payroll', payrollId);
    }

    return this.formatPayslip(payslip.payroll, payslip);
  }

  /**
   * Get employee payslips
   */
  async getEmployeePayslips(employeeId: string, limit = 12): Promise<any[]> {
    const payslips = await prisma.payslip.findMany({
      where: { employeeId },
      include: {
        payroll: {
          include: {
            employee: true,
            payrollComponents: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return payslips.map((p:any) => this.formatPayslip(p.payroll, p));
  }

  /**
   * Mark payslip as sent
   */
  async markAsSent(id: string): Promise<any> {
    const payslip = await prisma.payslip.findUnique({
      where: { id },
      include: {
        payroll: {
          include: {
            employee: {
              include: { user: true },
            },
            payrollComponents: true,
          },
        },
      },
    });

    if (!payslip) {
      throw new NotFoundException('Payslip', id);
    }

    const updated = await prisma.payslip.update({
      where: { id },
      data: {
        status: 'SENT',
        sentAt: new Date(),
      },
    });

    return this.formatPayslip(payslip.payroll, updated);
  }

  /**
   * Mark payslip as viewed
   */
  async markAsViewed(id: string): Promise<any> {
    const payslip = await prisma.payslip.findUnique({
      where: { id },
      include: {
        payroll: {
          include: {
            employee: true,
            payrollComponents: true,
          },
        },
      },
    });

    if (!payslip) {
      throw new NotFoundException('Payslip', id);
    }

    const updated = await prisma.payslip.update({
      where: { id },
      data: {
        status: 'VIEWED',
        viewedAt: new Date(),
      },
    });

    return this.formatPayslip(payslip.payroll, updated);
  }

  /**
   * Mark payslip as downloaded
   */
  async markAsDownloaded(id: string): Promise<any> {
    const payslip = await prisma.payslip.findUnique({
      where: { id },
      include: {
        payroll: {
          include: {
            employee: true,
            payrollComponents: true,
          },
        },
      },
    });

    if (!payslip) {
      throw new NotFoundException('Payslip', id);
    }

    const updated = await prisma.payslip.update({
      where: { id },
      data: {
        status: 'DOWNLOADED',
        downloadedAt: new Date(),
      },
    });

    return this.formatPayslip(payslip.payroll, updated);
  }

  /**
   * Format payslip response
   */
  private formatPayslip(payroll: any, payslip: any): any {
    return {
      id: payslip.id,
      payrollId: payroll.id,
      employee: {
        id: payroll.employee.id,
        employeeId: payroll.employee.employeeId,
        firstName: payroll.employee.firstName,
        lastName: payroll.employee.lastName,
        email: payroll.employee.email,
        department: payroll.employee.department,
        designation: payroll.employee.designation,
        pan: payroll.employee.panNumber,
      },
      period: {
        month: payroll.month,
        year: payroll.year,
      },
      salaryDetails: {
        basicSalary: payroll.basicSalary,
        earnings: payroll.earnings,
        grossSalary: payroll.grossSalary,
      },
      deductionsDetails: {
        standardDeductions: payroll.deductions,
        pfDeduction: payroll.pfDeduction,
        esiDeduction: payroll.esiDeduction,
        ptDeduction: payroll.ptDeduction,
        tdsDeduction: payroll.tdsDeduction,
        totalDeductions:
          payroll.deductions +
          payroll.pfDeduction +
          payroll.esiDeduction +
          payroll.ptDeduction +
          payroll.tdsDeduction,
      },
      netPay: payroll.netSalary,
      attendance: {
        daysWorked: payroll.daysWorked,
        daysPresent: payroll.daysPresent,
        daysAbsent: payroll.daysAbsent,
        daysLeave: payroll.daysLeave,
      },
      components: payroll.payrollComponents || [],
      status: payslip.status,
      sentAt: payslip.sentAt,
      viewedAt: payslip.viewedAt,
      downloadedAt: payslip.downloadedAt,
      createdAt: payslip.createdAt,
    };
  }
}

export default new PayslipService();
