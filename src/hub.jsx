// Hub — four bold paths: get inspired / make a collab / create your product / sell

const HUB_T = {
  en: {
    kicker: '[ 002 / create ]',
    h2a: 'your reach.', h2b: 'your product.', h2c: 'your money',
    cards: [
      { kw: 'inspire',   title: 'get inspired.',            sub: 'the foodciety feed. live drops, community briefs and categories that are blowing up right now.' },
      { kw: 'collab',    title: 'make a collab.',           sub: 'find brands and creators that speak your language. co-branded launches with what the gummies & more.' },
      { kw: 'configure', title: 'create your product.',     sub: 'start from a base product. pick shape, flavor, packaging. from idea to shelf in days, not months.' },
      { kw: 'sell',      title: "sell your f*ckin' shit.",  sub: 'drop your idea, we handle production, fulfillment and distribution. you push it to your community.' },
    ],
    open: 'open',
  },
  de: {
    kicker: '[ 002 / create ]',
    h2a: 'deine reichweite.', h2b: 'dein produkt.', h2c: 'dein umsatz',
    cards: [
      { kw: 'inspire',   title: 'get inspired.',            sub: 'der foodciety feed. live drops, community briefs und kategorien, die gerade durchstarten.' },
      { kw: 'collab',    title: 'make a collab.',           sub: 'finde marken und creator, die deine sprache sprechen. co-branded launches mit what the gummies & mehr.' },
      { kw: 'configure', title: 'create your product.',     sub: 'starte von einem basis-produkt. wähle form, geschmack, verpackung. von der idee ins regal in tagen.' },
      { kw: 'sell',      title: "sell your f*ckin' shit.",  sub: 'drop deine idee, wir übernehmen produktion, fulfillment und distribution. du pushst es an deine community.' },
    ],
    open: 'öffnen',
  },
};

const HubCard = ({ idx, kw, title, sub, onClick, slot, slotLabel, openLabel }) => (
  <button
    onClick={onClick}
    style={{
      textAlign: 'left',
      padding: '20px',
      border: '1px solid var(--line)',
      background: 'transparent',
      display: 'flex',
      flexDirection: 'column',
      gap: '18px',
      transition: 'all 200ms cubic-bezier(.2,.8,.2,1)',
      position: 'relative',
      cursor: 'pointer',
      color: 'inherit',
      minHeight: '440px',
    }}
    onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-2)'; e.currentTarget.style.borderColor = 'var(--fg-3)'; }}
    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--line)'; }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'calc(10px * var(--scale))', letterSpacing: '0.15em', color: 'var(--fg-3)' }}>
      <span style={{ whiteSpace: 'nowrap' }}>[ 0{idx} / {kw} ]</span>
      <Arrow dir="up" size={12} />
    </div>

    {/* section image */}
    <ImgSlot slot={slot} label={slotLabel} group="hub" style={{ height: '200px', flexShrink: 0 }}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'var(--bg)', border: '1px solid var(--fg-3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <img src="assets/power.png" alt="" style={{ width: 20, height: 'auto' }} />
        </div>
      </div>
      <span style={{ position: 'absolute', bottom: 8, left: 10 }}>image / {kw}</span>
    </ImgSlot>

    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 14 }}>
      <div>
        <h3 style={{
          fontSize: 'calc(30px * var(--scale))',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          marginBottom: 12,
          lineHeight: 1.05,
          wordBreak: 'break-word',
        }}>{title}</h3>
        <p style={{ color: 'var(--fg-2)', fontSize: 'calc(12px * var(--scale))', lineHeight: 1.6 }}>
          {sub}
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px dashed var(--line)' }}>
        <span style={{ fontSize: 'calc(10px * var(--scale))', color: 'var(--fg-3)', letterSpacing: '0.1em' }}>{openLabel}</span>
        <Arrow dir="right" size={14} />
      </div>
    </div>
  </button>
);

const Hub = ({ onGo, lang = 'en', onBack }) => {
  const t = HUB_T[lang] || HUB_T.en;
  const routes = { inspire: 'inspire', collab: 'collab', configure: 'config', sell: 'sell' };
  const slots = { inspire: 'hub.inspire', collab: 'hub.collab', configure: 'hub.configure', sell: 'hub.sell' };

  return (
    <div className="page-pad" style={{ padding: '96px 32px 48px', maxWidth: 1520, margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        marginBottom: 40,
        paddingBottom: 24,
        borderBottom: '1px solid var(--line)',
      }}>
        <div style={{ marginBottom: 18 }}>
          <BackKicker lang={lang} onClick={onBack} />
        </div>
        <h2 style={{
          fontSize: 'calc(40px * var(--scale))',
          letterSpacing: '-0.02em',
          lineHeight: 1.05,
          maxWidth: 900,
        }}>
          {t.h2a} {t.h2b} <span className="word-em" style={{ fontSize: '1.05em', color: 'var(--accent)', textTransform: 'none' }}>{t.h2c}</span>.
        </h2>
      </div>

      {/* Four cards */}
      <div className="m-stack" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 20,
      }}>
        {t.cards.map((c, i) => (
          <HubCard
            key={c.kw}
            idx={i + 1}
            kw={c.kw}
            title={c.title}
            sub={c.sub}
            slot={slots[c.kw]}
            slotLabel={'hub · ' + c.kw}
            openLabel={t.open}
            onClick={() => onGo(routes[c.kw])}
          />
        ))}
      </div>

      <div style={{
        marginTop: 44,
        display: 'flex', justifyContent: 'space-between',
        color: 'var(--fg-3)',
        fontSize: 'calc(10px * var(--scale))', letterSpacing: '0.15em',
      }}>
        <span>foodciety.com</span>
        <span>built by entrepreneurs. built for entrepreneurs.</span>
      </div>
    </div>
  );
};

// ── Coming soon (sell) ──────────────────────────────────────────
const ComingSoon = ({ lang = 'en', onBack }) => {
  const de = lang === 'de';
  return (
    <div className="page-pad" style={{
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: '96px 32px',
    }}>
      <div style={{ marginBottom: 24 }}>
        <BackKicker lang={lang} onClick={onBack} />
      </div>
      <h1 style={{
        fontSize: 'calc(72px * var(--scale))',
        letterSpacing: '-0.02em', lineHeight: 1,
      }}>
        coming <span className="word-em" style={{ fontSize: '1.05em', color: 'var(--accent)', textTransform: 'none' }}>soon</span>.
      </h1>
      <p style={{
        marginTop: 28, maxWidth: 480,
        color: 'var(--fg-2)', fontSize: 'calc(14px * var(--scale))', lineHeight: 1.7,
      }}>
        {de
          ? 'hier entsteht dein verkaufs-hub: drops, fulfillment und auszahlungen an einem ort. wir melden uns, sobald es losgeht.'
          : 'your selling hub is in the making: drops, fulfillment and payouts in one place. we will let you know the moment it goes live.'}
      </p>
      <div style={{
        marginTop: 20, display: 'flex', alignItems: 'center', gap: 8,
        color: 'var(--fg-3)', fontSize: 'calc(10px * var(--scale))', letterSpacing: '0.2em',
      }}>
        <span style={{
          display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
          background: 'var(--accent)', animation: 'blink 1.4s step-end infinite',
        }} />
        {de ? 'in arbeit' : 'in the works'}
      </div>
      <button onClick={onBack} style={{
        marginTop: 44,
        display: 'inline-flex', alignItems: 'center', gap: 10,
        padding: '12px 4px', minHeight: 44,
        background: 'transparent', color: 'var(--fg)',
        fontSize: 'calc(12px * var(--scale))', letterSpacing: '0.18em', textTransform: 'uppercase',
        fontWeight: 700, cursor: 'pointer',
        borderBottom: '1px solid var(--fg)',
      }}>
        <Arrow dir="left" size={13} /> {de ? 'zurück zum hub' : 'back to hub'}
      </button>
    </div>
  );
};

window.Hub = Hub;
window.ComingSoon = ComingSoon;
