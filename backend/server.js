const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const { scrapeTedbirli } = require('./tedbirli');
const { scrapeStockList, fetchHistoricalData } = require('./isyatirim');
const { fetchQuote, fetchQuotesParallel } = require('./yahoo');

const app = express();
app.use(cors());
app.use(express.json());

// ============================================
// CACHE (basit in-memory)
// ============================================
const cache = {};
function gc(k, maxAgeMs) {
  const i = cache[k];
  if (!i) return null;
  if (Date.now() - i.ts > maxAgeMs) { delete cache[k]; return null; }
  return i.data;
}
function sc(k, d) { cache[k] = { data: d, ts: Date.now() }; }

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';

// ============================================
// STOCK LIST + LIVE PRICES (background worker)
// ============================================
// Hisse metadata (isim, sektör, piyasa değeri) — 24 saatte bir yenile
let STOCK_METADATA = { items: [], total: 0, fetchedAt: null };
// Live fiyatlar — 60 saniyede bir yenile
let LIVE_PRICES = { items: [], total: 0, failed: [], fetchedAt: null, inProgress: false };

async function refreshStockMetadata() {
  try {
    console.log('[metadata] Scraping İş Yatırım stock list...');
    const t0 = Date.now();
    const result = await scrapeStockList();
    STOCK_METADATA = {
      items: result.items,
      total: result.total,
      fetchedAt: result.fetchedAt,
    };
    console.log(`[metadata] OK: ${result.total} stocks in ${Date.now()-t0}ms`);
  } catch (e) {
    console.error('[metadata] ERROR:', e.message);
  }
}

async function refreshLivePrices() {
  if (LIVE_PRICES.inProgress) return; // Çakışmayı önle
  if (!STOCK_METADATA.items.length) {
    console.log('[prices] Metadata boş, önce metadata yenileniyor...');
    await refreshStockMetadata();
  }
  if (!STOCK_METADATA.items.length) return; // hala boşsa çık

  LIVE_PRICES.inProgress = true;
  try {
    const symbols = STOCK_METADATA.items.map(i => i.symbol);
    const t0 = Date.now();
    const r = await fetchQuotesParallel(symbols, { batchSize: 30, delayMs: 500 });
    console.log(`[prices] OK: ${r.successful.length}/${symbols.length} in ${r.totalMs}ms`);

    // Yahoo fiyatını metadata ile birleştir (isim, sektör vs ekle)
    const metaMap = {};
    for (const m of STOCK_METADATA.items) metaMap[m.symbol] = m;

    const enriched = r.successful.map(q => {
      const m = metaMap[q.symbol] || {};
      return {
        ...q,
        // Metadata'dan zenginleştir
        nameTR: m.name || q.name,       // İş Yatırım'ın Türkçe ismi
        sector: m.sector || '',
        marketCapMN: m.marketCapMN || 0,
        marketCapUSD: m.marketCapUSD || 0,
        freeFloatPct: m.freeFloatPct || 0,
        capitalMN: m.capitalMN || 0,
      };
    });

    LIVE_PRICES = {
      items: enriched,
      total: enriched.length,
      failed: r.failed,
      fetchedAt: new Date().toISOString(),
      inProgress: false,
    };
  } catch (e) {
    console.error('[prices] ERROR:', e.message);
    LIVE_PRICES.inProgress = false;
  }
}

// Startup: metadata + prices çek
(async () => {
  await refreshStockMetadata();
  await refreshLivePrices();
  // Schedule: metadata günde 1, prices her 60 saniye
  setInterval(refreshStockMetadata, 24 * 60 * 60 * 1000);
  setInterval(refreshLivePrices, 60 * 1000);
})();

// ============================================
// TEKNİK ANALİZ (İş Yatırım HisseTekil verisi üzerinden)
// ============================================
function calcEMA(d, p) { const v = d.filter(x => x != null); if (v.length < p) return v; const k = 2/(p+1); const r = [v[0]]; for (let i = 1; i < v.length; i++) r.push(v[i]*k + r[i-1]*(1-k)); return r; }
function calcRSI(d, p) { p = p || 14; const v = d.filter(x => x != null); if (v.length < p+1) return 50; let g = 0, l = 0; for (let i = v.length-p; i < v.length; i++) { const df = v[i] - v[i-1]; if (df > 0) g += df; else l += Math.abs(df); } const ag = g/p, al = l/p; if (al === 0) return 100; return parseFloat((100 - (100/(1 + ag/al))).toFixed(1)); }
function calcMACD(d) { const v = d.filter(x => x != null); if (v.length < 26) return { macd: 0, signal: 0, histogram: 0, trend: 'neutral' }; const e12 = calcEMA(v, 12), e26 = calcEMA(v, 26); const len = Math.min(e12.length, e26.length); const ml = []; for (let i = 0; i < len; i++) ml.push(e12[e12.length-len+i] - e26[e26.length-len+i]); const sl = calcEMA(ml, 9); const mv = ml[ml.length-1] || 0, sv = sl[sl.length-1] || 0; return { macd: parseFloat(mv.toFixed(3)), signal: parseFloat(sv.toFixed(3)), histogram: parseFloat((mv-sv).toFixed(3)), trend: mv > sv ? 'bullish' : 'bearish' }; }
function calcBollinger(d, p) { p = p || 20; const v = d.filter(x => x != null); if (v.length < p) return { upper: 0, middle: 0, lower: 0, bandwidth: 0 }; const s = v.slice(-p); const mean = s.reduce((a, b) => a+b, 0)/s.length; const std = Math.sqrt(s.reduce((a, b) => a + Math.pow(b-mean, 2), 0)/s.length); return { upper: parseFloat((mean + 2*std).toFixed(2)), middle: parseFloat(mean.toFixed(2)), lower: parseFloat((mean - 2*std).toFixed(2)), bandwidth: std > 0 ? parseFloat(((4*std/mean)*100).toFixed(2)) : 0 }; }

async function technicals(symbol) {
  const ck = `tech_${symbol}`;
  const cc = gc(ck, 5 * 60 * 1000);
  if (cc) return cc;
  try {
    // İş Yatırım'dan 180 gün tarihsel çek
    const historical = await fetchHistoricalData(symbol, 180);
    if (historical.length < 20) return null;
    const closes = historical.map(h => h.close).filter(c => c != null);
    if (closes.length < 20) return null;

    const e20 = calcEMA(closes, 20);
    const e50 = calcEMA(closes, 50);
    const e200 = calcEMA(closes, Math.min(200, closes.length));
    const last = closes[closes.length - 1];
    const le20 = e20[e20.length - 1];
    const le50 = e50[e50.length - 1];
    const le200 = e200[e200.length - 1];
    const rsiV = calcRSI(closes, 14);
    const macdV = calcMACD(closes);
    const bbV = calcBollinger(closes, 20);

    let score = 0;
    if (last > le20) score++;
    if (last > le50) score++;
    if (last > le200) score++;
    if (rsiV > 40 && rsiV < 70) score++;
    if (macdV.trend === 'bullish') score++;

    let signal = 'neutral';
    if (score >= 5) signal = 'strong_buy';
    else if (score >= 4) signal = 'buy';
    else if (score <= 1) signal = 'strong_sell';
    else if (score <= 2) signal = 'sell';

    const result = {
      symbol,
      rsi: rsiV,
      macd: macdV,
      bollinger: bbV,
      ema20: parseFloat(le20.toFixed(2)),
      ema50: parseFloat(le50.toFixed(2)),
      ema200: parseFloat(le200.toFixed(2)),
      emaAligned: le20 > le50 && le50 > le200,
      signal,
      score,
      dataPoints: closes.length,
    };
    sc(ck, result);
    return result;
  } catch (e) {
    console.error(`[technicals] ${symbol}:`, e.message);
    return null;
  }
}

// ============================================
// DÖVİZ (Yahoo FX)
// ============================================
async function fetchCurrency() {
  const cc = gc('currency', 3 * 60 * 1000);
  if (cc) return cc;
  const result = { lastUpdated: new Date().toISOString(), goldOz: 0, gramGold: 0 };
  for (const p of [{s: 'USDTRY=X', k: 'usdtry'}, {s: 'EURTRY=X', k: 'eurtry'}, {s: 'GBPTRY=X', k: 'gbptry'}]) {
    try {
      const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${p.s}?interval=1m&range=1d`, { headers: { 'User-Agent': UA }, timeout: 8000 });
      if (!res.ok) continue;
      const m = (await res.json()).chart?.result?.[0]?.meta;
      if (m) {
        const price = m.regularMarketPrice || 0;
        const prev = m.previousClose || m.chartPreviousClose || price;
        result[p.k] = { value: parseFloat(price.toFixed(4)), change: prev > 0 ? parseFloat((((price-prev)/prev)*100).toFixed(2)) : 0 };
      }
    } catch (e) {}
    await new Promise(r => setTimeout(r, 150));
  }
  try {
    const gRes = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/GC=F?interval=1m&range=1d', { headers: { 'User-Agent': UA }, timeout: 5000 });
    const gm = (await gRes.json()).chart?.result?.[0]?.meta;
    if (gm) {
      result.goldOz = parseFloat((gm.regularMarketPrice || 0).toFixed(2));
      result.gramGold = parseFloat(((result.goldOz * (result.usdtry?.value || 44.8)) / 31.1035).toFixed(2));
    }
  } catch (e) {}
  if (!result.usdtry) result.usdtry = { value: 0, change: 0 };
  if (!result.eurtry) result.eurtry = { value: 0, change: 0 };
  if (!result.gbptry) result.gbptry = { value: 0, change: 0 };
  sc('currency', result);
  return result;
}

// ============================================
// ENDEKSLER (Yahoo)
// ============================================
async function fetchIndices() {
  const cc = gc('indices', 60 * 1000);
  if (cc) return cc;
  const syms = [
    { s: 'XU100.IS', n: 'BIST 100' },
    { s: 'XU050.IS', n: 'BIST 50' },
    { s: 'XU030.IS', n: 'BIST 30' },
    { s: '^GSPC', n: 'S&P 500' },
    { s: 'GC=F', n: 'Altın (oz)' },
  ];
  const results = [];
  for (const idx of syms) {
    try {
      const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${idx.s}?interval=1m&range=1d`, { headers: { 'User-Agent': UA }, timeout: 8000 });
      if (!res.ok) continue;
      const m = (await res.json()).chart?.result?.[0]?.meta;
      if (m) {
        const price = m.regularMarketPrice || 0;
        const prev = m.previousClose || m.chartPreviousClose || price;
        results.push({
          name: idx.n, symbol: idx.s,
          value: price, previousClose: prev,
          change: prev > 0 ? parseFloat((((price-prev)/prev)*100).toFixed(2)) : 0,
          dayHigh: m.regularMarketDayHigh || 0, dayLow: m.regularMarketDayLow || 0,
        });
      }
    } catch (e) {}
    await new Promise(r => setTimeout(r, 200));
  }
  if (results.length > 0) sc('indices', results);
  return results;
}

// ============================================
// KAP (Google News RSS — future: kap.org.tr)
// ============================================
async function fetchKAP() {
  const cc = gc('kap', 5 * 60 * 1000);
  if (cc) return cc;
  try {
    const res = await fetch('https://news.google.com/rss/search?q=KAP+bildirim+borsa&hl=tr&gl=TR&ceid=TR:tr', { headers: { 'User-Agent': UA }, timeout: 12000 });
    if (!res.ok) return [];
    const xml = await res.text();
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    while ((match = itemRegex.exec(xml)) !== null && items.length < 25) {
      const block = match[1];
      const title = (block.match(/<title>(.*?)<\/title>/) || [])[1] || '';
      const pubDate = (block.match(/<pubDate>(.*?)<\/pubDate>/) || [])[1] || '';
      const source = (block.match(/<source[^>]*>(.*?)<\/source>/) || [])[1] || '';
      const link = (block.match(/<link>(.*?)<\/link>/) || [])[1] || '';
      if (!title) continue;
      let symbol = '';
      const bracketMatch = title.match(/\[([A-Z]{2,6})\s*\]/);
      if (bracketMatch) { symbol = bracketMatch[1]; }
      else { const words = title.split(/[\s-]+/); if (words[0] && /^[A-Z]{2,6}$/.test(words[0])) symbol = words[0]; }
      let time = '--:--';
      if (pubDate) { try { const d = new Date(pubDate); if (!isNaN(d.getTime())) time = d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' }); } catch (e) {} }
      let cleanTitle = title.replace(/\s*-\s*Bloomberght$/i, '').replace(/\s*-\s*TradingView[^]*/i, '').trim();
      cleanTitle = cleanTitle.replace(/\s*-\s*\d{4}-\d{2}-\d{2}\s*tarihli$/i, '');
      cleanTitle = cleanTitle.replace(/^KAP:\s*/i, '').replace(/\[[A-Z]+\s*\]\s*/g, '').replace(/KAMUYU AYDINLATMA PLATFORMU\s*/gi, '').trim();
      if (!cleanTitle) cleanTitle = title.split(' - ')[0].trim();
      items.push({
        time, symbol, title: cleanTitle,
        source: source || 'KAP',
        important: /temettü|birleşme|sermaye|kar payı|genel kurul|bedelsiz|özel durum/i.test(title),
        url: link,
      });
    }
    if (items.length > 0) sc('kap', items);
    return items;
  } catch (e) {
    console.error('KAP error:', e.message);
    return [];
  }
}

// ============================================
// API ROUTES
// ============================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    stocks: STOCK_METADATA.total,
    livePrices: LIVE_PRICES.total,
    livePricesAgeSec: LIVE_PRICES.fetchedAt ? Math.floor((Date.now() - new Date(LIVE_PRICES.fetchedAt).getTime()) / 1000) : null,
    cache: Object.keys(cache).length,
    uptime: Math.floor(process.uptime()),
  });
});

// Tüm BIST sembol + metadata (günlük cache)
app.get('/api/stocks-list', (req, res) => {
  res.json({
    total: STOCK_METADATA.total,
    fetchedAt: STOCK_METADATA.fetchedAt,
    items: STOCK_METADATA.items,
  });
});

// Sadece semboller (hızlı arama için)
app.get('/api/symbols', (req, res) => {
  res.json({
    total: STOCK_METADATA.total,
    symbols: STOCK_METADATA.items.map(i => i.symbol),
  });
});

// Client-side arama (opsiyonel backend yardımı)
app.get('/api/search', (req, res) => {
  const q = (req.query.q || '').toUpperCase();
  if (!q) return res.json([]);
  const out = [];
  for (const it of STOCK_METADATA.items) {
    if (it.symbol.includes(q) || it.name.toLocaleUpperCase('tr-TR').includes(q)) {
      out.push({ symbol: it.symbol, name: it.name, sector: it.sector });
      if (out.length >= 20) break;
    }
  }
  res.json(out);
});

// CANLI fiyatlar (tüm hisseler, paged) — 60sn cache
app.get('/api/prices', (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 50;
  const start = page * limit;
  const end = start + limit;
  res.json({
    total: LIVE_PRICES.total,
    page,
    limit,
    fetchedAt: LIVE_PRICES.fetchedAt,
    items: LIVE_PRICES.items.slice(start, end),
  });
});

// TÜM canlı fiyatlar tek seferde (frontend'in ilk load'u için)
app.get('/api/prices/all', (req, res) => {
  res.json({
    total: LIVE_PRICES.total,
    fetchedAt: LIVE_PRICES.fetchedAt,
    failed: LIVE_PRICES.failed,
    items: LIVE_PRICES.items,
  });
});

// Tek hisse fiyatı (en güncel)
app.get('/api/price/:symbol', async (req, res) => {
  const sym = req.params.symbol.toUpperCase();
  const ck = `price_${sym}`;
  const cc = gc(ck, 45 * 1000);
  if (cc) return res.json(cc);
  // Önce cache'deki live_prices'a bak
  const fromCache = LIVE_PRICES.items.find(p => p.symbol === sym);
  if (fromCache) { sc(ck, fromCache); return res.json(fromCache); }
  // Canlı çek
  const data = await fetchQuote(sym);
  if (data) { sc(ck, data); return res.json(data); }
  res.status(404).json({ error: 'not found' });
});

// Teknik analiz (İş Yatırım tarihsel verisi üzerinden)
app.get('/api/technicals/:symbol', async (req, res) => {
  const data = await technicals(req.params.symbol.toUpperCase());
  if (data) return res.json(data);
  res.status(404).json({ error: 'no data' });
});

app.get('/api/currency', async (req, res) => res.json(await fetchCurrency()));
app.get('/api/indices', async (req, res) => res.json(await fetchIndices()));
app.get('/api/kap', async (req, res) => res.json(await fetchKAP()));

app.get('/api/tedbirli', async (req, res) => {
  const ck = 'tedbirli';
  const cc = gc(ck, 30 * 60 * 1000);
  if (cc) return res.json(cc);
  try {
    const data = await scrapeTedbirli();
    sc(ck, data);
    res.json(data);
  } catch (e) {
    console.error('tedbirli err:', e.message);
    res.status(502).json({ error: 'source_unavailable', message: e.message });
  }
});

// Historical (tek hisse N gün)
app.get('/api/historical/:symbol', async (req, res) => {
  const sym = req.params.symbol.toUpperCase();
  const days = parseInt(req.query.days) || 180;
  const ck = `hist_${sym}_${days}`;
  const cc = gc(ck, 10 * 60 * 1000);
  if (cc) return res.json(cc);
  try {
    const data = await fetchHistoricalData(sym, days);
    if (data.length > 0) { sc(ck, data); return res.json(data); }
  } catch (e) {
    console.error('historical err:', e.message);
  }
  res.status(404).json({ error: 'no data' });
});

app.listen(5000, '0.0.0.0', () => {
  console.log(`BIST Pulse API — port 5000 — starting up...`);
});
