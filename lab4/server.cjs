const {createServer} = require('node:http');
const {readFile} = require('node:fs/promises');
const {join} = require('node:path');

const html = 'text/html; charset=utf-8';
const files = new Map([
  ['index.html', html],
  ['criminals.html', html],
  ['dossier.html', html],
  ['report.html', html],
  ['style.css', 'text/css; charset=utf-8'],
  ['case-report.js', 'text/javascript; charset=utf-8'],
  ['report.js', 'text/javascript; charset=utf-8'],
  ['images/rannikov.png', 'image/png'],
  ['images/stepochkin.jpg', 'image/jpeg'],
]);

async function acceptReport(request, response) {
  let body = '';
  request.setEncoding('utf8');
  for await (const chunk of request) {
    if (body.length + chunk.length > 4096) {
      response.writeHead(413).end();
      return;
    }
    body += chunk;
  }

  try {
    const {caseNumber, message, confirmed} = JSON.parse(body) ?? {};
    const valid = Number.isInteger(caseNumber) && caseNumber >= 1 && caseNumber <= 4
      && typeof message === 'string' && message.trim() && message.length <= 250
      && confirmed === true;
    response.writeHead(valid ? 204 : 400).end();
  } catch {
    response.writeHead(400).end();
  }
}

const server = createServer(async (request, response) => {
  try {
    const {pathname} = new URL(request.url, 'http://localhost');
    if (request.method === 'POST' && pathname === '/api/reports') {
      await acceptReport(request, response);
      return;
    }

    const file = pathname.slice(1) || 'index.html';
    const contentType = files.get(file);
    if (request.method !== 'GET' || !contentType) {
      response.writeHead(404).end();
      return;
    }

    const content = await readFile(join(__dirname, file));
    response.writeHead(200, {'Content-Type': contentType}).end(content);
  } catch {
    response.writeHead(500).end();
  }
});

server.listen(Number(process.env.PORT ?? 3000), '127.0.0.1', () => {
  console.log(`http://127.0.0.1:${server.address().port}/`);
});
