// Configurator — multi-step wizard with live 3D-ish product preview

const SHAPES = [
  { id: 'bear',    label: 'bär',      glyph: 'M32 8 C 22 8 18 16 18 22 C 10 22 6 28 6 36 C 6 48 18 56 32 56 C 46 56 58 48 58 36 C 58 28 54 22 46 22 C 46 16 42 8 32 8 Z' },
  { id: 'worm',    label: 'wurm',     glyph: 'M10 32 Q 10 20 22 20 Q 34 20 34 32 Q 34 44 46 44 Q 58 44 58 32' },
  { id: 'cube',    label: 'würfel',   glyph: 'M14 14 H 50 V 50 H 14 Z' },
  { id: 'heart',   label: 'herz',     glyph: 'M32 50 C 10 36 10 20 22 16 C 28 14 32 18 32 22 C 32 18 36 14 42 16 C 54 20 54 36 32 50 Z' },
  { id: 'pickle',  label: 'pickle',   glyph: 'M18 12 Q 34 6 44 16 Q 58 28 50 44 Q 40 58 26 54 Q 12 48 14 34 Q 14 22 18 12 Z' },
  { id: 'ring',    label: 'ring',     glyph: 'M32 12 A 20 20 0 1 0 32 52 A 20 20 0 1 0 32 12 M 32 22 A 10 10 0 1 1 32 42 A 10 10 0 1 1 32 22' },
];

const FLAVORS = [
  { id: 'sour-pickle', label: 'sour pickle',    notes: 'salz · essig · dill',       stock: 'in stock' },
  { id: 'cheese',      label: 'smoked cheese',  notes: 'räuchernote · umami',       stock: 'in stock' },
  { id: 'lemon-salt',  label: 'lemon salt',     notes: 'zitrone · meersalz',        stock: 'in stock' },
  { id: 'tequila',     label: 'tequila lime',   notes: 'agave · limette (0% abv)',  stock: 'low stock' },
  { id: 'ferment',     label: 'fermentiert',    notes: 'kimchi · chili',            stock: 'preview' },
  { id: 'herb',        label: 'kräuter',        notes: 'rosmarin · thymian',        stock: 'preview' },
];

const PACKAGES = [
  { id: 'pouch',    label: 'doypack',    bases: ['gummies', 'hard candy', 'nuts'] },
  { id: 'jar',      label: 'jar',        bases: ['gummies', 'hard candy', 'nuts'] },
  { id: 'tin',      label: 'tin',        bases: ['gummies', 'hard candy', 'nuts'] },
  { id: 'tube',     label: 'tube',       bases: ['hard candy'] },
  { id: 'calendar', label: 'calendar',   bases: ['advent calendar'] },
  { id: 'bar',      label: 'choc bar',   bases: ['chocolate bars'] },
];

// Pick a sensible default pack for each base category
const DEFAULT_PACK_FOR_BASE = {
  'gummies': 'pouch',
  'hard candy': 'tin',
  'advent calendar': 'calendar',
  'chocolate bars': 'bar',
  'nuts': 'jar',
};

const STEPS = [
  { k: '01', id: 'base',    label: 'base',      de: 'basis' },
  { k: '02', id: 'shape',   label: 'shape',     de: 'form' },
  { k: '03', id: 'flavor',  label: 'flavor',    de: 'geschmack' },
  { k: '04', id: 'pack',    label: 'packaging', de: 'verpackung' },
  { k: '05', id: 'brand',   label: 'branding',  de: 'branding' },
  { k: '06', id: 'review',  label: 'drop it',   de: 'drop it' },
];

const Chip = ({ active, onClick, children, style }) => (
  <button
    onClick={onClick}
    style={{
      padding: '10px 14px',
      border: `1px solid ${active ? 'var(--fg)' : 'var(--line)'}`,
      background: active ? 'var(--fg)' : 'transparent',
      color: active ? 'var(--bg)' : 'var(--fg)',
      fontSize: 'calc(12px * var(--scale))',
      transition: 'all 140ms',
      cursor: 'pointer',
      ...style,
    }}
  >
    {children}
  </button>
);

// A glossy gummy with gradient, specular highlight, translucent edge
const Gummy = ({ shape, color, size = 40, rot = 0, style = {} }) => {
  const id = React.useId();
  const base = color;
  const activeShape = SHAPES.find(s => s.id === shape) || SHAPES[0];
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={{ transform: `rotate(${rot}deg)`, ...style }}>
      <defs>
        <radialGradient id={`g-${id}`} cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
          <stop offset="25%" stopColor={base} stopOpacity="0.95" />
          <stop offset="80%" stopColor={base} stopOpacity="1" />
          <stop offset="100%" stopColor={base} stopOpacity="1" />
        </radialGradient>
        <radialGradient id={`h-${id}`} cx="30%" cy="22%" r="20%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <filter id={`shadow-${id}`} x="-20%" y="-10%" width="140%" height="130%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" />
          <feOffset dx="0" dy="2" />
          <feComponentTransfer><feFuncA type="linear" slope="0.4" /></feComponentTransfer>
          <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <path d={activeShape.glyph} fill={`url(#g-${id})`} filter={`url(#shadow-${id})`} />
      <path d={activeShape.glyph} fill={`url(#h-${id})`} />
      {/* rim highlight — inner stroke */}
      <path d={activeShape.glyph} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.7" />
    </svg>
  );
};

// Renders the logo/photo area — user can upload images via Tweaks mode
const BrandSlot = ({ cfg, w = 120 }) => {
  if (cfg.logo) {
    return <img src={cfg.logo} alt="" style={{ maxWidth: w, maxHeight: 60, objectFit: 'contain' }} />;
  }
  return (
    <div style={{
      width: w, height: 46,
      background: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.08) 0 6px, rgba(255,255,255,0.02) 6px 12px)',
      border: '1px dashed rgba(255,255,255,0.35)',
      color: 'rgba(255,255,255,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 9, letterSpacing: '0.15em',
    }}>
      LOGO
    </div>
  );
};

// ───────────────────────────────────────────────────────────────────
// 3D Box primitive — renders a real box with front, top, side faces
// using translateZ. Put any DOM in `front` (label art) — `top` and
// `side` get tinted solid fills derived from the body color.
// ───────────────────────────────────────────────────────────────────
const Box3D = ({
  width = '60%',
  aspectRatio = '1 / 1',
  depth = 60,      // px — box depth
  front,           // JSX for front face
  top,             // optional JSX for top face (else solid fill)
  side,            // optional JSX for right side face (else solid fill)
  topFill = 'linear-gradient(180deg, #ece8dc 0%, #d6d2c4 100%)',
  sideFill = 'linear-gradient(90deg, #c9c5b7 0%, #aba89c 100%)',
  bodyShadow = '0 40px 80px rgba(22,20,15,0.35)',
}) => {
  const d = depth;
  return (
    <div style={{
      width,
      aspectRatio,
      position: 'relative',
      transformStyle: 'preserve-3d',
    }}>
      {/* Ground shadow — projected below the box, keeps filter out of the 3D context */}
      <div style={{
        position: 'absolute',
        left: '-10%', right: '-10%',
        bottom: `-${d}px`,
        height: 30,
        background: 'radial-gradient(ellipse 50% 60% at 50% 50%, rgba(22,20,15,0.45), transparent 70%)',
        transform: `translateZ(${-d/2}px) rotateX(90deg)`,
        transformOrigin: 'center top',
        pointerEvents: 'none',
      }} />
      {/* Back face — darker, sits behind */}
      <div style={{
        position: 'absolute', inset: 0,
        transform: `translateZ(${-d/2}px)`,
        background: 'linear-gradient(180deg, #8a8578 0%, #6d6a60 100%)',
      }} />

      {/* Right side face */}
      <div style={{
        position: 'absolute', top: 0, bottom: 0,
        right: 0,
        width: d,
        transform: `translateX(${d/2}px) rotateY(90deg)`,
        transformOrigin: 'left center',
        background: sideFill,
      }}>
        {side}
      </div>

      {/* Left side face */}
      <div style={{
        position: 'absolute', top: 0, bottom: 0,
        left: 0,
        width: d,
        transform: `translateX(${-d/2}px) rotateY(-90deg)`,
        transformOrigin: 'right center',
        background: sideFill,
        filter: 'brightness(0.85)',
      }} />

      {/* Top face */}
      <div style={{
        position: 'absolute', left: 0, right: 0,
        top: 0,
        height: d,
        transform: `translateY(${-d/2}px) rotateX(90deg)`,
        transformOrigin: 'center bottom',
        background: topFill,
      }}>
        {top}
      </div>

      {/* Bottom face */}
      <div style={{
        position: 'absolute', left: 0, right: 0,
        bottom: 0,
        height: d,
        transform: `translateY(${d/2}px) rotateX(-90deg)`,
        transformOrigin: 'center top',
        background: 'linear-gradient(180deg, #6d6a60 0%, #4a4840 100%)',
      }} />

      {/* Front face — the actual label / artwork */}
      <div style={{
        position: 'absolute', inset: 0,
        transform: `translateZ(${d/2}px)`,
      }}>
        {front}
      </div>
    </div>
  );
};

// Doypack — pouch with side gusset for visible depth
const DoypackFront = ({ cfg, color }) => (
  <div style={{
    width: '56%', aspectRatio: '0.72 / 1',
    position: 'relative',
    transformStyle: 'preserve-3d',
  }}>
    {/* back gusset — darker, slightly larger offset for depth */}
    <div style={{
      position: 'absolute', inset: 0,
      transform: 'translateZ(-18px)',
      clipPath: 'polygon(0% 8%, 8% 2%, 50% 0%, 92% 2%, 100% 8%, 100% 100%, 0% 100%)',
      background: 'linear-gradient(180deg, #b8b2a2 0%, #8a8475 100%)',
      filter: 'brightness(0.7)',
    }} />
    {/* right gusset strip */}
    <div style={{
      position: 'absolute', top: '6%', bottom: 0, right: 0,
      width: 36,
      transform: 'translateX(18px) rotateY(90deg)',
      transformOrigin: 'left center',
      background: 'linear-gradient(90deg, #d6d0c0 0%, #a8a393 100%)',
    }} />
    {/* left gusset strip */}
    <div style={{
      position: 'absolute', top: '6%', bottom: 0, left: 0,
      width: 36,
      transform: 'translateX(-18px) rotateY(-90deg)',
      transformOrigin: 'right center',
      background: 'linear-gradient(90deg, #9a9585 0%, #b8b2a2 100%)',
    }} />
    {/* front face */}
    <div style={{
      position: 'absolute', inset: 0,
      transform: 'translateZ(18px)',
      clipPath: 'polygon(0% 8%, 8% 2%, 50% 0%, 92% 2%, 100% 8%, 100% 100%, 0% 100%)',
      background: `
        linear-gradient(170deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 35%),
        linear-gradient(90deg, rgba(0,0,0,0.25) 0%, transparent 10%, transparent 88%, rgba(0,0,0,0.35) 100%),
        linear-gradient(180deg, #f6f3ec 0%, #ede9df 100%)
      `,
      boxShadow: '0 30px 60px rgba(22,20,15,0.3)',
    }}>
      {/* seal strip at top */}
      <div style={{
        position: 'absolute', top: '4%', left: 0, right: 0, height: '6%',
        background: 'repeating-linear-gradient(90deg, rgba(22,20,15,0.12) 0 2px, transparent 2px 4px)',
        borderBottom: '1px dashed rgba(22,20,15,0.2)',
      }} />
      {/* zipper */}
      <div style={{
        position: 'absolute', top: '11%', left: '6%', right: '6%', height: 2,
        background: 'rgba(22,20,15,0.25)',
      }} />

      {/* content padding area */}
      <div style={{
        position: 'absolute', inset: '18% 10% 8% 10%',
        display: 'flex', flexDirection: 'column', color: '#16140f',
      }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 'calc(8px * var(--scale))', letterSpacing: '0.2em', opacity: 0.5, textTransform: 'uppercase' }}>
          foofab · {cfg.base}
        </div>
        <BrandSlot cfg={cfg} />
        <div style={{
          marginTop: 8,
          fontFamily: 'var(--serif)',
          fontStyle: 'italic',
          fontSize: 'calc(28px * var(--scale))',
          lineHeight: 0.95,
          letterSpacing: '-0.01em',
        }}>
          {cfg.name || 'sour pickle'}
        </div>
        <div style={{
          marginTop: 4,
          fontFamily: 'var(--mono)',
          fontSize: 'calc(10px * var(--scale))',
          letterSpacing: '0.12em',
          opacity: 0.5,
          textTransform: 'uppercase',
        }}>
          {cfg.flavor?.replace('-',' ')}
        </div>

        {/* window with gummies visible */}
        <div style={{ flex: 1, marginTop: 12, position: 'relative',
          background: 'rgba(22,20,15,0.04)',
          border: '1px solid rgba(22,20,15,0.1)',
        }}>
          <GummyCluster cfg={cfg} color={color} />
        </div>

        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontFamily: 'var(--mono)',
          fontSize: 'calc(8px * var(--scale))',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          paddingTop: 8,
          marginTop: 8,
          borderTop: '1px solid rgba(22,20,15,0.15)',
          opacity: 0.7,
        }}>
          <span>net {cfg.weight}g</span>
          <span>by @{cfg.handle}</span>
        </div>
      </div>
    </div>
  </div>
);

// Glass jar — cylinder with lid; gets a back-mirror for depth
const JarFront = ({ cfg, color }) => (
  <div style={{ width: '50%', aspectRatio: '0.75 / 1', position: 'relative', transformStyle: 'preserve-3d' }}>
    {/* Back cylinder — darker, sits behind */}
    <div style={{
      position: 'absolute', inset: 0,
      transform: 'translateZ(-40px)',
      borderRadius: '4px 4px 10px 10px',
      background: 'linear-gradient(180deg, #6a6558 0%, #3e3b32 100%)',
      filter: 'brightness(0.6)',
    }} />
    {/* Right curve strip for cylindrical feel */}
    <div style={{
      position: 'absolute', top: '13%', bottom: 0, right: 0,
      width: 40,
      transform: 'translateX(20px) rotateY(90deg)',
      transformOrigin: 'left center',
      background: 'linear-gradient(90deg, rgba(255,255,255,0.15) 0%, rgba(240,235,220,0.4) 50%, rgba(120,115,100,0.6) 100%)',
      borderRadius: '0 0 10px 0',
    }} />

    {/* Front assembly */}
    <div style={{
      position: 'absolute', inset: 0,
      transform: 'translateZ(20px)',
    }}>
    {/* lid */}
    <div style={{
      position: 'absolute', top: 0, left: '4%', right: '4%', height: '14%',
      background: `
        linear-gradient(180deg, #2a2620 0%, #16140f 60%, #0a0907 100%)
      `,
      borderRadius: '6px 6px 2px 2px',
      boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.4), 0 2px 0 rgba(0,0,0,0.3)',
    }}>
      <div style={{
        position: 'absolute', inset: '20% 4% 20% 4%',
        background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0 2px, transparent 2px 4px)',
      }} />
    </div>

    <div style={{
      position: 'absolute', top: '13%', left: 0, right: 0, bottom: 0,
      borderRadius: '4px 4px 10px 10px',
      background: `
        linear-gradient(90deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.1) 15%, rgba(255,255,255,0) 45%, rgba(255,255,255,0.1) 80%, rgba(255,255,255,0.35) 100%),
        linear-gradient(180deg, rgba(240,235,220,0.7) 0%, rgba(230,225,210,0.5) 100%)
      `,
      border: '1px solid rgba(22,20,15,0.15)',
      boxShadow: '0 30px 60px rgba(22,20,15,0.3), inset 0 0 40px rgba(255,255,255,0.3)',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: '18%', left: '8%', right: '8%', bottom: '18%',
        background: '#f6f3ec',
        color: '#16140f',
        border: '1px solid rgba(22,20,15,0.1)',
        padding: '12px 10px',
        display: 'flex', flexDirection: 'column', gap: 4,
        boxShadow: 'inset 0 0 20px rgba(22,20,15,0.05)',
      }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 'calc(7px * var(--scale))', letterSpacing: '0.2em', opacity: 0.5, textTransform: 'uppercase' }}>
          foofab
        </div>
        <div style={{
          fontFamily: 'var(--serif)', fontStyle: 'italic',
          fontSize: 'calc(22px * var(--scale))',
          lineHeight: 0.95,
        }}>
          {cfg.name || 'sour pickle'}
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 'calc(8px * var(--scale))', letterSpacing: '0.15em', opacity: 0.5, textTransform: 'uppercase' }}>
          {cfg.base} · {cfg.weight}g
        </div>
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: 'calc(7px * var(--scale))', letterSpacing: '0.12em', opacity: 0.5, textTransform: 'uppercase' }}>
          <span>@{cfg.handle}</span>
          <span>lot {String(cfg.units).slice(0,4)}</span>
        </div>
      </div>

      <div style={{
        position: 'absolute', top: '2%', left: '4%', right: '4%', height: '14%',
        overflow: 'hidden',
      }}>
        <GummyCluster cfg={cfg} color={color} compact />
      </div>
    </div>
    </div>
  </div>
);

// Tin — real 3D rectangular box with embossed lid, visible side + top
const TinFront = ({ cfg, color }) => {
  const frontArt = (
    <div style={{
      position: 'absolute', inset: 0,
      background: `
        linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 25%),
        linear-gradient(180deg, #d9d5c8 0%, #c1beb2 100%)
      `,
      border: '1px solid rgba(22,20,15,0.2)',
      overflow: 'hidden',
      color: '#16140f',
      padding: 20,
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        position: 'absolute', inset: 8,
        border: '1px solid rgba(22,20,15,0.18)',
        pointerEvents: 'none',
      }} />
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 'calc(8px * var(--scale))', letterSpacing: '0.2em', opacity: 0.5, textTransform: 'uppercase' }}>
            foofab · {cfg.base}
          </div>
          <div style={{
            marginTop: 6,
            fontFamily: 'var(--serif)', fontStyle: 'italic',
            fontSize: 'calc(30px * var(--scale))',
            lineHeight: 0.95,
          }}>
            {cfg.name || 'sour pickle'}
          </div>
        </div>
        <BrandSlot cfg={cfg} w={80} />
      </div>
      <div style={{ position: 'relative', flex: 1, marginTop: 10 }}>
        <GummyCluster cfg={cfg} color={color} />
      </div>
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: 'calc(8px * var(--scale))', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.6 }}>
        <span>net {cfg.weight}g</span>
        <span>@{cfg.handle}</span>
      </div>
    </div>
  );

  // Top face — embossed "foofab" wordmark strip
  const topArt = (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'rgba(22,20,15,0.4)',
      fontFamily: 'var(--mono)',
      fontSize: 10,
      letterSpacing: '0.3em',
      textTransform: 'uppercase',
      borderBottom: '1px solid rgba(22,20,15,0.15)',
    }}>
      foofab · {cfg.name || cfg.base}
    </div>
  );

  // Side face — vertical text
  const sideArt = (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'rgba(22,20,15,0.35)',
      fontFamily: 'var(--mono)',
      fontSize: 9,
      letterSpacing: '0.25em',
      textTransform: 'uppercase',
      writingMode: 'vertical-rl',
    }}>
      net {cfg.weight}g
    </div>
  );

  return (
    <Box3D
      width="58%"
      aspectRatio="1 / 0.82"
      depth={85}
      front={frontArt}
      top={topArt}
      side={sideArt}
      topFill="linear-gradient(180deg, #e2dece 0%, #c9c5b7 100%)"
      sideFill="linear-gradient(90deg, #b8b4a6 0%, #9a9789 100%)"
    />
  );
};

// Tube — tall cylinder, rounded top, flat screwcap; with back-mirror for depth
const TubeFront = ({ cfg, color }) => (
  <div style={{ width: '28%', aspectRatio: '0.4 / 1', position: 'relative', transformStyle: 'preserve-3d' }}>
    {/* back body */}
    <div style={{
      position: 'absolute', top: '8%', left: 0, right: 0, bottom: 0,
      transform: 'translateZ(-24px)',
      borderRadius: '20px 20px 6px 6px',
      background: 'linear-gradient(180deg, #9a9585 0%, #6b6658 100%)',
    }} />
    {/* right curve strip */}
    <div style={{
      position: 'absolute', top: '8%', bottom: 0, right: 0,
      width: 24,
      transform: 'translateX(12px) rotateY(90deg)',
      transformOrigin: 'left center',
      background: 'linear-gradient(90deg, rgba(255,255,255,0.25) 0%, #d8d3c3 60%, #808073 100%)',
    }} />

    {/* front assembly */}
    <div style={{
      position: 'absolute', inset: 0,
      transform: 'translateZ(12px)',
    }}>
    <div style={{
      position: 'absolute', top: 0, left: '10%', right: '10%', height: '9%',
      background: 'linear-gradient(180deg, #2a2620 0%, #16140f 100%)',
      borderRadius: '3px 3px 1px 1px',
    }} />
    <div style={{
      position: 'absolute', top: '8%', left: 0, right: 0, bottom: 0,
      borderRadius: '20px 20px 6px 6px',
      background: `
        linear-gradient(90deg, rgba(0,0,0,0.25) 0%, transparent 15%, transparent 85%, rgba(0,0,0,0.25) 100%),
        linear-gradient(180deg, #f6f3ec 0%, #ede9df 100%)
      `,
      boxShadow: '0 30px 60px rgba(22,20,15,0.3)',
      color: '#16140f',
      padding: '18px 10px',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      overflow: 'hidden',
    }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 'calc(7px * var(--scale))', letterSpacing: '0.2em', opacity: 0.5, textTransform: 'uppercase' }}>
        foofab
      </div>
      <div style={{
        marginTop: 20,
        fontFamily: 'var(--serif)', fontStyle: 'italic',
        fontSize: 'calc(20px * var(--scale))',
        lineHeight: 0.95,
        writingMode: 'vertical-rl',
        transform: 'rotate(180deg)',
        textAlign: 'center',
      }}>
        {cfg.name || 'sour pickle'}
      </div>
      <div style={{ marginTop: 'auto', fontFamily: 'var(--mono)', fontSize: 'calc(7px * var(--scale))', letterSpacing: '0.12em', opacity: 0.5, textTransform: 'uppercase' }}>
        {cfg.weight}g
      </div>
    </div>
    </div>
  </div>
);

// ───────────────────────────────────────────────────────────────────
// Adventskalender — deep box with 24-door grid on front
// ───────────────────────────────────────────────────────────────────
const CalendarFront = ({ cfg, color }) => {
  const accent = cfg.color;
  const frontArt = (
    <div style={{
      position: 'absolute', inset: 0,
      background: `
        linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.08) 100%),
        linear-gradient(160deg, #f6f3ec 0%, #e5e0d2 100%)
      `,
      padding: '18px 16px 14px',
      display: 'flex', flexDirection: 'column',
      color: '#16140f',
    }}>
      {/* header strip */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 12 }}>
        <div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 'calc(8px * var(--scale))', letterSpacing: '0.22em', opacity: 0.55, textTransform: 'uppercase' }}>
            foofab · adventskalender
          </div>
          <div style={{
            marginTop: 4,
            fontFamily: 'var(--serif)', fontStyle: 'italic',
            fontSize: 'calc(22px * var(--scale))',
            lineHeight: 1,
          }}>
            {cfg.name || '24 tage drop'}
          </div>
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 'calc(9px * var(--scale))', letterSpacing: '0.2em', opacity: 0.55, textAlign: 'right' }}>
          24<br/>türchen
        </div>
      </div>

      {/* 24-door grid — 6 cols × 4 rows */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gridTemplateRows: 'repeat(4, 1fr)',
        gap: 3,
        padding: 6,
        background: 'rgba(22,20,15,0.08)',
        border: '1px solid rgba(22,20,15,0.12)',
      }}>
        {Array.from({ length: 24 }, (_, i) => {
          // scatter accent-fill to a few random doors for visual rhythm
          const isAccent = [2, 7, 11, 18, 22].includes(i);
          const day = i + 1;
          return (
            <div key={i} style={{
              position: 'relative',
              background: isAccent
                ? accent
                : 'linear-gradient(180deg, #ffffff 0%, #ece7d8 100%)',
              border: '1px solid rgba(22,20,15,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: isAccent ? '#ffffff' : '#16140f',
              fontFamily: 'var(--mono)',
              fontSize: 'calc(11px * var(--scale))',
              fontWeight: 700,
              letterSpacing: '0.02em',
              boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.5), inset -1px -1px 0 rgba(22,20,15,0.15)',
            }}>
              {day}
              {/* subtle perforation line */}
              <div style={{
                position: 'absolute', inset: '0 0 0 0',
                borderLeft: '1px dashed rgba(22,20,15,0.15)',
                pointerEvents: 'none',
                width: '22%',
              }} />
            </div>
          );
        })}
      </div>

      {/* footer */}
      <div style={{
        marginTop: 10,
        display: 'flex', justifyContent: 'space-between',
        fontFamily: 'var(--mono)',
        fontSize: 'calc(8px * var(--scale))',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        opacity: 0.65,
        paddingTop: 6,
        borderTop: '1px solid rgba(22,20,15,0.15)',
      }}>
        <span>{cfg.weight}g netto</span>
        <span>by @{cfg.handle}</span>
      </div>
    </div>
  );

  const topArt = (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(180deg, #efebdd 0%, #d0ccbd 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      borderBottom: '1px solid rgba(22,20,15,0.15)',
      color: 'rgba(22,20,15,0.4)',
      fontFamily: 'var(--mono)',
      fontSize: 10,
      letterSpacing: '0.3em',
      textTransform: 'uppercase',
    }}>
      open · tag für tag
    </div>
  );

  const sideArt = (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(90deg, rgba(255,255,255,0.15) 0%, transparent 40%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'rgba(22,20,15,0.4)',
      fontFamily: 'var(--serif)',
      fontStyle: 'italic',
      fontSize: 14,
      writingMode: 'vertical-rl',
    }}>
      {cfg.name || 'adventskalender'} · 2025
    </div>
  );

  return (
    <Box3D
      width="72%"
      aspectRatio="1.2 / 1"
      depth={70}
      front={frontArt}
      top={topArt}
      side={sideArt}
      topFill="linear-gradient(180deg, #efebdd 0%, #d0ccbd 100%)"
      sideFill="linear-gradient(90deg, #c9c5b7 0%, #a29e90 100%)"
    />
  );
};

// ───────────────────────────────────────────────────────────────────
// Bars — flat rectangular display box with individually wrapped bars in a tray
// ───────────────────────────────────────────────────────────────────
const BarFront = ({ cfg, color }) => {
  const accent = cfg.color;
  // Render bars in a 3×4 grid inside the display box
  const frontArt = (
    <div style={{
      position: 'absolute', inset: 0,
      background: `
        linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.1) 100%),
        linear-gradient(180deg, #1f1d18 0%, #15130e 100%)
      `,
      color: '#ece9dd',
      padding: '16px 14px 12px',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 10 }}>
        <div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 'calc(8px * var(--scale))', letterSpacing: '0.22em', opacity: 0.6, textTransform: 'uppercase' }}>
            foofab · bars · 12er
          </div>
          <div style={{
            marginTop: 4,
            fontFamily: 'var(--serif)', fontStyle: 'italic',
            fontSize: 'calc(22px * var(--scale))',
            lineHeight: 0.95,
          }}>
            {cfg.name || 'protein riegel'}
          </div>
          <div style={{ marginTop: 3, fontFamily: 'var(--mono)', fontSize: 'calc(9px * var(--scale))', letterSpacing: '0.15em', opacity: 0.55, textTransform: 'uppercase' }}>
            {cfg.flavor?.replace('-',' ')}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'end', gap: 4 }}>
          <div style={{
            padding: '3px 8px',
            background: accent,
            color: '#16140f',
            fontFamily: 'var(--mono)', fontSize: 'calc(8px * var(--scale))',
            letterSpacing: '0.15em', fontWeight: 700,
          }}>
            12 × {cfg.weight}g
          </div>
          <BrandSlot cfg={cfg} w={70} />
        </div>
      </div>

      {/* bar tray — individually wrapped bars */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(4, 1fr)',
        gap: 4,
        padding: 6,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}>
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} style={{
            position: 'relative',
            background: `
              linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 35%),
              linear-gradient(90deg, rgba(0,0,0,0.25) 0%, transparent 15%, transparent 85%, rgba(0,0,0,0.25) 100%),
              ${i % 3 === 1 ? accent : '#ece9dd'}
            `,
            border: '1px solid rgba(22,20,15,0.3)',
            color: i % 3 === 1 ? '#16140f' : '#1f1d18',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--serif)', fontStyle: 'italic',
            fontSize: 'calc(10px * var(--scale))',
            letterSpacing: '-0.01em',
            overflow: 'hidden',
          }}>
            {/* wrapper seal lines */}
            <div style={{
              position: 'absolute', top: 0, bottom: 0, left: '18%',
              borderLeft: '1px dashed rgba(22,20,15,0.2)',
            }} />
            <div style={{
              position: 'absolute', top: 0, bottom: 0, right: '18%',
              borderRight: '1px dashed rgba(22,20,15,0.2)',
            }} />
            <span style={{ fontSize: 'calc(8px * var(--scale))', fontFamily: 'var(--mono)', letterSpacing: '0.1em', textTransform: 'uppercase', fontStyle: 'normal' }}>
              {(cfg.name || 'bar').slice(0, 3)}
            </span>
          </div>
        ))}
      </div>

      {/* footer */}
      <div style={{
        marginTop: 8,
        display: 'flex', justifyContent: 'space-between',
        fontFamily: 'var(--mono)',
        fontSize: 'calc(8px * var(--scale))',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        opacity: 0.6,
        paddingTop: 6,
        borderTop: '1px solid rgba(255,255,255,0.1)',
      }}>
        <span>net {cfg.weight * 12}g · 12 stk</span>
        <span>@{cfg.handle}</span>
      </div>
    </div>
  );

  const topArt = (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(180deg, #2a2620 0%, #16140f 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'rgba(236,233,221,0.4)',
      fontFamily: 'var(--mono)',
      fontSize: 10,
      letterSpacing: '0.3em',
      textTransform: 'uppercase',
    }}>
      bars · {cfg.flavor?.replace('-',' ')}
    </div>
  );

  const sideArt = (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(90deg, rgba(0,0,0,0.3) 0%, transparent 40%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'rgba(236,233,221,0.5)',
      fontFamily: 'var(--mono)',
      fontSize: 9,
      letterSpacing: '0.25em',
      textTransform: 'uppercase',
      writingMode: 'vertical-rl',
    }}>
      foofab · 12 × {cfg.weight}g
    </div>
  );

  return (
    <Box3D
      width="68%"
      aspectRatio="1.05 / 1"
      depth={44}
      front={frontArt}
      top={topArt}
      side={sideArt}
      topFill="linear-gradient(180deg, #2a2620 0%, #16140f 100%)"
      sideFill="linear-gradient(90deg, #1f1d18 0%, #0c0a07 100%)"
    />
  );
};

// Reusable gummy cluster
const GummyCluster = ({ cfg, color, compact = false }) => {
  const gummies = React.useMemo(() => {
    const seed = cfg.density;
    const arr = [];
    const count = compact ? Math.min(cfg.density, 5) : cfg.density;
    for (let i = 0; i < count; i++) {
      const r = Math.sin(i * 17.31 + seed * 3.7);
      const r2 = Math.sin(i * 7.19 + seed * 2.1);
      arr.push({
        i,
        x: 12 + ((Math.abs(r) * 100) % 76),
        y: 15 + ((Math.abs(r2) * 100) % 70),
        rot: ((r * 180 + 360) % 360),
        size: compact ? 16 + ((Math.abs(r) * 10) % 6) : 26 + ((Math.abs(r) * 16) % 14),
        z: Math.abs(r2),
      });
    }
    return arr.sort((a, b) => a.z - b.z);
  }, [cfg.density, cfg.shape, compact]);

  return (
    <>
      {gummies.map(g => (
        <div key={g.i} style={{
          position: 'absolute',
          left: `${g.x}%`, top: `${g.y}%`,
          transform: 'translate(-50%, -50%)',
          filter: `drop-shadow(0 2px 2px rgba(0,0,0,${0.2 + g.z * 0.15}))`,
        }}>
          <Gummy shape={cfg.shape} color={color} size={g.size} rot={g.rot} />
        </div>
      ))}
    </>
  );
};

const ProductPreview = ({ cfg, tilt }) => {
  const color = cfg.color;

  return (
    <div style={{
      width: '100%',
      aspectRatio: '1 / 1.15',
      position: 'relative',
      background: 'linear-gradient(160deg, var(--bg-2) 0%, var(--bg) 60%, var(--bg-2) 100%)',
      border: '1px solid var(--line)',
      overflow: 'hidden',
      perspective: '1600px',
      cursor: 'grab',
    }}>
      {/* floor shadow */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 60% 10% at 50% 92%, rgba(22,20,15,0.22), transparent 60%)',
        pointerEvents: 'none',
      }} />

      {/* dot grid bg */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.22 }}>
        <defs>
          <pattern id="dots-pv" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="14" cy="14" r="0.6" fill="var(--fg-3)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots-pv)" />
      </svg>

      {/* stage with 3d tilt */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transformStyle: 'preserve-3d',
      }}>
        <div style={{
          transformStyle: 'preserve-3d',
          transform: `rotateY(${tilt.y}deg) rotateX(${tilt.x}deg)`,
          transition: 'transform 160ms cubic-bezier(.2,.8,.2,1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: '100%', height: '100%',
        }}>
          {cfg.pack === 'pouch'    && <DoypackFront cfg={cfg} color={color} />}
          {cfg.pack === 'jar'      && <JarFront cfg={cfg} color={color} />}
          {cfg.pack === 'tin'      && <TinFront cfg={cfg} color={color} />}
          {cfg.pack === 'tube'     && <TubeFront cfg={cfg} color={color} />}
          {cfg.pack === 'calendar' && <CalendarFront cfg={cfg} color={color} />}
          {cfg.pack === 'bar'      && <BarFront cfg={cfg} color={color} />}
        </div>
      </div>

      {/* readout */}
      <div style={{
        position: 'absolute',
        top: 12, left: 12,
        fontSize: 'calc(9px * var(--scale))',
        color: 'var(--fg-3)',
        letterSpacing: '0.15em',
      }}>
        preview · live · {cfg.pack}
      </div>
      <div style={{
        position: 'absolute',
        top: 12, right: 12,
        fontSize: 'calc(9px * var(--scale))',
        color: 'var(--fg-3)',
        letterSpacing: '0.15em',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} />
        rendering
      </div>
      <div style={{
        position: 'absolute',
        bottom: 12, left: 12, right: 12,
        fontSize: 'calc(9px * var(--scale))',
        color: 'var(--fg-3)',
        letterSpacing: '0.1em',
        display: 'flex', justifyContent: 'space-between',
      }}>
        <span>rot y: {tilt.y.toFixed(0)}° · x: {tilt.x.toFixed(0)}°</span>
        <span>drag to rotate</span>
      </div>
    </div>
  );
};

const LaunchOverlay = ({ cfg, onClose }) => {
  const [tilt, setTilt] = React.useState({ x: -12, y: 24 });
  // slow auto-spin for the hero reveal
  React.useEffect(() => {
    let raf, t0 = performance.now();
    const tick = (t) => {
      setTilt({ x: -12, y: 24 + (t - t0) * 0.012 });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const retail = 3.49;
  const grossRev = cfg.units * retail;
  const confetti = Array.from({ length: 40 });

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'var(--bg)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
      animation: 'fadeUp 0.4s cubic-bezier(.2,.8,.2,1) both',
    }}>
      {/* confetti */}
      {confetti.map((_, i) => {
        const rnd = (n) => { const x = Math.sin(i * n) * 43758.5; return x - Math.floor(x); };
        const colors = ['var(--accent)', 'var(--fg)', '#f2c94c', '#7a9a3a'];
        return (
          <span key={i} style={{
            position: 'absolute',
            top: '-5%', left: `${rnd(1.3) * 100}%`,
            width: 6 + rnd(2.1) * 8, height: 6 + rnd(3.2) * 10,
            background: colors[Math.floor(rnd(4.4) * 4) % 4],
            opacity: 0.85,
            transform: `rotate(${rnd(5.5) * 360}deg)`,
            animation: `confetti-fall ${2.4 + rnd(6.6) * 2.6}s linear ${rnd(7.7) * 1.5}s infinite`,
          }} />
        );
      })}

      {/* top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 32px', position: 'relative', zIndex: 2 }}>
        <Wordmark height={22} />
        <button onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--fg-2)', fontSize: 'calc(11px * var(--scale))', letterSpacing: '0.1em' }}>
          <Cross /> back to editor
        </button>
      </div>

      {/* hero */}
      <div className="launch-hero" style={{
        flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr',
        alignItems: 'center', gap: 20, padding: '0 32px 32px',
        position: 'relative', zIndex: 2, minHeight: 0,
      }}>
        {/* left: copy */}
        <div>
          <div style={{ color: 'var(--accent)', fontSize: 'calc(12px * var(--scale))', letterSpacing: '0.3em', marginBottom: 20, animation: 'blink 1.4s step-end infinite' }}>
            ● idea received · #DRP-0124
          </div>
          <h1 style={{ fontSize: 'clamp(48px, 7vw, 110px)', lineHeight: 0.9, letterSpacing: '-0.03em', marginBottom: 24 }}>
            idea<br/><span className="word-em" style={{ color: 'var(--accent)' }}>dropped.</span>
          </h1>
          <p style={{ color: 'var(--fg-2)', fontSize: 'calc(15px * var(--scale))', lineHeight: 1.6, maxWidth: 420, marginBottom: 32 }}>
            <strong style={{ color: 'var(--fg)' }}>{cfg.name}</strong> is in. the foodciety team reviews your drop and gets back to you within 48h. then it goes into production.
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 4, flexWrap: 'wrap' }}>
            {['↗ share', '⊕ new drop'].map((t, i) => (
              <button key={i} onClick={i === 1 ? onClose : undefined} style={{
                padding: '14px 22px',
                background: i === 0 ? 'var(--fg)' : 'transparent',
                color: i === 0 ? 'var(--bg)' : 'var(--fg)',
                border: i === 0 ? 'none' : '1px solid var(--line)',
                fontSize: 'calc(12px * var(--scale))', fontWeight: 700, letterSpacing: '0.05em',
                cursor: 'pointer', minHeight: 44,
              }}>{t}</button>
            ))}
          </div>
        </div>

        {/* right: hero product */}
        <div className="launch-product" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0 }}>
          <div style={{ width: '100%', maxWidth: 520 }}>
            <ThreeProductPreview cfg={cfg} tilt={tilt} onTiltChange={setTilt} />
          </div>
        </div>
      </div>
    </div>
  );
};

const Configurator = ({ lang = 'en', initialStep = 0, onBack }) => {
  const LS_KEY = 'foofab-cfg-v1';
  const INITIAL_CFG = {
    base: 'gummies',
    shape: 'pickle',
    shapeId: 'KC00009',
    shapeName: 'Herzen',
    shapeImg: 'https://helper.suesse-werbung.de/sonderformen/img/KC00009_a.jpg',
    flavor: 'raspberry',
    flavorDe: 'Himbeere',
    pack: 'pouch',
    color: '#7a9a3a',
    name: 'sauer & käse',
    handle: 'foodcreator.hh',
    weight: 120,
    density: 9,
    units: 5000,
  };
  const [step, setStep] = React.useState(initialStep);
  const [cfg, setCfg] = React.useState(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const merged = { ...INITIAL_CFG, ...JSON.parse(saved) };
        // legacy base category migrated to chocolate bars
        if (merged.base === 'bars') merged.base = 'chocolate bars';
        return merged;
      }
    } catch (e) {}
    return INITIAL_CFG;
  });

  // Shapes catalogue (CSV) + flavors (XLSX) — loaded from bundled JSON
  const [shapesData, setShapesData] = React.useState([]);
  const [flavorsData, setFlavorsData] = React.useState([]);
  const [shapeCat, setShapeCat] = React.useState('alle');
  const [shapeSearch, setShapeSearch] = React.useState('');
  const [flavorSearch, setFlavorSearch] = React.useState('');
  React.useEffect(() => {
    fetch('assets/shapes.json').then(r => r.json()).then(setShapesData).catch(() => {});
    fetch('assets/flavors.json').then(r => r.json()).then(setFlavorsData).catch(() => {});
  }, []);
  const shapesFiltered = React.useMemo(() => {
    const q = shapeSearch.trim().toLowerCase();
    return shapesData.filter(s =>
      (shapeCat === 'alle' || s.cat === shapeCat) &&
      (!q || s.name.toLowerCase().includes(q))
    );
  }, [shapesData, shapeCat, shapeSearch]);
  const flavorsFiltered = React.useMemo(() => {
    const q = flavorSearch.trim().toLowerCase();
    return flavorsData.filter(f =>
      !q || f.de.toLowerCase().includes(q) || f.en.toLowerCase().includes(q)
    );
  }, [flavorsData, flavorSearch]);

  // Persist cfg (incl. uploaded logo + photo data URLs) to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(cfg));
    } catch (e) {
      // Quota exceeded (large images) — silently skip
    }
  }, [cfg]);

  const resetCfg = () => {
    localStorage.removeItem(LS_KEY);
    setCfg(INITIAL_CFG);
  };

  // AI label-background generator
  const [genPrompt, setGenPrompt] = React.useState('');
  const [genLoading, setGenLoading] = React.useState(false);
  const [genError, setGenError] = React.useState(null);
  const [launched, setLaunched] = React.useState(false);
  const RANDOM_PROMPTS = [
    'risograph-print von eingelegten gurken, erdige grüntöne, körnige textur',
    'abstraktes muster aus dill und senfkörnern, vintage food-packaging',
    '70s-retro food illustration, sauce-kleckse, warme senf- und olivtöne',
    'macro-foto von gummibärchen-textur, glänzend, satte farben',
    'handgezeichnete botanische illustration von kräutern, tinte auf cremepapier',
    'psychedelisches swirl-muster in terracotta und olive, siebdruck-look',
    'minimalistische bauhaus-formen, food-thema, primärfarben gedämpft',
    'collage aus retro-supermarkt-etiketten, halbton-raster, nostalgisch',
    'aquarell-textur von zitrusfrüchten, frisch, spritzig, hell',
    'grobkörniger film-scan von chili und gewürzen, dramatisches licht',
  ];
  const randomizePrompt = () => {
    let p = genPrompt;
    while (p === genPrompt) p = RANDOM_PROMPTS[Math.floor(Math.random() * RANDOM_PROMPTS.length)];
    setGenPrompt(p);
  };
  const generateBg = async () => {
    const prompt = genPrompt.trim();
    if (!prompt || genLoading) return;
    setGenLoading(true);
    setGenError(null);
    try {
      // Call the same-origin serverless proxy (api/generate.js on Vercel).
      // Direct browser → image API fails (no CORS headers on that server),
      // so the proxy makes the call server-side.
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) {
        if (res.status === 404) throw new Error('proxy not found. works on the live site (vercel), not in preview');
        throw new Error('server-fehler ' + res.status);
      }
      const data = await res.json();
      // api/generate.js responds { imageUrl } — normally a base64 data URL
      // (already same-origin safe). External URLs (raw-URL fallback or older
      // response shapes) go through the /api/image proxy, because the image
      // host sends no CORS headers and a direct load would taint the texture.
      const url = data?.imageUrl || data?.data?.images?.[0]?.url || data?.images?.[0]?.url;
      if (!url) throw new Error('keine bild-url erhalten');
      setCfg(prev => ({ ...prev, labelBgUrl: url.startsWith('data:') ? url : '/api/image?url=' + encodeURIComponent(url) }));
    } catch (e) {
      // Preview has no backend → demo the mapping with a bundled placeholder
      // so the label texture pipeline is testable without the live proxy.
      setCfg(prev => ({ ...prev, labelBgUrl: 'assets/label-placeholder.webp' }));
      setGenError('preview: proxy not reachable. showing placeholder artwork (real call works live on vercel)');
    } finally {
      setGenLoading(false);
    }
  };

  const [tilt, setTilt] = React.useState({ x: -16, y: 28 });
  const dragging = React.useRef(null);

  const onPointerDown = (e) => {
    dragging.current = { x: e.clientX, y: e.clientY, tilt: { ...tilt } };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!dragging.current) return;
    const dx = e.clientX - dragging.current.x;
    const dy = e.clientY - dragging.current.y;
    setTilt({
      y: dragging.current.tilt.y + dx * 0.4,
      x: Math.max(-30, Math.min(30, dragging.current.tilt.x - dy * 0.3)),
    });
  };
  const onPointerUp = () => { dragging.current = null; };

  const pricePer = 1.00;
  const retail = 3.49;
  const totalCost = cfg.units * pricePer;
  const grossRev = cfg.units * retail;
  const grossProfit = grossRev - totalCost;

  const colors = [
    { c: '#7a9a3a', l: 'dill green' },
    { c: '#f2c94c', l: 'lemon' },
    { c: '#c85250', l: 'paprika' },
    { c: '#8b5a3c', l: 'amber' },
    { c: '#e8e6e0', l: 'milk' },
    { c: '#3a3937', l: 'squid ink' },
  ];

  return (
    <div className="page-pad" style={{ padding: '80px 32px 48px', maxWidth: 1440, margin: '0 auto' }}>
      {/* header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', paddingBottom: 20, borderBottom: '1px solid var(--line)', marginBottom: 32 }}>
        <div>
          <div style={{ marginBottom: 12 }}>
            <BackKicker lang={lang} onClick={onBack} />
          </div>
          <h2 style={{ fontSize: 'calc(28px * var(--scale))', fontWeight: 400, letterSpacing: '-0.02em' }}>
            {lang === 'de' ? <>von der community zum produkt. in <span className="word-em" style={{ fontSize: '1.1em', color: 'var(--accent)' }}>tagen statt monaten</span>.</> : <>from community to product. in <span className="word-em" style={{ fontSize: '1.1em', color: 'var(--accent)' }}>days, not months</span>.</>}
          </h2>
        </div>
        <div style={{ textAlign: 'right', fontSize: 'calc(11px * var(--scale))', color: 'var(--fg-2)', letterSpacing: '0.08em' }}>
          <div>{lang === 'de' ? 'entwurf' : 'draft'} · #DRP-0124</div>
          <div style={{ color: 'var(--fg-3)' }}>{lang === 'de' ? 'auto-gespeichert · gerade eben' : 'auto-saved · just now'}</div>
        </div>
      </div>

      {/* stepper */}
      <div className="mobile-stepper" style={{ display: 'flex', gap: 0, marginBottom: 32, borderBottom: '1px solid var(--line)', overflowX: 'auto' }}>
        {STEPS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setStep(i)}
            style={{
              flex: '1 0 auto',
              minWidth: 110,
              padding: '14px 16px',
              textAlign: 'left',
              borderRight: i < STEPS.length - 1 ? '1px solid var(--line)' : 'none',
              borderBottom: step === i ? '2px solid var(--accent)' : '2px solid transparent',
              color: step === i ? 'var(--fg)' : 'var(--fg-3)',
              background: step === i ? 'var(--bg-2)' : 'transparent',
              transition: 'all 140ms',
              cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: 'calc(10px * var(--scale))', letterSpacing: '0.15em', marginBottom: 4 }}>
              {s.k}
            </div>
            <div style={{ fontSize: 'calc(13px * var(--scale))', color: step === i ? 'var(--fg)' : 'var(--fg-2)' }}>
              {lang === 'de' ? s.de : s.label}
            </div>
          </button>
        ))}
      </div>

      <div className="m-stack" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 40 }}>
        {/* LEFT: step content */}
        <div style={{ minHeight: 520 }}>
          {step === 0 && (
            <div>
              <label style={{ color: 'var(--fg-3)', fontSize: 'calc(10px * var(--scale))', letterSpacing: '0.2em' }}>
                {lang === 'de' ? 'wähle deine basis-kategorie' : 'pick your base category'}
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginTop: 16 }}>
                {['gummies', 'chocolate bars', 'nuts', 'hard candy', 'advent calendar'].map(b => (
                  <button key={b}
                    onClick={() => {
                      // When switching base, auto-swap to a compatible package
                      const newPack = DEFAULT_PACK_FOR_BASE[b] || cfg.pack;
                      setCfg({ ...cfg, base: b, pack: newPack });
                    }}
                    style={{
                      textAlign: 'left',
                      padding: 20,
                      border: `1px solid ${cfg.base === b ? 'var(--fg)' : 'var(--line)'}`,
                      background: cfg.base === b ? 'var(--bg-2)' : 'transparent',
                      color: 'inherit',
                      cursor: 'pointer',
                      transition: 'all 140ms',
                    }}
                  >
                    <div style={{ fontSize: 'calc(19px * var(--scale))', fontWeight: 700, marginBottom: 6, letterSpacing: '-0.01em' }}>{b}</div>
                    <div style={{ color: 'var(--fg-3)', fontSize: 'calc(11px * var(--scale))' }}>
                      {b === 'gummies' && 'black forest · moq 1'}
                      {b === 'chocolate bars' && (lang === 'de' ? 'vielfältige formen & profile' : 'diverse shapes & profiles')}
                      {b === 'nuts' && (lang === 'de' ? 'coated bis fully covered' : 'coated to fully covered')}
                      {b === 'hard candy' && (lang === 'de' ? 'premium-formate · custom dosen' : 'premium formats · custom tins')}
                      {b === 'advent calendar' && (lang === 'de' ? '24 türchen · saisonal' : '24 doors · seasonal')}
                    </div>
                  </button>
                ))}
              </div>

              <div style={{ marginTop: 32 }}>
                <label style={{ color: 'var(--fg-3)', fontSize: 'calc(10px * var(--scale))', letterSpacing: '0.2em' }}>
                  {lang === 'de' ? 'konzept-name' : 'concept name'}
                </label>
                <input
                  value={cfg.name}
                  onChange={e => setCfg({ ...cfg, name: e.target.value })}
                  style={{
                    display: 'block',
                    width: '100%',
                    marginTop: 8,
                    padding: '12px 14px',
                    background: 'var(--bg-2)',
                    border: '1px solid var(--line)',
                    color: 'var(--fg)',
                    fontFamily: 'inherit',
                    fontSize: 'calc(16px * var(--scale))',
                    textTransform: 'lowercase',
                  }}
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <label style={{ color: 'var(--fg-3)', fontSize: 'calc(10px * var(--scale))', letterSpacing: '0.2em' }}>
                {lang === 'de' ? 'form wählen' : 'pick a shape'} {shapesData.length ? `· ${shapesFiltered.length}/${shapesData.length}` : ''}
              </label>

              {/* category filter */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 14 }}>
                {['alle', 'Tiere', 'Essen/Trinken', 'Formen/Zeichen', 'Fahrzeuge', 'Hobby/Beruf', 'Mensch', 'Feiertage', 'Sonstiges'].map(c => (
                  <button key={c}
                    onClick={() => setShapeCat(c)}
                    style={{
                      padding: '7px 12px', minHeight: 34,
                      border: `1px solid ${shapeCat === c ? 'var(--fg)' : 'var(--line)'}`,
                      background: shapeCat === c ? 'var(--fg)' : 'transparent',
                      color: shapeCat === c ? 'var(--bg)' : 'var(--fg-2)',
                      fontSize: 'calc(10px * var(--scale))', cursor: 'pointer',
                    }}>
                    {c === 'alle' ? (lang === 'de' ? 'alle' : 'all') : c}
                  </button>
                ))}
              </div>

              {/* search */}
              <input
                value={shapeSearch}
                onChange={e => setShapeSearch(e.target.value)}
                placeholder={lang === 'de' ? 'suchen … (z.b. herz, auto, stern)' : 'search … (e.g. heart, car, star)'}
                style={{
                  width: '100%', marginTop: 12, padding: '11px 14px',
                  background: 'var(--bg-2)', border: '1px solid var(--line)',
                  color: 'var(--fg)', fontFamily: 'inherit', fontSize: 'calc(13px * var(--scale))',
                  textTransform: 'lowercase',
                }} />

              {/* shape grid */}
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(104px, 1fr))',
                gap: 8, marginTop: 14, maxHeight: 420, overflowY: 'auto',
                border: '1px solid var(--line)', padding: 8, background: 'var(--bg)',
              }}>
                {shapesFiltered.slice(0, 120).map(s => (
                  <button key={s.id}
                    onClick={() => setCfg({ ...cfg, shapeId: s.id, shapeName: s.name, shapeImg: s.img })}
                    title={s.name}
                    style={{
                      padding: 6,
                      border: `1px solid ${cfg.shapeId === s.id ? 'var(--fg)' : 'var(--line)'}`,
                      background: cfg.shapeId === s.id ? 'var(--bg-2)' : 'transparent',
                      color: 'inherit', cursor: 'pointer',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                    }}>
                    <img src={s.img} loading="lazy" alt={s.name}
                      style={{ width: '100%', aspectRatio: '1', objectFit: 'contain', background: '#fff' }} />
                    <span style={{
                      fontSize: 'calc(9px * var(--scale))', lineHeight: 1.25, textAlign: 'center',
                      overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                    }}>{s.name}</span>
                  </button>
                ))}
                {shapesFiltered.length === 0 && (
                  <div style={{ gridColumn: '1/-1', padding: 20, color: 'var(--fg-3)', fontSize: 12, textAlign: 'center' }}>
                    {lang === 'de' ? 'keine formen gefunden' : 'no shapes found'}
                  </div>
                )}
              </div>
              {cfg.shapeName && (
                <div style={{ marginTop: 10, fontSize: 'calc(11px * var(--scale))', color: 'var(--fg-2)' }}>
                  ✓ {cfg.shapeName} <span style={{ color: 'var(--fg-3)' }}>({cfg.shapeId})</span>
                </div>
              )}

              <div style={{ marginTop: 28 }}>
                <label style={{ color: 'var(--fg-3)', fontSize: 'calc(10px * var(--scale))', letterSpacing: '0.2em' }}>
                  {lang === 'de' ? 'farbe' : 'color'}
                </label>
                <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                  {colors.map(col => (
                    <button key={col.c}
                      onClick={() => setCfg({ ...cfg, color: col.c })}
                      title={col.l}
                      style={{
                        width: 36, height: 36,
                        background: col.c,
                        border: cfg.color === col.c ? '2px solid var(--fg)' : '1px solid var(--line)',
                        cursor: 'pointer',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <label style={{ color: 'var(--fg-3)', fontSize: 'calc(10px * var(--scale))', letterSpacing: '0.2em' }}>
                {lang === 'de' ? 'geschmack wählen' : 'pick a flavor'} {flavorsData.length ? `· ${flavorsData.length}` : ''}
              </label>
              <input
                value={flavorSearch}
                onChange={e => setFlavorSearch(e.target.value)}
                placeholder={lang === 'de' ? 'suchen … (z.b. himbeere, cola, matcha)' : 'search … (e.g. raspberry, cola, matcha)'}
                style={{
                  width: '100%', marginTop: 14, padding: '11px 14px',
                  background: 'var(--bg-2)', border: '1px solid var(--line)',
                  color: 'var(--fg)', fontFamily: 'inherit', fontSize: 'calc(13px * var(--scale))',
                  textTransform: 'lowercase',
                }} />
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: 6, marginTop: 14, maxHeight: 460, overflowY: 'auto',
                border: '1px solid var(--line)', padding: 8,
              }}>
                {flavorsFiltered.map(f => {
                  const label = lang === 'de' ? f.de : f.en;
                  const sel = cfg.flavor === f.en;
                  return (
                    <button key={f.en}
                      onClick={() => setCfg({ ...cfg, flavor: f.en, flavorDe: f.de })}
                      style={{
                        textAlign: 'left', padding: '11px 12px', minHeight: 42,
                        border: `1px solid ${sel ? 'var(--fg)' : 'var(--line)'}`,
                        background: sel ? 'var(--bg-2)' : 'transparent',
                        color: 'inherit', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 8,
                        fontSize: 'calc(12px * var(--scale))',
                      }}>
                      <span style={{
                        width: 10, height: 10, flexShrink: 0,
                        border: `1px solid ${sel ? 'var(--fg)' : 'var(--fg-3)'}`,
                        background: sel ? 'var(--accent)' : 'transparent',
                      }} />
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <label style={{ color: 'var(--fg-3)', fontSize: 'calc(10px * var(--scale))', letterSpacing: '0.2em' }}>{lang === 'de' ? 'verpackung' : 'packaging'}</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 16 }}>
                {PACKAGES.filter(p => p.bases.includes(cfg.base)).map(p => (
                  <button key={p.id}
                    onClick={() => setCfg({ ...cfg, pack: p.id })}
                    style={{
                      padding: '20px 12px',
                      border: `1px solid ${cfg.pack === p.id ? 'var(--fg)' : 'var(--line)'}`,
                      background: cfg.pack === p.id ? 'var(--bg-2)' : 'transparent',
                      color: 'inherit',
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    <div className="placeholder" style={{ height: 64, marginBottom: 10 }}>{p.id}</div>
                    <div style={{ fontSize: 'calc(12px * var(--scale))' }}>{p.label}</div>
                  </button>
                ))}
              </div>
              <div style={{ marginTop: 32 }}>
                <label style={{ color: 'var(--fg-3)', fontSize: 'calc(10px * var(--scale))', letterSpacing: '0.2em' }}>{lang === 'de' ? 'verpackungs-farbe' : 'packaging color'}</label>
                <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                  {[
                    { c: '#2f6b3f', l: 'forest' },
                    { c: '#c85250', l: 'tomato' },
                    { c: '#e0b53f', l: 'mustard' },
                    { c: '#2b3a67', l: 'navy' },
                    { c: '#16140f', l: 'ink' },
                    { c: '#efe9dd', l: 'cream' },
                    { c: '#b0472f', l: 'rust' },
                    { c: '#6a4fb0', l: 'grape' },
                  ].map(col => {
                    const active = (cfg.packColor || '#2f6b3f') === col.c;
                    return (
                      <button key={col.c}
                        onClick={() => setCfg({ ...cfg, packColor: col.c })}
                        title={col.l}
                        style={{
                          width: 36, height: 36, background: col.c,
                          border: active ? '2px solid var(--fg)' : '1px solid var(--line)',
                          cursor: 'pointer',
                        }} />
                    );
                  })}
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginLeft: 4, cursor: 'pointer', fontSize: 'calc(10px * var(--scale))', color: 'var(--fg-3)' }}>
                    <input type="color" value={cfg.packColor || '#2f6b3f'}
                      onChange={e => setCfg({ ...cfg, packColor: e.target.value })}
                      style={{ width: 36, height: 36, padding: 0, border: '1px solid var(--line)', background: 'none', cursor: 'pointer' }} />
                    {lang === 'de' ? 'eigene' : 'custom'}
                  </label>
                </div>
              </div>
              <div style={{ marginTop: 32 }}>
                <label style={{ color: 'var(--fg-3)', fontSize: 'calc(10px * var(--scale))', letterSpacing: '0.2em' }}>{lang === 'de' ? 'füllmenge' : 'fill weight'} · {cfg.weight}g</label>
                <input type="range" min={40} max={300} step={10} value={cfg.weight}
                  onChange={e => setCfg({ ...cfg, weight: +e.target.value })}
                  style={{ width: '100%', marginTop: 10, accentColor: 'var(--accent)' }}
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <label style={{ color: 'var(--fg-3)', fontSize: 'calc(10px * var(--scale))', letterSpacing: '0.2em' }}>branding</label>
              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 'calc(11px * var(--scale))', color: 'var(--fg-2)', marginBottom: 6 }}>{lang === 'de' ? 'produkt-name' : 'product name'}</div>
                  <input value={cfg.name}
                    onChange={e => setCfg({ ...cfg, name: e.target.value })}
                    style={{
                      width: '100%', padding: '12px 14px',
                      background: 'var(--bg-2)', border: '1px solid var(--line)',
                      color: 'var(--fg)', fontFamily: 'inherit', fontSize: 'calc(15px * var(--scale))',
                      textTransform: 'lowercase',
                    }} />
                </div>
                <div>
                  <div style={{ fontSize: 'calc(11px * var(--scale))', color: 'var(--fg-2)', marginBottom: 6 }}>creator handle</div>
                  <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-2)', border: '1px solid var(--line)' }}>
                    <span style={{ padding: '12px 0 12px 14px', color: 'var(--fg-3)' }}>@</span>
                    <input value={cfg.handle}
                      onChange={e => setCfg({ ...cfg, handle: e.target.value })}
                      style={{
                        flex: 1, padding: '12px 14px',
                        background: 'transparent', border: 'none',
                        color: 'var(--fg)', fontFamily: 'inherit', fontSize: 'calc(15px * var(--scale))',
                        outline: 'none',
                        textTransform: 'lowercase',
                      }} />
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 'calc(11px * var(--scale))', color: 'var(--fg-2)', marginBottom: 8 }}>{lang === 'de' ? 'logo hochladen (optional)' : 'upload logo (optional)'}</div>
                  <label style={{
                    display: 'block', height: 100, cursor: 'pointer',
                    border: '1px solid var(--line)',
                    background: cfg.logo ? 'var(--bg-2)' : 'transparent',
                    position: 'relative', overflow: 'hidden',
                  }} className={cfg.logo ? '' : 'placeholder'}>
                    {cfg.logo ? (
                      <>
                        <img src={cfg.logo} style={{ position: 'absolute', inset: 8, width: 'calc(100% - 16px)', height: 'calc(100% - 16px)', objectFit: 'contain' }} />
                        <button onClick={(e) => { e.preventDefault(); setCfg({ ...cfg, logo: null }); }}
                          style={{ position: 'absolute', top: 6, right: 6, background: 'var(--bg)', border: '1px solid var(--line)', padding: '4px 8px', fontSize: 10 }}>
                          {lang === 'de' ? 'entfernen' : 'remove'}
                        </button>
                      </>
                    ) : <span>{lang === 'de' ? 'klicken zum hochladen · svg / png' : 'click to upload · svg / png'}</span>}
                    <input type="file" accept="image/*" style={{ display: 'none' }}
                      onChange={e => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        const reader = new FileReader();
                        reader.onload = (ev) => setCfg({ ...cfg, logo: ev.target.result });
                        reader.readAsDataURL(f);
                      }} />
                  </label>
                </div>
                <div>
                  <div style={{ fontSize: 'calc(11px * var(--scale))', color: 'var(--fg-2)', marginBottom: 8 }}>{lang === 'de' ? 'produkt-foto (optional)' : 'product photo (optional)'}</div>
                  <label style={{
                    display: 'block', height: 100, cursor: 'pointer',
                    border: '1px solid var(--line)',
                    background: cfg.photo ? 'var(--bg-2)' : 'transparent',
                    position: 'relative', overflow: 'hidden',
                  }} className={cfg.photo ? '' : 'placeholder'}>
                    {cfg.photo ? (
                      <>
                        <img src={cfg.photo} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button onClick={(e) => { e.preventDefault(); setCfg({ ...cfg, photo: null }); }}
                          style={{ position: 'absolute', top: 6, right: 6, background: 'var(--bg)', border: '1px solid var(--line)', padding: '4px 8px', fontSize: 10 }}>
                          {lang === 'de' ? 'entfernen' : 'remove'}
                        </button>
                      </>
                    ) : <span>{lang === 'de' ? 'key visual · optional' : 'key visual · optional'}</span>}
                    <input type="file" accept="image/*" style={{ display: 'none' }}
                      onChange={e => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        const reader = new FileReader();
                        reader.onload = (ev) => setCfg({ ...cfg, photo: ev.target.result });
                        reader.readAsDataURL(f);
                      }} />
                  </label>
                </div>
                <div style={{ padding: 16, border: '1px solid var(--line)', background: 'var(--bg-2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <div style={{ fontSize: 'calc(10px * var(--scale))', letterSpacing: '0.15em', color: 'var(--fg-3)' }}>
                      {lang === 'de' ? 'ai-hintergrund' : 'ai background'}
                    </div>
                    {cfg.labelBgUrl && (
                      <button onClick={() => setCfg({ ...cfg, labelBgUrl: null })}
                        style={{ fontSize: 'calc(9px * var(--scale))', color: 'var(--fg-3)', border: '1px solid var(--line)', padding: '3px 8px', letterSpacing: '0.1em' }}>
                        {lang === 'de' ? 'entfernen' : 'remove'}
                      </button>
                    )}
                  </div>
                  <div style={{ position: 'relative' }}>
                    <textarea
                      value={genPrompt}
                      onChange={e => setGenPrompt(e.target.value)}
                      placeholder={lang === 'de' ? "beschreibe das label-artwork … z.b. 'risograph-print von eingelegten gurken, erdige töne, körnige textur'" : "describe the label artwork … e.g. 'risograph print of pickled cucumbers, earthy tones, grainy texture'"}
                      rows={3}
                      style={{
                        width: '100%', padding: '12px 14px',
                        background: 'var(--bg)', border: '1px solid var(--line)',
                        color: 'var(--fg)', fontFamily: 'inherit',
                        fontSize: 'calc(13px * var(--scale))', lineHeight: 1.5,
                        resize: 'vertical', textTransform: 'lowercase',
                      }} />
                  </div>
                  <button
                    onClick={randomizePrompt}
                    disabled={genLoading}
                    style={{
                      width: '100%', marginTop: 8, padding: '10px',
                      background: 'transparent', color: 'var(--fg-2)',
                      border: '1px solid var(--line)',
                      fontSize: 'calc(11px * var(--scale))',
                      letterSpacing: '0.08em', textTransform: 'uppercase',
                      cursor: genLoading ? 'default' : 'pointer',
                      minHeight: 40,
                    }}>
                    ⚄ {lang === 'de' ? 'prompt würfeln' : 'randomize prompt'}
                  </button>
                  <button
                    onClick={generateBg}
                    disabled={genLoading || !genPrompt.trim()}
                    style={{
                      width: '100%', marginTop: 10, padding: '13px',
                      background: genLoading ? 'var(--bg)' : 'var(--accent)',
                      color: genLoading ? 'var(--fg-3)' : 'var(--accent-ink)',
                      border: genLoading ? '1px solid var(--line)' : 'none',
                      fontSize: 'calc(12px * var(--scale))', fontWeight: 700,
                      letterSpacing: '0.08em', textTransform: 'uppercase',
                      cursor: (genLoading || !genPrompt.trim()) ? 'default' : 'pointer',
                      opacity: (!genPrompt.trim() && !genLoading) ? 0.5 : 1,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                      minHeight: 44,
                    }}>
                    {genLoading && (
                      <span style={{
                        width: 12, height: 12, borderRadius: '50%',
                        border: '2px solid var(--fg-3)', borderTopColor: 'transparent',
                        animation: 'spin 0.7s linear infinite', display: 'inline-block',
                      }} />
                    )}
                    {genLoading ? (lang === 'de' ? 'generiere…' : 'generating…') : (lang === 'de' ? '✦ artwork generieren' : '✦ generate artwork')}
                  </button>
                  {genError && (
                    <div style={{ marginTop: 8, fontSize: 'calc(10px * var(--scale))', color: 'oklch(0.6 0.18 25)', letterSpacing: '0.04em' }}>
                      {genError}
                    </div>
                  )}
                  {cfg.labelBgUrl && !genLoading && (
                    <div style={{ marginTop: 8, fontSize: 'calc(10px * var(--scale))', color: 'var(--fg-3)', letterSpacing: '0.08em' }}>
                      {lang === 'de' ? '✓ artwork aktiv. wird live auf das label gemappt' : '✓ artwork active. mapped live onto the label'}
                    </div>
                  )}
                </div>

                <div>
                  <div style={{ fontSize: 'calc(11px * var(--scale))', color: 'var(--fg-2)', marginBottom: 8 }}>{lang === 'de' ? 'typo-stil' : 'type style'}</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {[
                      ['editorial', 'editorial'],
                      ['mono', 'mono bold'],
                      ['clean', 'mono clean'],
                    ].map(([val, lbl]) => (
                      <button key={val}
                        onClick={() => setCfg({ ...cfg, typoStyle: val })}
                        style={{
                          flex: 1, minWidth: 90, padding: '12px 10px',
                          border: `1px solid ${(cfg.typoStyle || 'editorial') === val ? 'var(--fg)' : 'var(--line)'}`,
                          background: (cfg.typoStyle || 'editorial') === val ? 'var(--bg-2)' : 'transparent',
                          color: 'inherit', cursor: 'pointer',
                          fontSize: 'calc(11px * var(--scale))', minHeight: 44,
                        }}>
                        {lbl}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 'calc(11px * var(--scale))', color: 'var(--fg-2)', marginBottom: 8 }}>{lang === 'de' ? 'schriftfarbe' : 'type color'}</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {[
                      ['#16140f', 'ink'],
                      ['#f6f3ec', 'cream'],
                      ['#7a2c1d', 'rost'],
                      ['#2c4a2c', 'tanne'],
                      ['#c85250', 'paprika'],
                      ['#e8452a', 'signalrot'],
                      ['#ff6b00', 'orange'],
                      ['#ffd000', 'gelb'],
                      ['#19b35a', 'grün'],
                      ['#0a84ff', 'blau'],
                      ['#8b2fd6', 'violett'],
                      ['#ff3d9a', 'pink'],
                    ].map(([val, lbl]) => (
                      <button key={val}
                        onClick={() => setCfg({ ...cfg, typoColor: val })}
                        title={lbl}
                        style={{
                          width: 40, height: 40,
                          background: val,
                          border: (cfg.typoColor || '#16140f') === val ? '2px solid var(--fg)' : '1px solid var(--line)',
                          cursor: 'pointer',
                        }} />
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 'calc(11px * var(--scale))', color: 'var(--fg-2)', marginBottom: 8 }}>{lang === 'de' ? 'overlay (zwischen artwork & schrift)' : 'overlay (between artwork & type)'}</div>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                    {(lang === 'de' ? [['none', 'kein'], ['light', 'hell'], ['dark', 'dunkel']] : [['none', 'none'], ['light', 'light'], ['dark', 'dark']]).map(([val, lbl]) => (
                      <button key={val}
                        onClick={() => setCfg({ ...cfg, overlayTone: val })}
                        style={{
                          flex: 1, padding: '10px', minHeight: 40,
                          border: `1px solid ${(cfg.overlayTone || 'none') === val ? 'var(--fg)' : 'var(--line)'}`,
                          background: (cfg.overlayTone || 'none') === val ? 'var(--bg-2)' : 'transparent',
                          color: 'inherit', cursor: 'pointer', fontSize: 'calc(11px * var(--scale))',
                        }}>{lbl}</button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 'calc(10px * var(--scale))', color: 'var(--fg-3)', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>
                      {lang === 'de' ? 'stärke' : 'strength'} {Math.round((cfg.overlayOpacity ?? 0.25) * 100)}%
                    </span>
                    <input type="range" min={0} max={0.7} step={0.05}
                      value={cfg.overlayOpacity ?? 0.25}
                      disabled={(cfg.overlayTone || 'none') === 'none'}
                      onChange={e => setCfg({ ...cfg, overlayOpacity: +e.target.value })}
                      style={{ flex: 1, accentColor: 'var(--accent)', opacity: (cfg.overlayTone || 'none') === 'none' ? 0.4 : 1 }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <label style={{ color: 'var(--fg-3)', fontSize: 'calc(10px * var(--scale))', letterSpacing: '0.2em' }}>
                {lang === 'de' ? 'drop the idea. wir melden uns' : 'drop the idea. we get back to you'}
              </label>

              {/* summary of the concept */}
              <div style={{ marginTop: 16, border: '1px solid var(--line)' }}>
                {[
                  [lang === 'de' ? 'konzept' : 'concept', cfg.name || '·'],
                  [lang === 'de' ? 'kategorie' : 'category', cfg.base],
                  [lang === 'de' ? 'form' : 'shape', cfg.shapeName || '·'],
                  [lang === 'de' ? 'geschmack' : 'flavor', (lang === 'de' ? cfg.flavorDe : cfg.flavor) || '·'],
                  [lang === 'de' ? 'verpackung' : 'packaging', cfg.pack],
                  ['creator', '@' + (cfg.handle || '·')],
                ].map(([k, v], i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between',
                    padding: '11px 16px',
                    borderBottom: i < 5 ? '1px solid var(--line)' : 'none',
                  }}>
                    <span style={{ color: 'var(--fg-3)', fontSize: 'calc(11px * var(--scale))', letterSpacing: '0.08em' }}>{k}</span>
                    <span style={{ fontSize: 'calc(12px * var(--scale))', fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>

              {/* contact + message */}
              <div style={{ marginTop: 18 }}>
                <div style={{ fontSize: 'calc(11px * var(--scale))', color: 'var(--fg-2)', marginBottom: 6 }}>
                  {lang === 'de' ? 'deine e-mail' : 'your email'}
                </div>
                <input
                  value={cfg.contactEmail || ''}
                  onChange={e => setCfg({ ...cfg, contactEmail: e.target.value })}
                  placeholder="you@example.com"
                  style={{
                    width: '100%', padding: '12px 14px',
                    background: 'var(--bg-2)', border: '1px solid var(--line)',
                    color: 'var(--fg)', fontFamily: 'inherit', fontSize: 'calc(14px * var(--scale))',
                    textTransform: 'lowercase',
                  }} />
              </div>
              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 'calc(11px * var(--scale))', color: 'var(--fg-2)', marginBottom: 6 }}>
                  {lang === 'de' ? 'erzähl uns von deiner idee (optional)' : 'tell us about your idea (optional)'}
                </div>
                <textarea
                  value={cfg.ideaNote || ''}
                  onChange={e => setCfg({ ...cfg, ideaNote: e.target.value })}
                  rows={4}
                  placeholder={lang === 'de' ? 'community, timing, vibe — alles was wir wissen sollten …' : 'community, timing, vibe — anything we should know …'}
                  style={{
                    width: '100%', padding: '12px 14px',
                    background: 'var(--bg-2)', border: '1px solid var(--line)',
                    color: 'var(--fg)', fontFamily: 'inherit', fontSize: 'calc(13px * var(--scale))',
                    lineHeight: 1.55, resize: 'vertical', textTransform: 'lowercase',
                  }} />
              </div>

              <button
                onClick={() => setLaunched(true)}
                style={{
                width: '100%', padding: '18px',
                marginTop: 20, minHeight: 52,
                background: 'var(--fg)', color: 'var(--bg)',
                fontSize: 'calc(14px * var(--scale))',
                fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                border: 'none', cursor: 'pointer',
              }}>
                → drop the idea
              </button>
              <div style={{ textAlign: 'center', marginTop: 12, color: 'var(--fg-3)', fontSize: 'calc(10px * var(--scale))', letterSpacing: '0.15em' }}>
                {lang === 'de' ? 'wir melden uns innerhalb von 48h' : 'we hit you back within 48h'}
              </div>
            </div>
          )}

          {/* nav */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40 }}>
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              style={{
                padding: '12px 20px', border: '1px solid var(--line)',
                color: step === 0 ? 'var(--fg-3)' : 'var(--fg)',
                cursor: step === 0 ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: 10,
              }}
            >
              <Arrow dir="left" /> {lang === 'de' ? 'zurück' : 'back'}
            </button>
            <button
              onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))}
              disabled={step === STEPS.length - 1}
              style={{
                padding: '12px 24px',
                background: step === STEPS.length - 1 ? 'var(--bg-2)' : 'var(--fg)',
                color: step === STEPS.length - 1 ? 'var(--fg-3)' : 'var(--bg)',
                border: 'none', cursor: step === STEPS.length - 1 ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: 10,
              }}
            >
              {lang === 'de' ? 'weiter' : 'next'} → {STEPS[Math.min(STEPS.length - 1, step + 1)].label}
            </button>
          </div>
        </div>

        {/* RIGHT: preview */}
        <div className="mobile-preview-first">
          <div className="m-preview-sticky" style={{
            position: 'sticky', top: 80,
          }}>
            <ThreeProductPreview cfg={cfg} tilt={tilt} onTiltChange={setTilt} />
            <div style={{
              marginTop: 16,
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 12,
              fontSize: 'calc(10px * var(--scale))',
              color: 'var(--fg-3)',
              letterSpacing: '0.1em',
            }}>
              <div>
                <div style={{ color: 'var(--fg-2)' }}>shape</div>
                <div style={{ color: 'var(--fg)', marginTop: 4 }}>{cfg.shape}</div>
              </div>
              <div>
                <div style={{ color: 'var(--fg-2)' }}>flavor</div>
                <div style={{ color: 'var(--fg)', marginTop: 4 }}>{cfg.flavor}</div>
              </div>
              <div>
                <div style={{ color: 'var(--fg-2)' }}>pack</div>
                <div style={{ color: 'var(--fg)', marginTop: 4 }}>{cfg.pack}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {launched && <LaunchOverlay cfg={cfg} onClose={() => setLaunched(false)} />}
    </div>
  );
};

window.Configurator = Configurator;
