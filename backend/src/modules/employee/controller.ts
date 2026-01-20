import { Request, Response } from 'express';
import employeeService from './service';
import { validateData } from '@shared/utils/validators';
import { CreateEmployeeSchema, UpdateEmployeeSchema } from './dto';

/**
 * Employee Controller - Handles HTTP requests
 */
export class EmployeeController {
  async createEmployee(req: Request, res: Response): Promise<void> {
    const data: any = validateData(CreateEmployeeSchema, req.body);
    const result = await employeeService.createEmployee(data);

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: result,
    });
  }

  async getEmployee(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const result = await employeeService.getEmployeeById(id);

    res.status(200).json({
      success: true,
      data: result,
    });
  }

  async getAllEmployees(req: Request, res: Response): Promise<void> {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const filters = {
      department: req.query.department as string,
      status: req.query.status as string,
      designation: req.query.designation as string,
    };

    const result = await employeeService.getAllEmployees(page, limit, filters);

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        pages: Math.ceil(result.total / result.limit),
      },
    });
  }

  async updateEmployee(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const data: any = validateData(UpdateEmployeeSchema, req.body);
    const result = await employeeService.updateEmployee(id, data);

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: result,
    });
  }

  async deactivateEmployee(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { dateOfLeaving } = req.body;

    if (!dateOfLeaving) {
      res.status(400).json({
        success: false,
        error: 'Date of leaving is required',
      });
      return;
    }

    const result = await employeeService.deactivateEmployee(id, new Date(dateOfLeaving));

    res.status(200).json({
      success: true,
      message: 'Employee deactivated successfully',
      data: result,
    });
  }

  async getEmployeeSalaryStructure(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const result = await employeeService.getEmployeeSalaryStructure(id);

    res.status(200).json({
      success: true,
      data: result,
    });
  }
}

export default new EmployeeController();
