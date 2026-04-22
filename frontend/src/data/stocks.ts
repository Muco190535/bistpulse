// Hisse listesi artık backend'den (İş Yatırım scrape) geliyor.
// Bu dosya module-level cache tutar ve eski searchStocks/getStock API'sini korur.

export interface Stock {
  symbol: string;
  name: string;
  sector: string;
  price: number;              // Canlı fiyat (Yahoo V8 chart, 15dk gecikmeli)
  previousClose: number;
  change: number;
  changePercent: number;
  dayHigh: number;
  dayLow: number;
  volume: number;
  high52w: number;
  low52w: number;
  marketCapMN: number;        // Piyasa değeri (mn TL)
  marketCapUSD: number;       // Piyasa değeri (mn USD)
  freeFloatPct: number;       // Halka açıklık %
  capitalMN: number;          // Sermaye (mn TL)
  lastUpdated: string;
  // ======== LEGACY alanlar ========
  // Eski stock model ile uyumluluk için tutulmuş opsiyonel alanlar.
  // Henüz backend'den gelmiyor (İş Yatırım Finansal Oranlar sekmesinden gelecek).
  // Default değerlerle doldurulmuş halde dönüyorlar ki sayfalar crash etmesin.
  marketCap: number;          // Eski: milyon birimli marketCap (marketCapMN alias)
  pe: number;                 // F/K oranı
  pb: number;                 // PD/DD
  evEbitda: number;           // FD/FAVÖK
  roe: number;                // Özkaynak karlılığı
  roic: number;               // Yatırım sermayesi karlılığı
  netDebtEbitda: number;      // Net Borç / FAVÖK
  dividendYield: number;      // Temettü getirisi %
  foreignOwnership: number;   // Yabancı payı %
  ema20: number;              // Teknik göstergeler (useTechnicals'dan gelmeli)
  ema50: number;
  ema200: number;
  rsi: number;
  macdSignal: 'bullish' | 'bearish' | 'neutral';
  bbPosition: 'upper' | 'middle' | 'lower' | 'squeeze';
  vwap: number;
  relativeVolume: number;
  adx: number;
  netProfitMargin: number;
  ebitdaMargin: number;
  revenueGrowth: number;
  profitGrowth: number;
  freeFloat: number;
  indexes: string[];
  currentRatio: number;
}

// Module-level cache (hook'tan besleniyor)
let STOCK_CACHE: Stock[] = [];
let CACHE_LOADED = false;

/**
 * Backend cache'ine Stock listesi yükle.
 * Bu fonksiyon useStocks() hook'undan çağrılır, diğer kodlara görünür değil.
 */
export const _setStockCache = (stocks: Stock[]) => {
  // Backend'den gelen Stock'lara legacy field defaults'ı ekle
  // (crash önleme — henüz olmayan veriler için 0/empty/neutral)
  // Object.assign kullanıyoruz ki TypeScript duplicate key uyarısı vermesin
  STOCK_CACHE = stocks.map(s => Object.assign({
    marketCap: 0, pe: 0, pb: 0, evEbitda: 0, roe: 0, roic: 0, netDebtEbitda: 0,
    dividendYield: 0, foreignOwnership: 0,
    ema20: 0, ema50: 0, ema200: 0, rsi: 50,
    macdSignal: 'neutral', bbPosition: 'middle',
    vwap: 0, relativeVolume: 1, adx: 0,
    netProfitMargin: 0, ebitdaMargin: 0, revenueGrowth: 0, profitGrowth: 0,
    freeFloat: 0, indexes: [] as string[], currentRatio: 0,
  }, s, {
    // Backend alias'ları: yeni ismi varsa eski isme ata
    marketCap: s.marketCapMN ?? 0,
    vwap: s.price ?? 0,
    freeFloat: s.freeFloatPct ?? 0,
  }) as Stock);
  CACHE_LOADED = true;
};

export const isStockCacheLoaded = () => CACHE_LOADED;

/**
 * Sembol + isim + sektör üzerinde arama yapar. Query boşsa tüm listeyi döner.
 * Sonuçlar boyuta göre sıralı (exact match > prefix > contains).
 */
export const searchStocks = (query: string): Stock[] => {
  const q = (query || '').toLocaleUpperCase('tr-TR').trim();
  if (!q) return STOCK_CACHE;

  const results: { stock: Stock; score: number }[] = [];
  for (const s of STOCK_CACHE) {
    const sym = s.symbol.toLocaleUpperCase('tr-TR');
    const nm = s.name.toLocaleUpperCase('tr-TR');
    const sc = s.sector.toLocaleUpperCase('tr-TR');

    let score = 0;
    if (sym === q) score = 100;
    else if (sym.startsWith(q)) score = 90;
    else if (sym.includes(q)) score = 70;
    else if (nm.startsWith(q)) score = 60;
    else if (nm.includes(q)) score = 40;
    else if (sc.includes(q)) score = 20;

    if (score > 0) results.push({ stock: s, score });
  }

  results.sort((a, b) => b.score - a.score);
  return results.map(r => r.stock);
};

/**
 * Sembolden Stock bul.
 */
export const getStock = (symbol: string): Stock | undefined => {
  const sym = symbol.toLocaleUpperCase('tr-TR');
  return STOCK_CACHE.find(s => s.symbol === sym);
};

// Geriye uyumluluk için: eski kod import { stocks } from ... yapıyor olabilir.
// Cache dolana kadar boş array döner.
export const stocks = new Proxy([] as Stock[], {
  get(_, prop) {
    return STOCK_CACHE[prop as any];
  },
  has(_, prop) {
    return prop in STOCK_CACHE;
  },
});
