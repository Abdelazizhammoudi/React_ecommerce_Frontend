// config/constants.js
// export const BASE_URL = "https://sm-shop.onrender.com";
export const BASE_URL = "http://127.0.0.1:8000";

// Language and contact Constants 
export const APP_CONTACT = {
  phone: "+213 658 21 63 59",
  email: "contact@maktabatatwassol.com",
  developerEmail: "Abdelaziz.hammoudi@univ-constantine2.dz",
  developperPhone: "+213 676 87 65 96",
  address: {
    en: "Issat Idir Street, Municipal District 04300 Aïn M'Lila, Algeria",
    fr: "Rue Issat Idir, Quartier Municipal 04300 Aïn M'Lila, Algérie",
    ar: "شارع عيسات إيدير ، الحي البلدي 04300 عين مليلة، الجزائر"
  },
  mapUrl: "https://www.google.com/maps/dir/?api=1&destination=36.038708215977%2C6.5702187573853"
  };

export const STORE_NAME = {
  en: "Maktabat At-Tawassol",
  fr: "Maktabat At-Tawassol",
  ar: "مكتبة التواصل"
};

export const SOCIAL_MEDIA = {
  facebook: "https://web.facebook.com/profile.php?id=100083080521256",
  instagram: "https://www.instagram.com/bareche_oussama",
  whatsapp: "https://wa.me/+213658216359"
};

export const FOOTER_LINKS = {
  catalogue: [
    { title: "Watches", path: "/watches" },
    // Add more catalogue items
  ],
  about: [
    { title: "Our Story", path: "/about" },
    { title: "Our Stores", path: "/stores" }
  ]
};


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
  ORDER_CREATE: `/order/orders/create/`,
  ORDERS_LIST: `/order/orders/list/`,
  ADMIN_LOGIN: `/admin/login/`,
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