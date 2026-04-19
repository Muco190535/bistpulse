import { useState } from 'react';
import { strategies } from '../../data/strategies';
import { stocks } from '../../data/stocks';
import { useStore } from '../../store/useStore';
import { useCurrentPrice } from '../../hooks/usePriceSimulation';
import { ConvergenceBar } from '../../components/Cards/ConvergenceBar';
import { getConvergence } from '../../data/convergence';

type ScreenTab = 'technical' | 'fundamental' | 'custody' | 'swap';

const StockMiniCard = ({ symbol }: { symbol: string }) => {
  const stock = stocks.find(s => s.symbol === symbol);
  const { price, flash } = useCurrentPrice(symbol);
  const { setSelectedStock } = useStore();
  const conv = getConvergence(symbol);
  if (!stock) return null;
  const dp = price || stock.price;
  const ch = ((dp - (stock.price - stock.change)) / (stock.price - stock.change)) * 100;

  return (
    <button onClick={() => setSelectedStock(symbol)}
      className={`w-full flex items-center justify-between py-2.5 px-3 rounded-xl bg-dark-card border border-dark-border card-hover ${flash === 'green' ? 'price-flash-green' : flash === 'red' ? 'price-flash-red' : ''}`}>
      <div className="flex items-center gap-3">
        <div>
          <p className="text-sm font-bold font-mono text-text-primary">{stock.symbol}</p>
          <p className="text-[10px] text-text-secondary">{stock.sector}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {conv && <div className="w-16"><ConvergenceBar score={conv.totalScore} size="sm" /></div>}
        <div className="text-right">
          <p className="text-sm font-mono tabular-nums text-text-primary">{dp.toFixed(2)}₺</p>
          <p className={`text-[11px] font-mono tabular-nums ${ch >= 0 ? 'text-brand-green' : 'text-brand-red'}`}>
            {ch >= 0 ? '+' : ''}{ch.toFixed(2)}%
          </p>
        </div>
      </div>
    </button>
  );
};

export const ScreeningPage = () => {
  const [tab, setTab] = useState<ScreenTab>('technical');
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);
  const [fundamentalFilter, setFundamentalFilter] = useState('value');

  const tabItems: { id: ScreenTab; label: string; icon: string }[] = [
    { id: 'technical', label: 'Teknik', icon: '📈' },
    { id: 'fundamental', label: 'Temel', icon: '📋' },
    { id: 'custody', label: 'AKD', icon: '🏦' },
    { id: 'swap', label: 'Takas', icon: '🔄' },
  ];

  const fundamentalPresets: Record<string, { label: string; icon: string; filter: (s: typeof stocks[0]) => boolean; desc: string }> = {
    value: { label: 'Klasik Değer (Graham)', icon: '📚', filter: s => s.pe > 0 && s.pe < 10 && s.pb < 1.5 && s.currentRatio > 1, desc: 'F/K < 10, PD/DD < 1.5, Cari Oran > 1' },
    growth: { label: 'Agresif Büyüme', icon: '🚀', filter: s => s.revenueGrowth > 30 && s.profitGrowth > 30, desc: 'Satış büyümesi > %30, Kâr büyümesi > %30' },
    quality: { label: 'Kalite & Makul Fiyat', icon: '💎', filter: s => s.roe > 20 && s.pe > 0 && s.pe < 15 && s.netProfitMargin > 10, desc: 'ROE > %20, F/K < 15, Net Kâr Marjı > %10' },
    roic: { label: 'ROIC Şampiyonları', icon: '🏆', filter: s => s.roic > 20 && s.evEbitda > 0 && s.evEbitda < 7, desc: 'ROIC > %20, FD/FAVÖK < 7' },
    cash: { label: 'Nakit Kralları', icon: '💰', filter: s => s.netDebtEbitda < 0 && s.currentRatio > 1.5, desc: 'Net Borç/FAVÖK < 0, Cari Oran > 1.5' },
    dividend: { label: 'Temettü Kalesi', icon: '🏰', filter: s => s.dividendYield > 5, desc: 'Temettü Getirisi > %5' },
    foreign: { label: 'Yabancı Radarı', icon: '🌍', filter: s => s.foreignOwnership > 40 && s.changePercent > 0, desc: 'Yabancı Oranı > %40, Pozitif Değişim' },
    hybrid: { label: 'Büyüme + Değer Hibrit', icon: '⚡', filter: s => s.roic > 15 && s.pe > 0 && s.pe < 20 && s.revenueGrowth > 15, desc: 'ROIC > %15, F/K < 20, Satış Büyümesi > %15' },
  };

  const custodyData = [
    { symbol: 'EREGL', institution: 'Ak Yatırım', netLots: '+2.4M', days: 4, share: 8.2, trend: 'up' as const },
    { symbol: 'THYAO', institution: 'İş Yatırım', netLots: '+1.8M', days: 3, share: 5.4, trend: 'up' as const },
    { symbol: 'AKBNK', institution: 'Yapı Kredi Yat.', netLots: '+1.5M', days: 5, share: 4.8, trend: 'up' as const },
    { symbol: 'KOZAL', institution: 'Tera Yatırım', netLots: '+980K', days: 2, share: 6.1, trend: 'up' as const },
    { symbol: 'TUPRS', institution: 'İş Yatırım', netLots: '+1.2M', days: 3, share: 7.2, trend: 'up' as const },
    { symbol: 'GARAN', institution: 'Ak Yatırım', netLots: '+2.1M', days: 4, share: 3.8, trend: 'up' as const },
    { symbol: 'SASA', institution: 'Deniz Yatırım', netLots: '-3.2M', days: 6, share: 9.5, trend: 'down' as const },
    { symbol: 'SAHOL', institution: 'Gedik Yatırım', netLots: '-1.1M', days: 3, share: 4.2, trend: 'down' as const },
  ];

  const swapData = {
    foreign: stocks.filter(s => s.foreignOwnership > 30).sort((a, b) => b.foreignOwnership - a.foreignOwnership).slice(0, 10),
    abnormal: [
      { symbol: 'EREGL', change: '+4.2pp', period: '1 Hafta', type: 'Yabancı', direction: 'up' as const },
      { symbol: 'THYAO', change: '+2.8pp', period: '1 Hafta', type: 'Kurum', direction: 'up' as const },
      { symbol: 'SASA', change: '-6.5pp', period: '1 Hafta', type: 'Yabancı', direction: 'down' as const },
      { symbol: 'AKBNK', change: '+1.9pp', period: '1 Hafta', type: 'Kurum', direction: 'up' as const },
      { symbol: 'KOZAL', change: '+3.1pp', period: '2 Hafta', type: 'Yabancı', direction: 'up' as const },
    ],
  };

  const activeStrategy = strategies.find(s => s.id === selectedStrategy);

  return (
    <div className="flex flex-col h-full">
      <div className="flex px-4 pt-3 gap-1">
        {tabItems.map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); setSelectedStrategy(null); }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${tab === t.id ? 'bg-brand-teal text-dark-bg' : 'bg-dark-card text-text-secondary'}`}>
            <span>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-20">
        {/* TEKNİK TARAMA */}
        {tab === 'technical' && !selectedStrategy && (
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-text-primary mb-1">📈 Teknik Stratejiler <span className="text-brand-teal">({strategies.length})</span></h2>
            <p className="text-[11px] text-text-secondary mb-3">Her strateji geçmiş başarı oranı ve anlık eşleşme sayısı ile birlikte</p>
            {strategies.map(s => (
              <button key={s.id} onClick={() => setSelectedStrategy(s.id)}
                className="w-full bg-dark-card rounded-xl p-3 border border-dark-border card-hover text-left">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{s.icon}</span>
                    <span className="text-sm font-bold text-text-primary">{s.name}</span>
                    {s.isNew && <span className="text-[9px] bg-brand-teal/20 text-brand-teal px-1.5 py-0.5 rounded-full font-bold">YENİ</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-brand-green/10 text-brand-green px-2 py-0.5 rounded-full font-mono">{s.matchCount} eşleşme</span>
                  </div>
                </div>
                <p className="text-[11px] text-text-secondary mb-2 line-clamp-1">{s.description}</p>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] text-text-secondary">Başarı: <span className="text-brand-green font-bold">%{s.winRate}</span></span>
                  <span className="text-[10px] text-text-secondary">Ort. Getiri: <span className="text-brand-teal font-bold">%{s.avgReturn}</span></span>
                  <span className="text-[10px] text-text-secondary">Tutma: <span className="text-text-primary font-bold">{s.avgHoldDays}G</span></span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* TEKNİK STRATEJİ DETAY */}
        {tab === 'technical' && activeStrategy && (
          <div className="space-y-3">
            <button onClick={() => setSelectedStrategy(null)} className="text-brand-teal text-xs font-medium">← Stratejilere Dön</button>
            <div className="bg-dark-card rounded-2xl p-4 border border-dark-border">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{activeStrategy.icon}</span>
                <div>
                  <h2 className="text-base font-bold text-text-primary">{activeStrategy.name}</h2>
                  <p className="text-[11px] text-text-secondary">{activeStrategy.description}</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-3">
                <div className="bg-dark-bg rounded-lg p-2 text-center">
                  <p className="text-lg font-bold text-brand-green">{activeStrategy.matchCount}</p>
                  <p className="text-[9px] text-text-secondary">Eşleşme</p>
                </div>
                <div className="bg-dark-bg rounded-lg p-2 text-center">
                  <p className="text-lg font-bold text-brand-teal">%{activeStrategy.winRate}</p>
                  <p className="text-[9px] text-text-secondary">Başarı</p>
                </div>
                <div className="bg-dark-bg rounded-lg p-2 text-center">
                  <p className="text-lg font-bold text-brand-green">%{activeStrategy.avgReturn}</p>
                  <p className="text-[9px] text-text-secondary">Ort. Getiri</p>
                </div>
                <div className="bg-dark-bg rounded-lg p-2 text-center">
                  <p className="text-lg font-bold text-text-primary">{activeStrategy.avgHoldDays}G</p>
                  <p className="text-[9px] text-text-secondary">Tutma</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-dark-border">
                <p className="text-[10px] text-text-secondary mb-1.5">Strateji Koşulları:</p>
                {activeStrategy.conditions.map((c, i) => (
                  <div key={i} className="flex items-center gap-1.5 mb-1">
                    <span className="text-brand-teal text-[10px]">✓</span>
                    <span className="text-[11px] text-text-secondary">{c}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 bg-brand-teal/5 rounded-lg p-2">
                <span className="text-[10px] text-brand-teal">🎯 En iyi piyasa koşulu: {activeStrategy.bestMarket}</span>
              </div>
            </div>
            <h3 className="text-sm font-bold text-text-primary">Eşleşen Hisseler ({activeStrategy.matchCount})</h3>
            {activeStrategy.matches.map(m => (
              <div key={m.symbol} className="flex items-center gap-2">
                <div className="flex-1"><StockMiniCard symbol={m.symbol} /></div>
                <div className="bg-dark-card rounded-lg px-2 py-1 border border-dark-border">
                  <p className="text-[9px] text-text-secondary">Güç</p>
                  <p className="text-sm font-bold text-brand-teal font-mono">{m.strength}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TEMEL TARAMA */}
        {tab === 'fundamental' && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-text-primary">📋 Temel Analiz Taraması</h2>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(fundamentalPresets).map(([key, preset]) => (
                <button key={key} onClick={() => setFundamentalFilter(key)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all ${fundamentalFilter === key ? 'bg-brand-teal text-dark-bg' : 'bg-dark-card text-text-secondary border border-dark-border'}`}>
                  <span>{preset.icon}</span>{preset.label}
                </button>
              ))}
            </div>
            <div className="bg-dark-card rounded-xl p-3 border border-brand-teal/20">
              <p className="text-xs font-bold text-brand-teal">{fundamentalPresets[fundamentalFilter].icon} {fundamentalPresets[fundamentalFilter].label}</p>
              <p className="text-[10px] text-text-secondary mt-0.5">{fundamentalPresets[fundamentalFilter].desc}</p>
            </div>
            <div className="space-y-2">
              {stocks.filter(fundamentalPresets[fundamentalFilter].filter).map(s => (
                <StockMiniCard key={s.symbol} symbol={s.symbol} />
              ))}
              {stocks.filter(fundamentalPresets[fundamentalFilter].filter).length === 0 && (
                <p className="text-center text-text-secondary text-xs py-8">Bu filtreye uyan hisse bulunamadı</p>
              )}
            </div>
          </div>
        )}

        {/* AKD TARAMA */}
        {tab === 'custody' && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-text-primary">🏦 Kurum Takas Taraması</h2>
            <div className="bg-dark-card rounded-xl p-3 border border-brand-green/20">
              <p className="text-xs font-bold text-brand-green mb-2">🟢 Net Alıcı Kurumlar</p>
              {custodyData.filter(c => c.trend === 'up').map(c => (
                <div key={c.symbol + c.institution} className="flex items-center justify-between py-2 border-b border-dark-border/50 last:border-0">
                  <div>
                    <span className="text-xs font-bold font-mono text-text-primary">{c.symbol}</span>
                    <span className="text-[10px] text-text-secondary ml-2">{c.institution}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-text-secondary">{c.days}G</span>
                    <span className="text-xs font-mono font-bold text-brand-green">{c.netLots}</span>
                    <span className="text-[10px] text-text-secondary">%{c.share}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-dark-card rounded-xl p-3 border border-brand-red/20">
              <p className="text-xs font-bold text-brand-red mb-2">🔴 Net Satıcı Kurumlar</p>
              {custodyData.filter(c => c.trend === 'down').map(c => (
                <div key={c.symbol + c.institution} className="flex items-center justify-between py-2 border-b border-dark-border/50 last:border-0">
                  <div>
                    <span className="text-xs font-bold font-mono text-text-primary">{c.symbol}</span>
                    <span className="text-[10px] text-text-secondary ml-2">{c.institution}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-text-secondary">{c.days}G</span>
                    <span className="text-xs font-mono font-bold text-brand-red">{c.netLots}</span>
                    <span className="text-[10px] text-text-secondary">%{c.share}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAKAS TARAMA */}
        {tab === 'swap' && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-text-primary">🔄 Takas Taraması</h2>
            <div className="bg-dark-card rounded-xl p-3 border border-dark-border">
              <p className="text-xs font-bold text-text-primary mb-2">🌍 En Yüksek Yabancı Oranı</p>
              {swapData.foreign.map(s => (
                <div key={s.symbol} className="flex items-center justify-between py-2 border-b border-dark-border/50 last:border-0">
                  <span className="text-xs font-bold font-mono text-text-primary">{s.symbol}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 rounded-full bg-dark-bg overflow-hidden">
                      <div className="h-full bg-brand-teal rounded-full" style={{ width: `${s.foreignOwnership}%` }} />
                    </div>
                    <span className="text-xs font-mono font-bold text-brand-teal tabular-nums">%{s.foreignOwnership.toFixed(1)}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-dark-card rounded-xl p-3 border border-brand-yellow/20">
              <p className="text-xs font-bold text-brand-yellow mb-2">⚠️ Anormal Takas Değişimleri (Son 1 Hafta)</p>
              {swapData.abnormal.map((a, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-dark-border/50 last:border-0">
                  <div>
                    <span className="text-xs font-bold font-mono text-text-primary">{a.symbol}</span>
                    <span className="text-[10px] text-text-secondary ml-2">{a.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-text-secondary">{a.period}</span>
                    <span className={`text-xs font-mono font-bold ${a.direction === 'up' ? 'text-brand-green' : 'text-brand-red'}`}>{a.change}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
