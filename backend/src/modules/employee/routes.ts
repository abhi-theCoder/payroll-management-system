import { Router } from 'express';
import employeeController from './controller';
import { authenticate, authorize } from '@shared/middleware/auth';
import { USER_ROLES } from '@shared/constants';

const router = Router();

// All employee routes require authentication
router.use(authenticate);

/**
 * POST /employees - Create new employee
 */
router.post(
  '/',
  authorize(USER_ROLES.ADMIN, USER_ROLES.HR),
  (req, res, next) => employeeController.createEmployee(req, res).catch(next),
);

/**
 * GET /employees - Get all employees
 */
router.get('/', (req, res, next) => employeeController.getAllEmployees(req, res).catch(next));

/**
 * GET /employees/:id - Get employee by ID
 */
router.get('/:id', (req, res, next) => employeeController.getEmployee(req, res).catch(next));

/**
 * PUT /employees/:id - Update employee
 */
router.put(
  '/:id',
  authorize(USER_ROLES.ADMIN, USER_ROLES.HR),
  (req, res, next) => employeeController.updateEmployee(req, res).catch(next),
);

/**
 * POST /employees/:id/deactivate - Deactivate employee
 */
router.post(
  '/:id/deactivate',
  authorize(USER_ROLES.ADMIN, USER_ROLES.HR),
  (req, res, next) => employeeController.deactivateEmployee(req, res).catch(next),
);

/**
 * GET /employees/:id/salary-structure - Get employee salary structure
 */
router.get('/:id/salary-structure', (req, res, next) =>
  employeeController.getEmployeeSalaryStructure(req, res).catch(next),
);

export default router;
