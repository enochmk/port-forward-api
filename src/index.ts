import config from 'config';
import http from 'http';
import express, { Express } from 'express';
import { getLogger } from './libs/logger';
import { configureMiddlewares } from './app';

const logger = getLogger('Server');

// get port and environment from config
const PORT = config.get('port') as number;
const NODE_ENV = config.get('env') as string;
const app: Express = express();

async function initServer() {
  // configure middlewares
  configureMiddlewares(app);
  const server = http.createServer(app);

  // listen to server
  server.on('listening', () => {
    logger.info(`Server listening in mode: ${NODE_ENV} on port: ${PORT}`);
  });

  // initiate server
  server.listen(PORT);
}

// start server
initServer();
