import { useState } from 'react';
import { getDiscoveryMenuItems, getMainMenuItems, getExtraMenuItems } from '../../data/menuItems';
import { MenuContentModal } from '../Home/MenuContentModal';
import { useTedbirli } from '../../hooks/useAPI';
import { useStore } from '../../store/useStore';

export const DiscoverPage = () => {
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);
  const discoveryItems = getDiscoveryMenuItems();
  const mainItems = getMainMenuItems();
  const extraItems = getExtraMenuItems();

  // Preload: dinamik badge'lerin arka planda güncellenmesi için veri çekilir.
  // Hook'un return'ünü kullanmıyoruz; amaç sadece store'daki menuCounts'u beslemek.
  useTedbirli();

  const menuCounts = useStore(s => s.menuCounts);
  // Dinamik sayı varsa onu göster, yoksa menuItems.ts'deki hardcoded fallback
  const badgeFor = (id: string, fallback?: string) => {
    const dynamic = menuCounts[id];
    if (typeof dynamic === 'number') return String(dynamic);
    return fallback;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-3 pb-2">
        <h1 className="text-base font-bold text-text-primary">Diğer</h1>
        <p className="text-[11px] text-text-secondary">Tüm modüller ve araçlar</p>
      </div>
      <div className="flex-1 overflow-y-auto px-3 pt-1 pb-20">
        {/* Discovery Özel Kısım */}
        <p className="text-[10px] text-brand-teal font-bold px-1 mb-2">⚡ KEŞİF ARAÇLARI</p>
        <div className="grid grid-cols-4 gap-2 mb-4">
          {discoveryItems.map(item => (
            <button key={item.id} onClick={() => setSelectedMenu(item.id)}
              className="flex flex-col items-center justify-center bg-dark-card rounded-xl p-2.5 border border-brand-teal/20 card-hover aspect-square">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-1.5`}>
                <span className="text-lg">{item.icon}</span>
              </div>
              <span className="text-[9px] text-text-secondary text-center leading-tight font-medium line-clamp-2">{item.label}</span>
            </button>
          ))}
        </div>
        {/* Tüm Modüller */}
        <p className="text-[10px] text-text-secondary font-bold px-1 mb-2">TÜM MODÜLLER</p>
        <div className="grid grid-cols-4 gap-2">
          {[...mainItems, ...extraItems].map(item => {
            const badge = badgeFor(item.id, item.badge);
            return (
              <button key={item.id} onClick={() => setSelectedMenu(item.id)}
                className="relative flex flex-col items-center justify-center bg-dark-card rounded-xl p-2.5 border border-dark-border card-hover aspect-square">
                {badge && (
                  <div className={`absolute -top-1 -right-1 ${item.badgeColor || 'bg-brand-red'} rounded-full px-1.5 py-0.5 min-w-[18px] flex items-center justify-center`}>
                    <span className="text-[8px] font-bold text-white">{badge}</span>
                  </div>
                )}
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-1.5`}>
                  <span className="text-lg">{item.icon}</span>
                </div>
                <span className="text-[9px] text-text-secondary text-center leading-tight font-medium line-clamp-2">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      {selectedMenu && <MenuContentModal menuId={selectedMenu} onClose={() => setSelectedMenu(null)} />}
    </div>
  );
};
