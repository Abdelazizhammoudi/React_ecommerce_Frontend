import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import Login from "@/components/Login";
import Dashboard from "@/components/Dashboard";
import { AuthProvider, useAuth } from '@/context/AuthContext'; // Updated context path

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { loggedIn } = useAuth();
  return loggedIn ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <AuthProvider> {/* Moved AuthProvider inside Router */}
        <ErrorBoundary>
          <Header />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/product/:id/update" element={<ProductUpdate />} />
            <Route path="/addProduct" element={<ProductForm />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              {/* <Route path="/dashboard" element={<Dashboard />} /> */}
              <Route path="/order/:productId" element={<OrderForm />} />
              <Route path="/order-status" element={<OrderStatus />} />
              <Route path="/admin/orders" element={<OrderList />} />
            </Route>

            {/* Error Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </ErrorBoundary>
      </AuthProvider>
    </Router>
  );
}

export default App;