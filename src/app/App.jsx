import React from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import Header from "@/components/layout/Header/Header";
import Footer from "@/components/layout/Footer/Footer";
import Home from "@/features/home/home";
import ProductDetail from "@/features/product/components/ProductDetail/ProductDetail";
import ProductUpdate from "@/features/product/components/ProductUpdate/ProductUpdate";
import ProductForm from "@/features/product/components/ProductForm/ProductForm";
import OrderList from "@/features/Order/OrderList/OrderList";
import OrderForm from "@/features/Order/OrderForm/OrderForm";
import OrderStatus from '@/features/Order/OrderStatus/OrderStatus';
import NotFound from "@/components/NotFound/NotFound";
import ErrorBoundary from "@/components/ErrorBoundary";
import AdminLogin from "@/components/AdminLogin/AdminLogin";
import AdminRoute from "@/components/AdminRoute";
import Unauthorized from "@/components/Unauthorized/Unauthorized";
import { AuthProvider } from '@/context/AuthContext';
import Dashboard from "@/features/admin/Dashboard/Dashboard";
// import './App.css'; // For loading spinner styles
import { useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import '@/config/i18n';

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);
  
    return (
      <AuthProvider>
        <Router>
          <ErrorBoundary>
            <Header />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/order/:productId" element={<OrderForm />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/product/:id/update" element={<ProductUpdate />} />
              <Route path="/order-status" element={<OrderStatus />} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              
              {/* Protected Group */}
              <Route element={<AdminRoute />}>
                <Route path="/addProduct" element={<ProductForm />} />
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/orders" element={<OrderList/>} />
              </Route>
  
              {/* Error Routes */}
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </ErrorBoundary>
        </Router>
      </AuthProvider>
    );
  }
export default App;