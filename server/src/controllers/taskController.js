import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const taskPopulate = [
  { path: 'assignedTo', select: 'name email role' },
  { path: 'createdBy', select: 'name email' },
  { path: 'project', select: 'name description members' }
];

export const listTasks = asyncHandler(async (req, res) => {
  const { projectId, userId, status } = req.query;
  const filter = {};

  if (projectId) filter.project = projectId;
  if (status) filter.status = status;

  if (req.user.role === 'Admin') {
    if (userId) filter.assignedTo = userId;
  } else {
    filter.assignedTo = req.user._id;
  }

  const tasks = await Task.find(filter).populate(taskPopulate).sort({ deadline: 1 });
  res.json({ tasks });
});

export const createTask = asyncHandler(async (req, res) => {
  const { title, description, projectId, assignedTo, status, deadline } = req.body;
  const [project, assignee] = await Promise.all([
    Project.findById(projectId),
    User.findById(assignedTo)
  ]);

  if (!project) throw new ApiError(404, 'Project not found');
  if (!assignee) throw new ApiError(404, 'Assigned user not found');

  if (!project.members.some((member) => member.toString() === assignedTo)) {
    throw new ApiError(400, 'Assigned user must be a project member');
  }

  const task = await Task.create({
    title,
    description,
    project: projectId,
    assignedTo,
    status: status || 'Todo',
    deadline,
    createdBy: req.user._id
  });

  const populatedTask = await Task.findById(task._id).populate(taskPopulate);
  res.status(201).json({ task: populatedTask });
});

export const updateTaskStatus = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.taskId);

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  if (req.user.role !== 'Admin' && task.assignedTo.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You can only update tasks assigned to you');
  }

  task.status = req.body.status;
  await task.save();

  const populatedTask = await Task.findById(task._id).populate(taskPopulate);
  res.json({ task: populatedTask });
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.taskId);

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  await task.deleteOne();
  res.status(204).send();
});
