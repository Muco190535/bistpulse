import { useState } from 'react';
import { alerts, alertHistory, getAlertTypeLabel } from '../../data/alerts';
import { useStore } from '../../store/useStore';

type AlertTab = 'active' | 'history';

export const AlertsPage = () => {
  const [tab, setTab] = useState<AlertTab>('active');
  const { setSelectedStock } = useStore();
  const activeAlerts = alerts.filter(a => a.isActive);
  const inactiveAlerts = alerts.filter(a => !a.isActive);

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-3">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-base font-bold text-text-primary">🔔 Alarm Merkezi</h1>
          <div className="bg-brand-teal/10 px-2.5 py-1 rounded-lg">
            <span className="text-xs font-bold text-brand-teal">{activeAlerts.length} aktif</span>
          </div>
        </div>
        <div className="flex gap-1">
          {([
            { id: 'active' as const, label: 'Aktif Alarmlar' },
            { id: 'history' as const, label: 'Tetiklenme Geçmişi' },
          ]).map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium ${tab === t.id ? 'bg-brand-teal text-dark-bg' : 'bg-dark-card text-text-secondary'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-20 space-y-2">
        {tab === 'active' && (
          <>
            {activeAlerts.map(a => (
              <button key={a.id} onClick={() => setSelectedStock(a.symbol)}
                className="w-full bg-dark-card rounded-xl p-3 border border-dark-border card-hover text-left">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold font-mono text-text-primary">{a.symbol}</span>
                    <span className="text-[10px] bg-dark-bg text-text-secondary px-1.5 py-0.5 rounded">{getAlertTypeLabel(a.type)}</span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                </div>
                <p className="text-xs text-text-secondary mb-2">{a.condition}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-text-secondary">
                    {a.timesTriggered > 0 ? `${a.timesTriggered}x tetiklendi` : 'Henüz tetiklenmedi'}
                  </span>
                  {a.lastTriggered && (
                    <span className="text-[10px] text-brand-yellow">Son: {a.lastTriggered}</span>
                  )}
                </div>
              </button>
            ))}
            {inactiveAlerts.length > 0 && (
              <>
                <p className="text-[10px] text-text-secondary font-bold mt-4 mb-1">PASİF ALARMLAR</p>
                {inactiveAlerts.map(a => (
                  <div key={a.id} className="bg-dark-card/50 rounded-xl p-3 border border-dark-border opacity-60">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold font-mono text-text-primary">{a.symbol}</span>
                      <span className="text-[10px] bg-dark-bg text-text-secondary px-1.5 py-0.5 rounded">{getAlertTypeLabel(a.type)}</span>
                    </div>
                    <p className="text-xs text-text-secondary">{a.condition}</p>
                  </div>
                ))}
              </>
            )}
          </>
        )}

        {tab === 'history' && (
          <div className="space-y-2">
            {alertHistory.map((h, i) => (
              <button key={i} onClick={() => setSelectedStock(h.symbol)}
                className="w-full text-left rounded-xl border-l-[3px] border-l-brand-yellow bg-brand-yellow/5 pl-3 pr-3 py-3 card-hover">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono text-text-secondary">{h.triggeredAt}</span>
                  <span className="text-xs font-mono font-bold text-text-primary">{h.priceAtTrigger.toFixed(2)}₺</span>
                </div>
                <p className="text-xs text-text-primary font-medium">{h.message}</p>
                {h.scoreAtTrigger > 0 && (
                  <div className="mt-1">
                    <span className="text-[10px] text-brand-teal">Konverjans Skoru: {h.scoreAtTrigger}/100</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
