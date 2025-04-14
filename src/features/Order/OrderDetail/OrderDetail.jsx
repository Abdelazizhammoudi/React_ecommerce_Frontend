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
        تفاصيل الطلب  #{order.id}
      </DialogTitle>
      <DialogContent dividers>
        <Box className="order-detail-section">
          <Typography variant="h6" gutterBottom>معلومات العميل</Typography>
          <Divider className="order-detail-divider" />
          <DialogContentText component="div">
            <Box className="order-detail-field">
              <strong>الاسم:</strong> {order.firstName} {order.lastName}
            </Box>
            <Box className="order-detail-field">
              <strong>الهاتف :</strong> {order.phone}
            </Box>
            <Box className="order-detail-field">
              <strong>العنوان:</strong> {order.address}
            </Box>
          </DialogContentText>
        </Box>

        <Box className="order-detail-section">
          <Typography variant="h6" gutterBottom>معلومات الطلب</Typography>
          <Divider className="order-detail-divider" />
          <DialogContentText component="div">
            <Box className="order-detail-field">
              <strong>معرف المنتج:</strong> #{order.product}
            </Box>
            <Box className="order-detail-field">
              <strong>نوع التوصيل:</strong> {order.deliveryType === 'home' ? 
                'Home Delivery' : 'Center Pickup'}
            </Box>
            <Box className="order-detail-field">
              <strong>الحالة:</strong> 
              <Chip
                label={order.status}
                color={order.status === 'delivered' ? 'success' : 'warning'}
                className="order-status-chip"
                icon={order.status === 'delivered' ? 
                  <CheckCircleIcon /> : <PendingIcon />}
              />
            </Box>
            <Box className="order-detail-field">
              <strong>التاريخ:</strong> {new Date(order.created_at).toLocaleString()}
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
              تم التوصيل
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