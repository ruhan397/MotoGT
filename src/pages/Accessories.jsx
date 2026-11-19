import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";
import bkashLogo from "../assets/bKash-Logo.png";
import nagadLogo from "../assets/Nagad Icon.png";
import "../styles/Accessories.css";

function Accessories() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeCategory, setActiveCategory] = useState("All Products");
  const [searchQuery, setSearchQuery] = useState("");

  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [confirmingPayment, setConfirmingPayment] = useState(false);

  const [pendingPaymentOrderId, setPendingPaymentOrderId] = useState("");
  const [pendingPaymentMethod, setPendingPaymentMethod] = useState("");

  const [orderMessage, setOrderMessage] = useState("");
  const [orderError, setOrderError] = useState("");

  const [membership, setMembership] = useState(null);
  const [membershipLoading, setMembershipLoading] = useState(false);

  // Load products
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

  // Search products directly from MongoDB
  useEffect(() => {
    let isActive = true;

    const searchTimer = setTimeout(async () => {
      setSearchLoading(true);
      setSearchError("");

      try {
        const params = new URLSearchParams({
          q: searchQuery.trim(),
          category:
            activeCategory === "All Products"
              ? ""
              : activeCategory,
        });

        const response = await apiFetch(
          `/products/search?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error("Could not search products.");
        }

        const data = await response.json();

        if (isActive) {
          setSearchResults(data);
        }
      } catch (err) {
        if (isActive) {
          setSearchResults([]);
          setSearchError(
            err.message || "Unable to search products."
          );
        }
      } finally {
        if (isActive) {
          setSearchLoading(false);
        }
      }
    }, 300);

    return () => {
      isActive = false;
      clearTimeout(searchTimer);
    };
  }, [searchQuery, activeCategory]);

  // Load customer membership
  useEffect(() => {
    const loadMembership = async () => {
      const token = localStorage.getItem("motogtToken");
      const savedUser = localStorage.getItem("motogtUser");

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
      } finally {
        setMembershipLoading(false);
      }
    };

    loadMembership();
  }, []);

  // Dynamic categories from database products
  const categories = [
    "All Products",
    ...Array.from(
      new Set(
        products
          .map((product) => product.category)
          .filter(Boolean)
      )
    ).sort(),
  ];

  // Products returned directly from MongoDB search
  const filteredProducts = searchResults;
  const totalProducts = filteredProducts.length;

  // Add product to cart
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
          setOrderError(
            "You cannot add more than the available stock."
          );
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

  // Change cart quantity
  const changeQuantity = (productId, change) => {
    setCart((current) =>
      current.map((item) => {
        if (item.product._id !== productId) return item;

        const nextQuantity = item.quantity + change;

        if (nextQuantity < 1) return item;

        if (nextQuantity > Number(item.product.stock)) {
          setOrderError(
            "Quantity cannot exceed available stock."
          );
          return item;
        }

        return { ...item, quantity: nextQuantity };
      })
    );
  };

  // Remove product from cart
  const removeFromCart = (productId) => {
    setCart((current) =>
      current.filter(
        (item) => item.product._id !== productId
      )
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

  // Membership discount calculation
  const discountPercentage = membership?.isActive
    ? Number(membership.discountPercentage || 0)
    : 0;

  const discountAmount =
    (subtotal * discountPercentage) / 100;

  const finalTotal = subtotal - discountAmount;

  // Place order
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

    if (pendingPaymentOrderId) {
      setOrderError(
        "Please complete your previous demo payment first."
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
          paymentMethod,
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

      const orderId = data.order?._id;

      if (!orderId) {
        throw new Error(
          "Order was created, but its ID was not returned."
        );
      }

      // COD order
      if (paymentMethod === "COD") {
        setOrderMessage(
          `Order placed successfully! Order ID: ${orderId}. Payment: Cash on Delivery. Payment Status: Pending. Order Status: Pending.`
        );
      } else {
        // Online demo payment remains Pending until confirmation
        setPendingPaymentOrderId(orderId);
        setPendingPaymentMethod(paymentMethod);

        setOrderMessage(
          `Order created successfully! Order ID: ${orderId}. Your ${paymentMethod} demo payment is waiting for confirmation.`
        );
      }

      setCart([]);
      setAddress("");
    } catch (err) {
      setOrderError(
        err.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  // Confirm online demo payment
  const confirmDemoPayment = async () => {
    const token = localStorage.getItem("motogtToken");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    if (!pendingPaymentOrderId) {
      setOrderError("No pending demo payment was found.");
      return;
    }

    setConfirmingPayment(true);
    setOrderError("");

    try {
      const response = await apiFetch(
        `/orders/${pendingPaymentOrderId}/demo-payment`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Demo payment could not be confirmed."
        );
      }

      setOrderMessage(
        `Demo payment successful! Order ID: ${pendingPaymentOrderId}. Payment Method: ${pendingPaymentMethod}. Payment Status: Paid.`
      );

      setPendingPaymentOrderId("");
      setPendingPaymentMethod("");
    } catch (err) {
      setOrderError(
        err.message ||
          "Payment confirmation failed. Please try again."
      );
    } finally {
      setConfirmingPayment(false);
    }
  };

  const paymentOptions = [
    {
      value: "COD",
      name: "Cash on Delivery",
      detail: "Pay when your order arrives",
      type: "cod",
    },
    {
      value: "bKash",
      name: "bKash",
      detail: "Mobile financial service",
      logo: bkashLogo,
      type: "bkash",
    },
    {
      value: "Nagad",
      name: "Nagad",
      detail: "Mobile financial service",
      logo: nagadLogo,
      type: "nagad",
    },
    {
      value: "Card",
      name: "Debit / Credit Card",
      detail: "Visa and Mastercard",
      type: "card",
    },
  ];

  // Render the supplied local payment logos and the existing COD/Card marks
  const renderPaymentMark = (option) => {
    if (option.type === "cod") {
      return (
        <svg
          className="cod-icon"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M4.5 12.5H28V32H4.5V12.5Z"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinejoin="round"
          />
          <path
            d="M28 20H36L43.5 27.5V32H28V20Z"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinejoin="round"
          />
          <circle
            cx="13.5"
            cy="34"
            r="4.2"
            fill="#24231F"
            stroke="currentColor"
            strokeWidth="2.6"
          />
          <circle
            cx="36"
            cy="34"
            r="4.2"
            fill="#24231F"
            stroke="currentColor"
            strokeWidth="2.6"
          />
          <path
            d="M10 18H22M10 23H19"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      );
    }

    if (option.type === "bkash" || option.type === "nagad") {
      return (
        <img
          className="official-payment-logo"
          src={option.logo}
          alt={`${option.name} logo`}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      );
    }

    return (
      <span
        className="payment-card-brands"
        aria-label="Visa and Mastercard"
      >
        <span className="visa-mark">VISA</span>

        <span className="mastercard-mark" aria-hidden="true">
          <span className="mastercard-circle mastercard-red" />
          <span className="mastercard-circle mastercard-orange" />
        </span>
      </span>
    );
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
          <span>My Cart</span>

          {cartCount > 0 && (
            <span className="cart-count-badge">
              {cartCount}
            </span>
          )}

          <span className="cart-toggle-arrow">⌄</span>
        </button>
      </div>

      {/* Search */}
      {!loading && !error && (
        <div className="accessories-search-wrap">
          <label
            className="accessories-search"
            htmlFor="accessories-search-input"
          >
            <span
              className="accessories-search-icon"
              aria-hidden="true"
            >
              ⌕
            </span>

            <input
              id="accessories-search-input"
              type="search"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
              placeholder="Search accessories..."
              autoComplete="off"
            />

            {searchQuery && (
              <button
                type="button"
                className="accessories-search-clear"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </label>

          <p className="accessories-search-count">
            {searchLoading
              ? "Searching products..."
              : searchError
                ? searchError
                : searchQuery.trim()
                  ? `${totalProducts} matching product${
                      totalProducts === 1 ? "" : "s"
                    }`
                  : `${totalProducts} products available`}
          </p>
        </div>
      )}

      {/* Category filters */}
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

      {/* Loading */}
      {loading && <p>Loading products...</p>}

      {/* Error */}
      {error && (
        <div>
          <p>{error}</p>

          <button onClick={loadProducts}>
            Try Again
          </button>
        </div>
      )}

      {/* Empty products */}
      {!loading &&
        !error &&
        !searchLoading &&
        !searchError &&
        totalProducts === 0 && (
          <p className="accessories-empty">
            {searchQuery.trim()
              ? "No products found. Try a different search."
              : "No products found in this category."}
          </p>
        )}

      {/* All products grid */}
      {!loading &&
        !error &&
        !searchLoading &&
        totalProducts > 0 && (
          <div className="accessories-product-grid">
            {filteredProducts.map((product) => (
              <article
                className="accessories-product-card"
                key={product._id}
              >
                <div className="accessories-product-image">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                    />
                  ) : (
                    <div className="product-image-placeholder">
                      MOTOGT
                    </div>
                  )}
                </div>

                <div className="accessories-product-info">
                  <h3>{product.name}</h3>

                  <p className="product-brand">
                    {product.brand}
                  </p>

                  <div className="product-card-bottom">
                    <strong>
                      ৳
                      {Number(product.price).toLocaleString(
                        "en-BD"
                      )}
                    </strong>

                    <span
                      className={
                        Number(product.stock) > 0
                          ? "product-stock available"
                          : "product-stock unavailable"
                      }
                    >
                      {Number(product.stock) > 0
                        ? "In Stock"
                        : "Out of Stock"}
                    </span>
                  </div>

                  <button
                    className="accessories-add-button"
                    onClick={() => addToCart(product)}
                    disabled={Number(product.stock) < 1}
                  >
                    {Number(product.stock) < 1
                      ? "Out of Stock"
                      : "Add to Cart"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

      {/* Cart error */}
      {orderError && !cartOpen && (
        <p className="accessories-order-error">
          {orderError}
        </p>
      )}

      {/* Order message */}
      {orderMessage && !cartOpen && (
        <p className="accessories-order-success">
          {orderMessage}
        </p>
      )}

      {/* Cart panel */}
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
                          ৳
                          {Number(
                            product.price
                          ).toLocaleString("en-BD")}
                        </span>

                        {product.description && (
                          <p className="accessories-cart-description">
                            {product.description}
                          </p>
                        )}

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

                {/* Cart subtotal */}
                <div className="accessories-cart-total">
                  <span>Subtotal</span>

                  <strong>
                    ৳
                    {subtotal.toLocaleString("en-BD", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </strong>
                </div>

                {/* Membership discount */}
                <div className="accessories-cart-total">
                  <span>
                    Membership Discount
                    {membershipLoading
                      ? " (Loading...)"
                      : ` (${discountPercentage}%)`}
                  </span>

                  <strong>
                    - ৳
                    {discountAmount.toLocaleString("en-BD", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </strong>
                </div>

                {/* Final total */}
                <div className="accessories-cart-total">
                  <strong>Final Total</strong>

                  <strong>
                    ৳
                    {finalTotal.toLocaleString("en-BD", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </strong>
                </div>

                {/* Checkout */}
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

                  <label className="accessories-payment-label">
                    Payment Method
                  </label>

                  <div className="accessories-payment-options">
                    {paymentOptions.map((option) => (
                      <button
                        type="button"
                        key={option.value}
                        className={`accessories-payment-option ${
                          paymentMethod === option.value
                            ? "selected"
                            : ""
                        }`}
                        onClick={() =>
                          setPaymentMethod(option.value)
                        }
                        disabled={placingOrder}
                        aria-pressed={
                          paymentMethod === option.value
                        }
                      >
                        <span
                          className={`payment-option-logo ${option.type}-logo`}
                        >
                          {renderPaymentMark(option)}
                        </span>

                        <span className="payment-option-copy">
                          <strong>{option.name}</strong>
                          <small>{option.detail}</small>
                        </span>

                        <span className="payment-option-check">
                          {paymentMethod === option.value ? "✓" : ""}
                        </span>
                      </button>
                    ))}
                  </div>

                  {orderError && (
                    <p className="accessories-order-error">
                      {orderError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={
                      placingOrder ||
                      cart.length === 0 ||
                      Boolean(pendingPaymentOrderId)
                    }
                  >
                    {placingOrder
                      ? "Placing Order..."
                      : "Place Order"}
                  </button>
                </form>
              </>
            )}

            {/* Demo payment confirmation */}
            {pendingPaymentOrderId && (
              <div className="accessories-demo-payment">
                <h3>Demo Payment Confirmation</h3>

                <p>
                  Order ID: <strong>{pendingPaymentOrderId}</strong>
                </p>

                <p>
                  Payment Method:{" "}
                  <strong>{pendingPaymentMethod}</strong>
                </p>

                <p>
                  Payment Status: <strong>Pending</strong>
                </p>

                <p>
                  This is a simulated payment. Press the button
                  below to confirm a successful demo transaction.
                </p>

                <button
                  type="button"
                  onClick={confirmDemoPayment}
                  disabled={confirmingPayment}
                >
                  {confirmingPayment
                    ? "Confirming Payment..."
                    : "Confirm Demo Payment"}
                </button>
              </div>
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