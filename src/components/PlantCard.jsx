import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PlantCard.css';

const PlantCard = ({ plant, onAddToCart }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/plants/${plant.id}`);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    try {
      await onAddToCart(plant);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  return (
    <div className="plant-card bloom" onClick={handleClick}>
      <div className="plant-card-image-container">
        <img 
          src={plant.imageUrl || '/placeholder-plant.svg'} 
          alt={plant.name}
          className="plant-card-image sway"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/placeholder-plant.svg';
          }}
        />
        {plant.stock <= 5 && plant.stock > 0 && (
          <span className="stock-badge low-stock">Low Stock</span>
        )}
        {plant.stock === 0 && (
          <span className="stock-badge out-of-stock">Out of Stock</span>
        )}
      </div>
      
      <div className="plant-card-content">
        <h3 className="plant-card-name">{plant.name}</h3>
        <p className="plant-card-description">{plant.description}</p>
        
        <div className="plant-card-footer">
          <span className="plant-card-price">${plant.price}</span>
          <button 
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={plant.stock === 0}
          >
            <span className="btn-icon">🛒</span>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlantCard;