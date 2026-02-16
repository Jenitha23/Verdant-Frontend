import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';
import './AdminResetPassword.css';

const AdminResetPassword = () => {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extract token from URL query parameters
    const params = new URLSearchParams(location.search);
    const urlToken = params.get('token');
    
    if (urlToken) {
      setToken(urlToken);
      console.log('Admin reset token found in URL:', urlToken);
      setTokenValid(true);
    } else {
      setTokenValid(false);
      setError('No reset token provided. Please use the link from your email.');
    }
  }, [location]);

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
    setSuccessMessage('');

    // Validate passwords
    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!token) {
      setError('Invalid reset token');
      setLoading(false);
      return;
    }

    try {
      console.log('Resetting admin password with token:', token);
      const response = await authService.adminResetPassword(token, formData.newPassword);
      console.log('Admin reset password response:', response);
      
      if (response.success) {
        setSuccessMessage(response.message || 'Password reset successful!');
        setSuccess(true);
        
        // Redirect to admin login after 3 seconds
        setTimeout(() => {
          navigate('/admin-login');
        }, 3000);
      } else {
        setError(response.message || 'Failed to reset password');
      }
    } catch (err) {
      console.error('Admin reset password error:', err);
      setError(err.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  // If no token in URL, show error
  if (!tokenValid) {
    return (
      <div className="admin-reset-password-page">
        <div className="admin-reset-password-container">
          <div className="admin-reset-password-header">
            <Link to="/" className="admin-reset-password-logo">
              <span className="logo-leaf">🌿</span>
              <span>Verdant Admin</span>
            </Link>
            <h1>Invalid Reset Link</h1>
          </div>
          
          <div className="error-message-large">
            <h2>Missing Reset Token</h2>
            <p>The reset link you used doesn't contain a valid token.</p>
            <p className="error-help">Please request a new password reset link.</p>
          </div>

          <div className="admin-reset-password-footer">
            <Link to="/admin/forgot-password" className="back-link">
              Request New Reset Link
            </Link>
            <Link to="/admin-login" className="back-link" style={{ marginTop: 'var(--spacing-sm)' }}>
              ← Back to Admin Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-reset-password-page">
      <div className="admin-reset-password-container grow-up">
        <div className="admin-reset-password-header">
          <Link to="/" className="admin-reset-password-logo">
            <span className="logo-leaf">🌿</span>
            <span>Verdant Admin</span>
          </Link>
          <h1>Create New Admin Password</h1>
          <p>Enter your new password below</p>
          {token && (
            <div className="token-indicator">
              <span className="token-indicator-icon">✓</span>
              Valid reset token detected
            </div>
          )}
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {successMessage && (
          <div className="success-message">
            <span className="success-icon">✓</span>
            {successMessage}
            <p className="redirect-message">Redirecting to admin login...</p>
          </div>
        )}

        {!success ? (
          <form onSubmit={handleSubmit} className="admin-reset-password-form">
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                placeholder="Enter new password"
                className="form-input"
                disabled={loading}
                minLength="6"
              />
              <small className="input-hint">Minimum 6 characters</small>
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
                placeholder="Confirm new password"
                className="form-input"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="admin-reset-password-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="btn-loader">🌱</span>
                  Resetting...
                </>
              ) : (
                'Reset Admin Password'
              )}
            </button>
          </form>
        ) : null}

        <div className="admin-reset-password-footer">
          <Link to="/admin-login" className="back-link">
            ← Back to Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminResetPassword;