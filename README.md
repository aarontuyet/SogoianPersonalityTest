# The Sogoian Personality Assessment

A fully static, client-side personality assessment. Twenty-five questions. Six scoring dimensions. One unavoidable conclusion.

No server. No database. No authentication. Runs entirely in the browser.

---

## Cloudflare Pages Deployment

### One-Time Setup

1. Push this repository to GitHub (branch: `main`).
2. Log into [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
3. Select the repository and configure with these exact settings:

| Setting | Value |
|---------|-------|
| Production branch | `main` |
| Framework preset | None |
| Build command | *(leave blank)* |
| Build output directory | `/` |

4. Click **Save and Deploy**. Cloudflare will publish the repository root directly.

### Subsequent Deployments

Push any commit to `main`. Cloudflare Pages deploys automatically within ~30 seconds.

### Custom Domain

In the Cloudflare Pages project → **Custom domains** → add your domain. DNS propagation is handled automatically if the domain is on Cloudflare.

---

## Project Structure

```
/
├── index.html              — Single-page application (three screens)
├── manifest.json           — Web app identity metadata
├── sw.js                   — Service worker (disabled for v1, present for future use)
├── _headers                — Cloudflare Pages HTTP response headers
├── assets/
│   ├── css/style.css       — Full design system (CSS variables, mobile-first)
│   └── images/             — Archetype illustrations (pending) + icons (pending)
└── src/
    ├── questions.js        — 25-question bank with answer vectors
    ├── engine.js           — Archetype definitions + scoring engine
    └── app.js              — UI state machine and event controller
```

---

## Before v1 is Complete

These items are required before the experience is fully realized. The quiz runs end-to-end without them, but the result screen will show placeholder text where images should be.

**Archetype illustrations** — Place one `.jpg` per archetype in `assets/images/`:

| Filename | Archetype |
|----------|-----------|
| `theGeneral.jpg` | The General |
| `theCaretaker.jpg` | The Caretaker |
| `theOverachiever.jpg` | The Overachiever |
| `theAngel.jpg` | The Angel |
| `theInmyfeels.jpg` | The Inmyfeels |
| `theCreative.jpg` | The Creative |
| `theFairy.jpg` | The Fairy |
| `theRecluse.jpg` | The Recluse |
| `theMadScientist.jpg` | The Mad Scientist |
| `theTrickster.jpg` | The Trickster |
| `theDeviant.jpg` | The Deviant |
| `theManipulator.jpg` | The Manipulator |

**PWA icons** — Place in `assets/images/icons/`:
- `icon-192.png` (192×192)
- `icon-512.png` (512×512)

Then restore the icon references in `manifest.json` and re-enable service worker registration in `index.html` (commented block at bottom of `<body>`).

---

## Local Development

No build step required. Open `index.html` directly in a browser, or serve the root with any static file server:

```bash
npx serve .
# or
python -m http.server 8080
```

Service worker registration requires HTTPS or `localhost`. It is disabled by default for v1 — no action needed for local testing.

---

## Tech Stack

- HTML5 / CSS3 / Vanilla JavaScript — no frameworks, no bundler
- [html2canvas](https://html2canvas.hertzen.com/) (CDN) — result card image export
- [Google Fonts](https://fonts.google.com/) (CDN) — VT323, Space Mono, Inter
- Cloudflare Pages — static hosting
