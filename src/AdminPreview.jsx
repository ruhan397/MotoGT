
import React, { useEffect, useState } from "react";
import AdminDashboard from "./components/AdminDashboard";
import { apiFetch } from "./utils/api";

function AdminPreview() {
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const verifyAdmin = async () => {
      const token = localStorage.getItem("motogtAdminToken");

      if (!token) {
        window.location.replace("/admin/login");
        return;
      }

      try {
        await apiFetch("/auth/admin/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAuthorized(true);
      } catch (error) {
        localStorage.removeItem("motogtAdminToken");
        localStorage.removeItem("motogtAdminUser");
        window.location.replace("/admin/login");
      } finally {
        setChecking(false);
      }
    };

    verifyAdmin();
  }, []);

  if (checking) {
    return <p>Verifying Admin Session...</p>;
  }

  if (!authorized) {
    return null;
  }

  return <AdminDashboard />;
}

export default AdminPreview;
