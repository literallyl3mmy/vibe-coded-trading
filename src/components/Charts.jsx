// ════════════════════════════════════════
// SVG CHART PRIMITIVES
// ════════════════════════════════════════
const W = 320, H = 170

function ChartSVG({ children, title }) {
  return (
    <div className="mt-2 mb-1">
      {title && <p className="text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">{title}</p>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[360px] rounded-lg border border-slate-700/50" style={{ height: 'auto', background: '#0f172a' }}>
        {children}
      </svg>
    </div>
  )
}

function PriceLine({ points, color = "#38bdf8", width = 1.8 }) {
  const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ')
  return <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinejoin="round" />
}

function Area({ points, color = "#38bdf8", opacity = 0.08 }) {
  if (points.length < 2) return null
  const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ') + ` L${points[points.length - 1][0]},${H - 10} L${points[0][0]},${H - 10} Z`
  return <path d={d} fill={color} fillOpacity={opacity} />
}

function DashLine({ x1, y1, x2, y2, color = "#94a3b8" }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth=".7" strokeDasharray="4,3" />
}

function Marker({ x, y, label, color = "#22c55e", below = false }) {
  const ty = below ? y + 14 : y - 7
  return (
    <g>
      <circle cx={x} cy={y} r={4} fill={color} stroke="#0f172a" strokeWidth={1.5} />
      <text x={x} y={ty} fontSize="8" fill={color} textAnchor="middle" fontFamily="system-ui" fontWeight="600">{label}</text>
    </g>
  )
}

function Label({ x, y, text, color = "#94a3b8", anchor = "middle", size = "7.5" }) {
  return <text x={x} y={y} fontSize={size} fill={color} textAnchor={anchor} fontFamily="system-ui">{text}</text>
}

function Arrow({ x, y, up = true, color = "#22c55e" }) {
  const d = up
    ? `M${x},${y + 6} L${x},${y - 6} M${x - 3},${y - 3} L${x},${y - 6} L${x + 3},${y - 3}`
    : `M${x},${y - 6} L${x},${y + 6} M${x - 3},${y + 3} L${x},${y + 6} L${x + 3},${y + 3}`
  return <path d={d} stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
}

function Candle({ x, o, h, l, c, w = 7 }) {
  const bull = c < o
  const color = bull ? "#22c55e" : "#ef4444"
  const top = Math.min(o, c), bot = Math.max(o, c)
  return (
    <g>
      <line x1={x} y1={h} x2={x} y2={l} stroke={color} strokeWidth="1" />
      <rect x={x - w / 2} y={top} width={w} height={Math.max(1, bot - top)} fill={color} rx="0.5" />
    </g>
  )
}

function VolumeBar({ x, h, color = "#22c55e", w = 5 }) {
  return <rect x={x - w / 2} y={H - 12 - h} width={w} height={h} fill={color} fillOpacity="0.35" rx="0.5" />
}

function Rect({ x, y, w, h, color = "#fbbf24", opacity = 0.08 }) {
  return <rect x={x} y={y} width={w} height={h} fill={color} fillOpacity={opacity} rx={2} />
}

// ════════════════════════════════════════
// CHART PATTERN SVGs
// ════════════════════════════════════════
function DoubleBottomChart() {
  const pts = [[20, 40], [55, 95], [100, 50], [145, 95], [190, 45], [260, 25]]
  return (
    <ChartSVG title="Double Bottom — W reversal at support">
      <Area points={pts} color="#22c55e" />
      <PriceLine points={pts} />
      <DashLine x1={20} y1={50} x2={260} y2={50} color="#fbbf24" />
      <Label x={272} y={53} text="Neckline" color="#fbbf24" anchor="start" />
      <DashLine x1={30} y1={95} x2={180} y2={95} color="#475569" />
      <Label x={110} y={107} text="Support" color="#475569" />
      <Marker x={55} y={95} label="Bottom 1" color="#38bdf8" below />
      <Marker x={145} y={95} label="Bottom 2" color="#38bdf8" below />
      <Marker x={190} y={45} label="BUY" color="#22c55e" />
      <Arrow x={220} y={35} up color="#22c55e" />
      <Label x={240} y={22} text="Target" color="#22c55e" />
    </ChartSVG>
  )
}

function DoubleTopChart() {
  const pts = [[20, 110], [55, 45], [100, 85], [145, 45], [190, 95], [260, 130]]
  return (
    <ChartSVG title="Double Top — M reversal at resistance">
      <Area points={pts} color="#ef4444" opacity={0.05} />
      <PriceLine points={pts} color="#ef4444" />
      <DashLine x1={30} y1={45} x2={180} y2={45} color="#475569" />
      <Label x={110} y={38} text="Resistance" />
      <DashLine x1={20} y1={85} x2={260} y2={85} color="#fbbf24" />
      <Label x={272} y={88} text="Neckline" color="#fbbf24" anchor="start" />
      <Marker x={55} y={45} label="Top 1" color="#38bdf8" />
      <Marker x={145} y={45} label="Top 2" color="#38bdf8" />
      <Marker x={190} y={95} label="SELL" color="#ef4444" below />
      <Arrow x={230} y={115} up={false} color="#ef4444" />
    </ChartSVG>
  )
}

function HeadShouldersChart() {
  const pts = [[15, 95], [40, 55], [70, 80], [110, 28], [150, 80], [180, 55], [210, 90], [270, 125]]
  return (
    <ChartSVG title="Head & Shoulders — most reliable reversal">
      <PriceLine points={pts} />
      <DashLine x1={55} y1={80} x2={230} y2={80} color="#fbbf24" />
      <Label x={242} y={83} text="Neckline" color="#fbbf24" anchor="start" />
      <Label x={40} y={48} text="L Shoulder" color="#94a3b8" />
      <Label x={110} y={21} text="Head" color="#94a3b8" />
      <Label x={180} y={48} text="R Shoulder" color="#94a3b8" />
      <Marker x={210} y={90} label="SELL" color="#ef4444" below />
      <Arrow x={245} y={110} up={false} color="#ef4444" />
      <Label x={260} y={130} text="Target" color="#ef4444" />
    </ChartSVG>
  )
}

function InverseHSChart() {
  const pts = [[15, 55], [40, 95], [70, 70], [110, 130], [150, 70], [180, 95], [210, 60], [270, 30]]
  return (
    <ChartSVG title="Inverse H&S — bullish reversal at bottom">
      <PriceLine points={pts} color="#22c55e" />
      <DashLine x1={55} y1={70} x2={230} y2={70} color="#fbbf24" />
      <Label x={242} y={73} text="Neckline" color="#fbbf24" anchor="start" />
      <Label x={40} y={105} text="L Shoulder" color="#94a3b8" />
      <Label x={110} y={140} text="Head" color="#94a3b8" />
      <Label x={180} y={105} text="R Shoulder" color="#94a3b8" />
      <Marker x={210} y={60} label="BUY" color="#22c55e" />
      <Arrow x={245} y={40} up color="#22c55e" />
    </ChartSVG>
  )
}

function BullFlagChart() {
  const pole = [[20, 130], [60, 40]]
  const flag = [[60, 40], [80, 58], [100, 50], [120, 64], [135, 56]]
  const breakout = [[135, 56], [170, 38], [210, 20]]
  return (
    <ChartSVG title="Bull Flag — continuation after sharp rally">
      <PriceLine points={pole} color="#22c55e" width={2.5} />
      <PriceLine points={flag} color="#38bdf8" />
      <PriceLine points={breakout} color="#22c55e" width={2} />
      <DashLine x1={55} y1={40} x2={210} y2={40} color="#fbbf24" />
      <Label x={30} y={85} text="Pole" color="#22c55e" />
      <Label x={100} y={74} text="Flag" color="#38bdf8" />
      <Marker x={135} y={56} label="BUY" color="#22c55e" />
      <Marker x={210} y={20} label="Target" color="#22c55e" />
      <VolumeBar x={30} h={25} color="#22c55e" />
      <VolumeBar x={40} h={32} color="#22c55e" />
      <VolumeBar x={50} h={20} color="#22c55e" />
      <VolumeBar x={80} h={8} color="#475569" />
      <VolumeBar x={100} h={6} color="#475569" />
      <VolumeBar x={120} h={7} color="#475569" />
      <VolumeBar x={145} h={28} color="#22c55e" />
      <VolumeBar x={160} h={22} color="#22c55e" />
      <Label x={100} y={H - 2} text="Low vol flag → high vol breakout" color="#475569" />
    </ChartSVG>
  )
}

function BearFlagChart() {
  const pole = [[20, 30], [60, 120]]
  const flag = [[60, 120], [80, 105], [100, 112], [120, 98], [135, 106]]
  const breakout = [[135, 106], [170, 125], [210, 145]]
  return (
    <ChartSVG title="Bear Flag — continuation after sharp drop">
      <PriceLine points={pole} color="#ef4444" width={2.5} />
      <PriceLine points={flag} color="#38bdf8" />
      <PriceLine points={breakout} color="#ef4444" width={2} />
      <DashLine x1={55} y1={120} x2={210} y2={120} color="#fbbf24" />
      <Label x={30} y={75} text="Pole" color="#ef4444" />
      <Label x={100} y={90} text="Flag" color="#38bdf8" />
      <Marker x={135} y={106} label="SELL" color="#ef4444" />
      <Marker x={210} y={145} label="Target" color="#ef4444" below />
    </ChartSVG>
  )
}

function AscTriangleChart() {
  const pts = [[20, 115], [50, 50], [85, 105], [120, 50], [155, 92], [195, 50], [225, 55]]
  return (
    <ChartSVG title="Ascending Triangle — flat top, rising lows">
      <PriceLine points={pts} />
      <DashLine x1={40} y1={50} x2={240} y2={50} color="#fbbf24" />
      <Label x={252} y={53} text="Resistance" color="#fbbf24" anchor="start" />
      <PriceLine points={[[20, 118], [195, 55]]} color="#22c55e" width={1} />
      <Label x={100} y={100} text="Rising support" color="#22c55e" />
      <PriceLine points={[[225, 55], [275, 25]]} color="#22c55e" width={2} />
      <Marker x={225} y={50} label="BUY" color="#22c55e" />
      <Marker x={275} y={25} label="Target" color="#22c55e" />
    </ChartSVG>
  )
}

function DescTriangleChart() {
  const pts = [[20, 35], [50, 100], [85, 45], [120, 100], [155, 58], [195, 100], [225, 95]]
  return (
    <ChartSVG title="Descending Triangle — flat bottom, lower highs">
      <PriceLine points={pts} color="#ef4444" />
      <DashLine x1={40} y1={100} x2={240} y2={100} color="#fbbf24" />
      <Label x={252} y={103} text="Support" color="#fbbf24" anchor="start" />
      <PriceLine points={[[20, 32], [195, 95]]} color="#ef4444" width={1} />
      <Label x={100} y={52} text="Falling resistance" color="#ef4444" />
      <PriceLine points={[[225, 100], [275, 135]]} color="#ef4444" width={2} />
      <Marker x={225} y={100} label="SELL" color="#ef4444" below />
      <Marker x={275} y={135} label="Target" color="#ef4444" below />
    </ChartSVG>
  )
}

function SymTriangleChart() {
  const pts = [[20, 30], [55, 110], [90, 50], [125, 95], [160, 65], [190, 82], [210, 72]]
  return (
    <ChartSVG title="Symmetrical Triangle — indecision, breaks either way">
      <PriceLine points={pts} color="#a78bfa" />
      <PriceLine points={[[20, 28], [210, 68]]} color="#ef4444" width={0.8} />
      <PriceLine points={[[20, 112], [210, 84]]} color="#22c55e" width={0.8} />
      <Label x={110} y={45} text="Lower highs" color="#ef4444" />
      <Label x={110} y={105} text="Higher lows" color="#22c55e" />
      <PriceLine points={[[210, 72], [260, 40]]} color="#22c55e" width={1.5} />
      <PriceLine points={[[210, 72], [260, 110]]} color="#ef4444" width={1.5} />
      <Label x={255} y={35} text="?" color="#22c55e" />
      <Label x={255} y={118} text="?" color="#ef4444" />
      <Label x={160} y={H - 5} text="Buy straddle before breakout" color="#a78bfa" />
    </ChartSVG>
  )
}

function CupHandleChart() {
  const cup = []
  for (let i = 0; i <= 20; i++) { const t = i / 20; const x = 20 + t * 160; const y = 40 + Math.sin(t * Math.PI) * 70; cup.push([x, y]) }
  const handle = [[180, 40], [198, 56], [212, 48], [222, 54]]
  const breakout = [[222, 54], [255, 38], [285, 18]]
  return (
    <ChartSVG title="Cup & Handle — rounded recovery + pullback">
      <PriceLine points={cup} />
      <PriceLine points={handle} color="#38bdf8" />
      <PriceLine points={breakout} color="#22c55e" width={2} />
      <DashLine x1={15} y1={40} x2={260} y2={40} color="#fbbf24" />
      <Label x={100} y={33} text="Rim level" color="#fbbf24" />
      <Label x={100} y={80} text="Cup" color="#38bdf8" />
      <Label x={205} y={64} text="Handle" color="#38bdf8" />
      <Marker x={222} y={40} label="BUY" color="#22c55e" />
      <Marker x={285} y={18} label="Target" color="#22c55e" />
    </ChartSVG>
  )
}

function RisingWedgeChart() {
  const pts = [[20, 120], [55, 80], [90, 105], [125, 72], [160, 92], [200, 65], [230, 82]]
  return (
    <ChartSVG title="Rising Wedge — bearish, momentum fading">
      <PriceLine points={pts} color="#ef4444" />
      <PriceLine points={[[20, 122], [230, 84]]} color="#94a3b8" width={.7} />
      <PriceLine points={[[20, 82], [230, 62]]} color="#94a3b8" width={.7} />
      <Label x={130} y={55} text="Converging" color="#94a3b8" />
      <PriceLine points={[[230, 82], [280, 125]]} color="#ef4444" width={2} />
      <Marker x={230} y={82} label="SELL" color="#ef4444" below />
      <Marker x={280} y={125} label="Target" color="#ef4444" below />
    </ChartSVG>
  )
}

function FallingWedgeChart() {
  const pts = [[20, 30], [55, 72], [90, 48], [125, 82], [160, 62], [200, 92], [230, 75]]
  return (
    <ChartSVG title="Falling Wedge — bullish, selling pressure fading">
      <PriceLine points={pts} color="#22c55e" />
      <PriceLine points={[[20, 28], [230, 73]]} color="#94a3b8" width={.7} />
      <PriceLine points={[[20, 74], [230, 94]]} color="#94a3b8" width={.7} />
      <Label x={130} y={100} text="Converging" color="#94a3b8" />
      <PriceLine points={[[230, 75], [280, 35]]} color="#22c55e" width={2} />
      <Marker x={230} y={75} label="BUY" color="#22c55e" />
      <Marker x={280} y={35} label="Target" color="#22c55e" />
    </ChartSVG>
  )
}

function AscChannelChart() {
  const pts = [[20, 115], [50, 75], [80, 105], [110, 65], [140, 95], [170, 55], [200, 85], [230, 45], [260, 75], [290, 32]]
  return (
    <ChartSVG title="Ascending Channel — sell puts at support, calls at resistance">
      <PriceLine points={pts} color="#38bdf8" />
      <PriceLine points={[[20, 113], [290, 30]]} color="#22c55e" width={.8} />
      <PriceLine points={[[20, 77], [290, -5]]} color="#22c55e" width={.8} />
      <Label x={160} y={110} text="Lower channel = sell puts" color="#22c55e" />
      <Label x={160} y={38} text="Upper channel = sell calls" color="#ef4444" />
      <Marker x={80} y={105} label="CSP" color="#22c55e" below />
      <Marker x={140} y={95} label="CSP" color="#22c55e" below />
      <Marker x={110} y={65} label="CC" color="#ef4444" />
      <Marker x={170} y={55} label="CC" color="#ef4444" />
    </ChartSVG>
  )
}

function DescChannelChart() {
  const pts = [[20, 35], [50, 75], [80, 45], [110, 85], [140, 55], [170, 95], [200, 65], [230, 105], [260, 75]]
  return (
    <ChartSVG title="Descending Channel — sell calls at resistance">
      <PriceLine points={pts} color="#ef4444" />
      <PriceLine points={[[20, 33], [260, 73]]} color="#ef4444" width={.8} />
      <PriceLine points={[[20, 77], [260, 107]]} color="#ef4444" width={.8} />
      <Marker x={80} y={45} label="Sell calls" color="#ef4444" />
      <Marker x={140} y={55} label="Sell calls" color="#ef4444" />
      <Label x={160} y={120} text="Short the rallies to upper channel" color="#ef4444" />
    </ChartSVG>
  )
}

function RoundingBottomChart() {
  const pts = []
  for (let i = 0; i <= 30; i++) { const t = i / 30; const x = 20 + t * 260; const y = 30 + Math.sin(t * Math.PI) * 80; pts.push([x, y]) }
  return (
    <ChartSVG title="Rounding Bottom — gradual sentiment shift">
      <Area points={pts} color="#22c55e" opacity={0.05} />
      <PriceLine points={pts} color="#22c55e" />
      <Label x={150} y={80} text="Saucer" color="#38bdf8" />
      <DashLine x1={15} y1={30} x2={290} y2={30} color="#fbbf24" />
      <Label x={150} y={23} text="Prior high = target" color="#fbbf24" />
      <Marker x={220} y={60} label="BUY on volume" color="#22c55e" />
      <Label x={150} y={H - 5} text="LEAPS or PMCC — needs time to develop" color="#94a3b8" />
    </ChartSVG>
  )
}

// ════════════════════════════════════════
// CANDLESTICK PATTERN SVGs
// ════════════════════════════════════════
function HammerCandle() {
  return (
    <ChartSVG title="Hammer at support — buy above high on confirmation">
      <Candle x={40} o={55} h={48} l={60} c={65} />
      <Candle x={58} o={65} h={58} l={70} c={73} />
      <Candle x={76} o={73} h={66} l={78} c={80} />
      <Candle x={94} o={80} h={74} l={85} c={88} />
      <Candle x={112} o={88} h={82} l={92} c={95} />
      {/* Hammer */}
      <Candle x={140} o={98} h={90} l={130} c={92} />
      <Label x={140} y={140} text="Hammer" color="#fbbf24" />
      <DashLine x1={25} y1={95} x2={210} y2={95} color="#475569" />
      <Label x={222} y={98} text="Support" color="#475569" anchor="start" />
      {/* Confirmation */}
      <Candle x={168} o={90} h={76} l={92} c={78} />
      <Marker x={168} y={72} label="BUY" color="#22c55e" />
      <DashLine x1={135} y1={130} x2={210} y2={130} color="#ef4444" />
      <Label x={222} y={133} text="Stop" color="#ef4444" anchor="start" />
    </ChartSVG>
  )
}

function InvertedHammerCandle() {
  return (
    <ChartSVG title="Inverted Hammer — needs next-day confirmation">
      <Candle x={40} o={50} h={45} l={55} c={60} />
      <Candle x={58} o={60} h={55} l={65} c={70} />
      <Candle x={76} o={70} h={64} l={74} c={78} />
      <Candle x={94} o={78} h={73} l={82} c={85} />
      {/* Inverted hammer */}
      <Candle x={125} o={88} h={62} l={92} c={90} />
      <Label x={125} y={100} text="Inv. Hammer" color="#fbbf24" />
      {/* Confirmation */}
      <Candle x={155} o={86} h={74} l={88} c={76} />
      <Marker x={155} y={70} label="BUY if green" color="#22c55e" />
    </ChartSVG>
  )
}

function ShootingStarCandle() {
  return (
    <ChartSVG title="Shooting Star — failed rally at top">
      <Candle x={40} o={115} h={100} l={118} c={103} />
      <Candle x={58} o={103} h={88} l={106} c={90} />
      <Candle x={76} o={90} h={74} l={93} c={77} />
      <Candle x={94} o={78} h={62} l={80} c={65} />
      {/* Shooting star */}
      <Candle x={125} o={60} h={22} l={65} c={62} />
      <Label x={125} y={75} text="Star" color="#fbbf24" />
      <Arrow x={143} y={22} up color="#94a3b8" />
      <Label x={160} y={20} text="Rejected" color="#94a3b8" anchor="start" />
      <Candle x={155} o={63} h={60} l={78} c={75} />
      <Marker x={155} y={82} label="SELL" color="#ef4444" below />
      <DashLine x1={120} y1={65} x2={200} y2={65} color="#22c55e" />
      <Label x={212} y={68} text="Stop above" color="#22c55e" anchor="start" />
    </ChartSVG>
  )
}

function HangingManCandle() {
  return (
    <ChartSVG title="Hanging Man — same shape as hammer but at top">
      <Candle x={40} o={100} h={90} l={103} c={93} />
      <Candle x={58} o={93} h={82} l={96} c={85} />
      <Candle x={76} o={86} h={74} l={88} c={77} />
      <Candle x={94} o={78} h={65} l={80} c={68} />
      {/* Hanging man */}
      <Candle x={125} o={65} h={58} l={100} c={60} />
      <Label x={125} y={110} text="Hanging Man" color="#fbbf24" />
      <Candle x={155} o={62} h={60} l={75} c={72} />
      <Marker x={155} y={78} label="SELL if red" color="#ef4444" below />
    </ChartSVG>
  )
}

function DojiCandle() {
  return (
    <ChartSVG title="Doji at top — indecision, wait for confirmation">
      <Candle x={40} o={105} h={90} l={108} c={93} />
      <Candle x={58} o={93} h={78} l={96} c={80} />
      <Candle x={76} o={82} h={65} l={84} c={68} />
      <Candle x={94} o={69} h={52} l={72} c={55} />
      <Candle x={112} o={57} h={42} l={60} c={45} />
      {/* Doji */}
      <line x1={140} y1={25} x2={140} y2={58} stroke="#fbbf24" strokeWidth="1" />
      <rect x={136} y={40} width={8} height={2} fill="#fbbf24" />
      <Label x={140} y={68} text="Doji" color="#fbbf24" />
      <Label x={140} y={18} text="Indecision!" color="#fbbf24" />
      <Candle x={168} o={44} h={40} l={58} c={55} />
      <Marker x={168} y={62} label="SELL if red" color="#ef4444" below />
      <Label x={200} y={50} text="Wait for" color="#94a3b8" anchor="start" />
      <Label x={200} y={60} text="confirmation" color="#94a3b8" anchor="start" />
    </ChartSVG>
  )
}

function BullEngulfCandle() {
  return (
    <ChartSVG title="Bullish Engulfing — strong reversal signal">
      <Candle x={35} o={48} h={42} l={52} c={58} />
      <Candle x={53} o={58} h={52} l={63} c={68} />
      <Candle x={71} o={68} h={60} l={72} c={76} />
      <Candle x={89} o={76} h={70} l={82} c={88} />
      {/* Small red */}
      <Candle x={115} o={85} h={80} l={95} c={92} />
      {/* Big green engulfing */}
      <Candle x={140} o={95} h={72} l={98} c={75} w={12} />
      <Label x={140} y={105} text="Engulfs" color="#22c55e" />
      <rect x={108} y={70} width={48} height={32} fill="none" stroke="#fbbf24" strokeWidth=".8" strokeDasharray="3,2" rx="2" />
      <Marker x={160} y={68} label="BUY" color="#22c55e" />
      <Candle x={175} o={76} h={62} l={78} c={65} />
      <Candle x={193} o={66} h={52} l={68} c={55} />
      <DashLine x1={110} y1={98} x2={210} y2={98} color="#ef4444" />
      <Label x={222} y={101} text="Stop below" color="#ef4444" anchor="start" />
    </ChartSVG>
  )
}

function BearEngulfCandle() {
  return (
    <ChartSVG title="Bearish Engulfing — sellers overwhelm at top">
      <Candle x={35} o={105} h={95} l={108} c={98} />
      <Candle x={53} o={98} h={88} l={100} c={90} />
      <Candle x={71} o={92} h={80} l={94} c={82} />
      <Candle x={89} o={83} h={72} l={85} c={75} />
      {/* Small green */}
      <Candle x={115} o={78} h={70} l={80} c={72} />
      {/* Big red engulfing */}
      <Candle x={140} o={70} h={68} l={88} c={85} w={12} />
      <Label x={140} y={58} text="Engulfs" color="#ef4444" />
      <rect x={108} y={66} width={48} height={26} fill="none" stroke="#fbbf24" strokeWidth=".8" strokeDasharray="3,2" rx="2" />
      <Marker x={160} y={92} label="SELL" color="#ef4444" below />
      <DashLine x1={110} y1={68} x2={210} y2={68} color="#22c55e" />
      <Label x={222} y={71} text="Stop above" color="#22c55e" anchor="start" />
    </ChartSVG>
  )
}

function MorningStarCandle() {
  return (
    <ChartSVG title="Morning Star — three-candle bullish reversal">
      <Candle x={45} o={42} h={36} l={52} c={68} w={10} />
      <Candle x={70} o={68} h={62} l={78} c={82} w={10} />
      {/* Large red */}
      <Candle x={100} o={78} h={72} l={105} c={102} w={12} />
      <Label x={100} y={60} text="1. Red" color="#ef4444" />
      {/* Small star */}
      <Candle x={130} o={104} h={98} l={112} c={106} w={6} />
      <Label x={130} y={120} text="2. Star" color="#fbbf24" />
      {/* Large green */}
      <Candle x={160} o={104} h={74} l={107} c={77} w={12} />
      <Label x={160} y={60} text="3. Green" color="#22c55e" />
      <Marker x={178} y={72} label="BUY" color="#22c55e" />
      <DashLine x1={125} y1={112} x2={210} y2={112} color="#ef4444" />
      <Label x={222} y={115} text="Stop" color="#ef4444" anchor="start" />
    </ChartSVG>
  )
}

function EveningStarCandle() {
  return (
    <ChartSVG title="Evening Star — three-candle bearish reversal">
      <Candle x={45} o={110} h={105} l={92} c={85} w={10} />
      <Candle x={70} o={85} h={78} l={68} c={65} w={10} />
      {/* Large green */}
      <Candle x={100} o={70} h={42} l={73} c={45} w={12} />
      <Label x={100} y={105} text="1. Green" color="#22c55e" />
      {/* Star */}
      <Candle x={130} o={43} h={35} l={48} c={40} w={6} />
      <Label x={130} y={28} text="2. Star" color="#fbbf24" />
      {/* Large red */}
      <Candle x={160} o={42} h={40} l={75} c={72} w={12} />
      <Label x={160} y={105} text="3. Red" color="#ef4444" />
      <Marker x={178} y={78} label="SELL" color="#ef4444" below />
    </ChartSVG>
  )
}

function ThreeSoldiersCandle() {
  return (
    <ChartSVG title="Three White Soldiers — strong buying conviction">
      <Candle x={30} o={80} h={75} l={85} c={92} />
      <Candle x={48} o={92} h={88} l={95} c={98} />
      <Candle x={66} o={100} h={96} l={105} c={110} />
      {/* Three soldiers */}
      <Candle x={100} o={108} h={80} l={110} c={82} w={10} />
      <Candle x={125} o={80} h={55} l={82} c={57} w={10} />
      <Candle x={150} o={55} h={30} l={57} c={32} w={10} />
      <Label x={100} y={120} text="1" color="#22c55e" />
      <Label x={125} y={120} text="2" color="#22c55e" />
      <Label x={150} y={120} text="3" color="#22c55e" />
      <Marker x={170} y={28} label="BUY trend" color="#22c55e" />
      <Label x={200} y={50} text="Strong momentum" color="#22c55e" anchor="start" />
      <Label x={200} y={60} text="Trail stop below" color="#94a3b8" anchor="start" />
      <Label x={200} y={70} text="candle 1 low" color="#94a3b8" anchor="start" />
    </ChartSVG>
  )
}

function ThreeCrowsCandle() {
  return (
    <ChartSVG title="Three Black Crows — relentless selling">
      <Candle x={30} o={90} h={82} l={93} c={85} />
      <Candle x={48} o={85} h={78} l={88} c={80} />
      <Candle x={66} o={80} h={72} l={83} c={75} />
      {/* Three crows */}
      <Candle x={100} o={72} h={70} l={95} c={92} w={10} />
      <Candle x={125} o={94} h={92} l={115} c={112} w={10} />
      <Candle x={150} o={114} h={112} l={138} c={135} w={10} />
      <Label x={100} y={58} text="1" color="#ef4444" />
      <Label x={125} y={58} text="2" color="#ef4444" />
      <Label x={150} y={58} text="3" color="#ef4444" />
      <Marker x={170} y={140} label="SELL" color="#ef4444" below />
    </ChartSVG>
  )
}

function MarubozuCandle() {
  return (
    <ChartSVG title="Marubozu — pure directional conviction, no wicks">
      <Label x={80} y={25} text="Green Marubozu" color="#22c55e" />
      <Label x={80} y={36} text="Open = Low, Close = High" color="#94a3b8" />
      <rect x={65} y={45} width={30} height={70} fill="#22c55e" rx={1} />
      <Label x={55} y={50} text="Close" color="#22c55e" anchor="end" />
      <Label x={55} y={118} text="Open" color="#22c55e" anchor="end" />
      <Label x={80} y={128} text="BUY signal" color="#22c55e" />
      <Label x={220} y={25} text="Red Marubozu" color="#ef4444" />
      <Label x={220} y={36} text="Open = High, Close = Low" color="#94a3b8" />
      <rect x={205} y={45} width={30} height={70} fill="#ef4444" rx={1} />
      <Label x={195} y={50} text="Open" color="#ef4444" anchor="end" />
      <Label x={195} y={118} text="Close" color="#ef4444" anchor="end" />
      <Label x={220} y={128} text="SELL signal" color="#ef4444" />
    </ChartSVG>
  )
}

// ════════════════════════════════════════
// INDICATOR SVGs
// ════════════════════════════════════════
function RSIIndicator() {
  return (
    <ChartSVG title="RSI — oversold/overbought zones">
      <PriceLine points={[[20, 35], [60, 45], [100, 55], [130, 70], [160, 85], [190, 75], [220, 60], [260, 45], [290, 35]]} color="#38bdf8" />
      <Label x={155} y={15} text="Price" color="#38bdf8" />
      <Rect x={20} y={105} w={275} h={50} color="#1e293b" opacity={1} />
      <DashLine x1={20} y1={112} x2={295} y2={112} color="#ef4444" />
      <Label x={300} y={115} text="70" color="#ef4444" anchor="start" />
      <DashLine x1={20} y1={142} x2={295} y2={142} color="#22c55e" />
      <Label x={300} y={145} text="30" color="#22c55e" anchor="start" />
      <PriceLine points={[[20, 128], [60, 130], [100, 135], [130, 140], [160, 148], [190, 143], [220, 132], [260, 122], [290, 115]]} color="#c084fc" width={1.5} />
      <Label x={155} y={102} text="RSI" color="#c084fc" />
      <Marker x={160} y={148} label="RSI<30 → Sell puts" color="#22c55e" below />
      <Marker x={290} y={115} label="RSI>70 → Sell calls" color="#ef4444" />
    </ChartSVG>
  )
}

function MACDIndicator() {
  return (
    <ChartSVG title="MACD — crossover signals">
      <PriceLine points={[[20, 55], [60, 48], [100, 52], [130, 38], [160, 32], [200, 48], [240, 58], [280, 68]]} color="#38bdf8" />
      <Label x={155} y={20} text="Price" color="#38bdf8" />
      <Rect x={20} y={88} w={270} h={65} color="#1e293b" opacity={1} />
      <DashLine x1={20} y1={120} x2={295} y2={120} color="#334155" />
      <Label x={300} y={123} text="0" color="#475569" anchor="start" />
      <PriceLine points={[[20, 115], [60, 112], [100, 118], [130, 126], [160, 132], [200, 126], [240, 118], [280, 112]]} color="#22c55e" width={1.2} />
      <PriceLine points={[[20, 118], [60, 115], [100, 116], [130, 121], [160, 128], [200, 127], [240, 121], [280, 115]]} color="#ef4444" width={1.2} />
      <Label x={50} y={86} text="MACD" color="#22c55e" />
      <Label x={100} y={86} text="Signal" color="#ef4444" />
      <Marker x={160} y={132} label="Bearish cross" color="#ef4444" below />
      <Marker x={200} y={126} label="Bullish cross" color="#22c55e" />
    </ChartSVG>
  )
}

function BollingerIndicator() {
  const mid = [[20, 70], [60, 68], [100, 72], [140, 75], [170, 73], [200, 78], [240, 72], [280, 68]]
  const upper = mid.map(([x, y]) => [x, y - 28])
  const lower = mid.map(([x, y]) => [x, y + 28])
  const price = [[20, 65], [60, 52], [100, 82], [130, 98], [145, 100], [165, 70], [200, 48], [225, 42], [255, 58], [280, 70]]
  return (
    <ChartSVG title="Bollinger Bands — sell premium at extremes">
      <Area points={[...upper, ...[...lower].reverse()]} color="#475569" opacity={0.12} />
      <PriceLine points={upper} color="#64748b" width={.7} />
      <PriceLine points={lower} color="#64748b" width={.7} />
      <PriceLine points={mid} color="#64748b" width={.5} />
      <PriceLine points={price} color="#38bdf8" width={1.8} />
      <Marker x={145} y={100} label="Sell calls" color="#ef4444" below />
      <Marker x={225} y={42} label="Sell puts" color="#22c55e" />
      <Label x={285} y={38} text="Upper BB" color="#64748b" anchor="start" />
      <Label x={285} y={98} text="Lower BB" color="#64748b" anchor="start" />
    </ChartSVG>
  )
}

function MovingAvgIndicator() {
  const price = [[20, 60], [50, 55], [80, 48], [110, 52], [140, 45], [170, 50], [200, 42], [230, 38], [260, 35], [290, 30]]
  const ma50 = [[20, 58], [50, 56], [80, 53], [110, 52], [140, 50], [170, 49], [200, 47], [230, 44], [260, 40], [290, 36]]
  const ma200 = [[20, 55], [50, 55], [80, 55], [110, 54], [140, 54], [170, 53], [200, 52], [230, 50], [260, 48], [290, 46]]
  return (
    <ChartSVG title="Moving Averages — dynamic support/resistance">
      <PriceLine points={price} color="#38bdf8" width={1.5} />
      <PriceLine points={ma50} color="#fbbf24" width={1.2} />
      <PriceLine points={ma200} color="#ef4444" width={1.2} />
      <Label x={295} y={34} text="Price" color="#38bdf8" anchor="start" />
      <Label x={295} y={40} text="50 MA" color="#fbbf24" anchor="start" />
      <Label x={295} y={50} text="200 MA" color="#ef4444" anchor="start" />
      <Marker x={200} y={52} label="200MA = sell puts below" color="#22c55e" below />
      <Label x={155} y={H - 5} text="Golden Cross = 50 crosses above 200 = bullish" color="#fbbf24" />
    </ChartSVG>
  )
}

function VolumeIndicator() {
  return (
    <ChartSVG title="Volume — confirms or denies price moves">
      <PriceLine points={[[20, 90], [50, 85], [80, 80], [110, 75], [140, 65], [160, 55], [180, 52], [200, 48], [230, 50], [260, 55]]} color="#38bdf8" />
      <VolumeBar x={50} h={12} color="#22c55e" w={12} />
      <VolumeBar x={80} h={10} color="#22c55e" w={12} />
      <VolumeBar x={110} h={15} color="#22c55e" w={12} />
      <VolumeBar x={140} h={35} color="#22c55e" w={12} />
      <VolumeBar x={160} h={42} color="#22c55e" w={12} />
      <VolumeBar x={180} h={30} color="#22c55e" w={12} />
      <VolumeBar x={200} h={8} color="#475569" w={12} />
      <VolumeBar x={230} h={6} color="#475569" w={12} />
      <Marker x={160} y={50} label="Breakout + volume = real" color="#22c55e" />
      <Label x={230} y={100} text="Low vol drift" color="#475569" />
      <Label x={230} y={110} text="= sell premium" color="#475569" />
    </ChartSVG>
  )
}

function VIXIndicator() {
  return (
    <ChartSVG title="VIX levels — premium selling zones">
      <Rect x={20} y={8} w={275} h={28} color="#ef4444" />
      <Label x={157} y={26} text="VIX >30: Panic — max premium, sell aggressively" color="#ef4444" />
      <Rect x={20} y={40} w={275} h={28} color="#fbbf24" />
      <Label x={157} y={58} text="VIX 20-30: Elevated — iron condors & credit spreads" color="#fbbf24" />
      <Rect x={20} y={72} w={275} h={28} color="#22c55e" />
      <Label x={157} y={90} text="VIX 15-20: Normal — standard wheel & CSPs" color="#22c55e" />
      <Rect x={20} y={104} w={275} h={28} color="#38bdf8" />
      <Label x={157} y={122} text="VIX <15: Complacent — buy straddles/debit spreads" color="#38bdf8" />
      <PriceLine points={[[20, 142], [60, 138], [100, 132], [130, 105], [155, 60], [170, 48], [185, 68], [215, 82], [255, 78], [285, 92]]} color="#c084fc" width={2} />
      <Label x={157} y={H - 2} text="VIX over time →" color="#c084fc" />
      <Marker x={170} y={48} label="Sell here!" color="#fbbf24" />
      <Marker x={100} y={132} label="Buy here" color="#38bdf8" below />
    </ChartSVG>
  )
}

function IVRankIndicator() {
  return (
    <ChartSVG title="IV Rank — sell premium when elevated">
      <Rect x={20} y={10} w={275} h={55} color="#ef4444" opacity={0.06} />
      <Label x={157} y={28} text="IV Rank >50%: SELL premium" color="#ef4444" size="9" />
      <Label x={157} y={40} text="Iron condors, credit spreads, CSPs" color="#94a3b8" />
      <Label x={157} y={52} text="Options are expensive = sellers get paid more" color="#94a3b8" />
      <Rect x={20} y={72} w={275} h={55} color="#22c55e" opacity={0.06} />
      <Label x={157} y={90} text="IV Rank <30%: BUY premium" color="#22c55e" size="9" />
      <Label x={157} y={102} text="Straddles, debit spreads, calendars" color="#94a3b8" />
      <Label x={157} y={114} text="Options are cheap = good time to buy" color="#94a3b8" />
      <DashLine x1={20} y1={68} x2={295} y2={68} color="#fbbf24" />
      <Label x={300} y={71} text="50%" color="#fbbf24" anchor="start" />
      <rect x={35} y={138} width={250} height={14} fill="#1e293b" rx={3} />
      <rect x={35} y={138} width={175} height={14} fill="#ef4444" fillOpacity={.25} rx={3} />
      <Label x={120} y={148} text="Your current environment: ~70% = sell premium" color="#fbbf24" />
    </ChartSVG>
  )
}

function VWAPIndicator() {
  const price = [[20, 50], [50, 65], [80, 45], [110, 70], [140, 55], [170, 68], [200, 50], [230, 62], [260, 48]]
  const vwap = [[20, 58], [50, 58], [80, 57], [110, 58], [140, 57], [170, 58], [200, 57], [230, 57], [260, 56]]
  return (
    <ChartSVG title="VWAP — intraday fair value for order timing">
      <PriceLine points={price} color="#38bdf8" width={1.5} />
      <PriceLine points={vwap} color="#fbbf24" width={1.5} />
      <Label x={270} y={45} text="Price" color="#38bdf8" anchor="start" />
      <Label x={270} y={55} text="VWAP" color="#fbbf24" anchor="start" />
      <Marker x={80} y={57} label="Place orders near VWAP" color="#22c55e" below />
      <Label x={157} y={100} text="VWAP = where institutions trade" color="#94a3b8" />
      <Label x={157} y={112} text="Options fills are tighter at VWAP" color="#94a3b8" />
    </ChartSVG>
  )
}

function PutCallIndicator() {
  return (
    <ChartSVG title="Put/Call Ratio — contrarian sentiment indicator">
      <Rect x={20} y={10} w={275} h={35} color="#22c55e" opacity={0.06} />
      <Label x={157} y={25} text="P/C > 1.2: Crowd panicking = SELL puts" color="#22c55e" size="8" />
      <Label x={157} y={38} text="Contrarian bullish — fear is overdone" color="#94a3b8" />
      <DashLine x1={20} y1={52} x2={295} y2={52} color="#fbbf24" />
      <Label x={300} y={55} text="1.0" color="#fbbf24" anchor="start" />
      <Rect x={20} y={56} w={275} h={20} color="#94a3b8" opacity={0.04} />
      <Label x={157} y={70} text="P/C 0.7-1.0: Normal range — no signal" color="#94a3b8" />
      <DashLine x1={20} y1={80} x2={295} y2={80} color="#fbbf24" />
      <Label x={300} y={83} text="0.7" color="#fbbf24" anchor="start" />
      <Rect x={20} y={84} w={275} h={35} color="#ef4444" opacity={0.06} />
      <Label x={157} y={99} text="P/C < 0.5: Crowd complacent = SELL calls" color="#ef4444" size="8" />
      <Label x={157} y={112} text="Contrarian bearish — greed is overdone" color="#94a3b8" />
      <PriceLine points={[[20, 72], [50, 68], [80, 55], [110, 40], [130, 30], [150, 42], [180, 60], [210, 72], [240, 88], [270, 95], [290, 82]]} color="#c084fc" width={1.8} />
      <Marker x={130} y={30} label="Max fear" color="#22c55e" />
      <Marker x={270} y={95} label="Max greed" color="#ef4444" below />
    </ChartSVG>
  )
}

// ════════════════════════════════════════
// LOOKUP MAPS
// ════════════════════════════════════════
export const chartPatternCharts = {
  doubleBottom: DoubleBottomChart,
  doubleTop: DoubleTopChart,
  headShoulders: HeadShouldersChart,
  inverseHS: InverseHSChart,
  bullFlag: BullFlagChart,
  bearFlag: BearFlagChart,
  ascTriangle: AscTriangleChart,
  descTriangle: DescTriangleChart,
  symTriangle: SymTriangleChart,
  cupHandle: CupHandleChart,
  risingWedge: RisingWedgeChart,
  fallingWedge: FallingWedgeChart,
  ascChannel: AscChannelChart,
  descChannel: DescChannelChart,
  roundingBottom: RoundingBottomChart,
}

export const candleCharts = {
  hammer: HammerCandle,
  invertedHammer: InvertedHammerCandle,
  shootingStar: ShootingStarCandle,
  hangingMan: HangingManCandle,
  doji: DojiCandle,
  bullEngulf: BullEngulfCandle,
  bearEngulf: BearEngulfCandle,
  morningStar: MorningStarCandle,
  eveningStar: EveningStarCandle,
  threeSoldiers: ThreeSoldiersCandle,
  threeCrows: ThreeCrowsCandle,
  marubozu: MarubozuCandle,
}

export const indicatorCharts = {
  rsi: RSIIndicator,
  macd: MACDIndicator,
  bollinger: BollingerIndicator,
  movingAvg: MovingAvgIndicator,
  volume: VolumeIndicator,
  vwap: VWAPIndicator,
  ivRank: IVRankIndicator,
  putCall: PutCallIndicator,
  vix: VIXIndicator,
}
