import React from 'react';
import { NavLink, Link } from 'react-router-dom';

export default function Sidebar() {
  const menuItems = [
    { to: '/dashboard', label: 'Wallet & Overview', icon: '💳', end: true },
    { to: '/dashboard/analysis', label: 'Bubble Analytics', icon: '🔮', isSpecial: true },
    { to: '/dashboard/add-expense', label: 'Deposit / Expense', icon: '➕' },
    { to: '/dashboard/history', label: 'Recent Transactions', icon: '📋' },
    { to: '/dashboard/prediction', label: 'ML Prediction', icon: '🤖' },
    { to: '/dashboard/budget', label: 'Budget Targets', icon: '🎯' },
    { to: '/dashboard/reports', label: 'Reports & Export', icon: '📑' },
    { to: '/chat', label: 'AI Financial Copilot', icon: '✦' },
    { to: '/dashboard/profile', label: 'Account Profile', icon: '👤' },
  ];

  return (
    <aside style={{
      width: '260px',
      backgroundColor: 'rgba(8, 22, 48, 0.85)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderRight: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '1.5rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.4rem',
      minHeight: 'calc(100vh - 72px)'
    }}>
      <div style={{
        padding: '0 0.75rem 0.85rem',
        fontSize: '0.74rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: 'var(--text-royal-muted)',
      }}>
        Finance Hub
      </div>

      {menuItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.65rem 1rem',
            borderRadius: '12px',
            color: isActive ? '#ffffff' : '#bfdbfe',
            backgroundColor: isActive ? '#2563eb' : 'transparent',
            border: isActive ? '1px solid rgba(255, 255, 255, 0.25)' : '1px solid transparent',
            boxShadow: isActive ? '0 4px 15px rgba(37, 99, 235, 0.45)' : 'none',
            fontWeight: isActive ? 600 : 500,
            fontSize: '0.88rem',
            transition: 'var(--transition)'
          })}
        >
          <span style={{ fontSize: '1.05rem', width: '22px', textAlign: 'center' }}>{item.icon}</span>
          <span>{item.label}</span>
          {item.isSpecial && (
            <span style={{
              marginLeft: 'auto',
              fontSize: '0.65rem',
              fontWeight: 700,
              padding: '0.15rem 0.45rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(56, 189, 248, 0.25)',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.4)'
            }}>
              3D
            </span>
          )}
        </NavLink>
      ))}

      {/* Quick Launch Card */}
      <div style={{
        marginTop: 'auto',
        padding: '1rem',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.2) 0%, rgba(13, 37, 82, 0.3) 100%)',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        color: '#fff',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.25rem' }}>Titanium Card</div>
        <div style={{ fontSize: '0.74rem', color: '#93c5fd', marginBottom: '0.75rem' }}>Automated Expense ML Active</div>
        <Link
          to="/dashboard/add-expense"
          className="btn btn-primary"
          style={{ width: '100%', fontSize: '0.78rem', padding: '0.45rem' }}
        >
          + Quick Entry
        </Link>
      </div>
    </aside>
  );
}
