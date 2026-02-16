import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PlantCard from '../components/PlantCard';
import plantService from '../services/plantService';
import cartService from '../services/cartService';
import authService from '../services/authService';
import './Home.css';

const Home = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlants();
    console.log('Auth status:', authService.isAuthenticated());
    console.log('Current user:', authService.getCurrentUserFromStorage());
  }, []);

  const fetchPlants = async () => {
    try {
      console.log('Fetching plants...');
      const data = await plantService.getAllPlants();
      console.log('Plants fetched:', data);
      setPlants(data);
    } catch (err) {
      console.error('Failed to load plants:', err);
      setError('Failed to load plants. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (plant) => {
    console.log('Add to cart clicked for plant:', plant);
    
    if (!authService.isAuthenticated()) {
      console.log('User not authenticated, redirecting to login');
      navigate('/login');
      return;
    }

    if (authService.isAdmin()) {
      alert('Admins cannot add items to cart');
      return;
    }

    setAddingToCart(plant.id);
    try {
      console.log('Sending add to cart request:', { plantId: plant.id, quantity: 1 });
      const response = await cartService.addToCart(plant.id, 1);
      console.log('Add to cart response:', response);
      alert(`${plant.name} added to cart!`);
    } catch (err) {
      console.error('Add to cart error details:', err);
      
      if (err.customerId) {
        alert('Please login again to add items to cart');
        authService.logout();
        navigate('/login');
      } else {
        alert(err.message || 'Failed to add to cart');
      }
    } finally {
      setAddingToCart(null);
    }
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="home-loading">
        <div className="leaf-loader">🌿</div>
        <p>Loading our green collection...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-error">
        <p>{error}</p>
        <button onClick={fetchPlants} className="retry-btn">Try Again</button>
      </div>
    );
  }

  return (
    <div className="home">
      {/* Hero Section - Exactly as in screenshot */}
      <section className="hero-section">
        <div className="hero-background">
          <img src="/hero-bg.jpg" alt="Nature background" className="hero-bg-image" />
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <h1 className="hero-title">ROOTED IN NATURE</h1>
          <p className="hero-subtitle">Bring Life Into Every Corner</p>
          <p className="hero-description">
            Discover handpicked plants that purify your air, calm your mind,<br />
            and transform your space into a living sanctuary.
          </p>
          <div className="hero-buttons">
            <button onClick={() => scrollToSection('shop')} className="hero-btn primary">
              Shop Plants <span className="btn-arrow">→</span>
            </button>
            <button onClick={() => scrollToSection('about')} className="hero-btn secondary">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Shop Section */}
      <section id="shop" className="shop-section">
        <div className="section-header">
          <h2 className="section-title">Our Collection</h2>
          <p className="section-subtitle">Discover the perfect plant for your space</p>
        </div>

        <div className="plants-grid">
          {plants.map((plant) => (
            <PlantCard
              key={plant.id}
              plant={plant}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="categories-section">
        <div className="section-header">
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">Find your perfect plant match</p>
        </div>
        <div className="categories-grid">
          <div className="category-card">
            <div className="category-icon">🌿</div>
            <h3>Air Purifying</h3>
            <p>Snake Plant, Peace Lily, Spider Plant</p>
          </div>
          <div className="category-card">
            <div className="category-icon">🌱</div>
            <h3>Low Maintenance</h3>
            <p>Succulents, ZZ Plant, Pothos</p>
          </div>
          <div className="category-card">
            <div className="category-icon">🌴</div>
            <h3>Indoor Trees</h3>
            <p>Fiddle Leaf Fig, Rubber Plant, Money Tree</p>
          </div>
          <div className="category-card">
            <div className="category-icon">🌸</div>
            <h3>Flowering</h3>
            <p>Orchids, Peace Lily, African Violets</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="about-container">
          <div className="about-content">
            <h2 className="about-title">Our Story</h2>
            <p className="about-text">
              At Verdant, we believe that plants are more than just decoration—they're living beings that bring joy, 
              peace, and vitality to our homes and workplaces. Founded in 2020, our mission is to make it easy for 
              everyone to experience the transformative power of plants.
            </p>
            <p className="about-text">
              We personally visit each nursery to handpick the healthiest, most beautiful plants. Every plant comes 
              with detailed care instructions and our 30-day happiness guarantee. If your plant doesn't thrive, 
              we'll replace it or refund your money.
            </p>
            <div className="about-stats">
              <div className="stat">
                <span className="stat-number">50+</span>
                <span className="stat-label">Plant Varieties</span>
              </div>
              <div className="stat">
                <span className="stat-number">1000+</span>
                <span className="stat-label">Happy Customers</span>
              </div>
              <div className="stat">
                <span className="stat-number">24h</span>
                <span className="stat-label">Fast Delivery</span>
              </div>
            </div>
          </div>
          <div className="about-image">
            <img src="/about-garden.jpg" alt="Our nursery" className="about-img" />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="contact-container">
          <div className="contact-info">
            <h2 className="contact-title">Get in Touch</h2>
            <p className="contact-text">
              Have questions about plant care? Need help choosing the perfect plant? 
              We're here to help!
            </p>
            <div className="contact-details">
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <span>hello@verdant.com</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <span>123 Green Street, Plant City, PC 12345</span>
              </div>
            </div>
          </div>
          <div className="contact-form">
            <h3>Send us a message</h3>
            <form className="contact-form-fields">
              <input type="text" placeholder="Your Name" className="contact-input" />
              <input type="email" placeholder="Your Email" className="contact-input" />
              <textarea placeholder="Your Message" rows="4" className="contact-textarea"></textarea>
              <button type="button" className="contact-submit">Send Message</button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-logo">
            <span className="logo-leaf">🌿</span>
            <span className="logo-text">Verdant</span>
          </div>
          <p className="footer-text">Bringing nature home, one plant at a time.</p>
          <div className="footer-links">
            <a href="#" className="footer-link">Privacy Policy</a>
            <a href="#" className="footer-link">Terms of Service</a>
            <a href="#" className="footer-link">Shipping Info</a>
          </div>
          <p className="copyright">© 2026 Verdant. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;