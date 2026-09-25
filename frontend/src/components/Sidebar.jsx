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
          <span style={{ fontSize: '1.05rem' }}>{item.icon}</span>
          <span>{item.label}</span>
        </NavLink>
      ))}

      {/* Mini Active Card Preview (matching screen 1 card) */}
      <Link to="/dashboard/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{
          marginTop: 'auto',
          padding: '1rem',
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.4) 0%, rgba(13, 37, 82, 0.6) 100%)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.2s ease',
          cursor: 'pointer'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div style={{
              width: '26px',
              height: '18px',
              borderRadius: '4px',
              background: 'linear-gradient(135deg, #ffd700, #e6b800)',
            }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>
              {(() => {
                try {
                  const s = localStorage.getItem('smart_expenses_cards');
                  if (s) {
                    const p = JSON.parse(s);
                    const pri = p.find(c => c.isPrimary) || p[0];
                    return pri?.network || 'VISA';
                  }
                } catch {}
                return 'VISA';
              })()}
            </span>
          </div>
          <div style={{ fontSize: '0.82rem', fontFamily: 'monospace', letterSpacing: '0.12em', color: '#e2e8f0', marginBottom: '0.35rem' }}>
            •••• {(() => {
              try {
                const s = localStorage.getItem('smart_expenses_cards');
                if (s) {
                  const p = JSON.parse(s);
                  const pri = p.find(c => c.isPrimary) || p[0];
                  return pri?.last4 || '9286';
                }
              } catch {}
              return '9286';
            })()}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#93c5fd' }}>
            <span>MANAGE</span>
            <span style={{ color: '#38bdf8', fontWeight: 700 }}>+ ADD</span>
          </div>
        </div>
      </Link>
    </aside>
  );
}
