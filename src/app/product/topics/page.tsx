"use client"

import { useState } from "react"
import { Icon } from "@/components/icon"
import {
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { CHART_COLORS_12 } from "@/lib/chart-palette"

// ─── Color tokens ─────────────────────────────────────────────────────────────

const neutral500 = "#93886F"

const tooltipStyle = {
  fontSize: 12,
  borderRadius: 10,
  border: "1px solid var(--tooltip-border)",
  background: "var(--tooltip-bg)",
  backdropFilter: "blur(4px)",
  WebkitBackdropFilter: "blur(4px)",
  boxShadow: "var(--tooltip-shadow)",
}

// ─── Mention rate card data ───────────────────────────────────────────────────
// Topics sorted highest → lowest pct; CHART_COLORS_12 index = mention-rate rank.
// Color 1 (darkest) goes to the highest-mention topic, cascading dark→light.

const topics = [
  { id: "toothpaste",   name: "Toothpaste ingredients a...", label: "Toothpaste Ingredients and Benefits", pct: 88.2, delta: 6.6  },
  { id: "whitening",    name: "Teeth whitening techniqu...",  label: "Teeth Whitening Techniques",          pct: 86.4, delta: 5.3  },
  { id: "oralRoutines", name: "Daily oral care routines",     label: "Daily Oral Care Routines",           pct: 84.1, delta: 4.8  },
  { id: "dentalCare",   name: "Professional dental care ...", label: "Professional Dental Care Services",   pct: 80.0, delta: -0.3 },
  { id: "cavityPrev",   name: "Cavity prevention tips",       label: "Cavity Prevention",                  pct: 78.9, delta: 1.7  },
  { id: "tartar",       name: "Tartar control methods",       label: "Tartar Control Methods",              pct: 77.6, delta: -5.1 },
  { id: "flossing",     name: "Benefits of dental flossing",  label: "Benefits of Dental Flossing",        pct: 72.3, delta: 2.1  },
  { id: "sensitivity",  name: "Managing tooth sensitivity",   label: "Managing Tooth Sensitivity",          pct: 67.1, delta: -7.4 },
  { id: "toothbrush",   name: "Choosing the right toothb...", label: "Choosing the Right Toothbrush",      pct: 65.8, delta: -3.2 },
  { id: "whiteStrips",  name: "Whitening strips vs paste",    label: "Whitening Strips vs Toothpaste",    pct: 61.4, delta: -9.2 },
].map((t, i) => ({ ...t, color: CHART_COLORS_12[i] }))

// Persistent color lookup — same topic always gets the same color everywhere.
const topicColor: Record<string, string> = Object.fromEntries(
  topics.map((t) => [t.id, t.color])
)
// Extra topic not in the main 10 — next available slot (index 10)
const oralHygieneColor = CHART_COLORS_12[10]


const sentimentScores = [
  { name: "Choosing The Right Toothbrush",  score: 100,  color: topicColor["toothbrush"]   },
  { name: "Daily Oral Care Routines",        score: 100,  color: topicColor["oralRoutines"] },
  { name: "Tartar Control Methods",          score: 100,  color: topicColor["tartar"]       },
  { name: "Managing Tooth Sensitivity",      score: 99.3, color: topicColor["sensitivity"]  },
  { name: "Benefits of Dental Flossing",     score: 99.1, color: topicColor["flossing"]     },
  { name: "Toothpaste Ingredients",          score: 98.7, color: topicColor["toothpaste"]   },
  { name: "Teeth Whitening Techniques",      score: 98.2, color: topicColor["whitening"]    },
  { name: "Professional Dental Care",        score: 97.8, color: topicColor["dentalCare"]   },
  { name: "Cavity Prevention",               score: 97.4, color: topicColor["cavityPrev"]   },
  { name: "Whitening Strips vs Toothpaste",  score: 96.9, color: topicColor["whiteStrips"]  },
]

// ─── Position data ────────────────────────────────────────────────────────────

const positionScores = [
  { name: "Professional Dental Care Tips",   score: 97.4, color: topicColor["dentalCare"]   },
  { name: "Benefits Of Dental Flossing",     score: 97.3, color: topicColor["flossing"]     },
  { name: "Oral Hygiene Best Practices",     score: 94.0, color: oralHygieneColor           },
  { name: "Teeth Whitening Techniques",      score: 93.8, color: topicColor["whitening"]    },
  { name: "Toothpaste Ingredients",          score: 91.2, color: topicColor["toothpaste"]   },
  { name: "Daily Oral Care Routines",        score: 90.8, color: topicColor["oralRoutines"] },
  { name: "Tartar Control Methods",          score: 89.4, color: topicColor["tartar"]       },
  { name: "Cavity Prevention",               score: 87.1, color: topicColor["cavityPrev"]   },
  { name: "Choosing The Right Toothbrush",   score: 85.6, color: topicColor["toothbrush"]   },
  { name: "Managing Tooth Sensitivity",      score: 82.3, color: topicColor["sensitivity"]  },
]

// ─── Prompts data ─────────────────────────────────────────────────────────────

const promptsData = [
  { name: "Oral Hygiene Best Practices",     count: 62, color: oralHygieneColor           },
  { name: "Professional Dental Care Tips",   count: 59, color: topicColor["dentalCare"]   },
  { name: "Tartar Control Methods",          count: 54, color: topicColor["tartar"]       },
  { name: "Teeth Whitening Techniques",      count: 50, color: topicColor["whitening"]    },
  { name: "Toothpaste Ingredients",          count: 47, color: topicColor["toothpaste"]   },
  { name: "Daily Oral Care Routines",        count: 44, color: topicColor["oralRoutines"] },
  { name: "Benefits of Dental Flossing",     count: 41, color: topicColor["flossing"]     },
  { name: "Cavity Prevention",               count: 38, color: topicColor["cavityPrev"]   },
  { name: "Choosing The Right Toothbrush",   count: 35, color: topicColor["toothbrush"]   },
  { name: "Managing Tooth Sensitivity",      count: 29, color: topicColor["sensitivity"]  },
]

const PROMPTS_MAX = 70 // normalise bar widths against this ceiling

// ─── Competitor breakdown data ────────────────────────────────────────────────

const competitorTopics = [
  { name: "Colgate",                        current: 77, prior: 79, color: topicColor["whitening"]    },
  { name: "Daily Oral Care Routines",       current: 91, prior: 91, color: topicColor["oralRoutines"] },
  { name: "Choosing The Right Toothbrush",  current: 64, prior: 75, color: topicColor["toothbrush"]   },
  { name: "Oral Hygiene Best Practices",    current: 56, prior: 64, color: oralHygieneColor           },
  { name: "Professional Dental Care Tips",  current: 71, prior: 68, color: topicColor["dentalCare"]   },
  { name: "Teeth Whitening Techniques",     current: 68, prior: 72, color: topicColor["whitening"]    },
  { name: "Tartar Control Methods",         current: 59, prior: 63, color: topicColor["tartar"]       },
  { name: "Benefits of Dental Flossing",    current: 74, prior: 71, color: topicColor["flossing"]     },
  { name: "Toothpaste Ingredients",         current: 82, prior: 80, color: topicColor["toothpaste"]   },
  { name: "Managing Tooth Sensitivity",     current: 48, prior: 55, color: topicColor["sensitivity"]  },
  { name: "Cavity Prevention",              current: 63, prior: 67, color: topicColor["cavityPrev"]   },
]

// ─── Date range labels ────────────────────────────────────────────────────────

const RANGE_DATE_LABELS: Record<string, string> = {
  "7D":  "Apr 27 – May 4",
  "30D": "Apr 4 – May 4",
  "3M":  "Feb 4 – May 4",
}

// Multi-range trend datasets for topic line charts
const TOPICS_RANGE_DATA: Record<string, {
  dates: string[]
  mentionSeries: Record<string, number[]>
  sentimentSeries: Record<string, number[]>
}> = {
  "7D": {
    dates: ["Apr 27","Apr 28","Apr 29","Apr 30","May 1","May 2","May 3","May 4"],
    mentionSeries: {
      toothpaste:   [82,85,78,88,82,76,84,90],
      whitening:    [86,88,72,84,88,82,86,92],
      oralRoutines: [80,82,70,80,84,78,82,88],
      dentalCare:   [76,80,65,75,78,72,80,84],
      cavityPrev:   [74,76,64,78,80,72,76,82],
      tartar:       [72,74,58,72,76,68,74,80],
      flossing:     [68,70,62,72,74,66,72,76],
      sensitivity:  [64,66,50,65,70,62,68,72],
      toothbrush:   [62,64,48,62,68,60,65,70],
      whiteStrips:  [58,58,44,58,64,56,62,66],
    },
    sentimentSeries: {
      toothpaste:   [97,98,99,98,99,99,98,99],
      whitening:    [98,99,99,98,99,98,99,98],
      oralRoutines: [99,100,100,99,100,100,100,100],
      dentalCare:   [97,97,98,97,98,97,98,98],
      cavityPrev:   [97,97,97,98,97,97,98,97],
      tartar:       [99,100,100,100,99,100,100,100],
      flossing:     [99,99,99,99,100,99,100,99],
      sensitivity:  [99,99,99,100,99,99,99,99],
      toothbrush:   [99,100,100,100,100,100,100,100],
      whiteStrips:  [96,96,97,96,97,96,97,97],
    },
  },
  "30D": {
    dates: ["Apr 4","Apr 11","Apr 18","Apr 25","May 2"],
    mentionSeries: {
      toothpaste:   [84,87,89,86,88],
      whitening:    [83,86,88,87,90],
      oralRoutines: [80,83,85,83,86],
      dentalCare:   [76,79,81,79,82],
      cavityPrev:   [75,78,80,78,81],
      tartar:       [73,76,78,76,79],
      flossing:     [69,72,74,72,75],
      sensitivity:  [64,67,69,67,70],
      toothbrush:   [62,65,67,65,68],
      whiteStrips:  [57,60,62,61,64],
    },
    sentimentSeries: {
      toothpaste:   [97,98,97,98,97],
      whitening:    [98,98,97,98,98],
      oralRoutines: [99,99,98,99,99],
      dentalCare:   [96,97,96,97,96],
      cavityPrev:   [96,97,97,97,96],
      tartar:       [99,99,99,99,99],
      flossing:     [99,99,99,99,99],
      sensitivity:  [98,99,99,98,99],
      toothbrush:   [99,100,99,100,99],
      whiteStrips:  [95,96,95,96,96],
    },
  },
  "3M": {
    dates: ["Feb 4","Feb 11","Feb 18","Feb 25","Mar 4","Mar 11","Mar 18","Mar 25","Apr 1","Apr 8","Apr 15","Apr 22","Apr 29"],
    mentionSeries: {
      toothpaste:   [90,91,88,87,85,86,88,87,84,86,88,86,85],
      whitening:    [89,90,87,86,84,85,87,86,83,85,87,85,84],
      oralRoutines: [86,87,84,83,81,82,84,83,80,82,84,82,81],
      dentalCare:   [82,83,80,79,77,78,80,79,76,78,80,78,77],
      cavityPrev:   [80,81,78,77,75,76,78,77,75,77,79,77,76],
      tartar:       [78,79,76,75,73,74,76,75,73,75,77,75,74],
      flossing:     [74,75,72,71,70,71,73,71,69,71,73,71,70],
      sensitivity:  [69,70,67,66,65,66,68,66,64,66,68,66,65],
      toothbrush:   [67,68,65,64,63,64,66,64,62,64,66,64,63],
      whiteStrips:  [63,64,61,60,58,59,61,60,58,60,62,60,58],
    },
    sentimentSeries: {
      toothpaste:   [96,96,95,96,97,97,97,97,97,97,97,98,98],
      whitening:    [97,97,96,97,97,97,98,97,97,98,97,98,98],
      oralRoutines: [98,98,98,98,99,99,99,99,99,99,99,100,100],
      dentalCare:   [95,95,95,96,96,96,97,96,96,97,96,97,97],
      cavityPrev:   [95,95,96,96,96,96,97,96,96,97,96,97,97],
      tartar:       [98,98,98,99,99,99,99,99,99,100,99,100,100],
      flossing:     [98,98,99,99,99,99,99,99,99,99,100,99,100],
      sensitivity:  [98,98,98,99,99,99,99,99,99,99,99,100,100],
      toothbrush:   [99,99,99,100,99,100,100,100,100,100,100,100,100],
      whiteStrips:  [94,95,94,95,95,96,96,96,96,96,97,96,97],
    },
  },
}

// ─── Pagination constants ─────────────────────────────────────────────────────

const TOPICS_PER_PAGE    = 6
const SENTIMENT_PER_PAGE = 4
const BAR_PER_PAGE       = 4

// ─── Shared paginated bar panel ───────────────────────────────────────────────

function BarPanel({
  title,
  items,
  valueKey,
  maxValue,
  page,
  totalItems,
  perPage,
  onPrev,
  onNext,
}: {
  title: string
  items: { name: string; value: number; color: string }[]
  valueKey?: string
  maxValue: number
  page: number
  totalItems: number
  perPage: number
  onPrev: () => void
  onNext: () => void
}) {
  const totalPages = Math.ceil(totalItems / perPage)
  const start = page * perPage + 1
  const end = Math.min((page + 1) * perPage, totalItems)
  void valueKey

  return (
    <div className="rounded-scrunch-lg bg-white shadow-scrunch-sm px-5 pt-5 pb-4">
      <div className="flex items-center justify-between mb-5">
        <span className="text-[13.5px] font-medium text-ink/80 leading-snug">{title}</span>
        <button className="shrink-0 ml-2 text-ink/30 hover:text-ink/60 transition-colors">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
      <div className="space-y-[18px]">
        {items.map((item) => (
          <div key={item.name}>
            <div className="flex justify-between mb-1.5">
              <span className="text-[13.5px] text-ink/80">{item.name}</span>
              <span className="text-[13px] font-plex-mono text-ink tabular-nums">{item.value}</span>
            </div>
            <div className="h-[10px] w-full rounded-scrunch-pill bg-s-neutral-100 overflow-hidden">
              <div
                className="h-full rounded-scrunch-pill"
                style={{ width: `${(item.value / maxValue) * 100}%`, backgroundColor: item.color }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-1.5 mt-5 text-[12px] text-ink/50">
        <button
          onClick={onPrev}
          disabled={page === 0}
          className="p-1 rounded hover:bg-s-neutral-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
        <span>{start}–{end} of {totalItems}</span>
        <button
          onClick={onNext}
          disabled={page === totalPages - 1}
          className="p-1 rounded hover:bg-s-neutral-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

// ─── Custom chart tooltip ─────────────────────────────────────────────────────

function ChartTooltip({
  active,
  payload,
  label,
  suffix = "%",
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
  suffix?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div
      className="px-4 py-3 min-w-[220px]"
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
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2">
            <span className="h-2 w-2 shrink-0" style={{ backgroundColor: entry.color }} />
            <span className="flex-1 text-[12.5px] text-ink/70">{entry.name}</span>
            <span className="text-[12.5px] font-plex-mono text-ink tabular-nums ml-4">
              {entry.value}{suffix}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TopicsPage() {
  const [range, setRange]                 = useState("7D")

  const rd = TOPICS_RANGE_DATA[range] ?? TOPICS_RANGE_DATA["7D"]
  const mentionTrend = rd.dates.map((date, i) => ({
    date,
    ...Object.fromEntries(Object.entries(rd.mentionSeries).map(([k, v]) => [k, v[i]])),
  }))
  const sentimentTrend = rd.dates.map((date, i) => ({
    date,
    ...Object.fromEntries(Object.entries(rd.sentimentSeries).map(([k, v]) => [k, v[i]])),
  }))

  const [topicsExpanded, setTopicsExpanded] = useState(false)
  const [sentimentPage, setSentimentPage]   = useState(0)
  const [positionPage, setPositionPage] = useState(0)
  const [promptsPage, setPromptsPage]   = useState(0)
  const [competitorPage, setCompetitorPage] = useState(0)

  // ── Mention rate card grid ─────────────────────────────
  const visibleTopics = topicsExpanded ? topics : topics.slice(0, TOPICS_PER_PAGE)
  // filler tiles to complete the last row in a 3-col grid
  const fillerCount = (3 - (visibleTopics.length % 3)) % 3

  // ── Sentiment bar ──────────────────────────────────────
  const totalSentimentPages = Math.ceil(sentimentScores.length / SENTIMENT_PER_PAGE)
  const pagedSentiment = sentimentScores.slice(
    sentimentPage * SENTIMENT_PER_PAGE,
    (sentimentPage + 1) * SENTIMENT_PER_PAGE
  )
  const sentStart = sentimentPage * SENTIMENT_PER_PAGE + 1
  const sentEnd = Math.min((sentimentPage + 1) * SENTIMENT_PER_PAGE, sentimentScores.length)

  // ── Position bar ───────────────────────────────────────
  const pagedPosition = positionScores
    .slice(positionPage * BAR_PER_PAGE, (positionPage + 1) * BAR_PER_PAGE)
    .map((d) => ({ name: d.name, value: d.score, color: d.color }))

  // ── Prompts bar ────────────────────────────────────────
  const pagedPrompts = promptsData
    .slice(promptsPage * BAR_PER_PAGE, (promptsPage + 1) * BAR_PER_PAGE)
    .map((d) => ({ name: d.name, value: d.count, color: d.color }))

  // ── Competitor dual-bar ────────────────────────────────
  const totalCompetitorPages = Math.ceil(competitorTopics.length / BAR_PER_PAGE)
  const pagedCompetitor = competitorTopics.slice(
    competitorPage * BAR_PER_PAGE,
    (competitorPage + 1) * BAR_PER_PAGE
  )
  const compStart = competitorPage * BAR_PER_PAGE + 1
  const compEnd = Math.min((competitorPage + 1) * BAR_PER_PAGE, competitorTopics.length)

  return (
    <div className="space-y-5 pb-10">

      {/* ── Page header + date range tabs ────────────── */}
      <div className="flex items-center justify-between pb-5">
        <h1 className="font-sans font-semibold text-[36px] text-ink leading-none tracking-[-1px]">Topics</h1>
        <div className="flex items-center gap-1.5">
          <button className="flex items-center gap-1.5 rounded-scrunch-sm border border-s-neutral-200 bg-white px-3 py-1.5 text-[13px] text-ink/60 hover:bg-s-neutral-50 transition-colors">
            <Icon name="calendar_month" size={14} />
            {RANGE_DATE_LABELS[range] ?? "Custom"}
          </button>
          <div className="flex items-center rounded-scrunch-sm bg-s-neutral-100 p-0.5 gap-0.5">
            {(["7D", "30D", "3M"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-2.5 py-1 text-[12.5px] rounded-scrunch-xs transition-colors ${
                  range === r
                    ? "bg-white text-ink font-medium shadow-scrunch-sm"
                    : "text-ink/50 hover:text-ink/70"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Row 1: Mention rate card + line chart ─────── */}
      <div className="grid grid-cols-2 gap-5">

        {/* ─── Panel 1: Mention rate card grid ────────── */}
        <div className="rounded-scrunch-lg bg-white shadow-scrunch-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-[13.5px] font-medium text-ink/80 leading-snug">
              Mention Rate For Colgate Broken Down By Topic
            </span>
            <button className="shrink-0 ml-2 text-ink/30 hover:text-ink/60 transition-colors">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
          {/* 3-col grid — gap-[1px] bg trick for dividers, min-h for even rows */}
          <div className="grid grid-cols-3 gap-[1px] bg-s-neutral-100 border-t border-s-neutral-100">
            {visibleTopics.map((topic) => (
              <div key={topic.id} className="bg-white p-4 flex flex-col gap-2 min-h-[130px]">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="h-2 w-2 shrink-0" style={{ backgroundColor: topic.color }} />
                  <span className="text-[11.5px] text-ink/55 truncate leading-none">{topic.name}</span>
                </div>
                <div className="flex items-end justify-between mt-auto">
                  <div className="font-plex-mono tabular-nums leading-none">
                    <span className="text-[32px] text-ink">{topic.pct}</span>
                    <span className="text-[20px] text-ink">%</span>
                  </div>
                  <div className={`inline-flex w-fit items-center gap-0.5 rounded-scrunch-pill px-1.5 py-[3px] text-[11px] font-medium ${
                    topic.delta >= 0 ? "bg-s-green-200 text-s-green-900" : "bg-s-danger-50 text-s-danger-600"
                  }`}>
                    {topic.delta >= 0 ? <ArrowUp className="h-2.5 w-2.5" /> : <ArrowDown className="h-2.5 w-2.5" />}
                    {Math.abs(topic.delta)}%
                  </div>
                </div>
              </div>
            ))}
            {/* Filler tiles to complete the last row */}
            {Array.from({ length: fillerCount }).map((_, i) => (
              <div key={`filler-${i}`} className="bg-white min-h-[130px]" />
            ))}
          </div>

          {/* Accordion expand/collapse footer */}
          <button
            onClick={() => setTopicsExpanded((e) => !e)}
            className="flex w-full items-center justify-center gap-1.5 border-t border-s-neutral-100 py-3 text-[12px] text-ink/45 hover:text-ink/70 hover:bg-s-neutral-50 transition-colors"
          >
            {topicsExpanded ? (
              <>Show less <ChevronUp className="h-3.5 w-3.5" /></>
            ) : (
              <>Show all {topics.length} topics <ChevronDown className="h-3.5 w-3.5" /></>
            )}
          </button>
        </div>

        {/* ─── Panel 2: Mention rate line chart ───────── */}
        <div className="rounded-scrunch-lg bg-white shadow-scrunch-sm px-5 pt-5 pb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13.5px] font-medium text-ink/80 leading-snug">
              Mention Rate For Colgate Broken Down By Topic
            </span>
            <button className="shrink-0 ml-2 text-ink/30 hover:text-ink/60 transition-colors">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            {topics.slice(0, 2).map((t) => (
              <span key={t.id} className="flex items-center gap-1.5 text-[11.5px] text-ink/55">
                <span className="h-2 w-2 shrink-0" style={{ backgroundColor: t.color }} />
                {t.label}
              </span>
            ))}
            <span className="text-[11.5px] text-s-blue-500 cursor-pointer hover:text-s-blue-600 transition-colors">+8 more</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={mentionTrend} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
              <CartesianGrid strokeDasharray="2 3" stroke="var(--chart-grid)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: neutral500 }} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11, fill: neutral500 }} tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTooltip suffix="%" />} />
              {topics.map((t) => (
                <Line key={t.id} type="monotone" dataKey={t.id} stroke={t.color} strokeWidth={2} dot={false} name={t.label} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Row 2: Sentiment bar + line chart ─────────── */}
      <div className="grid grid-cols-2 gap-5">

        {/* ─── Panel 3: Sentiment bar chart ───────────── */}
        <div className="rounded-scrunch-lg bg-white shadow-scrunch-sm px-5 pt-5 pb-4">
          <div className="flex items-center justify-between mb-5">
            <span className="text-[13.5px] font-medium text-ink/80 leading-snug">
              Sentiment For Colgate Broken Down By Topic
            </span>
            <button className="shrink-0 ml-2 text-ink/30 hover:text-ink/60 transition-colors">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-[18px]">
            {pagedSentiment.map((item) => (
              <div key={item.name}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[13.5px] text-ink/80">{item.name}</span>
                  <span className="text-[13px] font-plex-mono text-ink tabular-nums">{item.score}</span>
                </div>
                <div className="h-[10px] w-full rounded-scrunch-pill bg-s-neutral-100 overflow-hidden">
                  <div className="h-full rounded-scrunch-pill" style={{ width: `${item.score}%`, backgroundColor: item.color }} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-end gap-1.5 mt-5 text-[12px] text-ink/50">
            <button onClick={() => setSentimentPage((p) => Math.max(0, p - 1))} disabled={sentimentPage === 0} className="p-1 rounded hover:bg-s-neutral-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span>{sentStart}–{sentEnd} of {sentimentScores.length}</span>
            <button onClick={() => setSentimentPage((p) => Math.min(totalSentimentPages - 1, p + 1))} disabled={sentimentPage === totalSentimentPages - 1} className="p-1 rounded hover:bg-s-neutral-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* ─── Panel 4: Sentiment line chart ──────────── */}
        <div className="rounded-scrunch-lg bg-white shadow-scrunch-sm px-5 pt-5 pb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13.5px] font-medium text-ink/80 leading-snug">
              Sentiment For Colgate Broken Down By Topic
            </span>
            <button className="shrink-0 ml-2 text-ink/30 hover:text-ink/60 transition-colors">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            {topics.slice(0, 2).map((t) => (
              <span key={t.id} className="flex items-center gap-1.5 text-[11.5px] text-ink/55">
                <span className="h-2 w-2 shrink-0" style={{ backgroundColor: t.color }} />
                {t.label}
              </span>
            ))}
            <span className="text-[11.5px] text-s-blue-500 cursor-pointer hover:text-s-blue-600 transition-colors">+8 more</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={sentimentTrend} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
              <CartesianGrid strokeDasharray="2 3" stroke="var(--chart-grid)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: neutral500 }} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tick={{ fontSize: 11, fill: neutral500 }} tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTooltip suffix="" />} />
              {topics.map((t) => (
                <Line key={t.id} type="monotone" dataKey={t.id} stroke={t.color} strokeWidth={2} dot={false} name={t.label} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Row 3: Position + Prompts Mentioning ──────── */}
      <div className="grid grid-cols-2 gap-5">
        <BarPanel
          title="Position For Colgate Broken Down By Topic"
          items={pagedPosition}
          maxValue={100}
          page={positionPage}
          totalItems={positionScores.length}
          perPage={BAR_PER_PAGE}
          onPrev={() => setPositionPage((p) => Math.max(0, p - 1))}
          onNext={() => setPositionPage((p) => Math.min(Math.ceil(positionScores.length / BAR_PER_PAGE) - 1, p + 1))}
        />
        <BarPanel
          title="Prompts Mentioning For Colgate Broken Down By Topic"
          items={pagedPrompts}
          maxValue={PROMPTS_MAX}
          page={promptsPage}
          totalItems={promptsData.length}
          perPage={BAR_PER_PAGE}
          onPrev={() => setPromptsPage((p) => Math.max(0, p - 1))}
          onNext={() => setPromptsPage((p) => Math.min(Math.ceil(promptsData.length / BAR_PER_PAGE) - 1, p + 1))}
        />
      </div>

      {/* ── Row 4: Competitor dual-bar (full width) ───── */}
      <div className="rounded-scrunch-lg bg-white shadow-scrunch-sm px-5 pt-5 pb-4">
        <div className="flex items-center justify-between mb-5">
          <span className="text-[13.5px] font-medium text-ink/80 leading-snug">
            Mention Rate For All competitors Broken Down By Topic
          </span>
          <button className="shrink-0 ml-2 text-ink/30 hover:text-ink/60 transition-colors">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-5">
          {pagedCompetitor.map((item) => (
            <div key={item.name}>
              {/* Label row */}
              <div className="flex justify-between mb-1.5">
                <span className="text-[13.5px] text-ink/80">{item.name}</span>
                <span className="text-[13px] font-plex-mono tabular-nums">
                  <span className="text-ink font-medium">{item.current}%</span>
                  <span className="text-ink/40 ml-1">({item.prior}%)</span>
                </span>
              </div>
              {/* Current period bar */}
              <div className="h-[9px] w-full rounded-scrunch-pill bg-s-neutral-100 overflow-hidden mb-1">
                <div
                  className="h-full rounded-scrunch-pill transition-all"
                  style={{ width: `${item.current}%`, backgroundColor: item.color }}
                />
              </div>
              {/* Prior period bar (same color, lighter) */}
              <div className="h-[9px] w-full rounded-scrunch-pill bg-s-neutral-100 overflow-hidden">
                <div
                  className="h-full rounded-scrunch-pill"
                  style={{ width: `${item.prior}%`, backgroundColor: item.color, opacity: 0.38 }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-1.5 mt-5 text-[12px] text-ink/50">
          <button
            onClick={() => setCompetitorPage((p) => Math.max(0, p - 1))}
            disabled={competitorPage === 0}
            className="p-1 rounded hover:bg-s-neutral-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <span>{compStart}–{compEnd} of {competitorTopics.length}</span>
          <button
            onClick={() => setCompetitorPage((p) => Math.min(totalCompetitorPages - 1, p + 1))}
            disabled={competitorPage === totalCompetitorPages - 1}
            className="p-1 rounded hover:bg-s-neutral-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

    </div>
  )
}
