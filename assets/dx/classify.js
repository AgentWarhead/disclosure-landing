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

  var ORDER = ['sentinel', 'diplomat', 'scholar', 'survivor'];
  var COLORS = { sentinel: '#ef4444', diplomat: '#22c55e', scholar: '#60a5fa', survivor: '#f97316', 'first-contact': '#ffd700' };

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

  var ROLES = {
    sentinel: {
      name: 'The Sentinel', role: 'Primary protector', url: '/archetype/sentinel/',
      line: 'You put yourself between the unknown and everyone else, and you do it before anyone asks.',
      first: 'In the first minute you count heads, find the gap, and stand in it. Your training is restraint: holding the line without starting a fight you cannot finish.'
    },
    diplomat: {
      name: 'The Diplomat', role: 'De-escalation lead', url: '/archetype/diplomat/',
      line: 'You lower the temperature of every room you stand in, including this one.',
      first: 'In the first minute you slow your breathing so others copy it. Your training is signal discipline: open hands, a quiet voice, and no sudden moves.'
    },
    scholar: {
      name: 'The Scholar', role: 'Field analyst', url: '/archetype/scholar/',
      line: 'While everyone else reacts, you record. Your account is the one that survives.',
      first: 'In the first minute you note the time, the direction and the light. Your training is evidence: what you can prove, what you only saw, and the difference.'
    },
    survivor: {
      name: 'The Survivor', role: 'Self-preservation specialist', url: '/archetype/survivor/',
      line: 'You read the exit before you read the room, and your people are already moving.',
      first: 'In the first minute you find cover and a way out. Your training is timing: knowing when leaving is the calm choice and not the panicked one.'
    },
    'first-contact': {
      name: 'First Contact', role: 'Designation not issued', url: '/archetype/first-contact/',
      line: 'This designation is not assigned. It appears. You should not be seeing this.',
      first: 'Your answers did not fit the four. The record has no instructions for you, only a serial.'
    }
  };

  /* ---------- tiny utils ---------- */
  function fnv(s) { var h = 0x811c9dc5; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h; }
  function mulberry(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
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

  function scores(answers) {
    var s = { sentinel: 0, diplomat: 0, scholar: 0, survivor: 0 };
    answers.forEach(function (a, qi) { s[ORDER[a]] += 1 + qi * 0.01; }); /* later answers break ties */
    return s;
  }
  function decide(answers) {
    var seq = answers.slice(0, 4).map(function (a) { return a + 1; }).join('');
    if (fnv('dx-watch:' + seq).toString(36) === 'q6w5g1') return 'first-contact';
    var s = scores(answers), best = 'diplomat', top = -1;
    ORDER.forEach(function (k) { if (s[k] > top) { top = s[k]; best = k; } });
    return best;
  }

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
    SIZE = Math.round(css * DPR);
    canvas.width = SIZE; canvas.height = SIZE;
  }
  function buildFibres() {
    var r = mulberry(fnv('fibres:' + state.salt));
    fibres = [];
    var N = 1300;
    for (var k = 0; k < N; k++) {
      fibres.push({
        a: (k / N) * Math.PI * 2 + (r() - 0.5) * 0.02,
        reach: 0.78 + r() * 0.22,
        start: r() * 0.06,
        wob: 0.6 + r() * 1.6,
        ph: r() * Math.PI * 2,
        ticket: r(),
        alpha: 0.16 + r() * 0.34,
        w: 0.5 + r() * 1.1,
        lit: r()
      });
    }
  }
  function mixWeights(answers) {
    var s = scores(answers), total = 0, w = {};
    ORDER.forEach(function (k) { total += s[k]; });
    ORDER.forEach(function (k) { w[k] = total ? s[k] / total : 0.25; });
    return w;
  }
  function colorFor(ticket, w, fc) {
    if (fc) return ticket < 0.72 ? '#ffd700' : '#fff3b0';
    /* the living tissue is the watcher's own green and gold; your roles tint it */
    var BASE = ['#6fc47f', '#9cc267', '#3f8a58', '#c9b25a'];
    var baseShare = state.answers.length ? 0.42 : 1;
    if (ticket < baseShare) return BASE[Math.floor((ticket / baseShare) * 4) % 4];
    var u = (ticket - baseShare) / (1 - baseShare), acc = 0, sum = 0, sq = {};
    for (var i = 0; i < 4; i++) { sq[ORDER[i]] = Math.pow(w[ORDER[i]], 2.2); sum += sq[ORDER[i]]; }
    for (var j = 0; j < 4; j++) { acc += sq[ORDER[j]] / sum; if (u <= acc) return MUTED[ORDER[j]]; }
    return MUTED[ORDER[3]];
  }
  var MUTED = { sentinel: '#e0605a', diplomat: '#58c982', scholar: '#7eaee6', survivor: '#e58d4c' };

  function draw() {
    var S = SIZE, c = S / 2, R = S * 0.44;
    var answers = state.answers, n = answers.length;
    var fc = state.archetype === 'first-contact';
    var w = mixWeights(answers);
    var s = scores(answers);
    var r = mulberry(fnv('rings:' + state.salt + answers.join('')));
    ctx.clearRect(0, 0, S, S);

    /* sclera shadow + limbus glow */
    var glow = ctx.createRadialGradient(c, c, R * 0.6, c, c, R * 1.25);
    glow.addColorStop(0, 'rgba(74,246,38,0.10)');
    glow.addColorStop(0.55, 'rgba(74,246,38,0.04)');
    glow.addColorStop(1, 'rgba(74,246,38,0)');
    ctx.fillStyle = glow; ctx.fillRect(0, 0, S, S);

    var pupilRx = R * (0.07 + 0.05 * (w.diplomat - w.sentinel + 0.25) + dilation * 0.1);
    pupilRx = Math.max(R * 0.04, pupilRx);
    var pupilRy = R * 0.6;
    var g = growth;
    var outer = R * (0.3 + 0.7 * g);

    /* base stroma */
    var base = ctx.createRadialGradient(c, c, R * 0.05, c, c, outer);
    base.addColorStop(0, 'rgba(10,16,13,1)');
    base.addColorStop(0.6, fc ? 'rgba(60,48,8,0.85)' : 'rgba(18,34,26,0.9)');
    base.addColorStop(1, 'rgba(6,10,8,0.95)');
    ctx.beginPath(); ctx.arc(c, c, outer, 0, Math.PI * 2); ctx.fillStyle = base; ctx.fill();

    /* fibres, batched by colour */
    var buckets = {};
    var freq = 5 + (s.scholar * 1.3), amp = 0.012 + s.survivor * 0.004;
    for (var k = 0; k < fibres.length; k++) {
      var f = fibres[k];
      if (f.lit > 0.35 + 0.65 * g && n < 10) continue;
      var col = colorFor(f.ticket, w, fc);
      var key = col + '|' + (f.alpha > 0.33 ? 'h' : 'l');
      var p = buckets[key] || (buckets[key] = new Path2D());
      var r0 = R * (0.12 + f.start), r1 = outer * f.reach;
      var steps = 10;
      for (var st = 0; st <= steps; st++) {
        var rr = r0 + (r1 - r0) * (st / steps);
        var aa = f.a + Math.sin(rr / R * freq * f.wob + f.ph) * amp * f.wob;
        var x = c + Math.cos(aa) * rr, y = c + Math.sin(aa) * rr;
        if (st === 0) p.moveTo(x, y); else p.lineTo(x, y);
      }
    }
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    Object.keys(buckets).forEach(function (key) {
      var parts = key.split('|');
      ctx.strokeStyle = parts[0];
      ctx.globalAlpha = parts[1] === 'h' ? 0.42 : 0.2;
      ctx.lineWidth = (parts[1] === 'h' ? 1.1 : 0.7) * DPR;
      ctx.stroke(buckets[key]);
    });
    ctx.restore();
    ctx.globalAlpha = 1;

    /* collarette: from question 3 */
    if (n >= 3) {
      var cr = R * 0.4 * Math.min(1, 0.55 + g * 0.5);
      ctx.beginPath();
      var teeth = 40 + Math.round(s.sentinel * 4);
      for (var z = 0; z <= teeth * 2; z++) {
        var az = (z / (teeth * 2)) * Math.PI * 2;
        var rz = cr * (z % 2 ? 1.07 : 0.95) * (1 + (r() - 0.5) * 0.05);
        var xz = c + Math.cos(az) * rz, yz = c + Math.sin(az) * rz;
        if (z === 0) ctx.moveTo(xz, yz); else ctx.lineTo(xz, yz);
      }
      ctx.closePath();
      ctx.strokeStyle = fc ? 'rgba(255,230,120,0.5)' : 'rgba(215,235,220,0.28)';
      ctx.lineWidth = 1.2 * DPR;
      ctx.stroke();
    }
    /* crypts: from question 5, count follows the scholar answers */
    if (n >= 5) {
      var crypts = 5 + Math.round(s.scholar * 2.5);
      for (var q = 0; q < crypts; q++) {
        var ac = r() * Math.PI * 2, rc = R * (0.46 + r() * 0.34) * (0.5 + g * 0.5);
        ctx.beginPath();
        ctx.ellipse(c + Math.cos(ac) * rc, c + Math.sin(ac) * rc, R * (0.018 + r() * 0.03), R * (0.008 + r() * 0.014), ac, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(2,5,3,0.75)'; ctx.fill();
      }
    }
    /* contraction furrows: from question 7, count follows the survivor answers */
    if (n >= 7) {
      var furrows = 1 + Math.round(s.survivor);
      for (var fu = 0; fu < furrows; fu++) {
        var rf = outer * (0.72 + fu * (0.22 / Math.max(1, furrows)));
        var a0 = r() * Math.PI * 2, span = Math.PI * (0.5 + r() * 0.9);
        ctx.beginPath(); ctx.arc(c, c, rf, a0, a0 + span);
        ctx.strokeStyle = 'rgba(0,0,0,0.55)'; ctx.lineWidth = 1.6 * DPR; ctx.stroke();
      }
    }
    /* limbal ring: thickness follows the sentinel answers */
    ctx.beginPath(); ctx.arc(c, c, outer, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0,0,0,0.85)'; ctx.lineWidth = (R * 0.03 + s.sentinel * R * 0.006) * g + DPR; ctx.stroke();

    /* the slit */
    ctx.beginPath(); ctx.ellipse(c, c, pupilRx, pupilRy * (0.35 + 0.65 * Math.max(0.15, g)), 0, 0, Math.PI * 2);
    ctx.fillStyle = '#010201'; ctx.fill();
    ctx.strokeStyle = fc ? 'rgba(255,215,0,0.55)' : 'rgba(141,255,115,0.28)';
    ctx.lineWidth = 1 * DPR; ctx.stroke();

    /* the glint, same light as the eye in the hero */
    if (g > 0.05) {
      ctx.beginPath(); ctx.ellipse(c - R * 0.34, c - R * 0.46, R * 0.07, R * 0.04, -0.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(235,245,240,' + (0.5 * g).toFixed(3) + ')'; ctx.fill();
    }
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
          fetch('/api/send-card', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, archetype: state.archetype, serial: state.serial })
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
  function wrapText(c2, text, x, y, maxW, lh) {
    var words = text.split(' '), line = '', lines = [];
    words.forEach(function (w) {
      var test = line ? line + ' ' + w : w;
      if (c2.measureText(test).width > maxW && line) { lines.push(line); line = w; } else line = test;
    });
    if (line) lines.push(line);
    lines.forEach(function (l, i) { c2.fillText(l, x, y + i * lh); });
    return y + lines.length * lh;
  }
  function makeCard() {
    var fontsReady = doc.fonts && doc.fonts.load
      ? Promise.all([doc.fonts.load('800 80px "Public Sans"'), doc.fonts.load('700 24px "Space Mono"'), doc.fonts.load('400 30px "Public Sans"')]).catch(function () {})
      : Promise.resolve();
    var mark = new Image(); mark.src = '/assets/brand/disclosure-wordmark.webp';
    var markReady = mark.decode ? mark.decode().catch(function () {}) : Promise.resolve();
    return Promise.all([fontsReady, markReady]).then(function () {
      var W = 1080, H = 1350, cv = doc.createElement('canvas'); cv.width = W; cv.height = H;
      var c2 = cv.getContext('2d');
      var a = state.archetype, role = ROLES[a], col = COLORS[a];
      c2.fillStyle = '#030504'; c2.fillRect(0, 0, W, H);
      var vg = c2.createRadialGradient(W / 2, 560, 100, W / 2, 560, 760);
      vg.addColorStop(0, 'rgba(74,246,38,0.08)'); vg.addColorStop(1, 'rgba(0,0,0,0)');
      c2.fillStyle = vg; c2.fillRect(0, 0, W, H);
      c2.strokeStyle = 'rgba(214,224,217,0.22)'; c2.lineWidth = 2; c2.strokeRect(40, 40, W - 80, H - 80);
      c2.textBaseline = 'alphabetic';
      if (mark.naturalWidth) c2.drawImage(mark, 84, 88, 250, 50);
      else { c2.fillStyle = '#d8dfda'; c2.font = '900 34px "Public Sans", Arial, sans-serif'; c2.fillText('DISCLOSURE', 88, 128); }
      c2.font = '700 22px "Space Mono", monospace'; c2.fillStyle = '#a3aea7';
      c2.textAlign = 'right'; c2.fillText('FIRST CONTACT CARD', W - 88, 126); c2.textAlign = 'left';
      c2.fillStyle = col; c2.fillRect(88, 158, W - 176, 4);
      /* iris */
      var big = doc.createElement('canvas'); var keep = [canvas, ctx, SIZE, DPR, growth, dilation];
      big.width = big.height = 620; canvas = big; ctx = big.getContext('2d'); SIZE = 620; DPR = 1.7; growth = 1; dilation = 0.35;
      draw();
      canvas = keep[0]; ctx = keep[1]; SIZE = keep[2]; DPR = keep[3]; growth = keep[4]; dilation = keep[5];
      c2.drawImage(big, (W - 620) / 2, 200);
      c2.font = '700 22px "Space Mono", monospace'; c2.fillStyle = '#a3aea7';
      c2.fillText(role.role.toUpperCase(), 88, 900);
      c2.font = '800 96px "Public Sans", Arial, sans-serif'; c2.fillStyle = '#eef2ef';
      c2.fillText(role.name, 84, 1000);
      c2.font = '400 32px "Public Sans", Arial, sans-serif'; c2.fillStyle = '#c3ccc6';
      wrapText(c2, role.line, 88, 1062, W - 176, 44);
      c2.strokeStyle = 'rgba(214,224,217,0.22)'; c2.beginPath(); c2.moveTo(88, 1190); c2.lineTo(W - 88, 1190); c2.stroke();
      c2.font = '700 22px "Space Mono", monospace'; c2.fillStyle = '#d8dfda';
      c2.fillText('SERIAL ' + state.serial, 88, 1236);
      c2.fillText('ISSUED ' + state.issued, 88, 1272);
      c2.textAlign = 'right'; c2.fillStyle = col; c2.fillText('GETDISCLOSURE.APP', W - 88, 1272); c2.textAlign = 'left';
      return new Promise(function (res) { cv.toBlob(function (b) { res(b); }, 'image/png'); });
    });
  }
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
    var text = 'I was classified ' + role.name + ' (' + role.role.toLowerCase() + '). Find out what you would do: https://www.getdisclosure.app/';
    var fallback = function () {
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(function () { $('.cx-share-msg').textContent = 'Copied. Paste it anywhere.'; }).catch(function () {});
    };
    makeCard().then(function (blob) {
      var file = blob ? new File([blob], fileName(), { type: 'image/png' }) : null;
      if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
        return navigator.share({ files: [file], text: text, title: 'My DISCLOSURE designation' });
      }
      if (navigator.share) return navigator.share({ text: text, title: 'My DISCLOSURE designation', url: 'https://www.getdisclosure.app/' });
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
    rs = setTimeout(function () { var before = SIZE; sizeCanvas(); if (SIZE !== before) draw(); }, 80);
  };
  if ('ResizeObserver' in window) new ResizeObserver(onResize).observe(canvas);
  else window.addEventListener('resize', onResize);
})();
