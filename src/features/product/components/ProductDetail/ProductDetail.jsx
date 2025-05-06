import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import useFetch from "@/hooks/useFetch";
import { useAuth } from "@/context/AuthContext";
import "@/styles/global.css";
import "./product-detail.css";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: product, loading, error } = useFetch(`/product/${id}/`);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { admin } = useAuth();

  if (loading) return <div className="loading">{t('productDetail.loading')}</div>;
  if (error) return <div className="error">{t('productDetail.error')}</div>;
  if (!product) return <div className="error">{t('productDetail.notFound')}</div>;

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
      <div className="product-images-detail">
        {product.images && product.images.length > 0 ? (
          <>
            <img
              key={product.images[currentImageIndex].id}
              src={product.images[currentImageIndex].image}
              alt={t('productDetail.imageAlt', { name: product.name })}
              className="product-image-detail"
              loading="lazy"
              onError={(e) => {
                e.target.src = "path/to/fallback/image.jpg";
              }}
            />
            <button 
              className="nav-button prev" 
              onClick={handlePrevImage}
              aria-label={t('productDetail.prevImage')}
            >
              &lt;
            </button>
            <button 
              className="nav-button next" 
              onClick={handleNextImage}
              aria-label={t('productDetail.nextImage')}
            >
              &gt;
            </button>
          </>
        ) : (
          <p>{t('productDetail.noImages')}</p>
        )}
      </div>

      <div className="product-info">
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <p className="price">
          {product.price} {t('home.products.currency')}
        </p>
      </div>

      <div className="product-actions">
        <button
          className="buy-now-button"
          onClick={() => navigate(`/order/${id}`)}
        >
          {t('productDetail.buttons.buyNow')}
        </button>
        {admin?.isAdmin && (
          <button
            className="update-button"
            onClick={() => navigate(`/product/${id}/update`)}
          >
            {t('productDetail.buttons.updateProduct')}
          </button>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;