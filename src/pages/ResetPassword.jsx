import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';
import './ResetPassword.css';

const ResetPassword = () => {
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
      console.log('Reset token found in URL:', urlToken);
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
      console.log('Resetting password with token:', token);
      const response = await authService.resetPassword(token, formData.newPassword);
      console.log('Reset password response:', response);
      
      if (response.success) {
        setSuccessMessage(response.message || 'Password reset successful!');
        setSuccess(true);
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(response.message || 'Failed to reset password');
      }
    } catch (err) {
      console.error('Reset password error:', err);
      setError(err.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  // If no token in URL, show error
  if (!tokenValid) {
    return (
      <div className="reset-password-page">
        <div className="reset-password-container">
          <div className="reset-password-header">
            <Link to="/" className="reset-password-logo">
              <span className="logo-leaf">🌿</span>
              <span>Verdant</span>
            </Link>
            <h1>Invalid Reset Link</h1>
          </div>
          
          <div className="error-message-large">
            <div className="error-icon-large">⚠️</div>
            <h2>Missing Reset Token</h2>
            <p>The reset link you used doesn't contain a valid token.</p>
            <p className="error-help">Please request a new password reset link.</p>
          </div>

          <div className="reset-password-footer">
            <Link to="/forgot-password" className="back-link">
              Request New Reset Link
            </Link>
            <Link to="/login" className="back-link" style={{ marginTop: 'var(--spacing-sm)' }}>
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-page">
      <div className="reset-password-container grow-up">
        <div className="reset-password-header">
          <Link to="/" className="reset-password-logo">
            <span className="logo-leaf">🌿</span>
            <span>Verdant</span>
          </Link>
          <h1>Create New Password</h1>
          <p>Enter your new password below</p>
          
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
            <p className="redirect-message">Redirecting to login...</p>
          </div>
        )}

        {!success ? (
          <form onSubmit={handleSubmit} className="reset-password-form">
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
              className="reset-password-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="btn-loader">🌱</span>
                  Resetting...
                </>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
        ) : null}

        <div className="reset-password-footer">
          <Link to="/login" className="back-link">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;