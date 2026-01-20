import { z } from 'zod';
import { ValidationException } from '../exceptions';

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Parse and validate data against a Zod schema
 */
export function validateData<T>(schema: z.ZodSchema, data: unknown): T {
  try {
    return schema.parse(data) as T;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      throw new ValidationException('Validation failed', { errors });
    }
    throw error;
  }
}

/**
 * Safe validation without throwing
 */
export function safeParse<T>(schema: z.ZodSchema, data: unknown): { success: boolean; data?: T; errors?: ValidationError[] } {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors = result.error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    return { success: false, errors };
  }

  return { success: true, data: result.data as T };
}

export default {
  validateData,
  safeParse,
};
