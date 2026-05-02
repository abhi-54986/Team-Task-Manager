import { api } from './axios';

export const getTasks = (params = {}) => api.get('/tasks', { params });
export const createTask = (payload) => api.post('/tasks', payload);
export const updateTaskStatus = (taskId, status) => api.patch(`/tasks/${taskId}/status`, { status });
export const deleteTask = (taskId) => api.delete(`/tasks/${taskId}`);
