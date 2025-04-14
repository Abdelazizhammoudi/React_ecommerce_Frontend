import React, { useState } from 'react';
import { Grid, Card, CardContent, Typography, Button, Box } from '@mui/material';
import OrderList from '@/features/Order/OrderList/OrderList';
import ProductsList from '@/features/product/components/ProductList/ProductList';
import './Dashboard.css';

const Dashboard = () => {
    const [activeView, setActiveView] = useState('overview');

    return (
        <Box className="dashboard-container">
            <Typography variant="h3" className="dashboard-title">
            لوحة تحكم الإدارة
            </Typography>
            
            {activeView === 'overview' && (
                <Grid container spacing={3} className="dashboard-grid">
                    <Grid item xs={12} md={6} lg={4}>
                        <Card elevation={3} className="dashboard-card">
                            <CardContent className="card-content">
                                <Typography variant="h5" className="card-title">
                                الطلبات     
                                </Typography>   
                                <Button 
                                    variant="contained" 
                                    onClick={() => setActiveView('orders')}
                                    className="manage-button"
                                    fullWidth
                                >
                                    إدارة الطلبات
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={6} lg={4}>
                        <Card elevation={3} className="dashboard-card">
                            <CardContent className="card-content">
                                <Typography variant="h5" className="card-title">
                                المنتجات
                                </Typography>
                                <Button 
                                    variant="contained" 
                                    onClick={() => setActiveView('products')}
                                    className="manage-button"
                                    fullWidth
                                >
                                    إدارة المنتجات
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {activeView === 'orders' && (
                <div className="content-container">
                    <Button 
                        variant="outlined" 
                        onClick={() => setActiveView('overview')}
                        className="back-button"
                    >
                             الرجوع إلى لوحة التحكم
                    </Button>
                    <OrderList />
                </div>
            )}

            {activeView === 'products' && (
                <div className="content-container">
                    <Button 
                        variant="outlined" 
                        onClick={() => setActiveView('overview')}
                        className="back-button"
                    >
                            الرجوع إلى لوحة التحكم
                    </Button>
                    <ProductsList />
                </div>
            )}
        </Box>
    );
};

export default Dashboard;