import React, { useState } from "react";
import { BASE_URL } from "../constants"; // Import BASE_URL

const ProductCard = ({ product, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProduct, setUpdatedProduct] = useState(product);
  const [newImages, setNewImages] = useState([]);

  const handleDelete = async () => {
    try {
      // Fetch the product details to check if there are any images
      const productResponse = await fetch(`${BASE_URL}/product/${product.id}/`);
      if (!productResponse.ok) {
        console.error("Failed to fetch product details");
        return;
      }
      const productData = await productResponse.json();

      // Check if the product has any images
      if (productData.images.length === 0) {
        const confirmDelete = window.confirm("This product has no images. Are you sure you want to delete it?");
        if (!confirmDelete) {
          return;
        }

        // Proceed with deletion
        const response = await fetch(`${BASE_URL}/product/${product.id}/delete/`, {
          method: "DELETE",
        });
        if (response.ok) {
          onDelete(product.id); // Notify parent component to remove the product
        } else {
          console.error("Failed to delete product");
        }
      } else {
        alert("Cannot delete product with images. Please remove all images first.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleUpdate = async () => {
    // Validate that all fields are filled
    if (!updatedProduct.name || !updatedProduct.description || !updatedProduct.price) {
      alert("All fields are required.");
      return;
    }

    // Validate that there is at least one image
    if (updatedProduct.images.length === 0 && newImages.length === 0) {
      alert("You must upload at least one image.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", updatedProduct.name);
      formData.append("description", updatedProduct.description);
      formData.append("price", updatedProduct.price);
      newImages.forEach((image) => {
        formData.append("images", image);
      });

      const response = await fetch(`${BASE_URL}/product/${product.id}/update/`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        const updatedProductData = await response.json();
        onUpdate(updatedProductData); // Notify parent component to update the product
        setIsEditing(false); // Exit edit mode
      } else {
        console.error("Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleImageChange = (e) => {
    setNewImages(Array.from(e.target.files));
  };

  return (
    <div className="product-card">
      {isEditing ? (
        <div>
          <input
            type="text"
            value={updatedProduct.name}
            onChange={(e) => setUpdatedProduct({ ...updatedProduct, name: e.target.value })}
            required
          />
          <input
            type="text"
            value={updatedProduct.description}
            onChange={(e) => setUpdatedProduct({ ...updatedProduct, description: e.target.value })}
            required
          />
          <input
            type="number"
            value={updatedProduct.price}
            onChange={(e) => setUpdatedProduct({ ...updatedProduct, price: e.target.value })}
            required
          />
          <input
            type="file"
            name="images"
            multiple
            onChange={handleImageChange}
          />
          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <p><strong>Price:</strong> ${product.price}</p>
          <div className="product-images">
            {product.images.map((image) => (
              <img
                key={image.id}
                src={`${BASE_URL}${image.image}`}
                alt={product.name}
                className="product-image"
              />
            ))}
          </div>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
          
        </div>
      )}
    </div>
  );
};

export default ProductCard;