require('dotenv').config();
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEB_APP_URL = process.env.WEB_APP_URL || 'https://bistpulse-demo.duckdns.org';

if (!TOKEN) { console.error('TELEGRAM_BOT_TOKEN not set in .env'); process.exit(1); }

const https = require('https');

function sendMessage(chatId, text, options = {}) {
  const data = JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', ...options });
  const req = https.request({
    hostname: 'api.telegram.org', path: `/bot${TOKEN}/sendMessage`, method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': data.length },
  });
  req.write(data); req.end();
}

function pollUpdates(offset = 0) {
  const url = `https://api.telegram.org/bot${TOKEN}/getUpdates?offset=${offset}&timeout=30`;
  https.get(url, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
      try {
        const json = JSON.parse(body);
        if (json.ok && json.result.length > 0) {
          json.result.forEach((update) => {
            const msg = update.message;
            if (msg && msg.text) {
              const chatId = msg.chat.id;
              const name = msg.from.first_name || 'Yatırımcı';
              if (msg.text === '/start' || msg.text.startsWith('/start')) {
                sendMessage(chatId,
                  `Merhaba ${name}! BIST Pulse'a hos geldin.`,
                  { reply_markup: JSON.stringify({ inline_keyboard: [[{ text: 'BIST Pulse Ac', web_app: { url: WEB_APP_URL } }]] }) }
                );
              } else {
                sendMessage(chatId, `Merhaba ${name}!`,
                  { reply_markup: JSON.stringify({ inline_keyboard: [[{ text: 'BIST Pulse Ac', web_app: { url: WEB_APP_URL } }]] }) }
                );
              }
            }
          });
          offset = json.result[json.result.length - 1].update_id + 1;
        }
      } catch (e) { console.error('Parse error:', e.message); }
      setTimeout(() => pollUpdates(offset), 1000);
    });
  }).on('error', (e) => { console.error('HTTP error:', e.message); setTimeout(() => pollUpdates(offset), 5000); });
}

console.log('Bot started');
pollUpdates();
