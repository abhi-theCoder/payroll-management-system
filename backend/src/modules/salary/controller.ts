import { Request, Response } from 'express';
import salaryService from './service';
import { validateData } from '@shared/utils/validators';
import { CreateSalaryStructureSchema, UpdateSalaryStructureSchema, CreateSalaryComponentSchema } from './dto';

export class SalaryController {
  async createSalaryStructure(req: Request, res: Response): Promise<void> {
    const data: any = validateData(CreateSalaryStructureSchema, req.body);
    const result = await salaryService.createSalaryStructure(data);

    res.status(201).json({
      success: true,
      message: 'Salary structure created successfully',
      data: result,
    });
  }

  async getSalaryStructure(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const result = await salaryService.getSalaryStructureById(id);

    res.status(200).json({
      success: true,
      data: result,
    });
  }

  async getActiveSalaryStructure(req: Request, res: Response): Promise<void> {
    const { employeeId } = req.params;
    const result = await salaryService.getActiveSalaryStructure(employeeId);

    res.status(200).json({
      success: true,
      data: result,
    });
  }

  async getEmployeeSalaryStructures(req: Request, res: Response): Promise<void> {
    const { employeeId } = req.params;
    const result = await salaryService.getEmployeeSalaryStructures(employeeId);

    res.status(200).json({
      success: true,
      data: result,
    });
  }

  async updateSalaryStructure(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const data: any = validateData(UpdateSalaryStructureSchema, req.body);
    const result = await salaryService.updateSalaryStructure(id, data);

    res.status(200).json({
      success: true,
      message: 'Salary structure updated successfully',
      data: result,
    });
  }

  async addSalaryComponent(req: Request, res: Response): Promise<void> {
    const { salaryStructureId } = req.params;
    const component: any = validateData(CreateSalaryComponentSchema, req.body);
    const result = await salaryService.addSalaryComponent(salaryStructureId, component);

    res.status(201).json({
      success: true,
      message: 'Salary component added successfully',
      data: result,
    });
  }

  async calculateSalary(req: Request, res: Response): Promise<void> {
    const { salaryStructureId } = req.params;
    const result = await salaryService.calculateSalary(salaryStructureId, req.body);

    res.status(200).json({
      success: true,
      message: 'Salary calculated successfully',
      data: result,
    });
  }
}

export default new SalaryController();
