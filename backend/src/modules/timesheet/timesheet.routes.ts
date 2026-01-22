import { Router } from 'express';
import * as TimesheetController from './timesheet.controller';

const router = Router();

// Define routes
router.post('/submit', TimesheetController.submitTimesheet);
router.get('/:id', TimesheetController.getTimesheet);
router.get('/employee/:employeeId', TimesheetController.getMyTimesheet); // Query param: weekStartDate
router.post('/review', TimesheetController.reviewTimesheet);

export default router;
