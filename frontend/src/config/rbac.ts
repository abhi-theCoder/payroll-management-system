/**
 * Role-Based Access Control System
 * Defines roles, permissions, and menu visibility
 */

import { UserRole } from '@/types/models';

export { UserRole };

export enum Permission {
  // Dashboard
  VIEW_DASHBOARD = 'VIEW_DASHBOARD',

  // Employee Management
  VIEW_EMPLOYEES = 'VIEW_EMPLOYEES',
  CREATE_EMPLOYEE = 'CREATE_EMPLOYEE',
  EDIT_EMPLOYEE = 'EDIT_EMPLOYEE',
  DELETE_EMPLOYEE = 'DELETE_EMPLOYEE',

  // Salary Structure
  VIEW_SALARY_STRUCTURE = 'VIEW_SALARY_STRUCTURE',
  EDIT_SALARY_STRUCTURE = 'EDIT_SALARY_STRUCTURE',

  // Payroll Processing
  VIEW_PAYROLL = 'VIEW_PAYROLL',
  EXECUTE_PAYROLL = 'EXECUTE_PAYROLL',
  LOCK_PAYROLL = 'LOCK_PAYROLL',
  APPROVE_PAYROLL = 'APPROVE_PAYROLL',

  // Payslips
  VIEW_PAYSLIPS = 'VIEW_PAYSLIPS',
  DOWNLOAD_PAYSLIP = 'DOWNLOAD_PAYSLIP',

  // Compliance & Tax
  VIEW_COMPLIANCE = 'VIEW_COMPLIANCE',
  MANAGE_COMPLIANCE = 'MANAGE_COMPLIANCE',
  VIEW_TAX_DECLARATIONS = 'VIEW_TAX_DECLARATIONS',
  FILE_TAX_RETURNS = 'FILE_TAX_RETURNS',

  // Reports
  VIEW_REPORTS = 'VIEW_REPORTS',
  EXPORT_REPORTS = 'EXPORT_REPORTS',

  // Settings
  VIEW_SETTINGS = 'VIEW_SETTINGS',
  MANAGE_SETTINGS = 'MANAGE_SETTINGS',
  MANAGE_USERS = 'MANAGE_USERS',
  MANAGE_ROLES = 'MANAGE_ROLES',

  // Attendance
  VIEW_ATTENDANCE = 'VIEW_ATTENDANCE',
  MANAGE_ATTENDANCE = 'MANAGE_ATTENDANCE',

  // Leave Management
  VIEW_LEAVE = 'VIEW_LEAVE',
  APPLY_LEAVE = 'APPLY_LEAVE',
  APPROVE_LEAVE = 'APPROVE_LEAVE',

  // Profile
  VIEW_PROFILE = 'VIEW_PROFILE',
  EDIT_PROFILE = 'EDIT_PROFILE',
  VIEW_TIMESHEET = 'VIEW_TIMESHEET',
}

// Role to Permissions Mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    // All permissions
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_EMPLOYEES,
    Permission.CREATE_EMPLOYEE,
    Permission.EDIT_EMPLOYEE,
    Permission.DELETE_EMPLOYEE,
    Permission.VIEW_SALARY_STRUCTURE,
    Permission.EDIT_SALARY_STRUCTURE,
    Permission.VIEW_PAYROLL,
    Permission.EXECUTE_PAYROLL,
    Permission.LOCK_PAYROLL,
    Permission.APPROVE_PAYROLL,
    Permission.VIEW_PAYSLIPS,
    Permission.DOWNLOAD_PAYSLIP,
    Permission.VIEW_COMPLIANCE,
    Permission.MANAGE_COMPLIANCE,
    Permission.VIEW_TAX_DECLARATIONS,
    Permission.FILE_TAX_RETURNS,
    Permission.VIEW_REPORTS,
    Permission.EXPORT_REPORTS,
    Permission.VIEW_SETTINGS,
    Permission.MANAGE_SETTINGS,
    Permission.MANAGE_USERS,
    Permission.MANAGE_ROLES,
    Permission.VIEW_ATTENDANCE,
    Permission.MANAGE_ATTENDANCE,
    Permission.VIEW_LEAVE,
    Permission.APPLY_LEAVE,
    Permission.APPROVE_LEAVE,
    Permission.VIEW_PROFILE,
    Permission.EDIT_PROFILE,
    Permission.VIEW_TIMESHEET,
  ],

  [UserRole.HR]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_SALARY_STRUCTURE,
    Permission.VIEW_PAYROLL,
    Permission.VIEW_PAYSLIPS,
    Permission.DOWNLOAD_PAYSLIP,
    Permission.VIEW_COMPLIANCE,
    Permission.VIEW_TAX_DECLARATIONS,
    Permission.VIEW_REPORTS,
    Permission.VIEW_ATTENDANCE,
    Permission.MANAGE_ATTENDANCE,
    Permission.VIEW_LEAVE,
    Permission.APPROVE_LEAVE,
    Permission.VIEW_PROFILE,
    Permission.EDIT_PROFILE,
    Permission.VIEW_TIMESHEET,
  ],

  [UserRole.PAYROLL]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_SALARY_STRUCTURE,
    Permission.VIEW_PAYROLL,
    Permission.EXECUTE_PAYROLL,
    Permission.LOCK_PAYROLL,
    Permission.VIEW_PAYSLIPS,
    Permission.DOWNLOAD_PAYSLIP,
    Permission.VIEW_COMPLIANCE,
    Permission.MANAGE_COMPLIANCE,
    Permission.VIEW_TAX_DECLARATIONS,
    Permission.FILE_TAX_RETURNS,
    Permission.VIEW_REPORTS,
    Permission.EXPORT_REPORTS,
    Permission.VIEW_PROFILE,
    Permission.EDIT_PROFILE,
    Permission.VIEW_TIMESHEET,
  ],

  [UserRole.EMPLOYEE]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_PAYSLIPS,
    Permission.DOWNLOAD_PAYSLIP,
    Permission.VIEW_LEAVE,
    Permission.APPLY_LEAVE,
    Permission.VIEW_PROFILE,
    Permission.EDIT_PROFILE,
    Permission.VIEW_TIMESHEET,
  ],

  [UserRole.MANAGER]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_PAYSLIPS,
    Permission.DOWNLOAD_PAYSLIP,
    Permission.VIEW_LEAVE,
    Permission.APPLY_LEAVE,
    Permission.APPROVE_LEAVE,
    Permission.VIEW_PROFILE,
    Permission.EDIT_PROFILE,
    Permission.VIEW_TIMESHEET,
  ],
};

export interface MenuItem {
  id: string;
  label: string;
  icon: string; // Lucide icon name
  href?: string;
  permissions: Permission[];
  children?: MenuItem[];
  badge?: string | number;
}

// Sidebar Menu Structure
export const SIDEBAR_MENU: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    href: '/dashboard',
    permissions: [Permission.VIEW_DASHBOARD],
  },
  {
    id: 'employees',
    label: 'Employee Management',
    icon: 'Users',
    permissions: [Permission.VIEW_EMPLOYEES, Permission.VIEW_LEAVE, Permission.VIEW_ATTENDANCE],
    children: [
      {
        id: 'employees-list',
        label: 'All Employees',
        icon: 'UserCheck',
        href: '/dashboard/employees',
        permissions: [Permission.VIEW_EMPLOYEES],
      },
      {
        id: 'employees-add',
        label: 'Add Employee',
        icon: 'UserPlus',
        href: '/dashboard/employees/new',
        permissions: [Permission.CREATE_EMPLOYEE],
      },
      {
        id: 'attendance',
        label: 'Attendance',
        icon: 'Calendar',
        href: '/dashboard/attendance',
        permissions: [Permission.VIEW_ATTENDANCE],
      },
      {
        id: 'leave',
        label: 'Leave Management',
        icon: 'Clock',
        href: '/dashboard/leave',
        permissions: [Permission.VIEW_LEAVE],
      },
      {
        id: 'leave-groups',
        label: 'Leave Groups',
        icon: 'Settings',
        href: '/dashboard/leave-groups',
        permissions: [Permission.MANAGE_SETTINGS],
      },
      {
        id: 'timesheets',
        label: 'Timesheet Management',
        icon: 'FileSpreadsheet',
        href: '/dashboard/timesheet',
        permissions: [Permission.VIEW_TIMESHEET],
      },
    ],
  },
  {
    id: 'salary',
    label: 'Salary & Payroll',
    icon: 'DollarSign',
    permissions: [Permission.VIEW_SALARY_STRUCTURE],
    children: [
      {
        id: 'salary-structure',
        label: 'Salary Structure',
        icon: 'BarChart3',
        href: '/dashboard/salary',
        permissions: [Permission.VIEW_SALARY_STRUCTURE],
      },
      {
        id: 'payroll-processing',
        label: 'Payroll Processing',
        icon: 'Settings2',
        href: '/dashboard/payroll',
        permissions: [Permission.VIEW_PAYROLL],
      },
      {
        id: 'payslips',
        label: 'Payslips',
        icon: 'FileText',
        href: '/dashboard/payslips',
        permissions: [Permission.VIEW_PAYSLIPS],
      },
    ],
  },
  {
    id: 'compliance',
    label: 'Compliance & Tax',
    icon: 'ShieldAlert',
    permissions: [Permission.VIEW_COMPLIANCE],
    children: [
      {
        id: 'compliance-tracking',
        label: 'Compliance Tracking',
        icon: 'CheckCircle',
        href: '/dashboard/compliance',
        permissions: [Permission.VIEW_COMPLIANCE],
      },
      {
        id: 'tax-declarations',
        label: 'Tax Declarations',
        icon: 'FileCheck',
        href: '/dashboard/tax',
        permissions: [Permission.VIEW_TAX_DECLARATIONS],
      },
    ],
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: 'BarChart',
    href: '/dashboard/reports',
    permissions: [Permission.VIEW_REPORTS],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'Settings',
    href: '/dashboard/settings',
    permissions: [Permission.VIEW_SETTINGS],
  },
  {
    id: 'profile',
    label: 'My Profile',
    icon: 'User',
    href: '/dashboard/profile',
    permissions: [Permission.VIEW_PROFILE],
  },
];

/**
 * Check if user has permission
 */
export function hasPermission(userRole: UserRole | undefined | null, permission: Permission): boolean {
  if (!userRole || !ROLE_PERMISSIONS[userRole]) {
    return false;
  }
  return ROLE_PERMISSIONS[userRole].includes(permission);
}

/**
 * Get visible menu items based on user role
 */
export function getVisibleMenuItems(userRole: UserRole | undefined | null): MenuItem[] {
  if (!userRole || !ROLE_PERMISSIONS[userRole]) {
    return [];
  }
  return SIDEBAR_MENU.filter((item) => hasPermissionForMenu(userRole, item)).map((item) => ({
    ...item,
    children: item.children?.filter((child) => hasPermissionForMenu(userRole, child)),
  }));
}

/**
 * Check if user has permission for a menu item
 */
function hasPermissionForMenu(userRole: UserRole | undefined | null, item: MenuItem): boolean {
  if (!userRole) {
    return false;
  }
  return item.permissions.some((permission) => hasPermission(userRole, permission));
}
