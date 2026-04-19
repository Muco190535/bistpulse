export const kapAjanData = [
  { time: '14:52', symbol: 'THYAO', title: 'Yolcu istatistikleri açıklandı', type: 'bildirim' as const, important: true },
  { time: '14:35', symbol: 'EREGL', title: 'Bilanço açıklama tarihi güncellendi', type: 'bildirim' as const, important: false },
  { time: '14:20', symbol: 'SASA', title: 'Özel durum açıklaması', type: 'ozel-durum' as const, important: true },
  { time: '13:55', symbol: 'DOAS', title: 'Temettü dağıtım kararı', type: 'temettü' as const, important: true },
  { time: '13:30', symbol: 'GARAN', title: 'Yönetim kurulu kararı', type: 'bildirim' as const, important: false },
  { time: '13:10', symbol: 'PGSUS', title: 'Yeni hat açılışı duyurusu', type: 'bildirim' as const, important: false },
  { time: '12:45', symbol: 'AKBNK', title: 'Kredi notu güncellendi — pozitif', type: 'ozel-durum' as const, important: true },
  { time: '12:20', symbol: 'KOZAL', title: 'Üretim artışı planı onaylandı', type: 'bildirim' as const, important: false },
];

export const teorikListeData = [
  { symbol: 'EREGL', currentPrice: 54.85, teorikPrice: 56.20, diff: 2.46, direction: 'up' as const },
  { symbol: 'AKBNK', currentPrice: 62.30, teorikPrice: 63.80, diff: 2.41, direction: 'up' as const },
  { symbol: 'SASA', currentPrice: 62.40, teorikPrice: 60.10, diff: -3.69, direction: 'down' as const },
  { symbol: 'KOZAL', currentPrice: 265.80, teorikPrice: 270.50, diff: 1.77, direction: 'up' as const },
  { symbol: 'THYAO', currentPrice: 302.50, teorikPrice: 305.20, diff: 0.89, direction: 'up' as const },
  { symbol: 'SAHOL', currentPrice: 82.45, teorikPrice: 81.20, diff: -1.52, direction: 'down' as const },
];

export const yukselenDusenData = {
  yukselen: [
    { symbol: 'KOZAL', change: 3.26, price: 265.80, volume: '8.5M' },
    { symbol: 'EREGL', change: 3.69, price: 54.85, volume: '62M' },
    { symbol: 'AKBNK', change: 3.06, price: 62.30, volume: '95M' },
    { symbol: 'DOAS', change: 2.63, price: 218.40, volume: '6.8M' },
    { symbol: 'GARAN', change: 2.55, price: 128.40, volume: '82M' },
    { symbol: 'YKBNK', change: 2.43, price: 34.56, volume: '120M' },
    { symbol: 'PGSUS', change: 2.12, price: 892.00, volume: '2.8M' },
    { symbol: 'THYAO', change: 2.11, price: 302.50, volume: '48.5M' },
    { symbol: 'KCHOL', change: 2.11, price: 198.50, volume: '18.5M' },
    { symbol: 'ASELS', change: 1.66, price: 88.65, volume: '35.2M' },
  ],
  dusen: [
    { symbol: 'SASA', change: -5.74, price: 62.40, volume: '45M' },
    { symbol: 'SAHOL', change: -1.38, price: 82.45, volume: '22.4M' },
    { symbol: 'SISE', change: -1.17, price: 48.92, volume: '28.4M' },
    { symbol: 'BIMAS', change: -0.86, price: 520.00, volume: '3.2M' },
    { symbol: 'TOASO', change: -0.80, price: 345.20, volume: '4.5M' },
    { symbol: 'TAVHL', change: -0.73, price: 108.40, volume: '5.2M' },
  ],
};

export const alSatSinyalleriData = [
  { symbol: 'EREGL', signal: 'AL' as const, strategy: 'Momentum Bombası', strength: 95, price: 54.85, time: '14:40' },
  { symbol: 'THYAO', signal: 'AL' as const, strategy: 'Golden Cross', strength: 90, price: 302.50, time: '14:15' },
  { symbol: 'AKBNK', signal: 'AL' as const, strategy: 'Akıllı Para', strength: 82, price: 62.30, time: '13:58' },
  { symbol: 'KOZAL', signal: 'AL' as const, strategy: 'Roket Rampa', strength: 88, price: 265.80, time: '13:42' },
  { symbol: 'SASA', signal: 'SAT' as const, strategy: 'Trend Kırılım', strength: 85, price: 62.40, time: '11:35' },
  { symbol: 'SAHOL', signal: 'SAT' as const, strategy: 'Destek Kaybı', strength: 72, price: 82.45, time: '12:20' },
  { symbol: 'DOAS', signal: 'AL' as const, strategy: 'Temettü Yaklaşımı', strength: 92, price: 218.40, time: '14:05' },
  { symbol: 'GARAN', signal: 'AL' as const, strategy: 'Yabancı Girişi', strength: 78, price: 128.40, time: '13:25' },
];

export const viopData = [
  { name: 'BIST30 Nisan', last: 3456.50, change: 1.32, volume: '42.5K', openInterest: '285K' },
  { name: 'BIST30 Haziran', last: 3512.00, change: 1.18, volume: '12.8K', openInterest: '95K' },
  { name: 'USD/TRY Nisan', last: 38.4200, change: -0.15, volume: '28.4K', openInterest: '180K' },
  { name: 'USD/TRY Haziran', last: 39.1500, change: -0.08, volume: '8.2K', openInterest: '55K' },
  { name: 'Altın Nisan', last: 3842.50, change: 0.85, volume: '5.4K', openInterest: '32K' },
  { name: 'THYAO Nisan', last: 302.50, change: 2.11, volume: '18.5K', openInterest: '120K' },
  { name: 'GARAN Nisan', last: 128.40, change: 2.55, volume: '22.8K', openInterest: '145K' },
];

export const halkaArzData = [
  { company: 'XYZ Teknoloji', sector: 'Teknoloji', dateRange: '15-18 Nisan', priceRange: '₺45-52', status: 'Talep Toplama' as const, demand: 4.2 },
  { company: 'ABC Enerji', sector: 'Enerji', dateRange: '22-25 Nisan', priceRange: '₺28-34', status: 'Yakında' as const, demand: 0 },
  { company: 'Smart Finans', sector: 'Finans', dateRange: '1-4 Mayıs', priceRange: '₺12-15', status: 'Yakında' as const, demand: 0 },
  { company: 'Mega İnşaat', sector: 'İnşaat', dateRange: 'Tamamlandı', priceRange: '₺22', status: 'Tamamlandı' as const, demand: 6.8 },
];

export const geriAlimlarData = [
  { symbol: 'THYAO', amount: '₺2.5 Milyar', remainingPercent: 42, startDate: '2026-01-15', endDate: '2026-07-15' },
  { symbol: 'GARAN', amount: '₺1.8 Milyar', remainingPercent: 65, startDate: '2026-02-01', endDate: '2026-08-01' },
  { symbol: 'KCHOL', amount: '₺800 Milyon', remainingPercent: 28, startDate: '2025-12-01', endDate: '2026-06-01' },
  { symbol: 'TUPRS', amount: '₺1.2 Milyar', remainingPercent: 55, startDate: '2026-03-01', endDate: '2026-09-01' },
];

export const sonBilancolarData = [
  { symbol: 'THYAO', period: '2025/12', revenue: '₺285.4 Milyar', netProfit: '₺42.2 Milyar', revenueGrowth: 28.4, profitGrowth: 35.2, date: '2026-03-15' },
  { symbol: 'GARAN', period: '2025/12', revenue: '₺128.5 Milyar', netProfit: '₺41.6 Milyar', revenueGrowth: 45.2, profitGrowth: 52.8, date: '2026-03-12' },
  { symbol: 'AKBNK', period: '2025/12', revenue: '₺98.2 Milyar', netProfit: '₺35.1 Milyar', revenueGrowth: 52.4, profitGrowth: 62.8, date: '2026-03-10' },
  { symbol: 'EREGL', period: '2025/12', revenue: '₺78.5 Milyar', netProfit: '₺8.0 Milyar', revenueGrowth: 22.5, profitGrowth: 18.9, date: '2026-03-08' },
  { symbol: 'FROTO', period: '2025/12', revenue: '₺142.8 Milyar', netProfit: '₺12.1 Milyar', revenueGrowth: 42.5, profitGrowth: 38.4, date: '2026-03-05' },
];

export const paraGirisCikisData = [
  { symbol: 'GARAN', netFlow: 245.8, type: 'inflow' as const, period: '5 Gün' },
  { symbol: 'THYAO', netFlow: 198.4, type: 'inflow' as const, period: '5 Gün' },
  { symbol: 'AKBNK', netFlow: 165.2, type: 'inflow' as const, period: '5 Gün' },
  { symbol: 'EREGL', netFlow: 142.8, type: 'inflow' as const, period: '5 Gün' },
  { symbol: 'KOZAL', netFlow: 85.4, type: 'inflow' as const, period: '5 Gün' },
  { symbol: 'SASA', netFlow: -285.6, type: 'outflow' as const, period: '5 Gün' },
  { symbol: 'SAHOL', netFlow: -142.2, type: 'outflow' as const, period: '5 Gün' },
  { symbol: 'SISE', netFlow: -98.5, type: 'outflow' as const, period: '5 Gün' },
  { symbol: 'BIMAS', netFlow: -65.4, type: 'outflow' as const, period: '5 Gün' },
];

export const sonHaberlerData = [
  { time: '14:52', title: 'TCMB faiz kararı öncesi piyasa beklentileri', source: 'Bloomberg HT', category: 'Piyasa' },
  { time: '14:30', title: 'THYAO yolcu sayısında %18 artış açıkladı', source: 'KAP', category: 'Şirket' },
  { time: '14:15', title: 'Altın fiyatları yeni rekor kırdı', source: 'Reuters', category: 'Emtia' },
  { time: '13:45', title: 'Bankacılık sektöründe yabancı alımları hızlandı', source: 'Ekonomist', category: 'Sektör' },
  { time: '13:20', title: 'ABD enflasyonu beklentilerin altında geldi', source: 'CNBC', category: 'Global' },
  { time: '12:55', title: 'EREGL bilanço beklentileri olumlu', source: 'Analist Raporu', category: 'Şirket' },
  { time: '12:30', title: 'Çin\'den çelik talebinde toparlanma sinyalleri', source: 'Reuters', category: 'Global' },
  { time: '12:00', title: 'Otomotiv ihracatı Mart ayında %25 arttı', source: 'OSD', category: 'Sektör' },
];

export const analistOnerileriData = [
  { symbol: 'THYAO', broker: 'İş Yatırım', recommendation: 'AL' as const, targetPrice: 380, currentPrice: 302.50, upside: 25.6, date: '2026-04-10' },
  { symbol: 'GARAN', broker: 'Ak Yatırım', recommendation: 'AL' as const, targetPrice: 165, currentPrice: 128.40, upside: 28.5, date: '2026-04-08' },
  { symbol: 'EREGL', broker: 'Yapı Kredi', recommendation: 'AL' as const, targetPrice: 68, currentPrice: 54.85, upside: 23.9, date: '2026-04-12' },
  { symbol: 'AKBNK', broker: 'Tera Yatırım', recommendation: 'AL' as const, targetPrice: 78, currentPrice: 62.30, upside: 25.2, date: '2026-04-09' },
  { symbol: 'SASA', broker: 'Gedik Yatırım', recommendation: 'TUT' as const, targetPrice: 72, currentPrice: 62.40, upside: 15.4, date: '2026-04-05' },
  { symbol: 'TUPRS', broker: 'Deniz Yatırım', recommendation: 'AL' as const, targetPrice: 215, currentPrice: 178.20, upside: 20.6, date: '2026-04-11' },
];

export const acigaSatisData = [
  { symbol: 'SASA', shortPercent: 4.8, change: 0.5, value: '₺316M', direction: 'up' as const },
  { symbol: 'SAHOL', shortPercent: 2.2, change: 0.3, value: '₺370M', direction: 'up' as const },
  { symbol: 'SISE', shortPercent: 1.8, change: -0.2, value: '₺238M', direction: 'down' as const },
  { symbol: 'THYAO', shortPercent: 0.8, change: -0.4, value: '₺333M', direction: 'down' as const },
  { symbol: 'EREGL', shortPercent: 0.5, change: -0.1, value: '₺97M', direction: 'down' as const },
];

export const tedbirliHisselerData = [
  { symbol: 'ABC', reason: 'Brüt Takas', since: '2026-04-01', marketCap: '₺245M' },
  { symbol: 'DEF', reason: 'Kredili İşlem Yasağı', since: '2026-03-28', marketCap: '₺128M' },
  { symbol: 'GHI', reason: 'Devre Kesici + Brüt Takas', since: '2026-04-10', marketCap: '₺65M' },
];

export const endekslerData = [
  { name: 'BIST 100', value: 10234.58, change: 1.24, high: 10298.42, low: 10108.25 },
  { name: 'BIST 50', value: 4812.35, change: 1.18, high: 4845.80, low: 4762.15 },
  { name: 'BIST 30', value: 3456.78, change: 1.32, high: 3478.50, low: 3422.10 },
  { name: 'BIST Banka', value: 5842.25, change: 2.85, high: 5880.40, low: 5745.80 },
  { name: 'BIST Sanayi', value: 8425.60, change: 0.82, high: 8452.30, low: 8365.20 },
  { name: 'BIST Teknoloji', value: 3215.45, change: 1.45, high: 3228.80, low: 3185.60 },
  { name: 'BIST Holding', value: 6128.90, change: 1.68, high: 6158.20, low: 6052.40 },
  { name: 'BIST Metal', value: 4562.80, change: 2.15, high: 4585.40, low: 4498.20 },
];
