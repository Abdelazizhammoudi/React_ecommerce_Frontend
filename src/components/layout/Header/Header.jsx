import React from "react";
import { Link } from "react-router-dom";
import "@/styles/global.css";
import "./header.css";

function Header() {
  return (
    <nav className="header">
      <h1 className="logo">My Shop</h1>
      <ul className="nav-links">
        <li>
          <Link to="/" className="nav-link">Home</Link>
        </li>
        {/* <li>
          <Link to="/products" className="nav-link">Products</Link>
        </li> */}
        <li>
          <Link to="/addProduct" className="nav-link">Add Product</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Header;