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
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';

// Import JSON data
import wilayasData from '../../../data/wilayas.json';
import communesData from '../../../data/communes.json';

const OrderForm = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    wilaya: '',
    commune: '',
    deliveryType: 'home',
    quantity: 1,
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [product, setProduct] = useState(null);
  const [availableStock, setAvailableStock] = useState(0);
  const [filteredCommunes, setFilteredCommunes] = useState([]);
  const [selectedWilayaName, setSelectedWilayaName] = useState('');
  const [selectedCommuneName, setSelectedCommuneName] = useState('');
  const [selectedPostalCode, setSelectedPostalCode] = useState('');

  // Format numbers with thousand separators
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  // Format price with comma as decimal separator
  const formatPrice = (price) => {
    return parseFloat(price).toFixed(2).replace('.', ',');
  };

  // Filter communes when wilaya is selected
  useEffect(() => {
    if (formData.wilaya) {
      const communes = communesData.filter(commune => commune.wilaya_id === formData.wilaya);
      setFilteredCommunes(communes);
      setFormData(prev => ({ ...prev, commune: '' }));
      
      // Set wilaya name
      const selectedWilaya = wilayasData.find(w => w.id === formData.wilaya);
      setSelectedWilayaName(selectedWilaya?.name || '');
    }
  }, [formData.wilaya]);

  // Set commune name and postal code when commune is selected
  useEffect(() => {
    if (formData.commune) {
      const selectedCommune = filteredCommunes.find(c => c.id === formData.commune);
      setSelectedCommuneName(selectedCommune?.name || '');
      setSelectedPostalCode(selectedCommune?.post_code || '00000');
    }
  }, [formData.commune, filteredCommunes]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/product/${productId}/`);
        const productData = {
          ...response.data,
          price: parseFloat(response.data.price),
          available_stock: parseInt(response.data.available_stock, 10)
        };
        setProduct(productData);
        setAvailableStock(productData.available_stock || 0);
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
    setError('');
    
    if (availableStock < 1) {
      setError('This product is currently out of stock');
      setIsSubmitting(false);
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.phone || 
        !formData.address || !formData.wilaya || !formData.commune) {
      setError('All fields are required');
      setIsSubmitting(false);
      return;
    }

    if (formData.quantity < 1 || formData.quantity > availableStock) {
      setError(`Please enter a quantity between 1 and ${formatNumber(availableStock)}`);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}${API_ENDPOINTS.ORDER_CREATE}`,
        {
          ...formData,
          product: productId,
          status: ORDER_STATUS.PENDING,
          total_price: product.price * formData.quantity,
          wilaya_name: selectedWilayaName,
          commune_name: selectedCommuneName,
          postal_code: selectedPostalCode
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
            orderId: response.data.id,
            quantity: formData.quantity,
            totalPrice: product.price * formData.quantity
          }
        });
      }
    } catch (err) {
      console.error('Order submission error:', err);
      const errorMessage = err.response?.data?.detail || 
                         err.response?.data?.message || 
                         ERROR_MESSAGES.ORDER_CREATE_ERROR;
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'quantity') {
      const numericValue = value.replace(/\D/g, '');
      newValue = numericValue === '' ? 1 : Math.min(
        Math.max(1, parseInt(numericValue, 10)),
        availableStock
      );
    }

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  if (!product) return <div className="loading">Loading product details...</div>;

  return (
    <div className="order-form-container">
      <h2>Complete Your Order</h2>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <p className="price">{formatPrice(product.price)} DZD (per unit)</p>
        <p className={`stock ${availableStock === 0 ? 'out-of-stock' : ''}`}>
          Available: {formatNumber(availableStock)} units
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <TextField
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
        </div>

        <TextField
          label="Phone Number"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />

        {/* Wilaya Selection */}
        <TextField
          select
          label="Wilaya"
          name="wilaya"
          value={formData.wilaya}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        >
          {wilayasData.map((wilaya) => (
            <MenuItem key={wilaya.id} value={wilaya.id}>
              {wilaya.name} ({wilaya.ar_name})
            </MenuItem>
          ))}
        </TextField>

        {/* Commune Selection */}
        <TextField
          select
          label="Commune"
          name="commune"
          value={formData.commune}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
          disabled={!formData.wilaya}
        >
          {filteredCommunes.map((commune) => (
            <MenuItem key={commune.id} value={commune.id}>
              {commune.name} ({commune.post_code})
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
          multiline
          rows={3}
        />

        <TextField
          label="Quantity"
          name="quantity"
          type="text"
          value={formData.quantity}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
          disabled={availableStock === 0}
          inputProps={{ 
            pattern: '[0-9]*',
            inputMode: 'numeric'
          }}
          error={formData.quantity > availableStock}
          helperText={
            formData.quantity > availableStock 
              ? `Maximum ${formatNumber(availableStock)} items available`
              : ''
          }
        />

        <div className="delivery-section">
          <h4>Delivery Type</h4>
          <div className="delivery-options">
            <label>
              <input
                type="radio"
                name="deliveryType"
                value="home"
                checked={formData.deliveryType === 'home'}
                onChange={handleChange}
              />
              Home Delivery
            </label>
            <label>
              <input
                type="radio"
                name="deliveryType"
                value="center"
                checked={formData.deliveryType === 'center'}
                onChange={handleChange}
              />
              Delivery Center
            </label>
          </div>
        </div>

        {availableStock > 0 && (
          <div className="order-summary">
            <h4>Order Summary</h4>
            <p>Unit Price: {formatPrice(product.price)} DZD</p>
            <p>Quantity: {formatNumber(formData.quantity)}</p>
            <p className="total-price">
              Total: {formatPrice(product.price * formData.quantity)} DZD
            </p>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <Button 
          type="submit" 
          variant="contained" 
          color="primary"
          fullWidth
          disabled={isSubmitting || availableStock === 0}
          sx={{ mt: 3, mb: 2 }}
        >
          {availableStock === 0 ? 'Out of Stock' : 
           isSubmitting ? 'Processing...' : 'Place Order'}
        </Button>
      </form>
    </div>
  );
};

export default OrderForm;