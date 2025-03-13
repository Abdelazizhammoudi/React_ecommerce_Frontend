import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <nav className="navbar">
      <h1>My Shop</h1>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/addProduct">Add Product</Link></li>
      </ul>
    </nav>
  );
}

export default Header;
