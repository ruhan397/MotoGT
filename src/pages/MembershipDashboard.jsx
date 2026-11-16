
import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";
import "../styles/MembershipDashboard.css";

function MembershipDashboard() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("motogtToken");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    let cancelled = false;

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const loadDashboard = async () => {
      try {
        const [profileResponse, ordersResponse] = await Promise.all([
          apiFetch("/users/profile", { headers }),
          apiFetch("/orders/my-orders", { headers }),
        ]);

        const profileData = await profileResponse.json().catch(() => ({}));
        const ordersData = await ordersResponse.json().catch(() => ({}));

        if (!profileResponse.ok) {
          throw new Error(
            profileData.message || "Could not load membership profile."
          );
        }

        if (!ordersResponse.ok) {
          throw new Error(
            ordersData.message || "Could not load order history."
          );
        }

        if (!cancelled) {
          setUser(profileData.user);
          setOrders(ordersData.orders || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Something went wrong.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
        <section className="dashboard-membership-card">
        <p className="dashboard-message">Loading your dashboard...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="membership-dashboard">
        <p className="dashboard-message dashboard-error">{error}</p>
      </section>
    );
  }

  if (!user) return null;

  const membership = user.membership || {};
  const level = membership.level || "standard";
  const totalSpent = Number(membership.totalSpent || 0);
  const discount = membership.discountPercentage ?? 5;

  const completedOrders = orders.filter((order) =>
    ["Completed", "Delivered"].includes(order.status)
  );

  const nextTier = {
    standard: { name: "Silver", amount: 10000 },
    silver: { name: "Gold", amount: 25000 },
    gold: { name: "Platinum", amount: 50000 },
  };

  const next = nextTier[level];
  const remaining = next
    ? Math.max(0, next.amount - totalSpent)
    : 0;

  const progress = next
    ? Math.min(100, (totalSpent / next.amount) * 100)
    : 100;

  const levelLabel = {
    standard: "CLASSIC",
    silver: "SILVER",
    gold: "GOLD",
    vip: "PLATINUM",
    loyalty: "PLATINUM",
  }[level] || "CLASSIC";

  const tierBackgrounds = {
    standard:
      "linear-gradient(135deg, #142b23 0%, #203c30 50%, #101c18 100%)",

    silver:
      "linear-gradient(135deg, #25282c 0%, #343a40 50%, #1b1e22 100%)",

    gold:
      "linear-gradient(135deg, #302414 0%, #514027 50%, #21190e 100%)",

    vip:
      "linear-gradient(135deg, #292d33 0%, #414750 50%, #1c2026 100%)",

    loyalty:
      "linear-gradient(135deg, #292d33 0%, #414750 50%, #1c2026 100%)",
  };

  const currentBackground =
    tierBackgrounds[level] || tierBackgrounds.standard;

  const formatCurrency = (amount) =>
    `৳${Number(amount || 0).toLocaleString("en-BD")}`;

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-BD", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <main
  className="membership-dashboard"
  style={{ background: currentBackground }}
>
      <div className="dashboard-container">
        <button
          className="dashboard-back"
          type="button"
          onClick={() => {
            window.location.href = "/";
          }}
        >
          ← Back to Home
        </button>

        <header className="dashboard-header">
          <p className="dashboard-eyebrow">MOTOGT MEMBERSHIP</p>
          <h1>My Membership</h1>
          <p>
            Welcome back, {user.fullName}. Track your rewards and
            purchase history.
          </p>
        </header>

        <section className="dashboard-membership-card">
          <div>
            <span className="dashboard-small-label">
              CURRENT MEMBERSHIP
            </span>
            <h2>{levelLabel}</h2>
            <p>{user.fullName}</p>
          </div>

          <div className="dashboard-discount">
            <strong>{discount}%</strong>
            <span>MEMBER DISCOUNT</span>
          </div>
        </section>

        <section className="dashboard-stats">
          <div className="dashboard-stat">
            <span>TOTAL PURCHASE</span>
            <strong>{formatCurrency(totalSpent)}</strong>
          </div>

          <div className="dashboard-stat">
            <span>COMPLETED ORDERS</span>
            <strong>{completedOrders.length}</strong>
          </div>

          <div className="dashboard-stat">
            <span>CURRENT DISCOUNT</span>
            <strong>{discount}%</strong>
          </div>
        </section>

        <section className="dashboard-progress">
          <div className="dashboard-section-heading">
            <div>
              <span className="dashboard-eyebrow">YOUR REWARDS</span>
              <h2>Membership Progress</h2>
            </div>

            <strong>{Math.round(progress)}%</strong>
          </div>

          <div className="dashboard-progress-track">
            <div
              className="dashboard-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          {next ? (
            <p>
              Spend <strong>{formatCurrency(remaining)}</strong> more
              to reach <strong>{next.name}</strong>.
            </p>
          ) : (
            <p>You have reached the highest membership level.</p>
          )}
        </section>

        <section className="dashboard-history">
          <div className="dashboard-section-heading">
            <div>
              <span className="dashboard-eyebrow">YOUR PURCHASES</span>
              <h2>Order History</h2>
            </div>

            <span>{orders.length} Orders</span>
          </div>

          {orders.length === 0 ? (
            <div className="dashboard-empty">
              <h3>No orders yet</h3>
              <p>Your purchases will appear here after you place an order.</p>
            </div>
          ) : (
            <div className="dashboard-order-list">
              {orders.map((order) => (
                <article
                  className="dashboard-order"
                  key={order._id}
                >
                  <div className="dashboard-order-top">
                    <div>
                      <span className="dashboard-order-label">
                        ORDER ID
                      </span>
                      <strong>#{order._id.slice(-8).toUpperCase()}</strong>
                    </div>

                    <span
                      className={`dashboard-order-status status-${String(
                        order.status
                      ).toLowerCase()}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="dashboard-order-info">
                    <div>
                      <span>ORDER DATE</span>
                      <strong>{formatDate(order.createdAt)}</strong>
                    </div>

                    <div>
                      <span>ITEMS</span>
                      <strong>{order.products?.reduce(
                        (total, item) => total + Number(item.quantity || 0),
                        0
                      ) || 0}</strong>
                    </div>

                    <div>
                      <span>TOTAL</span>
                      <strong>{formatCurrency(order.totalAmount)}</strong>
                    </div>
                  </div>

                  <div className="dashboard-order-products">
                    {order.products?.map((item, index) => {
                      const product = item.productId;
                      const productName =
                        product && typeof product === "object"
                          ? product.name || product.title || "Product"
                          : "Product";

                      return (
                        <span key={item._id || index}>
                          {productName} × {item.quantity}
                        </span>
                      );
                    })}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default MembershipDashboard;
