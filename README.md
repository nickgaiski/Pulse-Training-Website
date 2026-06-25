# Pulse Personal Training — Website

A redesigned, conversion-optimized landing page for **Pulse Personal Training**
(Highland, IL). The StoryBrand messaging from the original site is preserved and
sharpened; the visual design, structure, performance, and calls-to-action are
all rebuilt for higher conversions.

> The hero, the mom; the guide, Pulse. Every section moves a busy mom one step
> closer to booking a free discovery call.

## What's here

```
index.html              The full single-page site
assets/css/styles.css   Design system + components
assets/js/main.js       Header, mobile nav, scroll reveals, lead form
assets/img/             Web-optimized images (WebP + JPG)
tools/optimize-images.js  Regenerates optimized images from tools/raw/
vercel.json             Static hosting config (clean URLs, caching, headers)
```

It's a **static site** — no build step, no server, instant loads (which is
itself a conversion win). Just open `index.html` or serve the folder.

## Run locally

```bash
# any static server works, e.g.
npx serve .
# or
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploy to Vercel

This repo is zero-config for Vercel.

**Option A — Connect the repo (recommended, ~30 seconds)**
1. Go to <https://vercel.com/new> and import this GitHub repository.
2. Framework preset: **Other**. Leave build & output settings empty
   (it's a static site served from the repo root).
3. Click **Deploy**. Every push to the branch then auto-builds a preview URL.

**Option B — Vercel CLI**
```bash
npm i -g vercel
vercel        # first run creates the project + a preview deployment
vercel --prod # promote to production
```

## Activating the contact form (1 step)

Out of the box, the "Book a Free Discovery Call" form opens the visitor's email
app pre-filled to `jeff@pulse-training.com`, so no lead is ever lost. To collect
submissions automatically instead:

1. Create a free form endpoint at <https://formspree.io> (or similar) pointed at
   `jeff@pulse-training.com`.
2. Paste the endpoint URL into `FORM_ENDPOINT` near the top of
   `assets/js/main.js`.

That's it — submissions will POST to your inbox and show an inline success
message. (Prefer Calendly/Acuity? Point the CTA buttons at your booking link
instead — every CTA links to `#contact`.)

## Re-optimizing images

Drop full-resolution source images into `tools/raw/`, then:

```bash
npm install      # installs sharp (dev only)
npm run optimize # writes optimized WebP + JPG into assets/img/
```

## Editing content

All copy lives directly in `index.html` in clearly commented sections
(Hero, Empathy, Stakes, Guide/Story, Program, Plan, Results, Testimonials,
Team, Contact). Brand colors and type are CSS variables at the top of
`assets/css/styles.css`.
