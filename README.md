# İTTA — İslam Tarihyazım Tarihi Atlası

**Atlas of Islamic Historiography** — A digital mapping and analysis platform for the Islamic historiographical tradition.

🌐 **Live:** [https://alicetinkaya76.github.io/islamic-historiography-atlas/](https://alicetinkaya76.github.io/islamic-historiography-atlas/)

## Overview

İTTA is an interactive research platform that visualizes 2,337 historians, 2,249 works, and 3,356 scholarly relations across 8 major regions of the Islamic world (7th–20th century). It combines data from the MHTT project with the TDV Encyclopedia of Islam (DİA) to reveal teacher–student networks, geographic distributions, and genre patterns in Islamic historiography.

## Features

- **Interactive Map** — Leaflet-based geographic visualization with region polygons and city markers
- **Scholar Network** — D3-force directed graph showing teacher–student and contemporaneity relations
- **Teacher–Student Chains** — Multi-generational silsila tree visualization (2–5 generations)
- **Timeline** — Century-based chronological view with brush selection
- **Region Comparison** — Side-by-side statistical comparison of any two regions
- **Statistics Dashboard** — Stacked bar charts, genre distribution, relations overview
- **Global Search** — Fuse.js-powered fuzzy search across scholars and sources
- **Mobile-First UI** — Bottom navigation, card views, bottom sheet, touch-optimized
- **PWA** — Installable, offline-capable with service worker caching
- **Trilingual** — Turkish, English, Arabic with full RTL support
- **Dark Mode** — CSS variable-based theme switching

## Tech Stack

React 19 · Vite 8 · TypeScript · Tailwind v4 · React Router 7 · D3.js 7 · Leaflet · Fuse.js · react-window v2 · react-i18next · vite-plugin-pwa

## Data

| Dataset | Count |
|---------|-------|
| Historians | 2,337 |
| Works | 2,249 |
| Relations | 3,356 |
| DİA matches | 1,127 |
| Cities geocoded | 130+ |
| Regions | 8 |

## Development

```bash
npm install
npm run dev        # dev server
npm run build      # production build
npm run preview    # preview production build
```

## Team

- **Dr. Ali Çetinkaya** — Principal Investigator, Computer Engineering (Selçuk University)
- **Dr. Hüseyin Gökalp** — Domain Expert, Islamic History (Selçuk University)

## License

© 2026 İTTA Project. All rights reserved.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
