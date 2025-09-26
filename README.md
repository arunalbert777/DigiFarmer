# Agro-Mentor

AI-powered agricultural PWA — disease detection, expert consultation, community and marketplace.

## Docs
- Architecture overview: docs/ARCHITECTURE_COMPLETE.md
- Repository file structure: docs/FILE_STRUCTURE.md
- Disease-detection flowchart (interactive): public/diagrams/disease_flowchart.html

## Generate flowchart PNG
1. npm install puppeteer
2. node scripts/render_flowchart.js
Output: public/diagrams/disease_flowchart.png

## Deploy
- This project is configured for deployment on Netlify (see netlify.toml).
- Push changes and use the platform UI to set environment variables (HUGGINGFACE_API_KEY, HUGGINGFACE_MODEL) and trigger a deploy.

## Quick start
1. npm install
2. npm run dev

For more details, see docs/ARCHITECTURE_COMPLETE.md and docs/FILE_STRUCTURE.md.
