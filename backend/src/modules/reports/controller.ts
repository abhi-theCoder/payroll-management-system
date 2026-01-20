import { Request, Response } from 'express';
import reportsService from './service';

export class ReportsController {
  async generateSalaryRegister(req: Request, res: Response): Promise<void> {
    const { month, year, department } = req.query;

    if (!month || !year) {
      res.status(400).json({
        success: false,
        error: 'month and year are required',
      });
      return;
    }

    const result = await reportsService.generateSalaryRegister(
      parseInt(month as string),
      parseInt(year as string),
      department as string,
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  }

  async generateBankTransferReport(req: Request, res: Response): Promise<void> {
    const { month, year } = req.query;

    if (!month || !year) {
      res.status(400).json({
        success: false,
        error: 'month and year are required',
      });
      return;
    }

    const result = await reportsService.generateBankTransferReport(
      parseInt(month as string),
      parseInt(year as string),
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  }

  async generateComplianceReport(req: Request, res: Response): Promise<void> {
    const { month, year } = req.query;

    if (!month || !year) {
      res.status(400).json({
        success: false,
        error: 'month and year are required',
      });
      return;
    }

    const result = await reportsService.generateComplianceFilingReport(
      parseInt(month as string),
      parseInt(year as string),
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  }

  async generateTaxSummary(req: Request, res: Response): Promise<void> {
    const { financialYear } = req.query;

    if (!financialYear) {
      res.status(400).json({
        success: false,
        error: 'financialYear is required',
      });
      return;
    }

    const result = await reportsService.generateTaxSummaryReport(financialYear as string);

    res.status(200).json({
      success: true,
      data: result,
    });
  }

  async generateCostAnalysis(req: Request, res: Response): Promise<void> {
    const { month, year } = req.query;

    if (!month || !year) {
      res.status(400).json({
        success: false,
        error: 'month and year are required',
      });
      return;
    }

    const result = await reportsService.generateCostAnalysisReport(
      parseInt(month as string),
      parseInt(year as string),
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  }

  async generateAttendanceReport(req: Request, res: Response): Promise<void> {
    const { month, year, employeeId } = req.query;

    if (!month || !year) {
      res.status(400).json({
        success: false,
        error: 'month and year are required',
      });
      return;
    }

    const result = await reportsService.generateAttendanceReport(
      parseInt(month as string),
      parseInt(year as string),
      employeeId as string,
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  }
}

export default new ReportsController();
