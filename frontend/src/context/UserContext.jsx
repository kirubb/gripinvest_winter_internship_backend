import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../api';

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        // Ensure the apiClient has the latest token for this request
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const response = await apiClient.get('/user/profile');
          setUser(response.data);
        } catch (error) {
          console.error('Token is invalid or expired. Logging out.', error);
          handleLogout(); // Automatically log out if token fails
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [token]);

  const handleLogin = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete apiClient.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  const updateUser = (newUserData) => {
    setUser(newUserData);
  };

  const value = { user, token, loading, handleLogin, handleLogout, updateUser };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};