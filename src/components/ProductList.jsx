import React from 'react';
import useFetch from '../hooks/useFetch';

const ProductList = () => {
    // Fetching data using the endpoint '/product/list/'
    const { data, loading, error } = useFetch('/product/list/', 'GET');

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Product List</h1>
            <ul>
                {data && data.map((product) => (
                    <li key={product.id}>
                        <h2>{product.name}</h2>
                        <p>{product.description}</p>
                        <p>{product.price} USD</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductList;
