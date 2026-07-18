// App — router + tweak wiring

const { useState, useEffect } = React;

const App = () => {
  const [page, setPage] = useState(() => localStorage.getItem('foofab.page') || 'landing');
  const [lang, setLangRaw] = useState(() => localStorage.getItem('foodciety.lang') || 'en');
  const setLang = (l) => { setLangRaw(l); try { localStorage.setItem('foodciety.lang', l); } catch (e) {} };
  const [settings, setSettingsRaw] = useState(window.TWEAK_DEFAULTS || { theme: 'light', accent: 'terracotta', typeScale: 'medium' });
  const [images, setImagesRaw] = useState(() => {
    try {return JSON.parse(localStorage.getItem('foofab.images') || '{}');}
    catch {return {};}
  });
  const [tweaksOpen, setTweaksOpen] = useState(false);

  // Publish images globally so ImgSlot can read them live.
  // Persisting to localStorage is now EXPLICIT via saveImages() — some
  // dataURLs exceed the quota, so auto-save was failing silently.
  const [imagesSaveState, setImagesSaveState] = useState('saved'); // 'saved' | 'dirty' | 'error'

  useEffect(() => {
    window.__IMAGES__ = images;
    window.dispatchEvent(new Event('imagesupdate'));
  }, [images]);

  const setImages = (next) => {
    setImagesRaw(next);
    setImagesSaveState('dirty');
  };

  const saveImages = () => {
    try {
      localStorage.setItem('foofab.images', JSON.stringify(images));
      setImagesSaveState('saved');
      return true;
    } catch (e) {
      setImagesSaveState('error');
      return false;
    }
  };

  useEffect(() => {
    localStorage.setItem('foofab.page', page);
    window.scrollTo(0, 0);
  }, [page]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
    document.documentElement.setAttribute('data-accent', settings.accent);
    document.documentElement.setAttribute('data-scale', settings.typeScale);
  }, [settings]);

  const setSettings = (s) => {
    setSettingsRaw(s);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: s }, '*');
  };

  // Edit-mode protocol — register listener FIRST, then announce
  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === '__activate_edit_mode') setTweaksOpen(true);else
      if (e.data?.type === '__deactivate_edit_mode') setTweaksOpen(false);
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  const [menuOpen, setMenuOpen] = useState(false);
  const go = (p) => { setPage(p); setMenuOpen(false); };

  const navT = lang === 'de'
    ? { about: 'über uns', create: 'create', imprint: 'impressum' }
    : { about: 'about', create: 'create', imprint: 'imprint' };

  const nav =
  <nav className="nav" data-screen-label={page}>
      <button className="nav-brand" onClick={() => go('landing')} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Wordmark height={16} />
      </button>
      <button className={'nav-burger ' + (menuOpen ? 'open' : '')}
        onClick={() => setMenuOpen(v => !v)} aria-label="menu">
        <span /><span /><span />
      </button>
      <div className={'nav-links ' + (menuOpen ? 'open' : '')}>
        <button onClick={() => go('hub')}>{navT.about}</button>
        <button className={page === 'config' || page === 'inspire' || page === 'collab' || page === 'sell' ? 'active' : ''}
      onClick={() => go('hub')}>{navT.create}</button>
        <button onClick={() => go('landing')}>{navT.imprint}</button>
        <div style={{ display: 'flex', gap: 2, border: '1px solid var(--line)', fontSize: 10, letterSpacing: '0.1em', alignSelf: 'center' }}>
          {['en', 'de'].map(l => (
            <button key={l} onClick={() => setLang(l)}
              style={{
                padding: '5px 9px', minHeight: 28, width: 'auto', borderBottom: 'none',
                background: lang === l ? 'var(--fg)' : 'transparent',
                color: lang === l ? 'var(--bg)' : 'var(--fg-3)',
                cursor: 'pointer', textTransform: 'uppercase', textAlign: 'center',
              }}>{l}</button>
          ))}
        </div>
      </div>
    </nav>;


  return (
    <>
      {page !== 'landing' && nav}
      {page === 'landing' && <Landing onEnter={() => setPage('hub')} lang={lang} onLang={setLang} />}
      {page === 'hub' && <Hub onGo={setPage} lang={lang} onBack={() => setPage('landing')} />}
      {page === 'config' && <Configurator lang={lang} onBack={() => setPage('hub')} />}
      {page === 'sell' && <ComingSoon lang={lang} onBack={() => setPage('hub')} />}
      {page === 'inspire' && <Inspire onConfig={() => setPage('config')} lang={lang} onBack={() => setPage('hub')} />}
      {page === 'collab' && <Collab lang={lang} onConfig={() => setPage('config')} onBack={() => setPage('hub')} />}

      <Tweaks open={tweaksOpen} onClose={() => setTweaksOpen(false)}
      settings={settings} setSettings={setSettings}
      images={images} setImages={setImages}
      imagesSaveState={imagesSaveState} saveImages={saveImages} />
    </>);

};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
