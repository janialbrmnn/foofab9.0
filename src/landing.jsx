// Landing — Foodciety: clean white, futuristic orb, EN/DE

const LANDING_T = {
  en: {
    nav: ['about us', 'create', 'imprint'],
    h1a: 'your food idea.',
    h1b: "society's next",
    h1c: 'favorite',
    tagA: 'be careful.',
    tagB: 'this could turn',
    tagC: 'epic',
  },
  de: {
    nav: ['über uns', 'create', 'impressum'],
    h1a: 'your food idea.',
    h1b: "society's next",
    h1c: 'favorite',
    tagA: 'be careful.',
    tagB: 'this could turn',
    tagC: 'epic',
  },
};

const Landing = ({ onEnter, lang = 'en', onLang }) => {
  const t = LANDING_T[lang] || LANDING_T.en;
  const [isMobile, setIsMobile] = React.useState(() => window.innerWidth <= 768);
  React.useEffect(() => {
    const r = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', r);
    return () => window.removeEventListener('resize', r);
  }, []);

  const langToggle = (
    <div style={{ display: 'flex', gap: 2, border: '1px solid var(--line)', fontSize: 10, letterSpacing: '0.1em' }}>
      {['en', 'de'].map(l => (
        <button key={l} onClick={() => onLang && onLang(l)}
          style={{
            padding: '5px 9px', minHeight: 28,
            background: lang === l ? 'var(--fg)' : 'transparent',
            color: lang === l ? 'var(--bg)' : 'var(--fg-3)',
            cursor: 'pointer', textTransform: 'uppercase',
          }}>{l}</button>
      ))}
    </div>
  );

  // Orb with the tagline underneath — left-aligned all-caps semibold
  // mono, tight leading, and a hand-drawn swoosh arrow curving from the
  // left end of the type up to the power button.
  const orbBlock = (size) => (
    <div style={{ textAlign: 'center' }}>
      <PowerOrb size={size} pulsing onClick={onEnter} label="enter foodciety" />
      <button onClick={onEnter} style={{
        display: 'block',
        position: 'relative',
        width: 'fit-content',
        margin: '16px auto 0',
        padding: '6px 4px 6px 6px',
        minHeight: 44,
        background: 'transparent', color: 'var(--fg)',
        cursor: 'pointer',
        textAlign: 'left',
      }}
        onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; }}
        onMouseLeave={e => { e.currentTarget.style.color = 'var(--fg)'; }}
      >
        {/* hand-drawn swoosh: starts at the type's left end and curves
            up-right, aiming at the CENTER of the orb (tip stays outside).
            Tapered double-stroke gives the pen-drawn thickness change. */}
        <svg viewBox="0 0 60 78" fill="none" style={{
          position: 'absolute',
          left: -14, top: -62,
          width: 52, height: 72,
          color: 'var(--accent)',
          pointerEvents: 'none',
        }}>
          <path d="M8 74 C 2 52, 8 30, 24 17 C 31 11.5, 38 8, 44 6.5"
            stroke="currentColor" strokeWidth="3.1" strokeLinecap="round" fill="none" />
          <path d="M24 17 C 31 11.5, 38 8, 45 6.4"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M37 1.5 L 47 6 L 41 15"
            stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
        <span style={{
          display: 'block',
          fontSize: 'calc(14px * var(--scale))',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          lineHeight: 1.12,
        }}>
          {t.tagA}<br/>
          {t.tagB} <span style={{ color: 'var(--accent)' }}>{t.tagC}.</span>
        </span>
      </button>
    </div>
  );

  if (isMobile) {
    return (
      <div className="page" style={{ position: 'relative', overflow: 'hidden', background: 'var(--bg)', minHeight: '100vh', padding: '72px 24px 40px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'absolute', top: 16, left: 20, right: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 4 }}>
          <Wordmark height={16} />
          {langToggle}
        </div>
        <h1 className="fade-up" style={{ fontSize: 'clamp(38px, 10.5vw, 60px)', lineHeight: 1.02, letterSpacing: '-0.02em', color: 'var(--fg)', marginTop: 40 }}>
          {t.h1a}<br/>
          {t.h1b} <span className="word-em" style={{ fontSize: '1.06em', color: 'var(--accent)' }}>{t.h1c}.</span>
        </h1>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 28 }}>
          {orbBlock(170)}
        </div>
      </div>
    );
  }

  return (
    <div className="page" style={{ position: 'relative', overflow: 'hidden', background: 'var(--bg)', minHeight: '100vh', height: 'max(780px, 100vh)' }}>
      {/* nav */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        padding: '28px 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        zIndex: 4,
      }}>
        <Wordmark height={20} />
        <div style={{ display: 'flex', gap: 32, alignItems: 'center', fontSize: 'calc(12px * var(--scale))', color: 'var(--fg-2)' }}>
          <button style={{ cursor: 'pointer' }}>{t.nav[0]}</button>
          <button style={{ cursor: 'pointer', color: 'var(--fg)' }} onClick={onEnter}>{t.nav[1]}</button>
          <button style={{ cursor: 'pointer' }}>{t.nav[2]}</button>
          {langToggle}
        </div>
      </div>

      {/* headline */}
      <div style={{
        position: 'absolute',
        top: 'max(180px, 26vh)', left: '40px',
        maxWidth: '820px',
        zIndex: 3,
      }}>
        <h1 className="fade-up" style={{
          fontSize: 'clamp(48px, 6.6vw, 98px)',
          lineHeight: 0.98,
          letterSpacing: '-0.02em',
          color: 'var(--fg)',
        }}>
          {t.h1a}<br/>
          {t.h1b} <span className="word-em" style={{
            fontSize: '1.06em',
            color: 'var(--accent)',
            display: 'inline-block',
          }}>{t.h1c}.</span>
        </h1>
      </div>

      {/* lower-right orb + tagline */}
      <div style={{
        position: 'absolute',
        bottom: 'max(110px, 12vh)', right: '8vw',
        zIndex: 3,
      }}>
        {orbBlock(210)}
      </div>
    </div>
  );
};

window.Landing = Landing;
