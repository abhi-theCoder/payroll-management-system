import { Request, Response } from 'express';
import complianceService from './service';
import { validateData } from '@shared/utils/validators';
import { CreateComplianceRecordSchema } from './dto';

export class ComplianceController {
  async calculateDeductions(req: Request, res: Response): Promise<void> {
    const { grossSalary, basicSalary, employeeId } = req.body;

    if (!grossSalary || !basicSalary || !employeeId) {
      res.status(400).json({
        success: false,
        error: 'grossSalary, basicSalary, and employeeId are required',
      });
      return;
    }

    const result = await complianceService.calculateComplianceDeductions(grossSalary, basicSalary, employeeId);

    res.status(200).json({
      success: true,
      message: 'Compliance deductions calculated successfully',
      data: result,
    });
  }

  async createRecord(req: Request, res: Response): Promise<void> {
    const data: any = validateData(CreateComplianceRecordSchema, req.body);
    const result = await complianceService.createComplianceRecord(data);

    res.status(201).json({
      success: true,
      message: 'Compliance record created successfully',
      data: result,
    });
  }

  async getRecord(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const result = await complianceService.getComplianceRecord(id);

    res.status(200).json({
      success: true,
      data: result,
    });
  }

  async getEmployeeRecords(req: Request, res: Response): Promise<void> {
    const { employeeId } = req.params;
    const { month, year } = req.query;

    const result = await complianceService.getEmployeeComplianceRecords(
      employeeId,
      month ? parseInt(month as string) : undefined,
      year ? parseInt(year as string) : undefined,
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  }

  async getRecordsByType(req: Request, res: Response): Promise<void> {
    const { type, month, year } = req.query;

    if (!type || !month || !year) {
      res.status(400).json({
        success: false,
        error: 'type, month, and year are required',
      });
      return;
    }

    const result = await complianceService.getComplianceRecordsByType(
      type as string,
      parseInt(month as string),
      parseInt(year as string),
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  }

  async markAsFiled(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const result = await complianceService.markAsFiled(id);

    res.status(200).json({
      success: true,
      message: 'Compliance record marked as filed',
      data: result,
    });
  }

  async generateReport(req: Request, res: Response): Promise<void> {
    const { month, year } = req.query;

    if (!month || !year) {
      res.status(400).json({
        success: false,
        error: 'month and year are required',
      });
      return;
    }

    const result = await complianceService.generateComplianceReport(
      parseInt(month as string),
      parseInt(year as string),
    );

    res.status(200).json({
      success: true,
      message: 'Compliance report generated successfully',
      data: result,
    });
  }
}

export default new ComplianceController();
