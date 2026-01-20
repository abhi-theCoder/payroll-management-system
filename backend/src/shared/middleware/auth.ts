import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '@config/env';
import { UnauthorizedException, ForbiddenException } from '../exceptions';
import { UserRole } from '../constants';

/**
 * Extend Express Request with user info
 */
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: UserRole;
        companyId?: string;
        permissions?: string[];
      };
    }
  }
}

interface JWTPayload {
  id: string;
  email: string;
  role: UserRole;
  companyId?: string;
  permissions?: string[];
  iat?: number;
  exp?: number;
}

/**
 * Authenticate JWT token
 */
export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization header');
    }

    const token = authHeader.substring(7);

    const decoded = jwt.verify(token, config.JWT_SECRET) as JWTPayload;

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      companyId: decoded.companyId,
      permissions: decoded.permissions,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedException('Token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedException('Invalid token');
    }
    throw error;
  }
}

/**
 * Authorize specific roles
 */
export function authorize(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }

    if (!roles.includes(req.user.role)) {
      throw new ForbiddenException('Insufficient permissions for this action');
    }

    next();
  };
}

/**
 * Check specific permission
 */
export function checkPermission(...permissions: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }

    const hasPermission = permissions.some((perm) => req.user?.permissions?.includes(perm));

    if (!hasPermission) {
      throw new ForbiddenException('Insufficient permissions for this action');
    }

    next();
  };
}

export default {
  authenticate,
  authorize,
  checkPermission,
};
