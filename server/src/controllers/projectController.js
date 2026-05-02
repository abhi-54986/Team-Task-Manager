import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const canAccessProject = (project, user) =>
  user.role === 'Admin' || project.members.some((member) => member._id.toString() === user._id.toString());

export const listProjects = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'Admin' ? {} : { members: req.user._id };
  const projects = await Project.find(filter)
    .populate('members', 'name email role')
    .populate('createdBy', 'name email')
    .sort({ updatedAt: -1 });

  res.json({ projects });
});

export const createProject = asyncHandler(async (req, res) => {
  const { name, description, members = [] } = req.body;
  const uniqueMemberIds = [...new Set([...members, req.user._id.toString()])];
  const memberCount = await User.countDocuments({ _id: { $in: uniqueMemberIds } });

  if (memberCount !== uniqueMemberIds.length) {
    throw new ApiError(400, 'One or more members do not exist');
  }

  const project = await Project.create({
    name,
    description,
    members: uniqueMemberIds,
    createdBy: req.user._id
  });

  const populatedProject = await Project.findById(project._id)
    .populate('members', 'name email role')
    .populate('createdBy', 'name email');

  res.status(201).json({ project: populatedProject });
});

export const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.projectId)
    .populate('members', 'name email role')
    .populate('createdBy', 'name email');

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  if (!canAccessProject(project, req.user)) {
    throw new ApiError(403, 'You do not have access to this project');
  }

  const taskFilter = req.user.role === 'Admin'
    ? { project: project._id }
    : { project: project._id, assignedTo: req.user._id };

  const tasks = await Task.find(taskFilter)
    .populate('assignedTo', 'name email role')
    .populate('createdBy', 'name email')
    .sort({ deadline: 1 });

  res.json({ project, tasks });
});

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.projectId);

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  await Task.deleteMany({ project: project._id });
  await project.deleteOne();

  res.status(204).send();
});

export const addMember = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { userId } = req.body;

  const [project, user] = await Promise.all([
    Project.findById(projectId),
    User.findById(userId)
  ]);

  if (!project) throw new ApiError(404, 'Project not found');
  if (!user) throw new ApiError(404, 'User not found');

  if (!project.members.some((member) => member.toString() === userId)) {
    project.members.push(userId);
    await project.save();
  }

  const populatedProject = await Project.findById(projectId).populate('members', 'name email role');
  res.json({ project: populatedProject });
});

export const removeMember = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { userId } = req.body;
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  project.members = project.members.filter((member) => member.toString() !== userId);
  await project.save();
  await Task.deleteMany({ project: projectId, assignedTo: userId });

  const populatedProject = await Project.findById(projectId).populate('members', 'name email role');
  res.json({ project: populatedProject });
});
