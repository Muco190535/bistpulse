import { useState } from 'react';
import { aiSummaries } from '../../data/aiSummaries';
import { stocks } from '../../data/stocks';
import { useStore } from '../../store/useStore';
import { getConvergence } from '../../data/convergence';
import { ConvergenceBar } from '../../components/Cards/ConvergenceBar';

export const AIPage = () => {
  const { setSelectedStock } = useStore();
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Merhaba! 👋 Ben BIST Pulse AI Analistiyim. Herhangi bir hisse hakkında soru sorabilir, piyasa hakkında görüş alabilirsiniz.\n\nÖrnek sorular:\n• "THYAO ne durumda?"\n• "Bu hafta hangi sektör öne çıkabilir?"\n• "Portföyümdeki en riskli hisse hangisi?"' },
  ]);

  const availableSymbols = Object.keys(aiSummaries);

  const handleSend = () => {
    if (!chatInput.trim()) return;
    const q = chatInput.trim();
    setChatHistory(prev => [...prev, { role: 'user', text: q }]);
    setChatInput('');

    const matchedSymbol = stocks.find(s => q.toUpperCase().includes(s.symbol))?.symbol;

    setTimeout(() => {
      let response = '';
      if (matchedSymbol && aiSummaries[matchedSymbol]) {
        const summary = aiSummaries[matchedSymbol];
        response = `📊 **${matchedSymbol} Analizi:**\n\n${summary.sections.technical}\n\n${summary.sections.institutional}\n\n${summary.sections.overall}`;
      } else if (q.toLowerCase().includes('sektör')) {
        response = '📊 Bu hafta öne çıkan sektörler:\n\n🏦 **Bankacılık** (+%2.85): Yabancı alım devam ediyor, TCMB faiz kararı Perşembe.\n✈️ **Havacılık** (+%2.12): Yaz sezonu beklentisi güçlü, yolcu sayıları artıyor.\n⛏️ **Metal** (+%1.95): Global çelik toparlanması, EREGL bilanço yarın.\n\nDikkat: Kimya sektörü (-%2.45) baskı altında, SASA özelinde risk yüksek.';
      } else if (q.toLowerCase().includes('risk')) {
        response = '⚠️ Portföy Risk Analizi:\n\n🔴 **En riskli pozisyon: TUPRS** — Kısa vadede -%2.4 zararda, petrol fiyatları baskı altında.\n\n🟡 **Dikkat: KOZAL** — RSI 72.4 ile aşırı alım bölgesinde, kâr realizasyonu gelebilir.\n\n🟢 **En güvenli: EREGL** — Konverjans skoru 91/100, 4 katman birden güçlü sinyal veriyor.\n\n📊 Portföy betası: 1.12 (piyasadan biraz daha volatil). Bankacılık ağırlığı %35 ile yüksek — sektör konsantrasyonu riski mevcut.';
      } else if (q.toLowerCase().includes('bugün') || q.toLowerCase().includes('piyasa')) {
        response = '📈 Bugünün Piyasa Özeti:\n\nBIST100 %+1.24 ile pozitif seyrediyor. 334 hisse yükselirken 148 hisse düşüyor — geniş tabanlı ralli.\n\n⚡ Konverjans Radarı\'nda 5 hisse aktif:\n1. EREGL (91/100) — En güçlü sinyal\n2. THYAO (82/100) — Golden Cross aktif\n3. AKBNK (78/100) — Bankacılık momentum\n\n🔴 Dikkat: SASA -%5.74 ile günün en çok düşeni. Teknik görünüm çok zayıf.\n\n📅 Yarın: EREGL bilanço açıklaması — piyasanın odak noktası olacak.';
      } else {
        response = '🤔 Sorunuzu analiz ettim. Daha spesifik bir hisse kodu belirtirseniz detaylı analiz sunabilirim.\n\nŞu hisseler için hazır analizlerim var:\n' + availableSymbols.map(s => `• ${s}`).join('\n') + '\n\nVeya şu konularda sorabilirsiniz:\n• Piyasa genel durumu\n• Sektör analizi\n• Portföy risk değerlendirmesi';
      }
      setChatHistory(prev => [...prev, { role: 'ai', text: response }]);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-brand-purple text-xl">🤖</span>
          <div>
            <h1 className="text-base font-bold text-text-primary">AI Analist</h1>
            <p className="text-[10px] text-text-secondary">Claude AI destekli piyasa analizi</p>
          </div>
        </div>
      </div>

      {/* Hızlı AI Özetler */}
      <div className="px-4 pb-2">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {availableSymbols.map(sym => {
            const conv = getConvergence(sym);
            return (
              <button key={sym} onClick={() => setSelectedStock(sym)}
                className="flex-shrink-0 bg-dark-card rounded-lg px-3 py-2 border border-dark-border card-hover">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono text-text-primary">{sym}</span>
                  {conv && <div className="w-10"><ConvergenceBar score={conv.totalScore} size="sm" showLabel={false} /></div>}
                </div>
                <p className="text-[9px] text-brand-purple mt-0.5">AI Özet ▸</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Alanı */}
      <div className="flex-1 overflow-y-auto px-4 pb-32 space-y-3">
        {chatHistory.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 ${
              msg.role === 'user'
                ? 'bg-brand-teal text-dark-bg'
                : 'bg-dark-card border border-dark-border'
            }`}>
              {msg.role === 'ai' && <span className="text-brand-purple text-sm">🤖</span>}
              <p className={`text-xs leading-relaxed whitespace-pre-line ${msg.role === 'user' ? 'text-dark-bg' : 'text-text-secondary'}`}>
                {msg.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <div className="fixed bottom-14 left-0 right-0 px-4 py-2 bg-dark-bg/95 backdrop-blur-md border-t border-dark-border">
        <div className="flex items-center gap-2">
          <input
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Hisse veya piyasa hakkında sorun..."
            className="flex-1 bg-dark-card rounded-xl px-4 py-2.5 text-sm text-text-primary border border-dark-border outline-none focus:border-brand-purple placeholder:text-text-secondary"
          />
          <button onClick={handleSend}
            className="bg-brand-purple rounded-xl px-4 py-2.5 text-sm font-bold text-white">
            Sor
          </button>
        </div>
      </div>
    </div>
  );
};
