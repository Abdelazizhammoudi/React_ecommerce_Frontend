import React, { useEffect, useState } from 'react';
import { 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Paper, CircularProgress, Alert, IconButton, Dialog, DialogTitle,
    DialogContent, TextField, DialogActions, Button, Box, Typography
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import { BASE_URL } from '@/config/constants';

const ProductsList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editProduct, setEditProduct] = useState(null);
    const [editedData, setEditedData] = useState({});

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/product/list/`, {
                    headers: {
                        Authorization: `Token ${localStorage.getItem('token')}`
                    }
                });
                setProducts(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch products');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleDelete = async (productId) => {
        try {
            await axios.delete(`${BASE_URL}/product/${productId}/delete/`, {
                headers: {
                    Authorization: `Token ${localStorage.getItem('token')}`
                }
            });
            setProducts(prev => prev.filter(p => p.id !== productId));
            setSuccess('Product deleted successfully');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete product');
        }
    };

    const handleEditClick = (product) => {
        setEditProduct(product);
        setEditedData({
            name: product.name,
            price: product.price,
            available_stock: product.available_stock
        });
    };

    const handleUpdate = async () => {
        try {
            const response = await axios.patch(
                `${BASE_URL}/product/${editProduct.id}/update/`,
                editedData,
                {
                    headers: {
                        Authorization: `Token ${localStorage.getItem('token')}`
                    }
                }
            );
            
            setProducts(prev => prev.map(p => 
                p.id === editProduct.id ? response.data : p
            ));
            setEditProduct(null);
            setSuccess('Product updated successfully');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update product');
        }
    };

    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    };

    if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />;
    if (error) return <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>;

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>Products Management</Typography>
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            
            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Price (DZD)</TableCell>
                            <TableCell>Stock</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map(product => (
                            <TableRow key={product.id}>
                                <TableCell>#{product.id}</TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{formatNumber(product.price)}</TableCell>
                                <TableCell>{formatNumber(product.available_stock)}</TableCell>
                                <TableCell>
                                    <IconButton 
                                        color="primary"
                                        onClick={() => handleEditClick(product)}
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton 
                                        color="error"
                                        onClick={() => handleDelete(product.id)}
                                    >
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={!!editProduct} onClose={() => setEditProduct(null)}>
                <DialogTitle>Edit Product</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Product Name"
                        fullWidth
                        value={editedData.name}
                        onChange={(e) => setEditedData(prev => ({
                            ...prev,
                            name: e.target.value
                        }))}
                    />
                    <TextField
                        margin="dense"
                        label="Price (DZD)"
                        type="number"
                        fullWidth
                        value={editedData.price}
                        onChange={(e) => setEditedData(prev => ({
                            ...prev,
                            price: parseFloat(e.target.value)
                        }))}
                    />
                    <TextField
                        margin="dense"
                        label="Available Stock"
                        type="number"
                        fullWidth
                        value={editedData.available_stock}
                        onChange={(e) => setEditedData(prev => ({
                            ...prev,
                            available_stock: parseInt(e.target.value)
                        }))}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditProduct(null)}>Cancel</Button>
                    <Button onClick={handleUpdate} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ProductsList;