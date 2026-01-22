import prisma from '@config/database';
import { NotFoundException, ConflictException } from '@shared/exceptions';
import { CreateEmployeeRequest, UpdateEmployeeRequest } from './dto';

/**
 * Employee Service - Business logic for employee management
 */
export class EmployeeService {
  /**
   * Create a new employee
   */
  async createEmployee(data: CreateEmployeeRequest, _userId?: string): Promise<any> {
    // Check if employee ID already exists
    const existingEmployee = await prisma.employee.findUnique({
      where: { employeeId: data.employeeId },
    });

    if (existingEmployee) {
      throw new ConflictException('Employee with this ID already exists');
    }

    // let user;
    // if (userId) {
    //   user = await prisma.user.findUnique({
    //     where: { id: userId },
    //   });
    // }

    const employee = await prisma.employee.create({
      data: {
        employeeId: data.employeeId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        gender: data.gender,
        department: data.department,
        designation: data.designation,
        dateOfJoining: new Date(data.dateOfJoining),
        employmentType: data.employmentType,
        panNumber: data.panNumber,
        aadharNumber: data.aadharNumber,
        accountNumber: data.accountNumber,
        ifscCode: data.ifscCode,
        uanNumber: data.uanNumber,
        esicNumber: data.esicNumber,
        status: 'ACTIVE',
      } as any,
    });

    return this.formatEmployeeResponse(employee);
  }

  /**
   * Get employee by ID
   */
  async getEmployeeById(id: string): Promise<any> {
    const employee = await prisma.employee.findUnique({
      where: { id },
    });

    if (!employee) {
      throw new NotFoundException('Employee', id);
    }

    return this.formatEmployeeResponse(employee);
  }

  /**
   * Get employee by employee ID
   */
  async getEmployeeByEmployeeId(employeeId: string): Promise<any> {
    const employee = await prisma.employee.findUnique({
      where: { employeeId },
    });

    if (!employee) {
      throw new NotFoundException('Employee', employeeId);
    }

    return this.formatEmployeeResponse(employee);
  }

  /**
   * Get all employees with pagination and filtering
   */
  async getAllEmployees(
    page: number = 1,
    limit: number = 20,
    filters?: { department?: string; status?: string; designation?: string },
  ): Promise<{ data: any[]; total: number; page: number; limit: number }> {
    const where: any = {};

    if (filters?.department) where.department = filters.department;
    if (filters?.status) where.status = filters.status;
    if (filters?.designation) where.designation = filters.designation;

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { employeeId: 'asc' },
      }),
      prisma.employee.count({ where }),
    ]);

    return {
      data: employees.map((emp: any) => this.formatEmployeeResponse(emp)),
      total,
      page,
      limit,
    };
  }

  /**
   * Update employee
   */
  async updateEmployee(id: string, data: UpdateEmployeeRequest): Promise<any> {
    const employee = await prisma.employee.findUnique({
      where: { id },
    });

    if (!employee) {
      throw new NotFoundException('Employee', id);
    }

    const updated = await prisma.employee.update({
      where: { id },
      data: {
        ...data,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      },
    });

    return this.formatEmployeeResponse(updated);
  }

  /**
   * Deactivate employee
   */
  async deactivateEmployee(id: string, dateOfLeaving: Date): Promise<any> {
    const employee = await prisma.employee.findUnique({
      where: { id },
    });

    if (!employee) {
      throw new NotFoundException('Employee', id);
    }

    const updated = await prisma.employee.update({
      where: { id },
      data: {
        status: 'LEFT',
        dateOfLeaving,
      },
    });

    return this.formatEmployeeResponse(updated);
  }

  /**
   * Get employee salary structure
   */
  async getEmployeeSalaryStructure(employeeId: string): Promise<any> {
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

    return salaryStructure;
  }

  /**
   * Format employee response
   */
  private formatEmployeeResponse(employee: any): any {
    return {
      id: employee.id,
      employeeId: employee.employeeId,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      department: employee.department,
      designation: employee.designation,
      status: employee.status,
      dateOfJoining: employee.dateOfJoining,
      employmentType: employee.employmentType,
    };
  }

  /**
   * Get employee by user ID
   */
  async getEmployeeByUserId(userId: string): Promise<any> {
    const employee = await prisma.employee.findFirst({
      where: { userId },
    });
    return employee;
  }
}

export default new EmployeeService();
