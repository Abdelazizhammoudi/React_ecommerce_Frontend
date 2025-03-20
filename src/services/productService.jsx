import { BASE_URL } from "@/config/constants";

export const ProductService = {
  // Fetch a single product
  get: async (id) => {
    const response = await fetch(`${BASE_URL}/product/${id}/`);
    if (!response.ok) throw new Error("Failed to fetch product");
    return response.json();
  },

  // Update a product
  update: async (id, data) => {
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }

    const response = await fetch(`${BASE_URL}/product/${id}/update/`, {
      method: "PUT",
      headers: {
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: formData,
    });
    if (!response.ok) throw new Error("Failed to update product");
    return response.json();
  },

  // Delete a product image
  deleteImage: async (imageId) => {
    const response = await fetch(`${BASE_URL}/product/image/delete/${imageId}/`, {
      method: "DELETE",
      headers: {
        "X-CSRFToken": getCookie("csrftoken"),
      },
    });
    if (!response.ok) throw new Error("Failed to delete image");
  },

  // Delete a product
  deleteProduct: async (id) => {
    const response = await fetch(`${BASE_URL}/product/${id}/delete/`, {
      method: "DELETE",
      headers: {
        "X-CSRFToken": getCookie("csrftoken"),
      },
    });
    if (!response.ok) throw new Error("Failed to delete product");
  },
};

// Helper function to get CSRF token
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}