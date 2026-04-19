import { useStore } from '../../store/useStore';
import { searchStocks } from '../../data/stocks';

export const SearchModal = () => {
  const { isSearchOpen, setIsSearchOpen, searchQuery, setSearchQuery, setSelectedStock, setActiveTab } = useStore();

  if (!isSearchOpen) return null;

  const results = searchQuery.length > 0 ? searchStocks(searchQuery).slice(0, 10) : [];

  return (
    <div className="fixed inset-0 bg-dark-bg/98 z-[100] flex flex-col">
      {/* Arama Çubuğu */}
      <div className="flex items-center gap-3 px-4 pt-3 pb-2">
        <div className="flex-1 flex items-center bg-dark-card rounded-xl px-4 py-3 border border-dark-border">
          <span className="text-text-secondary mr-2">🔍</span>
          <input
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Hisse ara... (THYAO, Garanti, Banka...)"
            className="flex-1 bg-transparent text-text-primary text-sm outline-none placeholder:text-text-secondary"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-text-secondary ml-2">✕</button>
          )}
        </div>
        <button
          onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
          className="text-brand-teal text-sm font-medium"
        >
          İptal
        </button>
      </div>

      {/* Sonuçlar */}
      <div className="flex-1 overflow-y-auto px-4">
        {results.length === 0 && searchQuery.length > 0 && (
          <p className="text-text-secondary text-center mt-8">Sonuç bulunamadı</p>
        )}
        {searchQuery.length === 0 && (
          <div className="mt-6">
            <p className="text-text-secondary text-xs font-medium mb-3">POPÜLER HİSSELER</p>
            {['THYAO', 'GARAN', 'ASELS', 'EREGL', 'SISE', 'AKBNK'].map((sym) => {
              const stock = searchStocks(sym)[0];
              if (!stock) return null;
              return (
                <button
                  key={sym}
                  onClick={() => {
                    setSelectedStock(sym);
                    setActiveTab('pulse');
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="flex items-center justify-between w-full py-3 border-b border-dark-border card-hover"
                >
                  <div>
                    <span className="text-sm font-bold text-text-primary font-mono">{stock.symbol}</span>
                    <span className="text-xs text-text-secondary ml-2">{stock.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-mono tabular-nums text-text-primary">{stock.price.toFixed(2)}₺</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
        {results.map((stock) => (
          <button
            key={stock.symbol}
            onClick={() => {
              setSelectedStock(stock.symbol);
              setActiveTab('pulse');
              setIsSearchOpen(false);
              setSearchQuery('');
            }}
            className="flex items-center justify-between w-full py-3 border-b border-dark-border card-hover"
          >
            <div>
              <span className="text-sm font-bold text-text-primary font-mono">{stock.symbol}</span>
              <span className="text-xs text-text-secondary ml-2">{stock.name}</span>
              <span className="text-[10px] text-text-secondary ml-2 bg-dark-bg px-1.5 py-0.5 rounded">{stock.sector}</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-mono tabular-nums text-text-primary">{stock.price.toFixed(2)}₺</div>
              <div className={`text-xs font-mono tabular-nums ${stock.changePercent >= 0 ? 'text-brand-green' : 'text-brand-red'}`}>
                {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
