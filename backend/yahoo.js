// Yahoo Finance V8 chart API — BIST canlı fiyat (15dk gecikmeli)
// V7 quote batch endpoint "Unauthorized" olduğu için V8 chart endpoint'i
// tek-tek kullanılıyor ama PARALEL olarak.

const fetch = require('node-fetch');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';
const BASE = 'https://query1.finance.yahoo.com/v8/finance/chart';

/**
 * Tek bir sembol için Yahoo Finance V8 chart endpoint'inden fiyat çek.
 * @param {string} symbol - BIST kodu (ASELS). .IS otomatik eklenir.
 * @returns {Object|null} Fiyat verisi veya null (hata durumunda)
 */
async function fetchQuote(symbol) {
  try {
    const url = `${BASE}/${symbol}.IS?interval=1m&range=1d&includePrePost=false`;
    const res = await fetch(url, {
      headers: { 'User-Agent': UA },
      timeout: 10000,
    });
    if (!res.ok) return null;
    const json = await res.json();
    const r = json.chart?.result?.[0];
    if (!r || !r.meta) return null;

    const m = r.meta;
    const price = m.regularMarketPrice || 0;
    const prev = m.previousClose || m.chartPreviousClose || price;
    const change = parseFloat((price - prev).toFixed(2));
    const changePct = prev > 0 ? parseFloat(((change / prev) * 100).toFixed(2)) : 0;

    return {
      symbol,
      name: m.longName || m.shortName || symbol,
      price,
      previousClose: prev,
      change,
      changePercent: changePct,
      dayHigh: m.regularMarketDayHigh || 0,
      dayLow: m.regularMarketDayLow || 0,
      volume: m.regularMarketVolume || 0,
      high52w: m.fiftyTwoWeekHigh || 0,
      low52w: m.fiftyTwoWeekLow || 0,
      currency: 'TRY',
      marketTime: m.regularMarketTime || 0,  // Unix timestamp
      lastUpdated: new Date().toISOString(),
    };
  } catch (e) {
    return null;
  }
}

/**
 * Array'i N-li gruplara böl.
 */
function chunk(arr, n) {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

/**
 * Çok sayıda sembol için paralel batch'ler halinde fiyat çek.
 * Her batch Promise.all ile aynı anda çağrılır, batch'ler arasında delay var.
 *
 * @param {Array<string>} symbols - BIST kodları
 * @param {Object} opts
 * @param {number} opts.batchSize - Her batch'te kaç hisse (default 30)
 * @param {number} opts.delayMs - Batch'ler arası gecikme ms (default 500)
 * @returns {Object} { successful: [...], failed: [...], totalMs, batchCount }
 */
async function fetchQuotesParallel(symbols, opts = {}) {
  const { batchSize = 30, delayMs = 500 } = opts;
  const t0 = Date.now();
  const batches = chunk(symbols, batchSize);
  const successful = [];
  const failed = [];

  for (let bi = 0; bi < batches.length; bi++) {
    const batch = batches[bi];
    const results = await Promise.all(batch.map(sym => fetchQuote(sym)));
    for (let i = 0; i < batch.length; i++) {
      if (results[i]) {
        successful.push(results[i]);
      } else {
        failed.push(batch[i]);
      }
    }
    // Son batch değilse kısa bekle (rate limit koruma)
    if (bi < batches.length - 1) {
      await new Promise(r => setTimeout(r, delayMs));
    }
  }

  return {
    successful,
    failed,
    totalMs: Date.now() - t0,
    batchCount: batches.length,
  };
}

module.exports = {
  fetchQuote,
  fetchQuotesParallel,
};
