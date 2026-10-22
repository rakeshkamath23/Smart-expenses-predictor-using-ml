import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Analysis() {
  const [selectedBubble, setSelectedBubble] = useState('Groceries');
  const [selectedMonth, setSelectedMonth] = useState('september'); // 'september' (current) or 'august' (previous)
  const [currency] = useState('₹');
  const [displayMode, setDisplayMode] = useState('spheres'); // 'spheres' (3D glass bubbles) or 'grid' (clean vertical list)

  const monthlyData = {
    september: {
      label: 'September 2026',
      shortLabel: 'Sep 2026',
      badge: 'Current Month',
      categories: [
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
      ]
    },
    august: {
      label: 'August 2026',
      shortLabel: 'Aug 2026',
      badge: 'Previous Month',
      categories: [
        { 
          name: 'Groceries', 
          pct: '33.1%', 
          amount: 5820.00, 
          icon: '🛒', 
          className: 'bubble-dominant',
          color: '#38bdf8',
          desc: 'Supermarkets, organic food, daily household items'
        },
        { 
          name: 'Clothes and Shoes', 
          pct: '19.6%', 
          amount: 3450.00, 
          icon: '👕', 
          className: 'bubble-clothes',
          color: '#818cf8',
          desc: 'Apparel, footwear, seasonal wardrobe updates'
        },
        { 
          name: 'Cafes and Restaurants', 
          pct: '16.4%', 
          amount: 2890.00, 
          icon: '☕', 
          className: 'bubble-cafes',
          color: '#fbbf24',
          desc: 'Coffee shops, dining out, weekend social brunches'
        },
        { 
          name: 'Sport', 
          pct: '11.1%', 
          amount: 1950.00, 
          icon: '🏋️', 
          className: 'bubble-sports',
          color: '#34d399',
          desc: 'Gym membership, fitness equipment, supplements'
        },
        { 
          name: 'Health', 
          pct: '6.4%', 
          amount: 1120.00, 
          icon: '💖', 
          className: 'bubble-health',
          color: '#f43f5e',
          desc: 'Pharmacy prescriptions, wellness checks, dental'
        },
        { 
          name: 'Travel', 
          pct: '13.4%', 
          amount: 2350.00, 
          icon: '✈️', 
          className: 'bubble-travel',
          color: '#60a5fa',
          desc: 'Flight tickets, train passes, city public transit'
        },
      ]
    }
  };

  const currentMonthData = monthlyData[selectedMonth];
  const categories = currentMonthData.categories;
  const activeCategory = categories.find(c => c.name === selectedBubble) || categories[0];
  const totalExpense = categories.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div style={{ width: '100%', minWidth: 0 }}>
      {/* Upper Royal Sapphire Stage with 3D Spherical Category Bubbles */}
      <div className="analysis-sapphire-stage">
        {/* Header Bar with back arrow, month toggle & currency */}
        <div className="analysis-header-bar">
          <Link to="/dashboard" className="analysis-back-link">
            <span>&larr;</span>
            <span>Dashboard</span>
          </Link>

          {/* Month Selector Pill Toggle (Contained & Responsive) */}
          <div className="analysis-month-selector">
            <button
              type="button"
              onClick={() => setSelectedMonth('august')}
              className={`analysis-month-btn ${selectedMonth === 'august' ? 'active' : ''}`}
            >
              <span>◀</span>
              <span className="full-month-label">August 2026 (Previous)</span>
              <span className="short-month-label">Aug 2026</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMonth('september')}
              className={`analysis-month-btn ${selectedMonth === 'september' ? 'active' : ''}`}
            >
              <span className="full-month-label">September 2026 (Current)</span>
              <span className="short-month-label">Sep 2026</span>
              <span>▶</span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* View Mode Toggle Pill for Mobile */}
            <div className="analysis-view-toggle">
              <button
                type="button"
                onClick={() => setDisplayMode('spheres')}
                className={`view-pill-btn ${displayMode === 'spheres' ? 'active' : ''}`}
                title="3D Spheres View"
              >
                🔮 3D
              </button>
              <button
                type="button"
                onClick={() => setDisplayMode('grid')}
                className={`view-pill-btn ${displayMode === 'grid' ? 'active' : ''}`}
                title="List View"
              >
                📋 List
              </button>
            </div>

            <span className="analysis-currency-badge">
              INR (₹)
            </span>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '1rem', padding: '0 0.5rem' }}>
          <h2 className="analysis-title">
            Category Bubble Analytics
          </h2>
          <p className="analysis-subtitle">
            Interactive 3D frosted glass spheres representing proportional monthly category expenditure.
          </p>
        </div>

        {/* 1. 3D Frosted Glass Category Spheres (Screen 3 Visual) */}
        {displayMode === 'spheres' ? (
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
        ) : (
          /* Alternative Clean Responsive List on Narrow Screens */
          <div className="bubble-grid-compact">
            {categories.map((c) => (
              <div
                key={c.name}
                onClick={() => setSelectedBubble(c.name)}
                className={`bubble-compact-chip ${selectedBubble === c.name ? 'active' : ''}`}
                style={{ borderLeftColor: c.color }}
              >
                <span style={{ fontSize: '1.4rem' }}>{c.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {c.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#93c5fd' }}>
                    {currency}{c.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#38bdf8' }}>
                  {c.pct}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Selected Bubble Details Callout */}
        <div className="analysis-callout-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
            <span style={{ fontSize: '1.6rem', flexShrink: 0 }}>{activeCategory.icon}</span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: '0.96rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {activeCategory.name}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#bfdbfe', lineHeight: 1.3 }}>
                {activeCategory.desc}
              </div>
            </div>
          </div>
          <div className="analysis-callout-amount">
            <div style={{ fontWeight: 800, fontSize: '1.18rem' }}>
              {currency}{activeCategory.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 600 }}>
              {activeCategory.pct} of total
            </div>
          </div>
        </div>
      </div>

      {/* Porcelain Lower Sheet Container */}
      <div className="sheet-porcelain" style={{ borderRadius: '28px' }}>
        <div className="analysis-summary-header">
          <div>
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-dark-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span>Expenses Total &bull; {currentMonthData.label}</span>
              <span style={{ fontSize: '0.75rem', background: '#eff6ff', color: '#1d4ed8', padding: '0.15rem 0.55rem', borderRadius: '9999px', fontWeight: 700 }}>
                {currentMonthData.badge}
              </span>
            </div>
            <div className="analysis-total-sum">
              {currency}{totalExpense.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
          </div>

          <Link to="/dashboard/prediction" className="btn btn-cobalt" style={{ padding: '0.65rem 1.35rem', whiteSpace: 'nowrap' }}>
            <span>🤖 ML Prediction Forecast &rarr;</span>
          </Link>
        </div>

        {/* Category Breakdown Cards Grid */}
        <div className="analysis-category-grid">
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

      {/* Scoped Responsive Styles for Analysis */}
      <style>{`
        .analysis-sapphire-stage {
          background: linear-gradient(180deg, #0d2857 0%, #153a77 60%, #0a1e42 100%);
          border-radius: 28px;
          padding: 1.75rem 2rem 2.5rem;
          border: 1px solid rgba(255, 255, 255, 0.18);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45);
          position: relative;
          overflow: hidden;
          width: 100%;
          box-sizing: border-box;
        }

        .analysis-header-bar {
          display: flex;
          justifyContent: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
          gap: 0.75rem;
          width: 100%;
        }

        .analysis-back-link {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: #93c5fd;
          font-size: 0.88rem;
          font-weight: 600;
        }

        .analysis-month-selector {
          display: inline-flex;
          align-items: center;
          background: rgba(8, 22, 48, 0.65);
          padding: 4px;
          border-radius: 9999px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.3);
          max-width: 100%;
        }

        .analysis-month-btn {
          padding: 0.35rem 0.95rem;
          border-radius: 9999px;
          font-size: 0.82rem;
          font-weight: 700;
          color: #93c5fd;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          white-space: nowrap;
        }

        .analysis-month-btn.active {
          color: #ffffff;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          box-shadow: 0 2px 10px rgba(37, 99, 235, 0.5);
        }

        .full-month-label { display: inline; }
        .short-month-label { display: none; }

        .analysis-view-toggle {
          display: inline-flex;
          background: rgba(8, 22, 48, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 9999px;
          padding: 2px;
          gap: 2px;
        }

        .view-pill-btn {
          padding: 0.2rem 0.6rem;
          border-radius: 9999px;
          font-size: 0.74rem;
          font-weight: 700;
          color: #93c5fd;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .view-pill-btn.active {
          background: #2563eb;
          color: #ffffff;
        }

        .analysis-currency-badge {
          font-size: 0.78rem;
          color: #fff;
          background: #2563eb;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-weight: 700;
        }

        .analysis-title {
          font-size: 1.85rem;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.02em;
        }

        .analysis-subtitle {
          color: #93c5fd;
          font-size: 0.9rem;
          margin: 0;
        }

        .analysis-callout-card {
          max-width: 520px;
          margin: 1.5rem auto 0;
          padding: 0.9rem 1.4rem;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          display: flex;
          justifyContent: space-between;
          align-items: center;
          color: #fff;
          gap: 1rem;
          box-sizing: border-box;
        }

        .analysis-callout-amount {
          text-align: right;
          flex-shrink: 0;
        }

        .analysis-summary-header {
          display: flex;
          justifyContent: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .analysis-total-sum {
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--text-dark);
          letter-spacing: -0.02em;
          margin-top: 0.1rem;
        }

        .analysis-category-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1rem;
        }

        .bubble-grid-compact {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          max-width: 480px;
          margin: 0.75rem auto;
        }

        .bubble-compact-chip {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.75rem 1rem;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.07);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-left-width: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .bubble-compact-chip:hover, .bubble-compact-chip.active {
          background: rgba(255, 255, 255, 0.14);
          transform: translateX(4px);
          border-color: rgba(255, 255, 255, 0.4);
        }

        /* Mobile Breakpoints */
        @media (max-width: 640px) {
          .analysis-sapphire-stage {
            padding: 1.25rem 0.95rem 1.75rem;
            border-radius: 20px;
          }
          .analysis-title {
            font-size: 1.45rem;
          }
          .analysis-subtitle {
            font-size: 0.82rem;
          }
          .full-month-label { display: none; }
          .short-month-label { display: inline; }
          .analysis-total-sum {
            font-size: 2rem;
          }
          .analysis-category-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 440px) {
          .analysis-header-bar {
            justify-content: center;
          }
          .analysis-callout-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.65rem;
            padding: 0.85rem 1rem;
          }
          .analysis-callout-amount {
            text-align: left;
            width: 100%;
            display: flex;
            justifyContent: space-between;
            align-items: baseline;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            padding-top: 0.5rem;
          }
          .analysis-total-sum {
            font-size: 1.75rem;
          }
        }

        @media (max-width: 360px) {
          .analysis-month-btn {
            padding: 0.3rem 0.65rem;
            font-size: 0.76rem;
          }
          .analysis-title {
            font-size: 1.3rem;
          }
        }
      `}</style>
    </div>
  );
}
