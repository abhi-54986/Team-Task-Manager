import { api } from './axios';

export const loginRequest = (payload) => api.post('/auth/login', payload);
export const signupRequest = (payload) => api.post('/auth/signup', payload);
export const meRequest = () => api.get('/auth/me');
