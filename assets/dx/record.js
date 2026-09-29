/* The Disclosure Ledger: filter by type and flip the order. The full list is static HTML;
   this script only hides rows and reorders them. Without it, every row shows, newest first. */
(function () {
  'use strict';
  var list = document.querySelector('[data-ledger]');
  var controls = document.querySelector('[data-ledger-controls]');
  if (!list || !controls) return;

  var rows = [].slice.call(list.querySelectorAll('.lg-row'));
  var status = document.querySelector('[data-ledger-status]');
  var empty = document.querySelector('[data-ledger-empty]');
  var typeBtns = [].slice.call(controls.querySelectorAll('[data-filter]'));
  var sortBtns = [].slice.call(controls.querySelectorAll('[data-sort]'));
  var state = { type: 'all', order: 'desc' };
  var LABEL = { all: 'all types', hearing: 'hearings', law: 'legislation', report: 'reports', release: 'releases', statement: 'statements' };

  function seq(el) { return parseInt(el.getAttribute('data-seq'), 10) || 0; }

  function apply(announce) {
    var ordered = rows.slice().sort(function (a, b) { return state.order === 'desc' ? seq(b) - seq(a) : seq(a) - seq(b); });
    var frag = document.createDocumentFragment();
    var shown = 0;
    ordered.forEach(function (row) {
      var match = state.type === 'all' || row.getAttribute('data-type') === state.type;
      row.hidden = !match;
      if (match) shown++;
      frag.appendChild(row);
    });
    list.appendChild(frag);
    if (empty) empty.hidden = shown !== 0;
    if (status && announce !== false) {
      status.textContent = 'Showing ' + shown + ' of ' + rows.length + ' entries, ' + LABEL[state.type] + ', ' +
        (state.order === 'desc' ? 'newest first.' : 'oldest first.');
    }
  }

  function press(group, btn) {
    group.forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
  }

  typeBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      state.type = btn.getAttribute('data-filter');
      press(typeBtns, btn);
      apply();
    });
  });
  sortBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      state.order = btn.getAttribute('data-sort');
      press(sortBtns, btn);
      apply();
    });
  });

  controls.hidden = false;
  apply(false);
})();
