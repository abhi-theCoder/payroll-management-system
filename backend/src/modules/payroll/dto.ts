import { z } from 'zod';

export const ProcessPayrollSchema = z.object({
  month: z.number().min(1).max(12),
  year: z.number().min(2000).max(2100),
  employeeIds: z.array(z.string()).optional(), // If empty, process all active employees
});

export type ProcessPayrollRequest = z.infer<typeof ProcessPayrollSchema>;

export interface PayrollCalculationData {
  employeeId: string;
  basicSalary: number;
  daysWorked: number;
  daysPresent: number;
  daysAbsent: number;
  daysLeave: number;
  earnings: number;
  deductions: number;
  grossSalary: number;
  netSalary: number;
  components: Record<string, number>;
  compliance: Record<string, number>;
}
