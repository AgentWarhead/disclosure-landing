/* DISCLOSURE: the ten-second drill (/readiness/).
   Six scenes from one blackout night, ten seconds each, three meters.
   Nothing starts on its own. The clock pauses on request and whenever the tab is hidden.
   Mount: <section data-drill> with the .dr-* markup in readiness/index.html. */
(function () {
  'use strict';
  var doc = document;
  var host = doc.querySelector('[data-drill]');
  if (!host) return;

  var DX = window.DX || { track: function () {}, tick: function () {} };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  var BEAT_MS = 10000;
  var START = { calm: 72, safety: 68, evidence: 41 };
  var FROZE = { calm: -10, safety: -12, evidence: -4 };

  /* Each option: text, calm, safety, evidence, good, feedback. Screen order is shuffled per run. */
  var BEATS = [
    {
      name: 'Home blackout',
      alert: 'Streetlights out. Wi-Fi dead. Dogs barking outside.',
      scene: 'You are on the couch after dinner. The TV cuts out. Every house on the street goes dark. Outside, the clouds glow green-white above the treeline.',
      options: [
        ['Keep everyone inside, dim the room, and move away from the windows.', 12, 14, 2, true, 'You made a safe pocket before curiosity turned into exposure.'],
        ['Step onto the porch and film the glowing clouds before they fade.', -8, -12, 10, false, 'You got a clip, and now you are standing outside under the thing everyone is staring at.'],
        ['Tell everyone to grab their keys and leave before the roads jam.', -10, -10, -4, false, 'Panic loves motion. Now you are driving without knowing what you are driving into.']
      ]
    },
    {
      name: 'Phones fail',
      alert: 'No service. Group chat dead. A neighbor shouting from the driveway.',
      scene: 'Your phone shows SOS only. Across the street, a neighbor stands in the driveway yelling that the car will not start. Their child is crying in the back seat.',
      options: [
        ['Call across calmly: stay in the car, lights off, keep the child low.', 12, 10, 0, true, 'Useful beats dramatic. You gave a scared person one clear instruction.'],
        ['Yell that all electronics are dead and everyone needs to get out now.', -14, -12, -2, false, 'It may even be true. It is also how a quiet street becomes a stampede.'],
        ['Record your dead phone, the stopped cars and the exact time.', 2, -2, 14, false, 'Strong evidence, weak leadership. The crying child is still setting the street on edge.']
      ]
    },
    {
      name: 'Backyard impact',
      alert: 'Metal impact. Dogs silent. Two people walking toward the sound.',
      scene: 'Something heavy hits the ground behind the houses. Two neighbors walk toward the alley with phone flashlights raised. The dogs stop barking all at once.',
      options: [
        ['Call out low and firm: "Stop. Lights down. Back inside."', 12, 16, 0, true, 'Not heroic, not hysterical. Just enough to interrupt a bad idea.'],
        ['Follow them at a distance so someone sees what happens.', -6, -14, 8, false, 'You became the camera crew for the worst possible scene.'],
        ['Shine your flashlight down the alley and shout, "Anyone there?"', -10, -10, 2, false, 'You just told whatever made that sound exactly where you are.']
      ]
    },
    {
      name: 'Window strike',
      alert: 'Unknown adult at the front window. People gathering in the street.',
      scene: 'A stranger hits your front window with both hands. "Let me in." Their face is terrified. Behind them, more people step into the street and stare upward.',
      options: [
        ['Keep the door locked, talk through the glass, and point them to shelter nearby.', 8, 14, 0, true, 'A hard boundary that stays human. You protected your people without abandoning theirs.'],
        ['Open the door fast. You cannot leave a frightened person outside.', 2, -16, -2, false, 'Compassion without control just moved the panic inside your home.'],
        ['Ignore them and keep watching the sky.', -8, -8, 8, false, 'The sky matters. The person at your window matters more.']
      ]
    },
    {
      name: 'Speaker voice',
      alert: 'Smart speaker active without power. Same message repeating.',
      scene: 'The smart speaker on the counter lights up, though the power is out. A calm voice says, "Remain where you are." It repeats three times.',
      options: [
        ['Stay put, keep people low, and do not follow any new instruction blindly.', 14, 12, 4, true, 'You separated calm from trustworthy. That difference keeps people alive.'],
        ['Do exactly what the voice says. A calm instruction beats panic.', 4, -8, 0, false, 'Calm is not proof. A trap can have a very pleasant voice.'],
        ['Shout that the speaker is fake and everyone is being lured.', -16, -10, -2, false, 'Right suspicion, terrible delivery. The room is louder than the speaker now.']
      ]
    },
    {
      name: 'Whiteout sweep',
      alert: 'Light moving house to house. Windows flaring. Street silent.',
      scene: 'A sheet of white light moves down the street, house by house. It is almost at yours. The crying stops. Even the wind goes quiet.',
      options: [
        ['Eyes down, hands visible, bodies low, nothing sudden until it passes.', 16, 14, 2, true, 'Stillness without surrender. That is most of the protocol.'],
        ['Pull everyone to the floor and cover their faces.', 4, 6, -6, false, 'Messy, but survivable. Fear made that move, not the protocol.'],
        ['Hold your phone up to catch the light through the window.', -10, -14, 12, false, 'It might be the clearest footage ever taken. You were also the one thing in the window the light could see.']
      ]
    }
  ];

  var GRADES = [
    { min: 82, name: 'Field ready', line: 'You kept people steady, stayed out of reach, and still kept a record.' },
    { min: 66, name: 'Useful under strain', line: 'You made a few risky calls but stayed useful, and more drills would turn instinct into procedure.' },
    { min: 48, name: 'A liability under pressure', line: 'You were brave in places and sloppy in others, and the first minute does not forgive sloppy.' },
    { min: 0, name: 'Contact compromised', line: 'Too much noise and too little distance, and the record was lost along with the room.' }
  ];
  var NUMBERS = ['one', 'two', 'three', 'four', 'five', 'six'];

  /* ---------- DOM ---------- */
  function $(sel) { return host.querySelector(sel); }
  var elBeat = $('.dr-beat'), elSecs = $('.dr-secs'), elBar = $('.dr-timebar i'), elAlert = $('.dr-alert');
  var elScene = $('.dr-scene'), elOpts = $('.dr-options'), elFeedback = $('.dr-feedback');
  var btnStart = $('.dr-start'), btnNext = $('.dr-next'), btnPause = $('.dr-pause'), btnStop = $('.dr-stop');
  var elConsole = $('.dr-console'), elReport = $('.dr-report'), elAfter = $('.dr-after');
  var elLive = $('.dr-live'), btnAgain = $('.dr-again');
  var meters = {};
  ['calm', 'safety', 'evidence'].forEach(function (k) {
    var row = host.querySelector('.dr-console [data-meter="' + k + '"]');
    meters[k] = { v: row.querySelector('.dr-val'), bar: row.querySelector('.dr-bar i'), d: row.querySelector('.dr-delta') };
  });

  /* ---------- state ---------- */
  var s = null;
  var tickId = 0, last = 0, warned = false;

  function fresh() {
    return { calm: START.calm, safety: START.safety, evidence: START.evidence, step: 0, phase: 'ready', paused: false, left: BEAT_MS, order: [], log: [] };
  }
  function clamp(n) { return Math.max(0, Math.min(100, n)); }
  function shuffle(n) {
    var o = [], i, j, t;
    for (i = 0; i < n; i++) o.push(i);
    for (i = n - 1; i > 0; i--) { j = Math.floor(Math.random() * (i + 1)); t = o[i]; o[i] = o[j]; o[j] = t; }
    return o;
  }
  function announce(msg) { elLive.textContent = ''; setTimeout(function () { elLive.textContent = msg; }, 40); }
  function signed(n) { return (n > 0 ? '+' : n < 0 ? '−' : '±') + Math.abs(n); }

  function paintMeters(delta) {
    ['calm', 'safety', 'evidence'].forEach(function (k) {
      var m = meters[k];
      m.v.textContent = s[k];
      m.bar.style.width = s[k] + '%';
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
    var secs = Math.ceil(s.left / 1000);
    elSecs.textContent = secs < 10 ? '0' + secs : String(secs);
    elBar.style.transform = 'scaleX(' + (s.left / BEAT_MS).toFixed(4) + ')';
    host.setAttribute('data-urgent', s.phase === 'asking' && s.left <= 3000 ? 'true' : 'false');
  }

  /* ---------- clock ---------- */
  function stopClock() { if (tickId) { clearInterval(tickId); tickId = 0; } }
  function startClock() {
    stopClock();
    if (s.phase !== 'asking' || s.paused) return;
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
    if (s.phase !== 'asking') return;
    s.paused = on;
    host.setAttribute('data-paused', on ? 'true' : 'false');
    btnPause.textContent = on ? 'Resume' : 'Pause';
    elFeedback.textContent = on ? 'Paused. The scene waits for you. Press Resume when you are ready.' : 'Choose. The clock is running.';
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

  function showReady(msg) {
    stopClock();
    s = fresh();
    setPhase('ready');
    host.setAttribute('data-paused', 'false');
    btnPause.hidden = true; btnStop.hidden = true;
    btnStart.hidden = false;
    btnNext.hidden = true;
    elOpts.innerHTML = '';
    elBeat.textContent = 'Ready room';
    elAlert.textContent = 'Six scenes. Ten seconds each. Stay useful.';
    elScene.textContent = 'A normal night breaks in one second. Read the scene, make the call, keep people safe.';
    elFeedback.textContent = msg || 'Nothing starts until you press start. You can pause the clock at any time.';
    elFeedback.removeAttribute('data-verdict');
    s.left = BEAT_MS;
    paintClock(); paintMeters();
  }

  function start() {
    stopClock();
    s = fresh();
    elReport.hidden = true;
    elAfter.hidden = true;
    elConsole.hidden = false;
    btnStart.hidden = true;
    btnPause.hidden = false; btnStop.hidden = false;
    DX.track('drill_start');
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
    elFeedback.textContent = 'Choose. The clock is running.';
    elFeedback.removeAttribute('data-verdict');
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
    announce('Scene ' + NUMBERS[s.step] + ' of six. ' + b.name + '. Ten seconds.');
    elScene.focus({ preventScroll: true });
    keepInView();
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
    s.calm = clamp(s.calm + o[1]); s.safety = clamp(s.safety + o[2]); s.evidence = clamp(s.evidence + o[3]);
    s.log.push({ name: BEATS[s.step].name, text: o[0], good: o[4] });
    lockOptions(btn, o[4]);
    settle(o[4], o[5], delta);
  }

  function froze() {
    if (s.phase !== 'asking') return;
    s.left = 0;
    s.calm = clamp(s.calm + FROZE.calm); s.safety = clamp(s.safety + FROZE.safety); s.evidence = clamp(s.evidence + FROZE.evidence);
    s.log.push({ name: BEATS[s.step].name, text: 'No call. The clock ran out.', good: false });
    lockOptions(null, false);
    settle(false, 'You froze. The group copied the silence, and the night got ahead of you.', FROZE);
  }

  function settle(good, feedback, delta) {
    setPhase('answered');
    btnPause.disabled = true;
    btnPause.textContent = 'Pause';
    host.setAttribute('data-paused', 'false');
    elFeedback.textContent = feedback;
    elFeedback.setAttribute('data-verdict', good ? 'good' : 'bad');
    paintMeters(delta); paintClock();
    DX.tick(good ? 520 : 180, 0.3);
    var last6 = s.step === BEATS.length - 1;
    btnNext.textContent = last6 ? 'File the report' : 'Next scene';
    btnNext.hidden = false;
    announce(feedback + ' Calm ' + s.calm + ', safety ' + s.safety + ', evidence ' + s.evidence + '.');
    btnNext.focus({ preventScroll: true });
  }

  function next() {
    if (s.phase !== 'answered') return;
    if (s.step < BEATS.length - 1) { s.step += 1; renderBeat(); }
    else finish();
  }

  function gradeFor(avg) { for (var i = 0; i < GRADES.length; i++) if (avg >= GRADES[i].min) return GRADES[i]; return GRADES[GRADES.length - 1]; }

  function finish() {
    stopClock();
    setPhase('done');
    var avg = Math.round((s.calm + s.safety + s.evidence) / 3);
    var g = gradeFor(avg);
    btnPause.hidden = true; btnStop.hidden = true;
    btnNext.hidden = true;

    var t = new Date();
    $('.dr-r-time').textContent = 'Filed ' + String(t.getHours()).padStart(2, '0') + ':' + String(t.getMinutes()).padStart(2, '0');
    $('.dr-r-grade').textContent = g.name + '.';
    $('.dr-r-score').textContent = String(avg);
    $('.dr-r-line').textContent = g.line;
    ['calm', 'safety', 'evidence'].forEach(function (k) {
      var row = elReport.querySelector('[data-meter="' + k + '"]');
      row.querySelector('.dr-val').textContent = s[k];
      row.querySelector('.dr-bar i').style.width = s[k] + '%';
    });
    var log = $('.dr-r-log');
    log.innerHTML = '';
    s.log.forEach(function (e) {
      var li = doc.createElement('li');
      var n = doc.createElement('span'); n.className = 'dr-l-name'; n.textContent = e.name;
      var tx = doc.createElement('span'); tx.className = 'dr-l-text'; tx.textContent = e.text;
      var m = doc.createElement('span'); m.className = 'dr-l-mark'; m.textContent = e.good ? 'Held' : 'Cost';
      li.appendChild(n); li.appendChild(tx); li.appendChild(m);
      log.appendChild(li);
    });

    elReport.hidden = false;
    elAfter.hidden = false;
    elBeat.textContent = 'Drill complete';
    elAlert.textContent = 'The light is gone. The street is quiet again.';
    elScene.textContent = 'Now comes the harder part: proving what happened, and living with what you did under pressure.';
    elOpts.innerHTML = '';
    elFeedback.textContent = 'Your report is filed below.';
    elFeedback.removeAttribute('data-verdict');
    host.setAttribute('data-urgent', 'false');

    DX.track('drill_complete', { score: avg, grade: g.name });
    if (window.DX && DX.blink) DX.blink();
    announce('Drill complete. ' + g.name + '. Score ' + avg + ' of 100. Calm ' + s.calm + ', safety ' + s.safety + ', evidence ' + s.evidence + '. ' + g.line);
    var h = $('.dr-r-grade');
    h.focus({ preventScroll: true });
    elReport.scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth', block: 'start' });
  }

  function keepInView() {
    var r = elConsole.getBoundingClientRect();
    var navH = 64;
    if (r.top < navH || r.top > window.innerHeight * 0.5) {
      window.scrollTo({ top: window.scrollY + r.top - navH - 16, behavior: reduce.matches ? 'auto' : 'smooth' });
    }
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
  doc.addEventListener('visibilitychange', function () {
    if (doc.hidden && s && s.phase === 'asking' && !s.paused) setPaused(true, 'hidden');
  });
  doc.addEventListener('keydown', function (e) {
    if (!s || s.phase !== 'asking') return;
    if (e.key === 'Escape' && !s.paused) { e.preventDefault(); setPaused(true, 'key'); }
  });

  host.setAttribute('data-ready', 'true');
  showReady();
})();
