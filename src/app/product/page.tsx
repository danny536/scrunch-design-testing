"use client"

import { useState } from "react"
import {
  Users,
  LayoutGrid,
  X,
  SlidersHorizontal,
  Download,
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
} from "lucide-react"
import { Icon } from "@/components/icon"
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
        <Icon name="info" size={14} className="text-ink/30" />
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
        const trendColor = isPositive ? sparklineColor : P.danger500
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
              <Icon name="auto_stories" size={16} />
              Getting Started
            </button>
            <button className="flex items-center gap-1.5 text-[13px] text-ink/70 hover:text-ink transition-colors">
              <Icon name="play_circle" size={16} />
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
            <Icon name="calendar_month" size={14} />
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
              Prompts <Icon name="info" size={12} />
            </div>
            <div className="mt-auto pt-2 text-[42px] font-normal text-ink tabular-nums leading-none tracking-tighter">207</div>
          </div>
          <div className="rounded-scrunch-lg bg-white px-6 pt-5 pb-4 shadow-scrunch-sm flex flex-col">
            <div className="flex items-center gap-1 text-[12px] text-ink/50">
              Responses <Icon name="info" size={12} />
            </div>
            <div className="mt-auto pt-2 text-[42px] font-normal text-ink tabular-nums leading-none tracking-tighter">5778</div>
          </div>
          <div className="rounded-scrunch-lg bg-white px-6 pt-5 pb-6 shadow-scrunch-sm flex flex-col">
            <div className="flex items-center gap-1 text-[12px] text-ink/50">
              Platforms <Icon name="info" size={12} />
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
              <Icon name="info" size={14} className="text-ink/30" />
            </div>
            <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height={280}>
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
                <Line type="monotone" dataKey="oralB"     stroke={getChartColors(5)[0]} strokeWidth={2}   dot={false} name="Oral-B"     isAnimationActive={false} />
                <Line type="monotone" dataKey="colgate"   stroke={getChartColors(5)[1]} strokeWidth={3}   dot={false} name="Colgate"   isAnimationActive={false} />
                <Line type="monotone" dataKey="crest"     stroke={getChartColors(5)[2]} strokeWidth={1.5} dot={false} name="Crest"     isAnimationActive={false} />
                <Line type="monotone" dataKey="sensodyne" stroke={getChartColors(5)[3]} strokeWidth={1.5} dot={false} name="Sensodyne" isAnimationActive={false} />
                <Line type="monotone" dataKey="aquafresh" stroke={getChartColors(5)[4]} strokeWidth={1}   dot={false} name="Aquafresh" isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
            </div>{/* end flex-1 */}
          </div>

          {/* Top brands */}
          <div className="col-span-2 rounded-scrunch-lg bg-white px-6 py-5 shadow-scrunch-sm">
            <div className="flex items-center gap-1.5 text-[15px] font-medium text-ink/60 mb-4">
              Top brands
              <span className="text-ink/35 font-normal">(avg %)</span>
              <Icon name="info" size={14} className="text-ink/30" />
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
          sparklineColor={posC2}
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

    </div>
  )
}
