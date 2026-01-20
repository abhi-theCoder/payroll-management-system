import { z } from 'zod';

export const CreateComplianceRecordSchema = z.object({
  employeeId: z.string().min(1),
  payrollId: z.string().optional(),
  complianceType: z.enum(['PF', 'ESI', 'PT', 'TDS']),
  amount: z.number().nonnegative(),
  month: z.number().min(1).max(12),
  year: z.number().min(2000).max(2100),
});

export type CreateComplianceRecordRequest = z.infer<typeof CreateComplianceRecordSchema>;
export type UpdateComplianceRecordRequest = Partial<CreateComplianceRecordRequest>;

export interface ComplianceCalculation {
  type: string;
  amount: number;
  percentage?: number;
  basis?: number;
}
