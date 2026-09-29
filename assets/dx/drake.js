/* DISCLOSURE: Drake equation calculator + Kardashev gauge (/tools/drake/).
   Runs entirely in the browser. The URL hash carries the seven values so a link
   reopens the same result; nothing is stored or sent. */
(function () {
  'use strict';
  var doc = document;
  var terms = [].slice.call(doc.querySelectorAll('.dk-term'));
  if (!terms.length) return;
  var $ = function (id) { return doc.getElementById(id); };
  var DX = window.DX || {};
  var KEYS = ['r', 'fp', 'ne', 'fl', 'fi', 'fc', 'l'];
  var SHORT = { r: 'R*', fp: 'fp', ne: 'ne', fl: 'fl', fi: 'fi', fc: 'fc', l: 'L' };
  var CARD_NAME = { r: 'New stars a year', fp: 'Stars with planets', ne: 'Habitable planets each', fl: 'Where life starts', fi: 'Life turned intelligent', fc: 'Detectable', l: 'Years detectable' };
  var SITE = 'https://www.getdisclosure.app/tools/drake/';

  var PRESETS = {
    pessimist: { r: 1, fp: 1, ne: 0.2, fl: 0.001, fi: 0.001, fc: 0.1, l: 1000 },
    drake: { r: 1, fp: 0.2, ne: 1, fl: 1, fi: 1, fc: 0.1, l: 1000 },
    optimist: { r: 3, fp: 1, ne: 0.9, fl: 1, fi: 0.5, fc: 0.5, l: 1000000 },
    yours: { r: 7, fp: 1, ne: 0.5, fl: 0.1, fi: 0.01, fc: 0.1, l: 10000 }
  };
  var FIXED = ['pessimist', 'drake', 'optimist'];
  var NAMES = { pessimist: 'Pessimist', drake: 'Drake 1961', optimist: 'Optimist', yours: 'Your guess' };
  var NOTES = {
    pessimist: 'Pessimist: our illustration, not a published estimate. Planets are common, but life and intelligence are rare flukes and signals fade within a thousand years.',
    drake: 'Drake 1961: the low end of the ranges the 1961 Green Bank meeting agreed on. The high end gives about 50 million. The group concluded N is roughly equal to L.',
    optimist: 'Optimist: our illustration, not a published estimate. Life starts wherever it can and civilizations stay detectable for a million years.',
    yours: 'Your guess: your own numbers. The page address now carries them, so a copied link opens the same result.'
  };

  var rows = {};
  terms.forEach(function (li) {
    var k = li.getAttribute('data-term');
    var range = li.querySelector('.dk-range');
    var num = li.querySelector('.dk-num');
    var err = doc.createElement('p');
    err.className = 'dk-err';
    err.id = 'dk-' + k + '-err';
    err.setAttribute('aria-live', 'polite');
    num.parentNode.parentNode.insertBefore(err, num.parentNode.nextSibling);
    num.setAttribute('aria-describedby', err.id);
    rows[k] = {
      num: num, range: range, err: err, log: range.hasAttribute('data-log'),
      max: +num.max, sym: li.querySelector('.dk-sym').textContent.replace(/\s+/g, '')
    };
  });

  var vals = {};
  var bad = {};
  var current = 'drake';

  /* ---------- number formatting ---------- */
  function trim(s) { return s.indexOf('e') < 0 && s.indexOf('.') >= 0 ? s.replace(/0+$/, '').replace(/\.$/, '') : s; }
  function sig(n, d) { return +n.toPrecision(d); }
  function plain(n) {
    if (n === 0) return '0';
    if (n >= 1e12 || n < 1e-7) return null;
    if (n >= 10) return Math.round(n).toLocaleString('en-US');
    return trim(sig(n, 2).toFixed(Math.max(0, 1 - Math.floor(Math.log10(n)))));
  }
  function sci(n) {
    var e = Math.floor(Math.log10(n));
    var m = trim(sig(n / Math.pow(10, e), 2).toFixed(1));
    if (m === '10') { m = '1'; e += 1; }
    return { m: m, e: e };
  }
  function inputText(n) {
    if (!isFinite(n)) return '';
    if (n === 0) return '0';
    var s = sig(n, 3);
    return Math.abs(s) >= 1e-6 && Math.abs(s) < 1e15 ? trim(s.toFixed(Math.max(0, 2 - Math.floor(Math.log10(Math.abs(s)))))) : String(s);
  }
  function hashText(n) { return String(+(+n).toPrecision(6)); }
  function comma(n) { return Math.round(n).toLocaleString('en-US'); }
  var ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  var TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  function words(n) {
    if (n < 20) return ONES[n];
    if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? '-' + ONES[n % 10] : '');
    return ONES[Math.floor(n / 100)] + ' hundred' + (n % 100 ? ' and ' + words(n % 100) : '');
  }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function sayN(n) {
    if (n === 0) return 'None. With any term at zero, the galaxy is silent.';
    if (n < 1) return 'Less than one. On these numbers a detectable civilization is rarer than one per galaxy at any moment, so we would be a lucky exception.';
    if (n < 1.5) return 'About one. On these numbers, that one is probably us.';
    if (n < 1000) return cap(words(Math.round(n))) + ' civilizations.';
    var units = [[1e12, 'trillion'], [1e9, 'billion'], [1e6, 'million'], [1e3, 'thousand']];
    for (var i = 0; i < units.length; i++) {
      if (n >= units[i][0]) {
        var v = sig(n / units[i][0], 3);
        if (v >= 1000 && i === 0) return 'About ' + Math.round(v).toLocaleString('en-US') + ' trillion civilizations.';
        return 'About ' + trim(String(v)) + ' ' + units[i][1] + ' civilizations.';
      }
    }
    return '';
  }
  function renderN(el, n) {
    el.textContent = '';
    var p = plain(n);
    if (p !== null) { el.textContent = p; return p; }
    var s = sci(n);
    el.appendChild(doc.createTextNode(s.m + ' × 10'));
    var sup = doc.createElement('sup'); sup.textContent = String(s.e).replace('-', '−');
    el.appendChild(sup);
    return s.m + ' x 10^' + s.e;
  }
  function powText(el, x) {
    /* write 10 to the power x (rounded) as text + <sup> */
    var e = Math.round(x);
    el.appendChild(doc.createTextNode('10'));
    var sup = doc.createElement('sup'); sup.textContent = String(e).replace('-', '−');
    el.appendChild(sup);
  }

  /* ---------- nearest neighbour: a stated model, not a measurement ---------- */
  var DISC_R = 50000, DISC_H = 1000;            // light-years: a flat disc 100,000 across, 1,000 thick
  var DISC_A = Math.PI * DISC_R * DISC_R;        // face area, ly^2
  var DISC_V = DISC_A * DISC_H;                  // volume, ly^3
  function spacing(n) {
    var s3 = Math.cbrt(DISC_V / n);
    return s3 > DISC_H ? Math.sqrt(DISC_A / n) : s3;   // farther apart than the disc is thick: spread across its face
  }
  function nearText(n) {
    if (n < 1) return 'Fewer than one: on these numbers, we may be alone in the galaxy right now.';
    if (n < 2) return 'About one: on these numbers the one is probably us, so there is no neighbour to measure to.';
    var s = spacing(n);
    var d = s >= 100 ? comma(sig(s, 2)) : s >= 10 ? comma(s) : trim(s.toFixed(1));
    return 'Spread evenly through our model galaxy, a flat disc 100,000 light-years across and 1,000 thick, neighbours would sit about ' +
      d + ' light-years apart. A radio signal would take about ' + d + ' years to cross that gap one way.';
  }

  /* ---------- controls ---------- */
  function showErr(k, msg, isError) {
    var row = rows[k];
    row.err.textContent = msg || '';
    row.err.classList.toggle('is-error', !!(msg && isError));
    if (isError) row.num.setAttribute('aria-invalid', 'true'); else row.num.removeAttribute('aria-invalid');
  }
  function setRow(k, v, from) {
    var row = rows[k];
    vals[k] = v;
    delete bad[k];
    if (from !== 'num') { row.num.value = inputText(v); showErr(k, ''); }
    if (from !== 'range') {
      var min = +row.range.min, max = +row.range.max;
      var x = row.log ? (v > 0 ? Math.log10(v) : min) : v;
      row.range.value = String(Math.min(max, Math.max(min, x)));
    }
    if (row.log) row.range.setAttribute('aria-valuetext', inputText(v));
  }
  function apply(p) { KEYS.forEach(function (k) { setRow(k, p[k]); }); }
  function select(name) {
    current = name;
    [].forEach.call(doc.querySelectorAll('.dk-preset'), function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-preset') === name ? 'true' : 'false');
    });
    $('dk-note').textContent = NOTES[name];
  }
  function toYours() {
    if (current !== 'yours') select('yours');
    KEYS.forEach(function (k) { if (!bad[k]) PRESETS.yours[k] = vals[k]; });
  }
  function maxWord(k) {
    var row = rows[k];
    return row.max === 1 ? row.sym + ' is a fraction, so 1 is the most it can be.' : 'The largest value this calculator takes for ' + row.sym + ' is ' + comma(row.max) + '.';
  }
  function readNum(k) {
    var row = rows[k];
    var raw = row.num.value.trim();
    if (raw === '') {
      bad[k] = true;
      showErr(k, row.num.validity && row.num.validity.badInput ? 'That is not a number yet. Type digits, like 0.5.' : 'Enter a number from 0 to ' + comma(row.max) + '. N waits until this box has one.', true);
      return;
    }
    var v = parseFloat(raw);
    if (!isFinite(v)) { bad[k] = true; showErr(k, 'That is not a number yet. Type digits, like 0.5.', true); return; }
    if (v < 0) { bad[k] = true; showErr(k, 'Negative values do not work here: every term is a count or a share, so the smallest is 0.', true); return; }
    var note = '';
    if (v > row.max) { v = row.max; row.num.value = inputText(v); note = 'Capped. ' + maxWord(k); }
    setRow(k, v, 'num');
    showErr(k, note, false);
  }

  KEYS.forEach(function (k) {
    var row = rows[k];
    row.range.addEventListener('input', function () {
      var x = +row.range.value;
      var v = row.log ? sig(Math.pow(10, x), 2) : x;
      setRow(k, v, 'range');
      row.num.value = inputText(v);
      showErr(k, '');
      toYours();
      compute(true);
    });
    row.num.addEventListener('input', function () {
      readNum(k);
      toYours();
      compute(true);
    });
  });
  [].forEach.call(doc.querySelectorAll('.dk-preset'), function (b) {
    b.addEventListener('click', function () {
      var name = b.getAttribute('data-preset');
      hideNotice();
      select(name);
      apply(PRESETS[name]);
      compute(true);
      if (DX.track) DX.track('drake_preset', { preset: name });
    });
  });

  /* ---------- notices for shared links ---------- */
  function showNotice(text) { var n = $('dk-notice'); if (!n) return; n.textContent = text; n.hidden = false; }
  function hideNotice() { var n = $('dk-notice'); if (n && !n.hidden) { n.hidden = true; n.textContent = ''; } }

  /* ---------- the result ---------- */
  var liveTimer = 0, lastLive = '', shown = '', lastN = 20;
  function product() { var n = 1; KEYS.forEach(function (k) { n *= vals[k]; }); return n; }
  function hashFor() { return KEYS.map(function (k) { return k + '=' + encodeURIComponent(hashText(vals[k])); }).join('&'); }
  function writeHash() {
    if (!window.history || !history.replaceState) return;
    try { history.replaceState(null, '', location.pathname + location.search + '#' + hashFor()); } catch (e) {}
  }
  function pending() {
    var missing = KEYS.filter(function (k) { return bad[k]; }).map(function (k) { return rows[k].sym; });
    var el = $('dk-n');
    el.textContent = '?';
    $('dk-words').textContent = 'Waiting for a valid number in ' + missing.join(', ') + '.';
    $('dk-near').textContent = 'N is worked out again as soon as every box holds a number from 0 up.';
    $('dk-share').textContent = 'Fix the highlighted number to share a result.';
    $('dk-result').classList.add('is-pending');
    miniSet('?');
    return missing;
  }
  function compute(announce, noHash) {
    if (Object.keys(bad).length) {
      var missing = pending();
      if (announce) live('N is waiting for a valid number in ' + missing.join(', ') + '.');
      return NaN;
    }
    $('dk-result').classList.remove('is-pending');
    var n = product();
    lastN = n;
    shown = renderN($('dk-n'), n);
    var w = sayN(n);
    $('dk-words').textContent = w;
    $('dk-near').textContent = nearText(n);
    var url = SITE + '#' + hashFor();
    var parts = KEYS.map(function (k) { return SHORT[k] + ' ' + (k === 'l' ? Number(vals[k]).toLocaleString('en-US') + ' years' : inputText(vals[k])); }).join(', ');
    $('dk-share').textContent = 'My Drake equation result: N = ' + shown + ' detectable civilizations in the Milky Way (' + parts + '). Try yours: ' + url;
    if (!noHash) writeHash();
    miniSet(shown, n);
    mc();
    if (announce) live('N is ' + shown.replace(' x 10^', ' times ten to the ') + '. ' + w);
    return n;
  }
  function live(line) {
    clearTimeout(liveTimer);
    liveTimer = setTimeout(function () { if (line !== lastLive) { $('dk-live').textContent = line; lastLive = line; } }, 600);
  }

  /* ---------- sticky compact bar (small screens) ---------- */
  var mini = $('dk-mini');
  function miniSet(text, n) {
    if (!mini) return;
    var v = $('dk-mini-n');
    if (text === '?' || n === undefined) v.textContent = text;
    else renderN(v, n);
    $('dk-mini-p').textContent = NAMES[current];
  }
  if (mini && 'IntersectionObserver' in window) {
    var mq = window.matchMedia('(max-width: 960px)');
    var seen = { terms: false, result: true };
    var sync = function () { mini.classList.toggle('is-on', mq.matches && seen.terms && !seen.result); };
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { seen[e.target === $('dk-result') ? 'result' : 'terms'] = e.isIntersecting; });
      sync();
    }, { threshold: 0 });
    io.observe($('dk-result'));
    io.observe($('dk-terms'));
    if (mq.addEventListener) mq.addEventListener('change', sync);
  }

  /* ---------- uncertainty: a small Monte Carlo over the slider ranges ---------- */
  var RUNS = 20000, U = null;
  function mulberry(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function draws() {
    /* the four unknown terms, each log-uniform across the powers of ten its slider covers */
    var span = ['fl', 'fi', 'fc', 'l'].map(function (k) { return [+rows[k].range.min, +rows[k].range.max]; });
    var rnd = mulberry(1961), out = new Float64Array(RUNS);
    for (var i = 0; i < RUNS; i++) {
      var s = 0;
      for (var j = 0; j < span.length; j++) s += span[j][0] + rnd() * (span[j][1] - span[j][0]);
      out[i] = s;
    }
    out.sort();
    return out;
  }
  function below(x) { var lo = 0, hi = RUNS; while (lo < hi) { var mid = (lo + hi) >> 1; if (U[mid] < x) lo = mid + 1; else hi = mid; } return lo; }
  var mcTimer = 0;
  function mc() {
    var out = $('mc-out');
    if (!out) return;
    clearTimeout(mcTimer);
    mcTimer = setTimeout(function () {
      if (!U) U = draws();
      var m = vals.r * vals.fp * vals.ne;
      out.textContent = '';
      if (!(m > 0)) {
        out.textContent = 'With a measured term at zero, every run gives zero civilizations.';
        return;
      }
      var lm = Math.log10(m);
      var share = below(-lm) / RUNS * 100;
      var pct = share > 99.5 && share < 100 ? 'more than 99.5' : share < 0.5 && share > 0 ? 'less than 0.5' : String(Math.round(share));
      out.appendChild(doc.createTextNode('With your measured terms (R* ' + inputText(vals.r) + ', fp ' + inputText(vals.fp) + ', ne ' + inputText(vals.ne) + '), ' + pct + ' percent of ' + RUNS.toLocaleString('en-US') + ' runs give fewer than one civilization. The middle half of runs land between '));
      powText(out, lm + U[Math.floor(RUNS * 0.25)]);
      out.appendChild(doc.createTextNode(' and '));
      powText(out, lm + U[Math.floor(RUNS * 0.75)]);
      out.appendChild(doc.createTextNode(' civilizations.'));
    }, 120);
  }

  /* ---------- share card: 1200 x 630 PNG ---------- */
  var imgCache = {};
  function loadImg(src) {
    if (imgCache[src]) return imgCache[src];
    imgCache[src] = new Promise(function (res) {
      var im = new Image();
      im.onload = function () { res(im); };
      im.onerror = function () { res(null); };
      im.src = src;
    });
    return imgCache[src];
  }
  function fontsReady() {
    if (!doc.fonts || !doc.fonts.load) return Promise.resolve();
    return Promise.all([
      doc.fonts.load('900 120px "Public Sans"'), doc.fonts.load('700 30px "Public Sans"'), doc.fonts.load('400 30px "Public Sans"'),
      doc.fonts.load('700 20px "Space Mono"'), doc.fonts.load('400 20px "Space Mono"')
    ]).then(function () { return doc.fonts.ready; }, function () { return doc.fonts.ready; });
  }
  function wrap(ctx, text, x, y, maxW, lh, maxLines) {
    var ws = text.split(' '), line = '', lines = 0;
    for (var i = 0; i < ws.length; i++) {
      var t = line ? line + ' ' + ws[i] : ws[i];
      if (ctx.measureText(t).width > maxW && line) {
        ctx.fillText(line, x, y); y += lh; line = ws[i]; lines++;
        if (lines >= maxLines - 1) { line = ws.slice(i).join(' '); break; }
      } else line = t;
    }
    ctx.fillText(line, x, y);
    return y;
  }
  function drawCard() {
    var n = product();
    return Promise.all([fontsReady(), loadImg('/assets/brand/disclosure-wordmark.webp'), loadImg('/assets/brand/disclosure-emblem.webp')]).then(function (r) {
      var word = r[1], emb = r[2];
      var W = 1200, H = 630, c = doc.createElement('canvas');
      c.width = W; c.height = H;
      var x = c.getContext('2d');
      var VOID = '#030504', BONE = '#d8dfda', DIM = '#a3aea7', FAINT = '#7d8983', RULE = 'rgba(214,224,217,0.24)', SIG = '#4af626';
      var MONO = '"Space Mono", "Courier New", monospace', SANS = '"Public Sans", "Helvetica Neue", Arial, sans-serif';
      x.fillStyle = VOID; x.fillRect(0, 0, W, H);
      var g = x.createRadialGradient(300, 330, 20, 300, 330, 520);
      g.addColorStop(0, 'rgba(74,246,38,0.07)'); g.addColorStop(1, 'rgba(74,246,38,0)');
      x.fillStyle = g; x.fillRect(0, 0, W, H);
      x.strokeStyle = RULE; x.lineWidth = 1; x.strokeRect(32.5, 32.5, W - 65, H - 65);

      /* site mark */
      if (emb) x.drawImage(emb, 64, 60, 44, 44);
      if (word) x.drawImage(word, emb ? 120 : 64, 64, 180, 36);
      else { x.fillStyle = BONE; x.font = '800 30px ' + SANS; x.textBaseline = 'middle'; x.fillText('DISCLOSURE', emb ? 120 : 64, 82); }
      x.textBaseline = 'alphabetic';
      x.fillStyle = FAINT; x.font = '700 16px ' + MONO; x.textAlign = 'right';
      x.fillText('FILE TLS-030  /  DRAKE EQUATION', W - 64, 88);
      x.textAlign = 'left';

      /* N */
      x.fillStyle = FAINT; x.font = '700 16px ' + MONO;
      x.fillText('DETECTABLE CIVILIZATIONS', 64, 184);
      x.fillText('IN THE MILKY WAY, ON THESE NUMBERS', 64, 208);
      var p = plain(n), size = 168;
      x.fillStyle = SIG; x.shadowColor = 'rgba(74,246,38,0.35)'; x.shadowBlur = 36;
      if (p !== null) {
        x.font = '900 ' + size + 'px ' + SANS;
        while (x.measureText(p).width > 600 && size > 60) { size -= 6; x.font = '900 ' + size + 'px ' + SANS; }
        x.fillText(p, 58, 370);
      } else {
        var s = sci(n), base = s.m + '×10', ex = String(s.e).replace('-', '−');
        size = 132; x.font = '900 ' + size + 'px ' + SANS;
        var bw = x.measureText(base).width;
        x.fillText(base, 58, 370);
        x.font = '900 ' + Math.round(size * 0.5) + 'px ' + SANS;
        x.fillText(ex, 58 + bw + 6, 370 - size * 0.48);
      }
      x.shadowBlur = 0; x.shadowColor = 'transparent';
      x.fillStyle = BONE; x.font = '600 28px ' + SANS;
      wrap(x, sayN(n), 64, 430, 600, 38, 3);

      /* the seven values */
      var cx = 740, cw = W - 64 - cx, y0 = 168, rh = 50;
      x.strokeStyle = RULE;
      x.beginPath(); x.moveTo(cx, y0 - 16.5); x.lineTo(cx + cw, y0 - 16.5); x.stroke();
      KEYS.forEach(function (k, i) {
        var y = y0 + i * rh;
        x.fillStyle = BONE; x.font = '700 22px ' + MONO; x.textAlign = 'left';
        x.fillText(SHORT[k], cx, y + 18);
        x.fillStyle = DIM; x.font = '400 15px ' + MONO;
        x.fillText(CARD_NAME[k].toUpperCase(), cx + 64, y + 16);
        x.fillStyle = BONE; x.font = '700 22px ' + MONO; x.textAlign = 'right';
        x.fillText(k === 'l' ? Number(vals[k]).toLocaleString('en-US') : inputText(vals[k]), cx + cw, y + 18);
        x.beginPath(); x.moveTo(cx, y + 33.5); x.lineTo(cx + cw, y + 33.5); x.stroke();
      });
      x.textAlign = 'left';

      /* foot */
      x.beginPath(); x.moveTo(64, H - 104.5); x.lineTo(W - 64, H - 104.5); x.stroke();
      x.fillStyle = DIM; x.font = '700 18px ' + MONO;
      x.fillText('getdisclosure.app/tools/drake', 64, H - 66);
      x.textAlign = 'right'; x.fillStyle = FAINT; x.font = '400 17px ' + MONO;
      x.fillText(NAMES[current].toUpperCase() + '  /  A MODEL, NOT A MEASUREMENT', W - 64, H - 66);
      x.textAlign = 'left';
      return c;
    });
  }
  function cardBlob() {
    return drawCard().then(function (c) {
      return new Promise(function (res, rej) { c.toBlob(function (b) { if (b) res(b); else rej(new Error('no blob')); }, 'image/png'); });
    });
  }
  function fileName() { return 'drake-equation-' + (shown || 'result').replace(/[^0-9a-z.]+/gi, '-').replace(/^-|-$/g, '') + '.png'; }
  function say(msg) { var out = $('dk-copied'); out.textContent = ''; setTimeout(function () { out.textContent = msg; }, 30); }
  function blocked() { if (Object.keys(bad).length) { say('Fix the highlighted number first.'); return true; } return false; }

  function copyText(text, okMsg) {
    var done = function () { say(okMsg); if (DX.track) DX.track('drake_share'); };
    var fail = function () {
      var ta = doc.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      doc.body.appendChild(ta); ta.select();
      var ok = false; try { ok = doc.execCommand('copy'); } catch (e) {}
      doc.body.removeChild(ta);
      if (ok) done(); else say('Copy was blocked. Select the line above and copy it.');
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fail); else fail();
  }
  $('dk-copy').addEventListener('click', function () { if (!blocked()) copyText($('dk-share').textContent, 'Copied the line.'); });

  var saveBtn = $('dk-save');
  if (saveBtn) saveBtn.addEventListener('click', function () {
    if (blocked()) return;
    say('Drawing the card.');
    cardBlob().then(function (b) {
      var url = URL.createObjectURL(b), a = doc.createElement('a');
      a.href = url; a.download = fileName(); doc.body.appendChild(a); a.click(); doc.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
      say('Card saved as ' + a.download + '.');
      if (DX.track) DX.track('drake_card');
    }, function () { say('The card could not be drawn in this browser. Copy the line instead.'); });
  });

  var shareBtn = $('dk-send');
  if (shareBtn) shareBtn.addEventListener('click', function () {
    if (blocked()) return;
    var url = SITE + '#' + hashFor();
    var text = 'My Drake equation result: N = ' + shown + ' detectable civilizations in the Milky Way.';
    var copyLink = function () { copyText(url, 'Link copied. It opens this exact result.'); };
    if (!navigator.share || !window.File) { copyLink(); return; }
    cardBlob().then(function (b) {
      var file = new File([b], fileName(), { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        say('Opening your device’s share options.');
        return navigator.share({ files: [file], title: 'Drake equation result', text: text + ' ' + url }).then(function () { say('Shared.'); if (DX.track) DX.track('drake_share'); });
      }
      copyLink();
    }).catch(function (e) { if (!e || e.name !== 'AbortError') copyLink(); });
  });

  /* ---------- start: read a shared link ---------- */
  function fromHash() {
    var h = (location.hash || '').replace(/^#/, '');
    if (!h || h.indexOf('=') < 0) return { status: 'none' };
    var out = {}, wrong = [], capped = [];
    h.split('&').forEach(function (pair) {
      var kv = pair.split('=');
      var k = kv[0];
      if (KEYS.indexOf(k) < 0) return;
      var raw = '';
      try { raw = decodeURIComponent(kv[1] || ''); } catch (e) { raw = ''; }
      var v = /^\s*[0-9.eE+-]+\s*$/.test(raw) ? parseFloat(raw) : NaN;
      if (!isFinite(v) || v < 0) { wrong.push(rows[k].sym); return; }
      if (v > rows[k].max) { v = rows[k].max; capped.push(rows[k].sym); }
      out[k] = v;
    });
    var missing = KEYS.filter(function (k) { return !(k in out); }).map(function (k) { return rows[k].sym; })
      .filter(function (s) { return wrong.indexOf(s) < 0; });
    if (wrong.length || missing.length) return { status: 'bad', wrong: wrong, missing: missing };
    return { status: 'ok', vals: out, capped: capped };
  }
  function matchPreset(v) {
    for (var i = 0; i < FIXED.length; i++) {
      var p = PRESETS[FIXED[i]], same = true;
      KEYS.forEach(function (k) { if (Math.abs(p[k] - v[k]) > 1e-9 * Math.max(1, p[k])) same = false; });
      if (same) return FIXED[i];
    }
    return null;
  }
  function list(a) { return a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]; }
  function openHash(announce) {
    var got = fromHash();
    if (got.status === 'none') return false;
    if (got.status === 'bad') {
      var why = [];
      if (got.wrong.length) why.push('it had values we could not read for ' + list(got.wrong));
      if (got.missing.length) why.push('it was missing ' + list(got.missing));
      showNotice('That shared link did not open: ' + why.join(', and ') + '. Showing Drake’s 1961 values instead.');
      select('drake'); apply(PRESETS.drake); compute(announce, true);
      return true;
    }
    var name = matchPreset(got.vals);
    if (name) select(name);
    else { KEYS.forEach(function (k) { PRESETS.yours[k] = got.vals[k]; }); select('yours'); }
    apply(got.vals);
    if (got.capped.length) showNotice('This link held values above the calculator’s limits for ' + list(got.capped) + '. They were capped at the largest value each term takes.');
    else hideNotice();
    compute(announce, !got.capped.length);
    return true;
  }
  if (!openHash(false)) { select('drake'); apply(PRESETS.drake); compute(false, true); }
  window.addEventListener('hashchange', function () { openHash(true); });

  /* ---------- Kardashev gauge ---------- */
  var kr = $('kd-range');
  if (kr) {
    var EARTH = 13.3;
    var render = function () {
      var e = +kr.value;
      var k = (e - 6) / 10;
      var pct = Math.max(0, Math.min(1, k / 3)) * 100;
      $('kd-fill').style.width = pct + '%';
      $('kd-mark-you').style.left = pct + '%';
      var kTxt = k.toFixed(2);
      var where = Math.abs(e - EARTH) < 0.05 ? 'That is about where humanity is today.'
        : k < 0.73 ? 'Below humanity today.'
        : k < 1 ? 'Beyond humanity today, still short of Type I.'
        : k < 2 ? 'Type I or more: planet-scale power.'
        : k < 3 ? 'Type II or more: star-scale power.'
        : 'Type III: galaxy-scale power.';
      var out = $('kd-out');
      out.textContent = '';
      out.appendChild(doc.createTextNode('10'));
      var sup = doc.createElement('sup'); sup.textContent = e.toFixed(1); out.appendChild(sup);
      out.appendChild(doc.createTextNode(' watts gives K = ' + kTxt + '. ' + where));
      kr.setAttribute('aria-valuetext', '10 to the ' + e.toFixed(1) + ' watts, K ' + kTxt);
    };
    kr.addEventListener('input', render);
    $('kd-earth').addEventListener('click', function () { kr.value = String(EARTH); render(); });
    render();
  }

  /* test hooks: read-only, for the verification script */
  window.DXDrake = {
    n: function () { return Object.keys(bad).length ? NaN : product(); },
    vals: function () { var o = {}; KEYS.forEach(function (k) { o[k] = bad[k] ? null : vals[k]; }); return o; },
    card: function () { return drawCard().then(function (c) { return c.toDataURL('image/png'); }); },
    spacing: spacing
  };
})();
