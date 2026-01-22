/**
 * Main routes index file
 */

import { Router } from 'express';
import authRoutes from '@modules/auth/routes';
import employeeRoutes from '@modules/employee/routes';
import salaryRoutes from '@modules/salary/routes';
import complianceRoutes from '@modules/compliance/routes';
import taxRoutes from '@modules/tax/routes';
import payrollRoutes from '@modules/payroll/routes';
import payslipRoutes from '@modules/payslip/routes';
import reportsRoutes from '@modules/reports/routes';
import timesheetRoutes from '@modules/timesheet/timesheet.routes';
import leaveGroupRoutes from '@modules/leave/leave-group.routes';
import leaveRoutes from '@modules/leave/routes';

const router = Router();

// Mount all module routes
router.use('/auth', authRoutes);
router.use('/employees', employeeRoutes);
router.use('/salary', salaryRoutes);
router.use('/compliance', complianceRoutes);
router.use('/tax', taxRoutes);
router.use('/payroll', payrollRoutes);
router.use('/payslips', payslipRoutes);
router.use('/reports', reportsRoutes);
router.use('/timesheet', timesheetRoutes);
router.use('/leave-groups', leaveGroupRoutes);
router.use('/leave', leaveRoutes);

export default router;
