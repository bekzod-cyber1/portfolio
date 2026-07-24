const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const hostname = '127.0.0.1';
const port = process.env.PORT || 8000;
const rootDir = __dirname;
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp'
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

async function sendTelegramMessage(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.log('Telegram notification skipped. Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID to enable it.');
    console.log(text);
    return { ok: false, skipped: true };
  }

  try {
    console.log('Sending Telegram message to chat ID:', chatId);
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' })
    });

    const data = await response.json();
    console.log('Telegram API response:', { ok: data.ok, status: response.status, description: data.description });
    
    if (!response.ok || !data.ok) {
      console.error('Telegram error:', data.description || 'Unknown error');
      throw new Error(data.description || 'Telegram error');
    }
    
    console.log('✓ Telegram message sent successfully');
    return { ok: true, skipped: false };
  } catch (error) {
    console.error('✗ Telegram message send failed:', error.message);
    throw error;
  }
}

const server = http.createServer(async (req, res) => {
  const reqUrl = new URL(req.url, `http://${req.headers.host || '127.0.0.1'}`);
  const pathname = decodeURIComponent(reqUrl.pathname);

  if (req.method === 'POST' && pathname === '/api/contact') {
    try {
      const body = await readBody(req);
      const data = body ? JSON.parse(body) : {};
      const name = String(data.name || '').trim();
      const email = String(data.email || '').trim();
      const message = String(data.message || '').trim();

      if (!name || !email || !message) {
        return sendJson(res, 400, { ok: false, message: 'Please fill in all fields.' });
      }

      const text = `New portfolio contact request\nName: ${name}\nEmail: ${email}\nMessage: ${message}`;
      await sendTelegramMessage(text);

      return sendJson(res, 200, {
        ok: true,
        message: 'Thanks! Your message was received. I will get back to you soon.'
      });
    } catch (error) {
      console.error(error);
      return sendJson(res, 500, { ok: false, message: 'Something went wrong. Please try again later.' });
    }
  }

  if (req.method === 'GET') {
    let filePath = pathname === '/' ? path.join(rootDir, 'port.html') : path.join(rootDir, pathname);

    if (!filePath.startsWith(rootDir)) {
      res.writeHead(403); res.end('Forbidden'); return;
    }

    fs.stat(filePath, (err, stat) => {
      if (err || !stat.isFile()) {
        res.writeHead(404); res.end('Not found'); return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = mimeTypes[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(filePath).pipe(res);
    });
    return;
  }

  res.writeHead(404); res.end('Not found');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/port.html`);
});
