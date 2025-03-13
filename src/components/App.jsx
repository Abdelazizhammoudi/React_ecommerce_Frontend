import React from 'react';
import Header from './Header'; 
import ProductForm from './ProductForm';
import Home from './Home';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductDetail from "./ProductDetail";
import ProductUpdate from "./ProductUpdate";


function App() {
  return (
        <Router>
          <Header /> {/* Always visible */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/addProduct" element={<ProductForm />} />
            <Route path="/product/:id" element={<ProductDetail />} /> {/* Dynamic route for product details */}
            <Route path="/product/update/:id" element={<ProductUpdate />} /> {/* Dynamic route for updating a product */}
          </Routes>
        </Router>
  );
}

export default App;
