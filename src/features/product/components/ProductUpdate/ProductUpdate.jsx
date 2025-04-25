import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { ProductService } from "@/services/productService";
import useFetch from "@/hooks/useFetch";
import useImageUpload from "@/hooks/useImageUpload";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import "@/styles/global.css";
import "./product-update.css";

function ProductUpdate() {
  const { t } = useTranslation();
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

  // Initialize form data when product is fetched
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
      });
    }
  }, [product]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const updatedProduct = await ProductService.update(id, formData);
      setProduct(updatedProduct);
      alert(t('productUpdate.success'));
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle image upload
  const handleUploadImages = async () => {
    if (newImages.length === 0) {
      alert(t('productUpdate.images.noImages'));
      return;
    }

    try {
      const uploadedImages = await uploadImages(id, newImages);
      setProduct((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedImages],
      }));
      setNewImages([]);
      alert(t('productUpdate.images.success'));
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  // Handle image deletion
  const handleDeleteImage = async (imageId) => {
    if (window.confirm(t('productUpdate.images.confirmDelete'))) {
      try {
        await ProductService.deleteImage(imageId);
        setProduct((prev) => ({
          ...prev,
          images: prev.images.filter((image) => image.id !== imageId),
        }));
        alert(t('productUpdate.images.deleted'));
      } catch (err) {
        setErrorMessage(err.message);
      }
    }
  };

  // Handle product deletion
  const handleDeleteProduct = async () => {
    if (window.confirm(t('productUpdate.confirmDelete'))) {
      try {
        await ProductService.deleteProduct(id);
        alert(t('productUpdate.deleted'));
        navigate("/products");
      } catch (err) {
        setErrorMessage(err.message);
      }
    }
  };

  if (loading) return <div className="loading">{t('productUpdate.loading')}</div>;
  if (error) return <div className="error">{t(error)}</div>;
  if (!product) return <div className="error">{t('productUpdate.notFound')}</div>;

  return (
    <div className="product-update-container">
      <Link to={`/product/${id}`} className="back-link">
        &larr; {t('productUpdate.backToProduct')}
      </Link>

      <h2>{t('productUpdate.title')}</h2>

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label>{t('productUpdate.fields.name')}:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>{t('productUpdate.fields.description')}:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>{t('productUpdate.fields.price', { currency: t('common.currency') })}:</label>
          <input
            type="number"
            step="0.01"
            min="0"
            name="price"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
        </div>

        <button type="submit" className="primary-button" disabled={isUpdating}>
          {isUpdating ? t('productUpdate.buttons.updating') : t('productUpdate.buttons.update')}
        </button>
      </form>

      <div className="image-section">
        <h3>{t('productUpdate.images.title')}</h3>
        <div className="product-images-update">
          {product.images.map((image) => (
            <div key={image.id} className="image-container-update">
              <img
                src={image.image}
                alt={t('productUpdate.images.alt', { name: product.name })}
                className="product-image-update"
              />
              <button
                className="delete-image-button"
                onClick={() => handleDeleteImage(image.id)}
                aria-label={t('productUpdate.images.deleteAria')}
              >
                <CloseIcon fontSize="small" />
              </button>
            </div>
          ))}
        </div>

        <div className="upload-section">
          <input
            type="file"
            multiple
            onChange={(e) => setNewImages(Array.from(e.target.files))}
            accept="image/*"
            id="image-upload"
            style={{ display: "none" }}
          />
          <label htmlFor="image-upload" className="upload-button">
            {t('productUpdate.images.choose')}
          </label>

          {newImages.length > 0 && (
            <Button
              variant="contained"
              startIcon={<CloudUploadIcon />}
              className="mui-upload-button"
              onClick={handleUploadImages}
              disabled={isUploading}
            >
              {isUploading ? t('productUpdate.images.uploading') : t('productUpdate.images.upload')}
            </Button>
          )}
        </div>
      </div>

      <Button
        className="delete-product-button"
        variant="contained"
        color="error"
        startIcon={<DeleteIcon />}
        onClick={handleDeleteProduct}
        style={{ marginTop: "2rem" }}
      >
        {t('productUpdate.buttons.delete')}
      </Button>

      {(errorMessage || uploadError) && (
        <div className="error-message">
          {t(errorMessage || uploadError)}
        </div>
      )}
    </div>
  );
}

export default ProductUpdate;