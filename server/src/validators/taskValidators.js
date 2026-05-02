import { body, param, query } from 'express-validator';

export const taskIdRule = [
  param('taskId').isMongoId().withMessage('Valid task id is required')
];

export const createTaskRules = [
  body('title').trim().isLength({ min: 2, max: 160 }).withMessage('Task title must be 2-160 characters'),
  body('description').optional().trim().isLength({ max: 3000 }).withMessage('Description is too long'),
  body('projectId').isMongoId().withMessage('Valid project id is required'),
  body('assignedTo').isMongoId().withMessage('Valid assigned user id is required'),
  body('status').optional().isIn(['Todo', 'In Progress', 'Done']).withMessage('Invalid task status'),
  body('deadline').isISO8601().toDate().withMessage('Valid deadline is required')
];

export const updateTaskStatusRules = [
  ...taskIdRule,
  body('status').isIn(['Todo', 'In Progress', 'Done']).withMessage('Invalid task status')
];

export const dashboardQueryRules = [
  query('projectId').optional().isMongoId().withMessage('Valid project id is required'),
  query('userId').optional().isMongoId().withMessage('Valid user id is required')
];
