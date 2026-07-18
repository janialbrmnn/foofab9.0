// Collab — card-grid layout (swapped from old inspire) with What The Gummies featured

const COLLAB_T = {
  en: {
    kicker: '[ collab / partner grid ]',
    h2a: 'team up.',
    h2b: 'blow up',
    featuredTag: 'featured partner',
    wtgName: 'what the gummies',
    wtgDesc: 'the first gummy brand built purely on collabs. every drop is a collaboration. creators, brands, communities. your concept could be next.',
    wtgCta: 'pitch a collab →',
    filter: ['all', 'brands', 'creators'],
    open: '● open',
    wait: '○ waitlist',
    request: 'send request →',
    cards: [
      { name: 'what the gummies', kind: 'brands', cat: 'gummies · collab-native', note: 'first pure-collab gummy brand', open: true, slot: 'collab.brand.wtg' },
      { name: 'rené schmock', kind: 'creators', cat: 'culinary · 2.4M reach', note: 'launch case · 18k units / 24h', open: true, slot: 'collab.creator.reneschmock' },
      { name: 'ronnefeldt', kind: 'brands', cat: 'tea · est. 1823', note: 'tea-inspired gummies / infusions', open: true, slot: 'collab.brand.ronnefeldt' },
      { name: 'andreas herb', kind: 'creators', cat: 'lifestyle · 1.8M reach', note: 'gummy co-drop nov 2025', open: true, slot: 'collab.creator.andreasherb' },
      { name: 'kalfany', kind: 'brands', cat: 'hard candy · est. 1923', note: 'premium formats · custom tins', open: false, slot: 'collab.brand.kalfany' },
      { name: '@mamakollektiv', kind: 'creators', cat: 'parenting · 412k reach', note: 'highly loyal community', open: true, slot: 'collab.creator.mamakollektiv' },
      { name: 'schwarzwald-milch', kind: 'brands', cat: 'dairy · est. 1931', note: 'cheese-pairing drops possible', open: true, slot: 'collab.brand.schwarzwaldmilch' },
      { name: '@hannah.lifts', kind: 'creators', cat: 'fitness · 980k reach', note: 'recovery gummy wip', open: false, slot: 'collab.creator.hannahlifts' },
    ],
  },
  de: {
    kicker: '[ collab / partner-grid ]',
    h2a: 'zusammen',
    h2b: 'abheben',
    featuredTag: 'featured partner',
    wtgName: 'what the gummies',
    wtgDesc: 'die erste fruchtgummi-marke, die rein auf collabs basiert. jeder drop ist eine kollaboration. creator, marken, communities. dein konzept könnte das nächste sein.',
    wtgCta: 'collab pitchen →',
    filter: ['alle', 'marken', 'creator'],
    open: '● offen',
    wait: '○ warteliste',
    request: 'anfrage senden →',
    cards: [
      { name: 'what the gummies', kind: 'brands', cat: 'gummies · collab-native', note: 'erste pure-collab gummy-marke', open: true, slot: 'collab.brand.wtg' },
      { name: 'rené schmock', kind: 'creators', cat: 'culinary · 2,4M reichweite', note: 'launch case · 18k units / 24h', open: true, slot: 'collab.creator.reneschmock' },
      { name: 'ronnefeldt', kind: 'brands', cat: 'tee · seit 1823', note: 'tea-inspired gummies / infusions', open: true, slot: 'collab.brand.ronnefeldt' },
      { name: 'andreas herb', kind: 'creators', cat: 'lifestyle · 1,8M reichweite', note: 'gummy co-drop nov 2025', open: true, slot: 'collab.creator.andreasherb' },
      { name: 'kalfany', kind: 'brands', cat: 'hard candy · seit 1923', note: 'premium-formate · custom dosen', open: false, slot: 'collab.brand.kalfany' },
      { name: '@mamakollektiv', kind: 'creators', cat: 'parenting · 412k reichweite', note: 'hoch loyale community', open: true, slot: 'collab.creator.mamakollektiv' },
      { name: 'schwarzwald-milch', kind: 'brands', cat: 'molkerei · seit 1931', note: 'cheese-pairing drops möglich', open: true, slot: 'collab.brand.schwarzwaldmilch' },
      { name: '@hannah.lifts', kind: 'creators', cat: 'fitness · 980k reichweite', note: 'recovery gummy wip', open: false, slot: 'collab.creator.hannahlifts' },
    ],
  },
};

const Collab = ({ lang = 'en', onConfig, onBack }) => {
  const t = COLLAB_T[lang] || COLLAB_T.en;
  const [filter, setFilter] = React.useState(0); // 0 all, 1 brands, 2 creators
  const kinds = [null, 'brands', 'creators'];
  const filtered = t.cards.filter(c => !kinds[filter] || c.kind === kinds[filter]);

  return (
    <div className="page-pad" style={{ padding: '96px 32px 48px', maxWidth: 1440, margin: '0 auto' }}>
      <div style={{ paddingBottom: 20, borderBottom: '1px solid var(--line)', marginBottom: 28 }}>
        <div style={{ marginBottom: 12 }}>
          <BackKicker lang={lang} onClick={onBack} />
        </div>
        <h2 style={{ fontSize: 'calc(30px * var(--scale))', letterSpacing: '-0.02em' }}>
          {t.h2a} <span className="word-em" style={{ fontSize: '1.05em', color: 'var(--accent)', textTransform: 'none' }}>{t.h2b}</span>.
        </h2>
      </div>

      {/* Featured: What The Gummies */}
      <div className="m-stack" style={{
        display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 0,
        border: '2px solid var(--fg)', marginBottom: 28,
      }}>
        <ImgSlot slot="collab.featured.wtg" label="collab · what the gummies hero" group="collab" style={{ minHeight: 240 }}>
          what the gummies · hero
        </ImgSlot>
        <div style={{ padding: '26px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontSize: 'calc(9px * var(--scale))', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--accent)' }}>
            ★ {t.featuredTag}
          </div>
          <h3 style={{ fontSize: 'calc(34px * var(--scale))', lineHeight: 1, letterSpacing: '-0.02em' }}>
            {t.wtgName}
          </h3>
          <p style={{ color: 'var(--fg-2)', fontSize: 'calc(13px * var(--scale))', lineHeight: 1.65, maxWidth: 520 }}>
            {t.wtgDesc}
          </p>
          <button onClick={onConfig} style={{
            alignSelf: 'flex-start',
            padding: '13px 22px', minHeight: 44,
            background: 'var(--fg)', color: 'var(--bg)',
            fontSize: 'calc(11px * var(--scale))', fontWeight: 700,
            letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer',
          }}>
            {t.wtgCta}
          </button>
        </div>
      </div>

      {/* filter */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {t.filter.map((f, i) => (
          <button key={f} onClick={() => setFilter(i)}
            style={{
              padding: '9px 16px', minHeight: 40,
              border: `1px solid ${filter === i ? 'var(--fg)' : 'var(--line)'}`,
              background: filter === i ? 'var(--fg)' : 'transparent',
              color: filter === i ? 'var(--bg)' : 'var(--fg-2)',
              fontSize: 'calc(11px * var(--scale))', cursor: 'pointer',
            }}>
            #{f}
          </button>
        ))}
      </div>

      {/* partner card grid */}
      <div className="m-stack" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {filtered.map((c, i) => (
          <article key={c.name} className="fade-up" style={{
            border: '1px solid var(--line)', padding: 14,
            display: 'flex', flexDirection: 'column', gap: 12,
            animationDelay: `${i * 50}ms`, background: 'var(--bg)',
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--fg-3)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--line)'}
          >
            <ImgSlot slot={c.slot} label={'collab · ' + c.name} group="collab" style={{ aspectRatio: '4/3' }}>
              {c.name}
            </ImgSlot>
            <div>
              <div style={{ fontSize: 'calc(15px * var(--scale))', fontWeight: 700, letterSpacing: '-0.01em' }}>{c.name}</div>
              <div style={{ color: 'var(--fg-3)', fontSize: 'calc(10px * var(--scale))', marginTop: 3, letterSpacing: '0.05em' }}>{c.cat}</div>
            </div>
            <div style={{ color: 'var(--fg-2)', fontSize: 'calc(11px * var(--scale))', lineHeight: 1.5, flex: 1 }}>
              {c.note}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px dashed var(--line)' }}>
              <span style={{ fontSize: 'calc(10px * var(--scale))', letterSpacing: '0.1em', color: c.open ? 'var(--fg)' : 'var(--fg-3)' }}>
                {c.open ? t.open : t.wait}
              </span>
              {c.open && (
                <button onClick={onConfig} style={{ fontSize: 'calc(10px * var(--scale))', color: 'var(--fg-2)', cursor: 'pointer', minHeight: 32 }}>
                  {t.request}
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

window.Collab = Collab;
