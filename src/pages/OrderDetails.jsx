import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import orderService from '../services/orderService';
import authService from '../services/authService';
import './OrderDetails.css';

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    fetchOrderDetails();
  }, [orderId, navigate]);

  const fetchOrderDetails = async () => {
    try {
      const data = await orderService.getOrderById(orderId);
      setOrder(data);
    } catch (err) {
      setError('Order not found');
    } finally {
      setLoading(false);
    }
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="order-details-loading">
        <div className="leaf-loader">🌿</div>
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-details-error">
        <h2>📦 Order Not Found</h2>
        <p>The order you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/orders')} className="back-to-orders-btn">
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="order-details-page">
      <div className="order-details-container">
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Back to Orders
        </button>

        <div className="order-details-card grow-up">
          <div className="order-header">
            <h1 className="order-number">Order #{order.orderId}</h1>
            <span className={`order-status ${getStatusClass(order.status)}`}>
              {order.status}
            </span>
          </div>

          <div className="order-date">
            Placed on {formatDate(order.orderDate)}
          </div>

          <div className="order-items">
            <h2>Order Items</h2>
            {order.items?.map((item, index) => (
              <div key={index} className="order-item">
                <div className="item-info">
                  <span className="item-name">{item.plantName}</span>
                  <span className="item-quantity">x{item.quantity}</span>
                </div>
                <div className="item-prices">
                  <span className="item-price">${item.price} each</span>
                  <span className="item-subtotal">${item.subtotal}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="order-summary">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${order.totalAmount}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span className="free">Free</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${order.totalAmount}</span>
            </div>
          </div>

          <div className="order-timeline">
            <h3>Order Timeline</h3>
            <div className="timeline-steps">
              <div className={`timeline-step ${order.status !== 'CANCELLED' ? 'completed' : ''}`}>
                <div className="step-dot"></div>
                <div className="step-content">
                  <span className="step-name">Order Placed</span>
                  <span className="step-date">{formatDate(order.orderDate)}</span>
                </div>
              </div>
              <div className={`timeline-step ${order.status === 'PROCESSED' || order.status === 'SHIPPED' || order.status === 'DELIVERED' ? 'completed' : ''}`}>
                <div className="step-dot"></div>
                <div className="step-content">
                  <span className="step-name">Processed</span>
                </div>
              </div>
              <div className={`timeline-step ${order.status === 'SHIPPED' || order.status === 'DELIVERED' ? 'completed' : ''}`}>
                <div className="step-dot"></div>
                <div className="step-content">
                  <span className="step-name">Shipped</span>
                </div>
              </div>
              <div className={`timeline-step ${order.status === 'DELIVERED' ? 'completed' : ''}`}>
                <div className="step-dot"></div>
                <div className="step-content">
                  <span className="step-name">Delivered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;