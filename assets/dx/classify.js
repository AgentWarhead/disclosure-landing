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
  function shuffleOrder(salt) {
    var r = mulberry(fnv(salt));
    return Q.map(function () {
      var o = [0, 1, 2, 3];
      for (var i = 3; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = o[i]; o[i] = o[j]; o[j] = t; }
      return o;
    });
  }
  /* entered: this device has put a card into the record before. It survives a retake, so the form can tell the truth. */
  function freshState(entered) {
    return { answers: [], order: null, salt: randId(8), serial: null, archetype: null, claimed: false, issued: null, entered: !!entered };
  }
  var state = load();
  if (!state || !Array.isArray(state.answers) || typeof state.salt !== 'string') state = freshState(false);
  state.answers = state.answers.filter(function (a) { return a === 0 || a === 1 || a === 2 || a === 3; }).slice(0, 10);
  if (state.claimed) state.entered = true;
  if (!state.order || state.order.length !== Q.length) { state.order = shuffleOrder(state.salt); save(); }

  var decide = IR.decide;

  /* ---------- DOM ---------- */
  var elStage = $('.cx-stage');
  var elQ = $('.cx-q');
  var elResult = $('.cx-result');
  var elLive = $('.cx-live');
  var elCaption = $('.cx-caption');
  var elTicks = $('.cx-ticks');
  var elEye = $('.cx-eyecol');
  var canvas = $('.cx-iris');
  var ctx = canvas.getContext('2d');
  var mqNarrow = window.matchMedia('(max-width: 900px)');

  for (var t = 0; t < 10; t++) { var i = doc.createElement('i'); elTicks.appendChild(i); }

  /* On a page that hosts the classification, the header "Find your role" link stays on this page. */
  if (location.pathname !== '/') {
    [].forEach.call(doc.querySelectorAll('a[href="/#classify"]'), function (a) { a.setAttribute('href', '#classify'); });
  }

  /* ---------- the iris ----------
     Each answer draws the full iris once, off screen. The growth between two answers is a scaled
     cross-fade of the two finished bitmaps, and the last frame is a direct IR.draw, so the iris
     that stays on screen is exactly the one the engine draws for those answers. */
  var SIZE = 0, DPR = 1;
  var fibres = [];
  var growth = 0, growthTarget = 0, dilation = 0, dilationTarget = 0;
  var anim = 0, tw = null, TWEEN_MS = 700;
  var bmpFrom = doc.createElement('canvas'), bmpTo = doc.createElement('canvas');

  function sizeCanvas() {
    var css = canvas.clientWidth || canvas.getBoundingClientRect().width || 360; /* layout width, so the breathing scale never changes the bitmap size */
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    var next = Math.round(css * DPR);
    if (next === SIZE && canvas.width === next) return false;
    SIZE = next;
    canvas.width = SIZE; canvas.height = SIZE; /* resizing clears the bitmap, so the caller redraws */
    return true;
  }
  function buildFibres() { fibres = IR.buildFibres(state.salt); }
  function irisOpts(g, d) {
    return { size: SIZE, dpr: DPR, answers: state.answers, salt: state.salt, archetype: state.archetype, growth: g, dilation: d, fibres: fibres };
  }
  function resetCtx(c) { c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; }
  function stopTween() { if (anim) cancelAnimationFrame(anim); anim = 0; tw = null; }
  function drawFinal() {
    stopTween();
    growth = growthTarget; dilation = dilationTarget;
    resetCtx(ctx);
    IR.draw(ctx, irisOpts(growth, dilation));
  }
  function frame(now) {
    if (!tw) { anim = 0; return; }
    var k = Math.min(1, (now - tw.t0) / TWEEN_MS);
    if (k >= 1) { drawFinal(); return; }
    var e = 1 - Math.pow(1 - k, 3);
    growth = tw.g0 + (growthTarget - tw.g0) * e;
    dilation = tw.d0 + (dilationTarget - tw.d0) * e;
    var s = tw.s0 + (1 - tw.s0) * e, off = SIZE * (1 - s) / 2;
    resetCtx(ctx);
    ctx.clearRect(0, 0, SIZE, SIZE);
    ctx.globalAlpha = 1 - e;
    ctx.drawImage(bmpFrom, 0, 0, SIZE, SIZE);
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = e;
    ctx.drawImage(bmpTo, off, off, SIZE * s, SIZE * s);
    resetCtx(ctx);
    anim = requestAnimationFrame(frame);
  }
  function render() {
    growthTarget = state.answers.length / 10;
    dilationTarget = state.archetype ? 0.35 : 0;
    if (reduce || !SIZE) { drawFinal(); return; }
    var g0 = growth, d0 = dilation;
    stopTween();
    bmpFrom.width = bmpFrom.height = SIZE;
    bmpFrom.getContext('2d').drawImage(canvas, 0, 0);
    bmpTo.width = bmpTo.height = SIZE;
    IR.draw(bmpTo.getContext('2d'), irisOpts(growthTarget, dilationTarget));
    /* the new iris starts at the size of the one on screen and opens out to its own */
    tw = { t0: performance.now(), g0: g0, d0: d0, s0: Math.min(1, (0.3 + 0.7 * g0) / (0.3 + 0.7 * growthTarget)) };
    anim = requestAnimationFrame(frame);
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
  /* on narrow screens the band tightens once the first answer is in (classify.css, data-band) */
  function setBand() {
    if (state.answers.length && !state.archetype) host.setAttribute('data-band', 'compact');
    else host.removeAttribute('data-band');
  }

  /* where the fixed header ends, read from the sticky offsets the stylesheet already sets */
  var navH = 86;
  function readNav() {
    var eyeTop = parseFloat(getComputedStyle(elEye).top);
    if (getComputedStyle(elEye).position === 'sticky' && !isNaN(eyeTop)) navH = mqNarrow.matches ? eyeTop : eyeTop - 24;
    return navH;
  }
  function jump(y) {
    y = Math.max(0, Math.round(y));
    try { window.scrollTo({ top: y, behavior: 'instant' }); } catch (e) { window.scrollTo(0, y); }
  }
  /* put the counter and the prompt just under the sticky iris band (or the header on wide screens) */
  function alignQuestion() {
    var count = elQ.querySelector('.cx-count');
    if (!count) return;
    var cs = getComputedStyle(elEye), narrow = mqNarrow.matches, sticky = cs.position === 'sticky';
    var want = readNav() + 12;
    if (narrow && sticky) want += elEye.getBoundingClientRect().height;
    var top = count.getBoundingClientRect().top;
    if (narrow) { if (Math.abs(top - want) > 2) jump(window.scrollY + top - want); return; }
    var prompt = elQ.querySelector('.cx-prompt');
    if (top < want || prompt.getBoundingClientRect().bottom > window.innerHeight) jump(window.scrollY + top - want);
  }
  /* the reveal: the iris and the designation arrive in view together */
  function alignResult() {
    var want = readNav() + 12;
    var target = mqNarrow.matches ? elEye : $('.cx-body');
    jump(window.scrollY + target.getBoundingClientRect().top - want);
  }

  var elBack = null;
  function dropWelcome() { if (elBack) { elBack.remove(); elBack = null; } }
  function showWelcome(n) {
    dropWelcome();
    elBack = doc.createElement('p');
    elBack.className = 'cx-back';
    var s = doc.createElement('span');
    s.textContent = 'Welcome back. Question ' + (n + 1) + ' of 10.';
    var b = doc.createElement('button');
    b.type = 'button'; b.className = 'link cx-restart'; b.textContent = 'Start over';
    b.addEventListener('click', retake);
    elBack.appendChild(s); elBack.appendChild(b);
    elStage.insertBefore(elBack, elQ);
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
    if (focus) { alignQuestion(); h.focus({ preventScroll: true }); }
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
    /* the swap lands inside the 500 ms input window, so the layout change reads as a response, not a jump */
    setTimeout(function () {
      busy = false;
      dropWelcome();
      if (state.answers.length < 10) {
        setBand();
        showQuestion(qi + 1, true);
        announce('Answer read. Question ' + (qi + 2) + ' of 10.');
      } else {
        finish(true);
      }
    }, reduce ? 120 : 420);
  }

  function finish(live) {
    state.answers = state.answers.slice(0, 10);
    state.archetype = decide(state.answers);
    if (!state.serial) state.serial = (state.archetype === 'first-contact' ? 'FC-' : 'DSC-') + randId(4) + '-' + randId(4);
    if (!state.issued) state.issued = new Date().toLocaleDateString('en-CA');
    save();
    DX.track('classify_complete', { archetype: state.archetype });
    if (live) {
      DX.tick(state.archetype === 'first-contact' ? 196 : 110, 1.4);
      if (window.DX && DX.blink) DX.blink();
    }
    setBand(); render(); caption();
    showResult(live);
  }

  /* ---------- result + capture ---------- */
  function roleShort(k) { return ROLES[k].name.replace('The ', ''); }
  /* your own answer count per role, and the runner-up. Never for the sealed designation. */
  function explain() {
    var el = $('.cx-r-why'), a = state.archetype;
    if (!el) return;
    if (a === 'first-contact') { el.textContent = ''; el.hidden = true; return; }
    var count = { sentinel: 0, diplomat: 0, scholar: 0, survivor: 0 };
    state.answers.forEach(function (x) { count[ORDER[x]] += 1; });
    var sc = IR.scores(state.answers);
    var ranked = ORDER.slice().sort(function (x, y) { return sc[y] - sc[x]; });
    if (ranked[0] !== a) { ranked.splice(ranked.indexOf(a), 1); ranked.unshift(a); }
    var parts = ranked.filter(function (k) { return count[k] > 0; }).map(function (k) { return roleShort(k) + ' ' + count[k]; });
    var second = ranked[1], out = 'Your answers: ' + parts.join(', ') + '. ';
    if (!count[second]) out += 'No runner-up. Every answer pointed the same way.';
    else {
      out += 'Runner-up: ' + ROLES[second].name + '.';
      if (count[second] === count[a]) out += ' Tied at ' + count[a] + ', and your later answers settled it.';
    }
    el.textContent = out;
    el.hidden = false;
  }

  function showClaimPanel() {
    var form = $('.cx-form'), box = $('.cx-claimed'), stands = $('.cx-stands');
    if (state.claimed) { markClaimed(null); return; }
    box.hidden = true;
    if (state.entered && stands) { form.hidden = true; stands.hidden = false; }
    else { form.hidden = false; if (stands) stands.hidden = true; }
  }

  function showResult(live) {
    var a = state.archetype, role = ROLES[a];
    host.setAttribute('data-state', 'result');
    host.style.setProperty('--role', COLORS[a]);
    elStage.hidden = true;
    elResult.hidden = false;
    $('.cx-r-role').textContent = role.role;
    $('.cx-r-name').textContent = role.name;
    $('.cx-r-line').textContent = role.line;
    explain();
    $('.cx-r-first').textContent = role.first;
    $('.cx-r-serial').textContent = state.serial;
    $('.cx-r-dossier').setAttribute('href', role.url);
    $('.cx-r-dossier').textContent = 'Read the ' + (a === 'first-contact' ? 'sealed file' : roleShort(a) + ' dossier');
    showClaimPanel();
    announce('Classification complete. Your designation is ' + role.name + '.');
    if (live) {
      if (!reduce) { elResult.classList.remove('cx-enter'); void elResult.offsetWidth; elResult.classList.add('cx-enter'); }
      alignResult();
      var h = $('.cx-r-name'); h.tabIndex = -1; h.focus({ preventScroll: true });
    }
    primeCard();
  }

  function retake() {
    state = freshState(state.entered || state.claimed);
    state.order = shuffleOrder(state.salt);
    save();
    card = null;
    host.setAttribute('data-state', 'asking');
    host.style.removeProperty('--role');
    elResult.hidden = true;
    elStage.hidden = false;
    var form = $('.cx-form'); form.hidden = false; form.reset();
    $('.cx-claimed').hidden = true;
    if ($('.cx-stands')) $('.cx-stands').hidden = true;
    $('.cx-form-msg').textContent = '';
    $('.cx-share-msg').textContent = '';
    dropWelcome(); setBand();
    buildFibres(); growth = 0; dilation = 0; paintTicks(); caption(); render();
    showQuestion(0, true);
    announce('File cleared. Question 1 of 10.');
  }

  function markClaimed(count) {
    $('.cx-form').hidden = true;
    if ($('.cx-stands')) $('.cx-stands').hidden = true;
    var box = $('.cx-claimed');
    var head = $('.cx-claimed-head'), body = $('.cx-claimed-body');
    /* restored from this device: the send message is gone, so say what is still true */
    if (!head.textContent) head.textContent = 'Your card is in the record.';
    if (!body.textContent) body.textContent = 'This device entered it earlier. Launch access follows when the app opens.';
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
        state.claimed = true; state.entered = true; save();
        btn.disabled = false; btn.textContent = label;
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

  /* the card is drawn once, as soon as the result exists, so Share can hand it over inside the tap */
  var card = null;
  function cardFor() {
    if (card && card.serial === state.serial) return card;
    var c = card = { serial: state.serial, blob: null, file: null, ready: null };
    c.ready = makeCard().then(function (blob) {
      c.blob = blob || null;
      try { if (blob && typeof File === 'function') c.file = new File([blob], fileName(), { type: 'image/png' }); } catch (e) {}
      return c;
    }).catch(function () { return c; });
    return c;
  }
  function primeCard() {
    var go = function () { if (state.archetype) cardFor(); };
    if (window.requestIdleCallback) requestIdleCallback(go, { timeout: 1500 }); else setTimeout(go, 800);
  }

  function saveCard() {
    cardFor().ready.then(function (c) {
      if (!c.blob) return;
      var url = URL.createObjectURL(c.blob), a = doc.createElement('a');
      a.href = url; a.download = fileName(); doc.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
      DX.track('card_download', { archetype: state.archetype });
    });
  }
  $('.cx-save').addEventListener('click', saveCard);

  function shareMsg(parts) {
    var el = $('.cx-share-msg');
    el.textContent = '';
    setTimeout(function () {
      parts.forEach(function (p) {
        if (typeof p === 'string') { el.appendChild(doc.createTextNode(p)); return; }
        var a = doc.createElement('a'); a.href = p.href; a.textContent = p.href; a.className = 'cx-share-link'; el.appendChild(a);
      });
    }, 30);
  }
  function copyLink(link) {
    var shown = function () { shareMsg(['Sharing did not open here. Your card link: ', { href: link }]); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(link).then(function () {
        shareMsg(['Sharing did not open here, so the link to your card was copied. Paste it anywhere.']);
        DX.track('share', { method: 'copy', archetype: state.archetype });
      }, shown);
    } else shown();
  }
  $('.cx-share').addEventListener('click', function () {
    var role = ROLES[state.archetype], link = cardUrl();
    var line = 'I was classified ' + role.name + ' (' + role.role.toLowerCase() + '). Find out what you would do';
    var title = 'My DISCLOSURE designation';
    $('.cx-share-msg').textContent = '';
    if (typeof navigator.share !== 'function') { copyLink(link); return; }
    var c = cardFor(), data = { title: title, text: line + '.', url: link };
    try { if (c.file && navigator.canShare && navigator.canShare({ files: [c.file] })) data = { files: [c.file], title: title, text: line + ': ' + link }; } catch (e) {}
    var p;
    try { p = navigator.share(data); } catch (e) { p = Promise.reject(e); }
    Promise.resolve(p).then(function () { DX.track('share', { method: data.files ? 'card' : 'link', archetype: state.archetype }); }, function (err) {
      if (err && err.name === 'AbortError') return;
      copyLink(link);
    });
  });
  $('.cx-retake').addEventListener('click', retake);
  if ($('.cx-save2')) $('.cx-save2').addEventListener('click', saveCard);
  if ($('.cx-other')) $('.cx-other').addEventListener('click', function () {
    $('.cx-stands').hidden = true;
    var form = $('.cx-form'); form.hidden = false;
    form.querySelector('input[type=email]').focus();
  });

  /* ---------- boot ---------- */
  sizeCanvas(); buildFibres();
  host.setAttribute('data-ready', 'true');
  var n0 = state.answers.length;
  if (n0 === 10 && state.archetype) {
    growth = growthTarget = 1; dilation = dilationTarget = 0.35;
    paintTicks(); caption(); setBand(); drawFinal();
    showResult(false);
  } else if (n0 === 10) {
    /* ten answers read but the page closed before the result: finish it now */
    growth = growthTarget = 1; dilation = dilationTarget = 0.35;
    paintTicks(); finish(false); drawFinal();
  } else {
    if (state.archetype) { state.archetype = null; state.serial = null; save(); }
    growth = growthTarget = n0 / 10;
    paintTicks(); caption(); setBand(); drawFinal();
    if (n0) showWelcome(n0);
    showQuestion(n0, false);
  }
  var rs = 0;
  var onResize = function () {
    clearTimeout(rs);
    rs = setTimeout(function () { if (sizeCanvas() && !tw) drawFinal(); }, 80);
  };
  if ('ResizeObserver' in window) new ResizeObserver(onResize).observe(canvas);
  else window.addEventListener('resize', onResize);
})();
