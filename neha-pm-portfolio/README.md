# Neha Chinimilli — Product + Technology Portfolio

A GitHub-ready React + Vite portfolio focused on three strong pieces of evidence rather than a large project archive.

## Run locally

```bash
npm install
npm run dev
```

## Build for production

```bash
npm run build
```

The generated static site will be in `dist/`.

## Suggested GitHub workflow

```bash
git init
git add .
git commit -m "Build PM portfolio v1"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/neha-pm-portfolio.git
git push -u origin main
```

## Deploy options

### GitHub Pages
Use the official GitHub Pages + Actions workflow for Vite, or deploy the `dist/` output.

### Vercel / Netlify
Import the GitHub repo, use build command `npm run build`, and output directory `dist`.

## Before publishing

- Replace the placeholder contact email in `src/main.jsx` if needed.
- Add your current resume as `public/resume.pdf`, then change/add the nav CTA to `/resume.pdf`.
- Replace any simplified case-study copy with confidential-safe wording you are comfortable publishing.
- Add analytics only if you actually plan to use them.
