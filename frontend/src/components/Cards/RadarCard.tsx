import type { ConvergenceScore } from '../../data/convergence';
import { getStock } from '../../data/stocks';
import { useCurrentPrice } from '../../hooks/usePriceSimulation';
import { ConvergenceBar } from './ConvergenceBar';
import { useStore } from '../../store/useStore';

interface Props {
  data: ConvergenceScore;
  rank: number;
}

export const RadarCard = ({ data, rank }: Props) => {
  const stock = getStock(data.symbol);
  const { price, flash } = useCurrentPrice(data.symbol);
  const { setSelectedStock } = useStore();

  if (!stock) return null;

  const displayPrice = price || stock.price;
  const change = ((displayPrice - (stock.price - stock.change)) / (stock.price - stock.change)) * 100;

  const layerIcons = [
    { label: 'TEK', score: data.technicalScore, max: 25, icon: '📈' },
    { label: 'KUR', score: data.institutionalScore, max: 25, icon: '🏦' },
    { label: 'TEM', score: data.fundamentalScore, max: 25, icon: '📋' },
    { label: 'YAB', score: data.foreignScore, max: 25, icon: '🌍' },
  ];

  return (
    <button
      onClick={() => setSelectedStock(data.symbol)}
      className={`w-full bg-dark-card rounded-2xl p-4 border border-dark-border card-hover ${
        data.totalScore >= 85 ? 'border-brand-yellow/30' :
        data.totalScore >= 70 ? 'border-brand-teal/20' : ''
      } ${flash === 'green' ? 'price-flash-green' : flash === 'red' ? 'price-flash-red' : ''}`}
    >
      {/* Üst Satır */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-dark-bg bg-brand-teal w-5 h-5 rounded-full flex items-center justify-center">
            {rank}
          </span>
          <div className="text-left">
            <span className="text-base font-bold font-mono text-text-primary">{stock.symbol}</span>
            <span className="text-[11px] text-text-secondary ml-2">{stock.sector}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-base font-mono font-semibold tabular-nums text-text-primary">
            {displayPrice.toFixed(2)}₺
          </div>
          <div className={`text-xs font-mono tabular-nums font-medium ${change >= 0 ? 'text-brand-green' : 'text-brand-red'}`}>
            {change >= 0 ? '▲' : '▼'} %{Math.abs(change).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Konverjans Barı */}
      <ConvergenceBar score={data.totalScore} size="lg" />

      {/* 4 Katman İkonları */}
      <div className="flex items-center justify-between mt-3 mb-2">
        {layerIcons.map((layer) => {
          const ratio = layer.score / layer.max;
          const isActive = ratio >= 0.6;
          return (
            <div key={layer.label} className="flex flex-col items-center">
              <span className={`text-base ${isActive ? '' : 'opacity-30 grayscale'}`}>{layer.icon}</span>
              <span className={`text-[10px] font-mono font-medium mt-0.5 ${
                isActive ? 'text-brand-teal' : 'text-text-secondary'
              }`}>
                {layer.score}/{layer.max}
              </span>
            </div>
          );
        })}
      </div>

      {/* Gerekçe */}
      <p className="text-xs text-text-secondary mt-2 text-left leading-relaxed line-clamp-2">
        {data.reasoning}
      </p>

      {/* Alt Bilgi */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-dark-border">
        <div className="flex items-center gap-1 flex-wrap">
          {data.activeStrategies.slice(0, 2).map((s) => (
            <span key={s} className="text-[10px] bg-brand-teal/10 text-brand-teal px-2 py-0.5 rounded-full">{s}</span>
          ))}
          {data.activeStrategies.length > 2 && (
            <span className="text-[10px] text-text-secondary">+{data.activeStrategies.length - 2}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-text-secondary">Başarı:</span>
          <span className="text-[11px] font-bold text-brand-green font-mono">%{data.historicalWinRate}</span>
        </div>
      </div>
    </button>
  );
};
