import React, { useState } from "react";
import { BASE_URL } from "@/config/constants";
import "@/styles/global.css";
import "./product-form.css";
import TextField from '@mui/material/TextField';

function ProductForm() {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    available_stock: 0,
    images: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Format numbers with thousand separators
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  // Handle price input formatting
  const handlePriceChange = (e) => {
    const value = e.target.value
      .replace(/[^0-9,]/g, '') // Allow only numbers and commas
      .replace(/,/g, '.');     // Convert comma to decimal point
    
    setProduct(prev => ({
      ...prev,
      price: value
    }));
  };

  // Handle stock input formatting
  const handleStockChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setProduct(prev => ({
      ...prev,
      available_stock: value === '' ? 0 : parseInt(value, 10)
    }));
  };

  // Handle other fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setProduct(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("price", parseFloat(product.price.replace(',', '.'))); // Ensure proper float format
      formData.append("available_stock", product.available_stock);

      product.images.forEach((image) => {
        formData.append("images", image);
      });

      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/product/add/`, {
        method: "POST",
        body: formData,
        headers: {
          'Authorization': `Token ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add product");
      }

      setSuccess("Product added successfully!");
      setProduct({ 
        name: "", 
        description: "", 
        price: "", 
        available_stock: 0,
        images: [] 
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Format price for display
  const formattedPrice = product.price 
    ? parseFloat(product.price.replace(',', '.')).toFixed(2).replace('.', ',')
    : '';

  return (
    <div className="product-form-container">
      <h2>Add New Product</h2>
      
      <form onSubmit={handleSubmit} className="product-form">

          <TextField
            label="Product Name"
            type="text"
            name="name"
            placeholder="Product name"
            value={product.name}
            onChange={handleChange}
            required
          />
        

        {/* <div className="form-group"> */}
          <TextField
            label="Description"
            name="description"
            value={product.description}
            onChange={handleChange}
            margin="normal"
            required
            fullWidth
            multiline
            rows={3}
          />
        {/* </div> */}

          <TextField
            label="Price"
            type="text"
            name="price"
            value={formattedPrice}
            placeholder="0,00"
            onChange={handlePriceChange}
            required
          />

          <TextField
            label="Available Stock"
            type="text"
            name="available_stock"
            value={product.available_stock === 0 ? '' : formatNumber(product.available_stock)}
            placeholder="0"
            onChange={handleStockChange}
            inputMode="numeric"
            required
          />

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

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
    </div>
  );
}

export default ProductForm;