import { Router } from 'express';
import reportsController from './controller';
import { authenticate, authorize } from '@shared/middleware/auth';
import { USER_ROLES } from '@shared/constants';

const router = Router();

router.use(authenticate);

/**
 * GET /reports/salary-register - Generate salary register
 */
router.get(
  '/salary-register',
  authorize(USER_ROLES.ADMIN, USER_ROLES.ACCOUNTS),
  (req, res, next) => reportsController.generateSalaryRegister(req, res).catch(next),
);

/**
 * GET /reports/bank-transfer - Generate bank transfer report
 */
router.get(
  '/bank-transfer',
  authorize(USER_ROLES.ADMIN, USER_ROLES.ACCOUNTS),
  (req, res, next) => reportsController.generateBankTransferReport(req, res).catch(next),
);

/**
 * GET /reports/compliance - Generate compliance report
 */
router.get(
  '/compliance',
  authorize(USER_ROLES.ADMIN, USER_ROLES.ACCOUNTS),
  (req, res, next) => reportsController.generateComplianceReport(req, res).catch(next),
);

/**
 * GET /reports/tax-summary - Generate tax summary
 */
router.get(
  '/tax-summary',
  authorize(USER_ROLES.ADMIN, USER_ROLES.ACCOUNTS),
  (req, res, next) => reportsController.generateTaxSummary(req, res).catch(next),
);

/**
 * GET /reports/cost-analysis - Generate cost analysis
 */
router.get(
  '/cost-analysis',
  authorize(USER_ROLES.ADMIN, USER_ROLES.ACCOUNTS),
  (req, res, next) => reportsController.generateCostAnalysis(req, res).catch(next),
);

/**
 * GET /reports/attendance - Generate attendance report
 */
router.get('/attendance', (req, res, next) =>
  reportsController.generateAttendanceReport(req, res).catch(next),
);

export default router;
