import prisma from '@config/database';
import { NotFoundException, BusinessRuleException } from '@shared/exceptions';
import { CreateSalaryStructureRequest, UpdateSalaryStructureRequest, CreateSalaryComponentRequest } from './dto';
import { SalaryStructure, SalaryComponent, SalaryCalculationContext } from './domain/entity';
import SalaryRules from './domain/rules';

/**
 * Salary Structure Service - DDD pattern
 */
export class SalaryService {
  /**
   * Create salary structure
   */
  async createSalaryStructure(data: CreateSalaryStructureRequest): Promise<any> {
    // Validate employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: data.employeeId },
    });

    if (!employee) {
      throw new NotFoundException('Employee', data.employeeId);
    }

    // Apply domain rules
    if (!SalaryRules.isValidCTC(data.basicSalary, data.ctc)) {
      throw new BusinessRuleException(
        `CTC (${data.ctc}) must be greater than or equal to basic salary (${data.basicSalary})`,
      );
    }

    if (!SalaryRules.isWithinOrgLimits(data.ctc)) {
      throw new BusinessRuleException('Salary exceeds maximum allowed CTC for organization');
    }

    // Create salary structure in database
    const salaryStructure = await prisma.salaryStructure.create({
      data: {
        employeeId: data.employeeId,
        name: data.name,
        basicSalary: data.basicSalary,
        ctc: data.ctc,
        hra: data.hra,
        dearness: data.dearness,
        conveyance: data.conveyance,
        medical: data.medical,
        other: data.other,
        effectiveFrom: new Date(data.effectiveFrom),
        effectiveUntil: data.effectiveUntil ? new Date(data.effectiveUntil) : null,
        isActive: true,
      },
    });

    // Create components
    if (data.components && data.components.length > 0) {
      await Promise.all(
        data.components.map((component) =>
          prisma.salaryComponent.create({
            data: {
              salaryStructureId: salaryStructure.id,
              ...component,
            },
          }),
        ),
      );
    }

    return this.getSalaryStructureById(salaryStructure.id);
  }

  /**
   * Get salary structure by ID
   */
  async getSalaryStructureById(id: string): Promise<any> {
    const salaryStructure = await prisma.salaryStructure.findUnique({
      where: { id },
      include: {
        components: true,
      },
    });

    if (!salaryStructure) {
      throw new NotFoundException('Salary Structure', id);
    }

    return this.formatSalaryStructureResponse(salaryStructure);
  }

  /**
   * Get active salary structure for employee
   */
  async getActiveSalaryStructure(employeeId: string): Promise<any> {
    const salaryStructure = await prisma.salaryStructure.findFirst({
      where: {
        employeeId,
        isActive: true,
      },
      include: {
        components: true,
      },
    });

    if (!salaryStructure) {
      throw new NotFoundException('Active salary structure not found for employee');
    }

    return this.formatSalaryStructureResponse(salaryStructure);
  }

  /**
   * Get all salary structures for employee
   */
  async getEmployeeSalaryStructures(employeeId: string): Promise<any[]> {
    const structures = await prisma.salaryStructure.findMany({
      where: { employeeId },
      include: { components: true },
      orderBy: { effectiveFrom: 'desc' },
    });

    return structures.map((s:any) => this.formatSalaryStructureResponse(s));
  }

  /**
   * Update salary structure
   */
  async updateSalaryStructure(id: string, data: UpdateSalaryStructureRequest): Promise<any> {
    const structure = await prisma.salaryStructure.findUnique({ where: { id } });

    if (!structure) {
      throw new NotFoundException('Salary Structure', id);
    }

    if (data.basicSalary && data.ctc && !SalaryRules.isValidCTC(data.basicSalary, data.ctc)) {
      throw new BusinessRuleException('CTC must be greater than or equal to basic salary');
    }

    const updated = await prisma.salaryStructure.update({
      where: { id },
      data: {
        ...data,
        effectiveFrom: data.effectiveFrom ? new Date(data.effectiveFrom) : undefined,
        effectiveUntil: data.effectiveUntil ? new Date(data.effectiveUntil) : undefined,
      } as any,
      include: { components: true },
    });

    return this.formatSalaryStructureResponse(updated);
  }

  /**
   * Add salary component
   */
  async addSalaryComponent(salaryStructureId: string, component: CreateSalaryComponentRequest): Promise<any> {
    const structure = await prisma.salaryStructure.findUnique({
      where: { id: salaryStructureId },
    });

    if (!structure) {
      throw new NotFoundException('Salary Structure', salaryStructureId);
    }

    const created = await prisma.salaryComponent.create({
      data: {
        salaryStructureId,
        ...component,
      },
    });

    return created;
  }

  /**
   * Calculate salary (full breakdown)
   */
  async calculateSalary(
    salaryStructureId: string,
    context: Partial<SalaryCalculationContext> = {},
  ): Promise<{
    basicSalary: number;
    earnings: number;
    deductions: number;
    grossSalary: number;
    netSalary: number;
    components: Record<string, number>;
  }> {
    const salaryStructure = await prisma.salaryStructure.findUnique({
      where: { id: salaryStructureId },
      include: { components: true },
    });

    if (!salaryStructure) {
      throw new NotFoundException('Salary Structure', salaryStructureId);
    }

    const calculationContext: SalaryCalculationContext = {
      basicSalary: context.basicSalary ?? salaryStructure.basicSalary,
      hra: (context.hra ?? salaryStructure.hra ?? undefined) as any,
      dearness: (context.dearness ?? salaryStructure.dearness ?? undefined) as any,
      conveyance: (context.conveyance ?? salaryStructure.conveyance ?? undefined) as any,
      medical: (context.medical ?? salaryStructure.medical ?? undefined) as any,
      other: context.other,
      previousComponents: context.previousComponents,
    };

    // Create domain entity
    const domainStructure = new SalaryStructure(
      salaryStructure.id,
      salaryStructure.employeeId,
      salaryStructure.name,
      salaryStructure.basicSalary,
      salaryStructure.ctc,
      salaryStructure.effectiveFrom,
      salaryStructure.effectiveUntil,
      salaryStructure.components.map(
        (c:any) =>
          new SalaryComponent(
            c.id,
            c.name,
            c.type as any,
            c.calculationType as any,
            c.value,
            c.formula ?? undefined,
            c.dependsOn ?? undefined,
            c.isOptional,
          ),
      ),
      salaryStructure.isActive,
    );

    const grossSalary = domainStructure.calculateGrossSalary(calculationContext);
    const deductions = domainStructure.calculateDeductions(calculationContext);
    const netSalary = domainStructure.calculateNetSalary(calculationContext);
    const components = domainStructure.getAllComponentCalculations(calculationContext);

    return {
      basicSalary: calculationContext.basicSalary,
      earnings: grossSalary - calculationContext.basicSalary,
      deductions,
      grossSalary,
      netSalary,
      components,
    };
  }

  /**
   * Format response
   */
  private formatSalaryStructureResponse(structure: any): any {
    return {
      id: structure.id,
      employeeId: structure.employeeId,
      name: structure.name,
      basicSalary: structure.basicSalary,
      ctc: structure.ctc,
      hra: structure.hra,
      dearness: structure.dearness,
      conveyance: structure.conveyance,
      medical: structure.medical,
      effectiveFrom: structure.effectiveFrom,
      effectiveUntil: structure.effectiveUntil,
      isActive: structure.isActive,
      components: structure.components || [],
    };
  }
}

export default new SalaryService();
