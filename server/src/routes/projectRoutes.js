import { Router } from 'express';
import {
  addMember,
  createProject,
  deleteProject,
  getProject,
  listProjects,
  removeMember
} from '../controllers/projectController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createProjectRules, memberRules, projectIdRule } from '../validators/projectValidators.js';

export const projectRouter = Router();

projectRouter.use(authenticate);

projectRouter.get('/', listProjects);
projectRouter.post('/', authorize('Admin'), createProjectRules, validate, createProject);
projectRouter.get('/:projectId', projectIdRule, validate, getProject);
projectRouter.delete('/:projectId', authorize('Admin'), projectIdRule, validate, deleteProject);
projectRouter.post('/:projectId/members', authorize('Admin'), memberRules, validate, addMember);
projectRouter.delete('/:projectId/members', authorize('Admin'), memberRules, validate, removeMember);
