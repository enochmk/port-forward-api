import config from 'config';
import winston, { format } from 'winston';
import rtracer from 'cls-rtracer';
import 'winston-daily-rotate-file';

const service = config.get('service') as string;
const dirname = config.get('logger.dirname') as string;
const LEVEL = config.get('logger.level') as string;
const TIMESTAMP_FORMAT = 'YYYY-MM-DD HH:mm:ss';

const formatter = {
  file: format.printf((log: any): string => {
    const requestID = rtracer.id();
    const { message, level, timestamp, label, service, ...rest } = log;
    return JSON.stringify({
      timestamp: timestamp,
      requestID: requestID,
      service: service,
      level: level,
      label: label,
      message: message,
      metadata: rest,
    });
  }),
  console: format.printf((log: any): string => {
    const { timestamp, level, message, label, service, ...rest } = log;
    // if label is set, add it to the log message
    if (label) {
      return `[${timestamp}] [${service}] [${level?.toUpperCase()}]: [${label}] - ${message} ${
        Object.keys(rest).length ? JSON.stringify(rest) : ''
      }`;
    }
    return `[${timestamp}] [${level?.toUpperCase()}]: ${message} ${
      Object.keys(rest).length ? JSON.stringify(rest) : ''
    }`;
  }),
};

const transporter = {
  file: new winston.transports.DailyRotateFile({
    level: LEVEL,
    dirname,
    datePattern: 'YYYYMMDD',
    filename: '%DATE%.log',
    format: winston.format.combine(formatter.file),
  }),
  console: new winston.transports.Console({
    level: 'verbose',
    format: winston.format.combine(formatter.console, winston.format.colorize({ all: true })),
  }),
};

export const getLogger = (label: string, service?: string) => {
  return logger.child({ label, service });
};

const logger = winston.createLogger({
  transports: [transporter.console, transporter.file],
  levels: winston.config.npm.levels,
  defaultMeta: { service },
  format: winston.format.combine(
    winston.format.timestamp({ format: TIMESTAMP_FORMAT }),
    winston.format.errors({ stack: true }),
  ),
});

export default logger;
