import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Overview() {
  const [currency] = useState('₹');

  const [primaryCard] = useState(() => {
    try {
      const saved = localStorage.getItem('smart_expenses_cards');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.find((c) => c.isPrimary) || parsed[0];
        }
      }
    } catch {
      // fallback
    }
    return {
      network: 'VISA',
      last4: '9286',
      nameOnCard: 'Rakesh Kamath',
      expiry: '08/32',
      theme: 'sapphire'
    };
  });

  const transactions = [
    { id: 1, name: 'Adobe Creative Cloud', category: 'Software & Design', time: 'Today, 09:42', amount: -599.00, icon: '🎨', bg: '#f1f5f9' },
    { id: 2, name: 'Stripe Payout', category: 'Merchant Income', time: 'Today, 08:10', amount: 1875.00, icon: 'S', bg: '#eff6ff', isIncome: true },
    { id: 3, name: 'Office Supplies', category: 'Workplace & Stationery', time: 'Jan 28, 10:22', amount: -240.00, icon: '📎', bg: '#f1f5f9' },
    { id: 4, name: 'Whole Foods Market', category: 'Groceries & Organic', time: 'Jan 27, 18:30', amount: -1420.00, icon: '🛒', bg: '#f1f5f9' },
    { id: 5, name: 'Uber Ride City Center', category: 'Travel & Rideshare', time: 'Jan 26, 21:15', amount: -180.00, icon: '🚗', bg: '#f1f5f9' },
  ];

  const getThemeClass = (theme) => {
    switch (theme) {
      case 'black': return 'card-theme-black';
      case 'emerald': return 'card-theme-emerald';
      case 'violet': return 'card-theme-violet';
      case 'sunset': return 'card-theme-sunset';
      default: return 'card-theme-sapphire';
    }
  };

  return (
    <div>
      {/* Upper Royal Sapphire Section - Recreating Screen 1 Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(22, 61, 125, 0.6) 0%, rgba(9, 26, 56, 0.8) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '28px',
        padding: '2rem 2.25rem',
        marginBottom: '2rem',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.9rem', color: '#93c5fd', fontWeight: 600 }}>Total Balance</span>
              <span style={{
                padding: '0.2rem 0.65rem',
                borderRadius: '9999px',
                background: 'rgba(56, 189, 248, 0.2)',
                fontSize: '0.75rem',
                color: '#38bdf8',
                fontWeight: 700
              }}>
                INR (₹)
              </span>
            </div>

            <div style={{ fontSize: '3.2rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
              ₹1,04,250<span style={{ fontSize: '2rem', opacity: 0.85 }}>.00</span>
            </div>

            <div className="delta-pill-badge" style={{ marginTop: '0.6rem' }}>
              <span>↗</span>
              <span>2.45% this month</span>
            </div>

            <p style={{ color: '#bfdbfe', fontSize: '0.92rem', marginTop: '1.25rem', maxWidth: '480px' }}>
              Aggregated across active physical cards, Supabase PostgreSQL transactions, and automated ML forecasting.
            </p>
          </div>

          {/* Stacked Payment Card (From Screen 1) */}
          <div className={`smart-payment-card ${getThemeClass(primaryCard?.theme)}`} style={{ minWidth: '320px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="card-chip" />
              <span style={{ fontSize: '0.95rem', fontWeight: 800, letterSpacing: '0.05em' }}>{primaryCard?.network || 'VISA'}</span>
            </div>

            <div>
              <div className="card-number-dots">
                •••• {primaryCard?.last4 || '9286'}
              </div>
            </div>

            <div className="card-footer-info">
              <div>
                <div style={{ fontSize: '0.68rem', color: '#bfdbfe', textTransform: 'uppercase' }}>Cardholder</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{primaryCard?.nameOnCard || 'Rakesh Kamath'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', color: '#bfdbfe', textTransform: 'uppercase' }}>Expires</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{primaryCard?.expiry || '08/32'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Porcelain Lower Sheet Container - Recreating Screen 1 Lower Section */}
      <div className="sheet-porcelain" style={{ borderRadius: '28px' }}>
        {/* Quick Action Pills: Deposit ↗, Transfer ⇄, Withdraw ↘ */}
        <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <Link to="/dashboard/add-expense" className="pill-action-btn">
            <span>↗</span>
            <span>Deposit / Add</span>
          </Link>
          <Link to="/dashboard/budget" className="pill-action-btn">
            <span>⇄</span>
            <span>Transfer / Budget</span>
          </Link>
          <Link to="/dashboard/add-expense" className="pill-action-btn">
            <span>↘</span>
            <span>Withdraw / Spend</span>
          </Link>
          <Link to="/dashboard/prediction" className="pill-action-btn" style={{ background: '#eff6ff', color: '#2563eb', borderColor: '#bfdbfe' }}>
            <span>🤖</span>
            <span>ML Prediction</span>
          </Link>
        </div>

        {/* Recent Transactions List */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-dark)' }}>
              Recent Transactions
            </h3>
            <Link to="/dashboard/history" style={{ fontSize: '0.85rem', color: '#2563eb', fontWeight: 600 }}>
              View All &rarr;
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="card-white"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1.1rem 1.35rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: tx.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: tx.isIncome ? '#2563eb' : '#0f172a'
                  }}>
                    {tx.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                      {tx.name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dark-subtle)', marginTop: '0.15rem' }}>
                      {tx.category} &bull; {tx.time}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    color: tx.isIncome ? '#16a34a' : '#0f172a'
                  }}>
                    {tx.isIncome ? '+' : '-'}{currency}{Math.abs(tx.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  <span className={`badge ${tx.isIncome ? 'badge-success' : 'badge-primary'}`} style={{ fontSize: '0.68rem', marginTop: '0.2rem' }}>
                    {tx.isIncome ? 'Received' : 'Settled'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Dock Bar */}
        <div className="floating-dock-bar" style={{ marginTop: '2rem' }}>
          <Link to="/dashboard" className="dock-item-btn active" title="Cards & Balance">💳</Link>
          <Link to="/dashboard/analysis" className="dock-item-btn" title="Bubble Analytics">🔮</Link>
          <Link to="/dashboard/history" className="dock-item-btn" title="Transactions">🕒</Link>
          <Link to="/chat" className="dock-item-btn" title="AI Copilot">✦</Link>
          <Link to="/dashboard/profile" className="dock-item-btn" title="Settings">⚙️</Link>
        </div>
      </div>
    </div>
  );
}
