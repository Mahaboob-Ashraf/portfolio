const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname,'..');
const pages = ['index.html','404.html'];
const errors = [];
function collect(directory) {
  for (const entry of fs.readdirSync(path.join(root,directory),{withFileTypes:true})) {
    const relative = path.join(directory,entry.name);
    if (entry.isDirectory()) collect(relative);
    else if (entry.name.endsWith('.html')) pages.push(relative);
  }
}
['work','contributions'].forEach(collect);
const ids = new Map();
for (const page of pages) {
  const html = fs.readFileSync(path.join(root,page),'utf8');
  const values = [...html.matchAll(/\sid="([^"]+)"/g)].map(match=>match[1]);
  ids.set(path.join(root,page),new Set(values));
  if (new Set(values).size !== values.length) errors.push(`${page}: duplicate IDs`);
  if ((html.match(/<h1\b/g)||[]).length !== 1) errors.push(`${page}: expected one h1`);
}
let references = 0;
function checkReference(value,source) {
  if (/^(?:data:|https?:|mailto:|tel:)/i.test(value)) return;
  const base = '/' + source.replaceAll(path.sep,'/').replace(/index\.html$/,'');
  const url = new URL(value,`https://portfolio.local${base}`);
  const local = url.pathname.startsWith('/assets/') ? '/public'+url.pathname : path.extname(url.pathname) ? url.pathname : url.pathname.replace(/\/$/,'')+'/index.html';
  const file = path.join(root,decodeURIComponent(local));
  references++;
  if (!fs.existsSync(file)) { errors.push(`${source}: missing ${value}`); return; }
  if (url.hash && ids.has(file) && !ids.get(file).has(decodeURIComponent(url.hash.slice(1)))) errors.push(`${source}: missing anchor ${value}`);
}
for (const page of pages) {
  const html = fs.readFileSync(path.join(root,page),'utf8');
  for (const match of html.matchAll(/\s(?:src|href)="([^"]+)"/g)) checkReference(match[1],page);
}
for (const css of fs.readdirSync(root).filter(name=>name.endsWith('.css'))) {
  for (const match of fs.readFileSync(path.join(root,css),'utf8').matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)) {
    if (!match[1].startsWith('#')) checkReference(match[1],css);
  }
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else console.log(`Checked ${pages.length} pages and ${references} local references: no missing assets, broken anchors, duplicate IDs, or heading-count errors.`);
