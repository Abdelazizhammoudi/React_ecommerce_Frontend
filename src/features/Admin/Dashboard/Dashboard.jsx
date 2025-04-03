import React, { useState } from 'react';
import { Grid, Card, CardContent, Typography, Button, Box } from '@mui/material';
import OrderList from '@/features/Order/OrderList/OrderList';
import ProductsList from '@/features/product/components/ProductList/ProductList';

const Dashboard = () => {
    const [activeView, setActiveView] = useState('overview');

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h3" gutterBottom>Admin Dashboard</Typography>
            
            {activeView === 'overview' && (
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={6} lg={4}>
                        <Card elevation={3}>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>Orders</Typography>
                                <Button 
                                    variant="contained" 
                                    onClick={() => setActiveView('orders')}
                                    fullWidth
                                >
                                    Manage Orders
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={6} lg={4}>
                        <Card elevation={3}>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>Products</Typography>
                                <Button 
                                    variant="contained" 
                                    onClick={() => setActiveView('products')}
                                    fullWidth
                                >
                                    Manage Products
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {activeView === 'orders' && (
                <>
                    <Button 
                        variant="outlined" 
                        onClick={() => setActiveView('overview')}
                        sx={{ mb: 2 }}
                    >
                        Back to Dashboard
                    </Button>
                    <OrderList />
                </>
            )}

            {activeView === 'products' && (
                <>
                    <Button 
                        variant="outlined" 
                        onClick={() => setActiveView('overview')}
                        sx={{ mb: 2 }}
                    >
                        Back to Dashboard
                    </Button>
                    <ProductsList />
                </>
            )}
        </Box>
    );
};

export default Dashboard;