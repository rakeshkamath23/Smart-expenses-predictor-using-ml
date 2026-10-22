import React, { useState, useRef, useEffect, useCallback } from 'react';
import './Interactive3DCard.css';

/**
 * Interactive3DCard - A hyper-realistic 3D banking card with 3D flip interaction (front & back),
 * cursor-following tilt, realistic plastic thickness depth, dynamic glare refraction, and floating motion.
 */
export default function Interactive3DCard({
  card = {
    network: 'VISA',
    last4: '9286',
    nameOnCard: 'Rakesh Kamath',
    expiry: '08/32',
    cvv: '842',
    theme: 'sapphire',
    isFrozen: false,
    isPrimary: true
  },
  className = '',
  style = {}
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef(null);
  const rafRef = useRef(null);

  const [tilt, setTilt] = useState({
    rotateX: 0,
    rotateY: 0,
    glareX: 50,
    glareY: 50,
    glareOpacity: 0,
    isHovered: false,
    isPressed: false
  });

  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch / non-hover devices
    const mq = window.matchMedia('(hover: none) and (pointer: coarse)');
    setIsTouchDevice(mq.matches);
    const handler = (e) => setIsTouchDevice(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (isTouchDevice || !cardRef.current) return;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width; // 0 to 1
      const y = (e.clientY - rect.top) / rect.height; // 0 to 1

      // Subtle tilt: max rotation around 11 degrees
      const maxTilt = 11;
      const rotateY = (x - 0.5) * (maxTilt * 2);
      const rotateX = -(y - 0.5) * (maxTilt * 2);

      setTilt({
        rotateX: Math.round(rotateX * 100) / 100,
        rotateY: Math.round(rotateY * 100) / 100,
        glareX: Math.round(x * 100),
        glareY: Math.round(y * 100),
        glareOpacity: 0.65,
        isHovered: true,
        isPressed: false
      });
    });
  }, [isTouchDevice]);

  const handleMouseEnter = () => {
    if (isTouchDevice) return;
    setTilt((prev) => ({ ...prev, isHovered: true, glareOpacity: 0.5 }));
  };

  const handleMouseLeave = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setTilt({
      rotateX: 0,
      rotateY: 0,
      glareX: 50,
      glareY: 50,
      glareOpacity: 0,
      isHovered: false,
      isPressed: false
    });
  };

  const handleMouseDown = () => {
    setTilt((prev) => ({ ...prev, isPressed: true }));
  };

  const handleMouseUp = () => {
    setTilt((prev) => ({ ...prev, isPressed: false }));
  };

  // Flip toggle handler
  const handleCardClick = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsFlipped((prev) => !prev);
    }
  };

  // Determine CSS Theme Class
  const getThemeClass = (theme) => {
    switch (theme) {
      case 'black': return 'card-3d-theme-black';
      case 'emerald': return 'card-3d-theme-emerald';
      case 'violet': return 'card-3d-theme-violet';
      case 'sunset': return 'card-3d-theme-sunset';
      default: return 'card-3d-theme-sapphire';
    }
  };

  // 3D Transformation calculation
  const baseRotateY = isFlipped ? 180 : 0;
  const activeRotateY = isFlipped
    ? baseRotateY - (tilt.isHovered && !isTouchDevice ? tilt.rotateY : 0)
    : baseRotateY + (tilt.isHovered && !isTouchDevice ? tilt.rotateY : 0);
  const activeRotateX = tilt.isHovered && !isTouchDevice ? tilt.rotateX : 0;
  const activeScale = tilt.isPressed ? 0.98 : (tilt.isHovered ? 1.025 : 1.0);
  const activeTranslateZ = tilt.isPressed ? '10px' : (tilt.isHovered ? '24px' : '0px');

  const currentTransform = `rotateX(${activeRotateX}deg) rotateY(${activeRotateY}deg) translateZ(${activeTranslateZ}) scale(${activeScale})`;

  // Dynamic box shadow
  const shadowX = isFlipped ? (tilt.rotateY * 1.5) : (-tilt.rotateY * 1.5);
  const shadowY = Math.max(12, tilt.rotateX * 1.4 + 20);
  const shadowBlur = tilt.isHovered ? 45 : 32;

  const dynamicBoxShadow = `
    ${shadowX}px ${shadowY}px ${shadowBlur}px -8px rgba(0, 0, 0, 0.65),
    0 0 28px rgba(37, 99, 235, 0.28),
    inset 0 1px 1px rgba(255, 255, 255, 0.45)
  `;

  const network = card?.network || 'VISA';
  const isVisa = network.toUpperCase() === 'VISA';
  const isMastercard = network.toUpperCase() === 'MASTERCARD';
  const last4 = card?.last4 || (card?.cardNumber ? card.cardNumber.replace(/\s/g, '').slice(-4) : '9286');
  const nameOnCard = card?.nameOnCard || 'Rakesh Kamath';
  const expiry = card?.expiry || '08/32';
  const cvv = card?.cvv || '842';
  const isFrozen = card?.isFrozen || false;

  return (
    <div
      className={`card-3d-perspective-stage ${className}`}
      style={style}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`${network} payment card ending in ${last4}. Click to ${isFlipped ? 'show front' : 'flip to back'}.`}
      title="Click anywhere to flip card"
    >
      <div className={`card-3d-floating-wrapper ${!tilt.isHovered ? 'is-floating' : ''}`}>
        <div
          ref={cardRef}
          className={`card-3d-body ${isFlipped ? 'is-flipped' : ''}`}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          style={{
            transform: currentTransform,
            boxShadow: dynamicBoxShadow,
            filter: isFrozen ? 'grayscale(0.55) contrast(0.95)' : 'none'
          }}
        >
          {/* Real Thickness Depth Layer */}
          <div className="card-3d-thickness-layer" />

          {/* ==================== FRONT FACE ==================== */}
          <div className={`card-3d-face card-3d-front ${getThemeClass(card?.theme)}`}>
            {/* Holographic Security Pattern */}
            <div className="card-3d-pattern" />

            {/* Dynamic Cursor Light Glare */}
            <div
              className="card-3d-glare"
              style={{
                opacity: !isFlipped ? tilt.glareOpacity : 0,
                background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.05) 50%, transparent 80%)`
              }}
            />

            {/* Subtle Diagonal Shimmer Sweep */}
            <div className="card-3d-shimmer" />

            {/* Foreground 3D Floating Elements */}
            <div className="card-3d-content">
              {/* Header: Chip, Contactless Symbol & Network */}
              <div className="card-3d-header">
                <div className="card-3d-chip-container">
                  <div className="card-3d-chip">
                    <div className="card-3d-chip-lines" />
                  </div>
                  <span className="card-3d-contactless" title="Contactless Active">)))</span>
                </div>

                <div className="card-3d-network">
                  {isVisa ? (
                    <span className="card-3d-network-visa">VISA</span>
                  ) : isMastercard ? (
                    <div className="card-3d-mastercard-circles" title="Mastercard">
                      <span className="mc-circle mc-red" />
                      <span className="mc-circle mc-yellow" />
                    </div>
                  ) : (
                    <div className="card-3d-mastercard-circles" title="Mastercard">
                      <span className="mc-circle mc-red" />
                      <span className="mc-circle mc-yellow" />
                    </div>
                  )}
                </div>
              </div>

              {/* Middle: Masked Card Number */}
              <div className="card-3d-number-row">
                <div className="card-3d-number">
                  <span className="dot-group">••••</span>
                  <span className="dot-group">••••</span>
                  <span className="dot-group">••••</span>
                  <span>{last4}</span>
                </div>
              </div>

              {/* Footer: Cardholder Name & Expiration Date */}
              <div className="card-3d-footer">
                <div>
                  <div className="card-3d-label">Cardholder</div>
                  <div className="card-3d-value">{nameOnCard}</div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div className="card-3d-label">Expires</div>
                  <div className="card-3d-value">{expiry}</div>
                </div>
              </div>
            </div>

            {/* Frozen Indicator */}
            {isFrozen && (
              <div className="card-3d-frozen-badge">
                ❄️ Frozen
              </div>
            )}

            {/* Subtle Interactive Flip Affordance */}
            <div className="card-3d-flip-indicator" aria-hidden="true">
              <span className="flip-badge">↺ Flip</span>
            </div>
          </div>

          {/* ==================== BACK FACE ==================== */}
          <div className={`card-3d-face card-3d-back ${getThemeClass(card?.theme)}`}>
            {/* Holographic Security Pattern */}
            <div className="card-3d-pattern" />

            {/* Dynamic Cursor Light Glare for Back */}
            <div
              className="card-3d-glare"
              style={{
                opacity: isFlipped ? tilt.glareOpacity : 0,
                background: `radial-gradient(circle at ${100 - tilt.glareX}% ${tilt.glareY}%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.08) 50%, transparent 80%)`
              }}
            />

            {/* Subtle Diagonal Shimmer Sweep */}
            <div className="card-3d-shimmer" />

            {/* Back Card Content */}
            <div className="card-3d-back-content">
              {/* Magnetic Stripe near top */}
              <div className="card-3d-magstripe">
                <div className="magstripe-shine" />
              </div>

              {/* Signature Strip & CVV Area */}
              <div className="card-3d-back-panel">
                <div className="card-3d-signature-strip">
                  <span className="card-3d-signature-text">{nameOnCard}</span>
                  <div className="card-3d-security-lines" />
                </div>
                <div className="card-3d-cvv-box">
                  <span className="card-3d-cvv-label">CVV</span>
                  <span className="card-3d-cvv-value">{cvv}</span>
                </div>
              </div>

              {/* Readable Card Info Disclaimers */}
              <div className="card-3d-back-info">
                <div className="card-3d-back-disclaimer">
                  <p>24/7 Helpline: 1800-SMART-EXP &bull; Authorized signature required.</p>
                  <p>Subject to cardholder terms. Issued by Smart Expenses Bank.</p>
                </div>
              </div>

              {/* Back Card Bottom Row: Chip/Hologram + Mastercard Logo */}
              <div className="card-3d-back-bottom-row">
                <div className="card-3d-back-security-group">
                  <div className="card-3d-hologram-stamp" title="Security Hologram" />
                  <span className="card-3d-micro-chip-icon" title="EMV Contactless">💳</span>
                </div>

                <div className="card-3d-back-brand">
                  <div className="card-3d-mastercard-brand-box" title="Mastercard">
                    <div className="card-3d-mastercard-circles-back">
                      <span className="mc-circle mc-red" />
                      <span className="mc-circle mc-yellow" />
                    </div>
                    <span className="card-3d-mc-text">mastercard</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Frozen Indicator on Back */}
            {isFrozen && (
              <div className="card-3d-frozen-badge">
                ❄️ Frozen
              </div>
            )}

            {/* Subtle Interactive Flip Affordance */}
            <div className="card-3d-flip-indicator card-3d-flip-back" aria-hidden="true">
              <span className="flip-badge">↻ Flip</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
