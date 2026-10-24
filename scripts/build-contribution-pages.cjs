const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const home = fs.readFileSync(path.join(root,'index.html'),'utf8');
const esc = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const p = text => `<p>${text}</p>`;
const list = items => `<ul>${items.map(item=>`<li>${item}</li>`).join('')}</ul>`;
const code = (label,text) => `<figure class="contribution-code"><figcaption>${label}</figcaption><pre tabindex="0" aria-label="${esc(label)}"><code>${esc(text)}</code></pre></figure>`;
const table = (headers,rows) => `<div class="contribution-table-wrap" tabindex="0" role="region" aria-label="Reported contribution validation"><table class="contribution-table"><thead><tr>${headers.map(h=>`<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(cell=>`<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const callout = text => `<aside class="contribution-callout">${text}</aside>`;
const artwork = (src,alt,caption) => {
  const [width,height] = require('./image-dimensions.cjs')(src);
  return `<figure class="contribution-artwork"><img src="${src}" width="${width}" height="${height}" alt="${esc(alt)}" loading="lazy" decoding="async"/><figcaption>${caption}</figcaption></figure>`;
};
const traceDiagram = () => artwork('/assets/pydantic.webp','Logfire illustration: a request trace linked to a separate background-task trace','Separate traces preserve a span link while keeping independent sampling decisions.');
const streamDiagram = () => `<figure class="contribution-diagram"><div class="contribution-flow"><span class="contribution-diagram-node">Slack file URL</span><span class="contribution-diagram-node">Check usable size headers</span><span class="contribution-diagram-node">Read decoded chunks</span><span class="contribution-diagram-node is-accent">Within limit? Append.<br/>Over limit? Stop.</span></div><figcaption>The accumulated-byte check remains authoritative even when size metadata is absent or misleading.</figcaption></figure>`;
const releaseDiagram = () => `<figure class="contribution-diagram"><div class="contribution-release-grid"><div class="contribution-diagram-lane"><strong>Before stable publication</strong><span class="contribution-version is-removed">3.4.0a1 <small>superseded</small></span><span class="contribution-version is-removed">3.4.0b12 <small>superseded</small></span><span class="contribution-version is-removed">3.4.0rc2 <small>superseded</small></span><span class="contribution-version">3.4.1b1 <small>preserve</small></span></div><div class="contribution-diagram-lane"><strong>Publish 3.4.0</strong><span class="contribution-version">3.4.0 <small>stable</small></span><span class="contribution-version">3.4 → 3.4.0 <small>alias</small></span><span class="contribution-version">3.4.1b1 <small>unchanged</small></span></div></div><figcaption>Illustrative inventory: only prereleases for the exact stable version are pruned.</figcaption></figure>`;
const contributions = require('../contributions/contribution-data.cjs')({p,list,code,table,callout,traceDiagram,streamDiagram,releaseDiagram});
const external = 'target="_blank" rel="noopener noreferrer"';
const url = item => `https://github.com/${item.repository}/pull/${item.number}`;
const label = item => item.merged ? 'Merged' : item.state === 'open' ? 'Open PR' : 'Closed';
const badge = item => `<span class="oss-status-group"><span class="oss-status oss-status-${item.merged ? 'merged' : item.state}"><span aria-hidden="true"></span>${label(item)}</span>${item.assigned ? ` <span class="oss-status oss-status-assigned" title="Issue #${item.issue} is assigned to Mahaboob-Ashraf">Assigned</span>` : ''}</span>`;
const date = value => new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(value+'T00:00:00Z'));
let header = home.slice(home.indexOf('<header class="site-header">'),home.indexOf('</header>')+9)
  .replace('class="nav-link is-active" href="#home" aria-current="page"','class="nav-link" href="/"')
  .replace('class="nav-link nav-oss" href="/#oss"','class="nav-link nav-oss is-active" href="/#oss" aria-current="page"')
  .replace('href="#about"','href="/#about"');
const contactStart = home.indexOf('<section id="contact"');
const contact = home.slice(contactStart,home.indexOf('</section>',contactStart)+10);
const footerStart = home.indexOf('<footer class="site-footer">');
const footer = home.slice(footerStart,home.indexOf('</footer>',footerStart)+9)
  .replaceAll('href="#work"','href="/#work"').replaceAll('href="#about"','href="/#about"').replaceAll('href="#experience"','href="/#experience"');
const separator = '<div class="grid-separator" aria-hidden="true"><span class="grid-node grid-node-left"></span><span class="grid-node grid-node-right"></span></div>';
const card = item => `<article class="oss-card"><a class="oss-cover" href="/contributions/${item.slug}" aria-label="Explore ${esc(item.title)}"><img src="${item.cover}" width="1536" height="1024" alt="${esc(item.coverAlt)}" loading="lazy" decoding="async"/></a><div class="oss-card-content"><p class="oss-project">${item.project}</p><h3><a href="/contributions/${item.slug}">${item.title}</a></h3><p class="oss-description">${item.cardDescription}</p><footer class="oss-card-footer"><div class="oss-status-row">${badge(item)}<span class="oss-pr-number">#${item.number}</span></div><div class="oss-card-links"><a class="oss-explore" href="/contributions/${item.slug}">Explore contribution ↗</a><a href="${url(item)}" ${external}>View PR ↗</a></div></footer></div></article>`;

contributions.forEach(item => {
  const sections = item.sections.map((section,index)=>`<section aria-labelledby="article-section-${index+1}"><h2 id="article-section-${index+1}">${section.title}</h2>${section.body}</section>`).join('\n');
  const words = (item.intro+sections).replace(/<[^>]*>/g,' ').split(/\s+/).filter(Boolean).length;
  const readMinutes = Math.max(1,Math.ceil(words/200));
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#fdfef0" />
  <meta name="description" content="${esc(item.description)}" />
  <title>${item.title} — ${item.project} · Mahaboob Ashraf</title>
  <link rel="icon" type="image/png" sizes="64x64" href="/assets/favicon.png" />
  <link rel="preload" href="/assets/fonts/everett-regular.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="/assets/fonts/everett-bold.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="stylesheet" href="/style.css" />
  <link rel="stylesheet" href="/oss.css" />
  <link rel="stylesheet" href="/contact-footer.css" />
  <link rel="stylesheet" href="/white-orange.css" />
  <link rel="stylesheet" href="/link-motion.css" />
  <link rel="stylesheet" href="/contact-links.css" />
    <link rel="stylesheet" href="/contact-dark.css" />
  <script src="/link-motion.js" defer></script>
  <link rel="stylesheet" href="/contribution-page.css" />
  <script src="/project-page.js" defer></script>
  <script src="/faq-motion.js" defer></script>
  <script src="/contribution-motion.js" defer></script>
  <script src="/contact-ghost-fibers.js" defer></script>
  <script src="/contact-footer.js" defer></script><script src="/contact-links.js" defer></script>
</head>
<body class="contribution-page">
  <a class="skip-link" href="#main">Skip to content</a>
  <div class="header-blur" aria-hidden="true"></div>
  <div class="site-frame">
    ${header}
    <main id="main">
      <div class="contribution-frame">
        <article aria-labelledby="contribution-title">
          <header class="contribution-header">
            <img class="contribution-header-art" src="${item.headerArt}" width="1536" height="1024" alt="" aria-hidden="true" fetchpriority="high" />
            <div class="contribution-kicker"><span>${item.project}</span>${badge(item)}</div>
            <h1 id="contribution-title">${item.title}</h1>
            <p class="contribution-summary">${item.description}</p>
            <div class="contribution-meta"><a class="contribution-author" href="/#about"><img src="/assets/mahaboob-ashraf-avatar.jpg" width="30" height="30" alt=""/><span><strong>Mahaboob Ashraf</strong>Open source contribution · ${readMinutes} min read</span></a><div class="contribution-meta-info"><span>PR opened <time datetime="${item.opened}">${date(item.opened)}</time></span><a href="${url(item)}" ${external}>${item.repository} · #${item.number} ↗</a></div></div>
          </header>
          <div class="contribution-body">
            ${item.intro}
            ${item.slug === 'logfire-background-tracing' ? '' : artwork(item.cover,item.coverAlt,item.project + ' · contribution overview')}
            ${sections}
            <div class="contribution-endnote"><a href="${url(item)}" ${external}>View implementation & discussion ↗</a><div class="contribution-share"><button class="project-copy-link" type="button">Copy article link <span aria-hidden="true">↗</span></button><span class="project-copy-status" role="status" aria-live="polite"></span></div><span class="contribution-checked">PR status checked <time datetime="${item.checked}">${date(item.checked)}</time>.</span></div>
            <a class="contribution-author-end" href="/#about"><img src="/assets/mahaboob-ashraf-avatar.jpg" width="36" height="36" alt=""/><span><strong>Mahaboob Ashraf</strong>Software & AI Engineer · Hyderabad, India</span></a>
          </div>
        </article>
        <section class="contribution-faq" aria-labelledby="contribution-faq-title"><h2 id="contribution-faq-title">Frequently asked questions</h2>${item.faqs.map(([question,answer])=>`<details><summary>${question}<span class="contribution-faq-symbol" aria-hidden="true"></span></summary><div class="contribution-faq-answer"><p>${answer}</p></div></details>`).join('')}</section>
        <section class="contribution-related" aria-labelledby="related-title"><h2 id="related-title">More contributions</h2><div class="contribution-related-grid">${contributions.filter(other=>other.slug!==item.slug).map(card).join('')}</div></section>
      </div>
      ${separator}
      ${contact}
      ${separator}
    </main>
    ${footer}
  </div>
</body>
</html>
`;
  fs.writeFileSync(path.join(root,'contributions',item.slug,'index.html'),html.replace(/[ \t]+$/gm,''));
  console.log(`Built /contributions/${item.slug}: ${words} article words, ${label(item)}`);
});
