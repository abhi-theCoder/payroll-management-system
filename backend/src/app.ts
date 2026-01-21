import express, { Express, Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import helmet from 'helmet';
import cors from 'cors';
import pinoHttp from 'pino-http';

// Routes
import authRoutes from '@modules/auth/routes';
import employeeRoutes from '@modules/employee/routes';
import salaryRoutes from '@modules/salary/routes';
import complianceRoutes from '@modules/compliance/routes';
import taxRoutes from '@modules/tax/routes';
import payrollRoutes from '@modules/payroll/routes';
import payslipRoutes from '@modules/payslip/routes';
import reportsRoutes from '@modules/reports/routes';
import leaveRoutes from '@modules/leave/routes';

// Middleware
import { requestId } from '@shared/middleware/logging';
import { errorHandler, notFoundHandler } from '@shared/middleware/errorHandler';
import { prisma } from '@config/database';
import { AuditLogger } from '@shared/utils/audit';

/**
 * Create and configure Express app
 */
export function createApp(): Express {
  const app = express();

  // Security middleware
  app.use(helmet());

  // CORS configuration
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  // Request logging
  app.use(pinoHttp());
  app.use(requestId);

  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  // Health check
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/employees', employeeRoutes);
  app.use('/api/salary', salaryRoutes);
  app.use('/api/compliance', complianceRoutes);
  app.use('/api/tax', taxRoutes);
  app.use('/api/payroll', payrollRoutes);
  app.use('/api/payslips', payslipRoutes);
  app.use('/api/reports', reportsRoutes);
  app.use('/api/leaves', leaveRoutes);

  // 404 handler
  app.use(notFoundHandler);

  // Global error handler (must be last)
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    errorHandler(err, req, res, next);
  });

  return app;
}

export default createApp;
