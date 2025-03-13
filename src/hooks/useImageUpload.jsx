import { useState } from "react";
import { BASE_URL } from "../constants";

const useImageUpload = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const uploadImages = async (productId, images) => {
    if (!images || images.length === 0) {
      setErrorMessage("Please select at least one image");
      return [];
    }

    setIsUploading(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      images.forEach((image) => {
        formData.append("image", image);
      });

      const response = await fetch(`${BASE_URL}/product/image/upload/${productId}/`, {
        method: "POST",
        headers: {
          "X-CSRFToken": getCookie("csrftoken"),
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Image upload failed");
      }

      const result = await response.json();
      return Array.isArray(result) ? result : [result]; // Ensure the result is an array

    } catch (err) {
      console.error("Upload error:", err);
      setErrorMessage(err.message);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadImages, errorMessage, isUploading };
};

// CSRF token helper
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export default useImageUpload;