import { Router } from 'express';
import payslipController from './controller';
import { authenticate, authorize } from '@shared/middleware/auth';
import { USER_ROLES } from '@shared/constants';

const router = Router();

router.use(authenticate);

/**
 * POST /payslips/generate/:payrollId - Generate payslip from payroll
 */
router.post(
  '/generate/:payrollId',
  authorize(USER_ROLES.ADMIN, USER_ROLES.ACCOUNTS),
  (req, res, next) => payslipController.generatePayslip(req, res).catch(next),
);

/**
 * GET /payslips/:id - Get payslip
 */
router.get('/:id', (req, res, next) => payslipController.getPayslip(req, res).catch(next));

/**
 * GET /payslips/payroll/:payrollId - Get payslip by payroll ID
 */
router.get('/payroll/:payrollId', (req, res, next) =>
  payslipController.getPayslipByPayroll(req, res).catch(next),
);

/**
 * GET /payslips/employee/:employeeId - Get all payslips for employee
 */
router.get('/employee/:employeeId', (req, res, next) =>
  payslipController.getEmployeePayslips(req, res).catch(next),
);

/**
 * POST /payslips/:id/send - Mark as sent
 */
router.post('/:id/send', authorize(USER_ROLES.ACCOUNTS, USER_ROLES.HR), (req, res, next) =>
  payslipController.markAsSent(req, res).catch(next),
);

/**
 * POST /payslips/:id/view - Mark as viewed
 */
router.post('/:id/view', (req, res, next) => payslipController.markAsViewed(req, res).catch(next));

/**
 * POST /payslips/:id/download - Mark as downloaded
 */
router.post('/:id/download', (req, res, next) =>
  payslipController.markAsDownloaded(req, res).catch(next),
);

export default router;
