import { useEffect, useState, useCallback } from 'react';
import { useStore } from './store/useStore';
import { usePriceSimulation } from './hooks/usePriceSimulation';
import { Header } from './components/Layout/Header';
import { BottomNav } from './components/Layout/BottomNav';
import { SearchModal } from './components/Layout/SearchModal';
import { SplashScreen } from './components/SplashScreen';
import { HomePage } from './pages/Home/HomePage';
import { PulsePage } from './pages/Pulse/PulsePage';
import { ScreeningPage } from './pages/Screening/ScreeningPage';
import { OverviewPage } from './pages/Overview/OverviewPage';
import { PortfolioPage } from './pages/Portfolio/PortfolioPage';
import { AlertsPage } from './pages/Alerts/AlertsPage';
import { AIPage } from './pages/AI/AIPage';
import { DiscoverPage } from './pages/Discover/DiscoverPage';
import { StockDetailPage } from './pages/StockDetail/StockDetailPage';

function App() {
  const { activeTab, selectedStock } = useStore();
  const [showSplash, setShowSplash] = useState(true);
  usePriceSimulation();

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      try {
        if ('setHeaderColor' in tg) (tg as any).setHeaderColor('#0A0E1A');
        if ('setBackgroundColor' in tg) (tg as any).setBackgroundColor('#0A0E1A');
      } catch {}
    }
  }, []);

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
    try { window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success'); } catch {}
  }, []);

  const renderPage = () => {
    switch (activeTab) {
      case 'home': return <HomePage />;
      case 'pulse': return <PulsePage />;
      case 'screening': return <ScreeningPage />;
      case 'overview': return <OverviewPage />;
      case 'portfolio': return <PortfolioPage />;
      case 'alerts': return <AlertsPage />;
      case 'ai': return <AIPage />;
      case 'discover': return <DiscoverPage />;
      default: return <HomePage />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-dark-bg">
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <Header />
      <main className="flex-1 overflow-hidden pt-12">{renderPage()}</main>
      <BottomNav />
      <SearchModal />
      {selectedStock && <StockDetailPage />}
    </div>
  );
}

export default App;
