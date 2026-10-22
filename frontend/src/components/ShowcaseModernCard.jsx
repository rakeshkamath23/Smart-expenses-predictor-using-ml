import React, { useState, useRef, useCallback } from 'react';

/**
 * ShowcaseModernCard - An interactive 3D metal card in the "Modern Tools for Modern Finance" section
 * Features subtle hover tilt and a realistic 180° 3D flip to show a high-contrast dark-blue/blue-purple back.
 */
export default function ShowcaseModernCard() {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef(null);
  const rafRef = useRef(null);

  const [tilt, setTilt] = useState({
    rotateX: 0,
    rotateY: 0,
    glareX: 50,
    glareY: 50,
    glareOpacity: 0,
    isHovered: false
  });

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      // Subtle tilt: max rotation around 8 degrees
      const maxTilt = 8;
      const rotateY = (x - 0.5) * (maxTilt * 2);
      const rotateX = -(y - 0.5) * (maxTilt * 2);

      setTilt({
        rotateX: Math.round(rotateX * 100) / 100,
        rotateY: Math.round(rotateY * 100) / 100,
        glareX: Math.round(x * 100),
        glareY: Math.round(y * 100),
        glareOpacity: 0.5,
        isHovered: true
      });
    });
  }, []);

  const handleMouseEnter = () => {
    setTilt((prev) => ({ ...prev, isHovered: true, glareOpacity: 0.4 }));
  };

  const handleMouseLeave = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setTilt({
      rotateX: 0,
      rotateY: 0,
      glareX: 50,
      glareY: 50,
      glareOpacity: 0,
      isHovered: false
    });
  };

  const handleToggleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsFlipped((prev) => !prev);
    }
  };

  const baseRotateY = isFlipped ? 180 : 0;
  const activeRotateY = isFlipped
    ? baseRotateY - (tilt.isHovered ? tilt.rotateY : 0)
    : baseRotateY + (tilt.isHovered ? tilt.rotateY : 0);
  const activeRotateX = tilt.isHovered ? tilt.rotateX : 0;
  const activeScale = tilt.isHovered ? 1.025 : 1.0;

  const currentTransform = `rotateX(${activeRotateX}deg) rotateY(${activeRotateY}deg) scale(${activeScale})`;

  return (
    <div
      style={{
        perspective: '1200px',
        width: '100%',
        maxWidth: '320px',
        height: '200px',
        margin: '0 auto',
        userSelect: 'none',
        touchAction: 'manipulation',
        cursor: 'pointer',
        outline: 'none',
        position: 'relative'
      }}
      onClick={handleToggleFlip}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label="Interactive Titanium Platinum Card. Click to flip."
      title="Click to flip card"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: currentTransform,
          transition: 'transform 0.7s cubic-bezier(0.34, 1.25, 0.64, 1), box-shadow 0.35s ease',
          boxShadow: tilt.isHovered
            ? '0 30px 70px -10px rgba(0, 0, 0, 0.85), 0 0 35px rgba(37, 99, 235, 0.35)'
            : '0 25px 60px -10px rgba(0, 0, 0, 0.8), 0 0 30px rgba(37, 99, 235, 0.2)',
          borderRadius: '20px'
        }}
      >
        {/* ==================== FRONT FACE (Exact original design) ==================== */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            borderRadius: '20px',
            background: 'linear-gradient(145deg, #181c24 0%, #0d1017 60%, #080a0f 100%)',
            border: '1.5px solid rgba(255, 255, 255, 0.18)',
            boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.35), inset 0 0 15px rgba(56, 189, 248, 0.08)',
            padding: '1.4rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            color: '#fff',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transformStyle: 'preserve-3d',
            transform: 'rotateY(0deg) translateZ(1px)',
            overflow: 'hidden',
            zIndex: 2
          }}
        >
          {/* Subtle cursor-following light glare */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '20px',
              pointerEvents: 'none',
              opacity: !isFlipped ? tilt.glareOpacity : 0,
              transition: 'opacity 0.3s ease',
              background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255, 255, 255, 0.25) 0%, transparent 60%)`,
              mixBlendMode: 'overlay',
              zIndex: 3
            }}
          />

          {/* Top row: Chip & PLATINUM */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 4 }}>
            <div className="card-chip" />
            <span style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.1em', color: '#ffffff' }}>
              PLATINUM
            </span>
          </div>

          {/* Middle row: Card Number */}
          <div style={{ fontSize: '1.05rem', fontFamily: 'monospace', letterSpacing: '0.15em', color: '#ffffff', zIndex: 4 }}>
            •••• 4028
          </div>

          {/* Bottom row: SMART EXPENSES & Geometric diamond logo */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 4 }}>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>SMART EXPENSES</span>
            <div
              style={{
                width: '28px',
                height: '28px',
                border: '2px solid rgba(255, 255, 255, 0.6)',
                transform: 'rotate(45deg)',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), transparent)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
              }}
            />
          </div>

          {/* Subtle flip hint indicator */}
          <div
            style={{
              position: 'absolute',
              bottom: '0.45rem',
              right: '0.5rem',
              opacity: tilt.isHovered ? 0.95 : 0,
              transition: 'opacity 0.2s ease',
              pointerEvents: 'none',
              zIndex: 5
            }}
          >
            <span
              style={{
                fontSize: '0.58rem',
                fontWeight: 700,
                color: '#e2e8f0',
                background: 'rgba(0, 0, 0, 0.6)',
                padding: '0.12rem 0.45rem',
                borderRadius: '9999px',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              ↺ Flip
            </span>
          </div>
        </div>

        {/* ==================== BACK FACE (Premium Dark-Blue / Blue-Purple) ==================== */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #0d2857 0%, #1e3a8a 38%, #1e1b4b 75%, #0f172a 100%)',
            border: '1.5px solid rgba(147, 197, 253, 0.45)',
            boxShadow: 'inset 0 0 18px rgba(59, 130, 246, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.35)',
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            color: '#fff',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transformStyle: 'preserve-3d',
            transform: 'rotateY(180deg) translateZ(1px)',
            overflow: 'hidden',
            zIndex: 1,
            opacity: 1
          }}
        >
          {/* Subtle cursor-following light glare for back */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '20px',
              pointerEvents: 'none',
              opacity: isFlipped ? tilt.glareOpacity : 0,
              transition: 'opacity 0.3s ease',
              background: `radial-gradient(circle at ${100 - tilt.glareX}% ${tilt.glareY}%, rgba(255, 255, 255, 0.35) 0%, transparent 60%)`,
              mixBlendMode: 'overlay',
              zIndex: 3
            }}
          />

          {/* 1. Magnetic Stripe */}
          <div
            style={{
              width: '100%',
              height: '38px',
              marginTop: '14px',
              background: 'linear-gradient(180deg, #09090b 0%, #18181b 50%, #09090b 100%)',
              borderTop: '1px solid rgba(255, 255, 255, 0.18)',
              borderBottom: '1px solid rgba(0, 0, 0, 0.6)',
              boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.8)',
              position: 'relative'
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.08) 75%, transparent 100%)'
              }}
            />
          </div>

          {/* 2. Signature Strip & CVV Area */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', margin: '6px 1.25rem 0' }}>
            <div
              style={{
                flex: 1,
                height: '34px',
                background: '#f1f5f9',
                borderRadius: '4px',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                padding: '0 0.75rem',
                boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.25)',
                backgroundImage: 'repeating-linear-gradient(45deg, #e2e8f0, #e2e8f0 4px, #f8fafc 4px, #f8fafc 8px)'
              }}
            >
              <span
                style={{
                  fontFamily: "'Brush Script MT', 'Segoe Script', 'Caveat', cursive, sans-serif",
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: '#0f172a',
                  fontStyle: 'italic',
                  transform: 'rotate(-1.5deg)',
                  zIndex: 2,
                  letterSpacing: '0.03em'
                }}
              >
                Rakesh Kamath
              </span>
            </div>

            <div
              style={{
                background: '#ffffff',
                border: '1.5px solid #cbd5e1',
                borderRadius: '4px',
                height: '34px',
                minWidth: '52px',
                padding: '0 0.45rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)'
              }}
            >
              <span
                style={{
                  fontSize: '0.5rem',
                  fontWeight: 800,
                  color: '#475569',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  lineHeight: 1,
                  marginBottom: '1px'
                }}
              >
                CVV
              </span>
              <span
                style={{
                  fontFamily: "'Courier New', Courier, monospace",
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  letterSpacing: '0.12em',
                  lineHeight: 1
                }}
              >
                428
              </span>
            </div>
          </div>

          {/* 3. Small readable card info / disclaimer text */}
          <div style={{ margin: '6px 1.25rem 0' }}>
            <p style={{ margin: 0, fontSize: '0.55rem', color: '#f1f5f9', fontWeight: 500, lineHeight: 1.35, textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>
              24/7 Helpline: 1800-SMART-EXP &bull; Authorized signature required.
            </p>
            <p style={{ margin: 0, fontSize: '0.55rem', color: '#cbd5e1', fontWeight: 500, lineHeight: 1.35, textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>
              Smart Platinum Metal Debit Card &bull; smartexpenses.ai
            </p>
          </div>

          {/* 4. Bottom Row: Security chip + Mastercard branding */}
          <div style={{ margin: '0 1.25rem 0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  width: '26px',
                  height: '18px',
                  borderRadius: '3px',
                  background: 'linear-gradient(135deg, #38bdf8 0%, #ec4899 35%, #eab308 70%, #10b981 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.65)',
                  boxShadow: '0 1px 4px rgba(0, 0, 0, 0.35)',
                  opacity: 0.95
                }}
                title="Security Hologram"
              />
              <span style={{ fontSize: '1rem', lineHeight: 1 }} title="Contactless Active">💳</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }} title="Mastercard">
              <div style={{ display: 'flex', alignItems: 'center', height: '18px' }}>
                <span
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: '#eb001b',
                    display: 'inline-block',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4)',
                    zIndex: 1
                  }}
                />
                <span
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: '#ff5f00',
                    marginLeft: '-7px',
                    display: 'inline-block',
                    mixBlendMode: 'hard-light',
                    zIndex: 2
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: '0.55rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  letterSpacing: '0.02em',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.6)',
                  lineHeight: 1
                }}
              >
                mastercard
              </span>
            </div>
          </div>

          {/* Flip indicator on back */}
          <div
            style={{
              position: 'absolute',
              bottom: '0.45rem',
              right: '0.5rem',
              opacity: tilt.isHovered ? 0.95 : 0,
              transition: 'opacity 0.2s ease',
              pointerEvents: 'none',
              zIndex: 5
            }}
          >
            <span
              style={{
                fontSize: '0.58rem',
                fontWeight: 700,
                color: '#e2e8f0',
                background: 'rgba(0, 0, 0, 0.6)',
                padding: '0.12rem 0.45rem',
                borderRadius: '9999px',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              ↻ Flip
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
