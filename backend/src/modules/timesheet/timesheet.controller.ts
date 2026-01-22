/**
 * Timesheet Controller
 */
import { Request, Response } from 'express';
import prisma from '../../config/database';
import { TimesheetService } from './timesheet.service';
import { SubmitTimesheetSchema, ReviewTimesheetSchema } from './timesheet.validator';

const service = new TimesheetService(prisma);

export const submitTimesheet = async (req: Request, res: Response) => {
    // Basic validation
    const result = SubmitTimesheetSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: result.error.errors });
    }

    // Ensure user is submitting for themselves or has permission
    // For now assuming req.user.employeeId is present or checked
    // const requesterId = req.user?.id; 

    try {
        const timesheet = await service.submitTimesheet(result.data);
        return res.json(timesheet);
    } catch (e: any) {
        return res.status(500).json({ error: e.message });
    }
};

export const getTimesheet = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const timesheet = await service.getTimesheet(id);
        if (!timesheet) return res.status(404).json({ error: "Timesheet not found" });
        return res.json(timesheet);
    } catch (e: any) {
        return res.status(500).json({ error: e.message });
    }
};

export const getMyTimesheet = async (req: Request, res: Response) => {
    const { employeeId } = req.params; // Or from auth token
    const { weekStartDate } = req.query;

    if (!weekStartDate) return res.status(400).json({ error: "Week start date required" });

    try {
        const timesheet = await service.getTimesheetByWeek(employeeId, new Date(weekStartDate as string));
        return res.json(timesheet || { entries: [] }); // Return empty structure or null
    } catch (e: any) {
        return res.status(500).json({ error: e.message });
    }
}

export const reviewTimesheet = async (req: Request, res: Response) => {
    const result = ReviewTimesheetSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: result.error.errors });
    }

    // Mock approver ID from auth
    const approverId = "admin-id-placeholder"; // TODO: get from req.user

    try {
        const updated = await service.reviewTimesheet(approverId, result.data);
        return res.json(updated);
    } catch (e: any) {
        return res.status(500).json({ error: e.message });
    }
}
