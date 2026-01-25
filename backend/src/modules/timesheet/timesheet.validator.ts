/**
 * Timesheet Validator
 * Input validation for timesheet operations
 */

import { z } from 'zod';

export const TimesheetEntrySchema = z.object({
    date: z.string().datetime().or(z.date()),
    dayOfWeek: z.string(),
    workHours: z.number().min(0).max(24).default(0),
    sickHours: z.number().min(0).max(8).default(0),
    personalHours: z.number().min(0).max(8).default(0),
    annualLeaveHours: z.number().min(0).max(8).default(0),
    comments: z.string().optional(),
}).refine((data) => {
    if (data.sickHours > 0 && data.sickHours !== 8) {
        return false;
    }
    if (data.personalHours > 0 && data.personalHours !== 8) {
        return false;
    }
    if (data.annualLeaveHours > 0 && data.annualLeaveHours !== 8) {
        return false;
    }
    return true;
}, {
    message: "Sick, Personal, and Annual leave hours must be exactly 8 hours or 0",
    path: ["sickHours", "personalHours", "annualLeaveHours"]
});

export const SubmitTimesheetSchema = z.object({
    employeeId: z.string().min(1, 'Employee ID is required'),
    weekStartDate: z.string().datetime().or(z.date()),
    entries: z.array(TimesheetEntrySchema),
    status: z.enum(['DRAFT', 'SUBMITTED']).default('DRAFT')
});

export const ReviewTimesheetSchema = z.object({
    timesheetId: z.string().min(1),
    status: z.enum(['APPROVED', 'REJECTED']),
    rejectionReason: z.string().optional(),
}).refine(data => {
    if (data.status === 'REJECTED' && !data.rejectionReason) {
        return false;
    }
    return true;
}, {
    message: "Rejection reason is required when rejecting",
    path: ["rejectionReason"]
});

export type TimesheetEntryInput = z.infer<typeof TimesheetEntrySchema>;
export type SubmitTimesheetInput = z.infer<typeof SubmitTimesheetSchema>;
export type ReviewTimesheetInput = z.infer<typeof ReviewTimesheetSchema>;
