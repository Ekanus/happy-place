# Happy Place — Animation Patterns

## Reveal Utility (paste in main.js)
function reveal(targets, options = {}) {
  gsap.from(targets, {
    opacity: 0,
    y: options.y ?? 30,
    duration: options.duration ?? 0.7,
    ease: 'power3.out',
    stagger: options.stagger ?? 0,
    scrollTrigger: {
      trigger: options.trigger ?? targets,
      start: 'top 88%',
    }
  });
}

## Standard Calls
reveal('.section-eyebrow')
reveal('.section-headline', { y: 45 })
reveal('.section-intro')
reveal('.service-card', { stagger: 0.12 })
reveal('.step-item', { stagger: 0.15 })
reveal('.testimonial-card', { stagger: 0.12 })

## Float Animation (CSS)
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}
.float { animation: float 3s ease-in-out infinite; }
.float-delay-1 { animation-delay: 0.5s; }
.float-delay-2 { animation-delay: 1s; }
.float-delay-3 { animation-delay: 1.5s; }

## Nav Scroll State
window.addEventListener('scroll', () => {
  document.getElementById('nav')
    .classList.toggle('nav--scrolled', window.scrollY > 50);
});
.nav--scrolled { box-shadow: 0 2px 20px rgba(0,0,0,0.08); background: #fff; }

## Counter Animation
function animateCounter(el, target) {
  gsap.to({ val: 0 }, {
    val: target,
    duration: 2,
    ease: 'power2.out',
    scrollTrigger: { trigger: el, start: 'top 85%' },
    onUpdate: function() {
      el.textContent = Math.round(this.targets()[0].val) + '+';
    }
  });
}

## Announcement Banner
- Loads from announcement.json
- Has dismiss button (X), saves to sessionStorage
- Smooth slideDown on load, slideUp on dismiss
