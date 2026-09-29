/* DISCLOSURE: the Iris Print engine and the First Contact Card layout.
   One file, two runtimes: the browser (window.DXIris) and the Vercel card function (require).
   Everything here is deterministic: the same salt and answers always draw the same iris. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.DXIris = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var ORDER = ['sentinel', 'diplomat', 'scholar', 'survivor'];
  var COLORS = { sentinel: '#ef4444', diplomat: '#22c55e', scholar: '#60a5fa', survivor: '#f97316', 'first-contact': '#ffd700' };
  var MUTED = { sentinel: '#e0605a', diplomat: '#58c982', scholar: '#7eaee6', survivor: '#e58d4c' };
  var BASE = ['#6fc47f', '#9cc267', '#3f8a58', '#c9b25a'];

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

  function fnv(s) { var h = 0x811c9dc5; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h; }
  function mulberry(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

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
  function mixWeights(answers) {
    var s = scores(answers), total = 0, w = {};
    ORDER.forEach(function (k) { total += s[k]; });
    ORDER.forEach(function (k) { w[k] = total ? s[k] / total : 0.25; });
    return w;
  }
  function buildFibres(salt) {
    var r = mulberry(fnv('fibres:' + salt)), out = [], N = 1300;
    for (var k = 0; k < N; k++) {
      out.push({
        a: (k / N) * Math.PI * 2 + (r() - 0.5) * 0.02,
        reach: 0.78 + r() * 0.22, start: r() * 0.06, wob: 0.6 + r() * 1.6, ph: r() * Math.PI * 2,
        ticket: r(), alpha: 0.16 + r() * 0.34, w: 0.5 + r() * 1.1, lit: r()
      });
    }
    return out;
  }
  function colorFor(ticket, w, fc, answered) {
    if (fc) return ticket < 0.72 ? '#ffd700' : '#fff3b0';
    /* the living tissue is the watcher's own green and gold; your roles tint it */
    var baseShare = answered ? 0.42 : 1;
    if (ticket < baseShare) return BASE[Math.floor((ticket / baseShare) * 4) % 4];
    var u = (ticket - baseShare) / (1 - baseShare), acc = 0, sum = 0, sq = {};
    for (var i = 0; i < 4; i++) { sq[ORDER[i]] = Math.pow(w[ORDER[i]], 2.2); sum += sq[ORDER[i]]; }
    for (var j = 0; j < 4; j++) { acc += sq[ORDER[j]] / sum; if (u <= acc) return MUTED[ORDER[j]]; }
    return MUTED[ORDER[3]];
  }

  /* o: { size, dpr, answers, salt, archetype, growth, dilation, fibres?, Path2D? } */
  function draw(ctx, o) {
    var S = o.size, c = S / 2, R = S * 0.44, DPR = o.dpr || 1;
    var P2D = o.Path2D || (typeof Path2D !== 'undefined' ? Path2D : null);
    var answers = o.answers || [], n = answers.length;
    var fibres = o.fibres || buildFibres(o.salt);
    var fc = o.archetype === 'first-contact';
    var w = mixWeights(answers), s = scores(answers);
    var r = mulberry(fnv('rings:' + o.salt + answers.join('')));
    var g = o.growth, dilation = o.dilation || 0;
    ctx.clearRect(0, 0, S, S);

    var glow = ctx.createRadialGradient(c, c, R * 0.6, c, c, R * 1.25);
    glow.addColorStop(0, 'rgba(74,246,38,0.10)');
    glow.addColorStop(0.55, 'rgba(74,246,38,0.04)');
    glow.addColorStop(1, 'rgba(74,246,38,0)');
    ctx.fillStyle = glow; ctx.fillRect(0, 0, S, S);

    var pupilRx = Math.max(R * 0.04, R * (0.07 + 0.05 * (w.diplomat - w.sentinel + 0.25) + dilation * 0.1));
    var pupilRy = R * 0.6;
    var outer = R * (0.3 + 0.7 * g);

    var base = ctx.createRadialGradient(c, c, R * 0.05, c, c, outer);
    base.addColorStop(0, 'rgba(10,16,13,1)');
    base.addColorStop(0.6, fc ? 'rgba(60,48,8,0.85)' : 'rgba(18,34,26,0.9)');
    base.addColorStop(1, 'rgba(6,10,8,0.95)');
    ctx.beginPath(); ctx.arc(c, c, outer, 0, Math.PI * 2); ctx.fillStyle = base; ctx.fill();

    var buckets = {}, order = [];
    var freq = 5 + (s.scholar * 1.3), amp = 0.012 + s.survivor * 0.004;
    for (var k = 0; k < fibres.length; k++) {
      var f = fibres[k];
      if (f.lit > 0.35 + 0.65 * g && n < 10) continue;
      var key = colorFor(f.ticket, w, fc, n > 0) + '|' + (f.alpha > 0.33 ? 'h' : 'l');
      var p = buckets[key];
      if (!p) { p = buckets[key] = new P2D(); order.push(key); }
      var r0 = R * (0.12 + f.start), r1 = outer * f.reach;
      for (var st = 0; st <= 10; st++) {
        var rr = r0 + (r1 - r0) * (st / 10);
        var aa = f.a + Math.sin(rr / R * freq * f.wob + f.ph) * amp * f.wob;
        var x = c + Math.cos(aa) * rr, y = c + Math.sin(aa) * rr;
        if (st === 0) p.moveTo(x, y); else p.lineTo(x, y);
      }
    }
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    order.forEach(function (key) {
      var parts = key.split('|');
      ctx.strokeStyle = parts[0];
      ctx.globalAlpha = parts[1] === 'h' ? 0.42 : 0.2;
      ctx.lineWidth = (parts[1] === 'h' ? 1.1 : 0.7) * DPR;
      ctx.stroke(buckets[key]);
    });
    ctx.restore();
    ctx.globalAlpha = 1;

    if (n >= 3) { /* collarette */
      var cr = R * 0.4 * Math.min(1, 0.55 + g * 0.5), teeth = 40 + Math.round(s.sentinel * 4);
      ctx.beginPath();
      for (var z = 0; z <= teeth * 2; z++) {
        var az = (z / (teeth * 2)) * Math.PI * 2;
        var rz = cr * (z % 2 ? 1.07 : 0.95) * (1 + (r() - 0.5) * 0.05);
        if (z === 0) ctx.moveTo(c + Math.cos(az) * rz, c + Math.sin(az) * rz); else ctx.lineTo(c + Math.cos(az) * rz, c + Math.sin(az) * rz);
      }
      ctx.closePath();
      ctx.strokeStyle = fc ? 'rgba(255,230,120,0.5)' : 'rgba(215,235,220,0.28)';
      ctx.lineWidth = 1.2 * DPR;
      ctx.stroke();
    }
    if (n >= 5) { /* crypts follow the scholar answers */
      var crypts = 5 + Math.round(s.scholar * 2.5);
      for (var q = 0; q < crypts; q++) {
        var ac = r() * Math.PI * 2, rc = R * (0.46 + r() * 0.34) * (0.5 + g * 0.5);
        ctx.beginPath();
        ctx.ellipse(c + Math.cos(ac) * rc, c + Math.sin(ac) * rc, R * (0.018 + r() * 0.03), R * (0.008 + r() * 0.014), ac, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(2,5,3,0.75)'; ctx.fill();
      }
    }
    if (n >= 7) { /* contraction furrows follow the survivor answers */
      var furrows = 1 + Math.round(s.survivor);
      for (var fu = 0; fu < furrows; fu++) {
        var rf = outer * (0.72 + fu * (0.22 / Math.max(1, furrows)));
        var a0 = r() * Math.PI * 2, span = Math.PI * (0.5 + r() * 0.9);
        ctx.beginPath(); ctx.arc(c, c, rf, a0, a0 + span);
        ctx.strokeStyle = 'rgba(0,0,0,0.55)'; ctx.lineWidth = 1.6 * DPR; ctx.stroke();
      }
    }
    ctx.beginPath(); ctx.arc(c, c, outer, 0, Math.PI * 2); /* limbal ring follows the sentinel answers */
    ctx.strokeStyle = 'rgba(0,0,0,0.85)'; ctx.lineWidth = (R * 0.03 + s.sentinel * R * 0.006) * g + DPR; ctx.stroke();

    ctx.beginPath(); ctx.ellipse(c, c, pupilRx, pupilRy * (0.35 + 0.65 * Math.max(0.15, g)), 0, 0, Math.PI * 2);
    ctx.fillStyle = '#010201'; ctx.fill();
    ctx.strokeStyle = fc ? 'rgba(255,215,0,0.55)' : 'rgba(141,255,115,0.28)';
    ctx.lineWidth = 1 * DPR; ctx.stroke();

    if (g > 0.05) { /* the glint, same light as the eye in the hero */
      ctx.beginPath(); ctx.ellipse(c - R * 0.34, c - R * 0.46, R * 0.07, R * 0.04, -0.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(235,245,240,' + (0.5 * g).toFixed(3) + ')'; ctx.fill();
    }
  }

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

  /* The card. c2 is a 2D context already sized; iris is a finished iris canvas; mark is the wordmark image or null.
     kind 'card' = 1080x1350 portrait, 'og' = 1200x630 share preview. */
  function drawCard(c2, kind, file, iris, mark) {
    var a = file.archetype, role = ROLES[a], col = COLORS[a];
    var SANS = '"Public Sans", Arial, sans-serif', MONO = '"Space Mono", "Courier New", monospace';
    if (kind === 'og') {
      var W = 1200, H = 630;
      c2.fillStyle = '#030504'; c2.fillRect(0, 0, W, H);
      var vg = c2.createRadialGradient(330, 315, 60, 330, 315, 420);
      vg.addColorStop(0, 'rgba(74,246,38,0.10)'); vg.addColorStop(1, 'rgba(0,0,0,0)');
      c2.fillStyle = vg; c2.fillRect(0, 0, W, H);
      c2.drawImage(iris, 60, 45, 540, 540);
      c2.textBaseline = 'alphabetic'; c2.textAlign = 'left';
      if (mark) c2.drawImage(mark, 640, 70, 220, 44); else { c2.fillStyle = '#d8dfda'; c2.font = '900 30px ' + SANS; c2.fillText('DISCLOSURE', 640, 108); }
      c2.fillStyle = col; c2.fillRect(640, 140, 500, 4);
      c2.font = '700 20px ' + MONO; c2.fillStyle = '#a3aea7'; c2.fillText(role.role.toUpperCase(), 640, 206);
      c2.font = '800 72px ' + SANS; c2.fillStyle = '#eef2ef'; c2.fillText(role.name, 636, 286);
      c2.font = '400 26px ' + SANS; c2.fillStyle = '#c3ccc6';
      wrapText(c2, role.line, 640, 340, 500, 36);
      c2.font = '700 18px ' + MONO; c2.fillStyle = '#d8dfda'; c2.fillText('SERIAL ' + file.serial, 640, 540);
      c2.fillStyle = col; c2.fillText('FIND YOUR ROLE AT GETDISCLOSURE.APP', 640, 572);
      return;
    }
    var CW = 1080, CH = 1350;
    c2.fillStyle = '#030504'; c2.fillRect(0, 0, CW, CH);
    var g2 = c2.createRadialGradient(CW / 2, 560, 100, CW / 2, 560, 760);
    g2.addColorStop(0, 'rgba(74,246,38,0.08)'); g2.addColorStop(1, 'rgba(0,0,0,0)');
    c2.fillStyle = g2; c2.fillRect(0, 0, CW, CH);
    c2.strokeStyle = 'rgba(214,224,217,0.22)'; c2.lineWidth = 2; c2.strokeRect(40, 40, CW - 80, CH - 80);
    c2.textBaseline = 'alphabetic'; c2.textAlign = 'left';
    if (mark) c2.drawImage(mark, 84, 88, 250, 50);
    else { c2.fillStyle = '#d8dfda'; c2.font = '900 34px ' + SANS; c2.fillText('DISCLOSURE', 88, 128); }
    c2.font = '700 22px ' + MONO; c2.fillStyle = '#a3aea7';
    c2.textAlign = 'right'; c2.fillText('FIRST CONTACT CARD', CW - 88, 126); c2.textAlign = 'left';
    c2.fillStyle = col; c2.fillRect(88, 158, CW - 176, 4);
    c2.drawImage(iris, (CW - 620) / 2, 200, 620, 620);
    c2.font = '700 22px ' + MONO; c2.fillStyle = '#a3aea7';
    c2.fillText(role.role.toUpperCase(), 88, 900);
    c2.font = '800 96px ' + SANS; c2.fillStyle = '#eef2ef';
    c2.fillText(role.name, 84, 1000);
    c2.font = '400 32px ' + SANS; c2.fillStyle = '#c3ccc6';
    wrapText(c2, role.line, 88, 1062, CW - 176, 44);
    c2.strokeStyle = 'rgba(214,224,217,0.22)'; c2.beginPath(); c2.moveTo(88, 1190); c2.lineTo(CW - 88, 1190); c2.stroke();
    c2.font = '700 22px ' + MONO; c2.fillStyle = '#d8dfda';
    c2.fillText('SERIAL ' + file.serial, 88, 1236);
    c2.fillText('ISSUED ' + file.issued, 88, 1272);
    c2.textAlign = 'right'; c2.fillStyle = col; c2.fillText('GETDISCLOSURE.APP', CW - 88, 1272); c2.textAlign = 'left';
  }

  /* ---------- the card token: v1.<salt>.<answers>.<serial>.<issued yyyymmdd> ----------
     The role is never carried: it is recomputed from the answers, so a token cannot claim a role it did not earn. */
  var SALT_RE = /^[0-9A-HJKMNP-TV-Z]{8}$/;
  var SERIAL_RE = /^(DSC|FC)-[0-9A-HJKMNP-TV-Z]{4}-[0-9A-HJKMNP-TV-Z]{4}$/;
  function encodeToken(file) {
    return ['v1', file.salt, file.answers.join(''), file.serial, String(file.issued).replace(/-/g, '')].join('.');
  }
  function decodeToken(tok) {
    if (typeof tok !== 'string' || tok.length > 64) return null;
    var p = tok.split('.');
    if (p.length !== 5 || p[0] !== 'v1') return null;
    if (!SALT_RE.test(p[1]) || !/^[0-3]{10}$/.test(p[2]) || !SERIAL_RE.test(p[3]) || !/^\d{8}$/.test(p[4])) return null;
    var y = +p[4].slice(0, 4), m = +p[4].slice(4, 6), d = +p[4].slice(6, 8);
    if (y < 2026 || y > 2100 || m < 1 || m > 12 || d < 1 || d > 31) return null;
    var answers = p[2].split('').map(Number);
    var archetype = decide(answers);
    /* the serial prefix must agree with the role the answers earn */
    if ((archetype === 'first-contact') !== (p[3].indexOf('FC-') === 0)) return null;
    return { salt: p[1], answers: answers, serial: p[3], issued: p[4].slice(0, 4) + '-' + p[4].slice(4, 6) + '-' + p[4].slice(6, 8), archetype: archetype };
  }

  return {
    ORDER: ORDER, COLORS: COLORS, ROLES: ROLES,
    fnv: fnv, mulberry: mulberry, scores: scores, decide: decide,
    buildFibres: buildFibres, draw: draw, drawCard: drawCard, wrapText: wrapText,
    encodeToken: encodeToken, decodeToken: decodeToken
  };
});
