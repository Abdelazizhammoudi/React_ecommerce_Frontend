import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  BASE_URL, 
  API_ENDPOINTS, 
  ERROR_MESSAGES, 
  SUCCESS_MESSAGES,
  ORDER_STATUS
} from '@/config/constants';
import './OrderForm.css';

const OrderForm = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '', // Updated field name
    lastName: '', // Updated field name
    phone: '',
    address: '',
    deliveryType: 'home' // Updated field name
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/product/${productId}/`
        );
        setProduct(response.data);
      } catch (err) {
        console.error('Product fetch error:', err);
        setError('Failed to fetch product details');
      }
    };

    fetchProduct();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Client-side validation
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.address) {
      setError('All fields are required');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}${API_ENDPOINTS.ORDER_CREATE}`,
        {
          ...formData,
          product: productId,
          status: ORDER_STATUS.PENDING
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 201) {
        navigate('/order-status', {
          state: {
            status: 'success',
            message: SUCCESS_MESSAGES.ORDER_CREATE_SUCCESS,
            orderId: response.data.id
          }
        });
      }
    } catch (err) {
      console.error('Order submission error:', err);
      console.error('Error details:', {
        status: err.response?.status,
        data: err.response?.data,
        headers: err.response?.headers
      });

      const errorMessage = err.response?.data?.detail || 
                         err.response?.data?.message || 
                         ERROR_MESSAGES.ORDER_CREATE_ERROR;

      navigate('/order-status', {
        state: {
          status: 'error',
          message: errorMessage,
          errorDetails: err.response?.data
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!product) return <div className="loading">Loading product details...</div>;

  return (
    <div className="order-form-container">
      <h2>Complete Your Order</h2>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <p className="price">{product.price} DZD</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* First Name Field */}
        <div className="form-group">
          <label>First Name:</label>
          <input
            type="text"
            name="firstName" // Updated field name
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>

        {/* Last Name Field */}
        <div className="form-group">
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName" // Updated field name
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        {/* Phone Number Field */}
        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        {/* Address Field */}
        <div className="form-group">
          <label>Address:</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        {/* Delivery Type Radio Buttons */}
        <div className="form-group">
          <label>Delivery Type:</label>
          <div className="delivery-options">
            <label>
              <input
                type="radio"
                name="deliveryType" // Updated field name
                value="home"
                checked={formData.deliveryType === 'home'}
                onChange={handleChange}
              />
              Home Delivery
            </label>
            <label>
              <input
                type="radio"
                name="deliveryType" // Updated field name
                value="center"
                checked={formData.deliveryType === 'center'}
                onChange={handleChange}
              />
              Delivery Center
            </label>
          </div>
        </div>

        {/* Error Message Display */}
        {error && <div className="form-error">{error}</div>}

        {/* Submit Button */}
        <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner"></span>
              Processing...
            </>
          ) : 'Place Order'}
        </button>
      </form>
    </div>
  );
};

export default OrderForm;