import React from "react";
import { Link } from "react-router-dom";
import "@/styles/global.css";
import "./product-card.css";

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-link">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <p><strong>Price:</strong> ${product.price}</p>
        <div className="product-images">
          {product.images?.map((image) => (
            <img
              key={image.id}
              src={image.image}
              alt={`${product.name}`}
              className="product-image"
            />
          ))}
        </div>
      </Link>
    </div>
  );
}

export default ProductCard;