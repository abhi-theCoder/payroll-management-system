/**
 * Leave Group Controller
 */
import { Request, Response } from 'express';
import prisma from '../../config/database';
import { LeaveGroupService } from './leave-group.service';
import { z } from 'zod';

const service = new LeaveGroupService(prisma);

// Schemas for validation (can move to validator file)
const CreateGroupSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional()
});

const AssignReviewerSchema = z.object({
    leaveGroupId: z.string(),
    reviewerId: z.string(),
    level: z.number().min(1)
});

const AssignStaffSchema = z.object({
    leaveGroupId: z.string(),
    employeeId: z.string() // or array of IDs
});

export const createGroup = async (req: Request, res: Response) => {
    const result = CreateGroupSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json({ error: result.error.errors });

    try {
        const group = await service.createLeaveGroup(result.data);
        return res.json({ success: true, data: group });
    } catch (e: any) {
        return res.status(500).json({ success: false, error: e.message });
    }
};

export const listGroups = async (_req: Request, res: Response) => {
    try {
        const groups = await service.getLeaveGroups();
        return res.json({ success: true, data: groups });
    } catch (e: any) {
        return res.status(500).json({ success: false, error: e.message });
    }
};

export const getGroup = async (req: Request, res: Response) => {
    try {
        const group = await service.getLeaveGroupById(req.params.id);
        if (!group) return res.status(404).json({ success: false, error: "Group not found" });
        return res.json({ success: true, data: group });
    } catch (e: any) {
        return res.status(500).json({ success: false, error: e.message });
    }
};

export const assignReviewer = async (req: Request, res: Response) => {
    const result = AssignReviewerSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json({ success: false, error: result.error.errors });

    try {
        const reviewer = await service.assignReviewer(result.data.leaveGroupId, result.data.reviewerId, result.data.level);
        return res.json({ success: true, data: reviewer });
    } catch (e: any) {
        return res.status(500).json({ success: false, error: e.message });
    }
};

export const assignStaff = async (req: Request, res: Response) => {
    const result = AssignStaffSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json({ success: false, error: result.error.errors });

    try {
        const staff = await service.assignEmployeeToGroup(result.data.leaveGroupId, result.data.employeeId);
        return res.json({ success: true, data: staff });
    } catch (e: any) {
        return res.status(500).json({ success: false, error: e.message });
    }
};

export const getStaffListing = async (_req: Request, res: Response) => {
    try {
        const staffs = await service.getStaffListing();
        return res.json({ success: true, data: staffs });
    } catch (e: any) {
        return res.status(500).json({ success: false, error: e.message });
    }
};

export const getEligibleReviewers = async (_req: Request, res: Response) => {
    try {
        const reviewers = await service.getEligibleReviewers();
        return res.json({ success: true, data: reviewers });
    } catch (e: any) {
        return res.status(500).json({ success: false, error: e.message });
    }
};
