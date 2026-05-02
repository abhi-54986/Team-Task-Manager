import mongoose from 'mongoose';
import { Task } from '../models/Task.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
  const { projectId, userId } = req.query;
  const filter = {};

  if (projectId) filter.project = new mongoose.Types.ObjectId(projectId);

  if (req.user.role === 'Admin') {
    if (userId) filter.assignedTo = new mongoose.Types.ObjectId(userId);
  } else {
    filter.assignedTo = req.user._id;
  }

  const now = new Date();
  const [totalTasks, completedTasks, overdueTasks, statusBreakdown] = await Promise.all([
    Task.countDocuments(filter),
    Task.countDocuments({ ...filter, status: 'Done' }),
    Task.countDocuments({ ...filter, status: { $ne: 'Done' }, deadline: { $lt: now } }),
    Task.aggregate([
      { $match: filter },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ])
  ]);

  res.json({
    stats: {
      totalTasks,
      completedTasks,
      pendingTasks: totalTasks - completedTasks,
      overdueTasks,
      statusBreakdown: statusBreakdown.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
    }
  });
});
