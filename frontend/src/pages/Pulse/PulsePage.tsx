import { useState } from 'react';
import { getRadarStocks } from '../../data/convergence';
import { liveFeedEvents } from '../../data/liveFeed';
import { marketSummary, morningBriefing, sectorPerformance } from '../../data/market';
import { RadarCard } from '../../components/Cards/RadarCard';
import { FeedEventCard } from '../../components/Cards/FeedEventCard';

type PulseTab = 'radar' | 'feed' | 'briefing';

export const PulsePage = () => {
  const [activeTab, setActiveTab] = useState<PulseTab>('radar');
  const radarStocks = getRadarStocks();
  const breadth = marketSummary.marketBreadth;

  const tabs: { id: PulseTab; label: string; count?: number }[] = [
    { id: 'radar', label: 'Konverjans Radarı', count: radarStocks.length },
    { id: 'feed', label: 'Canlı Akış' },
    { id: 'briefing', label: 'Brifing' },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Piyasa Özeti Bar */}
      <div className="px-4 py-2 bg-dark-card/50 border-b border-dark-border">
        <div className="flex items-center justify-between">
          {/* Piyasa Genişliği */}
          <div className="flex items-center gap-1.5">
            <span className="text-brand-green text-[11px] font-mono font-medium">▲{breadth.advancing}</span>
            <div className="w-20 h-1.5 rounded-full overflow-hidden bg-dark-bg flex">
              <div
                className="h-full bg-brand-green"
                style={{ width: `${(breadth.advancing / (breadth.advancing + breadth.declining + breadth.unchanged)) * 100}%` }}
              />
              <div
                className="h-full bg-text-secondary"
                style={{ width: `${(breadth.unchanged / (breadth.advancing + breadth.declining + breadth.unchanged)) * 100}%` }}
              />
              <div className="h-full bg-brand-red flex-1" />
            </div>
            <span className="text-brand-red text-[11px] font-mono font-medium">▼{breadth.declining}</span>
          </div>
          {/* Hacim */}
          <span className="text-[11px] text-text-secondary">Hacim: {marketSummary.totalVolume}</span>
        </div>
      </div>

      {/* Sekme Seçici */}
      <div className="flex px-4 pt-3 gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-brand-teal text-dark-bg'
                : 'bg-dark-card text-text-secondary'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={`text-[10px] font-bold ${
                activeTab === tab.id ? 'text-dark-bg' : 'text-brand-teal'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* İçerik */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-20">
        {/* Konverjans Radarı */}
        {activeTab === 'radar' && (
          <div className="space-y-3">
            {/* Radar Başlık */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-text-primary">⚡ Konverjans Radarı</h2>
                <p className="text-[11px] text-text-secondary mt-0.5">4 katmanlı sinyal analizi · 30sn güncelleme</p>
              </div>
              <div className="bg-brand-teal/10 px-2.5 py-1 rounded-lg">
                <span className="text-xs font-bold text-brand-teal">{radarStocks.length} aktif</span>
              </div>
            </div>

            {/* Radar Kartları */}
            {radarStocks.map((stock, i) => (
              <RadarCard key={stock.symbol} data={stock} rank={i + 1} />
            ))}

            {/* Piyasa Rejimi */}
            <div className="bg-dark-card rounded-2xl p-4 border border-dark-border mt-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-brand-green animate-pulse" />
                <span className="text-sm font-bold text-text-primary">Piyasa Rejimi: YÜKSELEN TREND</span>
              </div>
              <p className="text-xs text-text-secondary">BIST100 tüm hareketli ortalamalar üzerinde. Yükselen hisse sayısı düşenlerin 2.3 katı. Momentum stratejileri bu ortamda en yüksek başarı oranına sahip.</p>
            </div>
          </div>
        )}

        {/* Canlı Akış */}
        {activeTab === 'feed' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-bold text-text-primary">🔴 Canlı Akış</h2>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
                <span className="text-[11px] text-text-secondary">Canlı</span>
              </div>
            </div>
            {liveFeedEvents.map((event) => (
              <FeedEventCard key={event.id} event={event} />
            ))}
          </div>
        )}

        {/* Sabah Brifing */}
        {activeTab === 'briefing' && (
          <div className="space-y-4">
            <div className="bg-dark-card rounded-2xl p-4 border border-brand-teal/20">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">☀️</span>
                <div>
                  <h2 className="text-sm font-bold text-text-primary">Sabah Brifing</h2>
                  <p className="text-[11px] text-text-secondary">{morningBriefing.date}</p>
                </div>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed mb-3">{morningBriefing.globalSummary}</p>

              <div className="space-y-2 mb-3">
                <p className="text-xs font-semibold text-text-primary">Günün Önemli Gelişmeleri</p>
                {morningBriefing.keyEvents.map((evt, i) => (
                  <p key={i} className="text-xs text-text-secondary">{evt}</p>
                ))}
              </div>

              <div className="bg-brand-teal/5 rounded-xl p-3 border border-brand-teal/10">
                <p className="text-xs text-brand-teal font-medium">{morningBriefing.convergencePreview}</p>
              </div>
            </div>

            {/* Sektör Performansı */}
            <div className="bg-dark-card rounded-2xl p-4 border border-dark-border">
              <h3 className="text-sm font-bold text-text-primary mb-3">📊 Sektör Performansı</h3>
              <div className="space-y-2">
                {sectorPerformance.map((sector) => (
                  <div key={sector.name} className="flex items-center justify-between">
                    <span className="text-xs text-text-secondary">{sector.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 rounded-full bg-dark-bg overflow-hidden">
                        <div
                          className={`h-full rounded-full ${sector.change >= 0 ? 'bg-brand-green' : 'bg-brand-red'}`}
                          style={{ width: `${Math.min(Math.abs(sector.change) * 20, 100)}%`, float: sector.change >= 0 ? 'left' : 'right' }}
                        />
                      </div>
                      <span className={`text-xs font-mono tabular-nums font-medium w-12 text-right ${
                        sector.change >= 0 ? 'text-brand-green' : 'text-brand-red'
                      }`}>
                        {sector.change >= 0 ? '+' : ''}{sector.change.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Takvim */}
            <div className="bg-dark-card rounded-2xl p-4 border border-dark-border">
              <h3 className="text-sm font-bold text-text-primary mb-3">📅 Finansal Takvim</h3>
              <div className="space-y-2">
                {morningBriefing.calendarEvents.map((evt, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-sm mt-0.5">
                      {evt.type === 'dividend' ? '💰' : evt.type === 'earnings' ? '📊' : '🔔'}
                    </span>
                    <p className="text-xs text-text-secondary">{evt.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
