/* =============================================
   HAPPY PLACE — MAIN JS
   ============================================= */

gsap.registerPlugin(ScrollTrigger);

/* --- REVEAL UTILITY ---
   Uses fromTo so CSS opacity:0 (FOUC guard) doesn't
   interfere with the animation target value.
   ------------------------------------------------ */
function reveal(targets, options = {}) {
  const els = document.querySelectorAll(targets);
  if (!els.length) return;
  gsap.fromTo(targets,
    { opacity: 0, y: options.y ?? 30 },
    {
      opacity: 1,
      y: 0,
      duration: options.duration ?? 0.7,
      ease: 'power3.out',
      stagger: options.stagger ?? 0,
      delay: options.delay ?? 0,
      scrollTrigger: {
        trigger: options.trigger ?? targets,
        start: 'top 92%',
        toggleActions: 'play none none none',
      },
    }
  );
}

/* =============================================
   ANNOUNCEMENT BANNER
   ============================================= */
function updateBannerHeight() {
  const el = document.getElementById('announcement');
  const h = (el && el.style.display !== 'none') ? el.offsetHeight : 0;
  document.documentElement.style.setProperty('--banner-h', h + 'px');
}

function dismissAnnouncement() {
  const el = document.getElementById('announcement');
  gsap.to(el, {
    height: 0,
    opacity: 0,
    paddingTop: 0,
    paddingBottom: 0,
    duration: 0.4,
    ease: 'power3.in',
    onComplete: () => {
      el.style.display = 'none';
      sessionStorage.setItem('announcement-dismissed', '1');
      updateBannerHeight();
    },
  });
}

function initAnnouncement() {
  if (sessionStorage.getItem('announcement-dismissed')) return;

  const jsonPath = '/announcement.json';

  fetch(jsonPath)
    .then(r => r.json())
    .then(data => {
      if (!data.active) return;

      const el     = document.getElementById('announcement');
      const textEl = document.getElementById('announcement-text');
      const ctaEl  = document.getElementById('announcement-cta');

      textEl.textContent = data.text;
      if (data.cta && data.ctaLink) {
        ctaEl.textContent = data.cta;
        ctaEl.href = data.ctaLink;
      } else {
        ctaEl.remove();
      }

      el.style.display = '';
      updateBannerHeight();

      gsap.from(el, {
        height: 0,
        opacity: 0,
        paddingTop: 0,
        paddingBottom: 0,
        duration: 0.5,
        ease: 'power3.out',
      });

      document.querySelector('.announcement__dismiss')
        .addEventListener('click', dismissAnnouncement);
    })
    .catch(() => {});
}

/* =============================================
   NAV SCROLL STATE
   ============================================= */
function initNavScroll() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 50);
  }, { passive: true });
}

/* =============================================
   MOBILE MENU
   ============================================= */
function initMobileMenu() {
  const burger  = document.getElementById('nav-burger');
  const overlay = document.getElementById('nav-overlay');
  if (!burger || !overlay) return;

  function openMenu() {
    overlay.classList.add('is-open');
    burger.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    overlay.classList.remove('is-open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', () => {
    burger.classList.contains('is-open') ? closeMenu() : openMenu();
  });

  overlay.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
}

/* =============================================
   HERO ANIMATIONS
   ============================================= */
function initHero() {
  if (!document.querySelector('.hero')) return;

  gsap.from('.hero-logo-wrap', { opacity: 0, scale: 0.9, duration: 1, ease: 'power3.out', delay: 0.2 });
  gsap.from('.hero-headline',  { opacity: 0, y: 30, duration: 0.7, ease: 'power3.out', delay: 0.7 });
  gsap.from('.hero-sub',       { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out', delay: 0.9 });
  gsap.from('.hero-cta',       { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out', delay: 1.1 });
  gsap.from('.hero-shape, .hero-dot', { opacity: 0, scale: 0.5, duration: 0.6, ease: 'back.out(1.5)', stagger: 0.08, delay: 0.5 });

  // Mouse parallax on hero shapes
  const heroSection = document.querySelector('.hero');
  if (heroSection && window.innerWidth > 768) {
    const shapes = document.querySelectorAll('.hero-shape, .hero-dot');
    heroSection.addEventListener('mousemove', function(e) {
      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      shapes.forEach(function(shape, i) {
        const depth = 15 + (i % 3) * 10;
        gsap.to(shape, {
          x: x * depth,
          y: y * depth,
          duration: 0.8,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      });
    });
  }
}


/* =============================================
   NARRATIVE SECTION ANIMATIONS
   ============================================= */
function initNarrative() {
  if (!document.querySelector('.narrative')) return;

  document.querySelectorAll('.narrative__panel').forEach((panel, i) => {
    const eyebrow  = panel.querySelector('.narrative__eyebrow');
    const headline = panel.querySelector('.narrative__headline');
    const body     = panel.querySelector('.narrative__body');
    const link     = panel.querySelector('.narrative__link');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: panel,
        start: 'top 85%',
        end: 'bottom 25%',
        toggleActions: 'play none none none',
        onEnter:     () => panel.classList.add('is-active'),
        onLeave:     () => panel.classList.remove('is-active'),
        onEnterBack: () => panel.classList.add('is-active'),
        onLeaveBack: () => panel.classList.remove('is-active'),
      }
    });

    if (eyebrow)  tl.fromTo(eyebrow,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
      0
    );
    if (headline) tl.fromTo(headline,
      { opacity: 0, y: 60, skewY: 2 },
      { opacity: 1, y: 0, skewY: 0, duration: 0.8, ease: 'power4.out' },
      0.1
    );
    if (body)     tl.fromTo(body,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
      0.3
    );
    if (link)     tl.fromTo(link,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
      0.45
    );
  });
}

/* =============================================
   SERVICES SECTION ANIMATIONS
   ============================================= */
function initServices() {
  if (!document.querySelector('.services')) return;

  reveal('.services .section-eyebrow');
  reveal('.services .section-headline', { y: 40 });
  reveal('.services .section-intro', { trigger: '.services__header' });

  document.querySelectorAll('.service-card').forEach((card, i) => {
    const fromLeft = i % 2 === 0;
    gsap.fromTo(card,
      { opacity: 0, x: fromLeft ? -60 : 60, rotateY: fromLeft ? 6 : -6 },
      {
        opacity: 1,
        x: 0,
        rotateY: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          toggleActions: 'play none none none',
        }
      }
    );
  });
}

/* =============================================
   STATS SECTION ANIMATIONS
   ============================================= */
function initStats() {
  if (!document.querySelector('.stats')) return;

  document.querySelectorAll('.stats__number').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    gsap.fromTo({ val: 0 }, { val: target },
      {
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 92%' },
        onUpdate: function() {
          el.textContent = Math.round(this.targets()[0].val) + suffix;
        },
      }
    );
  });

  reveal('.stats__label', { stagger: 0.1, trigger: '.stats__grid' });
}

/* =============================================
   HOW IT WORKS SECTION ANIMATIONS
   ============================================= */
function initHowItWorks() {
  if (!document.querySelector('.how-it-works')) return;

  reveal('.how-it-works .section-eyebrow');
  reveal('.how-it-works .section-headline', { y: 40 });
  reveal('.how-it-works .section-intro', { trigger: '.how-it-works__header' });

  // Connector line draws on scroll
  gsap.to('.steps__connector-line', {
    scaleX: 1,
    duration: 1.5,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.steps__grid',
      start: 'top 80%',
      end: 'top 40%',
      scrub: true,
    }
  });

  // Steps appear sequentially with bounce
  document.querySelectorAll('.step-item').forEach((step, i) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.steps__grid',
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    });

    tl.fromTo(step.querySelector('.step__number'),
      { scale: 0, rotation: -20 },
      { scale: 1, rotation: 0, duration: 0.5, ease: 'back.out(2)', delay: i * 0.3 }
    );

    tl.fromTo(step,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
      '-=0.3'
    );
  });
}

/* =============================================
   DIFFICULTIES SECTION ANIMATIONS
   ============================================= */
function initDifficulties() {
  if (!document.querySelector('.difficulties')) return;

  reveal('.difficulties .section-eyebrow');
  reveal('.difficulties .section-headline', { y: 40 });
  reveal('.difficulties .section-intro', { trigger: '.difficulties__header' });
  reveal('.difficulties__col', { stagger: 0.1, trigger: '.difficulties__grid' });
  gsap.fromTo('.pill',
    { opacity: 0, scale: 0.5, y: 15 },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.4,
      ease: 'back.out(2)',
      stagger: 0.06,
      scrollTrigger: {
        trigger: '.difficulties__grid',
        start: 'top 85%',
        toggleActions: 'play none none none',
      }
    }
  );
}

/* =============================================
   TESTIMONIALS SECTION ANIMATIONS
   ============================================= */
function initTestimonials() {
  if (!document.querySelector('.testimonials')) return;

  reveal('.testimonials .section-eyebrow');
  reveal('.testimonials .section-headline', { y: 40 });
  reveal('.testimonials .section-intro', { trigger: '.testimonials__header' });
  reveal('.testimonial-card', { stagger: 0.12 });
  reveal('.testimonial-card__stars', { y: 10, stagger: 0.05, trigger: '.testimonials__grid' });
}

/* =============================================
   FOOTER ANIMATIONS
   ============================================= */
function initFooter() {
  if (!document.querySelector('.footer')) return;

  gsap.fromTo('.footer__logo',
    { opacity: 0, scale: 0.9 },
    { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '.footer__main', start: 'top 90%' } }
  );
  gsap.fromTo('.footer__headline',
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.15,
      scrollTrigger: { trigger: '.footer__main', start: 'top 90%' } }
  );
  gsap.fromTo('.footer__cta',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.3,
      scrollTrigger: { trigger: '.footer__main', start: 'top 90%' } }
  );
  gsap.fromTo('.footer__game',
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: '.footer__main', start: 'top 85%' } }
  );
  gsap.fromTo('.footer__shape',
    { opacity: 0, scale: 0 },
    { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)', stagger: 0.1,
      scrollTrigger: { trigger: '.footer', start: 'top 85%' } }
  );
}

/* =============================================
   PAGE HERO ANIMATIONS
   ============================================= */
function initPageHero() {
  if (!document.querySelector('.page-hero')) return;

  gsap.fromTo('.page-hero .section-eyebrow',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.3 }
  );
  gsap.fromTo('.page-hero__title',
    { opacity: 0, y: 35 },
    { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.5 }
  );
}

/* =============================================
   SERVICES DETAIL ANIMATIONS
   ============================================= */
function initServicesDetail() {
  if (!document.querySelector('.service-detail')) return;

  document.querySelectorAll('.service-detail').forEach(section => {
    const st      = { trigger: section, start: 'top 92%' };
    const img     = section.querySelector('.service-detail__image');
    const eyebrow = section.querySelector('.section-eyebrow');
    const title   = section.querySelector('.service-detail__title');
    const body    = section.querySelector('.service-detail__body');
    const items   = section.querySelectorAll('.service-detail__list-item');

    if (img)     gsap.fromTo(img,     { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', scrollTrigger: st });
    if (eyebrow) gsap.fromTo(eyebrow, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.15, scrollTrigger: st });
    if (title)   gsap.fromTo(title,   { opacity: 0, y: 35 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.15, scrollTrigger: st });
    if (body)    gsap.fromTo(body,    { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.2,  scrollTrigger: st });
    if (items.length) gsap.fromTo(items, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out', stagger: 0.08, delay: 0.22, scrollTrigger: st });
  });

  if (document.querySelector('.services-cta-banner')) {
    reveal('.services-cta-banner__title', { y: 30, trigger: '.services-cta-banner' });
    reveal('.services-cta-banner__body',  { y: 20, trigger: '.services-cta-banner' });
  }
}

/* =============================================
   ACTIVE NAV LINK
   ============================================= */
function initActiveNav() {
  const path = location.pathname;
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    const active =
      (href === '/' && (path === '/' || path === '/index.html' || path === '')) ||
      (href !== '/' && href && path === href);
    link.classList.toggle('nav__link--active', active);
  });
}

/* =============================================
   BLOG PAGE ANIMATIONS
   ============================================= */
function initBlog() {
  if (!document.querySelector('.blog-grid')) return;

  reveal('.blog-grid-section .section-eyebrow',  { trigger: '.blog-grid__header' });
  reveal('.blog-grid-section .section-headline', { y: 40, trigger: '.blog-grid__header' });
  reveal('.blog-grid-section .section-intro',    { trigger: '.blog-grid__header' });
  reveal('.blog-card', { stagger: 0.1, trigger: '.blog-grid' });
  reveal('.newsletter-section__inner', { y: 30, trigger: '.newsletter-section' });
}

/* =============================================
   NEWSLETTER FORM
   ============================================= */
function initNewsletter() {
  const form    = document.getElementById('newsletter-form');
  const success = document.getElementById('newsletter-success');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const emailInput = form.querySelector('input[type="email"]');
    if (!emailInput?.value.trim()) return;
    form.style.display = 'none';
    if (success) success.classList.add('is-visible');
  });
}

/* =============================================
   CONTACT PAGE ANIMATIONS & FORM
   ============================================= */
function initContactPage() {
  if (!document.querySelector('.contact-page-section')) return;

  reveal('.contact-page-form__wrap', { y: 40, trigger: '.contact-page-inner' });
  reveal('.contact-info-card',        { y: 40, trigger: '.contact-page-inner' });

  if (document.querySelector('.faq-section')) {
    reveal('.faq-section .section-eyebrow', { trigger: '.faq-section__header' });
    reveal('.faq-section .section-headline', { y: 40, trigger: '.faq-section__header' });
    reveal('.faq-item', { stagger: 0.08, trigger: '.faq-list' });
  }
}

function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const btn = item.querySelector('.faq-item__question');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      items.forEach(i => {
        i.classList.remove('is-open');
        i.querySelector('.faq-item__question').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

function initContactPageForm() {
  const form    = document.getElementById('contact-page-form');
  const submit  = document.getElementById('cp-submit');
  const success = document.getElementById('form-success');
  const error   = document.getElementById('form-error');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    submit.disabled = true;
    submit.textContent = 'Αποστολή...';
    success.classList.remove('is-visible');
    error.classList.remove('is-visible');

    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      success.classList.add('is-visible');
      gsap.fromTo(success, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' });
      form.reset();
    } catch {
      error.classList.add('is-visible');
    } finally {
      submit.disabled = false;
      submit.textContent = 'Αποστολή Μηνύματος';
    }
  });
}

/* =============================================
   STACKED SECTIONS SCROLL ANIMATION
   ============================================= */
function initStackedSections() {
  gsap.to('.hero-center', {
    scale: 0.8,
    opacity: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: '.narrative',
      start: 'top 80%',
      end: 'top 20%',
      scrub: true,
    }
  });

  const sections = document.querySelectorAll(
    '.narrative, .stats, .services, .how-it-works, .difficulties, .testimonials, .footer'
  );

  sections.forEach((section) => {
    gsap.fromTo(section,
      { yPercent: 15 },
      {
        yPercent: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'top top',
          scrub: true,
        }
      }
    );
  });
}

/* =============================================
   PENCIL LINE ANIMATION
   ============================================= */
function initPencilLine() {
  const path = document.getElementById('pencil-path');
  if (!path) return;

  const length = path.getTotalLength();

  gsap.set(path, {
    attr: { 'stroke-dasharray': length, 'stroke-dashoffset': length }
  });

  gsap.to(path, {
    attr: { 'stroke-dashoffset': 0 },
    ease: 'none',
    scrollTrigger: {
      trigger: '.narrative',
      start: 'top 95%',
      end: '70% top',
      scrub: true,
    }
  });
}

/* =============================================
   INIT
   ============================================= */
/* =============================================
   MEMORY GAME
   ============================================= */
function initMemoryGame() {
  const grid = document.getElementById('memory-grid');
  if (!grid) return;

  const icons = [
    { name: 'star', color: '#90C4AE', svg: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>' },
    { name: 'heart', color: '#C591A7', svg: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>' },
    { name: 'pencil', color: '#91A7C5', svg: '<path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' },
    { name: 'book', color: '#C5AF91', svg: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' },
    { name: 'palette', color: '#FFB347', svg: '<path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/><circle cx="7" cy="12" r="1.5" fill="white"/><circle cx="9" cy="8" r="1.5" fill="white"/><circle cx="15" cy="8" r="1.5" fill="white"/>' },
    { name: 'bolt', color: '#B8D8CC', svg: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>' },
  ];

  let cards = [];
  let flipped = [];
  let matched = 0;
  let moves = 0;
  let locked = false;

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function createBoard() {
    grid.innerHTML = '';
    flipped = [];
    matched = 0;
    moves = 0;
    locked = false;
    document.getElementById('game-moves').textContent = '0 κινήσεις';
    document.getElementById('game-win').style.display = 'none';

    const pairs = [...icons, ...icons];
    cards = shuffle(pairs);

    cards.forEach(function(icon, i) {
      var card = document.createElement('div');
      card.className = 'memory-card';
      card.dataset.name = icon.name;
      card.dataset.index = i;

      var isStroke = icon.name === 'pencil' || icon.name === 'book';

      card.innerHTML =
        '<div class="memory-card__inner">' +
          '<div class="memory-card__back"></div>' +
          '<div class="memory-card__front" style="background:' + icon.color + '">' +
            '<svg viewBox="0 0 24 24" fill="' + (isStroke ? 'none' : '#ffffff') + '" style="color:#ffffff">' +
              icon.svg +
            '</svg>' +
          '</div>' +
        '</div>';

      card.addEventListener('click', function() { flipCard(card); });
      grid.appendChild(card);
    });
  }

  function flipCard(card) {
    if (locked) return;
    if (card.classList.contains('is-flipped')) return;
    if (card.classList.contains('is-matched')) return;

    card.classList.add('is-flipped');
    flipped.push(card);

    if (flipped.length === 2) {
      moves++;
      var movesText = moves === 1 ? '1 κίνηση' : moves + ' κινήσεις';
      document.getElementById('game-moves').textContent = movesText;
      locked = true;

      var a = flipped[0];
      var b = flipped[1];

      if (a.dataset.name === b.dataset.name && a.dataset.index !== b.dataset.index) {
        a.classList.add('is-matched');
        b.classList.add('is-matched');
        matched++;
        flipped = [];
        locked = false;

        if (matched === icons.length) {
          setTimeout(function() {
            document.getElementById('game-win').style.display = 'block';
          }, 400);
        }
      } else {
        setTimeout(function() {
          a.classList.remove('is-flipped');
          b.classList.remove('is-flipped');
          flipped = [];
          locked = false;
        }, 800);
      }
    }
  }

  document.getElementById('game-reset').addEventListener('click', createBoard);
  createBoard();
}

function initCardTilt() {
  if (window.innerWidth < 768) return;

  document.querySelectorAll('.testimonial-card, .service-card').forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(card, {
        rotateY: x * 8,
        rotateX: -y * 8,
        boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    });

    card.addEventListener('mouseleave', function() {
      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        duration: 0.5,
        ease: 'power3.out',
      });
    });
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();

      var offset = 80;
      var targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;

      gsap.to(window, {
        scrollTo: { y: targetPosition, autoKill: false },
        duration: 1.2,
        ease: 'power3.inOut',
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initStackedSections();
  initAnnouncement();
  initNavScroll();
  initMobileMenu();
  initSmoothScroll();
  initActiveNav();
  initHero();
  initNarrative();
  initPencilLine();
  initStats();
  initServices();
  initHowItWorks();
  initDifficulties();
  initTestimonials();
  initCardTilt();
  initFooter();
  initMemoryGame();
  initPageHero();
  initServicesDetail();
  initContactPage();
  initFaqAccordion();
  initContactPageForm();
  initBlog();
  initNewsletter();

  gsap.fromTo('.nav',
    { opacity: 0, y: -20 },
    { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
  );

  var progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', function() {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = (scrollTop / docHeight) * 100;
      progressBar.style.width = progress + '%';
    }, { passive: true });
  }

  // page-specific reveals go here
});
