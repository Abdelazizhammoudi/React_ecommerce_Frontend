import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BASE_URL } from "../constants";
import "../assets/home.css";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/product/`);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
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

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div className="home-container">
      <h2>Product List</h2>

      <div className="product-list">
        {products.map((product) => (
         
         <div key={product.id} className="product-card">
          <Link to={`/product/${product.id}`} key={product.id} className="product-card">
            <div>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p><strong>Price:</strong> ${product.price}</p>

              {/* Display all images in the array */}
              <div className="product-images">
                {product.images && product.images.length > 0 ? (
                  product.images.map((image) => (
                    <img
                      key={image.id} // Use image.id as the key
                      src={image.image} // Use the full image URL from the API
                      alt={`${product.name}`}
                      className="product-image"
                      onError={(e) => {
                        e.target.src = "path/to/fallback/image.jpg"; // Fallback image
                      }}
                    />
                  ))
                ) : (
                  <p>No images available</p>
                )}
              </div>
            </div>
          </Link>
        </div>
        ))}
      </div>
    </div>
  );
}

export default Home;