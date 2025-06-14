import React, { useEffect, useState } from 'react';
import { 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Paper, CircularProgress, Alert, IconButton, Dialog, DialogTitle,
    DialogContent, TextField, DialogActions, Button, Box, Typography
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import { BASE_URL } from '@/config/constants';
import { ProductService } from '@/services/productService';
import { useTranslation } from 'react-i18next';

const ProductsList = () => {
    const { t } = useTranslation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editProduct, setEditProduct] = useState(null);
    const [editedData, setEditedData] = useState({
        name: '',
        price: 0,
        available_stock: 0,
        description: ''
    });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/product/list/`, {
                    headers: {
                        Authorization: `Token ${localStorage.getItem('adminToken')}`
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

    const handleEditClick = (product) => {
        setEditProduct(product);
        setEditedData({
            name: product.name,
            price: product.price,
            available_stock: product.available_stock,
            description: product.description || ''
        });
    };

    const handleUpdate = async () => {
        try {
            setError('');
            setSuccess('');
            
            if (!editProduct) return;

            // Convert data types explicitly
            const updateData = {
                name: editedData.name,
                price: parseFloat(editedData.price),
                available_stock: parseInt(editedData.available_stock),
                description: editedData.description
            };

            const updatedProduct = await ProductService.update(
                editProduct.id,
                updateData
            );
            
            setProducts(prev => prev.map(p => 
                p.id === editProduct.id ? { ...p, ...updatedProduct } : p
            ));
            
            setEditProduct(null);
            setSuccess('Product updated successfully');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Update error:', err);
            setError(err.message || 'Failed to update product');
        }
    };

    const handleDelete = async (productId) => {
        try {
            await axios.delete(`${BASE_URL}/product/${productId}/delete/`, {
                headers: {
                    Authorization: `adminToken ${localStorage.getItem('adminToken')}`
                }
            });
            setProducts(prev => prev.filter(p => p.id !== productId));
            setSuccess('Product deleted successfully');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete product');
        }
    };

    const formatNumber = (num) => {
        if (!num) return '0';
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    };

    if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />;
    if (error) return <Alert severity="error" sx={{ m: 2 }}>{t(error)}</Alert>;

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>{t('productList.title')}</Typography>
            {success && <Alert severity="success" sx={{ mb: 2 }}>{t(success)}</Alert>}
            
            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{t('productList.table.id')}</TableCell>
                            <TableCell>{t('productList.table.name')}</TableCell>
                            <TableCell>{t('productList.table.price', { currency: t('home.products.currency') })}</TableCell>
                            <TableCell>{t('productList.table.stock')}</TableCell>
                            <TableCell>{t('productList.table.actions')}</TableCell>
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
                                        aria-label={t('productList.actions.edit')}
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton 
                                        color="error"
                                        onClick={() => handleDelete(product.id)}
                                        aria-label={t('productList.actions.delete')}
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
                <DialogTitle>{t('productList.edit.title')}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label={t('productList.edit.name')}
                        fullWidth
                        value={editedData.name}
                        onChange={(e) => setEditedData(prev => ({
                            ...prev,
                            name: e.target.value
                        }))}
                    />
                    <TextField
                        margin="dense"
                        label={t('productList.edit.price')}
                        type="number"
                        fullWidth
                        value={editedData.price}
                        onChange={(e) => setEditedData(prev => ({
                            ...prev,
                            price: e.target.value
                        }))}
                    />
                    <TextField
                        margin="dense"
                        label={t('productList.edit.stock')}
                        type="number"
                        fullWidth
                        value={editedData.available_stock}
                        onChange={(e) => setEditedData(prev => ({
                            ...prev,
                            available_stock: e.target.value
                        }))}
                    />
                    <TextField
                        margin="dense"
                        label={t('productList.edit.description')}
                        fullWidth
                        multiline
                        rows={4}
                        value={editedData.description}
                        onChange={(e) => setEditedData(prev => ({
                            ...prev,
                            description: e.target.value
                        }))}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditProduct(null)}>
                        {t('common.cancel')}
                    </Button>
                    <Button 
                        onClick={handleUpdate} 
                        variant="contained"
                        disabled={!editedData.name || !editedData.price}
                    >
                        {t('common.save')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ProductsList;