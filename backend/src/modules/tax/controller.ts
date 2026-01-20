import { Request, Response } from 'express';
import taxService from './service';
import { validateData } from '@shared/utils/validators';
import { CreateTaxDeclarationSchema, UpdateTaxDeclarationSchema } from './dto';

export class TaxController {
  async createDeclaration(req: Request, res: Response): Promise<void> {
    const data: any = validateData(CreateTaxDeclarationSchema, req.body);
    const result = await taxService.createTaxDeclaration(data);

    res.status(201).json({
      success: true,
      message: 'Tax declaration created successfully',
      data: result,
    });
  }

  async getDeclaration(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const result = await taxService.getTaxDeclaration(id);

    res.status(200).json({
      success: true,
      data: result,
    });
  }

  async getEmployeeDeclarations(req: Request, res: Response): Promise<void> {
    const { employeeId } = req.params;
    const result = await taxService.getEmployeeTaxDeclarations(employeeId);

    res.status(200).json({
      success: true,
      data: result,
    });
  }

  async getDeclarationByFY(req: Request, res: Response): Promise<void> {
    const { employeeId, financialYear } = req.params;
    const result = await taxService.getTaxDeclarationByFY(employeeId, financialYear);

    res.status(200).json({
      success: true,
      data: result,
    });
  }

  async updateDeclaration(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const data: any = validateData(UpdateTaxDeclarationSchema, req.body);
    const result = await taxService.updateTaxDeclaration(id, data);

    res.status(200).json({
      success: true,
      message: 'Tax declaration updated successfully',
      data: result,
    });
  }

  async calculateProjection(req: Request, res: Response): Promise<void> {
    const { employeeId } = req.params;
    const { monthlyGrossSalary, monthlyBasic, financialYear } = req.body;

    if (!monthlyGrossSalary || !monthlyBasic) {
      res.status(400).json({
        success: false,
        error: 'monthlyGrossSalary and monthlyBasic are required',
      });
      return;
    }

    const result = await taxService.calculateTaxProjection(
      employeeId,
      monthlyGrossSalary,
      monthlyBasic,
      financialYear,
    );

    res.status(200).json({
      success: true,
      message: 'Tax projection calculated successfully',
      data: result,
    });
  }

  async getExemptionSummary(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const result = await taxService.getExemptionSummary(id);

    res.status(200).json({
      success: true,
      data: result,
    });
  }

  async verifyDeclaration(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const result = await taxService.verifyTaxDeclaration(id);

    res.status(200).json({
      success: true,
      message: 'Tax declaration verified successfully',
      data: result,
    });
  }
}

export default new TaxController();
