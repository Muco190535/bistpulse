import { usePrice, useTechnicals } from './useAPI';
import { useCurrentPrice } from './usePriceSimulation';
import { getStock } from '../data/stocks';
import { getConvergence } from '../data/convergence';
import { getAISummary } from '../data/aiSummaries';

export function useStockDetail(symbol: string | null) {
  const stock = symbol ? getStock(symbol) : null;
  const convergence = symbol ? getConvergence(symbol) : null;
  const aiSummary = symbol ? getAISummary(symbol) : null;
  const livePrice = usePrice(symbol || '');
  const { data: technicals, loading: techLoading } = useTechnicals(symbol || '');
  const { price: simPrice, flash } = useCurrentPrice(symbol || '');

  // Gerçek fiyat varsa onu kullan, yoksa mock
  const displayPrice = livePrice?.price || simPrice || stock?.price || 0;
  const previousClose = livePrice?.previousClose || (stock ? stock.price - stock.change : 0);
  const change = displayPrice - previousClose;
  const changePct = previousClose > 0 ? (change / previousClose) * 100 : 0;

  return {
    stock,
    convergence,
    aiSummary,
    livePrice,
    technicals,
    techLoading,
    displayPrice,
    previousClose,
    change,
    changePct,
    flash,
    isLive: !!livePrice,
  };
}
