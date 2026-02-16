import React from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderCard.css';

const OrderCard = ({ order }) => {
  const navigate = useNavigate();

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
      day: 'numeric'
    });
  };

  return (
    <div className="order-card grow-up" onClick={() => navigate(`/orders/${order.orderId}`)}>
      <div className="order-card-header">
        <div className="order-info">
          <h3 className="order-id">Order #{order.orderId}</h3>
          <span className="order-date">{formatDate(order.orderDate)}</span>
        </div>
        <span className={`order-status ${getStatusClass(order.status)}`}>
          {order.status}
        </span>
      </div>

      <div className="order-card-body">
        <div className="order-items-preview">
          {order.items?.slice(0, 3).map((item, index) => (
            <div key={index} className="order-item-preview">
              <span className="item-name">{item.plantName}</span>
              <span className="item-qty">x{item.quantity}</span>
            </div>
          ))}
          {order.items?.length > 3 && (
            <div className="more-items">+{order.items.length - 3} more</div>
          )}
        </div>
      </div>

      <div className="order-card-footer">
        <span className="order-total-label">Total Amount:</span>
        <span className="order-total">${order.totalAmount}</span>
      </div>
    </div>
  );
};

export default OrderCard;