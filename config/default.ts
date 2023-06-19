import dotenv from 'dotenv';

dotenv.config();

const settings = {
  service: process.env.LOG_SERVICE || 'FORWARD-PORT-API',
  port: process.env.PORT || 6006,
  env: process.env.NODE_ENV || 'development',
  corsOptions: {
    origin: [],
  },
  logger: {
    console: true,
    level: 'info',
    dirname: process.env.LOG_DIRECTORY || 'logs',
    datePattern: 'YYYYMMDD',
  },
};

export default settings;
