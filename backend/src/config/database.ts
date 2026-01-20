import { PrismaClient } from '@prisma/client';
import logger from './logger';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: [
      { emit: 'event', level: 'query' },
      { emit: 'stdout', level: 'error' },
      { emit: 'stdout', level: 'warn' },
    ],
  });

// Enable query logging in development
if (process.env.NODE_ENV === 'development') {
  // @ts-ignore - Prisma $on types are too strict
  prisma.$on('query', (e: any) => {
    logger.debug(
      {
        query: e.query,
        params: e.params,
        duration: e.duration,
      },
      'Database Query',
    );
  });
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
