// User & Authentication
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department?: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export enum UserRole {
  ADMIN = 'admin',
  HR = 'hr',
  PAYROLL = 'payroll',
  EMPLOYEE = 'employee',
}

// Employee
export interface Employee {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  joiningDate: Date;
  dateOfBirth?: Date;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  panNumber?: string;
  aadharNumber?: string;
  bankAccountNumber?: string;
  bankIFSCCode?: string;
  uanNumber?: string;
  workingDaysPerWeek: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEmployeeRequest {
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  joiningDate: Date;
  dateOfBirth?: Date;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  panNumber?: string;
  aadharNumber?: string;
  bankAccountNumber?: string;
  bankIFSCCode?: string;
  uanNumber?: string;
  workingDaysPerWeek?: number;
}

export interface UpdateEmployeeRequest extends Partial<CreateEmployeeRequest> {}

// Salary
export interface SalaryStructure {
  id: string;
  employeeId: string;
  baseSalary: number;
  dearness: number;
  houseRentAllowance: number;
  medicalAllowance: number;
  conveyanceAllowance: number;
  telephoneAllowance: number;
  specialAllowance: number;
  otherAllowances: number;
  totalEarnings: number;
  providentFund: number;
  employeeState: number;
  gratuity: number;
  otherDeductions: number;
  totalDeductions: number;
  netSalary: number;
  effectiveFrom: Date;
  effectiveTo?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSalaryStructureRequest {
  employeeId: string;
  baseSalary: number;
  dearness: number;
  houseRentAllowance: number;
  medicalAllowance: number;
  conveyanceAllowance: number;
  telephoneAllowance: number;
  specialAllowance: number;
  otherAllowances: number;
  providentFund: number;
  employeeState: number;
  gratuity: number;
  otherDeductions: number;
  effectiveFrom: Date;
}

export interface UpdateSalaryStructureRequest extends Partial<CreateSalaryStructureRequest> {}

// Payroll
export interface PayrollRun {
  id: string;
  month: number;
  year: number;
  status: PayrollStatus;
  totalEmployees: number;
  processedEmployees: number;
  totalAmount: number;
  startDate: Date;
  endDate: Date;
  processedAt?: Date;
  processedBy?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaySlip {
  id: string;
  employeeId: string;
  payrollRunId: string;
  month: number;
  year: number;
  baseSalary: number;
  allowances: AllowanceBreakdown;
  totalEarnings: number;
  deductions: DeductionBreakdown;
  totalDeductions: number;
  netPay: number;
  status: PayslipStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface AllowanceBreakdown {
  dearness: number;
  houseRentAllowance: number;
  medicalAllowance: number;
  conveyanceAllowance: number;
  telephoneAllowance: number;
  specialAllowance: number;
  otherAllowances: number;
}

export interface DeductionBreakdown {
  providentFund: number;
  employeeState: number;
  incomeTax: number;
  otherDeductions: number;
}

export enum PayrollStatus {
  DRAFT = 'draft',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum PayslipStatus {
  GENERATED = 'generated',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  RELEASED = 'released',
}

// Tax
export interface TaxDeclaration {
  id: string;
  employeeId: string;
  financialYear: string;
  section80C: number;
  section80D: number;
  section80E: number;
  section80G: number;
  otherDeductions: number;
  totalDeductions: number;
  incomeTax: number;
  status: TaxStatus;
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaxDeclarationRequest {
  employeeId: string;
  financialYear: string;
  section80C: number;
  section80D: number;
  section80E: number;
  section80G: number;
  otherDeductions: number;
}

export interface UpdateTaxDeclarationRequest extends Partial<CreateTaxDeclarationRequest> {}

export enum TaxStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

// Compliance
export interface Compliance {
  id: string;
  type: ComplianceType;
  status: ComplianceStatus;
  dueDate: Date;
  completedDate?: Date;
  notes?: string;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export enum ComplianceType {
  ESI = 'esi',
  PF = 'pf',
  PT = 'pt',
  TDS = 'tds',
  PROFESSIONAL_TAX = 'professional_tax',
  SALARY_AUDIT = 'salary_audit',
}

export enum ComplianceStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  OVERDUE = 'overdue',
}

// Reports
export interface ReportData {
  title: string;
  type: ReportType;
  format: ReportFormat;
  data: any;
  generatedAt: Date;
}

export enum ReportType {
  PAYROLL = 'payroll',
  TAX = 'tax',
  COMPLIANCE = 'compliance',
  ATTENDANCE = 'attendance',
}

export enum ReportFormat {
  PDF = 'pdf',
  EXCEL = 'excel',
  CSV = 'csv',
}

// API Response
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
  };
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
