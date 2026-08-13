# HH Goa 2026 — Frame Your Builder

A mobile-first web app for the HH Goa 2026 shortlisting task. Upload a photo, get an
instant branded PFP frame (or an optional Builder ID card), download it, and share to X.
Everything runs client-side — no login, no backend, no database.

## Features

- **PFP Frame mode** — upload a photo, get a square HH Goa 2026 branded frame in seconds.
- **Builder ID mode** — add your name, stack/role, and optional X/GitHub handles to
  generate an event-style builder pass, complete with an auto-generated builder title
  (e.g. "Full Stack" → *THE SHIP-IT ARCHITECT*).
- 100% client-side image processing via `<canvas>` — photos never leave the browser.
- Smart auto square-crop that keeps portrait subjects centered without a manual crop step.
- One-tap PNG download and a pre-filled X share intent.
- Fully responsive, from 320px phones to desktop, with visible focus states and
  screen-reader-friendly controls.

## Tech stack

React 18 · TypeScript · Vite · Tailwind CSS · Framer Motion · lucide-react

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL (typically `http://localhost:5173`).

## Production build

```bash
npm run build
npm run preview
```

`npm run build` type-checks the project and outputs a production bundle to `dist/`.

## Deploying to Vercel

1. Push this project to a Git repository (GitHub/GitLab/Bitbucket).
2. Import the repo in Vercel.
3. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
4. Deploy — no environment variables are required.

Or via the CLI:

```bash
npm i -g vercel
vercel
```

## Project structure

```
src/
  components/
    Hero.tsx            Landing page hero + mode toggle
    UploadZone.tsx       Drag-and-drop / tap-to-browse photo upload
    BuilderCard.tsx       Builder ID details form
    FramePreview.tsx      Animated processing/loading screen
    ResultScreen.tsx      Final result display
    ShareButtons.tsx      Download / Share to X / Create another
    Footer.tsx             Small persistent footer
  utils/
    imageProcessor.ts      File validation, decoding, smart square-crop
    frameRenderer.ts        Canvas rendering of the PFP frame & builder card
    builderTitles.ts        Deterministic stack → builder title mapping
    share.ts                 PNG download + X share intent helpers
  types.ts
  App.tsx
  main.tsx
  index.css
```

## Replacing placeholder branding

No official HH Goa 2026 logo asset was available at build time, so branding is a tasteful
text treatment ("HH GOA 2026") drawn directly in `src/utils/frameRenderer.ts` and
`src/components/Hero.tsx`. To drop in an official logo:

1. Add the asset to `src/assets/`.
2. In `frameRenderer.ts`, replace the `HH GOA 2026` badge text block (search for
   `badgeText`) with a `ctx.drawImage(...)` call using a preloaded `HTMLImageElement`.
3. In `Hero.tsx`, swap the `H` monogram square for an `<img>` of the logo.

## Notes on X sharing

X's web intent (`twitter.com/intent/tweet`) can only pre-fill text — it cannot attach a
locally generated image without a public image URL and API-level posting, which would
require a backend and user auth. The app downloads the PNG first, then opens the X
compose window with the caption pre-filled; the user attaches the already-downloaded
image manually. This is called out in the UI after download.

## Privacy

Photos are decoded and processed entirely in the browser via Canvas. Nothing is uploaded
to a server, and nothing is stored beyond the current session.
