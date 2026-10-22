import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

const DEFAULT_HOLDINGS = [
  {
    id: 'inv-1',
    symbol: 'NIFTYBEES',
    name: 'Nippon India Nifty 50 ETF',
    assetClass: 'Equities',
    icon: '📈',
    color: '#38bdf8',
    quantity: 850,
    buyAvg: 232.40,
    cmp: 268.80,
    allocationPct: 47.1,
    sipMonthly: 10000,
    sipDay: '5th of month'
  },
  {
    id: 'inv-2',
    symbol: 'PPFAS',
    name: 'Parag Parikh Flexi Cap Fund',
    assetClass: 'Mutual Funds',
    icon: '🏦',
    color: '#818cf8',
    quantity: 1650.4,
    buyAvg: 64.20,
    cmp: 88.50,
    allocationPct: 30.1,
    sipMonthly: 8000,
    sipDay: '10th of month'
  },
  {
    id: 'inv-3',
    symbol: 'SGB2026',
    name: 'Sovereign Gold Bonds (RBI)',
    assetClass: 'Gold & SGBs',
    icon: '🪙',
    color: '#fbbf24',
    quantity: 7,
    buyAvg: 5850.00,
    cmp: 6940.00,
    allocationPct: 10.0,
    sipMonthly: 0,
    sipDay: 'Lump sum'
  },
  {
    id: 'inv-4',
    symbol: 'HDFCFD',
    name: 'HDFC High-Yield Fixed Deposit (7.6%)',
    assetClass: 'Debt & FDs',
    icon: '🛡️',
    color: '#34d399',
    quantity: 1,
    buyAvg: 45000.00,
    cmp: 48560.00,
    allocationPct: 10.0,
    sipMonthly: 0,
    sipDay: 'Quarterly Payout'
  },
  {
    id: 'inv-5',
    symbol: 'BTC/ETH',
    name: 'Bluechip Crypto Index (Cold Storage)',
    assetClass: 'Crypto',
    icon: '⚡',
    color: '#f43f5e',
    quantity: 0.045,
    buyAvg: 410000.00,
    cmp: 539555.00,
    allocationPct: 5.0,
    sipMonthly: 2000,
    sipDay: '15th of month'
  }
];

export default function Investments() {
  const [currency] = useState('₹');
  const [filterClass, setFilterClass] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState('');

  // Holdings state persisted in localStorage
  const [holdings, setHoldings] = useState(() => {
    try {
      const saved = localStorage.getItem('smart_expenses_investments');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_HOLDINGS;
  });

  // New Holding Form State
  const [formData, setFormData] = useState({
    symbol: '',
    name: '',
    assetClass: 'Equities',
    quantity: '',
    buyAvg: '',
    cmp: '',
    sipMonthly: '0',
    sipDay: '5th of month'
  });

  // Calculate Aggregated Metrics
  const { totalInvested, totalCurrentValue, totalGain, totalGainPct, dayGain, activeSipTotal } = useMemo(() => {
    let invested = 0;
    let current = 0;
    let sips = 0;

    holdings.forEach((h) => {
      invested += h.quantity * h.buyAvg;
      current += h.quantity * h.cmp;
      sips += Number(h.sipMonthly || 0);
    });

    const gain = current - invested;
    const gainPct = invested > 0 ? ((gain / invested) * 100).toFixed(2) : '0.00';
    const day = current * 0.0071; // +0.71% 1-day estimated return

    return {
      totalInvested: invested,
      totalCurrentValue: current,
      totalGain: gain,
      totalGainPct: gainPct,
      dayGain: day,
      activeSipTotal: sips
    };
  }, [holdings]);

  // Asset class summary for charts
  const assetClasses = useMemo(() => {
    const map = {};
    holdings.forEach((h) => {
      const val = h.quantity * h.cmp;
      if (!map[h.assetClass]) {
        map[h.assetClass] = {
          name: h.assetClass,
          icon: h.icon,
          color: h.color,
          value: 0
        };
      }
      map[h.assetClass].value += val;
    });

    return Object.values(map).map((item) => ({
      ...item,
      pct: totalCurrentValue > 0 ? ((item.value / totalCurrentValue) * 100).toFixed(1) : 0
    }));
  }, [holdings, totalCurrentValue]);

  // Save to LocalStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('smart_expenses_investments', JSON.stringify(holdings));
    } catch {}
  }, [holdings]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  const handleAddHolding = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.quantity || !formData.buyAvg || !formData.cmp) {
      alert('Please fill out all required investment fields.');
      return;
    }

    const iconMap = {
      'Equities': '📈',
      'Mutual Funds': '🏦',
      'Gold & SGBs': '🪙',
      'Debt & FDs': '🛡️',
      'Crypto': '⚡',
      'Real Estate': '🏡'
    };

    const colorMap = {
      'Equities': '#38bdf8',
      'Mutual Funds': '#818cf8',
      'Gold & SGBs': '#fbbf24',
      'Debt & FDs': '#34d399',
      'Crypto': '#f43f5e',
      'Real Estate': '#a78bfa'
    };

    const newEntry = {
      id: `inv-${Date.now()}`,
      symbol: formData.symbol.toUpperCase() || formData.name.substring(0, 6).toUpperCase(),
      name: formData.name,
      assetClass: formData.assetClass,
      icon: iconMap[formData.assetClass] || '💼',
      color: colorMap[formData.assetClass] || '#38bdf8',
      quantity: parseFloat(formData.quantity),
      buyAvg: parseFloat(formData.buyAvg),
      cmp: parseFloat(formData.cmp),
      sipMonthly: parseFloat(formData.sipMonthly || 0),
      sipDay: formData.sipDay || '5th of month'
    };

    setHoldings([newEntry, ...holdings]);
    setNotification(`✅ Added "${newEntry.name}" to your investment portfolio!`);
    setIsModalOpen(false);
    setFormData({
      symbol: '',
      name: '',
      assetClass: 'Equities',
      quantity: '',
      buyAvg: '',
      cmp: '',
      sipMonthly: '0',
      sipDay: '5th of month'
    });

    setTimeout(() => setNotification(''), 4000);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from your portfolio?`)) {
      setHoldings(holdings.filter((h) => h.id !== id));
      setNotification(`Removed "${name}" from investments.`);
      setTimeout(() => setNotification(''), 3000);
    }
  };

  const filteredHoldings = holdings.filter((h) => {
    const matchClass = filterClass === 'All' || h.assetClass === filterClass;
    const matchSearch = h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        h.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        h.assetClass.toLowerCase().includes(searchTerm.toLowerCase());
    return matchClass && matchSearch;
  });

  return (
    <div style={{ color: '#ffffff' }}>
      {/* Page Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '1.25rem',
        marginBottom: '1.75rem'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 800, 
            letterSpacing: '-0.02em', 
            marginBottom: '0.35rem',
            color: '#ffffff'
          }}>
            Investments & Portfolio Hub
          </h1>
          <p style={{ color: '#93c5fd', fontSize: '0.95rem' }}>
            Unified tracking for Equities, Mutual Fund SIPs, Gold, Fixed Deposits, and Crypto assets.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            padding: '0.75rem 1.4rem',
            borderRadius: '12px',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.9rem',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            boxShadow: '0 4px 15px rgba(37, 99, 235, 0.45)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease'
          }}
        >
          <span>➕</span>
          <span>Add Investment / SIP</span>
        </button>
      </div>

      {notification && (
        <div style={{
          padding: '0.9rem 1.4rem',
          borderRadius: '14px',
          backgroundColor: 'rgba(56, 189, 248, 0.15)',
          border: '1px solid rgba(56, 189, 248, 0.4)',
          color: '#7dd3fc',
          fontSize: '0.9rem',
          fontWeight: 600,
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>{notification}</span>
          <button onClick={() => setNotification('')} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>✕</button>
        </div>
      )}

      {/* Main Portfolio KPI Hero Card */}
      <div className="investments-hero-card">
        <div style={{ flex: '1 1 280px', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.88rem', color: '#93c5fd', fontWeight: 600 }}>Total Portfolio Net Worth</span>
            <span style={{
              padding: '0.2rem 0.65rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(56, 189, 248, 0.2)',
              fontSize: '0.75rem',
              color: '#38bdf8',
              fontWeight: 700
            }}>
              INR (₹)
            </span>
          </div>

          <div className="investments-networth-display">
            ₹{Math.round(totalCurrentValue).toLocaleString('en-IN')}<span style={{ fontSize: '0.65em', opacity: 0.85 }}>.00</span>
          </div>

          {/* Real-time Returns Tag */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.3rem 0.85rem',
              borderRadius: '9999px',
              backgroundColor: totalGain >= 0 ? 'rgba(52, 211, 153, 0.15)' : 'rgba(244, 63, 94, 0.15)',
              border: `1px solid ${totalGain >= 0 ? 'rgba(52, 211, 153, 0.35)' : 'rgba(244, 63, 94, 0.35)'}`,
              color: totalGain >= 0 ? '#6ee7b7' : '#fca5a5',
              fontSize: '0.88rem',
              fontWeight: 700
            }}>
              <span>{totalGain >= 0 ? '↗' : '↘'}</span>
              <span>{totalGain >= 0 ? '+' : ''}₹{Math.round(totalGain).toLocaleString('en-IN')} ({totalGainPct}%) Overall Returns</span>
            </div>

            <span style={{ fontSize: '0.85rem', color: '#93c5fd' }}>
              Today's Gain: <strong style={{ color: '#34d399' }}>+₹{Math.round(dayGain).toLocaleString('en-IN')} (+0.71%)</strong>
            </span>

            <span style={{ fontSize: '0.85rem', color: '#93c5fd' }}>
              XIRR / CAGR: <strong style={{ color: '#38bdf8' }}>16.4% p.a.</strong>
            </span>
          </div>

          <p style={{ color: '#bfdbfe', fontSize: '0.92rem', marginTop: '1.25rem', maxWidth: '520px' }}>
            Aggregated real-time valuation across Indian direct equities, mutual funds, gold bonds, and recurring monthly SIP commitments.
          </p>
        </div>

        {/* Invested vs Current Mini Summary Box */}
        <div style={{
          background: 'rgba(8, 22, 48, 0.75)',
          borderRadius: '22px',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          padding: '1.5rem',
          minWidth: '260px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: '#93c5fd', fontWeight: 700, letterSpacing: '0.05em' }}>
            Capital & Commitment
          </div>

          <div>
            <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>Total Invested Capital</div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff' }}>
              ₹{Math.round(totalInvested).toLocaleString('en-IN')}.00
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '0.75rem' }}>
            <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>Monthly SIP Commitment</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8' }}>
              ₹{activeSipTotal.toLocaleString('en-IN')}/mo
            </div>
            <div style={{ fontSize: '0.74rem', color: '#93c5fd', marginTop: '0.2rem' }}>
              Auto-debits across {holdings.filter(h => h.sipMonthly > 0).length} active funds
            </div>
          </div>
        </div>
      </div>

      {/* Asset Allocation Breakdown Progress Tracks */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.06)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '24px',
        padding: '1.75rem 2rem',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>
              Asset Allocation & Diversification
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#93c5fd' }}>
              Proportional distribution of assets to maintain balanced risk tolerance.
            </p>
          </div>
          <span style={{ fontSize: '0.82rem', padding: '0.3rem 0.75rem', borderRadius: '9999px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontWeight: 600 }}>
            {assetClasses.length} Asset Classes Active
          </span>
        </div>

        {/* Multi-Segment Allocation Bar */}
        <div style={{
          height: '14px',
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '9999px',
          display: 'flex',
          overflow: 'hidden',
          marginBottom: '1.5rem'
        }}>
          {assetClasses.map((item) => (
            <div
              key={item.name}
              style={{
                width: `${item.pct}%`,
                backgroundColor: item.color,
                transition: 'width 0.3s ease'
              }}
              title={`${item.name}: ${item.pct}% (₹${Math.round(item.value).toLocaleString('en-IN')})`}
            />
          ))}
        </div>

        {/* Category Pills Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem'
        }}>
          {assetClasses.map((item) => (
            <div
              key={item.name}
              style={{
                background: 'rgba(8, 22, 48, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '14px',
                padding: '0.85rem 1rem',
                borderLeft: `4px solid ${item.color}`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.84rem', color: '#e2e8f0', fontWeight: 600 }}>
                  {item.icon} {item.name}
                </span>
                <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#38bdf8' }}>
                  {item.pct}%
                </span>
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginTop: '0.35rem' }}>
                ₹{Math.round(item.value).toLocaleString('en-IN')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Holdings & Positions Table */}
      <div className="sheet-porcelain" style={{ borderRadius: '28px', padding: '1.75rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-dark)' }}>
              Holdings & Active Positions
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-dark-muted)', marginTop: '0.15rem' }}>
              Real-time positions ledger with current market price (CMP) and return analytics.
            </p>
          </div>

          {/* Search & Asset Filter */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search symbol, fund..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                fontSize: '0.86rem',
                backgroundColor: '#f8fafc',
                color: '#0f172a',
                outline: 'none',
                minWidth: '200px'
              }}
            />

            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                fontSize: '0.86rem',
                backgroundColor: '#f8fafc',
                color: '#0f172a',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="All">All Asset Classes</option>
              <option value="Equities">Equities</option>
              <option value="Mutual Funds">Mutual Funds</option>
              <option value="Gold & SGBs">Gold & SGBs</option>
              <option value="Debt & FDs">Debt & FDs</option>
              <option value="Crypto">Crypto</option>
            </select>
          </div>
        </div>

        {/* Table View */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: 'var(--text-dark)' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', fontSize: '0.78rem', textTransform: 'uppercase', color: '#64748b' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Asset / Instrument</th>
                <th style={{ padding: '0.75rem 1rem' }}>Class</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Qty</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Avg Buy</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>CMP</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Current Value</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Total Returns</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredHoldings.map((h) => {
                const investedVal = h.quantity * h.buyAvg;
                const currVal = h.quantity * h.cmp;
                const gain = currVal - investedVal;
                const gainPct = investedVal > 0 ? ((gain / investedVal) * 100).toFixed(1) : 0;
                const isProfit = gain >= 0;

                return (
                  <tr key={h.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s ease' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1.4rem' }}>{h.icon}</span>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{h.name}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.2rem' }}>
                            <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>{h.symbol}</span>
                            {h.sipMonthly > 0 && (
                              <span style={{
                                fontSize: '0.72rem',
                                padding: '0.15rem 0.5rem',
                                borderRadius: '6px',
                                backgroundColor: '#ecfdf5',
                                color: '#059669',
                                fontWeight: 700,
                                border: '1px solid #a7f3d0'
                              }}>
                                🔄 SIP: ₹{h.sipMonthly.toLocaleString('en-IN')}/mo ({h.sipDay})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        fontSize: '0.75rem',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '9999px',
                        backgroundColor: '#eff6ff',
                        color: '#2563eb',
                        fontWeight: 600
                      }}>
                        {h.assetClass}
                      </span>
                    </td>

                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, fontSize: '0.88rem' }}>
                      {h.quantity}
                    </td>

                    <td style={{ padding: '1rem', textAlign: 'right', fontSize: '0.88rem', color: '#64748b' }}>
                      ₹{h.buyAvg.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>

                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 700, fontSize: '0.9rem' }}>
                      ₹{h.cmp.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>

                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 800, fontSize: '0.98rem' }}>
                      ₹{Math.round(currVal).toLocaleString('en-IN')}
                    </td>

                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <span style={{
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        padding: '0.25rem 0.65rem',
                        borderRadius: '9999px',
                        backgroundColor: isProfit ? '#dcfce7' : '#fee2e2',
                        color: isProfit ? '#16a34a' : '#dc2626'
                      }}>
                        {isProfit ? '↗ +' : '↘ '}₹{Math.abs(Math.round(gain)).toLocaleString('en-IN')} ({gainPct}%)
                      </span>
                    </td>

                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <button
                        onClick={() => handleDelete(h.id, h.name)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#94a3b8',
                          fontSize: '1rem',
                          cursor: 'pointer',
                          padding: '0.3rem',
                          borderRadius: '6px'
                        }}
                        title="Delete holding"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Holding Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(22, 61, 125, 0.95) 0%, rgba(9, 26, 56, 0.98) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '24px',
            padding: '2rem',
            width: '100%',
            maxWidth: '540px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                Add New Investment / SIP
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#93c5fd', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddHolding}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#93c5fd', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Asset Class *
                  </label>
                  <select
                    value={formData.assetClass}
                    onChange={(e) => setFormData({ ...formData, assetClass: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(8, 22, 48, 0.9)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#ffffff',
                      fontSize: '0.88rem'
                    }}
                  >
                    <option value="Equities">Equities / Direct Stocks</option>
                    <option value="Mutual Funds">Mutual Funds / Index SIPs</option>
                    <option value="Gold & SGBs">Gold & SGBs</option>
                    <option value="Debt & FDs">Fixed Deposits & Debt</option>
                    <option value="Crypto">Crypto & Digital Assets</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#93c5fd', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Ticker / Symbol
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. RELIANCE, NIFTYBEES"
                    value={formData.symbol}
                    onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(8, 22, 48, 0.9)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#ffffff',
                      fontSize: '0.88rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#93c5fd', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Instrument / Fund Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HDFC Top 100 Fund, Tata Steel"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(8, 22, 48, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#ffffff',
                    fontSize: '0.88rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#93c5fd', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Quantity *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="e.g. 50"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(8, 22, 48, 0.9)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#ffffff',
                      fontSize: '0.88rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#93c5fd', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Avg Buy (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="e.g. 1500"
                    value={formData.buyAvg}
                    onChange={(e) => setFormData({ ...formData, buyAvg: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(8, 22, 48, 0.9)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#ffffff',
                      fontSize: '0.88rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#93c5fd', fontWeight: 600, marginBottom: '0.35rem' }}>
                    CMP (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="e.g. 1650"
                    value={formData.cmp}
                    onChange={(e) => setFormData({ ...formData, cmp: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(8, 22, 48, 0.9)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#ffffff',
                      fontSize: '0.88rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#93c5fd', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Monthly SIP (₹) (Optional)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 5000"
                    value={formData.sipMonthly}
                    onChange={(e) => setFormData({ ...formData, sipMonthly: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(8, 22, 48, 0.9)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#ffffff',
                      fontSize: '0.88rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#93c5fd', fontWeight: 600, marginBottom: '0.35rem' }}>
                    SIP Debit Date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 10th of month"
                    value={formData.sipDay}
                    onChange={(e) => setFormData({ ...formData, sipDay: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(8, 22, 48, 0.9)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#ffffff',
                      fontSize: '0.88rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: '0.7rem 1.25rem',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    color: '#e2e8f0',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.7rem 1.6rem',
                    borderRadius: '10px',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 700,
                    boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)'
                  }}
                >
                  Save Investment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .investments-hero-card {
          background: linear-gradient(135deg, rgba(22, 61, 125, 0.75) 0%, rgba(9, 26, 56, 0.9) 100%);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 28px;
          padding: 2.25rem;
          margin-bottom: 2rem;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45);
          display: flex;
          justifyContent: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 2rem;
          width: 100%;
          box-sizing: border-box;
        }

        .investments-networth-display {
          font-size: clamp(2rem, 7vw, 3.2rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #fff;
          line-height: 1.15;
          margin-top: 0.15rem;
        }

        @media (max-width: 768px) {
          .investments-hero-card {
            padding: 1.4rem 1.15rem;
            border-radius: 22px;
            gap: 1.25rem;
          }
        }

        @media (max-width: 420px) {
          .investments-hero-card {
            padding: 1.15rem 0.9rem;
            border-radius: 18px;
          }
        }
      `}</style>
    </div>
  );
}

