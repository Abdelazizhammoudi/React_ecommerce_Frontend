// src/components/OrderStatus/OrderStatus.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './OrderStatus.css';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; 

const OrderStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location; // Get state passed via navigate

  const isSuccess = state?.status === 'success';
  const message = state?.message || (isSuccess ? 'Order placed successfully!' : 'Failed to place order.');

  return (
    <div className="order-status-container">
      <h2>{isSuccess ? (
            <CheckCircleIcon color="success" className="order-status-icon" />
          ) : (
            <ErrorOutlineIcon color="error" className="order-status-icon" />
          )}</h2>
      <p>{message}</p>
      <button 
        className="back-button"
        onClick={() => navigate('/')}
      >
        Back to Home
      </button>
    </div>
  );
};

export default OrderStatus;