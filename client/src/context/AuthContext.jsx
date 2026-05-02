import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loginRequest, meRequest, signupRequest } from '../api/authApi';

const AuthContext = createContext(null);

const storedUser = () => {
  const rawUser = localStorage.getItem('team-task-user');
  return rawUser ? JSON.parse(rawUser) : null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(storedUser);
  const [isBootstrapping, setIsBootstrapping] = useState(Boolean(localStorage.getItem('team-task-token')));

  useEffect(() => {
    const bootstrap = async () => {
      if (!localStorage.getItem('team-task-token')) {
        setIsBootstrapping(false);
        return;
      }

      try {
        const { data } = await meRequest();
        setUser(data.user);
        localStorage.setItem('team-task-user', JSON.stringify(data.user));
      } catch {
        setUser(null);
      } finally {
        setIsBootstrapping(false);
      }
    };

    bootstrap();
  }, []);

  const persistAuth = ({ token, user: nextUser }) => {
    localStorage.setItem('team-task-token', token);
    localStorage.setItem('team-task-user', JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const login = async (payload) => {
    const { data } = await loginRequest(payload);
    persistAuth(data);
  };

  const signup = async (payload) => {
    const { data } = await signupRequest(payload);
    persistAuth(data);
  };

  const logout = () => {
    localStorage.removeItem('team-task-token');
    localStorage.removeItem('team-task-user');
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isBootstrapping,
      isAdmin: user?.role === 'Admin',
      login,
      logout,
      signup
    }),
    [user, isBootstrapping]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
