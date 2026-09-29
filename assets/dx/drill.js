/* DISCLOSURE: the ten-second drill (/readiness/).
   Six scenes from one blackout night, ten seconds each, three meters.
   Nothing starts on its own. The clock pauses on request and whenever the tab is hidden.
   Mount: <section data-drill> with the .dr-* markup in readiness/index.html.
   The scoring model is exposed as window.DXDrill so scripts can check every path. */
(function () {
  'use strict';

  /* ---------- the model ---------- */
  var BEAT_MS = 10000;
  var START = { calm: 54, safety: 52, evidence: 46 };
  var FROZE = { calm: -7, safety: -8, evidence: -3 };

  /* Each option: text, calm, safety, evidence, held, feedback. Screen order is shuffled per run.
     In every scene the held call beats each costly call on calm and safety, and on the sum of all three,
     so six held calls is the only top score. Meters never leave 0 to 100 on any path. */
  var BEATS = [
    {
      name: 'Home blackout',
      alert: 'Streetlights out. Wi-Fi dead. Dogs barking outside.',
      scene: 'You are on the couch after dinner. The TV cuts out. Every house on the street goes dark. Outside, the clouds glow green-white above the treeline.',
      options: [
        ['Keep everyone inside, dim the room, note the time, and move away from the windows.', 8, 8, 5, true, 'You made a safe pocket before curiosity turned into exposure, and the time is on record.'],
        ['Step onto the porch and film the glowing clouds before they fade.', -5, -8, 10, false, 'You got a clip, and now you are standing outside under the thing everyone is staring at.'],
        ['Tell everyone to grab their keys and leave before the roads jam.', -7, -7, -4, false, 'Panic loves motion. Now you are driving without knowing what you are driving into.']
      ]
    },
    {
      name: 'Phones fail',
      alert: 'No service. Group chat dead. A neighbor shouting from the driveway.',
      scene: 'Your phone shows SOS only. Across the street, a neighbor stands in the driveway yelling that the car will not start. Their child is crying in the back seat.',
      options: [
        ['Call across calmly: stay in the car, lights off, keep the child low.', 8, 7, 2, true, 'Useful beats dramatic. You gave a scared person one clear instruction.'],
        ['Yell that all electronics are dead and everyone needs to get out now.', -8, -7, -2, false, 'It may even be true. It is also how a quiet street becomes a stampede.'],
        ['Record your dead phone, the stopped cars and the exact time.', 1, -2, 10, false, 'Strong evidence, weak leadership. The crying child is still setting the street on edge.']
      ]
    },
    {
      name: 'Backyard impact',
      alert: 'Metal impact. Dogs silent. Two people walking toward the sound.',
      scene: 'Something heavy hits the ground behind the houses. Two neighbors walk toward the alley with phone flashlights raised. The dogs stop barking all at once.',
      options: [
        ['Call out low and firm: "Stop. Lights down. Back inside."', 7, 9, 4, true, 'Not heroic, not hysterical. Just enough to interrupt a bad idea, and nobody walked through the site.'],
        ['Follow them at a distance so someone sees what happens.', -4, -8, 8, false, 'You became the camera crew for the worst possible scene.'],
        ['Shine your flashlight down the alley and shout, "Anyone there?"', -6, -7, 1, false, 'You just told whatever made that sound exactly where you are.']
      ]
    },
    {
      name: 'Window strike',
      alert: 'Unknown adult at the front window. People gathering in the street.',
      scene: 'A stranger hits your front window with both hands. "Let me in." Their face is terrified. Behind them, more people step into the street and stare upward.',
      options: [
        ['Keep the door locked, talk through the glass, and point them to shelter nearby.', 6, 8, 4, true, 'A hard boundary that stays human. You protected your people, did not abandon theirs, and heard what they saw.'],
        ['Open the door fast. You cannot leave a frightened person outside.', 1, -8, -2, false, 'Compassion without control just moved the panic inside your home.'],
        ['Ignore them and keep watching the sky.', -5, -5, 8, false, 'The sky matters. The person at your window matters more.']
      ]
    },
    {
      name: 'Speaker voice',
      alert: 'Smart speaker active without power. Same message repeating.',
      scene: 'The smart speaker on the counter lights up, though the power is out. A calm voice says, "Remain where you are." It repeats three times.',
      options: [
        ['Stay put, keep people low, note the exact words, and follow no new instruction blindly.', 8, 7, 7, true, 'You separated calm from trustworthy. That difference keeps people alive.'],
        ['Do exactly what the voice says. A calm instruction beats panic.', 3, -6, 0, false, 'Calm is not proof. A trap can have a very pleasant voice.'],
        ['Shout that the speaker is fake and everyone is being lured.', -8, -6, -2, false, 'Right suspicion, terrible delivery. The room is louder than the speaker now.']
      ]
    },
    {
      name: 'Whiteout sweep',
      alert: 'Light moving house to house. Windows flaring. Street silent.',
      scene: 'A sheet of white light moves down the street, house by house. It is almost at yours. The crying stops. Even the wind goes quiet.',
      options: [
        ['Eyes down, hands visible, bodies low, nothing sudden until it passes.', 8, 8, 5, true, 'Stillness without surrender. That is most of the protocol, and every witness is still here to describe it.'],
        ['Pull everyone to the floor and cover their faces.', 3, 4, -4, false, 'Messy, but survivable. Fear made that move, not the protocol.'],
        ['Hold your phone up to catch the light through the window.', -6, -8, 10, false, 'It might be the clearest footage ever taken. You were also the one thing in the window the light could see.']
      ]
    }
  ];

  var GRADES = [
    { min: 85, name: 'Field ready', tail: '' },
    { min: 70, name: 'Useful under strain', tail: 'More drills would turn instinct into procedure.' },
    { min: 50, name: 'A liability under pressure', tail: 'The first minute does not forgive loose calls.' },
    { min: 0, name: 'Contact compromised', tail: 'The first minute went to the night instead of to you.' }
  ];
  var COUNT = ['Not one call', 'One of six calls', 'Two of six calls', 'Three of six calls', 'Four of six calls', 'Five of six calls', 'Six of six calls'];
  var TIMES = ['', 'once', 'twice', 'three times', 'four times', 'five times', 'six times'];

  function heldIndex(b) { for (var i = 0; i < b.options.length; i++) if (b.options[i][4]) return i; return 0; }
  function show(n) { return Math.max(0, Math.min(100, Math.round(n))); }
  function score(m) { return show((m.calm + m.safety + m.evidence) / 3); }
  function gradeFor(n) { for (var i = 0; i < GRADES.length; i++) if (n >= GRADES[i].min) return GRADES[i]; return GRADES[GRADES.length - 1]; }
  /* The report line is built from the meters and the calls, never from the band alone. */
  function reportLine(m, held, froze, untimed) {
    var c = m.calm >= 80 ? 'You kept people steady' : m.calm >= 55 ? 'You kept most of the room steady' : 'You added to the noise';
    var sf = m.safety >= 80 ? 'stayed out of reach' : m.safety >= 55 ? 'took a few risks with distance' : 'let people get too close';
    var ev = m.evidence >= 65 ? 'still kept a record' : m.evidence >= 45 ? 'kept part of the record' : 'left a thin record';
    var g = gradeFor(score(m));
    var out = c + ', ' + sf + ', and ' + ev + '. ' + COUNT[held] + ' held.';
    if (froze > 0) out += ' The clock ran out on you ' + TIMES[froze] + '.';
    if (held === 6) out += ' That is the protocol.';
    else if (g.tail) out += ' ' + g.tail;
    if (untimed) out += ' This was an untimed run, so the clock did not count.';
    return out;
  }

  var MODEL = { BEAT_MS: BEAT_MS, START: START, FROZE: FROZE, BEATS: BEATS, GRADES: GRADES, score: score, show: show, gradeFor: gradeFor, reportLine: reportLine, heldIndex: heldIndex };
  if (typeof window !== 'undefined') window.DXDrill = MODEL;

  var doc = typeof document !== 'undefined' ? document : null;
  var host = doc && doc.querySelector('[data-drill]');
  if (!host) return;

  var DX = window.DX || { track: function () {}, tick: function () {} };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var NUMBERS = ['one', 'two', 'three', 'four', 'five', 'six'];
  var ROLES = {
    sentinel: { name: 'The Sentinel', short: 'Sentinel' },
    diplomat: { name: 'The Diplomat', short: 'Diplomat' },
    scholar: { name: 'The Scholar', short: 'Scholar' },
    survivor: { name: 'The Survivor', short: 'Survivor' },
    'first-contact': { name: 'Sealed', sealed: true }
  };
  var REC_KEY = 'dx-drill-v1';

  /* ---------- storage (every access guarded) ---------- */
  function readJSON(key) { try { return JSON.parse(window.localStorage.getItem(key) || 'null'); } catch (e) { return null; } }
  function loadRecord() {
    var r = readJSON(REC_KEY);
    if (!r || typeof r.last !== 'number' || typeof r.best !== 'number' || !isFinite(r.last) || !isFinite(r.best)) return null;
    return { last: show(r.last), best: show(r.best) };
  }
  function saveRecord(r) { try { window.localStorage.setItem(REC_KEY, JSON.stringify(r)); } catch (e) {} }
  function roleOnFile() {
    var f = readJSON('dx-file-v2');
    var a = f && typeof f.archetype === 'string' ? f.archetype : '';
    return Object.prototype.hasOwnProperty.call(ROLES, a) ? a : null;
  }

  /* ---------- DOM ---------- */
  function $(sel) { return host.querySelector(sel); }
  var elTop = $('.dr-top'), elBeat = $('.dr-beat'), elSecs = $('.dr-secs'), elBar = $('.dr-timebar i'), elAlert = $('.dr-alert');
  var elScene = $('.dr-scene'), elOpts = $('.dr-options'), elFeedback = $('.dr-feedback'), elRecord = $('.dr-record');
  var untimedInput = $('.dr-untimed-input'), untimedLabel = $('.dr-untimed');
  var btnStart = $('.dr-start'), btnNext = $('.dr-next'), btnPause = $('.dr-pause'), btnStop = $('.dr-stop');
  var elConsole = $('.dr-console'), elReport = $('.dr-report'), elAfter = $('.dr-after');
  var elLive = $('.dr-live'), btnAgain = $('.dr-again');
  var navEl = doc.querySelector('.dx-nav');
  var meters = {};
  ['calm', 'safety', 'evidence'].forEach(function (k) {
    var row = host.querySelector('.dr-console .dr-meters [data-meter="' + k + '"]');
    meters[k] = { v: row.querySelector('.dr-val'), bar: row.querySelector('.dr-bar i'), d: row.querySelector('.dr-delta'), mini: host.querySelector('.dr-mini [data-mini="' + k + '"]') };
  });

  /* ---------- state ---------- */
  var s = null;
  var tickId = 0, last = 0, warned = false;

  function fresh() {
    return { calm: START.calm, safety: START.safety, evidence: START.evidence, step: 0, phase: 'ready', paused: false, left: BEAT_MS, order: [], log: [] };
  }
  function shuffle(n) {
    var o = [], i, j, t;
    for (i = 0; i < n; i++) o.push(i);
    for (i = n - 1; i > 0; i--) { j = Math.floor(Math.random() * (i + 1)); t = o[i]; o[i] = o[j]; o[j] = t; }
    return o;
  }
  function announce(msg) { elLive.textContent = ''; setTimeout(function () { elLive.textContent = msg; }, 40); }
  function signed(n) { return (n > 0 ? '+' : n < 0 ? '−' : '±') + Math.abs(n); }
  function meterText() { return 'Calm ' + show(s.calm) + ', safety ' + show(s.safety) + ', evidence ' + show(s.evidence) + '.'; }

  function paintMeters(delta) {
    ['calm', 'safety', 'evidence'].forEach(function (k) {
      var m = meters[k], v = show(s[k]);
      m.v.textContent = v;
      m.bar.style.width = v + '%';
      if (m.mini) m.mini.textContent = v;
      if (delta && delta[k] !== undefined) {
        m.d.textContent = signed(delta[k]);
        m.d.setAttribute('data-sign', delta[k] > 0 ? 'up' : delta[k] < 0 ? 'down' : 'flat');
      } else {
        m.d.textContent = '';
        m.d.removeAttribute('data-sign');
      }
    });
  }
  function paintClock() {
    if (s.untimed) { elSecs.textContent = '--'; elBar.style.transform = 'scaleX(1)'; host.setAttribute('data-urgent', 'false'); return; }
    var secs = Math.ceil(s.left / 1000);
    elSecs.textContent = secs < 10 ? '0' + secs : String(secs);
    elBar.style.transform = 'scaleX(' + (s.left / BEAT_MS).toFixed(4) + ')';
    host.setAttribute('data-urgent', s.phase === 'asking' && s.left <= 3000 ? 'true' : 'false');
  }
  function setFeedback(text, good) {
    elFeedback.textContent = '';
    if (good === true || good === false) {
      var v = doc.createElement('span');
      v.className = 'dr-verdict';
      v.textContent = good ? 'Held.' : 'Cost.';
      elFeedback.appendChild(v);
      elFeedback.appendChild(doc.createTextNode(' ' + text));
      elFeedback.setAttribute('data-verdict', good ? 'good' : 'bad');
    } else {
      elFeedback.textContent = text;
      elFeedback.removeAttribute('data-verdict');
    }
  }
  function paintRecord() {
    var r = loadRecord();
    if (!elRecord) return;
    if (r) { elRecord.textContent = 'Last run ' + r.last + '. Best ' + r.best + '.'; elRecord.hidden = false; }
    else { elRecord.textContent = ''; elRecord.hidden = true; }
  }

  /* ---------- keeping the live controls on screen ---------- */
  function scrollMode() { return reduce.matches ? 'instant' : 'smooth'; }
  function navBottom() {
    if (!navEl) return 0;
    var b = navEl.getBoundingClientRect().bottom;
    return b > 0 ? b : 0;
  }
  function fitDelta(a, b, lo, hi) { if (a < lo) return a - lo; if (b > hi) return b - hi; return 0; }
  /* Frame the console so everything from the highest anchor that fits down to endEl is visible.
     The console header sticks under the nav during a run, so anchors below it reserve its height too. */
  function frame(endEl, anchors, fallback) {
    var mt = 8, mb = 12, vh = window.innerHeight, navB = navBottom(), headH = elTop ? elTop.offsetHeight : 0;
    var end = endEl.getBoundingClientRect().bottom;
    var cTop = elConsole.getBoundingClientRect().top;
    var d = null, i, a;
    if (end - cTop <= vh - navB - mt - mb) d = fitDelta(cTop, end, navB + mt, vh - mb);
    for (i = 0; d === null && i < anchors.length; i++) {
      a = anchors[i].getBoundingClientRect().top;
      if (end - a <= vh - navB - headH - mt - mb) d = fitDelta(a, end, navB + headH + mt, vh - mb);
    }
    if (d === null) d = fallback === 'top' ? anchors[anchors.length - 1].getBoundingClientRect().top - (navB + headH + mt) : end - (vh - mb);
    if (Math.abs(d) > 1) window.scrollBy({ top: d, left: 0, behavior: scrollMode() });
  }

  /* ---------- clock ---------- */
  function stopClock() { if (tickId) { clearInterval(tickId); tickId = 0; } }
  function startClock() {
    stopClock();
    if (s.phase !== 'asking' || s.paused || s.untimed) return;
    last = performance.now();
    tickId = setInterval(function () {
      var now = performance.now();
      s.left = Math.max(0, s.left - (now - last));
      last = now;
      paintClock();
      if (!warned && s.left <= 3000 && s.left > 0) { warned = true; announce('Three seconds.'); }
      if (s.left <= 0) { stopClock(); froze(); }
    }, 100);
  }
  function setPaused(on, why) {
    if (s.phase !== 'asking' || s.untimed) return;
    s.paused = on;
    host.setAttribute('data-paused', on ? 'true' : 'false');
    btnPause.textContent = on ? 'Resume' : 'Pause';
    setFeedback(on ? 'Paused. The scene waits for you. Press Resume when you are ready.' : 'Choose. The clock is running.');
    if (on) {
      stopClock();
      announce(why === 'hidden' ? 'Drill paused while you were away. Press Resume to continue.' : 'Drill paused. ' + Math.ceil(s.left / 1000) + ' seconds left.');
    } else {
      announce('Clock running. ' + Math.ceil(s.left / 1000) + ' seconds.');
      startClock();
    }
  }

  /* ---------- flow ---------- */
  function setPhase(p) { s.phase = p; host.setAttribute('data-state', p); }
  function readyAlert() { return untimedInput && untimedInput.checked ? 'Six scenes. No clock this run. Stay useful.' : 'Six scenes. Ten seconds each. Stay useful.'; }

  function showReady(msg) {
    stopClock();
    s = fresh();
    setPhase('ready');
    host.setAttribute('data-paused', 'false');
    btnPause.hidden = true; btnStop.hidden = true;
    btnStart.hidden = false;
    if (untimedLabel) untimedLabel.hidden = false;
    btnNext.hidden = true;
    elOpts.innerHTML = '';
    elBeat.textContent = 'Ready room';
    elAlert.textContent = readyAlert();
    elScene.textContent = 'A normal night breaks in one second. Read the scene, make the call, keep people safe.';
    setFeedback(msg || 'Nothing starts until you press start. You can pause the clock at any time.');
    s.left = BEAT_MS;
    paintClock(); paintMeters(); paintRecord();
  }

  function start() {
    stopClock();
    s = fresh();
    s.untimed = !!(untimedInput && untimedInput.checked);
    if (untimedLabel) untimedLabel.hidden = true;
    if (elRecord) elRecord.hidden = true;
    elReport.hidden = true;
    elAfter.hidden = true;
    elConsole.hidden = false;
    btnStart.hidden = true;
    btnPause.hidden = s.untimed; btnStop.hidden = false;
    host.setAttribute('data-untimed', s.untimed ? 'true' : 'false');
    DX.track('drill_start', { untimed: s.untimed });
    renderBeat();
  }

  function renderBeat() {
    var b = BEATS[s.step];
    setPhase('asking');
    s.paused = false; s.left = BEAT_MS; warned = false;
    host.setAttribute('data-paused', 'false');
    btnPause.textContent = 'Pause';
    btnPause.disabled = false;
    btnNext.hidden = true;
    elBeat.textContent = 'Scene ' + (s.step + 1) + ' of 6 · ' + b.name;
    elAlert.textContent = b.alert;
    elScene.textContent = b.scene;
    setFeedback(s.untimed ? 'Choose when you are ready. No clock on this run.' : 'Choose. The clock is running.');
    elOpts.innerHTML = '';
    s.order = shuffle(b.options.length);
    s.order.forEach(function (oi) {
      var btn = doc.createElement('button');
      btn.type = 'button';
      btn.className = 'dr-opt';
      btn.textContent = b.options[oi][0];
      btn.addEventListener('click', function () { choose(oi, btn); });
      elOpts.appendChild(btn);
    });
    paintMeters(); paintClock();
    announce('Scene ' + NUMBERS[s.step] + ' of six. ' + b.name + '.' + (s.untimed ? ' No clock.' : ' Ten seconds.'));
    elScene.focus({ preventScroll: true });
    frame(elOpts, [elAlert, elScene], 'top');
    startClock();
  }

  function lockOptions(picked, good) {
    [].forEach.call(elOpts.children, function (btn) {
      btn.disabled = true;
      if (btn === picked) btn.setAttribute('data-verdict', good ? 'good' : 'bad');
    });
  }

  function choose(oi, btn) {
    if (s.phase !== 'asking') return;
    stopClock();
    var o = BEATS[s.step].options[oi];
    var delta = { calm: o[1], safety: o[2], evidence: o[3] };
    s.calm += o[1]; s.safety += o[2]; s.evidence += o[3];
    s.log.push({ step: s.step, text: o[0], good: o[4] });
    lockOptions(btn, o[4]);
    settle(o[4], o[5], delta);
  }

  function froze() {
    if (s.phase !== 'asking') return;
    s.left = 0;
    s.calm += FROZE.calm; s.safety += FROZE.safety; s.evidence += FROZE.evidence;
    s.log.push({ step: s.step, text: 'No call. The clock ran out.', good: false, froze: true });
    lockOptions(null, false);
    settle(false, 'You froze. The group copied the silence, and the night got ahead of you.', FROZE);
  }

  function settle(good, feedback, delta) {
    setPhase('answered');
    btnPause.disabled = true;
    btnPause.textContent = 'Pause';
    host.setAttribute('data-paused', 'false');
    setFeedback(feedback, good);
    paintMeters(delta); paintClock();
    DX.tick(good ? 520 : 180, 0.3);
    var last6 = s.step === BEATS.length - 1;
    btnNext.textContent = last6 ? 'File the report' : 'Next scene';
    btnNext.hidden = false;
    announce((good ? 'Held. ' : 'Cost. ') + feedback + ' ' + meterText());
    frame(btnNext, [elScene, elOpts, elFeedback], 'end');
    btnNext.focus({ preventScroll: true });
  }

  function next() {
    if (s.phase !== 'answered') return;
    if (s.step < BEATS.length - 1) { s.step += 1; renderBeat(); }
    else finish();
  }

  function paintRole() {
    var a = roleOnFile(), cell = $('.dr-r-role'), link = elAfter.querySelector('.dr-role-link'), lead = elAfter.querySelector('.dr-after-lead');
    if (!cell) return;
    cell.textContent = '';
    if (!a) {
      var bar = doc.createElement('span'); bar.className = 'rx rx-fixed'; bar.setAttribute('aria-hidden', 'true'); bar.textContent = 'UNASSIGNED';
      var sr = doc.createElement('span'); sr.className = 'visually-hidden'; sr.textContent = 'redacted';
      cell.appendChild(bar); cell.appendChild(sr);
      if (link) { link.hidden = false; link.setAttribute('href', '/#classify'); link.firstChild.nodeValue = 'Find your role '; }
      if (lead) lead.textContent = 'The drill scores what you did. The ten questions find which job you reach for first, so you know what to train.';
      return;
    }
    var r = ROLES[a];
    if (r.sealed) {
      cell.textContent = r.name;
      if (link) link.hidden = true;
      if (lead) lead.textContent = 'Your role is on file, and it is sealed. The drill trains the reflexes underneath it.';
      return;
    }
    var aEl = doc.createElement('a');
    aEl.href = '/archetype/' + a + '/';
    aEl.textContent = r.name;
    cell.appendChild(aEl);
    if (link) { link.hidden = false; link.setAttribute('href', '/archetype/' + a + '/'); link.firstChild.nodeValue = 'Read the ' + r.short + ' dossier '; }
    if (lead) lead.textContent = 'Your role is on file as ' + r.name + '. The drill trains the reflexes that role leans on.';
  }

  function finish() {
    stopClock();
    setPhase('done');
    var avg = score(s);
    var g = gradeFor(avg);
    var held = 0, frozeN = 0;
    s.log.forEach(function (e) { if (e.good) held++; if (e.froze) frozeN++; });
    var line = reportLine(s, held, frozeN, s.untimed);
    btnPause.hidden = true; btnStop.hidden = true;
    btnNext.hidden = true;

    var prev = loadRecord();
    var rec = { last: avg, best: prev ? Math.max(prev.best, avg) : avg };
    saveRecord(rec);

    var t = new Date();
    $('.dr-r-time').textContent = 'Filed ' + String(t.getHours()).padStart(2, '0') + ':' + String(t.getMinutes()).padStart(2, '0');
    $('.dr-r-grade').textContent = g.name + '.';
    $('.dr-r-score').textContent = String(avg);
    $('.dr-r-line').textContent = line;
    var hist = $('.dr-r-history');
    if (hist) {
      if (prev) { hist.textContent = 'Last run ' + prev.last + '. Best ' + rec.best + '.'; hist.hidden = false; }
      else { hist.textContent = ''; hist.hidden = true; }
    }
    ['calm', 'safety', 'evidence'].forEach(function (k) {
      var row = elReport.querySelector('[data-meter="' + k + '"]');
      row.querySelector('.dr-val').textContent = show(s[k]);
      row.querySelector('.dr-bar i').style.width = show(s[k]) + '%';
    });
    var log = $('.dr-r-log');
    log.innerHTML = '';
    s.log.forEach(function (e) {
      var b = BEATS[e.step];
      var li = doc.createElement('li');
      var n = doc.createElement('span'); n.className = 'dr-l-name'; n.textContent = b.name;
      var tx = doc.createElement('span'); tx.className = 'dr-l-text'; tx.textContent = e.text;
      var m = doc.createElement('span'); m.className = 'dr-l-mark'; m.textContent = e.good ? 'Held' : 'Cost';
      li.appendChild(n); li.appendChild(tx); li.appendChild(m);
      if (!e.good) {
        var fix = doc.createElement('span'); fix.className = 'dr-l-fix';
        fix.textContent = 'The call that held: ' + b.options[heldIndex(b)][0];
        li.appendChild(fix);
      }
      log.appendChild(li);
    });
    paintRole();

    elReport.hidden = false;
    elAfter.hidden = false;
    elBeat.textContent = 'Drill complete';
    elAlert.textContent = 'The light is gone. The street is quiet again.';
    elScene.textContent = 'Now comes the harder part: proving what happened, and living with what you did under pressure.';
    elOpts.innerHTML = '';
    setFeedback('Your report is filed below.');
    host.setAttribute('data-urgent', 'false');

    DX.track('drill_complete', { score: avg, grade: g.name });
    if (window.DX && DX.blink) DX.blink();
    announce('Drill complete. ' + g.name + '. Score ' + avg + ' of 100. ' + meterText() + ' ' + line);
    var h = $('.dr-r-grade');
    h.focus({ preventScroll: true });
    elReport.scrollIntoView({ behavior: scrollMode(), block: 'start' });
  }

  /* ---------- wiring ---------- */
  btnStart.addEventListener('click', start);
  btnAgain.addEventListener('click', function () { start(); });
  btnNext.addEventListener('click', next);
  btnPause.addEventListener('click', function () { setPaused(!s.paused, 'button'); });
  btnStop.addEventListener('click', function () {
    showReady('Drill stopped. Nothing was scored. Start again whenever you are ready.');
    announce('Drill stopped. Nothing was scored.');
    btnStart.focus();
  });
  if (untimedInput) untimedInput.addEventListener('change', function () { if (s && s.phase === 'ready') elAlert.textContent = readyAlert(); });
  doc.addEventListener('visibilitychange', function () {
    if (doc.hidden && s && s.phase === 'asking' && !s.paused) setPaused(true, 'hidden');
  });
  /* Escape pauses, a second Escape resumes. Capture phase, so an open menu takes the key first. */
  window.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' || e.defaultPrevented || !s || s.phase !== 'asking' || s.untimed) return;
    if (doc.querySelector('#dx-sheet[data-open="true"], .dx-tab[aria-expanded="true"], [aria-modal="true"]:not([hidden])')) return;
    e.preventDefault();
    setPaused(!s.paused, 'key');
  }, true);
  /* The page-head action lands on the start button, ready to press. */
  [].forEach.call(doc.querySelectorAll('[data-drill-jump]'), function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var target = s && s.phase === 'ready' ? btnStart : (s && s.phase === 'done' ? $('.dr-r-grade') : elScene);
      var d = elConsole.getBoundingClientRect().top - (navBottom() + 12);
      window.scrollBy({ top: d, left: 0, behavior: scrollMode() });
      target.focus({ preventScroll: true });
    });
  });

  host.setAttribute('data-ready', 'true');
  showReady();
})();
