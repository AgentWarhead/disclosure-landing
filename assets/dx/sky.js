/* DISCLOSURE: "What did I just see?" sky identifier (/tools/what-did-i-see/).
   Everything is worked out in this browser. The location never leaves the device: the only
   network requests are for the two vendored libraries and the satellite elements (/api/tle,
   falling back to the saved copy at /assets/data/tle-snapshot.json). A shared link carries the
   place only when the visitor ticks "Include my location in the link".
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
  var HANDOFF_KEY = 'dx-sky-handoff-v1';
  var DEG = Math.PI / 180;
  var RAD = 180 / Math.PI;
  var KM_PER_AU = 149597870.7;
  var R_EARTH = 6371;

  /* ---------- places: "Name, region, country|lat|lon|IANA zone" ---------- */
  var CITIES = [
    // Canada: every provincial and territorial capital, the big cities, and the West Kootenay
    'Castlegar, BC, Canada|49.324|-117.659|America/Vancouver', 'Nelson, BC, Canada|49.493|-117.294|America/Vancouver',
    'Trail, BC, Canada|49.096|-117.711|America/Vancouver', 'Creston, BC, Canada|49.097|-116.513|America/Creston', 'Cranbrook, BC, Canada|49.512|-115.769|America/Edmonton',
    'Kelowna, BC, Canada|49.888|-119.496|America/Vancouver', 'Penticton, BC, Canada|49.491|-119.586|America/Vancouver',
    'Vernon, BC, Canada|50.267|-119.272|America/Vancouver', 'Kamloops, BC, Canada|50.674|-120.327|America/Vancouver',
    'Prince George, BC, Canada|53.917|-122.749|America/Vancouver', 'Vancouver, BC, Canada|49.283|-123.121|America/Vancouver',
    'Victoria, BC, Canada|48.428|-123.365|America/Vancouver', 'Nanaimo, BC, Canada|49.166|-123.940|America/Vancouver',
    'Calgary, AB, Canada|51.045|-114.072|America/Edmonton', 'Edmonton, AB, Canada|53.546|-113.494|America/Edmonton',
    'Red Deer, AB, Canada|52.269|-113.811|America/Edmonton', 'Lethbridge, AB, Canada|49.694|-112.833|America/Edmonton',
    'Banff, AB, Canada|51.178|-115.571|America/Edmonton', 'Fort McMurray, AB, Canada|56.726|-111.381|America/Edmonton',
    'Regina, SK, Canada|50.445|-104.619|America/Regina',
    'Saskatoon, SK, Canada|52.133|-106.670|America/Regina', 'Winnipeg, MB, Canada|49.895|-97.138|America/Winnipeg',
    'Toronto, ON, Canada|43.653|-79.383|America/Toronto',
    'Ottawa, ON, Canada|45.421|-75.697|America/Toronto', 'Hamilton, ON, Canada|43.256|-79.869|America/Toronto',
    'London, ON, Canada|42.984|-81.245|America/Toronto',
    'Kitchener, ON, Canada|43.452|-80.492|America/Toronto', 'Windsor, ON, Canada|42.315|-83.036|America/Toronto',
    'Sudbury, ON, Canada|46.491|-80.993|America/Toronto', 'Thunder Bay, ON, Canada|48.381|-89.247|America/Toronto',
    'Kingston, ON, Canada|44.231|-76.486|America/Toronto', 'Montreal, QC, Canada|45.502|-73.567|America/Toronto', 'Quebec City, QC, Canada|46.813|-71.208|America/Toronto',
    'Gatineau, QC, Canada|45.477|-75.701|America/Toronto', 'Sherbrooke, QC, Canada|45.404|-71.893|America/Toronto',
    'Saguenay, QC, Canada|48.428|-71.068|America/Toronto',
    'Fredericton, NB, Canada|45.964|-66.643|America/Moncton', 'Moncton, NB, Canada|46.088|-64.778|America/Moncton',
    'Saint John, NB, Canada|45.273|-66.063|America/Moncton', 'Halifax, NS, Canada|44.649|-63.575|America/Halifax',
    'Sydney, NS, Canada|46.136|-60.194|America/Halifax', 'Shag Harbour, NS, Canada|43.497|-65.711|America/Halifax',
    'Charlottetown, PE, Canada|46.238|-63.131|America/Halifax', 'St. John\'s, NL, Canada|47.561|-52.713|America/St_Johns',
    'Whitehorse, YT, Canada|60.721|-135.057|America/Whitehorse', 'Yellowknife, NT, Canada|62.454|-114.372|America/Edmonton',
    'Iqaluit, NU, Canada|63.747|-68.517|America/Iqaluit',
    // United States
    'New York, NY, USA|40.713|-74.006|America/New_York', 'Los Angeles, CA, USA|34.052|-118.244|America/Los_Angeles',
    'Chicago, IL, USA|41.878|-87.630|America/Chicago', 'Houston, TX, USA|29.760|-95.370|America/Chicago',
    'Phoenix, AZ, USA|33.448|-112.074|America/Phoenix', 'Philadelphia, PA, USA|39.953|-75.165|America/New_York', 'Pittsburgh, PA, USA|40.441|-79.996|America/New_York',
    'San Antonio, TX, USA|29.424|-98.494|America/Chicago', 'Dallas, TX, USA|32.777|-96.797|America/Chicago',
    'Austin, TX, USA|30.267|-97.743|America/Chicago', 'Stephenville, TX, USA|32.221|-98.202|America/Chicago',
    'El Paso, TX, USA|31.762|-106.485|America/Denver', 'San Diego, CA, USA|32.716|-117.161|America/Los_Angeles',
    'San Francisco, CA, USA|37.775|-122.419|America/Los_Angeles', 'Seattle, WA, USA|47.606|-122.332|America/Los_Angeles',
    'Spokane, WA, USA|47.659|-117.426|America/Los_Angeles', 'Portland, OR, USA|45.515|-122.679|America/Los_Angeles',
    'Boise, ID, USA|43.615|-116.202|America/Boise', 'Las Vegas, NV, USA|36.170|-115.140|America/Los_Angeles',
    'Salt Lake City, UT, USA|40.761|-111.891|America/Denver', 'Denver, CO, USA|39.739|-104.990|America/Denver',
    'Albuquerque, NM, USA|35.084|-106.650|America/Denver', 'Roswell, NM, USA|33.394|-104.523|America/Denver',
    'Billings, MT, USA|45.783|-108.501|America/Denver', 'Fargo, ND, USA|46.877|-96.790|America/Chicago',
    'Minneapolis, MN, USA|44.978|-93.265|America/Chicago', 'Omaha, NE, USA|41.257|-95.935|America/Chicago',
    'Kansas City, MO, USA|39.100|-94.579|America/Chicago', 'St. Louis, MO, USA|38.627|-90.199|America/Chicago',
    'Oklahoma City, OK, USA|35.468|-97.516|America/Chicago', 'Milwaukee, WI, USA|43.039|-87.906|America/Chicago',
    'Detroit, MI, USA|42.331|-83.046|America/Detroit', 'Cleveland, OH, USA|41.499|-81.694|America/New_York',
    'Columbus, OH, USA|39.961|-82.999|America/New_York', 'Cincinnati, OH, USA|39.103|-84.512|America/New_York',
    'Indianapolis, IN, USA|39.768|-86.158|America/Indiana/Indianapolis', 'Louisville, KY, USA|38.253|-85.759|America/Kentucky/Louisville',
    'Nashville, TN, USA|36.163|-86.781|America/Chicago', 'Memphis, TN, USA|35.150|-90.049|America/Chicago',
    'New Orleans, LA, USA|29.951|-90.072|America/Chicago', 'Atlanta, GA, USA|33.749|-84.388|America/New_York',
    'Charlotte, NC, USA|35.227|-80.843|America/New_York', 'Raleigh, NC, USA|35.780|-78.639|America/New_York',
    'Washington, DC, USA|38.907|-77.037|America/New_York', 'Baltimore, MD, USA|39.290|-76.612|America/New_York',
    'Buffalo, NY, USA|42.886|-78.878|America/New_York', 'Boston, MA, USA|42.360|-71.059|America/New_York',
    'Jacksonville, FL, USA|30.332|-81.656|America/New_York', 'Orlando, FL, USA|28.538|-81.379|America/New_York',
    'Tampa, FL, USA|27.951|-82.457|America/New_York', 'Miami, FL, USA|25.762|-80.192|America/New_York',
    'Anchorage, AK, USA|61.218|-149.900|America/Anchorage', 'Honolulu, HI, USA|21.307|-157.858|Pacific/Honolulu', 'San Juan, Puerto Rico|18.466|-66.106|America/Puerto_Rico',
    // United Kingdom and Ireland
    'London, UK|51.507|-0.128|Europe/London', 'Manchester, UK|53.481|-2.243|Europe/London',
    'Birmingham, UK|52.486|-1.890|Europe/London', 'Leeds, UK|53.801|-1.549|Europe/London',
    'Liverpool, UK|53.408|-2.992|Europe/London', 'Bristol, UK|51.455|-2.588|Europe/London', 'Newcastle upon Tyne, UK|54.978|-1.618|Europe/London',
    'Norwich, UK|52.630|1.297|Europe/London', 'Ipswich, UK|52.057|1.155|Europe/London',
    'Glasgow, UK|55.864|-4.252|Europe/London', 'Edinburgh, UK|55.953|-3.188|Europe/London',
    'Aberdeen, UK|57.150|-2.094|Europe/London', 'Inverness, UK|57.478|-4.225|Europe/London',
    'Cardiff, UK|51.481|-3.179|Europe/London', 'Belfast, UK|54.597|-5.930|Europe/London',
    'Dublin, Ireland|53.350|-6.260|Europe/Dublin', 'Cork, Ireland|51.899|-8.476|Europe/Dublin',
    // Europe
    'Paris, France|48.857|2.352|Europe/Paris', 'Marseille, France|43.297|5.370|Europe/Paris',
    'Berlin, Germany|52.520|13.405|Europe/Berlin', 'Munich, Germany|48.135|11.582|Europe/Berlin', 'Frankfurt, Germany|50.110|8.682|Europe/Berlin',
    'Madrid, Spain|40.417|-3.704|Europe/Madrid', 'Barcelona, Spain|41.385|2.173|Europe/Madrid',
    'Lisbon, Portugal|38.722|-9.139|Europe/Lisbon', 'Rome, Italy|41.903|12.496|Europe/Rome', 'Amsterdam, Netherlands|52.368|4.904|Europe/Amsterdam', 'Brussels, Belgium|50.850|4.352|Europe/Brussels',
    'Luxembourg, Luxembourg|49.612|6.130|Europe/Luxembourg', 'Zurich, Switzerland|47.377|8.541|Europe/Zurich',
    'Geneva, Switzerland|46.204|6.143|Europe/Zurich', 'Vienna, Austria|48.208|16.374|Europe/Vienna',
    'Prague, Czechia|50.076|14.438|Europe/Prague', 'Warsaw, Poland|52.230|21.012|Europe/Warsaw',
    'Budapest, Hungary|47.498|19.040|Europe/Budapest', 'Bratislava, Slovakia|48.149|17.107|Europe/Bratislava',
    'Ljubljana, Slovenia|46.057|14.506|Europe/Ljubljana', 'Zagreb, Croatia|45.815|15.982|Europe/Zagreb',
    'Belgrade, Serbia|44.787|20.457|Europe/Belgrade', 'Bucharest, Romania|44.427|26.103|Europe/Bucharest',
    'Sofia, Bulgaria|42.698|23.322|Europe/Sofia', 'Athens, Greece|37.984|23.728|Europe/Athens',
    'Copenhagen, Denmark|55.676|12.568|Europe/Copenhagen', 'Oslo, Norway|59.914|10.752|Europe/Oslo',
    'Hessdalen, Norway|62.791|11.192|Europe/Oslo', 'Stockholm, Sweden|59.329|18.069|Europe/Stockholm',
    'Helsinki, Finland|60.170|24.938|Europe/Helsinki', 'Reykjavik, Iceland|64.147|-21.942|Atlantic/Reykjavik',
    'Tallinn, Estonia|59.437|24.754|Europe/Tallinn', 'Riga, Latvia|56.950|24.106|Europe/Riga',
    'Vilnius, Lithuania|54.687|25.280|Europe/Vilnius', 'Kyiv, Ukraine|50.450|30.523|Europe/Kyiv',
    'Istanbul, Turkey|41.008|28.978|Europe/Istanbul', 'Moscow, Russia|55.756|37.617|Europe/Moscow',
    // Australia and New Zealand
    'Sydney, NSW, Australia|-33.869|151.209|Australia/Sydney', 'Newcastle, NSW, Australia|-32.928|151.781|Australia/Sydney',
    'Canberra, ACT, Australia|-35.281|149.130|Australia/Sydney', 'Melbourne, VIC, Australia|-37.814|144.963|Australia/Melbourne',
    'Brisbane, QLD, Australia|-27.470|153.026|Australia/Brisbane', 'Cairns, QLD, Australia|-16.920|145.771|Australia/Brisbane', 'Perth, WA, Australia|-31.950|115.860|Australia/Perth', 'Adelaide, SA, Australia|-34.929|138.601|Australia/Adelaide',
    'Hobart, TAS, Australia|-42.882|147.327|Australia/Hobart', 'Darwin, NT, Australia|-12.463|130.842|Australia/Darwin',
    'Alice Springs, NT, Australia|-23.698|133.881|Australia/Darwin', 'Auckland, New Zealand|-36.848|174.763|Pacific/Auckland',
    'Wellington, New Zealand|-41.287|174.776|Pacific/Auckland', 'Christchurch, New Zealand|-43.532|172.637|Pacific/Auckland',
    // Elsewhere
    'Tokyo, Japan|35.676|139.650|Asia/Tokyo', 'Seoul, South Korea|37.567|126.978|Asia/Seoul',
    'Beijing, China|39.904|116.407|Asia/Shanghai', 'Shanghai, China|31.230|121.474|Asia/Shanghai',
    'Hong Kong|22.320|114.169|Asia/Hong_Kong', 'Taipei, Taiwan|25.033|121.565|Asia/Taipei',
    'Singapore|1.352|103.820|Asia/Singapore', 'Bangkok, Thailand|13.756|100.502|Asia/Bangkok',
    'Manila, Philippines|14.600|120.984|Asia/Manila', 'Jakarta, Indonesia|-6.208|106.846|Asia/Jakarta',
    'Kuala Lumpur, Malaysia|3.139|101.687|Asia/Kuala_Lumpur', 'Delhi, India|28.614|77.209|Asia/Kolkata',
    'Mumbai, India|19.076|72.878|Asia/Kolkata', 'Dubai, UAE|25.205|55.271|Asia/Dubai',
    'Riyadh, Saudi Arabia|24.713|46.675|Asia/Riyadh', 'Jerusalem|31.769|35.214|Asia/Jerusalem',
    'Cairo, Egypt|30.044|31.236|Africa/Cairo', 'Nairobi, Kenya|-1.292|36.822|Africa/Nairobi',
    'Lagos, Nigeria|6.524|3.379|Africa/Lagos', 'Johannesburg, South Africa|-26.204|28.047|Africa/Johannesburg',
    'Cape Town, South Africa|-33.925|18.424|Africa/Johannesburg', 'Mexico City, Mexico|19.433|-99.133|America/Mexico_City',
    'Monterrey, Mexico|25.686|-100.316|America/Monterrey', 'Havana, Cuba|23.113|-82.366|America/Havana',
    'Bogota, Colombia|4.711|-74.072|America/Bogota', 'Lima, Peru|-12.046|-77.043|America/Lima',
    'Santiago, Chile|-33.449|-70.669|America/Santiago', 'Buenos Aires, Argentina|-34.604|-58.382|America/Argentina/Buenos_Aires',
    'Sao Paulo, Brazil|-23.551|-46.633|America/Sao_Paulo', 'Rio de Janeiro, Brazil|-22.907|-43.173|America/Sao_Paulo'
  ];
  var PLACES = {};
  CITIES.forEach(function (row) {
    var f = row.split('|');
    PLACES[f[0].toLowerCase()] = { name: f[0], lat: +f[1], lon: +f[2], tz: f[3] };
  });
  function findPlace(text) { return PLACES[String(text || '').trim().replace(/\s+/g, ' ').toLowerCase()] || null; }

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
  var WHAT_WORDS = { moving: 'steady and moving', blinking: 'blinking or flashing', line: 'a line of lights', still: 'very bright, not moving', streak: 'a fast streak', hover: 'hovering' };
  var HEIGHT_WORDS = { low: 'low, near the horizon', half: 'halfway up', over: 'high, near overhead' };

  // Field guides on this site for each kind of answer (all checked on disk).
  var INTEL = {
    train: { href: '/intel/starlink-vs-ufo/', text: 'Starlink vs UFO: how to tell the difference' },
    starlink: { href: '/intel/starlink-vs-ufo/', text: 'Starlink vs UFO: how to tell the difference' },
    station: { href: '/intel/airplane-satellite-balloon-ufo-misidentification/', text: 'Airplane, satellite, balloon or UFO?' },
    sat: { href: '/intel/airplane-satellite-balloon-ufo-misidentification/', text: 'Airplane, satellite, balloon or UFO?' },
    aircraft: { href: '/intel/airplane-satellite-balloon-ufo-misidentification/', text: 'Airplane, satellite, balloon or UFO?' },
    lantern: { href: '/intel/airplane-satellite-balloon-ufo-misidentification/', text: 'Airplane, satellite, balloon or UFO?' },
    drone: { href: '/intel/drone-vs-ufo/', text: 'Drone vs UFO: a field identification guide' },
    planet: { href: '/intel/what-are-orbs-in-the-sky/', text: 'What are orbs in the sky?' },
    star: { href: '/intel/what-are-orbs-in-the-sky/', text: 'What are orbs in the sky?' }
  };

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
    zone: root.querySelector('#sky-zone'), place: root.querySelector('#sky-place'), places: root.querySelector('#sky-places'),
    geo: root.querySelector('#sky-geo'), lat: root.querySelector('#sky-lat'), lon: root.querySelector('#sky-lon'),
    geoStatus: root.querySelector('#sky-geo-status'), compass: root.querySelector('.sf-compass'), submit: root.querySelector('#sky-go'),
    err: root.querySelector('#sky-error'), readout: root.querySelector('.sky-readout'), outH: root.querySelector('#sky-out-h'),
    meta: root.querySelector('#sky-meta'), list: root.querySelector('#sky-list'), none: root.querySelector('#sky-none'),
    noneH: root.querySelector('#sky-none-h'), noneP: root.querySelector('#sky-none-p'), dome: root.querySelector('#sky-dome'),
    live: root.querySelector('#sky-live'), actions: root.querySelector('#sky-actions'), copy: root.querySelector('#sky-copy'),
    withLoc: root.querySelector('#sky-withloc'), log: root.querySelector('#sky-log'), print: root.querySelector('#sky-print'),
    shareStatus: root.querySelector('#sky-share-status'), shareUrl: root.querySelector('#sky-share-url')
  };
  function canonZone(tz) { try { return new Intl.DateTimeFormat('en-US', { timeZone: tz }).resolvedOptions().timeZone; } catch (e) { return null; } }
  var deviceTz = (function () { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'; } catch (e) { return 'UTC'; } })();
  // tzFrom: 'device' (default), 'place' (set by a picked place) or 'user' (chosen in the menu)
  var state = { tz: deviceTz, tzFrom: 'device', dir: null, timeTouched: false, place: null, last: null };

  /* ---------- time zones ---------- */
  var fmtCache = {};
  function partsIn(ms, tz) {
    var f = fmtCache[tz] || (fmtCache[tz] = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }));
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
  function offsetLabel(ms, tz) {
    var m = Math.round(tzOffset(ms, tz) / 60000), s = m < 0 ? '-' : '+';
    m = Math.abs(m);
    return 'UTC' + (m === 0 ? '' : s + Math.floor(m / 60) + (m % 60 ? ':' + pad(m % 60) : ''));
  }
  function zoneName(tz) { return tz.replace(/_/g, ' '); }

  // The menu: every zone this browser knows, labelled with its UTC offset on the chosen date.
  var zoneList = (function () {
    var seen = {}, out = [];
    function add(z) { var c = canonZone(z); if (c && !seen[c]) { seen[c] = 1; out.push(c); } }
    var all = [];
    try { if (Intl.supportedValuesOf) all = Intl.supportedValuesOf('timeZone'); } catch (e) {}
    all.forEach(add);
    add(deviceTz); add('UTC');
    CITIES.forEach(function (row) { add(row.split('|')[3]); });
    out.sort();
    return out;
  })();
  function labelZones() {
    var dm = /^(\d{4})-(\d{2})-(\d{2})$/.exec(el.date.value || ''), ms = dm ? Date.UTC(+dm[1], +dm[2] - 1, +dm[3], 12) : Date.now();
    var opts = el.zone.options;
    for (var i = 0; i < opts.length; i++) {
      var z = opts[i].value, t;
      try { t = zoneName(z) + ' (' + offsetLabel(ms, z) + ')'; } catch (e) { t = zoneName(z); }
      if (z === deviceTz) t += ', this device';
      if (opts[i].textContent !== t) opts[i].textContent = t;
    }
  }
  function buildZoneMenu() {
    var frag = document.createDocumentFragment();
    zoneList.forEach(function (z) { var o = document.createElement('option'); o.value = z; frag.appendChild(o); });
    el.zone.textContent = '';
    el.zone.appendChild(frag);
  }
  function setZone(tz, from) {
    var c = canonZone(tz) || deviceTz;
    if (zoneList.indexOf(c) < 0) { zoneList.push(c); var o = document.createElement('option'); o.value = c; el.zone.appendChild(o); labelZones(); }
    state.tz = c; state.tzFrom = from;
    el.zone.value = c;
  }

  function setNow() {
    var p = partsIn(Date.now(), state.tz);
    el.date.value = p.y + '-' + pad(p.mo) + '-' + pad(p.d);
    el.time.value = pad(p.h) + ':' + pad(p.mi);
    state.timeTouched = false;
    labelZones();
  }
  function clock(ms) {
    try { return new Intl.DateTimeFormat('en-US', { timeZone: state.tz, hour: 'numeric', minute: '2-digit' }).format(new Date(ms)); }
    catch (e) { return new Date(ms).toISOString().slice(11, 16) + ' UTC'; }
  }
  function dayLabel(ms) { var d = new Date(ms); return d.getUTCDate() + ' ' + MONTHS[d.getUTCMonth()] + ' ' + d.getUTCFullYear(); }

  /* ---------- inputs ---------- */
  buildZoneMenu();
  setZone(deviceTz, 'device');
  setNow();
  (function fillPlaces() {
    var frag = document.createDocumentFragment();
    CITIES.forEach(function (row) { var o = document.createElement('option'); o.value = row.split('|')[0]; frag.appendChild(o); });
    el.places.appendChild(frag);
  })();

  el.now.addEventListener('click', function () { setNow(); el.time.focus(); });
  el.date.addEventListener('input', function () { state.timeTouched = true; });
  el.date.addEventListener('change', labelZones);
  el.time.addEventListener('input', function () { state.timeTouched = true; });
  el.zone.addEventListener('change', function () { state.tz = el.zone.value; state.tzFrom = 'user'; });

  function resetZoneIfNotChosen() { if (state.tzFrom !== 'user') setZone(deviceTz, 'device'); }
  function applyPlace(p) {
    state.place = p.name;
    el.lat.value = p.lat;
    el.lon.value = p.lon;
    if (state.tzFrom !== 'user' || state.tz !== canonZone(p.tz)) setZone(p.tz, 'place');
    if (!state.timeTouched) setNow();
    clearFieldError(el.lat); clearFieldError(el.lon); clearFieldError(el.place);
    el.geoStatus.textContent = p.name + ' set. Times are read in its time zone, ' + zoneName(state.tz) + '.';
  }
  function clearPlace() {
    state.place = null;
    resetZoneIfNotChosen();
  }
  function placeInput(commit) {
    var v = el.place.value.trim(), p = findPlace(v);
    if (p) { if (state.place !== p.name) applyPlace(p); return; }
    if (v === '') { if (state.place) { clearPlace(); el.geoStatus.textContent = 'Place cleared. Times are read in ' + zoneName(state.tz) + '.'; } return; }
    if (state.place) clearPlace();
    if (commit) el.geoStatus.textContent = 'No place by that name in the list. Pick one of the suggestions, or type the coordinates.';
  }
  el.place.addEventListener('input', function () { placeInput(false); });
  el.place.addEventListener('change', function () { placeInput(true); });
  function manualCoords() {
    var p = state.place && findPlace(state.place);
    if (p && (Math.abs(+el.lat.value - p.lat) > 0.01 || Math.abs(+el.lon.value - p.lon) > 0.01)) {
      el.place.value = '';
      clearPlace();
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
      state.place = null;
      resetZoneIfNotChosen();
      if (!state.timeTouched) setNow();
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

  function radioRaw(name) { var r = form.querySelector('input[name="' + name + '"]:checked'); return r ? r.value : null; }
  function radioValue(name) { var v = radioRaw(name); return v && v !== 'unsure' ? v : null; }

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
      date: dm[0], time: tm[1] + ':' + tm[2], zone: state.tz,
      lat: lat, lon: lon, dir: state.dir, height: radioValue('height'), heightRaw: radioRaw('height'), what: radioValue('what'),
      place: state.place
    };
  }

  /* ---------- loading ---------- */
  var libPromise = null, dataPromise = null;
  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src; s.async = true;
      s.onload = function () { resolve(); };
      s.onerror = function () { s.remove(); reject(new Error('load ' + src)); };
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
        .then(function (res) {
          res.recs = res.doc ? buildRecs(res.doc) : [];
          if (!res.recs.length) dataPromise = null; // nothing usable: the next press tries the network again
          return res;
        });
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
      var name = r[0], id = r[2], g = r[13], kind = 'sat', std = 3.5, label = name, launch = null, fresh = false;
      if (id === 25544) { kind = 'station'; std = -1.8; label = 'International Space Station'; }
      else if (/TIANHE/.test(name)) { kind = 'station'; std = -0.8; label = 'Tiangong space station (China)'; }
      else if (/STARLINK/.test(name)) {
        kind = 'starlink';
        // One launch shares an international designator: launch year and launch number, e.g. 2026-219.
        var m = /^(\d{4})-(\d{3})/.exec(r[1] || ''), epochYear = +String(r[3]).slice(0, 4);
        launch = m ? m[1] + '-' + m[2] : null;
        // A fresh batch: from the last-30-days list (or launched this year) and still low, so it
        // circles more than 15.45 times a day (below about 420 km). Low, close and still flying in
        // a tight group, these satellites shine far brighter than the settled constellation.
        fresh = !!launch && (g === 'r' || +m[1] >= epochYear) && r[4] >= 15.45;
        std = fresh ? (r[4] >= 15.7 ? 2 : 2.5) : 4.5;
      }
      else if (g === 'r') { std = /R\/B/.test(name) ? 4 : 5.5; }
      else if (g === 's') { std = 4; }
      out.push({ rec: rec, name: name, label: label, id: id, intl: r[1], kind: kind, std: std, group: g, launch: launch, fresh: fresh });
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
    // a moving point gets noticed for its brightness: the space station stops people, a faint satellite rarely does
    if (kind === 'sat' || kind === 'starlink') return mag < -1 ? 1 : mag < 0.5 ? 0.93 : mag < 1.5 ? 0.82 : mag < 2.5 ? 0.68 : mag < 3.5 ? 0.55 : 0.45;
    return mag < 1.5 ? 1 : 0.8;
  }

  // Astronomy Engine holds refraction at its -1 degree value for anything lower, which lifts a Sun
  // below the horizon by about half a degree. Twilight and darkness use the true geometric altitude.
  function sunHorizon(A, time, obs) {
    var eq = A.Equator(A.Body.Sun, time, obs, true, true), h = A.Horizon(time, obs, eq.ra, eq.dec, 'normal');
    return h.altitude < -1 ? A.Horizon(time, obs, eq.ra, eq.dec, null) : h;
  }

  /* ---------- the sky at one moment ---------- */
  function skyNow(q) {
    var A = window.Astronomy;
    var date = new Date(q.t), time = A.MakeTime(date), obs = new A.Observer(q.lat, q.lon, 0);
    function horizon(body) { var eq = A.Equator(body, time, obs, true, true); return A.Horizon(time, obs, eq.ra, eq.dec, 'normal'); }
    var sun = sunHorizon(A, time, obs);
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
  function timeFactor(dt) { return 1 - 0.35 * Math.abs(dt) / HALF_WINDOW_S; }
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
      var sunAlt = sunHorizon(A, A.MakeTime(d), new A.Observer(q.lat, q.lon, 0)).altitude;
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
    // slack: flat solar panels throw more light than the diffuse-sphere estimate, so the brightness
    // gate only rules out the clearly faint. A fresh train gets more room: its members sit close
    // together, so a row of dimmer points still reads as one line.
    function seen(l, st, slack) { return l && l.alt > 8 && l.lit && st.sunAlt <= -4 && l.mag <= st.lim + (slack || 0.3); }
    // the whole visible arc, plus a little either side, for the dome
    function arc(r, i0, i1) {
      var pts = [];
      for (var k = Math.max(0, i0 - 3); k <= Math.min(steps.length - 1, i1 + 3); k++) { var l = look(r, steps[k]); if (l && l.alt > 0) pts.push({ alt: l.alt, az: l.az }); }
      return pts;
    }
    // A pass is scored on its best visible point (where it best matches the direction, height and
    // brightness given) times how close its visible stretch came to the time given.
    var singles = [], trains = {};
    recs.forEach(function (r) {
      if (r.kind === 'starlink' && r.fresh && r.launch) (trains[r.launch] = trains[r.launch] || []).push(r);
      var best = null, peak = null, near = null, first = -1, last = -1;
      for (var i = 0; i < steps.length; i++) {
        var st = steps[i], l = look(r, st);
        if (!seen(l, st)) continue;
        if (first < 0) first = i;
        last = i;
        if (near === null || Math.abs(st.dt) < Math.abs(near)) near = st.dt;
        if (!peak || l.alt > peak.l.alt) peak = { i: i, l: l };
        var sc = posScore(q, l.az, l.alt) * fit(q, r.kind === 'station' ? 'station' : 'sat', l.alt) * brightFactor(q, l.mag, 'sat') * (0.9 + 0.1 * l.alt / 90);
        if (!best || sc > best.score) best = { score: sc, i: i, l: l };
      }
      if (!best) return;
      var score = best.score * timeFactor(near);
      if (score > 0.05 && (r.kind !== 'starlink' || peak.l.mag < 3.5)) {
        singles.push({ r: r, score: score, alt: best.l.alt, az: best.l.az, mag: Math.min(best.l.mag, peak.l.mag), ms: steps[best.i].ms, dt: steps[best.i].dt,
          peak: { ms: steps[peak.i].ms, dt: steps[peak.i].dt, alt: peak.l.alt, az: peak.l.az },
          from: steps[first].ms, to: steps[last].ms, path: arc(r, first, last) });
      }
    });
    var trainOut = [];
    Object.keys(trains).forEach(function (g) {
      var members = trains[g];
      if (members.length < 3) return;
      var best = null, peak = null, near = null, first = -1, last = -1, most = 0, lead = null;
      for (var i = 0; i < steps.length; i++) {
        var st = steps[i], vis = [];
        members.forEach(function (r) { var l = look(r, st); if (seen(l, st, 2)) { l.r = r; vis.push(l); } });
        if (vis.length < 3) continue;
        if (first < 0) first = i;
        last = i;
        if (near === null || Math.abs(st.dt) < Math.abs(near)) near = st.dt;
        vis.sort(function (a, b) { return a.alt - b.alt; });
        var mid = vis[Math.floor(vis.length / 2)];
        if (vis.length > most) most = vis.length;
        if (!peak || mid.alt > peak.mid.alt) peak = { i: i, mid: mid };
        var sc = posScore(q, mid.az, mid.alt) * fit(q, 'train', mid.alt) * Math.min(1, 0.6 + vis.length / 20) * (0.9 + 0.1 * mid.alt / 90);
        if (!best || sc > best.score) { best = { score: sc, i: i, mid: mid, n: vis.length, mag: vis.reduce(function (m, v) { return Math.min(m, v.mag); }, 99) }; lead = mid.r; }
      }
      if (!best) return;
      // a train that never clears the low haze near the horizon is harder to notice
      var score = best.score * timeFactor(near) * (0.75 + 0.25 * Math.min(1, peak.mid.alt / 20));
      if (score > 0.05) {
        trainOut.push({ group: g, score: score, n: most, alt: best.mid.alt, az: best.mid.az, mag: best.mag, ms: steps[best.i].ms, dt: steps[best.i].dt,
          peak: { ms: steps[peak.i].ms, dt: steps[peak.i].dt, alt: peak.mid.alt, az: peak.mid.az },
          from: steps[first].ms, to: steps[last].ms, path: arc(lead, first, last) });
      }
    });
    // a Starlink that belongs to a train on screen is listed as part of that train, not alone
    var inTrain = {};
    trainOut.forEach(function (tr) { inTrain[tr.group] = 1; });
    singles = singles.filter(function (sg) { return !(sg.r.kind === 'starlink' && inTrain[sg.r.launch]); });
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
    var a = dirWord(path[0].az), b = dirWord(path[path.length - 1].az);
    return a === b ? 'low in the ' + a : 'moving from the ' + a + ' toward the ' + b;
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
  // Does a computed moving object fit what the person said it did?
  function movingFits(q, kind) {
    if (q.what === null || q.what === 'moving') return kind === 'station' || kind === 'sat' || kind === 'train';
    if (q.what === 'line') return kind === 'train';
    return false;
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
      sats.singles.forEach(function (s) { if (s.score >= 0.12) cands.push({ kind: s.r.kind === 'station' ? 'station' : 'sat', score: Math.min(1, s.score * dataInfo.satWeight), sat: s, alt: s.alt, az: s.az, mag: s.mag, ms: s.ms, dt: s.dt, peak: s.peak, path: s.path }); });
      sats.trains.forEach(function (t) { if (t.score >= 0.12) cands.push({ kind: 'train', score: Math.min(1, t.score * dataInfo.satWeight), train: t, alt: t.alt, az: t.az, mag: t.mag, ms: t.ms, dt: t.dt, peak: t.peak, path: t.path }); });
    }
    // keep only the best few stars and satellites so a clear sky does not bury the list
    cands.sort(function (a, b) { return b.score - a.score; });
    var starCount = 0, satCount = 0;
    cands = cands.filter(function (c) {
      if (c.kind === 'star') return ++starCount <= 2;
      if (c.kind === 'sat') return ++satCount <= 2;
      return true;
    });

    // Guesses from behaviour alone (no data places them). A sunlit pass or train that was really
    // there and fits what the person described outranks a guess about something nobody located.
    var located = 0;
    cands.forEach(function (c) { if (movingFits(q, c.kind) && c.score >= 0.25 && c.score > located) located = c.score; });
    var w = q.what, twilight = sky.sunAlt <= -4 && sky.sunAlt >= -18, dark = sky.sunAlt < -0.8;
    function H(kind, table, cap) {
      var s = w === null ? table.none : table[w] || 0;
      if (s > cap) s = cap;
      if (located && kind !== 'meteor') s = Math.min(s, located * 0.9);
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
    var d = { name: '', kind: '', why: '', data: '', peak: '', links: [] };
    var day = sky.sunAlt > -0.8;
    var where = c.alt !== undefined ? up(c.alt) + ' in the ' + dirWord(c.az) : '';
    function peakLine() {
      if (!c.peak) return '';
      return 'Highest while visible: ' + clock(c.peak.ms) + ', ' + up(c.peak.alt) + ' in the ' + dirWord(c.peak.az) + '.';
    }
    if (c.kind === 'planet') {
      var n = c.body.name;
      d.name = n; d.kind = 'Planet, computed';
      d.why = day ? {
        Venus: 'Venus was ' + where + ', in daylight. It is the brightest planet, and in a clear sky it can sometimes be picked out by day as a tiny white point if you know exactly where to look.',
        Jupiter: 'Jupiter was ' + where + ', in daylight. It is very hard to see while the Sun is up.',
        Mars: 'Mars was ' + where + ', in daylight.', Saturn: 'Saturn was ' + where + ', in daylight.', Mercury: 'Mercury was ' + where + ', in daylight.'
      }[n] : {
        Venus: 'Venus was ' + where + '. After the Moon it is the brightest thing in the night sky, and low down it can seem to hover, flicker or change color.',
        Jupiter: 'Jupiter was ' + where + '. It is usually brighter than any star and holds perfectly still against them.',
        Mars: 'Mars was ' + where + ', a steady orange-red point that does not twinkle much.',
        Saturn: 'Saturn was ' + where + ', a steady pale yellow point.',
        Mercury: 'Mercury was ' + where + ', low in the twilight glow. It never strays far from the Sun.'
      }[n];
      d.data = up(c.alt) + ' · ' + dirAb(c.az) + ' · ' + brightWord(c.mag);
      d.links.push(INTEL.planet);
    } else if (c.kind === 'moon') {
      var ph = c.body.phase, phase = ph > 0.95 ? 'full' : ph > 0.6 ? 'more than half lit' : ph > 0.4 ? 'about half lit' : ph > 0.05 ? 'a crescent' : 'almost new';
      d.name = 'The Moon'; d.kind = 'Moon, computed';
      d.why = day ? 'The Moon was ' + where + ', ' + phase + '. It is often up in daylight, pale against the blue, and easy to overlook until it catches the eye.'
        : 'The Moon was ' + where + ', ' + phase + '. Through thin cloud or haze it can look like a strange glowing shape.';
      d.data = up(c.alt) + ' · ' + dirAb(c.az) + ' · ' + phase;
    } else if (c.kind === 'star') {
      var s = c.body.name;
      d.name = s; d.kind = 'Star, computed';
      d.why = s === 'Polaris'
        ? 'Polaris, the North Star, was ' + where + '. It sits almost due north and does not move through the night, though it is not especially bright.'
        : s + ' was ' + where + '. ' + (c.alt < 25 ? 'A bright star this low twinkles hard and flashes red, green and white, which can look like blinking.' : 'It is one of the brightest stars, and it holds still.');
      d.data = up(c.alt) + ' · ' + dirAb(c.az) + ' · ' + brightWord(c.mag);
      d.links.push(INTEL.star);
    } else if (c.kind === 'station' || c.kind === 'sat') {
      var r = c.sat.r, ft = fromTo(c.path);
      if (r.kind === 'station') {
        d.name = r.label; d.kind = 'Space station, computed';
        d.why = 'The ' + (r.id === 25544 ? 'space station' : 'Tiangong station') + ' was visible ' + when(c) + ', ' + where + ', lit by the Sun while the sky around you was dark' + (ft ? ', ' + ft : '') + '. It moves steadily, takes a few minutes to cross and never blinks.';
        if (r.id === 25544) d.links.push({ href: 'https://spotthestation.nasa.gov/', text: 'Check its passes on NASA Spot the Station' });
        d.links.push(INTEL.station);
      } else {
        var rb = /R\/B/.test(r.name), sl = r.kind === 'starlink';
        d.name = sl ? 'A single Starlink satellite' : rb ? 'A spent rocket stage' : 'A bright satellite';
        d.kind = 'Satellite, computed';
        d.why = (rb ? 'A used rocket body' : 'The satellite') + ' ' + r.name + ' was visible ' + when(c) + ', ' + where + ', sunlit while the sky around you was dark' + (ft ? ', ' + ft : '') + '.' + (rb ? ' Tumbling stages can flash as they turn.' : ' Satellites move steadily and silently.');
        d.links.push(sl ? INTEL.starlink : INTEL.sat);
      }
      d.peak = peakLine();
      d.data = clock(c.ms) + ' · ' + up(c.alt) + ' · ' + dirAb(c.az) + ' · sunlit · ' + brightWord(c.mag);
    } else if (c.kind === 'train') {
      var t = c.train, ft2 = fromTo(c.path);
      d.name = 'A Starlink train'; d.kind = 'Satellites, computed';
      d.why = 'Up to ' + t.n + ' Starlink satellites from one recent launch were sunlit together ' + when(c) + ', around ' + where + (ft2 ? ', ' + ft2 : '') + '. A fresh batch flies low and close together, so it looks like a string of lights in a row until the satellites climb and spread out.';
      d.peak = peakLine();
      d.data = clock(c.ms) + ' · ' + up(c.alt) + ' · ' + dirAb(c.az) + ' · ' + t.n + ' in view · launch ' + t.group;
      d.links.push(INTEL.train);
    } else if (c.kind === 'aircraft') {
      d.name = 'An aircraft'; d.kind = 'From what it did, not live data';
      if (day) d.why = q.what === 'blinking' ? 'A regular flash is what aircraft anti-collision lights do, and the strobes can catch the eye even in daylight.'
        : q.what === 'still' || q.what === 'hover' ? 'In daylight, sunlight glinting off a plane’s body or windows can look like a bright point that hangs still until the angle changes.'
        : 'A bright point moving at a plane’s pace in daylight is most often an aircraft catching the sun.';
      else d.why = q.what === 'blinking' ? 'A regular blink or strobe is what aircraft lights do: planes flying at night must show position lights, and anti-collision lights stay on when fitted.'
        : q.what === 'still' || q.what === 'hover' ? 'A plane flying toward you with its landing lights on can look like a bright light that hangs still for minutes, especially near an airport.'
        : 'A steady light moving at a plane’s pace, sometimes with a red or green light beside it, is most often an aircraft.';
      d.links.push(INTEL.aircraft);
    } else if (c.kind === 'drone') {
      d.name = 'A drone'; d.kind = 'From what it did, not live data';
      d.why = day ? 'Drones can hover, stop and turn sharply. In daylight one can look like a small dark or shiny dot that hangs in one place, then darts off.'
        : 'Drones can hover, stop and turn sharply. In the US, small drones flying at night must show an anti-collision light visible for 3 miles.';
      d.links.push(INTEL.drone);
    } else if (c.kind === 'meteor') {
      var sh = showers(q.t);
      d.name = 'A meteor or fireball'; d.kind = 'From what it did, not live data';
      d.why = 'A streak that lasts a second or two is a meteor, a grain of space dust burning up. A very bright one is called a fireball.';
      if (sh.list.length) d.why += ' Active that night, per the IMO 2026 Meteor Shower Calendar: ' + sh.list.map(function (x) { return x.name + (x.near ? ' (near its peak, ' + x.peak + ')' : ' (' + x.range + ', peak ' + x.peak + ')'); }).join('; ') + '.';
      else if (sh.year === 2026) d.why += ' No major shower was active that night on the IMO 2026 Meteor Shower Calendar, but stray meteors fall every night.';
      d.links.push({ href: 'https://www.imo.net/resources/calendar/', text: 'IMO meteor shower calendar' });
    } else if (c.kind === 'lantern') {
      d.name = day ? 'A balloon' : 'A sky lantern or balloon'; d.kind = 'From what it did, not live data';
      d.why = day ? 'In daylight, a party or weather balloon catching the sun can look like a bright silver point that hangs still or drifts with the wind.'
        : 'Orange lights drifting slowly, often several together after a party or festival, are usually sky lanterns or lit balloons riding the wind.';
      d.links.push(INTEL.lantern);
    } else if (c.kind === 'launch') {
      d.name = 'A rocket launch plume'; d.kind = 'From what it did, not live data';
      d.why = 'In twilight, a rocket’s exhaust high up is still in sunlight and can spread into a glowing fan or jellyfish shape. Check whether anything launched that ' + (sky.sunAz < 180 ? 'morning' : 'evening') + ' on a public schedule.';
      d.links.push({ href: 'https://nextspaceflight.com/launches/past/', text: 'Recent launches on Next Spaceflight' });
    }
    return d;
  }

  /* ---------- the sky dome ---------- */
  var SVGNS = 'http://www.w3.org/2000/svg', CX = 160, CY = 160, R = 136, DOT = 9, GAP = 21;
  function xy(alt, az) { var r = R * (90 - Math.max(0, alt)) / 90; return [CX + r * Math.sin(az * DEG), CY - r * Math.cos(az * DEG)]; }
  function svgEl(tag, attrs, parent) { var n = document.createElementNS(SVGNS, tag); for (var k in attrs) n.setAttribute(k, attrs[k]); if (parent) parent.appendChild(n); return n; }
  // Place numbered markers so none overlap: a marker that would sit on another moves to the nearest
  // free spot and a thin leader line runs back to where the object really was.
  function layout(points) {
    var placed = [];
    function free(x, y) {
      if (Math.hypot(x - CX, y - CY) > R + 4) return false;
      for (var k = 0; k < placed.length; k++) if (Math.hypot(x - placed[k].x, y - placed[k].y) < GAP) return false;
      return true;
    }
    points.forEach(function (p) {
      var x = p[0], y = p[1], ok = free(x, y);
      for (var ring = GAP; !ok && ring <= GAP * 4; ring += 8) {
        var base = Math.atan2(y - CY, x - CX);
        for (var s = 0; s < 16 && !ok; s++) {
          var a = base + (s % 2 ? 1 : -1) * Math.ceil(s / 2) * Math.PI / 8;
          var nx = p[0] + ring * Math.cos(a), ny = p[1] + ring * Math.sin(a);
          if (free(nx, ny)) { x = nx; y = ny; ok = true; }
        }
      }
      placed.push({ x: x, y: y, tx: p[0], ty: p[1], moved: x !== p[0] || y !== p[1] });
    });
    return placed;
  }
  function drawDome(cands) {
    var svg = el.dome;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svgEl('circle', { cx: CX, cy: CY, r: R, class: 'dm-horizon' }, svg);
    [30, 60].forEach(function (a) { svgEl('circle', { cx: CX, cy: CY, r: R * (90 - a) / 90, class: 'dm-ring' }, svg); });
    for (var i = 0; i < 8; i++) { var p = xy(0, i * 45); svgEl('line', { x1: CX, y1: CY, x2: p[0], y2: p[1], class: 'dm-spoke' }, svg); }
    var h = radioValue('height'), band = h ? BANDS[h] : [0, 90];
    if (state.dir !== null) {
      var r1 = R * (90 - band[1]) / 90, r2 = R * (90 - band[0]) / 90, a1 = (state.dir - 22.5) * DEG, a2 = (state.dir + 22.5) * DEG;
      var pt = function (r, a) { return (CX + r * Math.sin(a)).toFixed(1) + ' ' + (CY - r * Math.cos(a)).toFixed(1); };
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
    var shown = [];
    cands.forEach(function (c, i) { if (c.alt !== undefined) shown.push({ c: c, i: i, p: xy(c.alt, c.az) }); });
    shown.forEach(function (s) {
      if (s.c.path && s.c.path.length > 1) svgEl('polyline', { points: s.c.path.map(function (p) { return xy(p.alt, p.az).map(function (v) { return v.toFixed(1); }).join(','); }).join(' '), class: 'dm-track' + (s.i === 0 ? ' is-top' : '') }, svg);
    });
    var spots = layout(shown.map(function (s) { return s.p; }));
    shown.forEach(function (s, k) {
      var m = spots[k];
      if (m.moved) {
        svgEl('line', { x1: m.tx.toFixed(1), y1: m.ty.toFixed(1), x2: m.x.toFixed(1), y2: m.y.toFixed(1), class: 'dm-leader' }, svg);
        svgEl('circle', { cx: m.tx.toFixed(1), cy: m.ty.toFixed(1), r: 2.6, class: 'dm-pin' + (s.i === 0 ? ' is-top' : '') }, svg);
      }
      svgEl('circle', { cx: m.x.toFixed(1), cy: m.y.toFixed(1), r: DOT, class: 'dm-dot' + (s.i === 0 ? ' is-top' : '') }, svg);
      var t = svgEl('text', { x: m.x.toFixed(1), y: (m.y + 3.6).toFixed(1), class: 'dm-num' + (s.i === 0 ? ' is-top' : '') }, svg);
      t.textContent = String(s.i + 1);
    });
  }
  drawDome(null);

  /* ---------- rendering ---------- */
  function mk(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function plural(n, word) { return n + ' ' + word + (n === 1 ? '' : 's'); }
  function render(q, sky, cands, info) {
    el.list.textContent = '';
    var night = sky.sunAlt > -0.8 ? 'The Sun was up' : sky.sunAlt > -6 ? 'It was twilight' : sky.sunAlt > -12 ? 'It was late twilight' : 'It was full dark';
    el.outH.textContent = cands.length ? plural(cands.length, 'candidate') + ', best match first.' : 'Nothing in the public data fits.';
    var where = q.place || (q.lat.toFixed(2) + ', ' + q.lon.toFixed(2));
    el.meta.textContent = night + ' at ' + where + ' (Sun ' + Math.abs(Math.round(sky.sunAlt)) + '° ' + (sky.sunAlt < 0 ? 'below' : 'above') + ' the horizon) at ' + clock(q.t) + ', ' + zoneName(q.zone) + ' time. ' + info.line;
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
      if (d.peak) body.appendChild(mk('p', 'sc-peak', d.peak));
      if (d.data) body.appendChild(mk('p', 'sc-data', d.data));
      if (d.links.length) {
        var ul = mk('ul', 'sc-links');
        d.links.forEach(function (l) { var a = mk('a', 'sc-link', l.text); a.href = l.href; if (/^https?:/.test(l.href)) a.rel = 'noopener'; var item = mk('li'); item.appendChild(a); ul.appendChild(item); });
        body.appendChild(ul);
      }
      li.appendChild(body);
      el.list.appendChild(li);
    });
    // Below a strong or possible match the box reads as a fallback; with nothing better than weak it
    // says plainly that the public data has no match.
    var top = cands[0], strongTop = top && conf(top.score) !== 'weak';
    el.noneH.textContent = strongTop ? 'If none of these fits' : 'No match in public data';
    el.noneP.textContent = strongTop
      ? 'If what you saw does not match anything above, it is not in the data this tool can check. That alone does not make it anything stranger. Here is what to do next.'
      : 'Nothing above is a strong fit, so it is not in the data this tool can check. That is not the same as unexplained. Here is what to do next.';
    el.none.hidden = false;
    el.actions.hidden = false;
    drawDome(cands);
  }

  /* ---------- shareable link ---------- */
  function linkFor(run, withLoc) {
    var p = new URLSearchParams();
    p.set('d', run.date); p.set('t', run.time); p.set('z', run.zone);
    if (run.dir !== null) p.set('dir', String(run.dir));
    if (run.heightRaw) p.set('h', run.heightRaw);
    if (run.whatRaw) p.set('w', run.whatRaw);
    if (withLoc) {
      p.set('lat', (+run.lat).toFixed(4)); p.set('lon', (+run.lon).toFixed(4));
      if (run.place) p.set('p', run.place);
    }
    return location.origin + location.pathname + '?' + p.toString();
  }
  function setRadio(name, v) { var r = form.querySelector('input[name="' + name + '"][value="' + v + '"]'); if (r) r.checked = true; }
  function restoreFromUrl() {
    var p;
    try { p = new URLSearchParams(location.search); } catch (e) { return false; }
    if (!p.has('d') && !p.has('t') && !p.has('lat')) return false;
    var z = p.get('z');
    if (z && canonZone(z)) setZone(z, 'user');
    if (/^\d{4}-\d{2}-\d{2}$/.test(p.get('d') || '')) el.date.value = p.get('d');
    if (/^\d{2}:\d{2}$/.test(p.get('t') || '')) el.time.value = p.get('t');
    state.timeTouched = true;
    labelZones();
    var dir = p.get('dir'), btn = dirBtns.filter(function (b) { return b.getAttribute('data-az') === (dir === null ? '' : dir); })[0];
    if (btn) pickDir(btn, false);
    if (/^(low|half|over|unsure)$/.test(p.get('h') || '')) setRadio('height', p.get('h'));
    if (/^(moving|blinking|line|still|streak|hover)$/.test(p.get('w') || '')) setRadio('what', p.get('w'));
    var lat = parseFloat(p.get('lat')), lon = parseFloat(p.get('lon'));
    if (isFinite(lat) && isFinite(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180) {
      el.lat.value = lat; el.lon.value = lon;
      var place = findPlace(p.get('p'));
      if (place && Math.abs(place.lat - lat) < 0.01 && Math.abs(place.lon - lon) < 0.01) { el.place.value = place.name; state.place = place.name; }
      if (el.withLoc) el.withLoc.checked = true;
      el.geoStatus.textContent = 'Place taken from the link you opened. It stays on this device.';
      return true;
    }
    el.geoStatus.textContent = 'The link you opened did not include a place. Add yours, then press Identify it.';
    return false;
  }
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text);
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta);
      if (ok) resolve(); else reject(new Error('copy'));
    });
  }
  function say(t) { el.shareStatus.textContent = ''; setTimeout(function () { el.shareStatus.textContent = t; }, 30); }
  el.copy.addEventListener('click', function () {
    if (!state.last) return;
    var withLoc = !!(el.withLoc && el.withLoc.checked), url = linkFor(state.last, withLoc);
    el.shareUrl.value = url;
    copyText(url).then(function () {
      el.shareUrl.hidden = true;
      say(withLoc ? 'Link copied. It includes your location.' : 'Link copied. It leaves out your location, so whoever opens it adds their own place.');
    }, function () {
      el.shareUrl.hidden = false;
      el.shareUrl.focus(); el.shareUrl.select();
      say('Copy was blocked by this browser. The link is selected in the box below: copy it from there.');
    });
  });
  if (el.print) el.print.addEventListener('click', function () { window.print(); });

  /* ---------- hand-off to the report builder ---------- */
  var DIR_WORDS = ['North', 'Northeast', 'East', 'Southeast', 'South', 'Southwest', 'West', 'Northwest'];
  el.log.addEventListener('click', function () {
    if (!state.last) return;
    var run = state.last;
    try {
      sessionStorage.setItem(HANDOFF_KEY, JSON.stringify({
        v: 1, at: Date.now(), date: run.date, time: run.time, zone: run.zone,
        dir: run.dir === null ? null : DIR_WORDS[Math.round(run.dir / 45) % 8],
        height: run.heightRaw || null, what: run.whatRaw || null, whatWords: run.whatRaw ? WHAT_WORDS[run.whatRaw] : null,
        heightWords: run.heightRaw ? HEIGHT_WORDS[run.heightRaw] || null : null,
        place: run.place, lat: run.lat, lon: run.lon,
        top: run.top, checked: { satellites: run.checkedSats, planets: run.checkedPlanets }
      }));
    } catch (e) { /* storage blocked: the report opens empty, which is still a report */ }
  });

  /* ---------- run ---------- */
  function reduceMotion() { return (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) || document.documentElement.classList.contains('motion-off'); }
  function showResults() {
    el.outH.focus({ preventScroll: true });
    // On a phone the readout sits under the form: bring the heading and the list into view first,
    // just under the fixed nav.
    var r = el.outH.getBoundingClientRect(), nav = document.querySelector('.dx-nav');
    var off = (nav ? nav.getBoundingClientRect().bottom : 0) + 12;
    var stacked = window.matchMedia && window.matchMedia('(max-width: 1020px)').matches;
    if (stacked ? Math.abs(r.top - off) > 8 : r.top < off || r.bottom > window.innerHeight) {
      var y = Math.max(0, window.pageYOffset + r.top - off);
      try { window.scrollTo({ top: y, behavior: reduceMotion() ? 'auto' : 'smooth' }); } catch (e) { window.scrollTo(0, y); }
    }
  }
  function identify(q) {
    el.submit.disabled = true;
    var label = el.submit.querySelector('.t');
    label.textContent = 'Checking the sky';
    el.live.textContent = 'Checking the sky for that time and place.';
    return loadLibs().then(function () { return loadSats(); }).then(function (data) {
      var sky = skyNow(q), info = { satWeight: 1, line: '' }, sats = null;
      var satNote;
      if (!data.doc || !data.recs.length) {
        satNote = 'Satellites were not checked: the satellite data could not be loaded. Press Identify it again to retry.';
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
      testHook.last = cands.map(function (c) { return { kind: c.kind, name: describe(c, q, sky).name, score: +c.score.toFixed(3), alt: c.alt, az: c.az, mag: c.mag, dt: c.dt, peak: c.peak || null, n: c.train ? c.train.n : undefined, group: c.train ? c.train.group : undefined }; });
      testHook.sunAlt = sky.sunAlt;
      state.last = {
        date: q.date, time: q.time, zone: q.zone, dir: q.dir, heightRaw: q.heightRaw, whatRaw: radioRaw('what'),
        lat: q.lat, lon: q.lon, place: q.place, checkedSats: !!sats, checkedPlanets: true,
        top: cands.slice(0, 3).map(function (c) { var d = describe(c, q, sky); return { name: d.name, match: conf(c.score), kind: d.kind }; })
      };
      try { history.replaceState(null, '', linkFor(state.last, false)); } catch (e) {}
      var top = cands[0];
      el.live.textContent = cands.length
        ? plural(cands.length, 'candidate') + '. Best match: ' + describe(top, q, sky).name + ', ' + conf(top.score) + ' match.'
        : 'Nothing in the public data fits. Next steps are listed.';
      showResults();
    }).catch(function () {
      el.err.textContent = 'The sky data could not be loaded. Check the connection and press Identify again.';
      el.live.textContent = el.err.textContent;
    }).then(function () {
      el.submit.disabled = false;
      label.textContent = 'Identify it';
    });
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    el.err.textContent = '';
    var q = readForm();
    if (q.bad) {
      el.err.textContent = 'Check the highlighted ' + (q.bad.length === 1 ? 'field' : 'fields') + ' and press Identify again.';
      q.bad[0].focus();
      return;
    }
    identify(q);
  });

  /* test hook: read-only, for the verification scripts */
  var testHook = window.DXSky = { last: null, sunAlt: null };

  if (restoreFromUrl()) {
    var q0 = readForm();
    if (!q0.bad) identify(q0);
  }
})();
