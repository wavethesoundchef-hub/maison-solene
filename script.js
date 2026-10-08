(function () {
  'use strict';

  // Sample salon WhatsApp number: 08105336424 -> international format (Nigeria, +234)
  var WA_NUMBER = '2348105336424';

  // All prices (₦) and durations are sample details, easy to customise here.
  var MENU = [
    { id: 'hair', name: 'Hair', blurb: 'Cut, colour and care for every texture, from silk press to locs and braids.', art: '1522337360788-8b13dee7a37e', items: [
      ['Cut & finish', 'Consultation, wash, precision cut and blow-dry.', 18000, '60 min'],
      ['Colour', 'Gloss, root touch-up, balayage or full colour.', 35000, '2–3 hrs'],
      ['Silk press', 'Smooth, bouncy, heat-protected finish.', 25000, '90 min'],
      ['Loc care', 'Retwist, maintenance and scalp care.', 20000, '90 min'],
      ['Braids', 'Knotless, cornrows and protective styles.', 30000, '3–5 hrs'],
      ['Treatments', 'Deep conditioning, protein and scalp rituals.', 15000, '45 min'],
      ['Occasion styling', 'Updos and styles for events.', 28000, '75 min']
    ]},
    { id: 'skin', name: 'Skin', blurb: 'Facials shaped around your skin on the day, never a fixed routine.', art: '1540555700478-4be289fbecef', items: [
      ['Custom facial', 'Skin analysis and a treatment built around it.', 30000, '75 min'],
      ['Deep cleansing', 'Extraction, steam and a calming mask.', 25000, '60 min'],
      ['Hydration facial', 'Layered moisture for dull or tight skin.', 28000, '60 min'],
      ['Peels', 'Gentle resurfacing for tone and texture.', 35000, '45 min']
    ]},
    { id: 'nails', name: 'Nails', blurb: 'Clean, long-wearing nails and hands that feel cared for.', art: '1604654894610-df63bc536371', items: [
      ['Manicure', 'Shape, cuticle care, polish.', 10000, '45 min'],
      ['Pedicure', 'Soak, scrub, massage, polish.', 14000, '60 min'],
      ['Gel', 'Chip-resistant colour that lasts weeks.', 15000, '60 min'],
      ['Extensions', 'Sculpted length in your chosen shape.', 25000, '2 hrs'],
      ['Nail art', 'Hand-painted detail, priced per set.', 8000, '+30 min'],
      ['Hand care', 'Paraffin and massage ritual.', 9000, '30 min']
    ]},
    { id: 'body', name: 'Body', blurb: 'Slow, grounding treatments that reset the body.', art: '1544161515-4ab6ce6db874', items: [
      ['Massage', 'Swedish, deep tissue or aromatherapy.', 28000, '60 min'],
      ['Body polish', 'Exfoliation and a nourishing oil finish.', 30000, '60 min'],
      ['Body wrap', 'Mineral or hydrating wrap.', 35000, '75 min'],
      ['Waxing', 'Face and body, priced by area.', 6000, 'from 15 min']
    ]},
    { id: 'smile', name: 'Smile', blurb: 'Brightening treatments, with a shade guide so results stay natural.', art: '1600948836101-f9ffda59d250', items: [
      ['Teeth whitening', 'In-chair whitening, up to several shades brighter.', 45000, '60 min'],
      ['Teeth brightening', 'Gentle stain-lifting top-up treatment.', 25000, '40 min']
    ]},
    { id: 'brows', name: 'Brows & lashes', blurb: 'Frame the eyes with subtle, tailored detail.', art: '1487412947147-5cebf100ffc2', items: [
      ['Brow shaping', 'Mapped, waxed or threaded.', 7000, '30 min'],
      ['Brow & lash tint', 'Softly deepened colour.', 8000, '30 min'],
      ['Lash lift', 'Curled, lifted natural lashes.', 20000, '60 min'],
      ['Lash extensions', 'Classic, hybrid or volume sets.', 30000, '2 hrs']
    ]},
    { id: 'makeup', name: 'Makeup', blurb: 'Skin-first makeup that photographs well and feels like you.', art: '1596462502278-27bfdc403348', items: [
      ['Soft glam', 'Polished, skin-like finish.', 25000, '60 min'],
      ['Event makeup', 'Full look for parties and shoots.', 35000, '75 min'],
      ['Makeup lesson', 'One-to-one, take home your routine.', 40000, '90 min']
    ]},
    { id: 'bridal', name: 'Bridal', blurb: 'Consultations, trials and packages planned around your day.', art: '1522335789203-aabd1fc54bc9', items: [
      ['Bridal consultation', 'Plan the look, timeline and team.', 0, '30 min · complimentary'],
      ['Bridal trial', 'Hair and makeup rehearsal.', 60000, '2.5 hrs'],
      ['Bridal day package', 'Hair, makeup and touch-up kit.', 150000, 'Half day'],
      ['Bridal party package', 'Priced per person, on request.', 45000, 'Per person']
    ]}
  ];

  function naira(n) {
    return n === 0 ? 'Free' : '₦' + n.toLocaleString('en-NG');
  }

  // ----- Service menu (tabs)
  var tablist = document.getElementById('tablist');
  var panel = document.getElementById('tabpanel');
  var select = document.getElementById('service');
  var active = 0;

  MENU.forEach(function (cat, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'tab';
    b.id = 'tab-' + cat.id;
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-controls', 'tabpanel');
    b.textContent = cat.name;
    b.addEventListener('click', function () { show(i); });
    b.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (e.key === 'Home') d = -i;
      if (e.key === 'End') d = MENU.length - 1 - i;
      if (!d) return;
      e.preventDefault();
      var n = (i + d + MENU.length) % MENU.length;
      show(n);
      tablist.children[n].focus();
    });
    tablist.appendChild(b);

    var g = document.createElement('optgroup');
    g.label = cat.name;
    cat.items.forEach(function (it) {
      var o = document.createElement('option');
      o.value = it[0] + ' (' + cat.name + ')';
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

  function show(i) {
    active = i;
    var cat = MENU[i];
    Array.prototype.forEach.call(tablist.children, function (t, j) {
      t.setAttribute('aria-selected', j === i ? 'true' : 'false');
      t.tabIndex = j === i ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', 'tab-' + cat.id);
    panel.innerHTML = '';

    var intro = document.createElement('div');
    intro.className = 'panel-intro';
    intro.innerHTML = '<h3></h3><p></p><figure class="panel-art"><img width="700" height="930" loading="lazy" alt=""><figcaption>Sample imagery</figcaption></figure>';
    intro.querySelector('h3').textContent = cat.name;
    intro.querySelector('p').textContent = cat.blurb;
    var img = intro.querySelector('.panel-art img');
    img.src = 'https://images.unsplash.com/photo-' + cat.art + '?auto=format&fit=crop&w=700&q=80';
    img.alt = cat.name + ' (sample image)';

    var ul = document.createElement('ul');
    ul.className = 'svc-list';
    cat.items.forEach(function (it) {
      var li = document.createElement('li');
      li.className = 'svc';
      li.innerHTML = '<span class="svc-name"></span><span class="svc-meta"><b></b><span></span></span><button type="button" class="svc-req">Request</button><p class="svc-desc"></p>';
      li.querySelector('.svc-name').textContent = it[0];
      li.querySelector('.svc-desc').textContent = it[1];
      li.querySelector('b').textContent = (it[2] ? (/^\+|from/.test(it[3]) ? 'from ' : '') : '') + naira(it[2]);
      li.querySelector('.svc-meta span').textContent = it[3];
      var btn = li.querySelector('.svc-req');
      btn.setAttribute('aria-label', 'Request ' + it[0]);
      btn.addEventListener('click', function () { preselect(it[0] + ' (' + cat.name + ')'); });
      ul.appendChild(li);
    });
    panel.appendChild(intro);
    panel.appendChild(ul);
    panel.classList.remove('swap');
    void panel.offsetWidth;
    panel.classList.add('swap');
  }
  show(0);

  function preselect(value) {
    select.value = value;
    clearError(select);
    document.getElementById('enquire').scrollIntoView({ behavior: 'smooth' });
    setTimeout(function () { document.getElementById('name').focus({ preventScroll: true }); }, 500);
  }
  document.querySelectorAll('[data-request]').forEach(function (b) {
    b.addEventListener('click', function () { preselect(b.getAttribute('data-request')); });
  });

  // ----- Mobile nav
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('nav');
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); toggle.focus();
    }
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

  // ----- Motion
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var header = document.querySelector('.site-header');
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (!reduce && 'IntersectionObserver' in window) {
    var groups = [
      '.approach .wrap > div', '.pillars li', '.section-head', '.tabs', '.tab-panel',
      '.fv-art', '.fv-copy', '.quotes figure', '.articles article',
      '.enquire-grid > *', '.visit-grid > div', '.testimonials h2, .testimonials .eyebrow, .testimonials .sample-tag',
      '.visit h2, .visit .eyebrow, .visit .sample-tag'
    ];
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    groups.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el, i) {
        el.classList.add('reveal');
        el.style.setProperty('--d', (i % 4) * 90 + 'ms');
        io.observe(el);
      });
    });

    // gentle parallax on the hero photo
    var heroImg = document.querySelector('.hero-art img');
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = Math.min(window.scrollY, 700);
        heroImg.style.translate = '0 ' + (y * 0.06) + 'px';
        ticking = false;
      });
    }, { passive: true });
  }
})();
