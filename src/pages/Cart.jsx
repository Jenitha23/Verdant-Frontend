import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CartItem from '../components/CartItem';
import cartService from '../services/cartService';
import orderService from '../services/orderService';
import authService from '../services/authService';
import './Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    fetchCartItems();
  }, [navigate]);

  const fetchCartItems = async () => {
    try {
      const items = await cartService.getCartItems();
      setCartItems(items);
    } catch (err) {
      setError('Failed to load cart items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromCart = async (cartItemId) => {
    try {
      await cartService.removeFromCart(cartItemId);
      setCartItems(cartItems.filter(item => item.cartItemId !== cartItemId));
    } catch (err) {
      alert(err.message || 'Failed to remove item');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + parseFloat(item.totalPrice || 0), 0).toFixed(2);
  };

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      await orderService.placeOrder();
      alert('Order placed successfully!');
      navigate('/orders');
    } catch (err) {
      alert(err.message || 'Checkout failed');
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="cart-loading">
        <div className="leaf-loader">🌿</div>
        <p>Loading your cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-error">
        <p>{error}</p>
        <button onClick={fetchCartItems} className="retry-btn">Try Again</button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1 className="cart-title">Your Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any plants yet</p>
            <button onClick={() => navigate('/')} className="continue-shopping-btn">
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {cartItems.map((item) => (
                <CartItem
                  key={item.cartItemId}
                  item={item}
                  onRemove={handleRemoveFromCart}
                />
              ))}
            </div>

            <div className="cart-summary">
              <h2>Order Summary</h2>
              
              <div className="summary-details">
                <div className="summary-row">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>${calculateTotal()}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span className="free-shipping">Free</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>${calculateTotal()}</span>
                </div>
              </div>

              <button
                className="checkout-btn"
                onClick={handleCheckout}
                disabled={checkoutLoading}
              >
                {checkoutLoading ? (
                  <>
                    <span className="checkout-loader">🌱</span>
                    Processing...
                  </>
                ) : (
                  'Proceed to Checkout'
                )}
              </button>

              <button
                onClick={() => navigate('/')}
                className="continue-shopping-link"
              >
                ← Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;