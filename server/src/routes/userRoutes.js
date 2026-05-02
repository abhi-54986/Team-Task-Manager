import { Router } from 'express';
import { param } from 'express-validator';
import { deleteUser, listUsers } from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

export const userRouter = Router();

userRouter.use(authenticate);

userRouter.get('/', authorize('Admin'), listUsers);
userRouter.delete(
  '/:userId',
  authorize('Admin'),
  param('userId').isMongoId().withMessage('Valid user id is required'),
  validate,
  deleteUser
);
