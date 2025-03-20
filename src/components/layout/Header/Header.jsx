import React from "react";
import { Link } from "react-router-dom";
import "@/styles/global.css";
import "./header.css";
import logo from "@/assets/logo.jpg"; // Import logo image

function Header() {
  return (
    <nav className="header">
      <div className="logo">
        <img src={logo} 
        alt="logo"
        className="logo-image"
         />
      </div>
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