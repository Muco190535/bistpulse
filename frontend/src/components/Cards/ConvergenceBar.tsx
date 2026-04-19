interface Props {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const ConvergenceBar = ({ score, size = 'md', showLabel = true }: Props) => {
  const getColor = () => {
    if (score >= 85) return 'from-brand-yellow to-amber-400';
    if (score >= 70) return 'from-brand-teal to-emerald-400';
    if (score >= 50) return 'from-yellow-500 to-amber-500';
    return 'from-gray-500 to-gray-600';
  };

  const getGlow = () => {
    if (score >= 85) return 'shadow-[0_0_12px_rgba(245,158,11,0.4)]';
    if (score >= 70) return 'shadow-[0_0_12px_rgba(0,212,170,0.3)]';
    return '';
  };

  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-3.5' };

  return (
    <div className="flex items-center gap-2">
      <div className={`flex-1 bg-dark-bg rounded-full overflow-hidden ${heights[size]} ${getGlow()}`}>
        <div
          className={`h-full rounded-full bg-gradient-to-r ${getColor()} transition-all duration-1000 ease-out`}
          style={{ width: `${score}%` }}
        />
      </div>
      {showLabel && (
        <span className={`font-mono font-bold tabular-nums ${
          score >= 85 ? 'text-brand-yellow' :
          score >= 70 ? 'text-brand-teal' :
          score >= 50 ? 'text-yellow-500' :
          'text-text-secondary'
        } ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
          {score}
        </span>
      )}
    </div>
  );
};
