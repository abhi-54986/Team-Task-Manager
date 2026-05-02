import { User } from '../models/User.js';
import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().sort({ name: 1 });
  res.json({ users });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (userId === req.user._id.toString()) {
    throw new ApiError(400, 'You cannot delete your own account');
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  await Project.updateMany({ members: userId }, { $pull: { members: userId } });
  await Task.deleteMany({ assignedTo: userId });
  await user.deleteOne();

  res.status(204).send();
});
