import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const user = authService.getCurrentUserFromStorage();
  const isAdmin = authService.isAdmin();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-leaf">🌿</span>
          <span className="logo-text">Verdant</span>
        </Link>

        <div className="nav-toggle" onClick={toggleMenu}>
          <span className={`hamburger ${isOpen ? 'active' : ''}`}></span>
        </div>

        <div className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <ul className="nav-links">
            <li>
              <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
                Home
              </Link>
            </li>
            
            {user ? (
              <>
                {!isAdmin && (
                  <>
                    <li>
                      <Link to="/cart" className={location.pathname === '/cart' ? 'active' : ''}>
                        Cart
                      </Link>
                    </li>
                    <li>
                      <Link to="/orders" className={location.pathname === '/orders' ? 'active' : ''}>
                        My Orders
                      </Link>
                    </li>
                  </>
                )}
                
                {isAdmin && (
                  <li>
                    <Link to="/admin/dashboard" className={location.pathname === '/admin/dashboard' ? 'active' : ''}>
                      Dashboard
                    </Link>
                  </li>
                )}
                
                <li className="user-menu">
                  <span className="user-greeting">
                    <span className="user-icon">👤</span>
                    {user.name || 'User'}
                  </span>
                  <button onClick={handleLogout} className="logout-btn">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className={location.pathname === '/signup' ? 'active' : ''}>
                    Sign Up
                  </Link>
                </li>
                {/* Admin login link removed from navigation */}
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;