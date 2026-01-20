/**
 * Application Exception Classes
 */

export class AppException extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: Record<string, any>;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_SERVER_ERROR',
    details?: Record<string, any>,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;

    Object.setPrototypeOf(this, AppException.prototype);
  }
}

export class ValidationException extends AppException {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 400, 'VALIDATION_ERROR', details);
    Object.setPrototypeOf(this, ValidationException.prototype);
  }
}

export class UnauthorizedException extends AppException {
  constructor(message: string = 'Unauthorized', details?: Record<string, any>) {
    super(message, 401, 'UNAUTHORIZED', details);
    Object.setPrototypeOf(this, UnauthorizedException.prototype);
  }
}

export class ForbiddenException extends AppException {
  constructor(message: string = 'Forbidden', details?: Record<string, any>) {
    super(message, 403, 'FORBIDDEN', details);
    Object.setPrototypeOf(this, ForbiddenException.prototype);
  }
}

export class NotFoundException extends AppException {
  constructor(resource: string, id?: string | number) {
    const message = id ? `${resource} with id ${id} not found` : `${resource} not found`;
    super(message, 404, 'NOT_FOUND');
    Object.setPrototypeOf(this, NotFoundException.prototype);
  }
}

export class ConflictException extends AppException {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 409, 'CONFLICT', details);
    Object.setPrototypeOf(this, ConflictException.prototype);
  }
}

export class DuplicateException extends ConflictException {
  constructor(resource: string, field?: string) {
    const message = field ? `${resource} with this ${field} already exists` : `${resource} already exists`;
    super(message);
    Object.setPrototypeOf(this, DuplicateException.prototype);
  }
}

export class BusinessRuleException extends AppException {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 422, 'BUSINESS_RULE_VIOLATION', details);
    Object.setPrototypeOf(this, BusinessRuleException.prototype);
  }
}

export class PayrollException extends BusinessRuleException {
  constructor(message: string, details?: Record<string, any>) {
    super(`Payroll Error: ${message}`, details);
    Object.setPrototypeOf(this, PayrollException.prototype);
  }
}

export class PayrollLockedException extends PayrollException {
  constructor(message: string = 'Payroll is locked and cannot be modified') {
    super(message);
    Object.setPrototypeOf(this, PayrollLockedException.prototype);
  }
}

export class ComplianceCalculationException extends AppException {
  constructor(message: string, details?: Record<string, any>) {
    super(`Compliance Calculation Error: ${message}`, 422, 'COMPLIANCE_CALCULATION_ERROR', details);
    Object.setPrototypeOf(this, ComplianceCalculationException.prototype);
  }
}
