import React, { useEffect, useState } from "react";
import { BASE_URL } from "@/config/constants";
import { Link } from "react-router-dom";
import "@/styles/global.css";
import "./home.css";
import coverImage from "@/assets/cover-image.jpg"; // Import cover image

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/product/list/`);
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="home-container">
      {/* Cover Section */}
      <div className="cover-section">
        <img
          src={coverImage} // Replace with your cover image path
          alt="Shop Cover"
          className="cover-image"
        />
        <div className="cover-description">
          Welcome??
        </div>
      </div>
      <h2>Product List</h2>
      <div className="product-list">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <Link to={`/product/${product.id}`} className="product-link">
              {product.images && product.images.length > 0 && (
                <img
                  src={product.images[0].image} // Display only the first image
                  alt={product.name}
                  className="product-image-home"
                />
              )}
              <div className="product-info-home">
                <h2 className="product-name">{product.name}</h2>
                <p className="product-description">{product.description}</p>
                <p className="product-price">{product.price} DZD</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;