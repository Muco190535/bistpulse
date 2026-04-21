import { usePrices, useCurrency, useIndices, useKAP } from '../../hooks/useAPI';
import { useStore } from '../../store/useStore';
import { useSettings } from '../../store/useSettings';
import { getRadarStocks } from '../../data/convergence';
import { ConvergenceBar } from '../../components/Cards/ConvergenceBar';

export const HomePage = () => {
  const { prices } = usePrices();
  const currency = useCurrency();
  const { data: indices } = useIndices();
  const kapNews = useKAP();
  const { setSelectedStock, setActiveTab } = useStore();
  const { showWelcome } = useSettings();
  const radar = getRadarStocks();
  const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;

  const topGainers = [...prices].sort((a, b) => b.changePercent - a.changePercent).slice(0, 5);
  const topLosers = [...prices].sort((a, b) => a.changePercent - b.changePercent).slice(0, 5);
  const topVolume = [...prices].sort((a, b) => b.volume - a.volume).slice(0, 5);

  const filteredKap = kapNews.filter(k => k.title && !k.title.includes('yüklenemiyor'));

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto pb-20">

        {/* Karşılama */}
        {showWelcome && (
          <div className="px-4 pt-3 pb-1">
            <p className="text-lg font-bold text-text-primary">
              Merhaba{tgUser?.first_name ? `, ${tgUser.first_name}` : ''} 👋
            </p>
            <p className="text-xs text-text-secondary mt-0.5">
              {new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
        )}

        {/* Endeks + Döviz Ticker Bandı */}
        <div className="px-4 py-2">
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
            {indices.map(idx => (
              <div key={idx.symbol} className="flex-shrink-0 bg-dark-card rounded-xl px-3 py-2 border border-dark-border min-w-[130px]">
                <p className="text-[9px] text-text-secondary truncate">{idx.name}</p>
                <p className="text-sm font-mono font-bold tabular-nums text-text-primary">
                  {idx.value > 100 ? idx.value.toLocaleString('tr-TR', {maximumFractionDigits: 0}) : idx.value.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </p>
                <p className={`text-[11px] font-mono font-bold tabular-nums ${idx.change >= 0 ? 'text-brand-green' : 'text-brand-red'}`}>
                  {idx.change >= 0 ? '▲' : '▼'} %{Math.abs(idx.change).toFixed(2)}
                </p>
              </div>
            ))}
            {currency && (
              <>
                <div className="flex-shrink-0 bg-dark-card rounded-xl px-3 py-2 border border-dark-border min-w-[130px]">
                  <p className="text-[9px] text-text-secondary">USD/TRY</p>
                  <p className="text-sm font-mono font-bold tabular-nums text-text-primary">{currency.usdtry.value.toFixed(4)}</p>
                  <p className={`text-[11px] font-mono font-bold tabular-nums ${currency.usdtry.change >= 0 ? 'text-brand-red' : 'text-brand-green'}`}>
                    {currency.usdtry.change >= 0 ? '▲' : '▼'} %{Math.abs(currency.usdtry.change).toFixed(2)}
                  </p>
                </div>
                <div className="flex-shrink-0 bg-dark-card rounded-xl px-3 py-2 border border-dark-border min-w-[130px]">
                  <p className="text-[9px] text-text-secondary">EUR/TRY</p>
                  <p className="text-sm font-mono font-bold tabular-nums text-text-primary">{currency.eurtry.value.toFixed(4)}</p>
                  <p className={`text-[11px] font-mono font-bold tabular-nums ${currency.eurtry.change >= 0 ? 'text-brand-red' : 'text-brand-green'}`}>
                    {currency.eurtry.change >= 0 ? '▲' : '▼'} %{Math.abs(currency.eurtry.change).toFixed(2)}
                  </p>
                </div>
                {currency.gramGold > 0 && (
                  <div className="flex-shrink-0 bg-dark-card rounded-xl px-3 py-2 border border-dark-border min-w-[130px]">
                    <p className="text-[9px] text-text-secondary">Gram Altın</p>
                    <p className="text-sm font-mono font-bold tabular-nums text-text-primary">{currency.gramGold.toLocaleString('tr-TR')}₺</p>
                    <p className="text-[11px] font-mono font-bold tabular-nums text-brand-yellow">Anlık</p>
                  </div>
                )}
              </>
            )}
            {indices.length === 0 && [1,2,3].map(i => (
              <div key={i} className="flex-shrink-0 bg-dark-card rounded-xl px-3 py-2 border border-dark-border min-w-[130px]">
                <div className="skeleton h-3 w-16 mb-1 rounded" />
                <div className="skeleton h-4 w-20 mb-1 rounded" />
                <div className="skeleton h-3 w-12 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Konverjans Radarı */}
        <div className="px-4 py-2">
          <button onClick={() => setActiveTab('pulse')}
            className="w-full bg-gradient-to-r from-dark-card to-brand-teal/5 rounded-2xl p-4 border border-brand-teal/20 card-hover text-left">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-brand-teal/20 flex items-center justify-center">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" className="text-brand-teal"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l3.25-5.5 3 8 3.5-10L17 13.5h3.25"/></svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">Konverjans Radarı</p>
                  <p className="text-[10px] text-text-secondary">{radar.length} aktif sinyal</p>
                </div>
              </div>
              <span className="text-xs text-brand-teal font-medium">Tümünü Gör →</span>
            </div>
            <div className="space-y-2">
              {radar.slice(0, 3).map((r, i) => (
                <div key={r.symbol} className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-brand-teal w-4">{i + 1}</span>
                  <span className="text-xs font-bold font-mono text-text-primary w-12">{r.symbol}</span>
                  <div className="flex-1"><ConvergenceBar score={r.totalScore} size="sm" /></div>
                </div>
              ))}
            </div>
          </button>
        </div>

        {/* Hızlı Erişim Grid */}
        <div className="px-4 py-2">
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: '📈', label: 'Tarama', tab: 'screening' as const, bg: 'from-emerald-500/15 to-emerald-600/5' },
              { icon: '📊', label: 'Kuşbakışı', tab: 'overview' as const, bg: 'from-blue-500/15 to-blue-600/5' },
              { icon: '💼', label: 'Portföy', tab: 'portfolio' as const, bg: 'from-purple-500/15 to-purple-600/5' },
              { icon: '🤖', label: 'AI Analist', tab: 'ai' as const, bg: 'from-violet-500/15 to-violet-600/5' },
            ].map(item => (
              <button key={item.label} onClick={() => setActiveTab(item.tab)}
                className={`flex flex-col items-center justify-center bg-gradient-to-br ${item.bg} rounded-xl py-3 border border-dark-border card-hover`}>
                <span className="text-xl mb-1">{item.icon}</span>
                <span className="text-[10px] text-text-secondary font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* En Çok Yükselen / Düşen */}
        <div className="px-4 py-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-dark-card rounded-xl p-3 border border-dark-border">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-5 h-5 rounded-md bg-brand-green/20 flex items-center justify-center">
                  <span className="text-[10px]">🔥</span>
                </div>
                <span className="text-[10px] font-bold text-brand-green">SEANS İÇİ YÜKSELEN</span>
              </div>
              {topGainers.length > 0 ? topGainers.map((s, i) => (
                <button key={s.symbol} onClick={() => setSelectedStock(s.symbol)}
                  className="flex items-center justify-between w-full py-1.5 card-hover">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] text-brand-green font-bold w-3">{i + 1}</span>
                    <span className="text-[11px] font-bold font-mono text-text-primary">{s.symbol}</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-brand-green tabular-nums">+%{s.changePercent.toFixed(2)}</span>
                </button>
              )) : [1,2,3,4,5].map(i => (
                <div key={i} className="flex justify-between py-1.5"><div className="skeleton h-3 w-12 rounded" /><div className="skeleton h-3 w-10 rounded" /></div>
              ))}
            </div>
            <div className="bg-dark-card rounded-xl p-3 border border-dark-border">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-5 h-5 rounded-md bg-brand-red/20 flex items-center justify-center">
                  <span className="text-[10px]">📉</span>
                </div>
                <span className="text-[10px] font-bold text-brand-red">SEANS İÇİ DÜŞEN</span>
              </div>
              {topLosers.length > 0 ? topLosers.map((s, i) => (
                <button key={s.symbol} onClick={() => setSelectedStock(s.symbol)}
                  className="flex items-center justify-between w-full py-1.5 card-hover">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] text-brand-red font-bold w-3">{i + 1}</span>
                    <span className="text-[11px] font-bold font-mono text-text-primary">{s.symbol}</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-brand-red tabular-nums">%{s.changePercent.toFixed(2)}</span>
                </button>
              )) : [1,2,3,4,5].map(i => (
                <div key={i} className="flex justify-between py-1.5"><div className="skeleton h-3 w-12 rounded" /><div className="skeleton h-3 w-10 rounded" /></div>
              ))}
            </div>
          </div>
        </div>

        {/* Hacim Liderleri */}
        <div className="px-4 py-2">
          <div className="bg-dark-card rounded-xl p-3 border border-dark-border">
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-5 h-5 rounded-md bg-brand-yellow/20 flex items-center justify-center"><span className="text-[10px]">📊</span></div>
              <span className="text-[10px] font-bold text-brand-yellow">HACİM LİDERLERİ</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {topVolume.length > 0 ? topVolume.map(s => (
                <button key={s.symbol} onClick={() => setSelectedStock(s.symbol)}
                  className="flex-shrink-0 bg-dark-bg rounded-lg px-3 py-2 card-hover min-w-[80px] text-center">
                  <p className="text-[11px] font-bold font-mono text-text-primary">{s.symbol}</p>
                  <p className="text-[9px] text-text-secondary">{s.volume >= 1000000000 ? (s.volume / 1000000000).toFixed(1) + 'B' : s.volume >= 1000000 ? (s.volume / 1000000).toFixed(1) + 'M' : (s.volume / 1000).toFixed(0) + 'K'}</p>
                  <p className={`text-[10px] font-mono font-bold ${s.changePercent >= 0 ? 'text-brand-green' : 'text-brand-red'}`}>
                    {s.changePercent >= 0 ? '+' : ''}%{s.changePercent.toFixed(2)}
                  </p>
                </button>
              )) : [1,2,3,4,5].map(i => <div key={i} className="flex-shrink-0 skeleton h-14 w-20 rounded-lg" />)}
            </div>
          </div>
        </div>

        {/* KAP Bildirimleri */}
        <div className="px-4 py-2">
          <div className="bg-dark-card rounded-xl p-3 border border-dark-border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-md bg-brand-red/20 flex items-center justify-center"><span className="text-[10px]">📰</span></div>
                <span className="text-[10px] font-bold text-text-primary">KAP BİLDİRİMLERİ</span>
              </div>
            </div>
            {filteredKap.length > 0 ? filteredKap.slice(0, 5).map((k, i) => (
              <button
                key={i}
                onClick={() => {
                  if (!k.url) return;
                  // Telegram Mini App içindeysek Telegram'ın API'siyle aç (harici tarayıcıda)
                  const tg = window.Telegram?.WebApp;
                  if (tg?.openLink) {
                    tg.openLink(k.url);
                  } else {
                    window.open(k.url, '_blank', 'noopener,noreferrer');
                  }
                }}
                disabled={!k.url}
                className="w-full text-left flex items-start gap-2 py-1.5 border-b border-dark-border/30 last:border-0 hover:bg-dark-border/20 active:bg-dark-border/40 transition-colors rounded px-1 -mx-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-[10px] text-text-secondary font-mono mt-0.5 w-10 flex-shrink-0">{k.time}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    {k.symbol && <span className="text-[10px] font-bold font-mono text-brand-teal">{k.symbol}</span>}
                    {k.important && <div className="w-1.5 h-1.5 rounded-full bg-brand-red flex-shrink-0" />}
                    {k.url && <span className="text-[9px] text-text-secondary ml-auto">↗</span>}
                  </div>
                  <p className="text-[11px] text-text-secondary line-clamp-1">{k.title}</p>
                </div>
              </button>
            )) : (
              <p className="text-[11px] text-text-secondary py-3 text-center">KAP bildirimleri yükleniyor veya seans dışı...</p>
            )}
          </div>
        </div>

        {/* Veri Kaynağı */}
        <div className="px-4 py-2 pb-4">
          <div className="bg-dark-bg rounded-xl p-3 border border-dark-border/50 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
              <span className="text-[10px] text-text-secondary">Veriler: Yahoo Finance + TCMB</span>
            </div>
            <p className="text-[9px] text-text-secondary">Hisse fiyatları 15 dk gecikmeli • Döviz anlık • Son: {new Date().toLocaleTimeString('tr-TR', {hour:'2-digit', minute:'2-digit'})}</p>
          </div>
        </div>

      </div>
    </div>
  );
};
