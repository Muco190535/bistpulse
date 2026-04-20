// Rota Borsa tedbirli hisseler scraper
// Kaynak: https://rotaborsa.com/tedbirli-hisseler-2026/
// Günlük güncellenir, VBTS (Volatilite Bazlı Tedbir Sistemi) listesi

const fetch = require('node-fetch');
const cheerio = require('cheerio');

const SOURCE_URL = 'https://rotaborsa.com/tedbirli-hisseler-2026/';
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';

const AYLAR = {
  'ocak':'01','şubat':'02','subat':'02','mart':'03','nisan':'04',
  'mayıs':'05','mayis':'05','haziran':'06','temmuz':'07',
  'ağustos':'08','agustos':'08','eylül':'09','eylul':'09',
  'ekim':'10','kasım':'11','kasim':'11','aralık':'12','aralik':'12'
};

function parseTarih(str) {
  if (!str) return null;
  const temiz = str.replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
  const m = temiz.match(/^(\d{1,2})\s+([a-zçğıöşü]+)$/);
  if (!m) return null;
  const ay = AYLAR[m[2]];
  if (!ay) return null;
  const gun = m[1].padStart(2, '0');
  return `${new Date().getFullYear()}-${ay}-${gun}`;
}

function bugunISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

async function scrapeTedbirli() {
  const res = await fetch(SOURCE_URL, {
    headers: { 'User-Agent': UA, 'Accept': 'text/html,application/xhtml+xml' },
    timeout: 15000
  });
  if (!res.ok) throw new Error(`Rota Borsa HTTP ${res.status}`);
  const html = await res.text();
  const $ = cheerio.load(html);

  const items = [];
  $('.entry-content-inner table').each((_, table) => {
    $(table).find('tbody tr').each((_, row) => {
      const tds = $(row).find('td');
      if (tds.length < 7) return;

      const symbol = $(tds[0]).text().trim().toUpperCase();
      // Header satırını ve geçersiz sembolleri ele
      if (!symbol || !/^[A-ZÇĞİÖŞÜ]{3,6}$/.test(symbol)) return;
      if (symbol.includes('BIST')) return;

      const since = parseTarih($(tds[1]).text());
      const until = parseTarih($(tds[2]).text());
      const acigaSatis = $(tds[3]).text().trim() === 'X';
      const brutTakas = $(tds[4]).text().trim() === 'X';
      const emirPaketi = $(tds[5]).text().trim() === 'X';
      const tekFiyat = $(tds[6]).text().trim() === 'X';

      const reasons = [];
      if (acigaSatis) reasons.push('Açığa Satış & Kredili İşlem');
      if (brutTakas) reasons.push('Brüt Takas');
      if (emirPaketi) reasons.push('Emir Paketi');
      if (tekFiyat) reasons.push('Tek Fiyat');

      items.push({
        symbol,
        reason: reasons.join(' + ') || 'Tedbir',
        since,
        until,
        measures: { acigaSatis, brutTakas, emirPaketi, tekFiyat }
      });
    });
  });

  // Dedup: aynı sembol için en uzak "until" olanı tut
  const unique = {};
  for (const t of items) {
    const cur = unique[t.symbol];
    if (!cur) { unique[t.symbol] = t; continue; }
    if (t.until && (!cur.until || t.until > cur.until)) unique[t.symbol] = t;
  }

  const today = bugunISO();
  const all = Object.values(unique).map(t => ({
    ...t,
    status: (t.until && t.until < today) ? 'expired' : 'active'
  }));

  // Sıralama: aktif önce, sonra bitiş tarihine göre yakından uzağa
  all.sort((a, b) => {
    if (a.status !== b.status) return a.status === 'active' ? -1 : 1;
    return (a.until || '').localeCompare(b.until || '');
  });

  return {
    source: 'rotaborsa.com',
    sourceUrl: SOURCE_URL,
    fetchedAt: new Date().toISOString(),
    total: all.length,
    activeCount: all.filter(t => t.status === 'active').length,
    expiredCount: all.filter(t => t.status === 'expired').length,
    items: all
  };
}

module.exports = { scrapeTedbirli };
