
import { useEffect, useState } from "react";
import logo from "../assets/MotoGT-logo-clean.png";
import { apiFetch } from "../utils/api";
import "../styles/MembershipCard.css";

function MembershipCard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("motogtToken");
    let cancelled = false;

    if (!token) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await apiFetch("/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data.message || "Could not load membership."
          );
        }

        if (!cancelled) {
          setUser(data.user);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message || "Could not load membership."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, [retryCount]);

  if (loading) return null;

  if (error) {
    return (
      <section className="membership-section">
        <p>{error}</p>
        <button
          type="button"
          onClick={() => setRetryCount((count) => count + 1)}
        >
          Try Again
        </button>
      </section>
    );
  }

  if (!user) return null;

  const membership = user.membership || {};
  const level = membership.level || "standard";

  const levelClass = {
    standard: "normal",
    silver: "silver",
    gold: "gold",
    vip: "vip",
    loyalty: "vip",
  }[level] || "normal";

  const levelLabel = {
    standard: "CLASSIC",
    silver: "SILVER",
    gold: "GOLD",
    vip: "PLATINUM",
    loyalty: "PLATINUM",
  }[level] || "CLASSIC";

  const discount = membership.discountPercentage ?? 5;
  const totalSpent = Number(membership.totalSpent ?? 0);

  const nextTier = {
    standard: { name: "Silver", amount: 10000 },
    silver: { name: "Gold", amount: 25000 },
    gold: { name: "Platinum", amount: 50000 },
  };

  const next = nextTier[level];

  const remaining = next
    ? Math.max(0, next.amount - totalSpent)
    : 0;

  return (
    <section className="membership-section">
      <div className={`membership-card membership-card--${levelClass}`}>

        <div className="membership-top">
          <div className="membership-heading">

            <div className="membership-brand">
              <img src={logo} alt="MotoGT logo" />
              <span className="membership-label">
                MEMBERSHIP
              </span>
            </div>

            <h2>Welcome, {user.fullName}</h2>

          </div>

          <span className="membership-level">
            {levelLabel}
          </span>
        </div>

        <div className="membership-details">

          <div className="membership-detail">
            <span>Current Discount</span>
            <strong>{discount}%</strong>
          </div>

          <div className="membership-detail">
            <span>Total Purchase</span>
            <strong>
              ৳{totalSpent.toLocaleString("en-BD")}
            </strong>
          </div>

        </div>

        <div className="membership-progress">
          {next ? (
            <>
              <p>
                Next Level: <strong>{next.name}</strong>
              </p>

              <p>
                Spend ৳{remaining.toLocaleString("en-BD")} more
                to reach {next.name}
              </p>
            </>
          ) : (
            <p>
              You have reached the highest membership level.
            </p>
          )}
        </div>

      </div>
    </section>
  );
}

export default MembershipCard;
