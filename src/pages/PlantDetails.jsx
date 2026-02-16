import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import plantService from '../services/plantService';
import cartService from '../services/cartService';
import authService from '../services/authService';
import './PlantDetails.css';

const PlantDetails = () => {
  const { id } = useParams();
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlantDetails();
  }, [id]);

  const fetchPlantDetails = async () => {
    try {
      const data = await plantService.getPlantById(id);
      setPlant(data);
    } catch (err) {
      setError('Plant not found');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (plant?.stock || 1)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    if (authService.isAdmin()) {
      alert('Admins cannot add items to cart');
      return;
    }

    setAddingToCart(true);
    try {
      await cartService.addToCart(plant.id, quantity);
      alert(`${quantity} x ${plant.name} added to cart!`);
    } catch (err) {
      alert(err.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="plant-details-loading">
        <div className="leaf-loader">🌿</div>
        <p>Loading plant details...</p>
      </div>
    );
  }

  if (error || !plant) {
    return (
      <div className="plant-details-error">
        <h2>🌱 Plant Not Found</h2>
        <p>The plant you're looking for doesn't exist or has been removed.</p>
        <button onClick={() => navigate('/')} className="back-home-btn">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="plant-details-page">
      <div className="plant-details-container">
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Back
        </button>

        <div className="plant-details-content">
          <div className="plant-image-section">
            <img 
              src={plant.imageUrl || '/placeholder-plant.jpg'} 
              alt={plant.name}
              className="plant-detail-image bloom"
            />
            {plant.stock <= 5 && plant.stock > 0 && (
              <span className="stock-badge low-stock">Only {plant.stock} left!</span>
            )}
            {plant.stock === 0 && (
              <span className="stock-badge out-of-stock">Out of Stock</span>
            )}
          </div>

          <div className="plant-info-section grow-up">
            <h1 className="plant-detail-name">{plant.name}</h1>
            
            <div className="plant-meta">
              <span className="plant-detail-price">${plant.price}</span>
              <span className="plant-detail-stock">
                {plant.stock > 0 ? `In Stock (${plant.stock})` : 'Out of Stock'}
              </span>
            </div>

            <div className="plant-detail-description">
              <h3>About this plant</h3>
              <p>{plant.description || 'No description available.'}</p>
            </div>

            {plant.stock > 0 && (
              <div className="plant-purchase-section">
                <div className="quantity-selector">
                  <button 
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="quantity-btn"
                  >
                    −
                  </button>
                  <span className="quantity-display">{quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= plant.stock}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>

                <button
                  className="add-to-cart-detail-btn"
                  onClick={handleAddToCart}
                  disabled={addingToCart || plant.stock === 0}
                >
                  {addingToCart ? (
                    <>
                      <span className="btn-loader">🌱</span>
                      Adding...
                    </>
                  ) : (
                    <>
                      <span className="btn-icon">🛒</span>
                      Add to Cart
                    </>
                  )}
                </button>
              </div>
            )}

            <div className="plant-care-tips">
              <h3>Care Tips</h3>
              <ul>
                <li>🌞 Prefers bright, indirect sunlight</li>
                <li>💧 Water when top inch of soil feels dry</li>
                <li>🌡️ Thrives in room temperature (65-75°F)</li>
                <li>🌱 Fertilize monthly during growing season</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantDetails;