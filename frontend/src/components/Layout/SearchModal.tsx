import { useStore } from '../../store/useStore';
import { searchStocks } from '../../data/stocks';

interface StockRowData {
  symbol: string;
  name: string;
  sector?: string;
  price: number;
  changePercent?: number;
}

// Ortak satır render — hem popüler hem arama sonuçları için
const StockRow = ({ stock, onClick }: { stock: StockRowData; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="w-full py-2.5 border-b border-dark-border/50 card-hover text-left"
  >
    {/* ÜST SATIR: Sembol + fiyat */}
    <div className="flex items-center justify-between gap-2">
      <span className="text-sm font-bold font-mono text-text-primary flex-shrink-0">
        {stock.symbol}
      </span>
      <span className="text-sm font-mono tabular-nums text-text-primary flex-shrink-0">
        {stock.price.toFixed(2)}₺
      </span>
    </div>
    {/* ALT SATIR: Şirket adı + sektör (sol, truncate) + değişim (sağ) */}
    <div className="flex items-center justify-between gap-2 mt-0.5">
      <div className="flex items-center gap-1.5 min-w-0 flex-1">
        <span className="text-[11px] text-text-secondary truncate">
          {stock.name}
        </span>
        {stock.sector && (
          <span className="text-[9px] text-text-secondary bg-dark-bg px-1.5 py-0.5 rounded flex-shrink-0">
            {stock.sector}
          </span>
        )}
      </div>
      {typeof stock.changePercent === 'number' && (
        <span
          className={`text-[11px] font-mono tabular-nums flex-shrink-0 ${
            stock.changePercent >= 0 ? 'text-brand-green' : 'text-brand-red'
          }`}
        >
          {stock.changePercent >= 0 ? '+' : ''}
          {stock.changePercent.toFixed(2)}%
        </span>
      )}
    </div>
  </button>
);

export const SearchModal = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    setSelectedStock,
    setActiveTab,
  } = useStore();

  if (!isSearchOpen) return null;

  const results = searchQuery.length > 0 ? searchStocks(searchQuery).slice(0, 10) : [];

  const handleSelect = (symbol: string) => {
    setSelectedStock(symbol);
    setActiveTab('pulse');
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const handleClose = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="fixed inset-0 bg-dark-bg/98 z-[100] flex flex-col">
      {/* Arama Çubuğu */}
      <div className="flex items-center gap-2 px-3 pt-3 pb-2">
        <div className="flex-1 min-w-0 flex items-center bg-dark-card rounded-xl px-3 py-2.5 border border-dark-border">
          <span className="text-text-secondary mr-2 flex-shrink-0">🔍</span>
          <input
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Hisse ara..."
            className="flex-1 min-w-0 bg-transparent text-text-primary text-sm outline-none placeholder:text-text-secondary"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-text-secondary ml-2 flex-shrink-0 text-sm"
              aria-label="Temizle"
            >
              ✕
            </button>
          )}
        </div>
        <button
          onClick={handleClose}
          className="text-brand-teal text-sm font-medium flex-shrink-0 px-1"
        >
          İptal
        </button>
      </div>

      {/* Sonuçlar */}
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {/* Arama yapıldı ama sonuç yok */}
        {results.length === 0 && searchQuery.length > 0 && (
          <div className="text-center mt-12">
            <span className="text-3xl">🔍</span>
            <p className="text-text-secondary text-sm mt-3">Sonuç bulunamadı</p>
            <p className="text-text-secondary text-xs mt-1">
              "{searchQuery}" için eşleşme yok
            </p>
          </div>
        )}

        {/* Popüler hisseler (boş arama) */}
        {searchQuery.length === 0 && (
          <div className="mt-4">
            <p className="text-text-secondary text-[10px] font-bold mb-2 px-1">
              POPÜLER HİSSELER
            </p>
            {['THYAO', 'GARAN', 'ASELS', 'EREGL', 'SISE', 'AKBNK'].map((sym) => {
              const stock = searchStocks(sym)[0];
              if (!stock) return null;
              return (
                <StockRow key={sym} stock={stock} onClick={() => handleSelect(sym)} />
              );
            })}
          </div>
        )}

        {/* Arama sonuçları */}
        {results.length > 0 && (
          <div className="mt-2">
            <p className="text-text-secondary text-[10px] font-bold mb-2 px-1">
              {results.length} SONUÇ
            </p>
            {results.map((stock) => (
              <StockRow
                key={stock.symbol}
                stock={stock}
                onClick={() => handleSelect(stock.symbol)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
