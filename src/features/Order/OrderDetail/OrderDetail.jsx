// src/features/Order/OrderDetail/OrderDetail.jsx
import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, Button, Chip, Divider, Box, Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import '@/features/Order/OrderDetail/OrderDetail.css';

const OrderDetail = ({ 
  order, 
  open, 
  onClose, 
  onStatusUpdate 
}) => {
  const { t } = useTranslation();
  
  if (!order) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md"
      className="order-detail-modal"
    >
      <DialogTitle className="order-detail-title">
        {t('orderDetail.title')} #{order.id}
      </DialogTitle>
      <DialogContent dividers>
        <Box className="order-detail-section">
          <Typography variant="h6" gutterBottom>{t('orderDetail.customerInfo.title')}</Typography>
          <Divider className="order-detail-divider" />
          <DialogContentText component="div">
            <Box className="order-detail-field">
              <strong>{t('orderDetail.customerInfo.name')}:</strong> {order.firstName} {order.lastName}
            </Box>
            <Box className="order-detail-field">
              <strong>{t('orderDetail.customerInfo.phone')}:</strong> {order.phone}
            </Box>
            <Box className="order-detail-field">
              <strong>{t('orderDetail.customerInfo.address')}:</strong> {order.address}
            </Box>
          </DialogContentText>
        </Box>

        <Box className="order-detail-section">
          <Typography variant="h6" gutterBottom>{t('orderDetail.orderInfo.title')}</Typography>
          <Divider className="order-detail-divider" />
          <DialogContentText component="div">
            <Box className="order-detail-field">
              <strong>{t('orderDetail.orderInfo.productId')}:</strong> #{order.product}
            </Box>
            <Box className="order-detail-field">
              <strong>{t('orderDetail.orderInfo.deliveryType')}:</strong> 
              {t(`orderDetail.orderInfo.deliveryOptions.${order.deliveryType}`)}
            </Box>
            <Box className="order-detail-field">
              <strong>{t('orderDetail.orderInfo.status')}:</strong> 
              <Chip
                label={t(`orderDetail.orderInfo.statusOptions.${order.status}`)}
                color={order.status === 'delivered' ? 'success' : 'warning'}
                className="order-status-chip"
                icon={order.status === 'delivered' ? 
                  <CheckCircleIcon /> : <PendingIcon />}
              />
            </Box>
            <Box className="order-detail-field">
              <strong>{t('orderDetail.orderInfo.date')}:</strong> 
              {new Date(order.created_at).toLocaleString()}
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
              {t('orderDetail.actions.markDelivered')}
            </Button>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} className="close-btn">
          {t('orderDetail.actions.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetail;