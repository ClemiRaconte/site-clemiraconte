/*
 * Fond de saison sur tout le site (Clémi Raconte).
 * Des feuilles (automne), des flocons (hiver), des pétales (printemps) ou des fleurs des prés (été)
 * passent devant la page sans jamais bloquer un clic. Lit window.clemiSaison (posé dans le <head>).
 * Plus calme sur les pages d'achat et de contact (body[data-fond="calme"]).
 * Sur l'accueil, il attend que la scène du haut soit sortie de l'écran pour ne pas faire doublon.
 * Rien ne bouge si la personne a demandé à réduire les animations ; pause quand l'onglet est caché.
 */
(function () {
  var cs = window.clemiSaison;
  if (!cs || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var calme = document.body.dataset.fond === 'calme';
  var S = cs.saison;
  var toile = document.createElement('canvas');
  toile.className = 'fond-saison';
  toile.setAttribute('aria-hidden', 'true');
  document.body.appendChild(toile);
  var ctx = toile.getContext('2d');
  var W = 0, H = 0, elements = [], temps = 0, dernier = performance.now(), souffle = 0, dernierY = scrollY, actif = true;
  var r = function (a, b) { return a + Math.random() * (b - a); };

  function nombre() { var n = calme ? 7 : 18; return W < 600 ? Math.round(n * 0.55) : n; }
  function nouveau(partout) {
    var e = { x: Math.random() * W, y: partout ? Math.random() * H : -20, a: Math.random() * 6.28, v: r(0.35, 0.9) * (calme ? 0.7 : 1), o: r(0.55, 0.9) };
    if (S === 'automne') { e.c = ['#c8642a', '#e09a3c', '#a8471f', '#d6b14a'][Math.floor(r(0, 4))]; e.t = r(7, 12); }
    if (S === 'hiver') { e.t = r(1.8, 4); e.o = r(0.6, 0.95); }
    if (S === 'printemps') { e.c = ['#f6c6cf', '#f9dbe1', '#ffffff', '#f3a9bb'][Math.floor(r(0, 4))]; e.t = r(4, 7); }
    if (S === 'ete') { e.c = ['#e2493b', '#ffffff', '#f4c430', '#c9a2d8'][Math.floor(r(0, 4))]; e.t = r(4.5, 7.5); e.papillon = !calme && Math.random() < 0.12; }
    return e;
  }
  function remplir() { elements = Array.from({ length: nombre() }, function () { return nouveau(true); }); }
  function redim() { var d = Math.min(2, devicePixelRatio || 1); W = innerWidth; H = innerHeight; toile.width = W * d; toile.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0); remplir(); }

  function contour() { ctx.strokeStyle = 'rgba(36,59,50,.25)'; ctx.lineWidth = 1; }
  var dessins = {
    automne: function (e) { ctx.rotate(e.a); ctx.fillStyle = e.c; ctx.beginPath(); ctx.moveTo(-e.t, 0); ctx.quadraticCurveTo(0, -e.t * 0.6, e.t, 0); ctx.quadraticCurveTo(0, e.t * 0.6, -e.t, 0); ctx.fill(); contour(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-e.t, 0); ctx.lineTo(e.t, 0); ctx.stroke(); },
    hiver: function (e) { ctx.fillStyle = '#ffffff'; ctx.shadowColor = 'rgba(36,59,50,.45)'; ctx.shadowBlur = 3; ctx.beginPath(); ctx.arc(0, 0, e.t, 0, 6.28); ctx.fill(); ctx.shadowBlur = 0; if (e.t > 3.2) { ctx.strokeStyle = 'rgba(129,167,189,.7)'; ctx.lineWidth = 1; for (var i = 0; i < 3; i++) { ctx.rotate(1.047); ctx.beginPath(); ctx.moveTo(-e.t * 2, 0); ctx.lineTo(e.t * 2, 0); ctx.stroke(); } } },
    printemps: function (e) { ctx.rotate(e.a); ctx.fillStyle = e.c; ctx.beginPath(); ctx.ellipse(0, 0, e.t, e.t * 0.55, 0, 0, 6.28); ctx.fill(); contour(); ctx.stroke(); },
    ete: function (e) {
      if (e.papillon) { var b = Math.abs(Math.sin(temps * 9 + e.a)); ctx.fillStyle = '#f4c430'; ctx.beginPath(); ctx.ellipse(-5 * b, 0, 6 * b + 1, 4, -0.4, 0, 6.28); ctx.ellipse(5 * b, 0, 6 * b + 1, 4, 0.4, 0, 6.28); ctx.fill(); ctx.fillStyle = '#243b32'; ctx.fillRect(-1, -4, 2, 8); return; }
      ctx.rotate(e.a); ctx.fillStyle = e.c; for (var i = 0; i < 5; i++) { ctx.rotate(1.2566); ctx.beginPath(); ctx.ellipse(e.t * 0.6, 0, e.t * 0.55, e.t * 0.32, 0, 0, 6.28); ctx.fill(); }
      ctx.fillStyle = e.c === '#f4c430' ? '#c8642a' : '#f4c430'; ctx.beginPath(); ctx.arc(0, 0, e.t * 0.3, 0, 6.28); ctx.fill();
    }
  };
  var dessin = dessins[S] || dessins.automne;

  function boucle(now) {
    var dt = Math.min(3, (now - dernier) / 16.7); dernier = now; temps += dt / 60;
    ctx.clearRect(0, 0, W, H);
    var pousse = souffle * 0.12; souffle *= 0.9;
    elements.forEach(function (e) {
      if (S === 'ete' && e.papillon) { e.x += Math.cos(temps * 0.7 + e.a) * 1.1 * dt; e.y += (Math.sin(temps * 1.1 + e.a) * 0.6 - pousse) * dt; }
      else {
        var vitesse = { automne: 0.9, hiver: 0.6, printemps: 0.5, ete: 0.45 }[S] || 0.8;
        e.y += (e.v * vitesse - pousse) * dt;
        e.x += (S === 'printemps' ? 0.5 + Math.sin(temps + e.a) * 0.6 : Math.sin(temps * 0.9 + e.a) * (S === 'hiver' ? 0.4 : 0.75)) * dt;
        e.a += 0.014 * dt;
      }
      if (e.y > H + 24 || e.y < -40 || e.x > W + 30 || e.x < -30) { var n = nouveau(false); var monte = e.y < -40; for (var k in n) e[k] = n[k]; if (monte) e.y = H + 10; }
      ctx.save(); ctx.globalAlpha = e.o; ctx.translate(e.x, e.y); dessin(e); ctx.restore();
    });
    if (actif && !document.hidden) requestAnimationFrame(boucle);
  }
  function relancer() { if (actif && !document.hidden) { dernier = performance.now(); requestAnimationFrame(boucle); } }

  // Accueil : la scène du haut a déjà ses propres éléments ; le fond prend le relais quand elle sort de l'écran
  var scene = document.querySelector('[data-scene]');
  if (scene && 'IntersectionObserver' in window) {
    actif = false; toile.style.opacity = '0';
    new IntersectionObserver(function (es) {
      var avant = actif; actif = !es[0].isIntersecting;
      toile.style.opacity = actif ? '1' : '0';
      if (actif && !avant) relancer();
    }, { threshold: 0.15 }).observe(scene);
  }
  addEventListener('scroll', function () { souffle += (scrollY - dernierY) * 0.05; dernierY = scrollY; }, { passive: true });
  addEventListener('resize', redim);
  document.addEventListener('visibilitychange', relancer);
  redim();
  relancer();
})();
