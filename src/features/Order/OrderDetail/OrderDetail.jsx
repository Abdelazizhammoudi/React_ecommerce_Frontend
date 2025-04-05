// src/features/Order/OrderDetail/OrderDetail.jsx
import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, Button, Chip, Divider, Box, Typography
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import '@/features/Order/OrderDetail/OrderDetail.css';

const OrderDetail = ({ 
  order, 
  open, 
  onClose, 
  onStatusUpdate 
}) => {
  if (!order) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md"
      className="order-detail-modal"
    >
      <DialogTitle className="order-detail-title">
        Order Details #{order.id}
      </DialogTitle>
      <DialogContent dividers>
        <Box className="order-detail-section">
          <Typography variant="h6" gutterBottom>Customer Information</Typography>
          <Divider className="order-detail-divider" />
          <DialogContentText component="div">
            <Box className="order-detail-field">
              <strong>Name:</strong> {order.firstName} {order.lastName}
            </Box>
            <Box className="order-detail-field">
              <strong>Phone:</strong> {order.phone}
            </Box>
            <Box className="order-detail-field">
              <strong>Address:</strong> {order.address}
            </Box>
          </DialogContentText>
        </Box>

        <Box className="order-detail-section">
          <Typography variant="h6" gutterBottom>Order Information</Typography>
          <Divider className="order-detail-divider" />
          <DialogContentText component="div">
            <Box className="order-detail-field">
              <strong>Product ID:</strong> #{order.product}
            </Box>
            <Box className="order-detail-field">
              <strong>Delivery Type:</strong> {order.deliveryType === 'home' ? 
                'Home Delivery' : 'Center Pickup'}
            </Box>
            <Box className="order-detail-field">
              <strong>Status:</strong> 
              <Chip
                label={order.status}
                color={order.status === 'delivered' ? 'success' : 'warning'}
                className="order-status-chip"
                icon={order.status === 'delivered' ? 
                  <CheckCircleIcon /> : <PendingIcon />}
              />
            </Box>
            <Box className="order-detail-field">
              <strong>Date:</strong> {new Date(order.created_at).toLocaleString()}
            </Box>
          </DialogContentText>
        </Box>

        {order.status === 'pending' && (
          <Box className="order-detail-actions">
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                onStatusUpdate(order.id);
                onClose();
              }}
              startIcon={<CheckCircleIcon />}
              className="mark-delivered-btn"
            >
              Mark as Delivered
            </Button>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} className="close-btn">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetail;