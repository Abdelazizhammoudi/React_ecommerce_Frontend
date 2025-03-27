import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useFetch from "@/hooks/useFetch";
import { useAuth } from "@/context/AuthContext"; // Import useAuth hook
import "@/styles/global.css";
import "./product-detail.css";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, loading, error } = useFetch(`/product/${id}/`);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { admin } = useAuth(); // Get admin status from AuthContext

  if (loading) return <div className="loading">Loading product details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return <div className="error">Product not found</div>;

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="product-detail-container">
      {/* Image Section */}
      <div className="product-images-detail">
        {product.images && product.images.length > 0 ? (
          <>
            <img
              key={product.images[currentImageIndex].id}
              src={product.images[currentImageIndex].image}
              alt={`${product.name}`}
              className="product-image-detail"
              loading="lazy"
              onError={(e) => {
                e.target.src = "path/to/fallback/image.jpg";
              }}
            />
            <button className="nav-button prev" onClick={handlePrevImage}>
              &lt;
            </button>
            <button className="nav-button next" onClick={handleNextImage}>
              &gt;
            </button>
          </>
        ) : (
          <p>No images available</p>
        )}
      </div>

      {/* Product Info Section */}
      <div className="product-info">
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <p className="price">{product.price} DZD</p>
      </div>

      {/* Action Buttons */}
      <div className="product-actions">
        <button
          className="buy-now-button"
          onClick={() => navigate(`/order/${id}`)} // Ensure this matches your route
        >
          Buy Now
        </button>
        {admin?.isAdmin && ( // Only show this button if the user is an admin
          <button
            className="update-button"
            onClick={() => navigate(`/product/${id}/update`)}
          >
            Update Product
          </button>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;