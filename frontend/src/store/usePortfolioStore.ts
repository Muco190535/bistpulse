import { create } from 'zustand';

export interface PortfolioPosition {
  id: string;
  symbol: string;
  buyPrice: number;
  quantity: number;
  buyDate: string;
  notes: string;
}

interface PortfolioState {
  balance: number;
  positions: PortfolioPosition[];
  tradeHistory: { id: string; symbol: string; side: 'buy' | 'sell'; price: number; quantity: number; date: string; pnl?: number }[];
  setBalance: (b: number) => void;
  addPosition: (p: Omit<PortfolioPosition, 'id'>) => void;
  removePosition: (id: string) => void;
  updatePosition: (id: string, updates: Partial<PortfolioPosition>) => void;
  addTrade: (t: Omit<PortfolioState['tradeHistory'][0], 'id'>) => void;
}

// LocalStorage'dan yükle
function loadState() {
  try {
    const saved = localStorage.getItem('bistpulse_portfolio');
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
}

function saveState(state: Partial<PortfolioState>) {
  try {
    localStorage.setItem('bistpulse_portfolio', JSON.stringify({
      balance: state.balance,
      positions: state.positions,
      tradeHistory: state.tradeHistory,
    }));
  } catch {}
}

const initial = loadState();

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
  balance: initial?.balance ?? 0,
  positions: initial?.positions ?? [],
  tradeHistory: initial?.tradeHistory ?? [],

  setBalance: (balance) => {
    set({ balance });
    saveState({ ...get(), balance });
  },

  addPosition: (p) => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const positions = [...get().positions, { ...p, id }];
    set({ positions });
    saveState({ ...get(), positions });
  },

  removePosition: (id) => {
    const positions = get().positions.filter(p => p.id !== id);
    set({ positions });
    saveState({ ...get(), positions });
  },

  updatePosition: (id, updates) => {
    const positions = get().positions.map(p => p.id === id ? { ...p, ...updates } : p);
    set({ positions });
    saveState({ ...get(), positions });
  },

  addTrade: (t) => {
    const id = Date.now().toString(36);
    const tradeHistory = [...get().tradeHistory, { ...t, id }];
    set({ tradeHistory });
    saveState({ ...get(), tradeHistory });
  },
}));
