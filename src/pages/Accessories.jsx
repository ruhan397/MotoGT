import { useEffect, useRef, useState } from "react";
import { apiFetch } from "../utils/api";
import "../styles/Accessories.css";

function Accessories() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Products");
  const [activeIndex, setActiveIndex] = useState(0);

  const pointerStartX = useRef(null);

  const categories = [
    "All Products",
    "Interior Accessories",
    "Speakers & Audio",
    "Car Monitors",
    "Lighting Accessories",
    "Exterior Accessories",
    "Electronics & Car Utility",
  ];

  const loadProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiFetch("/products");

      if (!response.ok) {
        throw new Error("Could not load products.");
      }

      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message || "Unable to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    setActiveIndex(0);
  }, [activeCategory]);

  const filteredProducts =
    activeCategory === "All Products"
      ? products
      : products.filter(
          (product) => product.category === activeCategory
        );

  const totalProducts = filteredProducts.length;

  const showPrevious = () => {
    setActiveIndex((current) =>
      (current - 1 + totalProducts) % totalProducts
    );
  };

  const showNext = () => {
    setActiveIndex((current) =>
      (current + 1) % totalProducts
    );
  };

  const getVisibleProducts = () => {
    if (totalProducts === 0) return [];

    if (totalProducts === 1) {
      return [
        {
          product: filteredProducts[0],
          position: "center",
        },
      ];
    }

    if (totalProducts === 2) {
      return [
        {
          product: filteredProducts[(activeIndex + 1) % 2],
          position: "left",
        },
        {
          product: filteredProducts[activeIndex],
          position: "center",
        },
      ];
    }

    return [
      {
        product:
          filteredProducts[
            (activeIndex - 1 + totalProducts) % totalProducts
          ],
        position: "left",
      },
      {
        product: filteredProducts[activeIndex],
        position: "center",
      },
      {
        product:
          filteredProducts[(activeIndex + 1) % totalProducts],
        position: "right",
      },
    ];
  };

  const handlePointerDown = (event) => {
    pointerStartX.current = event.clientX;
  };

  const handlePointerUp = (event) => {
    if (pointerStartX.current === null) return;

    const difference = event.clientX - pointerStartX.current;
    pointerStartX.current = null;

    if (Math.abs(difference) > 50) {
      if (difference < 0) {
        showNext();
      } else {
        showPrevious();
      }
    }
  };

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

      {error && (
        <div>
          <p>{error}</p>
          <button onClick={loadProducts}>Try Again</button>
        </div>
      )}

      {!loading && !error && totalProducts === 0 && (
        <p className="accessories-empty">
          No products found in this category.
        </p>
      )}

      {!loading && !error && totalProducts > 0 && (
        <div className="accessories-carousel">
          <button
            className="carousel-arrow carousel-arrow-left"
            onClick={showPrevious}
            aria-label="Previous product"
            disabled={totalProducts < 2}
          >
            &#10094;
          </button>

          <div
            className="accessories-carousel-track"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={() => {
              pointerStartX.current = null;
            }}
          >
            {getVisibleProducts().map(({ product, position }) => (
              <article
                key={product._id}
                className={`carousel-card carousel-card--${position}`}
                onClick={() => {
                  if (position === "left") showPrevious();
                  if (position === "right") showNext();
                }}
              >
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    draggable="false"
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

          <button
            className="carousel-arrow carousel-arrow-right"
            onClick={showNext}
            aria-label="Next product"
            disabled={totalProducts < 2}
          >
            &#10095;
          </button>
        </div>
      )}

      {!loading && !error && totalProducts > 1 && (
        <p className="carousel-counter">
          {activeIndex + 1} / {totalProducts}
        </p>
      )}
    </section>
  );
}

export default Accessories;