import { useSettings } from '../../store/useSettings';

interface Props { onClose: () => void; }

const Toggle = ({ value, onToggle }: { value: boolean; onToggle: () => void }) => (
  <button onClick={onToggle} className={`w-11 h-6 rounded-full transition-all duration-200 ${value ? 'bg-brand-teal' : 'bg-dark-border'}`}>
    <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ${value ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
  </button>
);

export const SettingsPage = ({ onClose }: Props) => {
  const s = useSettings();
  const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;

  return (
    <div className="fixed inset-0 bg-dark-bg z-[95] flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-dark-border">
        <button onClick={onClose} className="text-brand-teal text-sm font-medium">← Geri</button>
        <span className="text-sm font-bold text-text-primary">Ayarlar</span>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6 space-y-4">
        {/* Kullanıcı Bilgisi */}
        <div className="bg-dark-card rounded-2xl p-4 border border-dark-border flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-teal to-brand-green flex items-center justify-center text-xl font-bold text-dark-bg">
            {tgUser?.first_name?.[0] || '👤'}
          </div>
          <div>
            <p className="text-sm font-bold text-text-primary">{tgUser?.first_name || 'Demo Kullanıcı'} {tgUser?.last_name || ''}</p>
            <p className="text-[11px] text-text-secondary font-mono">ID: {tgUser?.id || '887112897'}</p>
            {tgUser?.username && <p className="text-[11px] text-brand-teal">@{tgUser.username}</p>}
          </div>
        </div>

        {/* Görünüm */}
        <div className="bg-dark-card rounded-2xl border border-dark-border overflow-hidden">
          <p className="text-[10px] text-text-secondary font-bold px-4 pt-3 pb-1">GÖRÜNÜM</p>
          <div className="flex items-center justify-between px-4 py-3 border-b border-dark-border/50">
            <div className="flex items-center gap-2"><span>🌙</span><span className="text-xs text-text-primary">Koyu Tema</span></div>
            <Toggle value={s.darkTheme} onToggle={s.toggleDarkTheme} />
          </div>
          <div className="flex items-center justify-between px-4 py-3 border-b border-dark-border/50">
            <div className="flex items-center gap-2"><span>🔤</span><span className="text-xs text-text-primary">Yazı Boyutu</span></div>
            <div className="flex items-center gap-1">
              {(['small', 'medium', 'large'] as const).map(size => (
                <button key={size} onClick={() => s.setFontSize(size)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium ${s.fontSize === size ? 'bg-brand-teal text-dark-bg' : 'bg-dark-bg text-text-secondary'}`}>
                  {size === 'small' ? 'A⁻' : size === 'medium' ? 'Orta' : 'A⁺'}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2"><span>💡</span><span className="text-xs text-text-primary">Ekran Açık Kalsın</span></div>
            <Toggle value={s.keepScreenOn} onToggle={s.toggleKeepScreenOn} />
          </div>
        </div>

        {/* Durum Çubuğu */}
        <div className="bg-dark-card rounded-2xl border border-dark-border overflow-hidden">
          <p className="text-[10px] text-text-secondary font-bold px-4 pt-3 pb-1">DURUM ÇUBUĞU</p>
          <div className="flex items-center justify-between px-4 py-3 border-b border-dark-border/50">
            <div className="flex items-center gap-2"><span>⏱️</span><span className="text-xs text-text-primary">Oturum Sayacı</span></div>
            <Toggle value={s.showSessionTimer} onToggle={s.toggleSessionTimer} />
          </div>
          <div className="flex items-center justify-between px-4 py-3 border-b border-dark-border/50">
            <div className="flex items-center gap-2"><span>👥</span><span className="text-xs text-text-primary">Aktif Kullanıcılar</span></div>
            <Toggle value={s.showActiveUsers} onToggle={s.toggleActiveUsers} />
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2"><span>🕐</span><span className="text-xs text-text-primary">Saat</span></div>
            <Toggle value={s.showClock} onToggle={s.toggleClock} />
          </div>
        </div>

        {/* Ana Ekran */}
        <div className="bg-dark-card rounded-2xl border border-dark-border overflow-hidden">
          <p className="text-[10px] text-text-secondary font-bold px-4 pt-3 pb-1">ANA EKRAN</p>
          <div className="flex items-center justify-between px-4 py-3 border-b border-dark-border/50">
            <div className="flex items-center gap-2"><span>💜</span><span className="text-xs text-text-primary">Karşılama Mesajı</span></div>
            <Toggle value={s.showWelcome} onToggle={s.toggleWelcome} />
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2"><span>🔔</span><span className="text-xs text-text-primary">Bülten Bildirimleri</span></div>
            <Toggle value={s.showBulletinNotif} onToggle={s.toggleBulletinNotif} />
          </div>
        </div>

        {/* Cihaz Bilgileri */}
        <div className="bg-dark-card rounded-2xl border border-dark-border overflow-hidden">
          <p className="text-[10px] text-text-secondary font-bold px-4 pt-3 pb-1">CİHAZ BİLGİLERİ</p>
          {[
            { label: 'Platform', value: navigator.platform || 'Web' },
            { label: 'Telegram', value: '11.2' },
            { label: 'Ekran', value: `${window.innerWidth}×${window.innerHeight}` },
            { label: 'Dil', value: navigator.language },
            { label: 'Versiyon', value: 'v1.0.0-demo' },
          ].map((info, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-2 border-b border-dark-border/30 last:border-0">
              <span className="text-xs text-text-secondary">{info.label}</span>
              <span className="text-xs text-text-primary font-mono">{info.value}</span>
            </div>
          ))}
        </div>

        {/* Yasal Uyarı */}
        <div className="bg-dark-card rounded-2xl p-4 border border-brand-yellow/20">
          <p className="text-[10px] text-text-secondary leading-relaxed">
            ⚠️ Bu uygulama yalnızca bilgilendirme amaçlıdır ve herhangi bir yatırım tavsiyesi içermez. Sunulan veriler Borsa İstanbul kaynaklı olup yatırım kararlarınızda tek başına referans olarak kullanılmamalıdır. Yatırım işlemleri risk içerir; kararlarınızı kendi araştırmanız ve değerlendirmeniz doğrultusunda almanız önerilir.
          </p>
          <p className="text-[10px] text-text-secondary mt-2">Borsa İstanbul verileri üzerine geliştirilmiştir.</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] text-brand-teal">Sermaye Borsası</span>
            <span className="text-[10px] text-text-secondary">•</span>
            <span className="text-[10px] text-brand-teal">İletişim</span>
          </div>
        </div>
      </div>
    </div>
  );
};
