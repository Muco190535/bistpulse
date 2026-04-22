import { useState, useEffect, useCallback } from 'react';
import { useStore } from '../store/useStore';
import { _setStockCache, type Stock } from '../data/stocks';

const API = '/api';

interface PriceData {
  symbol: string;
  name: string;
  nameTR?: string;
  sector?: string;
  price: number;
  previousClose: number;
  change: number;
  changePercent: number;
  dayHigh: number;
  dayLow: number;
  volume: number;
  high52w: number;
  low52w: number;
  lastUpdated: string;
  marketCapMN?: number;
  marketCapUSD?: number;
  freeFloatPct?: number;
}

interface PricesResponse {
  total: number;
  page: number;
  limit: number;
  fetchedAt: string;
  items: PriceData[];
}

interface TechnicalData {
  symbol: string; ema20: number; ema50: number; ema200: number; rsi: number;
  macd: { macd: number; signal: number; histogram: number; trend: string };
  bollinger: { upper: number; middle: number; lower: number; bandwidth: number };
  emaAligned: boolean; signal: string; score: number;
}

interface CurrencyData {
  usdtry: { value: number; change: number }; eurtry: { value: number; change: number };
  gbptry: { value: number; change: number }; goldOz: number; gramGold: number; lastUpdated: string;
}

interface IndexData {
  name: string; symbol: string; value: number; previousClose: number;
  change: number; dayHigh: number; dayLow: number;
}

async function f<T>(ep: string): Promise<T | null> {
  try {
    const r = await fetch(`${API}${ep}`);
    if (!r.ok) return null;
    return await r.json();
  } catch { return null; }
}

// ============================================
// useStocks: Hisse listesi + canlı fiyat (tek seferde birleştirilmiş)
// /api/prices/all canlı fiyat + metadata dönüyor. Bunu Stock'a mapleyip module cache'ine yazıyoruz.
// ============================================
export function useStocks() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);

  const load = useCallback(async () => {
    const d = await f<any>('/prices/all');
    if (d && Array.isArray(d.items)) {
      const mapped: Stock[] = d.items.map((it: any) => ({
        symbol: it.symbol,
        name: it.nameTR || it.name || it.symbol,
        sector: it.sector || '',
        price: it.price || 0,
        previousClose: it.previousClose || 0,
        change: it.change || 0,
        changePercent: it.changePercent || 0,
        dayHigh: it.dayHigh || 0,
        dayLow: it.dayLow || 0,
        volume: it.volume || 0,
        high52w: it.high52w || 0,
        low52w: it.low52w || 0,
        marketCapMN: it.marketCapMN || 0,
        marketCapUSD: it.marketCapUSD || 0,
        freeFloatPct: it.freeFloatPct || 0,
        capitalMN: it.capitalMN || 0,
        lastUpdated: it.lastUpdated || d.fetchedAt || '',
      }));
      _setStockCache(mapped); // module-level cache'e yaz (searchStocks buradan okuyor)
      setStocks(mapped);
      setTotal(d.total || mapped.length);
      setFetchedAt(d.fetchedAt || null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    // 60 saniyede bir yenile (backend zaten 60sn cache)
    const i = setInterval(load, 60_000);
    return () => clearInterval(i);
  }, [load]);

  return { stocks, total, loading, fetchedAt, refresh: load };
}

// ============================================
// usePrices: Eski API ile geriye uyumluluk — array dönsün diye
// Yeni backend {items, total, ...} dönüyor ama eski kod PriceData[] bekliyordu.
// ============================================
export function usePrices() {
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const d = await f<PricesResponse | PriceData[]>('/prices/all');
    if (d) {
      // Yeni format (object with items) VEYA eski format (array)
      const items = Array.isArray(d) ? d : (d as PricesResponse).items || [];
      if (items.length > 0) setPrices(items);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    const i = setInterval(refresh, 60_000);
    return () => clearInterval(i);
  }, [refresh]);

  return { prices, loading, refresh };
}

export function usePrice(symbol: string) {
  const [data, setData] = useState<PriceData | null>(null);
  useEffect(() => {
    if (!symbol) return;
    f<PriceData>(`/price/${symbol}`).then(setData);
    const i = setInterval(() => f<PriceData>(`/price/${symbol}`).then(setData), 60_000);
    return () => clearInterval(i);
  }, [symbol]);
  return data;
}

export function useTechnicals(symbol: string) {
  const [data, setData] = useState<TechnicalData | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!symbol) return;
    setLoading(true);
    f<TechnicalData>(`/technicals/${symbol}`).then(d => { setData(d); setLoading(false); });
  }, [symbol]);
  return { data, loading };
}

export function useAllTechnicals() {
  const [data, setData] = useState<TechnicalData[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    f<TechnicalData[]>('/technicals').then(d => { if (d) setData(d); setLoading(false); });
  }, []);
  return { data, loading };
}

export function useCurrency() {
  const [data, setData] = useState<CurrencyData | null>(null);
  useEffect(() => {
    f<CurrencyData>('/currency').then(setData);
    const i = setInterval(() => f<CurrencyData>('/currency').then(setData), 180_000);
    return () => clearInterval(i);
  }, []);
  return data;
}

export function useIndices() {
  const [data, setData] = useState<IndexData[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    f<IndexData[]>('/indices').then(d => { if (d) setData(d); setLoading(false); });
    const i = setInterval(() => f<IndexData[]>('/indices').then(d => { if (d) setData(d); }), 60_000);
    return () => clearInterval(i);
  }, []);
  return { data, loading };
}

export function useKAP() {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    f<any[]>('/kap').then(d => { if (d) setData(d); });
    const i = setInterval(() => f<any[]>('/kap').then(d => { if (d) setData(d); }), 180_000);
    return () => clearInterval(i);
  }, []);
  return data;
}

export type { PriceData, TechnicalData, CurrencyData, IndexData };

// ============================================
// TEDBİRLİ HİSSELER (VBTS)
// ============================================
export interface TedbirliItem {
  symbol: string;
  reason: string;
  since: string | null;
  until: string | null;
  measures: {
    acigaSatis: boolean;
    brutTakas: boolean;
    emirPaketi: boolean;
    tekFiyat: boolean;
  };
  status: 'active' | 'expired';
}

export interface TedbirliResponse {
  source: string;
  sourceUrl: string;
  fetchedAt: string;
  total: number;
  activeCount: number;
  expiredCount: number;
  items: TedbirliItem[];
}

export function useTedbirli() {
  const [data, setData] = useState<TedbirliResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const setMenuCount = useStore(s => s.setMenuCount);

  const load = useCallback(async () => {
    const d = await f<TedbirliResponse>('/tedbirli');
    if (d) {
      setData(d);
      setError(null);
      setMenuCount('tedbirli-hisseler', d.activeCount);
    } else {
      setError('Tedbirli hisse verisi yüklenemedi');
    }
    setLoading(false);
  }, [setMenuCount]);

  useEffect(() => {
    load();
    const i = setInterval(load, 5 * 60 * 1000);
    return () => clearInterval(i);
  }, [load]);

  return { data, loading, error, refresh: load };
}
