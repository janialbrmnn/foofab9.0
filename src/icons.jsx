// Icons — Foodciety wordmark + futuristic power orb

const PowerIcon = ({ size = 64, color = 'currentColor' }) => (
  <img src="assets/power.png" alt="" width={size} height={size}
    style={{ display: 'block' }} />
);

// Futuristic pulsing orb — dark core, rotating conic ring, soft glow
const PowerOrb = ({ size = 220, pulsing = true, onClick, label }) => (
  <button
    onClick={onClick}
    aria-label={label || 'enter'}
    style={{
      position: 'relative',
      width: size,
      height: size,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'transparent',
      cursor: 'pointer',
    }}
  >
    {/* expanding pulse rings */}
    {pulsing && (
      <>
        <span style={{
          position: 'absolute', inset: 0,
          borderRadius: '50%',
          border: '1px solid color-mix(in srgb, var(--accent) 55%, transparent)',
          animation: 'pulse-ring 2.6s cubic-bezier(.2,.8,.2,1) infinite',
        }} />
        <span style={{
          position: 'absolute', inset: 0,
          borderRadius: '50%',
          border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)',
          animation: 'pulse-ring 2.6s cubic-bezier(.2,.8,.2,1) 0.9s infinite',
        }} />
      </>
    )}

    {/* rotating conic ring */}
    <span style={{
      position: 'absolute', inset: -6,
      borderRadius: '50%',
      background: 'conic-gradient(from 0deg, transparent 0%, var(--accent) 18%, transparent 40%, transparent 60%, color-mix(in srgb, var(--accent) 45%, transparent) 78%, transparent 100%)',
      WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px))',
      mask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px))',
      animation: 'orb-rotate 4s linear infinite',
    }} />
    {/* second ring, counter-rotating */}
    <span style={{
      position: 'absolute', inset: 6,
      borderRadius: '50%',
      background: 'conic-gradient(from 180deg, transparent 0%, color-mix(in srgb, var(--accent) 40%, transparent) 12%, transparent 30%)',
      WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1px))',
      mask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1px))',
      animation: 'orb-rotate-rev 7s linear infinite',
    }} />

    {/* core — warm accent orb instead of black */}
    <span style={{
      position: 'relative',
      width: '78%', height: '78%',
      borderRadius: '50%',
      background: 'radial-gradient(circle at 32% 26%, color-mix(in srgb, var(--accent) 42%, #fff) 0%, var(--accent) 58%, color-mix(in srgb, var(--accent) 62%, #16140f) 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 22px 55px color-mix(in srgb, var(--accent) 42%, transparent), 0 0 40px color-mix(in srgb, var(--accent) 22%, transparent), inset 0 1px 2px rgba(255,255,255,0.45)',
    }}>
      <img src="assets/power.png" alt="" width={size * 0.3} height={size * 0.3 * (639/571)}
        style={{ display: 'block', filter: 'invert(1) drop-shadow(0 0 10px rgba(255,255,255,0.6))' }} />
    </span>
  </button>
);

// Wordmark — Foodciety logo PNG
const Wordmark = ({ height = 22 }) => (
  <img src="assets/foodciety-logo.png" alt="foodciety" style={{ height, width: 'auto', display: 'block' }} />
);

const PowerMark = ({ size = 18 }) => (
  <img src="assets/power.png" alt="" width={size} height={size * (639/571)} style={{ display: 'block' }} />
);

const Arrow = ({ dir = 'right', size = 14 }) => {
  const rotations = { right: 0, down: 90, left: 180, up: 270 };
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" style={{ transform: `rotate(${rotations[dir]}deg)`, flexShrink: 0 }}>
      <path d="M 2 8 L 14 8 M 9 3 L 14 8 L 9 13" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="square" />
    </svg>
  );
};

// Small back control in eyebrow style — replaces the "[ 002 / create ]"
// kicker above page headlines.
const BackKicker = ({ lang = 'en', onClick, style = {} }) => (
  <button
    onClick={onClick}
    style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '8px 2px', minHeight: 0,
      color: 'var(--fg-3)',
      fontSize: 'calc(12px * var(--scale))',
      letterSpacing: '0.18em',
      cursor: 'pointer',
      transition: 'color 140ms',
      ...style,
    }}
    onMouseEnter={e => { e.currentTarget.style.color = 'var(--fg)'; }}
    onMouseLeave={e => { e.currentTarget.style.color = 'var(--fg-3)'; }}
  >
    ← {lang === 'de' ? 'zurück' : 'back'}
  </button>
);

const Cross = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16">
    <path d="M 3 3 L 13 13 M 13 3 L 3 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square" />
  </svg>
);

const Plus = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16">
    <path d="M 8 2 V 14 M 2 8 H 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square" />
  </svg>
);

Object.assign(window, { PowerIcon, PowerOrb, Wordmark, PowerMark, Arrow, Cross, Plus, BackKicker });
