import React, { useState } from 'react';
import { Grid, Card, CardContent, Typography, Button, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import OrderList from '@/features/Order/OrderList/OrderList';
import ProductsList from '@/features/product/components/ProductList/ProductList';
import './Dashboard.css';

const Dashboard = () => {
    const [activeView, setActiveView] = useState('overview');
    const { t } = useTranslation();

    return (
        <Box className="dashboard-container">
            <Typography variant="h3" className="dashboard-title">
                {t('dashboard.title')}
            </Typography>
            
            {activeView === 'overview' && (
                <Grid container spacing={3} className="dashboard-grid">
                    <Grid item xs={12} md={6} lg={4}>
                        <Card elevation={3} className="dashboard-card">
                            <CardContent className="card-content">
                                <Typography variant="h5" className="card-title">
                                    {t('dashboard.cards.orders.title')}
                                </Typography>
                                <Button 
                                    variant="contained" 
                                    onClick={() => setActiveView('orders')}
                                    className="manage-button"
                                    fullWidth
                                >
                                    {t('dashboard.cards.orders.manage')}
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={6} lg={4}>
                        <Card elevation={3} className="dashboard-card">
                            <CardContent className="card-content">
                                <Typography variant="h5" className="card-title">
                                    {t('dashboard.cards.products.title')}
                                </Typography>
                                <Button 
                                    variant="contained" 
                                    onClick={() => setActiveView('products')}
                                    className="manage-button"
                                    fullWidth
                                >
                                    {t('dashboard.cards.products.manage')}
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
                        {t('dashboard.actions.backToDashboard')}
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
                        {t('dashboard.actions.backToDashboard')}
                    </Button>
                    <ProductsList />
                </div>
            )}
        </Box>
    );
};

export default Dashboard;