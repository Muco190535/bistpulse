import { create } from 'zustand';
type Tab = 'home' | 'pulse' | 'screening' | 'overview' | 'portfolio' | 'alerts' | 'ai' | 'discover';
interface AppState {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  selectedStock: string | null;
  setSelectedStock: (symbol: string | null) => void;
  isSessionOpen: boolean;
  currentTime: string;
  priceUpdates: Record<string, { price: number; flash: 'green' | 'red' | null }>;
  updatePrice: (symbol: string, price: number, flash: 'green' | 'red' | null) => void;
  userPlan: 'FREE' | 'PRO' | 'ELITE';
  setUserPlan: (plan: 'FREE' | 'PRO' | 'ELITE') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  // Dinamik menü badge sayıları — backend'den beslenir, menuItems.ts'teki hardcoded badge'leri override eder
  menuCounts: Record<string, number>;
  setMenuCount: (menuId: string, count: number) => void;
}
export const useStore = create<AppState>((set) => ({
  activeTab: 'home',
  setActiveTab: (tab) => set({ activeTab: tab, selectedStock: null }),
  selectedStock: null,
  setSelectedStock: (symbol) => set({ selectedStock: symbol }),
  isSessionOpen: true,
  currentTime: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  priceUpdates: {},
  updatePrice: (symbol, price, flash) => set((state) => ({ priceUpdates: { ...state.priceUpdates, [symbol]: { price, flash } } })),
  userPlan: 'ELITE',
  setUserPlan: (plan) => set({ userPlan: plan }),
  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
  isSearchOpen: false,
  setIsSearchOpen: (open) => set({ isSearchOpen: open }),
  menuCounts: {},
  setMenuCount: (menuId, count) => set((state) => ({ menuCounts: { ...state.menuCounts, [menuId]: count } })),
}));
