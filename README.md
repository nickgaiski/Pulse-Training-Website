# Pulse Personal Training — Website

A redesigned, conversion-optimized **StoryBrand** landing page for **Pulse Personal
Training** (Highland, IL). Static site — no build step, instant loads, deploys
anywhere. The messaging follows Donald Miller's StoryBrand (SB7) framework; the
visuals, structure, performance, and SEO/AEO foundations are all built for lead
generation.

---

## 🚀 Before you go live — LAUNCH CHECKLIST

The site is fully built. A few real-world details only the business owner can
supply still need to be filled in. **Do these before (or right after) launch:**

- [ ] **1. Point the real domain at this site.** Deploy to **`www.pulse-training.com`**
  (in Vercel: Project → Settings → Domains → add the domain, then update your DNS).
  Retire or **301-redirect** the old Wix site. *Do not leave both live* — they'll
  compete for the same Google listing. The `canonical`/Open Graph/JSON-LD URLs in
  `index.html` already point at `pulse-training.com`, so once it's live there,
  everything is correct.
- [ ] **2. Claim & optimize your Google Business Profile** (google.com/business) for
  Pulse at 815 Broadway, category **"Personal trainer."** This drives ~90% of local
  "personal trainer Highland IL" visibility — more than the website itself. Funnel
  happy clients to leave Google reviews. Then paste your GBP URL into `sameAs` and
  `hasMap` in the JSON-LD (`index.html` `<head>`).
- [ ] **3. Turn on lead capture.** In `assets/js/main.js`, set `FORM_ENDPOINT` to a
  free [Formspree](https://formspree.io) endpoint (→ `jeff@pulse-training.com`), **or**
  point the CTA buttons at a Calendly/Acuity booking link. *Until you do, the form
  falls back to opening the visitor's email app — usable, but you'll lose mobile leads.*
- [ ] **4. Add your real studio hours** — both (a) visibly in the Contact section of
  `index.html`, and (b) as `openingHoursSpecification` in the JSON-LD. They're
  intentionally omitted right now rather than guessed.
- [ ] **5. Replace the placeholder social links** (footer of `index.html`, marked with
  a `TODO`) with your real Facebook/Instagram URLs, and add them to `sameAs` in the JSON-LD.
- [ ] **6. Add your real review rating** once you have it: an `aggregateRating`
  (`ratingValue` + a **real** `reviewCount` from Google) in the JSON-LD. *Never invent
  a number — Google can penalize fake ratings.*
- [ ] **7. Verify the geo coordinates** in the JSON-LD against Google Maps (they're a
  close approximation for 815 Broadway).
- [ ] **8. (Recommended) Add pricing/offer info** — even a range. "How much does
  personal training cost" is the #1 unanswered question and a real search term.
- [ ] **9. Verify in Google Search Console** (the `pulse-training.com` property) and
  submit `sitemap.xml`.

See **SEO & AI-search notes** below for the "why" behind these.

---

## What's here

```
index.html              The full single-page site (all copy lives here, in commented sections)
404.html                Branded not-found page
robots.txt              Crawl rules — explicitly welcomes AI answer engines
sitemap.xml             Single-URL sitemap (update lastmod when content changes)
llms.txt                Plain-text business summary for AI assistants
vercel.json             Static hosting config (clean URLs, caching, security headers)
assets/css/styles.css   Design system + components (brand colors/fonts are CSS vars at top)
assets/js/main.js       Header, mobile nav, scroll reveals, lead form (FORM_ENDPOINT here)
assets/img/             Web-optimized images (WebP + JPG)
tools/optimize-images.js  Regenerates optimized images from tools/raw/
```

## Run locally

```bash
npx serve .          # or: python3 -m http.server 8000
```

## Deploy to Vercel

Zero-config. Import the repo at <https://vercel.com/new> (framework preset
**Other**, no build settings), then add the custom domain per checklist item #1.
Every push to the production branch auto-deploys.

## The StoryBrand (SB7) structure

The page walks the customer through Donald Miller's 7-part framework, in order:

1. **A Character** (hero) — a busy mom who wants to feel strong, confident, and present.
2. **Has a Problem** — external (no time, out of shape), internal (mom guilt, "slipped
   to the bottom of your own list"), and philosophical ("taking yourself off the bottom
   isn't selfish"). The villain is *putting yourself last*.
3. **Meets a Guide** — Pulse, shown with **empathy** ("we've been where you are") +
   **authority** (since 2007, Coach Tina's 75-lb journey, real testimonials).
4. **Who gives a Plan** — 3 steps: Book your free call → Meet your coach → Start.
5. **Calls them to Action** — one consistent direct CTA ("Book a Free Discovery Call")
   plus a transitional CTA ("See Real Results").
6. **Helps them avoid Failure** — the stakes / cost of waiting (the "not alone" beat).
7. **Ends in Success** — the "imagine six months from now" transformation + identity close.

Keep this arc intact when editing copy.

## Editing content & images

All copy is plain HTML in clearly commented sections of `index.html`. Brand colors and
type are CSS variables at the top of `assets/css/styles.css`. To re-optimize images, drop
full-res files into `tools/raw/` and run `npm install && npm run optimize`.

## SEO & AI-search notes

- **The domain is the #1 lever.** A live site at the real `pulse-training.com` inherits
  the brand's authority and is the version Google and AI engines will cite. (Checklist #1.)
- **Structured data is shipped:** `LocalBusiness` (with geo, areaServed, founder, coaches,
  and real testimonial `Review`s) + a `FAQPage`. Add `aggregateRating` and `openingHours`
  when you have them (checklist #4, #6).
- **AI crawlers are explicitly allowed** in `robots.txt`, and `llms.txt` gives assistants
  a clean fact sheet.
- **Performance:** images are WebP+JPG, the hero is preloaded and renders immediately,
  and assets are cached `immutable` via `vercel.json`.
- **Growth (post-launch):** the biggest next win is adding dedicated pages — e.g.
  `/personal-training-highland-il`, `/weight-loss-for-moms`, per-coach pages, and a small
  blog — so you can rank for more than one query. The single page caps your keyword surface.
