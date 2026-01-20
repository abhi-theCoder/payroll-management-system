import { Request, Response, NextFunction } from 'express';
import { AppException } from '../exceptions';
import logger from '@config/logger';

/**
 * Error handling middleware
 */
export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  logger.error({ error: err }, 'Error occurred');

  if (err instanceof AppException) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        ...(err.details && { details: err.details }),
      },
    });
    return;
  }

  // Unexpected errors
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    },
  });
}

/**
 * 404 Not Found middleware
 */
export function notFoundHandler(_req: Request, res: Response, _next: NextFunction): void {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found',
    },
  });
}

export default {
  errorHandler,
  notFoundHandler,
};
