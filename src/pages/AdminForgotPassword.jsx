import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import './AdminForgotPassword.css';

const AdminForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Sending admin forgot password request for:', email);
      const response = await authService.adminForgotPassword(email);
      console.log('Admin forgot password response:', response);
      
      if (response.success) {
        setSuccess(true);
      } else {
        setError(response.message || 'Failed to send reset email');
      }
    } catch (err) {
      console.error('Admin forgot password error:', err);
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="admin-forgot-password-page">
        <div className="admin-forgot-password-container grow-up">
          <div className="admin-forgot-password-header">
            <Link to="/" className="admin-forgot-password-logo">
              <span className="logo-leaf">🌿</span>
              <span>Verdant Admin</span>
            </Link>
            <h1>Check Your Email</h1>
          </div>

          <div className="success-message-large">
            <h2>Reset Link Sent!</h2>
            <p>
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <div className="email-instructions">
              <p>Click the link in the email to reset your admin password.</p>
            </div>

            <div className="success-actions">
              <Link to="/admin-login" className="back-to-login-btn">
                Back to Admin Login
              </Link>
              <button 
                onClick={() => {
                  setSuccess(false);
                  setEmail('');
                }} 
                className="try-again-btn"
              >
                Try Again
              </button>
            </div>
          </div>

          <div className="admin-forgot-password-footer">
            <Link to="/admin-login" className="back-link">
              ← Back to Admin Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-forgot-password-page">
      <div className="admin-forgot-password-container grow-up">
        <div className="admin-forgot-password-header">
          <Link to="/" className="admin-forgot-password-logo">
            <span className="logo-leaf">🌿</span>
            <span>Verdant Admin</span>
          </Link>
          <h1>Admin Reset Password</h1>
          <p>Enter your admin email to receive reset instructions</p>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-forgot-password-form">
          <div className="form-group">
            <label htmlFor="email">Admin Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your admin email"
              className="form-input"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="admin-forgot-password-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="btn-loader">🌱</span>
                Sending...
              </>
            ) : (
              'Send Reset Instructions'
            )}
          </button>
        </form>

        <div className="admin-forgot-password-footer">
          <Link to="/admin-login" className="back-link">
            ← Back to Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminForgotPassword;