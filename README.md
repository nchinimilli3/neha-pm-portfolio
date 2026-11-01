# Neha Chinimilli - Portfolio

Vite + React portfolio for product, strategy, and consulting recruiting. Live at https://nehachinimilli.com/.

## Local run

```bash
npm install
npm run dev
```

## Production check

```bash
npm run build
npm run preview
npm run test:loading
```

## Deploy

Every push to `main` builds the site and publishes it to GitHub Pages (`.github/workflows/deploy.yml`). The build output in `dist/` is generated, not committed. Vite uses a relative asset base so the build works at either a user-site root or repository subpath.

## Layout

- `src/` – the app, one component and stylesheet per section or case study
- `public/` – images, fonts, and files served as-is (e.g. `Neha_Chinimilli_Resume.pdf`)
- `tests/` – loading checks run by `npm run test:loading`
- `docs/` – loading and performance audit notes
