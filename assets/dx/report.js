/* DISCLOSURE: the witness report form (/tools/report/).
   Everything stays in this browser. The draft autosaves to localStorage
   (key dx-report-v1); nothing is uploaded. The strength meter scores how
   complete the report is, never what the object was. */
(function () {
  'use strict';
  var doc = document;
  var form = doc.getElementById('rp-form');
  if (!form) return;

  var KEY = 'dx-report-v1';
  var $ = function (id) { return doc.getElementById(id); };
  var els = {
    v: $('rp-v'), mini: $('rp-mini-v'), band: $('rp-band'), bar: $('rp-bar'), hints: $('rp-hints'), parts: $('rp-parts'),
    live: $('rp-live'), saved: $('rp-saved'), sheet: $('rp-sheet'), status: $('rp-status'), locMsg: $('rp-loc-msg')
  };
  var DX = window.DX || {};
  var track = function (n) { if (DX.track) DX.track(n); };

  /* ---------- read and write the form ---------- */
  function read() {
    var s = {};
    [].forEach.call(form.elements, function (el) {
      if (!el.name) return;
      if (el.type === 'checkbox') s[el.name] = el.checked;
      else if (el.type === 'radio') { if (el.checked) s[el.name] = el.value; else if (!(el.name in s)) s[el.name] = ''; }
      else s[el.name] = el.value;
    });
    return s;
  }
  function write(s) {
    [].forEach.call(form.elements, function (el) {
      if (!el.name || !(el.name in s)) return;
      if (el.type === 'checkbox') el.checked = !!s[el.name];
      else if (el.type === 'radio') el.checked = el.value === s[el.name];
      else el.value = s[el.name] == null ? '' : String(s[el.name]);
    });
  }
  function save(s) {
    try {
      localStorage.setItem(KEY, JSON.stringify({ v: 1, saved: Date.now(), data: s }));
      var t = new Date();
      els.saved.textContent = 'Draft saved on this device ' + pad(t.getHours()) + ':' + pad(t.getMinutes());
    } catch (e) {
      els.saved.textContent = 'Draft not saved: this browser blocks storage';
    }
  }
  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return null;
      var o = JSON.parse(raw);
      return o && o.data ? o.data : null;
    } catch (e) { return null; }
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  /* ---------- the score ---------- */
  var has = function (v) { return typeof v === 'string' ? v.trim() !== '' && v !== 'Not sure' : !!v; };
  var num = function (v) { var n = parseFloat(v); return isFinite(n) ? n : NaN; };
  function coordsOk(s) {
    var la = num(s.lat), lo = num(s.lon);
    return isFinite(la) && isFinite(lo) && Math.abs(la) <= 90 && Math.abs(lo) <= 180 && String(s.lat).trim() !== '' && String(s.lon).trim() !== '';
  }
  var CHECKS = [['c_air', 'aircraft'], ['c_sat', 'satellites'], ['c_planet', 'planets'], ['c_drone', 'drones'], ['c_lantern', 'lanterns']];

  function score(s) {
    var parts = [], hints = [];
    function part(label, got, max) { parts.push({ label: label, got: got, max: max }); return got; }
    function hint(gain, text) { if (gain > 0) hints.push({ gain: gain, text: text }); }

    /* time 12 */
    var t = (has(s.date) ? 5 : 0) + (has(s.start) ? 7 : 0);
    part('Time', t, 12);
    if (!has(s.start)) hint(7, 'Add the start time, even roughly.');
    if (!has(s.date)) hint(5, 'Add the date.');

    /* place 12 */
    var p = (has(s.place) ? 7 : 0) + (coordsOk(s) ? 5 : 0);
    part('Place', p, 12);
    if (!has(s.place)) hint(7, 'Name the place: a town, road or landmark.');
    if (!coordsOk(s)) hint(5, 'Add coordinates, or press Use my location.');

    /* duration 8 */
    var d = num(s.dur) > 0 ? 8 : 0;
    part('Duration', d, 8);
    hint(8 - d, 'Say how long it lasted, even as an estimate.');

    /* description 8 */
    var missing = [];
    var desc = 0;
    [['shape', 'shape'], ['colour', 'color'], ['bright', 'brightness'], ['size', 'size']].forEach(function (k) {
      if (has(s[k[0]])) desc += 2; else missing.push(k[1]);
    });
    part('Description', desc, 8);
    if (missing.length) hint(8 - desc, 'Describe its ' + list(missing) + '.');

    /* direction 5 */
    var dir = (has(s.first) ? 2 : 0) + (has(s.travel) ? 3 : 0);
    part('Direction', dir, 5);
    hint(5 - dir, 'Mark where it was and which way it moved.');

    /* witnesses 15 */
    var others = Math.max(0, Math.floor(num(s.others) || 0));
    var apart = Math.max(0, Math.floor(num(s.apart) || 0));
    if (apart > others) others = apart;
    var w = (others >= 1 ? 5 : 0) + (apart >= 1 ? 5 : 0) + (others >= 1 ? (s.confirm === 'Yes' ? 5 : s.confirm === 'Maybe' ? 2 : 0) : 0);
    part('Witnesses', w, 15);
    if (others < 1) hint(15, 'If anyone else saw it, add them, especially someone who saw it from another place.');
    else {
      if (apart < 1) hint(5, 'Look for a witness who saw it from somewhere else.');
      if (s.confirm !== 'Yes') hint(s.confirm === 'Maybe' ? 3 : 5, 'Ask your witnesses whether they will confirm what they saw.');
    }

    /* files 15 */
    var recorded = !!(s.photo || s.video) || s.original === 'yes' || s.original === 'copy';
    var f = (recorded ? 5 : 0) + (s.original === 'yes' ? 10 : 0);
    part('Original files', f, 15);
    if (!recorded) hint(15, 'If you took any photo or video, keep the original file and mark it here.');
    else if (s.original !== 'yes') hint(10, 'Keep the original file, not a screenshot or a shared copy.');

    /* checks 15 */
    var todo = [];
    var c = 0;
    CHECKS.forEach(function (k) { if (s[k[0]]) c += 3; else todo.push(k[1]); });
    part('Checks', c, 15);
    if (todo.length) hint(15 - c, 'Rule out ordinary explanations: ' + list(todo) + '.');

    /* written 10 */
    var wr = { hour: 10, day: 6, week: 3, later: 0 }[s.written] || 0;
    part('Written soon', wr, 10);
    if (!s.written) hint(10, 'Say when you are writing this. Within an hour scores highest.');

    var total = 0;
    parts.forEach(function (x) { total += x.got; });
    hints.sort(function (a, b) { return b.gain - a.gain; });
    return { total: total, parts: parts, hints: hints };
  }
  function band(n, empty) {
    if (empty) return 'Empty';
    return n >= 75 ? 'Strong' : n >= 50 ? 'Solid' : n >= 25 ? 'Workable' : 'Thin';
  }
  function list(a) {
    if (a.length < 2) return a.join('');
    return a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1];
  }
  function isEmpty(s) {
    for (var k in s) { if (k === 'dur_unit') continue; if (s[k] === true || (typeof s[k] === 'string' && s[k].trim() !== '')) return false; }
    return true;
  }

  /* ---------- the meter ---------- */
  var lastSpoken = null, speakTimer = 0;
  function renderMeter(r, empty) {
    var b = band(r.total, empty);
    els.v.textContent = r.total;
    els.mini.textContent = r.total;
    els.band.textContent = b;
    els.bar.style.width = r.total + '%';
    els.hints.textContent = '';
    var top = r.hints.slice(0, 3);
    if (!top.length) {
      var li = doc.createElement('li'); li.className = 'done';
      li.textContent = 'Nothing left to add. This is as complete as a civilian report gets.';
      els.hints.appendChild(li);
    }
    top.forEach(function (h) {
      var li = doc.createElement('li');
      var t = doc.createElement('span'); t.textContent = h.text;
      var g = doc.createElement('b'); g.textContent = '+' + h.gain;
      li.appendChild(t); li.appendChild(g);
      els.hints.appendChild(li);
    });
    els.parts.textContent = '';
    r.parts.forEach(function (p) {
      var li = doc.createElement('li');
      var a = doc.createElement('span'); a.textContent = p.label;
      var z = doc.createElement('span'); z.textContent = p.got + ' / ' + p.max;
      li.appendChild(a); li.appendChild(z);
      els.parts.appendChild(li);
    });
    var line = 'Report strength ' + r.total + ' of 100, ' + b.toLowerCase() + '.';
    if (line !== lastSpoken) {
      clearTimeout(speakTimer);
      speakTimer = setTimeout(function () { els.live.textContent = line; lastSpoken = line; }, 900);
    }
  }

  /* ---------- the report model (preview, print and text share it) ---------- */
  function tz() { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { return ''; } }
  function model(s, r) {
    var others = Math.max(0, Math.floor(num(s.others) || 0));
    var apart = Math.max(0, Math.floor(num(s.apart) || 0));
    var dur = num(s.dur) > 0 ? (+num(s.dur).toFixed(2)) + ' ' + (num(s.dur) === 1 ? s.dur_unit.replace(/s$/, '') : s.dur_unit) : '';
    var recorded = [s.photo ? 'Photo' : '', s.video ? 'Video' : ''].filter(Boolean).join(' and ');
    var original = { yes: 'Yes, original kept', copy: 'No, only a copy or screenshot', unsure: 'Not sure', none: 'Nothing was recorded' }[s.original] || '';
    var checked = CHECKS.filter(function (k) { return s[k[0]]; }).map(function (k) { return k[1]; });
    var unchecked = CHECKS.filter(function (k) { return !s[k[0]]; }).map(function (k) { return k[1]; });
    var written = { hour: 'Within an hour of it ending', day: 'Later the same day', week: 'Within a week', later: 'More than a week later' }[s.written] || '';
    return [
      { h: 'When', rows: [['Date', s.date], ['Start time', s.start ? s.start + (tz() ? ' (' + tz() + ')' : '') : ''], ['Duration', dur]] },
      { h: 'Where', rows: [['Place', s.place], ['Coordinates', coordsOk(s) ? (+num(s.lat)).toFixed(4) + ', ' + (+num(s.lon)).toFixed(4) : ''], ['Observer was', s.vantage]] },
      { h: 'Sky and weather', rows: [['Light', s.light], ['Sky', s.sky], ['Moon', s.moon]] },
      { h: 'What was seen', rows: [['Shape', s.shape], ['Color', s.colour], ['Brightness', s.bright], ['Size', s.size], ['Height', s.elev], ['Movement', s.move], ['Sound', s.sound]] },
      { h: 'Direction', rows: [['First seen', s.first], ['Moving', s.travel]] },
      { h: 'Other witnesses', rows: [['Others who saw it', String(s.others).trim() === '' ? '' : String(others)], ['From another place', String(s.apart).trim() === '' ? '' : String(apart)], ['Will confirm', s.confirm]] },
      { h: 'Recorded', rows: [['Media', recorded], ['Device', s.device], ['Original file', original]] },
      { h: 'Ordinary explanations', rows: [['Checked', checked.length ? cap(list(checked)) : ''], ['Not checked', unchecked.length ? cap(list(unchecked)) : 'None']] },
      { h: 'Notes', rows: [['Written', written]], notes: (s.notes || '').trim() }
    ];
  }
  function cap(t) { return t.charAt(0).toUpperCase() + t.slice(1); }
  function prepared() {
    var d = new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }
  var DISCLAIMER = [
    'Prepared by the witness with the DISCLOSURE report form at getdisclosure.app/tools/report/. DISCLOSURE did not investigate this sighting, has not verified it, and keeps no copy of it.',
    'The report strength score rates how complete and checkable this report is. It says nothing about what the object was.'
  ];

  function renderSheet(s, r, empty) {
    var sheet = els.sheet;
    sheet.textContent = '';
    var head = el('div', 'rs-head');
    head.appendChild(el('span', 'rs-brand', 'DISCLOSURE'));
    head.appendChild(el('span', 'rs-kind', 'Witness report · civilian copy · prepared ' + prepared()));
    sheet.appendChild(head);
    if (empty) { sheet.appendChild(el('p', 'dim', 'Start filling in the form above and your report appears here.')); return; }
    model(s, r).forEach(function (sec) {
      var wrap = el('section', 'notes' in sec ? 'rs-sec rs-notes-sec' : 'rs-sec');
      wrap.appendChild(el('h3', '', sec.h));
      var dl = doc.createElement('dl');
      sec.rows.forEach(function (row) {
        dl.appendChild(el('dt', '', row[0]));
        var v = row[1] && String(row[1]).trim();
        dl.appendChild(el('dd', v ? '' : 'empty', v || 'Not given'));
      });
      wrap.appendChild(dl);
      if ('notes' in sec) {
        wrap.appendChild(el('p', 'rs-notes', sec.notes || 'No notes written.'));
      }
      sheet.appendChild(wrap);
    });
    sheet.appendChild(el('p', 'rs-score', 'Report strength: ' + r.total + ' of 100 (' + band(r.total).toLowerCase() + ')'));
    var disc = el('div', 'rs-disc');
    DISCLAIMER.forEach(function (t) { disc.appendChild(el('p', '', t)); });
    sheet.appendChild(disc);
  }
  function el(tag, cls, text) {
    var e = doc.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function asText(s, r) {
    var out = ['DISCLOSURE: WITNESS REPORT (civilian copy)', 'Prepared ' + prepared(), ''];
    model(s, r).forEach(function (sec) {
      out.push(sec.h.toUpperCase());
      sec.rows.forEach(function (row) { var v = row[1] && String(row[1]).trim(); out.push(row[0] + ': ' + (v || 'Not given')); });
      if ('notes' in sec) out.push('', sec.notes || 'No notes written.');
      out.push('');
    });
    out.push('Report strength: ' + r.total + ' of 100 (' + band(r.total).toLowerCase() + ')', '');
    return out.concat(DISCLAIMER).join('\n');
  }

  /* ---------- update loop ---------- */
  var saveTimer = 0;
  function update(persist) {
    var s = read();
    var empty = isEmpty(s);
    var r = score(s);
    renderMeter(r, empty);
    renderSheet(s, r, empty);
    if (persist) { clearTimeout(saveTimer); saveTimer = setTimeout(function () { save(s); }, 250); }
    return { s: s, r: r };
  }
  form.addEventListener('input', function () { update(true); });
  form.addEventListener('change', function () { update(true); });
  form.addEventListener('submit', function (e) { e.preventDefault(); });

  /* ---------- location: asked for, written into the form, never sent ---------- */
  var locBtn = $('rp-locate');
  locBtn.addEventListener('click', function () {
    if (!('geolocation' in navigator)) { els.locMsg.textContent = 'This browser cannot share a location. Type the place name instead.'; return; }
    els.locMsg.textContent = 'Asking your browser for a location.';
    locBtn.disabled = true;
    try {
      navigator.geolocation.getCurrentPosition(function (pos) {
        locBtn.disabled = false;
        form.elements.lat.value = pos.coords.latitude.toFixed(4);
        form.elements.lon.value = pos.coords.longitude.toFixed(4);
        els.locMsg.textContent = 'Location added to the form. It stays on this device.';
        update(true);
      }, function (err) {
        locBtn.disabled = false;
        els.locMsg.textContent = err && err.code === 1
          ? 'Location was not shared. Type the place name, or copy coordinates from a map app.'
          : 'Could not get a location right now. Type the place name, or copy coordinates from a map app.';
      }, { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 });
    } catch (e) {
      locBtn.disabled = false;
      els.locMsg.textContent = 'Location is blocked on this page. Type the place name instead.';
    }
  });

  /* ---------- output ---------- */
  function status(t) { els.status.textContent = ''; setTimeout(function () { els.status.textContent = t; }, 30); }
  $('rp-print').addEventListener('click', function () {
    update(false);
    track('report_print');
    window.print();
  });
  window.addEventListener('beforeprint', function () { update(false); });
  $('rp-copy').addEventListener('click', function () {
    var cur = update(false);
    var text = asText(cur.s, cur.r);
    var done = function () { status('Copied. Paste it into the reporting form you choose.'); track('report_copy'); };
    var fallback = function () {
      var ta = doc.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      doc.body.appendChild(ta); ta.select();
      var ok = false;
      try { ok = doc.execCommand('copy'); } catch (e) {}
      doc.body.removeChild(ta);
      if (ok) done(); else status('Copy was blocked. Use Save as PDF, or select the report text and copy it.');
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback);
    else fallback();
  });
  $('rp-clear').addEventListener('click', function () {
    if (!window.confirm('Clear this report? This deletes the draft from this browser and cannot be undone.')) return;
    form.reset();
    try { localStorage.removeItem(KEY); } catch (e) {}
    els.saved.textContent = 'Draft on this device';
    els.locMsg.textContent = 'Your browser asks first. The numbers are written into this form and go nowhere else.';
    update(false);
    status('Report cleared from this browser.');
    var first = form.querySelector('input, select, textarea');
    if (first) first.focus();
  });

  /* ---------- start ---------- */
  var stored = load();
  if (stored) {
    write(stored);
    els.saved.textContent = 'Draft restored from this device';
  }
  lastSpoken = null;
  var init = update(false);
  lastSpoken = 'Report strength ' + init.r.total + ' of 100, ' + band(init.r.total, isEmpty(init.s)).toLowerCase() + '.';
  clearTimeout(speakTimer);

  /* test hook: read-only, for the verification script */
  window.DXReport = { score: function () { return score(read()).total; }, text: function () { var c = update(false); return asText(c.s, c.r); } };
})();
