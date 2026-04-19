import { create } from 'zustand';

interface SettingsState {
  darkTheme: boolean;
  fontSize: 'small' | 'medium' | 'large';
  keepScreenOn: boolean;
  showSessionTimer: boolean;
  showActiveUsers: boolean;
  showClock: boolean;
  showWelcome: boolean;
  showBulletinNotif: boolean;
  toggleDarkTheme: () => void;
  setFontSize: (s: 'small' | 'medium' | 'large') => void;
  toggleKeepScreenOn: () => void;
  toggleSessionTimer: () => void;
  toggleActiveUsers: () => void;
  toggleClock: () => void;
  toggleWelcome: () => void;
  toggleBulletinNotif: () => void;
}

export const useSettings = create<SettingsState>((set) => ({
  darkTheme: true,
  fontSize: 'medium',
  keepScreenOn: false,
  showSessionTimer: false,
  showActiveUsers: true,
  showClock: true,
  showWelcome: true,
  showBulletinNotif: false,
  toggleDarkTheme: () => set(s => ({ darkTheme: !s.darkTheme })),
  setFontSize: (fontSize) => set({ fontSize }),
  toggleKeepScreenOn: () => set(s => ({ keepScreenOn: !s.keepScreenOn })),
  toggleSessionTimer: () => set(s => ({ showSessionTimer: !s.showSessionTimer })),
  toggleActiveUsers: () => set(s => ({ showActiveUsers: !s.showActiveUsers })),
  toggleClock: () => set(s => ({ showClock: !s.showClock })),
  toggleWelcome: () => set(s => ({ showWelcome: !s.showWelcome })),
  toggleBulletinNotif: () => set(s => ({ showBulletinNotif: !s.showBulletinNotif })),
}));
