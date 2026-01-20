import { Router } from 'express';
import complianceController from './controller';
import { authenticate, authorize } from '@shared/middleware/auth';
import { USER_ROLES } from '@shared/constants';

const router = Router();

router.use(authenticate);

/**
 * POST /compliance/calculate - Calculate compliance deductions
 */
router.post('/calculate', (req, res, next) => complianceController.calculateDeductions(req, res).catch(next));

/**
 * POST /compliance/records - Create compliance record
 */
router.post(
  '/records',
  authorize(USER_ROLES.ADMIN, USER_ROLES.ACCOUNTS),
  (req, res, next) => complianceController.createRecord(req, res).catch(next),
);

/**
 * GET /compliance/records/:id - Get compliance record
 */
router.get('/records/:id', (req, res, next) => complianceController.getRecord(req, res).catch(next));

/**
 * GET /compliance/employee/:employeeId - Get employee compliance records
 */
router.get('/employee/:employeeId', (req, res, next) =>
  complianceController.getEmployeeRecords(req, res).catch(next),
);

/**
 * GET /compliance/by-type - Get records by type
 */
router.get('/by-type', (req, res, next) => complianceController.getRecordsByType(req, res).catch(next));

/**
 * POST /compliance/records/:id/file - Mark record as filed
 */
router.post('/records/:id/file', authorize(USER_ROLES.ACCOUNTS), (req, res, next) =>
  complianceController.markAsFiled(req, res).catch(next),
);

/**
 * GET /compliance/report - Generate compliance report
 */
router.get('/report', authorize(USER_ROLES.ACCOUNTS), (req, res, next) =>
  complianceController.generateReport(req, res).catch(next),
);

export default router;
