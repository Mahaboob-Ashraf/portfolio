const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname,'..');
const home = fs.readFileSync(path.join(root,'index.html'),'utf8');
const header = home.slice(home.indexOf('<header class="site-header">'),home.indexOf('</header>')+9)
  .replace('class="nav-link is-active" href="#home" aria-current="page"','class="nav-link" href="/"')
  .replace('href="#about"','href="/#about"')
  .replace('href="#contact"','href="/#contact"');
fs.writeFileSync(path.join(root,'404.html'),`<!doctype html>
<html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><meta name="theme-color" content="#fdfef0"/><meta name="robots" content="noindex"/><title>Page not found — Mahaboob Ashraf</title><link rel="icon" type="image/png" sizes="64x64" href="/assets/favicon.png" /><link rel="stylesheet" href="/style.css"/><link rel="stylesheet" href="/white-orange.css"/>
  <link rel="stylesheet" href="/link-motion.css" />
  <script src="/link-motion.js" defer></script><link rel="stylesheet" href="/not-found.css"/><script src="/project-page.js" defer></script></head>
<body class="not-found-page"><a class="skip-link" href="#main">Skip to content</a><div class="header-blur" aria-hidden="true"></div><div class="site-frame">${header}<main id="main"><section class="not-found" aria-labelledby="not-found-title"><p class="not-found-label">404 / PAGE NOT FOUND</p><h1 id="not-found-title">This page isn’t here.</h1><p>The link may have changed. You can explore my projects or head back home.</p><div class="not-found-actions"><a href="/work">Explore projects <span aria-hidden="true">↗</span></a><a href="/">Back to home</a></div></section></main></div></body></html>`);
console.log('Built /404.html');
