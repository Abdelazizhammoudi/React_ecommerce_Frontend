import React from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import Header from "@/components/layout/Header/Header";
import Footer from "@/components/layout/Footer/Footer";
import Home from "@/features/home/Home";
import ProductDetail from "@/features/product/components/ProductDetail/ProductDetail";
import ProductUpdate from "@/features/product/components/ProductUpdate/ProductUpdate";
import ProductForm from "@/features/product/components/ProductForm/ProductForm";
import OrderList from "@/features/Order/OrderList/OrderList";
import OrderForm from "@/features/Order/OrderForm/OrderForm";
import OrderStatus from '@/features/Order/OrderStatus/OrderStatus';
import NotFound from "@/components/NotFound/NotFound";
import ErrorBoundary from "@/components/ErrorBoundary";
import AdminLogin from "@/components/AdminLogin";
import AdminRoute from "@/components/AdminRoute";
import Unauthorized from "@/components/Unauthorized";
import { AuthProvider } from '@/context/AuthContext';
import Dashboard from "@/features/admin/Dashboard/Dashboard";
// import './App.css'; // For loading spinner styles

function App() {

    return (
      <AuthProvider>
        <Router>
          <ErrorBoundary>
            <Header />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/product/:id/update" element={<ProductUpdate />} />
              <Route path="/addProduct" element={<ProductForm />} />
              <Route path="/order/:productId" element={<OrderForm />} />
              <Route path="/order-status" element={<OrderStatus />} />
  
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              
              {/* Protected Group */}
              <Route element={<AdminRoute />}>
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/orders" element={<OrderList />} />
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