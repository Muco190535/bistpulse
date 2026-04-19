export interface AISummary {
  symbol: string;
  generatedAt: string;
  sections: {
    technical: string;
    institutional: string;
    news: string;
    risk: string;
    overall: string;
  };
}

export const aiSummaries: Record<string, AISummary> = {
  THYAO: {
    symbol: 'THYAO', generatedAt: new Date().toISOString(),
    sections: {
      technical: '📈 Teknik görünüm olumlu. EMA20 (296.80) > EMA50 (288.40) > EMA200 (261.20) — pozitif trend dizilimi. RSI 62.4 ile momentum güçlü ancak aşırı alım bölgesinden uzak. MACD sinyal çizgisinin üzerinde, Golden Cross yakın zamanda oluştu. VWAP (299.80) üzerinde fiyatlanma kurumsal alıcıların kontrolü elinde tuttuğuna işaret ediyor.',
      institutional: '🏦 Kurum pozisyonu güçlü pozitif. Son 5 günde Ak Yatırım, İş Yatırım ve Yapı Kredi Yatırım net alıcı konumda. Toplam kurum birikimi günlük hacmin %12\'sine ulaşmış durumda. Yabancı oranı %49.2 ile zirve seviyeye yakın.',
      news: '📰 Yolcu sayısında %18 artış açıklandı. 2026 kâr beklentisi yukarı revize edildi. Yeni hat açılışları devam ediyor. Fitch not görünümünü "pozitif"e çevirdi. Yaz sezonu öncesi kapasite artırım planı açıklandı.',
      risk: '⚠️ Jet yakıt maliyetlerindeki dalgalanma marjları baskılayabilir. TL zayıflığı kısa vadede operasyonel maliyetleri artırabilir. RSI 62.4 ile kısa vadede küçük düzeltme olasılığı mevcut.',
      overall: '🎯 THYAO teknik, kurumsal ve temel açıdan güçlü. Konverjans skoru 82/100 ile "Güçlü Konverjans" bölgesinde. F/K 8.5 ile sektör ortalamasının altında. Kısa vadede 310₺ direnci, orta vadede 342₺ (52H zirve) hedefleri izlenebilir.\n\n⚠️ Bu bilgi yatırım tavsiyesi niteliği taşımaz.',
    },
  },
  EREGL: {
    symbol: 'EREGL', generatedAt: new Date().toISOString(),
    sections: {
      technical: '📈 Teknik görünüm çok güçlü. Tüm hareketli ortalamalar pozitif dizilimde. RSI 68.5 ile momentum yüksek. Relatif hacim 2.1x ile belirgin kurumsal ilgi mevcut. 3 farklı teknik strateji aynı anda aktif (Momentum Bombası, VWAP Savaşçısı, Akıllı Para).',
      institutional: '🏦 Kurumsal birikim dikkat çekici. 4 gün üst üste net kurum alımı devam ediyor. Ak Yatırım başı çekerken, Tera ve Gedik Yatırım da alıcı tarafta. Geniş tabanlı alım — tek kurum hakimiyeti yok.',
      news: '📰 Global çelik toparlanma sinyalleri güçleniyor. Çin talep artışı ham çelik fiyatlarını destekliyor. Kapasite artırım yatırımı duyuruldu. Yarın bilanço açıklaması bekleniyor — konsensüs tahminler olumlu.',
      risk: '⚠️ RSI 68.5 ile kısa vadede düzeltme riski mevcut. Global çelik arz fazlası baskı yaratabilir. Yarınki bilanço beklentilerin altında gelirse sert satış görebilir. Enerji maliyetleri marjları sınırlandırabilir.',
      overall: '🎯 EREGL Konverjans Radarı\'nın zirvesinde — 91/100. Teknik + Kurum + Temel + Yabancı tamamı güçlü. Bu skor seviyesinde geçmiş %78 başarı oranı var. Kısa vadede 58₺, orta vadede 62.40₺ (52H zirve). Yarınki bilanço kritik katalizör.\n\n⚠️ Bu bilgi yatırım tavsiyesi niteliği taşımaz.',
    },
  },
  AKBNK: {
    symbol: 'AKBNK', generatedAt: new Date().toISOString(),
    sections: {
      technical: '📈 Bankacılık sektöründe en güçlü teknik görünüm. EMA dizilimi pozitif, RSI 66.2 ile güçlü momentum. ADX 34.5 ile trend gücü yüksek. Hacim 1.6x ortalamanın üzerinde. MACD pozitif bölgede genişliyor.',
      institutional: '🏦 Yabancı oranı %48.5 ile güçlü talep. Son hafta 3 büyük kurum (İş, Ak, Deniz) net alıcı. Bankacılık sektörüne yönelik fonların portföy ağırlığı artırıldığı gözlemleniyor.',
      news: '📰 TCMB faiz kararı bu hafta Perşembe — piyasa sabitleme bekliyor. Akbank ilk çeyrek kâr tahmini konsensüsün %12 üzerinde. Dijital bankacılık kullanıcı sayısı %35 arttı.',
      risk: '⚠️ TCMB faiz kararı volatilite yaratabilir. Bankacılık sektörü faiz hassasiyeti yüksek. RSI 66.2 ile aşırı alıma yaklaşıyor.',
      overall: '🎯 AKBNK F/K 4.2 ile tarihsel ucuz seviyede. Konverjans skoru 78/100 güçlü. Bankacılık sektöründe yabancı tercih listesinin başında. Kısa vadede 65₺, orta vadede 68.50₺ (52H zirve) izlenebilir.\n\n⚠️ Bu bilgi yatırım tavsiyesi niteliği taşımaz.',
    },
  },
  KOZAL: {
    symbol: 'KOZAL', generatedAt: new Date().toISOString(),
    sections: {
      technical: '📈 Altın fiyatlarıyla paralel güçlü trend. RSI 72.4 ile aşırı alım bölgesinin eşiğinde. ADX 38.5 ile trend gücü çok yüksek. Tüm hareketli ortalamalar pozitif ve açı genişliyor.',
      institutional: '🏦 Kurum ilgisi orta seviyede. Net alıcı kurum sayısı 2 ile sınırlı. Yabancı oranı %18.5 ile düşük — artış potansiyeli var.',
      news: '📰 Altın fiyatları ons bazında yeni zirve yapıyor. Global jeopolitik riskler altın talebini destekliyor. Şirketin üretim artışı planı onaylandı.',
      risk: '⚠️ RSI 72.4 aşırı alım riski! Altın fiyatlarında düzeltme gelirse hızlı geri çekilme olabilir. Düşük free float (%20) volatiliteyi artırıyor.',
      overall: '🎯 KOZAL altın rallisi ile güçlü performans. Konverjans skoru 75/100 iyi seviyede. RSI uyarısı nedeniyle yeni giriş yerine mevcut pozisyon tutmak daha uygun. 295₺ direnci kırılırsa yeni zirve hedefi.\n\n⚠️ Bu bilgi yatırım tavsiyesi niteliği taşımaz.',
    },
  },
  SASA: {
    symbol: 'SASA', generatedAt: new Date().toISOString(),
    sections: {
      technical: '📉 Teknik görünüm çok zayıf. Fiyat tüm hareketli ortalamaların altında. RSI 28.5 ile aşırı satım bölgesinde. MACD negatif bölgede derinleşiyor. Düşüş trendi devam ediyor, henüz dip sinyali yok.',
      institutional: '🏦 Kurumlar büyük oranda satıcı konumda. Son 10 günde net kurum satışı devam ediyor. Yabancı oranı %12.4 ile düşük ve azalmaya devam ediyor.',
      news: '📰 Polyester piyasasında global talep düşüşü devam ediyor. Şirketin yeni yatırım projesinin finansman maliyeti tartışılıyor. Kredi notunda "negatif izleme" uyarısı.',
      risk: '⚠️ Net Borç/FAVÖK 5.8 ile çok yüksek borçluluk. Negatif karlılık devam ediyor. Sermaye artırımı riski gündemde. Düşüş trendi kırılmadan giriş çok riskli.',
      overall: '🎯 SASA şu an ciddi baskı altında. Konverjans skoru 22/100 ile sinyal yok. RSI aşırı satımda olsa da düşüş trendinde aşırı satım daha da derinleşebilir. Temel göstergelerde iyileşme görülmeden uzak durulması daha sağlıklı.\n\n⚠️ Bu bilgi yatırım tavsiyesi niteliği taşımaz.',
    },
  },
  DOAS: {
    symbol: 'DOAS', generatedAt: new Date().toISOString(),
    sections: {
      technical: '📈 Pozitif teknik görünüm. EMA dizilimi sağlıklı, RSI 62.4. VWAP üzerinde fiyatlanma. Son 3 günde hacim artışı temettü tarihine yaklaşma etkisiyle açıklanabilir.',
      institutional: '🏦 Kurum birikimi hızlanıyor. Son 5 günde 3 kurum net alıcı. Temettü öncesi kurumsal pozisyonlanma belirgin.',
      news: '📰 %12.5 brüt temettü getirisi ile BIST\'in en yüksek temettü ödeyen şirketlerinden. Temettü son alım tarihi 22 Nisan. Otomotiv satış rakamları beklentilerin üzerinde geldi.',
      risk: '⚠️ Temettü sonrası fiyat düşüşü normal karşılanmalı. Kısa vadeli temettü avcıları satış baskısı yaratabilir.',
      overall: '🎯 DOAS temettü odaklı yatırımcılar için çok cazip. Konverjans skoru 72/100 güçlü. F/K 5.2 ile ucuz değerleme + %12.5 temettü getirisi kombinasyonu nadir bulunan bir fırsat.\n\n⚠️ Bu bilgi yatırım tavsiyesi niteliği taşımaz.',
    },
  },
};

export const getAISummary = (symbol: string): AISummary | undefined => aiSummaries[symbol];
