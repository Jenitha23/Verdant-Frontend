import React from 'react';
import './CartItem.css';

const CartItem = ({ item, onRemove }) => {
  return (
    <div className="cart-item grow-up">
      <div className="cart-item-image">
        <img src={item.imageUrl || '/placeholder-plant.jpg'} alt={item.plantName} />
      </div>
      
      <div className="cart-item-details">
        <h3 className="cart-item-name">{item.plantName}</h3>
        <div className="cart-item-info">
          <span className="cart-item-price">${item.price}</span>
          <span className="cart-item-quantity">Qty: {item.quantity}</span>
        </div>
        <div className="cart-item-subtotal">
          Subtotal: <strong>${item.totalPrice}</strong>
        </div>
      </div>
      
      <button className="remove-btn" onClick={() => onRemove(item.cartItemId)}>
        <span className="remove-icon">✕</span>
      </button>
    </div>
  );
};

export default CartItem;