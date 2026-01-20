import { Request, Response } from 'express';
import payslipService from './service';

export class PayslipController {
  async generatePayslip(req: Request, res: Response): Promise<void> {
    const { payrollId } = req.params;
    const result = await payslipService.generatePayslip(payrollId);

    res.status(201).json({
      success: true,
      message: 'Payslip generated successfully',
      data: result,
    });
  }

  async getPayslip(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const result = await payslipService.getPayslip(id);

    res.status(200).json({
      success: true,
      data: result,
    });
  }

  async getPayslipByPayroll(req: Request, res: Response): Promise<void> {
    const { payrollId } = req.params;
    const result = await payslipService.getPayslipByPayrollId(payrollId);

    res.status(200).json({
      success: true,
      data: result,
    });
  }

  async getEmployeePayslips(req: Request, res: Response): Promise<void> {
    const { employeeId } = req.params;
    const limit = parseInt(req.query.limit as string) || 12;

    const result = await payslipService.getEmployeePayslips(employeeId, limit);

    res.status(200).json({
      success: true,
      data: result,
    });
  }

  async markAsSent(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const result = await payslipService.markAsSent(id);

    res.status(200).json({
      success: true,
      message: 'Payslip marked as sent',
      data: result,
    });
  }

  async markAsViewed(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const result = await payslipService.markAsViewed(id);

    res.status(200).json({
      success: true,
      message: 'Payslip marked as viewed',
      data: result,
    });
  }

  async markAsDownloaded(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const result = await payslipService.markAsDownloaded(id);

    res.status(200).json({
      success: true,
      message: 'Payslip marked as downloaded',
      data: result,
    });
  }
}

export default new PayslipController();
