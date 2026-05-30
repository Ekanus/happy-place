# Happy Place — Design System

## Colors
--c-primary: #5BB8A0
--c-primary-light: #F0FAF7
--c-accent: #FFB347
--c-bg: #FFFFFF
--c-text: #2D3748
--c-muted: #718096
--c-line: rgba(45,55,72,0.08)
Footer bg: #2D3748 (dark)
Footer text: rgba(255,255,255,0.85)

## Fonts
--ff-heading: 'Nunito', sans-serif (headings, nav, buttons)
--ff-body: 'Inter', sans-serif (body, labels, forms)

## Typographic Scale (fluid, clamp)
h1 hero: clamp(2.8rem, 6vw, 5.5rem), weight 900
h2 section: clamp(2rem, 4vw, 3.5rem), weight 800
h3 card: clamp(1.3rem, 2vw, 1.6rem), weight 700
Eyebrow: 0.7rem, weight 600, letter-spacing 0.15em, uppercase
Body: 1rem, line-height 1.75

## Spacing
Section padding: 6rem 0 (desktop), 4rem 0 (tablet), 3rem 0 (mobile)
Container max-width: 1200px, padding: 0 2rem (mobile: 0 1.25rem)
Card padding: 2.5rem
Card gap: 1.5rem

## Border Radius
Cards: 16px
Buttons: 50px (pill shape)
Inputs: 12px
Badges: 20px

## Buttons
Primary: bg #5BB8A0, white text, pill shape
Secondary: border 2px #5BB8A0, transparent bg, #5BB8A0 text
Hover: scale(1.03), slight shadow

## Animations
Reveal: opacity 0→1, y 30→0, duration 0.7s, ease power3.out
ScrollTrigger start: top 88%
Card hover: translateY(-6px), box-shadow grows
Float: gentle CSS keyframe, 3s ease-in-out infinite, translateY ±8px
Stagger cards: 0.12s

## Breakpoints
1024px: tablet
768px: mobile nav, reduced padding
480px: small mobile, single column

## GSAP Hidden State (add to CSS opacity:0 block)
.nav, .hero-badge, .hero-headline, .hero-sub,
.hero-cta, .section-eyebrow, .section-headline,
.section-intro, .service-card, .step-item,
.testimonial-card, .contact-form, .footer-col
