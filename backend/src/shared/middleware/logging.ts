import { Request, Response, NextFunction } from 'express';
import logger from '@config/logger';

/**
 * Request logging middleware
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;
    
    const logData = {
      method: req.method,
      path: req.path,
      statusCode,
      duration: `${duration}ms`,
      userId: (req as any).user?.id,
    };

    const message = `${req.method} ${req.path} - ${statusCode}`;
    
    if (statusCode >= 500) {
      logger.error(logData, message);
    } else if (statusCode >= 400) {
      logger.warn(logData, message);
    } else {
      logger.info(logData, message);
    }
  });

  next();
}

/**
 * Request ID middleware
 */
export function requestId(req: Request, res: Response, next: NextFunction): void {
  const id = req.headers['x-request-id'] as string || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  (req as any).id = id;
  res.setHeader('x-request-id', id);
  next();
}

export default {
  requestLogger,
  requestId,
};
