import { Router } from 'express';
import { login, me, signup } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { loginRules, signupRules } from '../validators/authValidators.js';

export const authRouter = Router();

authRouter.post('/signup', signupRules, validate, signup);
authRouter.post('/login', loginRules, validate, login);
authRouter.get('/me', authenticate, me);
