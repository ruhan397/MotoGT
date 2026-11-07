import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiFetch("/products");

      if (!response.ok) {
        throw new Error(`Unable to load products (${response.status}).`);
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(error.message || "Unable to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <section id="products">
      <h2>Our Products</h2>

      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <div>
          <p>{error}</p>
          <button onClick={loadProducts}>Try Again</button>
        </div>
      ) : products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <div className="product-card" key={product._id}>
              <h3>{product.name}</h3>
              <p>Brand: {product.brand}</p>
              <p>Category: {product.category}</p>
              <p>Price: ৳{product.price.toLocaleString()}</p>
              <p>{product.description}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Products;
