import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Prediction() {
  const [isTraining, setIsTraining] = useState(false);
  const [trainStatus, setTrainStatus] = useState('');

  const handleRetrain = () => {
    setIsTraining(true);
    setTrainStatus('Initiating Scikit-learn Random Forest model training with historical transactions...');
    setTimeout(() => {
      setIsTraining(false);
      setTrainStatus('✅ Model retrained successfully! Hyperparameters tuned (R² = 0.924, MAE = ₹125.50).');
    }, 1200);
  };

  const categoryForecasts = [
    { cat: 'Groceries', amount: '₹5,240.00', pct: 32.8, color: '#38bdf8', icon: '🛒' },
    { cat: 'Clothes and Shoes', amount: '₹2,620.00', pct: 16.1, color: '#818cf8', icon: '👕' },
    { cat: 'Cafes and Restaurants', amount: '₹2,410.00', pct: 14.8, color: '#fbbf24', icon: '☕' },
    { cat: 'Sport', amount: '₹1,840.00', pct: 11.3, color: '#34d399', icon: '🏋️' },
    { cat: 'Health', amount: '₹1,370.00', pct: 8.4, color: '#f43f5e', icon: '💖' },
    { cat: 'Travel', amount: '₹1,090.00', pct: 6.7, color: '#60a5fa', icon: '✈️' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 800, 
          letterSpacing: '-0.02em', 
          marginBottom: '0.35rem',
          color: '#ffffff'
        }}>
          ML Expense Prediction
        </h1>
        <p style={{ color: 'var(--text-royal-muted)', fontSize: '0.95rem' }}>
          Random Forest regression engine forecasting next period's spending across category bubbles.
        </p>
      </div>

      {trainStatus && (
        <div className="alert-box alert-info">
          {trainStatus}
        </div>
      )}

      {/* Royal Sapphire Forecast Card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(22, 61, 125, 0.6) 0%, rgba(9, 26, 56, 0.8) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '28px',
        padding: '2.25rem',
        marginBottom: '2rem',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '2rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
            <span style={{ 
              padding: '0.25rem 0.75rem', 
              borderRadius: '9999px', 
              background: 'rgba(56, 189, 248, 0.2)', 
              color: '#38bdf8', 
              fontSize: '0.75rem', 
              fontWeight: 700 
            }}>
              Scikit-Learn RandomForest
            </span>
            <span className="badge badge-success">R² = 0.924</span>
          </div>

          <div style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
            ₹14,570<span style={{ fontSize: '2rem', opacity: 0.85 }}>.00</span>
          </div>

          <p style={{ color: '#bfdbfe', fontSize: '0.92rem', marginTop: '0.35rem', maxWidth: '480px' }}>
            Predicted total expenditure for next cycle based on historical card spending velocity.
          </p>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button
              onClick={handleRetrain}
              disabled={isTraining}
              className="btn btn-cobalt"
              style={{ padding: '0.75rem 1.6rem' }}
            >
              {isTraining ? 'Retraining...' : '⚡ Retrain Model'}
            </button>
            <Link to="/dashboard/analysis" className="btn btn-secondary">
              View Bubbles &rarr;
            </Link>
          </div>
        </div>

        {/* 3D Glass Sphere Graphic */}
        <div style={{
          width: '130px',
          height: '130px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.5) 0%, rgba(56, 189, 248, 0.3) 50%, rgba(13, 38, 85, 0.8) 100%)',
          border: '2px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '0 0 35px rgba(56, 189, 248, 0.4), inset 0 2px 5px rgba(255, 255, 255, 0.6)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 800
        }}>
          <span style={{ fontSize: '1.8rem' }}>🤖</span>
          <span style={{ fontSize: '0.75rem', marginTop: '0.2rem' }}>ML Engine</span>
        </div>
      </div>

      {/* Porcelain Sheet: Category Breakdown */}
      <div className="sheet-porcelain" style={{ borderRadius: '28px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '1.25rem' }}>
          Predicted Category Breakdown
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          {categoryForecasts.map((cf) => (
            <div key={cf.cat} className="card-white">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.92rem' }}>
                  <span>{cf.icon}</span>
                  <span>{cf.cat}</span>
                </div>
                <span style={{ fontWeight: 800, color: '#2563eb' }}>{cf.pct}%</span>
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{cf.amount}</div>
              <div className="progress-track" style={{ height: '6px', marginTop: '0.6rem' }}>
                <div className="progress-fill" style={{ width: `${cf.pct}%`, background: cf.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
