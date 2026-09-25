import React, { useState } from 'react';

export default function Budget() {
  const [monthlyLimit, setMonthlyLimit] = useState('20000');
  const [spent, setSpent] = useState('14570.00');
  const [statusMessage, setStatusMessage] = useState('');

  const limitNum = parseFloat(monthlyLimit) || 1;
  const spentNum = parseFloat(spent) || 0;
  const percentage = Math.min(100, Math.round((spentNum / limitNum) * 100));

  const categoryBudgets = [
    { cat: 'Groceries', spent: 5240.00, limit: 7000, icon: '🛒' },
    { cat: 'Clothes and Shoes', spent: 2620.00, limit: 3500, icon: '👕' },
    { cat: 'Cafes and Restaurants', spent: 2410.00, limit: 3000, icon: '☕' },
    { cat: 'Sport', spent: 1840.00, limit: 2500, icon: '🏋️' },
    { cat: 'Health', spent: 1370.00, limit: 2000, icon: '💖' },
    { cat: 'Travel', spent: 1090.00, limit: 2000, icon: '✈️' },
  ];

  const handleUpdate = (e) => {
    e.preventDefault();
    setStatusMessage(`✅ Monthly target updated to ₹${parseFloat(monthlyLimit).toLocaleString('en-IN', { minimumFractionDigits: 2 })}!`);
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
          Budget Planning
        </h1>
        <p style={{ color: 'var(--text-royal-muted)', fontSize: '0.95rem' }}>
          Define spending limits and track real-time utilization against smart card debit records.
        </p>
      </div>

      {statusMessage && (
        <div className="alert-box alert-info">
          {statusMessage}
        </div>
      )}

      {/* Royal Sapphire Progress Card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(22, 61, 125, 0.6) 0%, rgba(9, 26, 56, 0.8) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '28px',
        padding: '2rem 2.25rem',
        marginBottom: '2rem',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <span className="delta-pill-badge" style={{ marginBottom: '0.5rem' }}>
              Monthly Cap
            </span>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff' }}>
              ₹{spentNum.toLocaleString('en-IN', { minimumFractionDigits: 2 })} <span style={{ fontSize: '1.4rem', color: '#93c5fd' }}>/ ₹{limitNum.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8' }}>{percentage}%</span>
          </div>
        </div>

        <div className="progress-track" style={{ height: '12px', background: 'rgba(255, 255, 255, 0.15)' }}>
          <div
            className="progress-fill"
            style={{
              width: `${percentage}%`,
              background: percentage > 90 ? '#ef4444' : 'linear-gradient(90deg, #38bdf8, #2563eb)'
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#bfdbfe', marginTop: '0.75rem' }}>
          <span>Available to spend: <strong style={{ color: '#fff' }}>₹{(limitNum - spentNum).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></span>
          <span>Renewal in: <strong style={{ color: '#fff' }}>7 days</strong></span>
        </div>
      </div>

      {/* Porcelain Sheet: Category Budgets & Config */}
      <div className="sheet-porcelain" style={{ borderRadius: '28px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '1.25rem' }}>
          Category Allocations
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {categoryBudgets.map((cb) => {
            const catPct = Math.round((cb.spent / cb.limit) * 100);
            return (
              <div key={cb.cat} className="card-white">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                    <span>{cb.icon}</span>
                    <span>{cb.cat}</span>
                  </div>
                  <span className={`badge ${catPct > 85 ? 'badge-danger' : 'badge-primary'}`}>
                    {catPct}%
                  </span>
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800 }}>₹{cb.spent.toLocaleString('en-IN', { minimumFractionDigits: 2 })} / ₹{cb.limit.toLocaleString('en-IN')}</div>
                <div className="progress-track" style={{ height: '6px', marginTop: '0.6rem' }}>
                  <div className="progress-fill" style={{ width: `${catPct}%`, background: catPct > 85 ? '#ef4444' : '#2563eb' }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Adjust Form */}
        <div style={{ maxWidth: '480px' }}>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.85rem' }}>
            Adjust Monthly Cap
          </h4>
          <form onSubmit={handleUpdate} style={{ display: 'flex', gap: '0.75rem' }}>
            <input
              type="number"
              className="form-input"
              value={monthlyLimit}
              onChange={(e) => setMonthlyLimit(e.target.value)}
              placeholder="e.g. 25000"
              required
            />
            <button type="submit" className="btn btn-cobalt" style={{ flexShrink: 0, padding: '0.75rem 1.5rem' }}>
              Update Cap
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
