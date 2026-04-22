// İş Yatırım scraper — BIST hisse listesi + tarihsel veri
// Kaynak: https://www.isyatirim.com.tr/tr-tr/analiz/hisse/Sayfalar/Temel-Degerler-Ve-Oranlar.aspx
// HisseTekil JSON API: /_layouts/15/Isyatirim.Website/Common/Data.aspx/HisseTekil

const fetch = require('node-fetch');
const cheerio = require('cheerio');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';
const BASE = 'https://www.isyatirim.com.tr';
const LIST_URL = `${BASE}/tr-tr/analiz/hisse/Sayfalar/Temel-Degerler-Ve-Oranlar.aspx`;
const HISSE_TEKIL_URL = `${BASE}/_layouts/15/Isyatirim.Website/Common/Data.aspx/HisseTekil`;

/**
 * Türkçe sayı formatını parse et: "1.860.480,0" -> 1860480.0
 * "408,00" -> 408.0
 * "25,8" -> 25.8
 */
function parseTR(str) {
  if (!str) return 0;
  const cleaned = String(str).trim().replace(/\./g, '').replace(',', '.');
  const n = parseFloat(cleaned);
  return isNaN(n) ? 0 : n;
}

/**
 * Tarih formatı: Date -> "DD-MM-YYYY" (İş Yatırım formatı)
 */
function formatDateTR(date) {
  const d = new Date(date);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

/**
 * BIST hisse listesini İş Yatırım'dan scrape et.
 * Döndürür: { source, sourceUrl, fetchedAt, total, items[] }
 */
async function scrapeStockList() {
  const res = await fetch(LIST_URL, {
    headers: { 'User-Agent': UA },
    timeout: 20000,
  });
  if (!res.ok) throw new Error(`İş Yatırım HTTP ${res.status}`);
  const html = await res.text();
  const $ = cheerio.load(html);

  const items = [];

  // Tablo yapısı: <tr><td>KOD</td><td>İsim</td><td>Sektör</td>
  //   <td class="text-right">Kapanış</td>
  //   <td class="text-right">Piyasa Değeri (mn TL)</td>
  //   <td class="text-right">Piyasa Değeri (mn $)</td>
  //   <td class="text-right">Halka Açıklık</td>
  //   <td class="text-right">Sermaye</td></tr>

  $('tr').each((_, tr) => {
    const tds = $(tr).find('td');
    if (tds.length < 8) return;

    // İlk td'nin içinde <a href="...?hisse=XXX">XXX</a> olmalı
    const firstTd = $(tds[0]);
    const link = firstTd.find('a[href*="hisse="]').first();
    if (!link.length) return;

    const symbol = link.text().trim();
    if (!symbol || !/^[A-Z0-9]{2,6}$/.test(symbol)) return;

    const name = $(tds[1]).text().trim();
    const sector = $(tds[2]).text().trim();
    const price = parseTR($(tds[3]).text());
    const marketCapMN = parseTR($(tds[4]).text());
    const marketCapUSD = parseTR($(tds[5]).text());
    const freeFloatPct = parseTR($(tds[6]).text());
    const capitalMN = parseTR($(tds[7]).text());

    items.push({
      symbol,
      name,
      sector,
      price,         // Son kapanış (günlük update, seans içi DEĞİL)
      marketCapMN,   // mn TL
      marketCapUSD,  // mn USD
      freeFloatPct,  // %
      capitalMN,     // mn TL
    });
  });

  // Deduplicate (bazen aynı kod birden fazla görünebilir)
  const seen = new Set();
  const unique = items.filter(it => {
    if (seen.has(it.symbol)) return false;
    seen.add(it.symbol);
    return true;
  });

  return {
    source: 'isyatirim.com.tr',
    sourceUrl: LIST_URL,
    fetchedAt: new Date().toISOString(),
    total: unique.length,
    items: unique,
  };
}

/**
 * Tek bir hissenin N günlük tarihsel verisini JSON API'den çek.
 * @param {string} symbol - Hisse kodu (ASELS)
 * @param {number} days - Kaç gün geriye (default 180)
 * @returns {Array} [{date, close, aof, min, max, volume, indexValue, usdRate, priceUSD}, ...]
 */
async function fetchHistoricalData(symbol, days = 180) {
  const end = new Date();
  const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);
  const url = `${HISSE_TEKIL_URL}?hisse=${encodeURIComponent(symbol)}&startdate=${formatDateTR(start)}&enddate=${formatDateTR(end)}`;

  const res = await fetch(url, {
    headers: {
      'User-Agent': UA,
      'Referer': `${BASE}/tr-tr/analiz/hisse/Sayfalar/sirket-karti.aspx?hisse=${symbol}`,
      'Accept': 'application/json',
    },
    timeout: 15000,
  });
  if (!res.ok) throw new Error(`HisseTekil HTTP ${res.status} for ${symbol}`);
  const data = await res.json();
  if (!data.ok || !Array.isArray(data.value)) {
    throw new Error(`HisseTekil error for ${symbol}: ${data.errorDescription || 'no value array'}`);
  }

  // value[].HGDG_TARIH formatı: "01-04-2026"
  return data.value.map(v => ({
    date: v.HGDG_TARIH,                    // "DD-MM-YYYY"
    close: v.HGDG_KAPANIS,                 // Günlük kapanış
    aof: v.HGDG_AOF,                       // Ağırlıklı ortalama fiyat
    min: v.HGDG_MIN,                       // Gün low
    max: v.HGDG_MAX,                       // Gün high
    volume: v.HGDG_HACIM,                  // TL hacim
    indexValue: v.END_DEGER,               // BIST endeks değeri o gün
    usdRate: v.DD_DEGER,                   // USD/TRY kuru o gün
    priceUSD: v.DOLAR_BAZLI_FIYAT,         // USD bazında fiyat
    marketCapTL: v.PD,                     // Piyasa değeri TL
    marketCapUSD: v.PD_USD,                // Piyasa değeri USD
  }));
}

module.exports = {
  scrapeStockList,
  fetchHistoricalData,
};
