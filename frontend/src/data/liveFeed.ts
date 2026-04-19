export interface FeedEvent {
  id: string;
  time: string;
  symbol: string;
  type: 'positive' | 'warning' | 'negative';
  category: string;
  description: string;
  importance: number;
}

export const liveFeedEvents: FeedEvent[] = [
  { id: '1', time: '14:42', symbol: 'EREGL', type: 'positive', category: 'Kurum Alımı', description: 'Ak Yatırım 2.4M lot net alıcı geçti', importance: 5 },
  { id: '2', time: '14:38', symbol: 'THYAO', type: 'positive', category: 'Teknik Kırılım', description: 'VWAP 299.80 seviyesi kırıldı, fiyat 302.50', importance: 4 },
  { id: '3', time: '14:35', symbol: 'KOZAL', type: 'warning', category: 'RSI Uyarısı', description: 'RSI 72.4 ile aşırı alım bölgesine yaklaşıyor', importance: 3 },
  { id: '4', time: '14:31', symbol: 'SASA', type: 'negative', category: 'Sert Düşüş', description: 'Gün içi -%5.74 düşüş, 62.40₺ seviyesi test ediliyor', importance: 5 },
  { id: '5', time: '14:28', symbol: 'AKBNK', type: 'positive', category: 'Hacim Artışı', description: 'Hacim 1.6x normale çıktı, kurumsal ilgi artıyor', importance: 4 },
  { id: '6', time: '14:25', symbol: 'SAHOL', type: 'warning', category: 'Büyük Satış Duvarı', description: '83.00₺ seviyesinde 1.2M lot satış emri tespit edildi', importance: 3 },
  { id: '7', time: '14:22', symbol: 'GARAN', type: 'positive', category: 'Yabancı Alım', description: 'Yabancı oranı bugün +0.3pp arttı, toplam %52.8', importance: 4 },
  { id: '8', time: '14:18', symbol: 'DOAS', type: 'positive', category: 'Temettü', description: 'Temettü tarihi 8 gün sonra — brüt %12.5 getiri', importance: 3 },
  { id: '9', time: '14:15', symbol: 'EREGL', type: 'positive', category: 'Konverjans', description: 'Konverjans Skoru 91/100\'e yükseldi — çok güçlü sinyal', importance: 5 },
  { id: '10', time: '14:10', symbol: 'BIMAS', type: 'negative', category: 'Trend Zayıflama', description: 'EMA20 altına indi, MACD negatife döndü', importance: 3 },
  { id: '11', time: '14:05', symbol: 'PGSUS', type: 'positive', category: 'KAP Haberi', description: 'Yeni hat açıklaması — Londra-Antalya seferleri başlıyor', importance: 4 },
  { id: '12', time: '14:00', symbol: 'TUPRS', type: 'positive', category: 'Kurum Alımı', description: 'İş Yatırım ve Tera Yatırım eş zamanlı alımda', importance: 4 },
];
