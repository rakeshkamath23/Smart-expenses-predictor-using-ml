import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '6rem 1.5rem',
      textAlign: 'center'
    }}>
      <div className="card" style={{ maxWidth: '500px', width: '100%', padding: '3rem 2rem' }}>
        <div style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>
          404
        </div>
        <h2 style={{ fontSize: '1.5rem', margin: '1rem 0 0.5rem' }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary">
          &larr; Return to Home
        </Link>
      </div>
    </div>
  );
}
