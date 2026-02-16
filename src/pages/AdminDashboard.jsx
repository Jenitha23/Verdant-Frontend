import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import plantService from '../services/plantService';
import orderService from '../services/orderService';
import userService from '../services/userService';
import authService from '../services/authService';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('plants');
  const [plants, setPlants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPlantModal, setShowPlantModal] = useState(false);
  const [editingPlant, setEditingPlant] = useState(null);
  const [plantForm, setPlantForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: ''
  });
  
  // User Management State
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [userToUpdateRole, setUserToUpdateRole] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  
  // Order Details Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [paginatedPlants, setPaginatedPlants] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!authService.isAdmin()) {
      navigate('/');
      return;
    }
    fetchData();
  }, [navigate]);

  useEffect(() => {
    if (activeTab === 'plants-paginated') {
      fetchPaginatedPlants(currentPage);
    }
  }, [activeTab, currentPage]);

  useEffect(() => {
    // Filter users based on search term
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = users.filter(user => 
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.role.toLowerCase().includes(term)
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [plantsData, ordersData, usersData, customersData, statsData] = await Promise.all([
        plantService.getAllPlantsAdmin(),
        orderService.getAllOrders(),
        userService.getAllUsers(),
        userService.getAllCustomers(),
        userService.getUserStats()
      ]);
      setPlants(plantsData);
      setOrders(ordersData);
      setUsers(usersData);
      setFilteredUsers(usersData);
      setCustomers(customersData);
      console.log('User stats:', statsData);
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaginatedPlants = async (page) => {
    try {
      const data = await plantService.getAllPlantsPaginated(page, pageSize, 'name');
      setPaginatedPlants(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Failed to fetch paginated plants:', err);
    }
  };

  const handlePlantSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPlant) {
        await plantService.updatePlant(editingPlant.id, plantForm);
      } else {
        await plantService.addPlant(plantForm);
      }
      setShowPlantModal(false);
      setEditingPlant(null);
      resetPlantForm();
      fetchData();
      if (activeTab === 'plants-paginated') {
        fetchPaginatedPlants(currentPage);
      }
    } catch (err) {
      alert(err.message || 'Failed to save plant');
    }
  };

  const handleEditPlant = (plant) => {
    setEditingPlant(plant);
    setPlantForm({
      name: plant.name,
      description: plant.description || '',
      price: plant.price,
      stock: plant.stock,
      imageUrl: plant.imageUrl || ''
    });
    setShowPlantModal(true);
  };

  const handleDeletePlant = async (plantId) => {
    if (window.confirm('Are you sure you want to delete this plant?')) {
      try {
        await plantService.deletePlant(plantId);
        fetchData();
        if (activeTab === 'plants-paginated') {
          fetchPaginatedPlants(currentPage);
        }
      } catch (err) {
        alert(err.message || 'Failed to delete plant');
      }
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    }
  };

  // User Management Functions
  const handleToggleUserStatus = async (userId) => {
    try {
      const response = await userService.toggleUserStatus(userId);
      if (response.success) {
        fetchData();
        alert(response.message);
      }
    } catch (err) {
      alert(err.message || 'Failed to update user status');
    }
  };

  const handleDeleteUserClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    
    try {
      const response = await userService.deleteUser(userToDelete.id);
      if (response.success) {
        setShowDeleteModal(false);
        setUserToDelete(null);
        fetchData();
        alert(response.message);
      }
    } catch (err) {
      alert(err.message || 'Failed to delete user');
    }
  };

  const handleUpdateRoleClick = (user) => {
    setUserToUpdateRole(user);
    setSelectedRole(user.role);
    setShowRoleModal(true);
  };

  const handleConfirmRoleUpdate = async () => {
    if (!userToUpdateRole || !selectedRole) return;
    
    try {
      const response = await userService.updateUserRole(userToUpdateRole.id, selectedRole);
      if (response.success) {
        setShowRoleModal(false);
        setUserToUpdateRole(null);
        fetchData();
        alert(response.message);
      }
    } catch (err) {
      alert(err.message || 'Failed to update user role');
    }
  };

  // Order Details Function
  const handleViewOrderDetails = async (orderId) => {
    try {
      const response = await orderService.getAdminOrderById(orderId);
      const orderDetails = response.order || response;
      setSelectedOrder(orderDetails);
      setShowOrderModal(true);
    } catch (err) {
      console.error('Failed to fetch order details:', err);
      alert(`Failed to fetch order details: ${err.message || 'Unknown error'}`);
    }
  };

  const resetPlantForm = () => {
    setPlantForm({
      name: '',
      description: '',
      price: '',
      stock: '',
      imageUrl: ''
    });
  };

  const openAddPlantModal = () => {
    setEditingPlant(null);
    resetPlantForm();
    setShowPlantModal(true);
  };

  const getStatusClass = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending': return 'status-pending';
      case 'processed': return 'status-processed';
      case 'shipped': return 'status-shipped';
      case 'delivered': return 'status-delivered';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="leaf-loader">🌿</div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error">
        <p>{error}</p>
        <button onClick={fetchData} className="retry-btn">Try Again</button>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back, {authService.getCurrentUserFromStorage()?.name || 'Admin'}</p>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'plants' ? 'active' : ''}`}
          onClick={() => setActiveTab('plants')}
        >
          Plants Management
        </button>
        <button
          className={`tab-btn ${activeTab === 'plants-paginated' ? 'active' : ''}`}
          onClick={() => setActiveTab('plants-paginated')}
        >
          Plants (Paginated)
        </button>
        <button
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders Management
        </button>
        <button
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          User Management
        </button>
      </div>

      <div className="admin-content">
        {/* Plants Tab - Regular */}
        {activeTab === 'plants' && (
          <div className="plants-tab">
            <div className="tab-header">
              <h2>Manage Plants</h2>
              <button className="add-btn" onClick={openAddPlantModal}>
                + Add New Plant
              </button>
            </div>

            <div className="plants-table-container">
              <table className="plants-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {plants.map(plant => (
                    <tr key={plant.id}>
                      <td>#{plant.id}</td>
                      <td>
                        <img src={plant.imageUrl || '/placeholder-plant.svg'} alt={plant.name} className="table-image" />
                      </td>
                      <td>{plant.name}</td>
                      <td>${plant.price}</td>
                      <td>
                        <span className={`stock-badge ${plant.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                          {plant.stock}
                        </span>
                      </td>
                      <td className="actions">
                        <button onClick={() => handleEditPlant(plant)} className="edit-btn">Edit</button>
                        <button onClick={() => handleDeletePlant(plant.id)} className="delete-btn">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Plants Tab - Paginated */}
        {activeTab === 'plants-paginated' && (
          <div className="plants-tab">
            <div className="tab-header">
              <h2>Manage Plants (Paginated)</h2>
              <button className="add-btn" onClick={openAddPlantModal}>
                + Add New Plant
              </button>
            </div>

            <div className="plants-table-container">
              <table className="plants-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPlants.map(plant => (
                    <tr key={plant.id}>
                      <td>#{plant.id}</td>
                      <td>
                        <img src={plant.imageUrl || '/placeholder-plant.svg'} alt={plant.name} className="table-image" />
                      </td>
                      <td>{plant.name}</td>
                      <td>${plant.price}</td>
                      <td>
                        <span className={`stock-badge ${plant.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                          {plant.stock}
                        </span>
                      </td>
                      <td className="actions">
                        <button onClick={() => handleEditPlant(plant)} className="edit-btn">Edit</button>
                        <button onClick={() => handleDeletePlant(plant.id)} className="delete-btn">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination Controls */}
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                  className="pagination-btn"
                >
                  ← Previous
                </button>
                <span className="page-info">
                  Page {currentPage + 1} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage === totalPages - 1}
                  className="pagination-btn"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="orders-tab">
            <h2>Manage Orders</h2>
            <div className="orders-table-container">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.orderId}>
                      <td>#{order.orderId}</td>
                      <td>{formatDate(order.orderDate)}</td>
                      <td>User #{order.userId || 'N/A'}</td>
                      <td>${order.totalAmount}</td>
                      <td>
                        <span className={`status-badge ${getStatusClass(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <div className="order-actions">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(order.orderId, e.target.value)}
                            className="status-select"
                          >
                            <option value="PENDING">Pending</option>
                            <option value="PROCESSED">Processed</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                          </select>
                          <button
                            onClick={() => handleViewOrderDetails(order.orderId)}
                            className="view-btn"
                          >
                            View Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Tab - With All Features */}
        {activeTab === 'users' && (
          <div className="users-tab">
            <h2>Manage Users</h2>
            
            {/* Statistics Cards */}
            <div className="users-stats">
              <div className="stat-card">
                <h3>Total Users</h3>
                <p className="stat-number">{users.length}</p>
              </div>
              <div className="stat-card">
                <h3>Total Customers</h3>
                <p className="stat-number">{customers.length}</p>
              </div>
              <div className="stat-card">
                <h3>Active Users</h3>
                <p className="stat-number">
                  {users.filter(u => u.enabled).length}
                </p>
              </div>
              <div className="stat-card">
                <h3>Inactive Users</h3>
                <p className="stat-number">
                  {users.filter(u => !u.enabled).length}
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="search-container">
              <input
                type="text"
                placeholder="Search by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>

            {/* Users Table */}
            <div className="users-table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.id}>
                      <td>#{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge ${user.role === 'ADMIN' ? 'role-admin' : 'role-customer'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>{formatDate(user.joinedAt)}</td>
                      <td>
                        <span className={`status-badge ${user.enabled ? 'status-active' : 'status-inactive'}`}>
                          {user.enabled ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="user-actions">
                          {/* Toggle Status Button */}
                          <button
                            onClick={() => handleToggleUserStatus(user.id)}
                            className={`toggle-btn ${user.enabled ? 'disable-btn' : 'enable-btn'}`}
                            title={user.enabled ? 'Disable User' : 'Enable User'}
                          >
                            {user.enabled ? '🔴' : '🟢'}
                          </button>

                          {/* Update Role Button (only for customers) */}
                          {user.role !== 'ADMIN' && (
                            <button
                              onClick={() => handleUpdateRoleClick(user)}
                              className="role-btn"
                              title="Change Role"
                            >
                              👤 → 👑
                            </button>
                          )}

                          {/* Delete Button (only for customers) */}
                          {user.role !== 'ADMIN' && (
                            <button
                              onClick={() => handleDeleteUserClick(user)}
                              className="delete-user-btn"
                              title="Delete User"
                            >
                              🗑️
                            </button>
                          )}

                          {user.role === 'ADMIN' && (
                            <span className="admin-badge">Admin</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredUsers.length === 0 && (
                <div className="no-results">
                  <p>No users found matching "{searchTerm}"</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Plant Modal */}
      {showPlantModal && (
        <div className="modal-overlay" onClick={() => setShowPlantModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>{editingPlant ? 'Edit Plant' : 'Add New Plant'}</h2>
            <form onSubmit={handlePlantSubmit} className="plant-form">
              <div className="form-group">
                <label>Plant Name</label>
                <input
                  type="text"
                  value={plantForm.name}
                  onChange={e => setPlantForm({...plantForm, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={plantForm.description}
                  onChange={e => setPlantForm({...plantForm, description: e.target.value})}
                  rows="3"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={plantForm.price}
                    onChange={e => setPlantForm({...plantForm, price: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={plantForm.stock}
                    onChange={e => setPlantForm({...plantForm, stock: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  value={plantForm.imageUrl}
                  onChange={e => setPlantForm({...plantForm, imageUrl: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowPlantModal(false)} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editingPlant ? 'Update' : 'Add'} Plant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content delete-modal" onClick={e => e.stopPropagation()}>
            <h2>Confirm Delete</h2>
            <div className="delete-icon">⚠️</div>
            <p className="delete-message">
              Are you sure you want to delete user <strong>{userToDelete?.name}</strong>?
            </p>
            <p className="delete-warning">
              This action cannot be undone. The user will be permanently removed from the system.
            </p>
            <div className="modal-actions">
              <button onClick={() => setShowDeleteModal(false)} className="cancel-btn">
                Cancel
              </button>
              <button onClick={handleConfirmDelete} className="delete-confirm-btn">
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Role Modal */}
      {showRoleModal && (
        <div className="modal-overlay" onClick={() => setShowRoleModal(false)}>
          <div className="modal-content role-modal" onClick={e => e.stopPropagation()}>
            <h2>Update User Role</h2>
            <div className="role-icon">👤 → 👑</div>
            <p className="role-message">
              Change role for <strong>{userToUpdateRole?.name}</strong>
            </p>
            <div className="form-group">
              <label>Select Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="role-select"
              >
                <option value="CUSTOMER">Customer</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowRoleModal(false)} className="cancel-btn">
                Cancel
              </button>
              <button onClick={handleConfirmRoleUpdate} className="submit-btn">
                Update Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowOrderModal(false)}>
          <div className="modal-content order-details-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order Details</h2>
              <button className="close-modal-btn" onClick={() => setShowOrderModal(false)}>×</button>
            </div>
            
            <div className="order-header-info">
              <div className="order-id-badge">Order #{selectedOrder.orderId}</div>
              <span className={`status-badge-large ${getStatusClass(selectedOrder.status)}`}>
                {selectedOrder.status}
              </span>
            </div>
            
            <div className="order-info-grid">
              <div className="info-card">
                <div className="info-icon">📅</div>
                <div className="info-content">
                  <span className="info-label">Order Date</span>
                  <span className="info-value">{formatDateTime(selectedOrder.orderDate)}</span>
                </div>
              </div>
              
              <div className="info-card">
                <div className="info-icon">💰</div>
                <div className="info-content">
                  <span className="info-label">Total Amount</span>
                  <span className="info-value total">${selectedOrder.totalAmount}</span>
                </div>
              </div>
              
              <div className="info-card">
                <div className="info-icon">👤</div>
                <div className="info-content">
                  <span className="info-label">Customer ID</span>
                  <span className="info-value">#{selectedOrder.userId || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="order-items-section">
              <h3>
                <span className="section-icon">📦</span>
                Order Items
              </h3>
              
              <div className="order-items-table-container">
                <table className="order-items-table">
                  <thead>
                    <tr>
                      <th>Plant</th>
                      <th>Quantity</th>
                      <th>Unit Price</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                      selectedOrder.items.map((item, index) => (
                        <tr key={index} className="order-item-row">
                          <td className="plant-name">
                            <span className="plant-icon">🌿</span>
                            {item.plantName}
                          </td>
                          <td className="quantity-cell">
                            <span className="quantity-badge">x{item.quantity}</span>
                          </td>
                          <td className="price-cell">${item.price}</td>
                          <td className="subtotal-cell">${item.subtotal}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="no-items">No items found</td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" className="total-label">Total</td>
                      <td className="total-amount">${selectedOrder.totalAmount}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="order-timeline">
              <h3>
                <span className="section-icon">⏱️</span>
                Order Timeline
              </h3>
              <div className="timeline-steps">
                <div className={`timeline-step ${selectedOrder.status !== 'CANCELLED' ? 'completed' : ''}`}>
                  <div className="step-dot"></div>
                  <div className="step-content">
                    <span className="step-name">Order Placed</span>
                    <span className="step-date">{formatDateTime(selectedOrder.orderDate)}</span>
                  </div>
                </div>
                <div className={`timeline-step ${selectedOrder.status === 'PROCESSED' || selectedOrder.status === 'SHIPPED' || selectedOrder.status === 'DELIVERED' ? 'completed' : ''}`}>
                  <div className="step-dot"></div>
                  <div className="step-content">
                    <span className="step-name">Processed</span>
                  </div>
                </div>
                <div className={`timeline-step ${selectedOrder.status === 'SHIPPED' || selectedOrder.status === 'DELIVERED' ? 'completed' : ''}`}>
                  <div className="step-dot"></div>
                  <div className="step-content">
                    <span className="step-name">Shipped</span>
                  </div>
                </div>
                <div className={`timeline-step ${selectedOrder.status === 'DELIVERED' ? 'completed' : ''}`}>
                  <div className="step-dot"></div>
                  <div className="step-content">
                    <span className="step-name">Delivered</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button onClick={() => setShowOrderModal(false)} className="close-order-btn">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;