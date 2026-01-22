/**
 * Audit Logger
 * Logs all user actions and system events for compliance and debugging
 */

import { PrismaClient } from '@prisma/client';
import logger from '@config/logger';

export interface AuditLogEntry {
  userId?: string;
  action: string;
  module: string;
  resourceId?: string;
  resourceType?: string;
  changes?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  status: 'SUCCESS' | 'FAILURE';
  errorMessage?: string;
  metadata?: Record<string, any>;
}

export class AuditLogger {
  constructor(private prisma: PrismaClient) { }

  /**
   * Log an action
   */
  async log(entry: AuditLogEntry): Promise<void> {
    try {
      const timestamp = new Date();

      // Log to console/file
      logger.info({
        timestamp,
        userId: entry.userId,
        action: entry.action,
        module: entry.module,
        resourceId: entry.resourceId,
        status: entry.status,
        changes: entry.changes,
        metadata: entry.metadata,
      });

      // Log to database if configured
      if (process.env.ENABLE_AUDIT_LOG === 'true') {
        await this.prisma.auditLog.create({
          data: {
            userId: entry.userId,
            action: entry.action,
            module: entry.module,
            resourceId: entry.resourceId,
            resourceType: entry.resourceType,
            // Map required legacy fields
            entity: entry.resourceType || entry.module || 'SYSTEM',
            entityId: entry.resourceId || 'N/A',

            changes: entry.changes ? (JSON.stringify(entry.changes) as any) : (null as any),
            ipAddress: entry.ipAddress,
            userAgent: entry.userAgent,
            status: entry.status,
            errorMessage: entry.errorMessage,
            metadata: entry.metadata ? JSON.stringify(entry.metadata) : null as any,
            // timestamp maps to createdAt in schema automatically if we don't pass it, 
            // but schema has createdAt @default(now()). 
            // AuditLogger used `timestamp` variable. 
            // We can pass it to createdAt if we want exact match.
            createdAt: timestamp,
          },
        });
      }
    } catch (error) {
      // Don't throw on audit log failure - log the error but continue
      logger.error({
        message: 'Failed to log audit entry',
        error: error instanceof Error ? error.message : String(error),
        entry,
      });
    }
  }

  /**
   * Log a create action
   */
  async logCreate(
    userId: string | undefined,
    module: string,
    resourceType: string,
    resourceId: string,
    data: Record<string, any>,
    metadata?: Record<string, any>,
  ): Promise<void> {
    await this.log({
      userId,
      action: 'CREATE',
      module,
      resourceId,
      resourceType,
      changes: data,
      status: 'SUCCESS',
      metadata,
    });
  }

  /**
   * Log an update action
   */
  async logUpdate(
    userId: string | undefined,
    module: string,
    resourceType: string,
    resourceId: string,
    changes: Record<string, any>,
    metadata?: Record<string, any>,
  ): Promise<void> {
    await this.log({
      userId,
      action: 'UPDATE',
      module,
      resourceId,
      resourceType,
      changes,
      status: 'SUCCESS',
      metadata,
    });
  }

  /**
   * Log a delete action
   */
  async logDelete(
    userId: string | undefined,
    module: string,
    resourceType: string,
    resourceId: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    await this.log({
      userId,
      action: 'DELETE',
      module,
      resourceId,
      resourceType,
      status: 'SUCCESS',
      metadata,
    });
  }

  /**
   * Log an approval action
   */
  async logApproval(
    userId: string | undefined,
    module: string,
    resourceType: string,
    resourceId: string,
    remarks?: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    await this.log({
      userId,
      action: 'APPROVE',
      module,
      resourceId,
      resourceType,
      changes: remarks ? { remarks } : undefined,
      status: 'SUCCESS',
      metadata,
    });
  }

  /**
   * Log a rejection action
   */
  async logRejection(
    userId: string | undefined,
    module: string,
    resourceType: string,
    resourceId: string,
    reason?: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    await this.log({
      userId,
      action: 'REJECT',
      module,
      resourceId,
      resourceType,
      changes: reason ? { reason } : undefined,
      status: 'SUCCESS',
      metadata,
    });
  }

  /**
   * Log an error
   */
  async logError(
    userId: string | undefined,
    module: string,
    action: string,
    error: Error | string,
    resourceId?: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    const errorMessage = error instanceof Error ? error.message : String(error);
    await this.log({
      userId,
      action,
      module,
      resourceId,
      status: 'FAILURE',
      errorMessage,
      metadata,
    });
  }
}
