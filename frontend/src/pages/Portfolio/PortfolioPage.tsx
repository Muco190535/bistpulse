import { useState, useEffect, useCallback } from 'react';
import { usePortfolioStore } from '../../store/usePortfolioStore';

interface LivePrice {
  symbol: string;
  price: number;
  changePercent: number;
}

export const PortfolioPage = () => {
  const { balance, positions, setBalance, addPosition, removePosition } = usePortfolioStore();
  const [showAddBalance, setShowAddBalance] = useState(false);
  const [showAddPos, setShowAddPos] = useState(false);
  const [balanceInput, setBalanceInput] = useState('');
  const [posInput, setPosInput] = useState({ symbol: '', buyPrice: '', quantity: '', notes: '' });
  const [tab, setTab] = useState<'positions' | 'analysis'>('positions');
  const [livePrices, setLivePrices] = useState<Record<string, LivePrice>>({});
  const [searchResults, setSearchResults] = useState<string[]>([]);

  // Gerçek fiyatları API'den çek
  const fetchPrices = useCallback(async () => {
    if (positions.length === 0) return;
    const uniqueSymbols = [...new Set(positions.map(p => p.symbol))];
    for (const sym of uniqueSymbols) {
      try {
        const res = await fetch(`/api/price/${sym}`);
        if (res.ok) {
          const data = await res.json();
          setLivePrices(prev => ({ ...prev, [sym]: { symbol: sym, price: data.price, changePercent: data.changePercent } }));
        }
      } catch {}
    }
  }, [positions]);

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, [fetchPrices]);

  // Hisse arama
  const handleSymbolSearch = async (q: string) => {
    setPosInput(p => ({ ...p, symbol: q }));
    if (q.length >= 2) {
      try {
        const res = await fetch(`/api/search?q=${q.toUpperCase()}`);
        if (res.ok) { const data = await res.json(); setSearchResults(data.slice(0, 5)); }
      } catch {}
    } else {
      setSearchResults([]);
    }
  };

  const getPrice = (symbol: string) => livePrices[symbol]?.price || 0;

  const positionsWithPnL = positions.map(p => {
    const currentPrice = getPrice(p.symbol);
    const cost = p.buyPrice * p.quantity;
    const current = currentPrice > 0 ? currentPrice * p.quantity : cost;
    const pnl = current - cost;
    const pnlPct = cost > 0 ? (pnl / cost) * 100 : 0;
    return { ...p, currentPrice, cost, current, pnl, pnlPct, isLive: currentPrice > 0 };
  });

  const totalCost = positionsWithPnL.reduce((s, p) => s + p.cost, 0);
  const totalCurrent = positionsWithPnL.reduce((s, p) => s + p.current, 0);
  const totalPnL = totalCurrent - totalCost;
  const totalPnLPct = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;
  const totalAssets = balance + totalCurrent;

  const handleAddBalance = () => {
    const val = parseFloat(balanceInput);
    if (!isNaN(val) && val > 0) { setBalance(val); setShowAddBalance(false); setBalanceInput(''); }
  };

  const handleAddPosition = () => {
    const sym = posInput.symbol.toUpperCase().trim();
    const buyPrice = parseFloat(posInput.buyPrice);
    const quantity = parseInt(posInput.quantity);
    if (sym && !isNaN(buyPrice) && !isNaN(quantity) && buyPrice > 0 && quantity > 0) {
      addPosition({ symbol: sym, buyPrice, quantity, buyDate: new Date().toISOString().split('T')[0], notes: posInput.notes });
      setShowAddPos(false);
      setPosInput({ symbol: '', buyPrice: '', quantity: '', notes: '' });
      setSearchResults([]);
      // Hemen fiyat çek
      setTimeout(fetchPrices, 500);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto pb-20">

        {positions.length === 0 && balance === 0 ? (
          <div className="px-4 pt-8 flex flex-col items-center">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-brand-purple/20 to-brand-teal/20 flex items-center justify-center mb-4">
              <span className="text-4xl">💼</span>
            </div>
            <h2 className="text-lg font-bold text-text-primary mb-2">Sanal Portföyünüzü Oluşturun</h2>
            <p className="text-xs text-text-secondary text-center mb-6 max-w-[280px]">
              Bakiyenizi girin, hisse ekleyin ve gerçek zamanlı kâr/zarar takibi yapın. Fiyatlar Yahoo Finance'den 15dk gecikmeli gelir.
            </p>
            <button onClick={() => setShowAddBalance(true)}
              className="bg-brand-teal text-dark-bg font-bold text-sm px-6 py-3 rounded-xl mb-3 w-48">
              💰 Bakiye Belirle
            </button>
            <button onClick={() => setShowAddPos(true)}
              className="bg-dark-card text-text-primary font-medium text-sm px-6 py-3 rounded-xl border border-dark-border w-48">
              ➕ Hisse Ekle
            </button>
          </div>
        ) : (
          <>
            {/* Özet Kart */}
            <div className="px-4 pt-3">
              <div className="bg-gradient-to-br from-dark-card via-dark-card to-brand-teal/5 rounded-2xl p-4 border border-brand-teal/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-text-secondary">Toplam Varlık</span>
                  <button onClick={() => setShowAddBalance(true)} className="text-[10px] text-brand-teal">Bakiye Düzenle</button>
                </div>
                <p className="text-2xl font-bold font-mono tabular-nums text-text-primary">
                  {totalAssets.toLocaleString('tr-TR', { maximumFractionDigits: 0 })} <span className="text-sm text-text-secondary">₺</span>
                </p>
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div>
                    <p className="text-[9px] text-text-secondary">Nakit</p>
                    <p className="text-xs font-mono font-bold text-text-primary tabular-nums">{balance.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}₺</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-text-secondary">Portföy</p>
                    <p className="text-xs font-mono font-bold text-text-primary tabular-nums">{totalCurrent.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}₺</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-text-secondary">K/Z</p>
                    <p className={`text-xs font-mono font-bold tabular-nums ${totalPnL >= 0 ? 'text-brand-green' : 'text-brand-red'}`}>
                      {totalPnL >= 0 ? '+' : ''}{totalPnL.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}₺
                    </p>
                  </div>
                </div>
                {totalCost > 0 && (
                  <div className={`mt-2 text-center py-1 rounded-lg ${totalPnL >= 0 ? 'bg-brand-green/10' : 'bg-brand-red/10'}`}>
                    <span className={`text-sm font-bold font-mono ${totalPnL >= 0 ? 'text-brand-green' : 'text-brand-red'}`}>
                      {totalPnLPct >= 0 ? '+' : ''}%{totalPnLPct.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Sekmeler */}
            <div className="flex px-4 pt-3 gap-1">
              <button onClick={() => setTab('positions')} className={`px-3 py-1.5 rounded-full text-xs font-medium ${tab === 'positions' ? 'bg-brand-teal text-dark-bg' : 'bg-dark-card text-text-secondary'}`}>
                Pozisyonlar ({positions.length})
              </button>
              <button onClick={() => setTab('analysis')} className={`px-3 py-1.5 rounded-full text-xs font-medium ${tab === 'analysis' ? 'bg-brand-teal text-dark-bg' : 'bg-dark-card text-text-secondary'}`}>
                Analiz
              </button>
            </div>

            <div className="px-4 pt-3 space-y-2">
              {tab === 'positions' && (
                <>
                  {positionsWithPnL.map(p => (
                    <div key={p.id} className={`bg-dark-card rounded-xl p-3 border ${p.pnl >= 0 ? 'border-brand-green/10' : 'border-brand-red/10'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold font-mono text-text-primary">{p.symbol}</span>
                          <span className="text-[10px] text-text-secondary">{p.quantity} lot</span>
                          {p.isLive && <div className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" title="Canlı fiyat" />}
                          {!p.isLive && <span className="text-[8px] text-brand-yellow">Yükleniyor...</span>}
                        </div>
                        <button onClick={() => removePosition(p.id)} className="text-[10px] text-brand-red/60 hover:text-brand-red">✕</button>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <p className="text-[9px] text-text-secondary">Alış</p>
                          <p className="text-xs font-mono text-text-primary tabular-nums">{p.buyPrice.toFixed(2)}₺</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-text-secondary">Güncel</p>
                          <p className="text-xs font-mono text-text-primary tabular-nums">
                            {p.currentPrice > 0 ? `${p.currentPrice.toFixed(2)}₺` : '---'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] text-text-secondary">K/Z</p>
                          <p className={`text-xs font-mono font-bold tabular-nums ${p.pnl >= 0 ? 'text-brand-green' : 'text-brand-red'}`}>
                            {p.isLive ? `${p.pnl >= 0 ? '+' : ''}${p.pnl.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}₺` : '---'}
                          </p>
                          {p.isLive && (
                            <p className={`text-[9px] font-mono ${p.pnlPct >= 0 ? 'text-brand-green' : 'text-brand-red'}`}>
                              {p.pnlPct >= 0 ? '+' : ''}%{p.pnlPct.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => setShowAddPos(true)}
                    className="w-full bg-dark-card rounded-xl p-3 border border-dashed border-brand-teal/30 card-hover text-center">
                    <span className="text-brand-teal text-sm">+ Yeni Hisse Ekle</span>
                  </button>
                </>
              )}

              {tab === 'analysis' && positionsWithPnL.length > 0 && (
                <div className="space-y-3">
                  <div className="bg-dark-card rounded-xl p-3 border border-dark-border">
                    <p className="text-xs font-bold text-text-primary mb-2">Portföy Dağılımı</p>
                    {positionsWithPnL.map(p => {
                      const pct = totalCurrent > 0 ? (p.current / totalCurrent) * 100 : 0;
                      return (
                        <div key={p.id} className="flex items-center gap-2 py-1.5">
                          <span className="text-[11px] font-mono font-bold text-text-primary w-12">{p.symbol}</span>
                          <div className="flex-1 h-2 rounded-full bg-dark-bg overflow-hidden">
                            <div className="h-full bg-brand-teal rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-[10px] text-text-secondary font-mono w-12 text-right">%{pct.toFixed(1)}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="bg-dark-card rounded-xl p-3 border border-dark-border">
                    <p className="text-xs font-bold text-text-primary mb-2">Performans</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-brand-green/5 rounded-lg p-2 text-center border border-brand-green/10">
                        <p className="text-lg font-bold text-brand-green">{positionsWithPnL.filter(p => p.pnl >= 0 && p.isLive).length}</p>
                        <p className="text-[9px] text-text-secondary">Kazançlı</p>
                      </div>
                      <div className="bg-brand-red/5 rounded-lg p-2 text-center border border-brand-red/10">
                        <p className="text-lg font-bold text-brand-red">{positionsWithPnL.filter(p => p.pnl < 0 && p.isLive).length}</p>
                        <p className="text-[9px] text-text-secondary">Zararlı</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Bakiye Modal */}
      {showAddBalance && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-end justify-center" onClick={() => setShowAddBalance(false)}>
          <div className="w-full max-w-md bg-dark-card rounded-t-3xl p-5 border-t border-dark-border" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-bold text-text-primary mb-3">💰 Nakit Bakiye Belirle</h3>
            <input value={balanceInput} onChange={e => setBalanceInput(e.target.value)} type="number" placeholder="Örn: 100000"
              className="w-full bg-dark-bg rounded-xl px-4 py-3 text-sm text-text-primary border border-dark-border outline-none focus:border-brand-teal font-mono" autoFocus />
            <div className="flex gap-2 mt-3">
              <button onClick={() => setShowAddBalance(false)} className="flex-1 bg-dark-bg text-text-secondary py-2.5 rounded-xl text-sm">İptal</button>
              <button onClick={handleAddBalance} className="flex-1 bg-brand-teal text-dark-bg py-2.5 rounded-xl text-sm font-bold">Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {/* Hisse Ekle Modal */}
      {showAddPos && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-end justify-center" onClick={() => { setShowAddPos(false); setSearchResults([]); }}>
          <div className="w-full max-w-md bg-dark-card rounded-t-3xl p-5 border-t border-dark-border" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-bold text-text-primary mb-3">➕ Hisse Ekle</h3>
            <div className="space-y-2 relative">
              <input value={posInput.symbol} onChange={e => handleSymbolSearch(e.target.value)} placeholder="Hisse kodu (ör: THYAO)"
                className="w-full bg-dark-bg rounded-xl px-4 py-3 text-sm text-text-primary border border-dark-border outline-none focus:border-brand-teal font-mono uppercase" autoFocus />
              {searchResults.length > 0 && (
                <div className="absolute top-12 left-0 right-0 bg-dark-card border border-dark-border rounded-xl overflow-hidden z-10 shadow-xl">
                  {searchResults.map(sym => (
                    <button key={sym} onClick={() => { setPosInput(p => ({ ...p, symbol: sym })); setSearchResults([]); }}
                      className="w-full text-left px-4 py-2.5 text-sm font-mono text-text-primary hover:bg-dark-bg border-b border-dark-border/30 last:border-0">
                      {sym}
                    </button>
                  ))}
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                <input value={posInput.buyPrice} onChange={e => setPosInput(p => ({ ...p, buyPrice: e.target.value }))} type="number" step="0.01" placeholder="Alış fiyatı (₺)"
                  className="bg-dark-bg rounded-xl px-4 py-3 text-sm text-text-primary border border-dark-border outline-none focus:border-brand-teal font-mono" />
                <input value={posInput.quantity} onChange={e => setPosInput(p => ({ ...p, quantity: e.target.value }))} type="number" placeholder="Lot adedi"
                  className="bg-dark-bg rounded-xl px-4 py-3 text-sm text-text-primary border border-dark-border outline-none focus:border-brand-teal font-mono" />
              </div>
              <input value={posInput.notes} onChange={e => setPosInput(p => ({ ...p, notes: e.target.value }))} placeholder="Not (opsiyonel)"
                className="w-full bg-dark-bg rounded-xl px-4 py-3 text-sm text-text-primary border border-dark-border outline-none focus:border-brand-teal" />
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={() => { setShowAddPos(false); setSearchResults([]); }} className="flex-1 bg-dark-bg text-text-secondary py-2.5 rounded-xl text-sm">İptal</button>
              <button onClick={handleAddPosition} className="flex-1 bg-brand-teal text-dark-bg py-2.5 rounded-xl text-sm font-bold">Ekle</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
