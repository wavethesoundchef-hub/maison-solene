/* Motion layer: Lenis smooth scroll, GSAP + ScrollTrigger, and a WebGL gradient background.
   Everything degrades: no WebGL -> CSS gradient, reduced motion -> static, no libs -> native scroll. */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canAnimate = !reduce && window.gsap && window.ScrollTrigger;
  var fine = window.matchMedia('(hover: hover) and (min-width: 901px)').matches;

  /* ---------- WebGL background ---------- */
  var canvas = document.getElementById('gl');
  var gl = null, prog, U = {};
  var state = { dark: 0, darkTarget: 0, mx: .5, my: .5, tx: .5, ty: .5 };

  function initGL() {
    try { gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' }); } catch (e) { gl = null; }
    if (!gl) return;
    var vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    var fs = [
      'precision mediump float;',
      'uniform vec2 uRes,uM;uniform float uT,uDark,uScroll;',
      'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}',
      'void main(){',
      ' vec2 uv=gl_FragCoord.xy/uRes;float a=uRes.x/uRes.y;',
      ' vec2 p=(uv-.5)*vec2(a,1.);float t=uT*.12;',
      ' p+=.18*vec2(sin(p.y*2.3+t*3.),cos(p.x*2.1+t*2.6));',
      ' vec2 s=vec2(0.,uScroll*.35);',
      ' float b1=exp(-pow(length(p-vec2(sin(t*1.3)*.36*a,cos(t*1.1)*.35)-s*.4),2.)*2.2);',
      ' float b2=exp(-pow(length(p-vec2(cos(t*.9+2.)*.35*a,sin(t*1.2+1.)*.4)+s*.3),2.)*2.8);',
      ' float b3=exp(-pow(length(p-vec2(sin(t*.7+4.)*.3*a,cos(t*.8+3.)*.45)),2.)*3.4);',
      ' vec2 m=(uM-.5)*vec2(a,1.);float g=exp(-pow(length(p-m),2.)*7.);',
      ' vec3 base=mix(vec3(.957,.925,.886),vec3(.115,.047,.105),uDark);',
      ' vec3 A=mix(vec3(.89,.70,.73),vec3(.27,.125,.24),uDark);',
      ' vec3 B=mix(vec3(.97,.87,.84),vec3(.44,.19,.38),uDark);',
      ' vec3 C=mix(vec3(.80,.62,.72),vec3(.79,.54,.59),uDark);',
      ' vec3 G=mix(vec3(1.,.98,.95),vec3(.85,.5,.6),uDark);',
      ' vec3 col=base;col=mix(col,A,b1*.6);col=mix(col,B,b2*.55);col=mix(col,C,b3*(.32+.2*uDark));',
      ' col=mix(col,G,g*mix(.38,.3,uDark));',
      ' col+=(h(gl_FragCoord.xy+fract(uT))-.5)*.025;',
      ' gl_FragColor=vec4(col,1.);}'
    ].join('\n');
    function sh(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null; }
    var v = sh(gl.VERTEX_SHADER, vs), f = sh(gl.FRAGMENT_SHADER, fs);
    if (!v || !f) { gl = null; return; }
    prog = gl.createProgram();
    gl.attachShader(prog, v); gl.attachShader(prog, f); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { gl = null; return; }
    gl.useProgram(prog);
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    ['uRes', 'uM', 'uT', 'uDark', 'uScroll'].forEach(function (n) { U[n] = gl.getUniformLocation(prog, n); });
    resize();
    window.addEventListener('resize', function () { resize(); draw(performance.now() / 1000); });
    canvas.style.background = 'none';
  }
  function resize() {
    if (!gl) return;
    var k = Math.min(window.devicePixelRatio || 1, 1) * 0.5; // soft gradients: render at half resolution
    canvas.width = Math.max(2, Math.round(window.innerWidth * k));
    canvas.height = Math.max(2, Math.round(window.innerHeight * k));
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  function draw(time) {
    if (!gl) return;
    gl.uniform2f(U.uRes, canvas.width, canvas.height);
    gl.uniform2f(U.uM, state.mx, 1 - state.my);
    gl.uniform1f(U.uT, time);
    gl.uniform1f(U.uDark, state.dark);
    gl.uniform1f(U.uScroll, window.scrollY / window.innerHeight);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  window.addEventListener('pointermove', function (e) {
    state.tx = e.clientX / window.innerWidth; state.ty = e.clientY / window.innerHeight;
  }, { passive: true });

  function setTheme(name) {
    var dark = name === 'dark';
    document.body.classList.toggle('is-dark', dark);
    state.darkTarget = dark ? 1 : 0;
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute('content', dark ? '#1e0c1c' : '#f4ece2');
    if (reduce) { state.dark = state.darkTarget; draw(0); }
  }

  initGL();

  if (!canAnimate) {
    // Static, accessible fallback: one frame of the gradient, native scroll, instant theme switches.
    if (gl) draw(3);
    var f0 = document.querySelector('.fab'); if (f0) f0.classList.add('on');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) setTheme(e.target.dataset.theme); });
      }, { rootMargin: '-50% 0px -50% 0px' });
      document.querySelectorAll('[data-theme]').forEach(function (s) { io.observe(s); });
    }
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var t = a.getAttribute('href') === '#top' ? document.body : document.querySelector(a.getAttribute('href'));
        if (t) { e.preventDefault(); t.scrollIntoView(); }
      });
    });
    document.addEventListener('ms:goto', function (e) { document.querySelector(e.detail).scrollIntoView(); });
    return;
  }

  /* ---------- Smooth scroll ---------- */
  gsap.registerPlugin(ScrollTrigger);
  var lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }
  function goTo(sel) {
    var t = sel === '#top' ? 0 : document.querySelector(sel);
    if (!t && t !== 0) return;
    if (lenis) lenis.scrollTo(t, { force: true, duration: 1.6, easing: function (x) { return 1 - Math.pow(1 - x, 4); } });
    else window.scrollTo({ top: t === 0 ? 0 : t.getBoundingClientRect().top + window.scrollY, behavior: 'smooth' });
  }
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var href = a.getAttribute('href');
      if (document.documentElement.classList.contains('nav-open')) {
        // close the phone menu first so scrolling is unlocked, then glide
        document.dispatchEvent(new Event('ms:closenav'));
        setTimeout(function () { goTo(href); }, 150);
      } else goTo(href);
    });
  });
  document.addEventListener('ms:goto', function (e) { goTo(e.detail); });
  var refreshT;
  document.addEventListener('ms:layout', function () { clearTimeout(refreshT); refreshT = setTimeout(function () { ScrollTrigger.refresh(); }, 60); });

  /* ---------- Render loop (background) ---------- */
  gsap.ticker.add(function (time) {
    state.mx += (state.tx - state.mx) * 0.05;
    state.my += (state.ty - state.my) * 0.05;
    state.dark += (state.darkTarget - state.dark) * 0.045;
    draw(time);
  });

  /* ---------- Theme per section ---------- */
  document.querySelectorAll('[data-theme]').forEach(function (sec) {
    ScrollTrigger.create({
      trigger: sec, start: 'top 50%', end: 'bottom 50%',
      onToggle: function (self) { if (self.isActive) setTheme(sec.dataset.theme); }
    });
  });

  /* ---------- Header hides on scroll down ---------- */
  var bar = document.querySelector('.bar');
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: function (self) {
      var open = bar.classList.contains('menu-open');
      bar.classList.toggle('hide', !open && self.direction === 1 && self.scroll() > 240);
      if (self.direction === -1 || self.scroll() < 240) bar.classList.remove('hide');
    }
  });

  /* ---------- Mobile floating CTA + menu scroll lock ---------- */
  var fab = document.querySelector('.fab');
  if (fab) {
    ScrollTrigger.create({
      trigger: '.hero', start: 'bottom 60%', endTrigger: '#enquire', end: 'top 85%',
      onToggle: function (self) { fab.classList.toggle('on', self.isActive); }
    });
    ScrollTrigger.create({
      trigger: '#enquire', start: 'top 85%', end: 'bottom top',
      onToggle: function (self) { fab.classList.toggle('off', self.isActive); }
    });
  }
  document.addEventListener('ms:nav', function (e) {
    if (!lenis) return;
    if (e.detail) lenis.stop(); else lenis.start();
  });

  /* ---------- Text splitting ---------- */
  function split(el, chars) {
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          (chars ? n.textContent.split('') : n.textContent.split(/(\s+)/)).forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
            var w = document.createElement('span'); w.className = 'w';
            var wi = document.createElement('span'); wi.className = 'wi'; wi.textContent = p;
            w.appendChild(wi); frag.appendChild(w);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
      });
    })(el);
    return el.querySelectorAll('.wi');
  }

  function run() {
    /* Hero: the brand name, letter by letter */
    var heroLines = document.querySelectorAll('.hl');
    var heroChars = [];
    heroLines.forEach(function (l) { heroChars = heroChars.concat(Array.prototype.slice.call(split(l, true))); });
    gsap.set(heroChars, { yPercent: 115 });
    heroLines.forEach(function (l) { l.classList.add('is-split'); });
    var barItems = ['.bar > .brand', '.bar > .nav-toggle'];
    if (window.innerWidth > 900) barItems.push('.bar > .nav'); // on phones the nav is a full-screen overlay: never touch its opacity
    var heroRest = ['.hero-kicker', '.tagline', '.hero-side', '.demo-note', '.scroll-cue'];
    gsap.set(heroRest.concat(barItems), { opacity: 0 });
    gsap.set(['.tagline', '.hero-side'], { y: 30 });
    gsap.set(barItems, { y: -24 });

    function playHero() {
      var tl = gsap.timeline();
      tl.to(heroChars, { yPercent: 0, duration: 1.5, ease: 'expo.out', stagger: 0.07 })
        .to('.hero-kicker', { opacity: 1, duration: 1 }, '-=1.2')
        .to(['.tagline', '.hero-side'], { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.12 }, '-=1')
        .to(['.demo-note', '.scroll-cue'], { opacity: 1, duration: 1 }, '-=0.7')
        .to(barItems, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.08 }, '-=1.1');
    }

    /* Opening curtain: announces the brand once per visit, then lifts to reveal the hero */
    var intro = document.getElementById('intro');
    var seen = false;
    try { seen = !!sessionStorage.getItem('ms-seen'); } catch (e) {}
    if (intro && !seen) {
      if (lenis) lenis.stop();
      var itl = gsap.timeline({
        onComplete: function () {
          intro.remove();
          if (lenis) lenis.start();
          try { sessionStorage.setItem('ms-seen', '1'); } catch (e) {}
        }
      });
      itl.fromTo('.intro-mark', { scale: 0 }, { scale: 1, duration: 0.9, ease: 'back.out(2.2)' })
         .from('.intro-name', { yPercent: 110, duration: 1.1, ease: 'expo.out' }, '-=0.45')
         .from('.intro-sub', { opacity: 0, y: 10, duration: 0.8, ease: 'power2.out' }, '-=0.6')
         .to(intro, { yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, '+=0.55')
         .add(playHero, '-=0.55');
    } else {
      if (intro) intro.remove();
      playHero();
    }
    gsap.to('.hero h1', { yPercent: -12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

    /* Headings: masked word reveal */
    document.querySelectorAll('[data-split="words"]').forEach(function (el) {
      var words = split(el);
      gsap.set(words, { yPercent: 115 });
      el.classList.add('is-split');
      ScrollTrigger.create({
        trigger: el, start: 'top 88%', once: true,
        onEnter: function () { gsap.to(words, { yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: 0.06 }); }
      });
    });

    /* Statements and quotes: words light up with scroll */
    document.querySelectorAll('[data-split="scrub"]').forEach(function (el) {
      var words = split(el);
      gsap.set(words, { opacity: 0.14 });
      gsap.to(words, {
        opacity: 1, ease: 'none', stagger: 0.12, duration: 0.5,
        scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom 50%', scrub: true }
      });
    });

    /* Floating portraits drift at different speeds */
    ScrollTrigger.matchMedia({
      '(min-width: 901px)': function () {
        document.querySelectorAll('.float').forEach(function (el) {
          var s = parseFloat(el.dataset.speed || 0.1);
          gsap.fromTo(el, { y: s * 700 }, { y: -s * 700, ease: 'none', scrollTrigger: { trigger: '.approach', start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
          gsap.from(el, { clipPath: 'inset(100% 0 0 0)', duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
        });
        /* When a photo drifts behind the writing it softens, so the text always stays easy to read */
        var floats = Array.prototype.slice.call(document.querySelectorAll('.float'));
        var texts = Array.prototype.slice.call(document.querySelectorAll('.approach > .mono, .statement .w, .pillars .mono, .pillars p')); // word-level boxes: photos only soften where they truly cross a line of text
        function dim() {
          var rects = texts.map(function (t) { return t.getBoundingClientRect(); });
          floats.forEach(function (f) {
            var b = f.getBoundingClientRect();
            var over = rects.some(function (r) { return !(b.right < r.left - 12 || b.left > r.right + 12 || b.bottom < r.top - 12 || b.top > r.bottom + 12); });
            var want = over ? 0.3 : 1;
            if (f._want !== want) { f._want = want; gsap.to(f, { opacity: want, duration: 0.45, ease: 'power2.out', overwrite: 'auto' }); }
          });
        }
        ScrollTrigger.create({ trigger: '.approach', start: 'top bottom', end: 'bottom top', onUpdate: dim, onRefresh: dim });
      }
    });

    /* First-visit portrait: curtain reveal + inner parallax */
    var fv = document.querySelector('.fv-art');
    if (fv) {
      gsap.from(fv, { clipPath: 'inset(100% 0 0 0)', duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: fv, start: 'top 82%', once: true } });
      gsap.fromTo('.fv-inner', { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: fv, start: 'top bottom', end: 'bottom top', scrub: true } });
    }

    /* Journal photos: parallax inside their frames */
    document.querySelectorAll('.thumb').forEach(function (img) {
      gsap.fromTo(img, { yPercent: 0 }, { yPercent: -13, ease: 'none', scrollTrigger: { trigger: img.parentNode, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    /* Soft rise for everything else */
    var rise = '.head .mono,.sample-tag,.pillars li,.cat,.fv-lead,.fv-list li,.fv-price,.fv-copy .arrow-link,.enquire-note,#enquiry,.articles article .mono,.articles article h3,.articles article > p:last-child,.visit-grid > div,.site-footer > *';
    gsap.set(rise, { opacity: 0, y: 36 });
    ScrollTrigger.batch(rise, {
      start: 'top 92%', once: true,
      onEnter: function (b) { gsap.to(b, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08 }); }
    });

    /* Service hover image follows the cursor */
    if (fine) {
      var hi = document.getElementById('hoverImg');
      var himg = hi.querySelector('img');
      gsap.set(hi, { xPercent: -50, yPercent: -50, scale: 0.6, opacity: 0 });
      var qx = gsap.quickTo(hi, 'x', { duration: 0.6, ease: 'power3' });
      var qy = gsap.quickTo(hi, 'y', { duration: 0.6, ease: 'power3' });
      var urls = {};
      (window.MS_MENU || []).forEach(function (c) { urls[c.id] = c.art; var i = new Image(); i.src = c.art; });
      var menu = document.getElementById('menu');
      menu.addEventListener('mousemove', function (e) { qx(e.clientX + 190); qy(e.clientY); });
      menu.querySelectorAll('.cat-btn').forEach(function (b) {
        b.addEventListener('mouseenter', function () {
          himg.src = urls[b.closest('.cat').dataset.cat] || '';
          gsap.to(hi, { opacity: 1, scale: 1, duration: 0.6, ease: 'expo.out', overwrite: 'auto' });
        });
      });
      menu.addEventListener('mouseleave', function () { gsap.to(hi, { opacity: 0, scale: 0.6, duration: 0.5, ease: 'power3.out', overwrite: 'auto' }); });
    }


    /* Guest book: score counts up, bars fill, filtered reviews re-enter */
    var score = document.getElementById('gbScore');
    if (score) {
      var obj = { v: 0 };
      ScrollTrigger.create({
        trigger: '.gb-summary', start: 'top 80%', once: true,
        onEnter: function () {
          gsap.to(obj, { v: 4.9, duration: 1.8, ease: 'expo.out', onUpdate: function () { score.textContent = obj.v.toFixed(1); } });
          gsap.fromTo('.gb-bars i', { '--k': 0 }, { '--k': 1, duration: 1.4, ease: 'expo.out', stagger: 0.08 });
        }
      });
      gsap.set('.gb-bars i', { '--k': 0 });
    }
    document.addEventListener('ms:filtered', function () {
      var shown = document.querySelectorAll('.review:not([hidden])');
      gsap.fromTo(shown, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out', stagger: 0.07, overwrite: true });
    });

    ScrollTrigger.refresh();
  }

  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(run);
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
