import { Router } from 'express';
import payrollController from './controller';
import { authenticate, authorize } from '@shared/middleware/auth';
import { USER_ROLES } from '@shared/constants';

const router = Router();

router.use(authenticate);

/**
 * POST /payroll/process - Process payroll
 */
router.post(
  '/process',
  authorize(USER_ROLES.ADMIN, USER_ROLES.ACCOUNTS),
  (req, res, next) => payrollController.processPayroll(req, res).catch(next),
);

/**
 * GET /payroll/:id - Get payroll
 */
router.get('/:id', (req, res, next) => payrollController.getPayroll(req, res).catch(next));

/**
 * GET /payroll/employee/:employeeId/month - Get payroll for employee by month
 */
router.get('/employee/:employeeId/month', (req, res, next) =>
  payrollController.getEmployeePayroll(req, res).catch(next),
);

/**
 * GET /payroll/employee/:employeeId - Get all payrolls for employee
 */
router.get('/employee/:employeeId', (req, res, next) =>
  payrollController.getEmployeePayrolls(req, res).catch(next),
);

/**
 * POST /payroll/:id/lock - Lock payroll
 */
router.post(
  '/:id/lock',
  authorize(USER_ROLES.ADMIN, USER_ROLES.ACCOUNTS),
  (req, res, next) => payrollController.lockPayroll(req, res).catch(next),
);

/**
 * POST /payroll/:id/reject - Reject payroll
 */
router.post(
  '/:id/reject',
  authorize(USER_ROLES.ADMIN, USER_ROLES.ACCOUNTS),
  (req, res, next) => payrollController.rejectPayroll(req, res).catch(next),
);

export default router;
