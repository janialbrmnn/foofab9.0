// Landing — Foodciety: clean white, futuristic orb, EN/DE

const LANDING_T = {
  en: {
    nav: ['about us', 'create', 'imprint'],
    h1a: 'turn potential',
    h1b: 'into',
    h1c: 'product',
    welcome: 'welcome to',
    cta: 'start creating',
    press: '[ press to begin ]',
    tagA: 'be careful.',
    tagB: 'this could turn',
    tagC: 'epic',
  },
  de: {
    nav: ['über uns', 'create', 'impressum'],
    h1a: 'turn potential',
    h1b: 'into',
    h1c: 'product',
    welcome: 'willkommen bei',
    cta: 'jetzt kreieren',
    press: '[ drücken zum starten ]',
    tagA: 'be careful.',
    tagB: 'this could turn',
    tagC: 'epic',
  },
};

const Landing = ({ onEnter, lang = 'en', onLang }) => {
  const t = LANDING_T[lang] || LANDING_T.en;
  const [time, setTime] = React.useState(() => new Date());
  const [isMobile, setIsMobile] = React.useState(() => window.innerWidth <= 768);
  React.useEffect(() => {
    const tm = setInterval(() => setTime(new Date()), 1000);
    const r = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', r);
    return () => { clearInterval(tm); window.removeEventListener('resize', r); };
  }, []);
  const hh = String(time.getHours()).padStart(2, '0');
  const mm = String(time.getMinutes()).padStart(2, '0');

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

  const orbBlock = (size) => (
    <div style={{ textAlign: 'center' }}>
      <PowerOrb size={size} pulsing onClick={onEnter} label="enter foodciety" />
      <button onClick={onEnter} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        width: 'fit-content',
        margin: '26px auto 0',
        padding: '12px 4px', minHeight: 44,
        background: 'transparent', color: 'var(--fg)',
        fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase',
        fontWeight: 700, cursor: 'pointer',
        borderBottom: '1px solid var(--fg)',
      }}
        onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.borderBottomColor = 'var(--accent)'; }}
        onMouseLeave={e => { e.currentTarget.style.color = 'var(--fg)'; e.currentTarget.style.borderBottomColor = 'var(--fg)'; }}
      >
        {t.cta} →
      </button>
      <div style={{
        marginTop: 14, color: 'var(--fg-3)', fontSize: 10,
        letterSpacing: '0.2em', animation: 'blink 2s step-end infinite',
      }}>
        {t.press}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="page" style={{ position: 'relative', overflow: 'hidden', background: 'var(--bg)', minHeight: '100vh', padding: '72px 24px 32px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'absolute', top: 16, left: 20, right: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 4 }}>
          <Wordmark height={16} />
          {langToggle}
        </div>
        <h1 className="fade-up" style={{ fontSize: 'clamp(40px, 11vw, 64px)', lineHeight: 0.98, letterSpacing: '-0.02em', color: 'var(--fg)', marginTop: 40 }}>
          {t.h1a}<br/>
          {t.h1b} <span className="word-em" style={{ fontSize: '1.06em', color: 'var(--accent)' }}>{t.h1c}</span>.
        </h1>
        <p className="fade-up" style={{ marginTop: 20, color: 'var(--fg-2)', fontSize: 14, lineHeight: 1.6, animationDelay: '160ms' }}>
          {t.welcome} <span style={{ fontWeight: 600, color: 'var(--fg)' }}>foodciety.</span>
        </p>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 28 }}>
          {orbBlock(170)}
        </div>
        <div style={{ marginTop: 28, fontSize: 15, color: 'var(--fg)', lineHeight: 1.2, textAlign: 'center' }}>
          {t.tagA} <span style={{ whiteSpace: 'nowrap' }}>{t.tagB} <span className="word-em" style={{ fontSize: '1.08em', color: 'var(--accent)' }}>{t.tagC}</span></span>
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
        maxWidth: '760px',
        zIndex: 3,
      }}>
        <h1 className="fade-up" style={{
          fontSize: 'clamp(48px, 7vw, 104px)',
          lineHeight: 0.95,
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
        <p className="fade-up" style={{
          marginTop: '44px',
          color: 'var(--fg-2)',
          maxWidth: '440px',
          fontSize: 'calc(15px * var(--scale))',
          lineHeight: 1.6,
          animationDelay: '160ms',
        }}>
          {t.welcome} <span style={{ fontWeight: 600, color: 'var(--fg)' }}>foodciety.</span>
        </p>
      </div>

      {/* lower-right orb + CTA */}
      <div style={{
        position: 'absolute',
        bottom: 'max(110px, 12vh)', right: '8vw',
        zIndex: 3,
      }}>
        {orbBlock(210)}
      </div>

      {/* bottom-left tagline — "epic" never wraps */}
      <div style={{
        position: 'absolute',
        bottom: '40px', left: '40px',
        zIndex: 3,
      }}>
        <div style={{
          fontSize: 'clamp(18px, 1.8vw, 24px)',
          color: 'var(--fg)',
          lineHeight: 1.15,
          maxWidth: 480,
        }}>
          {t.tagA} <span style={{ whiteSpace: 'nowrap' }}>{t.tagB} <span className="word-em" style={{ fontSize: '1.08em', color: 'var(--accent)' }}>{t.tagC}</span></span>
        </div>
      </div>

      {/* bottom-right meta */}
      <div style={{
        position: 'absolute',
        bottom: '40px', right: '40px',
        textAlign: 'right',
        color: 'var(--fg-3)',
        fontSize: 'calc(10px * var(--scale))',
        letterSpacing: '0.15em',
        zIndex: 3,
      }}>
        hmb · {hh}:{mm}
      </div>
    </div>
  );
};

window.Landing = Landing;
