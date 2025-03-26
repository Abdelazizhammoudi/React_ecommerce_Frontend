// config/constants.js
export const BASE_URL = "http://127.0.0.1:8000";

// Order Status Constants
export const ORDER_STATUS = {
  PENDING: 'pending',
  DELIVERED: 'delivered',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  ORDER_CREATE_SUCCESS: 'Order created successfully!',
  ORDER_UPDATE_SUCCESS: 'Order status updated successfully!',
  PRODUCT_CREATE_SUCCESS: 'Product created successfully!',
  PRODUCT_UPDATE_SUCCESS: 'Product updated successfully!',
  PRODUCT_DELETE_SUCCESS: 'Product deleted successfully!',
};

// API Endpoints
export const API_ENDPOINTS = {
  // Product Endpoints
  PRODUCTS: "/product/",
  PRODUCT_DETAIL: (id) => `/product/${id}/`,
  PRODUCT_UPDATE: (id) => `/product/${id}/update/`,
  PRODUCT_DELETE: (id) => `/product/${id}/delete/`,
  
  // Image Endpoints
  IMAGE_UPLOAD: (productId) => `/product/image/upload/${productId}/`,
  IMAGE_DELETE: (imageId) => `/product/image/delete/${imageId}/`,
  
  // Order Endpoints
  ORDER_CREATE: "/order/orders/create/",
  ORDERS_LIST: "/order/orders/list/",
  ADMIN_LOGIN: "/admin/login/",
  ORDER_STATUS: (Id) => `/order/orders/status/${Id}/`, 
  ORDER_DETAIL: (id) => `/order/orders/${id}/`,
  ORDER_UPDATE: (id) => `/order/orders/update/${id}/`,
  ORDER_delete: (Id) => `/order/orders/delete/${Id}/`,
};

// Error Messages
export const ERROR_MESSAGES = {
  FETCH_ERROR: "Failed to fetch data. Please try again later.",
  UPLOAD_ERROR: "Failed to upload content. Please try again.",
  DELETE_ERROR: "Failed to delete item. Please try again.",
  ORDER_FETCH_ERROR: "Failed to load orders. Please check your permissions.",
  ORDER_UPDATE_ERROR: "Failed to update order status. Please try again.",
};