export interface Position {
  id: string;
  symbol: string;
  name: string;
  buyPrice: number;
  currentPrice: number;
  quantity: number;
  buyDate: string;
  sector: string;
  strategyTag: string;
  notes: string;
}

export const portfolioPositions: Position[] = [
  { id: '1', symbol: 'THYAO', name: 'Türk Hava Yolları', buyPrice: 285.40, currentPrice: 302.50, quantity: 200, buyDate: '2026-03-15', sector: 'Ulaştırma', strategyTag: 'Golden Cross', notes: 'EMA dizilimi güçlü, uzun vadeli pozisyon' },
  { id: '2', symbol: 'EREGL', name: 'Ereğli Demir Çelik', buyPrice: 48.20, currentPrice: 54.85, quantity: 1000, buyDate: '2026-03-22', sector: 'Metal', strategyTag: 'Kurum+Teknik Füzyon', notes: 'Kurum birikimi devam ediyor' },
  { id: '3', symbol: 'AKBNK', name: 'Akbank', buyPrice: 55.80, currentPrice: 62.30, quantity: 500, buyDate: '2026-04-01', sector: 'Bankacılık', strategyTag: 'Momentum Bombası', notes: 'Bankacılık sektörü güçlü, yabancı alımı var' },
  { id: '4', symbol: 'TUPRS', name: 'Tüpraş', buyPrice: 182.50, currentPrice: 178.20, quantity: 100, buyDate: '2026-04-05', sector: 'Petrokimya', strategyTag: 'Temettü Yaklaşımı', notes: 'Temettü için alındı, kısa vadeli düşüş normal' },
  { id: '5', symbol: 'KOZAL', name: 'Koza Altın', buyPrice: 242.00, currentPrice: 265.80, quantity: 150, buyDate: '2026-03-28', sector: 'Madencilik', strategyTag: 'Altın Tarama', notes: 'Altın fiyatları yükseliyor, hedge pozisyonu' },
  { id: '6', symbol: 'GARAN', name: 'Garanti BBVA', buyPrice: 122.60, currentPrice: 128.40, quantity: 400, buyDate: '2026-04-08', sector: 'Bankacılık', strategyTag: 'Akıllı Para', notes: 'Yabanc�� oranı %52.8, güçlü kurum desteği' },
];

export interface TradeRecord {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  price: number;
  quantity: number;
  date: string;
  strategy: string;
  pnl?: number;
  pnlPercent?: number;
  closed: boolean;
}

export const tradeHistory: TradeRecord[] = [
  { id: 't1', symbol: 'FROTO', side: 'buy', price: 1020.00, quantity: 50, date: '2026-02-10', strategy: 'Trend Sörfçüsü', pnl: 3250, pnlPercent: 6.37, closed: true },
  { id: 't2', symbol: 'DOAS', side: 'buy', price: 195.80, quantity: 200, date: '2026-02-18', strategy: 'Temettü Yaklaşımı', pnl: 4520, pnlPercent: 11.54, closed: true },
  { id: 't3', symbol: 'SISE', side: 'buy', price: 52.40, quantity: 800, date: '2026-03-01', strategy: 'Dip Avcısı', pnl: -2784, pnlPercent: -6.64, closed: true },
  { id: 't4', symbol: 'PGSUS', side: 'buy', price: 845.00, quantity: 30, date: '2026-03-05', strategy: 'Roket Rampa', pnl: 1410, pnlPercent: 5.56, closed: true },
  { id: 't5', symbol: 'ASELS', side: 'buy', price: 78.50, quantity: 600, date: '2026-03-10', strategy: 'Akıllı Para', pnl: 6090, pnlPercent: 12.93, closed: true },
  { id: 't6', symbol: 'SAHOL', side: 'buy', price: 88.20, quantity: 400, date: '2026-03-18', strategy: 'Momentum Bombası', pnl: -2300, pnlPercent: -6.52, closed: true },
  { id: 't7', symbol: 'TCELL', side: 'buy', price: 85.40, quantity: 300, date: '2026-03-25', strategy: 'VWAP Savaşçısı', pnl: 2220, pnlPercent: 8.67, closed: true },
  { id: 't8', symbol: 'ENKAI', side: 'buy', price: 58.80, quantity: 500, date: '2026-04-02', strategy: 'Nakit Kralları', pnl: 1675, pnlPercent: 5.70, closed: true },
];

export const getPortfolioStats = () => {
  const positions = portfolioPositions;
  const totalInvested = positions.reduce((s, p) => s + p.buyPrice * p.quantity, 0);
  const totalCurrent = positions.reduce((s, p) => s + p.currentPrice * p.quantity, 0);
  const totalPnL = totalCurrent - totalInvested;
  const totalPnLPercent = (totalPnL / totalInvested) * 100;
  const todayPnL = totalCurrent * 0.0142;

  const sectors: Record<string, number> = {};
  positions.forEach(p => {
    const value = p.currentPrice * p.quantity;
    sectors[p.sector] = (sectors[p.sector] || 0) + value;
  });

  const sectorDistribution = Object.entries(sectors)
    .map(([name, value]) => ({ name, value, percent: (value / totalCurrent) * 100 }))
    .sort((a, b) => b.percent - a.percent);

  const winTrades = tradeHistory.filter(t => t.closed && (t.pnl || 0) > 0);
  const lossTrades = tradeHistory.filter(t => t.closed && (t.pnl || 0) < 0);
  const winRate = (winTrades.length / tradeHistory.filter(t => t.closed).length) * 100;
  const avgReturn = tradeHistory.filter(t => t.closed).reduce((s, t) => s + (t.pnlPercent || 0), 0) / tradeHistory.filter(t => t.closed).length;

  const strategyStats: Record<string, { count: number; wins: number; totalReturn: number }> = {};
  tradeHistory.filter(t => t.closed).forEach(t => {
    if (!strategyStats[t.strategy]) strategyStats[t.strategy] = { count: 0, wins: 0, totalReturn: 0 };
    strategyStats[t.strategy].count++;
    if ((t.pnl || 0) > 0) strategyStats[t.strategy].wins++;
    strategyStats[t.strategy].totalReturn += t.pnlPercent || 0;
  });

  return { totalInvested, totalCurrent, totalPnL, totalPnLPercent, todayPnL, sectorDistribution, winRate, avgReturn, strategyStats, winTrades: winTrades.length, lossTrades: lossTrades.length };
};
