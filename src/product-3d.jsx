// Three.js product preview — procedural geometry per pack type, with a
// paper label textured via a drawn Canvas. No external 3D files: every
// shape is simple primitives we fully control, so labels sit exactly where
// they should.

// ───────────────────────────────────────────────────────────────────
// Gummy silhouettes — parametric THREE.Shape paths, extruded into real
// 3D jelly pieces. Pick a kind from the config's shape name/category.
// Ordered: specific names first, generic fallbacks last.
// ───────────────────────────────────────────────────────────────────
const GUMMY_KIND_RULES = [
  [/einhorn|unicorn/, 'unicorn'],
  [/pferd|horse/, 'horse'],
  [/küken|kueken|chick|ente|duck|vogel|bird|hahn/, 'chick'],
  [/hase|rabbit|bunny|oster/, 'rabbit'],
  [/elefant|elephant/, 'elephant'],
  [/schwein|piggy|pig\b|sau\b/, 'pig'],
  [/frosch|frog/, 'frog'],
  [/fisch|fish|hai\b|haifisch|shark/, 'fish'],
  [/krake|octopus|oktopus|tintenfisch/, 'octopus'],
  [/schaf|sheep|lamm/, 'sheep'],
  [/herz|heart|love/, 'heart'],
  [/stern|star\b/, 'star'],
  [/sonne|sun\b/, 'sun'],
  [/blume|flower|rose\b/, 'flower'],
  [/kleeblatt|klee|clover|glück/, 'clover'],
  [/brezel|pretzel/, 'pretzel'],
  [/gurke|gürk|guerk|pickle|cucumber/, 'pickle'],
  [/wurm|worm|schlange|snake/, 'worm'],
  [/erdbeer|strawberry/, 'strawberry'],
  [/himbeer|brombeer|beere|berry/, 'berry'],
  [/traube|grape|wein(?!glas)/, 'grape'],
  [/apfel|apple|pfirsich|peach|quitte/, 'apple'],
  [/zitron|orange|limette|mandarine|grapefruit|schnitte|citrus|melone|superfrücht|südfrücht|fruchtsalat|ananas|maracuja/, 'citrus'],
  [/flasche|bottle|cola|sprudel|glas\b|bierglas|weißbierglas/, 'bottle'],
  [/rakete|rocket|satellit/, 'rocket'],
  [/flugzeug|plane|hubschrauber|helikopter|heli\b/, 'plane'],
  [/schiff|boot|boat|segel/, 'boat'],
  [/auto|cars|car\b|bus\b|lkw|traktor|zug\b|ice\b|lokomotive|bahn|wag(g)?on|motorrad|bagger|sportwagen|felge|raupe|metro/, 'car'],
  [/blitz|lightning|flash/, 'lightning'],
  [/tropfen|drop\b|blase/, 'drop'],
  [/krone|crown|prinzess/, 'crown'],
  [/kussmund|lippe|mund\b|lips|kiss/, 'lips'],
  [/zahn|tooth/, 'tooth'],
  [/knochen|bone/, 'bone'],
  [/totenkopf|skull|schädel/, 'skull'],
  [/geist|ghost|halloween|grusel|vampir|engel|angel|zwerge/, 'ghost'],
  [/pfote|paw|tatze/, 'paw'],
  [/telefon|hörer|hoerer|phone/, 'phone'],
  [/werkzeug|hammer|schrauben|zange|säge|saege|bohrer|tool/, 'hammer'],
  [/haus\b|house|turm|dom\b|kirche|münster|michel|tor\b|schloss|schloß|eiffel|wolkenkratzer|porta|frauenkirche/, 'house'],
  [/diamant|raute|diamond|kristall/, 'gem'],
  [/fussball|fußball|football|ball\b|kugel/, 'ball'],
  [/euro|€/, 'euro'],
  [/paragraf|paragraph|§/, 'paragraph'],
  [/smiley|münze|munze|coin|pastille|kreis|circle|puck|elektrode|goldbarren/, 'disc'],
  [/baustein|cube|würfel|block|buch\b|book|handy|fernbedienung/, 'cube'],
  [/ring|donut|reifen|rad\b|hufeisen/, 'ring'],
  [/teddy|bär|baer|bear|gummibär|maus|mouse|katze|cat\b|kuh\b|wolf|hund|dog\b|tier|zoo|bauernhof|gürteltier|eichhörn|löwe|drache|bulle/, 'bear'],
];

const gummyKindFor = (cfg) => {
  const s = ((cfg && (cfg.shapeName || cfg.shape)) || '').toLowerCase();
  for (const [re, kind] of GUMMY_KIND_RULES) if (re.test(s)) return kind;
  // deterministic variety so different catalog shapes don't all look identical
  const key = (cfg && (cfg.shapeId || cfg.shapeName)) || '';
  let h = 0; for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return ['bear', 'heart', 'ring', 'star', 'drop', 'disc'][h % 6];
};

// ───────────────────────────────────────────────────────────────────
// Candy color per flavor — explicit table covering the full flavors.json
// catalog (keyed by english + german name, lowercased). The gummy pieces
// re-tint whenever the flavor changes; packaging color stays separate.
// ───────────────────────────────────────────────────────────────────
const FLAVOR_COLORS = {
  'orange': '#f5921e',            'erdbeere': '#e0393e',        'strawberry': '#e0393e',
  'himbeere': '#d92d63',          'raspberry': '#d92d63',
  'zitrone': '#f7d21e',           'lemon': '#f7d21e',
  'holunder': '#6f4a8e',          'elderberry': '#6f4a8e',
  'passionsfrucht': '#f2a71b',    'passion fruit': '#f2a71b',
  'kirsche': '#b5172c',           'cherry': '#b5172c',
  'ananas': '#f5d938',            'pineapple': '#f5d938',
  'brombeere': '#4a2a5e',         'blackberry': '#4a2a5e',
  'granatapfel': '#c02444',       'pomegranate': '#c02444',
  'schwarze johannisbeere': '#52285e', 'black currant': '#52285e',
  'ingwer': '#e0a53a',            'ginger': '#e0a53a',
  'birne': '#cfdf6a',             'pear': '#cfdf6a',
  'bier': '#e8b83a',              'beer': '#e8b83a',
  'grapefruit': '#f2766b',
  'apfel': '#a8cf3f',             'apple': '#a8cf3f',
  'apfel (grün)': '#7ac52e',      'green apple': '#7ac52e',
  'mango': '#f7b32a',
  'wassermelone': '#ef6a5a',      'watermelon': '#ef6a5a',
  'chili': '#d1281e',
  'limette': '#a8d43a',           'lime': '#a8d43a',
  'kiwi': '#8fbf3a',
  'kokos': '#f2ede2',             'coconut': '#f2ede2',
  'traube': '#7a4fb0',            'grape': '#7a4fb0',
  'pfirsich': '#f7a670',          'peach': '#f7a670',
  'waldmeister': '#46b85c',       'woodruff': '#46b85c',
  'joghurt': '#f5efe4',           'yogurt': '#f5efe4',
  'apfelstrudel': '#d9a45c',      'apple strudel': '#d9a45c',
  'cranberry': '#c22f4a',
  'sanddorn': '#f09526',          'sea buckthorn': '#f09526',
  'rhabarber': '#e57d8c',         'rhubarb': '#e57d8c',
  'lakritz': '#2a2126',           'licorice': '#2a2126',
  'rum': '#b56a2a',
  'glühwein': '#8e2438',          'mulled wine': '#8e2438',
  'honig': '#eab53a',             'honey': '#eab53a',
  'mandarine': '#f79e1b',         'tangerine': '#f79e1b',
  'tropic': '#f2a03a',
  'vanille': '#f2e4b8',           'vanilla': '#f2e4b8',
  'cassis': '#5e2f66',
  'rote grütze': '#c42341',       'red berries': '#c42341',
  'kaffee': '#6e4a2a',            'coffee': '#6e4a2a',
  'blutorange': '#e85c2a',        'blood orange': '#e85c2a',
  'milch': '#f4efe6',             'milk': '#f4efe6',
  'tiramisu': '#cbaa7e',
  'eukalyptus-menthol': '#66b8a8','eucalyptus menthol': '#66b8a8',
  'irish cream': '#d9b98c',
  'schokolade': '#5c3a24',        'chocolate': '#5c3a24',
  'cola': '#6b4423',
  'wildkirsche': '#a3122b',       'wild cherry': '#a3122b',
  'rote johannisbeere': '#d8283c','red currant': '#d8283c',
  'gin tonic': '#cfe0d2',
  'zimt': '#b0642e',              'cinnamon': '#b0642e',
  'heidelbeere': '#4f5aa8',       'blueberry': '#4f5aa8',
  'pflaume': '#6e3a70',           'plum': '#6e3a70',
  'litschi': '#f2c9c4',           'lychee': '#f2c9c4',
  'espresso': '#4a3020',
  'bratapfel': '#cf9a4a',         'baked apple': '#cf9a4a',
  'buttermilch': '#f4eeda',       'buttermilk': '#f4eeda',
  'hibiskus': '#d4295e',          'hibiscus': '#d4295e',
  'banane': '#f5dd4a',            'banana': '#f5dd4a',
  'sahne': '#f5eeda',             'cream': '#f5eeda',
  'basilikum': '#5c9e3f',         'basil': '#5c9e3f',
  'amaretto': '#c98a4a',
  'thymian': '#7a9a5c',           'thyme': '#7a9a5c',
  'lavendel': '#9a7fc4',          'lavender': '#9a7fc4',
  'hanf': '#6a8f4a',              'hemp': '#6a8f4a',
  'süßholzwurzel': '#3a2c22',     'licorice root': '#3a2c22',
  'italienische kräuter (aperol)': '#ef7a3a', 'italian herbs (aperol)': '#ef7a3a',
  'tequila': '#ddca5f',
  'käsekuchen': '#f2e2c4',        'cheesecake': '#f2e2c4',
  'mojito': '#b8e08a',
  'haselnuss-vanille': '#cfa06a', 'hazelnut-vanilla': '#cfa06a',
  'matcha': '#9ab554',
  'karamell': '#c9822e',          'caramel': '#c9822e',
  'gurke': '#a7c53e',             'cucumber': '#a7c53e',
  'pfefferminz': '#7fd4b8',       'peppermint': '#7fd4b8',
  'popcorn': '#f2d998',
  'yuzu': '#e8d02e',
  'calamansi': '#cfd93a',
  'quitte': '#e8c353',            'quince': '#e8c353',
  // legacy wizard ids
  'sour-pickle': '#a7c53e', 'sour pickle': '#a7c53e',
  'cheese': '#e8c06a', 'smoked cheese': '#e8c06a',
  'lemon-salt': '#f7d21e', 'lemon salt': '#f7d21e',
  'ferment': '#d1502e', 'fermentiert': '#d1502e',
  'herb': '#7a9a5c', 'kräuter': '#7a9a5c',
  'tequila lime': '#ddca5f',
};

// Derive the candy color from the chosen flavor (falls back to a keyword
// guess, then cfg.color). Packaging color is separate (cfg.packColor).
const gummyColorFor = (cfg) => {
  const en = ((cfg && cfg.flavor) || '').toLowerCase().trim();
  const de = ((cfg && cfg.flavorDe) || '').toLowerCase().trim();
  if (FLAVOR_COLORS[en]) return FLAVOR_COLORS[en];
  if (FLAVOR_COLORS[de]) return FLAVOR_COLORS[de];
  const f = en + ' ' + de;
  const map = [
    [/cola|kola/, '#6b4423'],
    [/lemon|zitro|lime|limet|matcha|apple|apfel|kiwi|pickle|gurke|gürk|dill|herb|kräuter|mint|minze/, '#8bbf3a'],
    [/orange|mango|peach|pfirsich|apricot|aprikose|passion|karotte/, '#f0912e'],
    [/rasp|himbeer|strawberry|erdbeer|cherry|kirsch|melon|wasser|granat|pomegran|red|paprika|chili|tomato/, '#d8322f'],
    [/blueberry|heidelbeer|blau|blackberry|brombeer|grape|traube|lavendel|violet|plum|pflaume/, '#7a4fb0'],
    [/banana|banane|vanilla|vanille|honey|honig|butter|pineapple|ananas|maracuja/, '#f2c94c'],
    [/cheese|käse|caramel|karamell|coffee|kaffee|hazelnut|nuss|almond|mandel|choc|schok/, '#a9702f'],
    [/coconut|kokos|milk|milch|cream|sahne|yogurt|joghurt/, '#eee6d3'],
  ];
  for (const [re, c] of map) if (re.test(f)) return c;
  return (cfg && cfg.color) || '#7a9a3a';
};

// ───────────────────────────────────────────────────────────────────
// Silhouette library. Each entry returns a THREE.Shape or an ARRAY of
// shapes (multi-part pieces like grape clusters). Units are roughly
// -1..1; geometry is re-normalized after extrusion, so only proportions
// matter here.
// ───────────────────────────────────────────────────────────────────
const radialShape = (fn, n = 96) => {
  const sh = new THREE.Shape();
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2;
    const r = fn(a);
    const x = Math.cos(a) * r, y = Math.sin(a) * r;
    i === 0 ? sh.moveTo(x, y) : sh.lineTo(x, y);
  }
  return sh;
};

const circleShape = (cx, cy, r) => {
  const sh = new THREE.Shape();
  sh.absarc(cx, cy, r, 0, Math.PI * 2, false);
  return sh;
};

const rectShape = (cx, cy, w, h) => {
  const sh = new THREE.Shape();
  sh.moveTo(cx - w / 2, cy - h / 2);
  sh.lineTo(cx + w / 2, cy - h / 2);
  sh.lineTo(cx + w / 2, cy + h / 2);
  sh.lineTo(cx - w / 2, cy + h / 2);
  sh.closePath();
  return sh;
};

// Thick band along a centerline y=centerFn(x) with half-width widthFn(x),
// rounded end caps — used for worm / pickle style pieces.
const bandShape = (centerFn, widthFn, x0, x1, steps = 44) => {
  const top = [], bot = [];
  for (let i = 0; i <= steps; i++) {
    const x = x0 + (x1 - x0) * (i / steps);
    const y = centerFn(x);
    const dx = (x1 - x0) / steps;
    const dy = centerFn(Math.min(x1, x + dx)) - centerFn(Math.max(x0, x - dx));
    const len = Math.sqrt(4 * dx * dx + dy * dy) || 1;
    // normal of the tangent (2dx, dy)
    const nx = -dy / len, ny = 2 * dx / len;
    const w = widthFn(x);
    top.push([x + nx * w, y + ny * w]);
    bot.push([x - nx * w, y - ny * w]);
  }
  const sh = new THREE.Shape();
  top.forEach(([x, y], i) => i === 0 ? sh.moveTo(x, y) : sh.lineTo(x, y));
  // rounded cap at x1 end
  {
    const [tx, ty] = top[steps], [bx, by] = bot[steps];
    const cx = (tx + bx) / 2, cy = (ty + by) / 2;
    const r = Math.hypot(tx - bx, ty - by) / 2;
    const a0 = Math.atan2(ty - cy, tx - cx);
    sh.absarc(cx, cy, r, a0, a0 - Math.PI, true);
  }
  for (let i = steps; i >= 0; i--) sh.lineTo(bot[i][0], bot[i][1]);
  // rounded cap at x0 end
  {
    const [tx, ty] = top[0], [bx, by] = bot[0];
    const cx = (tx + bx) / 2, cy = (ty + by) / 2;
    const r = Math.hypot(tx - bx, ty - by) / 2;
    const a0 = Math.atan2(by - cy, bx - cx);
    sh.absarc(cx, cy, r, a0, a0 - Math.PI, true);
  }
  sh.closePath();
  return sh;
};

const makeGummyShape = (kind) => {
  const sh = new THREE.Shape();

  if (kind === 'heart') {
    sh.moveTo(0, -1.0);
    sh.bezierCurveTo(-0.9, -0.45, -1.05, 0.25, -0.65, 0.62);
    sh.bezierCurveTo(-0.35, 0.9, -0.05, 0.8, 0, 0.5);
    sh.bezierCurveTo(0.05, 0.8, 0.35, 0.9, 0.65, 0.62);
    sh.bezierCurveTo(1.05, 0.25, 0.9, -0.45, 0, -1.0);
    return sh;
  }

  if (kind === 'ring') {
    sh.absarc(0, 0, 1, 0, Math.PI * 2, false);
    const hole = new THREE.Path();
    hole.absarc(0, 0, 0.46, 0, Math.PI * 2, true);
    sh.holes.push(hole);
    return sh;
  }

  if (kind === 'star') {
    const spikes = 5, outer = 1, inner = 0.48;
    for (let i = 0; i < spikes * 2; i++) {
      const r = i % 2 === 0 ? outer : inner;
      const a = (Math.PI / spikes) * i - Math.PI / 2;
      const x = Math.cos(a) * r, y = -Math.sin(a) * r;
      i === 0 ? sh.moveTo(x, y) : sh.lineTo(x, y);
    }
    sh.closePath();
    return sh;
  }

  if (kind === 'sun') {
    const spikes = 12, outer = 1, inner = 0.66;
    for (let i = 0; i < spikes * 2; i++) {
      const r = i % 2 === 0 ? outer : inner;
      const a = (Math.PI / spikes) * i;
      const x = Math.cos(a) * r, y = Math.sin(a) * r;
      i === 0 ? sh.moveTo(x, y) : sh.lineTo(x, y);
    }
    sh.closePath();
    return sh;
  }

  if (kind === 'flower') {
    return radialShape(a => 0.62 + 0.38 * Math.pow(Math.abs(Math.cos(a * 2.5)), 0.9), 160);
  }

  if (kind === 'clover') {
    const stem = new THREE.Shape();
    stem.moveTo(-0.09, -0.5);
    stem.quadraticCurveTo(0.02, -0.85, 0.22, -1.05);
    stem.lineTo(0.38, -0.92);
    stem.quadraticCurveTo(0.18, -0.75, 0.13, -0.42);
    stem.closePath();
    return [
      circleShape(0, 0.52, 0.42),
      circleShape(-0.46, -0.14, 0.42),
      circleShape(0.46, -0.14, 0.42),
      stem,
    ];
  }

  if (kind === 'worm') {
    // thick S-wave band with rounded head/tail
    return bandShape(
      (x) => Math.sin(x * 2.3) * 0.34,
      (x) => 0.26 + 0.05 * Math.cos(x * 1.2),
      -1.3, 1.3
    );
  }

  if (kind === 'bottle') {
    // contour cola bottle — slim cap/neck, curvy waist, mirrored profile
    const right = [
      [0.16, 1.18], [0.16, 1.06], [0.13, 1.02],       // cap
      [0.13, 0.78],                                    // neck
      [0.3, 0.62], [0.4, 0.48], [0.41, 0.32],          // shoulder
      [0.33, 0.12], [0.3, -0.05], [0.34, -0.22],       // waist
      [0.43, -0.42], [0.45, -0.65], [0.4, -0.92],      // hip
      [0.33, -1.08], [0.18, -1.14],                    // base corner
    ];
    sh.moveTo(-0.16, 1.18);
    sh.lineTo(0.16, 1.18);
    for (let i = 1; i < right.length - 1; i += 1) {
      const [x, y] = right[i];
      const [nx, ny] = right[i + 1] || right[i];
      sh.quadraticCurveTo(x, y, (x + nx) / 2, (y + ny) / 2);
    }
    sh.lineTo(0, -1.14);
    for (let i = right.length - 1; i > 0; i -= 1) {
      const [x, y] = right[i];
      const [px, py] = right[i - 1];
      sh.quadraticCurveTo(-x, y, -(x + px) / 2, (y + py) / 2);
    }
    sh.closePath();
    return sh;
  }

  if (kind === 'pickle') {
    // plump little cucumber: gently arched capsule with warty edges
    return bandShape(
      (x) => -0.14 * (1 - Math.pow(x / 0.95, 2)),
      (x) => {
        const taper = Math.pow(Math.max(0.05, 1 - Math.pow(x / 1.1, 4)), 0.6);
        return (0.42 + 0.05 * Math.sin(x * 7.5) + 0.028 * Math.sin(x * 13 + 2)) * taper;
      },
      -0.95, 0.95, 72
    );
  }

  if (kind === 'chick') {
    // Easter-chick: two clear circles (head + fat body), pointy beak, tail
    const HX = 0.28, HY = 0.56, HR = 0.42;   // head circle
    const BX = -0.14, BY = -0.28, BR = 0.74; // body circle
    sh.moveTo(HX + HR * Math.cos(-0.18), HY + HR * Math.sin(-0.18));   // beak top joint
    sh.lineTo(1.1, 0.38);                                              // beak tip
    sh.lineTo(HX + HR * Math.cos(-0.72), HY + HR * Math.sin(-0.72));   // beak bottom joint
    sh.absarc(BX, BY, BR, 0.62, -2.62, true);                          // chest → belly → rear
    sh.lineTo(-1.22, 0.3);                                             // tail tip
    sh.lineTo(-0.98, 0.02);                                            // tail underside notch
    sh.lineTo(-0.52, 0.34);                                            // back up to neck
    sh.absarc(HX, HY, HR, 2.62, -0.18, true);                          // over the head
    sh.closePath();
    return sh;
  }

  if (kind === 'fish') {
    sh.moveTo(-1.05, 0.02);
    sh.bezierCurveTo(-0.85, 0.4, -0.25, 0.56, 0.2, 0.42);
    sh.bezierCurveTo(0.4, 0.36, 0.55, 0.28, 0.62, 0.16);
    sh.bezierCurveTo(0.85, 0.42, 1.02, 0.52, 1.1, 0.46);
    sh.bezierCurveTo(1.0, 0.22, 1.0, -0.12, 1.1, -0.36);
    sh.bezierCurveTo(1.02, -0.44, 0.85, -0.34, 0.62, -0.1);
    sh.bezierCurveTo(0.55, -0.22, 0.4, -0.32, 0.2, -0.38);
    sh.bezierCurveTo(-0.25, -0.52, -0.85, -0.36, -1.05, 0.02);
    return sh;
  }

  if (kind === 'frog') {
    // front view frog: wide body + two bulging eyes + leg + feet bumps
    const ell = (cx, cy, rx, ry) => {
      const e = new THREE.Shape();
      for (let i = 0; i <= 48; i++) {
        const a = (i / 48) * Math.PI * 2;
        const x = cx + Math.cos(a) * rx, y = cy + Math.sin(a) * ry;
        i === 0 ? e.moveTo(x, y) : e.lineTo(x, y);
      }
      e.closePath();
      return e;
    };
    return [
      ell(0, -0.12, 0.92, 0.78),          // body/head blob
      circleShape(-0.42, 0.72, 0.3),      // left eye
      circleShape(0.42, 0.72, 0.3),       // right eye
      circleShape(-0.74, -0.5, 0.33),     // left hind leg bulge
      circleShape(0.74, -0.5, 0.33),      // right hind leg bulge
      ell(-0.5, -0.95, 0.3, 0.13),        // left foot
      ell(0.5, -0.95, 0.3, 0.13),         // right foot
    ];
  }

  if (kind === 'pig') {
    // side view: prominent flat snout, pointed ear, curly-tail nub, legs
    sh.moveTo(0.74, 0.4);                                    // snout top base
    sh.lineTo(1.18, 0.3);                                    // snout top
    sh.quadraticCurveTo(1.28, 0.02, 1.18, -0.26);            // flat snout disc
    sh.lineTo(0.76, -0.34);                                  // snout bottom base
    sh.bezierCurveTo(0.78, -0.5, 0.68, -0.64, 0.56, -0.7);   // jaw
    sh.lineTo(0.54, -1.0);
    sh.lineTo(0.3, -1.0);
    sh.lineTo(0.28, -0.72);                                  // front leg
    sh.bezierCurveTo(0.04, -0.78, -0.2, -0.78, -0.42, -0.72);
    sh.lineTo(-0.44, -1.0);
    sh.lineTo(-0.68, -1.0);
    sh.lineTo(-0.7, -0.66);                                  // hind leg
    sh.bezierCurveTo(-0.98, -0.52, -1.1, -0.2, -1.05, 0.06); // rump
    sh.quadraticCurveTo(-1.28, 0.12, -1.16, 0.3);            // curly tail nub
    sh.quadraticCurveTo(-1.02, 0.36, -0.95, 0.3);
    sh.bezierCurveTo(-0.85, 0.55, -0.5, 0.72, -0.14, 0.72);  // back
    sh.lineTo(0.02, 0.98);                                   // ear back edge
    sh.lineTo(0.26, 0.72);                                   // ear tip → head
    sh.bezierCurveTo(0.5, 0.66, 0.7, 0.52, 0.78, 0.34);      // forehead
    sh.closePath();
    return sh;
  }

  if (kind === 'rabbit') {
    // front view, two long ears
    sh.moveTo(0, 0.3);
    sh.bezierCurveTo(0.05, 0.52, 0.08, 0.76, 0.2, 1.04);
    sh.bezierCurveTo(0.28, 1.22, 0.46, 1.22, 0.5, 1.02);
    sh.bezierCurveTo(0.53, 0.78, 0.42, 0.5, 0.32, 0.24);
    sh.bezierCurveTo(0.55, 0.12, 0.62, -0.08, 0.55, -0.26);
    sh.bezierCurveTo(0.74, -0.5, 0.72, -0.86, 0.4, -0.99);
    sh.bezierCurveTo(0.15, -1.08, -0.15, -1.08, -0.4, -0.99);
    sh.bezierCurveTo(-0.72, -0.86, -0.74, -0.5, -0.55, -0.26);
    sh.bezierCurveTo(-0.62, -0.08, -0.55, 0.12, -0.32, 0.24);
    sh.bezierCurveTo(-0.42, 0.5, -0.53, 0.78, -0.5, 1.02);
    sh.bezierCurveTo(-0.46, 1.22, -0.28, 1.22, -0.2, 1.04);
    sh.bezierCurveTo(-0.08, 0.76, -0.05, 0.52, 0, 0.3);
    return sh;
  }

  if (kind === 'elephant') {
    // side view: THICK curving trunk, domed head, big body, stubby legs
    sh.moveTo(0.3, 0.72);                                     // top of head
    sh.bezierCurveTo(0.62, 0.68, 0.84, 0.52, 0.9, 0.3);       // forehead
    sh.bezierCurveTo(1.02, 0.18, 1.1, -0.05, 1.12, -0.3);     // trunk outer upper
    sh.bezierCurveTo(1.14, -0.55, 1.12, -0.78, 1.02, -0.92);  // trunk outer lower
    sh.lineTo(0.78, -0.88);                                   // trunk tip
    sh.bezierCurveTo(0.86, -0.7, 0.88, -0.5, 0.85, -0.3);     // trunk inner lower
    sh.bezierCurveTo(0.83, -0.1, 0.74, 0.05, 0.62, 0.12);     // trunk inner upper
    sh.bezierCurveTo(0.6, -0.2, 0.58, -0.45, 0.55, -0.66);    // chest
    sh.lineTo(0.53, -1.0);
    sh.lineTo(0.26, -1.0);
    sh.lineTo(0.25, -0.72);                                   // front leg
    sh.bezierCurveTo(0.0, -0.78, -0.28, -0.78, -0.52, -0.72);
    sh.lineTo(-0.53, -1.0);
    sh.lineTo(-0.82, -1.0);
    sh.lineTo(-0.84, -0.64);                                  // hind leg
    sh.bezierCurveTo(-1.05, -0.45, -1.1, -0.05, -0.96, 0.25); // rump
    sh.bezierCurveTo(-0.8, 0.6, -0.4, 0.74, -0.05, 0.72);     // back
    sh.bezierCurveTo(0.05, 0.76, 0.18, 0.76, 0.3, 0.72);      // head top
    sh.closePath();
    return sh;
  }

  if (kind === 'octopus') {
    // dome head + wavy tentacle hem
    sh.moveTo(-0.85, 0.05);
    sh.bezierCurveTo(-0.85, 0.65, -0.45, 1.02, 0, 1.02);
    sh.bezierCurveTo(0.45, 1.02, 0.85, 0.65, 0.85, 0.05);
    sh.lineTo(0.85, -0.25);
    sh.quadraticCurveTo(1.05, -0.55, 0.9, -0.9);
    sh.quadraticCurveTo(0.75, -0.6, 0.55, -0.5);
    sh.quadraticCurveTo(0.62, -0.85, 0.42, -1.05);
    sh.quadraticCurveTo(0.32, -0.7, 0.16, -0.55);
    sh.quadraticCurveTo(0.12, -0.95, -0.08, -1.08);
    sh.quadraticCurveTo(-0.12, -0.7, -0.28, -0.55);
    sh.quadraticCurveTo(-0.38, -0.92, -0.6, -1.0);
    sh.quadraticCurveTo(-0.55, -0.62, -0.7, -0.45);
    sh.quadraticCurveTo(-0.92, -0.62, -1.02, -0.82);
    sh.quadraticCurveTo(-1.0, -0.4, -0.85, -0.18);
    sh.closePath();
    return sh;
  }

  if (kind === 'sheep') {
    // fluffy cloud body + oval head with ear + two legs
    const body = radialShape(a => 0.72 + 0.07 * Math.cos(a * 8) + 0.028 * Math.sin(a * 13), 140);
    const head = new THREE.Shape();
    const hp = [];
    for (let i = 0; i <= 40; i++) {
      const a = (i / 40) * Math.PI * 2;
      hp.push([0.78 + Math.cos(a) * 0.26, 0.22 + Math.sin(a) * 0.34]);
    }
    hp.forEach(([x, y], i) => i === 0 ? head.moveTo(x, y) : head.lineTo(x, y));
    head.closePath();
    const ear = new THREE.Shape();
    ear.moveTo(0.62, 0.5);
    ear.quadraticCurveTo(0.4, 0.68, 0.42, 0.5);
    ear.quadraticCurveTo(0.48, 0.34, 0.68, 0.36);
    ear.closePath();
    return [body, head, ear, rectShape(-0.34, -0.88, 0.17, 0.42), rectShape(0.3, -0.88, 0.17, 0.42)];
  }

  if (kind === 'strawberry') {
    // plump berry with leafy crown
    sh.moveTo(0, 0.58);
    sh.lineTo(0.2, 0.9);
    sh.lineTo(0.28, 0.6);
    sh.lineTo(0.6, 0.74);
    sh.lineTo(0.52, 0.44);
    sh.bezierCurveTo(0.85, 0.28, 0.92, -0.05, 0.72, -0.42);
    sh.bezierCurveTo(0.52, -0.78, 0.2, -1.02, 0, -1.02);
    sh.bezierCurveTo(-0.2, -1.02, -0.52, -0.78, -0.72, -0.42);
    sh.bezierCurveTo(-0.92, -0.05, -0.85, 0.28, -0.52, 0.44);
    sh.lineTo(-0.6, 0.74);
    sh.lineTo(-0.28, 0.6);
    sh.lineTo(-0.2, 0.9);
    sh.lineTo(0, 0.58);
    return sh;
  }

  if (kind === 'berry') {
    // bumpy raspberry + leaf nub
    const body = radialShape(a => 0.78 + 0.11 * Math.cos(a * 7 + 0.5) + 0.05 * Math.sin(a * 13), 140);
    const leaf = new THREE.Shape();
    leaf.moveTo(-0.3, 0.68);
    leaf.lineTo(0, 1.05);
    leaf.lineTo(0.3, 0.68);
    leaf.quadraticCurveTo(0, 0.85, -0.3, 0.68);
    return [body, leaf];
  }

  if (kind === 'grape') {
    // cluster of grapes + stem
    const grapes = [
      circleShape(0, 0.55, 0.3), circleShape(-0.42, 0.32, 0.3), circleShape(0.42, 0.32, 0.3),
      circleShape(-0.62, -0.08, 0.29), circleShape(0, -0.02, 0.31), circleShape(0.62, -0.08, 0.29),
      circleShape(-0.3, -0.45, 0.3), circleShape(0.3, -0.45, 0.3), circleShape(0, -0.85, 0.29),
    ];
    const stem = new THREE.Shape();
    stem.moveTo(-0.07, 0.6);
    stem.lineTo(0.02, 1.1);
    stem.lineTo(0.2, 1.08);
    stem.lineTo(0.09, 0.58);
    stem.closePath();
    return [...grapes, stem];
  }

  if (kind === 'apple') {
    // round fruit with stalk dip + leaf
    sh.moveTo(0.1, 0.62);
    sh.bezierCurveTo(0.5, 0.85, 0.92, 0.55, 0.92, 0.05);
    sh.bezierCurveTo(0.92, -0.5, 0.5, -0.95, 0.05, -0.92);
    sh.bezierCurveTo(-0.5, -0.98, -0.92, -0.5, -0.92, 0.05);
    sh.bezierCurveTo(-0.92, 0.55, -0.5, 0.85, -0.1, 0.62);
    sh.quadraticCurveTo(0, 0.52, 0.1, 0.62);
    const stalk = rectShape(0, 0.82, 0.1, 0.42);
    const leaf = new THREE.Shape();
    leaf.moveTo(0.1, 0.95);
    leaf.quadraticCurveTo(0.35, 1.15, 0.62, 1.02);
    leaf.quadraticCurveTo(0.4, 0.8, 0.1, 0.95);
    return [sh, stalk, leaf];
  }

  if (kind === 'citrus') {
    // citrus slice: half disc with flat top
    sh.moveTo(-1.0, 0.22);
    sh.lineTo(1.0, 0.22);
    sh.absarc(0, 0.22, 1.0, 0, -Math.PI, true);
    sh.closePath();
    return sh;
  }

  if (kind === 'car') {
    sh.moveTo(-1.05, -0.34);
    sh.bezierCurveTo(-1.1, -0.05, -1.0, 0.1, -0.76, 0.14);
    sh.lineTo(-0.35, 0.18);
    sh.bezierCurveTo(-0.26, 0.44, -0.1, 0.58, 0.1, 0.58);
    sh.lineTo(0.42, 0.58);
    sh.bezierCurveTo(0.62, 0.56, 0.76, 0.42, 0.8, 0.2);
    sh.bezierCurveTo(1.0, 0.16, 1.08, 0.05, 1.06, -0.34);
    sh.lineTo(0.88, -0.34);
    sh.absarc(0.58, -0.34, 0.3, 0, Math.PI, true);
    sh.lineTo(-0.28, -0.34);
    sh.absarc(-0.58, -0.34, 0.3, 0, Math.PI, true);
    sh.closePath();
    return sh;
  }

  if (kind === 'plane') {
    sh.moveTo(1.2, 0.0);
    sh.bezierCurveTo(1.1, 0.12, 0.85, 0.16, 0.58, 0.15);
    sh.lineTo(0.28, 0.14);
    sh.lineTo(-0.1, 0.95);
    sh.lineTo(-0.42, 0.95);
    sh.lineTo(-0.2, 0.12);
    sh.lineTo(-0.58, 0.1);
    sh.lineTo(-0.82, 0.5);
    sh.lineTo(-1.05, 0.5);
    sh.lineTo(-0.92, 0.08);
    sh.lineTo(-1.08, 0.04);
    sh.lineTo(-1.08, -0.04);
    sh.lineTo(-0.92, -0.08);
    sh.lineTo(-1.05, -0.5);
    sh.lineTo(-0.82, -0.5);
    sh.lineTo(-0.58, -0.1);
    sh.lineTo(-0.2, -0.12);
    sh.lineTo(-0.42, -0.95);
    sh.lineTo(-0.1, -0.95);
    sh.lineTo(0.28, -0.14);
    sh.lineTo(0.58, -0.15);
    sh.bezierCurveTo(0.85, -0.16, 1.1, -0.12, 1.2, 0.0);
    return sh;
  }

  if (kind === 'rocket') {
    sh.moveTo(0, 1.15);
    sh.bezierCurveTo(0.22, 0.9, 0.3, 0.6, 0.3, 0.3);
    sh.lineTo(0.3, -0.5);
    sh.lineTo(0.62, -0.92);
    sh.lineTo(0.62, -1.05);
    sh.lineTo(0.26, -0.85);
    sh.lineTo(0.12, -1.02);
    sh.lineTo(-0.12, -1.02);
    sh.lineTo(-0.26, -0.85);
    sh.lineTo(-0.62, -1.05);
    sh.lineTo(-0.62, -0.92);
    sh.lineTo(-0.3, -0.5);
    sh.lineTo(-0.3, 0.3);
    sh.bezierCurveTo(-0.3, 0.6, -0.22, 0.9, 0, 1.15);
    return sh;
  }

  if (kind === 'boat') {
    const hull = new THREE.Shape();
    hull.moveTo(-1.0, -0.3);
    hull.lineTo(1.0, -0.3);
    hull.bezierCurveTo(0.9, -0.62, 0.6, -0.8, 0.3, -0.8);
    hull.lineTo(-0.7, -0.8);
    hull.quadraticCurveTo(-0.95, -0.6, -1.0, -0.3);
    const sail1 = new THREE.Shape();
    sail1.moveTo(0.08, -0.22);
    sail1.lineTo(0.08, 0.95);
    sail1.quadraticCurveTo(0.55, 0.45, 0.68, -0.22);
    sail1.closePath();
    const sail2 = new THREE.Shape();
    sail2.moveTo(-0.08, -0.22);
    sail2.lineTo(-0.08, 0.8);
    sail2.quadraticCurveTo(-0.45, 0.4, -0.58, -0.22);
    sail2.closePath();
    return [hull, sail1, sail2];
  }

  if (kind === 'lightning') {
    sh.moveTo(-0.22, 1.05);
    sh.lineTo(0.45, 1.05);
    sh.lineTo(0.08, 0.28);
    sh.lineTo(0.5, 0.28);
    sh.lineTo(-0.42, -1.05);
    sh.lineTo(-0.1, -0.12);
    sh.lineTo(-0.52, -0.12);
    sh.closePath();
    return sh;
  }

  if (kind === 'drop') {
    sh.moveTo(0, 1.08);
    sh.bezierCurveTo(0.35, 0.6, 0.62, 0.25, 0.62, -0.2);
    sh.bezierCurveTo(0.62, -0.72, 0.35, -1.02, 0, -1.02);
    sh.bezierCurveTo(-0.35, -1.02, -0.62, -0.72, -0.62, -0.2);
    sh.bezierCurveTo(-0.62, 0.25, -0.35, 0.6, 0, 1.08);
    return sh;
  }

  if (kind === 'crown') {
    // chunky 3-point crown with ball tips + tall base band
    sh.moveTo(-0.95, -0.75);
    sh.lineTo(0.95, -0.75);
    sh.lineTo(0.95, -0.18);
    sh.lineTo(0.68, 0.55);
    sh.quadraticCurveTo(0.5, 0.1, 0.3, -0.05);
    sh.lineTo(0.08, 0.72);
    sh.quadraticCurveTo(0, 0.5, -0.08, 0.72);
    sh.lineTo(-0.3, -0.05);
    sh.quadraticCurveTo(-0.5, 0.1, -0.68, 0.55);
    sh.lineTo(-0.95, -0.18);
    sh.closePath();
    return [
      sh,
      circleShape(-0.72, 0.68, 0.14),
      circleShape(0, 0.85, 0.14),
      circleShape(0.72, 0.68, 0.14),
    ];
  }

  if (kind === 'lips') {
    sh.moveTo(-1.0, 0.05);
    sh.bezierCurveTo(-0.55, 0.52, -0.28, 0.56, -0.12, 0.35);
    sh.bezierCurveTo(-0.05, 0.26, 0.05, 0.26, 0.12, 0.35);
    sh.bezierCurveTo(0.28, 0.56, 0.55, 0.52, 1.0, 0.05);
    sh.bezierCurveTo(0.55, -0.62, -0.55, -0.62, -1.0, 0.05);
    return sh;
  }

  if (kind === 'tooth') {
    sh.moveTo(-0.62, 0.88);
    sh.bezierCurveTo(-0.2, 1.06, 0.2, 1.06, 0.62, 0.88);
    sh.bezierCurveTo(0.88, 0.72, 0.9, 0.3, 0.74, 0.02);
    sh.bezierCurveTo(0.66, -0.4, 0.58, -0.78, 0.4, -0.98);
    sh.bezierCurveTo(0.28, -1.08, 0.16, -0.96, 0.19, -0.68);
    sh.bezierCurveTo(0.2, -0.45, 0.1, -0.32, 0, -0.32);
    sh.bezierCurveTo(-0.1, -0.32, -0.2, -0.45, -0.19, -0.68);
    sh.bezierCurveTo(-0.16, -0.96, -0.28, -1.08, -0.4, -0.98);
    sh.bezierCurveTo(-0.58, -0.78, -0.66, -0.4, -0.74, 0.02);
    sh.bezierCurveTo(-0.9, 0.3, -0.88, 0.72, -0.62, 0.88);
    return sh;
  }

  if (kind === 'bone') {
    return [
      rectShape(0, 0, 1.5, 0.34),
      circleShape(-0.75, 0.2, 0.26), circleShape(-0.75, -0.2, 0.26),
      circleShape(0.75, 0.2, 0.26), circleShape(0.75, -0.2, 0.26),
    ];
  }

  if (kind === 'pretzel') {
    // wide pretzel: squashed round body, flat-ish base, three big holes
    const pts = [];
    const N = 120;
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2;
      let x = Math.cos(a) * 1.15;
      let y = Math.sin(a) * 0.88;
      if (y < -0.55) y = -0.55 - (y + 0.55) * 0.25;  // flatten the bottom
      pts.push([x, y]);
    }
    pts.forEach(([x, y], i) => i === 0 ? sh.moveTo(x, y) : sh.lineTo(x, y));
    sh.closePath();
    const h1 = new THREE.Path(); h1.absarc(-0.42, 0.16, 0.27, 0, Math.PI * 2, true);
    const h2 = new THREE.Path(); h2.absarc(0.42, 0.16, 0.27, 0, Math.PI * 2, true);
    const h3 = new THREE.Path();
    if (h3.absellipse) h3.absellipse(0, -0.3, 0.4, 0.2, 0, Math.PI * 2, true, 0);
    else h3.absarc(0, -0.3, 0.26, 0, Math.PI * 2, true);
    sh.holes.push(h1, h2, h3);
    return sh;
  }

  if (kind === 'skull') {
    sh.moveTo(-0.78, 0.2);
    sh.absarc(0, 0.22, 0.78, Math.PI, 0, true);
    sh.bezierCurveTo(0.78, -0.12, 0.6, -0.3, 0.45, -0.34);
    sh.lineTo(0.42, -0.78);
    sh.bezierCurveTo(0.2, -0.94, -0.2, -0.94, -0.42, -0.78);
    sh.lineTo(-0.45, -0.34);
    sh.bezierCurveTo(-0.6, -0.3, -0.78, -0.12, -0.78, 0.2);
    const e1 = new THREE.Path(); e1.absarc(-0.3, 0.18, 0.19, 0, Math.PI * 2, true);
    const e2 = new THREE.Path(); e2.absarc(0.3, 0.18, 0.19, 0, Math.PI * 2, true);
    const nose = new THREE.Path();
    nose.moveTo(0, -0.08); nose.lineTo(0.1, -0.28); nose.lineTo(-0.1, -0.28); nose.closePath();
    sh.holes.push(e1, e2, nose);
    return sh;
  }

  if (kind === 'ghost') {
    sh.moveTo(-0.75, 0.25);
    sh.absarc(0, 0.25, 0.75, Math.PI, 0, true);
    sh.lineTo(0.75, -0.6);
    sh.quadraticCurveTo(0.62, -0.95, 0.38, -0.68);
    sh.quadraticCurveTo(0.2, -1.0, 0, -0.72);
    sh.quadraticCurveTo(-0.2, -1.0, -0.38, -0.68);
    sh.quadraticCurveTo(-0.62, -0.95, -0.75, -0.6);
    sh.closePath();
    return sh;
  }

  if (kind === 'euro') {
    // € — open C ring with two horizontal bars through the left side
    const parts = [];
    const c = new THREE.Shape();
    const a0 = Math.PI * 0.42, a1 = Math.PI * 1.58;
    c.absarc(0.12, 0, 1.0, a0, a1, false);
    c.absarc(0.12, 0, 0.62, a1, a0, true);
    c.closePath();
    parts.push(c);
    parts.push(rectShape(-0.28, 0.2, 1.15, 0.21));
    parts.push(rectShape(-0.28, -0.2, 1.15, 0.21));
    return parts;
  }

  if (kind === 'paragraph') {
    // § — two interlocking open hooks, stacked with an offset
    const hook = (cy, aStart, aEnd) => {
      const s = new THREE.Shape();
      s.absarc(0, cy, 0.58, aStart, aEnd, false);
      s.absarc(0, cy, 0.3, aEnd, aStart, true);
      s.closePath();
      return s;
    };
    return [
      hook(0.42, Math.PI * -0.65, Math.PI * 0.9),
      hook(-0.42, Math.PI * 0.35, Math.PI * 1.9),
    ];
  }

  if (kind === 'phone') {
    // Classic telephone handset: banana-shaped handle bar with a round
    // earpiece and mouthpiece bulging at each end.
    sh.moveTo(-1.0, 0.18);
    // earpiece (left bulb)
    sh.bezierCurveTo(-1.32, 0.5, -1.18, 0.95, -0.78, 0.92);
    sh.bezierCurveTo(-0.55, 0.9, -0.42, 0.74, -0.4, 0.55);
    // top of the handle — shallow arc dipping toward the middle
    sh.bezierCurveTo(-0.2, 0.34, 0.2, 0.34, 0.4, 0.55);
    // mouthpiece (right bulb)
    sh.bezierCurveTo(0.42, 0.74, 0.55, 0.9, 0.78, 0.92);
    sh.bezierCurveTo(1.18, 0.95, 1.32, 0.5, 1.0, 0.18);
    // underside — full banana sweep back to the earpiece
    sh.bezierCurveTo(0.75, -0.12, 0.35, -0.28, 0, -0.28);
    sh.bezierCurveTo(-0.35, -0.28, -0.75, -0.12, -1.0, 0.18);
    return sh;
  }

  if (kind === 'hammer') {
    // Claw hammer: broad head block on top, straight handle below.
    sh.moveTo(-0.72, 0.98);            // head top-left
    sh.lineTo(0.55, 0.98);             // head top edge
    sh.quadraticCurveTo(0.78, 0.96, 0.82, 0.72);
    sh.lineTo(0.82, 0.55);             // striking face
    sh.quadraticCurveTo(0.78, 0.38, 0.55, 0.36);
    sh.lineTo(0.17, 0.36);             // under head, right of handle
    sh.lineTo(0.17, -0.9);             // handle right
    sh.quadraticCurveTo(0.17, -1.02, 0.02, -1.02);
    sh.lineTo(-0.13, -1.02);           // handle bottom
    sh.quadraticCurveTo(-0.24, -1.02, -0.24, -0.9);
    sh.lineTo(-0.24, 0.36);            // handle left
    sh.lineTo(-0.5, 0.36);             // under head, left of handle
    // claw — curved wedge dropping from the head's left
    sh.quadraticCurveTo(-0.92, 0.3, -1.02, 0.02);
    sh.quadraticCurveTo(-0.98, 0.4, -0.86, 0.62);
    sh.quadraticCurveTo(-0.82, 0.9, -0.72, 0.98);
    return sh;
  }

  if (kind === 'paw') {
    const pad = new THREE.Shape();
    pad.absarc(0, -0.32, 0.001, 0, Math.PI * 2, false); // replaced below
    const padShape = radialShape(a => 0.62 + 0.1 * Math.sin(a), 80);
    // squash pad into wide ellipse centered lower
    const pts = padShape.getPoints(80).map(p => new THREE.Vector2(p.x * 1.0, p.y * 0.78 - 0.34));
    const padFinal = new THREE.Shape();
    pts.forEach((p, i) => i === 0 ? padFinal.moveTo(p.x, p.y) : padFinal.lineTo(p.x, p.y));
    padFinal.closePath();
    return [
      padFinal,
      circleShape(-0.66, 0.28, 0.24), circleShape(-0.23, 0.5, 0.24),
      circleShape(0.23, 0.5, 0.24), circleShape(0.66, 0.28, 0.24),
    ];
  }

  if (kind === 'house') {
    sh.moveTo(-0.72, -0.95);
    sh.lineTo(0.72, -0.95);
    sh.lineTo(0.72, 0.1);
    sh.lineTo(0.95, 0.1);
    sh.lineTo(0.28, 0.78);
    sh.lineTo(0.28, 0.95);      // chimney right
    sh.lineTo(0.1, 0.95);       // chimney top
    sh.lineTo(0.1, 0.88);
    sh.lineTo(0, 1.0);          // roof peak
    sh.lineTo(-0.95, 0.1);
    sh.lineTo(-0.72, 0.1);
    sh.closePath();
    return sh;
  }

  if (kind === 'gem') {
    sh.moveTo(-0.55, 0.48);
    sh.lineTo(0.55, 0.48);
    sh.lineTo(0.95, 0.05);
    sh.lineTo(0, -0.88);
    sh.lineTo(-0.95, 0.05);
    sh.closePath();
    return sh;
  }

  if (kind === 'unicorn' || kind === 'horse') {
    // horse head + neck profile facing right; unicorn adds the horn
    sh.moveTo(-0.5, -1.05);                                    // neck base back
    sh.bezierCurveTo(-0.62, -0.6, -0.6, -0.25, -0.55, -0.02);  // back of neck
    sh.quadraticCurveTo(-0.82, 0.06, -0.58, 0.18);             // mane bump 1
    sh.quadraticCurveTo(-0.82, 0.32, -0.55, 0.42);             // mane bump 2
    sh.quadraticCurveTo(-0.75, 0.58, -0.45, 0.66);             // mane bump 3
    sh.quadraticCurveTo(-0.55, 0.82, -0.28, 0.82);             // poll (top of head)
    sh.lineTo(-0.12, 1.12);                                    // ear tip
    sh.lineTo(0.02, 0.82);                                     // ear front
    if (kind === 'unicorn') {
      sh.lineTo(0.1, 0.84);
      sh.lineTo(0.5, 1.38);                                    // horn tip
      sh.lineTo(0.24, 0.74);                                   // horn base front
    }
    sh.bezierCurveTo(0.4, 0.58, 0.62, 0.4, 0.82, 0.2);         // forehead → nose bridge
    sh.bezierCurveTo(0.98, 0.04, 1.0, -0.12, 0.92, -0.22);     // nose tip
    sh.bezierCurveTo(0.84, -0.34, 0.68, -0.36, 0.56, -0.3);    // upper lip → chin
    sh.bezierCurveTo(0.42, -0.45, 0.28, -0.6, 0.2, -0.78);     // jaw line
    sh.bezierCurveTo(0.14, -0.9, 0.1, -1.0, 0.08, -1.05);      // throat
    sh.closePath();                                            // neck underside
    return sh;
  }

  // bear (default) — classic front-facing gummy bear
  sh.moveTo(0, 1.0);
  sh.bezierCurveTo(0.14, 1.18, 0.46, 1.19, 0.52, 0.94);       // right ear
  sh.bezierCurveTo(0.73, 0.86, 0.74, 0.6, 0.56, 0.48);        // side of head
  sh.bezierCurveTo(0.8, 0.4, 0.92, 0.18, 0.84, -0.04);        // arm out
  sh.bezierCurveTo(0.78, -0.22, 0.6, -0.26, 0.5, -0.18);      // arm tip
  sh.bezierCurveTo(0.6, -0.44, 0.6, -0.62, 0.52, -0.78);      // hip
  sh.bezierCurveTo(0.5, -0.96, 0.4, -1.04, 0.24, -1.02);      // foot outer
  sh.bezierCurveTo(0.1, -1.0, 0.07, -0.88, 0.1, -0.74);       // foot inner
  sh.bezierCurveTo(0.05, -0.65, -0.05, -0.65, -0.1, -0.74);   // crotch
  sh.bezierCurveTo(-0.07, -0.88, -0.1, -1.0, -0.24, -1.02);
  sh.bezierCurveTo(-0.4, -1.04, -0.5, -0.96, -0.52, -0.78);
  sh.bezierCurveTo(-0.6, -0.62, -0.6, -0.44, -0.5, -0.18);
  sh.bezierCurveTo(-0.6, -0.26, -0.78, -0.22, -0.84, -0.04);
  sh.bezierCurveTo(-0.92, 0.18, -0.8, 0.4, -0.56, 0.48);
  sh.bezierCurveTo(-0.74, 0.6, -0.73, 0.86, -0.52, 0.94);
  sh.bezierCurveTo(-0.46, 1.19, -0.14, 1.18, 0, 1.0);
  return sh;
};

// Merge several BufferGeometries into one (non-indexed concat). Used for
// multi-part silhouettes; parts get slightly different extrude depths so
// their overlapping faces never z-fight.
const mergeGeos = (geos) => {
  const parts = geos.map(g => (g.index ? g.toNonIndexed() : g));
  let total = 0;
  parts.forEach(g => { total += g.attributes.position.count; });
  const pos = new Float32Array(total * 3);
  const norm = new Float32Array(total * 3);
  let o = 0;
  parts.forEach(g => {
    pos.set(g.attributes.position.array, o * 3);
    norm.set(g.attributes.normal.array, o * 3);
    o += g.attributes.position.count;
  });
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.BufferAttribute(norm, 3));
  return out;
};

// Build the actual 3D geometry for a gummy kind. Most kinds are bevel-
// extruded silhouettes; a few are true 3D primitives (disc, ball, cube).
// Geometry is normalized to bounding-sphere radius 1 so every kind ends
// up a comparable size.
const makeGummyGeometry = (kind, quality = 'high') => {
  const seg = quality === 'high' ? 48 : 16;
  const bevSeg = quality === 'high' ? 8 : 3;
  let geo;
  if (kind === 'disc') {
    geo = new THREE.CylinderGeometry(1, 1, 0.55, 48);
    geo.rotateX(Math.PI / 2);
  } else if (kind === 'ball') {
    geo = new THREE.SphereGeometry(1, 32, 22);
    geo.scale(1, 0.94, 1);
  } else if (kind === 'cube') {
    // rounded gummy cube via beveled extrude
    const s = 1.3, cr = 0.22;
    const sq = new THREE.Shape();
    sq.moveTo(-s / 2 + cr, -s / 2);
    sq.lineTo(s / 2 - cr, -s / 2);
    sq.quadraticCurveTo(s / 2, -s / 2, s / 2, -s / 2 + cr);
    sq.lineTo(s / 2, s / 2 - cr);
    sq.quadraticCurveTo(s / 2, s / 2, s / 2 - cr, s / 2);
    sq.lineTo(-s / 2 + cr, s / 2);
    sq.quadraticCurveTo(-s / 2, s / 2, -s / 2, s / 2 - cr);
    sq.lineTo(-s / 2, -s / 2 + cr);
    sq.quadraticCurveTo(-s / 2, -s / 2, -s / 2 + cr, -s / 2);
    geo = new THREE.ExtrudeGeometry(sq, {
      depth: s * 0.6, bevelEnabled: true, bevelThickness: s * 0.2,
      bevelSize: s * 0.16, bevelSegments: bevSeg, curveSegments: 10,
    });
  } else {
    const shapes = makeGummyShape(kind);
    const extrudeOne = (sh, depthScale) => new THREE.ExtrudeGeometry(sh, {
      depth: 0.42 * depthScale, bevelEnabled: true, bevelThickness: 0.17,
      bevelSize: 0.15, bevelSegments: bevSeg, curveSegments: seg,
    });
    if (Array.isArray(shapes)) {
      // stagger part depths a touch — overlapping caps would z-fight
      geo = mergeGeos(shapes.map((sh, i) => {
        const g = extrudeOne(sh, 1 + (i % 3) * 0.07);
        g.translate(0, 0, -0.42 * ((i % 3) * 0.07) / 2);
        return g;
      }));
    } else {
      geo = extrudeOne(shapes, 1);
    }
  }
  geo.center();
  geo.computeBoundingSphere();
  const r = (geo.boundingSphere && geo.boundingSphere.radius) || 1;
  geo.scale(1 / r, 1 / r, 1 / r);
  return geo;
};

// sRGB hex → linear working space. Material colors are fed raw to the
// shader while the renderer outputs sRGB — without this conversion every
// saturated flavor color washes out to pastel.
const linCol = (col) => (col.isColor ? col.clone() : new THREE.Color(col)).convertSRGBToLinear();

// Solid chocolate — matte cocoa body with a soft tempered-shine coat.
// Used for advent-calendar pieces when the fill is set to chocolate.
const makeChocolateMaterial = () => {
  const cocoa = linCol(new THREE.Color('#452a16'));
  const mat = new THREE.MeshPhysicalMaterial({
    color: cocoa,
    roughness: 0.36,
    metalness: 0,
    clearcoat: 0.5,
    clearcoatRoughness: 0.28,
    emissive: cocoa,
    emissiveIntensity: 0.03,
  });
  mat.envMapIntensity = 0.45;
  return mat;
};

const makeGummyMaterial = (col, opts = {}) => {
  const cLin = linCol(col);
  const base = cLin.clone().multiplyScalar(0.85);
  // Candy-glass look: low roughness + strong clearcoat + a touch of
  // transmission so pieces read wet-glossy like real gummies.
  const mat = new THREE.MeshPhysicalMaterial({
    color: base,
    roughness: 0.12,
    metalness: 0,
    transmission: opts.transmission ?? 0.16,
    transparent: true,
    opacity: 1,
    ior: 1.42,
    thickness: opts.thickness ?? 0.7,
    clearcoat: 0.9,
    clearcoatRoughness: 0.06,
    attenuationColor: cLin,
    attenuationDistance: 0.45,
    emissive: cLin,
    emissiveIntensity: opts.emissive ?? 0.05,
  });
  mat.envMapIntensity = 0.55;
  return mat;
};

// Shared title typefaces — one map for every printed surface so the
// typo-style picker behaves identically on label, film and bar wrap.
// System stacks keep this working without extra font loads.
const titleFontFor = (typoStyle, size) => {
  const fonts = {
    // standards
    editorial: `italic ${size}px "Kreol Standard", "Georgia", serif`,
    serif:     `600 ${size}px "Georgia", "Times New Roman", serif`,
    mono:      `700 ${Math.round(size * 0.92)}px "Neue Rational Mono", monospace`,
    clean:     `400 ${Math.round(size * 0.92)}px "Neue Rational Mono", monospace`,
    // character faces (named for their vibe, not their family)
    razor:     `800 ${Math.round(size * 0.95)}px "PP Kyoto", "Arial Black", sans-serif`,
    botanic:   `500 ${size}px "PP Pangaia", "Georgia", serif`,
    gallery:   `600 ${size}px "PP Museum", "Georgia", serif`,
    velvet:    `900 ${Math.round(size * 0.95)}px "Aretha", "Georgia", serif`,
    fruity:    `400 ${Math.round(size * 1.05)}px "Fruitos", "Snell Roundhand", cursive`,
    bubble:    `400 ${size}px "BubbleLock", "Arial Black", sans-serif`,
    puffy:     `400 ${size}px "Rogly", "Arial Black", sans-serif`,
    // legacy ids from older saved configs
    display:   `900 ${Math.round(size * 0.95)}px "Arial Black", "Impact", sans-serif`,
    condensed: `700 ${Math.round(size * 0.98)}px "Arial Narrow", "Helvetica Neue", sans-serif`,
    script:    `italic 700 ${size}px "Snell Roundhand", "Brush Script MT", cursive`,
  };
  return fonts[typoStyle] || fonts.editorial;
};

// Title casing + size controls from the branding step
const titleTextFor = (cfg, name) => {
  const mode = (cfg && cfg.titleCase) || 'upper';
  if (mode === 'lower') return name.toLowerCase();
  if (mode === 'typed') return name;
  return name.toUpperCase();
};
const titleScaleFor = (cfg) => {
  const s = cfg && cfg.titleScale;
  return (typeof s === 'number' && s > 0) ? s : 1;
};

// ───────────────────────────────────────────────────────────────────
// Label canvas generator — draws artwork at the EXACT aspect ratio of
// the physical label, so it never gets stretched when wrapped around
// a cylinder or applied to a plane. Call with world-unit dimensions:
// for curved labels, widthUnits = arcLength (radius × thetaLength).
// ───────────────────────────────────────────────────────────────────
const drawLabelCanvas = (cfg, pack, widthUnits, heightUnits, opts) => {
  // Fixed pixel density so small labels stay legible
  const PX_PER_UNIT = 420;
  const w = Math.max(256, Math.round(widthUnits * PX_PER_UNIT));
  const h = Math.max(256, Math.round(heightUnits * PX_PER_UNIT));

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  const accent = cfg?.color || '#c85250';
  const name = titleTextFor(cfg, cfg?.name || 'your product name here');
  const handle = ((cfg && cfg.handle) || '').trim();
  // When an AI background is in play, this canvas is the TYPO LAYER ONLY:
  // transparent base + a soft legibility scrim so text stays readable on
  // any image. Otherwise it's the full opaque paper label.
  const transparent = !!(opts && opts.transparent);
  const typoStyle = (cfg && cfg.typoStyle) || 'editorial';

  // Use the SMALLER dimension for type scaling so labels read well on
  // wide thin bands (tin) AND narrow tall strips (tube).
  const base = Math.min(w, h);

  if (!transparent) {
    // Paper base — warm cream, apothecary-style (never pure white)
    ctx.fillStyle = '#fffef2';
    ctx.fillRect(0, 0, w, h);
  } else {
    // Legibility scrim over the AI image — light wash top & bottom, clearer middle
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, 'rgba(255,254,242,0.55)');
    g.addColorStop(0.32, 'rgba(255,254,242,0.12)');
    g.addColorStop(0.7, 'rgba(255,254,242,0.12)');
    g.addColorStop(1, 'rgba(255,254,242,0.62)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // User-controlled overlay between AI bg and typo (tone + opacity)
    const ovTone = (cfg && cfg.overlayTone) || 'none';
    const ovOp = (cfg && typeof cfg.overlayOpacity === 'number') ? cfg.overlayOpacity : 0;
    if (ovTone !== 'none' && ovOp > 0) {
      ctx.fillStyle = ovTone === 'dark'
        ? `rgba(22,20,15,${ovOp})`
        : `rgba(255,254,242,${ovOp})`;
      ctx.fillRect(0, 0, w, h);
    }
  }

  // ── Apothecary layout — centered, hairlines instead of bands, one
  //    quiet accent moment. Inspired by print label typography: warm
  //    graphite ink on cream, generous whitespace, no barcode chrome.
  const pad = Math.round(w * 0.055);
  const ink = (cfg && cfg.typoColor) || '#333333';
  const cx = w / 2;

  // Hairline frame inset — the "inked-on-paper" border
  ctx.strokeStyle = ink;
  ctx.globalAlpha = transparent ? 0.55 : 0.9;
  ctx.lineWidth = Math.max(1.5, Math.round(base * 0.006));
  ctx.strokeRect(pad * 0.55, pad * 0.55, w - pad * 1.1, h - pad * 1.1);
  ctx.globalAlpha = 1;

  // Layout variants: nuts jar puts the logo top-LEFT with a more
  // centered title; the hard-candy tin drops the on-label brand entirely
  // (the logo prints on the lid instead) and runs the name bigger.
  const isNuts = (cfg && cfg.base) === 'nuts';
  const isTin = pack === 'tin';

  // Brand — uploaded logo (re-inked) or the FOODCIETY wordmark
  const logoImg = cfg && cfg._logoImage;
  const brandCY = Math.round(h * 0.13);
  if (!isTin) {
    if (logoImg && logoImg.width) {
      const maxLH = h * 0.085, maxLW = w * 0.42;
      const ar = logoImg.width / logoImg.height;
      let lh = maxLH, lw = lh * ar;
      if (lw > maxLW) { lw = maxLW; lh = lw / ar; }
      const off = document.createElement('canvas');
      off.width = Math.max(2, Math.round(lw * 2));
      off.height = Math.max(2, Math.round(lh * 2));
      const octx = off.getContext('2d');
      octx.drawImage(logoImg, 0, 0, off.width, off.height);
      octx.globalCompositeOperation = 'source-in';
      octx.fillStyle = ink;
      octx.fillRect(0, 0, off.width, off.height);
      const lx = isNuts ? pad * 1.3 : cx - lw / 2;
      ctx.drawImage(off, lx, brandCY - lh / 2, lw, lh);
    } else {
      ctx.fillStyle = ink;
      ctx.textAlign = isNuts ? 'left' : 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `500 ${Math.round(base * 0.05)}px "Neue Rational Mono", monospace`;
      try { ctx.letterSpacing = `${Math.round(base * 0.016)}px`; } catch (e) {}
      ctx.fillText('F O O D C I E T Y', isNuts ? pad * 1.3 : cx, brandCY);
      try { ctx.letterSpacing = '0px'; } catch (e) {}
      ctx.textAlign = 'left';
    }
  }

  // Product name — the single expressive moment, centered
  ctx.fillStyle = ink;
  ctx.textAlign = 'center';
  const titleSize = Math.round(base * (isTin ? 0.27 : 0.205) * titleScaleFor(cfg));
  ctx.font = titleFontFor(typoStyle, titleSize);
  const maxW = w - pad * 2.6;
  const words = name.split(' ');
  const lines = [];
  let cur = '';
  for (const word of words) {
    const test = cur ? cur + ' ' + word : word;
    if (ctx.measureText(test).width > maxW && cur) {
      lines.push(cur);
      cur = word;
    } else {
      cur = test;
    }
  }
  if (cur) lines.push(cur);
  const lineH = titleSize * 0.98;
  const blockH = lines.length * lineH;
  const areaCenter = h * (isTin ? 0.42 : (isNuts ? 0.48 : 0.44));
  ctx.textBaseline = 'middle';
  ctx.save();
  if (transparent) {
    // light shadow only when type sits on artwork
    ctx.shadowColor = 'rgba(0,0,0,0.18)';
    ctx.shadowBlur = Math.round(base * 0.02);
    ctx.shadowOffsetY = Math.round(base * 0.005);
  }
  lines.forEach((line, i) => {
    const y = areaCenter - blockH / 2 + lineH / 2 + i * lineH;
    ctx.fillText(line, cx, y);
  });
  ctx.restore();

  // Short centered hairline under the name
  const ruleY = Math.round(areaCenter + blockH / 2 + h * 0.05);
  ctx.strokeStyle = ink;
  ctx.globalAlpha = 0.85;
  ctx.lineWidth = Math.max(1.5, Math.round(base * 0.005));
  ctx.beginPath();
  ctx.moveTo(cx - w * 0.11, ruleY);
  ctx.lineTo(cx + w * 0.11, ruleY);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Flavor — small tracked caption, centered
  ctx.fillStyle = ink;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `500 ${Math.round(base * 0.05)}px "Neue Rational Mono", monospace`;
  try { ctx.letterSpacing = `${Math.round(base * 0.012)}px`; } catch (e) {}
  ctx.globalAlpha = 0.75;
  ctx.fillText((cfg?.flavor || '').replace('-', ' ').toUpperCase(), cx, ruleY + h * 0.055);
  ctx.globalAlpha = 1;
  try { ctx.letterSpacing = '0px'; } catch (e) {}

  // Functional benefit — prints when one is picked
  if (cfg && cfg.func && cfg.func !== 'none' && cfg.funcLabel) {
    ctx.globalAlpha = 0.7;
    ctx.font = `400 ${Math.round(base * 0.042)}px "Neue Rational Mono", monospace`;
    const fnTxt = (cfg.funcLabel + (cfg.funcActives ? ' · ' + cfg.funcActives : '')).toLowerCase();
    ctx.fillText(fnTxt, cx, ruleY + h * 0.1);
    ctx.globalAlpha = 1;
  }
  ctx.textAlign = 'left';

  // One quiet accent moment — a small centered square in the candy color
  ctx.fillStyle = accent;
  const dotS = Math.max(4, Math.round(base * 0.022));
  ctx.fillRect(cx - dotS / 2, Math.round(h * 0.795) - dotS / 2, dotS, dotS);

  // Bottom row — creator name left (optional), weight right
  ctx.fillStyle = ink;
  ctx.textBaseline = 'middle';
  ctx.font = `400 ${Math.round(base * 0.045)}px "Neue Rational Mono", monospace`;
  const rowY = h - pad * 0.55 - Math.round(h * 0.055);
  ctx.globalAlpha = 0.85;
  if (handle) {
    ctx.textAlign = 'left';
    ctx.fillText(handle, pad * 1.4, rowY);
  }
  ctx.textAlign = 'right';
  ctx.fillText(`${cfg?.weight || 120} G`, w - pad * 1.4, rowY);
  ctx.globalAlpha = 1;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  tex.anisotropy = 8;
  if (THREE.sRGBEncoding) tex.encoding = THREE.sRGBEncoding;
  return tex;
};

// ───────────────────────────────────────────────────────────────────
// Film print for the doypack — the design is printed straight onto the
// pouch film (like the What-The-Gummies bag): full-bleed pack color,
// big knocked-out typography, no paper-label frame.
// ───────────────────────────────────────────────────────────────────
const relLuminance = (hex) => {
  const c = new THREE.Color(hex);
  return 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b;
};

const drawFilmCanvas = (cfg, widthUnits, heightUnits, opts) => {
  const PX_PER_UNIT = 420;
  const w = Math.max(256, Math.round(widthUnits * PX_PER_UNIT));
  const h = Math.max(256, Math.round(heightUnits * PX_PER_UNIT));
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');

  // transparent = decal mode: the pouch body itself carries the pack
  // color, so only the printed elements are drawn (alpha background).
  const transparent = !!(opts && opts.transparent);
  const packColor = cfg?.packColor || '#2f6b3f';
  const lightFilm = relLuminance(packColor) > 0.55;
  const ink = cfg?.typoColor || (lightFilm ? '#16140f' : '#fffef2');
  const name = (cfg?.name || 'your product name here');
  const handle = ((cfg && cfg.handle) || '').trim();
  const pad = Math.round(w * 0.075);

  // Draw the artwork full-bleed and melt its edges into the pack color —
  // shared by decal mode (alpha fade → tinted pouch shows through) and
  // printed film (opaque pack-color gradient).
  const drawCover = (img) => {
    const iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
    const ar = iw / ih, tar = w / h;
    let dw = w, dh = h, dx = 0, dy = 0;
    if (ar > tar) { dw = h * ar; dx = (w - dw) / 2; } else { dh = w / ar; dy = (h - dh) / 2; }
    ctx.drawImage(img, dx, dy, dw, dh);
  };
  const applyOverlayFull = () => {
    const ovTone = (cfg && cfg.overlayTone) || 'none';
    const ovOp = (cfg && typeof cfg.overlayOpacity === 'number') ? cfg.overlayOpacity : 0;
    if (ovTone !== 'none' && ovOp > 0) {
      ctx.fillStyle = ovTone === 'dark' ? `rgba(22,20,15,${ovOp})` : `rgba(255,254,242,${ovOp})`;
      ctx.fillRect(0, 0, w, h);
    }
  };
  // Edge melt: fade each side over ~16% of the surface
  const fadeEdges = (mode) => {
    const fx = Math.round(w * 0.16), fy = Math.round(h * 0.14);
    const edges = [
      [0, 0, fx, h, 'x', 0, fx],           // left
      [w - fx, 0, fx, h, 'x', w, w - fx],  // right
      [0, 0, w, fy, 'y', 0, fy],           // top
      [0, h - fy, w, fy, 'y', h, h - fy],  // bottom
    ];
    ctx.save();
    if (mode === 'alpha') ctx.globalCompositeOperation = 'destination-out';
    for (const [ex, ey, ew, eh, axis, from, to] of edges) {
      const g = axis === 'x'
        ? ctx.createLinearGradient(from, 0, to, 0)
        : ctx.createLinearGradient(0, from, 0, to);
      if (mode === 'alpha') {
        g.addColorStop(0, 'rgba(0,0,0,1)');
        g.addColorStop(1, 'rgba(0,0,0,0)');
      } else {
        const c = new THREE.Color(packColor);
        const hex = c.getStyle().replace('rgb(', '').replace(')', '');
        g.addColorStop(0, `rgba(${hex},1)`);
        g.addColorStop(1, `rgba(${hex},0)`);
      }
      ctx.fillStyle = g;
      ctx.fillRect(ex, ey, ew, eh);
    }
    ctx.restore();
  };

  if (transparent) {
    // Decal mode: artwork covers the whole front, edges alpha-fade so
    // the tinted crinkled film takes over toward the seams.
    if (cfg && cfg._bgImage) {
      drawCover(cfg._bgImage);
      applyOverlayFull();
      fadeEdges('alpha');
    }
  } else if (cfg && cfg._bgImage) {
    drawCover(cfg._bgImage);
    // light pack-color wash keeps it reading as printed film
    ctx.fillStyle = packColor;
    ctx.globalAlpha = 0.16;
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = 1;
    applyOverlayFull();
    fadeEdges('color');
  } else {
    ctx.globalAlpha = 0.93;
    ctx.fillStyle = packColor;
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = 1;
    // subtle vertical sheen so the print doesn't look flat
    const g = ctx.createLinearGradient(0, 0, w, 0);
    g.addColorStop(0, 'rgba(255,255,255,0.0)');
    g.addColorStop(0.28, 'rgba(255,255,255,0.07)');
    g.addColorStop(0.55, 'rgba(255,255,255,0.0)');
    g.addColorStop(1, 'rgba(0,0,0,0.10)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }

  // User-controlled overlay BETWEEN background and type — on plain film
  // only; artwork paths applied it above already.
  if (!transparent && !(cfg && cfg._bgImage)) {
    const ovTone = (cfg && cfg.overlayTone) || 'none';
    const ovOp = (cfg && typeof cfg.overlayOpacity === 'number') ? cfg.overlayOpacity : 0;
    if (ovTone !== 'none' && ovOp > 0) {
      ctx.fillStyle = ovTone === 'dark'
        ? `rgba(22,20,15,${ovOp})`
        : `rgba(255,254,242,${ovOp})`;
      ctx.fillRect(0, 0, w, h);
    }
  }

  // Brand row — logo (knocked out to ink color) or FOOFAB wordmark
  const logoImg = cfg && cfg._logoImage;
  const brandY = Math.round(h * 0.055);
  if (logoImg && logoImg.width) {
    const maxLH = h * 0.06, maxLW = w * 0.42;
    const ar = logoImg.width / logoImg.height;
    let lh = maxLH, lw = lh * ar;
    if (lw > maxLW) { lw = maxLW; lh = lw / ar; }
    const off = document.createElement('canvas');
    off.width = Math.max(2, Math.round(lw * 2));
    off.height = Math.max(2, Math.round(lh * 2));
    const octx = off.getContext('2d');
    octx.drawImage(logoImg, 0, 0, off.width, off.height);
    octx.globalCompositeOperation = 'source-in';
    octx.fillStyle = ink;
    octx.fillRect(0, 0, off.width, off.height);
    ctx.drawImage(off, pad, brandY, lw, lh);
  } else {
    ctx.fillStyle = ink;
    ctx.font = `700 ${Math.round(w * 0.05)}px "Neue Rational Mono", monospace`;
    ctx.textBaseline = 'top';
    ctx.fillText('FOODCIETY', pad, brandY);
  }
  // Big stacked title — WTG-style chunky uppercase block.
  // The typo-style picker switches the typeface here too; the mono
  // default keeps the original WTG look.
  const filmStyle = (cfg && cfg.typoStyle) || 'mono';
  const filmFont = (s) => filmStyle === 'mono' || filmStyle === 'clean'
    ? `800 ${s}px "Neue Rational Mono", "Arial Black", monospace`
    : titleFontFor(filmStyle, s);
  const title = titleTextFor(cfg, name);
  const maxW = w - pad * 2;
  let size = Math.round(w * 0.17 * titleScaleFor(cfg));
  ctx.textBaseline = 'alphabetic';
  const measure = (t, s) => {
    ctx.font = filmFont(s);
    return ctx.measureText(t).width;
  };
  // wrap words; shrink until it fits in ~4 lines AND inside the title
  // zone (so long names never collide with the bottom block)
  let lines = [];
  for (; size > w * 0.07; size -= 4) {
    lines = [];
    let cur = '';
    for (const word of title.split(/\s+/)) {
      const test = cur ? cur + ' ' + word : word;
      if (measure(test, size) > maxW && cur) { lines.push(cur); cur = word; }
      else cur = test;
    }
    if (cur) lines.push(cur);
    if (lines.length <= 4 &&
        lines.every(l => measure(l, size) <= maxW) &&
        lines.length * size * 1.04 <= h * 0.46) break;
  }
  ctx.font = filmFont(size);
  ctx.fillStyle = ink;
  const lineH = size * 0.94;
  let ty = Math.round(h * 0.155) + size;
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.22)';
  ctx.shadowBlur = Math.round(w * 0.012);
  ctx.shadowOffsetY = Math.round(w * 0.004);
  for (const line of lines) {
    ctx.fillText(line, pad, ty);
    ty += lineH;
  }
  ctx.restore();

  // Flavor subline under the title block
  const flavorTxt = ((cfg?.flavorDe || cfg?.flavor || '') + '').toLowerCase();
  ctx.globalAlpha = 0.85;
  ctx.font = `500 ${Math.round(w * 0.042)}px "Neue Rational Mono", monospace`;
  ctx.fillText(`saure fruchtgummis · ${flavorTxt}`, pad, ty + Math.round(h * 0.012));
  ctx.globalAlpha = 1;

  // Functional benefit line
  if (cfg && cfg.func && cfg.func !== 'none' && cfg.funcLabel) {
    ctx.globalAlpha = 0.75;
    ctx.font = `500 ${Math.round(w * 0.036)}px "Neue Rational Mono", monospace`;
    ctx.fillText((cfg.funcLabel + (cfg.funcActives ? ' · ' + cfg.funcActives : '')).toLowerCase(),
      pad, ty + Math.round(h * 0.052));
    ctx.globalAlpha = 1;
  }

  // Bottom block: divider, handle, weight, edition note
  const divY = Math.round(h * 0.855);
  ctx.strokeStyle = ink;
  ctx.globalAlpha = 0.7;
  ctx.lineWidth = Math.max(2, Math.round(h * 0.003));
  ctx.beginPath(); ctx.moveTo(pad, divY); ctx.lineTo(w - pad, divY); ctx.stroke();
  ctx.globalAlpha = 1;

  ctx.fillStyle = ink;
  ctx.font = `700 ${Math.round(w * 0.045)}px "Neue Rational Mono", monospace`;
  ctx.textBaseline = 'top';
  if (handle) ctx.fillText(handle, pad, divY + Math.round(h * 0.02));
  ctx.textAlign = 'right';
  ctx.fillText(`${cfg?.weight || 120}G`, w - pad, divY + Math.round(h * 0.02));
  ctx.textAlign = 'left';

  ctx.globalAlpha = 0.6;
  ctx.font = `italic 300 ${Math.round(w * 0.03)}px "Kreol Standard", "Georgia", serif`;
  ctx.fillText('foodciety edition', pad, divY + Math.round(h * 0.065));
  ctx.globalAlpha = 1;

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  tex.anisotropy = 8;
  if (THREE.sRGBEncoding) tex.encoding = THREE.sRGBEncoding;
  return tex;
};

// Fine vertical ridge texture — crimp seals, knurled lids, ribbed caps
const makeRidgeTexture = (packColor, repeatX = 6) => {
  const c = document.createElement('canvas');
  c.width = 128; c.height = 32;
  const ctx = c.getContext('2d');
  const base = new THREE.Color(packColor);
  const dark = base.clone().multiplyScalar(0.62);
  const light = base.clone().lerp(new THREE.Color('#ffffff'), 0.22);
  for (let x = 0; x < 128; x += 8) {
    ctx.fillStyle = '#' + dark.getHexString();
    ctx.fillRect(x, 0, 4, 32);
    ctx.fillStyle = '#' + light.getHexString();
    ctx.fillRect(x + 4, 0, 4, 32);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.repeat.x = repeatX;
  if (THREE.sRGBEncoding) tex.encoding = THREE.sRGBEncoding;
  return tex;
};
const makeCrimpTexture = (packColor) => makeRidgeTexture(packColor, 6);

// ───────────────────────────────────────────────────────────────────
// Procedural pack builders
// ───────────────────────────────────────────────────────────────────
// Tints derived from the SELECTED packaging color — the chosen color is
// applied saturated (not washed out) so picking a color visibly changes
// the pack.
const PACK_TINTS = (packColor) => {
  const a = linCol(packColor);
  return {
    body:  a.clone().lerp(linCol(new THREE.Color(0xf0ebdc)), 0.10), // near-full pack color
    soft:  a.clone().lerp(linCol(new THREE.Color(0xf0ebdc)), 0.45),
    deep:  a.clone().multiplyScalar(0.55),
    metal: a.clone().lerp(linCol(new THREE.Color(0xe8e5dc)), 0.35),
    cap:   a.clone().multiplyScalar(0.4).lerp(linCol(new THREE.Color(0x16140f)), 0.35),
    dark:  linCol(new THREE.Color(0x16140f)),
  };
};

const stdMat = (color, { rough = 0.8, metal = 0.05 } = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });

// ───────────────────────────────────────────────────────────────────
// Nut pieces — for the nuts base the floating objects are matte nuts,
// not glossy gummies.
// ───────────────────────────────────────────────────────────────────
const NUT_COLORS = ['#a9723d', '#8a5a2e', '#c08a52', '#7a4b26'];

const makeNutGeometry = (variant = 0) => {
  let geo;
  if (variant % 2 === 0) {
    // almond: pointed ellipsoid
    geo = new THREE.SphereGeometry(1, 28, 20);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const pinch = y > 0 ? 1 - y * 0.35 : 1;      // taper toward the tip
      pos.setX(i, pos.getX(i) * 0.62 * pinch);
      pos.setZ(i, pos.getZ(i) * 0.5 * pinch);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
  } else {
    // hazelnut: sphere with a flattened base
    geo = new THREE.SphereGeometry(1, 28, 20);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      if (y < -0.55) pos.setY(i, -0.55 - (y + 0.55) * 0.25);
      pos.setX(i, pos.getX(i) * 0.88);
      pos.setZ(i, pos.getZ(i) * 0.85);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
  }
  geo.computeBoundingSphere();
  const r = (geo.boundingSphere && geo.boundingSphere.radius) || 1;
  geo.scale(1 / r, 1 / r, 1 / r);
  return geo;
};

const makeNutMaterial = (i = 0) => {
  const mat = new THREE.MeshStandardMaterial({
    color: linCol(NUT_COLORS[i % NUT_COLORS.length]),
    roughness: 0.72,
    metalness: 0.02,
  });
  mat.envMapIntensity = 0.25;
  return mat;
};

// Which floating-piece style a config uses
const floaterStyleFor = (cfg) => {
  const base = (cfg && cfg.base) || 'gummies';
  if (base === 'chocolate bars') return 'none';
  if (base === 'nuts') return 'nuts';
  return 'gummy';
};

// ───────────────────────────────────────────────────────────────────
// Airy piece distribution inside a cylinder volume (used for the jar).
// Vertical stratification + min-distance rejection — no clumping.
// ───────────────────────────────────────────────────────────────────
const spreadPositions = (count, radius, halfH, minDist) => {
  const rnd = (i, n) => {
    const x = Math.sin(i * 127.1 + n * 311.7) * 43758.5453;
    return x - Math.floor(x);
  };
  const pts = [];
  for (let i = 0; i < count; i++) {
    let best = null;
    for (let t = 0; t < 26; t++) {
      const band = (i + 0.5) / count;
      const y = (-1 + 2 * band) * halfH + (rnd(i, t * 3 + 1) - 0.5) * (2.4 * halfH / count);
      const ang = rnd(i, t * 3 + 2) * Math.PI * 2;
      const rad = Math.sqrt(rnd(i, t * 3 + 3)) * radius;
      const x = Math.cos(ang) * rad, z = Math.sin(ang) * rad;
      let dmin = Infinity;
      for (const p of pts) {
        const d = Math.hypot(p.x - x, p.y - y, p.z - z);
        if (d < dmin) dmin = d;
      }
      if (dmin >= minDist) { best = { x, y, z }; break; }
      if (!best || dmin > best._d) best = { x, y, z, _d: dmin };
    }
    pts.push(best);
  }
  return pts;
};

// Fill floating pieces INSIDE the jar glass — gummies or nuts by base.
const makeJarFill = (cfg, radius, halfH) => {
  const g = new THREE.Group();
  const rnd = (i, n) => {
    const x = Math.sin(i * 269.5 + n * 183.3) * 43758.5453;
    return x - Math.floor(x);
  };
  const style = floaterStyleFor(cfg) === 'nuts' ? 'nuts' : 'gummy';
  const base = new THREE.Color(gummyColorFor(cfg));
  const palette = [
    base,
    base.clone().offsetHSL(0.03, 0.05, 0.04),
    base.clone().offsetHSL(-0.025, -0.03, -0.04),
    base.clone().offsetHSL(0.015, -0.04, 0.07),
  ];
  const gummyGeo = style === 'gummy' ? makeGummyGeometry(gummyKindFor(cfg), 'low') : null;
  const positions = spreadPositions(14, radius, halfH, 0.52);
  positions.forEach((p, i) => {
    const s = 0.23 * (0.85 + rnd(i, 5.1) * 0.35);
    let m;
    if (style === 'nuts') {
      m = new THREE.Mesh(makeNutGeometry(i), makeNutMaterial(i));
    } else {
      const col = palette[Math.floor(rnd(i, 4.2) * palette.length) % palette.length];
      m = new THREE.Mesh(gummyGeo, makeGummyMaterial(col, { thickness: 0.7 }));
    }
    m.position.set(p.x, p.y, p.z);
    m.scale.setScalar(s);
    m.rotation.set(rnd(i, 7.2) * Math.PI * 2, rnd(i, 8.4) * Math.PI * 2, rnd(i, 9.6) * Math.PI * 2);
    m.castShadow = true;
    m.userData.floatAmp = 0.02;
    m.userData.floatSpeed = 0.45 + rnd(i, 3.3) * 0.3;
    m.userData.floatPhase = rnd(i, 6.6) * Math.PI * 2;
    m.userData.baseY = p.y;
    g.add(m);
  });
  return g;
};

// ── Doypack / pouch ─────────────────────────────────────────────
// Modeled on the reference bag: vertical pillow pouch with serrated
// crimp seals top + bottom, puffy film body, print directly on the
// film in the selected packaging color.
const POUCH_W = 3.0, POUCH_H = 3.9, POUCH_D = 1.18;
const pouchPuff = (t) => 0.08 + 0.92 * Math.pow(Math.cos(Math.max(-1, Math.min(1, t)) * Math.PI / 2), 0.62);
const pouchWidth = (t) => 1 - 0.075 * Math.pow(Math.abs(t), 2.6);

const buildPouch = (cfg) => {
  // Scanned crinkled pouch when the GLB is ready — procedural fallback
  if (cfg && cfg._pouchScene) {
    try { return buildPouchFromGLB(cfg, cfg._pouchScene); } catch (e) { /* fall through */ }
  }
  const group = new THREE.Group();
  const packColor = cfg?.packColor || '#2f6b3f';
  const tints = PACK_TINTS(packColor);

  const w = POUCH_W, h = POUCH_H, d = POUCH_D;
  const r = 0.16;

  // Rounded-rect outline (crimp-to-crimp), extruded then pinched
  const shape = new THREE.Shape();
  shape.moveTo(-w / 2 + r, -h / 2);
  shape.lineTo(w / 2 - r, -h / 2);
  shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  shape.lineTo(w / 2, h / 2 - r);
  shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
  shape.lineTo(-w / 2 + r, h / 2);
  shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
  shape.lineTo(-w / 2, -h / 2 + r);
  shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: d * 0.62,
    bevelEnabled: true,
    bevelThickness: d * 0.19,
    bevelSize: 0.1,
    bevelSegments: 6,
    curveSegments: 20,
    steps: 2,
  });
  geo.translate(0, 0, -d * 0.31);
  // Pinch the film toward the seals: depth → fin at top/bottom, puffy
  // in the middle; width tapers slightly toward the crimps.
  {
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const t = Math.max(-1, Math.min(1, y / (h / 2)));
      pos.setZ(i, pos.getZ(i) * pouchPuff(t));
      pos.setX(i, pos.getX(i) * pouchWidth(t));
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
  }

  // Matte, near-opaque printed film like the reference bag — just a hint
  // of sheen so it still reads as foil.
  const film = new THREE.MeshPhysicalMaterial({
    color: linCol(packColor),
    roughness: 0.55,
    metalness: 0.0,
    transmission: 0.08,
    transparent: true,
    opacity: 0.985,
    ior: 1.35,
    clearcoat: 0.3,
    clearcoatRoughness: 0.55,
    side: THREE.DoubleSide,
  });
  const body = new THREE.Mesh(geo, film);
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  // Serrated crimp seals top + bottom
  const crimpTex = makeCrimpTexture(packColor);
  const crimpMat = new THREE.MeshStandardMaterial({
    map: crimpTex, roughness: 0.75, metalness: 0.08,
  });
  const mkCrimp = (yPos) => {
    const cg = new THREE.BoxGeometry(w * 0.945, 0.34, 0.11);
    const crimp = new THREE.Mesh(cg, crimpMat);
    crimp.position.y = yPos;
    crimp.castShadow = true;
    return crimp;
  };
  group.add(mkCrimp(h / 2 - 0.11));
  group.add(mkCrimp(-h / 2 + 0.11));

  // Front print — drawn straight on the film, following its curvature in
  // BOTH axes so it hugs the bag (no floating flap at the sides), running
  // full-bleed from crimp to crimp like the reference bag
  {
    const pw = w * 0.94, ph = h * 0.86;
    const printGeo = new THREE.PlaneGeometry(pw, ph, 24, 36);
    const pos = printGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const t = Math.max(-1, Math.min(1, y / (h / 2)));
      const xn = Math.max(-1, Math.min(1, x / (pw / 2)));
      // fall off toward the side seals so the print edge meets the film
      const xProf = 1 - 0.45 * Math.pow(Math.abs(xn), 5);
      pos.setZ(i, (d / 2) * pouchPuff(t) * xProf + 0.012);
      pos.setX(i, x * pouchWidth(t));
    }
    pos.needsUpdate = true;
    printGeo.computeVertexNormals();
    const tex = drawFilmCanvas(cfg, pw, ph);
    const printMat = new THREE.MeshStandardMaterial({
      map: tex, roughness: 0.5, metalness: 0.02,
      transparent: true, side: THREE.FrontSide,
    });
    const print = new THREE.Mesh(printGeo, printMat);
    group.add(print);
  }

  return group;
};

// ── Jar ─────────────────────────────────────────────────────────
// Realistic candy jar: lathed glass body (rounded base, straight wall,
// shoulder + short neck), knurled metal lid in the pack color.
const buildJar = (cfg) => {
  const group = new THREE.Group();
  const packColor = cfg?.packColor || cfg?.color || '#c85250';
  const tints = PACK_TINTS(packColor);

  const bodyR = 1.25, bodyH = 2.8;
  const neckR = bodyR * 0.82;
  const capR = neckR * 1.08, capH = 0.42;

  // Glass profile — LatheGeometry, y measured from jar center
  const P = (r, y) => new THREE.Vector2(r, y);
  const profile = [
    P(0.001, -bodyH / 2),
    P(bodyR * 0.55, -bodyH / 2),
    P(bodyR * 0.92, -bodyH / 2 + 0.06),
    P(bodyR, -bodyH / 2 + 0.3),          // rounded base corner
    P(bodyR, bodyH / 2 - 0.52),          // straight wall
    P(bodyR * 0.97, bodyH / 2 - 0.36),
    P(neckR * 1.04, bodyH / 2 - 0.18),   // shoulder
    P(neckR, bodyH / 2 - 0.1),
    P(neckR, bodyH / 2),                 // neck
  ];
  // Pieces float INSIDE the glass (gummies or nuts, depending on base).
  // Hidden until the shape step — cfg._pieces gates all candy pieces.
  if (cfg._pieces !== false) {
    const fill = makeJarFill(cfg, bodyR * 0.66, bodyH * 0.36);
    fill.position.y = -bodyH * 0.04;
    group.add(fill);
  }

  const bodyGeo = new THREE.LatheGeometry(profile, 72);
  // Real glass look: high transmission, near-zero roughness, strong
  // clearcoat + env reflections.
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: linCol(new THREE.Color(0xf8f6ef)),
    roughness: 0.04,
    metalness: 0,
    transmission: 0.92,
    transparent: true,
    opacity: 0.5,
    ior: 1.5,
    thickness: 0.35,
    clearcoat: 1,
    clearcoatRoughness: 0.04,
    side: THREE.DoubleSide,
  });
  glassMat.envMapIntensity = 1.1;
  const body = new THREE.Mesh(bodyGeo, glassMat);
  body.castShadow = true;
  group.add(body);

  // Knurled lid — ridged side + flat colored top with a soft dome
  const ridgeTex = makeRidgeTexture(packColor, 24);
  const capSide = new THREE.MeshStandardMaterial({ map: ridgeTex, roughness: 0.5, metalness: 0.35 });
  const capFlat = stdMat(tints.deep, { rough: 0.42, metal: 0.4 });
  const capGeo = new THREE.CylinderGeometry(capR, capR, capH, 72, 1);
  const cap = new THREE.Mesh(capGeo, [capSide, capFlat, capFlat]);
  cap.position.y = bodyH / 2 + capH / 2 - 0.02;
  cap.castShadow = true;
  group.add(cap);

  // Rounded lid edge + slight dome on top
  const capRim = new THREE.Mesh(
    new THREE.TorusGeometry(capR - 0.035, 0.04, 10, 64),
    capFlat
  );
  capRim.position.y = bodyH / 2 + capH - 0.03;
  capRim.rotation.x = Math.PI / 2;
  group.add(capRim);
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(capR - 0.03, 48, 12, 0, Math.PI * 2, 0, Math.PI / 2),
    capFlat
  );
  dome.scale.set(1, 0.12, 1);
  dome.position.y = bodyH / 2 + capH - 0.03;
  group.add(dome);

  // Curved label wrapping the straight wall zone
  const label = buildWraparoundLabel({
    cfg, pack: 'jar',
    radius: bodyR * 1.004,
    height: bodyH * 0.56,
    thetaDeg: 160,
    yOffset: -bodyH * 0.1,
  });
  group.add(label);

  return group;
};

// ── Tin ─────────────────────────────────────────────────────────
// Coated metal tin: rolled bottom rim, overlapping lid with rounded
// edge and a softly domed top — like a classic pastille tin.
const buildTin = (cfg) => {
  const group = new THREE.Group();
  const tints = PACK_TINTS(cfg?.packColor || cfg?.color || '#c85250');

  const r = 1.6, h = 1.1;
  const lidR = r * 1.045, lidH = 0.3;
  const bodyMat = stdMat(tints.body, { rough: 0.34, metal: 0.55 });
  const lidMat = stdMat(tints.deep, { rough: 0.3, metal: 0.6 });

  // Body
  const body = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 96, 1), bodyMat);
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  // Rolled bottom rim
  const baseRim = new THREE.Mesh(new THREE.TorusGeometry(r * 0.99, 0.045, 10, 96), bodyMat);
  baseRim.position.y = -h / 2 + 0.03;
  baseRim.rotation.x = Math.PI / 2;
  group.add(baseRim);

  // Overlapping lid: skirt + rounded edge + gently domed top
  const skirt = new THREE.Mesh(new THREE.CylinderGeometry(lidR, lidR, lidH, 96, 1, true), lidMat);
  skirt.position.y = h / 2 - lidH / 2 + 0.06;
  skirt.castShadow = true;
  group.add(skirt);
  const lidEdge = new THREE.Mesh(new THREE.TorusGeometry(lidR - 0.03, 0.035, 10, 96), lidMat);
  lidEdge.position.y = h / 2 + 0.05;
  lidEdge.rotation.x = Math.PI / 2;
  group.add(lidEdge);
  const lidTop = new THREE.Mesh(
    new THREE.SphereGeometry(lidR - 0.02, 64, 14, 0, Math.PI * 2, 0, Math.PI / 2),
    lidMat
  );
  lidTop.scale.set(1, 0.14, 1);
  lidTop.position.y = h / 2 + 0.05;
  lidTop.castShadow = true;
  group.add(lidTop);

  // Logo printed on the lid (uploaded logo, else foodciety placeholder)
  {
    const brandImg = (cfg && cfg._logoImage && cfg._logoImage.width) ? cfg._logoImage : __brandLogoImg;
    if (brandImg && brandImg.width) {
      const pc = document.createElement('canvas');
      pc.width = pc.height = 512;
      const px = pc.getContext('2d');
      const lidLight = relLuminance(cfg?.packColor || '#c85250') > 0.55;
      const ar = brandImg.width / brandImg.height;
      let lw = 340, lh = lw / ar;
      if (lh > 200) { lh = 200; lw = lh * ar; }
      const off = document.createElement('canvas');
      off.width = Math.max(2, Math.round(lw)); off.height = Math.max(2, Math.round(lh));
      const octx = off.getContext('2d');
      octx.drawImage(brandImg, 0, 0, off.width, off.height);
      octx.globalCompositeOperation = 'source-in';
      octx.fillStyle = lidLight ? '#333333' : '#fffef2';
      octx.fillRect(0, 0, off.width, off.height);
      px.drawImage(off, 256 - lw / 2, 256 - lh / 2, lw, lh);
      const printTex = new THREE.CanvasTexture(pc);
      if (THREE.sRGBEncoding) printTex.encoding = THREE.sRGBEncoding;
      const printMat = new THREE.MeshBasicMaterial({
        map: printTex, transparent: true, depthWrite: false,
        polygonOffset: true, polygonOffsetFactor: -2,
      });
      const lidDomeTop = h / 2 + 0.05 + (lidTop.geometry.parameters ? lidTop.geometry.parameters.radius : 1) * 0.14;
      const print = new THREE.Mesh(new THREE.CircleGeometry(lidR * 0.6, 48), printMat);
      print.rotation.x = -Math.PI / 2;
      print.position.y = lidDomeTop + 0.012;
      group.add(print);
    }
  }
  // skirt lower lip
  const skirtLip = new THREE.Mesh(new THREE.TorusGeometry(lidR, 0.028, 8, 96), lidMat);
  skirtLip.position.y = h / 2 - lidH + 0.06;
  skirtLip.rotation.x = Math.PI / 2;
  group.add(skirtLip);

  // Label wraps body below the lid
  const label = buildWraparoundLabel({
    cfg, pack: 'tin',
    radius: r * 1.005,
    height: h * 0.62,
    thetaDeg: 180,
    yOffset: -h * 0.12,
  });
  group.add(label);

  return group;
};

// ── Tube ────────────────────────────────────────────────────────
// Slim candy tube: rounded base, body in the pack color, ribbed screw
// cap with a soft dome.
const buildTube = (cfg) => {
  const group = new THREE.Group();
  const tints = PACK_TINTS(cfg?.packColor || cfg?.color || '#c85250');

  const r = 0.55, bodyH = 3.5;
  const shoulderH = 0.2;
  const capR = 0.52, capH = 0.5;

  const bodyMat = stdMat(tints.body, { rough: 0.5, metal: 0.12 });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(r, r, bodyH, 56, 1), bodyMat);
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  // Rounded base
  const base = new THREE.Mesh(
    new THREE.SphereGeometry(r, 48, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2),
    bodyMat
  );
  base.scale.set(1, 0.35, 1);
  base.position.y = -bodyH / 2;
  base.castShadow = true;
  group.add(base);

  // Shoulder — narrows from r to capR
  const sh = new THREE.Mesh(
    new THREE.CylinderGeometry(capR, r, shoulderH, 56, 1),
    stdMat(tints.body, { rough: 0.45, metal: 0.15 })
  );
  sh.position.y = bodyH / 2 + shoulderH / 2;
  group.add(sh);

  // Ribbed screw cap (dark) with dome top
  const capSide = new THREE.MeshStandardMaterial({
    map: makeRidgeTexture('#2a2825', 18), roughness: 0.45, metalness: 0.3,
  });
  const capFlat = stdMat(tints.cap, { rough: 0.4, metal: 0.4 });
  const cap = new THREE.Mesh(
    new THREE.CylinderGeometry(capR, capR, capH, 56, 1),
    [capSide, capFlat, capFlat]
  );
  cap.position.y = bodyH / 2 + shoulderH + capH / 2;
  cap.castShadow = true;
  group.add(cap);
  const capDome = new THREE.Mesh(
    new THREE.SphereGeometry(capR - 0.01, 40, 10, 0, Math.PI * 2, 0, Math.PI / 2),
    capFlat
  );
  capDome.scale.set(1, 0.22, 1);
  capDome.position.y = bodyH / 2 + shoulderH + capH - 0.01;
  group.add(capDome);

  // Label wraps body
  const label = buildWraparoundLabel({
    cfg, pack: 'tube',
    radius: r * 1.006,
    height: bodyH * 0.76,
    thetaDeg: 170,
    yOffset: -bodyH * 0.05,
  });
  group.add(label);

  return group;
};

// ── Chocolate bar ───────────────────────────────────────────────
// Classic flow-wrapped chocolate bar (Hershey-style): flat wrapped slab
// with serrated crimp flaps on both short ends, big centered wordmark.
const drawBarWrapCanvas = (cfg, widthUnits, heightUnits) => {
  const PX_PER_UNIT = 420;
  const w = Math.max(256, Math.round(widthUnits * PX_PER_UNIT));
  const h = Math.max(160, Math.round(heightUnits * PX_PER_UNIT));
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');

  const packColor = cfg?.packColor || '#4a2620';
  const lightWrap = relLuminance(packColor) > 0.55;
  const silver = lightWrap ? '#4a4640' : '#cfccc4';   // Hershey-style silver type
  const cream = lightWrap ? '#16140f' : '#f6f3ec';
  const ink = cfg?.typoColor || silver;
  const pad = Math.round(w * 0.05);

  // Wrapper base
  if (cfg && cfg._bgImage) {
    const img = cfg._bgImage;
    const iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
    const ar = iw / ih, tar = w / h;
    let dw = w, dh = h, dx = 0, dy = 0;
    if (ar > tar) { dw = h * ar; dx = (w - dw) / 2; } else { dh = w / ar; dy = (h - dh) / 2; }
    ctx.drawImage(img, dx, dy, dw, dh);
    ctx.fillStyle = packColor;
    ctx.globalAlpha = 0.42;
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = 1;
  } else {
    ctx.fillStyle = packColor;
    ctx.fillRect(0, 0, w, h);
  }
  // user overlay between background and type — matches label + film
  {
    const ovTone = (cfg && cfg.overlayTone) || 'none';
    const ovOp = (cfg && typeof cfg.overlayOpacity === 'number') ? cfg.overlayOpacity : 0;
    if (ovTone !== 'none' && ovOp > 0) {
      ctx.fillStyle = ovTone === 'dark'
        ? `rgba(22,20,15,${ovOp})`
        : `rgba(246,243,236,${ovOp})`;
      ctx.fillRect(0, 0, w, h);
    }
  }
  // soft horizontal sheen so the foil doesn't look flat
  const sheen = ctx.createLinearGradient(0, 0, 0, h);
  sheen.addColorStop(0, 'rgba(255,255,255,0.10)');
  sheen.addColorStop(0.25, 'rgba(255,255,255,0.0)');
  sheen.addColorStop(0.8, 'rgba(0,0,0,0.10)');
  sheen.addColorStop(1, 'rgba(0,0,0,0.16)');
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, w, h);

  // centered brand logo — uploaded logo, else the foodciety placeholder
  const brandImg = (cfg && cfg._logoImage && cfg._logoImage.width) ? cfg._logoImage : __brandLogoImg;
  if (brandImg && brandImg.width) {
    const maxLH = h * 0.14, maxLW = w * 0.3;
    const ar = brandImg.width / brandImg.height;
    let lh = maxLH, lw = lh * ar;
    if (lw > maxLW) { lw = maxLW; lh = lw / ar; }
    const off = document.createElement('canvas');
    off.width = Math.max(2, Math.round(lw * 2));
    off.height = Math.max(2, Math.round(lh * 2));
    const octx = off.getContext('2d');
    octx.drawImage(brandImg, 0, 0, off.width, off.height);
    octx.globalCompositeOperation = 'source-in';
    octx.fillStyle = cream;
    octx.fillRect(0, 0, off.width, off.height);
    ctx.globalAlpha = 0.92;
    ctx.drawImage(off, w / 2 - lw / 2, Math.round(h * 0.07), lw, lh);
    ctx.globalAlpha = 1;
  } else {
    ctx.fillStyle = cream;
    ctx.globalAlpha = 0.85;
    ctx.font = `500 ${Math.round(h * 0.08)}px "Neue Rational Mono", monospace`;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';
    try { ctx.letterSpacing = `${Math.round(h * 0.03)}px`; } catch (e) {}
    ctx.fillText('F O O D C I E T Y', w / 2, Math.round(h * 0.09));
    try { ctx.letterSpacing = '0px'; } catch (e) {}
    ctx.textAlign = 'left';
    ctx.globalAlpha = 1;
  }

  // huge centered wordmark — auto-shrink to one or two lines
  const barStyle = (cfg && cfg.typoStyle) || 'mono';
  const barFont = (s) => barStyle === 'mono' || barStyle === 'clean'
    ? `800 ${s}px "Neue Rational Mono", "Arial Black", monospace`
    : titleFontFor(barStyle, s);
  const title = (cfg?.name || 'your product name here').toUpperCase();
  let size = Math.round(h * 0.34);
  const fits = (t, s) => {
    ctx.font = barFont(s);
    return ctx.measureText(t).width <= w - pad * 2;
  };
  let lines = [title];
  while (size > h * 0.14 && !fits(title, size)) size -= 4;
  if (!fits(title, size)) {
    // split into two roughly equal lines on a space
    const words = title.split(/\s+/);
    if (words.length > 1) {
      let best = 1, bestDiff = Infinity;
      for (let i = 1; i < words.length; i++) {
        const a = words.slice(0, i).join(' '), b = words.slice(i).join(' ');
        const diff = Math.abs(a.length - b.length);
        if (diff < bestDiff) { bestDiff = diff; best = i; }
      }
      lines = [words.slice(0, best).join(' '), words.slice(best).join(' ')];
      size = Math.round(h * 0.26);
      while (size > h * 0.1 && !lines.every(l => fits(l, size))) size -= 4;
    }
  }
  ctx.font = barFont(size);
  ctx.fillStyle = ink;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const blockH = lines.length * size * 0.96;
  const cy = h * 0.47;
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.28)';
  ctx.shadowBlur = Math.round(h * 0.02);
  ctx.shadowOffsetY = Math.round(h * 0.008);
  lines.forEach((line, i) => {
    ctx.fillText(line, w / 2, cy - blockH / 2 + size * 0.48 + i * size * 0.96);
  });
  ctx.restore();

  // subline right under the wordmark — flavor (+ functional benefit)
  const flavorTxt = ((cfg?.flavorDe || cfg?.flavor || 'schokolade') + '').toLowerCase();
  ctx.fillStyle = cream;
  ctx.font = `500 ${Math.round(h * 0.1)}px "Neue Rational Mono", monospace`;
  ctx.fillText(`${flavorTxt} edition`, w / 2, cy + blockH / 2 + h * 0.09);
  if (cfg && cfg.func && cfg.func !== 'none' && cfg.funcLabel) {
    ctx.globalAlpha = 0.8;
    ctx.font = `500 ${Math.round(h * 0.07)}px "Neue Rational Mono", monospace`;
    ctx.fillText((cfg.funcLabel + (cfg.funcActives ? ' · ' + cfg.funcActives : '')).toLowerCase(),
      w / 2, cy + blockH / 2 + h * 0.2);
    ctx.globalAlpha = 1;
  }
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  // bottom row: weight left, creator name right (optional)
  ctx.globalAlpha = 0.75;
  ctx.font = `500 ${Math.round(h * 0.075)}px "Neue Rational Mono", monospace`;
  ctx.fillText(`NET WT ${cfg?.weight || 120}G`, pad, h - Math.round(h * 0.14));
  const barHandle = ((cfg && cfg.handle) || '').trim();
  if (barHandle) {
    ctx.textAlign = 'right';
    ctx.fillText(barHandle, w - pad, h - Math.round(h * 0.14));
    ctx.textAlign = 'left';
  }
  ctx.globalAlpha = 1;

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  tex.anisotropy = 8;
  if (THREE.sRGBEncoding) tex.encoding = THREE.sRGBEncoding;
  return tex;
};

const buildBar = (cfg) => {
  // Scanned bar when the GLB is ready — procedural fallback
  if (cfg && cfg._barScene) {
    try { return buildBarFromGLB(cfg, cfg._barScene); } catch (e) { /* fall through */ }
  }
  const group = new THREE.Group();
  const packColor = cfg?.packColor || cfg?.color || '#4a2620';
  const tints = PACK_TINTS(packColor);

  const w = 3.9, h = 1.7, d = 0.34;      // full width incl. crimp flaps
  const flapW = 0.3;
  const bw = w - flapW * 2;              // wrapped slab width
  const rr = 0.09;

  // Wrapped slab — rounded extrude so edges read as foil folded over
  const outline = new THREE.Shape();
  outline.moveTo(-bw / 2 + rr, -h / 2);
  outline.lineTo(bw / 2 - rr, -h / 2);
  outline.quadraticCurveTo(bw / 2, -h / 2, bw / 2, -h / 2 + rr);
  outline.lineTo(bw / 2, h / 2 - rr);
  outline.quadraticCurveTo(bw / 2, h / 2, bw / 2 - rr, h / 2);
  outline.lineTo(-bw / 2 + rr, h / 2);
  outline.quadraticCurveTo(-bw / 2, h / 2, -bw / 2, h / 2 - rr);
  outline.lineTo(-bw / 2, -h / 2 + rr);
  outline.quadraticCurveTo(-bw / 2, -h / 2, -bw / 2 + rr, -h / 2);
  const geo = new THREE.ExtrudeGeometry(outline, {
    depth: d * 0.6, bevelEnabled: true,
    bevelThickness: d * 0.2, bevelSize: 0.05, bevelSegments: 4, curveSegments: 10,
  });
  geo.translate(0, 0, -d * 0.3);
  const body = new THREE.Mesh(geo, stdMat(tints.body, { rough: 0.5, metal: 0.08 }));
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  // Serrated crimp flaps on both short ends
  const ridgeTex = makeRidgeTexture(packColor, 2);
  const flapMat = new THREE.MeshStandardMaterial({ map: ridgeTex, roughness: 0.7, metalness: 0.1 });
  [-1, 1].forEach(side => {
    const flap = new THREE.Mesh(new THREE.BoxGeometry(flapW, h * 0.9, d * 0.32), flapMat);
    flap.position.x = side * (bw / 2 + flapW / 2 - 0.03);
    flap.castShadow = true;
    group.add(flap);
  });

  // Printed wrapper front (kept on the flat zone inside the rounded edge)
  const tex = drawBarWrapCanvas({ ...cfg, packColor }, bw * 0.94, h * 0.9);
  const print = new THREE.Mesh(
    new THREE.PlaneGeometry(bw * 0.94, h * 0.9),
    new THREE.MeshStandardMaterial({ map: tex, roughness: 0.48, metalness: 0.05, transparent: true })
  );
  print.position.z = d / 2 + 0.006;
  group.add(print);

  return group;
};

// ── Calendar ────────────────────────────────────────────────────
// Landscape countdown box like the reference: near-black face, subtle
// scattered die-cut doors with shuffled numbers, big stacked wordmark
// on the left, one open door with a chocolate piece.
const buildCalendar = (cfg) => {
  const group = new THREE.Group();
  const packColor = cfg?.packColor || '#16140f';
  const accent = cfg?.color || '#e0562a';
  const w = 5.4, hh = 3.05, d = 0.5;

  // Rounded-edge box body, dark version of the pack color
  const rr = 0.06;
  const outline = new THREE.Shape();
  outline.moveTo(-w / 2 + rr, -hh / 2);
  outline.lineTo(w / 2 - rr, -hh / 2);
  outline.quadraticCurveTo(w / 2, -hh / 2, w / 2, -hh / 2 + rr);
  outline.lineTo(w / 2, hh / 2 - rr);
  outline.quadraticCurveTo(w / 2, hh / 2, w / 2 - rr, hh / 2);
  outline.lineTo(-w / 2 + rr, hh / 2);
  outline.quadraticCurveTo(-w / 2, hh / 2, -w / 2, hh / 2 - rr);
  outline.lineTo(-w / 2, -hh / 2 + rr);
  outline.quadraticCurveTo(-w / 2, -hh / 2, -w / 2 + rr, -hh / 2);
  const boxGeo = new THREE.ExtrudeGeometry(outline, {
    depth: d - 0.12, bevelEnabled: true,
    bevelThickness: 0.06, bevelSize: 0.045, bevelSegments: 3, curveSegments: 8,
  });
  boxGeo.translate(0, 0, -(d - 0.12) / 2);
  const darkBody = linCol(packColor).multiplyScalar(0.35).lerp(linCol(new THREE.Color(0x0d0c0a)), 0.5);
  const mesh = new THREE.Mesh(boxGeo, stdMat(darkBody, { rough: 0.65, metal: 0.05 }));
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);

  // Front print
  const canvas = document.createElement('canvas');
  canvas.width = 1440;
  canvas.height = Math.round(1440 * (hh / w));
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  // near-black base with a whisper of the pack color
  const baseC = new THREE.Color(packColor).lerp(new THREE.Color('#0d0c0a'), 0.78);
  ctx.fillStyle = '#' + baseC.getHexString();
  ctx.fillRect(0, 0, W, H);
  if (cfg && cfg._bgImage) {
    // AI visual / uploaded photo as the full-front cover artwork,
    // darkened enough that doors and type stay readable
    const img = cfg._bgImage;
    const iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
    const ar = iw / ih, tar = W / H;
    let dw = W, dh = H, dx = 0, dy = 0;
    if (ar > tar) { dw = H * ar; dx = (W - dw) / 2; } else { dh = W / ar; dy = (H - dh) / 2; }
    ctx.drawImage(img, dx, dy, dw, dh);
    ctx.fillStyle = 'rgba(13,12,10,0.42)';
    ctx.fillRect(0, 0, W, H);
    const ovTone = (cfg && cfg.overlayTone) || 'none';
    const ovOp = (cfg && typeof cfg.overlayOpacity === 'number') ? cfg.overlayOpacity : 0;
    if (ovTone !== 'none' && ovOp > 0) {
      ctx.fillStyle = ovTone === 'dark' ? `rgba(22,20,15,${ovOp})` : `rgba(255,254,242,${ovOp})`;
      ctx.fillRect(0, 0, W, H);
    }
  } else {
    // diagonal accent light streaks
    ctx.save();
    ctx.translate(W * 0.62, 0);
    ctx.rotate(0.5);
    const streak = ctx.createLinearGradient(0, 0, W * 0.55, 0);
    streak.addColorStop(0, 'rgba(0,0,0,0)');
    streak.addColorStop(0.5, accent + '');
    streak.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.globalAlpha = 0.14;
    ctx.fillStyle = streak;
    ctx.fillRect(-W * 0.1, -H * 0.2, W * 0.55, H * 1.6);
    ctx.globalAlpha = 0.08;
    ctx.fillRect(W * 0.35, -H * 0.2, W * 0.3, H * 1.6);
    ctx.restore();
  }
  // vignette
  const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, W * 0.75);
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(1, 'rgba(0,0,0,0.42)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);

  // subtle die-cut door grid with shuffled numbers
  const cols = 6, rows = 4;
  const gx = W * 0.045, gy = H * 0.075;
  const gw = W - gx * 2, gh = H - gy * 2;
  const gap = W * 0.012;
  const cw = (gw - gap * (cols - 1)) / cols;
  const ch = (gh - gap * (rows - 1)) / rows;
  const nums = [12, 13, 5, 14, 5, 21, 7, 13, 9, 22, 10, 19, 24, 4, 1, 20, 6, 11, 8, 15, 2, 17, 16, 23];
  const openIdx = 11; // one opened door, right side
  const rnd = (i, n) => { const x = Math.sin(i * 91.7 + n * 47.9) * 43758.5453; return x - Math.floor(x); };
  for (let i = 0; i < 24; i++) {
    const col = i % cols, row = Math.floor(i / cols);
    const x = gx + col * (cw + gap) + (rnd(i, 1) - 0.5) * gap * 0.6;
    const y = gy + row * (ch + gap) + (rnd(i, 2) - 0.5) * gap * 0.6;
    const r = W * 0.006;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, cw, ch, r);
    else ctx.rect(x, y, cw, ch);
    if (i === openIdx) {
      // open door: dark recess + chocolate piece + small cream tag
      ctx.fillStyle = 'rgba(0,0,0,0.55)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.22)';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      const px = x + cw / 2, py = y + ch / 2;
      ctx.fillStyle = '#5a3a24';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(px - cw * 0.26, py - ch * 0.22, cw * 0.52, ch * 0.44, r * 2);
      else ctx.rect(px - cw * 0.26, py - ch * 0.22, cw * 0.52, ch * 0.44);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.fillRect(px - cw * 0.26, py - ch * 0.22, cw * 0.52, ch * 0.1);
    } else {
      ctx.strokeStyle = 'rgba(255,255,255,0.10)';
      ctx.lineWidth = 2;
      ctx.stroke();
      // perforation nick
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.fillRect(x + cw - W * 0.012, y + ch * 0.45, W * 0.006, ch * 0.1);
      ctx.fillStyle = 'rgba(255,255,255,0.22)';
      ctx.font = `500 ${Math.round(H * 0.036)}px "Neue Rational Mono", monospace`;
      ctx.textBaseline = 'top';
      ctx.fillText(String(nums[i]), x + cw * 0.09, y + ch * 0.1);
    }
  }

  // big stacked wordmark, left side
  const title = (cfg?.name || 'what the countdown').toUpperCase();
  const words = title.split(/\s+/);
  const lines = [];
  let cur = '';
  const maxW = W * 0.52;
  let size = Math.round(H * 0.185);
  const meas = (t, s) => {
    ctx.font = `800 ${s}px "Neue Rational Mono", "Arial Black", monospace`;
    return ctx.measureText(t).width;
  };
  for (; size > H * 0.09; size -= 4) {
    lines.length = 0; cur = '';
    for (const word of words) {
      const test = cur ? cur + ' ' + word : word;
      if (meas(test, size) > maxW && cur) { lines.push(cur); cur = word; }
      else cur = test;
    }
    if (cur) lines.push(cur);
    if (lines.length <= 3 && lines.every(l => meas(l, size) <= maxW)) break;
  }
  ctx.font = `800 ${size}px "Neue Rational Mono", "Arial Black", monospace`;
  ctx.fillStyle = '#f6f3ec';
  ctx.textBaseline = 'alphabetic';
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = Math.round(H * 0.03);
  ctx.shadowOffsetY = Math.round(H * 0.008);
  let ty = H * 0.2 + size;
  for (const line of lines) {
    ctx.fillText(line, W * 0.07, ty);
    ty += size * 1.04;
  }
  ctx.restore();

  // top-right: 24 türchen
  ctx.fillStyle = 'rgba(246,243,236,0.6)';
  ctx.font = `500 ${Math.round(H * 0.04)}px "Neue Rational Mono", monospace`;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  ctx.fillText('24 TÜRCHEN', W - W * 0.06, H * 0.055);
  ctx.textAlign = 'left';

  // bottom-left: FOODCIETY-Edition
  ctx.textBaseline = 'alphabetic';
  ctx.font = `800 ${Math.round(H * 0.06)}px "Neue Rational Mono", monospace`;
  ctx.fillStyle = '#f6f3ec';
  ctx.fillText('FOODCIETY', W * 0.07, H * 0.9);
  const fw = ctx.measureText('FOODCIETY').width;
  ctx.font = `italic 700 ${Math.round(H * 0.06)}px "Neue Rational Mono", monospace`;
  ctx.fillStyle = accent;
  ctx.fillText('-Edition', W * 0.07 + fw, H * 0.9);

  // bottom-right: creator name chip (optional)
  const handle = ((cfg && cfg.handle) || '').trim();
  if (handle) {
    ctx.font = `700 ${Math.round(H * 0.045)}px "Neue Rational Mono", monospace`;
    const hw2 = ctx.measureText(handle).width;
    const chipW = hw2 + W * 0.03, chipH = H * 0.085;
    const chipX = W - W * 0.055 - chipW, chipY = H * 0.845;
    ctx.fillStyle = '#f6f3ec';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(chipX, chipY, chipW, chipH, chipH * 0.18);
    else ctx.rect(chipX, chipY, chipW, chipH);
    ctx.fill();
    ctx.fillStyle = '#16140f';
    ctx.textBaseline = 'middle';
    ctx.fillText(handle, chipX + W * 0.015, chipY + chipH / 2);
    ctx.textBaseline = 'alphabetic';
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 8;
  if (THREE.sRGBEncoding) tex.encoding = THREE.sRGBEncoding;
  const label = new THREE.Mesh(
    new THREE.PlaneGeometry(w * 0.985, hh * 0.975),
    new THREE.MeshStandardMaterial({ map: tex, roughness: 0.6, metalness: 0.03 })
  );
  label.position.z = d / 2 + 0.004;
  group.add(label);

  return group;
};

// ───────────────────────────────────────────────────────────────────
// Label helpers — flat, curved, wraparound. All pass physical dimensions
// to drawLabelCanvas so the artwork aspect matches the surface aspect —
// no stretching.
// ───────────────────────────────────────────────────────────────────
// Cover-fit a texture to a target aspect ratio (crop, don't distort)
const coverTexture = (tex, img, targetAR) => {
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  if (!iw || !ih) return;
  const imgAR = iw / ih;
  if (imgAR > targetAR) {
    tex.repeat.x = targetAR / imgAR;
    tex.offset.x = (1 - tex.repeat.x) / 2;
  } else {
    tex.repeat.y = imgAR / targetAR;
    tex.offset.y = (1 - tex.repeat.y) / 2;
  }
  tex.needsUpdate = true;
};

const buildFlatLabel = ({ cfg, pack, width, height, faceDepth }) => {
  const hasBg = !!(cfg && cfg._bgImage);
  const group = new THREE.Group();
  group.name = '__foofab_label__';

  // Background layer — AI image (or nothing; opaque typo handles plain case)
  if (hasBg) {
    const bgTex = new THREE.Texture(cfg._bgImage);
    bgTex.needsUpdate = true;
    bgTex.anisotropy = 8;
    if (THREE.sRGBEncoding) bgTex.encoding = THREE.sRGBEncoding;
    coverTexture(bgTex, cfg._bgImage, width / height);
    const bgMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(width, height),
      new THREE.MeshStandardMaterial({ map: bgTex, roughness: 0.85, metalness: 0.02, side: THREE.DoubleSide })
    );
    bgMesh.position.z = faceDepth;
    group.add(bgMesh);
  }

  // Typo layer (transparent when there's a bg, opaque paper otherwise)
  const tex = drawLabelCanvas(cfg, pack, width, height, { transparent: hasBg });
  const mat = new THREE.MeshStandardMaterial({
    map: tex, roughness: 0.82, metalness: 0.02, side: THREE.DoubleSide,
    transparent: hasBg,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), mat);
  mesh.position.z = faceDepth + (hasBg ? 0.012 : 0);
  group.add(mesh);

  return group;
};

// Wraparound label (jar, tin, tube) — cylinder slice around Y axis
const buildWraparoundLabel = ({ cfg, pack, radius, height, thetaDeg = 170, yOffset = 0 }) => {
  const thetaLength = (thetaDeg * Math.PI) / 180;
  // Center the label arc on +Z so it faces the camera in the default
  // view (CylinderGeometry: x = r·sinθ, z = r·cosθ → θ=0 is front).
  const arcLength = radius * thetaLength;
  const thetaStart = -thetaLength / 2;
  const hasBg = !!(cfg && cfg._bgImage);
  const group = new THREE.Group();
  group.name = '__foofab_label__';
  group.position.y = yOffset;

  const makeCyl = (r) => new THREE.CylinderGeometry(r, r, height, 96, 1, true, thetaStart, thetaLength);

  if (hasBg) {
    const bgTex = new THREE.Texture(cfg._bgImage);
    bgTex.needsUpdate = true;
    bgTex.anisotropy = 8;
    if (THREE.sRGBEncoding) bgTex.encoding = THREE.sRGBEncoding;
    coverTexture(bgTex, cfg._bgImage, arcLength / height);
    const bgMesh = new THREE.Mesh(
      makeCyl(radius),
      new THREE.MeshStandardMaterial({ map: bgTex, roughness: 0.82, metalness: 0.02, side: THREE.DoubleSide })
    );
    group.add(bgMesh);
  }

  const tex = drawLabelCanvas(cfg, pack, arcLength, height, { transparent: hasBg });
  const mat = new THREE.MeshStandardMaterial({
    map: tex, roughness: 0.82, metalness: 0.02, side: THREE.DoubleSide,
    transparent: hasBg,
  });
  const mesh = new THREE.Mesh(makeCyl(radius * 1.004), mat);
  group.add(mesh);

  return group;
};

// ───────────────────────────────────────────────────────────────────
// Component
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// Crinkled-pouch GLB (photogrammetry-style scan) — loaded once and
// cloned per build. The white film gets tinted to the pack color and
// the print is projected as a decal so it follows every wrinkle.
// ───────────────────────────────────────────────────────────────────
let __pouchGLBPromise = null;
const loadPouchGLB = () => {
  if (__pouchGLBPromise) return __pouchGLBPromise;
  __pouchGLBPromise = new Promise((resolve) => {
    if (!THREE.GLTFLoader) return resolve(null);
    try {
      new THREE.GLTFLoader().load('assets/models/pouch-crinkled.glb',
        (gltf) => resolve(gltf.scene || null),
        undefined,
        () => resolve(null));
    } catch (e) { resolve(null); }
  });
  return __pouchGLBPromise;
};

// Brand logo placeholder for prints (recolored per surface); replaced
// by the uploaded logo when one exists.
let __brandLogoImg = null;
try {
  const __bl = new Image();
  __bl.onload = () => { __brandLogoImg = __bl; };
  __bl.src = 'assets/foodciety-logo.png';
} catch (e) { /* optional */ }

// Chocolate-bar GLB (scan, lying flat with the face up) — loaded once.
let __barGLBPromise = null;
const loadBarGLB = () => {
  if (__barGLBPromise) return __barGLBPromise;
  __barGLBPromise = new Promise((resolve) => {
    if (!THREE.GLTFLoader) return resolve(null);
    try {
      new THREE.GLTFLoader().load('assets/models/chocolate-bar.glb',
        (gltf) => resolve(gltf.scene || null),
        undefined,
        () => resolve(null));
    } catch (e) { resolve(null); }
  });
  return __barGLBPromise;
};

const buildBarFromGLB = (cfg, src) => {
  const group = new THREE.Group();
  const packColor = cfg?.packColor || '#4a2620';
  const inner = new THREE.Group();
  const bar = src.clone(true);
  // scan lies flat, face up (+Y) — stand it upright facing the camera
  bar.rotation.x = Math.PI / 2;
  inner.add(bar);
  inner.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(inner);
  const size = box.getSize(new THREE.Vector3());
  const s = 3.4 / (size.x || 1);
  inner.scale.setScalar(s);
  inner.updateMatrixWorld(true);
  const box2 = new THREE.Box3().setFromObject(inner);
  const center = box2.getCenter(new THREE.Vector3());
  inner.position.sub(center);
  inner.updateMatrixWorld(true);

  let bodyMesh = null;
  inner.traverse((c) => {
    if (c.isMesh) {
      bodyMesh = c;
      c.userData.__keepMaps = true;
      const m = c.material ? c.material.clone() : null;
      if (m) {
        m.color = linCol(new THREE.Color(packColor));
        if (m.emissive) m.emissive.setRGB(0, 0, 0);
        m.emissiveMap = null;
        m.envMapIntensity = 0.8;
        m.needsUpdate = true;
        c.material = m;
      }
    }
  });
  group.add(inner);

  // wrap print projected onto the front
  if (bodyMesh && THREE.DecalGeometry) {
    try {
      const bb = new THREE.Box3().setFromObject(inner);
      const sz = bb.getSize(new THREE.Vector3());
      const dPos = new THREE.Vector3(0, 0, bb.max.z);
      const dSize = new THREE.Vector3(sz.x * 0.97, sz.y * 0.92, sz.z * 0.8);
      const tex = drawBarWrapCanvas({ ...cfg, packColor }, dSize.x, dSize.y);
      const decalGeo = new THREE.DecalGeometry(bodyMesh, dPos, new THREE.Euler(0, 0, 0), dSize);
      const decalMat = new THREE.MeshPhysicalMaterial({
        map: tex, transparent: true, depthWrite: false,
        polygonOffset: true, polygonOffsetFactor: -4,
        roughness: 0.45, metalness: 0.08,
      });
      decalMat.envMapIntensity = 0.6;
      group.add(new THREE.Mesh(decalGeo, decalMat));
    } catch (e) { /* decal optional */ }
  }
  return group;
};

const buildPouchFromGLB = (cfg, src) => {
  const group = new THREE.Group();
  const packColor = cfg?.packColor || '#2f6b3f';
  const pouch = src.clone(true);

  // Normalize to the procedural pouch's height, centered at the origin
  const box = new THREE.Box3().setFromObject(pouch);
  const size = box.getSize(new THREE.Vector3());
  const s = POUCH_H / (size.y || 1);
  pouch.scale.setScalar(s);
  pouch.updateMatrixWorld(true);
  const box2 = new THREE.Box3().setFromObject(pouch);
  const center = box2.getCenter(new THREE.Vector3());
  pouch.position.sub(center);
  pouch.updateMatrixWorld(true);

  // Tint the white film, kill the baked emissive (it would fight the
  // HDRI), and clone materials so the cached GLB stays untouched.
  let bodyMesh = null;
  pouch.traverse((c) => {
    if (c.isMesh) {
      bodyMesh = c;
      c.castShadow = true;
      c.receiveShadow = true;
      c.userData.__keepMaps = true; // shared GLB textures — never dispose
      const m = c.material ? c.material.clone() : null;
      if (m) {
        m.color = linCol(new THREE.Color(packColor));
        if (m.emissive) m.emissive.setRGB(0, 0, 0);
        m.emissiveMap = null;
        if (typeof m.roughness === 'number') m.roughness = Math.min(0.85, m.roughness * 0.9);
        m.envMapIntensity = 0.85;
        m.needsUpdate = true;
        c.material = m;
      }
    }
  });
  group.add(pouch);

  // Project the print onto the crinkled front as a decal
  if (bodyMesh && THREE.DecalGeometry) {
    try {
      const bb = new THREE.Box3().setFromObject(pouch);
      const sz = bb.getSize(new THREE.Vector3());
      const dPos = new THREE.Vector3(0, sz.y * 0.03, bb.max.z);
      const dRot = new THREE.Euler(0, 0, 0);
      // shallow projection depth — deep enough to hug the wrinkles, but
      // never reaching the back face (which would mirror the print)
      const dSize = new THREE.Vector3(sz.x * 0.8, sz.y * 0.74, sz.z * 0.8);
      const tex = drawFilmCanvas(cfg, dSize.x, dSize.y, { transparent: true });
      const decalGeo = new THREE.DecalGeometry(bodyMesh, dPos, dRot, dSize);
      const decalMat = new THREE.MeshPhysicalMaterial({
        map: tex,
        transparent: true,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -4,
        roughness: 0.5,
        metalness: 0,
      });
      decalMat.envMapIntensity = 0.5;
      const decal = new THREE.Mesh(decalGeo, decalMat);
      group.add(decal);
    } catch (e) { /* decal optional — tinted pouch still shows */ }
  }
  return group;
};

const BUILDERS = {
  pouch:    buildPouch,
  jar:      buildJar,
  tin:      buildTin,
  tube:     buildTube,
  bar:      buildBar,
  calendar: buildCalendar,
};

// ───────────────────────────────────────────────────────────────────
// Sparkle sprites — white four-point stars with a soft glow, floating
// around the product like supplement-hero renders. One cached texture
// shared by all sprites (never disposed on rebuild).
// ───────────────────────────────────────────────────────────────────
let __sparkleTex = null;
const makeSparkleTexture = () => {
  if (__sparkleTex) return __sparkleTex;
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const x = c.getContext('2d');
  x.translate(64, 64);
  const g = x.createRadialGradient(0, 0, 0, 0, 0, 60);
  g.addColorStop(0, 'rgba(255,255,255,0.5)');
  g.addColorStop(0.35, 'rgba(255,255,255,0.10)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g;
  x.beginPath(); x.arc(0, 0, 60, 0, Math.PI * 2); x.fill();
  x.fillStyle = '#ffffff';
  x.beginPath();
  x.moveTo(0, -56);
  x.quadraticCurveTo(5, -9, 56, 0);
  x.quadraticCurveTo(5, 9, 0, 56);
  x.quadraticCurveTo(-5, 9, -56, 0);
  x.quadraticCurveTo(-5, -9, 0, -56);
  x.closePath(); x.fill();
  __sparkleTex = new THREE.CanvasTexture(c);
  if (THREE.sRGBEncoding) __sparkleTex.encoding = THREE.sRGBEncoding;
  return __sparkleTex;
};

// Springy overshoot easing for the spawn "pop"
const easeOutBack = (t) => {
  const c1 = 1.70158, c3 = c1 + 1;
  const u = t - 1;
  return 1 + c3 * u * u * u + c1 * u * u;
};

const SPARKLE_SPOTS = [
  { x: -2.35, y: 2.0,  z: -0.4, s: 0.42 },
  { x: 2.6,  y: 1.7,  z: 0.3,  s: 0.55 },
  { x: -2.9, y: 0.2,  z: 0.6,  s: 0.3 },
  { x: 2.95, y: -0.7, z: -0.5, s: 0.34 },
  { x: -1.8, y: -1.9, z: 0.8,  s: 0.46 },
  { x: 1.3,  y: 2.5,  z: -0.8, s: 0.3 },
  { x: 0.4,  y: -2.4, z: 0.5,  s: 0.26 },
  { x: -0.9, y: 2.7,  z: 0.4,  s: 0.24 },
  { x: 2.1,  y: 0.6,  z: 1.0,  s: 0.2 },
];

const ThreeProductPreview = ({ cfg, tilt, onTiltChange, showPieces = true, zoom = 'out', frameless = false }) => {
  const mountRef = React.useRef(null);
  const sceneRef = React.useRef(null);
  const rendererRef = React.useRef(null);
  const cameraRef = React.useRef(null);
  const objectRef = React.useRef(null);
  const tiltRef = React.useRef(tilt);
  tiltRef.current = tilt;
  const zoomRef = React.useRef(zoom);
  zoomRef.current = zoom;
  // Flavor-tinted stage color — the whole backdrop follows the flavor
  const flavorHex = gummyColorFor(cfg);

  // Setup scene once
  React.useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    // Neutral until the flavor effect paints the real backdrop
    scene.background = new THREE.Color('#f2efe8');

    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 0, 9);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    if (THREE.SRGBColorSpace) renderer.outputColorSpace = THREE.SRGBColorSpace;
    else if (THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;
    if ('toneMapping' in renderer) {
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
    }
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    // ── Studio 3-point lighting ──
    const ambient = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambient);

    // key (soft box top-right)
    const key = new THREE.DirectionalLight(0xfff6ec, 1.35);
    key.position.set(4, 8, 6);
    key.castShadow = true;
    key.shadow.mapSize.width = 2048;
    key.shadow.mapSize.height = 2048;
    key.shadow.camera.left = -6;
    key.shadow.camera.right = 6;
    key.shadow.camera.top = 6;
    key.shadow.camera.bottom = -6;
    key.shadow.bias = -0.0004;
    key.shadow.radius = 6;
    scene.add(key);

    // fill (cool, opposite side, no shadow)
    const fill = new THREE.DirectionalLight(0xe8f0ff, 0.45);
    fill.position.set(-6, 2, 4);
    scene.add(fill);

    // rim / back light for edge separation
    const rim = new THREE.DirectionalLight(0xffffff, 0.9);
    rim.position.set(-3, 5, -6);
    scene.add(rim);

    // Soft studio hemisphere + environment lighting. A quick canvas env
    // fills in immediately; the real HDRI (EXR) upgrades it as soon as
    // it's decoded — background stays the flavor gradient either way.
    const hemi = new THREE.HemisphereLight(0xffffff, 0xcfccc3, 0.5);
    scene.add(hemi);
    try {
      const envCanvas = document.createElement('canvas');
      envCanvas.width = 256; envCanvas.height = 128;
      const ec = envCanvas.getContext('2d');
      const g = ec.createLinearGradient(0, 0, 0, 128);
      g.addColorStop(0, '#ffffff');
      g.addColorStop(0.45, '#e8e6e0');
      g.addColorStop(0.55, '#cfccc3');
      g.addColorStop(1, '#8f8c84');
      ec.fillStyle = g; ec.fillRect(0, 0, 256, 128);
      // bright "window" strips for glossy highlights
      ec.fillStyle = 'rgba(255,255,255,0.95)';
      ec.fillRect(30, 12, 42, 60);
      ec.fillRect(150, 18, 34, 52);
      const envTex = new THREE.CanvasTexture(envCanvas);
      envTex.mapping = THREE.EquirectangularReflectionMapping;
      const cubeRT = new THREE.WebGLCubeRenderTarget(128).fromEquirectangularTexture(renderer, envTex);
      scene.environment = cubeRT.texture;
      envTex.dispose();
    } catch (e) { /* env optional */ }

    // HDRI upgrade — real image-based lighting for glass, foil and candy.
    let pmrem = null;
    if (THREE.EXRLoader) {
      try {
        new THREE.EXRLoader()
          .setDataType(THREE.HalfFloatType || THREE.FloatType)
          .load('assets/hdri/studio_1k.exr', (tex) => {
            try {
              pmrem = new THREE.PMREMGenerator(renderer);
              pmrem.compileEquirectangularShader();
              const envRT = pmrem.fromEquirectangular(tex);
              scene.environment = envRT.texture;
              tex.dispose();
            } catch (e) { /* keep canvas env */ }
          }, undefined, () => { /* keep canvas env on load error */ });
      } catch (e) { /* keep canvas env */ }
    }

    // No ground plane and no cast shadows — the product floats free on
    // the pure flavor backdrop.
    renderer.shadowMap.enabled = false;

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    let raf;
    const look = { x: 0, y: 0 };
    const tick = () => {
      // Smooth zoom between three framings: 'out' full view, 'in'
      // close-up on the pack, 'piece' centers one floating gummy.
      const Z = zoomRef.current;
      const T = Z === 'piece'
        ? { x: 2.4, y: 0.68, z: 3.6 }
        : Z === 'in'
          ? { x: 0, y: 0, z: 5.2 }
          : { x: 0, y: 0, z: 9 };
      camera.position.x += (T.x - camera.position.x) * 0.07;
      camera.position.y += (T.y - camera.position.y) * 0.07;
      camera.position.z += (T.z - camera.position.z) * 0.07;
      look.x += (T.x - look.x) * 0.07;
      look.y += (T.y - look.y) * 0.07;
      camera.lookAt(look.x, look.y, 0);
      const obj = objectRef.current;
      if (obj) {
        // Locked hero view: the product hovers and wiggles gently around
        // its base orientation — no user rotation.
        const t = tiltRef.current || { x: -8, y: 16 };
        const now = performance.now() / 1000;
        const wigY = Math.sin(now * 0.45) * 3.0 + Math.sin(now * 0.21) * 1.6;
        const wigX = Math.sin(now * 0.34) * 1.4;
        obj.rotation.y = ((t.y + wigY) * Math.PI) / 180;
        obj.rotation.x = ((t.x + wigX) * Math.PI) / 180;
        // hover around vertical center of the frame
        obj.position.y = 0.06 + Math.sin(now * 0.8) * 0.09;

        // spawn pop — the pack bounces slightly bigger, the pieces burst
        // from the center outward. age since (re)build:
        const age = now - (obj.userData.bornAt || 0);
        const packK = Math.min(1, age / 0.42);
        obj.scale.setScalar(0.9 + 0.1 * easeOutBack(packK));

        obj.traverse((c) => {
          const u = c.userData;
          if (u && u.spawn) {
            const k = Math.min(1, Math.max(0, (age - u.spawn.delay) / 0.5));
            const e = easeOutBack(k);
            if (k < 1) {
              c.position.set(u.spawn.tx * e, u.spawn.ty * e, u.spawn.tz * e);
              c.scale.setScalar(u.spawn.s * Math.max(0.001, e));
            } else {
              c.position.x = u.spawn.tx;
              c.position.z = u.spawn.tz;
              c.scale.setScalar(u.spawn.s);
              c.position.y = u.baseY + Math.sin(now * u.floatSpeed + u.floatPhase) * u.floatAmp;
            }
          } else if (u && u.floatAmp) {
            c.position.y = u.baseY + Math.sin(now * u.floatSpeed + u.floatPhase) * u.floatAmp;
          }
          if (u && u.twinkle) {
            const gate = Math.min(1, Math.max(0, (age - 0.25) / 0.4));
            const s = u.baseS * gate * (0.8 + 0.35 * Math.sin(now * u.twSpeed + u.twPhase));
            c.scale.set(Math.max(0.001, s), Math.max(0.001, s), 1);
          }
        });
      }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      if (pmrem) pmrem.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Flavor backdrop — a soft pastel of the candy color (Lemme-style):
  // lighter at the top, a touch deeper at the bottom.
  React.useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const c = new THREE.Color(flavorHex);
    const white = new THREE.Color('#ffffff');
    // Punchy stage color — full-on flavor
    const top = c.clone().lerp(white, 0.44);
    const mid = c.clone().lerp(white, 0.3);
    const bot = c.clone().lerp(white, 0.12);
    const bc = document.createElement('canvas');
    bc.width = 16; bc.height = 512;
    const bx = bc.getContext('2d');
    const g = bx.createLinearGradient(0, 0, 0, 512);
    g.addColorStop(0, '#' + top.getHexString());
    g.addColorStop(0.55, '#' + mid.getHexString());
    g.addColorStop(1, '#' + bot.getHexString());
    bx.fillStyle = g; bx.fillRect(0, 0, 16, 512);
    const bgTex = new THREE.CanvasTexture(bc);
    if (THREE.sRGBEncoding) bgTex.encoding = THREE.sRGBEncoding;
    const old = scene.background;
    scene.background = bgTex;
    if (old && old.dispose) old.dispose();
  }, [flavorHex]);

  // Build / rebuild the product whenever cfg changes.
  // Rebuilding is cheap with primitives — no async loading.
  React.useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    let cancelled = false;

    const disposePrev = () => {
      if (objectRef.current) {
        scene.remove(objectRef.current);
        objectRef.current.traverse((c) => {
          if (c.isMesh) {
            const keepMaps = !!c.userData.__keepMaps; // shared GLB textures
            if (!keepMaps) c.geometry?.dispose();
            const mats = Array.isArray(c.material) ? c.material : [c.material];
            mats.forEach(m => { if (!keepMaps) m?.map?.dispose(); m?.dispose(); });
          } else if (c.isSprite) {
            // dispose the material but NOT the shared sparkle texture
            c.material?.dispose();
          }
        });
        objectRef.current = null;
      }
    };

    const build = (bgImage, logoImage, shapeImage, packScene) => {
      if (cancelled) return;
      disposePrev();
      const builder = BUILDERS[cfg.pack] || BUILDERS.pouch;
      const obj = builder({
        ...cfg,
        _bgImage: bgImage,
        _logoImage: logoImage,
        _pieces: showPieces,
        _pouchScene: cfg.pack === 'pouch' ? (packScene || null) : null,
        _barScene: cfg.pack === 'bar' ? (packScene || null) : null,
      });
      obj.traverse((c) => {
        if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; }
      });
      // slight hero lean, like a propped-up pack shot
      obj.rotation.z = -0.055;

      // Pieces floating AROUND the package — style depends on the base:
      // gummies for candy bases, matte nuts for the nuts base, nothing
      // for chocolate bars. For the jar the pieces live INSIDE instead.
      // All candy pieces stay hidden until the shape step (showPieces).
      const floaterStyle = floaterStyleFor(cfg);
      if (showPieces && floaterStyle !== 'none' && cfg.pack !== 'jar') {
        const isNuts = floaterStyle === 'nuts';
        // Advent calendar: fill is either gummies or chocolate — same
        // shape catalog, different materiality.
        const isChoc = cfg.base === 'advent calendar' && cfg.calFill === 'chocolate';
        const kind = isNuts ? null : gummyKindFor(cfg);
        const geo = isNuts ? null : makeGummyGeometry(kind, 'high');
        const col = new THREE.Color(gummyColorFor(cfg));
        const mat = isNuts ? null : (isChoc ? makeChocolateMaterial() : makeGummyMaterial(col, { thickness: 1.0 }));
        const spots = [
          { x: -2.55, y: 1.35,  z: 0.5,  s: 0.42, rx: 0.3,  ry: 0.5,  rz: -0.2 },
          { x: -2.8,  y: -0.85, z: -0.3, s: 0.34, rx: -0.2, ry: -0.4, rz: 0.25 },
          { x: 2.7,   y: 0.55,  z: 0.1,  s: 0.4,  rx: 0.15, ry: -0.5, rz: 0.15 },
          { x: 2.5,   y: -1.5,  z: 0.6,  s: 0.3,  rx: -0.3, ry: 0.3,  rz: -0.25 },
          { x: 0.9,   y: 2.25,  z: -0.7, s: 0.27, rx: 0.4,  ry: 0.2,  rz: 0.1 },
          { x: -1.1,  y: 2.15,  z: 0.55, s: 0.24, rx: -0.35, ry: 0.6, rz: 0.3 },
          // two low drifters near the floor for depth
          { x: -2.1,  y: -1.95, z: 1.05, s: 0.3,  rx: -1.1, ry: 0.2, rz: 0.7 },
          { x: 2.2,   y: -2.0,  z: 0.85, s: 0.26, rx: -1.3, ry: 0.5, rz: -1.1 },
        ];
        spots.forEach((p, i) => {
          const m = isNuts
            ? new THREE.Mesh(makeNutGeometry(i), makeNutMaterial(i))
            : new THREE.Mesh(geo, mat);
          // spawn pop: pieces burst from the center outward to their spot
          m.scale.setScalar(0.001);
          m.position.set(0, 0, 0);
          m.rotation.set(p.rx, p.ry, p.rz);
          m.castShadow = true;
          m.name = '__floating_shape_' + i;
          m.userData.floatAmp = 0.07;
          m.userData.floatSpeed = 0.55 + (i % 3) * 0.18;
          m.userData.floatPhase = i * 1.7;
          m.userData.baseY = p.y;
          m.userData.spawn = { tx: p.x, ty: p.y, tz: p.z, s: p.s, delay: 0.06 + i * 0.05 };
          obj.add(m);
        });
      }

      // Sparkle stars around the product — always on, they sell the
      // supplement-hero look even before pieces appear.
      const sparkTex = makeSparkleTexture();
      SPARKLE_SPOTS.forEach((p, i) => {
        const mat = new THREE.SpriteMaterial({
          map: sparkTex, transparent: true, depthWrite: false, opacity: 0.95,
        });
        const sp = new THREE.Sprite(mat);
        sp.position.set(p.x, p.y, p.z);
        sp.scale.set(p.s, p.s, 1);
        sp.userData.twinkle = true;
        sp.userData.baseS = p.s;
        sp.userData.twSpeed = 0.9 + (i % 4) * 0.35;
        sp.userData.twPhase = i * 1.3;
        obj.add(sp);
      });

      // spawn timestamp drives the pop-in animation in the tick loop
      obj.userData.bornAt = performance.now() / 1000;
      scene.add(obj);
      objectRef.current = obj;
    };

    // Preload bg + logo (both optional) then build once both resolved
    const loadImg = (src) => new Promise((resolve) => {
      if (!src) return resolve(null);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });

    // Make sure the chosen display face is decoded before the canvas
    // draws with it — otherwise the first render falls back silently.
    const fontReady = (document.fonts && document.fonts.load)
      ? document.fonts.load(titleFontFor(cfg.typoStyle || 'editorial', 48), 'ABgy').catch(() => null)
      : Promise.resolve(null);

    Promise.all([
      loadImg(cfg.labelBgUrl || cfg.photo),
      loadImg(cfg.logo),
      loadImg(cfg.shapeImg),
      cfg.pack === 'pouch' ? loadPouchGLB() : (cfg.pack === 'bar' ? loadBarGLB() : Promise.resolve(null)),
      fontReady,
    ]).then(([bg, logo, shape, packScene]) => build(bg, logo, shape, packScene));

    return () => { cancelled = true; };
  }, [cfg.pack, cfg.base, cfg.color, cfg.packColor, cfg.name, cfg.handle, cfg.flavor, cfg.flavorDe, cfg.shapeId, cfg.shapeName, cfg.weight, cfg.labelBgUrl, cfg.photo, cfg.typoStyle, cfg.titleCase, cfg.titleScale, cfg.logo, cfg.typoColor, cfg.overlayTone, cfg.overlayOpacity, cfg.shapeImg, cfg.calFill, cfg.func, cfg.funcLabel, showPieces]);

  // Hero view with drag-to-rotate: pointer drag adjusts the base tilt,
  // the float + wiggle animation rides on top. No HUD chrome.
  const dragRef = React.useRef(null);
  const onPointerDown = (e) => {
    dragRef.current = { x: e.clientX, y: e.clientY, tilt: { ...(tiltRef.current || { x: -9, y: 17 }) } };
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.style.cursor = 'grabbing';
  };
  const onPointerMove = (e) => {
    if (!dragRef.current || !onTiltChange) return;
    if (e.cancelable) e.preventDefault();
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    const isTouch = e.pointerType === 'touch';
    const sx = isTouch ? 0.9 : 0.5;
    const sy = isTouch ? 0.7 : 0.4;
    onTiltChange({
      y: dragRef.current.tilt.y + dx * sx,
      x: Math.max(-60, Math.min(60, dragRef.current.tilt.x - dy * sy)),
    });
  };
  const onPointerUp = (e) => {
    dragRef.current = null;
    if (e?.currentTarget) e.currentTarget.style.cursor = 'grab';
  };

  return (
    <div className="pv3d" style={{
      width: '100%',
      aspectRatio: frameless ? 'auto' : '1 / 1.15',
      height: frameless ? '100%' : undefined,
      minHeight: frameless ? 280 : undefined,
      position: 'relative',
      background: `color-mix(in srgb, ${flavorHex} 58%, #ffffff)`,
      border: frameless ? 'none' : '1px solid var(--line)',
      overflow: 'hidden',
      cursor: 'grab',
      touchAction: 'none',
      WebkitUserSelect: 'none',
      userSelect: 'none',
    }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div ref={mountRef} style={{ position: 'absolute', inset: 0 }} />
    </div>
  );
};

window.ThreeProductPreview = ThreeProductPreview;

// test hooks for the local shape lab (harmless in production)
window.__FOOFAB_LAB__ = { makeGummyShape, makeGummyGeometry, makeGummyMaterial, gummyKindFor, gummyColorFor, GUMMY_KIND_RULES, FLAVOR_COLORS };
