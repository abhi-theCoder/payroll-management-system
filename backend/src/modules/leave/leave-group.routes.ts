import { Router } from 'express';
import * as LeaveGroupController from './leave-group.controller';

const router = Router();

router.post('/', LeaveGroupController.createGroup);
router.get('/', LeaveGroupController.listGroups);
router.get('/:id', LeaveGroupController.getGroup);
router.post('/assign-reviewer', LeaveGroupController.assignReviewer);
router.post('/assign-staff', LeaveGroupController.assignStaff);
router.get('/staff/listing', LeaveGroupController.getStaffListing);
router.get('/reviewers/eligible', LeaveGroupController.getEligibleReviewers);

export default router;
