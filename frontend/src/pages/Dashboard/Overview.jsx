import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStoredTransactions } from '../../utils/transactionStore';
import Interactive3DCard from '../../components/Interactive3DCard';

export default function Overview() {
  const [currency] = useState('₹');
  const [transactions, setTransactions] = useState(() => getStoredTransactions());

  useEffect(() => {
    const handleUpdate = () => {
      setTransactions(getStoredTransactions());
    };
    window.addEventListener('smart_expenses_transactions_updated', handleUpdate);
    return () => window.removeEventListener('smart_expenses_transactions_updated', handleUpdate);
  }, []);

  const [primaryCard, setPrimaryCard] = useState(() => {
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

  useEffect(() => {
    const handleCardSync = () => {
      try {
        const saved = localStorage.getItem('smart_expenses_cards');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setPrimaryCard(parsed.find((c) => c.isPrimary) || parsed[0]);
          }
        }
      } catch {
        // fallback
      }
    };
    window.addEventListener('storage', handleCardSync);
    window.addEventListener('smart_expenses_cards_updated', handleCardSync);
    return () => {
      window.removeEventListener('storage', handleCardSync);
      window.removeEventListener('smart_expenses_cards_updated', handleCardSync);
    };
  }, []);

  return (
    <div style={{ width: '100%', minWidth: 0 }}>
      {/* Upper Royal Sapphire Section */}
      <div className="overview-hero-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', width: '100%' }}>
          <div style={{ flex: '1 1 280px', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
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

            <div className="overview-balance-display">
              ₹1,04,250<span style={{ fontSize: '0.65em', opacity: 0.85 }}>.00</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.6rem' }}>
              <div className="delta-pill-badge">
                <span>↗</span>
                <span>2.45% this month</span>
              </div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.3rem 0.75rem',
                borderRadius: '9999px',
                backgroundColor: 'rgba(52, 211, 153, 0.15)',
                border: '1px solid rgba(52, 211, 153, 0.35)',
                color: '#6ee7b7',
                fontSize: '0.78rem',
                fontWeight: 700
              }}>
                <span>🛡️</span>
                <span>34.2% Monthly Savings Rate</span>
              </div>
            </div>

            <p style={{ color: '#bfdbfe', fontSize: '0.88rem', marginTop: '1rem', maxWidth: '480px', lineHeight: 1.5 }}>
              Aggregated across active physical cards, Supabase PostgreSQL transactions, and automated ML forecasting.
            </p>
          </div>

          {/* Realistic 3D Interactive Payment Card */}
          <div
            className="overview-card-container"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              maxWidth: '380px',
              flex: '1 1 320px',
              margin: '0 auto',
              minWidth: 0,
              boxSizing: 'border-box'
            }}
          >
            <Interactive3DCard card={primaryCard} />
          </div>
        </div>
      </div>

      {/* Porcelain Lower Sheet Container */}
      <div className="sheet-porcelain" style={{ borderRadius: '28px' }}>
        {/* Quick Action Pills */}
        <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <Link to="/dashboard/add-expense" className="pill-action-btn">
            <span>↗</span>
            <span>Deposit / Add</span>
          </Link>
          <Link to="/dashboard/analysis" className="pill-action-btn" style={{ background: '#eff6ff', color: '#2563eb', borderColor: '#bfdbfe' }}>
            <span>🔮</span>
            <span>Bubble Visualizer</span>
          </Link>
          <Link to="/dashboard/investments" className="pill-action-btn" style={{ background: '#f0fdf4', color: '#16a34a', borderColor: '#bbf7d0' }}>
            <span>📈</span>
            <span>Investments & SIPs</span>
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

        {/* 3D Bubble Analytics Feature Card */}
        <div style={{
          marginBottom: '2.5rem',
          padding: '1.5rem',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #0d2857 0%, #153a77 60%, #0a1e42 100%)',
          color: '#ffffff',
          boxShadow: '0 15px 35px rgba(8, 22, 48, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.15)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
                🔮 Category Bubble Analytics
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#93c5fd', margin: 0 }}>
                Interactive 3D proportional category distribution for September 2026.
              </p>
            </div>
            <Link to="/dashboard/analysis" className="btn btn-primary" style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem' }}>
              Open Full Spheres &rarr;
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
            <div style={{ padding: '0.85rem', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem' }}>🛒</div>
              <div style={{ fontSize: '0.78rem', color: '#93c5fd', marginTop: '0.2rem' }}>Groceries</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, marginTop: '0.15rem' }}>32.8%</div>
            </div>

            <div style={{ padding: '0.85rem', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem' }}>👕</div>
              <div style={{ fontSize: '0.78rem', color: '#93c5fd', marginTop: '0.2rem' }}>Clothes</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, marginTop: '0.15rem' }}>16.1%</div>
            </div>

            <div style={{ padding: '0.85rem', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem' }}>☕</div>
              <div style={{ fontSize: '0.78rem', color: '#93c5fd', marginTop: '0.2rem' }}>Cafes</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, marginTop: '0.15rem' }}>14.8%</div>
            </div>

            <div style={{ padding: '0.85rem', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem' }}>🏋️</div>
              <div style={{ fontSize: '0.78rem', color: '#93c5fd', marginTop: '0.2rem' }}>Sport</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, marginTop: '0.15rem' }}>11.3%</div>
            </div>

            <div style={{ padding: '0.85rem', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem' }}>💖</div>
              <div style={{ fontSize: '0.78rem', color: '#93c5fd', marginTop: '0.2rem' }}>Health</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, marginTop: '0.15rem' }}>8.4%</div>
            </div>
          </div>
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

      <style>{`
        .overview-hero-card {
          background: linear-gradient(135deg, rgba(22, 61, 125, 0.6) 0%, rgba(9, 26, 56, 0.8) 100%);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 28px;
          padding: 2rem 2.25rem;
          margin-bottom: 2rem;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
          position: relative;
          overflow: hidden;
          width: 100%;
          box-sizing: border-box;
        }

        .overview-balance-display {
          font-size: clamp(2.1rem, 7.5vw, 3.2rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #fff;
          text-shadow: 0 2px 20px rgba(0,0,0,0.3);
          line-height: 1.15;
          margin-top: 0.15rem;
        }

        @media (max-width: 768px) {
          .overview-hero-card {
            padding: 1.4rem 1.15rem;
            border-radius: 22px;
            margin-bottom: 1.25rem;
          }
          .overview-card-container {
            width: 100% !important;
            max-width: 100% !important;
            flex: 1 1 100% !important;
            margin-top: 0.5rem !important;
          }
        }

        @media (max-width: 420px) {
          .overview-hero-card {
            padding: 1.15rem 0.9rem;
            border-radius: 18px;
          }
          .overview-card-container {
            width: 100% !important;
            max-width: 100% !important;
            margin-top: 0.75rem !important;
          }
        }
      `}</style>
    </div>
  );
}
