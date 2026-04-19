import { useStore } from '../../store/useStore';

const tabs = [
  { id: 'home' as const, icon: 'H', activeIcon: 'H', label: 'Ana Sayfa', color: 'brand-teal' },
  { id: 'pulse' as const, icon: 'P', activeIcon: 'P', label: 'Pulse', color: 'brand-green' },
  { id: 'screening' as const, icon: 'T', activeIcon: 'T', label: 'Tarama', color: 'brand-yellow' },
  { id: 'portfolio' as const, icon: 'F', activeIcon: 'F', label: 'Portföy', color: 'brand-purple' },
  { id: 'ai' as const, icon: 'AI', activeIcon: 'AI', label: 'AI', color: 'brand-purple' },
  { id: 'discover' as const, icon: '+', activeIcon: '+', label: 'Daha', color: 'brand-teal' },
];

export const BottomNav = () => {
  const { activeTab, setActiveTab } = useStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-dark-card/95 backdrop-blur-md border-t border-dark-border safe-bottom z-50">
      <div className="flex justify-around items-center h-14 px-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => {
              setActiveTab(tab.id);
              try { window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light'); } catch {}
            }}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 relative`}>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold transition-all duration-200 ${
                isActive ? `bg-${tab.color}/20 text-${tab.color}` : 'text-text-secondary'
              }`} style={isActive ? { backgroundColor: tab.color === 'brand-teal' ? 'rgba(0,212,170,0.15)' : tab.color === 'brand-green' ? 'rgba(0,230,118,0.15)' : tab.color === 'brand-yellow' ? 'rgba(255,214,0,0.15)' : 'rgba(187,134,252,0.15)' } : {}}>
                {tab.id === 'home' && (isActive ?
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/></svg> :
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/></svg>
                )}
                {tab.id === 'pulse' && (
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l3.25-5.5 3 8 3.5-10L17 13.5h3.25"/></svg>
                )}
                {tab.id === 'screening' && (
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>
                )}
                {tab.id === 'portfolio' && (
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0"/></svg>
                )}
                {tab.id === 'ai' && (
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"/></svg>
                )}
                {tab.id === 'discover' && (
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"/></svg>
                )}
              </div>
              <span className={`text-[9px] mt-0.5 font-medium ${isActive ? 'text-brand-teal' : 'text-text-secondary'}`}>{tab.label}</span>
              {isActive && <div className="absolute top-0 w-6 h-0.5 bg-brand-teal rounded-full" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
