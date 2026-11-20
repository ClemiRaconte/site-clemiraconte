/*
 * Scène de saison du haut de l'accueil (Clémi Raconte).
 * Lit window.clemiSaison (saison, moment, evt) posé par le script du <head>.
 * Le décor occupe le bas de la section (sa marge basse) : le texte reste toujours lisible au-dessus.
 * Clic ou toucher : le vent souffle et Ange chante. Pause automatique hors écran,
 * rien ne bouge si la personne a demandé à réduire les animations.
 */
(function () {
  var section = document.querySelector('[data-scene]');
  var toile = section && section.querySelector('canvas');
  var cs = window.clemiSaison;
  if (!toile || !cs) return;
  var ctx = toile.getContext('2d');
  var reduit = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var S = cs.saison, NUIT = cs.moment === 'nuit', EVT = cs.evt, NOEL = EVT === 'noel';
  var pause = reduit, visible = true, temps = 0, dernier = performance.now();
  var W = 0, H = 0, Z = 300, k = 1, vent = 0, chant = 0, clics = [], cri = 0;
  var particules = [], etoiles = [], nuages = [];

  var PAL = {
    automne: { cielH: '#f3d6ae', cielB: '#fbf1df', loin: '#d4bf9d', crete: '#9a5a2c', lisere: '#e8963c', sol: '#c98a45', solB: '#a8662e', sapin: '#2d6a4f' },
    hiver: { cielH: '#d9e4ec', cielB: '#f5f3ee', loin: '#c3cfd7', crete: '#2d6a4f', lisere: '#ffffff', sol: '#f7f8fa', solB: '#dfe6ec', sapin: '#244f3d' },
    printemps: { cielH: '#dcefe0', cielB: '#fbf3e3', loin: '#b7d4bd', crete: '#3f8266', lisere: '#f4c430', sol: '#8dbb6e', solB: '#6f9e55', sapin: '#2d6a4f' },
    ete: { cielH: '#fbe4a0', cielB: '#fdf3dc', loin: '#c4d6ab', crete: '#2d6a4f', lisere: '#f4c430', sol: '#b5c35c', solB: '#8fa846', sapin: '#2d6a4f' }
  };
  var N = { cielH: '#0d2620', cielB: '#22463a', loin: '#1b3a2f', crete: '#143428', sol: '#1d3a2f', solB: '#16302a', sapin: '#0d2620' };
  var P = PAL[S] || PAL.automne;
  // Neige la nuit : un sol bleuté plutôt que vert sombre
  if (S === 'hiver') { N.sol = '#8fa3ae'; N.solB = '#7d929e'; }
  var r = function (a, b) { return a + Math.random() * (b - a); };

  // ----- Géométrie : tout le décor tient dans la zone basse (Z pixels) -----
  var sol = function () { return H - Z * 0.36; };
  var creteY = function (x) {
    var i = (x / W) * 24;
    var y = H - Z * 0.72 - Math.sin(i * 0.9 + 0.2) * Z * 0.05 - Math.sin(i * 0.37 + 0.4) * Z * 0.07;
    return y - Math.exp(-Math.pow((x - W * 0.78) / (W * 0.05), 2)) * Z * 0.42;
  };

  function redim() {
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    W = section.clientWidth; H = section.clientHeight;
    Z = parseFloat(getComputedStyle(section).paddingBottom) || 300;
    k = Math.max(0.5, Math.min(1.25, Z / 380));
    toile.width = W * dpr; toile.height = H * dpr;
    toile.style.width = W + 'px'; toile.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    etoiles = Array.from({ length: 70 }, function () { return { x: Math.random() * W, y: Math.random() * (H - Z), r: r(0.4, 1.6), p: Math.random() * 6 }; });
    nuages = Array.from({ length: 4 }, function (_, i) { return { x: (i / 4) * W + r(0, 120), y: H * r(0.06, 0.28), s: r(0.7, 1.2), v: r(4, 9) }; });
    remplir();
  }

  // ----- Particules de saison -----
  function typeSaison() {
    if (NUIT && (S === 'ete' || S === 'printemps')) return 'luciole';
    return { automne: 'feuille', hiver: 'flocon', printemps: 'petale', ete: 'pollen' }[S] || 'feuille';
  }
  function nouvelle(type, partout) {
    var p = { type: type, x: Math.random() * W, y: partout ? Math.random() * H : -15, a: Math.random() * 6.28, v: r(0.4, 1) };
    if (type === 'feuille') { p.c = ['#c8642a', '#e09a3c', '#a8471f', '#d6b14a', '#b5532a'][Math.floor(r(0, 5))]; p.s = r(6, 11); }
    if (type === 'flocon') p.s = r(1.5, 3.6);
    if (type === 'petale') { p.c = ['#f6c6cf', '#ffffff', '#f9dbe1', '#f4c430'][Math.floor(r(0, 4))]; p.s = r(3.5, 6); }
    if (type === 'pollen') { if (!partout) p.y = H * r(0.6, 0.95); p.s = r(1.4, 2.6); }
    if (type === 'luciole') { p.y = H - Z * r(0.2, 1.1); p.s = r(1.8, 3); }
    return p;
  }
  function remplir() {
    var n = W < 600 ? 15 : 30, t = typeSaison();
    particules = Array.from({ length: n }, function () { return nouvelle(t, true); });
  }

  // ----- Ciel -----
  function ciel(t) {
    var g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, NUIT ? N.cielH : P.cielH); g.addColorStop(1, NUIT ? N.cielB : P.cielB);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    var ax = W * 0.88, ay = Math.max(60, H * 0.14);
    if (NUIT) {
      etoiles.forEach(function (e) { ctx.globalAlpha = 0.45 + Math.sin(t * 2 + e.p) * 0.4; ctx.fillStyle = '#fffdf7'; ctx.beginPath(); ctx.arc(e.x, e.y, e.r, 0, 6.28); ctx.fill(); });
      ctx.globalAlpha = 0.18; ctx.fillStyle = '#f7d873'; ctx.beginPath(); ctx.arc(ax, ay, 46 * k + 16, 0, 6.28); ctx.fill();
      ctx.globalAlpha = 1; ctx.beginPath(); ctx.arc(ax, ay, 28 * k + 8, 0, 6.28); ctx.fill();
      ctx.fillStyle = N.cielH; ctx.beginPath(); ctx.arc(ax + 12 * k + 4, ay - 8 * k - 3, 24 * k + 7, 0, 6.28); ctx.fill();
      if ((S === 'ete' || EVT === 'samedi') && !pause) {
        var c = (t * 0.35) % 1;
        if (c < 0.25) { var x = W * (0.3 + c * 2), y = H * (0.06 + c * 0.5); var gr = ctx.createLinearGradient(x, y, x - 60, y - 24); gr.addColorStop(0, 'rgba(255,253,247,.95)'); gr.addColorStop(1, 'rgba(255,253,247,0)'); ctx.strokeStyle = gr; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 60, y - 24); ctx.stroke(); }
      }
    } else {
      ctx.fillStyle = S === 'hiver' ? '#f3e2ab' : '#f7d873'; ctx.globalAlpha = 0.3; ctx.beginPath(); ctx.arc(ax, ay, 56 * k + 16, 0, 6.28); ctx.fill();
      ctx.globalAlpha = 1; ctx.beginPath(); ctx.arc(ax, ay, 34 * k + 10, 0, 6.28); ctx.fill();
      if (S === 'ete') { ctx.strokeStyle = 'rgba(244,196,48,.45)'; ctx.lineWidth = 3; for (var i = 0; i < 10; i++) { var a = i * 0.628 + t * 0.15; ctx.beginPath(); ctx.moveTo(ax + Math.cos(a) * (48 * k + 16), ay + Math.sin(a) * (48 * k + 16)); ctx.lineTo(ax + Math.cos(a) * (68 * k + 20), ay + Math.sin(a) * (68 * k + 20)); ctx.stroke(); } }
      nuages.forEach(function (nu) {
        if (!pause) nu.x += (nu.v + vent * 30) * 0.016;
        if (nu.x > W + 160) nu.x = -160;
        ctx.fillStyle = S === 'hiver' ? '#eef1f4' : '#ffffff'; ctx.globalAlpha = 0.7;
        var s2 = nu.s * (k * 0.7 + 0.3);
        [[0, 0, 26], [24, -10, 22], [48, 0, 24], [22, 8, 22]].forEach(function (b) { ctx.beginPath(); ctx.arc(nu.x + b[0] * s2, nu.y + b[1] * s2, b[2] * s2, 0, 6.28); ctx.fill(); });
        ctx.globalAlpha = 1;
      });
    }
  }

  // ----- Montagnes et sol -----
  function montagnes() {
    ctx.fillStyle = NUIT ? N.loin : P.loin;
    ctx.beginPath(); ctx.moveTo(0, H);
    for (var x = 0; x <= W; x += W / 30) ctx.lineTo(x, H - Z * 0.95 - Math.sin(x / W * 9 + 1) * Z * 0.08 - Math.sin(x / W * 3.3) * Z * 0.1);
    ctx.lineTo(W, H); ctx.fill();
    ctx.fillStyle = NUIT ? N.crete : P.crete;
    ctx.beginPath(); ctx.moveTo(0, H);
    for (x = 0; x <= W; x += W / 80) ctx.lineTo(x, creteY(x));
    ctx.lineTo(W, H); ctx.fill();
    ctx.strokeStyle = S === 'hiver' ? '#ffffff' : NUIT ? 'rgba(244,196,48,.8)' : P.lisere; ctx.lineWidth = S === 'hiver' ? 5 : 3;
    ctx.beginPath(); for (x = 0; x <= W; x += W / 80) { if (x) ctx.lineTo(x, creteY(x)); else ctx.moveTo(x, creteY(x)); } ctx.stroke();
    if (S === 'hiver') {
      var px = W * 0.78, py = creteY(px);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px - W * 0.045, py + Z * 0.16); ctx.lineTo(px - W * 0.022, py + Z * 0.12); ctx.lineTo(px, py + Z * 0.17); ctx.lineTo(px + W * 0.022, py + Z * 0.12); ctx.lineTo(px + W * 0.045, py + Z * 0.16); ctx.closePath(); ctx.fill();
    }
  }
  function terrain(t) {
    var y0 = sol();
    ctx.fillStyle = NUIT ? N.sol : P.sol;
    ctx.beginPath(); ctx.moveTo(0, H);
    for (var x = 0; x <= W; x += W / 40) ctx.lineTo(x, y0 - Math.sin(x / W * 7) * Z * 0.025 - Math.sin(x / W * 2.2 + 1) * Z * 0.04);
    ctx.lineTo(W, H); ctx.fill();
    ctx.fillStyle = NUIT ? N.solB : P.solB; ctx.fillRect(0, H - Z * 0.08, W, Z * 0.08);
    var i;
    if (S === 'printemps' && !NUIT) for (i = 0; i < 70; i++) { ctx.fillStyle = ['#f6c6cf', '#ffffff', '#f4c430', '#c9a2d8'][i % 4]; ctx.beginPath(); ctx.arc((i * 137) % W, y0 + 10 + ((i * 29) % (Z * 0.22)), 2.6 * k + 1.2, 0, 6.28); ctx.fill(); }
    if (S === 'automne') for (i = 0; i < 60; i++) { ctx.fillStyle = ['#c8642a', '#e09a3c', '#a8471f', '#d6b14a'][i % 4]; ctx.save(); ctx.translate((i * 113) % W, y0 + 8 + ((i * 31) % (Z * 0.24))); ctx.rotate(i); ctx.beginPath(); ctx.ellipse(0, 0, 5 * k + 2, 2.2 * k + 1, 0, 0, 6.28); ctx.fill(); ctx.restore(); }
    if (S === 'ete' || S === 'printemps') { ctx.strokeStyle = NUIT ? '#0f2a22' : S === 'ete' ? '#7e9a3a' : '#5d8f4c'; ctx.lineWidth = 1.6; for (i = 0; i < 90; i++) { var xx = (i * 41) % W, b = Math.sin(t * 1.4 + i * 0.7) * 4 + vent * 14, hh = (S === 'ete' ? 26 : 14) * k + 6 + (i % 4) * 4; ctx.beginPath(); ctx.moveTo(xx, H); ctx.quadraticCurveTo(xx + b * 0.5, H - hh * 0.6, xx + b, H - hh); ctx.stroke(); } }
    if (S === 'hiver') { ctx.fillStyle = NUIT ? 'rgba(160,178,189,.8)' : 'rgba(223,230,236,.8)'; for (i = 0; i < 6; i++) { ctx.beginPath(); ctx.ellipse((i * 211 + 60) % W, y0 + Z * 0.1, 60 * k + 20, 8 * k + 3, 0, 0, 6.28); ctx.fill(); } }
  }

  // ----- Arbres -----
  function sapin(x, y, h, neige, deco, t, sway) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(sway * 0.04);
    ctx.fillStyle = '#5a3d24'; ctx.fillRect(-h * 0.04, -h * 0.02, h * 0.08, h * 0.14);
    for (var i = 0; i < 3; i++) {
      var w = h * (0.62 - i * 0.14), yy = -h * 0.26 * i;
      ctx.fillStyle = NUIT && !deco ? N.sapin : P.sapin;
      ctx.beginPath(); ctx.moveTo(0, yy - h * 0.46); ctx.lineTo(-w / 2, yy); ctx.lineTo(w / 2, yy); ctx.closePath(); ctx.fill();
      if (neige) { ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.moveTo(0, yy - h * 0.46); ctx.lineTo(-w * 0.18, yy - h * 0.3); ctx.lineTo(-w * 0.05, yy - h * 0.33); ctx.lineTo(w * 0.06, yy - h * 0.29); ctx.lineTo(w * 0.18, yy - h * 0.3); ctx.closePath(); ctx.fill(); ctx.fillRect(-w / 2, yy - 2, w, 3); }
    }
    if (deco) {
      var couleurs = ['#f4c430', '#e2493b', '#ffffff', '#5fb0e8'];
      for (i = 0; i < 3; i++) {
        var w2 = h * (0.62 - i * 0.14), yy2 = -h * 0.26 * i;
        for (var j = 0; j < 7; j++) {
          var f = j / 6, gx = -w2 * 0.42 + f * w2 * 0.84, gy = yy2 - h * 0.08 - Math.sin(f * 3.14) * h * 0.05;
          var on = Math.sin(t * 3 + i * 2 + j) > -0.2;
          ctx.fillStyle = couleurs[(i + j) % 4]; ctx.globalAlpha = on ? 1 : 0.3;
          ctx.beginPath(); ctx.arc(gx, gy, h * 0.022, 0, 6.28); ctx.fill();
          if (on) { ctx.globalAlpha = 0.25; ctx.beginPath(); ctx.arc(gx, gy, h * 0.05, 0, 6.28); ctx.fill(); }
          ctx.globalAlpha = 1;
        }
      }
      [[-0.15, -0.12, '#e2493b'], [0.14, -0.2, '#f4c430'], [-0.08, -0.4, '#5fb0e8'], [0.1, -0.52, '#e2493b'], [0, -0.68, '#f4c430']].forEach(function (b) { ctx.fillStyle = b[2]; ctx.beginPath(); ctx.arc(b[0] * h, b[1] * h, h * 0.035, 0, 6.28); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.beginPath(); ctx.arc(b[0] * h - h * 0.01, b[1] * h - h * 0.01, h * 0.01, 0, 6.28); ctx.fill(); });
      var e = 1 + Math.sin(t * 4) * 0.12;
      ctx.save(); ctx.translate(0, -h * 0.98); ctx.scale(e, e);
      ctx.fillStyle = 'rgba(244,196,48,.3)'; ctx.beginPath(); ctx.arc(0, 0, h * 0.11, 0, 6.28); ctx.fill();
      ctx.fillStyle = '#f4c430'; ctx.beginPath(); for (i = 0; i < 10; i++) { var rr = i % 2 ? h * 0.03 : h * 0.07, a = -1.5708 + i * 0.628; ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } ctx.closePath(); ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }
  function feuillu(x, y, h, sway) {
    var bois = NUIT ? '#2a1e14' : '#6b4a2e';
    ctx.save(); ctx.translate(x, y); ctx.rotate(sway * 0.05);
    ctx.fillStyle = bois;
    ctx.beginPath(); ctx.moveTo(-h * 0.05, 0); ctx.lineTo(-h * 0.03, -h * 0.55); ctx.lineTo(h * 0.03, -h * 0.55); ctx.lineTo(h * 0.05, 0); ctx.fill();
    if (S === 'hiver') {
      ctx.lineCap = 'round';
      [[-0.3, -0.85], [0.28, -0.9], [-0.18, -1], [0.1, -1.05], [0.35, -0.7], [-0.35, -0.68]].forEach(function (b) { ctx.strokeStyle = bois; ctx.lineWidth = h * 0.025; ctx.beginPath(); ctx.moveTo(0, -h * 0.5); ctx.quadraticCurveTo(b[0] * h * 0.5, -h * 0.65, b[0] * h, b[1] * h); ctx.stroke(); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = h * 0.012; ctx.beginPath(); ctx.moveTo(b[0] * h * 0.8, b[1] * h * 0.95); ctx.lineTo(b[0] * h, b[1] * h); ctx.stroke(); });
    } else {
      var c = NUIT ? ['#173a2d', '#1d4436', '#123228'] : S === 'automne' ? ['#d0742c', '#e5a03a', '#b5532a'] : S === 'printemps' ? ['#7fb069', '#9cc47f', '#6a9e57'] : ['#3f8266', '#4f9474', '#2d6a4f'];
      [[0, -0.85, 0.36], [-0.26, -0.7, 0.28], [0.27, -0.7, 0.28], [-0.12, -1.08, 0.26], [0.16, -1.04, 0.26]].forEach(function (b, i) { ctx.fillStyle = c[i % 3]; ctx.beginPath(); ctx.arc(b[0] * h, b[1] * h, b[2] * h, 0, 6.28); ctx.fill(); });
      var i;
      if (S === 'printemps' && !NUIT) for (i = 0; i < 22; i++) { ctx.fillStyle = i % 3 ? '#f6c6cf' : '#ffffff'; ctx.beginPath(); ctx.arc(Math.cos(i * 2.4) * h * 0.38 * ((i % 5) / 5 + 0.4), -h * 0.85 + Math.sin(i * 2.4) * h * 0.28, h * 0.03, 0, 6.28); ctx.fill(); }
      if (S === 'ete' && !NUIT) for (i = 0; i < 5; i++) { ctx.fillStyle = '#e2493b'; ctx.beginPath(); ctx.arc(Math.cos(i * 1.7) * h * 0.25, -h * 0.8 + Math.sin(i * 1.7) * h * 0.2, h * 0.028, 0, 6.28); ctx.fill(); }
    }
    ctx.restore();
  }

  // ----- La cabane de la forêt conteuse -----
  function cabane(x, y, s, t) {
    var w = 120 * s, h = 80 * s, i;
    ctx.save(); ctx.translate(x, y);
    if ((S === 'automne' || S === 'hiver') && !pause) for (i = 0; i < 6; i++) { var c = (t * 0.25 + i / 6) % 1; ctx.globalAlpha = (1 - c) * 0.5; ctx.fillStyle = NUIT ? '#8aa29a' : '#cfc7bb'; ctx.beginPath(); ctx.arc(w * 0.3 + Math.sin(c * 6 + i) * 8 * s + c * 40 * s + vent * 60 * c, -h * 1.15 - c * 90 * s, (6 + c * 14) * s, 0, 6.28); ctx.fill(); }
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#7a5130'; ctx.fillRect(w * 0.24, -h * 1.25, w * 0.12, h * 0.4);
    ctx.fillStyle = NUIT ? '#4a3220' : '#9c6b3f'; ctx.fillRect(-w / 2, -h, w, h);
    ctx.strokeStyle = 'rgba(0,0,0,.18)'; ctx.lineWidth = 1.5; for (i = 1; i < 5; i++) { ctx.beginPath(); ctx.moveTo(-w / 2, -h + i * h / 5); ctx.lineTo(w / 2, -h + i * h / 5); ctx.stroke(); }
    ctx.fillStyle = NUIT ? '#5a2f1d' : '#b5532a'; ctx.beginPath(); ctx.moveTo(-w * 0.62, -h); ctx.lineTo(0, -h * 1.62); ctx.lineTo(w * 0.62, -h); ctx.closePath(); ctx.fill();
    if (S === 'hiver') { ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.moveTo(-w * 0.64, -h + 2); ctx.lineTo(0, -h * 1.64); ctx.lineTo(w * 0.64, -h + 2); ctx.lineTo(w * 0.55, -h - 6 * s); ctx.lineTo(0, -h * 1.5); ctx.lineTo(-w * 0.55, -h - 6 * s); ctx.closePath(); ctx.fill(); }
    var allume = NUIT || S === 'hiver';
    if (allume) { ctx.fillStyle = 'rgba(247,216,115,.35)'; ctx.beginPath(); ctx.arc(-w * 0.2, -h * 0.55, 30 * s, 0, 6.28); ctx.fill(); }
    ctx.fillStyle = allume ? '#f7d873' : '#cfe0d4'; ctx.fillRect(-w * 0.32, -h * 0.72, w * 0.24, h * 0.32);
    ctx.strokeStyle = '#5a3d24'; ctx.lineWidth = 2.5 * s; ctx.strokeRect(-w * 0.32, -h * 0.72, w * 0.24, h * 0.32); ctx.beginPath(); ctx.moveTo(-w * 0.2, -h * 0.72); ctx.lineTo(-w * 0.2, -h * 0.4); ctx.stroke();
    ctx.fillStyle = '#5a3d24'; ctx.fillRect(w * 0.08, -h * 0.62, w * 0.22, h * 0.62);
    if (NOEL) {
      ctx.strokeStyle = '#2d6a4f'; ctx.lineWidth = 5 * s; ctx.beginPath(); ctx.arc(w * 0.19, -h * 0.42, 9 * s, 0, 6.28); ctx.stroke();
      ctx.fillStyle = '#e2493b'; ctx.beginPath(); ctx.arc(w * 0.19, -h * 0.33, 3 * s, 0, 6.28); ctx.fill();
      for (i = 0; i <= 12; i++) { var f = i / 12, on = Math.sin(t * 3 + i) > 0; ctx.fillStyle = ['#f4c430', '#e2493b', '#5fb0e8'][i % 3]; ctx.globalAlpha = on ? 1 : 0.35; ctx.beginPath(); ctx.arc(-w * 0.6 + f * w * 1.2, -h + 4 * s + Math.sin(f * 9.4) * 3 * s, 3 * s, 0, 6.28); ctx.fill(); }
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  }

  // ----- Personnages et petits détails -----
  function bonhomme(x, y, s) {
    ctx.save(); ctx.translate(x, y);
    ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#c9d3d9'; ctx.lineWidth = 1.5;
    [[0, -18, 20], [0, -50, 15], [0, -73, 11]].forEach(function (b) { ctx.beginPath(); ctx.arc(b[0] * s, b[1] * s, b[2] * s, 0, 6.28); ctx.fill(); ctx.stroke(); });
    ctx.fillStyle = '#e09a3c'; ctx.beginPath(); ctx.moveTo(3 * s, -73 * s); ctx.lineTo(16 * s, -71 * s); ctx.lineTo(3 * s, -69 * s); ctx.fill();
    ctx.fillStyle = '#243b32'; [[-4, -77], [5, -77], [0, -55], [0, -46], [0, -37]].forEach(function (b) { ctx.beginPath(); ctx.arc(b[0] * s, b[1] * s, 1.8 * s, 0, 6.28); ctx.fill(); });
    ctx.fillStyle = '#e2493b'; ctx.fillRect(-12 * s, -64 * s, 24 * s, 5 * s); ctx.fillRect(6 * s, -62 * s, 5 * s, 14 * s);
    ctx.strokeStyle = '#6b4a2e'; ctx.lineWidth = 2 * s; ctx.beginPath(); ctx.moveTo(-14 * s, -52 * s); ctx.lineTo(-30 * s, -64 * s); ctx.moveTo(14 * s, -52 * s); ctx.lineTo(30 * s, -62 * s); ctx.stroke();
    ctx.restore();
  }
  function loup(x, y, s, t) {
    var chante = NUIT || chant > 0, i;
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = NUIT ? '#9aa7ab' : '#b9c2c5';
    ctx.beginPath(); ctx.moveTo(-26, 0); ctx.quadraticCurveTo(-48, -6, -44, -24); ctx.quadraticCurveTo(-34, -14, -20, -12); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-24, 0); ctx.bezierCurveTo(-28, -34, -8, -54, 10, -50); ctx.lineTo(18, -44); ctx.bezierCurveTo(22, -24, 22, -10, 20, 0); ctx.closePath(); ctx.fill();
    ctx.save(); ctx.translate(12, -50); ctx.rotate(chante ? -0.75 : 0);
    ctx.beginPath(); ctx.moveTo(-10, 2); ctx.bezierCurveTo(-12, -14, 0, -22, 10, -18); ctx.lineTo(28, -12); ctx.lineTo(26, -6); ctx.bezierCurveTo(16, 2, 4, 8, -10, 2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-4, -16); ctx.lineTo(-2, -30); ctx.lineTo(6, -18); ctx.fill();
    ctx.fillStyle = '#243b32'; ctx.beginPath(); ctx.arc(9, -12, 1.6, 0, 6.28); ctx.fill(); ctx.beginPath(); ctx.arc(27, -10, 2, 0, 6.28); ctx.fill();
    if (chante) { ctx.strokeStyle = '#f4c430'; ctx.lineWidth = 2; for (i = 0; i < 3; i++) { var c = (t * 0.8 + i / 3) % 1; ctx.globalAlpha = 1 - c; ctx.beginPath(); ctx.arc(30, -14, 8 + c * 26, -0.9, 0.5); ctx.stroke(); } ctx.globalAlpha = 1; }
    ctx.restore();
    if (S === 'hiver') { ctx.fillStyle = '#f4c430'; ctx.fillRect(-2, -50, 26, 7); ctx.fillRect(14, -46, 6, 16); }
    ctx.restore();
    if (chant > 0 || cri > 0) {
      var gros = cri > 0;
      ctx.save(); ctx.font = '700 ' + Math.round((gros ? 44 : 26) * s) + 'px Caveat, "Comic Sans MS", cursive';
      ctx.fillStyle = NUIT ? '#f4c430' : '#1f4d39'; ctx.globalAlpha = Math.min(1, gros ? cri : chant);
      ctx.fillText(gros ? 'AOUUUUU !' : 'AOUUU !', x + 26 * s, y - (gros ? 110 : 92) * s); ctx.restore();
    }
  }
  function champignons(x, y, s) {
    [[0, 0, 1], [14, 4, 0.7], [-12, 5, 0.6]].forEach(function (m) { var z = m[2]; ctx.fillStyle = '#f3e7d2'; ctx.fillRect(x + m[0] * s - 3 * s * z, y + m[1] * s - 10 * s * z, 6 * s * z, 10 * s * z); ctx.fillStyle = '#c0392b'; ctx.beginPath(); ctx.ellipse(x + m[0] * s, y + m[1] * s - 10 * s * z, 10 * s * z, 7 * s * z, 0, 3.14, 6.28); ctx.fill(); ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(x + m[0] * s - 3 * s * z, y + m[1] * s - 14 * s * z, 1.6 * s * z, 0, 6.28); ctx.fill(); });
  }
  function herisson(x, y, s, t) {
    var dx = pause ? 0 : Math.sin(t * 0.3) * 20 * s;
    ctx.save(); ctx.translate(x + dx, y); ctx.scale(s * (Math.cos(t * 0.3) > 0 ? 1 : -1), s);
    ctx.fillStyle = '#6b4a2e'; ctx.beginPath(); ctx.ellipse(0, -8, 16, 10, 0, 3.14, 6.28); ctx.fill();
    for (var i = 0; i < 9; i++) { var a = 3.3 + i * 0.32; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 12, -8 + Math.sin(a) * 8); ctx.lineTo(Math.cos(a) * 20, -8 + Math.sin(a) * 15); ctx.lineTo(Math.cos(a + 0.2) * 12, -8 + Math.sin(a + 0.2) * 8); ctx.fill(); }
    ctx.fillStyle = '#d9b48a'; ctx.beginPath(); ctx.ellipse(16, -6, 7, 5, 0.3, 0, 6.28); ctx.fill();
    ctx.fillStyle = '#243b32'; ctx.beginPath(); ctx.arc(22, -6, 1.6, 0, 6.28); ctx.fill();
    ctx.restore();
  }
  function cadeaux(x, y, s) {
    [[-26, 22, 18, '#e2493b', '#f4c430'], [0, 26, 24, '#2d6a4f', '#e2493b'], [24, 18, 14, '#f4c430', '#2d6a4f']].forEach(function (c) { ctx.fillStyle = c[3]; ctx.fillRect(x + (c[0] - c[1] / 2) * s, y - c[2] * s, c[1] * s, c[2] * s); ctx.fillStyle = c[4]; ctx.fillRect(x + (c[0] - 2) * s, y - c[2] * s, 4 * s, c[2] * s); ctx.fillRect(x + (c[0] - c[1] / 2) * s, y - c[2] * s * 0.6, c[1] * s, 3 * s); });
  }
  function feuDeCamp(x, y, s, t) {
    ctx.fillStyle = 'rgba(244,160,48,.22)'; ctx.beginPath(); ctx.arc(x, y - 10 * s, 60 * s, 0, 6.28); ctx.fill();
    ctx.strokeStyle = '#5a3d24'; ctx.lineWidth = 5 * s; ctx.beginPath(); ctx.moveTo(x - 16 * s, y); ctx.lineTo(x + 16 * s, y - 6 * s); ctx.moveTo(x + 16 * s, y); ctx.lineTo(x - 16 * s, y - 6 * s); ctx.stroke();
    [['#e2493b', 1], ['#f4a030', 0.75], ['#f7d873', 0.45]].forEach(function (c, i) { var f = Math.sin(t * 9 + i) * 3 * s, z = c[1]; ctx.fillStyle = c[0]; ctx.beginPath(); ctx.moveTo(x - 12 * s * z, y - 4 * s); ctx.quadraticCurveTo(x - 10 * s * z, y - 22 * s * z, x + f, y - 36 * s * z); ctx.quadraticCurveTo(x + 10 * s * z, y - 22 * s * z, x + 12 * s * z, y - 4 * s); ctx.fill(); });
  }
  function cartable(x, y, s) {
    ctx.fillStyle = '#e2493b'; ctx.fillRect(x - 14 * s, y - 26 * s, 28 * s, 26 * s);
    ctx.fillStyle = '#b5332a'; ctx.fillRect(x - 14 * s, y - 26 * s, 28 * s, 10 * s);
    ctx.strokeStyle = '#7a2a20'; ctx.lineWidth = 3 * s; ctx.beginPath(); ctx.arc(x, y - 26 * s, 7 * s, 3.14, 6.28); ctx.stroke();
    ctx.fillStyle = '#f4c430'; ctx.fillRect(x - 3 * s, y - 18 * s, 6 * s, 4 * s);
  }
  function livreOuvert(x, y, s, t) {
    ctx.fillStyle = 'rgba(247,216,115,.4)'; ctx.beginPath(); ctx.arc(x, y - 10 * s, 42 * s + Math.sin(t * 3) * 4 * s, 0, 6.28); ctx.fill();
    ctx.fillStyle = '#fffdf7'; ctx.strokeStyle = '#2d6a4f'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x - 30 * s, y - 4 * s); ctx.quadraticCurveTo(x - 15 * s, y - 14 * s, x, y - 6 * s); ctx.quadraticCurveTo(x + 15 * s, y - 14 * s, x + 30 * s, y - 4 * s); ctx.lineTo(x + 30 * s, y + 4 * s); ctx.quadraticCurveTo(x + 15 * s, y - 6 * s, x, y + 2 * s); ctx.quadraticCurveTo(x - 15 * s, y - 6 * s, x - 30 * s, y + 4 * s); ctx.closePath(); ctx.fill(); ctx.stroke();
    for (var i = 0; i < 6; i++) { var c = (t * 0.5 + i / 6) % 1; ctx.globalAlpha = 1 - c; ctx.fillStyle = '#f4c430'; var ex = x + Math.sin(i * 2 + t) * 20 * s, ey = y - 10 * s - c * 80 * s; ctx.beginPath(); for (var j = 0; j < 10; j++) { var rr = j % 2 ? 2 * s : 5 * s, a = -1.57 + j * 0.628; ctx.lineTo(ex + Math.cos(a) * rr, ey + Math.sin(a) * rr); } ctx.fill(); }
    ctx.globalAlpha = 1;
  }
  function guirlandeHaut(t) {
    ctx.strokeStyle = 'rgba(36,59,50,.5)'; ctx.lineWidth = 1.5; ctx.beginPath();
    for (var x = 0; x <= W; x += 6) ctx.lineTo(x, 6 + Math.abs(Math.sin((x / W) * 3.14 * 6)) * 16);
    ctx.stroke();
    for (var i = 0; i <= 36; i++) { var xx = (i / 36) * W, y = 8 + Math.abs(Math.sin((xx / W) * 3.14 * 6)) * 16, on = Math.sin(t * 2.5 + i * 1.3) > -0.1; ctx.fillStyle = ['#f4c430', '#e2493b', '#5fb0e8', '#ffffff'][i % 4]; ctx.globalAlpha = on ? 1 : 0.3; ctx.beginPath(); ctx.ellipse(xx, y + 5, 3.5, 5, 0, 0, 6.28); ctx.fill(); if (on) { ctx.globalAlpha = 0.2; ctx.beginPath(); ctx.arc(xx, y + 5, 10, 0, 6.28); ctx.fill(); } }
    ctx.globalAlpha = 1;
  }
  function volants(t) {
    var i, c, x, y;
    if (S === 'automne' && !NUIT) {
      c = (t * 0.04) % 1; var bx = -100 + c * (W + 200), by = H - Z * 1.1;
      ctx.strokeStyle = '#3a2e25'; ctx.lineWidth = 1.8;
      for (i = -3; i <= 3; i++) { x = bx - Math.abs(i) * 18 * k - 6; y = by + i * 10 * k; var b = Math.sin(t * 8 + i) * 3; ctx.beginPath(); ctx.moveTo(x - 7, y - b); ctx.quadraticCurveTo(x - 3, y - 4, x, y); ctx.quadraticCurveTo(x + 3, y - 4, x + 7, y - b); ctx.stroke(); }
    }
    if ((S === 'printemps' || S === 'ete') && !NUIT) {
      for (i = 0; i < 3; i++) {
        x = (W * (0.45 + i * 0.18) + Math.sin(t * 0.5 + i) * 80 + t * 12 * (i % 2 ? 1 : -1)) % W; if (x < 0) x += W;
        y = H - Z * (0.55 + i * 0.12) + Math.sin(t * 1.3 + i * 2) * 20;
        var bb = Math.abs(Math.sin(t * 10 + i));
        if (S === 'printemps') { ctx.fillStyle = ['#f4c430', '#f6a6b6', '#9ec5f0'][i]; ctx.beginPath(); ctx.ellipse(x - 5 * bb, y, 6 * bb + 1, 4, -0.4, 0, 6.28); ctx.ellipse(x + 5 * bb, y, 6 * bb + 1, 4, 0.4, 0, 6.28); ctx.fill(); ctx.fillStyle = '#243b32'; ctx.fillRect(x - 1, y - 4, 2, 8); }
        else { ctx.fillStyle = 'rgba(158,197,240,.7)'; ctx.beginPath(); ctx.ellipse(x, y - 4, 10, 2.5 * bb + 0.5, 0, 0, 6.28); ctx.ellipse(x, y + 2, 9, 2.5 * bb + 0.5, 0, 0, 6.28); ctx.fill(); ctx.fillStyle = '#2d6a4f'; ctx.fillRect(x - 12, y - 1, 18, 2.5); }
      }
    }
    if (EVT === 'rentree') for (i = 0; i < 2; i++) {
      c = (t * 0.06 + i * 0.5) % 1; x = -60 + c * (W + 120); y = H - Z * (1.0 + i * 0.25) + Math.sin(c * 12) * 18;
      ctx.save(); ctx.translate(x, y); ctx.rotate(Math.cos(c * 12) * 0.25); ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#5b6b63'; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(22, 0); ctx.lineTo(-14, -9); ctx.lineTo(-6, 0); ctx.lineTo(-14, 9); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(22, 0); ctx.lineTo(-6, 0); ctx.stroke(); ctx.restore();
    }
  }
  function lesParticules(t, dt) {
    particules.forEach(function (p) {
      if (dt) {
        var v = vent * 6;
        if (p.type === 'feuille') { p.y += p.v * 0.9 * dt; p.x += (Math.sin(t + p.a) * 0.8 + v) * dt; p.a += 0.012 * dt; }
        else if (p.type === 'flocon') { p.y += p.v * 0.7 * dt; p.x += (Math.sin(t * 0.8 + p.a) * 0.4 + v) * dt; }
        else if (p.type === 'petale') { p.y += p.v * 0.5 * dt; p.x += (0.6 + Math.sin(t + p.a) * 0.6 + v) * dt; p.a += 0.02 * dt; }
        else if (p.type === 'pollen') { p.y -= p.v * 0.25 * dt; p.x += (Math.sin(t * 0.6 + p.a) * 0.3 + v) * dt; }
        else if (p.type === 'luciole') { p.x += (Math.cos(t * 0.7 + p.a) * 0.5 + v * 0.5) * dt; p.y += Math.sin(t * 0.9 + p.a) * 0.35 * dt; }
        if (p.y > H + 20 || p.y < -30 || p.x > W + 30 || p.x < -30) { var n = nouvelle(p.type, false); for (var c in n) p[c] = n[c]; if (p.type === 'pollen') p.y = H * 0.95; if (vent > 0.3) p.x = r(-20, W * 0.3); }
      }
      ctx.save(); ctx.translate(p.x, p.y);
      if (p.type === 'feuille') { ctx.rotate(p.a); ctx.fillStyle = p.c; ctx.beginPath(); ctx.moveTo(-p.s, 0); ctx.quadraticCurveTo(0, -p.s * 0.6, p.s, 0); ctx.quadraticCurveTo(0, p.s * 0.6, -p.s, 0); ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,.18)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-p.s, 0); ctx.lineTo(p.s, 0); ctx.stroke(); }
      else if (p.type === 'flocon') { ctx.fillStyle = NUIT ? '#e8eef2' : '#ffffff'; ctx.shadowColor = 'rgba(36,59,50,.3)'; ctx.shadowBlur = 2; ctx.beginPath(); ctx.arc(0, 0, p.s, 0, 6.28); ctx.fill(); }
      else if (p.type === 'petale') { ctx.rotate(p.a); ctx.fillStyle = p.c; ctx.beginPath(); ctx.ellipse(0, 0, p.s, p.s * 0.55, 0, 0, 6.28); ctx.fill(); }
      else if (p.type === 'pollen') { ctx.globalAlpha = 0.75; ctx.fillStyle = '#f4c430'; ctx.beginPath(); ctx.arc(0, 0, p.s, 0, 6.28); ctx.fill(); }
      else if (p.type === 'luciole') { var l = 0.35 + Math.abs(Math.sin(t * 2 + p.a)) * 0.65; ctx.globalAlpha = l * 0.3; ctx.fillStyle = '#f4c430'; ctx.beginPath(); ctx.arc(0, 0, p.s * 4.5, 0, 6.28); ctx.fill(); ctx.globalAlpha = l; ctx.beginPath(); ctx.arc(0, 0, p.s, 0, 6.28); ctx.fill(); }
      ctx.restore();
    });
    ctx.globalAlpha = 1;
  }

  // ----- Composition -----
  function dessiner(now) {
    var dt = Math.min(3, (now - dernier) / 16.7); dernier = now;
    if (!pause) { temps += dt / 60; vent *= Math.pow(0.97, dt); chant = Math.max(0, chant - 0.01 * dt); cri = Math.max(0, cri - 0.008 * dt); }
    var t = temps, s = k, y0 = sol(), sway = Math.sin(t * 1.2) * 0.3 + vent * 2;
    var etroit = W < 700;
    ciel(t);
    montagnes();
    volants(t);
    terrain(t);
    feuillu(W * (etroit ? 0.06 : 0.05), y0 + 6, 105 * s, sway);
    sapin(W * 0.2, y0 + 8, 80 * s, S === 'hiver', false, t, sway);
    if (!etroit) feuillu(W * 0.34, y0 + 6, 90 * s, sway);
    feuillu(W * 0.86, y0 + 6, 95 * s, sway);
    sapin(W * 0.95, y0 + 12, (NOEL ? 165 : 115) * s, S === 'hiver', NOEL, t, NOEL ? sway * 0.3 : sway);
    if (!etroit) sapin(W * 0.99, y0 + 18, 70 * s, S === 'hiver', false, t, sway);
    if (NOEL) cadeaux(W * 0.95, y0 + 28 * s, s);
    cabane(W * (etroit ? 0.38 : 0.47), y0 + 20 * s, s, t);
    if (S === 'hiver') bonhomme(W * (etroit ? 0.6 : 0.56), y0 + 32 * s, s * 0.85);
    if (S === 'automne') { champignons(W * (etroit ? 0.58 : 0.55), y0 + 28 * s, s); herisson(W * (etroit ? 0.12 : 0.27), y0 + 38 * s, s * 0.85, t); }
    if (S === 'ete' && NUIT) feuDeCamp(W * (etroit ? 0.6 : 0.56), y0 + 32 * s, s, t);
    if (EVT === 'rentree') cartable(W * (etroit ? 0.24 : 0.39), y0 + 34 * s, s);
    loup(W * (etroit ? 0.78 : 0.7), y0 + 26 * s, s, t);
    if (EVT === 'samedi') livreOuvert(W * (etroit ? 0.66 : 0.63), y0 + 34 * s, s, t);
    lesParticules(t, pause ? 0 : dt);
    if (NOEL) guirlandeHaut(t);
    if (visible && !document.hidden && !pause) requestAnimationFrame(dessiner);
  }

  // ----- Interactions -----
  section.addEventListener('click', function (e) {
    if (e.target.closest('a, button')) return;
    vent = 1; chant = 1.6;
    var maintenant = performance.now();
    clics = clics.filter(function (c) { return maintenant - c < 2500; }); clics.push(maintenant);
    if (clics.length >= 5) { cri = 2.2; clics = []; }
    var astuce = section.querySelector('[data-scene-astuce]'); if (astuce) astuce.hidden = true;
    if (pause) { pause = false; majPause(); dernier = performance.now(); requestAnimationFrame(dessiner); }
  });
  var bouton = section.querySelector('[data-scene-pause]');
  function majPause() { if (!bouton) return; bouton.textContent = pause ? 'Animer la forêt' : 'Mettre en pause'; bouton.setAttribute('aria-pressed', String(pause)); }
  if (bouton) bouton.addEventListener('click', function () { pause = !pause; majPause(); if (!pause) { dernier = performance.now(); requestAnimationFrame(dessiner); } });
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { var v = es[0].isIntersecting; if (v && !visible && !pause) { visible = true; dernier = performance.now(); requestAnimationFrame(dessiner); } visible = v; }).observe(section);
  document.addEventListener('visibilitychange', function () { if (!document.hidden && visible && !pause) { dernier = performance.now(); requestAnimationFrame(dessiner); } });
  var attente; addEventListener('resize', function () { clearTimeout(attente); attente = setTimeout(function () { redim(); if (pause) requestAnimationFrame(dessiner); }, 150); });

  // Texte d'accueil selon la saison, l'heure et le rendez-vous
  var sur = section.querySelector('[data-scene-sur]');
  if (sur) {
    var hr = cs.paris().getHours();
    var phrases = { automne: 'Les feuilles tombent sur la forêt de Daillon', hiver: 'La neige a recouvert le Champsaur', printemps: 'Tout refleurit dans la forêt conteuse', ete: 'L’été dans la forêt conteuse' };
    var texte = EVT === 'samedi' ? 'Nouvelle histoire ce matin !'
      : NUIT ? 'Bonsoir ! C’est bientôt l’heure de l’histoire'
      : NOEL ? 'Joyeux Noël dans la forêt conteuse'
      : EVT === 'rentree' ? 'C’est la rentrée dans la forêt conteuse'
      : (hr < 12 ? 'Bonjour ! ' : '') + (phrases[S] || '');
    if (texte) sur.textContent = texte;
  }

  majPause();
  redim();
  requestAnimationFrame(dessiner);
})();
