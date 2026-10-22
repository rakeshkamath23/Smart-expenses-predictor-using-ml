import React, { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Premium3DTiltCard - A subtle, high-performance 3D floating tilt wrapper.
 * Provides realistic soft multi-layer shadow, smooth 4–5° cursor tilt, and delicate light reflection.
 * NO flipping, NO rotation, preserving the card's original design and color.
 */
export default function Premium3DTiltCard({
  children,
  className = '',
  style = {},
  maxTilt = 4.5,
  isDark = false
}) {
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

  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
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
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      // Subtle tilt: max rotation around 4-5 degrees
      const rotateY = (x - 0.5) * (maxTilt * 2);
      const rotateX = -(y - 0.5) * (maxTilt * 2);

      setTilt({
        rotateX: Math.round(rotateX * 100) / 100,
        rotateY: Math.round(rotateY * 100) / 100,
        glareX: Math.round(x * 100),
        glareY: Math.round(y * 100),
        glareOpacity: 0.45,
        isHovered: true
      });
    });
  }, [isTouchDevice, maxTilt]);

  const handleMouseEnter = () => {
    if (isTouchDevice) return;
    setTilt((prev) => ({ ...prev, isHovered: true, glareOpacity: 0.35 }));
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

  // Dynamic realistic multi-layer shadow calculation
  const shadowX = -tilt.rotateY * 1.2;
  const shadowY = tilt.isHovered ? 18 + tilt.rotateX * 1.0 : 12;
  const shadowBlur = tilt.isHovered ? 38 : 28;

  const dynamicShadow = isDark
    ? `${shadowX}px ${shadowY}px ${shadowBlur}px -8px rgba(0, 0, 0, 0.8),
       0 8px 20px -4px rgba(0, 0, 0, 0.55),
       0 0 25px rgba(37, 99, 235, 0.15),
       inset 0 1px 1px rgba(255, 255, 255, 0.3)`
    : `${shadowX}px ${shadowY}px ${shadowBlur}px -8px rgba(0, 0, 0, 0.5),
       0 6px 16px -4px rgba(0, 0, 0, 0.35),
       0 0 20px rgba(56, 189, 248, 0.2),
       inset 0 1px 1px rgba(255, 255, 255, 0.4)`;

  const currentTransform = tilt.isHovered && !isTouchDevice
    ? `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) translateZ(8px) scale(1.018)`
    : `perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1.0)`;

  return (
    <div
      ref={cardRef}
      className={`premium-3d-tilt-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        ...style,
        position: 'relative',
        transformStyle: 'preserve-3d',
        transform: currentTransform,
        boxShadow: dynamicShadow,
        transition: 'transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)',
        willChange: 'transform, box-shadow'
      }}
    >
      {/* Subtle cursor-following light reflection glare */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          pointerEvents: 'none',
          opacity: tilt.glareOpacity,
          transition: 'opacity 0.3s ease',
          background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.03) 45%, transparent 70%)`,
          mixBlendMode: 'overlay',
          zIndex: 8
        }}
        aria-hidden="true"
      />
      {children}
    </div>
  );
}
