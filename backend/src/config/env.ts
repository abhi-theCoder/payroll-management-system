import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV || 'development'}`) });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const config = {
  // App
  NODE_ENV: process.env.NODE_ENV || 'development',
  APP_NAME: process.env.APP_NAME || 'Payroll Management Backend',
  APP_VERSION: process.env.APP_VERSION || '1.0.0',
  PORT: parseInt(process.env.PORT || '3000', 10),
  HOST: process.env.HOST || '0.0.0.0',

  // Database
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/payroll_db',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',

  // Redis
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379', 10),
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',

  // Security
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
  REQUEST_TIMEOUT: parseInt(process.env.REQUEST_TIMEOUT || '30000', 10),

  // Email
  EMAIL_SERVICE: process.env.EMAIL_SERVICE || 'gmail',
  EMAIL_USER: process.env.EMAIL_USER || '',
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || '',
  EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@payroll.example.com',

  // File Storage
  FILE_UPLOAD_PATH: process.env.FILE_UPLOAD_PATH || './uploads',
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB

  // Puppeteer (for PDF generation)
  PUPPETEER_HEADLESS: process.env.PUPPETEER_HEADLESS !== 'false',
  PUPPETEER_EXECUTABLE_PATH: process.env.PUPPETEER_EXECUTABLE_PATH,

  // Compliance Rules
  FINANCIAL_YEAR_START_MONTH: parseInt(process.env.FINANCIAL_YEAR_START_MONTH || '4', 10), // April

  // Feature Flags
  ENABLE_AUDIT_LOG: process.env.ENABLE_AUDIT_LOG === 'true',
  ENABLE_APPROVAL_WORKFLOW: process.env.ENABLE_APPROVAL_WORKFLOW === 'true',
  ENABLE_MULTI_TENANT: process.env.ENABLE_MULTI_TENANT === 'true',
};

export default config;
