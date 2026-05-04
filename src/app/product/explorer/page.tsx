"use client"

import { useState, useRef, useEffect } from "react"
import {
  MoreHorizontal,
  Plus,
  X,
  ChevronDown,
} from "lucide-react"
import { Icon } from "@/components/icon"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { CHART_COLORS_12 } from "@/lib/chart-palette"

// ─── Color token ──────────────────────────────────────────────────────────────
const neutral500 = "#93886F"

// ─── Competitor entities with persistent colors ───────────────────────────────
const ENTITIES = [
  { id: "colgate",   label: "Colgate",   color: CHART_COLORS_12[0]  }, // Blue 800
  { id: "oralb",     label: "Oral-B",    color: CHART_COLORS_12[3]  }, // Green 800
  { id: "crest",     label: "Crest",     color: CHART_COLORS_12[6]  }, // Neutral 800
  { id: "sensodyne", label: "Sensodyne", color: CHART_COLORS_12[9]  }, // Amber 800
  { id: "aquafresh", label: "Aquafresh", color: CHART_COLORS_12[1]  }, // Blue 500
  { id: "pepsodent", label: "Pepsodent", color: CHART_COLORS_12[4]  }, // Green 600
]

// ─── Metric options ───────────────────────────────────────────────────────────
const METRIC_OPTIONS = [
  { key: "presence",      label: "Mention Rate",    available: true  },
  { key: "mentionCount",  label: "Mention Count",   available: true  },
  { key: "sentiment",     label: "Sentiment",       available: true  },
  { key: "position",      label: "Position",        available: true  },
  { key: "citationRate",  label: "Citation Rate",   available: false },
  { key: "citationCount", label: "Citation Count",  available: false },
  { key: "shareOfVoice",  label: "Share of Voice",  available: false },
] as const

type MetricKey = "presence" | "mentionCount" | "sentiment" | "position" | "citationRate" | "citationCount" | "shareOfVoice"

const METRIC_META: Record<string, { label: string; suffix: string }> = {
  presence:      { label: "Mention Rate",   suffix: "%" },
  mentionCount:  { label: "Mention Count",  suffix: ""  },
  sentiment:     { label: "Sentiment",      suffix: "%"  },
  position:      { label: "Position",       suffix: "%"  },
  citationRate:  { label: "Citation Rate",  suffix: "%" },
  citationCount: { label: "Citation Count", suffix: ""  },
  shareOfVoice:  { label: "Share of Voice", suffix: "%" },
}

// Which metrics have per-competitor breakdown (vs. brand-level only)
const COMPETITOR_METRICS = new Set<MetricKey>(["presence", "mentionCount"])

// ─── Live data from Scrunch AI MCP — keyed by range ──────────────────────────
// 7D = daily granularity  |  30D = weekly  |  3M = weekly
// presence/mentionCount: per-competitor  |  sentiment/position: Colgate brand-level

type RangeTrend = Record<string, Record<string, number[]>>
type RangeDataset = {
  dates: string[]
  trend: RangeTrend
  tableDates: string[]
  tableDateIdxs: number[]
}

const RANGE_DATASETS: Record<string, RangeDataset> = {
  "7D": {
    dates: ["Apr 27", "Apr 28", "Apr 29", "Apr 30", "May 1", "May 2", "May 3", "May 4"],
    trend: {
      presence: {
        colgate:   [78.5, 85.0, 58.3, 76.8, 79.0, 72.0, 82.3, 90.5],
        oralb:     [34.7, 17.5, 38.9, 17.9, 38.0, 34.0, 12.7,  9.5],
        crest:     [33.8, 15.0, 25.0, 22.1, 31.0, 32.0, 26.6, 11.9],
        sensodyne: [34.7, 12.5, 13.9, 20.0, 28.0, 28.0, 25.3, 14.3],
        aquafresh: [ 1.4,  1.2,  2.8,  1.1,  2.0,  0.0,  3.8,  0.0],
        // Pepsodent absent from 7D API response — omit to keep line hidden
      },
      mentionCount: {
        colgate:   [172, 68, 21, 73, 79, 36, 65, 38],
        oralb:     [ 76, 14, 14, 17, 38, 17, 10,  4],
        crest:     [ 74, 12,  9, 21, 31, 16, 21,  5],
        sensodyne: [ 76, 10,  5, 19, 28, 14, 20,  6],
        aquafresh: [  3,  1,  1,  1,  2,  0,  3,  0],
      },
      sentiment: { colgate: [95.7, 93.9, 100.0, 95.7, 98.7, 94.4, 96.9, 92.1] },
      position:  { colgate: [83.7, 97.1,  85.7, 97.3, 82.3, 86.1, 92.3, 100.0] },
    },
    tableDates: ["Apr 28", "Apr 30", "May 4"],
    tableDateIdxs: [1, 3, 7],
  },

  "30D": {
    dates: ["Apr 4", "Apr 11", "Apr 18", "Apr 25", "May 2"],
    trend: {
      presence: {
        colgate:   [75.6, 74.7, 77.9, 77.4, 81.3],
        oralb:     [31.2, 29.6, 31.9, 28.8, 18.1],
        crest:     [26.5, 27.3, 29.7, 25.5, 24.6],
        sensodyne: [24.3, 24.5, 27.2, 24.1, 23.4],
        aquafresh: [ 0.7,  0.4,  0.6,  1.1,  1.8],
        pepsodent: [ 0.1,  0.3,  0.4,  0.1,  0.0],
      },
      mentionCount: {
        colgate:   [683, 734, 788, 559, 139],
        oralb:     [282, 291, 323, 208,  31],
        crest:     [239, 268, 300, 184,  42],
        sensodyne: [219, 241, 275, 174,  40],
        aquafresh: [  6,   4,   6,   8,   3],
        pepsodent: [  1,   3,   4,   1,   0],
      },
      sentiment: { colgate: [95.33, 95.18, 93.77, 96.1, 94.93] },
      position:  { colgate: [86.24, 88.96, 86.04, 87.84, 92.81] },
    },
    tableDates: ["Apr 4", "Apr 18", "May 2"],
    tableDateIdxs: [0, 2, 4],
  },

  "3M": {
    dates: ["Feb 4", "Feb 11", "Feb 18", "Feb 25", "Mar 4", "Mar 11", "Mar 18", "Mar 25", "Apr 1", "Apr 8", "Apr 15", "Apr 22", "Apr 29"],
    trend: {
      presence: {
        colgate:   [86.1, 86.0, 82.1, 78.2, 76.4, 77.7, 82.5, 80.0, 75.3, 74.9, 77.3, 78.3, 77.6],
        oralb:     [21.4, 21.5, 26.2, 29.1, 32.1, 31.2, 30.3, 32.4, 31.3, 30.0, 31.9, 29.1, 24.9],
        crest:     [20.5, 19.0, 22.3, 25.4, 28.0, 27.1, 27.3, 27.2, 27.4, 26.1, 30.0, 26.1, 25.6],
        sensodyne: [19.1, 17.9, 20.5, 23.9, 27.1, 25.2, 26.6, 26.7, 24.3, 23.8, 27.4, 25.1, 22.9],
        aquafresh: [ 0.9,  1.0,  0.8,  0.4,  1.2,  1.1,  0.5,  0.8,  0.7,  0.3,  0.5,  0.9,  1.7],
        pepsodent: [ 0.3,  0.3,  0.1,  0.1,  0.5,  0.1,  0.1,  0.2,  0.1,  0.4,  0.3,  0.2,  0.0],
      },
      mentionCount: {
        colgate:   [1314, 1416, 934, 725, 704, 712, 795, 735, 666, 756, 779, 709, 312],
        oralb:     [ 326,  354, 298, 270, 296, 286, 292, 298, 277, 303, 322, 263, 100],
        crest:     [ 313,  313, 254, 235, 258, 248, 263, 250, 242, 264, 302, 236, 103],
        sensodyne: [ 291,  295, 233, 222, 250, 231, 256, 245, 215, 240, 276, 227,  92],
        aquafresh: [  13,   17,   9,   4,  11,  10,   5,   7,   6,   3,   5,   8,   7],
        pepsodent: [   5,    5,   1,   1,   5,   1,   1,   2,   1,   4,   3,   2,   0],
      },
      sentiment: { colgate: [92.21, 93.0, 92.86, 93.54, 94.4, 94.99, 95.58, 94.09, 95.07, 95.21, 93.7, 95.15, 96.39] },
      position:  { colgate: [92.39, 94.07, 91.76, 90.48, 89.06, 87.22, 89.06, 88.44, 86.04, 89.29, 85.88, 87.59, 90.71] },
    },
    tableDates: ["Feb 4", "Mar 18", "Apr 29"],
    tableDateIdxs: [0, 6, 12],
  },
}

// Build flat recharts data array for the active range
function buildLineData(
  metrics: MetricKey[],
  dates: string[],
  trend: RangeTrend,
) {
  return dates.map((date, i) => {
    const pt: Record<string, unknown> = { date }
    for (const m of metrics) {
      const t = trend[m] ?? {}
      const entities = COMPETITOR_METRICS.has(m) ? ENTITIES : [ENTITIES[0]]
      for (const e of entities) {
        pt[`${m}_${e.id}`] = t[e.id]?.[i] ?? null
      }
    }
    return pt
  })
}

// Average of an array
function avg(arr: number[]) {
  const valid = arr.filter((v) => v != null)
  return valid.length ? +(valid.reduce((a, b) => a + b, 0) / valid.length).toFixed(1) : null
}

// ─── Filter definitions (values sourced from Scrunch AI MCP) ─────────────────
type FilterValue = { label: string; slug: string }
type FilterDef   = { key: string; label: string; op: string; values: FilterValue[] }

const FILTER_DEFS: FilterDef[] = [
  {
    key: "platform", label: "Platform", op: "is",
    values: [
      { label: "ChatGPT",            slug: "chatgpt"             },
      { label: "Perplexity",         slug: "perplexity"          },
      { label: "Claude",             slug: "claude"              },
      { label: "Google AI Overviews",slug: "google_ai_overviews" },
      { label: "Copilot",            slug: "copilot"             },
    ],
  },
  {
    key: "stage", label: "Stage", op: "is",
    values: [
      { label: "Awareness",     slug: "awareness"     },
      { label: "Consideration", slug: "consideration" },
      { label: "Decision",      slug: "decision"      },
    ],
  },
  {
    key: "brandedQuery", label: "Search enabled", op: "is",
    values: [
      { label: "Branded",     slug: "true"  },
      { label: "Non-branded", slug: "false" },
    ],
  },
  {
    key: "persona", label: "Persona", op: "is",
    values: [], // no personas configured for this brand
  },
  {
    key: "topic", label: "Topic", op: "is",
    values: [], // no topics configured for this brand
  },
  {
    key: "country", label: "Country", op: "is",
    values: [
      { label: "United States",   slug: "US" },
      { label: "United Kingdom",  slug: "GB" },
      { label: "Australia",       slug: "AU" },
      { label: "Canada",          slug: "CA" },
      { label: "Germany",         slug: "DE" },
      { label: "France",          slug: "FR" },
    ],
  },
  {
    key: "tag", label: "Tag", op: "is",
    // live from get_tags (brand_id 4295)
    values: [
      { label: "benefits",   slug: "41461" },
      { label: "subjective", slug: "20457" },
    ],
  },
  {
    key: "competitor", label: "Competitor", op: "is",
    // live from list_competitors (brand_id 4295)
    values: [
      { label: "Aquafresh", slug: "28948" },
      { label: "Crest",     slug: "28944" },
      { label: "Oral-B",    slug: "28947" },
      { label: "Pepsodent", slug: "28946" },
      { label: "Sensodyne", slug: "28945" },
    ],
  },
]

// ─── Breakdown options ────────────────────────────────────────────────────────
const BREAKDOWN_OPTIONS = ["Competitor", "Platform", "Buyer-journey stage", "Persona", "Topic", "Country", "Tag"]
const LETTERS = "ABCDEFGHIJ"

type ChartType = "line" | "stacked-line" | "column" | "stacked-column" | "bar" | "stacked-bar" | "pie" | "table" | "metric"

const CHART_OPTIONS: { type: ChartType; label: string; available: boolean }[] = [
  { type: "line",           label: "Line",           available: true  },
  { type: "stacked-line",   label: "Stacked line",   available: false },
  { type: "column",         label: "Column",         available: true  },
  { type: "stacked-column", label: "Stacked column", available: false },
  { type: "bar",            label: "Bar",            available: true  },
  { type: "stacked-bar",    label: "Stacked bar",    available: false },
  { type: "pie",            label: "Pie",            available: true  },
  { type: "table",          label: "Table",          available: true  },
  { type: "metric",         label: "Metric",         available: true  },
]

type ActiveFilter = { property: string; op: string; value: string }

// ─── Click-outside hook ───────────────────────────────────────────────────────
function useClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return
      handler()
    }
    document.addEventListener("mousedown", fn)
    return () => document.removeEventListener("mousedown", fn)
  }, [ref, handler])
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ExplorerPage() {
  const [range, setRange]               = useState("7D")
  const [activeMetrics, setActiveMetrics] = useState<MetricKey[]>(["presence"])
  const [breakdown, setBreakdown]       = useState<string | null>("Competitor")

  // ── Filters ────────────────────────────────────────────────────────────────
  const [filters, setFilters] = useState<ActiveFilter[]>([
    { property: "Search enabled", op: "is", value: "Branded" },
  ])
  // two-step pending filter: null → 'prop' → 'value'
  const [pendingStep,    setPendingStep]    = useState<"prop" | "value" | null>(null)
  const [pendingPropKey, setPendingPropKey] = useState<string | null>(null)
  const [showFilterPropDrop, setShowFilterPropDrop] = useState(false)
  const [showFilterValDrop,  setShowFilterValDrop]  = useState(false)

  const [showMetricDropdown,    setShowMetricDropdown]    = useState(false)
  const [showBreakdownDropdown, setShowBreakdownDropdown] = useState(false)
  const [chartType,             setChartType]             = useState<ChartType>("line")
  const [showChartTypeDrop,     setShowChartTypeDrop]     = useState(false)
  const [compare,               setCompare]               = useState("No compare")
  const [showCompare,           setShowCompare]           = useState(false)
  const [granularity,           setGranularity]           = useState("Week")
  const [showGranularity,       setShowGranularity]       = useState(false)

  const metricDropdownRef    = useRef<HTMLDivElement>(null)
  const breakdownDropdownRef = useRef<HTMLDivElement>(null)
  const filterPropRef        = useRef<HTMLDivElement>(null)
  const filterValRef         = useRef<HTMLDivElement>(null)
  const chartTypeDropRef     = useRef<HTMLDivElement>(null)
  const compareDropRef       = useRef<HTMLDivElement>(null)
  const granularityDropRef   = useRef<HTMLDivElement>(null)
  useClickOutside(metricDropdownRef,    () => setShowMetricDropdown(false))
  useClickOutside(breakdownDropdownRef, () => setShowBreakdownDropdown(false))
  useClickOutside(filterPropRef, () => setShowFilterPropDrop(false))
  useClickOutside(filterValRef,  () => setShowFilterValDrop(false))
  useClickOutside(chartTypeDropRef, () => setShowChartTypeDrop(false))
  useClickOutside(compareDropRef,   () => setShowCompare(false))
  useClickOutside(granularityDropRef, () => setShowGranularity(false))

  // Sync granularity default with selected range
  useEffect(() => {
    setGranularity(range === "7D" ? "Day" : "Week")
  }, [range])

  function startAddFilter() {
    setPendingStep("prop")
    setPendingPropKey(null)
    setShowFilterPropDrop(true)
    setShowFilterValDrop(false)
  }
  function cancelPending() {
    setPendingStep(null)
    setPendingPropKey(null)
    setShowFilterPropDrop(false)
    setShowFilterValDrop(false)
  }
  function selectFilterProp(key: string) {
    setPendingPropKey(key)
    setPendingStep("value")
    setShowFilterPropDrop(false)
    setShowFilterValDrop(true)
  }
  function selectFilterValue(val: FilterValue) {
    const def = FILTER_DEFS.find((d) => d.key === pendingPropKey)
    if (!def) return
    setFilters((prev) => [...prev, { property: def.label, op: def.op, value: val.label }])
    cancelPending()
  }
  function removeFilter(i: number) {
    setFilters((prev) => prev.filter((_, idx) => idx !== i))
  }

  const pendingDef   = pendingPropKey ? FILTER_DEFS.find((d) => d.key === pendingPropKey) ?? null : null

  // Active dataset switches with the range picker
  const dataset = RANGE_DATASETS[range]
  const { dates, trend, tableDates, tableDateIdxs } = dataset

  const lineData = buildLineData(activeMetrics, dates, trend)

  // All series: for each active metric, competitor-level or brand-level depending on the metric
  const allSeries = activeMetrics.flatMap((m) => {
    const entities = COMPETITOR_METRICS.has(m) ? ENTITIES : [ENTITIES[0]]
    return entities.map((e) => ({
      key:      `${m}_${e.id}`,
      label:    COMPETITOR_METRICS.has(m)
                  ? `${METRIC_META[m].label} · ${e.label}`
                  : `${METRIC_META[m].label} · Colgate`,
      color:    e.color,
      metric:   m,
      entityId: e.id,
      suffix:   METRIC_META[m].suffix,
      dashed:   activeMetrics.indexOf(m) > 0,
    }))
  })

  const chartTitle = activeMetrics
    .map((k) =>
      COMPETITOR_METRICS.has(k)
        ? `${METRIC_META[k].label} · Colgate vs. Competitors`
        : `${METRIC_META[k].label} · Colgate`
    )
    .join(", ")

  const visibleLegend = allSeries.slice(0, 5)
  const extraCount    = allSeries.length - visibleLegend.length

  function removeMetric(key: MetricKey) {
    setActiveMetrics((prev) => prev.filter((k) => k !== key))
  }
  function addMetric(key: MetricKey) {
    if (!activeMetrics.includes(key)) setActiveMetrics((prev) => [...prev, key])
    setShowMetricDropdown(false)
  }

  const nextLetter = LETTERS[activeMetrics.length] ?? "+"

  // Table rows: one row per series — uses active range's trend data
  const tableRows = allSeries.map((s) => {
    const series = trend[s.metric]?.[s.entityId] ?? []
    return {
      metricLabel: METRIC_META[s.metric].label,
      label:       s.label.replace(`${METRIC_META[s.metric].label} · `, ""),
      color:       s.color,
      suffix:      s.suffix,
      average:     avg(series),
      values:      dates.map((_, i) => series[i] ?? null),
    }
  })

  // Averages per series — used by bar / pie / metric chart types
  const snapshotData = allSeries.map((s) => {
    const ser = trend[s.metric]?.[s.entityId] ?? []
    return {
      name:   s.label.replace(`${METRIC_META[s.metric].label} · `, ""),
      value:  avg(ser) ?? 0,
      color:  s.color,
      suffix: s.suffix,
      key:    s.key,
    }
  })

  return (
    <div className="space-y-5">

      {/* ── Full-width header ─────────────────────────── */}
      <div className="flex items-center justify-between pb-5">
        <h1 className="font-sans font-semibold text-[36px] text-ink leading-none tracking-[-1px]">Explorer</h1>

        {/* ── Controls ─────────────────────────────────── */}
        <div className="flex items-center gap-1.5">

          {/* Custom date button */}
          <button className="flex items-center gap-1.5 rounded-scrunch-sm border border-s-neutral-200 bg-white px-3 py-1.5 text-[13px] text-ink/60 hover:bg-s-neutral-50 dark:bg-white dark:border-white/20 dark:text-ink dark:hover:bg-white/90 transition-colors">
            <Icon name="calendar_month" size={15} className="shrink-0" />
            Custom
          </button>

          {/* Date range toggle */}
          <div className="flex items-center rounded-scrunch-sm bg-s-neutral-100 dark:bg-white/10 p-0.5 gap-0.5">
            {(["7D", "30D", "3M"] as const).map((r) => (
              <button key={r} onClick={() => setRange(r)}
                className={`px-2.5 py-1 text-[12.5px] rounded-scrunch-xs transition-colors ${
                  range === r
                    ? "bg-white text-ink font-medium shadow-scrunch-sm dark:bg-white dark:text-ink"
                    : "text-ink/50 hover:text-ink/70 dark:text-white/50 dark:hover:text-white/80"
                }`}>{r}
              </button>
            ))}
          </div>

          {/* Compare dropdown — sits right next to the date range */}
          <div className="relative" ref={compareDropRef}>
            <button
              onClick={() => setShowCompare((v) => !v)}
              className={`flex items-center gap-1.5 rounded-scrunch-sm border px-3 py-1.5 text-[13px] transition-colors ${
                compare !== "No compare"
                  ? "border-s-blue-300 bg-s-blue-50 text-s-blue-700 hover:bg-s-blue-100 dark:border-s-blue-300 dark:bg-s-blue-50 dark:text-s-blue-700"
                  : "border-s-neutral-200 bg-white text-ink/60 hover:bg-s-neutral-50 dark:bg-white dark:border-white/20 dark:text-ink dark:hover:bg-white/90"
              }`}
            >
              {compare === "No compare" ? "Compare" : compare}
              <ChevronDown className="h-3 w-3 opacity-60" />
            </button>
            {showCompare && (
              <div className="absolute top-[calc(100%+4px)] left-0 min-w-[180px] bg-white dark:bg-[#2a2520] border border-s-neutral-200 dark:border-white/10 rounded-scrunch-sm shadow-scrunch-md z-50 overflow-hidden">
                {(["No compare", "Previous day", "Previous week", "Previous month", "Previous quarter", "Previous period", "Previous year"] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setCompare(opt); setShowCompare(false) }}
                    className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors ${
                      opt === compare ? "bg-s-neutral-100 dark:bg-white/10 text-ink font-medium" : "text-ink dark:text-paper hover:bg-s-neutral-50 dark:hover:bg-white/5"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Visual separator */}
          <div className="mx-1 h-4 w-px bg-s-neutral-200 dark:bg-white/15" />

          {/* Granularity dropdown */}
          <div className="relative" ref={granularityDropRef}>
            <button
              onClick={() => setShowGranularity((v) => !v)}
              className="flex items-center gap-1.5 rounded-scrunch-sm border border-s-neutral-200 bg-white px-3 py-1.5 text-[13px] text-ink/60 hover:bg-s-neutral-50 dark:bg-white dark:border-white/20 dark:text-ink dark:hover:bg-white/90 transition-colors"
            >
              {granularity}
              <ChevronDown className="h-3 w-3 opacity-60" />
            </button>
            {showGranularity && (
              <div className="absolute top-[calc(100%+4px)] left-0 min-w-[130px] bg-white dark:bg-[#2a2520] border border-s-neutral-200 dark:border-white/10 rounded-scrunch-sm shadow-scrunch-md z-50 overflow-hidden">
                {(["Day", "Week", "Month", "Quarter"] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => { setGranularity(g); setShowGranularity(false) }}
                    className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors ${
                      g === granularity ? "bg-s-neutral-100 dark:bg-white/10 text-ink font-medium" : "text-ink dark:text-paper hover:bg-s-neutral-50 dark:hover:bg-white/5"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Chart type dropdown */}
          <div className="relative" ref={chartTypeDropRef}>
            <button
              onClick={() => setShowChartTypeDrop((v) => !v)}
              className="flex items-center gap-1.5 rounded-scrunch-sm border border-s-neutral-200 bg-white px-3 py-1.5 text-[13px] text-ink/60 hover:bg-s-neutral-50 dark:bg-white dark:border-white/20 dark:text-ink dark:hover:bg-white/90 transition-colors"
            >
              <Icon name="show_chart" size={15} className="shrink-0 opacity-70" />
              {CHART_OPTIONS.find((o) => o.type === chartType)?.label ?? "Line"}
              <ChevronDown className="h-3 w-3 opacity-60" />
            </button>
              {showChartTypeDrop && (
                <div className="absolute top-[calc(100%+4px)] right-0 min-w-[160px] bg-white dark:bg-[#2a2520] border border-s-neutral-200 dark:border-white/10 rounded-scrunch-sm shadow-scrunch-md z-50 overflow-hidden">
                  {CHART_OPTIONS.map((opt) => (
                    <button
                      key={opt.type}
                      disabled={!opt.available}
                      onClick={() => { if (opt.available) { setChartType(opt.type); setShowChartTypeDrop(false) } }}
                      className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors ${
                        opt.type === chartType
                          ? "bg-s-neutral-100 dark:bg-white/10 text-ink font-medium"
                          : opt.available
                          ? "text-ink dark:text-paper hover:bg-s-neutral-50 dark:hover:bg-white/5"
                          : "text-ink/25 dark:text-white/20 cursor-not-allowed"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

      {/* ── Two-column layout ─────────────────────────── */}
      <div className="flex gap-5 items-start">

        {/* ── Main content ────────────────────────────── */}
        <div className="flex-1 min-w-0 space-y-5">

          {/* Chart card — hidden in table mode */}
          {chartType !== "table" && (
          <div className="rounded-scrunch-lg bg-white shadow-scrunch-sm px-5 pt-5 pb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13.5px] font-medium text-ink/80 leading-snug">{chartTitle}</span>
              <button className="shrink-0 ml-2 text-ink/30 hover:text-ink/60 transition-colors">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>

            {/* Legend — not shown for metric view */}
            {chartType !== "metric" && (
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              {visibleLegend.map((s) => (
                <span key={s.key} className="flex items-center gap-1.5 text-[11.5px] text-ink/55">
                  <span className="h-2 w-2 shrink-0" style={{ backgroundColor: s.color }} />
                  {s.label}
                </span>
              ))}
              {extraCount > 0 && (
                <span className="text-[11.5px] text-s-blue-500 cursor-pointer hover:text-s-blue-600 transition-colors">
                  +{extraCount} more
                </span>
              )}
            </div>
            )}

            {/* Metric view: big number cards */}
            {chartType === "metric" && (
              <div className="grid grid-cols-2 gap-3 mt-1 mb-1">
                {snapshotData.map((s) => (
                  <div key={s.key} className="rounded-scrunch-md bg-s-neutral-50 border border-s-neutral-100 p-4">
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="h-2 w-2 shrink-0" style={{ backgroundColor: s.color }} />
                      <span className="text-[11.5px] text-ink/55 truncate leading-tight">{s.name}</span>
                    </div>
                    <span className="font-plex-mono text-[26px] font-medium text-ink leading-none">
                      {s.value != null ? `${s.value}${s.suffix}` : "–"}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Time-series and snapshot charts */}
            {chartType !== "metric" && (
            <ResponsiveContainer width="100%" height={280}>
              {chartType === "column" ? (
                <BarChart data={lineData} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
                  <CartesianGrid strokeDasharray="2 3" stroke="var(--chart-grid)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: neutral500 }} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, "auto"]} tick={{ fontSize: 11, fill: neutral500 }} tickLine={false} axisLine={false} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null
                      return (
                        <div className="px-4 py-3 min-w-[260px]" style={{ borderRadius: 10, border: "1px solid var(--tooltip-border)", background: "var(--tooltip-bg)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)", boxShadow: "var(--tooltip-shadow)" }}>
                          <p className="text-[13px] font-semibold text-ink mb-2.5">{label}</p>
                          <div className="space-y-1.5">
                            {payload.map((entry) => {
                              const s = allSeries.find((s) => s.key === entry.dataKey)
                              if (!s || entry.value == null) return null
                              return (
                                <div key={entry.dataKey as string} className="flex items-center gap-2">
                                  <span className="h-2 w-2 shrink-0" style={{ backgroundColor: s.color }} />
                                  <span className="flex-1 text-[12px] text-ink/70 truncate">{s.label}</span>
                                  <span className="text-[12px] font-plex-mono text-ink tabular-nums ml-3">{entry.value}{s.suffix}</span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )
                    }}
                  />
                  {allSeries.map((s) => (
                    <Bar key={s.key} dataKey={s.key} fill={s.color} name={s.label} maxBarSize={16} />
                  ))}
                </BarChart>
              ) : chartType === "bar" ? (
                <BarChart layout="vertical" data={snapshotData} margin={{ top: 4, right: 40, bottom: 0, left: 64 }}>
                  <CartesianGrid strokeDasharray="2 3" stroke="var(--chart-grid)" horizontal={false} />
                  <XAxis type="number" domain={[0, "auto"]} tick={{ fontSize: 11, fill: neutral500 }} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: neutral500 }} tickLine={false} axisLine={false} width={60} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null
                      const d = payload[0]?.payload as { name: string; value: number; color: string; suffix: string }
                      return (
                        <div className="px-3 py-2" style={{ borderRadius: 10, border: "1px solid var(--tooltip-border)", background: "var(--tooltip-bg)", backdropFilter: "blur(4px)", boxShadow: "var(--tooltip-shadow)" }}>
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 shrink-0" style={{ backgroundColor: d?.color }} />
                            <span className="text-[12px] text-ink/70">{d?.name}</span>
                            <span className="text-[12px] font-plex-mono text-ink tabular-nums ml-2">{d?.value}{d?.suffix}</span>
                          </div>
                        </div>
                      )
                    }}
                  />
                  <Bar dataKey="value" maxBarSize={20}>
                    {snapshotData.map((entry) => (
                      <Cell key={entry.key} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              ) : chartType === "pie" ? (
                <PieChart margin={{ top: 4, right: 8, bottom: 4, left: 8 }}>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null
                      const d = payload[0]?.payload as { name: string; value: number; color: string; suffix: string }
                      return (
                        <div className="px-3 py-2" style={{ borderRadius: 10, border: "1px solid var(--tooltip-border)", background: "var(--tooltip-bg)", backdropFilter: "blur(4px)", boxShadow: "var(--tooltip-shadow)" }}>
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 shrink-0" style={{ backgroundColor: d?.color }} />
                            <span className="text-[12px] text-ink/70">{d?.name}</span>
                            <span className="text-[12px] font-plex-mono text-ink tabular-nums ml-2">{d?.value}{d?.suffix}</span>
                          </div>
                        </div>
                      )
                    }}
                  />
                  <Pie data={snapshotData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} strokeWidth={1}>
                    {snapshotData.map((entry) => (
                      <Cell key={entry.key} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              ) : (
                <LineChart data={lineData} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
                  <CartesianGrid strokeDasharray="2 3" stroke="var(--chart-grid)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: neutral500 }} tickLine={false} axisLine={false} />
                  <YAxis
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fontSize: 11, fill: neutral500 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null
                      return (
                        <div
                          className="px-4 py-3 min-w-[260px]"
                          style={{
                            borderRadius: 10,
                            border: "1px solid var(--tooltip-border)",
                            background: "var(--tooltip-bg)",
                            backdropFilter: "blur(4px)",
                            WebkitBackdropFilter: "blur(4px)",
                            boxShadow: "var(--tooltip-shadow)",
                          }}
                        >
                          <p className="text-[13px] font-semibold text-ink mb-2.5">{label}</p>
                          <div className="space-y-1.5">
                            {payload.map((entry) => {
                              const s = allSeries.find((s) => s.key === entry.dataKey)
                              if (!s || entry.value == null) return null
                              return (
                                <div key={entry.dataKey as string} className="flex items-center gap-2">
                                  <span className="h-2 w-2 shrink-0" style={{ backgroundColor: s.color }} />
                                  <span className="flex-1 text-[12px] text-ink/70 truncate">{s.label}</span>
                                  <span className="text-[12px] font-plex-mono text-ink tabular-nums ml-3">
                                    {entry.value}{s.suffix}
                                  </span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )
                    }}
                  />
                  {allSeries.map((s) => (
                    <Line
                      key={s.key}
                      type="monotone"
                      dataKey={s.key}
                      stroke={s.color}
                      strokeWidth={1.5}
                      strokeDasharray={s.dashed ? "4 2" : undefined}
                      dot={false}
                      name={s.label}
                      connectNulls
                    />
                  ))}
                </LineChart>
              )}
            </ResponsiveContainer>
            )}
          </div>
          )}

          {/* Data table */}
          <div className="rounded-scrunch-lg bg-white shadow-scrunch-sm overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-s-neutral-100">
                  <th className="text-left px-5 py-3 text-[12px] font-medium text-ink/50 w-[160px]">Metric</th>
                  <th className="text-left px-5 py-3 text-[12px] font-medium text-ink/50">
                    <div className="flex items-center gap-1">{breakdown ?? "Series"}<ChevronDown className="h-3 w-3" /></div>
                  </th>
                  <th className="text-right px-4 py-3 text-[12px] font-medium text-ink/50">Average</th>
                  {tableDates.map((d) => (
                    <th key={d} className="text-right px-4 py-3 text-[12px] font-medium text-ink/50">{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, i) => (
                  <tr key={i} className="border-b border-s-neutral-100 last:border-0">
                    <td className="px-5 py-2.5 text-[13px] text-ink/80 font-medium">
                      {i === 0 || tableRows[i - 1].metricLabel !== row.metricLabel ? row.metricLabel : ""}
                    </td>
                    <td className="px-5 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 shrink-0" style={{ backgroundColor: row.color }} />
                        <span className="text-[13px] text-ink/75">{row.label}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-right text-[13px] font-plex-mono tabular-nums text-ink">
                      {row.average != null ? `${row.average}${row.suffix}` : "–"}
                    </td>
                    {tableDateIdxs.map((di) => (
                      <td key={di} className="px-4 py-2.5 text-right text-[13px] font-plex-mono tabular-nums text-ink">
                        {row.values[di] != null ? `${row.values[di]}${row.suffix}` : "–"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* ── Right query panel ─────────────────────────── */}
        <div className="w-[264px] shrink-0 self-start sticky top-6">
          <div className="rounded-scrunch-lg bg-white dark:bg-[#1e1b17] shadow-scrunch-sm overflow-visible">

            <div className="px-5 py-3.5 border-b border-s-neutral-100 dark:border-white/8">
              <span className="text-[13.5px] font-semibold text-ink">Query</span>
            </div>

            {/* Metrics */}
            <div className="px-5 py-4 border-b border-s-neutral-100 dark:border-white/8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13.5px] font-semibold text-ink">Metrics</span>
                <button onClick={() => setShowMetricDropdown((v) => !v)} className="text-ink/40 hover:text-ink/70 transition-colors">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-2">
                {activeMetrics.map((key, i) => (
                  <div key={key} className="border border-s-neutral-200 dark:border-white/10 rounded-scrunch-sm">
                    <div className="flex items-center gap-2.5 px-3 py-2.5">
                      <span className="h-5 w-5 rounded-[4px] bg-s-neutral-100 dark:bg-white/10 flex items-center justify-center text-[10px] font-medium text-ink/50 font-plex-mono shrink-0">
                        {LETTERS[i]}
                      </span>
                      <span className="flex-1 text-[13px] text-ink">{METRIC_META[key].label}</span>
                      <button onClick={() => removeMetric(key)} className="text-ink/30 hover:text-ink/60 transition-colors shrink-0">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="border-t border-s-neutral-100 dark:border-white/8 px-3 py-2 flex items-center gap-2">
                      <span className="font-plex-mono text-[10px] text-ink/35 tracking-wide">FOR</span>
                      <span className="text-[13px] text-ink/70">
                        {COMPETITOR_METRICS.has(key) ? "Colgate vs. competitors" : "Colgate"}
                      </span>
                    </div>
                  </div>
                ))}

                <div className="relative" ref={metricDropdownRef}>
                  <button
                    onClick={() => setShowMetricDropdown((v) => !v)}
                    className="w-full border border-s-neutral-200 dark:border-white/10 border-dashed rounded-scrunch-sm flex items-center gap-2.5 px-3 py-2.5 hover:bg-s-neutral-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <span className="h-5 w-5 rounded-[4px] bg-s-neutral-100 dark:bg-white/10 flex items-center justify-center text-[10px] font-medium text-ink/40 font-plex-mono shrink-0">
                      {nextLetter}
                    </span>
                    <span className="text-[13px] text-ink/45">Add Metric</span>
                  </button>
                  {showMetricDropdown && (
                    <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white dark:bg-[#2a2520] border border-s-neutral-200 dark:border-white/10 rounded-scrunch-sm shadow-scrunch-md z-50 overflow-hidden">
                      {METRIC_OPTIONS.map((opt) => {
                        const isActive = activeMetrics.includes(opt.key as MetricKey)
                        const disabled = !opt.available || isActive
                        return (
                          <button key={opt.key} disabled={disabled} onClick={() => addMetric(opt.key as MetricKey)}
                            className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors ${
                              isActive ? "bg-s-neutral-50 dark:bg-white/5 text-ink/40 cursor-default"
                              : opt.available ? "text-ink hover:bg-s-neutral-50 dark:hover:bg-white/5"
                              : "text-ink/30 cursor-not-allowed"
                            }`}>
                            {opt.label}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Filter */}
            <div className="px-5 py-4 border-b border-s-neutral-100 dark:border-white/8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13.5px] font-semibold text-ink">Filter</span>
                {pendingStep === null && (
                  <button onClick={startAddFilter} className="text-ink/40 hover:text-ink/70 transition-colors">
                    <Plus className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {/* Active filter chips */}
                {filters.map((f, i) => (
                  <div key={i} className="border border-s-neutral-200 dark:border-white/10 rounded-scrunch-sm px-3 py-2.5 flex items-center gap-2 text-[13px]">
                    <span className="text-ink/70 shrink-0">{f.property}</span>
                    <span className="px-1.5 py-0.5 rounded bg-s-neutral-100 dark:bg-white/10 text-[10.5px] text-ink/45 font-plex-mono shrink-0">{f.op}</span>
                    <span className="flex-1 text-ink">{f.value}</span>
                    <button onClick={() => removeFilter(i)} className="text-ink/30 hover:text-ink/60 transition-colors shrink-0">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}

                {/* Step 1 — select property */}
                {pendingStep === "prop" && (
                  <div className="relative" ref={filterPropRef}>
                    <button
                      onClick={() => setShowFilterPropDrop((v) => !v)}
                      className="w-full border border-s-neutral-200 dark:border-white/10 rounded-scrunch-sm px-3 py-2.5 flex items-center justify-between text-[13px] text-ink/45 hover:bg-s-neutral-50 dark:hover:bg-white/5 transition-colors"
                    >
                      <span>Select a filter</span>
                      <div className="flex items-center gap-1.5">
                        <ChevronDown className="h-3.5 w-3.5" />
                        <button
                          onClick={(e) => { e.stopPropagation(); cancelPending() }}
                          className="text-ink/30 hover:text-ink/60 transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </button>
                    {showFilterPropDrop && (
                      <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white dark:bg-[#2a2520] border border-s-neutral-200 dark:border-white/10 rounded-scrunch-sm shadow-scrunch-md z-50 overflow-hidden">
                        {FILTER_DEFS.map((def) => (
                          <button
                            key={def.key}
                            onClick={() => selectFilterProp(def.key)}
                            className="w-full text-left px-4 py-2.5 text-[13px] text-ink hover:bg-s-neutral-50 dark:hover:bg-white/5 transition-colors"
                          >
                            {def.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2 — select value */}
                {pendingStep === "value" && pendingDef && (
                  <div className="relative" ref={filterValRef}>
                    <button
                      onClick={() => setShowFilterValDrop((v) => !v)}
                      className="w-full border border-s-neutral-200 dark:border-white/10 rounded-scrunch-sm px-3 py-2.5 flex items-center gap-2 text-[13px] hover:bg-s-neutral-50 dark:hover:bg-white/5 transition-colors"
                    >
                      <span className="text-ink/70 shrink-0">{pendingDef.label}</span>
                      <span className="px-1.5 py-0.5 rounded bg-s-neutral-100 dark:bg-white/10 text-[10.5px] text-ink/45 font-plex-mono shrink-0">{pendingDef.op}</span>
                      <span className="flex-1 text-left text-ink/40">Select value</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <ChevronDown className="h-3.5 w-3.5 text-ink/40" />
                        <button
                          onClick={(e) => { e.stopPropagation(); cancelPending() }}
                          className="text-ink/30 hover:text-ink/60 transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </button>
                    {showFilterValDrop && (
                      <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white dark:bg-[#2a2520] border border-s-neutral-200 dark:border-white/10 rounded-scrunch-sm shadow-scrunch-md z-50 overflow-hidden">
                        {pendingDef.values.length > 0 ? (
                          pendingDef.values.map((val) => (
                            <button
                              key={val.slug}
                              onClick={() => selectFilterValue(val)}
                              className="w-full text-left px-4 py-2.5 text-[13px] text-ink hover:bg-s-neutral-50 dark:hover:bg-white/5 transition-colors"
                            >
                              {val.label}
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-[12.5px] text-ink/40 italic">
                            No {pendingDef.label.toLowerCase()}s configured
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Add another filter button (shown after at least one filter + no pending) */}
                {pendingStep === null && filters.length > 0 && (
                  <button
                    onClick={startAddFilter}
                    className="w-full border border-s-neutral-200 dark:border-white/10 border-dashed rounded-scrunch-sm px-3 py-2 flex items-center gap-2 text-[12.5px] text-ink/40 hover:bg-s-neutral-50 dark:hover:bg-white/5 hover:text-ink/60 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add filter
                  </button>
                )}
              </div>
            </div>

            {/* Breakdown */}
            <div className="px-5 py-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13.5px] font-semibold text-ink">Breakdown</span>
                {!breakdown && (
                  <button onClick={() => setShowBreakdownDropdown((v) => !v)} className="text-ink/40 hover:text-ink/70 transition-colors">
                    <Plus className="h-4 w-4" />
                  </button>
                )}
              </div>
              {breakdown ? (
                <div className="border border-s-neutral-200 dark:border-white/10 rounded-scrunch-sm px-3 py-2.5 flex items-center text-[13px]">
                  <span className="flex-1 text-ink">{breakdown}</span>
                  <button onClick={() => setBreakdown(null)} className="text-ink/30 hover:text-ink/60 transition-colors shrink-0 ml-2">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div className="relative" ref={breakdownDropdownRef}>
                  <button
                    onClick={() => setShowBreakdownDropdown((v) => !v)}
                    className="w-full border border-s-neutral-200 dark:border-white/10 rounded-scrunch-sm px-3 py-2.5 flex items-center justify-between text-[13px] text-ink/45 hover:bg-s-neutral-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <span>Select a dimension</span>
                    <div className="flex items-center gap-1.5">
                      <ChevronDown className="h-3.5 w-3.5" />
                      <X className="h-3.5 w-3.5 text-ink/30" />
                    </div>
                  </button>
                  {showBreakdownDropdown && (
                    <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white dark:bg-[#2a2520] border border-s-neutral-200 dark:border-white/10 rounded-scrunch-sm shadow-scrunch-md z-50 overflow-hidden">
                      {BREAKDOWN_OPTIONS.map((dim) => (
                        <button key={dim} onClick={() => { setBreakdown(dim); setShowBreakdownDropdown(false) }}
                          className="w-full text-left px-4 py-2.5 text-[13px] text-ink hover:bg-s-neutral-50 dark:hover:bg-white/5 transition-colors">
                          {dim}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>{/* end two-column */}
    </div>
  )
}
