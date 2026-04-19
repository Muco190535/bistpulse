export interface Stock {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  high52w: number;
  low52w: number;
  pe: number;
  pb: number;
  evEbitda: number;
  roe: number;
  roic: number;
  netDebtEbitda: number;
  currentRatio: number;
  dividendYield: number;
  netProfitMargin: number;
  ebitdaMargin: number;
  revenueGrowth: number;
  profitGrowth: number;
  foreignOwnership: number;
  freeFloat: number;
  indexes: string[];
  ema20: number;
  ema50: number;
  ema200: number;
  rsi: number;
  macdSignal: 'bullish' | 'bearish' | 'neutral';
  bbPosition: 'upper' | 'middle' | 'lower' | 'squeeze';
  vwap: number;
  relativeVolume: number;
  adx: number;
}

export const stocks: Stock[] = [
  {
    symbol: 'THYAO', name: 'Türk Hava Yolları', sector: 'Ulaştırma',
    price: 302.50, change: 6.25, changePercent: 2.11, volume: 48500000,
    marketCap: 416000, high52w: 342.00, low52w: 198.50,
    pe: 8.5, pb: 2.8, evEbitda: 5.2, roe: 38.5, roic: 24.2,
    netDebtEbitda: 1.8, currentRatio: 0.85, dividendYield: 1.2,
    netProfitMargin: 14.8, ebitdaMargin: 22.5, revenueGrowth: 28.4, profitGrowth: 35.2,
    foreignOwnership: 49.2, freeFloat: 50.0, indexes: ['BIST30', 'BIST50', 'BIST100'],
    ema20: 296.80, ema50: 288.40, ema200: 261.20, rsi: 62.4,
    macdSignal: 'bullish', bbPosition: 'upper', vwap: 299.80, relativeVolume: 1.8, adx: 28.5,
  },
  {
    symbol: 'GARAN', name: 'Garanti BBVA Bankası', sector: 'Bankacılık',
    price: 128.40, change: 3.20, changePercent: 2.55, volume: 82000000,
    marketCap: 540000, high52w: 145.00, low52w: 72.50,
    pe: 5.2, pb: 1.4, evEbitda: 0, roe: 28.4, roic: 0,
    netDebtEbitda: 0, currentRatio: 0, dividendYield: 3.8,
    netProfitMargin: 32.4, ebitdaMargin: 0, revenueGrowth: 45.2, profitGrowth: 52.8,
    foreignOwnership: 52.8, freeFloat: 50.0, indexes: ['BIST30', 'BIST50', 'BIST100'],
    ema20: 125.60, ema50: 118.90, ema200: 98.70, rsi: 64.8,
    macdSignal: 'bullish', bbPosition: 'upper', vwap: 127.20, relativeVolume: 1.4, adx: 32.1,
  },
  {
    symbol: 'ASELS', name: 'Aselsan', sector: 'Savunma',
    price: 88.65, change: 1.45, changePercent: 1.66, volume: 35200000,
    marketCap: 178000, high52w: 98.50, low52w: 48.20,
    pe: 32.5, pb: 6.8, evEbitda: 22.4, roe: 22.1, roic: 15.8,
    netDebtEbitda: 0.8, currentRatio: 1.42, dividendYield: 0.4,
    netProfitMargin: 12.5, ebitdaMargin: 18.9, revenueGrowth: 62.1, profitGrowth: 48.5,
    foreignOwnership: 8.4, freeFloat: 26.5, indexes: ['BIST30', 'BIST50', 'BIST100'],
    ema20: 86.90, ema50: 82.40, ema200: 68.50, rsi: 58.2,
    macdSignal: 'bullish', bbPosition: 'middle', vwap: 87.90, relativeVolume: 1.2, adx: 24.8,
  },
  {
    symbol: 'EREGL', name: 'Ereğli Demir Çelik', sector: 'Metal',
    price: 54.85, change: 1.95, changePercent: 3.69, volume: 62000000,
    marketCap: 193000, high52w: 62.40, low52w: 35.80,
    pe: 7.8, pb: 1.2, evEbitda: 4.8, roe: 16.2, roic: 12.8,
    netDebtEbitda: 0.5, currentRatio: 1.95, dividendYield: 5.8,
    netProfitMargin: 10.2, ebitdaMargin: 18.4, revenueGrowth: 22.5, profitGrowth: 18.9,
    foreignOwnership: 42.1, freeFloat: 49.8, indexes: ['BIST30', 'BIST50', 'BIST100'],
    ema20: 52.40, ema50: 49.80, ema200: 44.20, rsi: 68.5,
    macdSignal: 'bullish', bbPosition: 'upper', vwap: 53.90, relativeVolume: 2.1, adx: 30.2,
  },
  {
    symbol: 'SISE', name: 'Şişecam', sector: 'Cam',
    price: 48.92, change: -0.58, changePercent: -1.17, volume: 28400000,
    marketCap: 132000, high52w: 58.20, low52w: 32.80,
    pe: 6.4, pb: 0.9, evEbitda: 4.2, roe: 14.8, roic: 10.5,
    netDebtEbitda: 1.2, currentRatio: 1.68, dividendYield: 4.2,
    netProfitMargin: 8.9, ebitdaMargin: 16.2, revenueGrowth: 18.2, profitGrowth: -5.4,
    foreignOwnership: 35.6, freeFloat: 32.0, indexes: ['BIST30', 'BIST50', 'BIST100'],
    ema20: 49.80, ema50: 50.20, ema200: 45.60, rsi: 42.5,
    macdSignal: 'bearish', bbPosition: 'lower', vwap: 49.40, relativeVolume: 0.9, adx: 18.4,
  },
  {
    symbol: 'TUPRS', name: 'Tüpraş', sector: 'Petrokimya',
    price: 178.20, change: 2.80, changePercent: 1.60, volume: 12800000,
    marketCap: 178000, high52w: 195.00, low52w: 112.50,
    pe: 4.8, pb: 1.8, evEbitda: 3.5, roe: 42.5, roic: 28.4,
    netDebtEbitda: 0.2, currentRatio: 1.12, dividendYield: 8.5,
    netProfitMargin: 6.8, ebitdaMargin: 8.5, revenueGrowth: 12.4, profitGrowth: 22.8,
    foreignOwnership: 58.4, freeFloat: 49.0, indexes: ['BIST30', 'BIST50', 'BIST100'],
    ema20: 175.40, ema50: 170.20, ema200: 152.80, rsi: 56.8,
    macdSignal: 'bullish', bbPosition: 'middle', vwap: 177.00, relativeVolume: 1.1, adx: 22.6,
  },
  {
    symbol: 'KCHOL', name: 'Koç Holding', sector: 'Holding',
    price: 198.50, change: 4.10, changePercent: 2.11, volume: 18500000,
    marketCap: 504000, high52w: 215.00, low52w: 128.40,
    pe: 7.2, pb: 1.6, evEbitda: 6.8, roe: 24.2, roic: 16.5,
    netDebtEbitda: 1.5, currentRatio: 1.25, dividendYield: 2.8,
    netProfitMargin: 11.2, ebitdaMargin: 15.8, revenueGrowth: 32.5, profitGrowth: 28.4,
    foreignOwnership: 62.4, freeFloat: 36.8, indexes: ['BIST30', 'BIST50', 'BIST100'],
    ema20: 195.20, ema50: 188.60, ema200: 162.40, rsi: 60.2,
    macdSignal: 'bullish', bbPosition: 'middle', vwap: 197.20, relativeVolume: 1.3, adx: 26.4,
  },
  {
    symbol: 'SAHOL', name: 'Sabancı Holding', sector: 'Holding',
    price: 82.45, change: -1.15, changePercent: -1.38, volume: 22400000,
    marketCap: 168000, high52w: 95.80, low52w: 52.40,
    pe: 5.8, pb: 1.2, evEbitda: 5.5, roe: 22.8, roic: 14.2,
    netDebtEbitda: 2.1, currentRatio: 1.18, dividendYield: 3.5,
    netProfitMargin: 18.5, ebitdaMargin: 24.2, revenueGrowth: 28.8, profitGrowth: 22.1,
    foreignOwnership: 55.2, freeFloat: 42.0, indexes: ['BIST30', 'BIST50', 'BIST100'],
    ema20: 83.80, ema50: 85.20, ema200: 72.40, rsi: 44.8,
    macdSignal: 'bearish', bbPosition: 'lower', vwap: 83.20, relativeVolume: 0.8, adx: 16.2,
  },
  {
    symbol: 'AKBNK', name: 'Akbank', sector: 'Bankacılık',
    price: 62.30, change: 1.85, changePercent: 3.06, volume: 95000000,
    marketCap: 325000, high52w: 68.50, low52w: 32.80,
    pe: 4.2, pb: 1.2, evEbitda: 0, roe: 32.5, roic: 0,
    netDebtEbitda: 0, currentRatio: 0, dividendYield: 4.5,
    netProfitMargin: 35.8, ebitdaMargin: 0, revenueGrowth: 52.4, profitGrowth: 62.8,
    foreignOwnership: 48.5, freeFloat: 51.2, indexes: ['BIST30', 'BIST50', 'BIST100'],
    ema20: 60.80, ema50: 56.40, ema200: 46.20, rsi: 66.2,
    macdSignal: 'bullish', bbPosition: 'upper', vwap: 61.50, relativeVolume: 1.6, adx: 34.5,
  },
  {
    symbol: 'YKBNK', name: 'Yapı Kredi Bankası', sector: 'Bankacılık',
    price: 34.56, change: 0.82, changePercent: 2.43, volume: 120000000,
    marketCap: 292000, high52w: 38.40, low52w: 18.20,
    pe: 3.8, pb: 1.1, evEbitda: 0, roe: 30.2, roic: 0,
    netDebtEbitda: 0, currentRatio: 0, dividendYield: 2.8,
    netProfitMargin: 28.4, ebitdaMargin: 0, revenueGrowth: 48.5, profitGrowth: 55.2,
    foreignOwnership: 44.8, freeFloat: 18.2, indexes: ['BIST30', 'BIST50', 'BIST100'],
    ema20: 33.80, ema50: 31.20, ema200: 25.40, rsi: 62.8,
    macdSignal: 'bullish', bbPosition: 'middle', vwap: 34.20, relativeVolume: 1.2, adx: 28.8,
  },
  {
    symbol: 'PGSUS', name: 'Pegasus Havayolları', sector: 'Ulaştırma',
    price: 892.00, change: 18.50, changePercent: 2.12, volume: 2800000,
    marketCap: 91500, high52w: 1020.00, low52w: 485.00,
    pe: 10.2, pb: 4.5, evEbitda: 6.8, roe: 48.5, roic: 32.4,
    netDebtEbitda: 2.4, currentRatio: 0.72, dividendYield: 0,
    netProfitMargin: 12.8, ebitdaMargin: 24.5, revenueGrowth: 35.2, profitGrowth: 42.8,
    foreignOwnership: 72.5, freeFloat: 38.5, indexes: ['BIST50', 'BIST100'],
    ema20: 878.40, ema50: 852.20, ema200: 742.80, rsi: 58.5,
    macdSignal: 'bullish', bbPosition: 'middle', vwap: 888.50, relativeVolume: 1.1, adx: 22.4,
  },
  {
    symbol: 'TAVHL', name: 'TAV Havalimanları', sector: 'Ulaştırma',
    price: 108.40, change: -0.80, changePercent: -0.73, volume: 5200000,
    marketCap: 39400, high52w: 125.80, low52w: 62.40,
    pe: 14.5, pb: 3.2, evEbitda: 8.5, roe: 24.8, roic: 18.2,
    netDebtEbitda: 2.8, currentRatio: 0.92, dividendYield: 1.5,
    netProfitMargin: 15.2, ebitdaMargin: 28.5, revenueGrowth: 25.4, profitGrowth: 18.5,
    foreignOwnership: 35.8, freeFloat: 24.5, indexes: ['BIST100'],
    ema20: 109.60, ema50: 112.40, ema200: 95.80, rsi: 45.2,
    macdSignal: 'neutral', bbPosition: 'middle', vwap: 109.00, relativeVolume: 0.85, adx: 15.8,
  },
  {
    symbol: 'BIMAS', name: 'BİM Mağazaları', sector: 'Perakende',
    price: 520.00, change: -4.50, changePercent: -0.86, volume: 3200000,
    marketCap: 316000, high52w: 580.00, low52w: 342.00,
    pe: 22.4, pb: 12.8, evEbitda: 14.5, roe: 62.5, roic: 42.8,
    netDebtEbitda: -0.5, currentRatio: 0.82, dividendYield: 1.8,
    netProfitMargin: 4.2, ebitdaMargin: 6.8, revenueGrowth: 58.4, profitGrowth: 45.2,
    foreignOwnership: 62.8, freeFloat: 69.2, indexes: ['BIST30', 'BIST50', 'BIST100'],
    ema20: 525.40, ema50: 528.80, ema200: 478.20, rsi: 44.8,
    macdSignal: 'bearish', bbPosition: 'lower', vwap: 522.50, relativeVolume: 0.7, adx: 14.2,
  },
  {
    symbol: 'KOZAL', name: 'Koza Altın', sector: 'Madencilik',
    price: 265.80, change: 8.40, changePercent: 3.26, volume: 8500000,
    marketCap: 68500, high52w: 295.00, low52w: 128.40,
    pe: 12.4, pb: 5.8, evEbitda: 8.2, roe: 52.4, roic: 38.5,
    netDebtEbitda: -1.2, currentRatio: 2.85, dividendYield: 2.4,
    netProfitMargin: 42.8, ebitdaMargin: 58.5, revenueGrowth: 82.4, profitGrowth: 95.2,
    foreignOwnership: 18.5, freeFloat: 20.0, indexes: ['BIST50', 'BIST100'],
    ema20: 258.40, ema50: 242.80, ema200: 198.50, rsi: 72.4,
    macdSignal: 'bullish', bbPosition: 'upper', vwap: 262.50, relativeVolume: 1.8, adx: 38.5,
  },
  {
    symbol: 'FROTO', name: 'Ford Otosan', sector: 'Otomotiv',
    price: 1085.00, change: 15.00, changePercent: 1.40, volume: 1200000,
    marketCap: 381000, high52w: 1185.00, low52w: 685.00,
    pe: 9.8, pb: 5.2, evEbitda: 6.5, roe: 58.4, roic: 35.2,
    netDebtEbitda: 0.8, currentRatio: 1.15, dividendYield: 4.8,
    netProfitMargin: 8.5, ebitdaMargin: 12.8, revenueGrowth: 42.5, profitGrowth: 38.4,
    foreignOwnership: 68.5, freeFloat: 18.2, indexes: ['BIST30', 'BIST50', 'BIST100'],
    ema20: 1072.40, ema50: 1048.80, ema200: 925.40, rsi: 56.8,
    macdSignal: 'bullish', bbPosition: 'middle', vwap: 1080.50, relativeVolume: 1.0, adx: 20.5,
  },
  {
    symbol: 'TOASO', name: 'Tofaş Otomobil', sector: 'Otomotiv',
    price: 345.20, change: -2.80, changePercent: -0.80, volume: 4500000,
    marketCap: 172000, high52w: 385.00, low52w: 215.00,
    pe: 6.5, pb: 2.8, evEbitda: 4.8, roe: 45.2, roic: 28.5,
    netDebtEbitda: 0.4, currentRatio: 1.28, dividendYield: 6.2,
    netProfitMargin: 9.2, ebitdaMargin: 14.5, revenueGrowth: 35.8, profitGrowth: 28.2,
    foreignOwnership: 55.8, freeFloat: 24.5, indexes: ['BIST50', 'BIST100'],
    ema20: 348.60, ema50: 352.40, ema200: 308.80, rsi: 46.5,
    macdSignal: 'neutral', bbPosition: 'middle', vwap: 346.80, relativeVolume: 0.9, adx: 16.8,
  },
  {
    symbol: 'TCELL', name: 'Turkcell', sector: 'Telekomünikasyon',
    price: 92.80, change: 0.65, changePercent: 0.71, volume: 15800000,
    marketCap: 204000, high52w: 105.00, low52w: 58.40,
    pe: 8.2, pb: 2.4, evEbitda: 5.8, roe: 32.4, roic: 18.5,
    netDebtEbitda: 1.5, currentRatio: 0.95, dividendYield: 3.2,
    netProfitMargin: 15.8, ebitdaMargin: 38.5, revenueGrowth: 52.8, profitGrowth: 42.5,
    foreignOwnership: 38.5, freeFloat: 25.0, indexes: ['BIST30', 'BIST50', 'BIST100'],
    ema20: 92.20, ema50: 90.80, ema200: 78.40, rsi: 52.4,
    macdSignal: 'neutral', bbPosition: 'middle', vwap: 92.50, relativeVolume: 1.0, adx: 18.5,
  },
  {
    symbol: 'ENKAI', name: 'Enka İnşaat', sector: 'İnşaat',
    price: 62.15, change: 0.85, changePercent: 1.39, volume: 18200000,
    marketCap: 372000, high52w: 68.50, low52w: 38.20,
    pe: 8.5, pb: 1.1, evEbitda: 5.2, roe: 14.2, roic: 10.8,
    netDebtEbitda: -2.5, currentRatio: 3.45, dividendYield: 4.5,
    netProfitMargin: 22.4, ebitdaMargin: 28.5, revenueGrowth: 18.5, profitGrowth: 12.4,
    foreignOwnership: 48.2, freeFloat: 40.5, indexes: ['BIST30', 'BIST50', 'BIST100'],
    ema20: 61.40, ema50: 59.80, ema200: 52.40, rsi: 54.8,
    macdSignal: 'bullish', bbPosition: 'middle', vwap: 61.80, relativeVolume: 1.1, adx: 20.2,
  },
  {
    symbol: 'SASA', name: 'SASA Polyester', sector: 'Kimya',
    price: 62.40, change: -3.80, changePercent: -5.74, volume: 45000000,
    marketCap: 65800, high52w: 128.50, low52w: 55.20,
    pe: 0, pb: 1.8, evEbitda: 18.5, roe: -8.5, roic: -4.2,
    netDebtEbitda: 5.8, currentRatio: 0.72, dividendYield: 0,
    netProfitMargin: -12.4, ebitdaMargin: 8.5, revenueGrowth: -15.2, profitGrowth: -85.4,
    foreignOwnership: 12.4, freeFloat: 34.5, indexes: ['BIST100'],
    ema20: 65.80, ema50: 72.40, ema200: 88.50, rsi: 28.5,
    macdSignal: 'bearish', bbPosition: 'lower', vwap: 64.20, relativeVolume: 2.5, adx: 42.8,
  },
  {
    symbol: 'DOAS', name: 'Doğuş Otomotiv', sector: 'Otomotiv',
    price: 218.40, change: 5.60, changePercent: 2.63, volume: 6800000,
    marketCap: 48500, high52w: 245.00, low52w: 142.80,
    pe: 5.2, pb: 2.4, evEbitda: 3.8, roe: 52.4, roic: 35.8,
    netDebtEbitda: -0.8, currentRatio: 1.52, dividendYield: 12.5,
    netProfitMargin: 8.5, ebitdaMargin: 10.2, revenueGrowth: 42.8, profitGrowth: 55.2,
    foreignOwnership: 28.5, freeFloat: 25.0, indexes: ['BIST100'],
    ema20: 214.20, ema50: 208.40, ema200: 185.20, rsi: 62.4,
    macdSignal: 'bullish', bbPosition: 'upper', vwap: 216.80, relativeVolume: 1.4, adx: 26.5,
  },
];

// Hisse arama fonksiyonu
export const searchStocks = (query: string): Stock[] => {
  const q = query.toUpperCase().trim();
  if (!q) return stocks;
  return stocks.filter(s =>
    s.symbol.includes(q) || s.name.toUpperCase().includes(q) || s.sector.toUpperCase().includes(q)
  );
};

// Sembolle hisse bul
export const getStock = (symbol: string): Stock | undefined => {
  return stocks.find(s => s.symbol === symbol.toUpperCase());
};
