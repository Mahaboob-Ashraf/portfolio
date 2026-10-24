const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname,'..');
const home = fs.readFileSync(path.join(root,'index.html'),'utf8');
const esc = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
// The catalogue uses the same metadata as the detailed pages; article renderers are unnecessary here.
const noop = () => '';
const projects = require('../work/project-data.cjs')({p:noop,list:noop,table:noop,image:noop,flow:noop,callout:noop,faq:noop});
const covers = {
  repopilot: {src:'/assets/work/repopilot-plan.webp',headline:'Code repair with evidence and human control',tags:['Python','FastAPI','LangGraph','React']},
  hookrelay: {src:'/assets/work/hookrelay-timeline.webp',headline:'Webhooks that tell the whole delivery story',tags:['TypeScript','PostgreSQL','Redis','BullMQ']},
  amana: {src:'/assets/work/amana-demo.webp',headline:'Giving AI commerce a trustworthy control plane',tags:['Java','Spring Boot','Next.js','Gemini']},
  voteready: {headline:'One household. One clear action plan.',tags:['Next.js','Gemini','Supabase','Prisma']},
  'ps-prep': {headline:'Practise, run, understand. In one place.',tags:['React','Monaco','Piston','Gemini']},
  contextai: {headline:'From noisy conversations to useful context',tags:['Python','PostgreSQL','pgvector','Gemini']}
};
function img(src,alt) {
  const [width,height] = require('./image-dimensions.cjs')(src);
  return `<img src="${src}" width="${width}" height="${height}" alt="${esc(alt)}" loading="lazy" decoding="async"/>`;
}
const header = home.slice(home.indexOf('<header class="site-header">'),home.indexOf('</header>')+9)
  .replace('class="nav-link is-active" href="#home" aria-current="page"','class="nav-link" href="/"')
  .replace('class="nav-link" href="/work"','class="nav-link is-active" href="/work" aria-current="page"')
  .replace('href="#about"','href="/#about"');
const contactStart = home.indexOf('<section id="contact"');
const contact = home.slice(contactStart,home.indexOf('</section>',contactStart)+10);
const footerStart = home.indexOf('<footer class="site-footer">');
const footer = home.slice(footerStart,home.indexOf('</footer>',footerStart)+9)
  .replaceAll('href="#about"','href="/#about"').replaceAll('href="#experience"','href="/#experience"');
const separator = '<div class="grid-separator" aria-hidden="true"><span class="grid-node grid-node-left"></span><span class="grid-node grid-node-right"></span></div>';
const cards = projects.map((project,index)=>{
  const cover = covers[project.id];
  const architecture = project.id === 'amana' ? `<span class="showcase-screen showcase-screen-architecture">${img('/assets/arc.webp','Amana architecture: buyer and merchant agents connected through a trust layer').replace('<img ','<img class="architecture-image" ')}</span>` : project.id === 'ps-prep' ? `<span class="showcase-screen showcase-screen-secondary">${img('/assets/work/ps-prep/topic-lists.webp','PS-Prep Lists topic page with programming challenges grouped by difficulty')}</span>` : '';
  return `<article class="showcase-project work-index-project" data-project="${project.id}" aria-labelledby="${project.id}-title">
    <div class="work-project-heading"><h2 id="${project.id}-title"><a href="/work/${project.id}">${project.title}</a></h2><span>${esc(project.category)}</span></div>
    <a class="showcase-card showcase-card-${project.id}${index%2 ? ' showcase-card-lean-left' : ''}" href="/work/${project.id}" aria-label="Explore ${project.title} case study">
      <span class="showcase-card-surface"><span class="showcase-card-shade" aria-hidden="true"></span><span class="showcase-card-top"><span>${cover.headline}</span><span class="showcase-arrow" aria-hidden="true">↗</span></span>
      <span class="showcase-tilt"><span class="showcase-screen showcase-screen-${project.id}">${img(cover.src || project.preview,cover.src ? `${project.title} application preview` : project.previewAlt)}</span>${architecture}</span></span><span class="view-cursor" aria-hidden="true"></span>
    </a>
    <div class="work-project-copy"><ul class="work-project-tags" aria-label="${project.title} technologies">${cover.tags.map(tag=>`<li>${tag}</li>`).join('')}</ul><p>${esc(project.nextSummary)}</p></div>
  </article>`;
}).join('\n');
fs.mkdirSync(path.join(root,'work'),{recursive:true});
fs.writeFileSync(path.join(root,'work/index.html'),`<!doctype html>
<html lang="en"><head>
  <meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>
  <meta name="theme-color" content="#fdfef0"/>
  <meta name="description" content="Projects by Mahaboob Ashraf: AI applications, backend systems, and useful software. Explore RepoPilot, HookRelay, Amana, VoteReady, PS-Prep, and ContextAI."/>
  <title>Projects — Mahaboob Ashraf · Software & AI Engineer</title><link rel="icon" type="image/png" sizes="64x64" href="/assets/favicon.png" />
  <link rel="preload" href="/assets/fonts/everett-regular.woff2" as="font" type="font/woff2" crossorigin/>
  <link rel="preload" href="/assets/fonts/everett-bold.woff2" as="font" type="font/woff2" crossorigin/>
  <link rel="stylesheet" href="/style.css"/><link rel="stylesheet" href="/contact-footer.css"/><link rel="stylesheet" href="/white-orange.css"/>
  <link rel="stylesheet" href="/link-motion.css" />
  <link rel="stylesheet" href="/contact-links.css" />
    <link rel="stylesheet" href="/contact-dark.css" />
  <script src="/link-motion.js" defer></script><link rel="stylesheet" href="/work-index.css"/>
  <script src="/project-page.js" defer></script><script src="/project-card-motion.js" defer></script><script src="/contact-ghost-fibers.js" defer></script><script src="/contact-footer.js" defer></script><script src="/contact-links.js" defer></script>
</head><body class="work-index-page"><a class="skip-link" href="#main">Skip to content</a><div class="header-blur" aria-hidden="true"></div><div class="site-frame">
${header}<main id="main"><section class="work-index" aria-labelledby="work-index-title">
  <header class="work-index-heading"><p class="work-index-kicker">PROJECTS & EXPERIMENTS</p><h1 id="work-index-title">Things I’ve <em>built.</em></h1><p>AI applications, backend systems, and ideas put to work.</p></header>
  <div class="work-index-grid">${cards}</div>
</section>${separator}${contact}${separator}</main>${footer}</div></body></html>`);
console.log(`Built /work: ${projects.length} projects`);
