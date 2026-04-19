import { useState, useEffect, useCallback } from 'react';

const API = '/api';

interface PriceData {
  symbol: string; name: string; price: number; previousClose: number;
  change: number; changePercent: number; dayHigh: number; dayLow: number;
  volume: number; high52w: number; low52w: number; lastUpdated: string;
}

interface TechnicalData {
  symbol: string; ema20: number; ema50: number; ema200: number; rsi: number;
  macd: { macd: number; signal: number; histogram: number; trend: string };
  bollinger: { upper: number; middle: number; lower: number; bandwidth: number };
  relativeVolume: number; emaAligned: boolean; signal: string; score: number;
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
  try { const r = await fetch(`${API}${ep}`); if (!r.ok) return null; return await r.json(); } catch { return null; }
}

export function usePrices() {
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);
  const refresh = useCallback(async () => {
    const d = await f<PriceData[]>('/prices');
    if (d && d.length > 0) setPrices(d);
    setLoading(false);
  }, []);
  useEffect(() => { refresh(); const i = setInterval(refresh, 60000); return () => clearInterval(i); }, [refresh]);
  return { prices, loading, refresh };
}

export function usePrice(symbol: string) {
  const [data, setData] = useState<PriceData | null>(null);
  useEffect(() => {
    if (!symbol) return;
    f<PriceData>(`/price/${symbol}`).then(setData);
    const i = setInterval(() => f<PriceData>(`/price/${symbol}`).then(setData), 60000);
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
  useEffect(() => { f<TechnicalData[]>('/technicals').then(d => { if (d) setData(d); setLoading(false); }); }, []);
  return { data, loading };
}

export function useCurrency() {
  const [data, setData] = useState<CurrencyData | null>(null);
  useEffect(() => {
    f<CurrencyData>('/currency').then(setData);
    const i = setInterval(() => f<CurrencyData>('/currency').then(setData), 180000);
    return () => clearInterval(i);
  }, []);
  return data;
}

export function useIndices() {
  const [data, setData] = useState<IndexData[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    f<IndexData[]>('/indices').then(d => { if (d) setData(d); setLoading(false); });
    const i = setInterval(() => f<IndexData[]>('/indices').then(d => { if (d) setData(d); }), 60000);
    return () => clearInterval(i);
  }, []);
  return { data, loading };
}

export function useKAP() {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    f<any[]>('/kap').then(d => { if (d) setData(d); });
    const i = setInterval(() => f<any[]>('/kap').then(d => { if (d) setData(d); }), 180000);
    return () => clearInterval(i);
  }, []);
  return data;
}

export type { PriceData, TechnicalData, CurrencyData, IndexData };
