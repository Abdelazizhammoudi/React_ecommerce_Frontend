import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Button, CircularProgress, Alert,
  Card, CardContent, Grid, Chip, Divider, Table, TableBody, TableCell, TableRow
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  BASE_URL, 
  API_ENDPOINTS, 
  ORDER_STATUS, 
  ERROR_MESSAGES, 
  SUCCESS_MESSAGES 
} from '@/config/constants';
import { 
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  ArrowBack as BackIcon,
  Home as HomeIcon,
  Store as StoreIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as DateIcon
} from '@mui/icons-material';

const OrdersList = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken');
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
          'Authorization': `Token ${localStorage.getItem('adminToken')}`
        }
      });

      if (!response.ok) {
        throw new Error(ERROR_MESSAGES.ORDER_FETCH_ERROR);
      }
      
      const data = await response.json();
      console.log('API Response:', data); // Debug log

      // Handle different response formats
      const ordersData = Array.isArray(data) ? data : 
                        data.data ? data.data : 
                        data.orders ? data.orders : 
                        data.results ? data.results : [];
      
      if (!ordersData.length) {
        console.warn('No orders found in response');
      }

      setOrders(ordersData);
    } catch (err) {
      console.error('Fetch error:', err);
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
            'Authorization': `Token ${localStorage.getItem('adminToken')}`
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
      console.error('Update error:', err);
      setError(err.message || ERROR_MESSAGES.ORDER_UPDATE_ERROR);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  if (orders.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Orders Management
        </Typography>
        <Alert severity="info">No orders found</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>

      <Typography variant="h4" sx={{ mb: 3 }}>
        Orders Management
      </Typography>
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {orders.map((order) => (
          <Grid item xs={12} key={order.id}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Order #{order.id}
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography>
                      <strong>Customer:</strong> {order.firstName || 'N/A'} {order.lastName || 'N/A'}
                    </Typography>
                    <Typography>
                      <PhoneIcon fontSize="small" /> {order.phone || 'N/A'}
                    </Typography>
                    <Typography>
                      <DateIcon fontSize="small" /> {order.created_at ? new Date(order.created_at).toLocaleString() : 'N/A'}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Chip
                      label={order.status || 'N/A'}
                      color={order.status === ORDER_STATUS.DELIVERED ? 'success' : 'warning'}
                      icon={order.status === ORDER_STATUS.DELIVERED ? 
                        <CheckCircleIcon /> : <PendingIcon />}
                    />
                    <Button
                      variant="outlined"
                      startIcon={<InfoIcon />}
                      onClick={() => navigate(`/admin/orders/${order.id}`)}
                    >
                      Details
                    </Button>
                    {order.status === ORDER_STATUS.PENDING && (
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleStatusUpdate(order.id)}
                      >
                        Deliver
                      </Button>
                    )}
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ border: 0, width: '25%' }}>
                        <Typography variant="subtitle2">Product Info</Typography>
                        <Typography>ID: #{order.product || 'N/A'}</Typography>
                        <Typography>Qty: {order.quantity || 'N/A'}</Typography>
                        <Typography>Total: {order.total_price || '0'} DZD</Typography>
                        {console.log('Order:', order)} {/* Debug log */}
                        {console.log('Order:', order.quantity)} {/* Debug log */}
                      </TableCell>
                      
                      <TableCell sx={{ border: 0, width: '25%' }}>
                        <Typography variant="subtitle2">Delivery</Typography>
                        <Typography>
                          {order.deliveryType === 'home' ? (
                            <span><HomeIcon fontSize="small" /> Home Delivery</span>
                          ) : (
                            <span><StoreIcon fontSize="small" /> Center Pickup</span>
                          )}
                        </Typography>
                      </TableCell>
                      
                      <TableCell sx={{ border: 0, width: '25%' }}>
                        <Typography variant="subtitle2">Location</Typography>
                        <Typography>
                          <LocationIcon fontSize="small" /> {order.wilaya_name || 'N/A'}
                        </Typography>
                        <Typography>
                          <LocationIcon fontSize="small" /> {order.commune_name || 'N/A'}
                        </Typography>
                        <Typography>Postal: {order.postal_code || 'N/A'}</Typography>
                      </TableCell>
                      
                      <TableCell sx={{ border: 0, width: '25%' }}>
                        <Typography variant="subtitle2">Address</Typography>
                        <Typography>{order.address || 'N/A'}</Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default OrdersList;