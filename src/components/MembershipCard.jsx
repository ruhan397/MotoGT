
import { useEffect, useState } from "react";
import "../styles/MembershipCard.css";

function MembershipCard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("motogtToken");

    if (!token) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch(
          "http://localhost:5001/api/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not load membership");
        }

        setUser(data.user);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return null;
  if (!user) return null;
  if (error) return <p>{error}</p>;

  const membership = user.membership || {};
  const level = membership.level || "standard";
  const discount = membership.discountPercentage ?? 5;
  const totalSpent = membership.totalSpent ?? 0;

  const nextTier = {
    standard: { name: "Silver", amount: 10000 },
    silver: { name: "Gold", amount: 25000 },
    gold: { name: "VIP", amount: 50000 },
  };

  const next = nextTier[level];
  const remaining = next
    ? Math.max(0, next.amount - totalSpent)
    : 0;

  return (
    <section className="membership-section">
      <div className="membership-card">
        <div className="membership-top">
          <div>
            <p className="membership-label">MOTOGT MEMBERSHIP</p>
            <h2>Welcome, {user.fullName}</h2>
          </div>

          <span className="membership-level">
            {level.toUpperCase()}
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
            <p>You have reached the highest membership level.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default MembershipCard;
