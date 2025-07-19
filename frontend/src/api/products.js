import apiClient from './client';
import { API_CONFIG } from './config';

// Ապրանքների API ծառայություններ
// Products API services

export const productsAPI = {
  // Բոլոր ապրանքների ստացում
  // Get all products
  getProducts: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.category) params.append('category', filters.category);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.activeOnly !== undefined) params.append('activeOnly', filters.activeOnly);
      
      const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.PRODUCTS.LIST}?${params}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ապրանքների բեռնման սխալ');
    }
  },

  // Կոնկրետ ապրանքի ստացում
  // Get specific product
  getProduct: async (id) => {
    try {
      const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.PRODUCTS.LIST}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ապրանք գտնված չէ');
    }
  },

  // Նոր ապրանքի ստեղծում
  // Create new product
  createProduct: async (productData) => {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.PRODUCTS.CREATE, productData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ապրանք ստեղծման սխալ');
    }
  },

  // Ապրանքի թարմացում
  // Update product
  updateProduct: async (id, productData) => {
    try {
      const response = await apiClient.put(API_CONFIG.ENDPOINTS.PRODUCTS.UPDATE(id), productData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ապրանք թարմացման սխալ');
    }
  },

  // Ապրանքի ջնջում
  // Delete product
  deleteProduct: async (id) => {
    try {
      const response = await apiClient.delete(API_CONFIG.ENDPOINTS.PRODUCTS.DELETE(id));
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ապրանք ջնջման սխալ');
    }
  },

  // Կատեգորիաների ստացում
  // Get categories
  getCategories: async () => {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.PRODUCTS.CATEGORIES);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Կատեգորիաների բեռնման սխալ');
    }
  }
};