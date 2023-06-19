import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
import { getLogger } from '../libs/logger';

const logger = getLogger('ResourceValidator');

const resourceValidator = (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
  const data = {
    body: req.body,
    query: req.query,
    params: req.params,
  };

  logger.verbose('Validating request...', data);
  try {
    await schema.parseAsync(data);
    return next();
  } catch (error) {
    logger.warn('Validation failed', error);
    return res.status(400).json({ message: 'Request Validation failed', error });
  }
};

export default resourceValidator;
