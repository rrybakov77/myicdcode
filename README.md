# myICDCode.com — Full Source

ICD-10-CM diagnosis code lookup site. Vite + React.

## Project structure
src/
  components/   Navbar, Footer, CodeCard
  pages/        Home, Search, CodeDetail, Browse, About
  data/         sampleCodes.js (9 demo codes), search.js
public/
  .htaccess     SPA routing for Hostinger

## Local dev setup (IntelliJ)
1. File → Open → select the myicdcode/ folder
2. Open Terminal inside IntelliJ
3. npm install
4. npm run dev
5. Open http://localhost:5173

## Build for production
npm run build
→ outputs to dist/

## Deploy to Hostinger via GitHub
1. Push source to GitHub repo
2. In Hostinger: connect GitHub repo
3. Set build command: npm run build
4. Set output directory: dist
5. Deploy

OR manually: upload contents of dist/ to public_html/

## Data
Currently uses 9 sample codes in src/data/sampleCodes.js
Production: replace with full 70,543-code CMS dataset (Phase 2)

## Tech stack
- Vite 6 + React 19
- React Router DOM v7
- CSS Modules
- DM Sans + DM Mono fonts (Google Fonts)

## Built by
StormGlass Interactive Inc.
support@stormglassinteractive.com
