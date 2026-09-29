/* DISCLOSURE shared behaviour: nav, the watcher, redaction, reveal, sound, analytics. */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  root.classList.remove('no-js');
  root.classList.add('js');

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  var DX = window.DX = window.DX || {};

  /* ---------- analytics (deferred, events only when gtag exists) ---------- */
  var GA_ID = 'G-XFFMNLNSXM';
  DX.track = function (name, params) {
    try { if (typeof window.gtag === 'function') window.gtag('event', name, params || {}); } catch (e) {}
  };
  function loadGA() {
    if (navigator.webdriver || window.__dxGA) return;
    window.__dxGA = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { anonymize_ip: true });
    var s = doc.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    doc.head.appendChild(s);
  }
  window.addEventListener('load', function () {
    var go = function () { setTimeout(loadGA, 2500); };
    if ('requestIdleCallback' in window) requestIdleCallback(go, { timeout: 4000 }); else go();
  });

  /* ---------- motion switch (WCAG 2.2.2): one press stills every loop, remembered ---------- */
  var motionBtns = [].slice.call(doc.querySelectorAll('.dx-motion'));
  DX.motionOff = false;
  try { DX.motionOff = localStorage.getItem('dx-motion') === 'off'; } catch (e) {}
  function applyMotion() {
    root.classList.toggle('motion-off', DX.motionOff);
    motionBtns.forEach(function (b) { b.setAttribute('aria-pressed', DX.motionOff ? 'true' : 'false'); });
    if (DX.motionOff) [].forEach.call(doc.querySelectorAll('.rx:not(.rx-fixed)'), function (el) { el.classList.add('lifted'); });
  }
  motionBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      DX.motionOff = !DX.motionOff;
      try { localStorage.setItem('dx-motion', DX.motionOff ? 'off' : 'on'); } catch (e) {}
      applyMotion();
      DX.track('motion_toggle', { off: DX.motionOff });
    });
  });
  applyMotion();

  /* ---------- nav ---------- */
  var nav = doc.querySelector('.dx-nav');
  var sheet = doc.getElementById('dx-sheet');
  var menuBtn = doc.querySelector('.dx-menu-btn');
  if (nav && nav.hasAttribute('data-over')) {
    var overLimit = function () {
      var hero = doc.querySelector('[data-hero-end]');
      return hero ? Math.max(120, hero.offsetHeight - window.innerHeight * 0.6) : window.innerHeight * 0.6;
    };
    var limit = overLimit();
    var setMode = function () { nav.setAttribute('data-mode', window.scrollY < limit ? 'over' : 'solid'); };
    window.addEventListener('scroll', setMode, { passive: true });
    window.addEventListener('resize', function () { limit = overLimit(); setMode(); });
    setMode();
  }
  function setInert(on) {
    [doc.getElementById('main'), doc.querySelector('.dx-foot'), doc.querySelector('.skip-link')].forEach(function (el) {
      if (!el) return;
      if (on) el.setAttribute('inert', ''); else el.removeAttribute('inert');
    });
  }
  function closeSheet(focusBtn) {
    if (!sheet) return;
    setInert(false);
    sheet.setAttribute('data-open', 'false');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.querySelector('.t').textContent = 'Menu';
    doc.body.style.overflow = '';
    if (focusBtn) menuBtn.focus();
  }
  if (menuBtn && sheet) {
    menuBtn.addEventListener('click', function () {
      var open = sheet.getAttribute('data-open') === 'true';
      if (open) { closeSheet(false); return; }
      sheet.setAttribute('data-open', 'true');
      setInert(true);
      menuBtn.setAttribute('aria-expanded', 'true');
      menuBtn.querySelector('.t').textContent = 'Close';
      doc.body.style.overflow = 'hidden';
      var first = sheet.querySelector('a');
      if (first) first.focus();
    });
    sheet.addEventListener('click', function (e) { if (e.target.closest('a')) closeSheet(false); });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && sheet.getAttribute('data-open') === 'true') closeSheet(true); });
    window.addEventListener('resize', function () { if (window.innerWidth > 900) closeSheet(false); });
  }

  /* ---------- the watcher ---------- */
  /* interior pages carry a larger, fainter echo of the eye in their header */
  var head = doc.querySelector('.page-head, .plate[data-watch]');
  if (head && !doc.querySelector('.eye') && window.matchMedia('(min-width: 900px)').matches) {
    var big = doc.createElementNS('http://www.w3.org/2000/svg', 'svg');
    big.setAttribute('class', 'watcher watcher-lg');
    big.setAttribute('viewBox', '0 0 34 20');
    big.setAttribute('aria-hidden', 'true');
    big.setAttribute('focusable', 'false');
    big.innerHTML = '<defs><clipPath id="dx-watch-clip-lg"><path d="M1 10C8 1.4 26 1.4 33 10 26 18.6 8 18.6 1 10Z"/></clipPath></defs>' +
      '<g class="eyeball"><g clip-path="url(#dx-watch-clip-lg)"><g class="iris-g"><circle class="iris" cx="17" cy="10" r="6.2"/>' +
      '<circle class="ring" cx="17" cy="10" r="4.4"/><ellipse class="pupil" cx="17" cy="10" rx="1.1" ry="4.9"/></g></g>' +
      '<path class="lid" d="M1 10C8 1.4 26 1.4 33 10 26 18.6 8 18.6 1 10Z"/></g>';
    head.appendChild(big);
  }
  var watchers = [].slice.call(doc.querySelectorAll('.watcher'));
  if (watchers.length) {
    var irisEls = watchers.map(function (w) { return w.querySelector('.iris-g'); });
    var blink = function () {
      watchers.forEach(function (w) { w.classList.add('blink'); });
      setTimeout(function () { watchers.forEach(function (w) { w.classList.remove('blink'); }); }, 150);
    };
    var schedule = function () {
      setTimeout(function () { if (!doc.hidden && !DX.motionOff) blink(); schedule(); }, 5000 + Math.random() * 14000);
    };
    if (!reduce.matches) schedule();
    var look = function (x, y) {
      watchers.forEach(function (w, i) {
        var r = w.getBoundingClientRect();
        var dx = x - (r.left + r.width / 2), dy = y - (r.top + r.height / 2);
        var d = Math.hypot(dx, dy) || 1;
        var k = Math.min(1, d / 300);
        var tx = (dx / d) * 4.2 * k, ty = (dy / d) * 1.8 * k;
        if (irisEls[i]) irisEls[i].setAttribute('transform', 'translate(' + tx.toFixed(2) + ' ' + ty.toFixed(2) + ')');
      });
    };
    if (finePointer.matches && !reduce.matches) {
      var raf = 0, px = 0, py = 0;
      window.addEventListener('pointermove', function (e) {
        px = e.clientX; py = e.clientY;
        if (!raf) raf = requestAnimationFrame(function () { raf = 0; look(px, py); });
      }, { passive: true });
    } else if (!reduce.matches) {
      /* touch: it glances around on its own */
      setInterval(function () {
        if (doc.hidden || DX.motionOff) return;
        look(Math.random() * window.innerWidth, Math.random() * window.innerHeight * 0.6 + 80);
      }, 4200);
    }
    DX.blink = blink;
  }

  /* ---------- it notices when you leave ---------- */
  var baseTitle = doc.title;
  doc.addEventListener('visibilitychange', function () {
    if (doc.hidden) {
      baseTitle = doc.title;
      doc.title = 'It is still here.';
      watchers.forEach(function (w) { w.classList.add('blink'); });
    } else {
      doc.title = baseTitle;
      setTimeout(function () { watchers.forEach(function (w) { w.classList.remove('blink'); }); }, 380);
    }
  });

  /* ---------- redaction that lifts once read ---------- */
  var rxs = [].slice.call(doc.querySelectorAll('.rx:not(.rx-fixed)'));
  if (rxs.length) {
    if (reduce.matches || !('IntersectionObserver' in window)) {
      rxs.forEach(function (el) { el.classList.add('lifted'); });
    } else {
      var rxIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          var el = en.target;
          rxIO.unobserve(el);
          var delay = parseInt(el.getAttribute('data-delay') || '0', 10) + 650;
          setTimeout(function () { el.classList.add('lifted'); }, delay);
        });
      }, { rootMargin: '0px 0px -22% 0px', threshold: 1 });
      rxs.forEach(function (el) { rxIO.observe(el); });
    }
  }

  /* ---------- reveal ---------- */
  var reveals = [].slice.call(doc.querySelectorAll('[data-reveal]'));
  if (reveals.length) {
    if (reduce.matches || !('IntersectionObserver' in window)) {
      reveals.forEach(function (el) { el.classList.add('in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      reveals.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------- sound: off by default, procedural, remembered per visit ---------- */
  var soundBtns = [].slice.call(doc.querySelectorAll('.dx-sound'));
  var audio = null;
  function buildAudio() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    var ctx = new AC();
    var master = ctx.createGain();
    master.gain.value = 0;
    var comp = ctx.createDynamicsCompressor();
    master.connect(comp); comp.connect(ctx.destination);

    function osc(type, freq, gain) {
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type; o.frequency.value = freq; g.gain.value = gain;
      o.connect(g); g.connect(master); o.start();
      return { o: o, g: g };
    }
    osc('sine', 55, 0.5);
    osc('sine', 55.37, 0.45);
    var hi = osc('triangle', 164.9, 0.035);
    /* a slow swell on the upper partial */
    var lfo = ctx.createOscillator(), lfoG = ctx.createGain();
    lfo.frequency.value = 0.07; lfoG.gain.value = 0.03;
    lfo.connect(lfoG); lfoG.connect(hi.g.gain); lfo.start();

    /* air: filtered noise, barely there */
    var len = ctx.sampleRate * 2, buf = ctx.createBuffer(1, len, ctx.sampleRate), data = buf.getChannelData(0);
    for (var i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    var noise = ctx.createBufferSource(); noise.buffer = buf; noise.loop = true;
    var bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 900; bp.Q.value = 0.6;
    var ng = ctx.createGain(); ng.gain.value = 0.05;
    var nl = ctx.createOscillator(), nlG = ctx.createGain();
    nl.frequency.value = 0.11; nlG.gain.value = 500; nl.connect(nlG); nlG.connect(bp.frequency); nl.start();
    noise.connect(bp); bp.connect(ng); ng.connect(master); noise.start();

    return {
      ctx: ctx,
      on: function () {
        ctx.resume();
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.setTargetAtTime(0.16, ctx.currentTime, 0.35);
      },
      off: function () {
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.setTargetAtTime(0, ctx.currentTime, 0.2);
        setTimeout(function () { if (!DX.soundOn) ctx.suspend(); }, 900);
      },
      tick: function (freq, dur) {
        if (!DX.soundOn) return;
        var o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine'; o.frequency.value = freq || 880;
        g.gain.setValueAtTime(0.0001, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.09, ctx.currentTime + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + (dur || 0.25));
        o.connect(g); g.connect(comp); o.start(); o.stop(ctx.currentTime + (dur || 0.25) + 0.05);
      }
    };
  }
  function setSound(on, remember) {
    DX.soundOn = on;
    soundBtns.forEach(function (b) {
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    if (on) { if (!audio) audio = buildAudio(); if (audio) audio.on(); }
    else if (audio) audio.off();
    if (remember) { try { sessionStorage.setItem('dx-sound', on ? '1' : '0'); } catch (e) {} }
  }
  DX.tick = function (f, d) { if (audio && DX.soundOn) audio.tick(f, d); };
  soundBtns.forEach(function (b) {
    b.addEventListener('click', function () { setSound(!DX.soundOn, true); DX.track('sound_toggle', { on: DX.soundOn }); });
  });
  var wanted = false;
  try { wanted = sessionStorage.getItem('dx-sound') === '1'; } catch (e) {}
  if (wanted && soundBtns.length) {
    /* browsers need a gesture; resume on the first one */
    var resume = function () { setSound(true, false); doc.removeEventListener('pointerdown', resume); doc.removeEventListener('keydown', resume); };
    doc.addEventListener('pointerdown', resume);
    doc.addEventListener('keydown', resume);
  }
  doc.addEventListener('visibilitychange', function () {
    if (!audio) return;
    if (doc.hidden) audio.ctx.suspend(); else if (DX.soundOn) audio.ctx.resume();
  });
})();
