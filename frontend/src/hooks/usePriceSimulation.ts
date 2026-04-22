// Eski: stocks array'ini random fiyatlarla simüle ediyordu.
// Şimdi gerçek backend canlı fiyatlar useStocks() ile geldiği için
// simülasyon devre dışı. Hook isimleri ve export'lar korundu ki diğer kod kırılmasın.

import { useStore } from '../store/useStore';
import { getStock } from '../data/stocks';

/**
 * Eski fake fiyat simülasyon hook'u. Artık hiçbir şey yapmıyor.
 * App.tsx'te hala çağrılıyor ama içeride NO-OP.
 */
export const usePriceSimulation = () => {
  // no-op
};

/**
 * Symbol için güncel fiyat + flash efekti döndürür.
 * Önceliği store.priceUpdates'e verir (fake sistemle uyum için),
 * değilse module cache'ten (gerçek backend) okur.
 */
export const useCurrentPrice = (symbol: string): { price: number; flash: 'green' | 'red' | null } => {
  const priceUpdate = useStore((s) => s.priceUpdates[symbol]);
  if (priceUpdate) {
    return { price: priceUpdate.price, flash: priceUpdate.flash };
  }
  const stock = getStock(symbol);
  return {
    price: stock?.price ?? 0,
    flash: null,
  };
};
