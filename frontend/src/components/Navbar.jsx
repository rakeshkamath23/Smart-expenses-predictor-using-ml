import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { getBankNotificationAuditLog } from '../utils/transactionStore';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [recentAudit, setRecentAudit] = useState(() => getBankNotificationAuditLog());
  const notifDropdownRef = useRef(null);

  useEffect(() => {
    const updateAudit = () => {
      setRecentAudit(getBankNotificationAuditLog());
    };
    window.addEventListener('smart_expenses_bank_audit_updated', updateAudit);
    window.addEventListener('smart_expenses_transactions_updated', updateAudit);

    const handleClickOutside = (e) => {
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('smart_expenses_bank_audit_updated', updateAudit);
      window.removeEventListener('smart_expenses_transactions_updated', updateAudit);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navLinks = [
    { to: '/dashboard', label: 'Wallet & Overview' },
    { to: '/dashboard/investments', label: 'Investments' },
    { to: '/dashboard/analysis', label: 'Bubble Analytics' },
    { to: '/dashboard/add-expense', label: 'Add Expense' },
    { to: '/dashboard/history', label: 'History' },
    { to: '/dashboard/prediction', label: 'ML Prediction' },
    { to: '/dashboard/budget', label: 'Budget Plan' },
    { to: '/dashboard/reports', label: 'Reports' },
    { to: '/chat', label: '✦ AI Copilot', isHighlight: true },
  ];

  return (
    <nav style={{
      backgroundColor: 'rgba(8, 22, 48, 0.9)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px'
      }}>
        {/* Brand */}
        <Link 
          to="/opening" 
          className="brand-logo-link"
          title="Return to Opening Animation"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            fontWeight: 800,
            fontSize: '1.25rem',
            letterSpacing: '-0.02em',
            color: '#ffffff',
            textDecoration: 'none',
            cursor: 'pointer',
          }}
        >
          <div 
            className="brand-icon-box"
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #38bdf8, #2563eb)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(56, 189, 248, 0.5)',
              color: '#fff',
              fontSize: '1.1rem',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
          >
            ⚡
          </div>
          <span 
            className="brand-title-text"
            style={{
              fontSize: '1.35rem',
              background: 'linear-gradient(135deg, #ffffff 40%, #93c5fd 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block',
              fontWeight: 800,
              transition: 'filter 0.2s ease',
            }}
          >
            Smart Expenses
          </span>
        </Link>

        {/* Desktop Links */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }} className="desktop-nav">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/dashboard'}
              style={({ isActive }) => ({
                fontSize: '0.86rem',
                fontWeight: (isActive || link.isHighlight) ? 600 : 500,
                color: isActive ? '#ffffff' : (link.isHighlight ? '#7dd3fc' : '#bfdbfe'),
                padding: '0.45rem 0.85rem',
                borderRadius: '9999px',
                backgroundColor: isActive 
                  ? '#2563eb' 
                  : (link.isHighlight ? 'rgba(56, 189, 248, 0.15)' : 'transparent'),
                border: isActive 
                  ? '1px solid rgba(255, 255, 255, 0.25)' 
                  : (link.isHighlight ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid transparent'),
                boxShadow: isActive ? '0 4px 15px rgba(37, 99, 235, 0.45)' : 'none',
                transition: 'all 0.2s ease',
              })}
            >
              {link.label}
            </NavLink>
          ))}

          {/* User Avatar & Notifications */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginLeft: '0.5rem', position: 'relative' }} ref={notifDropdownRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: showNotifications ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                border: `1px solid ${showNotifications ? 'rgba(56, 189, 248, 0.5)' : 'rgba(255, 255, 255, 0.15)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#e2e8f0',
                cursor: 'pointer',
                position: 'relative'
              }}
              title="Bank Alerts & Notifications"
            >
              <span>🔔</span>
              {recentAudit.length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-3px',
                  right: '-3px',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#ffffff',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)',
                  border: '1.5px solid #081630'
                }}>
                  {recentAudit.length > 9 ? '9+' : recentAudit.length}
                </span>
              )}
            </button>

            {/* Notification Dropdown Popover */}
            {showNotifications && (
              <div style={{
                position: 'absolute',
                top: '46px',
                right: '0',
                width: '340px',
                background: 'rgba(9, 23, 50, 0.98)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: '16px',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.7), 0 0 20px rgba(56, 189, 248, 0.2)',
                padding: '1rem',
                zIndex: 100,
                color: '#ffffff'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', paddingBottom: '0.6rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontSize: '1rem' }}>⚡</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f8fafc' }}>Bank SMS Alerts</span>
                  </div>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.5rem',
                    borderRadius: '9999px',
                    background: 'rgba(16, 185, 129, 0.2)',
                    color: '#6ee7b7',
                    border: '1px solid rgba(16, 185, 129, 0.35)'
                  }}>
                    🟢 Live Listener
                  </span>
                </div>

                <div style={{ maxHeight: '240px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {recentAudit.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '1.5rem 0.5rem', color: '#94a3b8', fontSize: '0.82rem' }}>
                      <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>📬</div>
                      No bank alerts captured yet.
                      <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '0.2rem' }}>
                        Notifications arrive automatically via bank SMS, clipboard or webhook.
                      </div>
                    </div>
                  ) : (
                    recentAudit.slice(0, 5).map((item, idx) => (
                      <div key={idx} style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        padding: '0.6rem 0.75rem',
                        borderRadius: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                          <span style={{ fontSize: '1rem' }}>{item.bankIcon || '🏛️'}</span>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>
                              {item.merchant}
                            </div>
                            <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                              {item.bankName} • {item.category}
                            </div>
                          </div>
                        </div>

                        <div style={{
                          fontSize: '0.9rem',
                          fontWeight: 800,
                          color: item.isIncome ? '#34d399' : '#f43f5e',
                          whiteSpace: 'nowrap'
                        }}>
                          {item.isIncome ? '+' : '-'}₹{item.amount?.toLocaleString('en-IN')}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div style={{ marginTop: '0.8rem', paddingTop: '0.6rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Link
                    to="/dashboard/add-expense"
                    onClick={() => setShowNotifications(false)}
                    style={{
                      fontSize: '0.78rem',
                      color: '#38bdf8',
                      textDecoration: 'none',
                      fontWeight: 700
                    }}
                  >
                    Manage Auto-Listener &rarr;
                  </Link>

                  <Link
                    to="/dashboard/history"
                    onClick={() => setShowNotifications(false)}
                    style={{
                      fontSize: '0.74rem',
                      color: '#94a3b8',
                      textDecoration: 'none'
                    }}
                  >
                    View Ledger
                  </Link>
                </div>
              </div>
            )}

            <Link to="/dashboard/profile" title="Profile">
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #38bdf8, #2563eb)',
                border: '1.5px solid rgba(255, 255, 255, 0.4)',
                boxShadow: '0 0 12px rgba(56, 189, 248, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}>
                RK
              </div>
            </Link>
          </div>
        </div>

        {/* Mobile toggle button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'none',
            color: '#f9fafb',
            fontSize: '1.5rem',
            padding: '0.5rem',
          }}
          className="mobile-toggle"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: 'rgba(8, 22, 48, 0.98)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.14)',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.45rem',
          maxHeight: 'calc(100vh - 72px)',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.65)'
        }}>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              style={({ isActive }) => ({
                padding: '0.7rem 1rem',
                borderRadius: '10px',
                color: isActive ? '#fff' : (link.isHighlight ? '#7dd3fc' : '#cbd5e1'),
                backgroundColor: isActive 
                  ? '#2563eb' 
                  : (link.isHighlight ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.03)'),
                fontSize: '0.92rem',
                fontWeight: 600,
                border: link.isHighlight && !isActive ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              })}
            >
              <span>{link.label}</span>
              {link.isHighlight && <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>AI</span>}
            </NavLink>
          ))}
          <NavLink
            to="/dashboard/profile"
            onClick={() => setMobileMenuOpen(false)}
            style={({ isActive }) => ({
              padding: '0.7rem 1rem',
              borderRadius: '10px',
              color: isActive ? '#fff' : '#cbd5e1',
              backgroundColor: isActive ? '#2563eb' : 'rgba(255, 255, 255, 0.03)',
              fontSize: '0.92rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '0.25rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)'
            })}
          >
            <span>👤</span>
            <span>Account Profile & Cards</span>
          </NavLink>
        </div>
      )}

      <style>{`
        .brand-logo-link {
          cursor: pointer !important;
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease;
        }
        .brand-logo-link:hover {
          opacity: 0.94;
          transform: translateY(-1px);
        }
        .brand-logo-link:hover .brand-icon-box {
          transform: scale(1.08);
          box-shadow: 0 0 22px rgba(56, 189, 248, 0.8) !important;
        }
        .brand-logo-link:hover .brand-title-text {
          filter: drop-shadow(0 0 10px rgba(147, 197, 253, 0.45));
        }
        .brand-logo-link:active {
          transform: translateY(0) scale(0.98);
        }
        @media (max-width: 1024px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
        @media (max-width: 480px) {
          .brand-title-text { font-size: 1.15rem !important; }
          .brand-icon-box { width: 30px !important; height: 30px !important; font-size: 0.95rem !important; }
        }
        @media (max-width: 360px) {
          .brand-title-text { font-size: 1.02rem !important; }
          .mobile-toggle { padding: 0.25rem !important; font-size: 1.35rem !important; }
        }
      `}</style>
    </nav>
  );
}
