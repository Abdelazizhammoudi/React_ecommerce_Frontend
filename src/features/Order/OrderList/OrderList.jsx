// src/features/Order/OrderList/OrderList.jsx
import React, { useEffect, useState } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, CircularProgress, Alert, Button, Box, Typography, Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  BASE_URL, 
  API_ENDPOINTS, 
  ORDER_STATUS, 
  ERROR_MESSAGES, 
  SUCCESS_MESSAGES 
} from '@/config/constants';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import OrderDetail from '../OrderDetail/OrderDetail';
import '@/features/Order/OrderList/OrderList.css';

const OrdersList = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
      return false;
    }
    return true;
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (!checkAuth()) return;

      const response = await fetch(`${BASE_URL}${API_ENDPOINTS.ORDERS_LIST}`, {
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        navigate('/admin/login');
        return;
      }

      if (!response.ok) {
        throw new Error(ERROR_MESSAGES.ORDER_FETCH_ERROR);
      }
      
      const result = await response.json();
      const ordersData = result.data || result.orders || result.results || [];
      
      if (!Array.isArray(ordersData)) {
        throw new Error('Invalid orders data format');
      }

      setOrders(ordersData);
    } catch (err) {
      setError(err.message || ERROR_MESSAGES.ORDER_FETCH_ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId) => {
    try {
      setError('');
      setSuccess('');
      
      if (!checkAuth()) return;

      const response = await fetch(
        `${BASE_URL}${API_ENDPOINTS.ORDER_STATUS(orderId)}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ status: ORDER_STATUS.DELIVERED })
        }
      );

      if (!response.ok) {
        throw new Error(ERROR_MESSAGES.ORDER_UPDATE_ERROR);
      }
      
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: ORDER_STATUS.DELIVERED } : order
        )
      );
      setSuccess(SUCCESS_MESSAGES.ORDER_UPDATE_SUCCESS);
    } catch (err) {
      setError(err.message || ERROR_MESSAGES.ORDER_UPDATE_ERROR);
      fetchOrders();
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [navigate]);

  if (loading) {
    return (
      <Box className="loading-container">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" className="error-alert">
        {error}
      </Alert>
    );
  }

  return (
    <Box className="orders-list-container">
      <Typography variant="h4" className="orders-title">
        Orders Management
      </Typography>
      
      {success && (
        <Alert severity="success" className="success-alert">
          {success}
        </Alert>
      )}

      <TableContainer component={Paper} className="orders-table-container">
        <Table className="orders-table">
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Product ID</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} className="order-row">
                <TableCell>#{order.id}</TableCell>
                <TableCell>
                  {order.firstName} {order.lastName}
                </TableCell>
                <TableCell>#{order.product}</TableCell>
                <TableCell>
                  <Chip
                    label={order.status}
                    color={order.status === ORDER_STATUS.DELIVERED ? 'success' : 'warning'}
                    className="status-chip"
                    icon={order.status === ORDER_STATUS.DELIVERED ? 
                      <CheckCircleIcon /> : <PendingIcon />}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    startIcon={<InfoIcon />}
                    onClick={() => setSelectedOrder(order)}
                    className="details-btn"
                  >
                    Details
                  </Button>
                  {order.status === ORDER_STATUS.PENDING && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleStatusUpdate(order.id)}
                      className="deliver-btn"
                    >
                      Mark Delivered
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <OrderDetail
        order={selectedOrder}
        open={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        onStatusUpdate={handleStatusUpdate}
      />
    </Box>
  );
};

export default OrdersList;