/* DISCLOSURE home: the eye (scroll-scrubbed frames), idle blink, the kit, the specimen rail. */
(function () {
  'use strict';
  var doc = document;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var conn = navigator.connection || {};
  var lean = conn.saveData || /2g/.test(conn.effectiveType || '') || window.matchMedia('(max-width: 700px)').matches;

  /* ---------- 1. the eye ---------- */
  var eye = doc.querySelector('.eye');
  var canvas = doc.querySelector('.eye-canvas');
  var copy = doc.querySelector('.eye-copy');
  var after = doc.querySelector('.eye-after');
  var watchers = [].slice.call(doc.querySelectorAll('.dx-nav .watcher'));
  var TOTAL = 201;

  function smooth(a, b, x) { var t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); }

  if (eye && canvas && !reduce) {
    watchers.forEach(function (w) { w.classList.add('asleep'); });
    var ctx = canvas.getContext('2d', { alpha: false });
    var frames = new Array(TOTAL);
    var ready = new Array(TOTAL);
    var cur = 0, target = 0, progress = 0, raf = 0, lastInput = performance.now(), blinking = null;
    var W = 0, H = 0;

    var size = function () {
      var r = canvas.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = canvas.width = Math.round(r.width * dpr);
      H = canvas.height = Math.round(r.height * dpr);
      ctx.imageSmoothingQuality = 'high';
      paint(Math.round(cur));
    };
    var nearest = function (i) {
      if (ready[i]) return i;
      for (var d = 1; d < TOTAL; d++) {
        if (i - d >= 0 && ready[i - d]) return i - d;
        if (i + d < TOTAL && ready[i + d]) return i + d;
      }
      return -1;
    };
    var paint = function (i) {
      var k = nearest(Math.max(0, Math.min(TOTAL - 1, i)));
      if (k < 0 || !W) return;
      var img = frames[k], iw = img.naturalWidth, ih = img.naturalHeight;
      var s = Math.max(W / iw, H / ih), dw = iw * s, dh = ih * s;
      ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
      if (!eye.classList.contains('live')) eye.classList.add('live');
    };

    /* load order: coarse to fine, a few at a time */
    var order = [], seen = {}, strides = lean ? [16, 8, 4, 2] : [16, 8, 4, 2, 1];
    strides.forEach(function (st) { for (var i = 0; i < TOTAL; i += st) if (!seen[i]) { seen[i] = 1; order.push(i); } });
    var inflight = 0, next = 0;
    var pump = function () {
      while (inflight < 6 && next < order.length) {
        (function (i) {
          inflight++;
          var img = new Image();
          img.decoding = 'async';
          img.onload = function () {
            frames[i] = img; ready[i] = true; inflight--;
            if (i === 0) size();
            pump();
          };
          img.onerror = function () { inflight--; pump(); };
          img.src = '/frames/f' + String(i + 1).padStart(3, '0') + '.webp';
        })(order[next++]);
      }
    };
    var start = function () { pump(); };
    if (doc.readyState === 'complete') setTimeout(start, 200); else window.addEventListener('load', function () { setTimeout(start, 200); });

    var readScroll = function () {
      var r = eye.getBoundingClientRect();
      var span = eye.offsetHeight - window.innerHeight;
      progress = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
      target = progress * (TOTAL - 1);
      copy.style.opacity = String(1 - smooth(0.02, 0.26, progress));
      copy.style.transform = 'translate3d(0,' + (-progress * 90).toFixed(1) + 'px,0)';
      copy.style.visibility = progress > 0.3 ? 'hidden' : '';
      after.style.opacity = String(smooth(0.6, 0.72, progress) * (1 - smooth(0.9, 0.99, progress)));
      var awake = progress > 0.86 || r.bottom < window.innerHeight * 0.6;
      watchers.forEach(function (w) { w.classList.toggle('asleep', !awake); });
    };
    var loop = function () {
      raf = 0;
      if (blinking) {
        var t = (performance.now() - blinking.t0) / blinking.dur;
        if (t >= 1) { blinking = null; cur = target; }
        else {
          var tri = t < 0.45 ? t / 0.45 : 1 - (t - 0.45) / 0.55;
          cur = blinking.from + (blinking.to - blinking.from) * (tri * tri * (3 - 2 * tri));
        }
        paint(Math.round(cur));
        raf = requestAnimationFrame(loop);
        return;
      }
      var d = target - cur;
      if (Math.abs(d) > 0.4) { cur += d * 0.18; paint(Math.round(cur)); raf = requestAnimationFrame(loop); }
      else if (cur !== target) { cur = target; paint(Math.round(cur)); }
    };
    var kick = function () { if (!raf) raf = requestAnimationFrame(loop); };
    window.addEventListener('scroll', function () { lastInput = performance.now(); readScroll(); kick(); }, { passive: true });
    window.addEventListener('resize', function () { size(); readScroll(); });
    ['pointermove', 'keydown', 'touchstart'].forEach(function (ev) { window.addEventListener(ev, function () { lastInput = performance.now(); }, { passive: true }); });
    readScroll();

    /* it blinks when you stop moving */
    setInterval(function () {
      if (doc.hidden || blinking || progress > 0.005) return;
      if (performance.now() - lastInput < 6500) return;
      if (!ready[34] || !ready[96]) return;
      blinking = { t0: performance.now(), dur: 1500, from: 0, to: 96 };
      lastInput = performance.now() + Math.random() * 9000;
      kick();
    }, 1000);
  } else if (eye) {
    eye.classList.add('still');
  }

  /* ---------- 6. the kit: the screen follows the step you are reading ---------- */
  var steps = [].slice.call(doc.querySelectorAll('.kit-step'));
  var shots = [].slice.call(doc.querySelectorAll('.kit-screen img'));
  var shotLabel = doc.querySelector('.kit-screen .label');
  if (steps.length && shots.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var i = steps.indexOf(en.target);
        steps.forEach(function (s, k) { s.classList.toggle('on', k === i); });
        shots.forEach(function (s, k) { s.classList.toggle('on', k === i); });
        if (shotLabel) shotLabel.textContent = en.target.getAttribute('data-screen') || '';
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    steps.forEach(function (s) { io.observe(s); });
  } else {
    steps.forEach(function (s) { s.classList.add('on'); });
  }

  /* ---------- 5. the specimen rail ---------- */
  var rail = doc.querySelector('.spec-rail');
  if (rail) {
    var move = function (dir) {
      var card = rail.querySelector('li');
      var step = card ? card.getBoundingClientRect().width + 16 : 300;
      rail.scrollBy({ left: dir * step, behavior: reduce ? 'auto' : 'smooth' });
    };
    var prev = doc.querySelector('.spec-prev'), nextBtn = doc.querySelector('.spec-next');
    if (prev) prev.addEventListener('click', function () { move(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { move(1); });
  }
})();
