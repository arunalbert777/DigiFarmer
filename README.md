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

## Open in Colab
You can open the provided Colab notebook (scripts/hf_finetune/colab_train.ipynb) with one click using the following badge. Replace OWNER, REPO and BRANCH with your GitHub repository owner, repository name and branch (for example: `main`) if needed.

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/OWNER/REPO/blob/BRANCH/scripts/hf_finetune/colab_train.ipynb)

If your repo is hosted at GitHub under `github.com/your-user/your-repo`, the link becomes:

https://colab.research.google.com/github/your-user/your-repo/blob/main/scripts/hf_finetune/colab_train.ipynb

Clicking the badge will open the notebook in Colab where you can run the download, prepare, train, and push steps (set GPU runtime). If you want, I can update the badge to the exact repository path if you tell me your GitHub username and repository name (or provide the remote URL).
