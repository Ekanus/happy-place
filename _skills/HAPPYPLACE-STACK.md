# Happy Place — Tech Stack

## Stack
- Vanilla HTML5, CSS, JS (no frameworks)
- GSAP 3.11.4 + ScrollTrigger (CDN)
- Vercel static hosting
- Resend API for contact form (api/contact.js)
- Google Fonts: Nunito + Inter

## CDN Scripts (order matters)
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/ScrollTrigger.min.js"></script>
<script src="main.js"></script>

## File Structure
project-root/
├── index.html
├── style.css
├── main.js
├── announcement.json
├── vercel.json
├── pages/
│   ├── services.html
│   ├── blog.html
│   └── contact.html
├── api/
│   └── contact.js
└── _skills/

## vercel.json
{"functions":{"api/*.js":{"runtime":"nodejs20.x"}}}

## Key Rules
- Mobile-first CSS always
- All text in Greek only
- Phone numbers as clickable tel: links
- Favicon from logo
- Every page has same nav + footer
