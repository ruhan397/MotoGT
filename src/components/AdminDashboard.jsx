import motoLogo from '../assets/MotoGT-logo-clean.png';
import React, { useState, useEffect } from 'react';
import '../styles/AdminDashboard.css';
import '../styles/admin/AdminSidebar.css';
import '../styles/admin/AdminHeader.css';
import '../styles/admin/AdminOverview.css';
import '../styles/admin/AdminContent.css';
import '../styles/admin/AdminResponsive.css';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('Overview');

  const [products, setProducts] = useState([]);
const [productsLoading, setProductsLoading] = useState(true);
const [productsError, setProductsError] = useState('');
const [showAddProduct, setShowAddProduct] = useState(false);

const [newProduct, setNewProduct] = useState({
  name: "",
  brand: "",
  category: "",
  price: "",
  description: "",
  image: "",
  stock: "",
});

const [savingProduct, setSavingProduct] = useState(false);
const [productMessage, setProductMessage] = useState("");

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await fetch(
        'http://localhost:5001/api/products'
      );

      if (!response.ok) {
        throw new Error('Could not load products');
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      setProductsError(error.message);
    } finally {
      setProductsLoading(false);
    }
  };

  fetchProducts();
}, []);

const handleAddProduct = async (e) => {
  e.preventDefault();
  setSavingProduct(true);
  setProductMessage("");

  try {
    const token = localStorage.getItem("motogtToken");

    const response = await fetch("http://localhost:5001/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...newProduct,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to add product");
    }

    setProducts((prev) => [...prev, data]);
    setProductMessage("Product added successfully!");
    setShowAddProduct(false);
  } catch (error) {
    setProductMessage(error.message);
  } finally {
    setSavingProduct(false);
  }
};

  const menuItems = [
    'Overview',
    'Products',
    'Orders',
    'Enquiries',
  ];

  const stats = [
    {
      label: 'Total Products',
      value: '24',
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M3 7L12 3L21 7L12 11L3 7Z" />
          <path d="M3 7V17L12 21L21 17V7" />
          <path d="M12 11V21" />
          <path d="M7.5 5.2L16.5 9.2" />
        </svg>
      ),
    },
    {
      label: 'Total Orders',
      value: '12',
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M5 3H16L20 7V21H5V3Z" />
          <path d="M15 3V8H20" />
          <path d="M8 12H16M8 16H16" />
        </svg>
      ),
    },
    {
      label: 'New Enquiries',
      value: '08',
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M4 5H20V17H9L4 21V5Z" />
          <path d="M8 9H16M8 13H13" />
        </svg>
      ),
    },
  ];

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        
      <div className="admin-logo">
  <img src={motoLogo} alt="MotoGT Logo" />
</div>


        <p className="admin-label">MANAGEMENT</p>

        <nav>
          {menuItems.map((item) => (
            <button
              key={item}
              className={`admin-menu-item ${
                activeTab === item ? 'active' : ''
              }`}
              onClick={() => setActiveTab(item)}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          ADMIN PANEL
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <p className="admin-eyebrow">MANAGEMENT</p>
            <h1>{activeTab}</h1>
          </div>

          <div className="admin-profile">
            <span className="admin-avatar">A</span>
            <div>
              <strong>Administrator</strong>
              <p>Admin Account</p>
            </div>
          </div>
        </header>

        
{activeTab === 'Overview' && (
  <>
    <section className="admin-welcome">
      <p>WELCOME BACK</p>
      <h2>Better business begins here.</h2>
      <span>
        Manage MotoGT accessories, customer orders and dent &amp; paint enquiries
        from one place.
      </span>
    </section>

    <section className="admin-stats">
      {stats.map((stat) => (
        <article
        className={`admin-stat-card ${
          stat.label === 'Total Products'
            ? 'products-card'
            : stat.label === 'Total Orders'
            ? 'orders-card'
            : 'enquiries-card'
        }`}
        key={stat.label}
      >
          <div className="admin-stat-top">
            <span>{stat.label}</span>
            <span className="admin-stat-icon">
  {stat.icon}
</span>
          </div>
          <h3>{stat.value}</h3>
          <p>Demo data</p>
        </article>
      ))}
    </section>

    <section className="admin-lower-grid">
      <article className="admin-activity-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="admin-eyebrow">WORKSHOP OVERVIEW</p>
            <h2>Business activity</h2>
          </div>
          <span className="admin-live-dot">DEMO</span>
        </div>

        <div className="admin-activity-item">
          <span className="admin-activity-mark">01</span>
          <div>
            <strong>Car Accessories</strong>
            <p>Product catalogue management</p>
          </div>
          <span className="admin-activity-arrow">↗</span>
        </div>

        <div className="admin-activity-item">
          <span className="admin-activity-mark">02</span>
          <div>
            <strong>Dent &amp; Paint</strong>
            <p>Service enquiry management</p>
          </div>
          <span className="admin-activity-arrow">↗</span>
        </div>

        <div className="admin-activity-item">
          <span className="admin-activity-mark">03</span>
          <div>
            <strong>Customer Orders</strong>
            <p>Order review and tracking</p>
          </div>
          <span className="admin-activity-arrow">↗</span>
        </div>
      </article>

    </section>
  </>
)}


{activeTab === 'Products' && (
  <section className="admin-content-card">
    <h2>Product Management</h2>

    <button
  className="admin-action-button"
  onClick={() => setShowAddProduct(true)}
>
  + Add Product
</button>

{showAddProduct && (
  <div className="admin-content-card">
    <h2>Add New Product</h2>
    <p>Enter the details of your new product.</p>

    <form onSubmit={handleAddProduct}>
      <input
        type="text"
        placeholder="Product Name"
        value={newProduct.name}
        onChange={(e) =>
          setNewProduct({ ...newProduct, name: e.target.value })
        }
        required
      />

      <input
        type="text"
        placeholder="Brand"
        value={newProduct.brand}
        onChange={(e) =>
          setNewProduct({ ...newProduct, brand: e.target.value })
        }
        required
      />

      <input
        type="text"
        placeholder="Category"
        value={newProduct.category}
        onChange={(e) =>
          setNewProduct({ ...newProduct, category: e.target.value })
        }
        required
      />

      <input
        type="number"
        placeholder="Price"
        min="0"
        value={newProduct.price}
        onChange={(e) =>
          setNewProduct({ ...newProduct, price: e.target.value })
        }
        required
      />

      <textarea
        placeholder="Product Description"
        value={newProduct.description}
        onChange={(e) =>
          setNewProduct({ ...newProduct, description: e.target.value })
        }
      />

      <input
        type="text"
        placeholder="Image URL"
        value={newProduct.image}
        onChange={(e) =>
          setNewProduct({ ...newProduct, image: e.target.value })
        }
      />

      <input
        type="number"
        placeholder="Stock Quantity"
        min="0"
        value={newProduct.stock}
        onChange={(e) =>
          setNewProduct({ ...newProduct, stock: e.target.value })
        }
      />

      <button
        type="submit"
        className="admin-action-button"
        disabled={savingProduct}
      >
        {savingProduct ? "Saving..." : "Save Product"}
      </button>

      <button
        type="button"
        className="admin-action-button"
        onClick={() => setShowAddProduct(false)}
      >
        Close Form
      </button>
    </form>
  </div>
)}

{productMessage && <p>{productMessage}</p>}

    <p>Manage car accessories and product listings.</p>

    {productsLoading && <p>Loading products...</p>}

    {productsError && <p>{productsError}</p>}

    {!productsLoading && !productsError && products.length === 0 && (
      <p>No products found.</p>
    )}

    {!productsLoading && !productsError && products.map((product) => (
      <div className="admin-table-row" key={product._id}>
        <strong>{product.name}</strong>
        <span>{product.brand}</span>
        <span>৳{product.price.toLocaleString('en-BD')}</span>
      </div>
    ))}
  </section>
)}
        {activeTab === 'Orders' && (
          <section className="admin-content-card">
            <h2>Order Management</h2>
            <p>Review and manage customer orders.</p>
            <div className="admin-table-row">
              <strong>Order #1001</strong>
              <span>Sample order</span>
              <span className="admin-status">Pending</span>
            </div>
          </section>
        )}

        {activeTab === 'Enquiries' && (
          <section className="admin-content-card">
            <h2>Customer Enquiries</h2>
            <p>Review customer questions and service requests.</p>
            <div className="admin-table-row">
              <strong>Sample enquiry</strong>
              <span>Dent &amp; Paint</span>
              <span className="admin-status">New</span>
            </div>
          </section>
        )}

        <footer className="admin-footer">
          MotoGT Admin Dashboard · Prototype
        </footer>
      </main>
    </div>
  );
}

export default AdminDashboard;
