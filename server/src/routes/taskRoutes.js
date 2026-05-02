import { Router } from 'express';
import { query } from 'express-validator';
import { createTask, deleteTask, listTasks, updateTaskStatus } from '../controllers/taskController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createTaskRules, taskIdRule, updateTaskStatusRules } from '../validators/taskValidators.js';

export const taskRouter = Router();

taskRouter.use(authenticate);

taskRouter.get(
  '/',
  [
    query('projectId').optional().isMongoId().withMessage('Valid project id is required'),
    query('userId').optional().isMongoId().withMessage('Valid user id is required'),
    query('status').optional().isIn(['Todo', 'In Progress', 'Done']).withMessage('Invalid task status')
  ],
  validate,
  listTasks
);
taskRouter.post('/', authorize('Admin'), createTaskRules, validate, createTask);
taskRouter.patch('/:taskId/status', updateTaskStatusRules, validate, updateTaskStatus);
taskRouter.delete('/:taskId', authorize('Admin'), taskIdRule, validate, deleteTask);
