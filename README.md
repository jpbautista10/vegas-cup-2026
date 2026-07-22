# Vegas Cup 2026 Tournament Tracker

Client-side house World Cup tracker for a 2-day party with 9 teams. No backend — all progress lives in your browser.

## Quick start

```bash
npm install
npm run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

## Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Follow the prompts. Zero config — Vite’s `dist/` output is what Vercel serves.

Or connect the GitHub repo in the Vercel dashboard and deploy automatically on push.

## Data & backups

- Tournament state is saved to **localStorage** under the key `vegascup2026_v1` after every change.
- **Refreshing the page keeps your progress** on that same browser/device.
- Data does **not** sync across phones/TVs automatically. Use **Setup → Export backup** (especially at the end of Day 1) and **Import backup** on another device.

## Stack

- Vite + React + Tailwind CSS
- Fully client-side; optional Ref PIN for score entry
