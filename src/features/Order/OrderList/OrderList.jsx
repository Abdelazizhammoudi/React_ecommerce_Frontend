import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Button, CircularProgress, Alert,
  Card, CardContent, Grid, Chip, Divider, Table, TableBody, 
  TableCell, TableRow, Dialog, DialogTitle, DialogContent, 
  DialogContentText, DialogActions
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
  CalendarToday as DateIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const OrdersList = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);

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
      const ordersData = Array.isArray(data) ? data : 
                        data.data ? data.data : 
                        data.orders ? data.orders : 
                        data.results ? data.results : [];
      
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

  const handleOpenDetails = (order) => {
    setSelectedOrder(order);
    setOpenDetails(true);
  };

  const handleCloseDetails = () => {
    setOpenDetails(false);
    setSelectedOrder(null);
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
                <Grid container alignItems="center" spacing={2}>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="subtitle1">
                      <strong>Order #{order.id}</strong>
                    </Typography>
                    <Typography variant="body2">
                      {order.firstName} {order.lastName}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={3}>
                    <Typography variant="body2">
                      <strong>Product:</strong> #{order.product}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={2}>
                    <Chip
                      label={order.status}
                      color={order.status === ORDER_STATUS.DELIVERED ? 'success' : 'warning'}
                      icon={order.status === ORDER_STATUS.DELIVERED ? 
                        <CheckCircleIcon /> : <PendingIcon />}
                      size="small"
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={4} sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<InfoIcon />}
                      onClick={() => handleOpenDetails(order)}
                    >
                      Details
                    </Button>
                    {order.status === ORDER_STATUS.PENDING && (
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleStatusUpdate(order.id)}
                      >
                        Deliver
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Order Details Dialog */}
      <Dialog 
        open={openDetails} 
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Order Details #{selectedOrder?.id}
          <Button 
            onClick={handleCloseDetails}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </Button>
        </DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Customer Information</Typography>
                <Typography><strong>Name:</strong> {selectedOrder.firstName} {selectedOrder.lastName}</Typography>
                <Typography><PhoneIcon fontSize="small" /> <strong>Phone:</strong> {selectedOrder.phone}</Typography>
                <Typography><DateIcon fontSize="small" /> <strong>Date:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Order Information</Typography>
                <Typography><strong>Status:</strong> 
                  <Chip
                    label={selectedOrder.status}
                    color={selectedOrder.status === ORDER_STATUS.DELIVERED ? 'success' : 'warning'}
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </Typography>
                <Typography><strong>Product ID:</strong> #{selectedOrder.product}</Typography>
                <Typography><strong>Quantity:</strong> {selectedOrder.quantity}</Typography>
                <Typography><strong>Total Price:</strong> {selectedOrder.total_price} DZD</Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Delivery Information</Typography>
                <Typography>
                  <strong>Type:</strong> 
                  {selectedOrder.deliveryType === 'home' ? (
                    <span><HomeIcon fontSize="small" sx={{ ml: 0.5 }} /> Home Delivery</span>
                  ) : (
                    <span><StoreIcon fontSize="small" sx={{ ml: 0.5 }} /> Delivery Center</span>
                  )}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Location Information</Typography>
                <Typography><LocationIcon fontSize="small" /> <strong>Wilaya:</strong> {selectedOrder.wilaya_name} ({selectedOrder.wilaya})</Typography>
                <Typography><LocationIcon fontSize="small" /> <strong>Commune:</strong> {selectedOrder.commune_name} ({selectedOrder.commune})</Typography>
                <Typography><strong>Postal Code:</strong> {selectedOrder.postal_code}</Typography>
                <Typography><strong>Address:</strong> {selectedOrder.address}</Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrdersList;