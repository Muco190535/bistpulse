import { useStore } from '../../store/useStore';
import { menuItems } from '../../data/menuItems';
import * as mc from '../../data/menuContents';

interface Props { menuId: string; onClose: () => void; }

export const MenuContentModal = ({ menuId, onClose }: Props) => {
  const { setSelectedStock } = useStore();
  const item = menuItems.find(m => m.id === menuId);
  if (!item) return null;

  const handleStock = (symbol: string) => { setSelectedStock(symbol); onClose(); };

  return (
    <div className="fixed inset-0 bg-dark-bg z-[95] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-dark-border">
        <button onClick={onClose} className="text-brand-teal text-sm font-medium">← Geri</button>
        <div className="flex items-center gap-2">
          <span>{item.icon}</span>
          <span className="text-sm font-bold text-text-primary">{item.label}</span>
        </div>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-6 space-y-2">
        {/* KAP AJAN */}
        {menuId === 'kap-ajan' && mc.kapAjanData.map((k, i) => (
          <button key={i} onClick={() => handleStock(k.symbol)}
            className={`w-full text-left rounded-xl border-l-[3px] pl-3 pr-3 py-2.5 card-hover ${k.important ? 'border-l-brand-red bg-brand-red/5' : 'border-l-dark-border bg-dark-card'}`}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-text-secondary">{k.time}</span>
                <span className="text-xs font-bold font-mono text-text-primary">{k.symbol}</span>
              </div>
              {k.important && <span className="text-[8px] bg-brand-red/20 text-brand-red px-1.5 py-0.5 rounded-full font-bold">ÖNEMLİ</span>}
            </div>
            <p className="text-xs text-text-secondary">{k.title}</p>
          </button>
        ))}

        {/* TEORİK LİSTE */}
        {menuId === 'teorik-liste' && mc.teorikListeData.map((t, i) => (
          <button key={i} onClick={() => handleStock(t.symbol)}
            className="w-full bg-dark-card rounded-xl p-3 border border-dark-border card-hover">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold font-mono text-text-primary">{t.symbol}</span>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-secondary font-mono">{t.currentPrice.toFixed(2)}₺</span>
                  <span className="text-xs text-text-secondary">→</span>
                  <span className={`text-xs font-mono font-bold ${t.direction === 'up' ? 'text-brand-green' : 'text-brand-red'}`}>{t.teorikPrice.toFixed(2)}₺</span>
                </div>
                <span className={`text-[11px] font-mono font-bold ${t.direction === 'up' ? 'text-brand-green' : 'text-brand-red'}`}>
                  {t.diff >= 0 ? '+' : ''}{t.diff.toFixed(2)}%
                </span>
              </div>
            </div>
          </button>
        ))}

        {/* YÜKSELEN DÜŞEN */}
        {menuId === 'yukselen-dusen' && (
          <>
            <p className="text-xs font-bold text-brand-green mb-1">▲ EN ÇOK YÜKSELEN</p>
            {mc.yukselenDusenData.yukselen.map((s, i) => (
              <button key={i} onClick={() => handleStock(s.symbol)}
                className="w-full flex items-center justify-between bg-dark-card rounded-xl px-3 py-2.5 border border-dark-border card-hover">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-text-primary w-5 text-center text-brand-green">{i + 1}</span>
                  <span className="text-sm font-bold font-mono text-text-primary">{s.symbol}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-text-secondary">{s.volume}</span>
                  <span className="text-xs font-mono text-text-primary">{s.price.toFixed(2)}₺</span>
                  <span className="text-xs font-mono font-bold text-brand-green w-14 text-right">+%{s.change.toFixed(2)}</span>
                </div>
              </button>
            ))}
            <p className="text-xs font-bold text-brand-red mb-1 mt-4">▼ EN ÇOK DÜŞEN</p>
            {mc.yukselenDusenData.dusen.map((s, i) => (
              <button key={i} onClick={() => handleStock(s.symbol)}
                className="w-full flex items-center justify-between bg-dark-card rounded-xl px-3 py-2.5 border border-dark-border card-hover">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-text-primary w-5 text-center text-brand-red">{i + 1}</span>
                  <span className="text-sm font-bold font-mono text-text-primary">{s.symbol}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-text-secondary">{s.volume}</span>
                  <span className="text-xs font-mono text-text-primary">{s.price.toFixed(2)}₺</span>
                  <span className="text-xs font-mono font-bold text-brand-red w-14 text-right">{s.change.toFixed(2)}%</span>
                </div>
              </button>
            ))}
          </>
        )}

        {/* AL/SAT SİNYALLERİ */}
        {menuId === 'al-sat-sinyalleri' && mc.alSatSinyalleriData.map((s, i) => (
          <button key={i} onClick={() => handleStock(s.symbol)}
            className={`w-full rounded-xl p-3 border card-hover ${s.signal === 'AL' ? 'bg-brand-green/5 border-brand-green/20' : 'bg-brand-red/5 border-brand-red/20'}`}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${s.signal === 'AL' ? 'bg-brand-green text-white' : 'bg-brand-red text-white'}`}>{s.signal}</span>
                <span className="text-sm font-bold font-mono text-text-primary">{s.symbol}</span>
              </div>
              <span className="text-xs font-mono text-text-secondary">{s.time}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-brand-teal">{s.strategy}</span>
                <span className="text-[10px] text-text-secondary">Güç: {s.strength}</span>
              </div>
              <span className="text-xs font-mono font-bold text-text-primary">{s.price.toFixed(2)}₺</span>
            </div>
          </button>
        ))}

        {/* VİOP */}
        {menuId === 'viop' && mc.viopData.map((v, i) => (
          <div key={i} className="bg-dark-card rounded-xl p-3 border border-dark-border">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-text-primary">{v.name}</span>
              <span className={`text-xs font-mono font-bold ${v.change >= 0 ? 'text-brand-green' : 'text-brand-red'}`}>
                {v.change >= 0 ? '+' : ''}{v.change.toFixed(2)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-mono font-bold tabular-nums text-text-primary">{v.last.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-text-secondary">Hacim: {v.volume}</span>
                <span className="text-[10px] text-text-secondary">AK: {v.openInterest}</span>
              </div>
            </div>
          </div>
        ))}

        {/* HALKA ARZ */}
        {menuId === 'halka-arz' && mc.halkaArzData.map((h, i) => (
          <div key={i} className={`bg-dark-card rounded-xl p-3 border ${h.status === 'Talep Toplama' ? 'border-brand-green/20' : 'border-dark-border'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-text-primary">{h.company}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                h.status === 'Talep Toplama' ? 'bg-brand-green/20 text-brand-green' :
                h.status === 'Tamamlandı' ? 'bg-text-secondary/20 text-text-secondary' : 'bg-brand-yellow/20 text-brand-yellow'
              }`}>{h.status}</span>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-text-secondary">
              <span>{h.sector}</span><span>•</span><span>{h.dateRange}</span><span>•</span><span>{h.priceRange}</span>
            </div>
            {h.demand > 0 && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[10px] text-text-secondary">Talep çarpanı:</span>
                <span className="text-xs font-bold text-brand-green">{h.demand}x</span>
              </div>
            )}
          </div>
        ))}

        {/* GERİ ALIMLAR */}
        {menuId === 'geri-alimlar' && mc.geriAlimlarData.map((g, i) => (
          <button key={i} onClick={() => handleStock(g.symbol)} className="w-full bg-dark-card rounded-xl p-3 border border-dark-border card-hover">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold font-mono text-text-primary">{g.symbol}</span>
              <span className="text-xs font-bold text-brand-teal">{g.amount}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-dark-bg overflow-hidden">
              <div className="h-full bg-brand-teal rounded-full" style={{ width: `${100 - g.remainingPercent}%` }} />
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-[10px] text-text-secondary">Kalan: %{g.remainingPercent}</span>
              <span className="text-[10px] text-text-secondary">{g.startDate} — {g.endDate}</span>
            </div>
          </button>
        ))}

        {/* SON BİLANÇOLAR */}
        {menuId === 'son-bilancolar' && mc.sonBilancolarData.map((b, i) => (
          <button key={i} onClick={() => handleStock(b.symbol)} className="w-full bg-dark-card rounded-xl p-3 border border-dark-border card-hover">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold font-mono text-text-primary">{b.symbol}</span>
                <span className="text-[10px] text-text-secondary">{b.period}</span>
              </div>
              <span className="text-[10px] text-text-secondary">{b.date}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div><p className="text-[9px] text-text-secondary">Gelir</p><p className="text-xs font-mono font-bold text-text-primary">{b.revenue}</p></div>
              <div><p className="text-[9px] text-text-secondary">Net Kâr</p><p className="text-xs font-mono font-bold text-text-primary">{b.netProfit}</p></div>
              <div><p className="text-[9px] text-text-secondary">Gelir Büyüme</p><p className="text-xs font-mono font-bold text-brand-green">+%{b.revenueGrowth}</p></div>
              <div><p className="text-[9px] text-text-secondary">Kâr Büyüme</p><p className="text-xs font-mono font-bold text-brand-green">+%{b.profitGrowth}</p></div>
            </div>
          </button>
        ))}

        {/* ENDEKSLER */}
        {menuId === 'endeksler' && mc.endekslerData.map((e, i) => (
          <div key={i} className="bg-dark-card rounded-xl p-3 border border-dark-border">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-text-primary">{e.name}</span>
              <span className={`text-xs font-mono font-bold ${e.change >= 0 ? 'text-brand-green' : 'text-brand-red'}`}>{e.change >= 0 ? '+' : ''}{e.change.toFixed(2)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base font-mono font-bold tabular-nums text-text-primary">{e.value.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
              <div className="flex items-center gap-2 text-[10px] text-text-secondary">
                <span>↑{e.high.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                <span>↓{e.low.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        ))}

        {/* PARA GİRİŞ ÇIKIŞ */}
        {menuId === 'para-giris-cikis' && (
          <>
            <p className="text-xs font-bold text-brand-green mb-1">💰 PARA GİRİŞİ (Son 5 Gün)</p>
            {mc.paraGirisCikisData.filter(p => p.type === 'inflow').map((p, i) => (
              <button key={i} onClick={() => handleStock(p.symbol)} className="w-full flex items-center justify-between bg-dark-card rounded-xl px-3 py-2.5 border border-brand-green/10 card-hover">
                <span className="text-sm font-bold font-mono text-text-primary">{p.symbol}</span>
                <span className="text-xs font-mono font-bold text-brand-green">+₺{p.netFlow.toFixed(1)}M</span>
              </button>
            ))}
            <p className="text-xs font-bold text-brand-red mb-1 mt-3">💸 PARA ÇIKIŞI (Son 5 Gün)</p>
            {mc.paraGirisCikisData.filter(p => p.type === 'outflow').map((p, i) => (
              <button key={i} onClick={() => handleStock(p.symbol)} className="w-full flex items-center justify-between bg-dark-card rounded-xl px-3 py-2.5 border border-brand-red/10 card-hover">
                <span className="text-sm font-bold font-mono text-text-primary">{p.symbol}</span>
                <span className="text-xs font-mono font-bold text-brand-red">₺{p.netFlow.toFixed(1)}M</span>
              </button>
            ))}
          </>
        )}

        {/* SON HABERLER */}
        {menuId === 'son-haberler' && mc.sonHaberlerData.map((h, i) => (
          <div key={i} className="bg-dark-card rounded-xl p-3 border border-dark-border">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono text-text-secondary">{h.time}</span>
              <span className="text-[9px] bg-dark-bg text-text-secondary px-1.5 py-0.5 rounded">{h.category}</span>
            </div>
            <p className="text-xs text-text-primary font-medium">{h.title}</p>
            <span className="text-[10px] text-brand-teal">{h.source}</span>
          </div>
        ))}

        {/* KURUMSAL TAKAS */}
        {menuId === 'kurumsal-takas' && (
          <div className="text-center py-4">
            <span className="text-2xl">🤝</span>
            <p className="text-xs text-text-secondary mt-2">Detaylı kurumsal takas verileri Tarama sekmesinde</p>
            <button onClick={() => { onClose(); useStore.getState().setActiveTab('screening'); }}
              className="mt-3 bg-brand-teal text-dark-bg text-xs font-bold px-4 py-2 rounded-xl">Tarama'ya Git</button>
          </div>
        )}

        {/* SEKTÖREL PERFORMANS */}
        {menuId === 'sektorel-performans' && (
          <div className="text-center py-4">
            <span className="text-2xl">🏭</span>
            <p className="text-xs text-text-secondary mt-2">Detaylı sektör analizi Kuşbakışı sekmesinde</p>
            <button onClick={() => { onClose(); useStore.getState().setActiveTab('overview'); }}
              className="mt-3 bg-brand-teal text-dark-bg text-xs font-bold px-4 py-2 rounded-xl">Kuşbakışı'na Git</button>
          </div>
        )}

        {/* ANALİST ÖNERİLERİ */}
        {menuId === 'analist-onerileri' && mc.analistOnerileriData.map((a, i) => (
          <button key={i} onClick={() => handleStock(a.symbol)} className="w-full bg-dark-card rounded-xl p-3 border border-dark-border card-hover">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold font-mono text-text-primary">{a.symbol}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${a.recommendation === 'AL' ? 'bg-brand-green/20 text-brand-green' : 'bg-brand-yellow/20 text-brand-yellow'}`}>{a.recommendation}</span>
              </div>
              <span className="text-[10px] text-text-secondary">{a.broker}</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[10px] text-text-secondary">Hedef: <span className="text-brand-teal font-bold">{a.targetPrice}₺</span></span>
              <span className="text-xs font-mono font-bold text-brand-green">+%{a.upside.toFixed(1)} potansiyel</span>
            </div>
          </button>
        ))}

        {/* AÇIĞA SATIŞLAR */}
        {menuId === 'aciga-satislar' && mc.acigaSatisData.map((a, i) => (
          <button key={i} onClick={() => handleStock(a.symbol)} className="w-full bg-dark-card rounded-xl p-3 border border-dark-border card-hover">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-bold font-mono text-text-primary">{a.symbol}</span>
              <span className="text-xs font-mono font-bold text-text-primary">{a.value}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-text-secondary">Açığa satış oranı: <span className="text-brand-yellow font-bold">%{a.shortPercent}</span></span>
              <span className={`text-[10px] font-mono font-bold ${a.direction === 'up' ? 'text-brand-red' : 'text-brand-green'}`}>
                {a.direction === 'up' ? '↑' : '↓'} {a.change >= 0 ? '+' : ''}{a.change}pp
              </span>
            </div>
          </button>
        ))}

        {/* TEDBİRLİ HİSSELER */}
        {menuId === 'tedbirli-hisseler' && mc.tedbirliHisselerData.map((t, i) => (
          <div key={i} className="bg-dark-card rounded-xl p-3 border border-brand-red/20">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-bold font-mono text-text-primary">{t.symbol}</span>
              <span className="text-[10px] bg-brand-red/20 text-brand-red px-2 py-0.5 rounded-full font-bold">{t.reason}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-text-secondary">Başlangıç: {t.since}</span>
              <span className="text-[10px] text-text-secondary">{t.marketCap}</span>
            </div>
          </div>
        ))}

        {/* İŞ ANLAŞMALARI, DİĞERLERİ — Genel fallback */}
        {['is-anlasmalar', 'hisse-radar', 'teknik-tarama', 'akd-tarama', 'takas-tarama'].includes(menuId) && (
          <div className="text-center py-8">
            <span className="text-4xl">{item.icon}</span>
            <p className="text-sm font-bold text-text-primary mt-3">{item.label}</p>
            <p className="text-xs text-text-secondary mt-1">Bu modülün verileri ilgili sekmelerde mevcuttur.</p>
            <button onClick={() => { onClose(); useStore.getState().setActiveTab('screening'); }}
              className="mt-4 bg-brand-teal text-dark-bg text-xs font-bold px-4 py-2 rounded-xl">Tarama'ya Git</button>
          </div>
        )}
      </div>
    </div>
  );
};
