/**
 * Authorization Middleware
 * Role-based access control for API endpoints
 */

import { Request, Response, NextFunction } from 'express';
import { ForbiddenException } from '../exceptions';
import { UserRole } from '../constants';

/**
 * Authorize specific roles
 */
export function authorizeRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new ForbiddenException('User not authenticated');
    }

    if (!roles.includes(req.user.role)) {
      throw new ForbiddenException('Insufficient permissions for this action');
    }

    next();
  };
}

/**
 * Check specific permissions
 */
export function authorizePermission(...permissions: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new ForbiddenException('User not authenticated');
    }

    const hasPermission = permissions.some((perm) => req.user?.permissions?.includes(perm));

    if (!hasPermission) {
      throw new ForbiddenException('Insufficient permissions for this action');
    }

    next();
  };
}

export default {
  authorizeRole,
  authorizePermission,
};
