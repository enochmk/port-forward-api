import 'express-async-errors';
import express from 'express';
import loggerMiddleware from './middlewares/requestLogger.middleware';

const router = express.Router();

router.use(loggerMiddleware);

export default router;
