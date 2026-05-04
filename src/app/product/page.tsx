"use client"

import { useState } from "react"
import {
  BookOpen,
  Play,
  Users,
  LayoutGrid,
  CalendarDays,
  X,
  SlidersHorizontal,
  Download,
  Info,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Minus,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Globe,
  Swords,
  Share2,
  ShoppingBag,
  PieChart as PieChartIcon,
  BarChart2 as BarChartIcon,
  TrendingUp as LineChartIcon,
  AreaChart as AreaChartIcon,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts"

import { CHART_COLORS_12, getChartColors } from "@/lib/chart-palette"

// ─── Scrunch palette tokens — synced to colors-palette-3.html ────────────────
const P = {
  blue600:    "#2A4AEA", // SCRUNCH
  blue500:    "#3C67F5",
  blue400:    "#618FF9",
  blue300:    "#93C0FE", // CLOUD
  blue200:    "#BFD2FE",
  blue800:    "#1F2CAE",
  blue900:    "#1F2B89",
  blue950:    "#171C54",

  green700:   "#6E8920", // BOTANIC
  green600:   "#84A027",
  green500:   "#99B72C",
  green400:   "#AECE31",
  green300:   "#C3E536",
  green200:   "#E9FE91",
  green100:   "#F2FFC5",
  green50:    "#FBFFE7",

  warning700: "#A46804",
  warning600: "#CE9300",
  warning500: "#EFBE03",
  warning400: "#FFDA1F",
  warning300: "#FFE843",
  warning200: "#FFF587",
  warning100: "#FFFCC2",

  danger600:  "#F02806",
  danger500:  "#FF5021",
  danger400:  "#FF6937",
  danger300:  "#FF9D70",
  danger50:   "#FFF3ED",

  neutral500: "#93886F",
  neutral400: "#B8AB8E",
  neutral300: "#F1E8C7", // GLAZE
  neutral200: "#F6EFDC",

  pink400:    "#F04FD0", // GUAVA
  pink300:    "#FF72DD",
  pink500:    "#D430B4",

  purple400:  "#A66FEB", // VIOLET
  purple300:  "#C270E6",
  purple500:  "#8B4DD4",
  purple600:  "#7235BE",
  purple700:  "#5A249F",

  orange400:  "#FF9410",
  orange300:  "#FFB030",
  orange500:  "#E87A00",
  orange600:  "#C86200",

  neutral600: "#67624C",
  neutral700: "#514B39",

  brown800:   "#3B2109",
  brown700:   "#563214", // Mahogany
  brown600:   "#744620",
  brown500:   "#956130", // Caramel
  brown400:   "#B8824A",
  brown300:   "#D4A76A", // Tan

  green800:   "#586B16",
  neutral800: "#40362E", // Clay
  orange800:  "#7E3800",
  warning800: "#88520B",

  // ─── Data set palette (Image #5 order) ─────────────────────────────────────
  ds1: "#004AF0", // Blue Deep
  ds2: "#4E86F5", // Blue Mid
  ds3: "#93C0FE", // Cloud Blue
  ds4: "#CAFC00", // Lime Bright
  ds5: "#9AB950", // Olive Mid
  ds6: "#6E8920", // Botanic Green
  ds7: "#40362E", // Clay
  ds8: "#D1CBA9", // Khaki
  ds9: "#F4E8C3", // Cream
}

// ─── Data palette — imported from @/lib/chart-palette ────────────────────────
// Edit chart-palette.ts to update all charts at once.

// ─── Chart data ───────────────────────────────────────────────────────────────

const competitiveData = [
  { date: "Jan 29", oralB: 55, colgate: 52, crest: 46, sensodyne: 44, aquafresh: 1 },
  { date: "Feb 5",  oralB: 56, colgate: 50, crest: 47, sensodyne: 43, aquafresh: 1 },
  { date: "Feb 12", oralB: 54, colgate: 53, crest: 45, sensodyne: 45, aquafresh: 1 },
  { date: "Feb 19", oralB: 57, colgate: 51, crest: 46, sensodyne: 43, aquafresh: 1 },
  { date: "Feb 26", oralB: 55, colgate: 54, crest: 47, sensodyne: 42, aquafresh: 1 },
  { date: "Mar 5",  oralB: 58, colgate: 53, crest: 46, sensodyne: 44, aquafresh: 1 },
  { date: "Mar 12", oralB: 56, colgate: 52, crest: 45, sensodyne: 43, aquafresh: 1 },
  { date: "Mar 19", oralB: 54, colgate: 55, crest: 47, sensodyne: 44, aquafresh: 2 },
  { date: "Mar 26", oralB: 55, colgate: 53, crest: 46, sensodyne: 42, aquafresh: 1 },
  { date: "Apr 2",  oralB: 57, colgate: 54, crest: 46, sensodyne: 43, aquafresh: 1 },
  { date: "Apr 9",  oralB: 58, colgate: 52, crest: 47, sensodyne: 44, aquafresh: 1 },
  { date: "Apr 16", oralB: 56, colgate: 55, crest: 45, sensodyne: 43, aquafresh: 1 },
  { date: "Apr 23", oralB: 56, colgate: 54, crest: 46, sensodyne: 43, aquafresh: 1 },
]

const positionSparkline = [
  { v: 44 }, { v: 43 }, { v: 45 }, { v: 44 }, { v: 43 }, { v: 42 }, { v: 43 },
]
const sentimentSparkline = [
  { v: 95 }, { v: 96 }, { v: 97 }, { v: 96 }, { v: 97 }, { v: 97 }, { v: 97 },
]
const citationsSparkline = [
  { v: 5 }, { v: 4 }, { v: 3 }, { v: 4 }, { v: 3 }, { v: 2 }, { v: 2 },
]

const [posC1, posC2, posC3] = getChartColors(3)

const positionData = [
  { name: "Top",    value: 66, color: posC1 },
  { name: "Middle", value: 15, color: posC2 },
  { name: "Bottom", value: 19, color: posC3 },
]

const sentimentData = [
  { name: "Positive", value: 46, color: posC1 },
  { name: "Mixed",    value: 21, color: posC2 },
  { name: "Negative", value: 33, color: posC3 },
]

const citationsData = [
  { name: "Third Party", value: 38, color: getChartColors(5)[0] },
  { name: "Competitors", value: 24, color: getChartColors(5)[1] },
  { name: "Your Brand",  value: 18, color: getChartColors(5)[2] },
  { name: "Social",      value: 13, color: getChartColors(5)[3] },
  { name: "Retailer",    value: 7,  color: getChartColors(5)[4] },
]

const topBrands = [
  { rank: 1, name: "Oral-B",    pct: 56, color: getChartColors(6)[0], highlight: false },
  { rank: 2, name: "Colgate",   pct: 54, color: getChartColors(6)[1], highlight: true  },
  { rank: 3, name: "Crest",     pct: 46, color: getChartColors(6)[2], highlight: false },
  { rank: 4, name: "Sensodyne", pct: 43, color: getChartColors(6)[3], highlight: false },
  { rank: 5, name: "Aquafresh", pct: 1,  color: getChartColors(6)[4], highlight: false },
  { rank: 6, name: "Pepsodent", pct: 0,  color: getChartColors(6)[5], highlight: false },
]
const BRANDS_PER_PAGE = 5

// ─── Platform icons ───────────────────────────────────────────────────────────

function PlatformIcons() {
  const platforms = [
    { src: "/logos/ai/ai-overviews.svg",  label: "AI Overviews"  },
    { src: "/logos/ai/chatgpt.svg",        label: "ChatGPT",       darkInvert: true },
    { src: "/logos/ai/claude.svg",         label: "Claude"        },
    { src: "/logos/ai/copilot.svg",        label: "Copilot"       },
    { src: "/logos/ai/gemini.svg",         label: "Gemini"        },
    { src: "/logos/ai/google.svg",         label: "Google"        },
    { src: "/logos/ai/grok.svg",           label: "Grok",          darkInvert: true },
    { src: "/logos/ai/meta.svg",           label: "Meta"          },
    { src: "/logos/ai/perplexity.svg",     label: "Perplexity"    },
  ]
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {platforms.map(({ src, label, darkInvert }) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={label} src={src} alt={label} width={22} height={22} className={`shrink-0${darkInvert ? " dark:invert" : ""}`} />
      ))}
    </div>
  )
}

// ─── Sparkline ────────────────────────────────────────────────────────────────

function Sparkline({ data, color, gradId }: { data: { v: number }[]; color: string; gradId: string }) {
  return (
    <ResponsiveContainer width="100%" height={48}>
      <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={color} stopOpacity={0.28} />
            <stop offset="100%" stopColor={color} stopOpacity={0}    />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#${gradId})`}
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

// ─── Donut card ───────────────────────────────────────────────────────────────

type DonutRow = {
  icon: React.ReactNode
  label: string
  value: number
  color: string
}

function DonutCard({
  title,
  centerValue,
  centerIcon,
  data,
  rows,
  sparklineData,
  sparklineColor,
  trendLabel,
  trendValue,
  footer,
}: {
  title: string
  centerValue: string
  centerIcon: React.ReactNode
  data: { name: string; value: number; color: string }[]
  rows: DonutRow[]
  sparklineData: { v: number }[]
  sparklineColor: string
  trendLabel: string
  trendValue: string
  trendPositive?: boolean
  footer?: React.ReactNode
}) {
  const isPositive = trendValue.startsWith("+")

  return (
    <div className="rounded-scrunch-lg bg-white p-5 shadow-scrunch-sm">
      <div className="flex items-center gap-1.5 text-[15px] font-medium text-ink/60 mb-3">
        <span>{title}</span>
        <Info className="h-3.5 w-3.5 text-ink/30" />
      </div>

      <div className="flex items-center gap-4">
        {/* Donut */}
        <div className="relative shrink-0">
          <PieChart width={180} height={180} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <Pie
              data={data}
              cx={90}
              cy={90}
              innerRadius={58}
              outerRadius={82}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              strokeWidth={0}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
          <div className="absolute pointer-events-none" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
            <span className="text-[21px] font-normal font-plex-mono text-ink" style={{ lineHeight: 1 }}>{centerValue}</span>
          </div>
        </div>

        {/* Legend rows */}
        <div className="flex-1 space-y-1.5">
          {rows.map((row, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span style={{ color: row.color }} className="text-[14px] shrink-0">{row.icon}</span>
              <span className="text-[14px] text-ink/70 flex-1">{row.label}</span>
              <span className="text-[14px] font-normal font-plex-mono text-ink tabular-nums">{row.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sparkline + trend — single inline row */}
      {(() => {
        const trendColor = isPositive ? CHART_COLORS_12[5] : P.danger500
        const gradId = `sg-${title.replace(/[^a-zA-Z]/g, "")}`
        return (
          <div className="mt-3 pt-2 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <Sparkline data={sparklineData} color={trendColor} gradId={gradId} />
            </div>
            <div className={`shrink-0 flex items-center gap-1 rounded-scrunch-pill px-2 py-0.5 ${
              isPositive ? "bg-s-green-200 text-s-green-800" : "bg-s-danger-100 text-s-danger-700"
            }`}>
              {isPositive ? <ArrowUp className="h-2.5 w-2.5" /> : <ArrowDown className="h-2.5 w-2.5" />}
              <span className="text-[11px] font-medium tabular-nums">{trendValue}</span>
            </div>
          </div>
        )
      })()}

      {footer && <div className="mt-3">{footer}</div>}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProductDashboard() {
  const [brandPage, setBrandPage] = useState(0)
  const totalBrandPages = Math.ceil(topBrands.length / BRANDS_PER_PAGE)
  const pagedBrands = topBrands.slice(brandPage * BRANDS_PER_PAGE, (brandPage + 1) * BRANDS_PER_PAGE)
  const brandStart = brandPage * BRANDS_PER_PAGE + 1
  const brandEnd = Math.min((brandPage + 1) * BRANDS_PER_PAGE, topBrands.length)

  return (
    <div className="space-y-6 pb-10">

      {/* ── Welcome banner ────────────────────────────── */}
      <div className="relative overflow-hidden rounded-scrunch-xl bg-white px-8 py-7 shadow-scrunch-sm">
        <div className="max-w-[600px]">
          <h2 className="text-[18px] font-semibold text-ink leading-snug">
            Welcome to Your AI Visibility Dashboard
          </h2>
          <p className="mt-1.5 text-[14px] text-ink/55 leading-relaxed">
            Get an overview of your brand&apos;s AI search visibility across platforms.
            Track mentions, sentiment, and competitive positioning.
          </p>
          <div className="mt-4 flex items-center gap-4">
            <button className="flex items-center gap-1.5 text-[13px] text-ink/70 hover:text-ink transition-colors">
              <BookOpen className="h-4 w-4" />
              Getting Started
            </button>
            <button className="flex items-center gap-1.5 text-[13px] text-ink/70 hover:text-ink transition-colors">
              <Play className="h-4 w-4" />
              Watch an Intro
            </button>
          </div>
        </div>
        {/* Video thumbnail */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden xl:block">
          <div className="relative h-[140px] w-[240px] overflow-hidden rounded-scrunch-md"
            style={{ backgroundImage: "url('/backgrounds/bg3.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
            <div className="absolute inset-0 flex flex-col gap-1.5 p-3 opacity-60">
              <div className="h-2 w-3/4 rounded bg-white/30" />
              <div className="h-2 w-1/2 rounded bg-white/20" />
              <div className="mt-1 h-8 w-full rounded bg-white/15" />
              <div className="flex gap-1">
                <div className="h-12 flex-1 rounded bg-white/15" />
                <div className="h-12 flex-1 rounded bg-white/10" />
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 dark:bg-ink/80 shadow-lg">
                <svg width="14" height="14" viewBox="0 0 10 10" className="text-ink dark:text-paper" fill="currentColor">
                  <polygon points="2,1 9,5 2,9" strokeLinejoin="miter" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Insights & Action Items ────────────────────── */}
      <div>
        <h2 className="mb-3 text-[15px] font-semibold text-ink">Insights &amp; Action Items</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-scrunch-lg bg-white dark:bg-s-neutral-900 px-6 py-5 shadow-scrunch-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-s-blue-50 dark:bg-s-blue-900/30">
                <Users className="h-4 w-4 text-s-blue-600 dark:text-s-blue-400" strokeWidth={1.6} />
              </div>
              <span className="text-[14px] font-semibold text-ink dark:text-white">Suggested Competitors</span>
            </div>
            <p className="text-[14px] text-ink/60 dark:text-white/50 leading-relaxed">
              Based on prompt responses and trends data, we&apos;ve identified{" "}
              <strong className="text-ink dark:text-white font-semibold">2 potential competitive brands</strong>{" "}
              you may want to track.
            </p>
            <button className="mt-4 text-[13px] font-medium text-s-blue-600 dark:text-s-blue-400 hover:text-s-blue-700 dark:hover:text-s-blue-300 transition-colors">
              Take action →
            </button>
          </div>

          <div className="rounded-scrunch-lg bg-white dark:bg-s-neutral-900 px-6 py-5 shadow-scrunch-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-s-blue-50 dark:bg-s-blue-900/30">
                <LayoutGrid className="h-4 w-4 text-s-blue-600 dark:text-s-blue-400" strokeWidth={1.6} />
              </div>
              <span className="text-[14px] font-semibold text-ink dark:text-white">Suggested Sub-Brands</span>
            </div>
            <p className="text-[14px] text-ink/60 dark:text-white/50 leading-relaxed">
              Based on AI responses and brand knowledge, we&apos;ve identified{" "}
              <strong className="text-ink dark:text-white font-semibold">25+ potential sub-brands</strong>{" "}
              you may want to track.
            </p>
            <button className="mt-4 text-[13px] font-medium text-s-blue-600 dark:text-s-blue-400 hover:text-s-blue-700 dark:hover:text-s-blue-300 transition-colors">
              Take action →
            </button>
          </div>
        </div>
      </div>

      {/* ── Prompt Monitoring ─────────────────────────── */}
      <div>
        <h2 className="mb-3 text-[15px] font-semibold text-ink">Prompt Monitoring</h2>

        {/* Filter bar */}
        <div className="mb-4 flex items-center gap-2 flex-wrap">
          <button className="flex items-center gap-1.5 rounded-scrunch-pill bg-white px-3 py-1.5 text-[12.5px] text-ink/70 hover:bg-s-neutral-100 transition-colors">
            <CalendarDays className="h-3.5 w-3.5" />
            Last 12 weeks
          </button>
          <button className="flex items-center gap-1.5 rounded-scrunch-pill bg-white px-3 py-1.5 text-[12.5px] text-ink/70 hover:bg-s-neutral-100 transition-colors">
            Non-branded prompts
            <span className="text-ink/40">only</span>
            <X className="h-3 w-3 ml-0.5 text-ink/40" />
          </button>
          <button className="flex items-center gap-1.5 rounded-scrunch-pill bg-white px-3 py-1.5 text-[12.5px] text-ink/70 hover:bg-s-neutral-100 transition-colors">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Add filter
          </button>
          <button className="ml-auto flex items-center gap-1.5 rounded-scrunch-sm px-3 py-1.5 text-[12.5px] text-ink/60 hover:text-ink hover:bg-s-neutral-100 transition-colors">
            <Download className="h-3.5 w-3.5" />
            Save as PDF
          </button>
        </div>

        {/* Stats row — three separate cards */}
        <div className="mb-4 grid grid-cols-3 gap-4">
          <div className="rounded-scrunch-lg bg-white px-6 pt-5 pb-4 shadow-scrunch-sm flex flex-col">
            <div className="flex items-center gap-1 text-[12px] text-ink/50">
              Prompts <Info className="h-3 w-3" />
            </div>
            <div className="mt-auto pt-2 text-[42px] font-normal text-ink tabular-nums leading-none tracking-tighter">207</div>
          </div>
          <div className="rounded-scrunch-lg bg-white px-6 pt-5 pb-4 shadow-scrunch-sm flex flex-col">
            <div className="flex items-center gap-1 text-[12px] text-ink/50">
              Responses <Info className="h-3 w-3" />
            </div>
            <div className="mt-auto pt-2 text-[42px] font-normal text-ink tabular-nums leading-none tracking-tighter">5778</div>
          </div>
          <div className="rounded-scrunch-lg bg-white px-6 pt-5 pb-6 shadow-scrunch-sm flex flex-col">
            <div className="flex items-center gap-1 text-[12px] text-ink/50">
              Platforms <Info className="h-3 w-3" />
            </div>
            <div className="mt-auto pt-2">
              <PlatformIcons />
            </div>
          </div>
        </div>

        {/* Competitive presence chart + top brands */}
        <div className="grid grid-cols-5 gap-4">
          {/* Line chart */}
          <div className="col-span-3 rounded-scrunch-lg bg-white px-6 pt-5 pb-5 shadow-scrunch-sm flex flex-col">
            <div className="flex items-center gap-1.5 text-[15px] font-medium text-ink/60 mb-4 shrink-0">
              Competitive Presence
              <span className="text-ink/35 font-normal">(% of total)</span>
              <Info className="h-3.5 w-3.5 text-ink/30" />
            </div>
            <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={competitiveData} margin={{ top: 4, right: 12, bottom: 0, left: -16 }}>

                <CartesianGrid strokeDasharray="2 3" stroke="var(--chart-grid)" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: P.neutral500 }}
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                />
                <YAxis
                  domain={[0, 80]}
                  ticks={[0, 20, 40, 60, 80]}
                  tickFormatter={(v) => `${v}%`}
                  tick={{ fontSize: 11, fill: P.neutral500 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 10, border: "1px solid var(--tooltip-border)", background: "var(--tooltip-bg)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)", boxShadow: "var(--tooltip-shadow)" }}
                  formatter={(v, name) => [v !== undefined ? `${v}%` : "", name as string]}
                  itemSorter={(item) => -(item.value as number)}
                />
                <Line type="monotone" dataKey="oralB"     stroke={getChartColors(5)[0]} strokeWidth={2}   dot={false} name="Oral-B" />
                <Line type="monotone" dataKey="colgate"   stroke={getChartColors(5)[1]} strokeWidth={3}   dot={false} name="Colgate" />
                <Line type="monotone" dataKey="crest"     stroke={getChartColors(5)[2]} strokeWidth={1.5} dot={false} name="Crest" />
                <Line type="monotone" dataKey="sensodyne" stroke={getChartColors(5)[3]} strokeWidth={1.5} dot={false} name="Sensodyne" />
                <Line type="monotone" dataKey="aquafresh" stroke={getChartColors(5)[4]} strokeWidth={1}   dot={false} name="Aquafresh" />
              </LineChart>
            </ResponsiveContainer>
            </div>{/* end flex-1 */}
          </div>

          {/* Top brands */}
          <div className="col-span-2 rounded-scrunch-lg bg-white px-6 py-5 shadow-scrunch-sm">
            <div className="flex items-center gap-1.5 text-[15px] font-medium text-ink/60 mb-4">
              Top brands
              <span className="text-ink/35 font-normal">(avg %)</span>
              <Info className="h-3.5 w-3.5 text-ink/30" />
            </div>
            <div className="space-y-0 min-h-[260px]">
              {pagedBrands.map((brand) => (
                <div
                  key={brand.name}
                  className={`flex items-center gap-3 px-2 py-2.5 -mx-2 rounded-scrunch-sm ${
                    brand.highlight ? "bg-s-neutral-50 dark:bg-s-neutral-200" : ""
                  }`}
                >
                  <span className="text-[13px] text-ink/40 tabular-nums w-3 shrink-0">{brand.rank}.</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[14px] text-ink/70">
                        {brand.name}
                      </span>
                      <span className="text-[13px] font-normal font-plex-mono text-ink tabular-nums" style={{ fontFamily: "var(--font-plex-mono-var), ui-monospace, monospace" }}>
                        {brand.pct}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-ink/[6%]">
                      <div
                        className="h-1.5 rounded-full"
                        style={{ width: `${brand.pct}%`, backgroundColor: brand.color }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-end gap-1 text-[12px] text-ink/50">
              <button
                onClick={() => setBrandPage(p => Math.max(0, p - 1))}
                disabled={brandPage === 0}
                className="rounded p-1 hover:bg-s-neutral-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <span className="font-medium tabular-nums">{brandStart}–{brandEnd} of {topBrands.length}</span>
              <button
                onClick={() => setBrandPage(p => Math.min(totalBrandPages - 1, p + 1))}
                disabled={brandPage === totalBrandPages - 1}
                className="rounded p-1 hover:bg-s-neutral-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Three stat cards ──────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 items-start">

        <DonutCard
          title="Position (% of total)"
          centerValue="66%"
          centerIcon={<ArrowUp className="h-3 w-3 inline" />}
          data={positionData}
          rows={[
            { icon: <ArrowUp   className="h-3.5 w-3.5 inline" />, label: "Top",    value: 66, color: posC1 },
            { icon: <span className="inline-flex items-center justify-center h-3.5 w-3.5"><span className="block h-2 w-2 bg-current" /></span>, label: "Middle", value: 15, color: posC2 },
            { icon: <ArrowDown className="h-3.5 w-3.5 inline" />, label: "Bottom", value: 19, color: posC3 },
          ]}
          sparklineData={positionSparkline}
          sparklineColor={CHART_COLORS_12[2]}
          trendLabel="Last 12 weeks"
          trendValue="-4%"
        />

        <DonutCard
          title="Sentiment (% of total)"
          centerValue="46%"
          centerIcon={<ThumbsUp className="h-3 w-3 inline" />}
          data={sentimentData}
          rows={[
            { icon: <ThumbsUp   className="h-3.5 w-3.5 inline" />, label: "Positive", value: 46, color: posC1 },
            { icon: <span className="inline-flex items-center justify-center h-3.5 w-3.5"><span className="block h-2 w-2 bg-current" /></span>, label: "Mixed",    value: 21, color: posC2 },
            { icon: <ThumbsDown className="h-3.5 w-3.5 inline" />, label: "Negative", value: 33, color: posC3 },
          ]}
          sparklineData={sentimentSparkline}
          sparklineColor={CHART_COLORS_12[4]}
          trendLabel="Last 12 weeks"
          trendValue="+6%"
          footer={
            <button className="w-full rounded-full border border-ink/20 bg-transparent py-2 text-[13px] font-medium text-ink/60 hover:bg-s-neutral-900 hover:text-paper hover:border-transparent transition-colors">
              Explore trends →
            </button>
          }
        />

        <DonutCard
          title="Citations (% of total)"
          centerValue="38%"
          centerIcon={<RefreshCw className="h-3 w-3 inline" />}
          data={citationsData}
          rows={[
            { icon: <span className="inline-flex items-center justify-center h-3.5 w-3.5"><span className="block h-2 w-2 bg-current" /></span>, label: "Third Party", value: 38, color: getChartColors(5)[0] },
            { icon: <span className="inline-flex items-center justify-center h-3.5 w-3.5"><span className="block h-2 w-2 bg-current" /></span>, label: "Competitors", value: 24, color: getChartColors(5)[1] },
            { icon: <span className="inline-flex items-center justify-center h-3.5 w-3.5"><span className="block h-2 w-2 bg-current" /></span>, label: "Your Brand",  value: 18, color: getChartColors(5)[2] },
            { icon: <span className="inline-flex items-center justify-center h-3.5 w-3.5"><span className="block h-2 w-2 bg-current" /></span>, label: "Social",      value: 13, color: getChartColors(5)[3] },
            { icon: <span className="inline-flex items-center justify-center h-3.5 w-3.5"><span className="block h-2 w-2 bg-current" /></span>, label: "Retailer",    value: 7,  color: getChartColors(5)[4] },
          ]}
          sparklineData={citationsSparkline}
          sparklineColor={CHART_COLORS_12[2]}
          trendLabel="Last 12 weeks"
          trendValue="-34%"
        />
      </div>

      {/* ── Competitor Mention Rate ───────────────── */}
      <MentionRateSection />


    </div>
  )
}

// ─── Competitor mention rate data ─────────────────────────────────────────────

const mentionRateData = [
  // ── Full Data Palette: slots 1–12 from chart-palette.ts ──
  { name: "Scrunch",                  pct: 28,   color: CHART_COLORS_12[0],  dark: false }, //  1 Blue 800
  { name: "Semrush",                  pct: 22.6, color: CHART_COLORS_12[1],  dark: false }, //  2 Blue 500
  { name: "Profound AI",              pct: 17.1, color: CHART_COLORS_12[2],  dark: true  }, //  3 Blue 300
  { name: "Ahrefs",                   pct: 16.8, color: CHART_COLORS_12[3],  dark: false }, //  4 Green 800
  { name: "Peec AI",                  pct: 10.4, color: CHART_COLORS_12[4],  dark: false }, //  5 Green 600
  { name: "Writesonic",               pct: 4.9,  color: CHART_COLORS_12[5],  dark: true  }, //  6 Green 400
  { name: "Brandwatch",               pct: 3.6,  color: CHART_COLORS_12[6],  dark: false }, //  7 Neutral 800
  { name: "Athena HQ",                pct: 2.2,  color: CHART_COLORS_12[7],  dark: false }, //  8 Neutral 500
  { name: "Goodie",                   pct: 1.4,  color: CHART_COLORS_12[8],  dark: true  }, //  9 Neutral 300
  { name: "HubSpot AI Search Grader", pct: 0.8,  color: CHART_COLORS_12[9],  dark: false }, // 10 Amber 800
  { name: "Yext",                     pct: 0.5,  color: CHART_COLORS_12[10], dark: true  }, // 11 Amber 500
  { name: "Bluefish AI",              pct: 0.2,  color: CHART_COLORS_12[11], dark: true  }, // 12 Amber 300
  { name: "Citate.ai",                pct: 0,    color: CHART_COLORS_12[9],  dark: false }, // cycle → Amber 800
  { name: "Revere AI",                pct: 0,    color: CHART_COLORS_12[10], dark: true  }, // cycle → Amber 500
]

// Time-series data for line / area chart types (top 5 competitors, weekly Dec data)
const mentionRateTrend = [
  { date: "Dec 1",  scrunch: 24.2, semrush: 23.8, profoundAI: 14.1, ahrefs: 14.0, peecAI: 9.8  },
  { date: "Dec 8",  scrunch: 25.1, semrush: 23.2, profoundAI: 15.0, ahrefs: 14.8, peecAI: 10.0 },
  { date: "Dec 15", scrunch: 26.3, semrush: 22.9, profoundAI: 15.8, ahrefs: 15.4, peecAI: 10.1 },
  { date: "Dec 22", scrunch: 27.1, semrush: 22.7, profoundAI: 16.4, ahrefs: 16.1, peecAI: 10.3 },
  { date: "Dec 31", scrunch: 28,   semrush: 22.6, profoundAI: 17.1, ahrefs: 16.8, peecAI: 10.4 },
]

const RANGE_DATE_LABELS_HOME: Record<string, string> = {
  "7D":  "Apr 27 – May 4",
  "30D": "Apr 4 – May 4",
  "3M":  "Feb 4 – May 4",
}

const MENTION_TREND_BY_PERIOD: Record<string, Array<Record<string, string | number>>> = {
  "7D": [
    { date: "Apr 27", scrunch: 25.8, semrush: 23.1, profoundAI: 15.2, ahrefs: 14.8, peecAI: 9.9  },
    { date: "Apr 28", scrunch: 26.2, semrush: 22.8, profoundAI: 15.8, ahrefs: 15.2, peecAI: 10.1 },
    { date: "Apr 29", scrunch: 27.1, semrush: 22.5, profoundAI: 16.0, ahrefs: 15.5, peecAI: 10.2 },
    { date: "Apr 30", scrunch: 26.8, semrush: 23.0, profoundAI: 15.6, ahrefs: 15.8, peecAI: 10.0 },
    { date: "May 1",  scrunch: 27.5, semrush: 22.7, profoundAI: 16.2, ahrefs: 16.1, peecAI: 10.2 },
    { date: "May 2",  scrunch: 27.9, semrush: 22.4, profoundAI: 16.5, ahrefs: 16.4, peecAI: 10.3 },
    { date: "May 3",  scrunch: 28.3, semrush: 22.2, profoundAI: 16.8, ahrefs: 16.6, peecAI: 10.4 },
    { date: "May 4",  scrunch: 28.8, semrush: 22.0, profoundAI: 17.1, ahrefs: 16.9, peecAI: 10.5 },
  ],
  "30D": [
    { date: "Apr 4",  scrunch: 24.8, semrush: 23.4, profoundAI: 14.8, ahrefs: 14.5, peecAI: 9.7  },
    { date: "Apr 11", scrunch: 25.6, semrush: 23.1, profoundAI: 15.3, ahrefs: 15.0, peecAI: 9.9  },
    { date: "Apr 18", scrunch: 26.4, semrush: 22.8, profoundAI: 15.8, ahrefs: 15.5, peecAI: 10.1 },
    { date: "Apr 25", scrunch: 27.2, semrush: 22.5, profoundAI: 16.3, ahrefs: 16.0, peecAI: 10.3 },
    { date: "May 2",  scrunch: 28.1, semrush: 22.2, profoundAI: 17.0, ahrefs: 16.7, peecAI: 10.4 },
  ],
  "3M": [
    { date: "Feb 4",  scrunch: 21.5, semrush: 24.8, profoundAI: 12.0, ahrefs: 12.1, peecAI: 8.5  },
    { date: "Feb 11", scrunch: 22.0, semrush: 24.5, profoundAI: 12.5, ahrefs: 12.6, peecAI: 8.7  },
    { date: "Feb 18", scrunch: 22.4, semrush: 24.2, profoundAI: 13.0, ahrefs: 13.0, peecAI: 8.9  },
    { date: "Feb 25", scrunch: 22.8, semrush: 24.0, profoundAI: 13.4, ahrefs: 13.4, peecAI: 9.1  },
    { date: "Mar 4",  scrunch: 23.2, semrush: 23.8, profoundAI: 13.8, ahrefs: 13.8, peecAI: 9.3  },
    { date: "Mar 11", scrunch: 23.6, semrush: 23.6, profoundAI: 14.1, ahrefs: 14.1, peecAI: 9.5  },
    { date: "Mar 18", scrunch: 24.0, semrush: 23.4, profoundAI: 14.4, ahrefs: 14.4, peecAI: 9.6  },
    { date: "Mar 25", scrunch: 24.4, semrush: 23.2, profoundAI: 14.7, ahrefs: 14.7, peecAI: 9.7  },
    { date: "Apr 1",  scrunch: 24.8, semrush: 23.0, profoundAI: 15.0, ahrefs: 15.0, peecAI: 9.8  },
    { date: "Apr 8",  scrunch: 25.2, semrush: 22.8, profoundAI: 15.3, ahrefs: 15.3, peecAI: 9.9  },
    { date: "Apr 15", scrunch: 26.0, semrush: 22.6, profoundAI: 15.6, ahrefs: 15.6, peecAI: 10.0 },
    { date: "Apr 22", scrunch: 26.8, semrush: 22.4, profoundAI: 15.9, ahrefs: 15.8, peecAI: 10.2 },
    { date: "Apr 29", scrunch: 27.6, semrush: 22.2, profoundAI: 16.2, ahrefs: 16.1, peecAI: 10.4 },
  ],
}

function MentionRateSection() {
  const [chartType, setChartType] = useState<"donut" | "bar" | "line" | "area">("donut")
  const [period, setPeriod] = useState<"7D" | "30D" | "3M">("30D")
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const trendLines = [
    { key: "scrunch",    label: "Scrunch",     color: CHART_COLORS_12[0] }, // Blue 800
    { key: "semrush",    label: "Semrush",     color: CHART_COLORS_12[1] }, // Blue 500
    { key: "profoundAI", label: "Profound AI", color: CHART_COLORS_12[2] }, // Blue 300
    { key: "ahrefs",     label: "Ahrefs",      color: CHART_COLORS_12[3] }, // Green 800
    { key: "peecAI",     label: "Peec AI",     color: CHART_COLORS_12[4] }, // Green 600
  ]

  const chartOptions = [
    { type: "donut" as const, label: "Donut", icon: <PieChartIcon  className="h-3.5 w-3.5" /> },
    { type: "bar"   as const, label: "Bar",   icon: <BarChartIcon  className="h-3.5 w-3.5" /> },
    { type: "line"  as const, label: "Line",  icon: <LineChartIcon className="h-3.5 w-3.5" /> },
    { type: "area"  as const, label: "Area",  icon: <AreaChartIcon className="h-3.5 w-3.5" /> },
  ]

  const renderDonutLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, index }: {
    cx?: number; cy?: number; midAngle?: number; innerRadius?: number; outerRadius?: number; percent?: number; index?: number
  }) => {
    if (index === undefined || mentionRateData[index].pct < 2) return null
    const RADIAN = Math.PI / 180
    const ir = innerRadius ?? 0
    const or = outerRadius ?? 0
    const r = ir + (or - ir) * 0.55
    const x = (cx ?? 0) + r * Math.cos(-(midAngle ?? 0) * RADIAN)
    const y = (cy ?? 0) + r * Math.sin(-(midAngle ?? 0) * RADIAN)
    const entry = mentionRateData[index]
    return (
      <text x={x} y={y} fill={entry.dark ? "#1D1107" : "white"} textAnchor="middle" dominantBaseline="central"
        fontSize={12} fontWeight={600}>
        {`${entry.pct}%`}
      </text>
    )
  }

  const TrendLegend = () => (
    <div className="flex gap-4 mb-3 flex-wrap">
      {trendLines.map((l) => (
        <div key={l.key} className="flex items-center gap-1.5">
          <span className="h-2 w-2 shrink-0" style={{ backgroundColor: l.color }} />
          <span className="text-[12px] text-ink/60">{l.label}</span>
        </div>
      ))}
    </div>
  )

  const renderChart = () => {
    if (chartType === "donut") {
      return (
        <div className="shrink-0 relative" style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 27px, var(--chart-grid) 27px, var(--chart-grid) 28px), repeating-linear-gradient(90deg, transparent, transparent 27px, var(--chart-grid) 27px, var(--chart-grid) 28px)`,
        }}>
          <PieChart width={520} height={520}>
            <Pie data={mentionRateData} cx={260} cy={260} innerRadius={134} outerRadius={250}
              dataKey="pct" startAngle={90} endAngle={-270} strokeWidth={0}
              labelLine={false} label={renderDonutLabel}>
              {mentionRateData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Pie>
          </PieChart>
          {/* Grain overlay */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='f'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/></filter><rect width='200' height='200' filter='url(%23f)'/></svg>")`,
            backgroundRepeat: "repeat",
            opacity: 0.13,
            mixBlendMode: "multiply",
          }} />
        </div>
      )
    }

    if (chartType === "bar") {
      return (
        <ResponsiveContainer width="100%" height={360}>
          <BarChart
            data={mentionRateData.slice(0, 10)}
            layout="vertical"
            margin={{ top: 0, right: 40, bottom: 0, left: 120 }}
          >
            <CartesianGrid strokeDasharray="2 3" stroke="var(--chart-grid)" />
            <XAxis type="number" domain={[0, 35]} tickFormatter={(v: number) => `${v}%`}
              tick={{ fontSize: 11, fill: P.neutral500 }} tickLine={false} axisLine={false} />
            <YAxis type="category" dataKey="name" width={110}
              tick={{ fontSize: 12, fill: "#1D1107" }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 10, border: "1px solid var(--tooltip-border)", background: "var(--tooltip-bg)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)", boxShadow: "var(--tooltip-shadow)" }}
              formatter={(v) => [v !== undefined ? `${v}%` : ""]} />
            <Bar dataKey="pct" radius={[0, 4, 4, 0]}>
              {mentionRateData.slice(0, 10).map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )
    }

    if (chartType === "line") {
      return (
        <>
          <TrendLegend />
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={MENTION_TREND_BY_PERIOD[period] ?? mentionRateTrend} margin={{ top: 4, right: 12, bottom: 0, left: -16 }}>
              <CartesianGrid strokeDasharray="2 3" stroke="var(--chart-grid)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: P.neutral500 }} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 35]} tickFormatter={(v: number) => `${v}%`}
                tick={{ fontSize: 11, fill: P.neutral500 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 10, border: "1px solid var(--tooltip-border)", background: "var(--tooltip-bg)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)", boxShadow: "var(--tooltip-shadow)" }}
                formatter={(v) => [v !== undefined ? `${v}%` : ""]} />
              {trendLines.map((l) => (
                <Line key={l.key} type="monotone" dataKey={l.key}
                  stroke={l.color} strokeWidth={2} dot={false} name={l.label} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </>
      )
    }

    // area
    return (
      <>
        <TrendLegend />
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={MENTION_TREND_BY_PERIOD[period] ?? mentionRateTrend} margin={{ top: 4, right: 12, bottom: 0, left: -16 }}>
            <CartesianGrid strokeDasharray="2 3" stroke="var(--chart-grid)" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: P.neutral500 }} tickLine={false} axisLine={false} />
            <YAxis domain={[0, 35]} tickFormatter={(v: number) => `${v}%`}
              tick={{ fontSize: 11, fill: P.neutral500 }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 10, border: "1px solid var(--tooltip-border)", background: "var(--tooltip-bg)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)", boxShadow: "var(--tooltip-shadow)" }}
              formatter={(v) => [v !== undefined ? `${v}%` : ""]} />
            {trendLines.map((l) => (
              <Area key={l.key} type="monotone" dataKey={l.key}
                stroke={l.color} fill={l.color} fillOpacity={0.12}
                strokeWidth={2} dot={false} name={l.label} />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </>
    )
  }

  const activeChart = chartOptions.find((o) => o.type === chartType)!

  return (
    <>
      {/* Control bar — outside the card */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {/* Date range */}
        <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-scrunch-sm border border-s-neutral-200 bg-white text-[12.5px] text-ink/70 hover:bg-s-neutral-100 transition-colors">
          <CalendarDays className="h-3.5 w-3.5" />
          {RANGE_DATE_LABELS_HOME[period] ?? "Dec 1 – Dec 31"}
        </button>

        {/* Period toggle */}
        <div className="flex items-center rounded-scrunch-sm bg-s-neutral-100 p-0.5 gap-0.5">
          {(["7D", "30D", "3M"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-2.5 py-1 text-[12px] rounded-scrunch-xs transition-colors ${
                period === p
                  ? "bg-white text-ink font-medium shadow-scrunch-sm"
                  : "text-ink/50 hover:text-ink/70"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Compare */}
        <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-scrunch-sm border border-s-neutral-200 bg-white text-[12.5px] text-ink/60 hover:bg-s-neutral-100 transition-colors">
          Compare
          <ChevronDown className="h-3 w-3" />
        </button>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2">
          {/* Granularity */}
          <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-scrunch-sm border border-s-neutral-200 bg-white text-[12.5px] text-ink/60 hover:bg-s-neutral-100 transition-colors">
            Day
            <ChevronDown className="h-3 w-3" />
          </button>

          {/* Chart type dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-scrunch-sm border border-s-neutral-200 bg-white text-[12.5px] text-ink/70 hover:bg-s-neutral-100 transition-colors"
            >
              {activeChart.icon}
              <span>{activeChart.label}</span>
              <ChevronDown className="h-3 w-3 text-ink/40" />
            </button>
            {dropdownOpen && (
              <>
                {/* Backdrop */}
                <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                <div className="absolute right-0 top-full mt-1 w-36 rounded-scrunch-md bg-white shadow-scrunch-md border border-s-neutral-200 overflow-hidden z-20">
                  {chartOptions.map(({ type, label, icon }) => (
                    <button
                      key={type}
                      onClick={() => { setChartType(type); setDropdownOpen(false) }}
                      className={`flex items-center gap-2 w-full px-3 py-2 text-[13px] text-left transition-colors ${
                        chartType === type
                          ? "bg-s-neutral-100 text-ink font-medium"
                          : "text-ink/70 hover:bg-s-neutral-50"
                      }`}
                    >
                      {icon}
                      {label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* White card */}
      <div className="rounded-scrunch-xl bg-white shadow-scrunch-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-1.5 text-[15px] font-medium text-ink/60 px-7 pt-6 pb-5">
          Mention Rate For Scrunch Broken Down By Competitor
          <Info className="h-3.5 w-3.5 text-ink/30" />
        </div>

        {/* Chart + right column */}
        {chartType === "donut" ? (
          <div className="grid grid-cols-2">
            {/* Left half: donut fills full area */}
            <div
              className="relative flex items-center justify-center"
              style={{
                backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 47px, var(--chart-grid) 47px, var(--chart-grid) 48px), repeating-linear-gradient(90deg, transparent, transparent 47px, var(--chart-grid) 47px, var(--chart-grid) 48px)`,
              }}
            >
              <div className="relative py-7" style={{ zIndex: 1 }}>
                <PieChart width={500} height={500}>
                  <Pie data={mentionRateData} cx={250} cy={250} innerRadius={130} outerRadius={234}
                    dataKey="pct" startAngle={90} endAngle={-270} strokeWidth={0}
                    labelLine={false} label={renderDonutLabel}>
                    {mentionRateData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </div>
              {/* Grain overlay */}
              <div className="absolute inset-0 pointer-events-none" style={{
                backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='f'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/></filter><rect width='200' height='200' filter='url(%23f)'/></svg>")`,
                backgroundRepeat: "repeat",
                opacity: 0.13,
                mixBlendMode: "multiply",
              }} />
            </div>
            {/* Right half: competitor table */}
            <div className="min-w-0 px-7 pb-6">
              <div className="grid grid-cols-[1fr_auto] border-b border-ink/[8%] pb-2 text-[12px] font-medium text-ink/40 uppercase tracking-[0.05em]">
                <span>Competitor</span>
                <span>Average</span>
              </div>
              {mentionRateData.map((item) => (
                <div key={item.name} className="grid grid-cols-[1fr_auto] items-center border-b border-ink/[5%] py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-scrunch-xs" style={{ backgroundColor: item.color }}>
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4l3 3 5-6" stroke={item.dark ? "#1D1107" : "white"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <span className="text-[13px] text-ink/80">{item.name}</span>
                  </div>
                  <span className="text-[13px] font-normal font-plex-mono text-ink tabular-nums pl-6">
                    {item.pct > 0 ? `${item.pct}%` : "0%"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="px-7 pb-6">
            {renderChart()}
            <div className="mt-6">
              <div className="grid grid-cols-[1fr_2fr_120px] border-b border-ink/[8%] pb-2 text-[12px] font-medium text-ink/40 uppercase tracking-[0.05em]">
                <span>Metric</span>
                <span>Competitor</span>
                <span className="text-right">Average</span>
              </div>
              {mentionRateData.map((item, i) => (
                <div key={item.name} className="grid grid-cols-[1fr_2fr_120px] items-center border-b border-ink/[5%] py-2.5">
                  <span className="text-[13px] font-semibold text-ink">
                    {i === 0 ? "Mention Rate" : ""}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-scrunch-xs" style={{ backgroundColor: item.color }}>
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4l3 3 5-6" stroke={item.dark ? "#1D1107" : "white"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <span className="text-[13px] text-ink/80">{item.name}</span>
                  </div>
                  <span className="text-right text-[13px] font-plex-mono text-ink tabular-nums">
                    {item.pct > 0 ? `${item.pct}%` : "0%"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

// Fixed demo values (4 months × 12 series)
