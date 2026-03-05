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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

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
      const response = await authService.signup({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      if (response.success) {
        try {
          const loginResponse = await authService.login({
            email: formData.email,
            password: formData.password
          });
          navigate(loginResponse.success ? '/' : '/login');
        } catch {
          navigate('/login');
        }
      } else {
        setError(response.message || 'Signup failed');
      }
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const EyeIcon = ({ open }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      {open ? (
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
          <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
          <line x1="1" y1="1" x2="23" y2="23"/>
        </>
      ) : (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </>
      )}
    </svg>
  );

  return (
    <div className="auth-page">

      {/* ── Left: plant photo panel ── */}
      <div className="auth-left">
        <div className="auth-left-content">

          <h1 className="auth-brand-title">Welcome to Verdant</h1>
          <p className="auth-brand-subtitle">
            Your curated destination for beautiful, sustainably grown houseplants. Sign in to track
            orders, save favorites, and join our growing community.
          </p>
        </div>
      </div>

      {/* ── Right: form panel ── */}
      <div className="auth-right">
        <div className="auth-form-wrapper">
          <div className="auth-form-header">
            <h2>Create an account</h2>
            <p>Start your plant journey today</p>
          </div>

          {error && (
            <div className="auth-error">
              <span>⚠️</span> {error}
            </div>
          )}

          <div className="auth-form">
            <div className="form-field">
              <label htmlFor="name">Full Name</label>
              <input
                type="text" id="name" name="name"
                value={formData.name} onChange={handleChange}
                required placeholder="Jane Doe" disabled={loading}
              />
            </div>

            <div className="form-field">
              <label htmlFor="email">Email</label>
              <input
                type="email" id="email" name="email"
                value={formData.email} onChange={handleChange}
                required placeholder="you@example.com" disabled={loading}
              />
            </div>

            <div className="form-field">
              <label htmlFor="password">Password</label>
              <div className="input-with-icon">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password" name="password"
                  value={formData.password} onChange={handleChange}
                  required placeholder="••••••••" disabled={loading} minLength="6"
                />
                <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-with-icon">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  id="confirmPassword" name="confirmPassword"
                  value={formData.confirmPassword} onChange={handleChange}
                  required placeholder="••••••••" disabled={loading}
                />
                <button type="button" className="toggle-password" onClick={() => setShowConfirm(!showConfirm)}>
                  <EyeIcon open={showConfirm} />
                </button>
              </div>
            </div>

            <button className="auth-submit-btn" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>

          <div className="auth-form-footer">
            <p className="auth-switch">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>

          <div className="auth-back">
            <Link to="/">← Back to store</Link>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Signup;