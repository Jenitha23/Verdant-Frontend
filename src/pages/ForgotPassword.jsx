import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import './ForgotPassword.css';

const ForgotPassword = () => {
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
      console.log('Sending forgot password request for:', email);
      const response = await authService.forgotPassword(email);
      console.log('Forgot password response:', response);

      if (response.success) {
        setSuccess(true);
      } else {
        setError(response.message || 'Failed to send reset email');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Success state ──
  if (success) {
    return (
      <div className="forgot-page">
        <div className="forgot-left">
          <div className="forgot-left-content">
            <h1 className="forgot-brand-title">Welcome to Verdant</h1>
            <p className="forgot-brand-subtitle">
              Your curated destination for beautiful, sustainably grown houseplants. Sign in to track
              orders, save favorites, and join our growing community.
            </p>
          </div>
        </div>

        <div className="forgot-right">
          <div className="forgot-form-wrapper">
            <div className="forgot-form-header">
              <h2>Check Your Email</h2>
              <p>We've sent reset instructions to your inbox</p>
            </div>

            <div className="forgot-success">
              <h3>Reset Link Sent!</h3>
              <p>
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <div className="forgot-success-box">
                Click the link in the email to reset your password.
              </div>

              <div className="forgot-success-actions">
                <Link to="/login" className="forgot-login-btn">
                  Back to Login
                </Link>
                <button
                  onClick={() => {
                    setSuccess(false);
                    setEmail('');
                  }}
                  className="forgot-retry-btn"
                >
                  Try Again
                </button>
              </div>
            </div>

            <div className="forgot-footer">
              <Link to="/login" className="forgot-back-link">
                ← Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Default state ──
  return (
    <div className="forgot-page">

      {/* ── Left: plant photo panel ── */}
      <div className="forgot-left">
        <div className="forgot-left-content">
          <h1 className="forgot-brand-title">Welcome to Verdant</h1>
          <p className="forgot-brand-subtitle">
            Your curated destination for beautiful, sustainably grown houseplants. Sign in to track
            orders, save favorites, and join our growing community.
          </p>
        </div>
      </div>

      {/* ── Right: form panel ── */}
      <div className="forgot-right">
        <div className="forgot-form-wrapper">
          <div className="forgot-form-header">
            <h2>Reset Password</h2>
            <p>Enter your email to receive reset instructions</p>
          </div>

          {error && (
            <div className="forgot-error">
              <span>⚠️</span> {error}
            </div>
          )}

          <div className="forgot-form">
            <div className="forgot-field">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your registered email"
                disabled={loading}
              />
            </div>

            <button
              className="forgot-submit-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <><span>🌱</span> Sending...</>
              ) : (
                'Send Reset Instructions'
              )}
            </button>
          </div>

          <div className="forgot-footer">
            <Link to="/login" className="forgot-back-link">
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ForgotPassword;