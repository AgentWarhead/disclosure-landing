/* DISCLOSURE classification + The Iris Print.
   Ten answers grow an iris. The iris, the designation and a serial become the First Contact Card.
   Mount: <section data-classify> with the markup in index.html (see .cx-* classes). */
(function () {
  'use strict';
  var doc = document;
  var host = doc.querySelector('[data-classify]');
  if (!host) return;

  var DX = window.DX || { track: function () {}, tick: function () {} };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var SUPA_URL = 'https://bexjbozbrhijtjombxkm.supabase.co';
  var SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJleGpib3picmhpanRqb21ieGttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1NzEyNTQsImV4cCI6MjA4NzE0NzI1NH0.h3TJJ599oOoKv3RA8QfELmwzvsYi1hhuxGau842P6hs';
  var STORE = 'dx-file-v2';

  var IR = window.DXIris;
  if (!IR) return;
  var ORDER = IR.ORDER, COLORS = IR.COLORS, ROLES = IR.ROLES;

  /* Option order is always sentinel, diplomat, scholar, survivor. The screen order is shuffled. */
  var Q = [
    ['The power cuts out. A green light hangs over the hills, too low to be a star. What do you do first?',
      ['Check the people closest to you and move them away from the windows.', 'Tell everyone to breathe and keep their voices down.', 'Note the time, direction, color, weather, and start recording.', 'Put shoes on, grab keys, and make sure there is a way out.']],
    ['A dark object settles into the field behind the house. The air goes quiet. People start stepping outside.',
      ['Stand at the edge of the group and keep everyone back.', 'Stay visible, keep your hands open, and speak in a calm voice.', 'Hold one steady filming position and mark the distance from the object.', 'Move everyone toward solid cover and keep watching the exits.']],
    ['Your phone lights up by itself. A map appears with one message: COME ALONE.',
      ['Nobody goes alone. If anyone moves, they move with protection.', 'Answer with one simple line: We are here. We are calm.', 'Screenshot it, save the coordinates, and check if other phones got it too.', 'Turn off location sharing. I am not walking into a trap.']],
    ['Your neighbor goes blank and starts walking toward the field like they heard their name called.',
      ['Get in front of them and stop them before they reach the light.', 'Use their name and talk them back one step at a time.', 'Watch what changed right before they moved: sound, light, or eye contact.', 'Tell everyone else to look away and move back now.']],
    ['A figure appears near the tree line. It is tall, still, and watching the group.',
      ['Make yourself the closest person to it so the group is behind you.', 'Lower your shoulders, keep your hands visible, and give a slow greeting.', 'Study how it stands, how it reacts to movement, and whether it casts a shadow.', 'Stay quiet, keep distance, and choose the route you would use if it moved.']],
    ['It places a small object on the ground between you and the field.',
      ['Stop anyone from touching it until you know it is safe.', 'Nod to show you understand, but do not reach for it.', 'Record where it landed, what it looks like, and what changed around it.', 'Back up. Gifts can still be bait, trackers, or contamination.']],
    ['A voice lands in your head, not your ears: WHO SPEAKS FOR YOU?',
      ['I do. No one here gets harmed while I am standing.', 'We are afraid, but we do not want conflict.', 'I give only facts: my name, the place, the date, and who is present.', 'I do not answer yet. I ground myself and break the hold first.']],
    ['The crowd behind you starts to break. Some are filming, some are crying, and two people are about to run.',
      ['Block the rush and give one clear order: stay behind me.', 'Give everyone a job: breathe, sit down, hold someone\u2019s hand, stay quiet.', 'Ask one steady person to film wide while you track what the object does next.', 'Clear a path out and get children, pets, and panicked people moving first.']],
    ['The object rises without sound. Wind hits hard. Dust, branches, and loose metal start flying.',
      ['Get bodies low and shield anyone who cannot move fast enough.', 'Keep the group from chasing it or throwing anything at it.', 'Record the lift, direction, speed, and what the wind does to the ground.', 'Drop behind the nearest solid cover and protect your eyes.']],
    ['By morning, officials and cameras are everywhere. They ask what happened.',
      ['Give names of anyone injured, missing, or still in danger first.', 'Tell the truth plainly so people understand without panicking.', 'Hand over the timeline, recordings, and what you can prove versus guess.', 'Protect your people\u2019s names and location until you know who can be trusted.']]
  ];

  var fnv = IR.fnv, mulberry = IR.mulberry;
  function $(sel, el) { return (el || host).querySelector(sel); }
  function randId(n) {
    var abc = '0123456789ABCDEFGHJKMNPQRSTVWXYZ', out = '', buf = new Uint32Array(n);
    (window.crypto || window.msCrypto).getRandomValues(buf);
    for (var i = 0; i < n; i++) out += abc[buf[i] % 32];
    return out;
  }
  function load() { try { return JSON.parse(localStorage.getItem(STORE) || 'null'); } catch (e) { return null; } }
  function save() { try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) {} }

  /* ---------- state ---------- */
  var state = load();
  if (!state || !Array.isArray(state.answers)) state = { answers: [], order: null, salt: randId(8), serial: null, archetype: null, claimed: false, issued: null };
  if (!state.order) {
    var r = mulberry(fnv(state.salt));
    state.order = Q.map(function () {
      var o = [0, 1, 2, 3];
      for (var i = 3; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = o[i]; o[i] = o[j]; o[j] = t; }
      return o;
    });
    save();
  }

  var decide = IR.decide;

  /* ---------- DOM ---------- */
  var elStage = $('.cx-stage');
  var elQ = $('.cx-q');
  var elResult = $('.cx-result');
  var elLive = $('.cx-live');
  var elCaption = $('.cx-caption');
  var elTicks = $('.cx-ticks');
  var canvas = $('.cx-iris');
  var ctx = canvas.getContext('2d');

  for (var t = 0; t < 10; t++) { var i = doc.createElement('i'); elTicks.appendChild(i); }

  /* ---------- the iris ---------- */
  var SIZE = 0, DPR = 1;
  var fibres = [];
  var growth = 0, growthTarget = 0, anim = 0, dilation = 0, dilationTarget = 0;

  function sizeCanvas() {
    var css = canvas.getBoundingClientRect().width || 360;
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    var next = Math.round(css * DPR);
    if (next === SIZE && canvas.width === next) return false;
    SIZE = next;
    canvas.width = SIZE; canvas.height = SIZE; /* resizing clears the bitmap, so the caller redraws */
    return true;
  }
  function buildFibres() { fibres = IR.buildFibres(state.salt); }
  function draw() {
    IR.draw(ctx, { size: SIZE, dpr: DPR, answers: state.answers, salt: state.salt, archetype: state.archetype, growth: growth, dilation: dilation, fibres: fibres });
  }

  function frame(ts) {
    var done = true;
    growth += (growthTarget - growth) * 0.09;
    dilation += (dilationTarget - dilation) * 0.08;
    if (Math.abs(growthTarget - growth) > 0.002 || Math.abs(dilationTarget - dilation) > 0.002) done = false;
    else { growth = growthTarget; dilation = dilationTarget; }
    draw();
    anim = done ? 0 : requestAnimationFrame(frame);
  }
  function render() {
    growthTarget = state.answers.length / 10;
    dilationTarget = state.archetype ? 0.35 : 0;
    if (reduce) { growth = growthTarget; dilation = dilationTarget; draw(); return; }
    if (!anim) anim = requestAnimationFrame(frame);
  }

  /* ---------- questions ---------- */
  function announce(msg) { elLive.textContent = ''; setTimeout(function () { elLive.textContent = msg; }, 30); }
  function paintTicks() {
    [].forEach.call(elTicks.children, function (el, i) {
      var a = state.answers[i];
      el.className = a === undefined ? '' : 'on';
      el.style.background = a === undefined ? '' : COLORS[ORDER[a]];
    });
  }
  function caption() {
    var n = state.answers.length;
    if (state.archetype) elCaption.textContent = 'Iris print ' + state.serial + '. Built from your ten answers.';
    else if (!n) elCaption.textContent = 'Unformed. It grows with every answer.';
    else elCaption.textContent = 'Forming. ' + n + ' of 10 answers read.';
  }

  var busy = false;
  function showQuestion(qi, focus) {
    var q = Q[qi];
    elQ.innerHTML = '';
    var head = doc.createElement('p');
    head.className = 'label cx-count';
    head.textContent = 'Question ' + (qi + 1) + ' of 10';
    var h = doc.createElement('h3');
    h.className = 'cx-prompt';
    h.tabIndex = -1;
    h.id = 'cx-prompt';
    h.textContent = q[0];
    var list = doc.createElement('div');
    list.className = 'cx-options';
    list.setAttribute('role', 'group');
    list.setAttribute('aria-labelledby', 'cx-prompt');
    state.order[qi].forEach(function (oi) {
      var b = doc.createElement('button');
      b.type = 'button';
      b.className = 'cx-opt';
      b.textContent = q[1][oi];
      b.addEventListener('click', function () { choose(qi, oi, b); });
      list.appendChild(b);
    });
    elQ.appendChild(head); elQ.appendChild(h); elQ.appendChild(list);
    if (!reduce) { elQ.classList.remove('cx-enter'); void elQ.offsetWidth; elQ.classList.add('cx-enter'); }
    if (focus) h.focus({ preventScroll: true });
  }

  function choose(qi, oi, btn) {
    if (busy || state.answers.length !== qi) return;
    busy = true;
    [].forEach.call(elQ.querySelectorAll('.cx-opt'), function (b) { b.disabled = true; });
    btn.classList.add('picked');
    state.answers.push(oi);
    save();
    if (qi === 0) DX.track('classify_start');
    DX.tick(330 + qi * 44, 0.3);
    paintTicks(); caption(); render();
    setTimeout(function () {
      busy = false;
      if (state.answers.length < 10) {
        announce('Answer read. Question ' + (qi + 2) + ' of 10.');
        showQuestion(qi + 1, true);
      } else {
        finish();
      }
    }, reduce ? 120 : 520);
  }

  function finish() {
    state.archetype = decide(state.answers);
    if (!state.serial) state.serial = (state.archetype === 'first-contact' ? 'FC-' : 'DSC-') + randId(4) + '-' + randId(4);
    if (!state.issued) state.issued = new Date().toLocaleDateString('en-CA');
    save();
    DX.track('classify_complete', { archetype: state.archetype });
    DX.tick(state.archetype === 'first-contact' ? 196 : 110, 1.4);
    if (window.DX && DX.blink) DX.blink();
    render(); caption();
    showResult(true);
  }

  /* ---------- result + capture ---------- */
  function showResult(focus) {
    var a = state.archetype, role = ROLES[a];
    host.setAttribute('data-state', 'result');
    host.style.setProperty('--role', COLORS[a]);
    elStage.hidden = true;
    elResult.hidden = false;
    $('.cx-r-role').textContent = role.role;
    $('.cx-r-name').textContent = role.name;
    $('.cx-r-line').textContent = role.line;
    $('.cx-r-first').textContent = role.first;
    $('.cx-r-serial').textContent = state.serial;
    $('.cx-r-dossier').setAttribute('href', role.url);
    $('.cx-r-dossier').textContent = 'Read the ' + (a === 'first-contact' ? 'sealed file' : role.name.replace('The ', '') + ' dossier');
    if (state.claimed) markClaimed(null);
    announce('Classification complete. Your designation is ' + role.name + '.');
    if (focus) { var h = $('.cx-r-name'); h.tabIndex = -1; h.focus({ preventScroll: false }); }
  }

  function retake() {
    state = { answers: [], order: null, salt: randId(8), serial: null, archetype: null, claimed: false, issued: null };
    var r = mulberry(fnv(state.salt));
    state.order = Q.map(function () {
      var o = [0, 1, 2, 3];
      for (var i = 3; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = o[i]; o[i] = o[j]; o[j] = t; }
      return o;
    });
    save();
    host.setAttribute('data-state', 'asking');
    host.style.removeProperty('--role');
    elResult.hidden = true;
    elStage.hidden = false;
    var form = $('.cx-form'); form.hidden = false; form.reset();
    $('.cx-claimed').hidden = true;
    $('.cx-form-msg').textContent = '';
    buildFibres(); growth = 0; paintTicks(); caption(); render();
    showQuestion(0, true);
    announce('File cleared. Question 1 of 10.');
  }

  function markClaimed(count) {
    $('.cx-form').hidden = true;
    var box = $('.cx-claimed');
    box.hidden = false;
    if (count) $('.cx-claimed-count').textContent = count.toLocaleString('en-CA') + ' civilians are in the record.';
  }

  function rpc(name, body) {
    return fetch(SUPA_URL + '/rest/v1/rpc/' + name, {
      method: 'POST',
      headers: { 'apikey': SUPA_KEY, 'Authorization': 'Bearer ' + SUPA_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify(body || {})
    });
  }

  $('.cx-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var form = e.currentTarget;
    var input = form.querySelector('input[type=email]');
    var btn = form.querySelector('button[type=submit]');
    var msg = $('.cx-form-msg');
    var email = (input.value || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      msg.textContent = 'That address will not reach you. Check it and try again.';
      input.setAttribute('aria-invalid', 'true'); input.focus(); return;
    }
    input.removeAttribute('aria-invalid');
    btn.disabled = true;
    var label = btn.textContent;
    btn.textContent = 'Entering it';
    msg.textContent = '';
    rpc('join_waitlist', { p_email: email, p_archetype: state.archetype, p_serial: state.serial })
      .then(function (res) {
        if (res.ok) return 'new';
        return res.text().then(function (t) {
          if (res.status === 409 || /23505|duplicate|already/i.test(t)) return 'known';
          throw new Error('rpc ' + res.status);
        });
      })
      .then(function (kind) {
        if (kind === 'new') {
          fetch('/api/send-card/', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, archetype: state.archetype, serial: state.serial, salt: state.salt, answers: state.answers.join(''), issued: state.issued })
          }).catch(function () {});
          DX.track('sign_up', { method: 'email', archetype: state.archetype });
        }
        state.claimed = true; save();
        $('.cx-claimed-head').textContent = kind === 'new' ? 'Entered into the record.' : 'This address is already in the record.';
        $('.cx-claimed-body').textContent = kind === 'new'
          ? 'Your card is on its way to ' + email + '. Launch access follows when the app opens.'
          : 'Nothing new was sent. Your launch access still stands.';
        return rpc('get_waitlist_count').then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; });
      })
      .then(function (count) {
        markClaimed(typeof count === 'number' && count > 0 ? count : null);
        $('.cx-claimed-head').focus({ preventScroll: true });
      })
      .catch(function () {
        btn.disabled = false; btn.textContent = label;
        msg.textContent = 'The line dropped before it reached the record. Nothing was saved. Try again in a moment.';
      });
  });

  /* ---------- the card (PNG) ---------- */
  function makeCard() {
    var fontsReady = doc.fonts && doc.fonts.load
      ? Promise.all([doc.fonts.load('800 80px "Public Sans"'), doc.fonts.load('700 24px "Space Mono"'), doc.fonts.load('400 30px "Public Sans"')]).catch(function () {})
      : Promise.resolve();
    var mark = new Image(); mark.src = '/assets/brand/disclosure-wordmark.webp';
    var markReady = mark.decode ? mark.decode().catch(function () {}) : Promise.resolve();
    return Promise.all([fontsReady, markReady]).then(function () {
      var kindW = 1080, kindH = 1350, cv = doc.createElement('canvas'); cv.width = kindW; cv.height = kindH;
      var big = doc.createElement('canvas'); big.width = big.height = 620;
      IR.draw(big.getContext('2d'), { size: 620, dpr: 1.7, answers: state.answers, salt: state.salt, archetype: state.archetype, growth: 1, dilation: 0.35, fibres: fibres });
      IR.drawCard(cv.getContext('2d'), 'card', state, big, mark.naturalWidth ? mark : null);
      return new Promise(function (res) { cv.toBlob(function (b) { res(b); }, 'image/png'); });
    });
  }
  function cardUrl() { return 'https://www.getdisclosure.app/card/' + encodeURIComponent(IR.encodeToken(state)); }
  function fileName() { return 'disclosure-' + state.archetype + '-' + state.serial + '.png'; }

  $('.cx-save').addEventListener('click', function () {
    makeCard().then(function (blob) {
      if (!blob) return;
      var url = URL.createObjectURL(blob), a = doc.createElement('a');
      a.href = url; a.download = fileName(); doc.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
      DX.track('card_download', { archetype: state.archetype });
    });
  });
  $('.cx-share').addEventListener('click', function () {
    var role = ROLES[state.archetype];
    var link = cardUrl();
    var text = 'I was classified ' + role.name + ' (' + role.role.toLowerCase() + '). Find out what you would do: ' + link;
    var fallback = function () {
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(function () { $('.cx-share-msg').textContent = 'Copied. Paste it anywhere.'; }).catch(function () {});
    };
    makeCard().then(function (blob) {
      var file = blob ? new File([blob], fileName(), { type: 'image/png' }) : null;
      if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
        return navigator.share({ files: [file], text: text, title: 'My DISCLOSURE designation' });
      }
      if (navigator.share) return navigator.share({ text: text, title: 'My DISCLOSURE designation', url: link });
      fallback();
    }).then(function () { DX.track('share', { method: 'card', archetype: state.archetype }); }).catch(function () {});
  });
  $('.cx-retake').addEventListener('click', retake);

  /* ---------- boot ---------- */
  sizeCanvas(); buildFibres();
  paintTicks(); caption();
  host.setAttribute('data-ready', 'true');
  if (state.archetype && state.answers.length === 10) {
    growth = growthTarget = 1; dilation = dilationTarget = 0.35; draw();
    showResult(false);
  } else {
    if (state.archetype) { state.archetype = null; }
    growth = growthTarget = state.answers.length / 10; draw();
    showQuestion(Math.min(state.answers.length, 9), false);
  }
  var rs = 0;
  var onResize = function () {
    clearTimeout(rs);
    rs = setTimeout(function () { if (sizeCanvas()) draw(); }, 80);
  };
  if ('ResizeObserver' in window) new ResizeObserver(onResize).observe(canvas);
  else window.addEventListener('resize', onResize);
})();
