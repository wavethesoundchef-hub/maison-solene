(function () {
  'use strict';

  // Sample salon WhatsApp number: 08105336424 -> international format (Nigeria, +234)
  var WA_NUMBER = '2348105336424';
  var IMG = function (id, w) { return 'https://images.unsplash.com/photo-' + id + '?auto=format&fit=crop&w=' + w + '&q=80'; };

  // All prices (₦) and durations are sample details, easy to customise here.
  var MENU = [
    { id: 'hair', name: 'hair', blurb: 'Cut, colour and care for every texture, from silk press to locs and braids.', art: '1522337360788-8b13dee7a37e', items: [
      ['Cut & finish', 'Consultation, wash, precision cut and blow-dry.', 18000, '60 min'],
      ['Colour', 'Gloss, root touch-up, balayage or full colour.', 35000, '2–3 hrs'],
      ['Silk press', 'Smooth, bouncy, heat-protected finish.', 25000, '90 min'],
      ['Loc care', 'Retwist, maintenance and scalp care.', 20000, '90 min'],
      ['Braids', 'Knotless, cornrows and protective styles.', 30000, '3–5 hrs'],
      ['Treatments', 'Deep conditioning, protein and scalp rituals.', 15000, '45 min'],
      ['Occasion styling', 'Updos and styles for events.', 28000, '75 min']
    ]},
    { id: 'skin', name: 'skin', blurb: 'Facials shaped around your skin on the day, never a fixed routine.', art: '1540555700478-4be289fbecef', items: [
      ['Custom facial', 'Skin analysis and a treatment built around it.', 30000, '75 min'],
      ['Deep cleansing', 'Extraction, steam and a calming mask.', 25000, '60 min'],
      ['Hydration facial', 'Layered moisture for dull or tight skin.', 28000, '60 min'],
      ['Peels', 'Gentle resurfacing for tone and texture.', 35000, '45 min']
    ]},
    { id: 'nails', name: 'nails', blurb: 'Clean, long-wearing nails and hands that feel cared for.', art: '1604654894610-df63bc536371', items: [
      ['Manicure', 'Shape, cuticle care, polish.', 10000, '45 min'],
      ['Pedicure', 'Soak, scrub, massage, polish.', 14000, '60 min'],
      ['Gel', 'Chip-resistant colour that lasts weeks.', 15000, '60 min'],
      ['Extensions', 'Sculpted length in your chosen shape.', 25000, '2 hrs'],
      ['Nail art', 'Hand-painted detail, priced per set.', 8000, '+30 min'],
      ['Hand care', 'Paraffin and massage ritual.', 9000, '30 min']
    ]},
    { id: 'body', name: 'body', blurb: 'Slow, grounding treatments that reset the body.', art: '1544161515-4ab6ce6db874', items: [
      ['Massage', 'Swedish, deep tissue or aromatherapy.', 28000, '60 min'],
      ['Body polish', 'Exfoliation and a nourishing oil finish.', 30000, '60 min'],
      ['Body wrap', 'Mineral or hydrating wrap.', 35000, '75 min'],
      ['Waxing', 'Face and body, priced by area.', 6000, 'from 15 min']
    ]},
    { id: 'smile', name: 'smile', blurb: 'Brightening treatments, with a shade guide so results stay natural.', art: '1600948836101-f9ffda59d250', items: [
      ['Teeth whitening', 'In-chair whitening, up to several shades brighter.', 45000, '60 min'],
      ['Teeth brightening', 'Gentle stain-lifting top-up treatment.', 25000, '40 min']
    ]},
    { id: 'brows', name: 'brows & lashes', blurb: 'Frame the eyes with subtle, tailored detail.', art: '1487412947147-5cebf100ffc2', items: [
      ['Brow shaping', 'Mapped, waxed or threaded.', 7000, '30 min'],
      ['Brow & lash tint', 'Softly deepened colour.', 8000, '30 min'],
      ['Lash lift', 'Curled, lifted natural lashes.', 20000, '60 min'],
      ['Lash extensions', 'Classic, hybrid or volume sets.', 30000, '2 hrs']
    ]},
    { id: 'makeup', name: 'makeup', blurb: 'Skin-first makeup that photographs well and feels like you.', art: '1596462502278-27bfdc403348', items: [
      ['Soft glam', 'Polished, skin-like finish.', 25000, '60 min'],
      ['Event makeup', 'Full look for parties and shoots.', 35000, '75 min'],
      ['Makeup lesson', 'One-to-one, take home your routine.', 40000, '90 min']
    ]},
    { id: 'bridal', name: 'bridal', blurb: 'Consultations, trials and packages planned around your day.', art: '1522335789203-aabd1fc54bc9', items: [
      ['Bridal consultation', 'Plan the look, timeline and team.', 0, '30 min · complimentary'],
      ['Bridal trial', 'Hair and makeup rehearsal.', 60000, '2.5 hrs'],
      ['Bridal day package', 'Hair, makeup and touch-up kit.', 150000, 'Half day'],
      ['Bridal party package', 'Priced per person, on request.', 45000, 'Per person']
    ]}
  ];
  window.MS_MENU = MENU.map(function (c) { return { id: c.id, art: IMG(c.art, 600) }; });

  function naira(n) { return n === 0 ? 'Free' : '₦' + n.toLocaleString('en-NG'); }
  function label(cat) { return cat.name.replace(/\b\w/, function (c) { return c.toUpperCase(); }); }

  // ----- Service menu (accordion)
  var menu = document.getElementById('menu');
  var select = document.getElementById('service');

  MENU.forEach(function (cat) {
    var li = document.createElement('li');
    li.className = 'cat';
    li.dataset.cat = cat.id;
    li.innerHTML =
      '<h3><button type="button" class="cat-btn" aria-expanded="false"><span class="cat-name"></span><span class="cat-plus"><span>view services</span><i aria-hidden="true">+</i></span></button></h3>' +
      '<div class="cat-panel" role="region"><div><div class="cat-inner"><div><p class="blurb"></p><img class="cat-thumb" alt="" loading="lazy" width="150" height="188"></div><ul class="svc-list"></ul></div></div></div>';
    var btn = li.querySelector('.cat-btn');
    var panel = li.querySelector('.cat-panel');
    var pid = 'panel-' + cat.id;
    panel.id = pid;
    btn.setAttribute('aria-controls', pid);
    li.querySelector('.cat-name').textContent = cat.name;
    li.querySelector('.blurb').textContent = cat.blurb;
    var th = li.querySelector('.cat-thumb');
    th.src = IMG(cat.art, 300);
    th.alt = cat.name + ' (sample image)';

    var ul = li.querySelector('.svc-list');
    cat.items.forEach(function (it) {
      var row = document.createElement('li');
      row.className = 'svc';
      row.innerHTML = '<span class="svc-name"></span><span class="svc-meta"><b></b><span></span></span><button type="button" class="svc-req">Request</button><p class="svc-desc"></p>';
      row.querySelector('.svc-name').textContent = it[0];
      row.querySelector('.svc-desc').textContent = it[1];
      row.querySelector('b').textContent = (it[2] && /^\+|from/.test(it[3]) ? 'from ' : '') + naira(it[2]);
      row.querySelector('.svc-meta span').textContent = it[3];
      var rb = row.querySelector('.svc-req');
      rb.setAttribute('aria-label', 'Request ' + it[0]);
      rb.addEventListener('click', function () { preselect(it[0] + ' (' + label(cat) + ')'); });
      ul.appendChild(row);
    });

    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      // one open at a time
      menu.querySelectorAll('.cat-btn[aria-expanded="true"]').forEach(function (b) {
        if (b !== btn) { b.setAttribute('aria-expanded', 'false'); b.closest('.cat').querySelector('.cat-panel').classList.remove('open'); }
      });
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
      panel.classList.toggle('open', !open);
    });
    panel.addEventListener('transitionend', function (e) {
      if (e.propertyName === 'grid-template-rows') document.dispatchEvent(new Event('ms:layout'));
    });
    menu.appendChild(li);

    var g = document.createElement('optgroup');
    g.label = label(cat);
    cat.items.forEach(function (it) {
      var o = document.createElement('option');
      o.value = it[0] + ' (' + label(cat) + ')';
      o.textContent = it[0];
      g.appendChild(o);
    });
    select.appendChild(g);
  });
  ['Solène Introduction (first-visit package)', 'Not sure yet — advise me'].forEach(function (t) {
    var o = document.createElement('option');
    o.value = t; o.textContent = t;
    select.appendChild(o);
  });

  function preselect(value) {
    select.value = value;
    clearError(select);
    document.dispatchEvent(new CustomEvent('ms:goto', { detail: '#enquire' }));
    setTimeout(function () { document.getElementById('name').focus({ preventScroll: true }); }, 900);
  }
  document.querySelectorAll('[data-request]').forEach(function (b) {
    b.addEventListener('click', function () { preselect(b.getAttribute('data-request')); });
  });

  // ----- Mobile nav
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('nav');
  var bar = document.querySelector('.bar');
  function setNav(open) {
    nav.classList.toggle('open', open);
    bar.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.textContent = open ? 'close' : 'menu';
    document.documentElement.classList.toggle('nav-open', open);
    document.dispatchEvent(new CustomEvent('ms:nav', { detail: open }));
  }
  document.addEventListener('ms:closenav', function () { setNav(false); });
  toggle.addEventListener('click', function () { setNav(!nav.classList.contains('open')); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setNav(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('open')) { setNav(false); toggle.focus(); }
  });

  // ----- Enquiry form
  var form = document.getElementById('enquiry');
  var dateEl = document.getElementById('date');
  var fallback = document.getElementById('fallback');
  var fbMsg = document.getElementById('fallback-msg');
  var retry = document.getElementById('retry');
  var copied = document.getElementById('copied');
  var lastMessage = '';

  function iso(d) {
    var m = String(d.getMonth() + 1).padStart(2, '0'), day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + day;
  }
  dateEl.min = iso(new Date());

  function setError(el, msg) {
    el.setAttribute('aria-invalid', 'true');
    document.getElementById(el.id + '-err').textContent = msg;
  }
  function clearError(el) {
    el.removeAttribute('aria-invalid');
    var e = document.getElementById(el.id + '-err');
    if (e) e.textContent = '';
  }
  ['service', 'name', 'date', 'time'].forEach(function (id) {
    var el = document.getElementById(id);
    el.addEventListener('input', function () { clearError(el); });
    el.addEventListener('change', function () { clearError(el); });
  });

  function prettyDate(v) {
    var p = v.split('-');
    return new Date(+p[0], +p[1] - 1, +p[2]).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }
  function prettyTime(v) {
    var p = v.split(':'), h = +p[0];
    return ((h + 11) % 12 + 1) + ':' + p[1] + ' ' + (h >= 12 ? 'pm' : 'am');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = {
      service: document.getElementById('service'),
      name: document.getElementById('name'),
      date: dateEl,
      time: document.getElementById('time')
    };
    var first = null;
    function fail(el, msg) { setError(el, msg); if (!first) first = el; }

    if (!f.service.value) fail(f.service, 'Choose a service.');
    if (!f.name.value.trim()) fail(f.name, 'Enter your name.');
    if (!f.date.value) fail(f.date, 'Choose a preferred date.');
    else if (f.date.value < iso(new Date())) fail(f.date, 'Choose today or a future date.');
    if (!f.time.value) fail(f.time, 'Choose a preferred time.');
    if (first) { first.focus(); return; }

    var notes = document.getElementById('notes').value.trim();
    var msg = [
      'Hello Maison Solène, I would like to request an appointment.',
      '',
      'Service: ' + f.service.value,
      'Name: ' + f.name.value.trim(),
      'Preferred date: ' + prettyDate(f.date.value),
      'Preferred time: ' + prettyTime(f.time.value),
      'Notes: ' + (notes || 'None'),
      '',
      'Please confirm availability here on WhatsApp. Thank you.'
    ].join('\n');
    lastMessage = msg;

    var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);
    retry.href = url;

    var win = null;
    // No "noopener" feature here: it makes window.open return null, which would hide a blocked popup.
    try { win = window.open(url, '_blank'); if (win) win.opener = null; } catch (err) { win = null; }

    fallback.hidden = false;
    copied.textContent = '';
    if (!win) {
      fbMsg.textContent = 'We couldn’t open WhatsApp automatically. Your request has not been sent. Tap “Try WhatsApp again”, or message the salon yourself on the number below and paste your details.';
    } else {
      fbMsg.textContent = 'WhatsApp should now be open with your message ready. Press send there. This is a request only; the salon must confirm your appointment in WhatsApp. Nothing opened? Use the number below.';
    }
    document.dispatchEvent(new Event('ms:layout'));
    fallback.focus();
  });

  document.getElementById('copy-msg').addEventListener('click', function () {
    function done(ok) { copied.textContent = ok ? 'Message copied. Paste it into WhatsApp.' : 'Copy failed. Select your details manually.'; }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(lastMessage).then(function () { done(true); }, function () { done(false); });
    } else {
      done(false);
    }
  });

  // ----- Guest book filter
  var chips = document.querySelectorAll('.chip');
  var reviews = document.querySelectorAll('.review');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var f = chip.getAttribute('data-filter');
      chips.forEach(function (c) { c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'); });
      reviews.forEach(function (r) {
        var show = f === 'all' || r.getAttribute('data-cat') === f;
        r.hidden = !show;
        if (show) { r.style.opacity = ''; r.style.transform = ''; }
      });
      document.dispatchEvent(new CustomEvent('ms:filtered'));
      document.dispatchEvent(new Event('ms:layout'));
    });
  });
})();
