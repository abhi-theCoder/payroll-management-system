import config from '@config/env';
import logger from '@config/logger';
import prisma from '@config/database';
import { createApp } from './app';

const app = createApp();
const PORT = config.PORT;
const HOST = config.HOST;

/**
 * Start server
 */
async function startServer() {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    logger.info('Database connection successful');

    const server = app.listen(PORT, HOST, () => {
      logger.info(
        `Server running on http://${HOST}:${PORT}`,
      );
      logger.info(`Environment: ${config.NODE_ENV}`);
      logger.info(`App Version: ${config.APP_VERSION}`);
    });

    // Graceful shutdown
    const gracefulShutdown = async () => {
      logger.info('Shutting down gracefully...');

      server.close(async () => {
        logger.info('HTTP server closed');

        await prisma.$disconnect();
        logger.info('Database connection closed');

        process.exit(0);
      });

      // Force shutdown after 30 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 30000);
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

    process.on('uncaughtException', (error) => {
      logger.fatal({ error }, 'Uncaught Exception');
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.fatal({ reason, promise }, 'Unhandled Rejection');
      process.exit(1);
    });
  } catch (error) {
    logger.fatal(
      { error },
      'Failed to start server',
    );
    process.exit(1);
  }
}

startServer();
