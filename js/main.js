(function () {
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  // nav scroll state
  var nav = $('#nav');
  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 40); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // menu overlay
  var toggle = $('#menuToggle'), menu = $('#menu');
  function setMenu(open) {
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', String(!open));
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.menu-label').textContent = open ? 'Fechar' : 'Menu';
    document.body.classList.toggle('menu-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  toggle.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
  $$('#menu a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  // reveal on scroll
  var els = $$('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });
  } else { els.forEach(function (el) { el.classList.add('in'); }); }

  // count-up stats
  function fmt(n, dec) { return n.toFixed(dec).replace('.', ','); }
  var cio = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      cio.unobserve(en.target);
      var el = en.target, end = parseFloat(el.dataset.count), dec = parseInt(el.dataset.dec || '0', 10), suf = el.dataset.suffix || '';
      var t0 = performance.now(), dur = 1400;
      (function step(t) {
        var p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(end * e, dec) + (p === 1 ? suf : '');
        if (p < 1) requestAnimationFrame(step);
      })(t0);
    });
  }, { threshold: 0.6 });
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) $$('[data-count]').forEach(function (el) { cio.observe(el); });

  // video player
  var player = $('#player'), vid = $('#vid'), btn = $('#playBtn');
  function togglePlay() {
    if (vid.paused) { vid.play(); } else { vid.pause(); }
  }
  btn.addEventListener('click', togglePlay);
  vid.addEventListener('click', togglePlay);
  vid.addEventListener('play', function () { player.classList.add('playing'); btn.setAttribute('aria-label', 'Pausar vídeo'); });
  vid.addEventListener('pause', function () { player.classList.remove('playing'); btn.setAttribute('aria-label', 'Reproduzir vídeo'); });
  // pause when scrolled out of view
  new IntersectionObserver(function (e) { if (!e[0].isIntersecting && !vid.paused) vid.pause(); }, { threshold: 0.2 }).observe(player);

  // testimonial slider
  var slider = $('#slider');
  function step(dir) {
    var card = slider.querySelector('.tcard');
    slider.scrollBy({ left: dir * (card.offsetWidth + 24), behavior: 'smooth' });
  }
  $('#prev').addEventListener('click', function () { step(-1); });
  $('#next').addEventListener('click', function () { step(1); });

  // FAQ: one open at a time
  var items = $$('.acc details');
  items.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) items.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });
})();
