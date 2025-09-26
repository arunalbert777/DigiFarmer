# Agro-Mentor — Complete Architecture

This document contains the complete architecture overview for Agro-Mentor (AI-powered agricultural PWA). It collects the high-level architecture, diagrams, and pointers to the in-repo diagrams and assets.

## Files with diagrams (in this repository)

- public/diagrams/disease_flowchart.html — interactive SVG flowchart for disease-detection pipeline (open in browser).
- Agro-Mentor_System_Architecture.svg — high-resolution system architecture diagram (vector SVG).
- DigiFarmer_System_Architecture.svg / DigiFarmer_System_Architecture.md — a detailed architecture document (markdown and SVG) included in the repo.

## High-level components

- Frontend: React + TypeScript + Vite (PWA), Tailwind, Radix UI, Framer Motion
- Backend: Express (server) exposed as Netlify Functions via serverless-http
- AI/ML: Hugging Face Inference API (configurable model via HUGGINGFACE_MODEL) for image classification/VQA
- Caching: in-memory LRU / Redis (future) recommended for repeated inference results
- CI/CD & Hosting: GitHub + Netlify (netlify.toml configured)

## Key architecture diagrams

1. System Architecture (vector): `./Agro-Mentor_System_Architecture.svg`
2. Detailed design & textual architecture: `./DigiFarmer_System_Architecture.md`
3. Disease-detection pipeline (interactive HTML/SVG): `./public/diagrams/disease_flowchart.html`

Open the HTML or SVG files locally or in preview to view the diagrams. The disease flowchart can be exported to PNG using the included script `scripts/render_flowchart.js`.

## How to view

- Open `public/diagrams/disease_flowchart.html` in a web browser to view the flowchart.
- Open the SVG files in an image viewer or browser for full-size vector diagrams.
- To generate PNG of the flowchart locally:
  1. npm install puppeteer
  2. node scripts/render_flowchart.js
  3. Output: `public/diagrams/disease_flowchart.png`

---

For further edits to diagrams or architecture, update the SVG/MD files directly and commit. If you want me to generate PNGs or additional export formats here, I can attempt to run the renderer (may require installing puppeteer/playwright and could be blocked by environment constraints).
