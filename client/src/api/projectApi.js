import { api } from './axios';

export const getProjects = () => api.get('/projects');
export const getProject = (projectId) => api.get(`/projects/${projectId}`);
export const createProject = (payload) => api.post('/projects', payload);
export const deleteProject = (projectId) => api.delete(`/projects/${projectId}`);
export const addProjectMember = (projectId, userId) => api.post(`/projects/${projectId}/members`, { userId });
export const removeProjectMember = (projectId, userId) => api.delete(`/projects/${projectId}/members`, { data: { userId } });
