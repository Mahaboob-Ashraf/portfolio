const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const p = text => `<p>${text}</p>`;
const list = items => `<ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>`;
const callout = text => `<aside class="project-callout">${text}</aside>`;
const table = (headers, rows, tradeoffs = false) => `<div class="project-table-wrap${tradeoffs ? ' project-tradeoff-wrap' : ''}" tabindex="0" role="region" aria-label="${tradeoffs ? 'Engineering trade-offs' : escape(headers.join(' and '))}"><table class="project-table${tradeoffs ? ' project-table-tradeoffs' : ''}"><thead><tr>${headers.map(header => `<th scope="col">${tradeoffs ? `<span class="table-heading">${header}</span>` : header}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map((cell,index) => `<td>${headers[index] === 'Classification' ? `<span class="project-status-chip" data-status="${String(cell).toLowerCase()}">${cell}</span>` : cell}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
function img(src, alt, extra = '') {
  const [width,height] = require('./image-dimensions.cjs')(src);
  return `<img src="${src}" alt="${escape(alt)}" width="${width}" height="${height}" loading="lazy" decoding="async" ${extra}/>`;
}
const image = (src, alt, caption = '') => `<figure class="project-inline-media">${img(src, alt)}${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`;
const flowNode = (item, index, last) => {
  const tone = last ? 'result' : /checkpoint|approv|review|confirm|limit|validat|bound/i.test(item) ? 'gate' : /gemini|embed|model|fusion/i.test(item) ? 'model' : index === 0 || /sqlite|retriev|context|vector/i.test(item) ? 'source' : 'process';
  return '<div class="project-flow-item" data-tone="'+tone+'">'+item+'</div>';
};
const flow = items => '<div class="project-flow">'+items.map((item,index)=>(index ? '<span class="project-flow-arrow" aria-hidden="true">↓</span>' : '')+(Array.isArray(item) ? '<div class="project-flow-branch">'+item.map(branch=>flowNode(branch,index,false)).join('')+'</div>' : flowNode(item,index,index===items.length-1))).join('')+'</div>';
const faq = items => `<div class="project-faq">${items.map(([question, answer], index) => `<details><summary data-number="Q.${String(index + 1).padStart(2, '0')}">${question}<span class="project-faq-symbol" aria-hidden="true"></span></summary><div class="project-faq-answer"><p>${answer}</p></div></details>`).join('')}</div>`;
const projects = require('../work/project-data.cjs')({ p, list, table, image, flow, callout, faq });

let header = home.slice(home.indexOf('<header class="site-header">'), home.indexOf('</header>') + 9);
header = header
  .replace('class="nav-link is-active" href="#home" aria-current="page"', 'class="nav-link" href="/"')
  .replace('class="nav-link" href="/work"', 'class="nav-link is-active" href="/work" aria-current="page"')
  .replace('href="#about"', 'href="/#about"');
const contactStart = home.indexOf('<section id="contact"');
const contact = home.slice(contactStart, home.indexOf('</section>', contactStart) + 10);
const footerStart = home.indexOf('<footer class="site-footer">');
let footer = home.slice(footerStart, home.indexOf('</footer>', footerStart) + 9);
footer = footer.replaceAll('href="#work"', 'href="/#work"').replaceAll('href="#about"', 'href="/#about"').replaceAll('href="#experience"', 'href="/#experience"');
const separator = '<div class="grid-separator" aria-hidden="true"><span class="grid-node grid-node-left"></span><span class="grid-node grid-node-right"></span></div>';

function abstractArt(project, index) {
  const distinct = require('./project-backgrounds.cjs')[project.id];
  if (distinct) return distinct();
  const palettes = [
    ['#f4dcc5', '#b22b0d', '#ff7044', '#fff4d7'],
    ['#d9e6dc', '#154e49', '#5eaaa0', '#f4f9e7'],
    ['#e7d7c8', '#482d2a', '#c76542', '#fff0ce']
  ];
  const [base, dark, mid, shine] = palettes[index];
  const paths = [
    ['M-250 235C150-190 515 460 935 80S1540 10 1820 270', 'M-220 430C170 20 460 560 870 190S1400-80 1790 70', 'M-120 30C380-200 510 390 1120 210S1550 80 1770 440'],
    ['M-190 310C60-110 620 10 720 260S1110 450 1710-150', 'M-180 430C80 20 560 140 660 380S1180 540 1770-20', 'M-210 180C90-230 650-140 820 120S1180 260 1770-280'],
    ['M-190 80C230 590 400-170 850 190S1350 510 1810 40', 'M-160 220C240 730 440-30 880 340S1400 650 1830 180', 'M-230-80C180 430 380-330 830 30S1300 350 1760-120']
  ][index];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 500" width="1600" height="500"><defs><linearGradient id="ground" x2="1" y2="1"><stop stop-color="${base}"/><stop offset="1" stop-color="#fdfef0"/></linearGradient><linearGradient id="ribbon" x1="0" y1="0" x2=".15" y2="1"><stop stop-color="${shine}"/><stop offset=".17" stop-color="${mid}"/><stop offset=".44" stop-color="${dark}"/><stop offset=".63" stop-color="${mid}"/><stop offset=".76" stop-color="${shine}"/><stop offset="1" stop-color="${dark}"/></linearGradient><filter id="shadow" x="-30%" y="-100%" width="160%" height="300%"><feGaussianBlur stdDeviation="20"/></filter><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter></defs><path fill="url(#ground)" d="M0 0h1600v500H0z"/><g fill="none" stroke-linecap="round" transform="rotate(${index === 1 ? -9 : 6} 800 160)"><g stroke="${dark}" stroke-width="96" opacity=".18" filter="url(#shadow)" transform="translate(0 30)">${paths.map(d => `<path d="${d}"/>`).join('')}</g>${paths.map((d, i) => `<path d="${d}" stroke="url(#ribbon)" stroke-width="${74 - i * 9}" opacity="${.9 - i * .14}"/><path d="${d}" stroke="${shine}" stroke-width="1.5" opacity=".45" transform="translate(0 -${34 - i * 4})"/>`).join('')}</g><path fill="#111" opacity=".045" filter="url(#grain)" d="M0 0h1600v500H0z"/></svg>`;
}

projects.forEach((project, index) => {
  const next = projects[(index + 1) % projects.length];
  const github = `https://github.com/Mahaboob-Ashraf/${project.repository}`;
  const external = 'target="_blank" rel="noopener noreferrer"';
  const stack = project.stack.map(([label, icon]) => {
    const src = icon === 'springboot' ? '/assets/tools/springboot.svg' : `/assets/tools/stack/${icon}.svg`;
    return `<li>${icon ? `<img class="stack-logo" src="${src}" alt="" aria-hidden="true" width="13" height="13" />` : ''}${escape(label)}</li>`;
  }).join('');
  const sections = project.sections.map((section, sectionIndex) => {
    const number = String(sectionIndex + 1).padStart(2, '0');
    const media = section.media;
    return `<section class="project-section" aria-labelledby="section-title-${number}" id="section-${number}"><div class="project-section-label"><div class="project-section-heading"><span class="project-section-number">${number}</span><h2 id="section-title-${number}">${section.title}</h2></div></div><div class="project-section-body">${section.body}</div></section>${media ? `<figure class="project-media">${img(media.src, media.alt)}<figcaption>${media.caption}</figcaption></figure>` : ''}`;
  }).join('\n');
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#fdfef0" />
  <meta name="description" content="${escape(project.summary)}" />
  <link rel="icon" type="image/png" sizes="64x64" href="/assets/favicon.png" />
  <title>${project.title} — Project case study · Mahaboob Ashraf</title>
  <link rel="preload" href="/assets/fonts/everett-regular.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="/assets/fonts/everett-bold.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="stylesheet" href="/style.css" />
  <link rel="stylesheet" href="/contact-footer.css" />
  <link rel="stylesheet" href="/white-orange.css" />
  <link rel="stylesheet" href="/link-motion.css" />
  <link rel="stylesheet" href="/contact-links.css" />
    <link rel="stylesheet" href="/contact-dark.css" />
  <script src="/link-motion.js" defer></script>
  <link rel="stylesheet" href="/project-page.css" />
  <script src="/project-page.js" defer></script>
  <script src="/project-motion.js" defer></script>
  <script src="/faq-motion.js" defer></script>
  <script src="/contact-ghost-fibers.js" defer></script>
  <script src="/contact-footer.js" defer></script><script src="/contact-links.js" defer></script>
</head>
<body class="project-page">
  <a class="skip-link" href="#main">Skip to content</a>
  <div class="header-blur" aria-hidden="true"></div>
  <div class="site-frame">
    ${header}
    <main id="main">
      <article class="project-article" aria-labelledby="project-title">
        <header class="project-intro">
          <img class="project-header-art" src="/assets/work/${project.id}/abstract.svg" width="1600" height="500" alt="" aria-hidden="true" fetchpriority="high" />
          <nav aria-label="Breadcrumb"><ol class="project-breadcrumbs"><li><a href="/">Home</a></li><li><a href="/work">Projects</a></li><li aria-current="page">${project.title}</li></ol></nav>
          <h1 id="project-title">${project.title}</h1>
          <div class="project-intro-bottom"><p class="project-summary">${project.summary}</p></div>
        </header>
        <section class="project-meta" aria-label="Project details">
          <dl class="project-facts"><div><dt>Type</dt><dd>${project.type}</dd></div><div><dt>Role</dt><dd>${project.role}</dd></div><div><dt>Source</dt><dd><a href="${github}" ${external}>GitHub ↗</a></dd></div><div><dt>${project.live ? 'Visit' : 'Scope'}</dt><dd>${project.live ? `<a href="${project.live}" ${external}>Live product ↗</a>` : project.scope}</dd></div></dl>
          <div class="project-stack"><h2>Tech stack</h2><ul class="project-stack-list">${stack}</ul></div>
        </section>
        ${sections}
        <div class="project-source-note"><span>Project details and measurements from the <a href="${github}/blob/main/README.md" ${external}>repository README ↗</a>.</span><span>Checked ${project.checked || '23 October 2026'}</span></div>
        <nav class="project-next-panel" aria-label="Next project"><a class="project-next" href="/work/${next.id}" aria-labelledby="next-project-title"><div class="project-next-copy"><span class="project-next-label">UP NEXT · ${String((index + 1) % projects.length + 1).padStart(2,'0')} / ${String(projects.length).padStart(2,'0')}</span><h2 id="next-project-title">${next.title}</h2><p>${next.nextSummary}</p><span class="project-next-cta">Explore project <span aria-hidden="true">↗</span></span></div><span class="project-next-visual">${img(next.preview,next.previewAlt)}</span></a></nav>
      </article>
      ${separator}
      ${contact}
      ${separator}
    </main>
    ${footer}
  </div>
</body>
</html>
`;
  fs.mkdirSync(path.join(root,'work',project.id),{recursive:true});
  fs.writeFileSync(path.join(root,'work',project.id,'index.html'),html);
  fs.writeFileSync(path.join(root,'public','assets','work',project.id,'abstract.svg'),abstractArt(project,index));
  console.log(`Built /work/${project.id}: ${project.sections.length} sections`);
});
