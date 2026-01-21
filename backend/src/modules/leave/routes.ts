/**
 * Leave Routes Export
 * For backwards compatibility with existing route structure
 */

import { Router } from 'express';
import { prisma } from '@config/database';
import { AuditLogger } from '@shared/utils/audit';
import { createLeaveRoutes } from './leave.routes';

const auditLogger = new AuditLogger(prisma);
const router = createLeaveRoutes(prisma, auditLogger);

export default router;
