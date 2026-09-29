/* DISCLOSURE: "What did I just see?" sky identifier (/tools/what-did-i-see/).
   Everything is worked out in this browser. The location never leaves the device: the only
   network requests are for the two vendored libraries and the satellite elements (/api/tle,
   falling back to the saved copy at /assets/data/tle-snapshot.json).
   Libraries (MIT, vendored): satellite.js (SGP4 propagation) and astronomy-engine (Sun, Moon,
   planets). Both load only when the visitor presses Identify. */
(function () {
  'use strict';
  var root = document.querySelector('[data-sky]');
  if (!root) return;

  var VENDOR = {
    sat: '/assets/vendor/satellite-js/satellite.min.js',
    astro: '/assets/vendor/astronomy-engine/astronomy.browser.min.js'
  };
  var DEG = Math.PI / 180;
  var RAD = 180 / Math.PI;
  var KM_PER_AU = 149597870.7;
  var R_EARTH = 6371;

  /* ---------- reference data ---------- */
  var PLACES = {
    castlegar: { name: 'Castlegar, BC', lat: 49.3237, lon: -117.6593, tz: 'America/Vancouver' },
    vancouver: { name: 'Vancouver', lat: 49.2827, lon: -123.1207, tz: 'America/Vancouver' },
    toronto: { name: 'Toronto', lat: 43.6532, lon: -79.3832, tz: 'America/Toronto' },
    newyork: { name: 'New York', lat: 40.7128, lon: -74.006, tz: 'America/New_York' },
    losangeles: { name: 'Los Angeles', lat: 34.0522, lon: -118.2437, tz: 'America/Los_Angeles' },
    london: { name: 'London', lat: 51.5074, lon: -0.1278, tz: 'Europe/London' },
    sydney: { name: 'Sydney', lat: -33.8688, lon: 151.2093, tz: 'Australia/Sydney' }
  };

  // Bright stars, J2000 right ascension (hours), declination (degrees), visual magnitude.
  var STARS = [
    ['Sirius', 6.7525, -16.7161, -1.46], ['Canopus', 6.3992, -52.6957, -0.74],
    ['Alpha Centauri', 14.6599, -60.834, -0.27], ['Arcturus', 14.261, 19.1824, -0.05],
    ['Vega', 18.6156, 38.7837, 0.03], ['Capella', 5.2782, 45.998, 0.08],
    ['Rigel', 5.2423, -8.2016, 0.13], ['Procyon', 7.655, 5.225, 0.34],
    ['Achernar', 1.6286, -57.2368, 0.46], ['Betelgeuse', 5.9195, 7.4071, 0.5],
    ['Altair', 19.8464, 8.8683, 0.77], ['Aldebaran', 4.5987, 16.5093, 0.86],
    ['Antares', 16.4901, -26.432, 0.96], ['Spica', 13.4199, -11.1613, 0.97],
    ['Pollux', 7.7553, 28.0262, 1.14], ['Fomalhaut', 22.9608, -29.6222, 1.16],
    ['Deneb', 20.6905, 45.2803, 1.25], ['Regulus', 10.1395, 11.9672, 1.35],
    ['Polaris', 2.5303, 89.2641, 1.98]
  ];

  // Major showers from the IMO 2026 Meteor Shower Calendar (Table 5, working list):
  // [name, activity start (month, day), activity end (month, day), peak (month, day)].
  var SHOWERS = [
    ['Quadrantids', [12, 28], [1, 12], [1, 3]], ['Lyrids', [4, 14], [4, 30], [4, 22]],
    ['Eta Aquariids', [4, 19], [5, 28], [5, 6]], ['Alpha Capricornids', [7, 3], [8, 15], [7, 31]],
    ['Southern Delta Aquariids', [7, 12], [8, 23], [7, 31]], ['Perseids', [7, 17], [8, 24], [8, 13]],
    ['Draconids', [10, 6], [10, 10], [10, 9]], ['Orionids', [10, 2], [11, 7], [10, 21]],
    ['Southern Taurids', [9, 20], [11, 20], [11, 5]], ['Northern Taurids', [10, 20], [12, 10], [11, 12]],
    ['Leonids', [11, 6], [11, 30], [11, 17]], ['Geminids', [12, 4], [12, 20], [12, 14]],
    ['Ursids', [12, 17], [12, 26], [12, 22]]
  ];
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var DIRS = ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest'];
  var DIR_AB = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  var BANDS = { low: [0, 30], half: [30, 60], over: [60, 90] };

  // How well each kind of object fits each answer to "what did it do" (0 to 1).
  var FIT = {
    moving: { station: 1, sat: 1, train: 0.7, planet: 0.15, star: 0.1, moon: 0.05 },
    blinking: { station: 0.15, sat: 0.3, train: 0.1, planet: 0.2, star: 0.35, moon: 0 },
    line: { station: 0.15, sat: 0.15, train: 1, planet: 0.05, star: 0.05, moon: 0 },
    still: { station: 0.05, sat: 0, train: 0, planet: 1, star: 0.85, moon: 0.9 },
    streak: { station: 0.1, sat: 0.1, train: 0.05, planet: 0, star: 0, moon: 0 },
    hover: { station: 0.1, sat: 0.05, train: 0.05, planet: 0.85, star: 0.6, moon: 0.5 }
  };

  /* ---------- elements ---------- */
  var form = root.querySelector('#sky-form');
  var el = {
    date: root.querySelector('#sky-date'), time: root.querySelector('#sky-time'), now: root.querySelector('#sky-now'),
    tz: root.querySelector('[data-tz]'), place: root.querySelector('#sky-place'), geo: root.querySelector('#sky-geo'),
    lat: root.querySelector('#sky-lat'), lon: root.querySelector('#sky-lon'), geoStatus: root.querySelector('#sky-geo-status'),
    compass: root.querySelector('.sf-compass'), submit: root.querySelector('#sky-go'), err: root.querySelector('#sky-error'),
    outH: root.querySelector('#sky-out-h'), meta: root.querySelector('#sky-meta'), list: root.querySelector('#sky-list'),
    none: root.querySelector('#sky-none'), dome: root.querySelector('#sky-dome'), live: root.querySelector('#sky-live')
  };
  var deviceTz = (function () { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'; } catch (e) { return 'UTC'; } })();
  var state = { tz: deviceTz, dir: null, timeTouched: false };

  /* ---------- time zones ---------- */
  function partsIn(ms, tz) {
    var f = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    var o = {};
    f.formatToParts(new Date(ms)).forEach(function (p) { o[p.type] = p.value; });
    return { y: +o.year, mo: +o.month, d: +o.day, h: +o.hour % 24, mi: +o.minute, s: +o.second };
  }
  function tzOffset(ms, tz) {
    var p = partsIn(ms, tz);
    return Date.UTC(p.y, p.mo - 1, p.d, p.h, p.mi, p.s) - Math.floor(ms / 1000) * 1000;
  }
  function zonedToUtc(y, mo, d, h, mi, tz) {
    var guess = Date.UTC(y, mo - 1, d, h, mi);
    for (var i = 0; i < 3; i++) guess = Date.UTC(y, mo - 1, d, h, mi) - tzOffset(guess, tz);
    return guess;
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function setNow() {
    var p = partsIn(Date.now(), state.tz);
    el.date.value = p.y + '-' + pad(p.mo) + '-' + pad(p.d);
    el.time.value = pad(p.h) + ':' + pad(p.mi);
    state.timeTouched = false;
  }
  function clock(ms) {
    try { return new Intl.DateTimeFormat('en-US', { timeZone: state.tz, hour: 'numeric', minute: '2-digit' }).format(new Date(ms)); }
    catch (e) { return new Date(ms).toISOString().slice(11, 16) + ' UTC'; }
  }
  function dayLabel(ms) { var d = new Date(ms); return d.getUTCDate() + ' ' + MONTHS[d.getUTCMonth()] + ' ' + d.getUTCFullYear(); }
  function showTz() { if (el.tz) el.tz.textContent = state.tz.replace(/_/g, ' '); }

  /* ---------- inputs ---------- */
  setNow();
  showTz();
  el.now.addEventListener('click', function () { setNow(); el.time.focus(); });
  el.date.addEventListener('input', function () { state.timeTouched = true; });
  el.time.addEventListener('input', function () { state.timeTouched = true; });

  el.place.addEventListener('change', function () {
    var p = PLACES[el.place.value];
    if (!p) return;
    el.lat.value = p.lat;
    el.lon.value = p.lon;
    state.tz = p.tz;
    if (!state.timeTouched) setNow();
    showTz();
    clearFieldError(el.lat); clearFieldError(el.lon);
    el.geoStatus.textContent = p.name + ' set. Times are read as local time there.';
  });
  function manualCoords() {
    var key = el.place.value, p = PLACES[key];
    if (p && (Math.abs(+el.lat.value - p.lat) > 0.01 || Math.abs(+el.lon.value - p.lon) > 0.01)) {
      el.place.value = '';
      state.tz = deviceTz;
      showTz();
    }
  }
  el.lat.addEventListener('input', manualCoords);
  el.lon.addEventListener('input', manualCoords);

  el.geo.addEventListener('click', function () {
    if (!('geolocation' in navigator)) { el.geoStatus.textContent = 'This browser cannot share a location. Pick a place or type the coordinates.'; return; }
    el.geo.disabled = true;
    el.geoStatus.textContent = 'Asking this device for its location. It stays here and is never sent anywhere.';
    navigator.geolocation.getCurrentPosition(function (pos) {
      el.geo.disabled = false;
      el.lat.value = pos.coords.latitude.toFixed(3);
      el.lon.value = pos.coords.longitude.toFixed(3);
      el.place.value = '';
      state.tz = deviceTz;
      if (!state.timeTouched) setNow();
      showTz();
      clearFieldError(el.lat); clearFieldError(el.lon);
      el.geoStatus.textContent = 'Location set on this device: ' + el.lat.value + ', ' + el.lon.value + '. Nothing was sent anywhere.';
    }, function (err) {
      el.geo.disabled = false;
      el.geoStatus.textContent = err && err.code === 1
        ? 'Location is switched off for this page. Pick a place or type the coordinates instead.'
        : 'The location could not be read. Pick a place or type the coordinates instead.';
    }, { enableHighAccuracy: false, timeout: 12000, maximumAge: 600000 });
  });

  // The compass: a radiogroup of buttons with a roving tab stop.
  var dirBtns = Array.prototype.slice.call(el.compass.querySelectorAll('[role="radio"]'));
  function pickDir(btn, focus) {
    dirBtns.forEach(function (b) { var on = b === btn; b.setAttribute('aria-checked', on ? 'true' : 'false'); b.tabIndex = on ? 0 : -1; });
    var v = btn.getAttribute('data-az');
    state.dir = v === '' || v === null ? null : +v;
    if (focus) btn.focus();
    drawDome(null);
  }
  dirBtns.forEach(function (b, i) {
    b.tabIndex = i === 0 ? 0 : -1;
    b.addEventListener('click', function () { pickDir(b, false); });
    b.addEventListener('keydown', function (e) {
      var k = e.key, n = dirBtns.length, j = null;
      if (k === 'ArrowRight' || k === 'ArrowDown') j = (i + 1) % n;
      else if (k === 'ArrowLeft' || k === 'ArrowUp') j = (i - 1 + n) % n;
      else if (k === 'Home') j = 0;
      else if (k === 'End') j = n - 1;
      else if (k === ' ' || k === 'Enter') { e.preventDefault(); pickDir(b, false); return; }
      if (j !== null) { e.preventDefault(); pickDir(dirBtns[j], true); }
    });
  });
  form.addEventListener('change', function (e) { if (e.target && e.target.name === 'height') drawDome(null); });

  function radioValue(name) { var r = form.querySelector('input[name="' + name + '"]:checked'); return r && r.value !== 'unsure' ? r.value : null; }

  /* ---------- validation ---------- */
  function fieldError(input, msg) {
    input.setAttribute('aria-invalid', 'true');
    var id = input.id + '-err', p = document.getElementById(id);
    if (!p) { p = document.createElement('p'); p.id = id; p.className = 'sf-err'; input.parentNode.appendChild(p); }
    p.textContent = msg;
    var by = (input.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
    if (by.indexOf(id) < 0) { by.push(id); input.setAttribute('aria-describedby', by.join(' ')); }
  }
  function clearFieldError(input) {
    input.removeAttribute('aria-invalid');
    var p = document.getElementById(input.id + '-err');
    if (p) p.textContent = '';
  }
  function readForm() {
    var bad = [];
    [el.date, el.time, el.lat, el.lon].forEach(clearFieldError);
    var dm = /^(\d{4})-(\d{2})-(\d{2})$/.exec(el.date.value || '');
    var tm = /^(\d{2}):(\d{2})/.exec(el.time.value || '');
    if (!dm) { fieldError(el.date, 'Enter the date you saw it.'); bad.push(el.date); }
    if (!tm) { fieldError(el.time, 'Enter the time you saw it.'); bad.push(el.time); }
    var lat = el.lat.value.trim() === '' ? NaN : +el.lat.value;
    var lon = el.lon.value.trim() === '' ? NaN : +el.lon.value;
    if (!(lat >= -90 && lat <= 90)) { fieldError(el.lat, 'Latitude is a number from -90 to 90. Use your location or pick a place to fill it.'); bad.push(el.lat); }
    if (!(lon >= -180 && lon <= 180)) { fieldError(el.lon, 'Longitude is a number from -180 to 180.'); bad.push(el.lon); }
    if (bad.length) return { bad: bad };
    var y = +dm[1];
    if (y < 1900 || y > 2100) { fieldError(el.date, 'Pick a date between 1900 and 2100.'); return { bad: [el.date] }; }
    return {
      t: zonedToUtc(y, +dm[2], +dm[3], +tm[1], +tm[2], state.tz),
      lat: lat, lon: lon, dir: state.dir, height: radioValue('height'), what: radioValue('what'),
      place: (PLACES[el.place.value] || {}).name || null
    };
  }

  /* ---------- loading ---------- */
  var libPromise = null, dataPromise = null;
  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src; s.async = true;
      s.onload = function () { resolve(); };
      s.onerror = function () { reject(new Error('load ' + src)); };
      document.head.appendChild(s);
    });
  }
  function loadLibs() {
    if (!libPromise) libPromise = Promise.all([loadScript(VENDOR.sat), loadScript(VENDOR.astro)]).catch(function (e) { libPromise = null; throw e; });
    return libPromise;
  }
  function validDoc(d) { return d && d.v === 1 && Array.isArray(d.sats) && typeof d.fetched === 'string' && isFinite(Date.parse(d.fetched)); }
  function getJson(url, ms) {
    var ctrl = 'AbortController' in window ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, ms) : null;
    return fetch(url, { signal: ctrl ? ctrl.signal : undefined, credentials: 'omit' })
      .then(function (r) { if (!r.ok) throw new Error('status ' + r.status); return r.json(); })
      .then(function (d) { if (timer) clearTimeout(timer); if (!validDoc(d)) throw new Error('shape'); return d; },
        function (e) { if (timer) clearTimeout(timer); throw e; });
  }
  function loadSats() {
    if (!dataPromise) {
      dataPromise = getJson('/api/tle/', 7000)
        .then(function (d) { return { doc: d, snapshot: false }; })
        .catch(function () { return getJson('/assets/data/tle-snapshot.json', 7000).then(function (d) { return { doc: d, snapshot: true }; }); })
        .catch(function () { return { doc: null, snapshot: false }; })
        .then(function (res) { res.recs = res.doc ? buildRecs(res.doc) : []; return res; });
    }
    return dataPromise;
  }
  function buildRecs(doc) {
    var S = window.satellite, out = [], seen = {};
    doc.sats.forEach(function (r) {
      if (!Array.isArray(r) || r.length < 14 || typeof r[0] !== 'string') return;
      for (var k = 4; k <= 12; k++) if (typeof r[k] !== 'number' || !isFinite(r[k])) return;
      var key = r[3] + '|' + r[4] + '|' + r[9];
      if (r[13] === 's' && seen[key]) return; // docked station modules share the station's elements
      seen[key] = 1;
      var omm = { OBJECT_NAME: r[0], OBJECT_ID: r[1], NORAD_CAT_ID: r[2], EPOCH: r[3], MEAN_MOTION: r[4], ECCENTRICITY: r[5], INCLINATION: r[6],
        RA_OF_ASC_NODE: r[7], ARG_OF_PERICENTER: r[8], MEAN_ANOMALY: r[9], BSTAR: r[10], MEAN_MOTION_DOT: r[11], MEAN_MOTION_DDOT: r[12] };
      var rec;
      try { rec = S.json2satrec(omm); } catch (e) { return; }
      if (!rec || rec.error) return;
      var name = r[0], id = r[2], g = r[13], kind = 'sat', std = 3.5, label = name;
      if (id === 25544) { kind = 'station'; std = -1.8; label = 'International Space Station'; }
      else if (/TIANHE/.test(name)) { kind = 'station'; std = -0.8; label = 'Tiangong space station (China)'; }
      else if (g === 'r' && /STARLINK/.test(name)) { kind = 'starlink'; std = 4; }
      else if (g === 'r') { std = /R\/B/.test(name) ? 4 : 5.5; }
      else if (g === 's') { std = 4; }
      out.push({ rec: rec, name: name, label: label, id: id, intl: r[1], kind: kind, std: std, group: g });
    });
    return out;
  }

  /* ---------- geometry ---------- */
  function angDiff(a, b) { var d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; }
  function dirWord(az) { return DIRS[Math.round(((az % 360) + 360) % 360 / 45) % 8]; }
  function dirAb(az) { return DIR_AB[Math.round(((az % 360) + 360) % 360 / 45) % 8]; }
  function airmassExt(alt) { var a = Math.max(alt, 1); return 0.25 * (1 / Math.sin(a * DEG) - 1); }
  function limitMag(sunAlt) {
    if (sunAlt > -0.8) return -3.5;
    if (sunAlt > -3) return -1.5;
    if (sunAlt > -6) return 1;
    if (sunAlt > -9) return 2.5;
    if (sunAlt > -12) return 3.5;
    return 4.2;
  }
  function brightWord(m) { return m < -3 ? 'extremely bright' : m < -1 ? 'very bright' : m < 1 ? 'bright' : m < 2.5 ? 'easy to see' : 'faint'; }

  function dirScore(q, az, alt) {
    if (q.dir === null) return 0.55;
    var d = angDiff(az, q.dir), s;
    if (d <= 25) s = 1; else if (d <= 50) s = 1 - (d - 25) / 25 * 0.5; else if (d <= 90) s = 0.5 - (d - 50) / 40 * 0.5; else s = 0;
    if (alt > 70) s = Math.max(s, 0.85); // near the zenith every direction is "up"
    else if (alt > 60) s = Math.max(s, 0.5);
    return s;
  }
  function heightScore(q, alt) {
    if (q.height === null) return 0.55;
    var b = BANDS[q.height], out = alt < b[0] ? b[0] - alt : alt > b[1] ? alt - b[1] : 0;
    return out === 0 ? 1 : out <= 10 ? 0.6 : out <= 20 ? 0.25 : 0;
  }
  function posScore(q, az, alt) { return Math.sqrt(dirScore(q, az, alt) * heightScore(q, alt)); }
  function fit(q, kind, alt) {
    if (q.what === null) return 0.6;
    var f = FIT[q.what][kind === 'starlink' ? 'sat' : kind];
    if (q.what === 'blinking' && (kind === 'star' || kind === 'planet') && alt < 25) f = kind === 'star' ? 0.7 : 0.4; // low light twinkles hard
    return f;
  }
  function brightFactor(q, mag, kind) {
    if (q.what === 'still' || q.what === 'hover') return mag < -2 ? 1.08 : mag < 0 ? 1 : mag < 1 ? 0.82 : 0.6;
    if (kind === 'sat' || kind === 'starlink') return mag < 0 ? 1 : mag < 1.5 ? 0.88 : mag < 3 ? 0.78 : 0.65;
    return mag < 1.5 ? 1 : 0.8;
  }

  /* ---------- the sky at one moment ---------- */
  function skyNow(q) {
    var A = window.Astronomy;
    var date = new Date(q.t), time = A.MakeTime(date), obs = new A.Observer(q.lat, q.lon, 0);
    function horizon(body) { var eq = A.Equator(body, time, obs, true, true); return A.Horizon(time, obs, eq.ra, eq.dec, 'normal'); }
    var sun = horizon(A.Body.Sun);
    var out = { sunAlt: sun.altitude, sunAz: sun.azimuth, bodies: [], time: time };
    var lim = limitMag(sun.altitude);
    [['Venus', A.Body.Venus], ['Jupiter', A.Body.Jupiter], ['Mars', A.Body.Mars], ['Saturn', A.Body.Saturn], ['Mercury', A.Body.Mercury]].forEach(function (p) {
      var h = horizon(p[1]), mag = A.Illumination(p[1], time).mag;
      out.bodies.push({ name: p[0], kind: 'planet', alt: h.altitude, az: h.azimuth, mag: mag, eff: mag + airmassExt(h.altitude), lim: lim });
    });
    var mh = horizon(A.Body.Moon), mi = A.Illumination(A.Body.Moon, time);
    out.bodies.push({ name: 'The Moon', kind: 'moon', alt: mh.altitude, az: mh.azimuth, mag: mi.mag, eff: mi.mag, lim: 99, phase: mi.phase_fraction });
    var rot = A.Rotation_EQJ_EQD(time);
    STARS.forEach(function (s) {
      var v = A.VectorFromSphere(new A.Spherical(s[2], s[1] * 15, 1), time);
      var eq = A.EquatorFromVector(A.RotateVector(rot, v));
      var h = A.Horizon(time, obs, eq.ra, eq.dec, 'normal');
      out.bodies.push({ name: s[0], kind: 'star', alt: h.altitude, az: h.azimuth, mag: s[3], eff: s[3] + airmassExt(h.altitude), lim: lim });
    });
    return out;
  }

  /* ---------- satellites across a window around the reported time ---------- */
  var STEP_S = 20, HALF_WINDOW_S = 600;
  function satPass(q, recs) {
    var S = window.satellite, A = window.Astronomy;
    var obsGd = { latitude: q.lat * DEG, longitude: q.lon * DEG, height: 0 };
    var steps = [];
    for (var dt = -HALF_WINDOW_S; dt <= HALF_WINDOW_S; dt += STEP_S) {
      var ms = q.t + dt * 1000, d = new Date(ms), gmst = S.gstime(d);
      var sunV = A.GeoVector(A.Body.Sun, A.MakeTime(d), true);
      var sx = sunV.x * KM_PER_AU, sy = sunV.y * KM_PER_AU, sz = sunV.z * KM_PER_AU, sl = Math.sqrt(sx * sx + sy * sy + sz * sz);
      // observer position in ECI (spherical Earth is enough for phase angles)
      var lst = gmst + q.lon * DEG, cl = Math.cos(q.lat * DEG);
      var o = { x: R_EARTH * cl * Math.cos(lst), y: R_EARTH * cl * Math.sin(lst), z: R_EARTH * Math.sin(q.lat * DEG) };
      var t = A.MakeTime(d), ob = new A.Observer(q.lat, q.lon, 0), se = A.Equator(A.Body.Sun, t, ob, true, true);
      var sunAlt = A.Horizon(t, ob, se.ra, se.dec, 'normal').altitude;
      steps.push({ dt: dt, ms: ms, date: d, gmst: gmst, sun: { x: sx / sl, y: sy / sl, z: sz / sl }, sunAbs: { x: sx, y: sy, z: sz }, obs: o, sunAlt: sunAlt, lim: limitMag(sunAlt) });
    }
    function look(r, st) {
      var pv;
      try { pv = S.propagate(r.rec, st.date); } catch (e) { return null; }
      if (!pv || !pv.position || typeof pv.position === 'boolean' || !isFinite(pv.position.x)) return null;
      var p = pv.position, la = S.ecfToLookAngles(obsGd, S.eciToEcf(p, st.gmst));
      var alt = la.elevation * RAD, az = ((la.azimuth * RAD) % 360 + 360) % 360;
      if (alt < 0) return { alt: alt, az: az, lit: false };
      var s = st.sun, dot = p.x * s.x + p.y * s.y + p.z * s.z;
      var px = p.x - dot * s.x, py = p.y - dot * s.y, pz = p.z - dot * s.z;
      var lit = !(dot < 0 && Math.sqrt(px * px + py * py + pz * pz) < R_EARTH);
      // phase angle at the satellite between the Sun and the observer
      var toSun = { x: st.sunAbs.x - p.x, y: st.sunAbs.y - p.y, z: st.sunAbs.z - p.z };
      var toObs = { x: st.obs.x - p.x, y: st.obs.y - p.y, z: st.obs.z - p.z };
      var n1 = Math.sqrt(toSun.x * toSun.x + toSun.y * toSun.y + toSun.z * toSun.z), n2 = Math.sqrt(toObs.x * toObs.x + toObs.y * toObs.y + toObs.z * toObs.z);
      var ph = Math.acos(Math.max(-1, Math.min(1, (toSun.x * toObs.x + toSun.y * toObs.y + toSun.z * toObs.z) / (n1 * n2))));
      var F = ((Math.PI - ph) * Math.cos(ph) + Math.sin(ph)) / Math.PI;
      var mag = r.std + 5 * Math.log10(la.rangeSat / 1000) - 2.5 * Math.log10(Math.max(F, 1e-3) * Math.PI) + airmassExt(alt);
      return { alt: alt, az: az, lit: lit, mag: mag };
    }
    // slack: flat solar panels throw more light than the diffuse-sphere estimate, most of all
    // on a fresh Starlink batch, so the brightness gate is loose and only rules out the faint
    function seen(l, st, slack) { return l && l.alt > 8 && l.lit && st.sunAlt <= -4 && l.mag <= st.lim + (slack || 0.3); }
    function track(r, i) {
      var pts = [];
      for (var k = Math.max(0, i - 6); k <= Math.min(steps.length - 1, i + 6); k++) { var l = look(r, steps[k]); if (l && l.alt > 0) pts.push({ alt: l.alt, az: l.az }); }
      return pts;
    }
    var singles = [], trains = {};
    recs.forEach(function (r) {
      if (r.kind === 'starlink') { var g = (r.intl || '').slice(0, 8) || r.name; (trains[g] = trains[g] || []).push(r); }
      var best = null;
      for (var i = 0; i < steps.length; i++) {
        var st = steps[i], l = look(r, st);
        if (!seen(l, st)) continue;
        var tf = 1 - 0.35 * Math.abs(st.dt) / HALF_WINDOW_S;
        var sc = posScore(q, l.az, l.alt) * fit(q, r.kind === 'station' ? 'station' : 'sat', l.alt) * brightFactor(q, l.mag, 'sat') * tf;
        if (!best || sc > best.score) best = { score: sc, i: i, l: l };
      }
      if (best && best.score > 0.05 && (r.kind !== 'starlink' || best.l.mag < 3.5)) {
        singles.push({ r: r, score: best.score, alt: best.l.alt, az: best.l.az, mag: best.l.mag, ms: steps[best.i].ms, dt: steps[best.i].dt, path: track(r, best.i) });
      }
    });
    var trainOut = [];
    Object.keys(trains).forEach(function (g) {
      var members = trains[g];
      if (members.length < 3) return;
      var best = null;
      for (var i = 0; i < steps.length; i++) {
        var st = steps[i], vis = [];
        members.forEach(function (r) { var l = look(r, st); if (seen(l, st, 1.5)) vis.push(l); });
        if (vis.length < 3) continue;
        vis.sort(function (a, b) { return a.alt - b.alt; });
        var mid = vis[Math.floor(vis.length / 2)];
        var tf = 1 - 0.35 * Math.abs(st.dt) / HALF_WINDOW_S;
        var sc = posScore(q, mid.az, mid.alt) * fit(q, 'train', mid.alt) * tf * Math.min(1, 0.6 + vis.length / 20);
        if (!best || sc > best.score) best = { score: sc, i: i, mid: mid, n: vis.length, mag: vis.reduce(function (m, v) { return Math.min(m, v.mag); }, 99) };
      }
      if (best && best.score > 0.05) {
        var lead = members[0];
        trainOut.push({ group: g, score: best.score, n: best.n, alt: best.mid.alt, az: best.mid.az, mag: best.mag, ms: steps[best.i].ms, dt: steps[best.i].dt, path: track(lead, best.i) });
      }
    });
    // a Starlink that belongs to a train on screen is listed as part of that train, not alone
    var inTrain = {};
    trainOut.forEach(function (tr) { inTrain[tr.group] = 1; });
    singles = singles.filter(function (sg) { return !(sg.r.kind === 'starlink' && inTrain[(sg.r.intl || '').slice(0, 8)]); });
    return { singles: singles, trains: trainOut };
  }

  /* ---------- ranking ---------- */
  function conf(s) { return s >= 0.72 ? 'strong' : s >= 0.42 ? 'possible' : 'weak'; }
  function up(alt) { return Math.round(alt) + '° up'; }
  function when(c) {
    var t = clock(c.ms), m = Math.round(Math.abs(c.dt) / 60);
    if (m < 1) return 'at ' + t;
    return 'at ' + t + ', ' + m + ' minute' + (m === 1 ? '' : 's') + (c.dt > 0 ? ' after' : ' before') + ' the time you gave';
  }
  function fromTo(path) {
    if (!path || path.length < 2) return '';
    return 'moving from the ' + dirWord(path[0].az) + ' toward the ' + dirWord(path[path.length - 1].az);
  }
  function showers(ms) {
    var d = new Date(ms), y = d.getUTCFullYear(), out = [];
    if (y !== 2026) return { list: [], year: y };
    SHOWERS.forEach(function (s) {
      var start = Date.UTC(s[1][0] === 12 && s[3][0] === 1 ? y - 1 : y, s[1][0] - 1, s[1][1]);
      var end = Date.UTC(y, s[2][0] - 1, s[2][1], 23, 59);
      var peak = Date.UTC(y, s[3][0] - 1, s[3][1], 12);
      if (ms >= start && ms <= end) out.push({ name: s[0], near: Math.abs(ms - peak) < 2.5 * 864e5, peak: MONTHS[s[3][0] - 1] + ' ' + s[3][1], range: MONTHS[s[1][0] - 1] + ' ' + s[1][1] + ' to ' + MONTHS[s[2][0] - 1] + ' ' + s[2][1] });
    });
    return { list: out, year: y };
  }

  function rank(q, sky, sats, dataInfo) {
    var cands = [];
    sky.bodies.forEach(function (b) {
      if (b.alt < -0.5 || b.eff > b.lim) return;
      if (b.kind === 'moon' && sky.sunAlt > 5) return;
      var sc = posScore(q, b.az, b.alt) * fit(q, b.kind, b.alt) * brightFactor(q, b.eff, b.kind);
      if (sc < 0.12) return;
      cands.push({ kind: b.kind, score: Math.min(1, sc), body: b, alt: b.alt, az: b.az, mag: b.eff, ms: q.t, dt: 0 });
    });
    if (sats) {
      sats.singles.forEach(function (s) { if (s.score >= 0.12) cands.push({ kind: s.r.kind === 'station' ? 'station' : 'sat', score: Math.min(1, s.score * dataInfo.satWeight), sat: s, alt: s.alt, az: s.az, mag: s.mag, ms: s.ms, dt: s.dt, path: s.path }); });
      sats.trains.forEach(function (t) { if (t.score >= 0.12) cands.push({ kind: 'train', score: Math.min(1, t.score * dataInfo.satWeight), train: t, alt: t.alt, az: t.az, mag: t.mag, ms: t.ms, dt: t.dt, path: t.path }); });
    }
    // keep only the best few stars so a clear sky does not bury the list
    cands.sort(function (a, b) { return b.score - a.score; });
    var starCount = 0, satCount = 0;
    cands = cands.filter(function (c) {
      if (c.kind === 'star') return ++starCount <= 2;
      if (c.kind === 'sat') return ++satCount <= 2;
      return true;
    });

    // heuristic candidates from behaviour alone (no live data behind them)
    var w = q.what, twilight = sky.sunAlt <= -4 && sky.sunAlt >= -18, dark = sky.sunAlt < -0.8;
    function H(kind, table, cap) {
      var s = w === null ? table.none : table[w] || 0;
      if (s > cap) s = cap;
      if (s >= 0.15) cands.push({ kind: kind, score: s, heuristic: true });
    }
    H('aircraft', { moving: 0.55, blinking: 0.8, line: 0.25, still: 0.3, streak: 0.05, hover: 0.45, none: 0.35 }, 0.8);
    H('drone', { moving: 0.3, blinking: 0.5, line: 0.35, still: 0.2, streak: 0, hover: 0.55, none: 0.22 }, 0.6);
    if (dark) H('meteor', { streak: 0.85, moving: 0.06, none: 0.15 }, 0.85);
    H('lantern', { moving: 0.35, blinking: 0.1, line: 0.4, still: 0.2, hover: 0.48, none: 0.2 }, 0.6);
    if (twilight) H('launch', { moving: 0.3, hover: 0.3, still: 0.22, line: 0.15, none: 0.25 }, 0.4);

    cands.sort(function (a, b) { return b.score - a.score || (a.heuristic ? 1 : 0) - (b.heuristic ? 1 : 0); });
    return cands.slice(0, 7);
  }

  /* ---------- words for each candidate ---------- */
  function describe(c, q, sky) {
    var d = { name: '', kind: '', why: '', data: '', link: null };
    var where = c.alt !== undefined ? up(c.alt) + ' in the ' + dirWord(c.az) : '';
    if (c.kind === 'planet') {
      var n = c.body.name;
      d.name = n; d.kind = 'Planet, computed';
      d.why = {
        Venus: 'Venus was ' + where + '. After the Moon it is the brightest thing in the night sky, and low down it can seem to hover, flicker or change color.',
        Jupiter: 'Jupiter was ' + where + '. It is usually brighter than any star and holds perfectly still against them.',
        Mars: 'Mars was ' + where + ', a steady orange-red point that does not twinkle much.',
        Saturn: 'Saturn was ' + where + ', a steady pale yellow point.',
        Mercury: 'Mercury was ' + where + ', low in the twilight glow. It never strays far from the Sun.'
      }[n];
      d.data = up(c.alt) + ' · ' + dirAb(c.az) + ' · ' + brightWord(c.mag);
    } else if (c.kind === 'moon') {
      var ph = c.body.phase, phase = ph > 0.95 ? 'full' : ph > 0.6 ? 'more than half lit' : ph > 0.4 ? 'about half lit' : ph > 0.05 ? 'a crescent' : 'almost new';
      d.name = 'The Moon'; d.kind = 'Moon, computed';
      d.why = 'The Moon was ' + where + ', ' + phase + '. Through thin cloud or haze it can look like a strange glowing shape.';
      d.data = up(c.alt) + ' · ' + dirAb(c.az) + ' · ' + phase;
    } else if (c.kind === 'star') {
      var s = c.body.name;
      d.name = s; d.kind = 'Star, computed';
      d.why = s === 'Polaris'
        ? 'Polaris, the North Star, was ' + where + '. It sits almost due north and does not move through the night, though it is not especially bright.'
        : s + ' was ' + where + '. ' + (c.alt < 25 ? 'A bright star this low twinkles hard and flashes red, green and white, which can look like blinking.' : 'It is one of the brightest stars, and it holds still.');
      d.data = up(c.alt) + ' · ' + dirAb(c.az) + ' · ' + brightWord(c.mag);
    } else if (c.kind === 'station' || c.kind === 'sat') {
      var r = c.sat.r, ft = fromTo(c.path);
      if (r.kind === 'station') {
        d.name = r.label; d.kind = 'Space station, computed';
        d.why = 'The ' + (r.id === 25544 ? 'space station' : 'Tiangong station') + ' passed ' + when(c) + ', ' + where + ', lit by the Sun while you were in darkness' + (ft ? ', ' + ft : '') + '. It moves steadily, takes a few minutes to cross and never blinks.';
        if (r.id === 25544) d.link = { href: 'https://spotthestation.nasa.gov/', text: 'Check its passes on NASA Spot the Station' };
      } else {
        var rb = /R\/B/.test(r.name), sl = /STARLINK/.test(r.name);
        d.name = sl ? 'A single Starlink satellite' : rb ? 'A spent rocket stage' : 'A bright satellite';
        d.kind = 'Satellite, computed';
        d.why = (rb ? 'A used rocket body' : 'The satellite') + ' ' + r.name + ' crossed ' + when(c) + ', ' + where + ', sunlit while you were in darkness' + (ft ? ', ' + ft : '') + '.' + (rb ? ' Tumbling stages can flash as they turn.' : ' Satellites move steadily and silently.');
      }
      d.data = clock(c.ms) + ' · ' + up(c.alt) + ' · ' + dirAb(c.az) + ' · sunlit · ' + brightWord(c.mag);
    } else if (c.kind === 'train') {
      var t = c.train, ft2 = fromTo(c.path);
      d.name = 'A Starlink train'; d.kind = 'Satellites, computed';
      d.why = t.n + ' Starlink satellites from one recent launch were sunlit together ' + when(c) + ', around ' + where + (ft2 ? ', ' + ft2 : '') + '. A fresh batch looks like a string of lights in a row until the satellites spread out.';
      d.data = clock(c.ms) + ' · ' + up(c.alt) + ' · ' + dirAb(c.az) + ' · ' + t.n + ' in view · launch ' + t.group;
    } else if (c.kind === 'aircraft') {
      d.name = 'An aircraft'; d.kind = 'From what it did, not live data';
      d.why = q.what === 'blinking' ? 'A regular blink or strobe is what aircraft lights do: planes flying at night must show position lights, and anti-collision lights stay on when fitted.'
        : q.what === 'still' || q.what === 'hover' ? 'A plane flying toward you with its landing lights on can look like a bright light that hangs still for minutes, especially near an airport.'
        : 'A steady light moving at a plane’s pace, sometimes with a red or green light beside it, is most often an aircraft.';
    } else if (c.kind === 'drone') {
      d.name = 'A drone'; d.kind = 'From what it did, not live data';
      d.why = 'Drones can hover, stop and turn sharply. In the US, small drones flying at night must show an anti-collision light visible for 3 miles.';
    } else if (c.kind === 'meteor') {
      var sh = showers(q.t);
      d.name = 'A meteor or fireball'; d.kind = 'From what it did, not live data';
      d.why = 'A streak that lasts a second or two is a meteor, a grain of space dust burning up. A very bright one is called a fireball.';
      if (sh.list.length) d.why += ' Active that night, per the IMO 2026 Meteor Shower Calendar: ' + sh.list.map(function (x) { return x.name + (x.near ? ' (near its peak, ' + x.peak + ')' : ' (' + x.range + ', peak ' + x.peak + ')'); }).join('; ') + '.';
      else if (sh.year === 2026) d.why += ' No major shower was active that night on the IMO 2026 Meteor Shower Calendar, but stray meteors fall every night.';
      d.link = { href: 'https://www.imo.net/resources/calendar/', text: 'IMO meteor shower calendar' };
    } else if (c.kind === 'lantern') {
      d.name = 'A sky lantern or balloon'; d.kind = 'From what it did, not live data';
      d.why = 'Orange lights drifting slowly, often several together after a party or festival, are usually sky lanterns or lit balloons riding the wind.';
    } else if (c.kind === 'launch') {
      d.name = 'A rocket launch plume'; d.kind = 'From what it did, not live data';
      d.why = 'In twilight, a rocket’s exhaust high up is still in sunlight and can spread into a glowing fan or jellyfish shape. Check whether anything launched that evening on a public schedule.';
      d.link = { href: 'https://nextspaceflight.com/launches/past/', text: 'Recent launches on Next Spaceflight' };
    }
    return d;
  }

  /* ---------- the sky dome ---------- */
  var SVGNS = 'http://www.w3.org/2000/svg', CX = 160, CY = 160, R = 136;
  function xy(alt, az) { var r = R * (90 - Math.max(0, alt)) / 90; return [CX + r * Math.sin(az * DEG), CY - r * Math.cos(az * DEG)]; }
  function svgEl(tag, attrs, parent) { var n = document.createElementNS(SVGNS, tag); for (var k in attrs) n.setAttribute(k, attrs[k]); if (parent) parent.appendChild(n); return n; }
  function drawDome(cands) {
    var svg = el.dome;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svgEl('circle', { cx: CX, cy: CY, r: R, class: 'dm-horizon' }, svg);
    [30, 60].forEach(function (a) { svgEl('circle', { cx: CX, cy: CY, r: R * (90 - a) / 90, class: 'dm-ring' }, svg); });
    for (var i = 0; i < 8; i++) { var p = xy(0, i * 45); svgEl('line', { x1: CX, y1: CY, x2: p[0], y2: p[1], class: 'dm-spoke' }, svg); }
    var h = radioValue('height'), band = h ? BANDS[h] : [0, 90];
    if (state.dir !== null) {
      var r1 = R * (90 - band[1]) / 90, r2 = R * (90 - band[0]) / 90, a1 = (state.dir - 22.5) * DEG, a2 = (state.dir + 22.5) * DEG;
      function pt(r, a) { return (CX + r * Math.sin(a)).toFixed(1) + ' ' + (CY - r * Math.cos(a)).toFixed(1); }
      var dpath = 'M' + pt(r2, a1) + ' A' + r2 + ' ' + r2 + ' 0 0 1 ' + pt(r2, a2) + ' L' + pt(r1, a2) + (r1 > 0.5 ? ' A' + r1 + ' ' + r1 + ' 0 0 0 ' + pt(r1, a1) : '') + ' Z';
      svgEl('path', { d: dpath, class: 'dm-look' }, svg);
    } else if (h) {
      svgEl('circle', { cx: CX, cy: CY, r: (R * (90 - band[0]) / 90 + R * (90 - band[1]) / 90) / 2, class: 'dm-band', 'stroke-width': R * (band[1] - band[0]) / 90 }, svg);
    }
    [['N', 0], ['E', 90], ['S', 180], ['W', 270]].forEach(function (c) {
      var rr = R + 13, t = svgEl('text', { x: CX + rr * Math.sin(c[1] * DEG), y: CY - rr * Math.cos(c[1] * DEG) + 4, class: 'dm-card' }, svg);
      t.textContent = c[0];
    });
    var zt = svgEl('text', { x: CX, y: CY - 4, class: 'dm-zen' }, svg); zt.textContent = 'overhead';
    if (!cands) return;
    cands.forEach(function (c, i) {
      if (c.alt === undefined) return;
      if (c.path && c.path.length > 1) {
        svgEl('polyline', { points: c.path.map(function (p) { return xy(p.alt, p.az).join(','); }).join(' '), class: 'dm-track' + (i === 0 ? ' is-top' : '') }, svg);
      }
      var p = xy(c.alt, c.az);
      svgEl('circle', { cx: p[0], cy: p[1], r: 9, class: 'dm-dot' + (i === 0 ? ' is-top' : '') }, svg);
      var t = svgEl('text', { x: p[0], y: p[1] + 3.6, class: 'dm-num' + (i === 0 ? ' is-top' : '') }, svg);
      t.textContent = String(i + 1);
    });
  }
  drawDome(null);

  /* ---------- rendering ---------- */
  function mk(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function render(q, sky, cands, info) {
    el.list.textContent = '';
    var night = sky.sunAlt > -0.8 ? 'The Sun was up' : sky.sunAlt > -6 ? 'It was twilight' : sky.sunAlt > -12 ? 'It was late twilight' : 'It was full dark';
    el.outH.textContent = cands.length ? cands.length + ' candidate' + (cands.length === 1 ? '' : 's') + ', best match first.' : 'Nothing in the public data fits.';
    var where = q.place || (q.lat.toFixed(2) + ', ' + q.lon.toFixed(2));
    el.meta.textContent = night + ' at ' + where + ' (Sun ' + Math.abs(Math.round(sky.sunAlt)) + '° ' + (sky.sunAlt < 0 ? 'below' : 'above') + ' the horizon) at ' + clock(q.t) + '. ' + info.line;
    cands.forEach(function (c, i) {
      var d = describe(c, q, sky), cf = conf(c.score);
      var li = mk('li', 'sc sc-' + cf);
      li.appendChild(mk('span', 'sc-no', String(i + 1))).setAttribute('aria-hidden', 'true');
      var body = mk('div', 'sc-body');
      var h = mk('h4', 'sc-name'); h.appendChild(mk('span', 'visually-hidden', (i + 1) + '. ')); h.appendChild(document.createTextNode(d.name)); body.appendChild(h);
      var meta = mk('p', 'sc-conf');
      meta.appendChild(mk('span', 'sc-badge', cf === 'strong' ? 'Strong match' : cf === 'possible' ? 'Possible match' : 'Weak match'));
      meta.appendChild(mk('span', 'sc-kind', d.kind));
      body.appendChild(meta);
      body.appendChild(mk('p', 'sc-why', d.why));
      if (d.data) body.appendChild(mk('p', 'sc-data', d.data));
      if (d.link) { var a = mk('a', 'sc-link', d.link.text); a.href = d.link.href; a.rel = 'noopener'; body.appendChild(a); }
      li.appendChild(body);
      el.list.appendChild(li);
    });
    el.none.hidden = false;
    drawDome(cands);
  }

  /* ---------- submit ---------- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    el.err.textContent = '';
    var q = readForm();
    if (q.bad) {
      el.err.textContent = 'Check the highlighted ' + (q.bad.length === 1 ? 'field' : 'fields') + ' and press Identify again.';
      q.bad[0].focus();
      return;
    }
    el.submit.disabled = true;
    var label = el.submit.querySelector('.t');
    label.textContent = 'Checking the sky';
    el.live.textContent = 'Checking the sky for that time and place.';
    loadLibs().then(function () { return loadSats(); }).then(function (data) {
      var sky = skyNow(q), info = { satWeight: 1, line: '' }, sats = null;
      var satNote;
      if (!data.doc || !data.recs.length) {
        satNote = 'Satellites were not checked: the satellite data could not be loaded.';
      } else {
        var fetched = Date.parse(data.doc.fetched), ageDays = Math.abs(q.t - fetched) / 864e5;
        var from = (data.snapshot ? 'Using satellite positions from ' : 'Satellite positions from CelesTrak, fetched ') + dayLabel(fetched) + (data.snapshot ? ' (a saved copy).' : '.');
        if (ageDays > 14) {
          satNote = from + ' That is too far from the time you entered to place satellites reliably, so they were not checked.';
        } else {
          if (ageDays > 3) { info.satWeight = 0.75; from += ' That is ' + Math.round(ageDays) + ' days from your time, so satellite matches are less certain.'; }
          satNote = from;
          sats = satPass(q, data.recs);
        }
      }
      info.line = satNote;
      var cands = rank(q, sky, sats, info);
      render(q, sky, cands, info);
      var top = cands[0];
      el.live.textContent = cands.length
        ? cands.length + ' candidates. Best match: ' + describe(top, q, sky).name + ', ' + conf(top.score) + ' match.'
        : 'Nothing in the public data fits. Next steps are listed.';
      el.outH.focus();
    }).catch(function () {
      el.err.textContent = 'The sky data could not be loaded. Check the connection and press Identify again.';
      el.live.textContent = el.err.textContent;
    }).then(function () {
      el.submit.disabled = false;
      label.textContent = 'Identify it';
    });
  });
})();
