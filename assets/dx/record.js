/* The Disclosure Ledger: filter by type and verdict, search the text, flip the order,
   and copy a link to any entry. The full list is static HTML; this script only hides and
   reorders rows. Filters live in the address (?type=&verdict=&order=&q=) so a filtered
   view can be shared. Without JavaScript, every row shows, newest first. */
(function () {
  'use strict';
  var doc = document;
  var list = doc.querySelector('[data-ledger]');
  var controls = doc.querySelector('[data-ledger-controls]');
  if (!list || !controls) return;

  var rows = [].slice.call(list.querySelectorAll('.lg-row'));
  var status = doc.querySelector('[data-ledger-status]');
  var empty = doc.querySelector('[data-ledger-empty]');
  var notice = doc.querySelector('[data-ledger-notice]');
  var copied = doc.querySelector('[data-ledger-copied]');
  var qInput = doc.getElementById('lg-q');
  var typeBtns = [].slice.call(controls.querySelectorAll('[data-filter]'));
  var verdictBtns = [].slice.call(controls.querySelectorAll('[data-verdict]'));
  var sortBtns = [].slice.call(controls.querySelectorAll('[data-sort]'));
  var HOME = 'https://www.getdisclosure.app/record/';
  var TYPES = { all: 'all types', hearing: 'hearings', law: 'legislation', report: 'reports', release: 'releases', statement: 'statements' };
  var VERDICTS = { all: '', VERIFIED: 'verified', PARTLY: 'partly' };
  var DEFAULT = { type: 'all', verdict: 'all', order: 'desc', q: '' };
  var state = { type: 'all', verdict: 'all', order: 'desc', q: '' };

  function fold(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim();
  }
  function seq(el) { return parseInt(el.getAttribute('data-seq'), 10) || 0; }

  /* per-row facts, read once from the static HTML */
  var info = rows.map(function (row) {
    var chip = row.querySelector('.lg-verdict .chip');
    var verdict = chip ? chip.textContent.trim().toUpperCase() : '';
    row.setAttribute('data-verdict', verdict);
    var text = row.querySelector('.lg-text'), note = row.querySelector('.lg-note'), y = row.querySelector('.lg-y');
    return {
      row: row, verdict: verdict,
      hay: fold((text ? text.textContent : '') + ' ' + (note ? note.textContent : '') + ' ' + (y ? y.textContent : '')),
      title: text ? text.textContent.trim() : '',
      no: (row.querySelector('.lg-no') || {}).textContent || ''
    };
  });
  [].forEach.call(controls.querySelectorAll('[data-count]'), function (n) {
    var v = n.getAttribute('data-count');
    n.textContent = String(info.filter(function (x) { return x.verdict === v; }).length);
  });

  function matches(x) {
    if (state.type !== 'all' && x.row.getAttribute('data-type') !== state.type) return false;
    if (state.verdict !== 'all' && x.verdict !== state.verdict) return false;
    if (state.q) {
      var words = fold(state.q).split(' ');
      for (var i = 0; i < words.length; i++) if (words[i] && x.hay.indexOf(words[i]) < 0) return false;
    }
    return true;
  }
  function isDefault() { return state.type === 'all' && state.verdict === 'all' && !state.q; }

  function statusLine(shown) {
    if (isDefault()) return 'Showing all ' + rows.length + ' entries, ' + (state.order === 'desc' ? 'newest first.' : 'oldest first.');
    var bits = [TYPES[state.type]];
    if (state.verdict !== 'all') bits.push(VERDICTS[state.verdict]);
    if (state.q) bits.push('matching “' + state.q.trim() + '”');
    return 'Showing ' + shown + ' of ' + rows.length + ' entries: ' + bits.join(', ') + ', ' + (state.order === 'desc' ? 'newest first.' : 'oldest first.');
  }

  function apply(announce) {
    var ordered = info.slice().sort(function (a, b) { return state.order === 'desc' ? seq(b.row) - seq(a.row) : seq(a.row) - seq(b.row); });
    var frag = doc.createDocumentFragment();
    var shown = 0;
    ordered.forEach(function (x) {
      var ok = matches(x);
      x.row.hidden = !ok;
      if (ok) shown++;
      frag.appendChild(x.row);
    });
    list.appendChild(frag);
    if (empty) empty.hidden = shown !== 0;
    if (status && announce !== false) status.textContent = statusLine(shown);
    checkTarget(false);
  }

  function press(group, attr, value) {
    group.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute(attr) === value ? 'true' : 'false'); });
  }
  function sync() {
    press(typeBtns, 'data-filter', state.type);
    press(verdictBtns, 'data-verdict', state.verdict);
    press(sortBtns, 'data-sort', state.order);
    if (qInput && qInput.value !== state.q) qInput.value = state.q;
  }

  /* ---------- the address carries the filters ---------- */
  function readURL() {
    var p;
    try { p = new URLSearchParams(location.search); } catch (e) { return; }
    var t = (p.get('type') || '').toLowerCase();
    var v = (p.get('verdict') || '').toUpperCase();
    var o = (p.get('order') || '').toLowerCase();
    var q = (p.get('q') || '').slice(0, 80);
    state.type = TYPES[t] && t !== 'all' ? t : 'all';
    state.verdict = v === 'VERIFIED' || v === 'PARTLY' ? v : 'all';
    state.order = o === 'asc' ? 'asc' : 'desc';
    state.q = q;
  }
  function writeURL() {
    if (!window.history || !history.replaceState) return;
    var parts = [];
    if (state.type !== DEFAULT.type) parts.push('type=' + encodeURIComponent(state.type));
    if (state.verdict !== DEFAULT.verdict) parts.push('verdict=' + encodeURIComponent(state.verdict));
    if (state.order !== DEFAULT.order) parts.push('order=' + encodeURIComponent(state.order));
    if (state.q.trim()) parts.push('q=' + encodeURIComponent(state.q.trim()));
    try { history.replaceState(null, '', location.pathname + (parts.length ? '?' + parts.join('&') : '') + location.hash); } catch (e) {}
  }
  function change() { sync(); apply(); writeURL(); }

  typeBtns.forEach(function (btn) {
    btn.addEventListener('click', function () { state.type = btn.getAttribute('data-filter'); change(); });
  });
  verdictBtns.forEach(function (btn) {
    btn.addEventListener('click', function () { state.verdict = btn.getAttribute('data-verdict'); change(); });
  });
  sortBtns.forEach(function (btn) {
    btn.addEventListener('click', function () { state.order = btn.getAttribute('data-sort'); change(); });
  });
  var qTimer = 0;
  if (qInput) {
    qInput.addEventListener('input', function () {
      state.q = qInput.value.slice(0, 80);
      clearTimeout(qTimer);
      qTimer = setTimeout(function () { apply(); writeURL(); }, 180);
    });
    qInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') e.preventDefault(); });
  }
  function clearFilters() { state.type = 'all'; state.verdict = 'all'; state.q = ''; change(); }
  var clearBtn = doc.querySelector('[data-ledger-clear]');
  if (clearBtn) clearBtn.addEventListener('click', function () { clearFilters(); if (qInput) qInput.focus(); });

  /* ---------- a linked entry: highlight it, and say so if filters hide it ---------- */
  var targetRow = null;
  function hashRow() {
    var id = '';
    try { id = decodeURIComponent((location.hash || '').slice(1)); } catch (e) { return null; }
    if (!/^e-/.test(id)) return null;
    var el = doc.getElementById(id);
    return el && el.classList.contains('lg-row') && list.contains(el) ? el : null;
  }
  function checkTarget(scroll) {
    var el = hashRow();
    if (targetRow && targetRow !== el) targetRow.classList.remove('is-target');
    targetRow = el;
    if (!notice) return;
    if (!el) { notice.hidden = true; return; }
    el.classList.add('is-target');
    if (el.hidden) {
      var x = info.filter(function (i) { return i.row === el; })[0];
      var t = x ? x.title : '';
      if (t.length > 110) t = t.slice(0, 107).replace(/\s+\S*$/, '') + '...';
      notice.querySelector('[data-ledger-notice-text]').textContent =
        'The entry you linked to' + (x && x.no ? ' (' + x.no.trim() + ')' : '') + ' is hidden by the current filters: “' + t + '”';
      notice.hidden = false;
    } else {
      notice.hidden = true;
      if (scroll) reveal(el, false);
    }
  }
  function reveal(el, focus) {
    /* an instant jump: long smooth scrolls get interrupted by late layout and read as motion */
    var root = doc.documentElement, was = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';   /* dx.css sets smooth on html; override for this jump */
    el.scrollIntoView({ block: 'start', behavior: 'auto' });
    root.style.scrollBehavior = was;
    if (focus) { el.setAttribute('tabindex', '-1'); el.focus({ preventScroll: true }); }
  }
  var showBtn = doc.querySelector('[data-ledger-show]');
  if (showBtn) showBtn.addEventListener('click', function () {
    var el = targetRow;
    clearFilters();
    if (el) reveal(el, true);
  });
  window.addEventListener('hashchange', function () { checkTarget(true); });

  /* ---------- copy a link to one entry ---------- */
  function say(msg) { if (!copied) return; copied.textContent = ''; setTimeout(function () { copied.textContent = msg; }, 30); }
  function copyText(text, done, failed) {
    var fallback = function () {
      var ta = doc.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      doc.body.appendChild(ta); ta.select();
      var ok = false; try { ok = doc.execCommand('copy'); } catch (e) {}
      doc.body.removeChild(ta);
      if (ok) done(); else failed();
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback); else fallback();
  }
  info.forEach(function (x) {
    var slot = x.row.querySelector('.lg-verdict');
    if (!slot) return;
    var btn = doc.createElement('button');
    btn.type = 'button';
    btn.className = 'lg-copy';
    var vis = doc.createElement('span'); vis.className = 'lg-copy-t'; vis.textContent = 'Copy link';
    var hid = doc.createElement('span'); hid.className = 'visually-hidden'; hid.textContent = ' to ' + (x.no.trim() ? x.no.trim().toLowerCase() : 'this entry');
    btn.appendChild(vis); btn.appendChild(hid);
    var timer = 0;
    btn.addEventListener('click', function () {
      var url = HOME + '#' + x.row.id;
      copyText(url, function () {
        vis.textContent = 'Copied';
        btn.classList.add('is-done');
        say('Link to ' + (x.no.trim() || 'this entry').toLowerCase() + ' copied.');
        clearTimeout(timer);
        timer = setTimeout(function () { vis.textContent = 'Copy link'; btn.classList.remove('is-done'); }, 2400);
      }, function () { say('Copy was blocked. The link is ' + url); });
    });
    slot.appendChild(btn);
  });

  /* ---------- start ---------- */
  readURL();
  sync();
  controls.hidden = false;
  apply(!isDefault() || state.order !== 'desc');
  if (targetRow && !targetRow.hidden) {
    reveal(targetRow, false);
    /* images and fonts above the ledger can shift it after this runs; land on the row once more */
    window.addEventListener('load', function () {
      if (targetRow && !targetRow.hidden && Math.abs(targetRow.getBoundingClientRect().top) > 200) reveal(targetRow, false);
    });
  }
})();
