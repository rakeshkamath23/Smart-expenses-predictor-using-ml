import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { deleteTransaction } from '../utils/transactionStore';
import { playNotificationSound } from '../utils/smsParser';

export default function BankNotificationBanner() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const handleBankNotification = (event) => {
      const data = event.detail;
      if (!data) return;

      // Check sound preference (default: true)
      const soundPref = localStorage.getItem('smart_expenses_sound_enabled');
      if (soundPref !== 'false') {
        playNotificationSound();
      }

      const id = Date.now() + Math.random();
      const notificationItem = {
        id,
        ...data,
        createdAt: new Date()
      };

      setNotifications((prev) => [notificationItem, ...prev.slice(0, 2)]);

      // Auto dismiss after 7 seconds
      setTimeout(() => {
        setNotifications((current) => current.filter((n) => n.id !== id));
      }, 7000);
    };

    window.addEventListener('smart_expenses_bank_notification_received', handleBankNotification);
    return () => {
      window.removeEventListener('smart_expenses_bank_notification_received', handleBankNotification);
    };
  }, []);

  const handleDismiss = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleUndo = (item) => {
    if (item.txId) {
      deleteTransaction(item.txId);
    }
    handleDismiss(item.id);
  };

  if (notifications.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '84px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      maxWidth: '420px',
      width: 'calc(100vw - 48px)',
      pointerEvents: 'none'
    }}>
      {notifications.map((n) => (
        <div
          key={n.id}
          style={{
            pointerEvents: 'auto',
            background: 'rgba(10, 25, 55, 0.95)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: `1.5px solid ${n.isIncome ? 'rgba(52, 211, 153, 0.5)' : 'rgba(56, 189, 248, 0.5)'}`,
            borderRadius: '18px',
            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.7), 0 0 25px rgba(56, 189, 248, 0.25)',
            padding: '1.1rem 1.25rem',
            color: '#ffffff',
            position: 'relative',
            overflow: 'hidden',
            animation: 'slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Animated top progress bar */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: n.isIncome ? 'linear-gradient(90deg, #10b981, #34d399)' : 'linear-gradient(90deg, #38bdf8, #2563eb)',
            animation: 'notificationProgress 7s linear forwards'
          }} />

          {/* Header Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem' }}>{n.bankIcon || '🔔'}</span>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.01em' }}>
                  {n.bankName || 'Bank Alert'}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                  {n.source || 'Incoming Bank SMS'} • Just now
                </span>
              </div>
            </div>

            <button
              onClick={() => handleDismiss(n.id)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                color: '#94a3b8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                lineHeight: 1
              }}
              aria-label="Close notification"
            >
              ✕
            </button>
          </div>

          {/* Amount & Merchant */}
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '0.65rem 0.85rem',
            borderRadius: '12px',
            marginBottom: '0.75rem'
          }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                {n.isIncome ? 'Credit Received' : 'Auto-Debited'}
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginTop: '0.1rem', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {n.merchant}
              </div>
            </div>

            <div style={{
              fontSize: '1.35rem',
              fontWeight: 800,
              color: n.isIncome ? '#34d399' : '#f43f5e',
              fontVariantNumeric: 'tabular-nums'
            }}>
              {n.isIncome ? '+' : '-'}₹{n.amount ? n.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}
            </div>
          </div>

          {/* Category & Status Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.76rem', color: '#cbd5e1', marginBottom: '0.85rem' }}>
            <span style={{
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              color: '#7dd3fc',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              fontWeight: 600
            }}>
              🏷️ {n.category}
            </span>

            <span style={{ color: '#86efac', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span>⚡</span> Auto-Logged to Ledger
            </span>
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link
              to="/dashboard/history"
              onClick={() => handleDismiss(n.id)}
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '0.45rem 0.75rem',
                borderRadius: '9px',
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                color: '#ffffff',
                fontSize: '0.78rem',
                fontWeight: 700,
                textDecoration: 'none',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              View in Ledger &rarr;
            </Link>

            {n.txId && (
              <button
                type="button"
                onClick={() => handleUndo(n)}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: '9px',
                  background: 'rgba(244, 63, 94, 0.15)',
                  color: '#fca5a5',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  border: '1px solid rgba(244, 63, 94, 0.35)',
                  cursor: 'pointer'
                }}
              >
                ↩ Undo
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Global CSS animation injected inline */}
      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(60px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        @keyframes notificationProgress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}
