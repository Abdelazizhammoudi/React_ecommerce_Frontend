import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  BASE_URL, 
  API_ENDPOINTS, 
  ORDER_STATUS, 
  ERROR_MESSAGES,
} from '@/config/constants';
import './OrderList.css';

const OrdersList = ({ isAdmin }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/unauthorized');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}${API_ENDPOINTS.ORDERS_LIST}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
          }
        );
        setOrders(response.data);
      } catch (err) {
        setError(err.response?.data?.message || ERROR_MESSAGES.ORDER_FETCH_ERROR);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAdmin, navigate]);

  const handleStatusUpdate = async (orderId) => {
    try {
      await axios.patch(
        `${BASE_URL}${API_ENDPOINTS.ORDER_UPDATE(orderId)}`,
        { status: ORDER_STATUS.DELIVERED },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );

      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { 
            ...order, 
            status: ORDER_STATUS.DELIVERED 
          } : order
        )
      );
      alert('Order status updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || ERROR_MESSAGES.ORDER_UPDATE_ERROR);
    }
  };

  if (loading) return <div className="orders-loading">Loading orders...</div>;
  if (error) return <div className="orders-error">Error: {error}</div>;

  return (
    <div className="orders-list-container">
      <h1 className="orders-title">Orders Management</h1>
      <div className="orders-table">
        <div className="orders-table-header">
          <div>Order ID</div>
          <div>Customer</div>
          <div>Product</div>
          <div>Phone</div>
          <div>Delivery</div>
          <div>Status</div>
          <div>Actions</div>
        </div>

        {orders.map(order => (
          <div className="orders-table-row" key={order.id}>
            <div>#{order.id}</div>
            <div>{order.firstName} {order.lastName}</div>
            <div>{order.product?.name || 'N/A'}</div>
            <div>{order.phone}</div>
            <div>{order.deliveryType === 'home' ? 'Home' : 'Center'}</div>
            <div className={`status-indicator status-${order.status}`}>
              {order.status}
            </div>
            <div>
              {order.status === ORDER_STATUS.PENDING && (
                <button
                  className="status-update-btn"
                  onClick={() => handleStatusUpdate(order.id)}
                >
                  Mark Delivered
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersList;