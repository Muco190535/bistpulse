import type { FeedEvent } from '../../data/liveFeed';
import { useStore } from '../../store/useStore';

interface Props {
  event: FeedEvent;
}

export const FeedEventCard = ({ event }: Props) => {
  const { setSelectedStock } = useStore();

  const typeStyles = {
    positive: 'border-l-brand-green bg-brand-green/5',
    warning: 'border-l-brand-yellow bg-brand-yellow/5',
    negative: 'border-l-brand-red bg-brand-red/5',
  };

  return (
    <button
      onClick={() => setSelectedStock(event.symbol)}
      className={`w-full text-left rounded-xl border-l-[3px] pl-3 pr-3 py-2.5 ${typeStyles[event.type]} card-hover`}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-secondary font-mono">{event.time}</span>
          <span className="text-xs font-bold font-mono text-text-primary">{event.symbol}</span>
          <span className="text-[10px] bg-dark-card px-1.5 py-0.5 rounded text-text-secondary">
            {event.category}
          </span>
        </div>
        <div className="flex">
          {Array.from({ length: event.importance }, (_, i) => (
            <span key={i} className="text-[8px]">
              {event.type === 'positive' ? '🟢' : event.type === 'warning' ? '🟡' : '🔴'}
            </span>
          ))}
        </div>
      </div>
      <p className="text-xs text-text-secondary leading-relaxed">{event.description}</p>
    </button>
  );
};
