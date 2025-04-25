import React from "react";
import { Navigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import "@/styles/global.css";
import "./product-card.css";

function ProductCard({ product }) {
  const { t } = useTranslation();

  return (
    <div className="product-card">
      <Navigate to={`/product/${product.id}`} className="product-link">     
        <div className="product-images">
          {product.images?.map((image) => (
            <img
              key={image.id}
              src={image.image}
              alt={t('productCard.imageAlt', { name: product.name })}
              className="product-image"
            />
          ))}
        </div>
        <div className="product-texts-container">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>
              <strong>{t('productCard.price')}:</strong> {product.price} {t('common.currency')}
            </p>
        </div>
      </Navigate>
    </div>
  );
}

export default ProductCard;