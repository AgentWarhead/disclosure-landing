/* Tools hub (/tools/): if the sky identifier left a sighting in this tab's session storage,
   offer to carry it into the report builder. Reads only; renders nothing when there is none. */
(function () {
  'use strict';
  var box = document.querySelector('[data-carry]');
  if (!box) return;
  var raw = null, s = null;
  try { raw = window.sessionStorage.getItem('dx-sighting-v1'); } catch (e) { return; }
  if (!raw) return;
  try { s = JSON.parse(raw); } catch (e) { return; }
  if (!s || typeof s !== 'object') return;

  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  function clean(v, max) { return typeof v === 'string' ? v.replace(/\s+/g, ' ').trim().slice(0, max || 60) : ''; }
  function niceDate(d) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d);
    return m && +m[2] >= 1 && +m[2] <= 12 ? MONTHS[+m[2] - 1] + ' ' + (+m[3]) + ', ' + m[1] : d;
  }
  var date = niceDate(clean(s.date, 20));
  var time = clean(s.time, 12);
  var top = s.candidates && s.candidates.length && s.candidates[0] ? clean(s.candidates[0].label, 80) : '';
  if (!date && !time) return;

  var p = document.createElement('p');
  p.className = 'tl-carry-line';
  var tag = document.createElement('span');
  tag.className = 'label';
  tag.textContent = 'Your sighting';
  p.appendChild(tag);
  var when = [date, time ? 'at ' + time : ''].filter(Boolean).join(' ');
  p.appendChild(document.createTextNode('You have a sighting from ' + when + (top ? ': ' + top + '.' : ', with no match in public data.') + ' '));
  var a = document.createElement('a');
  a.href = '/tools/report/';
  a.textContent = 'Log it in the report builder';
  p.appendChild(a);
  box.appendChild(p);
  box.hidden = false;
})();
