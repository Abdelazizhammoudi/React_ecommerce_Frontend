// src/components/OrderStatus/OrderStatus.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import './orderStatus.css';

const OrderStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { state } = location;

  const isSuccess = state?.status === 'success';
  const orderId = state?.orderId;
  const quantity = state?.quantity;
  const totalPrice = state?.totalPrice;

  return (
    <div className="order-status-container">
      <div className="status-icon">
        {isSuccess ? (
          <CheckCircleIcon color="success" className="order-status-icon" />
        ) : (
          <ErrorOutlineIcon color="error" className="order-status-icon" />
        )}
      </div>
      
      <h2 className="status-title">
        {t(isSuccess ? 'orderStatus.success.title' : 'orderStatus.error.title')}
      </h2>

      <div className="status-message">
        {isSuccess ? (
          <>
            <p>{t('orderStatus.success.message')}</p>
            {orderId && (
              <p className="order-details">
                {t('orderStatus.success.orderId', { id: orderId })}
              </p>
            )}
            {quantity && totalPrice && (
              <div className="order-summary">
                <p>{t('orderStatus.success.quantity', { quantity })}</p>
                <p>{t('orderStatus.success.totalPrice', { price: totalPrice, currency: t('common.currency') })}</p>
              </div>
            )}
          </>
        ) : (
          <p>{t('orderStatus.error.message')}</p>
        )}
      </div>

      <button 
        className="back-button"
        onClick={() => navigate('/')}
      >
        {t('orderStatus.backToHome')}
      </button>
    </div>
  );
};

export default OrderStatus;