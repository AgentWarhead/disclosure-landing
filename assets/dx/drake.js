/* DISCLOSURE: Drake equation calculator + Kardashev gauge (/tools/drake/).
   Runs entirely in the browser. The share line carries the seven values in
   the URL hash; nothing is stored or sent. */
(function () {
  'use strict';
  var doc = document;
  var terms = [].slice.call(doc.querySelectorAll('.dk-term'));
  if (!terms.length) return;
  var $ = function (id) { return doc.getElementById(id); };
  var DX = window.DX || {};
  var KEYS = ['r', 'fp', 'ne', 'fl', 'fi', 'fc', 'l'];
  var SHORT = { r: 'R*', fp: 'fp', ne: 'ne', fl: 'fl', fi: 'fi', fc: 'fc', l: 'L' };

  var PRESETS = {
    pessimist: { r: 1, fp: 1, ne: 0.2, fl: 0.001, fi: 0.001, fc: 0.1, l: 1000 },
    drake: { r: 1, fp: 0.2, ne: 1, fl: 1, fi: 1, fc: 0.1, l: 1000 },
    optimist: { r: 3, fp: 1, ne: 0.9, fl: 1, fi: 0.5, fc: 0.5, l: 1000000 },
    yours: { r: 1.65, fp: 1, ne: 0.5, fl: 0.1, fi: 0.01, fc: 0.1, l: 10000 }
  };
  var NOTES = {
    pessimist: 'Pessimist: our illustration, not a published estimate. Planets are common, but life and intelligence are rare flukes and signals fade within a thousand years.',
    drake: 'Drake 1961: the low end of the ranges the 1961 Green Bank meeting agreed on. The high end gives about 50 million. The group concluded N is roughly equal to L.',
    optimist: 'Optimist: our illustration, not a published estimate. Life starts wherever it can and civilizations stay detectable for a million years.',
    yours: 'Your guess: your own numbers. The share line below carries them, so anyone can open the same result.'
  };

  var rows = {};
  terms.forEach(function (li) {
    var k = li.getAttribute('data-term');
    var range = li.querySelector('.dk-range');
    rows[k] = { num: li.querySelector('.dk-num'), range: range, log: range.hasAttribute('data-log') };
  });

  var vals = {};
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
  function inputText(n) {
    if (!isFinite(n)) return '';
    if (n === 0) return '0';
    var s = sig(n, 3);
    return Math.abs(s) >= 1e-6 && Math.abs(s) < 1e15 ? trim(s.toFixed(Math.max(0, 2 - Math.floor(Math.log10(Math.abs(s)))))) : String(s);
  }
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
    var e = Math.floor(Math.log10(n));
    var m = trim(sig(n / Math.pow(10, e), 2).toFixed(1));
    el.appendChild(doc.createTextNode(m + ' × 10'));
    var sup = doc.createElement('sup'); sup.textContent = String(e).replace('-', '−');
    el.appendChild(sup);
    return m + ' x 10^' + e;
  }

  /* ---------- controls ---------- */
  function setRow(k, v, from) {
    var row = rows[k];
    vals[k] = v;
    if (from !== 'num') row.num.value = inputText(v);
    if (from !== 'range') {
      var min = +row.range.min, max = +row.range.max;
      var x = row.log ? (v > 0 ? Math.log10(v) : min) : v;
      row.range.value = String(Math.min(max, Math.max(min, x)));
    }
    if (row.log) row.range.setAttribute('aria-valuetext', inputText(v));
  }
  function apply(p) {
    KEYS.forEach(function (k) { setRow(k, p[k]); });
  }
  function select(name) {
    current = name;
    [].forEach.call(doc.querySelectorAll('.dk-preset'), function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-preset') === name ? 'true' : 'false');
    });
    $('dk-note').textContent = NOTES[name];
  }
  function toYours() {
    if (current !== 'yours') select('yours');
    KEYS.forEach(function (k) { PRESETS.yours[k] = vals[k]; });
  }

  KEYS.forEach(function (k) {
    var row = rows[k];
    row.range.addEventListener('input', function () {
      var x = +row.range.value;
      var v = row.log ? sig(Math.pow(10, x), 2) : x;
      setRow(k, v, 'range');
      toYours();
      compute(true);
    });
    row.num.addEventListener('input', function () {
      var v = parseFloat(row.num.value);
      if (!isFinite(v) || v < 0) return;
      var max = +row.num.max;
      if (v > max) v = max;
      setRow(k, v, 'num');
      toYours();
      compute(true);
    });
    row.num.addEventListener('change', function () { row.num.value = inputText(vals[k]); });
  });
  [].forEach.call(doc.querySelectorAll('.dk-preset'), function (b) {
    b.addEventListener('click', function () {
      var name = b.getAttribute('data-preset');
      select(name);
      apply(PRESETS[name]);
      compute(true);
      if (DX.track) DX.track('drake_preset', { preset: name });
    });
  });

  /* ---------- the result ---------- */
  var liveTimer = 0, lastLive = '';
  function compute(announce) {
    var n = 1;
    KEYS.forEach(function (k) { n *= vals[k]; });
    var shown = renderN($('dk-n'), n);
    var w = sayN(n);
    $('dk-words').textContent = w;
    var hash = KEYS.map(function (k) { return k + '=' + encodeURIComponent(inputText(vals[k])); }).join('&');
    var url = 'https://www.getdisclosure.app/tools/drake/#' + hash;
    var parts = KEYS.map(function (k) { return SHORT[k] + ' ' + (k === 'l' ? Number(vals[k]).toLocaleString('en-US') + ' years' : inputText(vals[k])); }).join(', ');
    $('dk-share').textContent = 'My Drake equation result: N = ' + shown + ' detectable civilizations in the Milky Way (' + parts + '). Try yours: ' + url;
    if (current === 'yours' && window.history && history.replaceState) {
      try { history.replaceState(null, '', '#' + hash); } catch (e) {}
    }
    if (announce) {
      var line = 'N is ' + shown.replace(' x 10^', ' times ten to the ') + '. ' + w;
      clearTimeout(liveTimer);
      liveTimer = setTimeout(function () { if (line !== lastLive) { $('dk-live').textContent = line; lastLive = line; } }, 600);
    }
    return n;
  }

  $('dk-copy').addEventListener('click', function () {
    var text = $('dk-share').textContent;
    var out = $('dk-copied');
    var done = function () { out.textContent = ''; setTimeout(function () { out.textContent = 'Copied.'; }, 30); if (DX.track) DX.track('drake_share'); };
    var fail = function () {
      var ta = doc.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      doc.body.appendChild(ta); ta.select();
      var ok = false; try { ok = doc.execCommand('copy'); } catch (e) {}
      doc.body.removeChild(ta);
      if (ok) done(); else { out.textContent = 'Copy was blocked. Select the line and copy it.'; }
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fail); else fail();
  });

  /* ---------- start: a shared link opens as Your guess ---------- */
  function fromHash() {
    var h = (location.hash || '').replace(/^#/, '');
    if (!h) return null;
    var out = {}, ok = 0;
    h.split('&').forEach(function (pair) {
      var kv = pair.split('=');
      var k = kv[0], v = parseFloat(decodeURIComponent(kv[1] || ''));
      if (KEYS.indexOf(k) >= 0 && isFinite(v) && v >= 0) {
        var max = +rows[k].num.max;
        out[k] = Math.min(v, max); ok++;
      }
    });
    return ok === KEYS.length ? out : null;
  }
  var shared = fromHash();
  if (shared) { PRESETS.yours = shared; select('yours'); apply(shared); }
  else { select('drake'); apply(PRESETS.drake); }
  compute(false);

  /* ---------- Kardashev gauge ---------- */
  var kr = $('kd-range');
  if (kr) {
    var EARTH = 13.3;
    var render = function (announce) {
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
    kr.addEventListener('input', function () { render(true); });
    $('kd-earth').addEventListener('click', function () { kr.value = String(EARTH); render(true); });
    render(false);
  }

  /* test hook: read-only, for the verification script */
  window.DXDrake = { n: function () { var n = 1; KEYS.forEach(function (k) { n *= vals[k]; }); return n; } };
})();
