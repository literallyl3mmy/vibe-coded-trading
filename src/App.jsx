import { useState, useMemo } from 'react'
import { strategies, categories, categoryCounts } from './data/strategies'
import { chartPatterns, candlePatterns, indicators, playbook } from './data/patterns'
import { chartPatternCharts, candleCharts, indicatorCharts } from './components/Charts' // ← NEW

// ════════════════════════════════════════
// PAYOFF CHART (SVG)
// ════════════════════════════════════════
function PayoffChart({ fn }) {
  if (!fn) return null
  const W = 240, H = 100, p = { t: 6, r: 2, b: 10, l: 2 }
  const cW = W - p.l - p.r, cH = H - p.t - p.b
  const pts = useMemo(() => {
    const arr = []
    for (let i = 0; i <= 160; i++) {
      const S = 60 + (80 * i / 160)
      arr.push({ x: S, y: fn(S) })
    }
    return arr
  }, [fn])
  const ys = pts.map(q => q.y)
  const yMin = Math.min(...ys, -1), yMax = Math.max(...ys, 1)
  const yR = yMax - yMin || 1, yP = yR * 0.15
  const sx = (x) => p.l + ((x - 60) / 80) * cW
  const sy = (y) => p.t + cH - ((y - (yMin - yP)) / (yR + 2 * yP)) * cH
  const z = sy(0)
  const d = pts.map((q, i) => `${i === 0 ? 'M' : 'L'}${sx(q.x).toFixed(1)},${sy(q.y).toFixed(1)}`).join(' ')
  const a = d + ` L${sx(140).toFixed(1)},${z.toFixed(1)} L${sx(60).toFixed(1)},${z.toFixed(1)} Z`
  const u = Math.random().toString(36).slice(2, 8)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[240px] flex-shrink-0" style={{ height: 'auto' }}>
      <defs>
        <clipPath id={`a${u}`}><rect x={p.l} y={p.t} width={cW} height={Math.max(0, z - p.t)} /></clipPath>
        <clipPath id={`b${u}`}><rect x={p.l} y={z} width={cW} height={Math.max(0, p.t + cH - z)} /></clipPath>
      </defs>
      <line x1={p.l} y1={z} x2={p.l + cW} y2={z} stroke="#334155" strokeWidth=".6" strokeDasharray="3,3" />
      <path d={a} fill="#10b981" fillOpacity=".12" clipPath={`url(#a${u})`} />
      <path d={a} fill="#ef4444" fillOpacity=".1" clipPath={`url(#b${u})`} />
      <path d={d} fill="none" stroke="#60a5fa" strokeWidth="1.8" strokeLinejoin="round" />
      <text x={p.l + 2} y={p.t + 8} fontSize="7" fill="#10b981" fontFamily="system-ui" fontWeight="600">+</text>
      <text x={p.l + 2} y={p.t + cH - 2} fontSize="7" fill="#ef4444" fontFamily="system-ui" fontWeight="600">−</text>
      <text x={p.l + cW} y={z - 2} fontSize="6" fill="#475569" fontFamily="system-ui" textAnchor="end">$0</text>
    </svg>
  )
}

// ════════════════════════════════════════
// GENERIC EXPAND CARD
// ════════════════════════════════════════
function ExpandCard({ header, headerRight, badges, children, borderColor = 'border-slate-700' }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`border ${borderColor} rounded-lg mb-2 bg-slate-800/50 overflow-hidden`}>
      <button onClick={() => setOpen(!open)} className="w-full text-left px-4 py-2.5 flex items-center justify-between hover:bg-slate-700/30 transition-colors">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-slate-100 text-sm">{header}</span>
          {badges}
        </div>
        <div className="flex items-center gap-3">
          {headerRight}
          <svg className={`w-4 h-4 text-slate-500 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      {open && <div className="px-4 pb-4 border-t border-slate-700/50">{children}</div>}
    </div>
  )
}

function Badge({ text, color = 'bg-slate-700 text-slate-300' }) {
  return <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${color}`}>{text}</span>
}

function InfoRow({ label, value, labelColor = 'text-slate-400' }) {
  return <div className="text-xs"><span className={`font-semibold ${labelColor}`}>{label}:</span> <span className="text-slate-300">{value}</span></div>
}

function ExampleBox({ text }) {
  return (
    <div className="mt-2 p-2.5 bg-slate-900/60 rounded-lg border border-blue-500/20">
      <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider">Example Trade</span>
      <p className="text-xs text-blue-200/80 mt-1 leading-relaxed">{text}</p>
    </div>
  )
}

// ════════════════════════════════════════
// CATEGORY COLORS
// ════════════════════════════════════════
const catStyles = {
  Bullish: { border: 'border-emerald-700/40', badge: 'bg-emerald-900/50 text-emerald-400', label: 'text-emerald-400' },
  Bearish: { border: 'border-red-700/40', badge: 'bg-red-900/50 text-red-400', label: 'text-red-400' },
  Neutral: { border: 'border-blue-700/40', badge: 'bg-blue-900/50 text-blue-400', label: 'text-blue-400' },
  Volatility: { border: 'border-purple-700/40', badge: 'bg-purple-900/50 text-purple-400', label: 'text-purple-400' },
  Income: { border: 'border-amber-700/40', badge: 'bg-amber-900/50 text-amber-400', label: 'text-amber-400' },
  Hedging: { border: 'border-sky-700/40', badge: 'bg-sky-900/50 text-sky-400', label: 'text-sky-400' },
  Complex: { border: 'border-slate-600/40', badge: 'bg-slate-700/50 text-slate-300', label: 'text-slate-400' },
}
const diffStyles = {
  Beginner: 'bg-green-900/50 text-green-400',
  Intermediate: 'bg-yellow-900/50 text-yellow-400',
  Advanced: 'bg-red-900/50 text-red-400',
}
const signalStyles = (sig) => {
  if (sig?.includes('Bullish') || sig?.includes('bullish')) return 'bg-emerald-900/50 text-emerald-400 border-emerald-700/40'
  if (sig?.includes('Bearish') || sig?.includes('bearish')) return 'bg-red-900/50 text-red-400 border-red-700/40'
  return 'bg-slate-700/50 text-slate-300 border-slate-600/40'
}

// ════════════════════════════════════════
// MARKET PULSE (AI)
// ════════════════════════════════════════
function MarketPulse() {
  const [vix, setVix] = useState('26')
  const [trend, setTrend] = useState('Choppy/Range-bound')
  const [ivr, setIvr] = useState('High (>50)')
  const [event, setEvent] = useState('Geopolitical Risk')
  const [ticker, setTicker] = useState('')
  const [price, setPrice] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const analyze = async () => {
    setLoading(true); setResult(null)
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514', max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `You are an expert options trading advisor. Suggest 3 specific strategies for these conditions. Be practical with real strikes and numbers where possible.\n\nVIX: ${vix}\nTrend: ${trend}\nIV Rank: ${ivr}\nEvent: ${event}${ticker ? `\nTicker: ${ticker}` : ''}${price ? `\nPrice: $${price}` : ''}\n\nFor each provide: name, specific setup, why it works, key risk.\nRespond JSON only, no backticks:\n{"strategies":[{"name":"...","setup":"...","why":"...","risk":"..."}]}`
          }]
        })
      })
      const data = await res.json()
      const txt = data.content?.find(c => c.type === 'text')?.text || ''
      setResult(JSON.parse(txt.replace(/```json|```/g, '').trim()))
    } catch { setResult({ error: 'Analysis failed. Try again.' }) }
    setLoading(false)
  }

  const Field = ({ label, children }) => (
    <div>
      <label className="text-[10px] font-medium text-slate-500 block mb-1">{label}</label>
      {children}
    </div>
  )
  const inputCls = "w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 focus:border-blue-500 focus:outline-none"

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Field label="VIX Level"><input type="number" value={vix} onChange={e => setVix(e.target.value)} className={inputCls} /></Field>
        <Field label="Market Trend"><select value={trend} onChange={e => setTrend(e.target.value)} className={inputCls}>{['Strong Uptrend', 'Mild Uptrend', 'Choppy/Range-bound', 'Mild Downtrend', 'Strong Downtrend', 'Squeeze/Low Vol'].map(t => <option key={t}>{t}</option>)}</select></Field>
        <Field label="IV Rank"><select value={ivr} onChange={e => setIvr(e.target.value)} className={inputCls}>{['Low (<30)', 'Medium (30-50)', 'High (>50)', 'Very High (>80)'].map(t => <option key={t}>{t}</option>)}</select></Field>
        <Field label="Upcoming Event"><select value={event} onChange={e => setEvent(e.target.value)} className={inputCls}>{['None', 'Earnings (<2 weeks)', 'Fed Decision', 'Geopolitical Risk', 'Product Launch'].map(t => <option key={t}>{t}</option>)}</select></Field>
        <Field label="Ticker (optional)"><input value={ticker} onChange={e => setTicker(e.target.value.toUpperCase())} placeholder="SOFI" className={inputCls} /></Field>
        <Field label="Price (optional)"><input value={price} onChange={e => setPrice(e.target.value)} placeholder="17.50" className={inputCls} /></Field>
      </div>
      <button onClick={analyze} disabled={loading} className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-500 disabled:opacity-50 transition-colors">
        {loading ? 'Analyzing conditions...' : 'Get AI Strategy Suggestions'}
      </button>
      {result && !result.error && (
        <div className="mt-4 space-y-3">{result.strategies?.map((s, i) => (
          <div key={i} className="p-3 bg-slate-800 rounded-lg border border-slate-700">
            <div className="font-semibold text-slate-100 text-sm mb-1">{i + 1}. {s.name}</div>
            <div className="text-xs text-slate-300 mb-1"><span className="font-medium text-slate-400">Setup:</span> {s.setup}</div>
            <div className="text-xs text-slate-400 mb-1">{s.why}</div>
            <div className="text-xs text-amber-400 font-medium">⚠ Risk: {s.risk}</div>
          </div>
        ))}</div>
      )}
      {result?.error && <p className="mt-3 text-sm text-red-400">{result.error}</p>}
    </div>
  )
}

// ════════════════════════════════════════
// CHART RENDER HELPER
// ════════════════════════════════════════
function RenderChart({ svgType, chartMap }) {
  if (!svgType || !chartMap[svgType]) return null
  const C = chartMap[svgType]
  return <C />
}

// ════════════════════════════════════════
// APP
// ════════════════════════════════════════
const tabs = ['Strategies', 'Chart Patterns', 'Candlesticks', 'Indicators', 'Playbook', 'Market Pulse']

export default function App() {
  const [tab, setTab] = useState('Strategies')
  const [cat, setCat] = useState('All')
  const [search, setSearch] = useState('')
  const [diff, setDiff] = useState('All')

  const filtered = strategies.filter(s =>
    (cat === 'All' || s.category === cat) &&
    (diff === 'All' || s.difficulty === diff) &&
    (search === '' || s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.when.toLowerCase().includes(search.toLowerCase()) ||
      s.legs.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white tracking-tight">Options Trading Playbook</h1>
        <p className="text-slate-500 text-xs mt-1">
          {strategies.length} strategies · {chartPatterns.length} chart patterns · {candlePatterns.length} candlesticks · {indicators.length} indicators · {playbook.length} situations · AI market monitor
        </p>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1 border-b border-slate-800">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-xs font-medium whitespace-nowrap transition-colors rounded-t-lg ${tab === t ? 'bg-slate-800 text-white border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-300'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* ── STRATEGIES ── */}
      {tab === 'Strategies' && (
        <div>
          <input type="text" placeholder="Search strategies, legs, or use cases..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 mb-4 focus:border-blue-500 focus:outline-none" />
          <div className="flex flex-wrap gap-1.5 mb-2">
            {['All', ...categories].map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-colors ${cat === c ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                {c}{c !== 'All' && ` ${categoryCounts[c]}`}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5 mb-4">
            {['All', 'Beginner', 'Intermediate', 'Advanced'].map(d => (
              <button key={d} onClick={() => setDiff(d)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-medium ${diff === d ? 'bg-blue-600 text-white' : d === 'All' ? 'bg-slate-800 text-slate-400' : diffStyles[d]}`}>
                {d}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-600 mb-3">{filtered.length} strategies shown</p>
          {filtered.map((s, i) => {
            const cs = catStyles[s.category]
            return (
              <ExpandCard key={i} header={s.name} borderColor={cs.border}
                badges={<><Badge text={s.category} color={cs.badge} /><Badge text={s.difficulty} color={diffStyles[s.difficulty]} /></>}>
                <div className="flex gap-4 mt-3">
                  <PayoffChart fn={s.fn} />
                  <div className="flex-1 space-y-1.5 min-w-0">
                    <InfoRow label="Legs" value={s.legs} labelColor={cs.label} />
                    <InfoRow label="Max Profit / Loss" value={s.maxProfit + ' / ' + s.maxLoss} labelColor={cs.label} />
                    <InfoRow label="Breakeven" value={s.breakeven} labelColor={cs.label} />
                    <InfoRow label="Greeks" value={s.greeks} labelColor={cs.label} />
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  <InfoRow label="Outlook" value={s.outlook} labelColor={cs.label} />
                  <InfoRow label="When to use" value={s.when} labelColor={cs.label} />
                  <p className="text-xs text-slate-500 italic">{s.notes}</p>
                </div>
                {s.example && <ExampleBox text={s.example} />}
              </ExpandCard>
            )
          })}
        </div>
      )}

      {/* ── CHART PATTERNS ── */}
      {tab === 'Chart Patterns' && (
        <div className="space-y-2">
          {chartPatterns.map((p, i) => (
            <ExpandCard key={i} header={p.name}
              badges={<><Badge text={p.signal} color={signalStyles(p.signal)} /><Badge text={p.type} />{p.reliability && <Badge text={p.reliability} color="bg-slate-700/50 text-slate-400" />}</>}>
              <div className="mt-3 space-y-2">
                <RenderChart svgType={p.svgType} chartMap={chartPatternCharts} />
                <p className="text-xs text-slate-300 leading-relaxed">{p.desc}</p>
                <InfoRow label="How to trade" value={p.trade} labelColor="text-slate-400" />
                <InfoRow label="Options play" value={p.options} labelColor="text-blue-400" />
                {p.entry && <ExampleBox text={p.entry} />}
              </div>
            </ExpandCard>
          ))}
        </div>
      )}

      {/* ── CANDLESTICKS ── */}
      {tab === 'Candlesticks' && (
        <div className="space-y-2">
          {candlePatterns.map((p, i) => (
            <ExpandCard key={i} header={p.name}
              badges={<Badge text={p.signal} color={signalStyles(p.signal)} />}>
              <div className="mt-3 space-y-2">
                <RenderChart svgType={p.svgType} chartMap={candleCharts} />
                <p className="text-xs text-slate-300 leading-relaxed">{p.desc}</p>
                <InfoRow label="Appears" value={p.where} labelColor="text-slate-400" />
                <InfoRow label="Action" value={p.action} labelColor="text-blue-400" />
                {p.example && <ExampleBox text={p.example} />}
              </div>
            </ExpandCard>
          ))}
        </div>
      )}

      {/* ── INDICATORS ── */}
      {tab === 'Indicators' && (
        <div className="space-y-2">
          {indicators.map((ind, i) => (
            <ExpandCard key={i} header={ind.name}
              badges={<span className="text-[10px] text-slate-500">{ind.full}</span>}>
              <div className="mt-3 space-y-2">
                <RenderChart svgType={ind.svgType} chartMap={indicatorCharts} />
                <InfoRow label="What it measures" value={ind.what} labelColor="text-slate-400" />
                <InfoRow label="How to read" value={ind.read} labelColor="text-slate-400" />
                <InfoRow label="Options application" value={ind.options} labelColor="text-blue-400" />
                {ind.example && <ExampleBox text={ind.example} />}
              </div>
            </ExpandCard>
          ))}
        </div>
      )}

      {/* ── PLAYBOOK ── */}
      {tab === 'Playbook' && (
        <div className="space-y-2">
          <p className="text-xs text-slate-500 mb-3">Match your market situation to the right strategy. Each includes a real trade example.</p>
          {playbook.map((p, i) => (
            <ExpandCard key={i} header={p.sit}>
              <div className="mt-3 space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {p.strats.map(s => <Badge key={s} text={s} color="bg-blue-900/40 text-blue-400 border border-blue-700/30" />)}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{p.why}</p>
                <ExampleBox text={p.ex} />
              </div>
            </ExpandCard>
          ))}
        </div>
      )}

      {/* ── MARKET PULSE ── */}
      {tab === 'Market Pulse' && (
        <div>
          <p className="text-xs text-slate-500 mb-4">Input current market conditions and get AI-powered strategy suggestions tailored to your situation.</p>
          <MarketPulse />
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-slate-800 text-[10px] text-slate-600 text-center">
        Options Trading Playbook · Built for education · Not financial advice · Always do your own research
      </div>
    </div>
  )
}
