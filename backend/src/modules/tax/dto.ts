import { z } from 'zod';

export const CreateTaxDeclarationSchema = z.object({
  employeeId: z.string().min(1),
  financialYear: z.string().regex(/^\d{4}-\d{4}$/),
  section80C: z.number().nonnegative().default(0),
  section80D: z.number().nonnegative().default(0),
  section80E: z.number().nonnegative().default(0),
  section80G: z.number().nonnegative().default(0),
  section80TTA: z.number().nonnegative().default(0),
});

export type CreateTaxDeclarationRequest = z.infer<typeof CreateTaxDeclarationSchema>;

export const UpdateTaxDeclarationSchema = CreateTaxDeclarationSchema.partial();
export type UpdateTaxDeclarationRequest = z.infer<typeof UpdateTaxDeclarationSchema>;
