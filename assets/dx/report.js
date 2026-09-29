/* DISCLOSURE: the witness report form (/tools/report/).
   Everything stays in this browser. The draft autosaves to localStorage
   (key dx-report-v1) and is cleared automatically after 30 days; nothing is
   uploaded. The strength meter scores how complete the report is, never what
   the object was. A sighting handed over by the sky identifier arrives through
   sessionStorage (key dx-sky-handoff-v1) and is read once. */
(function () {
  'use strict';
  var doc = document;
  var form = doc.getElementById('rp-form');
  if (!form) return;

  var KEY = 'dx-report-v1', HANDOFF_KEY = 'dx-sky-handoff-v1', MAX_AGE = 30 * 864e5;
  var $ = function (id) { return doc.getElementById(id); };
  var els = {
    v: $('rp-v'), mini: $('rp-mini-v'), miniBand: $('rp-mini-band'), miniHint: $('rp-mini-hint'), band: $('rp-band'), bar: $('rp-bar'),
    hints: $('rp-hints'), parts: $('rp-parts'), live: $('rp-live'), saved: $('rp-saved'), sheet: $('rp-sheet'), status: $('rp-status'),
    locMsg: $('rp-loc-msg'), tz: $('f-tz'), imp: $('rp-import'), impT: $('rp-import-t'), impX: $('rp-import-x'), route: $('rp-route'),
    share: $('rp-share'), old: $('rp-old')
  };
  var DX = window.DX || {};
  var track = function (n) { if (DX.track) DX.track(n); };

  /* ---------- time zones ---------- */
  function canonZone(tz) { try { return new Intl.DateTimeFormat('en-US', { timeZone: tz }).resolvedOptions().timeZone; } catch (e) { return null; } }
  var deviceTz = canonZone(undefined) || (function () { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'; } catch (e) { return 'UTC'; } })();
  var fmtCache = {};
  function partsIn(ms, tz) {
    var f = fmtCache[tz] || (fmtCache[tz] = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    var o = {};
    f.formatToParts(new Date(ms)).forEach(function (p) { o[p.type] = p.value; });
    return { y: +o.year, mo: +o.month, d: +o.day, h: +o.hour % 24, mi: +o.minute, s: +o.second };
  }
  function tzOffset(ms, tz) { var p = partsIn(ms, tz); return Date.UTC(p.y, p.mo - 1, p.d, p.h, p.mi, p.s) - Math.floor(ms / 1000) * 1000; }
  function zonedToUtc(y, mo, d, h, mi, tz) {
    var guess = Date.UTC(y, mo - 1, d, h, mi);
    for (var i = 0; i < 3; i++) guess = Date.UTC(y, mo - 1, d, h, mi) - tzOffset(guess, tz);
    return guess;
  }
  function zoneOk(tz) { return !!tz && !!canonZone(tz); }
  function zoneOf(s) { return zoneOk(s.tz) ? s.tz : deviceTz; }
  function buildZones() {
    var seen = {}, list = [];
    function add(z) { var c = canonZone(z); if (c && !seen[c]) { seen[c] = 1; list.push(c); } }
    try { if (Intl.supportedValuesOf) Intl.supportedValuesOf('timeZone').forEach(add); } catch (e) {}
    add(deviceTz); add('UTC');
    list.sort();
    var frag = doc.createDocumentFragment();
    list.forEach(function (z) { var o = doc.createElement('option'); o.value = z; o.textContent = z.replace(/_/g, ' ') + (z === deviceTz ? ' (this device)' : ''); frag.appendChild(o); });
    els.tz.textContent = '';
    els.tz.appendChild(frag);
    els.tz.value = deviceTz;
  }
  function ensureZone(z) {
    var c = canonZone(z);
    if (!c) return null;
    if (![].some.call(els.tz.options, function (o) { return o.value === c; })) { var o = doc.createElement('option'); o.value = c; o.textContent = c.replace(/_/g, ' '); els.tz.appendChild(o); }
    return c;
  }
  buildZones();

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
      else if (el.name === 'tz') { var z = ensureZone(s.tz); el.value = z || deviceTz; }
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
  var clearedOld = false;
  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return null;
      var o = JSON.parse(raw);
      // drafts older than 30 days are removed, so a shared device does not keep an old sighting forever
      if (o && (!o.saved || Date.now() - o.saved > MAX_AGE)) { localStorage.removeItem(KEY); clearedOld = true; return null; }
      return o && o.data ? o.data : null;
    } catch (e) { return null; }
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  /* ---------- validation ---------- */
  var has = function (v) { return typeof v === 'string' ? v.trim() !== '' && v !== 'Not sure' : !!v; };
  var num = function (v) { var n = parseFloat(v); return isFinite(n) && /^\s*-?\d*\.?\d+\s*$/.test(String(v)) ? n : NaN; };
  function todayIn(tz) { var p = partsIn(Date.now(), tz); return p.y + '-' + pad(p.mo) + '-' + pad(p.d); }
  function nowTimeIn(tz) { var p = partsIn(Date.now(), tz); return pad(p.h) + ':' + pad(p.mi); }
  // Each rule returns an error message, or '' when the field is fine (blank is always fine here).
  var RULES = {
    lat: function (s) { var v = String(s.lat).trim(); if (!v) return ''; var n = num(v); return isFinite(n) && Math.abs(n) <= 90 ? '' : 'Latitude is a number from -90 to 90, for example 49.4928.'; },
    lon: function (s) { var v = String(s.lon).trim(); if (!v) return ''; var n = num(v); return isFinite(n) && Math.abs(n) <= 180 ? '' : 'Longitude is a number from -180 to 180, for example -117.2948.'; },
    date: function (s) {
      if (!s.date) return '';
      if (!/^\d{4}-\d{2}-\d{2}$/.test(s.date) || +s.date.slice(0, 4) < 1900) return 'Enter the date as a full day, month and year.';
      return s.date > todayIn(zoneOf(s)) ? 'That date is in the future. Check the day and the year.' : '';
    },
    start: function (s) {
      if (!s.start || !s.date || s.date !== todayIn(zoneOf(s))) return '';
      return s.start > nowTimeIn(zoneOf(s)) ? 'That time has not come yet today. Check the time, or the date.' : '';
    },
    dur: function (s) { var v = String(s.dur).trim(); if (!v) return ''; var n = num(v); return !isFinite(n) ? 'Enter the length as a number, for example 40.' : n < 0 ? 'How long it lasted cannot be negative.' : ''; },
    others: function (s) { var v = String(s.others).trim(); if (!v) return ''; var n = num(v); return isFinite(n) && n >= 0 ? '' : 'Enter a number of people, 0 or more.'; },
    apart: function (s) { var v = String(s.apart).trim(); if (!v) return ''; var n = num(v); return isFinite(n) && n >= 0 ? '' : 'Enter a number of people, 0 or more.'; }
  };
  var ORDER = ['date', 'start', 'dur', 'lat', 'lon', 'others', 'apart'];
  function fieldFor(name) { return form.elements[name]; }
  function showError(input, msg) {
    var id = input.id + '-err', p = $(id);
    var by = (input.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
    if (msg) {
      input.setAttribute('aria-invalid', 'true');
      if (!p) { p = doc.createElement('p'); p.id = id; p.className = 'rp-err'; input.insertAdjacentElement('afterend', p); }
      p.textContent = msg;
      if (by.indexOf(id) < 0) { by.push(id); input.setAttribute('aria-describedby', by.join(' ')); }
    } else {
      input.removeAttribute('aria-invalid');
      if (p) p.textContent = '';
    }
  }
  function check(name, s) { var input = fieldFor(name); if (!input) return ''; var msg = RULES[name](s || read()); showError(input, msg); return msg; }
  function checkAll(s) {
    var bad = [];
    ORDER.forEach(function (n) { if (check(n, s)) bad.push(fieldFor(n)); });
    return bad;
  }
  function valid(s, name) { return !RULES[name](s); }

  /* ---------- the score ---------- */
  function coordsOk(s) {
    var la = num(s.lat), lo = num(s.lon);
    return isFinite(la) && isFinite(lo) && Math.abs(la) <= 90 && Math.abs(lo) <= 180;
  }
  function core(s) {
    return has(s.date) && valid(s, 'date') && has(s.start) && valid(s, 'start') && (has(s.place) || coordsOk(s));
  }
  var CHECKS = [['c_air', 'aircraft'], ['c_sat', 'satellites'], ['c_planet', 'planets'], ['c_drone', 'drones'], ['c_lantern', 'lanterns']];
  var CAP = 24;

  function score(s) {
    var parts = [], hints = [];
    function part(label, got, max) { parts.push({ label: label, got: got, max: max }); return got; }
    function hint(gain, text) { if (gain > 0) hints.push({ gain: gain, text: text }); }
    var dateOk = has(s.date) && valid(s, 'date'), startOk = has(s.start) && valid(s, 'start');

    /* time 12 */
    var t = (dateOk ? 5 : 0) + (startOk ? 7 : 0);
    part('Time', t, 12);
    if (!startOk) hint(7, 'Add the start time, even roughly.');
    if (!dateOk) hint(5, 'Add the date.');

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

    /* files 15: a ticked photo or video counts once the device that took it is named */
    var recorded = !!(s.photo || s.video);
    var named = recorded && has(s.device);
    var f = (named ? 5 : 0) + (named && s.original === 'yes' ? 10 : 0);
    part('Original files', f, 15);
    if (!recorded) hint(15, 'If you took any photo or video, tick it and keep the original file.');
    else if (!named) hint(s.original === 'yes' ? 15 : 5, 'Name the phone or camera that took it.');
    else if (s.original !== 'yes') hint(10, 'Keep the original file, not a screenshot or a shared copy.');

    /* checks 15: each ticked check counts once the time and place it depends on are in and the result is written down */
    var ticked = CHECKS.filter(function (k) { return s[k[0]]; });
    var todo = CHECKS.filter(function (k) { return !s[k[0]]; }).map(function (k) { return k[1]; });
    var backed = core(s) && has(s.checknote);
    var c = backed ? ticked.length * 3 : 0;
    part('Checks', c, 15);
    if (ticked.length && !backed) {
      hint(ticked.length * 3, core(s) ? 'Write down what your checks showed, so they count.' : 'Your ticked checks count once the date, time and place are in and you say what they showed.');
    }
    if (todo.length) hint(todo.length * 3, 'Rule out ordinary explanations: ' + list(todo) + '.');

    /* written 10 */
    var wr = { hour: 10, day: 6, week: 3, later: 0 }[s.written] || 0;
    part('Written soon', wr, 10);
    if (!s.written) hint(10, 'Say when you are writing this. Within an hour scores highest.');

    var total = 0;
    parts.forEach(function (x) { total += x.got; });
    hints.sort(function (a, b) { return b.gain - a.gain; });
    // Without a date, a time and a place nobody can check the report, so it stays thin.
    var capped = !core(s) && total > CAP;
    if (capped) total = CAP;
    if (!core(s)) hints.unshift({ gain: 0, text: 'Add the date, start time and place. Until all three are in, the report stays thin.', key: true });
    return { total: total, parts: parts, hints: hints, capped: capped };
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
    for (var k in s) { if (k === 'dur_unit' || k === 'tz') continue; if (s[k] === true || (typeof s[k] === 'string' && s[k].trim() !== '')) return false; }
    return true;
  }

  /* ---------- the meter ---------- */
  var lastSpoken = null, speakTimer = 0;
  function renderMeter(r, empty) {
    var b = band(r.total, empty);
    els.v.textContent = r.total;
    els.mini.textContent = r.total;
    if (els.miniBand) els.miniBand.textContent = b;
    els.band.textContent = b;
    els.bar.style.width = r.total + '%';
    els.hints.textContent = '';
    var top = r.hints.slice(0, 3);
    if (els.miniHint) els.miniHint.textContent = top.length ? 'Next: ' + top[0].text + (top[0].gain ? ' +' + top[0].gain : '') : 'Nothing left to add.';
    if (!top.length) {
      var li = doc.createElement('li'); li.className = 'done';
      li.textContent = 'Nothing left to add. This is as complete as a civilian report gets.';
      els.hints.appendChild(li);
    }
    top.forEach(function (h) {
      var li = doc.createElement('li');
      if (h.key) li.className = 'key';
      var t = doc.createElement('span'); t.textContent = h.text;
      li.appendChild(t);
      if (h.gain) { var g = doc.createElement('b'); g.textContent = '+' + h.gain; li.appendChild(g); }
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

  /* ---------- where to send it ---------- */
  var CANADA_ZONES = /^America\/(Vancouver|Edmonton|Regina|Winnipeg|Toronto|Montreal|Halifax|St_Johns|Moncton|Whitehorse|Iqaluit|Glace_Bay|Goose_Bay|Creston|Dawson_Creek|Fort_Nelson|Rankin_Inlet|Cambridge_Bay|Swift_Current|Resolute|Inuvik|Dawson|Yellowknife|Thunder_Bay|Nipigon|Rainy_River|Atikokan|Pangnirtung)$/;
  var CANADA_WORDS = /\b(canada|british columbia|alberta|saskatchewan|manitoba|ontario|quebec|québec|new brunswick|nova scotia|prince edward island|newfoundland|labrador|yukon|northwest territories|nunavut)\b|,\s*(bc|ab|sk|mb|on|qc|nb|ns|pe|pei|nl|yt|nt|nu)\b/i;
  function looksFast(s) {
    var text = [s.notes, s.move, s.shape].join(' ');
    var n = num(s.dur);
    return /\b(fireball|meteor|shooting star|streak|streaked|falling star|bolide)\b/i.test(text) || (s.dur_unit === 'seconds' && n > 0 && n <= 10);
  }
  // A Canadian place name, or a time zone only Canada uses, is enough to point to the Canadian routes.
  function inCanada(s) { return CANADA_WORDS.test(s.place || '') || CANADA_ZONES.test(zoneOf(s)); }
  function renderRoute(s, empty) {
    if (!els.route) return;
    var out = [];
    function item(html) { out.push(html); }
    if (empty) {
      item('Fill in the form above and this points you to the place that fits your report best.');
    } else {
      if (looksFast(s)) item('<strong>It sounds like a fast streak.</strong> That fits a meteor or fireball, so report it to the <a href="https://fireball.amsmeteors.org/members/imo/report_intro" rel="noopener" target="_blank">American Meteor Society fireball form</a> first. You can still send it to a UFO reporting center after.');
      if (inCanada(s)) item('<strong>You are in Canada.</strong> The <a href="https://canadianuforeport.ca/report-a-sighting" rel="noopener" target="_blank">Canadian UFO Survey</a> takes civilian reports. The federal <a href="https://science.gc.ca/site/science/en/office-chief-science-advisor/sky-canada-project/questions-and-answers-about-sky-canada-project" rel="noopener" target="_blank">Sky Canada Project</a> does not collect them. More in <a href="/intel/report-a-ufo-in-canada/">how to report a UFO sighting in Canada</a>.');
      else item('<strong>Anywhere else:</strong> <a href="https://nuforc.org/report-a-ufo/" rel="noopener" target="_blank">NUFORC</a> and <a href="https://mufon.com/cms-ifo-info/" rel="noopener" target="_blank">MUFON</a> both take civilian reports.');
    }
    item('AARO, the Pentagon office, does not take reports from the general public.');
    var html = '<li>' + out.join('</li><li>') + '</li>';
    if (els.route.innerHTML !== html) els.route.innerHTML = html;
  }

  /* ---------- the report model (preview, print and text share it) ---------- */
  function utcLine(s) {
    if (!has(s.date) || !has(s.start) || !valid(s, 'date')) return '';
    var dm = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s.date), tm = /^(\d{2}):(\d{2})/.exec(s.start);
    if (!dm || !tm) return '';
    var ms = zonedToUtc(+dm[1], +dm[2], +dm[3], +tm[1], +tm[2], zoneOf(s)), d = new Date(ms);
    return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()) + ' ' + pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()) + ' UTC';
  }
  function model(s, r) {
    var others = Math.max(0, Math.floor(num(s.others) || 0));
    var apart = Math.max(0, Math.floor(num(s.apart) || 0));
    var dur = num(s.dur) > 0 ? (+num(s.dur).toFixed(2)) + ' ' + (num(s.dur) === 1 ? s.dur_unit.replace(/s$/, '') : s.dur_unit) : '';
    var recorded = [s.photo ? 'Photo' : '', s.video ? 'Video' : ''].filter(Boolean).join(' and ');
    var original = { yes: 'Yes, original kept', copy: 'No, only a copy or screenshot', unsure: 'Not sure', none: 'Nothing was recorded' }[s.original] || '';
    var checked = CHECKS.filter(function (k) { return s[k[0]]; }).map(function (k) { return k[1]; });
    var unchecked = CHECKS.filter(function (k) { return !s[k[0]]; }).map(function (k) { return k[1]; });
    var written = { hour: 'Within an hour of it ending', day: 'Later the same day', week: 'Within a week', later: 'More than a week later' }[s.written] || '';
    var zone = zoneOf(s).replace(/_/g, ' ');
    return [
      { h: 'When', rows: [['Date', valid(s, 'date') ? s.date : ''], ['Start time', s.start && valid(s, 'start') ? s.start + ' (' + zone + ')' : ''], ['Start in UTC', utcLine(s)], ['Duration', dur]] },
      { h: 'Where', rows: [['Place', s.place], ['Coordinates', coordsOk(s) ? (+num(s.lat)).toFixed(4) + ', ' + (+num(s.lon)).toFixed(4) : ''], ['Observer was', s.vantage]] },
      { h: 'Sky and weather', rows: [['Light', s.light], ['Sky', s.sky], ['Moon', s.moon]] },
      { h: 'What was seen', rows: [['Shape', s.shape], ['Color', s.colour], ['Brightness', s.bright], ['Size', s.size], ['Height', s.elev], ['Movement', s.move], ['Sound', s.sound]] },
      { h: 'Direction', rows: [['First seen', s.first], ['Moving', s.travel]] },
      { h: 'Other witnesses', rows: [['Others who saw it', String(s.others).trim() === '' ? '' : String(others)], ['From another place', String(s.apart).trim() === '' ? '' : String(apart)], ['Will confirm', s.confirm]] },
      { h: 'Recorded', rows: [['Media', recorded], ['Device', s.device], ['Original file', original]] },
      { h: 'Ordinary explanations', rows: [['Checked', checked.length ? cap(list(checked)) : ''], ['Not checked', unchecked.length ? cap(list(unchecked)) : 'None'], ['What they showed', s.checknote]] },
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
    renderRoute(s, empty);
    if (persist) { clearTimeout(saveTimer); saveTimer = setTimeout(function () { save(s); }, 250); }
    return { s: s, r: r };
  }
  form.addEventListener('input', function (e) {
    var n = e.target && e.target.name;
    if (n && RULES[n] && e.target.getAttribute('aria-invalid') === 'true') check(n); // clear the message as soon as it is fixed
    update(true);
  });
  form.addEventListener('change', function (e) {
    var n = e.target && e.target.name, s = read();
    if (n && RULES[n]) check(n, s);
    if (n === 'date' || n === 'tz') { check('date', s); check('start', s); }
    update(true);
  });
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
        check('lat'); check('lon');
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
  // Output waits until every filled-in field makes sense; the first problem gets focus.
  function readyForOutput() {
    var s = read(), bad = checkAll(s);
    if (!bad.length) return true;
    status('Check the highlighted ' + (bad.length === 1 ? 'field' : 'fields') + ' in the form first.');
    bad[0].focus();
    return false;
  }
  $('rp-print').addEventListener('click', function () {
    if (!readyForOutput()) return;
    update(false);
    track('report_print');
    window.print();
  });
  window.addEventListener('beforeprint', function () { update(false); });
  $('rp-copy').addEventListener('click', function () {
    if (!readyForOutput()) return;
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
  // The phone's own share sheet, where the browser offers one.
  if (els.share && navigator.share) {
    els.share.hidden = false;
    els.share.addEventListener('click', function () {
      if (!readyForOutput()) return;
      var cur = update(false);
      navigator.share({ title: 'Witness report', text: asText(cur.s, cur.r) }).then(function () {
        status('Shared. Nothing was sent by this page; your phone handed the text to the app you chose.');
        track('report_share');
      }, function (e) {
        if (e && e.name === 'AbortError') return;
        status('Sharing did not work here. Use Copy as text instead.');
      });
    });
  }
  $('rp-clear').addEventListener('click', function () {
    if (!window.confirm('Clear this draft? This deletes the report from this browser and cannot be undone.')) return;
    clearTimeout(saveTimer); // a save queued by the last edit must not write the old draft back
    form.reset();
    els.tz.value = deviceTz;
    [].forEach.call(form.querySelectorAll('[aria-invalid]'), function (i) { showError(i, ''); });
    try { localStorage.removeItem(KEY); } catch (e) {}
    els.saved.textContent = 'Draft on this device';
    els.locMsg.textContent = 'Your browser asks first. The numbers are written into this form and go nowhere else.';
    hideImport();
    update(false);
    status('Draft cleared from this browser.');
    var first = form.querySelector('input, select, textarea');
    if (first) first.focus();
  });

  /* ---------- a sighting handed over by the sky identifier ---------- */
  function hideImport() { if (els.imp) els.imp.hidden = true; }
  if (els.impX) els.impX.addEventListener('click', function () {
    hideImport();
    var first = form.querySelector('input, select, textarea');
    if (first) first.focus();
  });
  var MOVE = { moving: 'Straight, steady line', blinking: 'Blinked or flashed', still: 'Did not move' };
  function readHandoff() {
    var raw = null;
    try { raw = sessionStorage.getItem(HANDOFF_KEY); sessionStorage.removeItem(HANDOFF_KEY); } catch (e) { return null; }
    if (!raw) return null;
    try {
      var h = JSON.parse(raw);
      if (!h || h.v !== 1 || typeof h.at !== 'number' || Date.now() - h.at > 864e5) return null;
      return h;
    } catch (e) { return null; }
  }
  function applyHandoff(h) {
    var s = {}, filled = [];
    function set(name, v, label) { if (v === null || v === undefined || v === '') return; s[name] = v; if (label && filled.indexOf(label) < 0) filled.push(label); }
    if (/^\d{4}-\d{2}-\d{2}$/.test(h.date || '')) set('date', h.date, 'date');
    if (/^\d{2}:\d{2}$/.test(h.time || '')) set('start', h.time, 'start time');
    if (zoneOk(h.zone)) set('tz', h.zone, 'time zone');
    if (typeof h.place === 'string' && h.place) set('place', h.place, 'place');
    if (isFinite(h.lat) && isFinite(h.lon) && Math.abs(h.lat) <= 90 && Math.abs(h.lon) <= 180) { set('lat', (+h.lat).toFixed(4), 'coordinates'); set('lon', (+h.lon).toFixed(4)); }
    if (/^(North|Northeast|East|Southeast|South|Southwest|West|Northwest)$/.test(h.dir || '')) set('first', h.dir, 'direction');
    if (h.height === 'over') set('elev', 'Almost overhead', 'height');
    if (MOVE[h.what]) set('move', MOVE[h.what], 'movement');
    if (h.what === 'line') set('shape', 'Line of lights', 'shape');
    // Tick only what the identifier really checked for this time and place.
    var did = [];
    if (h.checked && h.checked.satellites === true) { set('c_sat', true); did.push('satellite positions (the space station, bright satellites and recent Starlink launches)'); }
    if (h.checked && h.checked.planets === true) { set('c_planet', true); did.push('where the planets, the Moon and the brightest stars were'); }
    var tops = Array.isArray(h.top) ? h.top.filter(function (t) { return t && typeof t.name === 'string'; }).slice(0, 3) : [];
    var topLine = tops.length ? ' It listed: ' + tops.map(function (t) { return t.name + ' (' + (t.match || 'weak') + ' match)'; }).join('; ') + '.' : '';
    if (did.length) {
      var cur = String(form.elements.checknote.value || '').trim();
      set('checknote', (cur ? cur + ' ' : '') + 'The DISCLOSURE sky identifier checked ' + list(did) + ' for this time and place.' + topLine, 'what the checks showed');
    }
    var bits = [];
    if (h.dir) bits.push('looking ' + String(h.dir).toLowerCase());
    if (h.heightWords) bits.push(h.heightWords);
    if (h.whatWords) bits.push('it was ' + h.whatWords);
    if (bits.length || topLine) {
      var line = 'From the sky identifier: ' + (bits.length ? bits.join(', ') + '.' : '') + topLine;
      var notes = String(form.elements.notes.value || '').trim();
      if (notes.indexOf('From the sky identifier:') < 0) set('notes', notes ? notes + '\n\n' + line.trim() : line.trim(), 'notes');
    }
    write(s);
    return { filled: filled, sats: !!(h.checked && h.checked.satellites), planets: !!(h.checked && h.checked.planets) };
  }

  /* ---------- start ---------- */
  var stored = load();
  if (stored) {
    write(stored);
    els.saved.textContent = 'Draft restored from this device';
  }
  if (clearedOld && els.old) { els.old.hidden = false; }
  var handed = readHandoff();
  if (handed) {
    var res = applyHandoff(handed);
    if (els.imp && els.impT) {
      var ticks = res.sats && res.planets ? ' It ticked satellites and planets because it checked both.' : res.planets ? ' It ticked planets; satellites were not checked, so that box is left for you.' : '';
      els.impT.textContent = 'Imported from the sky identifier: ' + (res.filled.length ? list(res.filled) : 'nothing it could use') + '.' + ticks + ' Check each field against what you remember.';
      els.imp.hidden = false;
      // The visitor came here to log the sighting: open on the filled form, and read the note out first.
      var toNote = function () {
        var nav = doc.querySelector('.dx-nav'), mini = form.querySelector('.rp-mini');
        var off = (nav ? nav.getBoundingClientRect().bottom : 0) + (mini && getComputedStyle(mini).position === 'sticky' ? mini.offsetHeight : 0) + 16;
        window.scrollTo(0, Math.max(0, window.pageYOffset + els.imp.getBoundingClientRect().top - off));
      };
      toNote();
      try { els.imp.focus({ preventScroll: true }); } catch (e) {}
      // fonts and the header image can shift the page once they arrive; settle on the note again
      if (doc.readyState !== 'complete') window.addEventListener('load', function () { if (doc.activeElement === els.imp) toNote(); }, { once: true });
    }
    checkAll(read());
    save(read());
    track('report_import');
  }
  lastSpoken = null;
  var init = update(false);
  lastSpoken = 'Report strength ' + init.r.total + ' of 100, ' + band(init.r.total, isEmpty(init.s)).toLowerCase() + '.';
  clearTimeout(speakTimer);

  /* test hook: read-only, for the verification script */
  window.DXReport = {
    score: function () { return score(read()).total; },
    band: function () { var s = read(); return band(score(s).total, isEmpty(s)); },
    text: function () { var c = update(false); return asText(c.s, c.r); }
  };
})();
