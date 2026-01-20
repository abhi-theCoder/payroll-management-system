/**
 * Application Constants
 */

// User Roles
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  HR: 'HR',
  ACCOUNTS: 'ACCOUNTS',
  EMPLOYEE: 'EMPLOYEE',
  MANAGER: 'MANAGER',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

// Salary Component Types
export const SALARY_COMPONENT_TYPES = {
  EARNING: 'EARNING',
  DEDUCTION: 'DEDUCTION',
  REIMBURSEMENT: 'REIMBURSEMENT',
} as const;

export type SalaryComponentType = (typeof SALARY_COMPONENT_TYPES)[keyof typeof SALARY_COMPONENT_TYPES];

// Salary Component Calculation Types
export const CALCULATION_TYPES = {
  FIXED: 'FIXED',
  PERCENTAGE: 'PERCENTAGE',
  FORMULA: 'FORMULA',
} as const;

export type CalculationType = (typeof CALCULATION_TYPES)[keyof typeof CALCULATION_TYPES];

// Payroll Status
export const PAYROLL_STATUS = {
  DRAFT: 'DRAFT',
  PROCESSING: 'PROCESSING',
  PROCESSED: 'PROCESSED',
  LOCKED: 'LOCKED',
  REJECTED: 'REJECTED',
} as const;

export type PayrollStatus = (typeof PAYROLL_STATUS)[keyof typeof PAYROLL_STATUS];

// Payslip Status
export const PAYSLIP_STATUS = {
  GENERATED: 'GENERATED',
  SENT: 'SENT',
  VIEWED: 'VIEWED',
  DOWNLOADED: 'DOWNLOADED',
} as const;

export type PayslipStatus = (typeof PAYSLIP_STATUS)[keyof typeof PAYSLIP_STATUS];

// Compliance Types
export const COMPLIANCE_TYPES = {
  PF: 'PF', // Provident Fund
  ESI: 'ESI', // Employee State Insurance
  PT: 'PT', // Professional Tax
  TDS: 'TDS', // Tax Deducted at Source
} as const;

export type ComplianceType = (typeof COMPLIANCE_TYPES)[keyof typeof COMPLIANCE_TYPES];

// Attendance Status
export const ATTENDANCE_STATUS = {
  PRESENT: 'PRESENT',
  ABSENT: 'ABSENT',
  HALF_DAY: 'HALF_DAY',
  LEAVE: 'LEAVE',
  HOLIDAY: 'HOLIDAY',
  WEEKEND: 'WEEKEND',
} as const;

export type AttendanceStatus = (typeof ATTENDANCE_STATUS)[keyof typeof ATTENDANCE_STATUS];

// Tax Exemption Sections
export const TAX_SECTIONS = {
  SECTION_80C: '80C', // Investments
  SECTION_80D: '80D', // Medical Insurance
  SECTION_80E: '80E', // Education Loan
  SECTION_80G: '80G', // Charity
  SECTION_80TTA: '80TTA', // Savings Account Interest
} as const;

export type TaxSection = (typeof TAX_SECTIONS)[keyof typeof TAX_SECTIONS];

// Leave Types
export const LEAVE_TYPES = {
  CASUAL_LEAVE: 'CASUAL_LEAVE',
  SICK_LEAVE: 'SICK_LEAVE',
  EARNED_LEAVE: 'EARNED_LEAVE',
  MATERNITY_LEAVE: 'MATERNITY_LEAVE',
  PATERNITY_LEAVE: 'PATERNITY_LEAVE',
  UNPAID_LEAVE: 'UNPAID_LEAVE',
  HALF_DAY_LEAVE: 'HALF_DAY_LEAVE',
} as const;

export type LeaveType = (typeof LEAVE_TYPES)[keyof typeof LEAVE_TYPES];

// Report Types
export const REPORT_TYPES = {
  SALARY_REGISTER: 'SALARY_REGISTER',
  BANK_TRANSFER: 'BANK_TRANSFER',
  COMPLIANCE_FILING: 'COMPLIANCE_FILING',
  TAX_SUMMARY: 'TAX_SUMMARY',
  COST_ANALYSIS: 'COST_ANALYSIS',
  ATTENDANCE_REPORT: 'ATTENDANCE_REPORT',
  LEAVE_REPORT: 'LEAVE_REPORT',
} as const;

export type ReportType = (typeof REPORT_TYPES)[keyof typeof REPORT_TYPES];

// Audit Action Types
export const AUDIT_ACTIONS = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  LOCK: 'LOCK',
  UNLOCK: 'UNLOCK',
  APPROVE: 'APPROVE',
  REJECT: 'REJECT',
  EXPORT: 'EXPORT',
} as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[keyof typeof AUDIT_ACTIONS];

// Page Size
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Error Codes
export const ERROR_CODES = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  DUPLICATE_RECORD: 'DUPLICATE_RECORD',
  PAYROLL_LOCKED: 'PAYROLL_LOCKED',
  INVALID_SALARY_STRUCTURE: 'INVALID_SALARY_STRUCTURE',
  COMPLIANCE_CALCULATION_ERROR: 'COMPLIANCE_CALCULATION_ERROR',
} as const;

export default {
  USER_ROLES,
  SALARY_COMPONENT_TYPES,
  CALCULATION_TYPES,
  PAYROLL_STATUS,
  PAYSLIP_STATUS,
  COMPLIANCE_TYPES,
  ATTENDANCE_STATUS,
  TAX_SECTIONS,
  LEAVE_TYPES,
  REPORT_TYPES,
  AUDIT_ACTIONS,
  ERROR_CODES,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
};
