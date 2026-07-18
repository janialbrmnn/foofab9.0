// Inspire. the foodciety newsfeed (single-column feed layout)

const FEED_T = {
  en: {
    kicker: '[ inspire / the foodciety feed ]',
    h2a: 'pure heat.',
    h2b: 'ride the wave',
    live: 'live · foodciety.com',
    remix: 'remix this →',
    posts: [
      { time: '2h', text: 'sour pickle × smoked cheese. the pairing nobody asked for and everybody orders. drop goes live thursday.', tag: 'drop', slot: 'inspire.02', stat: '5.4M views' },
      { time: '6h', text: 'protein recovery gummies are the fastest growing search in fitness food this month. +482%. who builds it?', tag: 'trend', slot: 'inspire.01', stat: '+482% search' },
      { time: '1d', text: 'lemon-salt tequila gummies: the edible shot ritual. waitlist is at 12k. party category is wide open.', tag: 'drop', slot: 'inspire.03', stat: '12k waitlist' },
      { time: '2d', text: 'open brief: co-branded advent calendar. 24 creator drops, 6 slots left. apply with your concept.', tag: 'brief', slot: 'inspire.04', stat: '6 slots left' },
      { time: '3d', text: 'chamomile sleep chews sold out in 48h. wellness × snacking keeps over-performing.', tag: 'insight', slot: 'inspire.05', stat: 'sold out' },
      { time: '5d', text: 'döner-inspired hard candy out of kreuzberg. culture-led products travel further than ad budgets.', tag: 'drop', slot: 'inspire.06', stat: '3.2M views' },
    ],
  },
  de: {
    kicker: '[ inspire / der foodciety feed ]',
    h2a: 'was gerade',
    h2b: 'explodiert',
    live: 'live · foodciety.com',
    remix: 'remix das →',
    posts: [
      { time: '2h', text: 'sour pickle × smoked cheese. das pairing, das niemand wollte und alle bestellen. drop geht donnerstag live.', tag: 'drop', slot: 'inspire.02', stat: '5,4M views' },
      { time: '6h', text: 'protein recovery gummies sind die am schnellsten wachsende suche in fitness food. +482%. wer baut es?', tag: 'trend', slot: 'inspire.01', stat: '+482% suche' },
      { time: '1d', text: 'lemon-salt tequila gummies: das essbare shot-ritual. warteliste bei 12k. die party-kategorie ist offen.', tag: 'drop', slot: 'inspire.03', stat: '12k warteliste' },
      { time: '2d', text: 'offener brief: co-branded adventskalender. 24 creator drops, 6 slots übrig. bewirb dich mit deinem konzept.', tag: 'brief', slot: 'inspire.04', stat: '6 slots übrig' },
      { time: '3d', text: 'chamomile sleep chews in 48h ausverkauft. wellness × snacking überperformt weiter.', tag: 'insight', slot: 'inspire.05', stat: 'ausverkauft' },
      { time: '5d', text: 'döner-inspired hard candy aus kreuzberg. culture-led produkte reisen weiter als werbebudgets.', tag: 'drop', slot: 'inspire.06', stat: '3,2M views' },
    ],
  },
};

const Inspire = ({ onConfig, lang = 'en', onBack }) => {
  const t = FEED_T[lang] || FEED_T.en;

  return (
    <div className="page-pad" style={{ padding: '96px 32px 48px', maxWidth: 720, margin: '0 auto' }}>
      {/* header */}
      <div style={{ paddingBottom: 20, borderBottom: '1px solid var(--line)', marginBottom: 28 }}>
        <div style={{ marginBottom: 12 }}>
          <BackKicker lang={lang} onClick={onBack} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 12, flexWrap: 'wrap' }}>
          <h2 style={{ fontSize: 'calc(30px * var(--scale))', letterSpacing: '-0.02em' }}>
            {t.h2a} <span className="word-em" style={{ fontSize: '1.05em', color: 'var(--accent)', textTransform: 'none' }}>{t.h2b}</span>.
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'calc(10px * var(--scale))', color: 'var(--fg-3)', letterSpacing: '0.12em', paddingBottom: 6 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', animation: 'blink 1.2s step-end infinite' }} />
            {t.live}
          </div>
        </div>
      </div>

      {/* feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {t.posts.map((p, i) => (
          <article key={i} className="fade-up" style={{
            border: '1px solid var(--line)',
            background: 'var(--bg)',
            animationDelay: `${i * 60}ms`,
          }}>
            {/* post header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderBottom: '1px solid var(--line)' }}>
              <div style={{
                width: 34, height: 34, borderRadius: '50%',
                background: 'var(--fg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <img src="assets/power.png" alt="" style={{ width: 13, height: 'auto', filter: 'invert(1)' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 'calc(12px * var(--scale))', fontWeight: 700 }}>foodciety</div>
                <div style={{ fontSize: 'calc(10px * var(--scale))', color: 'var(--fg-3)', letterSpacing: '0.05em' }}>foodciety.com · {p.time}</div>
              </div>
              <span style={{
                fontSize: 'calc(9px * var(--scale))', letterSpacing: '0.15em',
                textTransform: 'uppercase', color: 'var(--accent)',
                border: '1px solid var(--line)', padding: '4px 8px',
              }}>#{p.tag}</span>
            </div>

            {/* post text */}
            <p style={{ padding: '14px 16px 12px', fontSize: 'calc(14px * var(--scale))', lineHeight: 1.55, color: 'var(--fg)' }}>
              {p.text}
            </p>

            {/* post image */}
            <ImgSlot slot={p.slot} label={'feed · ' + p.tag} group="inspire" style={{ aspectRatio: '16/9', margin: '0 16px' }}>
              feed image
            </ImgSlot>

            {/* footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px' }}>
              <span style={{ fontSize: 'calc(11px * var(--scale))', color: 'var(--accent)' }}>↗ {p.stat}</span>
              <button onClick={onConfig}
                style={{ fontSize: 'calc(11px * var(--scale))', color: 'var(--fg-2)', cursor: 'pointer', minHeight: 32 }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--fg)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--fg-2)'}>
                {t.remix}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

window.Inspire = Inspire;
