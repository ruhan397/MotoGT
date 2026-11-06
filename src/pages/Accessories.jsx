import { useEffect, useState } from "react";
import "../styles/Accessories.css";

function Accessories() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Products");

  const categories = [
    "All Products",
    "Interior Accessories",
    "Speakers & Audio",
    "Car Monitors",
    "Lighting Accessories",
    "Exterior Accessories",
    "Electronics & Car Utility",
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:5001/api/products"
        );

        if (!response.ok) {
          throw new Error("Could not load products");
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

  const filteredProducts =
    activeCategory === "All Products"
      ? products
      : products.filter(
          (product) => product.category === activeCategory
        );

  return (
    <section className="accessories-page">
      <div className="accessories-heading">
        <p className="eyebrow">MOTOGT COLLECTION</p>
        <h1>Car Accessories</h1>
        <p>Explore our collection of premium car accessories.</p>
      </div>

      {!loading && !error && (
        <div className="accessories-category-filter">
          {categories.map((category) => (
            <button
              key={category}
              className={
                activeCategory === category ? "active" : ""
              }
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {loading && <p>Loading products...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && filteredProducts.length === 0 && (
        <p className="accessories-empty">
          No products found in this category.
        </p>
      )}

      <div className="accessories-product-grid">
        {filteredProducts.map((product) => (
          <article key={product._id}>
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
              />
            )}

            <h3>{product.name}</h3>
            <p>{product.brand}</p>
            <p>
              ৳{Number(product.price).toLocaleString("en-BD")}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Accessories;