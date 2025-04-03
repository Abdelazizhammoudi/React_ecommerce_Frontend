import React, { useEffect, useState } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, CircularProgress, Alert, Button, Box, Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  BASE_URL, 
  API_ENDPOINTS, 
  ORDER_STATUS, 
  ERROR_MESSAGES, 
  SUCCESS_MESSAGES 
} from '@/config/constants';

const OrdersList = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Enhanced authentication check with debugging
  const checkAuth = () => {
    const token = localStorage.getItem('token');
    console.debug('[Auth] Current token:', token ? 'Exists' : 'Missing');
    if (!token) {
      console.warn('[Auth] No token, redirecting to login');
      navigate('/admin/login');
      return false;
    }
    return true;
  };

  // Robust data fetching with multiple fallbacks
  const fetchOrders = async () => {
    console.group('[Fetch] Starting orders fetch');
    try {
      setLoading(true);
      setError('');
      
      if (!checkAuth()) {
        console.warn('[Auth] Authentication failed');
        return;
      }

      const endpoint = `${BASE_URL}${API_ENDPOINTS.ORDERS_LIST}`;
      console.debug('[Fetch] Requesting:', endpoint);

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      console.debug('[Fetch] Response status:', response.status);
      
      if (response.status === 401) {
        console.warn('[Auth] Token expired, clearing and redirecting');
        localStorage.removeItem('token');
        navigate('/admin/login');
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Fetch] Server error:', errorText);
        throw new Error(errorText || ERROR_MESSAGES.ORDER_FETCH_ERROR);
      }
      
      const result = await response.json();
      console.debug('[Fetch] Raw response:', result);

      // Multiple format handling with validation
      let ordersData = [];
      if (Array.isArray(result)) {
        ordersData = result;
      } else if (result && typeof result === 'object') {
        ordersData = result.data || result.orders || result.results || [];
      }

      if (!Array.isArray(ordersData)) {
        console.warn('[Fetch] Unexpected data format, converting to array');
        ordersData = [result];
      }

      console.debug('[Fetch] Processed orders:', ordersData);
      setOrders(ordersData);
    } catch (err) {
      console.error('[Fetch] Error:', err);
      setError(err.message || ERROR_MESSAGES.ORDER_FETCH_ERROR);
    } finally {
      console.log('[Fetch] Completed, setting loading false');
      setLoading(false);
      console.groupEnd();
    }
  };

  // Status update with error recovery
  const handleStatusUpdate = async (orderId) => {
    console.group('[Update] Starting status update');
    try {
      setError('');
      setSuccess('');
      
      if (!checkAuth()) return;

      console.debug('[Update] Updating order:', orderId);
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

      if (response.status === 401) {
        localStorage.removeItem('token');
        navigate('/admin/login');
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Update] Server error:', errorText);
        throw new Error(errorText || ERROR_MESSAGES.ORDER_UPDATE_ERROR);
      }
      
      // Optimistic UI update
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: ORDER_STATUS.DELIVERED } : order
        )
      );
      setSuccess(SUCCESS_MESSAGES.ORDER_UPDATE_SUCCESS);
      console.debug('[Update] Successfully updated order');
    } catch (err) {
      console.error('[Update] Error:', err);
      setError(err.message || ERROR_MESSAGES.ORDER_UPDATE_ERROR);
      // Re-fetch to ensure sync with server
      fetchOrders();
    } finally {
      console.groupEnd();
    }
  };

  // Fetch data on mount with timeout safety
  useEffect(() => {
    let timeoutId;
    
    const fetchData = async () => {
      await fetchOrders();
      // Clear timeout if fetch completes
      if (timeoutId) clearTimeout(timeoutId);
    };

    // Set timeout for 15 seconds
    timeoutId = setTimeout(() => {
      if (loading) {
        console.warn('[Timeout] Request taking too long');
        setError('Request timeout. Please check your connection.');
        setLoading(false);
      }
    }, 15000);

    fetchData();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [navigate]);

  // Loading state with timeout warning
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '200px',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress />
        <Typography variant="body1">
          Loading orders...
        </Typography>
        {error && (
          <Alert severity="warning" sx={{ maxWidth: 400 }}>
            {error}
          </Alert>
        )}
      </Box>
    );
  }

  // Error state with retry option
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={fetchOrders}
          sx={{ mt: 1 }}
          startIcon={<RefreshIcon />}
        >
          Retry Loading Orders
        </Button>
      </Box>
    );
  }

  // Main render with data
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Orders Management
      </Typography>
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Product ID</TableCell>
              <TableCell>Delivery</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>#{order.id}</TableCell>
                  <TableCell>
                    <Typography fontWeight="medium">
                      {order.firstName} {order.lastName}
                    </Typography>
                    {order.address && (
                      <Typography variant="body2" color="text.secondary">
                        {order.address}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>{order.phone || 'N/A'}</TableCell>
                  <TableCell>#{order.product || 'N/A'}</TableCell>
                  <TableCell>
                    {order.deliveryType === 'home' ? 'Home Delivery' : 'Center Pickup'}
                  </TableCell>
                  <TableCell>
                    <Typography 
                      color={order.status === ORDER_STATUS.DELIVERED ? 'success.main' : 'warning.main'}
                      fontWeight="bold"
                    >
                      {order.status.toUpperCase()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {order.status === ORDER_STATUS.PENDING && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleStatusUpdate(order.id)}
                        size="small"
                      >
                        Mark Delivered
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No orders found
                  </Typography>
                  <Button 
                    variant="outlined" 
                    onClick={fetchOrders}
                    sx={{ mt: 2 }}
                  >
                    Refresh List
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default OrdersList;