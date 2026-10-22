import React, { useState } from 'react';

export default function Budget() {
  const [monthlyLimit, setMonthlyLimit] = useState(() => {
    try {
      return localStorage.getItem('smart_expenses_budget_limit') || '20000';
    } catch {
      return '20000';
    }
  });
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
    try {
      localStorage.setItem('smart_expenses_budget_limit', monthlyLimit);
    } catch {}
    setStatusMessage(`✅ Monthly target cap updated to ₹${parseFloat(monthlyLimit).toLocaleString('en-IN', { minimumFractionDigits: 2 })}!`);
    setTimeout(() => setStatusMessage(''), 4000);
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
        <div className="alert-box alert-info" style={{ animation: 'modalFadeIn 0.3s ease' }}>
          {statusMessage}
        </div>
      )}

      {/* Royal Sapphire Progress Card */}
      <div className="budget-hero-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="delta-pill-badge" style={{ marginBottom: '0.5rem' }}>
              Monthly Cap
            </span>
            <div className="budget-cap-display">
              ₹{spentNum.toLocaleString('en-IN', { minimumFractionDigits: 2 })} <span style={{ fontSize: '0.6em', color: '#93c5fd' }}>/ ₹{limitNum.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: 'clamp(1.6rem, 5vw, 2.2rem)', fontWeight: 800, color: percentage > 90 ? '#f87171' : '#38bdf8' }}>{percentage}%</span>
          </div>
        </div>

        {/* Vibrant Glowing Progress Bar */}
        <div className="progress-track" style={{ height: '14px', background: 'rgba(255, 255, 255, 0.12)', borderRadius: '9999px', overflow: 'hidden' }}>
          <div
            className="progress-fill"
            style={{
              width: `${percentage}%`,
              height: '100%',
              background: percentage > 90 ? 'linear-gradient(90deg, #f87171, #ef4444)' : 'linear-gradient(90deg, #38bdf8 0%, #2563eb 100%)',
              borderRadius: '9999px',
              boxShadow: percentage > 90 ? '0 0 15px rgba(239, 68, 68, 0.6)' : '0 0 15px rgba(56, 189, 248, 0.6)',
              transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#bfdbfe', marginTop: '0.9rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span>Available to spend: <strong style={{ color: '#fff' }}>₹{Math.max(0, limitNum - spentNum).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></span>
          <span>Renewal in: <strong style={{ color: '#fff' }}>7 days</strong></span>
        </div>
      </div>

      {/* Porcelain Sheet: Category Budgets & Config */}
      <div className="sheet-porcelain" style={{ borderRadius: '28px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '1.25rem' }}>
          Category Allocations
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {categoryBudgets.map((cb) => {
            const catPct = Math.round((cb.spent / cb.limit) * 100);
            return (
              <div key={cb.cat} className="card-white" style={{ borderRadius: '18px', padding: '1.25rem' }}>
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
                <div className="progress-track" style={{ height: '7px', marginTop: '0.65rem', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div className="progress-fill" style={{ width: `${catPct}%`, height: '100%', background: catPct > 85 ? '#ef4444' : '#2563eb', borderRadius: '9999px' }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Adjust Form */}
        <div style={{ maxWidth: '480px', width: '100%' }}>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.85rem' }}>
            Adjust Monthly Cap
          </h4>
          <form onSubmit={handleUpdate} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <input
              type="number"
              className="form-input"
              value={monthlyLimit}
              onChange={(e) => setMonthlyLimit(e.target.value)}
              placeholder="e.g. 25000"
              required
              style={{ flex: 1, minWidth: '160px' }}
            />
            <button type="submit" className="btn btn-cobalt" style={{ flexShrink: 0, padding: '0.75rem 1.5rem' }}>
              Update Cap
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .budget-hero-card {
          background: linear-gradient(135deg, rgba(22, 61, 125, 0.6) 0%, rgba(9, 26, 56, 0.8) 100%);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 28px;
          padding: 2rem 2.25rem;
          margin-bottom: 2rem;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
          width: 100%;
          box-sizing: border-box;
        }

        .budget-cap-display {
          font-size: clamp(1.8rem, 6vw, 2.5rem);
          font-weight: 800;
          color: #fff;
          line-height: 1.15;
          margin-top: 0.1rem;
        }

        @media (max-width: 768px) {
          .budget-hero-card {
            padding: 1.4rem 1.15rem;
            border-radius: 20px;
          }
        }

        @media (max-width: 420px) {
          .budget-hero-card {
            padding: 1.15rem 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}
