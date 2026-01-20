export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  EMPLOYEES: {
    LIST: '/employees',
    GET: (id: string) => `/employees/${id}`,
    CREATE: '/employees',
    UPDATE: (id: string) => `/employees/${id}`,
    DELETE: (id: string) => `/employees/${id}`,
    SEARCH: '/employees/search',
  },
  SALARY: {
    LIST: '/salary-structures',
    GET: (id: string) => `/salary-structures/${id}`,
    CREATE: '/salary-structures',
    UPDATE: (id: string) => `/salary-structures/${id}`,
    DELETE: (id: string) => `/salary-structures/${id}`,
  },
  PAYROLL: {
    LIST: '/payroll',
    GET: (id: string) => `/payroll/${id}`,
    CREATE: '/payroll',
    PROCESS: (id: string) => `/payroll/${id}/process`,
  },
  PAYSLIPS: {
    LIST: '/payslips',
    GET: (id: string) => `/payslips/${id}`,
    DOWNLOAD: (id: string) => `/payslips/${id}/download`,
  },
  TAX: {
    LIST: '/tax-declarations',
    GET: (id: string) => `/tax-declarations/${id}`,
    CREATE: '/tax-declarations',
    UPDATE: (id: string) => `/tax-declarations/${id}`,
  },
  COMPLIANCE: {
    LIST: '/compliance',
    GET: (id: string) => `/compliance/${id}`,
    CREATE: '/compliance',
    UPDATE: (id: string) => `/compliance/${id}`,
  },
};

export const USER_ROLES = {
  ADMIN: 'admin',
  HR: 'hr',
  PAYROLL: 'payroll',
  EMPLOYEE: 'employee',
};

export const PAYROLL_STATUS = {
  DRAFT: 'draft',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
};

export const PAYSLIP_STATUS = {
  GENERATED: 'generated',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  RELEASED: 'released',
};

export const TAX_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export const COMPLIANCE_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  OVERDUE: 'overdue',
};

export const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];
