import { isAxiosError } from 'axios';
import { NextFunction, Request, Response } from 'express';
import messages from '../utils/messages';
import { getLogger } from '../libs/logger';

const logger = getLogger('ErrorHandler');

interface ErrorResponse {
  requestTimestamp: string;
  requestID: string;
  message: string;
}

// eslint-disable-next-line
const errorHandler = (error: any, req: Request, res: Response, _next: NextFunction) => {
  let statusCode = 500;
  const message = messages.TECHNICAL_ISSUE;

  let errorLog: any = {
    requestID: res.locals.requestID,
    requestTimestamp: res.locals.timestamp,
    error: {
      name: error.name,
      message: error.message,
      code: error.code,
      status: error.status,
    },
    endpoint: {
      url: req.originalUrl,
      method: req.method,
      body: req.body,
      params: req.params,
      query: req.query,
    },
  };

  // ! Axios Error
  if (isAxiosError(error)) {
    // ! API error
    if (error.response) {
      errorLog = {
        request: {
          baseURL: error.config?.baseURL,
          url: error.config?.url,
          headers: error.config?.headers,
          method: error.config?.method,
          data: error.config?.data,
        },
        response: {
          headers: error.response.headers,
          status: error.response.status,
          data: error.response.data,
        },
      };

      errorLog.message = error.response?.data?.message || message;
      logger.info('Forwarding error response', errorLog);
      return res.status(error.response.status).json(error.response.data);
    }

    // ! Network error
    if (!error.response) {
      errorLog = {
        request: {
          baseURL: error.config?.baseURL,
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data,
        },
      };

      statusCode = error.status || statusCode;
      logger.error(messages.GENERIC_ERROR, errorLog);

      const response: ErrorResponse = {
        requestID: res.locals.requestID,
        requestTimestamp: res.locals.timestamp,
        message: message,
      };

      return res.status(statusCode).json(response);
    }
  }

  const response: ErrorResponse = {
    requestID: res.locals.requestID,
    requestTimestamp: res.locals.timestamp,
    message: message,
  };

  errorLog.response = response;
  errorLog.error.stack = error.stack;
  logger.error(errorLog);
  return res.status(statusCode).json(response);
};

export default errorHandler;
