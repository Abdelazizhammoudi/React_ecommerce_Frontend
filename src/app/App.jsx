import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "@/components/layout/Header/Header";
import Footer from "@/components/layout/Footer/Footer";
import Home from "@/features/home/Home";
// import ProductList from "@/features/product/components/ProductList/ProductList";
import ProductDetail from "@/features/product/components/ProductDetail/ProductDetail";
import ProductUpdate from "@/features/product/components/ProductUpdate/ProductUpdate";
import ProductForm from "@/features/product/components/ProductForm/ProductForm";

import OrderList from "@/features/Order/OrderList/OrderList";
import OrderForm from "@/features/Order/OrderForm/OrderForm";

import NotFound from "@/components/NotFound/NotFound";
import ErrorBoundary from "@/components/ErrorBoundary";
import OrderStatus from '@/features/Order/OrderStatus/OrderStatus';
import AdminLogin from "@/components/AdminLogin";


function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Header />
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <OrdersList />
              </AdminRoute>
            }
          />
          {/* <Route path="/products" element={<ProductList />} /> */}
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/product/:id/update" element={<ProductUpdate />} />
          <Route path="/addProduct" element={<ProductForm />} /> {/* Add Product Route */}

          <Route path="/order/:productId" element={<OrderForm />} />
          <Route path="/admin/orders" element={<OrderList />} />
          <Route path="/order-status" element={<OrderStatus />} />

          <Route path="*" element={<NotFound />} /> {/* 404 Route */}
        </Routes>
        <Footer />
      </ErrorBoundary>
    </Router>
  );
}

export default App;