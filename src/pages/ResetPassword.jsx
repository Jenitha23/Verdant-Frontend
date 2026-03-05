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
      <div className="reset-page">
        <div className="reset-left">
          <div className="reset-left-content">
            <h1 className="reset-brand-title">Welcome to Verdant</h1>
            <p className="reset-brand-subtitle">
              Your curated destination for beautiful, sustainably grown houseplants.
            </p>
          </div>
        </div>

        <div className="reset-right">
          <div className="reset-form-wrapper">
            <div className="reset-form-header">
              <h2>Invalid Reset Link</h2>
              <p>Something went wrong with your link</p>
            </div>

            <div className="reset-invalid">
              <span className="reset-invalid-icon">⚠️</span>
              <h3>Missing Reset Token</h3>
              <p>The reset link you used doesn't contain a valid token.</p>
              <p className="error-help">Please request a new password reset link.</p>
            </div>

            <div className="reset-footer">
              <Link to="/forgot-password" className="reset-back-link primary">
                Request New Reset Link
              </Link>
              <Link to="/login" className="reset-back-link">
                ← Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-page">

      {/* ── Left: plant photo panel ── */}
      <div className="reset-left">
        <div className="reset-left-content">
          <h1 className="reset-brand-title">Welcome to Verdant</h1>
          <p className="reset-brand-subtitle">
            Your curated destination for beautiful, sustainably grown houseplants. Sign in to track
            orders, save favorites, and join our growing community.
          </p>
        </div>
      </div>

      {/* ── Right: form panel ── */}
      <div className="reset-right">
        <div className="reset-form-wrapper">
          <div className="reset-form-header">
            <h2>Create New Password</h2>
            <p>Enter your new password below</p>
          </div>

          {error && (
            <div className="reset-error">
              <span>⚠️</span> {error}
            </div>
          )}

          {successMessage && (
            <div className="reset-success">
              <span>✓ {successMessage}</span>
              <p className="redirect-message">Redirecting to login...</p>
            </div>
          )}

          {!success && (
            <div className="reset-form">
              <div className="reset-field">
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
                <small className="reset-input-hint">Minimum 6 characters</small>
              </div>

              <div className="reset-field">
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
                className="reset-submit-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <><span>🌱</span> Resetting...</>
                ) : (
                  'Reset Password'
                )}
              </button>
            </div>
          )}

          <div className="reset-footer">
            <Link to="/login" className="reset-back-link">
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ResetPassword;