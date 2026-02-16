import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      console.log('Sending signup request for:', formData.email);
      const response = await authService.signup({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      console.log('Signup response:', response);
      
      if (response.success) {
        // Auto-login after successful signup
        try {
          const loginResponse = await authService.login({
            email: formData.email,
            password: formData.password
          });
          
          if (loginResponse.success) {
            // Redirect to home page
            navigate('/');
          } else {
            // If auto-login fails, go to login page
            navigate('/login');
          }
        } catch (loginErr) {
          console.error('Auto-login error:', loginErr);
          navigate('/login');
        }
      } else {
        setError(response.message || 'Signup failed');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container grow-up">
        <div className="signup-header">
          <Link to="/" className="signup-logo">
            <span className="logo-leaf">🌿</span>
            <span>Verdant</span>
          </Link>
          <h1>Join the Green Family</h1>
          <p>Create your account and start your plant journey</p>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
              className="form-input"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="form-input"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a password"
              className="form-input"
              disabled={loading}
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
              className="form-input"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="signup-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="btn-loader">🌱</span>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="signup-footer">
          <p className="login-link">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>

        <div className="signup-decoration">
          <div className="leaf"></div>
          <div className="leaf"></div>
          <div className="leaf"></div>
        </div>
      </div>
    </div>
  );
};

export default Signup;