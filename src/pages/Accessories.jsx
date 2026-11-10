
import { useEffect, useRef, useState } from "react";
import { apiFetch } from "../utils/api";
import "../styles/Accessories.css";

function Accessories() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Products");
  const [activeIndex, setActiveIndex] = useState(0);

  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderMessage, setOrderMessage] = useState("");
  const [orderError, setOrderError] = useState("");

  const [membership, setMembership] = useState(null);
const [membershipLoading, setMembershipLoading] = useState(false);

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
  const loadMembership = async () => {
    const token = localStorage.getItem("motogtToken");
    const savedUser = localStorage.getItem("motogtUser");

    // প্রথমে Login-এর সময় Save করা Membership দেখাবে
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setMembership(user.membership || null);
        
      } catch {
        setMembership(null);
      }
    }

    if (!token) return;

    setMembershipLoading(true);

    try {
      const response = await apiFetch("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Could not load membership.");
      }

      const data = await response.json();

      if (data.user?.membership) {
        setMembership(data.user.membership);

        // সর্বশেষ Customer তথ্য Save করবে
        const previousUser = savedUser
          ? JSON.parse(savedUser)
          : {};

        localStorage.setItem(
          "motogtUser",
          JSON.stringify({
            ...previousUser,
            ...data.user,
          })
        );
      }
    } catch (err) {
      console.error("Membership Error:", err.message);
      // Backend ব্যর্থ হলেও আগের Membership তথ্য থাকবে
    } finally {
      setMembershipLoading(false);
    }
  };

  loadMembership();
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

  const addToCart = (product) => {
    if (Number(product.stock) < 1) {
      setOrderError("This product is currently out of stock.");
      return;
    }

    setOrderError("");
    setOrderMessage("");

    setCart((current) => {
      const existing = current.find(
        (item) => item.product._id === product._id
      );

      if (existing) {
        if (existing.quantity >= Number(product.stock)) {
          setOrderError("You cannot add more than the available stock.");
          return current;
        }

        return current.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...current, { product, quantity: 1 }];
    });

    setCartOpen(true);
  };

  const changeQuantity = (productId, change) => {
    setCart((current) =>
      current.map((item) => {
        if (item.product._id !== productId) return item;

        const nextQuantity = item.quantity + change;

        if (nextQuantity < 1) return item;

        if (nextQuantity > Number(item.product.stock)) {
          setOrderError("Quantity cannot exceed available stock.");
          return item;
        }

        return { ...item, quantity: nextQuantity };
      })
    );
  };

  const removeFromCart = (productId) => {
    setCart((current) =>
      current.filter((item) => item.product._id !== productId)
    );
  };

  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const subtotal = cart.reduce(
    (sum, item) =>
      sum + Number(item.product.price) * item.quantity,
    0
  );

  const discountPercentage =
  membership?.isActive
    ? Number(membership.discountPercentage || 0)
    : 0;

const discountAmount =
  (subtotal * discountPercentage) / 100;

const finalTotal = subtotal - discountAmount;

  const placeOrder = async (event) => {
    event.preventDefault();

    setOrderError("");
    setOrderMessage("");

    const token = localStorage.getItem("motogtToken");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    if (!cart.length || !address.trim()) {
      setOrderError(
        "Please add products and enter your delivery address."
      );
      return;
    }

    setPlacingOrder(true);

    try {
      const response = await apiFetch("/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          address: address.trim(),
          products: cart.map((item) => ({
            productId: item.product._id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Could not place your order."
        );
      }

      setOrderMessage(
        `Order placed successfully! Order ID: ${
          data.order?._id || "Confirmed"
        }. Payment: Cash on Delivery. Status: Pending.`
      );

      setCart([]);
      setAddress("");
    } catch (err) {
      setOrderError(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  const handlePointerDown = (event) => {
    pointerStartX.current = event.clientX;
  };

  const handlePointerUp = (event) => {
    if (pointerStartX.current === null) return;

    const difference =
      event.clientX - pointerStartX.current;

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
        <p>
          Explore our collection of premium car accessories.
        </p>

        <button
          className="accessories-cart-toggle"
          onClick={() => setCartOpen(true)}
        >
          {cartCount > 0 ? `My Cart (${cartCount})` : "My Cart"}
        </button>
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
            {getVisibleProducts().map(
              ({ product, position }) => (
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

                  <button
                    className="accessories-add-button"
                    onPointerDown={(event) =>
                      event.stopPropagation()
                    }
                    onClick={(event) => {
                      event.stopPropagation();
                      addToCart(product);
                    }}
                    disabled={Number(product.stock) < 1}
                  >
                    {Number(product.stock) < 1
                      ? "Out of Stock"
                      : "Add to Cart"}
                  </button>
                </article>
              )
            )}
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

      {orderMessage && (
        <p className="accessories-order-success">
          {orderMessage}
        </p>
      )}

      {orderError && !cartOpen && (
        <p className="accessories-order-error">
          {orderError}
        </p>
      )}

      {cartOpen && (
        <div
          className="accessories-cart-backdrop"
          onClick={() => setCartOpen(false)}
        >
          <aside
            className="accessories-cart-panel"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="accessories-cart-header">
              <h2>Your Cart</h2>

              <button
                type="button"
                onClick={() => setCartOpen(false)}
                aria-label="Close cart"
              >
                ×
              </button>
            </div>

            {cart.length === 0 ? (
              <p className="accessories-cart-empty">
                Your cart is empty.
              </p>
            ) : (
              <>
                <div className="accessories-cart-items">
                  {cart.map(({ product, quantity }) => (
                    <div
                      className="accessories-cart-item"
                      key={product._id}
                    >
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.name}
                        />
                      )}

                      <div className="accessories-cart-item-info">
                        <strong>{product.name}</strong>

                        <span>
                          ৳{Number(product.price).toLocaleString("en-BD")}
                        </span>

                        <div className="accessories-quantity-control">
                          <button
                            type="button"
                            onClick={() =>
                              changeQuantity(product._id, -1)
                            }
                          >
                            −
                          </button>

                          <span>{quantity}</span>

                          <button
                            type="button"
                            onClick={() =>
                              changeQuantity(product._id, 1)
                            }
                          >
                            +
                          </button>

                          <button
                            type="button"
                            className="accessories-remove-button"
                            onClick={() =>
                              removeFromCart(product._id)
                            }
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

               
<div className="accessories-cart-total">
  <span>Subtotal</span>
  <strong>
    ৳{subtotal.toLocaleString("en-BD", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
  </strong>
</div>

<div className="accessories-cart-total">
  <span>
    Membership Discount
    {membershipLoading
      ? " (Loading...)"
      : ` (${discountPercentage}%)`}
  </span>
  <strong>
    - ৳{discountAmount.toLocaleString("en-BD", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
  </strong>
</div>

<div className="accessories-cart-total">
  <strong>Final Total</strong>
  <strong>
    ৳{finalTotal.toLocaleString("en-BD", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
  </strong>
</div>


                <form
                  className="accessories-checkout-form"
                  onSubmit={placeOrder}
                >
                  <label htmlFor="delivery-address">
                    Delivery Address
                  </label>

                  <textarea
                    id="delivery-address"
                    value={address}
                    onChange={(event) =>
                      setAddress(event.target.value)
                    }
                    placeholder="Enter your full delivery address"
                    required
                    rows={3}
                  />

                  <p>
                    Payment Method: <strong>Cash on Delivery</strong>
                  </p>

                  {orderError && (
                    <p className="accessories-order-error">
                      {orderError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={
                      placingOrder || cart.length === 0
                    }
                  >
                    {placingOrder
                      ? "Placing Order..."
                      : "Place Order"}
                  </button>
                </form>
              </>
            )}

            {orderMessage && (
              <p className="accessories-order-success">
                {orderMessage}
              </p>
            )}
          </aside>
        </div>
      )}
    </section>
  );
}

export default Accessories;
