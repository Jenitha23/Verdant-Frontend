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
      <div className="ar-page">
        <div className="ar-left">
          <div className="ar-left-content">
            <h1 className="ar-brand-title">Verdant Admin</h1>
            <p className="ar-brand-subtitle">Secure administration portal for managing your plant store.</p>
            <span className="ar-admin-badge">Admin Access</span>
          </div>
        </div>

        <div className="ar-right">
          <div className="ar-form-wrapper">
            <div className="ar-form-header">
              <h2>Invalid Reset Link</h2>
              <p>Something went wrong with your link</p>
            </div>

            <div className="ar-invalid">
              <span className="ar-invalid-icon">⚠️</span>
              <h3>Missing Reset Token</h3>
              <p>The reset link you used doesn't contain a valid token.</p>
              <p className="ar-error-help">Please request a new password reset link.</p>
            </div>

            <div className="ar-footer">
              <Link to="/admin/forgot-password" className="ar-back-link primary">
                Request New Reset Link
              </Link>
              <Link to="/admin-login" className="ar-back-link">
                ← Back to Admin Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ar-page">

      {/* ── Left: plant photo panel ── */}
      <div className="ar-left">
        <div className="ar-left-content">
          <h1 className="ar-brand-title">Verdant Admin</h1>
          <p className="ar-brand-subtitle">Secure administration portal for managing your plant store.</p>
          <span className="ar-admin-badge">Admin Access</span>
        </div>
      </div>

      {/* ── Right: form panel ── */}
      <div className="ar-right">
        <div className="ar-form-wrapper">
          <div className="ar-form-header">
            <h2>Create New Password</h2>
            <p>Enter your new admin password below</p>
            {token && (
              <div className="ar-token-indicator">
                <span>✓</span> Valid reset token detected
              </div>
            )}
          </div>

          {error && (
            <div className="ar-error">
              <span>⚠️</span> {error}
            </div>
          )}

          {successMessage && (
            <div className="ar-success">
              <span>✓ {successMessage}</span>
              <p className="ar-redirect">Redirecting to admin login...</p>
            </div>
          )}

          {!success && (
            <div className="ar-form">
              <div className="ar-field">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  placeholder="Enter new password"
                  disabled={loading}
                  minLength="6"
                />
                <small className="ar-input-hint">Minimum 6 characters</small>
              </div>

              <div className="ar-field">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm new password"
                  disabled={loading}
                />
              </div>

              <button
                className="ar-submit-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <><span className="ar-spin">🌱</span> Resetting...</>
                ) : (
                  'Reset Admin Password'
                )}
              </button>
            </div>
          )}

          <div className="ar-footer">
            <Link to="/admin-login" className="ar-back-link">
              ← Back to Admin Login
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminResetPassword;