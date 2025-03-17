import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../constants";
import useFetch from "../hooks/useFetch";
import "../assets/product-detail.css"; // Ensure the correct CSS file is imported


function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, loading, error } = useFetch(`/product/${id}/`);

  if (loading) return <div className="loading">Loading product details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return <div className="error">Product not found</div>;

  return (
    <div className="product-detail-container">
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p><strong>Price:</strong> ${product.price}</p>
      <div className="product-images">
                {product.images && product.images.length > 0 ? (
                  product.images.map((image) => (
                    <img
                      key={image.id} // Use image.id as the key
                      src={image.image} // Use the full image URL from the API
                      alt={`${product.name}`}
                      className="product-image"
                      onError={(e) => {
                        e.target.src = "path/to/fallback/image.jpg"; // Fallback image
                      }}
                    />
                  ))
                ) : (
                  <p>No images available</p>
                )}
              </div>
      <button onClick={() => navigate(`/product/${id}/update`)}>Update</button>
    </div>
  );
}

export default ProductDetail;