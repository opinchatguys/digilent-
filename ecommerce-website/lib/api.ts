/**
 * API Configuration
 * Centralized API endpoint management
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Product endpoints
  products: {
    getAll: () => `${API_BASE_URL}/products`,
    getById: (id: string) => `${API_BASE_URL}/products/${id}`,
    create: () => `${API_BASE_URL}/products`,
    update: (id: string) => `${API_BASE_URL}/products/${id}`,
    delete: (id: string) => `${API_BASE_URL}/products/${id}`,
  },
  // Cart endpoints
  cart: {
    get: () => `${API_BASE_URL}/cart`,
    add: () => `${API_BASE_URL}/cart`,
    update: (productId: string) => `${API_BASE_URL}/cart/${productId}`,
    remove: (productId: string) => `${API_BASE_URL}/cart/${productId}`,
    clear: () => `${API_BASE_URL}/cart`,
  },
  // Health check
  health: () => `${API_BASE_URL}/health`,
};

export default API_BASE_URL;
