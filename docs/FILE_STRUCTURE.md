# Repository File Structure

This is a generated overview of the repository file structure for Agro-Mentor.

.
├─ AGENTS.md
├─ Agro-Mentor_System_Architecture.svg
├─ DigiFarmer_System_Architecture.md
├─ DigiFarmer_System_Architecture.svg
├─ components.json
├─ index.html
├─ netlify.toml
├─ package.json
├─ postcss.config.js
├─ tailwind.config.ts
├─ tsconfig.json
├─ vite.config.server.ts
├─ vite.config.ts
├─ scripts/
│ └─ render_flowchart.js
├─ public/
│ ├─ diagrams/
│ │ └─ disease_flowchart.html
│ ├─ icons/
│ │ ├─ README.md
│ │ ├─ icon-192x192.svg
│ │ └─ icon-512x512.svg
│ ├─ browserconfig.xml
│ ├─ favicon.ico
│ ├─ manifest.json
│ ├─ placeholder.svg
│ ├─ robots.txt
│ └─ sw.js
├─ client/
│ ├─ App.tsx
│ ├─ global.css
│ ├─ main.tsx
│ ├��� vite-env.d.ts
│ ├─ models/
│ │ └─ types.ts
│ ├─ translations/
│ │ ├─ en.ts
│ │ └─ kn.ts
│ ├─ pages/
│ │ ├─ AIChat.tsx
│ │ ├─ Community.tsx
│ │ ├─ ContractFarming.tsx
│ │ ├─ Developers.tsx
│ │ ├─ DiseaseDetection.tsx
│ │ ├─ ExpertConsultation.tsx
│ │ ├─ GeminiVoice.tsx
│ │ ├─ Index.tsx
│ │ ├─ Marketplace.tsx
│ │ ├─ News.tsx
│ │ ├─ NotFound.tsx
│ │ └─ VerticalFarming.tsx
│ ├─ components/
│ │ ├─ AddProductForm.tsx
│ │ ├─ InstallPrompt.tsx
│ │ ├─ LanguageSelector.tsx
│ │ ├─ Navigation.tsx
│ │ ├─ PWAInstallButton.tsx
│ │ ├─ ProductCard.tsx
│ │ └─ ProductFilters.tsx
│ ├─ components/ui/
│ │ ├─ (UI primitives & atoms: accordion, alert, badge, button, card, etc.)
│ ├─ contexts/
│ │ ├─ AppContext.tsx
│ │ └─ LanguageContext.tsx
│ ├─ controllers/
│ │ ├─ useMarketPriceController.ts
│ │ ├─ useMarketplaceController.ts
│ │ └─ useNewsController.ts
│ ├─ hooks/
│ │ ├─ use-mobile.tsx
│ │ ├─ use-toast.ts
│ │ └─ usePWA.ts
│ ├─ lib/
│ │ ├─ utils.spec.ts
│ │ └─ utils.ts
│ └─ services/
│ ├─ ApiService.ts
│ ├─ DiseaseDetectionService.ts
│ ├─ ExpertService.ts
│ ├─ MarketPriceService.ts
│ ├─ MarketplaceService.ts
│ └─ NewsService.ts
├─ server/
│ ├─ index.ts
│ ├─ node-build.ts
│ └─ routes/
│ ├─ demo.ts
│ ├─ disease.ts
│ ├─ gemini.ts
│ └─ geminiStream.ts
├─ netlify/
│ └─ functions/
│ ├─ api.ts
│ ├─ gemini-chat.js
│ └─ gemini-proxy.js
├─ shared/
│ └─ api.ts
└─ docs/
├─ ARCHITECTURE_COMPLETE.md
└─ FILE_STRUCTURE.md

Notes:

- UI primitives live in `client/components/ui/` — see the directory for specific atom/component files.
- The disease detection API is at `server/routes/disease.ts` and proxied by `netlify/functions/api.ts`.
- Diagrams are in `public/diagrams/`.

To publish these files to GitHub, commit & push them from your environment or use the project UI's Push button.
