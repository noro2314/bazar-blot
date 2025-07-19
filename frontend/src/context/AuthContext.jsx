import React, { useState, useEffect } from 'react';
import { AuthContext } from './context';
import { authAPI } from '../api/auth';

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ապպ-ի բեռնման ժամանակ օգտատիրոջ ստուգում
  // Check user on app load
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const currentUser = authAPI.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Նույնականացման սխալ:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Գրանցում
  // Register function
  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await authAPI.register(userData);
      setUser(response.user);
      return response;
    } finally {
      setLoading(false);
    }
  };

  // Մուտք
  // Login function
  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await authAPI.login(credentials);
      setUser(response.user);
      return response;
    } finally {
      setLoading(false);
    }
  };

  // Ելք
  // Logout function
  const logout = () => {
    authAPI.logout();
    setUser(null);
  };

  // Նույնականացման ստուգում
  // Check if authenticated
  const isAuthenticated = () => {
    return !!user && authAPI.isAuthenticated();
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};