import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function AddExpense() {
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Groceries',
    payment_method: 'VISA •••• 9286',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [statusMessage, setStatusMessage] = useState('');

  const categories = [
    { label: 'Groceries', icon: '🛒' },
    { label: 'Clothes and Shoes', icon: '👕' },
    { label: 'Cafes and Restaurants', icon: '☕' },
    { label: 'Sport', icon: '🏋️' },
    { label: 'Health', icon: '💖' },
    { label: 'Travel', icon: '✈️' },
    { label: 'Bills & Utilities', icon: '💡' },
    { label: 'Other', icon: '📦' },
  ];

  const paymentMethods = [
    'VISA •••• 9286 (Smart Card)',
    'Mastercard •••• 4028 (Platinum)',
    'Bank Direct Transfer',
    'UPI / Digital Cash',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategorySelect = (cat) => {
    setFormData((prev) => ({ ...prev, category: cat }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatusMessage(`✅ Transaction of ₹${parseFloat(formData.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })} under "${formData.category}" logged successfully to your wallet!`);
    setFormData({
      amount: '',
      category: 'Groceries',
      payment_method: 'VISA •••• 9286 (Smart Card)',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 800, 
          letterSpacing: '-0.02em', 
          marginBottom: '0.35rem',
          color: '#ffffff'
        }}>
          Record Deposit or Expense
        </h1>
        <p style={{ color: 'var(--text-royal-muted)', fontSize: '0.95rem' }}>
          Capture outgoing payments and assign them to your 3D category bubbles.
        </p>
      </div>

      <div className="sheet-porcelain" style={{ maxWidth: '680px', borderRadius: '24px' }}>
        {statusMessage && (
          <div className="alert-box alert-info">
            {statusMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Quick Category Chips Matching Bubble Categories */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ marginBottom: '0.6rem', display: 'block' }}>
              Select Category
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat.label}
                  onClick={() => handleCategorySelect(cat.label)}
                  style={{
                    padding: '0.5rem 0.95rem',
                    borderRadius: '9999px',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    background: formData.category === cat.label ? '#2563eb' : '#f1f5f9',
                    border: formData.category === cat.label ? '1px solid #1d4ed8' : '1px solid #e2e8f0',
                    boxShadow: formData.category === cat.label ? '0 4px 12px rgba(37, 99, 235, 0.35)' : 'none',
                    color: formData.category === cat.label ? '#ffffff' : '#334155',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="amount">Amount (₹)</label>
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0.01"
                required
                className="form-input"
                placeholder="e.g. 1450.00"
                value={formData.amount}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="date">Transaction Date</label>
              <input
                id="date"
                name="date"
                type="date"
                required
                className="form-input"
                value={formData.date}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="payment_method">Payment Source</label>
            <select
              id="payment_method"
              name="payment_method"
              className="form-select"
              value={formData.payment_method}
              onChange={handleChange}
            >
              {paymentMethods.map((pm) => (
                <option key={pm} value={pm}>{pm}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">Merchant / Description</label>
            <input
              id="description"
              name="description"
              type="text"
              className="form-input"
              placeholder="e.g. Adobe Creative Cloud, Whole Foods, etc."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-cobalt" style={{ padding: '0.85rem 2rem' }}>
              Save to Wallet
            </button>
            <button
              type="button"
              className="btn btn-primary"
              style={{ background: '#f1f5f9', color: '#0f172a', border: '1px solid #e2e8f0' }}
              onClick={() => setFormData({
                amount: '',
                category: 'Groceries',
                payment_method: 'VISA •••• 9286 (Smart Card)',
                description: '',
                date: new Date().toISOString().split('T')[0],
              })}
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
