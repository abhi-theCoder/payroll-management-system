/**
 * Leave Group Service
 * Business logic for leave groups
 */

import { PrismaClient } from '@prisma/client';
// import { UpdateLeaveApprovalGroupInput } from './leave.validator'; // Reuse or create new interface

export class LeaveGroupService {
    constructor(private prisma: PrismaClient) { }

    async createLeaveGroup(data: { name: string; description?: string }) {
        return this.prisma.leaveGroup.create({
            data: {
                name: data.name,
                description: data.description,
                active: true
            }
        });
    }

    async getLeaveGroups() {
        return this.prisma.leaveGroup.findMany({
            include: {
                reviewers: {
                    include: { reviewer: true },
                    orderBy: { level: 'asc' }
                },
                _count: {
                    select: { employees: true }
                }
            }
        });
    }

    async getLeaveGroupById(id: string) {
        return this.prisma.leaveGroup.findUnique({
            where: { id },
            include: {
                reviewers: {
                    include: { reviewer: true },
                    orderBy: { level: 'asc' }
                },
                employees: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        department: true,
                        designation: true
                    }
                }
            }
        });
    }

    async assignReviewer(leaveGroupId: string, reviewerId: string, level: number) {
        // Check if reviewer exists in group/level to prevent dupes (though schema has unique constraint)
        return this.prisma.leaveGroupReviewer.upsert({
            where: {
                leaveGroupId_level: {
                    leaveGroupId,
                    level
                }
            },
            update: {
                reviewerId
            },
            create: {
                leaveGroupId,
                reviewerId,
                level
            }
        });
    }

    async removeReviewer(leaveGroupId: string, reviewerId: string) {
        return this.prisma.leaveGroupReviewer.delete({
            where: {
                leaveGroupId_reviewerId: {
                    leaveGroupId,
                    reviewerId
                }
            }
        });
    }

    async assignEmployeeToGroup(leaveGroupId: string, employeeId: string) {
        // Check if group has at least one reviewer
        const reviewerCount = await this.prisma.leaveGroupReviewer.count({
            where: { leaveGroupId }
        });

        if (reviewerCount === 0) {
            throw new Error('At least one reviewer must be assigned to the group before adding staff members.');
        }

        return this.prisma.employee.update({
            where: { id: employeeId },
            data: { leaveGroupId }
        });
    }

    async removeEmployeeFromGroup(employeeId: string) {
        return this.prisma.employee.update({
            where: { id: employeeId },
            data: { leaveGroupId: null }
        });
    }

    // Get staff listing with group info
    async getStaffListing() {
        return this.prisma.employee.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                department: true,
                designation: true,
                leaveGroup: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
    }

    async getEligibleReviewers() {
        return this.prisma.user.findMany({
            where: {
                role: {
                    in: ['ADMIN', 'HR', 'MANAGER']
                },
                active: true
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true
            }
        });
    }
}
