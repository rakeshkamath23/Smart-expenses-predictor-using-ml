import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      backgroundColor: 'rgba(9, 6, 22, 0.9)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      padding: '1.75rem 0',
      color: 'var(--text-subtle)',
      fontSize: '0.85rem'
    }}>
      <div className="container" style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div>
          <strong style={{ color: 'var(--text-muted)' }}>Smart Expenses</strong> &copy; {new Date().getFullYear()} — Intelligent Expense Prediction & Tracking Platform.
        </div>
        <div style={{ display: 'flex', gap: '1.25rem' }}>
          <span>Django 5 + DRF</span>
          <span>&bull;</span>
          <span>React + Vite</span>
          <span>&bull;</span>
          <span>Supabase PostgreSQL</span>
          <span>&bull;</span>
          <span>Scikit-Learn ML</span>
        </div>
      </div>
    </footer>
  );
}
