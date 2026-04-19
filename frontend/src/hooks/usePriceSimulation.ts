import { useEffect, useRef } from 'react';
import { stocks } from '../data/stocks';
import { useStore } from '../store/useStore';

export const usePriceSimulation = () => {
  const updatePrice = useStore((s) => s.updatePrice);
  const pricesRef = useRef<Record<string, number>>({});

  useEffect(() => {
    // İlk fiyatları ayarla
    stocks.forEach((s) => {
      pricesRef.current[s.symbol] = s.price;
    });

    const interval = setInterval(() => {
      // Her 3 saniyede 3-5 rastgele hissenin fiyatını güncelle
      const count = Math.floor(Math.random() * 3) + 3;
      const shuffled = [...stocks].sort(() => Math.random() - 0.5).slice(0, count);

      shuffled.forEach((stock) => {
        const currentPrice = pricesRef.current[stock.symbol] || stock.price;
        // %-0.3 ile +%0.3 arası rastgele değişim
        const changePercent = (Math.random() - 0.48) * 0.006; // Hafif pozitif bias
        const newPrice = parseFloat((currentPrice * (1 + changePercent)).toFixed(2));
        const flash = newPrice > currentPrice ? 'green' : newPrice < currentPrice ? 'red' : null;

        pricesRef.current[stock.symbol] = newPrice;
        updatePrice(stock.symbol, newPrice, flash);

        // Flash'ı 600ms sonra temizle
        if (flash) {
          setTimeout(() => {
            updatePrice(stock.symbol, newPrice, null);
          }, 600);
        }
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [updatePrice]);
};

// Güncel fiyatı al (simüle veya orijinal)
export const useCurrentPrice = (symbol: string): { price: number; flash: 'green' | 'red' | null } => {
  const priceUpdate = useStore((s) => s.priceUpdates[symbol]);
  const stock = stocks.find((s) => s.symbol === symbol);
  return {
    price: priceUpdate?.price ?? stock?.price ?? 0,
    flash: priceUpdate?.flash ?? null,
  };
};
