import React from "react";
import useFetch from "@/hooks/useFetch";
import ProductCard from "@/features/product/components/ProductCard/ProductCard";
import "@/styles/global.css";
import "./product-list.css";

function ProductList() {
  const { data: products, loading, error } = useFetch("/product/list/");

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!products) return <div className="error">No products found.</div>; // Handle null/undefined case

  return (
    <div className="product-list-container">
      <h2>Product List</h2>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default ProductList;