import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "@/components/layout/Header/Header";
import Footer from "@/components/layout/Footer/Footer";
import Home from "@/features/home/Home";
import ProductList from "@/features/product/components/ProductList/ProductList";
import ProductDetail from "@/features/product/components/ProductDetail/ProductDetail";
import ProductUpdate from "@/features/product/components/ProductUpdate/ProductUpdate";
import ProductForm from "@/features/product/components/ProductForm/ProductForm";
import NotFound from "@/components/NotFound/NotFound";
import ErrorBoundary from "@/components/ErrorBoundary";

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/product/:id/update" element={<ProductUpdate />} />
          <Route path="/addProduct" element={<ProductForm />} /> {/* Add Product Route */}
          <Route path="*" element={<NotFound />} /> {/* 404 Route */}
        </Routes>
        <Footer />
      </ErrorBoundary>
    </Router>
  );
}

export default App;