import api from '../api/api';

export const APIServices = {
  // Products
  products: {
    getAll: (params = {}) => api.get('/products', { params }),
    getById: (id) => api.get(`/products/${id}`),
    create: (data) => api.post('/products', data),
    update: (id, data) => api.patch(`/products/${id}`, data),
    delete: (id) => api.delete(`/products/${id}`),
    getCategories: () => api.get('/products/categories'),
    createCategory: (data) => api.post('/products/categories', data)
  },

  // Orders
  orders: {
    create: (data) => api.post('/orders', data),
    getMyOrders: (params = {}) => api.get('/orders', { params }),
    getById: (id) => api.get(`/orders/${id}`),
    cancel: (id) => api.patch(`/orders/${id}/cancel`)
  },

  // Ratings
  ratings: {
    getByProduct: (productId, params = {}) => api.get(`/ratings/${productId}`, { params }),
    create: (data) => api.post('/ratings', data),
    delete: (id) => api.delete(`/ratings/${id}`)
  },

  // Wishlist
  wishlist: {
    get: (params = {}) => api.get('/wishlist', { params }),
    add: (data) => api.post('/wishlist', data),
    remove: (productId) => api.delete(`/wishlist/${productId}`),
    check: (productId) => api.get(`/wishlist/${productId}/check`)
  },

  // Coupons
  coupons: {
    validate: (code) => api.get(`/coupons/validate/${code}`)
  },

  // Auth
  auth: {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getMe: () => api.get('/auth/me'),
    refresh: () => api.post('/auth/refresh'),
    logout: () => api.post('/auth/logout')
  },

  // Admin
  admin: {
    getDashboardStats: () => api.get('/admin/dashboard/stats'),
    getInventory: (params = {}) => api.get('/admin/inventory', { params }),
    getUsers: (params = {}) => api.get('/admin/users', { params }),
    getOrders: (params = {}) => api.get('/admin/orders', { params }),
    updateOrderStatus: (id, status) => api.patch(`/admin/orders/${id}/status`, { status }),
    getCategoryStats: () => api.get('/admin/categories/stats'),
    // Coupons (admin)
    getCoupons: (params = {}) => api.get('/coupons', { params }),
    createCoupon: (data) => api.post('/coupons', data),
    updateCoupon: (id, data) => api.patch(`/coupons/${id}`, data),
    deleteCoupon: (id) => api.delete(`/coupons/${id}`)
  }
};

export default APIServices;
