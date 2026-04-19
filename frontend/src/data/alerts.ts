export interface Alert {
  id: string;
  symbol: string;
  type: 'price' | 'percent' | 'technical' | 'institutional' | 'convergence' | 'kap' | 'dividend' | 'volume' | 'custody' | 'realtime';
  condition: string;
  isActive: boolean;
  timesTriggered: number;
  lastTriggered: string | null;
  createdAt: string;
}

export const alerts: Alert[] = [
  { id: 'a1', symbol: 'THYAO', type: 'price', condition: 'Fiyat 310₺ üzerine çıktığında', isActive: true, timesTriggered: 0, lastTriggered: null, createdAt: '2026-04-10' },
  { id: 'a2', symbol: 'EREGL', type: 'convergence', condition: 'Konverjans Skoru 90 üzerine çıktığında', isActive: true, timesTriggered: 1, lastTriggered: '2026-04-14 14:15', createdAt: '2026-04-08' },
  { id: 'a3', symbol: 'AKBNK', type: 'technical', condition: 'RSI 70 üzerine çıktığında', isActive: true, timesTriggered: 0, lastTriggered: null, createdAt: '2026-04-12' },
  { id: 'a4', symbol: 'SASA', type: 'percent', condition: 'Günlük değişim -%3 altına düştüğünde', isActive: true, timesTriggered: 2, lastTriggered: '2026-04-14 11:42', createdAt: '2026-04-05' },
  { id: 'a5', symbol: 'DOAS', type: 'dividend', condition: 'Temettü tarihine 5 gün kaldığında', isActive: true, timesTriggered: 0, lastTriggered: null, createdAt: '2026-04-01' },
  { id: 'a6', symbol: 'TUPRS', type: 'institutional', condition: 'Kurum net alımı 1M lot üzerine çıktığında', isActive: true, timesTriggered: 1, lastTriggered: '2026-04-13 15:22', createdAt: '2026-04-09' },
  { id: 'a7', symbol: 'KOZAL', type: 'volume', condition: 'Hacim 30 gün ort. 2x üzerine çıktığında', isActive: false, timesTriggered: 3, lastTriggered: '2026-04-14 10:05', createdAt: '2026-04-03' },
  { id: 'a8', symbol: 'GARAN', type: 'kap', condition: '"temettü" kelimesi KAP haberinde geçtiğinde', isActive: true, timesTriggered: 0, lastTriggered: null, createdAt: '2026-04-11' },
  { id: 'a9', symbol: 'THYAO', type: 'custody', condition: 'Yabancı oranı 1 günde +0.5pp değiştiğinde', isActive: true, timesTriggered: 1, lastTriggered: '2026-04-12 16:45', createdAt: '2026-04-07' },
  { id: 'a10', symbol: 'EREGL', type: 'realtime', condition: 'Konverjans Skoru anlık 85 üzerine çıktığında', isActive: true, timesTriggered: 1, lastTriggered: '2026-04-14 13:58', createdAt: '2026-04-10' },
];

export const alertHistory = [
  { alertId: 'a2', symbol: 'EREGL', triggeredAt: '2026-04-14 14:15', priceAtTrigger: 54.85, message: '⚡ EREGL Konverjans Skoru 91/100 — Çok Güçlü Sinyal!', scoreAtTrigger: 91 },
  { alertId: 'a4', symbol: 'SASA', triggeredAt: '2026-04-14 11:42', priceAtTrigger: 63.20, message: '🔴 SASA -%4.2 düşüş — Dikkat!', scoreAtTrigger: 22 },
  { alertId: 'a4', symbol: 'SASA', triggeredAt: '2026-04-11 10:15', priceAtTrigger: 68.50, message: '🔴 SASA -%3.8 düşüş', scoreAtTrigger: 28 },
  { alertId: 'a6', symbol: 'TUPRS', triggeredAt: '2026-04-13 15:22', priceAtTrigger: 176.80, message: '🏦 TUPRS — İş Yatırım 1.2M lot net alıcı', scoreAtTrigger: 65 },
  { alertId: 'a7', symbol: 'KOZAL', triggeredAt: '2026-04-14 10:05', priceAtTrigger: 262.40, message: '📊 KOZAL hacim 1.8x normale çıktı', scoreAtTrigger: 75 },
  { alertId: 'a9', symbol: 'THYAO', triggeredAt: '2026-04-12 16:45', priceAtTrigger: 298.20, message: '🌍 THYAO yabancı oranı +0.6pp arttı', scoreAtTrigger: 82 },
  { alertId: 'a10', symbol: 'EREGL', triggeredAt: '2026-04-14 13:58', priceAtTrigger: 54.20, message: '⚡ EREGL Konverjans Skoru anlık 88 — Yükselen!', scoreAtTrigger: 88 },
];

export const getAlertTypeLabel = (type: Alert['type']): string => {
  const labels: Record<Alert['type'], string> = {
    price: '💰 Fiyat', percent: '📉 Değişim %', technical: '📈 Teknik', institutional: '🏦 Kurum',
    convergence: '⚡ Konverjans', kap: '📰 KAP Haber', dividend: '💎 Temettü', volume: '📊 Hacim',
    custody: '🌍 Takas', realtime: '🔴 Anlık Konverjans',
  };
  return labels[type];
};
