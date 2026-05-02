import { api } from './axios';

export const getUsers = () => api.get('/users');
export const deleteUser = (userId) => api.delete(`/users/${userId}`);
