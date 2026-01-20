import prisma from '@config/database';
import { NotFoundException } from '@shared/exceptions';
import { CreateTaxDeclarationRequest, UpdateTaxDeclarationRequest } from './dto';
import {
  IndiaTaxStrategy,
  ExemptionCalculator,
  AnnualTaxProjection,
} from './domain/calculators';

/**
 * Tax Service
 */
export class TaxService {
  private taxStrategy = new IndiaTaxStrategy();
  private exemptionCalculator = new ExemptionCalculator();
  private taxProjection = new AnnualTaxProjection(this.taxStrategy, this.exemptionCalculator);

  /**
   * Create tax declaration
   */
  async createTaxDeclaration(data: CreateTaxDeclarationRequest): Promise<any> {
    const employee = await prisma.employee.findUnique({
      where: { id: data.employeeId },
    });

    if (!employee) {
      throw new NotFoundException('Employee', data.employeeId);
    }

    // Check if declaration already exists for this FY
    const existing = await prisma.taxDeclaration.findUnique({
      where: {
        employeeId_financialYear: {
          employeeId: data.employeeId,
          financialYear: data.financialYear,
        },
      },
    });

    if (existing) {
      throw new Error('Tax declaration already exists for this financial year');
    }

    // Calculate total exemptions
    const exemptions = {
      '80C': data.section80C,
      '80D': data.section80D,
      '80E': data.section80E,
      '80G': data.section80G,
      '80TTA': data.section80TTA,
    };

    const totalExemptions = this.exemptionCalculator.calculateTotalExemptions(exemptions);

    const declaration = await prisma.taxDeclaration.create({
      data: {
        ...data,
        totalExemptions,
        status: 'PENDING',
      },
    });

    return this.formatTaxDeclarationResponse(declaration);
  }

  /**
   * Get tax declaration
   */
  async getTaxDeclaration(id: string): Promise<any> {
    const declaration = await prisma.taxDeclaration.findUnique({
      where: { id },
    });

    if (!declaration) {
      throw new NotFoundException('Tax Declaration', id);
    }

    return this.formatTaxDeclarationResponse(declaration);
  }

  /**
   * Get employee tax declarations
   */
  async getEmployeeTaxDeclarations(employeeId: string): Promise<any[]> {
    const declarations = await prisma.taxDeclaration.findMany({
      where: { employeeId },
      orderBy: { financialYear: 'desc' },
    });

    return declarations.map((d:any) => this.formatTaxDeclarationResponse(d));
  }

  /**
   * Get tax declaration by financial year
   */
  async getTaxDeclarationByFY(employeeId: string, financialYear: string): Promise<any> {
    const declaration = await prisma.taxDeclaration.findUnique({
      where: {
        employeeId_financialYear: {
          employeeId,
          financialYear,
        },
      },
    });

    if (!declaration) {
      throw new NotFoundException('Tax Declaration for FY ' + financialYear);
    }

    return this.formatTaxDeclarationResponse(declaration);
  }

  /**
   * Update tax declaration
   */
  async updateTaxDeclaration(id: string, data: UpdateTaxDeclarationRequest): Promise<any> {
    const declaration = await prisma.taxDeclaration.findUnique({
      where: { id },
    });

    if (!declaration) {
      throw new NotFoundException('Tax Declaration', id);
    }

    // Calculate new exemptions
    const updatedDeclaration = await prisma.taxDeclaration.update({
      where: { id },
      data: {
        ...data,
        totalExemptions: this.exemptionCalculator.calculateTotalExemptions({
          '80C': data.section80C ?? declaration.section80C,
          '80D': data.section80D ?? declaration.section80D,
          '80E': data.section80E ?? declaration.section80E,
          '80G': data.section80G ?? declaration.section80G,
          '80TTA': data.section80TTA ?? declaration.section80TTA,
        }),
      },
    });

    return this.formatTaxDeclarationResponse(updatedDeclaration);
  }

  /**
   * Calculate tax projection for employee
   */
  async calculateTaxProjection(
    employeeId: string,
    monthlyGrossSalary: number,
    monthlyBasic: number,
    financialYear?: string,
  ): Promise<any> {
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new NotFoundException('Employee', employeeId);
    }

    // Get exemptions for current/specified FY
    const fy = financialYear || this.getCurrentFinancialYear();
    let declaration;

    try {
      declaration = await this.getTaxDeclarationByFY(employeeId, fy);
    } catch {
      // If no declaration exists, use zero exemptions
      declaration = null;
    }

    const exemptions = {
      '80C': declaration?.section80C || 0,
      '80D': declaration?.section80D || 0,
      '80E': declaration?.section80E || 0,
      '80G': declaration?.section80G || 0,
      '80TTA': declaration?.section80TTA || 0,
    };

    const projection = this.taxProjection.projectAnnualTax(
      monthlyGrossSalary,
      monthlyBasic,
      exemptions,
    );

    return {
      financialYear: fy,
      ...projection,
    };
  }

  /**
   * Get exemption summary for declaration
   */
  async getExemptionSummary(id: string): Promise<any> {
    const declaration = await prisma.taxDeclaration.findUnique({
      where: { id },
    });

    if (!declaration) {
      throw new NotFoundException('Tax Declaration', id);
    }

    const sections = [
      { code: '80C', name: 'Investments', amount: declaration.section80C },
      { code: '80D', name: 'Medical Insurance', amount: declaration.section80D },
      { code: '80E', name: 'Education Loan', amount: declaration.section80E },
      { code: '80G', name: 'Donations', amount: declaration.section80G },
      { code: '80TTA', name: 'Savings Interest', amount: declaration.section80TTA },
    ];

    const details = sections.map((section) => ({
      ...section,
      detail: this.exemptionCalculator.getExemptionDetail(section.code, section.amount),
    }));

    return {
      financialYear: declaration.financialYear,
      sections: details,
      totalExemptions: declaration.totalExemptions,
    };
  }

  /**
   * Verify tax declaration
   */
  async verifyTaxDeclaration(id: string): Promise<any> {
    const declaration = await prisma.taxDeclaration.findUnique({
      where: { id },
    });

    if (!declaration) {
      throw new NotFoundException('Tax Declaration', id);
    }

    return prisma.taxDeclaration.update({
      where: { id },
      data: {
        status: 'VERIFIED',
        verificationDate: new Date(),
      },
    });
  }

  /**
   * Get current financial year
   */
  private getCurrentFinancialYear(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    if (month >= 4) {
      return `${year}-${year + 1}`;
    }
    return `${year - 1}-${year}`;
  }

  /**
   * Format response
   */
  private formatTaxDeclarationResponse(declaration: any): any {
    return {
      id: declaration.id,
      employeeId: declaration.employeeId,
      financialYear: declaration.financialYear,
      section80C: declaration.section80C,
      section80D: declaration.section80D,
      section80E: declaration.section80E,
      section80G: declaration.section80G,
      section80TTA: declaration.section80TTA,
      totalExemptions: declaration.totalExemptions,
      estimatedTax: declaration.estimatedTax,
      status: declaration.status,
      declarationDate: declaration.declarationDate,
      verificationDate: declaration.verificationDate,
    };
  }
}

export default new TaxService();
