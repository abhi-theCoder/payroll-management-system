/**
 * Leave Routes
 * API endpoints for leave management
 */

import { Router, Request, Response } from 'express';
import { LeaveController } from './leave.controller';
import { authenticate } from '../../shared/middleware/auth';
import { authorizeRole } from '../../shared/middleware/authorization';
import { PrismaClient } from '@prisma/client';
import { AuditLogger } from '@shared/utils/audit';

export function createLeaveRoutes(prisma: PrismaClient, auditLogger: AuditLogger): Router {
  const router = Router();
  const controller = new LeaveController(prisma, auditLogger);

  // ==================== EMPLOYEE ROUTES ====================

  // Apply for leave
  router.post('/apply', authenticate, (req, res) =>
    controller.applyLeave(req, res),
  );

  // Get leave history
  router.get('/history', authenticate, (req, res) =>
    controller.getLeaveHistory(req, res),
  );

  // Get leave balance
  router.get('/balance', authenticate, (req, res) =>
    controller.getLeaveBalance(req, res),
  );

  // Cancel leave
  router.post('/:id/cancel', authenticate, (req, res) =>
    controller.cancelLeave(req, res),
  );

  // ==================== ADMIN / HR ROUTES ====================

  // Get pending leaves (Admin/HR only)
  router.get(
    '/pending',
    authenticate,
    authorizeRole('ADMIN', 'HR'),
    (req, res) => controller.getPendingLeaves(req, res),
  );

  // Approve leave (Admin/HR only)
  router.post(
    '/:id/approve',
    authenticate,
    authorizeRole('ADMIN', 'HR'),
    (req, res) => controller.approveLeave(req, res),
  );

  // Reject leave (Admin/HR only)
  router.post(
    '/:id/reject',
    authenticate,
    authorizeRole('ADMIN', 'HR'),
    (req, res) => controller.rejectLeave(req, res),
  );

  // ==================== SETTINGS ROUTES ====================

  // Get leave policy (Admin only)
  router.get(
    '/settings/policy',
    authenticate,
    authorizeRole('ADMIN'),
    (req, res) => controller.getLeavePolicy(req, res),
  );

  // Update leave policy (Admin only)
  router.put(
    '/settings/policy',
    authenticate,
    authorizeRole('ADMIN'),
    (req, res) => controller.updateLeavePolicy(req, res),
  );

  return router;
}
