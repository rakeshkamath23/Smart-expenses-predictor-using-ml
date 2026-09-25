import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Analysis() {
  const [selectedBubble, setSelectedBubble] = useState('Groceries');
  const [currency] = useState('₹');

  const categories = [
    { 
      name: 'Groceries', 
      pct: '32.8%', 
      amount: 6043.60, 
      icon: '🛒', 
      className: 'bubble-dominant',
      color: '#38bdf8',
      desc: 'Supermarkets, organic food, daily household items'
    },
    { 
      name: 'Clothes and Shoes', 
      pct: '16.1%', 
      amount: 2966.50, 
      icon: '👕', 
      className: 'bubble-clothes',
      color: '#818cf8',
      desc: 'Apparel, footwear, seasonal wardrobe updates'
    },
    { 
      name: 'Cafes and Restaurants', 
      pct: '14.8%', 
      amount: 2727.00, 
      icon: '☕', 
      className: 'bubble-cafes',
      color: '#fbbf24',
      desc: 'Coffee shops, dining out, weekend social brunches'
    },
    { 
      name: 'Sport', 
      pct: '11.3%', 
      amount: 2082.00, 
      icon: '🏋️', 
      className: 'bubble-sports',
      color: '#34d399',
      desc: 'Gym membership, fitness equipment, supplements'
    },
    { 
      name: 'Health', 
      pct: '8.4%', 
      amount: 1547.70, 
      icon: '💖', 
      className: 'bubble-health',
      color: '#f43f5e',
      desc: 'Pharmacy prescriptions, wellness checks, dental'
    },
    { 
      name: 'Travel', 
      pct: '6.7%', 
      amount: 1234.50, 
      icon: '✈️', 
      className: 'bubble-travel',
      color: '#60a5fa',
      desc: 'Flight tickets, train passes, city public transit'
    },
  ];

  const activeCategory = categories.find(c => c.name === selectedBubble) || categories[0];
  const totalExpense = categories.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div>
      {/* Upper Royal Sapphire Stage with 3D Spherical Category Bubbles (Screen 3) */}
      <div style={{
        background: 'linear-gradient(180deg, #0d2857 0%, #153a77 60%, #0a1e42 100%)',
        borderRadius: '28px',
        padding: '1.75rem 2rem 2.5rem',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.45)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Header Bar with back arrow & calendar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#93c5fd', fontSize: '0.9rem', fontWeight: 600 }}>
            <span>&larr;</span>
            <span>Dashboard</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#e2e8f0', background: 'rgba(255,255,255,0.1)', padding: '0.25rem 0.75rem', borderRadius: '9999px', border: '1px solid rgba(255,255,255,0.15)' }}>
              📅 September 2026
            </span>
            <span
              style={{
                fontSize: '0.8rem',
                color: '#fff',
                background: '#2563eb',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontWeight: 700
              }}
            >
              INR (₹)
            </span>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
            Category Bubble Analytics
          </h2>
          <p style={{ color: '#93c5fd', fontSize: '0.9rem', margin: 0 }}>
            Interactive 3D frosted glass spheres representing proportional monthly category expenditure.
          </p>
        </div>

        {/* 3D Frosted Glass Category Spheres (Screen 3 Visual) */}
        <div className="bubble-chart-stage">
          {categories.map((c) => (
            <div
              key={c.name}
              className={`glass-sphere-bubble ${c.className}`}
              onClick={() => setSelectedBubble(c.name)}
              style={{
                borderWidth: selectedBubble === c.name ? '2.5px' : '1.5px',
                borderColor: selectedBubble === c.name ? '#ffffff' : 'rgba(255, 255, 255, 0.35)',
                transform: selectedBubble === c.name ? 'scale(1.1) translateY(-4px)' : 'none',
                boxShadow: selectedBubble === c.name ? '0 0 35px rgba(56, 189, 248, 0.7)' : undefined
              }}
              title={`Click to view ${c.name} details`}
            >
              <span className="bubble-icon">{c.icon}</span>
              <span className="bubble-title">{c.name}</span>
              <span className="bubble-pct">{c.pct}</span>
            </div>
          ))}
        </div>

        {/* Selected Bubble Details Callout */}
        <div style={{
          maxWidth: '520px',
          margin: '1.5rem auto 0',
          padding: '0.9rem 1.4rem',
          borderRadius: '16px',
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#fff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.5rem' }}>{activeCategory.icon}</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{activeCategory.name}</div>
              <div style={{ fontSize: '0.78rem', color: '#bfdbfe' }}>{activeCategory.desc}</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 800, fontSize: '1.15rem' }}>{currency}{activeCategory.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
            <div style={{ fontSize: '0.76rem', color: '#38bdf8', fontWeight: 600 }}>{activeCategory.pct} of total</div>
          </div>
        </div>
      </div>

      {/* Porcelain Lower Sheet Container (Screen 3 Bottom Sheet) */}
      <div className="sheet-porcelain" style={{ borderRadius: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-dark-muted)' }}>
              Expenses Total
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-dark)', letterSpacing: '-0.02em', marginTop: '0.1rem' }}>
              {currency}{totalExpense.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
          </div>

          <Link to="/dashboard/prediction" className="btn btn-cobalt" style={{ padding: '0.65rem 1.35rem' }}>
            <span>🤖 ML Prediction Forecast &rarr;</span>
          </Link>
        </div>

        {/* Category Breakdown Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          {categories.map((c) => (
            <div
              key={c.name}
              className="card-white"
              onClick={() => setSelectedBubble(c.name)}
              style={{
                cursor: 'pointer',
                borderLeft: `4px solid ${c.color}`,
                background: selectedBubble === c.name ? '#f8fafc' : '#ffffff'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-dark)' }}>
                  <span>{c.icon}</span>
                  <span>{c.name}</span>
                </div>
                <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>
                  {c.pct}
                </span>
              </div>

              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                {currency}{c.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>

              <div className="progress-track" style={{ height: '6px', marginTop: '0.75rem' }}>
                <div
                  className="progress-fill"
                  style={{ width: c.pct, background: c.color }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Floating Dock Bar */}
        <div className="floating-dock-bar" style={{ marginTop: '2.25rem' }}>
          <Link to="/dashboard" className="dock-item-btn" title="Cards & Balance">💳</Link>
          <Link to="/dashboard/analysis" className="dock-item-btn active" title="Bubble Analytics">🔮</Link>
          <Link to="/dashboard/history" className="dock-item-btn" title="Transactions">🕒</Link>
          <Link to="/chat" className="dock-item-btn" title="AI Copilot">✦</Link>
          <Link to="/dashboard/profile" className="dock-item-btn" title="Settings">⚙️</Link>
        </div>
      </div>
    </div>
  );
}
