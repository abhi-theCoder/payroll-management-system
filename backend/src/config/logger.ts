import pino from 'pino';
import config from './env';

const isDevelopment = config.NODE_ENV === 'development';

const logger = pino({
  level: config.LOG_LEVEL,
  transport: isDevelopment
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
          singleLine: false,
        },
      }
    : undefined,
  timestamp: true,
});

export default logger;
