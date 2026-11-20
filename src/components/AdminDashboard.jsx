import motoLogo from '../assets/MotoGT-logo-clean.png';
import { apiFetch } from '../utils/api';
import React, { useState, useEffect } from 'react';
import '../styles/AdminDashboard.css';
import '../styles/admin/AdminSidebar.css';
import '../styles/admin/AdminHeader.css';
import '../styles/admin/AdminOverview.css';
import '../styles/admin/AdminContent.css';
import '../styles/admin/AdminResponsive.css';

function AdminDashboard() {
  const handleAdminLogout = () => {
    localStorage.removeItem('motogtAdminToken');
    localStorage.removeItem('motogtAdminUser');
    window.location.replace('/admin/login');
  };

  const [activeTab, setActiveTab] = useState('Overview');

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState('');
  const [productsRetry, setProductsRetry] = useState(0);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [updatingProduct, setUpdatingProduct] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState(null);

  const [newProduct, setNewProduct] = useState({
    name: '',
    brand: '',
    category: '',
    price: '',
    description: '',
    image: '',
    stock: '',
  });

  const [savingProduct, setSavingProduct] = useState(false);
  const [productMessage, setProductMessage] = useState('');

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');
  const [orderUpdatingId, setOrderUpdatingId] = useState(null);

  const [appointments, setAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [appointmentsError, setAppointmentsError] = useState('');
  const [appointmentUpdatingId, setAppointmentUpdatingId] = useState(null);
  const [appointmentDuration, setAppointmentDuration] = useState({});
  const [appointmentNotes, setAppointmentNotes] = useState({});

  // Enquiries states
  const [enquiries, setEnquiries] = useState([]);
  const [enquiriesLoading, setEnquiriesLoading] = useState(false);
  const [enquiriesError, setEnquiriesError] = useState('');
  const [enquiryUpdatingId, setEnquiryUpdatingId] = useState(null);
// Enquiry Reply states
const [replyMessages, setReplyMessages] = useState({});
const [replySendingId, setReplySendingId] = useState(null);
const [replyFeedback, setReplyFeedback] = useState({});
  // Fetch Orders
  const fetchOrders = async () => {
    setOrdersLoading(true);
    setOrdersError('');

    try {
      const token = localStorage.getItem('motogtAdminToken');

      const response = await apiFetch('/orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json().catch(() => []);

      if (!response.ok) {
        throw new Error(data.message || 'Could not load orders');
      }

      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      setOrdersError(error.message);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Fetch Appointments
  const fetchAppointments = async () => {
    setAppointmentsLoading(true);
    setAppointmentsError('');

    try {
      const token = localStorage.getItem('motogtAdminToken');

      const response = await apiFetch('/appointments/admin/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json().catch(() => []);

      if (!response.ok) {
        throw new Error(data.message || 'Could not load appointments');
      }

      setAppointments(Array.isArray(data) ? data : []);
    } catch (error) {
      setAppointmentsError(error.message);
    } finally {
      setAppointmentsLoading(false);
    }
  };

  // Fetch Customer Enquiries
  const fetchEnquiries = async () => {
    setEnquiriesLoading(true);
    setEnquiriesError('');

    try {
      const token = localStorage.getItem('motogtAdminToken');

      const response = await apiFetch('/enquiries', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json().catch(() => []);

      if (!response.ok) {
        throw new Error(data.message || 'Could not load enquiries');
      }

      setEnquiries(Array.isArray(data) ? data : []);
    } catch (error) {
      setEnquiriesError(error.message);
    } finally {
      setEnquiriesLoading(false);
    }
  };

  // Update Enquiry Status
  const handleEnquiryStatusChange = async (enquiryId, status) => {
    setEnquiryUpdatingId(enquiryId);
    setEnquiriesError('');

    try {
      const token = localStorage.getItem('motogtAdminToken');

      const response = await apiFetch(
        `/enquiries/${enquiryId}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Could not update enquiry');
      }

      setEnquiries((previousEnquiries) =>
        previousEnquiries.map((enquiry) =>
          enquiry._id === enquiryId
            ? { ...enquiry, status: data.enquiry.status }
            : enquiry
        )
      );
    } catch (error) {
      setEnquiriesError(error.message);
    } finally {
      setEnquiryUpdatingId(null);
    }
  };

  // Send Email Reply to Customer
  const handleSendEnquiryReply = async (enquiryId) => {
    const replyMessage = replyMessages[enquiryId]?.trim();

    if (!replyMessage) {
      setReplyFeedback((previous) => ({
        ...previous,
        [enquiryId]: {
          type: 'error',
          message: 'Please write a reply first.',
        },
      }));
      return;
    }

    setReplySendingId(enquiryId);

    setReplyFeedback((previous) => ({
      ...previous,
      [enquiryId]: null,
    }));

    try {
      const token = localStorage.getItem('motogtAdminToken');

      const response = await apiFetch(
        `/enquiries/${enquiryId}/reply`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ replyMessage }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Could not send reply.');
      }

      setEnquiries((previous) =>
        previous.map((enquiry) =>
          enquiry._id === enquiryId ? data.enquiry : enquiry
        )
      );

      setReplyMessages((previous) => ({
        ...previous,
        [enquiryId]: '',
      }));

      setReplyFeedback((previous) => ({
        ...previous,
        [enquiryId]: {
          type: 'success',
          message: 'Reply sent successfully!',
        },
      }));
    } catch (error) {
      setReplyFeedback((previous) => ({
        ...previous,
        [enquiryId]: {
          type: 'error',
          message: error.message,
        },
      }));
    } finally {
      setReplySendingId(null);
    }
  };

  // Approve Appointment
  const handleApproveAppointment = async (appointmentId) => {
    setAppointmentUpdatingId(appointmentId);

    try {
      const token = localStorage.getItem('motogtAdminToken');

      const response = await apiFetch(
        `/appointments/admin/${appointmentId}/approve`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            durationDays: Number(appointmentDuration[appointmentId] || 2),
            adminNote: appointmentNotes[appointmentId] || '',
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Could not approve appointment');
      }

      await fetchAppointments();
    } catch (error) {
      setAppointmentsError(error.message);
    } finally {
      setAppointmentUpdatingId(null);
    }
  };

  // Reject Appointment
  const handleRejectAppointment = async (appointmentId) => {
    setAppointmentUpdatingId(appointmentId);

    try {
      const token = localStorage.getItem('motogtAdminToken');

      const response = await apiFetch(
        `/appointments/admin/${appointmentId}/reject`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            adminNote: appointmentNotes[appointmentId] || '',
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Could not reject appointment');
      }

      await fetchAppointments();
    } catch (error) {
      setAppointmentsError(error.message);
    } finally {
      setAppointmentUpdatingId(null);
    }
  };

  // Complete Appointment
  const handleCompleteAppointment = async (appointmentId) => {
    setAppointmentUpdatingId(appointmentId);

    try {
      const token = localStorage.getItem('motogtAdminToken');

      const response = await apiFetch(
        `/appointments/admin/${appointmentId}/complete`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Could not complete appointment');
      }

      await fetchAppointments();
    } catch (error) {
      setAppointmentsError(error.message);
    } finally {
      setAppointmentUpdatingId(null);
    }
  };

  // Update Order Status
  const handleOrderStatusChange = async (orderId, status) => {
    setOrderUpdatingId(orderId);

    try {
      const token = localStorage.getItem('motogtAdminToken');

      const response = await apiFetch(`/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Could not update order');
      }

      await fetchOrders();
    } catch (error) {
      setOrdersError(error.message);
    } finally {
      setOrderUpdatingId(null);
    }
  };

  // Load Products and Enquiries
  useEffect(() => {
    const fetchProducts = async () => {
      setProductsLoading(true);
      setProductsError('');

      try {
        const response = await apiFetch('/products');

        if (!response.ok) {
          throw new Error('Could not load products');
        }

        const data = await response.json().catch(() => []);
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        setProductsError(error.message);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
    fetchEnquiries();
  }, [productsRetry]);

  // Add Product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setSavingProduct(true);
    setProductMessage('');

    try {
      const token = localStorage.getItem('motogtAdminToken');

      const response = await apiFetch('/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newProduct,
          price: Number(newProduct.price),
          stock: Number(newProduct.stock),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add product');
      }

      setProducts((previousProducts) => [...previousProducts, data]);
      setProductMessage('Product added successfully!');
      setShowAddProduct(false);
    } catch (error) {
      setProductMessage(error.message);
    } finally {
      setSavingProduct(false);
    }
  };

  // Update Product
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setUpdatingProduct(true);
    setProductMessage('');

    try {
      const token = localStorage.getItem('motogtAdminToken');

      const response = await apiFetch(
        `/products/${editingProduct._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...editingProduct,
            price: Number(editingProduct.price),
            stock: Number(editingProduct.stock),
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update product');
      }

      setProducts((previousProducts) =>
        previousProducts.map((product) =>
          product._id === editingProduct._id ? data : product
        )
      );

      setProductMessage('Product updated successfully!');
      setEditingProduct(null);
    } catch (error) {
      setProductMessage(error.message);
    } finally {
      setUpdatingProduct(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (productId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this product?'
    );

    if (!confirmed) return;

    setDeletingProductId(productId);
    setProductMessage('');

    try {
      const token = localStorage.getItem('motogtAdminToken');

      const response = await apiFetch(
        `/products/${productId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete product');
      }

      setProducts((previousProducts) =>
        previousProducts.filter((product) => product._id !== productId)
      );

      setProductMessage('Product deleted successfully!');
    } catch (error) {
      setProductMessage(error.message);
    } finally {
      setDeletingProductId(null);
    }
  };

  const menuItems = [
    'Overview',
    'Products',
    'Orders',
    'Appointments',
    'Enquiries',
  ];

  const stats = [
    {
      label: 'Total Products',
      value: productsLoading ? '...' : products.length.toLocaleString('en-BD'),
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
      value: ordersLoading ? '...' : orders.length.toLocaleString('en-BD'),
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
      value: enquiriesLoading
        ? '...'
        : enquiries.filter((enquiry) => enquiry.status === 'New').length.toLocaleString('en-BD'),
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
              onClick={() => {
                setActiveTab(item);

                if (item === 'Appointments') {
                  fetchAppointments();
                }

                if (item === 'Orders') {
                  fetchOrders();
                }

                if (item === 'Enquiries') {
                  fetchEnquiries();
                }
              }}
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

          <div className="admin-header-actions">
            <div className="admin-profile">
              <span className="admin-avatar">A</span>
              <div>
                <strong>Administrator</strong>
                <p>Admin Account</p>
              </div>
            </div>

            <button
              type="button"
              className="admin-logout-button"
              onClick={handleAdminLogout}
            >
              Logout
            </button>
          </div>
        </header>

        {/* OVERVIEW */}
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

                  <p>
                    {stat.label === 'Total Products'
                      ? 'Total products listed'
                      : stat.label === 'Total Orders'
                      ? 'Customer orders'
                      : 'New customer enquiries'}
                  </p>
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

        {/* PRODUCTS */}
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
                    {savingProduct ? 'Saving...' : 'Save Product'}
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

            {productsError && (
              <div>
                <p>{productsError}</p>
                <button
                  className="admin-action-button"
                  onClick={() => setProductsRetry((count) => count + 1)}
                >
                  Try Again
                </button>
              </div>
            )}

            {!productsLoading && !productsError && products.length === 0 && (
              <p>No products found.</p>
            )}

            {editingProduct && (
              <div className="admin-content-card">
                <h2>Edit Product</h2>

                <form onSubmit={handleUpdateProduct}>
                  <input
                    type="text"
                    placeholder="Product Name"
                    value={editingProduct.name}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, name: e.target.value })
                    }
                    required
                  />

                  <input
                    type="text"
                    placeholder="Brand"
                    value={editingProduct.brand}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, brand: e.target.value })
                    }
                    required
                  />

                  <input
                    type="text"
                    placeholder="Category"
                    value={editingProduct.category}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, category: e.target.value })
                    }
                    required
                  />

                  <input
                    type="number"
                    placeholder="Price"
                    min="0"
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, price: e.target.value })
                    }
                    required
                  />

                  <textarea
                    placeholder="Product Description"
                    value={editingProduct.description || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, description: e.target.value })
                    }
                  />

                  <input
                    type="text"
                    placeholder="Image URL"
                    value={editingProduct.image || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, image: e.target.value })
                    }
                  />

                  <input
                    type="number"
                    placeholder="Stock Quantity"
                    min="0"
                    value={editingProduct.stock ?? 0}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, stock: e.target.value })
                    }
                  />

                  <button
                    type="submit"
                    className="admin-action-button"
                    disabled={updatingProduct}
                  >
                    {updatingProduct ? 'Updating...' : 'Update Product'}
                  </button>

                  <button
                    type="button"
                    className="admin-action-button"
                    onClick={() => setEditingProduct(null)}
                  >
                    Cancel
                  </button>
                </form>
              </div>
            )}

            {!productsLoading && !productsError && products.map((product) => (
              <div className="admin-table-row" key={product._id}>
                <strong>{product.name}</strong>
                <span>{product.brand}</span>
                <span>৳{Number(product.price).toLocaleString('en-BD')}</span>

                <button
                  className="admin-action-button"
                  onClick={() => {
                    setEditingProduct({ ...product });
                    setShowAddProduct(false);
                  }}
                >
                  Edit
                </button>

                <button
                  className="admin-action-button"
                  onClick={() => handleDeleteProduct(product._id)}
                  disabled={deletingProductId === product._id}
                >
                  {deletingProductId === product._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            ))}
          </section>
        )}

        {/* ORDERS */}
        {activeTab === 'Orders' && (
          <section className="admin-content-card">
            <h2>Order Management</h2>
            <p>Manage real customer orders.</p>

            <button
              className="admin-action-button"
              onClick={fetchOrders}
              disabled={ordersLoading}
            >
              {ordersLoading ? 'Loading...' : 'Refresh Orders'}
            </button>

            {ordersError && <p>{ordersError}</p>}
            {ordersLoading && <p>Loading customer orders...</p>}

            {!ordersLoading && !ordersError && orders.length === 0 && (
              <p>No customer orders yet.</p>
            )}

            {!ordersLoading && orders.map((order) => (
              <div className="admin-table-row" key={order._id}>
                <div>
                  <strong>{order.customerName}</strong>
                  <p>{order.email}</p>
                  <p>{order.phone}</p>
                  <p>{order.address}</p>
                  <p>
                    Order: {new Date(order.createdAt).toLocaleString()}
                  </p>

                  {order.products.map((item, index) => (
                    <p key={index}>
                      {item.productId?.name || 'Product'} × {item.quantity}
                    </p>
                  ))}
                </div>

                <span>
                  ৳{Number(order.totalAmount).toLocaleString('en-BD')}
                </span>

                <select
                  value={order.status}
                  disabled={orderUpdatingId === order._id}
                  onChange={(event) =>
                    handleOrderStatusChange(order._id, event.target.value)
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                {orderUpdatingId === order._id && <span>Updating...</span>}
              </div>
            ))}
          </section>
        )}

        {/* APPOINTMENTS */}
        {activeTab === 'Appointments' && (
          <section className="admin-content-card">
            <h2>Appointment Management</h2>
            <p>Review and manage customer appointment requests.</p>

            <button
              className="admin-action-button"
              onClick={fetchAppointments}
              disabled={appointmentsLoading}
            >
              {appointmentsLoading ? 'Loading...' : 'Refresh Appointments'}
            </button>

            {appointmentsError && <p>{appointmentsError}</p>}
            {appointmentsLoading && <p>Loading appointment requests...</p>}

            {!appointmentsLoading && !appointmentsError && appointments.length === 0 && (
              <p>No appointment requests found.</p>
            )}

            {!appointmentsLoading && appointments.map((appointment) => (
              <div className="admin-table-row" key={appointment._id}>
                <div>
                  <strong>{appointment.customerName}</strong>
                  <p>Email: {appointment.email}</p>
                  <p>Phone: {appointment.phone}</p>
                  <p>Vehicle: {appointment.vehicleModel}</p>
                  <p>Service: {appointment.service}</p>
                  <p>Problem: {appointment.problemDescription || 'Not specified'}</p>
                  <p>Preferred Date: {appointment.preferredStartDate}</p>
                  <p>Duration: {appointment.durationDays || 'Not assigned'}</p>
                  <p>End Date: {appointment.endDate || 'Not assigned'}</p>
                  <p>
                    Status: <strong>{appointment.status}</strong>
                  </p>

                  {appointment.adminNote && (
                    <p>Admin Note: {appointment.adminNote}</p>
                  )}

                  {appointment.status === 'Pending' && (
                    <div className="appointment-admin-actions">
                      <label>Workshop Duration</label>

                      <select
                        value={appointmentDuration[appointment._id] || '2'}
                        onChange={(e) =>
                          setAppointmentDuration((previous) => ({
                            ...previous,
                            [appointment._id]: e.target.value,
                          }))
                        }
                      >
                        <option value="2">2 Working Days</option>
                        <option value="3">3 Working Days</option>
                        <option value="4">4 Working Days</option>
                      </select>

                      <textarea
                        placeholder="Admin Note (optional)"
                        value={appointmentNotes[appointment._id] || ''}
                        onChange={(e) =>
                          setAppointmentNotes((previous) => ({
                            ...previous,
                            [appointment._id]: e.target.value,
                          }))
                        }
                      />

                      <button
                        className="admin-action-button"
                        disabled={appointmentUpdatingId === appointment._id}
                        onClick={() => handleApproveAppointment(appointment._id)}
                      >
                        {appointmentUpdatingId === appointment._id
                          ? 'Processing...'
                          : 'Approve'}
                      </button>

                      <button
                        className="admin-action-button"
                        disabled={appointmentUpdatingId === appointment._id}
                        onClick={() => handleRejectAppointment(appointment._id)}
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {appointment.status === 'Approved' && (
                    <button
                      className="admin-action-button"
                      disabled={appointmentUpdatingId === appointment._id}
                      onClick={() => handleCompleteAppointment(appointment._id)}
                    >
                      {appointmentUpdatingId === appointment._id
                        ? 'Processing...'
                        : 'Mark as Completed'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* ENQUIRIES */}
        {activeTab === 'Enquiries' && (
          <section className="admin-content-card">
            <h2>Customer Enquiries</h2>
            <p>
              Review customer requests submitted through the MotoGT website.
            </p>

            <button
              className="admin-action-button"
              onClick={fetchEnquiries}
              disabled={enquiriesLoading}
            >
              {enquiriesLoading ? 'Loading...' : 'Refresh Enquiries'}
            </button>

            {enquiriesError && (
              <p className="enquiry-error">{enquiriesError}</p>
            )}

            {enquiriesLoading && (
              <p>Loading customer enquiries...</p>
            )}

            {!enquiriesLoading && !enquiriesError && enquiries.length === 0 && (
              <p>No customer enquiries yet.</p>
            )}

            {!enquiriesLoading && enquiries.map((enquiry) => (
              <article className="enquiry-admin-card" key={enquiry._id}>
                <div className="enquiry-admin-details">
                  <div className="enquiry-admin-heading">
                    <strong>{enquiry.fullName}</strong>
                    <span className="admin-status">{enquiry.status}</span>
                  </div>

                  <p>Email: {enquiry.email}</p>
                  <p>Phone: {enquiry.phone}</p>
                  <p>Subject: {enquiry.subject}</p>

                  <div className="enquiry-admin-message">
                    <span>Customer Message</span>
                    <p>{enquiry.message}</p>
                  </div>

                  <p className="enquiry-admin-date">
                    Submitted: {new Date(enquiry.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="enquiry-admin-status-control">
                  <label htmlFor={`enquiry-status-${enquiry._id}`}>
                    Update Status
                  </label>

                  <select
                    id={`enquiry-status-${enquiry._id}`}
                    value={enquiry.status}
                    disabled={enquiryUpdatingId === enquiry._id}
                    onChange={(event) =>
                      handleEnquiryStatusChange(
                        enquiry._id,
                        event.target.value
                      )
                    }
                  >
                    <option value="New">New</option>
                    <option value="Replied">Replied</option>
                    <option value="Resolved">Resolved</option>
                  </select>

                  {enquiryUpdatingId === enquiry._id && (
                    <span>Updating...</span>
                  )}
                </div>
                                {/* Email Reply Section */}
                                <div className="enquiry-reply-section">
                  <h3>Reply to Customer</h3>

                  {/* Previous Replies */}
                  {enquiry.replies?.length > 0 && (
                    <div className="enquiry-reply-history">
                      <h4>Previous Replies</h4>

                      {enquiry.replies.map((reply, index) => (
                        <div className="enquiry-reply-item" key={index}>
                          <p>{reply.message}</p>
                          <span>
                            Sent to: {reply.sentTo}
                          </span>
                          <span>
                            {new Date(reply.sentAt).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <textarea
                    className="enquiry-reply-textarea"
                    placeholder="Write your email reply here..."
                    value={replyMessages[enquiry._id] || ''}
                    onChange={(event) =>
                      setReplyMessages((previous) => ({
                        ...previous,
                        [enquiry._id]: event.target.value,
                      }))
                    }
                  />

                  <button
                    type="button"
                    className="admin-action-button enquiry-reply-button"
                    disabled={replySendingId === enquiry._id}
                    onClick={() => handleSendEnquiryReply(enquiry._id)}
                  >
                    {replySendingId === enquiry._id
                      ? 'Sending...'
                      : 'Send Reply'}
                  </button>

                  {replyFeedback[enquiry._id] && (
                    <p
                      className={
                        replyFeedback[enquiry._id].type === 'success'
                          ? 'enquiry-success'
                          : 'enquiry-error'
                      }
                    >
                      {replyFeedback[enquiry._id].message}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;