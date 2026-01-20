import { z } from 'zod';

export const CreateEmployeeSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  dateOfBirth: z.string().datetime().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  department: z.string().optional(),
  designation: z.string().optional(),
  dateOfJoining: z.string().datetime(),
  employmentType: z.enum(['PERMANENT', 'CONTRACT', 'TEMPORARY']).default('PERMANENT'),
  panNumber: z.string().optional(),
  aadharNumber: z.string().optional(),
  accountNumber: z.string().optional(),
  ifscCode: z.string().optional(),
  uanNumber: z.string().optional(),
  esicNumber: z.string().optional(),
});

export type CreateEmployeeRequest = z.infer<typeof CreateEmployeeSchema>;

export const UpdateEmployeeSchema = CreateEmployeeSchema.partial();
export type UpdateEmployeeRequest = z.infer<typeof UpdateEmployeeSchema>;

export interface EmployeeResponse {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  department?: string;
  designation?: string;
  status: string;
  dateOfJoining: string;
}
