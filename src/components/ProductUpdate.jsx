import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { BASE_URL } from "../constants";
import useFetch from "../hooks/useFetch"; // Import the useFetch hook
import "../assets/home.css";

function ProductUpdate() {
  const { id } = useParams(); // Get the product ID from the URL
  const navigate = useNavigate(); // Initialize useNavigate for navigation
  const { data: product, loading, error, setData: setProduct } = useFetch(`/product/${id}/`); // Use the useFetch hook

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    images: []
  });

  // Update formData when product data is fetched
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        images: product.images
      });
    }
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      images: Array.from(e.target.files)
    });
  };

  const handleDeleteImage = async (imageId) => {
    try {
      const response = await fetch(`${BASE_URL}/product/image/delete/${imageId}/`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete image");
      }

      // Remove the deleted image from the state
      setFormData((prevFormData) => ({
        ...prevFormData,
        images: prevFormData.images.filter((image) => image.id !== imageId),
      }));

      // Also update the product state to reflect the changes
      setProduct((prevProduct) => ({
        ...prevProduct,
        images: prevProduct.images.filter((image) => image.id !== imageId),
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteProduct = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/product/${id}/delete/`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      alert("Product deleted successfully!");
      navigate("/"); // Redirect to the home page after deletion
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that there is at least one image
    if (formData.images.length === 0) {
      alert("You must upload at least one image.");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formData.images.forEach((image) => {
        formDataToSend.append("images", image);
      });

      // Log the formDataToSend for debugging
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      const response = await fetch(`${BASE_URL}/product/${id}/update/`, {
        method: "PUT",
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error("Failed to update product");
      }

      const updatedProduct = await response.json();
      setProduct(updatedProduct);

      // Upload new images
      if (formData.images.length > 0) {
        const imageFormData = new FormData();
        formData.images.forEach((image) => {
          imageFormData.append("images", image);
        });

        const uploadResponse = await fetch(`${BASE_URL}/product/image/upload/${id}/`, {
          method: "POST",
          body: imageFormData
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload images");
        }

        const uploadedImages = await uploadResponse.json();
        setProduct((prevProduct) => ({
          ...prevProduct,
          images: [...prevProduct.images, ...uploadedImages]
        }));
      }

      alert("Product updated successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <p>Loading product details...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!product) {
    return <p>Product not found</p>;
  }

  return (
    <div className="product-detail-container">
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p><strong>Price:</strong> ${product.price}</p>

      {/* Display all images */}
      <div className="product-images">
        {product.images.map((image) => (
          <div key={image.id} className="image-container">
            <img
              src={image.image}
              alt={`${product.name}`}
              className="product-image"
            />
            <button
              type="button"
              onClick={() => handleDeleteImage(image.id)}
              className="delete-image-button"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Images:</label>
          <input
            type="file"
            name="images"
            multiple
            onChange={handleImageChange}
          />
        </div>
        <button type="submit">Update Product</button>
      </form>

      <button type="button" onClick={handleDeleteProduct} className="delete-product-button">
        Delete Product
      </button>
    </div>
  );
}

export default ProductUpdate;