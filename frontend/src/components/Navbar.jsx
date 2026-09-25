import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/dashboard', label: 'Wallet & Overview' },
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
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          fontWeight: 800,
          fontSize: '1.25rem',
          letterSpacing: '-0.02em',
          color: '#ffffff'
        }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #38bdf8, #2563eb)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(56, 189, 248, 0.5)',
            color: '#fff',
            fontSize: '1.1rem'
          }}>
            ⚡
          </div>
          <span style={{
            fontSize: '1.35rem',
            background: 'linear-gradient(135deg, #ffffff 40%, #93c5fd 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block',
            fontWeight: 800,
          }}>
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

          {/* User Avatar & Notifications (matching phone header from reference) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginLeft: '0.5rem' }}>
            <button
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#e2e8f0',
                cursor: 'pointer'
              }}
              title="Notifications"
            >
              🔔
            </button>

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
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              style={({ isActive }) => ({
                padding: '0.65rem 0.9rem',
                borderRadius: '8px',
                color: isActive ? '#fff' : '#cbd5e1',
                backgroundColor: isActive ? '#2563eb' : 'transparent',
                fontSize: '0.9rem',
                fontWeight: 600
              })}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
