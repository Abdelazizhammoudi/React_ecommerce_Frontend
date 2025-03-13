import React, { useState } from "react";
import "../assets/ProductForm.css";
import Button from "@mui/material/Button";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { BASE_URL } from "../constants";

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
    setProduct((prevProduct) => ({
      ...prevProduct,
      images: [...prevProduct.images, ...files],
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
        headers: {
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      const data = await response.json();
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
      <h2 className="title">Add New Product</h2>
      <form onSubmit={handleSubmit} className="product-form">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={product.name}
          onChange={handleChange}
          className="input-field"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={product.description}
          onChange={handleChange}
          className="input-field textarea"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={product.price}
          onChange={handleChange}
          className="input-field"
          required
        />

        {/* Material UI Upload Button */}
        <Button
          component="label"
          variant="contained"
          startIcon={<AddPhotoAlternateIcon />}
          className="upload-button"
        >
          Upload Images
          <input
            type="file"
            multiple
            accept="image/*"
            className="visually-hidden-input"
            onChange={handleImageChange}
          />
        </Button>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>

      {/* Display Messages */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      {/* Image Preview */}
      {product.images.length > 0 && (
        <div className="preview-container">
          <h3 className="preview-title">Preview:</h3>
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
