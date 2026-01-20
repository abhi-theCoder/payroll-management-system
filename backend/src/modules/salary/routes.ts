import { Router } from 'express';
import salaryController from './controller';
import { authenticate, authorize } from '@shared/middleware/auth';
import { USER_ROLES } from '@shared/constants';

const router = Router();

router.use(authenticate);

/**
 * POST /salary - Create salary structure
 */
router.post(
  '/',
  authorize(USER_ROLES.ADMIN, USER_ROLES.HR, USER_ROLES.ACCOUNTS),
  (req, res, next) => salaryController.createSalaryStructure(req, res).catch(next),
);

/**
 * GET /salary/employee/:employeeId/active - Get active salary structure
 */
router.get('/employee/:employeeId/active', (req, res, next) =>
  salaryController.getActiveSalaryStructure(req, res).catch(next),
);

/**
 * GET /salary/:id - Get salary structure by ID
 */
router.get('/:id', (req, res, next) => salaryController.getSalaryStructure(req, res).catch(next));

/**
 * GET /salary/employee/:employeeId - Get all salary structures for employee
 */
router.get('/employee/:employeeId', (req, res, next) =>
  salaryController.getEmployeeSalaryStructures(req, res).catch(next),
);

/**
 * PUT /salary/:id - Update salary structure
 */
router.put(
  '/:id',
  authorize(USER_ROLES.ADMIN, USER_ROLES.HR, USER_ROLES.ACCOUNTS),
  (req, res, next) => salaryController.updateSalaryStructure(req, res).catch(next),
);

/**
 * POST /salary/:salaryStructureId/components - Add salary component
 */
router.post(
  '/:salaryStructureId/components',
  authorize(USER_ROLES.ADMIN, USER_ROLES.HR, USER_ROLES.ACCOUNTS),
  (req, res, next) => salaryController.addSalaryComponent(req, res).catch(next),
);

/**
 * POST /salary/:salaryStructureId/calculate - Calculate salary
 */
router.post('/:salaryStructureId/calculate', (req, res, next) =>
  salaryController.calculateSalary(req, res).catch(next),
);

export default router;
