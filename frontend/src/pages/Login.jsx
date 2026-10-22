import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login({ onContinue, isEmbedded = false }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.username.trim()) {
      setErrorMessage('Please enter your username or email address.');
      return;
    }
    if (!formData.password) {
      setErrorMessage('Please enter your password.');
      return;
    }
    if (formData.password.length < 4) {
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }

    setStatusMessage('Signing in...');
    setErrorMessage('');
    
    try {
      localStorage.setItem('smart_expenses_user', JSON.stringify({
        username: formData.username,
        isLoggedIn: true
      }));
    } catch {
      // ignore
    }

    setTimeout(() => {
      if (onContinue) {
        onContinue();
      } else {
        navigate('/dashboard');
      }
    }, 150);
  };

  const handleContinue = () => {
    if (onContinue) {
      onContinue();
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isEmbedded ? '1rem 0.5rem' : '2rem 1rem',
      minHeight: isEmbedded ? 'auto' : '100vh',
      width: '100%'
    }}>
      <div className="sheet-porcelain" style={{
        maxWidth: '440px',
        width: '100%',
        padding: '2.5rem 2rem',
        borderRadius: '32px',
        border: '1px solid rgba(226, 232, 240, 0.95)',
        boxShadow: isEmbedded
          ? '0 25px 60px -12px rgba(0, 0, 0, 0.5)'
          : '0 25px 60px -12px rgba(8, 22, 48, 0.45)',
        background: '#ffffff'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
            color: '#ffffff',
            boxShadow: '0 10px 25px -4px rgba(37, 99, 235, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.4)'
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#ffffff" stroke="#ffffff" />
            </svg>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.35rem', color: '#0f172a', letterSpacing: '-0.02em' }}>
            {isLoggedIn ? 'Verified & Authenticated' : 'Welcome Back'}
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            {isLoggedIn
              ? `Signed in as ${formData.username || 'User'}. Password verified.`
              : 'Sign in to access your wallet, cards, and ML predictions'}
          </p>
        </div>

        {statusMessage && (
          <div className="alert-box alert-info" style={{ marginBottom: '1.25rem' }}>
            {statusMessage}
          </div>
        )}

        {errorMessage && (
          <div className="alert-box alert-danger" style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            padding: '0.75rem 1rem',
            borderRadius: '12px',
            fontSize: '0.88rem',
            marginBottom: '1.25rem',
            fontWeight: 500
          }}>
            ⚠️ {errorMessage}
          </div>
        )}

        {isLoggedIn ? (
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <div className="alert-box alert-success" style={{
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              color: '#1e40af',
              padding: '0.95rem 1rem',
              borderRadius: '14px',
              fontSize: '0.92rem',
              marginBottom: '1.5rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}>
              <span>✓</span>
              <span>Password is correct! Access granted.</span>
            </div>

            <button
              type="button"
              onClick={handleContinue}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.95rem 1.5rem',
                fontSize: '1.05rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.65rem',
                borderRadius: '9999px',
                cursor: 'pointer'
              }}
            >
              Continue to Dashboard &rarr;
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="username">Username or Email</label>
              <input
                id="username"
                name="username"
                type="text"
                className="form-input"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="e.g. rakesh"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  style={{ paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px'
                  }}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={!!statusMessage}
              style={{ width: '100%', marginTop: '1rem', padding: '0.85rem', fontSize: '0.95rem' }}
            >
              {statusMessage ? 'Signing in...' : 'Sign In to Wallet'}
            </button>

            <button
              type="button"
              onClick={() => {
                setFormData({ username: 'rakesh', password: 'password123' });
                setStatusMessage('Signing in as demo user...');
                try {
                  localStorage.setItem('smart_expenses_user', JSON.stringify({
                    username: 'rakesh',
                    isLoggedIn: true
                  }));
                } catch {
                  // ignore
                }
                setTimeout(() => {
                  if (onContinue) onContinue();
                  else navigate('/dashboard');
                }, 150);
              }}
              style={{
                background: 'rgba(37, 99, 235, 0.08)',
                border: '1px solid rgba(37, 99, 235, 0.25)',
                color: '#2563eb',
                padding: '0.6rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                marginTop: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                width: '100%'
              }}
            >
              ⚡ Quick Demo Sign-In
            </button>
          </form>
        )}

        {!isLoggedIn && (
          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#64748b' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#2563eb', fontWeight: 700 }}>
              Register here
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
