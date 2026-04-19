export interface Strategy {
  id: string;
  name: string;
  description: string;
  icon: string;
  conditions: string[];
  matchCount: number;
  winRate: number;
  avgReturn: number;
  bestMarket: string;
  avgHoldDays: number;
  matches: { symbol: string; strength: number; triggerPrice: number; triggerDate: string }[];
  isNew?: boolean;
}

export const strategies: Strategy[] = [
  {
    id: 's1', name: 'Altın Tarama', icon: '🥇',
    description: 'EMA dizilimi pozitif, MACD cross, RSI 40-65 ile trend başlangıçlarını yakalayan strateji',
    conditions: ['EMA20 > EMA50 > EMA200', 'MACD sinyal çizgisini yukarı kırdı', 'RSI 40-65 arasında', 'Hacim 20G ort. üzerinde'],
    matchCount: 4, winRate: 72, avgReturn: 4.8, bestMarket: 'Yükselen Trend', avgHoldDays: 8,
    matches: [
      { symbol: 'THYAO', strength: 92, triggerPrice: 296.80, triggerDate: '2026-04-12' },
      { symbol: 'AKBNK', strength: 88, triggerPrice: 60.20, triggerDate: '2026-04-13' },
      { symbol: 'KCHOL', strength: 78, triggerPrice: 195.40, triggerDate: '2026-04-14' },
      { symbol: 'ENKAI', strength: 74, triggerPrice: 61.20, triggerDate: '2026-04-14' },
    ],
  },
  {
    id: 's2', name: 'Momentum Bombası', icon: '💣',
    description: 'Güçlü gün içi hareket, yüksek hacim ve VWAP üzerinde fiyatlama ile momentum avı',
    conditions: ['Günlük değişim > +%3', 'Relatif hacim > 2x', 'RSI 55-75', 'Fiyat VWAP üzerinde'],
    matchCount: 3, winRate: 68, avgReturn: 5.2, bestMarket: 'Yükselen Trend', avgHoldDays: 5,
    matches: [
      { symbol: 'EREGL', strength: 95, triggerPrice: 52.80, triggerDate: '2026-04-14' },
      { symbol: 'KOZAL', strength: 85, triggerPrice: 258.40, triggerDate: '2026-04-14' },
      { symbol: 'AKBNK', strength: 82, triggerPrice: 61.50, triggerDate: '2026-04-14' },
    ],
  },
  {
    id: 's3', name: 'Dip Avcısı', icon: '🎯',
    description: 'Aşırı satım bölgesinde güçlü hisselerde giriş fırsatı arayan strateji',
    conditions: ['RSI 25-40', 'Stochastic K çizgisi cross', 'Fiyat SMA200 üzerinde', '1 aylık düşüş > %5'],
    matchCount: 2, winRate: 65, avgReturn: 6.8, bestMarket: 'Yatay Piyasa', avgHoldDays: 12,
    matches: [
      { symbol: 'SISE', strength: 78, triggerPrice: 49.20, triggerDate: '2026-04-14' },
      { symbol: 'SAHOL', strength: 72, triggerPrice: 82.80, triggerDate: '2026-04-13' },
    ],
  },
  {
    id: 's4', name: 'Golden Cross', icon: '✝️',
    description: 'SMA50 yeni SMA200 üzerine geçiş — klasik uzun vadeli trend başlangıç sinyali',
    conditions: ['SMA50 yeni SMA200 üstüne geçti', 'Fiyat SMA200 üzerinde', 'Hacim artışı'],
    matchCount: 1, winRate: 74, avgReturn: 8.2, bestMarket: 'Yükselen Trend', avgHoldDays: 20,
    matches: [
      { symbol: 'THYAO', strength: 90, triggerPrice: 288.40, triggerDate: '2026-04-10' },
    ],
  },
  {
    id: 's5', name: 'VWAP Savaşçısı', icon: '⚔️',
    description: 'VWAP destek olarak çalışırken pozitif momentum ve hacim arayan strateji',
    conditions: ['Fiyat VWAP üzerinde (sıkı)', 'Günlük değişim > %0', 'RSI 50-70', 'Hacim > 500K'],
    matchCount: 5, winRate: 66, avgReturn: 3.8, bestMarket: 'Yükselen Trend', avgHoldDays: 5,
    matches: [
      { symbol: 'EREGL', strength: 94, triggerPrice: 53.90, triggerDate: '2026-04-14' },
      { symbol: 'THYAO', strength: 88, triggerPrice: 299.80, triggerDate: '2026-04-14' },
      { symbol: 'GARAN', strength: 82, triggerPrice: 127.20, triggerDate: '2026-04-14' },
      { symbol: 'DOAS', strength: 78, triggerPrice: 216.80, triggerDate: '2026-04-14' },
      { symbol: 'KCHOL', strength: 75, triggerPrice: 197.20, triggerDate: '2026-04-14' },
    ],
  },
  {
    id: 's6', name: 'Akıllı Para', icon: '🧠',
    description: 'Anormal hacim artışıyla birlikte pozitif fiyat hareketi — kurumsal ilgi tespiti',
    conditions: ['Relatif hacim > 2x', 'Günlük değişim > %2', 'Fiyat EMA20 üzerinde', 'Hacim > 500K'],
    matchCount: 3, winRate: 70, avgReturn: 5.5, bestMarket: 'Her Piyasa', avgHoldDays: 7,
    matches: [
      { symbol: 'EREGL', strength: 92, triggerPrice: 54.20, triggerDate: '2026-04-14' },
      { symbol: 'KOZAL', strength: 84, triggerPrice: 260.50, triggerDate: '2026-04-14' },
      { symbol: 'AKBNK', strength: 80, triggerPrice: 61.80, triggerDate: '2026-04-14' },
    ],
  },
  {
    id: 's7', name: 'Patlama Öncesi', icon: '🌋',
    description: 'Bollinger sıkışması + düşük ADX = yaklaşan büyük hareket tespiti',
    conditions: ['Bollinger Bandı sıkışmada', 'ADX < 20', 'EMA50 > EMA200', 'RSI 40-60'],
    matchCount: 2, winRate: 62, avgReturn: 7.5, bestMarket: 'Yatay Piyasa', avgHoldDays: 10,
    matches: [
      { symbol: 'TCELL', strength: 80, triggerPrice: 92.20, triggerDate: '2026-04-14' },
      { symbol: 'TOASO', strength: 72, triggerPrice: 346.80, triggerDate: '2026-04-13' },
    ],
  },
  {
    id: 's8', name: 'Roket Rampa', icon: '🚀',
    description: 'Bollinger üst bant kırılımı, güçlü ADX ve RSI ile agresif trend takibi',
    conditions: ['Fiyat BB üst bant üzerinde', 'ADX > 25', 'RSI > 60', 'Güçlü hacim'],
    matchCount: 2, winRate: 64, avgReturn: 6.2, bestMarket: 'Yükselen Trend', avgHoldDays: 6,
    matches: [
      { symbol: 'KOZAL', strength: 88, triggerPrice: 262.50, triggerDate: '2026-04-14' },
      { symbol: 'EREGL', strength: 82, triggerPrice: 54.40, triggerDate: '2026-04-14' },
    ],
  },
  {
    id: 's9', name: 'Kurum+Teknik Füzyon', icon: '🔗', isNew: true,
    description: 'Teknik strateji aktif + kurum birikimi birleşimi — Konverjans Motorunun özel versiyonu',
    conditions: ['En az 1 teknik strateji aktif', 'En az 2 kurum son 3 gün net alıcı', 'RSI > 45'],
    matchCount: 3, winRate: 78, avgReturn: 6.8, bestMarket: 'Her Piyasa', avgHoldDays: 8,
    matches: [
      { symbol: 'EREGL', strength: 96, triggerPrice: 52.40, triggerDate: '2026-04-12' },
      { symbol: 'THYAO', strength: 88, triggerPrice: 296.80, triggerDate: '2026-04-13' },
      { symbol: 'AKBNK', strength: 82, triggerPrice: 60.80, triggerDate: '2026-04-14' },
    ],
  },
  {
    id: 's10', name: 'Yabancı Girişi', icon: '🌍', isNew: true,
    description: 'Yabancı yatırımcı takas oranı artışı + uygun teknik koşullar birleşimi',
    conditions: ['Yabancı takas oranı 5G değişim > +3pp', 'RSI 45-65', 'Hacim > 1M'],
    matchCount: 2, winRate: 71, avgReturn: 5.4, bestMarket: 'Yükselen Trend', avgHoldDays: 10,
    matches: [
      { symbol: 'THYAO', strength: 85, triggerPrice: 298.50, triggerDate: '2026-04-14' },
      { symbol: 'GARAN', strength: 78, triggerPrice: 126.80, triggerDate: '2026-04-14' },
    ],
  },
  {
    id: 's11', name: 'Temettü Yaklaşımı', icon: '💎', isNew: true,
    description: 'Temettü tarihine yaklaşan, yüksek getirili ve hacmi artan hisseler',
    conditions: ['Temettü tarihi < 15 gün', 'Brüt getiri > %5', 'Son 3 gün hacim artışı'],
    matchCount: 2, winRate: 75, avgReturn: 4.2, bestMarket: 'Her Piyasa', avgHoldDays: 12,
    matches: [
      { symbol: 'DOAS', strength: 92, triggerPrice: 214.20, triggerDate: '2026-04-14' },
      { symbol: 'TUPRS', strength: 85, triggerPrice: 176.40, triggerDate: '2026-04-14' },
    ],
  },
  {
    id: 's12', name: 'Sessiz Dev', icon: '🏔️', isNew: true,
    description: 'Büyük şirketlerde uzun süreli düşük volatilite — kırılım öncesi konumlanma',
    conditions: ['3+ ay Bollinger sıkışma', 'Piyasa değeri > 500M', 'Net Borç/FAVÖK < 2'],
    matchCount: 1, winRate: 68, avgReturn: 8.5, bestMarket: 'Yatay Piyasa', avgHoldDays: 15,
    matches: [
      { symbol: 'TCELL', strength: 76, triggerPrice: 91.80, triggerDate: '2026-04-14' },
    ],
  },
];
