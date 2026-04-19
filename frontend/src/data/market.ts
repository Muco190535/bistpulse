export const marketSummary = {
  bist100: { value: 10234.58, change: 1.24, prevClose: 10109.12 },
  bist50: { value: 4812.35, change: 1.18 },
  bist30: { value: 3456.78, change: 1.32 },
  usdtry: { value: 38.42, change: -0.15 },
  eurtry: { value: 41.85, change: -0.22 },
  goldGram: { value: 3842.50, change: 0.85 },
  sp500Futures: { value: 5428.50, change: 0.32 },
  dax: { value: 18245.80, change: 0.18 },
  marketBreadth: { advancing: 334, declining: 148, unchanged: 18 },
  sessionStatus: 'open' as const,
  totalVolume: '48.2 Milyar ₺',
};

export const morningBriefing = {
  date: new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
  globalSummary: 'ABD piyasaları gece %0.3 artışla kapandı. Avrupa vadelileri pozitif açılışa işaret ediyor. Dolar endeksi zayıflıyor, gelişmekte olan piyasalara sermaye akışı beklentisi güçlü.',
  keyEvents: [
    '🔴 TCMB faiz kararı bu hafta Perşembe',
    '🟢 EREGL bilanço açıklaması yarın seans sonrası',
    '🟡 THYAO yolcu istatistikleri bugün 16:00\'da',
    '🟢 ABD enflasyon verisi beklentilerin altında geldi',
  ],
  convergencePreview: 'Konverjans Radarı\'nda 5 hisse aktif. EREGL 91 puan ile zirvede.',
  calendarEvents: [
    { type: 'dividend', text: 'DOAS temettü son alım tarihi: 22 Nisan' },
    { type: 'earnings', text: 'EREGL bilanço açıklaması: 15 Nisan seans sonrası' },
    { type: 'ipo', text: 'XYZ Teknoloji halka arz — ilk işlem günü: 18 Nisan' },
  ],
};

export const sectorPerformance = [
  { name: 'Bankacılık', change: 2.85, color: '#10B981' },
  { name: 'Havacılık', change: 2.12, color: '#10B981' },
  { name: 'Metal', change: 1.95, color: '#10B981' },
  { name: 'Holding', change: 1.42, color: '#10B981' },
  { name: 'Otomotiv', change: 0.85, color: '#10B981' },
  { name: 'Telekomünikasyon', change: 0.45, color: '#10B981' },
  { name: 'Perakende', change: -0.52, color: '#EF4444' },
  { name: 'Cam', change: -0.88, color: '#EF4444' },
  { name: 'Kimya', change: -2.45, color: '#EF4444' },
];

export const topMovers = {
  gainers: [
    { symbol: 'SASA', change: 5.74 },  // ters çevirelim, bu demo da bazen yukarı da olabilir
    { symbol: 'KOZAL', change: 3.26 },
    { symbol: 'EREGL', change: 3.69 },
    { symbol: 'AKBNK', change: 3.06 },
    { symbol: 'DOAS', change: 2.63 },
  ],
  losers: [
    { symbol: 'SASA', change: -5.74 },
    { symbol: 'SAHOL', change: -1.38 },
    { symbol: 'SISE', change: -1.17 },
    { symbol: 'BIMAS', change: -0.86 },
    { symbol: 'TOASO', change: -0.80 },
  ],
  volumeLeaders: [
    { symbol: 'YKBNK', volume: '120M' },
    { symbol: 'AKBNK', volume: '95M' },
    { symbol: 'GARAN', volume: '82M' },
    { symbol: 'EREGL', volume: '62M' },
    { symbol: 'THYAO', volume: '48.5M' },
  ],
};
