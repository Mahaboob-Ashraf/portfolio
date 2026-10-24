const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const port = Number(process.env.PORT || 4173);
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.json': 'application/json', '.pdf': 'application/pdf', '.ttf': 'font/ttf', '.woff2': 'font/woff2' };

http.createServer((request, response) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); }
  catch { response.writeHead(400,{'Content-Type':'text/plain; charset=utf-8'}).end('Invalid URL'); return; }
  if (['/contact','/contact/','/contact/index.html'].includes(pathname)) {
    response.writeHead(302,{Location:'/#contact'}).end();
    return;
  }
  const localPath = pathname === '/' ? '/index.html' : pathname.startsWith('/assets/') ? `/public${pathname}` : pathname;
  const documentPath = path.extname(localPath) ? localPath : `${localPath.replace(/\/$/, '')}/index.html`;
  const file = path.resolve(root, `.${documentPath}`);
  if (!file.startsWith(`${root}${path.sep}`)) {
    response.writeHead(403).end();
    return;
  }
  fs.readFile(file, (error, contents) => {
    if (error) {
      if (error.code === 'ENOENT' && (!path.extname(pathname) || pathname.endsWith('.html'))) {
        fs.readFile(path.join(root,'404.html'),(notFoundError,html) => {
          response.writeHead(404,{'Content-Type':'text/html; charset=utf-8'}).end(notFoundError ? 'Page not found' : html);
        });
        return;
      }
      response.writeHead(error.code === 'ENOENT' ? 404 : 500).end();
      return;
    }
    const type = types[path.extname(file)] || 'application/octet-stream';
    response.writeHead(200, { 'Content-Type': type + (/^(text\/|application\/json|image\/svg\+xml)/.test(type) ? '; charset=utf-8' : '') });
    response.end(contents);
  });
}).listen(port, '127.0.0.1', () => console.log(`Preview: http://localhost:${port}`));
