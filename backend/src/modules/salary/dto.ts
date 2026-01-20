import { z } from 'zod';

export const CreateSalaryComponentSchema = z.object({
  name: z.string().min(1, 'Component name is required'),
  type: z.enum(['EARNING', 'DEDUCTION', 'REIMBURSEMENT']),
  calculationType: z.enum(['FIXED', 'PERCENTAGE', 'FORMULA']),
  value: z.number().positive('Value must be positive'),
  formula: z.string().optional(),
  dependsOn: z.string().optional(),
  isOptional: z.boolean().default(false),
});

export type CreateSalaryComponentRequest = z.infer<typeof CreateSalaryComponentSchema>;

export const CreateSalaryStructureSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  name: z.string().min(1, 'Salary structure name is required'),
  effectiveFrom: z.string().datetime(),
  effectiveUntil: z.string().datetime().optional(),
  basicSalary: z.number().positive('Basic salary must be positive'),
  ctc: z.number().positive('CTC must be positive'),
  hra: z.number().optional(),
  dearness: z.number().optional(),
  conveyance: z.number().optional(),
  medical: z.number().optional(),
  other: z.number().optional(),
  components: z.array(CreateSalaryComponentSchema).optional(),
});

export type CreateSalaryStructureRequest = z.infer<typeof CreateSalaryStructureSchema>;

export const UpdateSalaryStructureSchema = CreateSalaryStructureSchema.partial();
export type UpdateSalaryStructureRequest = z.infer<typeof UpdateSalaryStructureSchema>;

export interface SalaryStructureResponse {
  id: string;
  employeeId: string;
  name: string;
  basicSalary: number;
  ctc: number;
  effectiveFrom: string;
  effectiveUntil?: string;
  components: any[];
}
