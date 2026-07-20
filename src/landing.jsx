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

  // Orb + tagline underneath: two rows with an up arrow pointing at the
  // button — "be careful. / this could turn epic."
  const orbBlock = (size) => (
    <div style={{ textAlign: 'center' }}>
      <PowerOrb size={size} pulsing onClick={onEnter} label="enter foodciety" />
      <button onClick={onEnter} style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        width: 'fit-content',
        margin: '22px auto 0',
        padding: '8px 12px', minHeight: 44,
        background: 'transparent', color: 'var(--fg)',
        cursor: 'pointer',
        lineHeight: 1.25,
      }}
        onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; }}
        onMouseLeave={e => { e.currentTarget.style.color = 'var(--fg)'; }}
      >
        <Arrow dir="up" size={15} />
        <span style={{ fontSize: 'calc(15px * var(--scale))' }}>{t.tagA}</span>
        <span style={{ fontSize: 'calc(15px * var(--scale))', whiteSpace: 'nowrap' }}>
          {t.tagB} <span className="word-em" style={{ fontSize: '1.1em', color: 'var(--accent)' }}>{t.tagC}</span>
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
          {t.h1b} <span className="word-em" style={{ fontSize: '1.06em', color: 'var(--accent)' }}>{t.h1c}</span>.
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
          }}>{t.h1c}</span>.
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
