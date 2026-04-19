export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  color: string;
  badge?: string;
  badgeColor?: string;
  category: 'main' | 'discovery' | 'extra';
  hasData: boolean;
}

export const menuItems: MenuItem[] = [
  // Ana Grid — Satır 1
  { id: 'kap-ajan', label: 'KAP Ajan', icon: '🔔', color: 'from-red-500/20 to-red-600/10', category: 'main', hasData: true, badge: '5', badgeColor: 'bg-brand-red' },
  { id: 'teorik-liste', label: 'Teorik Liste', icon: '💓', color: 'from-pink-500/20 to-pink-600/10', category: 'main', hasData: true },
  { id: 'yukselen-dusen', label: 'Yükselen Düşen', icon: '📈', color: 'from-green-500/20 to-green-600/10', category: 'main', hasData: true },
  { id: 'al-sat-sinyalleri', label: 'Al/Sat Sinyalleri', icon: '⚡', color: 'from-yellow-500/20 to-yellow-600/10', category: 'main', hasData: true, badge: 'Yeni', badgeColor: 'bg-brand-teal' },

  // Ana Grid — Satır 2
  { id: 'viop', label: 'VİOP Sözleşmeleri', icon: '📊', color: 'from-blue-500/20 to-blue-600/10', category: 'main', hasData: true },
  { id: 'is-anlasmalar', label: 'İş Anlaşmaları', icon: '📄', color: 'from-indigo-500/20 to-indigo-600/10', category: 'main', hasData: true },
  { id: 'halka-arz', label: 'Halka Arz', icon: '🏛️', color: 'from-purple-500/20 to-purple-600/10', category: 'main', hasData: true },
  { id: 'geri-alimlar', label: 'Geri Alımlar', icon: '🔄', color: 'from-cyan-500/20 to-cyan-600/10', category: 'main', hasData: true },

  // Ana Grid — Satır 3
  { id: 'son-bilancolar', label: 'Son Bilançolar', icon: '📑', color: 'from-orange-500/20 to-orange-600/10', category: 'main', hasData: true },
  { id: 'endeksler', label: 'Endeksler', icon: '📉', color: 'from-teal-500/20 to-teal-600/10', category: 'main', hasData: true },
  { id: 'para-giris-cikis', label: 'Para Giriş Çıkış', icon: '💰', color: 'from-emerald-500/20 to-emerald-600/10', category: 'main', hasData: true },
  { id: 'son-haberler', label: 'Son Haberler', icon: '📰', color: 'from-rose-500/20 to-rose-600/10', category: 'main', hasData: true },

  // Ana Grid — Satır 4
  { id: 'kurumsal-takas', label: 'Kurumsal Takas', icon: '🤝', color: 'from-violet-500/20 to-violet-600/10', category: 'main', hasData: true },
  { id: 'sektorel-performans', label: 'Sektörel Performans', icon: '🏭', color: 'from-amber-500/20 to-amber-600/10', category: 'main', hasData: true },
  { id: 'analist-onerileri', label: 'Analist Önerileri', icon: '⭐', color: 'from-yellow-500/20 to-yellow-600/10', category: 'main', hasData: true },
  { id: 'aciga-satislar', label: 'Açığa Satışlar', icon: '📉', color: 'from-red-500/20 to-red-600/10', category: 'main', hasData: true },

  // Extra
  { id: 'tedbirli-hisseler', label: 'Tedbirli Hisseler', icon: '🛡️', color: 'from-red-600/20 to-red-700/10', category: 'extra', hasData: true, badge: '3', badgeColor: 'bg-brand-red' },

  // Discovery (Diğer sayfası üst kısım)
  { id: 'hisse-radar', label: 'Hisse Radar', icon: '🔎', color: 'from-brand-teal/20 to-emerald-600/10', category: 'discovery', hasData: true },
  { id: 'teknik-tarama', label: 'Teknik Tarama', icon: '💓', color: 'from-brand-teal/20 to-teal-600/10', category: 'discovery', hasData: true },
  { id: 'akd-tarama', label: 'AKD Tarama', icon: '🔍', color: 'from-brand-teal/20 to-cyan-600/10', category: 'discovery', hasData: true },
  { id: 'takas-tarama', label: 'Takas Tarama', icon: '🔄', color: 'from-brand-teal/20 to-blue-600/10', category: 'discovery', hasData: true },
];

export const getMainMenuItems = () => menuItems.filter(m => m.category === 'main');
export const getExtraMenuItems = () => menuItems.filter(m => m.category === 'extra');
export const getDiscoveryMenuItems = () => menuItems.filter(m => m.category === 'discovery');
