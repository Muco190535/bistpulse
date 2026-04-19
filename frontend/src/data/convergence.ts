export interface ConvergenceScore {
  symbol: string;
  totalScore: number;
  technicalScore: number;
  institutionalScore: number;
  fundamentalScore: number;
  foreignScore: number;
  activeStrategies: string[];
  reasoning: string;
  historicalWinRate: number;
  isOnRadar: boolean;
  trend: 'rising' | 'stable' | 'falling';
}

export const convergenceScores: ConvergenceScore[] = [
  {
    symbol: 'EREGL', totalScore: 91, technicalScore: 23, institutionalScore: 24,
    fundamentalScore: 22, foreignScore: 22,
    activeStrategies: ['Momentum Bombası', 'VWAP Savaşçısı', 'Akıllı Para'],
    reasoning: '4 gündür kurum birikimi sürerken VWAP kırıldı. Hacim 2.1x normal seviyede, yabancı oranı 3 günde +2.4pp arttı.',
    historicalWinRate: 78, isOnRadar: true, trend: 'rising',
  },
  {
    symbol: 'THYAO', totalScore: 82, technicalScore: 21, institutionalScore: 22,
    fundamentalScore: 20, foreignScore: 19,
    activeStrategies: ['Golden Cross', 'Trend Sörfçüsü'],
    reasoning: 'EMA50, EMA200 üzerine geçiş yaptı. 3 büyük kurum (Ak, İş, Yapı Kredi) net alıcı. RSI 62 ile sağlıklı momentum.',
    historicalWinRate: 71, isOnRadar: true, trend: 'rising',
  },
  {
    symbol: 'AKBNK', totalScore: 78, technicalScore: 20, institutionalScore: 21,
    fundamentalScore: 19, foreignScore: 18,
    activeStrategies: ['Momentum Bombası', 'Roket Rampa'],
    reasoning: 'Bankacılık sektöründe güçlü momentum. F/K 4.2 ile ucuz değerleme. Yabancı alım trendi devam ediyor.',
    historicalWinRate: 68, isOnRadar: true, trend: 'stable',
  },
  {
    symbol: 'KOZAL', totalScore: 75, technicalScore: 22, institutionalScore: 16,
    fundamentalScore: 18, foreignScore: 19,
    activeStrategies: ['Altın Tarama', 'Patlama Öncesi'],
    reasoning: 'Altın fiyatlarındaki yükselişle güçlü teknik görünüm. RSI 72 ile aşırı alım riski mevcut ancak trend güçlü.',
    historicalWinRate: 65, isOnRadar: true, trend: 'rising',
  },
  {
    symbol: 'DOAS', totalScore: 72, technicalScore: 18, institutionalScore: 20,
    fundamentalScore: 21, foreignScore: 13,
    activeStrategies: ['Temettü Yaklaşımı', 'Kurum+Teknik Füzyon'],
    reasoning: 'Temettü tarihi 8 gün sonra. %12.5 brüt getiri. Son 3 gün kurum alımı hızlandı. Değerleme çok ucuz.',
    historicalWinRate: 72, isOnRadar: true, trend: 'rising',
  },
  {
    symbol: 'KCHOL', totalScore: 68, technicalScore: 17, institutionalScore: 18,
    fundamentalScore: 18, foreignScore: 15,
    activeStrategies: ['Trend Sörfçüsü'],
    reasoning: 'Holding iskontosu daralıyor. Yabancı oranı %62 ile yüksek güven. Teknik olarak EMA düzeni pozitif.',
    historicalWinRate: 64, isOnRadar: false, trend: 'stable',
  },
  {
    symbol: 'FROTO', totalScore: 65, technicalScore: 16, institutionalScore: 17,
    fundamentalScore: 19, foreignScore: 13,
    activeStrategies: ['Akıllı Para'],
    reasoning: 'Otomotiv ihracat verileri güçlü. Yüksek ROE ile kaliteli şirket. Hacim ortalamanın altında, katalizör bekliyor.',
    historicalWinRate: 62, isOnRadar: false, trend: 'stable',
  },
  {
    symbol: 'SASA', totalScore: 22, technicalScore: 3, institutionalScore: 5,
    fundamentalScore: 4, foreignScore: 10,
    activeStrategies: [],
    reasoning: 'Teknik görünüm çok zayıf. Tüm hareketli ortalamalar altında. Yüksek borçluluk ve negatif karlılık. Dikkat.',
    historicalWinRate: 0, isOnRadar: false, trend: 'falling',
  },
];

export const getConvergence = (symbol: string): ConvergenceScore | undefined => {
  return convergenceScores.find(c => c.symbol === symbol);
};

export const getRadarStocks = (): ConvergenceScore[] => {
  return convergenceScores.filter(c => c.isOnRadar).sort((a, b) => b.totalScore - a.totalScore);
};
