import { Router } from 'express';
import taxController from './controller';
import { authenticate, authorize } from '@shared/middleware/auth';
import { USER_ROLES } from '@shared/constants';

const router = Router();

router.use(authenticate);

/**
 * POST /tax/declarations - Create tax declaration
 */
router.post(
  '/declarations',
  authorize(USER_ROLES.EMPLOYEE),
  (req, res, next) => taxController.createDeclaration(req, res).catch(next),
);

/**
 * GET /tax/declarations/:id - Get declaration
 */
router.get('/declarations/:id', (req, res, next) => taxController.getDeclaration(req, res).catch(next));

/**
 * GET /tax/employee/:employeeId - Get all declarations for employee
 */
router.get('/employee/:employeeId', (req, res, next) =>
  taxController.getEmployeeDeclarations(req, res).catch(next),
);

/**
 * GET /tax/employee/:employeeId/fy/:financialYear - Get declaration by FY
 */
router.get('/employee/:employeeId/fy/:financialYear', (req, res, next) =>
  taxController.getDeclarationByFY(req, res).catch(next),
);

/**
 * PUT /tax/declarations/:id - Update declaration
 */
router.put(
  '/declarations/:id',
  authorize(USER_ROLES.EMPLOYEE),
  (req, res, next) => taxController.updateDeclaration(req, res).catch(next),
);

/**
 * POST /tax/employee/:employeeId/projection - Calculate tax projection
 */
router.post('/employee/:employeeId/projection', (req, res, next) =>
  taxController.calculateProjection(req, res).catch(next),
);

/**
 * GET /tax/declarations/:id/exemptions - Get exemption summary
 */
router.get('/declarations/:id/exemptions', (req, res, next) =>
  taxController.getExemptionSummary(req, res).catch(next),
);

/**
 * POST /tax/declarations/:id/verify - Verify declaration
 */
router.post(
  '/declarations/:id/verify',
  authorize(USER_ROLES.ACCOUNTS),
  (req, res, next) => taxController.verifyDeclaration(req, res).catch(next),
);

export default router;
