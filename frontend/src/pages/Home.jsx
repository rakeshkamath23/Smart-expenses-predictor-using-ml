import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ padding: '3.5rem 0 5rem' }}>
      <div className="container">
        {/* Main Hero Header - matching the center screen: "Modern Tools for Modern Finance" */}
        <div style={{
          textAlign: 'center',
          maxWidth: '850px',
          margin: '0 auto 3rem',
        }}>
          <h1 style={{
            fontSize: '3.8rem',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.035em',
            marginBottom: '1.25rem',
            color: '#ffffff',
            textShadow: '0 4px 25px rgba(0, 0, 0, 0.4)'
          }}>
            Modern Tools<br />for Modern Finance
          </h1>

          <p style={{
            fontSize: '1.15rem',
            color: 'var(--text-royal-muted)',
            lineHeight: 1.6,
            maxWidth: '640px',
            margin: '0 auto 2.5rem'
          }}>
            An intelligent financial ecosystem blending machine learning expense prediction, real-time transaction tracking, and interactive bubble analytics.
          </p>

          {/* Center Screen CTA Bar: "Learn More" + Arrow */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.85rem' }}>
            <Link
              to="/dashboard"
              className="btn btn-primary"
              style={{
                padding: '0.85rem 2.2rem',
                fontSize: '1rem',
                borderRadius: '9999px',
                fontWeight: 700
              }}
            >
              Learn More
            </Link>

            <Link
              to="/dashboard"
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: '#ffffff',
                color: '#0f172a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                fontWeight: 800,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.2s ease'
              }}
              title="Launch Application"
            >
              &rarr;
            </Link>
          </div>
        </div>

        {/* Triple Phone Interface Showcase (Recreating the 3 Screens from Reference Image) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          maxWidth: '1180px',
          margin: '0 auto 4rem',
          alignItems: 'start'
        }}>
          {/* Phone 1: Wallet & Balance Screen */}
          <div style={{
            background: 'linear-gradient(180deg, #0d2857 0%, #153a77 45%, #ffffff 45.1%, #ffffff 100%)',
            borderRadius: '36px',
            border: '2px solid rgba(255, 255, 255, 0.25)',
            boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.6)',
            overflow: 'hidden',
            minHeight: '620px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Upper Sapphire Header */}
            <div style={{ padding: '1.75rem 1.5rem 1.25rem', color: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #38bdf8, #2563eb)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 700
                }}>
                  RK
                </div>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem'
                }}>
                  🔔
                </div>
              </div>

              <div style={{ fontSize: '0.85rem', color: '#93c5fd', fontWeight: 500 }}>Balance</div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.02em', margin: '0.1rem 0 0.5rem' }}>
                ₹12,680<span style={{ fontSize: '1.7rem', opacity: 0.85 }}>.42</span>
              </div>
              <div className="delta-pill-badge" style={{ marginBottom: '1.25rem' }}>
                <span>↗</span>
                <span>2.45% this month</span>
              </div>

              {/* Stacked Payment Card Preview */}
              <div className="smart-payment-card" style={{ height: '140px', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="card-chip" style={{ width: '28px', height: '20px' }} />
                  <span style={{ fontWeight: 800, fontSize: '0.8rem' }}>VISA</span>
                </div>
                <div style={{ fontFamily: 'monospace', letterSpacing: '0.15em', fontSize: '0.95rem' }}>
                  •••• 9286 &nbsp; 08/32
                </div>
              </div>
            </div>

            {/* Lower White Sheet */}
            <div style={{
              background: '#ffffff',
              padding: '1.5rem',
              flex: 1,
              color: '#0f172a',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              {/* Action Pills */}
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <span className="pill-action-btn" style={{ padding: '0.5rem 0.85rem', fontSize: '0.8rem' }}>↗ Deposit</span>
                <span className="pill-action-btn" style={{ padding: '0.5rem 0.85rem', fontSize: '0.8rem' }}>⇄ Transfer</span>
                <span className="pill-action-btn" style={{ padding: '0.5rem 0.85rem', fontSize: '0.8rem' }}>↘ Withdraw</span>
              </div>

              {/* Recent Transactions List */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Recent Transactions</span>
                  <Link to="/dashboard/history" style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>View All</Link>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🎨</div>
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>Adobe Creative Cloud</div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Today, 09:42</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a' }}>-₹1,450.00</div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', fontWeight: 700, fontSize: '0.75rem' }}>S</div>
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>Stripe Payout</div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Today, 08:10</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#16a34a' }}>+₹18,500.00</div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📎</div>
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>Office Supplies</div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Jan 28, 10:22</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a' }}>-₹750.00</div>
                  </div>
                </div>
              </div>

              {/* Bottom Floating Navigation Dock */}
              <div className="floating-dock-bar" style={{ marginTop: '1.25rem', padding: '0.35rem 0.5rem' }}>
                <span className="dock-item-btn active" style={{ width: '34px', height: '34px', fontSize: '0.9rem' }}>💳</span>
                <span className="dock-item-btn" style={{ width: '34px', height: '34px', fontSize: '0.9rem' }}>⇄</span>
                <span className="dock-item-btn" style={{ width: '34px', height: '34px', fontSize: '0.9rem' }}>🕒</span>
                <span className="dock-item-btn" style={{ width: '34px', height: '34px', fontSize: '0.9rem' }}>⊞</span>
              </div>
            </div>
          </div>

          {/* Phone 2: Center Smart Card Showcase Screen */}
          <div style={{
            background: 'linear-gradient(180deg, #091a38 0%, #0d2857 60%, #153a77 100%)',
            borderRadius: '36px',
            border: '2px solid rgba(255, 255, 255, 0.25)',
            boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.6)',
            overflow: 'hidden',
            minHeight: '620px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '2.5rem 1.75rem',
            position: 'relative'
          }}>
            <div>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', lineHeight: 1.15, marginBottom: '0.75rem' }}>
                Modern Tools<br />for Modern<br />Finance
              </h2>
              <p style={{ color: '#93c5fd', fontSize: '0.88rem' }}>
                Physical & virtual titanium debit cards backed by automated expense intelligence.
              </p>
            </div>

            {/* Luxury Matte Black Card */}
            <div className="luxury-black-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="card-chip" />
                <span style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.1em' }}>PLATINUM</span>
              </div>
              <div style={{ fontSize: '1.05rem', fontFamily: 'monospace', letterSpacing: '0.15em' }}>
                •••• 4028
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>SMART EXPENSES</span>
                {/* Minimal metallic geometric badge */}
                <div style={{ width: '28px', height: '28px', border: '2px solid rgba(255,255,255,0.4)', transform: 'rotate(45deg)' }} />
              </div>
            </div>

            {/* Bottom Pill */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', alignItems: 'center' }}>
              <Link to="/dashboard" className="btn btn-primary" style={{ flex: 1, padding: '0.75rem' }}>
                Launch Hub
              </Link>
              <Link to="/dashboard/add-expense" style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: '#fff',
                color: '#0f172a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700
              }}>
                &rarr;
              </Link>
            </div>
          </div>

          {/* Phone 3: Frosted Bubble Analytics Screen */}
          <div style={{
            background: 'linear-gradient(180deg, #0d2857 0%, #153a77 55%, #ffffff 55.1%, #ffffff 100%)',
            borderRadius: '36px',
            border: '2px solid rgba(255, 255, 255, 0.25)',
            boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.6)',
            overflow: 'hidden',
            minHeight: '620px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Upper Bubble Chart Header */}
            <div style={{ padding: '1.5rem', color: '#fff', height: '340px', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.1rem', cursor: 'pointer' }}>&larr;</span>
                <span style={{ fontSize: '1.1rem', cursor: 'pointer' }}>📅</span>
              </div>

              {/* 3D Glass Category Spheres */}
              <div style={{ position: 'relative', width: '100%', height: '280px' }}>
                {/* Dominant Groceries Bubble */}
                <div className="glass-sphere-bubble" style={{ width: '125px', height: '125px', right: '12%', top: '24%', zIndex: 10 }}>
                  <span className="bubble-icon">🛒</span>
                  <span className="bubble-title">Groceries</span>
                  <span className="bubble-pct">32.8%</span>
                </div>

                {/* Clothes Bubble */}
                <div className="glass-sphere-bubble" style={{ width: '92px', height: '92px', left: '10%', top: '8%', zIndex: 5 }}>
                  <span style={{ fontSize: '1rem' }}>👕</span>
                  <span style={{ fontSize: '0.68rem', color: '#cbd5e1' }}>Clothes</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>16.1%</span>
                </div>

                {/* Cafes Bubble */}
                <div className="glass-sphere-bubble" style={{ width: '88px', height: '88px', left: '15%', bottom: '12%', zIndex: 6 }}>
                  <span style={{ fontSize: '1rem' }}>☕</span>
                  <span style={{ fontSize: '0.68rem', color: '#cbd5e1' }}>Cafes</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>14.8%</span>
                </div>

                {/* Sport Bubble */}
                <div className="glass-sphere-bubble" style={{ width: '78px', height: '78px', left: '38%', top: '40%', zIndex: 7 }}>
                  <span style={{ fontSize: '0.9rem' }}>🏋️</span>
                  <span style={{ fontSize: '0.65rem', color: '#cbd5e1' }}>Sport</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>11.3%</span>
                </div>

                {/* Health Bubble */}
                <div className="glass-sphere-bubble" style={{ width: '70px', height: '70px', right: '8%', top: '4%', zIndex: 4 }}>
                  <span style={{ fontSize: '0.85rem' }}>💖</span>
                  <span style={{ fontSize: '0.62rem', color: '#cbd5e1' }}>Health</span>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800 }}>8.4%</span>
                </div>
              </div>
            </div>

            {/* Lower White Sheet */}
            <div style={{
              background: '#ffffff',
              padding: '1.5rem',
              flex: 1,
              color: '#0f172a',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Expenses</span>
                  <Link to="/dashboard/analysis" style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>View All</Link>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0.4rem 0 1rem' }}>
                  ₹14,570<span style={{ fontSize: '1.3rem', opacity: 0.85 }}>.00</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div style={{ padding: '0.75rem', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Groceries</div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '0.2rem' }}>₹5,240.00</div>
                  </div>
                  <div style={{ padding: '0.75rem', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Clothes & Shoes</div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '0.2rem' }}>₹2,620.00</div>
                  </div>
                </div>
              </div>

              <Link to="/dashboard/analysis" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', marginTop: '1rem', background: '#0f172a', color: '#fff' }}>
                Open Bubble Visualizer &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
