import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { getStock } from '../../data/stocks';
import { getConvergence } from '../../data/convergence';
import { getAISummary } from '../../data/aiSummaries';
import { useCurrentPrice } from '../../hooks/usePriceSimulation';
import { ConvergenceBar } from '../../components/Cards/ConvergenceBar';

type DetailTab = 'detail' | 'depth' | 'trades' | 'custody' | 'ai';

export const StockDetailPage = () => {
  const { selectedStock, setSelectedStock } = useStore();
  const [activeTab, setActiveTab] = useState<DetailTab>('detail');

  const stock = selectedStock ? getStock(selectedStock) : null;
  const convergence = selectedStock ? getConvergence(selectedStock) : null;
  const aiSummary = selectedStock ? getAISummary(selectedStock) : null;
  const { price, flash } = useCurrentPrice(selectedStock || '');

  if (!stock) return null;

  const displayPrice = price || stock.price;
  const change = displayPrice - (stock.price - stock.change);
  const changePct = (change / (stock.price - stock.change)) * 100;

  const tabs: { id: DetailTab; label: string }[] = [
    { id: 'detail', label: 'Detay' },
    { id: 'depth', label: 'Derinlik' },
    { id: 'trades', label: 'İşlemler' },
    { id: 'custody', label: 'AKD' },
    { id: 'ai', label: 'AI Özet' },
  ];

  // Mock emir defteri
  const generateOrderBook = () => {
    const bids = [];
    const asks = [];
    for (let i = 0; i < 10; i++) {
      bids.push({
        price: (displayPrice - 0.1 * (i + 1)).toFixed(2),
        lots: Math.floor(Math.random() * 5000 + 500),
        orders: Math.floor(Math.random() * 50 + 5),
      });
      asks.push({
        price: (displayPrice + 0.1 * (i + 1)).toFixed(2),
        lots: Math.floor(Math.random() * 5000 + 500),
        orders: Math.floor(Math.random() * 50 + 5),
      });
    }
    return { bids, asks };
  };

  const orderBook = generateOrderBook();
  const totalBidLots = orderBook.bids.reduce((s, b) => s + b.lots, 0);
  const totalAskLots = orderBook.asks.reduce((s, a) => s + a.lots, 0);
  const buyPressure = ((totalBidLots / (totalBidLots + totalAskLots)) * 100).toFixed(1);

  // Mock işlemler
  const recentTrades = Array.from({ length: 15 }, (_, i) => ({
    time: `14:${(42 - i).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
    price: (displayPrice + (Math.random() - 0.5) * 0.4).toFixed(2),
    lots: Math.floor(Math.random() * 2000 + 50),
    side: Math.random() > 0.45 ? 'buy' as const : 'sell' as const,
  }));

  // Mock kurum verileri
  const custodyData = [
    { name: 'Ak Yatırım', net: 2450000, days: 4, trend: 'buying' as const },
    { name: 'İş Yatırım', net: 1820000, days: 3, trend: 'buying' as const },
    { name: 'Yapı Kredi Yatırım', net: 980000, days: 2, trend: 'buying' as const },
    { name: 'Tera Yatırım', net: -520000, days: 1, trend: 'selling' as const },
    { name: 'Gedik Yatırım', net: 340000, days: 5, trend: 'buying' as const },
    { name: 'Deniz Yatırım', net: -180000, days: 2, trend: 'selling' as const },
  ];

  return (
    <div className="fixed inset-0 bg-dark-bg z-[90] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-dark-border">
        <button onClick={() => setSelectedStock(null)} className="text-brand-teal text-sm font-medium flex items-center gap-1">
          ← Geri
        </button>
        <span className="text-sm font-bold text-text-primary font-mono">{stock.symbol}</span>
        <button className="text-brand-yellow text-sm">★</button>
      </div>

      {/* Fiyat Bölümü */}
      <div className={`px-4 py-3 ${flash === 'green' ? 'price-flash-green' : flash === 'red' ? 'price-flash-red' : ''}`}>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-text-secondary">{stock.name}</p>
            <p className="text-3xl font-bold font-mono tabular-nums text-text-primary mt-1">{displayPrice.toFixed(2)}₺</p>
          </div>
          <div className="text-right">
            <span className={`text-lg font-bold font-mono tabular-nums ${changePct >= 0 ? 'text-brand-green' : 'text-brand-red'}`}>
              {changePct >= 0 ? '+' : ''}{changePct.toFixed(2)}%
            </span>
            <p className={`text-xs font-mono tabular-nums ${changePct >= 0 ? 'text-brand-green' : 'text-brand-red'}`}>
              {change >= 0 ? '+' : ''}{change.toFixed(2)}₺
            </p>
          </div>
        </div>

        {/* Konverjans Barı */}
        {convergence && (
          <div className="mt-3 bg-dark-card rounded-xl p-3 border border-dark-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-text-secondary">Konverjans Skoru</span>
              <span className="text-xs text-brand-green font-mono">Başarı: %{convergence.historicalWinRate}</span>
            </div>
            <ConvergenceBar score={convergence.totalScore} size="lg" />
          </div>
        )}
      </div>

      {/* Detay Sekmeleri */}
      <div className="flex px-4 pt-1 gap-1 border-b border-dark-border pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-brand-teal text-dark-bg'
                : 'text-text-secondary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sekme İçeriği */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-6">
        {/* DETAY */}
        {activeTab === 'detail' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Piyasa Değeri', value: `${(stock.marketCap / 1000).toFixed(0)} Milyar₺` },
                { label: 'Hacim', value: `${(stock.volume / 1000000).toFixed(1)}M lot` },
                { label: '52H Yüksek', value: `${stock.high52w.toFixed(2)}₺` },
                { label: '52H Düşük', value: `${stock.low52w.toFixed(2)}₺` },
                { label: 'F/K', value: stock.pe > 0 ? stock.pe.toFixed(1) : 'N/A' },
                { label: 'PD/DD', value: stock.pb.toFixed(2) },
                { label: 'FD/FAVÖK', value: stock.evEbitda > 0 ? stock.evEbitda.toFixed(1) : 'N/A' },
                { label: 'ROE', value: `%${stock.roe.toFixed(1)}` },
                { label: 'ROIC', value: `%${stock.roic.toFixed(1)}` },
                { label: 'Net Borç/FAVÖK', value: stock.netDebtEbitda.toFixed(1) },
                { label: 'Temettü Getirisi', value: `%${stock.dividendYield.toFixed(1)}` },
                { label: 'Yabancı Oranı', value: `%${stock.foreignOwnership.toFixed(1)}` },
              ].map((item) => (
                <div key={item.label} className="bg-dark-card rounded-xl p-3 border border-dark-border">
                  <p className="text-[10px] text-text-secondary">{item.label}</p>
                  <p className="text-sm font-mono font-semibold tabular-nums text-text-primary mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Teknik Göstergeler */}
            <div className="bg-dark-card rounded-2xl p-4 border border-dark-border">
              <h3 className="text-sm font-bold text-text-primary mb-3">📈 Teknik Göstergeler</h3>
              <div className="space-y-2">
                {[
                  { label: 'RSI (14)', value: stock.rsi.toFixed(1), color: stock.rsi > 70 ? 'text-brand-red' : stock.rsi < 30 ? 'text-brand-green' : 'text-text-primary' },
                  { label: 'MACD', value: stock.macdSignal === 'bullish' ? '🟢 Pozitif' : stock.macdSignal === 'bearish' ? '🔴 Negatif' : '⚪ Nötr', color: 'text-text-primary' },
                  { label: 'EMA 20', value: `${stock.ema20.toFixed(2)}₺`, color: displayPrice > stock.ema20 ? 'text-brand-green' : 'text-brand-red' },
                  { label: 'EMA 50', value: `${stock.ema50.toFixed(2)}₺`, color: displayPrice > stock.ema50 ? 'text-brand-green' : 'text-brand-red' },
                  { label: 'EMA 200', value: `${stock.ema200.toFixed(2)}₺`, color: displayPrice > stock.ema200 ? 'text-brand-green' : 'text-brand-red' },
                  { label: 'VWAP', value: `${stock.vwap.toFixed(2)}₺`, color: displayPrice > stock.vwap ? 'text-brand-green' : 'text-brand-red' },
                  { label: 'Relatif Hacim', value: `${stock.relativeVolume.toFixed(1)}x`, color: stock.relativeVolume > 1.5 ? 'text-brand-yellow' : 'text-text-primary' },
                  { label: 'ADX', value: stock.adx.toFixed(1), color: stock.adx > 25 ? 'text-brand-teal' : 'text-text-secondary' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-xs text-text-secondary">{item.label}</span>
                    <span className={`text-xs font-mono font-medium tabular-nums ${item.color}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* DERİNLİK */}
        {activeTab === 'depth' && (
          <div>
            {/* Basınç Göstergesi */}
            <div className="bg-dark-card rounded-xl p-3 border border-dark-border mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-brand-green font-medium">Alış %{buyPressure}</span>
                <span className="text-xs text-text-secondary">Basınç</span>
                <span className="text-xs text-brand-red font-medium">Satış %{(100 - parseFloat(buyPressure)).toFixed(1)}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-brand-red/30 overflow-hidden">
                <div className="h-full bg-brand-green rounded-full" style={{ width: `${buyPressure}%` }} />
              </div>
            </div>

            {/* Emir Defteri */}
            <div className="grid grid-cols-2 gap-2">
              {/* Alış */}
              <div>
                <p className="text-[10px] text-brand-green font-medium text-center mb-2">ALIŞ</p>
                {orderBook.bids.map((bid, i) => (
                  <div key={i} className="flex justify-between text-[11px] py-1 border-b border-dark-border/50">
                    <span className="text-text-secondary font-mono">{bid.lots.toLocaleString('tr-TR')}</span>
                    <span className="text-brand-green font-mono font-medium tabular-nums">{bid.price}</span>
                  </div>
                ))}
              </div>
              {/* Satış */}
              <div>
                <p className="text-[10px] text-brand-red font-medium text-center mb-2">SATIŞ</p>
                {orderBook.asks.map((ask, i) => (
                  <div key={i} className="flex justify-between text-[11px] py-1 border-b border-dark-border/50">
                    <span className="text-brand-red font-mono font-medium tabular-nums">{ask.price}</span>
                    <span className="text-text-secondary font-mono">{ask.lots.toLocaleString('tr-TR')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* İŞLEMLER */}
        {activeTab === 'trades' && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
              <span className="text-xs text-text-secondary">Canlı İşlemler</span>
            </div>
            {recentTrades.map((trade, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-dark-border/50">
                <span className="text-[11px] text-text-secondary font-mono">{trade.time}</span>
                <span className={`text-[11px] font-mono font-medium tabular-nums ${trade.side === 'buy' ? 'text-brand-green' : 'text-brand-red'}`}>
                  {trade.price}₺
                </span>
                <span className="text-[11px] text-text-secondary font-mono">{trade.lots.toLocaleString('tr-TR')} lot</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${trade.side === 'buy' ? 'bg-brand-green/10 text-brand-green' : 'bg-brand-red/10 text-brand-red'}`}>
                  {trade.side === 'buy' ? 'A' : 'S'}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* AKD */}
        {activeTab === 'custody' && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-text-primary">🏦 Kurum Takas Dağılımı</h3>
            {custodyData.map((inst) => (
              <div key={inst.name} className="bg-dark-card rounded-xl p-3 border border-dark-border">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-text-primary">{inst.name}</span>
                  <span className={`text-xs font-mono font-bold tabular-nums ${inst.net >= 0 ? 'text-brand-green' : 'text-brand-red'}`}>
                    {inst.net >= 0 ? '+' : ''}{(inst.net / 1000000).toFixed(2)}M lot
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-text-secondary">{inst.days} gündür {inst.trend === 'buying' ? 'alıcı' : 'satıcı'}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    inst.trend === 'buying' ? 'bg-brand-green/10 text-brand-green' : 'bg-brand-red/10 text-brand-red'
                  }`}>
                    {inst.trend === 'buying' ? '🟢 Net Alıcı' : '🔴 Net Satıcı'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AI ÖZET */}
        {activeTab === 'ai' && (
          <div className="space-y-3">
            {aiSummary ? (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-brand-purple text-lg">🤖</span>
                    <span className="text-sm font-bold text-text-primary">AI Analist Özeti</span>
                  </div>
                  <button className="text-[10px] bg-brand-purple/10 text-brand-purple px-2 py-1 rounded-lg">
                    Yenile
                  </button>
                </div>

                {Object.entries(aiSummary.sections).map(([key, text]) => (
                  <div key={key} className="bg-dark-card rounded-xl p-4 border border-dark-border">
                    <p className="text-xs text-text-secondary leading-relaxed whitespace-pre-line">{text}</p>
                  </div>
                ))}
              </>
            ) : (
              <div className="bg-dark-card rounded-2xl p-6 border border-brand-purple/20 text-center">
                <span className="text-4xl">🤖</span>
                <p className="text-sm font-bold text-text-primary mt-3">AI Özet Oluşturuluyor</p>
                <p className="text-xs text-text-secondary mt-1">Claude AI ile analiz hazırlanıyor...</p>
                <div className="mt-4 space-y-2">
                  <div className="skeleton h-3 w-full rounded" />
                  <div className="skeleton h-3 w-4/5 rounded" />
                  <div className="skeleton h-3 w-3/4 rounded" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
