import { Router } from 'express';
import * as TimesheetController from './timesheet.controller';
import { authenticate } from '@shared/middleware/auth';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Define routes
router.post('/submit', TimesheetController.submitTimesheet);
router.get('/week', TimesheetController.getMyTimesheet); // Support ?employeeId=...&date=...
router.get('/:id', TimesheetController.getTimesheet);
router.get('/employee/:employeeId', TimesheetController.getMyTimesheet); // Query param: weekStartDate
router.post('/review', TimesheetController.reviewTimesheet);

export default router;
