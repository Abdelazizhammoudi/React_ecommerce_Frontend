import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import useFetch from "@/hooks/useFetch";
import "@/styles/global.css"; // Global styles
import "./product-detail.css"; // Component-specific styles

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
      <p>
        <strong>Price:</strong> DZD{product.price}
      </p>

      {/* Image Grid */}
      <div className="product-images">
        {product.images && product.images.length > 0 ? (
          product.images.map((image) => (
            <img
              key={image.id}
              src={image.image}
              alt={`${product.name}`}
              className="product-image"
              loading="lazy" // Lazy load images
              onError={(e) => {
                e.target.src = "path/to/fallback/image.jpg"; // Fallback image
              }}
            />
          ))
        ) : (
          <p>No images available</p>
        )}
      </div>

      {/* Update Button */}
      <button
        className="primary-button" // Added class for styling
        onClick={() => navigate(`/product/${id}/update`)}
      >
        Update Product
      </button>
    </div>
  );
}

export default ProductDetail;