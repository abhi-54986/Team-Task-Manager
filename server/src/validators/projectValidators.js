import { body, param } from 'express-validator';

export const projectIdRule = [
  param('projectId').isMongoId().withMessage('Valid project id is required')
];

export const createProjectRules = [
  body('name').trim().isLength({ min: 2, max: 120 }).withMessage('Project name must be 2-120 characters'),
  body('description').optional().trim().isLength({ max: 2000 }).withMessage('Description is too long'),
  body('members').optional().isArray().withMessage('Members must be an array'),
  body('members.*').optional().isMongoId().withMessage('Each member must be a valid user id')
];

export const memberRules = [
  ...projectIdRule,
  body('userId').isMongoId().withMessage('Valid user id is required')
];
