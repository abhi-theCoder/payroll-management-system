/**
 * Timesheet Service
 */

import { PrismaClient } from '@prisma/client';
import { SubmitTimesheetInput, ReviewTimesheetInput } from './timesheet.validator';

export class TimesheetService {
    constructor(private prisma: PrismaClient) { }

    async submitTimesheet(input: SubmitTimesheetInput) {
        const startDate = new Date(input.weekStartDate);
        startDate.setHours(0, 0, 0, 0); // Normalize to start of day

        // Calculate end date (6 days after start)
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);

        // Upsert the main timesheet record
        const timesheet = await this.prisma.timesheet.upsert({
            where: {
                employeeId_weekStartDate: {
                    employeeId: input.employeeId,
                    weekStartDate: startDate,
                }
            },
            update: {
                status: input.status,
                submittedAt: input.status === 'SUBMITTED' ? new Date() : undefined,
            },
            create: {
                employeeId: input.employeeId,
                weekStartDate: startDate,
                weekEndDate: endDate,
                status: input.status,
                submittedAt: input.status === 'SUBMITTED' ? new Date() : undefined,
            },
        });

        // Handle Entries
        // We wipe existing entries for dates provided and re-create them, or allow strict updates.
        // For simplicity, we can upsert each entry based on (timesheetId, date)

        // Actually, simpler to delete entries for this timesheet and re-create if it's a full sync
        // But let's verify if we receive all entries. Usually UI sends valid 7 days or we handle partial.
        // Let's use transaction for safety.

        await this.prisma.$transaction(async (tx) => {
            // Create/Update entries
            for (const entry of input.entries) {
                const entryDate = new Date(entry.date);
                entryDate.setHours(0, 0, 0, 0);

                const totalHours = (entry.workHours || 0) + (entry.sickHours || 0) + (entry.personalHours || 0);

                // Check if entry exists for this date/timesheet
                const existing = await tx.timesheetEntry.findFirst({
                    where: {
                        timesheetId: timesheet.id,
                        date: entryDate
                    }
                });

                if (existing) {
                    await tx.timesheetEntry.update({
                        where: { id: existing.id },
                        data: {
                            workHours: entry.workHours,
                            sickHours: entry.sickHours,
                            personalHours: entry.personalHours,
                            totalHours: totalHours,
                            comments: entry.comments,
                            dayOfWeek: entry.dayOfWeek
                        }
                    });
                } else {
                    await tx.timesheetEntry.create({
                        data: {
                            timesheetId: timesheet.id,
                            date: entryDate,
                            dayOfWeek: entry.dayOfWeek,
                            workHours: entry.workHours,
                            sickHours: entry.sickHours,
                            personalHours: entry.personalHours,
                            totalHours: totalHours,
                            comments: entry.comments,
                        }
                    });
                }
            }
        });

        return this.getTimesheet(timesheet.id);
    }

    async getTimesheet(id: string) {
        return this.prisma.timesheet.findUnique({
            where: { id },
            include: {
                entries: {
                    orderBy: { date: 'asc' }
                },
                employee: {
                    select: {
                        firstName: true,
                        lastName: true,
                        employeeId: true
                    }
                }
            }
        });
    }

    async getTimesheetByWeek(employeeId: string, weekStartDate: Date) {
        const startDate = new Date(weekStartDate);
        startDate.setHours(0, 0, 0, 0);

        return this.prisma.timesheet.findUnique({
            where: {
                employeeId_weekStartDate: {
                    employeeId,
                    weekStartDate: startDate
                }
            },
            include: {
                entries: {
                    orderBy: { date: 'asc' }
                }
            }
        });
    }

    async listTimesheets(filters: { status?: string, employeeId?: string }) {
        return this.prisma.timesheet.findMany({
            where: {
                status: filters.status,
                employeeId: filters.employeeId
            },
            include: {
                employee: true,
                entries: true
            },
            orderBy: { weekStartDate: 'desc' },
            take: 50
        });
    }

    async reviewTimesheet(approverId: string, input: ReviewTimesheetInput) {
        const timesheet = await this.prisma.timesheet.findUnique({ where: { id: input.timesheetId } });
        if (!timesheet) throw new Error("Timesheet not found");

        // Verify approver permissions (e.g. is this user a manager of the employee?) -> Omitted for brevity, assume Auth Logic checks role or we add check here

        return this.prisma.timesheet.update({
            where: { id: input.timesheetId },
            data: {
                status: input.status,
                approvedBy: approverId,
                approvedAt: new Date(),
                rejectionReason: input.status === 'REJECTED' ? input.rejectionReason : null
            }
        });
    }
}
