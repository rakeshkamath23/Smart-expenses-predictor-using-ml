import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone_number: '',
    password: '',
    confirmPassword: '',
  });
  const [statusMessage, setStatusMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setStatusMessage('Account created successfully! Redirecting to login...');
    setTimeout(() => navigate('/login'), 1000);
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 1.5rem',
      minHeight: '75vh'
    }}>
      <div className="sheet-porcelain" style={{ maxWidth: '480px', width: '100%', padding: '2.5rem 2rem', borderRadius: '28px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #38bdf8, #2563eb)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            margin: '0 auto 1rem',
            color: '#fff',
            boxShadow: '0 8px 20px rgba(37, 99, 235, 0.35)'
          }}>
            ⚡
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.35rem', color: 'var(--text-dark)' }}>
            Create Account
          </h1>
          <p style={{ color: 'var(--text-dark-muted)', fontSize: '0.9rem' }}>
            Activate your digital card, tracking, and ML prediction tools
          </p>
        </div>

        {statusMessage && (
          <div className="alert-box alert-info">
            {statusMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              className="form-input"
              required
              value={formData.username}
              onChange={handleChange}
              placeholder="e.g. rakeshkamath"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-input"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="rakesh@example.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="phone_number">Phone Number</label>
            <input
              id="phone_number"
              name="phone_number"
              type="tel"
              className="form-input"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="+91 9876543210"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-input"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className="form-input"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="btn btn-cobalt"
            style={{ width: '100%', marginTop: '1rem', padding: '0.85rem' }}
          >
            Create Financial Account
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-dark-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#2563eb', fontWeight: 600 }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
