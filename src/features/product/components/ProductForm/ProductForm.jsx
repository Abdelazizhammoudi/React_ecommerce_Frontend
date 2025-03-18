import React, { useState } from "react";
import { BASE_URL } from "@/config/constants";
import "@/styles/global.css";
import "./product-form.css";

function ProductForm() {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    images: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setProduct((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("price", product.price);

    product.images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const response = await fetch(`${BASE_URL}/product/add/`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to add product");

      setSuccess("Product added successfully!");
      setProduct({ name: "", description: "", price: "", images: [] });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form-container">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label>Product Name:</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Price (DZD):</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Upload Images:</label>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            accept="image/*"
          />
        </div>

        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {product.images.length > 0 && (
        <div className="image-preview">
          <h3>Preview:</h3>
          <div className="preview-images">
            {product.images.map((image, index) => (
              <img
                key={index}
                src={URL.createObjectURL(image)}
                alt={`Preview ${index + 1}`}
                className="preview-image"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductForm;