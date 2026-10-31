import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, resolve, sep } from 'node:path';

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

function readCommandLineArguments() {
  const argumentsList = process.argv.slice(2);
  const readValue = (name, fallback) => {
    const argumentIndex = argumentsList.indexOf(name);
    return argumentIndex >= 0 ? argumentsList[argumentIndex + 1] : fallback;
  };
  return {
    host: readValue('--host', '0.0.0.0'),
    port: Number(readValue('--port', '7100')),
  };
}

const projectRoot = resolve(import.meta.dirname, '..');
const { host, port } = readCommandLineArguments();

const server = createServer((request, response) => {
  let requestPath;
  try {
    requestPath = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  } catch {
    response.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Bad request');
    return;
  }
  if (requestPath === '/tactical-friend/3d') requestPath += '/';
  if (requestPath.startsWith('/tactical-friend/3d/')) requestPath = '/maps-3d/' + requestPath.slice('/tactical-friend/3d/'.length);
  else if (requestPath.startsWith('/tactical-friend/')) requestPath = requestPath.slice('/tactical-friend'.length);
  const relativePath = requestPath === '/' ? 'index.html' : requestPath.replace(/^\/+/, '').replace(/\/$/, '/index.html');
  const absolutePath = resolve(projectRoot, relativePath);
  const isInsideProject = absolutePath === projectRoot || absolutePath.startsWith(`${projectRoot}${sep}`);

  if (!isInsideProject || !existsSync(absolutePath) || !statSync(absolutePath).isFile()) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
    return;
  }

  response.writeHead(200, {
    'Content-Type': mimeTypes[extname(absolutePath)] || 'application/octet-stream',
    'Cache-Control': 'no-cache',
  });
  createReadStream(absolutePath).pipe(response);
});

server.listen(port, host, () => {
  console.log(`Development server available at http://${host}:${server.address().port}/`);
});
