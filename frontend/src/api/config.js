// API կարգավորումներ
// API Configuration

export const API_CONFIG = {
  // Փոխեք այս URL-ը ձեր backend-ի համան
  // Change this URL to match your backend
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5144',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register'
    },
    PRODUCTS: {
      LIST: '/api/products',
      CREATE: '/api/products',
      UPDATE: (id) => `/api/products/${id}`,
      DELETE: (id) => `/api/products/${id}`,
      CATEGORIES: '/api/products/categories'
    }
  }
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};