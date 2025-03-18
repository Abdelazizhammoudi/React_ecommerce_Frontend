export const BASE_URL = "http://127.0.0.1:8000"; // Your Django backend URL

// API Endpoints
export const API_ENDPOINTS = {
  PRODUCTS: "/product/",
  PRODUCT_DETAIL: (id) => `/product/${id}/`,
  PRODUCT_UPDATE: (id) => `/product/${id}/update/`,
  PRODUCT_DELETE: (id) => `/product/${id}/delete/`,
  IMAGE_UPLOAD: (productId) => `/product/image/upload/${productId}/`,
  IMAGE_DELETE: (imageId) => `/product/image/delete/${imageId}/`,
};

// Error Messages
export const ERROR_MESSAGES = {
  FETCH_ERROR: "Failed to fetch data. Please try again later.",
  UPLOAD_ERROR: "Failed to upload images. Please try again.",
  DELETE_ERROR: "Failed to delete. Please try again.",
};

// Success Messages
export const SUCCESS_MESSAGES = {
  UPLOAD_SUCCESS: "Images uploaded successfully!",
  DELETE_SUCCESS: "Item deleted successfully!",
};