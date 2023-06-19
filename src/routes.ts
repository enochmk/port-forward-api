import 'express-async-errors';
import express from 'express';
import loggerMiddleware from './middlewares/requestLogger.middleware';
import forwardController from './controllers/forward.controller';

const router = express.Router();

router.use(loggerMiddleware);
router.all('/forward', forwardController);

export default router;
