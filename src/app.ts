import express, { Application } from 'express';
import config from 'config';
import http from 'http';
import rtracer from 'cls-rtracer';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import hpp from 'hpp';
import { getLogger } from './libs/logger';
import errorHandler from './middlewares/errorHandler.middleware';
import routes from './routes';

const corOptions = config.get('corsOptions') as object;

// configure middleware
export const configureMiddlewares = (app: Application) => {
  const logger = getLogger('Middleware');
  logger.verbose('Configuring middleware...');

  app.use(morgan('dev'));
  app.use(cors(corOptions));
  app.use(express.json());
  app.use(helmet());
  app.use(hpp());
  app.use(rtracer.expressMiddleware());
  app.use('/api', routes);
  app.use(errorHandler);

  logger.info('Configured middleware!');
};

export const configureSocket = (server: http.Server) => {
  const logger = getLogger('Socket');
  logger.verbose('Configuring Socket...');

  const io = new Server(server, {
    cors: { origin: '*' },
  });

  io.on('connection', (socket: Socket) => {
    logger.info('Socket connected!');
    socket.emit('connected');
  });

  logger.info('Configured Socket!');
};
