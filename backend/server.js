const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const { scrapeTedbirli } = require('./tedbirli');
const app = express();
app.use(cors());
app.use(express.json());

const cache = {};
function gc(k,a){const i=cache[k];if(!i)return null;if(Date.now()-i.ts>a){delete cache[k];return null;}return i.data;}
function sc(k,d){cache[k]={data:d,ts:Date.now()};}

const UA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';

let ALL_SYMBOLS=[
'THYAO','GARAN','ASELS','EREGL','SISE','TUPRS','KCHOL','SAHOL','AKBNK','YKBNK',
'PGSUS','TAVHL','BIMAS','KOZAL','FROTO','TOASO','TCELL','ENKAI','SASA','DOAS',
'PETKM','ARCLK','VESTL','TKFEN','TTKOM','MGROS','SOKM','HEKTS','KONTR','OYAKC',
'GUBRF','ISCTR','VAKBN','HALKB','TSKB','ALARK','EKGYO','GESAN','AEFES','ULKER',
'CIMSA','BTCIM','AKCNS','ISGYO','MPARK','BRISA','OTKAR','CCOLA','KORDS','TTRAK',
'LOGO','NETAS','DOHOL','AGHOL','MAVI','ALFAS','CWENE','EUPWR','ODAS','ISMEN',
'ANHYT','QUAGR','YEOTK','TURSG','ZOREN','AKSEN','AYGAZ','AYDEM','ENJSA','BIOEN',
'BASGZ','EGEEN','GEDZA','PRKME','TRGYO','HLGYO','RYGYO','AVHOL','GLYHO','CANTE',
'SELEC','TUKAS','ULUUN','MERKO','YATAS','BOBET','PENGD','ATAGY','AHGAZ','AKFGY',
'AKFYE','ANSGR','ARENA','BAGFS','BANVT','BERA','BIGCH','BLCYT','BMSTL','BOSSA',
'BRYAT','BUCIM','BURCE','CELHA','CEMAS','CEMTS','CONSE','DAPGM','DENGE','DERHL',
'DESPC','DEVA','DGATE','DITAS','DNISI','DOBUR','DYOBY','ECILC','EDATA','EDIP',
'EGPRO','EMKEL','EPLAS','ERBOS','ESEN','FADE','FONET','FORTE','FRIGO','GEDIK',
'GENTS','GEREL','GLCVY','GOZDE','GRSEL','GSDHO','GSRAY','GWIND','HATEK','HTTBT',
'HUBVC','HUNER','IDEAS','IHEVA','IHGZT','IHLAS','IMASM','INFO','INTEM','IPEKE',
'ISATR','ISKUR','ITTFH','IZFAS','JANTS','KAPLM','KATMR','KAYSE','KBORU','KCAER',
'KENT','KERVT','KFEIN','KIMMR','KLMSN','KMPUR','KNFRT','KONYA','KOPOL','KRDMD',
'KRPLS','KRSTL','KTLEV','KTSKR','KUTPO','KUYAS','LIDER','LILAK','LKMNH','LUKSK',
'MAALT','MACKO','MAGEN','MAKIM','MANAS','MEGMT','MEKAG','MEPET','MERCN','METRO',
'METUR','MMCAS','MOBTL','MRSHL','MTRKS','MTRYO','NTHOL','NUGYO','OBASE','ORGE',
'OSMEN','OSTIM','OYAYO','OYLUM','OZSUB','PAMEL','PARSN','PEKGY','PENTA','PETUN',
'PINSU','PKART','PKENT','PLTUR','PNSUT','POLHO','PRDGS','PRKAB','PSGYO','RALYH',
'ROYAL','RUBNS','SAFKR','SAMAT','SANEL','SANFM','SARKY','SAYAS','SEGYO','SEKUR',
'SELGD','SILVR','SNGYO','SNICA','SNKRN','SODSN','SRVGY','SUNTK','SUWEN','TATGD',
'TBORG','TEKTU','TERA','TEZOL','TGSAS','TLMAN','TMPOL','TRCAS','TRILC','TSGYO',
'TUCLK','TUREX','UFUK','ULUSE','UMPAS','UNLU','USAK','VAKFN','VAKKO','VERUS',
'VKFYO','YESIL','YUNSA','ZRGYO','ASTOR','KLSER','TMSN','TABGD','RGYAS','KZBGY',
'MIATK','BRLNS','SMRTG','KLRHO','PAPIL','KAREL','INDES','SMART','DGNMO','KRVGD',
'RAYSG','MEGAP','ATATP','AYCES','BAKAB','BARMA','BEYAZ','BFREN','BNTAS','BRMEN',
'BURVA','CASA','CRDFA','DAGHL','DARDL','DERIM','DURDO','ETILR','EUREN','FENER',
'FLAP','GARFA','GLBMD','HKTM','KARSN','KRSAN','MARTI','NUHCM','ORMA','OZBAL',
'OZKGY','PCILT','PNLSN','RODRG','SANKO','SDTTR','SEKFK','SNPAM','SURGY','TNZTP',
'TSPOR','VANGD','VERTU','YGYO','YYLGD','ZEDUR'
];
ALL_SYMBOLS=[...new Set(ALL_SYMBOLS)].sort();

// ============================================
// YAHOO FINANCE
// ============================================
async function yahooQuote(sym) {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${sym}.IS?interval=1m&range=1d&includePrePost=false`;
    const res = await fetch(url, { headers: { 'User-Agent': UA }, timeout: 10000 });
    if (!res.ok) return null;
    const json = await res.json();
    const r = json.chart?.result?.[0];
    if (!r) return null;
    const m = r.meta;
    const price = m.regularMarketPrice || 0;
    const prevClose = m.previousClose || m.chartPreviousClose || price;
    const change = parseFloat((price - prevClose).toFixed(2));
    const changePct = prevClose > 0 ? parseFloat(((change / prevClose) * 100).toFixed(2)) : 0;
    return {
      symbol: sym, name: m.longName || m.shortName || sym,
      price, previousClose: prevClose, change, changePercent: changePct,
      dayHigh: m.regularMarketDayHigh || 0, dayLow: m.regularMarketDayLow || 0,
      volume: m.regularMarketVolume || 0, high52w: m.fiftyTwoWeekHigh || 0,
      low52w: m.fiftyTwoWeekLow || 0, currency: 'TRY', lastUpdated: new Date().toISOString(),
    };
  } catch (e) { return null; }
}

async function yahooBatch(symbols) {
  const results = [];
  for (let i = 0; i < symbols.length; i += 5) {
    const batch = symbols.slice(i, i + 5);
    const batchRes = await Promise.all(batch.map(s => yahooQuote(s)));
    results.push(...batchRes.filter(r => r != null));
    if (i + 5 < symbols.length) await new Promise(r => setTimeout(r, 250));
  }
  return results;
}

// ============================================
// TEKNİK ANALİZ
// ============================================
function calcEMA(d,p){const v=d.filter(x=>x!=null);if(v.length<p)return v;const k=2/(p+1);const r=[v[0]];for(let i=1;i<v.length;i++)r.push(v[i]*k+r[i-1]*(1-k));return r;}
function calcRSI(d,p){p=p||14;const v=d.filter(x=>x!=null);if(v.length<p+1)return 50;let g=0,l=0;for(let i=v.length-p;i<v.length;i++){const df=v[i]-v[i-1];if(df>0)g+=df;else l+=Math.abs(df);}const ag=g/p,al=l/p;if(al===0)return 100;return parseFloat((100-(100/(1+ag/al))).toFixed(1));}
function calcMACD(d){const v=d.filter(x=>x!=null);if(v.length<26)return{macd:0,signal:0,histogram:0,trend:'neutral'};const e12=calcEMA(v,12),e26=calcEMA(v,26);const len=Math.min(e12.length,e26.length);const ml=[];for(let i=0;i<len;i++)ml.push(e12[e12.length-len+i]-e26[e26.length-len+i]);const sl=calcEMA(ml,9);const mv=ml[ml.length-1]||0,sv=sl[sl.length-1]||0;return{macd:parseFloat(mv.toFixed(3)),signal:parseFloat(sv.toFixed(3)),histogram:parseFloat((mv-sv).toFixed(3)),trend:mv>sv?'bullish':'bearish'};}
function calcBollinger(d,p){p=p||20;const v=d.filter(x=>x!=null);if(v.length<p)return{upper:0,middle:0,lower:0,bandwidth:0};const s=v.slice(-p);const mean=s.reduce((a,b)=>a+b,0)/s.length;const std=Math.sqrt(s.reduce((a,b)=>a+Math.pow(b-mean,2),0)/s.length);return{upper:parseFloat((mean+2*std).toFixed(2)),middle:parseFloat(mean.toFixed(2)),lower:parseFloat((mean-2*std).toFixed(2)),bandwidth:std>0?parseFloat(((4*std/mean)*100).toFixed(2)):0};}

async function technicals(symbol) {
  const ck=`tech_${symbol}`;const cc=gc(ck,5*60*1000);if(cc)return cc;
  try {
    const url=`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}.IS?interval=1d&range=6mo`;
    const res=await fetch(url,{headers:{'User-Agent':UA},timeout:10000});
    if(!res.ok)return null;const json=await res.json();const r=json.chart?.result?.[0];if(!r)return null;
    const q=r.indicators?.quote?.[0];const closes=(q?.close||[]).filter(c=>c!=null);
    const vols=(q?.volume||[]).filter(v=>v!=null);if(closes.length<20)return null;
    const e20=calcEMA(closes,20),e50=calcEMA(closes,50),e200=calcEMA(closes,Math.min(200,closes.length));
    const last=closes[closes.length-1];
    const le20=e20[e20.length-1],le50=e50[e50.length-1],le200=e200[e200.length-1];
    const rsiV=calcRSI(closes,14),macdV=calcMACD(closes),bbV=calcBollinger(closes,20);
    const avgV=vols.slice(-20).reduce((a,b)=>a+b,0)/20;
    const relV=avgV>0?parseFloat(((vols[vols.length-1]||0)/avgV).toFixed(2)):1;
    let score=0;if(last>le20)score++;if(last>le50)score++;if(last>le200)score++;
    if(rsiV>40&&rsiV<70)score++;if(macdV.trend==='bullish')score++;if(relV>1.2)score++;
    let signal='neutral';if(score>=5)signal='strong_buy';else if(score>=4)signal='buy';
    else if(score<=1)signal='strong_sell';else if(score<=2)signal='sell';
    const result={symbol,rsi:rsiV,macd:macdV,bollinger:bbV,relativeVolume:relV,
      ema20:parseFloat(le20.toFixed(2)),ema50:parseFloat(le50.toFixed(2)),ema200:parseFloat(le200.toFixed(2)),
      emaAligned:le20>le50&&le50>le200,signal,score};
    sc(ck,result);return result;
  } catch(e){return null;}
}

// ============================================
// DÖVİZ
// ============================================
async function fetchCurrency() {
  const cc=gc('currency',3*60*1000);if(cc)return cc;
  const result={lastUpdated:new Date().toISOString(),goldOz:0,gramGold:0};
  for(const p of [{s:'USDTRY=X',k:'usdtry'},{s:'EURTRY=X',k:'eurtry'},{s:'GBPTRY=X',k:'gbptry'}]){
    try{const res=await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${p.s}?interval=1m&range=1d`,{headers:{'User-Agent':UA},timeout:8000});
    if(!res.ok)continue;const m=(await res.json()).chart?.result?.[0]?.meta;
    if(m){const price=m.regularMarketPrice||0;const prev=m.previousClose||m.chartPreviousClose||price;
    result[p.k]={value:parseFloat(price.toFixed(4)),change:prev>0?parseFloat((((price-prev)/prev)*100).toFixed(2)):0};}}catch(e){}
    await new Promise(r=>setTimeout(r,150));
  }
  try{const gRes=await fetch('https://query1.finance.yahoo.com/v8/finance/chart/GC=F?interval=1m&range=1d',{headers:{'User-Agent':UA},timeout:5000});
  const gm=(await gRes.json()).chart?.result?.[0]?.meta;
  if(gm){result.goldOz=parseFloat((gm.regularMarketPrice||0).toFixed(2));result.gramGold=parseFloat(((result.goldOz*(result.usdtry?.value||44.8))/31.1035).toFixed(2));}}catch(e){}
  if(!result.usdtry)result.usdtry={value:0,change:0};
  if(!result.eurtry)result.eurtry={value:0,change:0};
  if(!result.gbptry)result.gbptry={value:0,change:0};
  sc('currency',result);return result;
}

// ============================================
// ENDEKSLER
// ============================================
async function fetchIndices() {
  const cc=gc('indices',60*1000);if(cc)return cc;
  const syms=[{s:'XU100.IS',n:'BIST 100'},{s:'XU050.IS',n:'BIST 50'},{s:'XU030.IS',n:'BIST 30'},{s:'^GSPC',n:'S&P 500'},{s:'GC=F',n:'Altın (oz)'}];
  const results=[];
  for(const idx of syms){
    try{const res=await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${idx.s}?interval=1m&range=1d`,{headers:{'User-Agent':UA},timeout:8000});
    if(!res.ok)continue;const m=(await res.json()).chart?.result?.[0]?.meta;
    if(m){const price=m.regularMarketPrice||0;const prev=m.previousClose||m.chartPreviousClose||price;
    results.push({name:idx.n,symbol:idx.s,value:price,previousClose:prev,change:prev>0?parseFloat((((price-prev)/prev)*100).toFixed(2)):0,dayHigh:m.regularMarketDayHigh||0,dayLow:m.regularMarketDayLow||0});}}catch(e){}
    await new Promise(r=>setTimeout(r,200));
  }
  if(results.length>0)sc('indices',results);return results;
}

// ============================================
// KAP HABERLERİ — Google News RSS
// ============================================
async function fetchKAP() {
  const cc=gc('kap',5*60*1000);if(cc)return cc;
  try {
    const res=await fetch('https://news.google.com/rss/search?q=KAP+bildirim+borsa&hl=tr&gl=TR&ceid=TR:tr',{headers:{'User-Agent':UA},timeout:12000});
    if(!res.ok)return[];
    const xml=await res.text();
    const items=[];
    const itemRegex=/<item>([\s\S]*?)<\/item>/g;
    let match;
    while((match=itemRegex.exec(xml))!==null&&items.length<25){
      const block=match[1];
      const title=(block.match(/<title>(.*?)<\/title>/)||[])[1]||'';
      const pubDate=(block.match(/<pubDate>(.*?)<\/pubDate>/)||[])[1]||'';
      const source=(block.match(/<source[^>]*>(.*?)<\/source>/)||[])[1]||'';
      const link=(block.match(/<link>(.*?)<\/link>/)||[])[1]||'';
      if(!title)continue;
      let symbol='';
      const bracketMatch=title.match(/\[([A-Z]{2,6})\s*\]/);
      if(bracketMatch){symbol=bracketMatch[1];}
      else{const words=title.split(/[\s-]+/);if(words[0]&&/^[A-Z]{2,6}$/.test(words[0]))symbol=words[0];}
      let time='--:--';
      if(pubDate){try{const d=new Date(pubDate);if(!isNaN(d.getTime()))time=d.toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit',timeZone:'Europe/Istanbul'});}catch(e){}}
      let cleanTitle=title.replace(/\s*-\s*Bloomberght$/i,'').replace(/\s*-\s*TradingView[^]*/i,'').trim();
      cleanTitle=cleanTitle.replace(/\s*-\s*\d{4}-\d{2}-\d{2}\s*tarihli$/i,'');
      cleanTitle=cleanTitle.replace(/^KAP:\s*/i,'').replace(/\[[A-Z]+\s*\]\s*/g,'').replace(/KAMUYU AYDINLATMA PLATFORMU\s*/gi,'').trim();
      if(!cleanTitle)cleanTitle=title.split(' - ')[0].trim();
      items.push({time,symbol,title:cleanTitle,source:source||'KAP',important:/temettü|birleşme|sermaye|kar payı|genel kurul|bedelsiz|özel durum/i.test(title),url:link});
    }
    if(items.length>0)sc('kap',items);
    return items;
  }catch(e){console.error('KAP error:',e.message);return[];}
}

// ============================================
// API ROUTES
// ============================================
app.get('/api/health',(req,res)=>res.json({status:'ok',symbols:ALL_SYMBOLS.length,cache:Object.keys(cache).length,uptime:Math.floor(process.uptime())}));
app.get('/api/symbols',(req,res)=>res.json({total:ALL_SYMBOLS.length,symbols:ALL_SYMBOLS}));
app.get('/api/search',(req,res)=>{const q=(req.query.q||'').toUpperCase();res.json(ALL_SYMBOLS.filter(s=>s.includes(q)).slice(0,20));});

app.get('/api/prices',async(req,res)=>{
  const page=parseInt(req.query.page)||0,limit=parseInt(req.query.limit)||30;
  const ck=`prices_${page}_${limit}`;const cc=gc(ck,60*1000);if(cc)return res.json(cc);
  const data=await yahooBatch(ALL_SYMBOLS.slice(page*limit,page*limit+limit));
  if(data.length>0)sc(ck,data);res.json(data);
});

app.get('/api/prices/all',async(req,res)=>{
  const cc=gc('all_prices',90*1000);if(cc)return res.json(cc);
  const data=await yahooBatch(ALL_SYMBOLS.slice(0,50));
  if(data.length>0)sc('all_prices',data);res.json(data);
});

app.get('/api/price/:symbol',async(req,res)=>{
  const sym=req.params.symbol.toUpperCase();const ck=`price_${sym}`;const cc=gc(ck,45*1000);if(cc)return res.json(cc);
  const data=await yahooQuote(sym);if(data){sc(ck,data);return res.json(data);}
  res.status(404).json({error:'not found'});
});

app.get('/api/technicals/:symbol',async(req,res)=>{const data=await technicals(req.params.symbol.toUpperCase());if(data)return res.json(data);res.status(404).json({error:'no data'});});

app.get('/api/technicals',async(req,res)=>{
  const cc=gc('all_tech',5*60*1000);if(cc)return res.json(cc);
  const results=[];for(const sym of ALL_SYMBOLS.slice(0,20)){const t=await technicals(sym);if(t)results.push(t);await new Promise(r=>setTimeout(r,400));}
  if(results.length>0)sc('all_tech',results);res.json(results);
});

app.get('/api/currency',async(req,res)=>res.json(await fetchCurrency()));
app.get('/api/indices',async(req,res)=>res.json(await fetchIndices()));
app.get('/api/kap',async(req,res)=>res.json(await fetchKAP()));
app.get('/api/tedbirli',async(req,res)=>{const ck='tedbirli';const cc=gc(ck,30*60*1000);if(cc)return res.json(cc);try{const data=await scrapeTedbirli();sc(ck,data);res.json(data);}catch(e){console.error('tedbirli err:',e.message);res.status(502).json({error:'source_unavailable',message:e.message});}});

app.get('/api/historical/:symbol',async(req,res)=>{
  const sym=req.params.symbol.toUpperCase(),range=req.query.range||'6mo';
  const ck=`hist_${sym}_${range}`;const cc=gc(ck,10*60*1000);if(cc)return res.json(cc);
  try{const r=await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${sym}.IS?interval=1d&range=${range}`,{headers:{'User-Agent':UA},timeout:10000});
  const result=(await r.json()).chart?.result?.[0];if(result){sc(ck,result);return res.json(result);}}catch(e){}
  res.status(404).json({error:'no data'});
});

app.listen(5000,'0.0.0.0',()=>console.log(`BIST Pulse API — port 5000 — ${ALL_SYMBOLS.length} hisse`));
