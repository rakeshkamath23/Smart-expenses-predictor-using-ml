import React, { useId, useLayoutEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from './Login';

const DEFAULT_FONT = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

const clamp = (n, a = 0, b = 1) => Math.min(b, Math.max(a, n));
const smooth = (a, b, n) => {
  const t = clamp((n - a) / (b - a));
  return t * t * (3 - 2 * t);
};

// Canvas letter interior scanner to calculate safe letter penetration point
function interior(context, char, font) {
  try {
    const canvas = context.canvas;
    context.font = font;
    const m = context.measureText(char);
    const pad = 8;
    const left = Math.ceil(m.actualBoundingBoxLeft || 0);
    const ascent = Math.ceil(m.actualBoundingBoxAscent || 30);
    canvas.width = Math.max(1, Math.ceil((m.actualBoundingBoxLeft || 0) + (m.actualBoundingBoxRight || 50)) + pad * 2);
    canvas.height = Math.max(1, Math.ceil((m.actualBoundingBoxAscent || 30) + (m.actualBoundingBoxDescent || 10)) + pad * 2);
    context.font = font;
    context.fontKerning = 'none';
    context.fillText(char, pad + left, pad + ascent);
    const { width, height } = canvas;
    const pixels = context.getImageData(0, 0, width, height).data;
    const rows = new Uint16Array(width + 1);
    let size = 0, bx = 0, by = 0;
    for (let y = 0; y < height; y++) {
      let diagonal = 0;
      for (let x = 0; x < width; x++) {
        const above = rows[x + 1];
        rows[x + 1] = pixels[(y * width + x) * 4 + 3] > 240
          ? Math.min(above, rows[x], diagonal) + 1 : 0;
        diagonal = above;
        if (rows[x + 1] > size) { size = rows[x + 1]; bx = x; by = y; }
      }
    }
    if (size < 3) return null;
    return {
      x: (bx + 1 - size / 2 - pad - left) / 3,
      y: (by + 1 - size / 2 - pad - ascent) / 3,
      radius: (size / 2 - 1) / 3
    };
  } catch {
    return null;
  }
}

export default function Opening() {
  const navigate = useNavigate();
  const uid = `opening-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const clipId = `${uid}-clip`;
  const containerRef = useRef(null);
  const loginSectionRef = useRef(null);

  const word = "Smart Expenses";
  const scrollLength = 2.4;
  const characters = Array.from(word, (char, index) => ({ char, index }));

  const scrollToLogin = () => {
    if (loginSectionRef.current) {
      loginSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({
        top: window.innerHeight * scrollLength,
        behavior: 'smooth'
      });
    }
  };

  const handleContinueToApp = () => {
    navigate('/dashboard');
  };

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const field = container.querySelector('[data-op-field]');
    const art = container.querySelector('[data-op-art]');
    const clip = container.querySelector(`#${clipId}`);
    const glyph = container.querySelector('[data-op-glyph]');
    const choices = container.querySelector('[data-op-choices]');
    const buttons = choices ? Array.from(choices.querySelectorAll('button')) : [];
    const content = container.querySelector('[data-op-content]');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d', { willReadFrequently: true });

    let disposed = false;
    let raf = 0;
    let dirty = true;
    let W = 1, H = 1, travel = 1, startScale = 1, endScale = 1;
    let center = { x: 0, y: 0 };
    let target = null;
    let candidates = [];
    let letters = [];
    let bounds = { x: 0, y: 0, width: 1, height: 1 };

    // Scroll response smoothing variables (NO auto-timer)
    let currentScroll = window.scrollY;
    let targetScroll = window.scrollY;

    glyph.style.fontFamily = DEFAULT_FONT;

    const readInk = () => {
      if (!context) return false;
      const font = getComputedStyle(glyph);
      const scanFont = `${font.fontWeight || '900'} 300px ${font.fontFamily || DEFAULT_FONT}`;
      context.font = `${font.fontWeight || '900'} 100px ${font.fontFamily || DEFAULT_FONT}`;
      context.fontKerning = 'none';
      const metrics = context.measureText(word);
      const advances = Array.from({ length: word.length }, (_, i) => context.measureText(word.slice(0, i)).width);

      bounds = {
        x: -metrics.actualBoundingBoxLeft || 0,
        y: -metrics.actualBoundingBoxAscent || -80,
        width: (metrics.actualBoundingBoxLeft || 0) + (metrics.actualBoundingBoxRight || metrics.width),
        height: (metrics.actualBoundingBoxAscent || 80) + (metrics.actualBoundingBoxDescent || 20)
      };
      if (!bounds.width || !bounds.height) return false;

      center = { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 };
      let offset = 0;
      candidates = [];
      letters = [];

      for (const char of Array.from(word)) {
        context.font = `${font.fontWeight || '900'} 100px ${font.fontFamily || DEFAULT_FONT}`;
        const m = context.measureText(char);
        letters.push({
          index: offset,
          x: advances[offset] - (m.actualBoundingBoxLeft || 0),
          y: -(m.actualBoundingBoxAscent || 80),
          width: (m.actualBoundingBoxLeft || 0) + (m.actualBoundingBoxRight || m.width),
          height: (m.actualBoundingBoxAscent || 80) + (m.actualBoundingBoxDescent || 20)
        });
        const found = interior(context, char, scanFont);
        if (found) candidates.push({ ...found, x: found.x + advances[offset], index: offset });
        offset += char.length;
      }

      // Target letter 'p' or 'a' or largest ink radius
      target = candidates.find(c => c.index === word.indexOf('p')) ||
               candidates.find(c => c.index === word.indexOf('a')) ||
               [...candidates].sort((a, b) => b.radius - a.radius)[0] ||
               { x: center.x, y: center.y, radius: 24, index: 0 };

      return true;
    };

    const select = (next) => {
      target = next;
      endScale = target ? Math.max(startScale, Math.hypot(W, H) / (target.radius * 1.35)) : startScale;
      for (const button of buttons) {
        const selected = Number(button.dataset.opLetter) === target?.index;
        button.disabled = !candidates.some((c) => c.index === Number(button.dataset.opLetter));
        button.setAttribute('aria-checked', String(selected));
      }
    };

    const paint = (progress) => {
      const isStatic = motion.matches || !target;
      const p = isStatic ? 0 : progress;
      const t = clamp(p / 0.82);
      const eased = t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
      const scale = Math.exp(Math.log(startScale) + Math.log(endScale / startScale) * eased);
      const blend = endScale === startScale ? 0 : (1 / scale - 1 / startScale) / (1 / endScale - 1 / startScale);
      const cx = center.x + ((target?.x ?? center.x) - center.x) * blend;
      const cy = center.y + ((target?.y ?? center.y) - center.y) * blend;
      const roll = -3.5 * smooth(0.06, 0.5, t) * (1 - smooth(0.65, 0.92, t));

      const radians = roll * Math.PI / 180;
      const dx = W / 2 / scale;
      const dy = (H * 0.44 + H * 0.02 * eased) / scale;

      clip.setAttribute('transform', `scale(${scale}) rotate(${roll})`);
      glyph.setAttribute('transform', `translate(${Math.cos(radians) * dx + Math.sin(radians) * dy - cx} ${-Math.sin(radians) * dx + Math.cos(radians) * dy - cy})`);

      // Once zoomed in sufficiently, the blue field fills the screen
      field.style.clipPath = t >= 1 ? 'none' : `url(#${clipId})`;
      container.style.setProperty('--op-caption-opacity', String(1 - smooth(0.01, 0.16, p)));
      container.style.setProperty('--op-reveal-opacity', String(isStatic ? 1 : smooth(0.75, 0.92, p)));

      // Smoothly reveal the login card as the user scrolls into the blue background
      if (content) {
        content.style.pointerEvents = p >= 0.7 ? 'auto' : 'none';
        content.style.opacity = String(isStatic ? 1 : smooth(0.7, 0.92, p));
      }
    };

    const layout = () => {
      if (!container.clientWidth) return;
      W = window.innerWidth;
      H = window.innerHeight;
      container.style.setProperty('--op-height', `${H}px`);
      travel = H * scrollLength;
      art.setAttribute('viewBox', `0 0 ${W} ${H}`);

      readInk();
      const wordHeight = H < 480 ? Math.min(H * 0.32, 65) : H * 0.25;
      startScale = Math.min((W * 0.82) / bounds.width, wordHeight / bounds.height);

      select(target);

      for (const button of buttons) {
        const letter = letters.find((item) => item.index === Number(button.dataset.opLetter));
        if (letter) {
          Object.assign(button.style, {
            left: `${W / 2 + (letter.x - center.x) * startScale}px`,
            top: `${H * 0.44 + (letter.y - center.y) * startScale - Math.max(0, 44 - letter.height * startScale) / 2}px`,
            width: `${Math.max(1, letter.width * startScale)}px`,
            height: `${Math.max(44, letter.height * startScale)}px`,
          });
        }
      }

      container.style.setProperty('--op-word-top', `${H * 0.44 - (bounds.height * startScale) / 2}px`);
      container.style.setProperty('--op-word-bottom', `${H * 0.44 + (bounds.height * startScale) / 2}px`);
      container.dataset.opReady = 'true';
    };

    // Smooth scroll interpolation via RAF: smoothly tracks user's scroll, stops immediately when scroll stops
    const render = () => {
      raf = 0;
      if (disposed) return;
      if (dirty) { dirty = false; layout(); }

      const rect = container.getBoundingClientRect();
      targetScroll = -rect.top;

      const diff = targetScroll - currentScroll;
      if (Math.abs(diff) > 0.4) {
        currentScroll += diff * 0.22;
        raf = requestAnimationFrame(render);
      } else {
        currentScroll = targetScroll;
      }

      const progress = clamp(currentScroll / travel, 0, 1);
      paint(progress);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(render);
    };

    const choose = (event) => {
      const rect = container.getBoundingClientRect();
      if (clamp(-rect.top / travel) >= 0.05) return;
      const button = event.target.closest('[data-op-letter]');
      const next = candidates.find((c) => c.index === Number(button?.dataset.opLetter));
      if (!next || next === target) return;
      select(next);
      paint(clamp(currentScroll / travel, 0, 1));
    };

    if (choices) {
      choices.addEventListener('pointerover', choose);
      choices.addEventListener('click', choose);
    }

    const resize = () => {
      dirty = true;
      if (!raf) raf = requestAnimationFrame(render);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', resize);

    layout();
    render();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      if (choices) {
        choices.removeEventListener('pointerover', choose);
        choices.removeEventListener('click', choose);
      }
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', resize);
    };
  }, [word, scrollLength, clipId]);

  return (
    <div
      ref={containerRef}
      id={uid}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: `calc(100vh * ${scrollLength + 1.2})`,
        backgroundColor: '#081630', // Continuous deep sapphire base background
        color: '#0d2857',
        fontFamily: DEFAULT_FONT,
      }}
    >
      <style>{`
        #${uid} [data-op-pin] {
          position: sticky;
          top: 0;
          height: 100vh;
          height: 100svh;
          width: 100%;
          overflow: hidden;
          background: #ffffff;
        }

        /* Ambient soft blue gradient lighting */
        #${uid} [data-op-bg-ambient] {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(circle at 18% 22%, rgba(56, 189, 248, 0.16) 0%, transparent 45%),
            radial-gradient(circle at 82% 28%, rgba(37, 99, 235, 0.14) 0%, transparent 48%),
            radial-gradient(circle at 50% 80%, rgba(147, 197, 253, 0.22) 0%, transparent 60%);
          pointer-events: none;
          opacity: var(--op-caption-opacity, 1);
          transition: opacity 0.2s ease;
        }

        /* Curved decorative vector lines */
        #${uid} [data-op-bg-curves] {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          opacity: var(--op-caption-opacity, 1);
          transition: opacity 0.2s ease;
        }

        /* The deep sapphire blue field revealed through the text zoom */
        #${uid} [data-op-field] {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 35%, #2563eb 0%, #1d4ed8 40%, #0d2857 75%, #081630 100%);
          opacity: 0;
          pointer-events: none;
        }
        #${uid}[data-op-ready] [data-op-field] {
          opacity: 1;
        }
        #${uid} [data-op-art] {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: visible;
          pointer-events: none;
        }
        #${uid} [data-op-choices] {
          position: absolute;
          inset: 0;
          pointer-events: auto;
        }
        #${uid} [data-op-letter] {
          box-sizing: border-box;
          position: absolute;
          border: 0;
          padding: 0;
          margin: 0;
          background: transparent;
          cursor: pointer;
        }

        /* Header with Top Badge */
        #${uid} [data-op-header] {
          position: absolute;
          top: clamp(24px, 5vh, 48px);
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          opacity: var(--op-caption-opacity, 1);
          pointer-events: none;
          transition: opacity 0.2s ease;
          z-index: 5;
        }
        #${uid} [data-op-badge] {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 7px 18px;
          border-radius: 9999px;
          background: rgba(37, 99, 235, 0.08);
          border: 1px solid rgba(37, 99, 235, 0.24);
          color: #2563eb;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          box-shadow: 0 4px 15px rgba(37, 99, 235, 0.1);
          backdrop-filter: blur(8px);
        }

        /* Subtitle / Tagline & 3 Feature Chips */
        #${uid} [data-op-hero-details] {
          position: absolute;
          top: calc(var(--op-word-bottom, 50%) + 18px);
          left: 0;
          right: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          opacity: var(--op-caption-opacity, 1);
          pointer-events: none;
          transition: opacity 0.2s ease;
          z-index: 5;
          padding: 0 1rem;
        }
        #${uid} [data-op-tagline] {
          font-size: clamp(1rem, 2.2vw, 1.25rem);
          font-weight: 600;
          color: #475569;
          letter-spacing: -0.01em;
          text-align: center;
        }
        #${uid} [data-op-features-row] {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 12px;
        }
        #${uid} .feature-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(219, 234, 254, 0.95);
          box-shadow: 0 4px 16px rgba(37, 99, 235, 0.07);
          color: #1e3a8a;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: -0.01em;
          backdrop-filter: blur(12px);
          transition: transform 0.2s ease;
        }
        #${uid} .feature-chip svg {
          color: #2563eb;
        }



        /* Floating particles */
        #${uid} .floating-particle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          opacity: var(--op-caption-opacity, 1);
          animation: opPulseFloat 4s ease-in-out infinite alternate;
        }

        /* Bottom Footer Controls */
        #${uid} [data-op-footer] {
          position: absolute;
          bottom: clamp(24px, 5vh, 48px);
          left: 0;
          right: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          opacity: var(--op-caption-opacity, 1);
          pointer-events: auto;
          z-index: 6;
        }
        #${uid} [data-op-scroll-hint] {
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          letter-spacing: 0.02em;
          animation: opBounce 2s infinite ease-in-out;
        }
        #${uid} [data-op-enter-btn] {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 28px;
          border-radius: 9999px;
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.3);
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 8px 25px rgba(37, 99, 235, 0.45);
          transition: all 0.25s ease;
        }
        #${uid} [data-op-enter-btn]:hover {
          background: #1d4ed8;
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(37, 99, 235, 0.6);
        }

        /* Keyframes */
        @keyframes opPulseFloat {
          0% { transform: scale(0.9); opacity: 0.35; }
          100% { transform: scale(1.15); opacity: 0.75; }
        }
        @keyframes opBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }

        @media (max-width: 900px) {
          #${uid} [data-op-features-row] {
            gap: 8px;
          }
          #${uid} .feature-chip {
            font-size: 12px;
            padding: 6px 12px;
          }
        }

        #${uid} [data-op-content] {
          box-sizing: border-box;
          position: relative;
          min-height: 100vh;
          min-height: 100svh;
          display: flex;
          align-items: center;
          justifyContent: center;
          margin-top: calc((${scrollLength} - 0.8) * var(--op-height, 100vh));
          padding: 2rem 1.5rem 4rem;
          z-index: 10;
        }
      `}</style>

      {/* Sticky Pin Container for the Cinematic Type Zoom */}
      <div data-op-pin>
        {/* Modern clean white background with soft blue gradients */}
        <div data-op-bg-ambient />

        {/* Subtle decorative curved lines */}
        <svg data-op-bg-curves aria-hidden="true" viewBox="0 0 1440 900" preserveAspectRatio="none">
          <path
            d="M-50,220 C320,120 540,360 880,180 C1140,50 1320,240 1500,160"
            fill="none"
            stroke="rgba(37, 99, 235, 0.08)"
            strokeWidth="2.5"
            strokeDasharray="6 6"
          />
          <path
            d="M-50,680 C360,520 620,780 1020,620 C1280,520 1420,680 1500,600"
            fill="none"
            stroke="rgba(56, 189, 248, 0.12)"
            strokeWidth="2"
          />
        </svg>

        {/* Floating subtle blue particles */}
        <div
          className="floating-particle"
          style={{ width: '12px', height: '12px', background: '#38bdf8', top: '22%', left: '18%', filter: 'blur(1px)' }}
        />
        <div
          className="floating-particle"
          style={{ width: '18px', height: '18px', background: '#2563eb', top: '70%', left: '22%', filter: 'blur(2px)', animationDelay: '1.2s' }}
        />
        <div
          className="floating-particle"
          style={{ width: '10px', height: '10px', background: '#60a5fa', top: '26%', right: '20%', filter: 'blur(1px)', animationDelay: '0.8s' }}
        />
        <div
          className="floating-particle"
          style={{ width: '16px', height: '16px', background: '#93c5fd', top: '74%', right: '16%', filter: 'blur(2px)', animationDelay: '2.1s' }}
        />



        {/* The deep sapphire blue field revealed through the zoom */}
        <div data-op-field />

        {/* SVG Art with text clip-path */}
        <svg data-op-art aria-hidden="true">
          <defs>
            <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
              <text
                data-op-glyph
                x="0"
                y="0"
                style={{
                  fontFamily: DEFAULT_FONT,
                  fontWeight: 900,
                  fontSize: 100,
                  letterSpacing: '-0.03em',
                  fontKerning: 'none',
                }}
              >
                {word}
              </text>
            </clipPath>
          </defs>
        </svg>

        {/* Interactive letter selection hitboxes */}
        <div data-op-choices role="radiogroup" aria-label="Select letter">
          {characters.map(({ char, index }) => (
            <button
              type="button"
              key={index}
              data-op-letter={index}
              aria-label={`Letter ${char}`}
            />
          ))}
        </div>

        {/* Top Badge: ✦ SMART EXPENSES AI */}
        <div data-op-header>
          <div data-op-badge>
            <span>✦</span> SMART EXPENSES AI
          </div>
        </div>

        {/* Tagline & 3 Feature Items */}
        <div data-op-hero-details>
          <div data-op-tagline>
            Track smarter. Spend better. Save more.
          </div>

          <div data-op-features-row>
            {/* 1. Expense Tracking */}
            <div className="feature-chip">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
              <span>Expense Tracking</span>
            </div>

            {/* 2. AI Predictions */}
            <div className="feature-chip">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
              <span>AI Predictions</span>
            </div>

            {/* 3. Smart Savings */}
            <div className="feature-chip">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
              <span>Smart Savings</span>
            </div>
          </div>
        </div>

        {/* Bottom-center hint & Glowing Enter Button */}
        <div data-op-footer>
          <span data-op-scroll-hint>
            Scroll down to zoom inside ↓
          </span>
          <button
            type="button"
            data-op-enter-btn
            onClick={scrollToLogin}
          >
            ✦ Zoom In to Enter &darr;
          </button>
        </div>
      </div>

      {/* Step 3: Login Section Revealed at the End of the Zoom Scroll */}
      <div
        ref={loginSectionRef}
        data-op-content
      >
        <Login onContinue={handleContinueToApp} isEmbedded={true} />
      </div>
    </div>
  );
}
