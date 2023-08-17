import requestIp from 'request-ip';
import { NextFunction, Request, Response } from 'express';
import dayjs from 'dayjs';
import rtracer from 'cls-rtracer';
import { getLogger } from '../libs/logger';

const logger = getLogger('RequestLogger');

const requestLoggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  res.locals.requestID = rtracer.id();
  res.locals.timestamp = dayjs().toISOString();
  res.locals.clientIp = requestIp.getClientIp(req);

  const logInfo = {
    requestID: res.locals.requestID,
    timestamp: res.locals.timestamp,
    ip: res.locals.clientIp,
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
    params: req.params,
    query: req.query,
    body: req.body,
  };

  logger.info('request logged', logInfo);
  return next();
};

export default requestLoggerMiddleware;
