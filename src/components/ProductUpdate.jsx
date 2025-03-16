import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../constants";
import useFetch from "../hooks/useFetch";
import useImageUpload from "../hooks/useImageUpload";
import "../assets/update-product.css"; // Ensure the correct CSS file is imported
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

// CSRF token helper function
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function ProductUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, loading, error, setData: setProduct } = useFetch(`/product/${id}/`);
  const { uploadImages, errorMessage: uploadError, isUploading } = useImageUpload();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
  });

  const [newImages, setNewImages] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
      });
    }
  }, [product]);

  const validateForm = () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      setErrorMessage("Name and description are required");
      return false;
    }
    if (isNaN(formData.price) || formData.price <= 0) {
      setErrorMessage("Please enter a valid price");
      return false;
    }
    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrorMessage(null);
  };

  const handleImageChange = (e) => {
    setNewImages(Array.from(e.target.files));
    setErrorMessage(null);
  };

  const handleDeleteImage = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/product/image/delete/${id}/`, {
        method: "DELETE",
        headers: {
          "X-CSRFToken": getCookie("csrftoken"),
        }
      });

      if (!response.ok) throw new Error("Failed to delete image");

      setProduct(prev => ({
        ...prev,
        images: prev.images.filter(image => image.id !== id)
      }));
    } catch (err) {
      console.error("Delete error:", err);
      setErrorMessage(err.message);
    }
  };

  const handleDeleteProduct = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`${BASE_URL}/product/${id}/delete/`, {
        method: "DELETE",
        headers: {
          "X-CSRFToken": getCookie("csrftoken"),
        }
      });

      if (!response.ok) throw new Error("Failed to delete product");

      alert("Product deleted successfully!");
      navigate("/");
    } catch (err) {
      console.error("Delete error:", err);
      setErrorMessage(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsUpdating(true);

    try {
      const response = await fetch(`${BASE_URL}/product/${id}/update/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: formData.price
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update product");
      }

      const updatedProduct = await response.json();
      setProduct(updatedProduct);
      alert("Product updated successfully!");
    } catch (err) {
      console.error("Error updating product:", err);
      setErrorMessage(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUploadImages = async () => {
    try {
      if (newImages.length === 0) {
        alert("Please select images to upload");
        return;
      }

      const uploadedImages = await uploadImages(id, newImages);
      setProduct(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedImages]
      }));
      setNewImages([]);
      alert("Images uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      setErrorMessage(err.message);
    }
  };

  if (loading) return <div className="loading">Loading product details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return <div className="error">Product not found</div>;

  return (
    <div className="update-product-container">
      <h2>Edit Product</h2>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Product Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Price ($):</label>
          <input
            type="number"
            step="0.01"
            min="0"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
          />
        </div>

        <button 
          type="submit" 
          className="update-button"
          disabled={isUpdating}
        >
          {isUpdating ? "Updating..." : "Update Product Details"}
        </button>
      </form>

      <div className="image-section">
        <h3>Product Images</h3>

        <div className="product-images">
          {product.images && product.images.length > 0 ? (
            product.images.map((image) => (
              <div key={image.id} className="image-container">
                <img
                  src={image.image} // Use the full image URL from the API
                  alt={`${product.name}`}
                  className="product-image"
                  onError={(e) => {
                    e.target.src = "path/to/fallback/image.jpg"; // Fallback image
                  }}
                />
                <IconButton
                  aria-label="delete"
                  className="delete-image"
                  onClick={() => handleDeleteImage(image.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            ))
          ) : (
            <p>No images available</p>
          )}
        </div>

        <div className="upload-section">
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            accept="image/*"
            id="image-upload"
            style={{ display: 'none' }}
          />
          <label htmlFor="image-upload" className="upload-button">
            Choose New Images
          </label>
          {newImages.length > 0 && (
            <div className="selected-files">
              Selected: {newImages.length} file(s)
            </div>
          )}
          <button
            type="button"
            className="upload-button"
            onClick={handleUploadImages}
            disabled={isUploading || newImages.length === 0}
          >
            {isUploading ? "Uploading..." : "Upload Selected Images"}
          </button>
        </div>
      </div>

      <div className="danger-zone">
        <h3>Danger Zone</h3>
        <button
          type="button"
          className="delete-product-button"
          onClick={handleDeleteProduct}
        >
          Delete Entire Product
        </button>
      </div>

      {(errorMessage || uploadError) && (
        <div className="error-message">
          {errorMessage || uploadError}
        </div>
      )}
    </div>
  );
}

export default ProductUpdate;