import { Request, Response } from 'express';
import payrollService from './service';
import { validateData } from '@shared/utils/validators';
import { ProcessPayrollSchema } from './dto';

export class PayrollController {
  async processPayroll(req: Request, res: Response): Promise<void> {
    const data: any = validateData(ProcessPayrollSchema, req.body);
    const result = await payrollService.processPayroll(data);

    res.status(200).json({
      success: true,
      message: 'Payroll processed successfully',
      data: result,
    });
  }

  async getPayroll(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const result = await payrollService.getPayroll(id);

    res.status(200).json({
      success: true,
      data: result,
    });
  }

  async getEmployeePayroll(req: Request, res: Response): Promise<void> {
    const { employeeId } = req.params;
    const { month, year } = req.query;

    if (!month || !year) {
      res.status(400).json({
        success: false,
        error: 'month and year are required',
      });
      return;
    }

    const result = await payrollService.getEmployeePayroll(
      employeeId,
      parseInt(month as string),
      parseInt(year as string),
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  }

  async getEmployeePayrolls(req: Request, res: Response): Promise<void> {
    const { employeeId } = req.params;
    const limit = parseInt(req.query.limit as string) || 12;

    const result = await payrollService.getEmployeePayrolls(employeeId, limit);

    res.status(200).json({
      success: true,
      data: result,
    });
  }

  async lockPayroll(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const result = await payrollService.lockPayroll(id);

    res.status(200).json({
      success: true,
      message: 'Payroll locked successfully',
      data: result,
    });
  }

  async rejectPayroll(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      res.status(400).json({
        success: false,
        error: 'Rejection reason is required',
      });
      return;
    }

    const result = await payrollService.rejectPayroll(id, reason);

    res.status(200).json({
      success: true,
      message: 'Payroll rejected successfully',
      data: result,
    });
  }
}

export default new PayrollController();
