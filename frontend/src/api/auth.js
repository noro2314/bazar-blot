import apiClient from './client';
import { API_CONFIG } from './config';

// Նույնականացման API ծառայություններ
// Authentication API services

export const authAPI = {
  // Գրանցում
  // Register
  register: async (userData) => {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Գրանցման սխալ');
    }
  },

  // Մուտք
  // Login
  login: async (credentials) => {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials);
      const { token, user } = response.data;
      
      // Store token and user data
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Մուտքի սխալ');
    }
  },

  // Ելք
  // Logout
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  // Ընթացիկ օգտատիրոջ ստուգում
  // Check current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('authToken');
    
    if (user && token) {
      return JSON.parse(user);
    }
    return null;
  },

  // Token-ի ստուգում
  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('authToken');
    return !!token;
  }
};