import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: Props) => {
  const [phase, setPhase] = useState<'logo' | 'text' | 'loading' | 'done'>('logo');

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('text'), 600),
      setTimeout(() => setPhase('loading'), 1400),
      setTimeout(() => setPhase('done'), 2800),
      setTimeout(() => onComplete(), 3200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className="fixed inset-0 bg-dark-bg z-[200] flex flex-col items-center justify-center"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Arka plan parıltı efekti */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-teal/5 blur-[120px]" />
            <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] rounded-full bg-brand-purple/5 blur-[100px]" />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            {/* Logo - Yıldırım ikonu */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, duration: 0.6 }}
              className="mb-6"
            >
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-brand-teal to-emerald-600 flex items-center justify-center shadow-[0_0_40px_rgba(0,212,170,0.3)]">
                <span className="text-4xl">⚡</span>
              </div>
            </motion.div>

            {/* BIST PULSE yazısı */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={phase !== 'logo' ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-3xl font-bold tracking-wider">
                <span className="text-text-primary">BIST </span>
                <span className="text-brand-teal">PULSE</span>
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={phase !== 'logo' ? { opacity: 1 } : {}}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-text-secondary text-sm mt-2 tracking-wide"
              >
                Akıllı Veri Terminali
              </motion.p>
            </motion.div>

            {/* Loading bar */}
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={phase === 'loading' ? { opacity: 1, width: 200 } : {}}
              transition={{ duration: 0.3 }}
              className="mt-8 h-1 rounded-full bg-dark-card overflow-hidden"
              style={{ width: 200 }}
            >
              <motion.div
                initial={{ width: '0%' }}
                animate={phase === 'loading' ? { width: '100%' } : {}}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
                className="h-full rounded-full bg-gradient-to-r from-brand-teal to-brand-green"
              />
            </motion.div>

            {/* Alt bilgi */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={phase === 'loading' ? { opacity: 1 } : {}}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-4 flex flex-col items-center gap-1"
            >
              <p className="text-[11px] text-text-secondary">Piyasa verileri yükleniyor...</p>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
                  <span className="text-[10px] text-text-secondary">Seans Açık</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-teal animate-pulse" />
                  <span className="text-[10px] text-text-secondary">5 Konverjans Sinyali</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Alt köşe versiyon */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute bottom-8 text-[10px] text-text-secondary"
          >
            v1.0 Demo — Powered by Konverjans Motoru™
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
