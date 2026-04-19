import { useState } from 'react';
import { marketSummary, sectorPerformance, topMovers } from '../../data/market';
import { useStore } from '../../store/useStore';

type OverviewTab = 'bulletin' | 'funds' | 'calendar';

export const OverviewPage = () => {
  const [tab, setTab] = useState<OverviewTab>('bulletin');
  const { setSelectedStock } = useStore();
  const breadth = marketSummary.marketBreadth;

  const funds = [
    { code: 'TI2', name: 'İş Portföy BIST100 Hisse SF', type: 'TEFAS', category: 'Hisse', risk: 6, return1m: 5.82, return3m: 12.4, return1y: 48.5, aum: '2.4 Milyar₺' },
    { code: 'IPB', name: 'İş Portföy Altın SF', type: 'TEFAS', category: 'Altın', risk: 5, return1m: 8.15, return3m: 22.8, return1y: 65.2, aum: '5.8 Milyar₺' },
    { code: 'YAY', name: 'Yapı Kredi BIST30 Endeks HYF', type: 'TEFAS', category: 'Hisse', risk: 6, return1m: 6.24, return3m: 14.2, return1y: 52.8, aum: '1.2 Milyar₺' },
    { code: 'AK2', name: 'Ak Portföy Amerikan Yab. HSF', type: 'TEFAS', category: 'Yabancı Hisse', risk: 5, return1m: 3.42, return3m: 8.5, return1y: 35.4, aum: '3.1 Milyar₺' },
    { code: 'TCD', name: 'TEB Portföy Gümüş BYF', type: 'TEFAS', category: 'Gümüş', risk: 5, return1m: 12.50, return3m: 28.4, return1y: 72.8, aum: '890 Milyon₺' },
    { code: 'GAR', name: 'Garanti Portföy Para Piyasası', type: 'TEFAS', category: 'Para Piyasası', risk: 2, return1m: 3.82, return3m: 11.5, return1y: 45.2, aum: '8.2 Milyar₺' },
  ];

  const dividends = [
    { symbol: 'DOAS', exDate: '22 Nisan', grossYield: 12.5, netPerShare: '₺12.75', payDate: '30 Nisan' },
    { symbol: 'TUPRS', exDate: '28 Nisan', grossYield: 8.5, netPerShare: '₺8.42', payDate: '8 Mayıs' },
    { symbol: 'EREGL', exDate: '2 Mayıs', grossYield: 5.8, netPerShare: '₺2.65', payDate: '12 Mayıs' },
    { symbol: 'FROTO', exDate: '5 Mayıs', grossYield: 4.8, netPerShare: '₺42.50', payDate: '15 Mayıs' },
    { symbol: 'ENKAI', exDate: '8 Mayıs', grossYield: 4.5, netPerShare: '₺2.32', payDate: '18 Mayıs' },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex px-4 pt-3 gap-1">
        {([
          { id: 'bulletin' as const, label: 'Bülten', icon: '📰' },
          { id: 'funds' as const, label: 'Fonlar', icon: '🏛️' },
          { id: 'calendar' as const, label: 'Takvim', icon: '📅' },
        ]).map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${tab === t.id ? 'bg-brand-teal text-dark-bg' : 'bg-dark-card text-text-secondary'}`}>
            <span>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-20">
        {tab === 'bulletin' && (
          <div className="space-y-3">
            {/* Piyasa Genişliği */}
            <div className="bg-dark-card rounded-2xl p-4 border border-dark-border">
              <h3 className="text-sm font-bold text-text-primary mb-2">📊 Piyasa Genişliği</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-brand-green text-sm font-bold">▲ {breadth.advancing}</span>
                <span className="text-text-secondary text-xs">● {breadth.unchanged}</span>
                <span className="text-brand-red text-sm font-bold">▼ {breadth.declining}</span>
              </div>
              <div className="w-full h-3 rounded-full overflow-hidden bg-brand-red/30 flex">
                <div className="h-full bg-brand-green" style={{ width: `${(breadth.advancing / 500) * 100}%` }} />
                <div className="h-full bg-gray-500" style={{ width: `${(breadth.unchanged / 500) * 100}%` }} />
              </div>
              <p className="text-[10px] text-text-secondary mt-2">Yükselen/Düşen oranı: <span className="text-brand-green font-bold">{(breadth.advancing / breadth.declining).toFixed(1)}x</span> — Piyasa genelinde pozitif eğilim</p>
            </div>

            {/* Endeks Özet */}
            <div className="bg-dark-card rounded-2xl p-4 border border-dark-border">
              <h3 className="text-sm font-bold text-text-primary mb-3">🏛️ Endeks Özeti</h3>
              {[
                { name: 'BIST 100', ...marketSummary.bist100 },
                { name: 'BIST 50', value: marketSummary.bist50.value, change: marketSummary.bist50.change },
                { name: 'BIST 30', value: marketSummary.bist30.value, change: marketSummary.bist30.change },
                { name: 'USD/TRY', value: marketSummary.usdtry.value, change: marketSummary.usdtry.change },
                { name: 'EUR/TRY', value: marketSummary.eurtry.value, change: marketSummary.eurtry.change },
                { name: 'Gram Altın', value: marketSummary.goldGram.value, change: marketSummary.goldGram.change },
              ].map(idx => (
                <div key={idx.name} className="flex items-center justify-between py-2 border-b border-dark-border/50 last:border-0">
                  <span className="text-xs text-text-secondary">{idx.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold tabular-nums text-text-primary">{idx.value.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                    <span className={`text-[11px] font-mono font-bold tabular-nums ${idx.change >= 0 ? 'text-brand-green' : 'text-brand-red'}`}>
                      {idx.change >= 0 ? '+' : ''}{idx.change.toFixed(2)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* En Çok Yükselenler / Düşenler */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-dark-card rounded-xl p-3 border border-brand-green/20">
                <p className="text-[10px] font-bold text-brand-green mb-2">▲ EN ÇOK YÜKSELEN</p>
                {topMovers.gainers.slice(0, 5).map(g => {
                  return (
                    <button key={g.symbol} onClick={() => setSelectedStock(g.symbol)} className="flex justify-between w-full py-1 card-hover">
                      <span className="text-[11px] font-mono font-bold text-text-primary">{g.symbol}</span>
                      <span className="text-[11px] font-mono font-bold text-brand-green">+%{g.change.toFixed(2)}</span>
                    </button>
                  );
                })}
              </div>
              <div className="bg-dark-card rounded-xl p-3 border border-brand-red/20">
                <p className="text-[10px] font-bold text-brand-red mb-2">▼ EN ÇOK DÜŞEN</p>
                {topMovers.losers.slice(0, 5).map(l => (
                  <button key={l.symbol} onClick={() => setSelectedStock(l.symbol)} className="flex justify-between w-full py-1 card-hover">
                    <span className="text-[11px] font-mono font-bold text-text-primary">{l.symbol}</span>
                    <span className="text-[11px] font-mono font-bold text-brand-red">{l.change.toFixed(2)}%</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Hacim Liderleri */}
            <div className="bg-dark-card rounded-xl p-3 border border-dark-border">
              <p className="text-[10px] font-bold text-brand-yellow mb-2">📊 HACİM LİDERLERİ</p>
              <div className="flex flex-wrap gap-2">
                {topMovers.volumeLeaders.map(v => (
                  <button key={v.symbol} onClick={() => setSelectedStock(v.symbol)}
                    className="bg-dark-bg px-2.5 py-1.5 rounded-lg card-hover">
                    <span className="text-[11px] font-mono font-bold text-text-primary">{v.symbol}</span>
                    <span className="text-[10px] text-text-secondary ml-1">{v.volume}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sektör Isı Haritası */}
            <div className="bg-dark-card rounded-2xl p-4 border border-dark-border">
              <h3 className="text-sm font-bold text-text-primary mb-3">🗺️ Sektör Isı Haritası</h3>
              <div className="grid grid-cols-3 gap-1.5">
                {sectorPerformance.map(s => (
                  <div key={s.name} className={`rounded-lg p-2 text-center ${s.change >= 0 ? 'bg-brand-green/10' : 'bg-brand-red/10'}`}>
                    <p className="text-[10px] text-text-secondary truncate">{s.name}</p>
                    <p className={`text-xs font-bold font-mono ${s.change >= 0 ? 'text-brand-green' : 'text-brand-red'}`}>
                      {s.change >= 0 ? '+' : ''}{s.change.toFixed(2)}%
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Yaklaşan Temettüler */}
            <div className="bg-dark-card rounded-2xl p-4 border border-dark-border">
              <h3 className="text-sm font-bold text-text-primary mb-3">💰 Yaklaşan Temettüler</h3>
              {dividends.map(d => (
                <button key={d.symbol} onClick={() => setSelectedStock(d.symbol)}
                  className="flex items-center justify-between w-full py-2.5 border-b border-dark-border/50 last:border-0 card-hover">
                  <div>
                    <span className="text-xs font-bold font-mono text-text-primary">{d.symbol}</span>
                    <span className="text-[10px] text-text-secondary ml-2">Son alım: {d.exDate}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-brand-green">%{d.grossYield.toFixed(1)}</span>
                    <p className="text-[10px] text-text-secondary">{d.netPerShare}/lot</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {tab === 'funds' && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-text-primary">🏛️ Fon Piyasası</h2>
            {funds.map(f => (
              <div key={f.code} className="bg-dark-card rounded-xl p-3 border border-dark-border">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-xs font-bold font-mono text-brand-teal">{f.code}</span>
                    <p className="text-[11px] text-text-secondary mt-0.5 line-clamp-1">{f.name}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: f.risk }, (_, i) => (
                      <div key={i} className={`w-1.5 h-3 rounded-sm ${i < 3 ? 'bg-brand-green' : i < 5 ? 'bg-brand-yellow' : 'bg-brand-red'}`} />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] bg-dark-bg text-text-secondary px-1.5 py-0.5 rounded">{f.category}</span>
                  <span className="text-[9px] text-text-secondary">{f.aum}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div className="text-center">
                    <p className="text-[9px] text-text-secondary">1 Ay</p>
                    <p className={`text-xs font-mono font-bold ${f.return1m >= 0 ? 'text-brand-green' : 'text-brand-red'}`}>%{f.return1m.toFixed(2)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] text-text-secondary">3 Ay</p>
                    <p className={`text-xs font-mono font-bold ${f.return3m >= 0 ? 'text-brand-green' : 'text-brand-red'}`}>%{f.return3m.toFixed(1)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] text-text-secondary">1 Yıl</p>
                    <p className={`text-xs font-mono font-bold ${f.return1y >= 0 ? 'text-brand-green' : 'text-brand-red'}`}>%{f.return1y.toFixed(1)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'calendar' && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-text-primary">📅 Finansal Takvim</h2>
            {[
              { date: '14 Nisan', events: [{ icon: '📊', text: 'THYAO yolcu istatistikleri 16:00' }, { icon: '🔔', text: 'TCMB PPK toplantı notları' }] },
              { date: '15 Nisan', events: [{ icon: '📊', text: 'EREGL bilanço açıklaması (seans sonrası)' }, { icon: '📊', text: 'ASELS 1Ç26 gelir tablosu' }] },
              { date: '17 Nisan', events: [{ icon: '🔴', text: 'TCMB faiz kararı' }, { icon: '📊', text: 'GARAN bilanço açıklaması' }] },
              { date: '18 Nisan', events: [{ icon: '🔔', text: 'XYZ Teknoloji halka arz — ilk işlem günü' }] },
              { date: '22 Nisan', events: [{ icon: '💰', text: 'DOAS temettü son alım tarihi' }, { icon: '📊', text: 'TUPRS bilanço açıklaması' }] },
              { date: '28 Nisan', events: [{ icon: '💰', text: 'TUPRS temettü son alım tarihi' }] },
            ].map(day => (
              <div key={day.date} className="bg-dark-card rounded-xl p-3 border border-dark-border">
                <p className="text-xs font-bold text-brand-teal mb-2">{day.date}</p>
                {day.events.map((e, i) => (
                  <div key={i} className="flex items-start gap-2 py-1">
                    <span className="text-sm">{e.icon}</span>
                    <p className="text-xs text-text-secondary">{e.text}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
