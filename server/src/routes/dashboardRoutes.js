import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { dashboardQueryRules } from '../validators/taskValidators.js';

export const dashboardRouter = Router();

dashboardRouter.get('/', authenticate, dashboardQueryRules, validate, getDashboardStats);
