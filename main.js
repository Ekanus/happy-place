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
  gsap.from(targets, {
    opacity: 0,
    y: options.y ?? 30,
    duration: options.duration ?? 0.7,
    ease: 'power3.out',
    stagger: options.stagger ?? 0,
    delay: options.delay ?? 0,
    scrollTrigger: {
      trigger: options.trigger ?? targets,
      start: 'top 92%',
      toggleActions: 'play none none none',
    },
  });
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
    const number   = panel.querySelector('.narrative__number');

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
    if (number)   tl.fromTo(number,
      { opacity: 0, x: i % 2 === 0 ? 60 : -60, scale: 0.85 },
      { opacity: 0.08, x: 0, scale: 1, duration: 1, ease: 'power3.out' },
      0
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
  reveal('.step-item', { stagger: 0.18 });

  gsap.fromTo('.step__number',
    { scale: 0 },
    {
      scale: 1,
      duration: 0.6,
      ease: 'back.out(1.7)',
      stagger: 0.18,
      scrollTrigger: { trigger: '.steps__grid', start: 'top 92%' },
    }
  );

  gsap.fromTo('.steps__connector-line',
    { scaleX: 0 },
    {
      scaleX: 1,
      duration: 1.2,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.steps__grid', start: 'top 92%' },
    }
  );
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
  reveal('.pill', { stagger: 0.05, trigger: '.difficulties__grid' });
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
  if (!document.querySelector('.footer__col')) return;
  gsap.fromTo('.footer__left',
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: '.footer__top', start: 'top 92%' } }
  );
  gsap.fromTo('.footer__col',
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.1,
      scrollTrigger: { trigger: '.footer__top', start: 'top 92%' } }
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
   COUNTER ANIMATION
   ============================================= */
function animateCounter(el, target) {
  gsap.to({ val: 0 }, {
    val: target,
    duration: 2,
    ease: 'power2.out',
    scrollTrigger: { trigger: el, start: 'top 92%' },
    onUpdate: function () {
      el.textContent = Math.round(this.targets()[0].val) + '+';
    },
  });
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
document.addEventListener('DOMContentLoaded', () => {
  initStackedSections();
  initAnnouncement();
  initNavScroll();
  initMobileMenu();
  initActiveNav();
  initHero();
  initNarrative();
  initPencilLine();
  initStats();
  initServices();
  initHowItWorks();
  initDifficulties();
  initTestimonials();
  initFooter();
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

  // page-specific reveals go here
});
