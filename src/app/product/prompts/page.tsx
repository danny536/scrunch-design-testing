"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, ChevronDown, SlidersHorizontal, Download, X, ArrowUp, ArrowDown } from "lucide-react"
import { Icon } from "@/components/icon"
import {
  PieChart, Pie, Cell,
  AreaChart, Area,
  ResponsiveContainer,
} from "recharts"
import { CHART_COLORS_12, getChartColors } from "@/lib/chart-palette"

// ─── Color constants ──────────────────────────────────────────────────────────

const danger500  = "#FF5021"  // s-danger-500 — negative trend sparklines
const success600 = "#AECE31"  // s-green-400  — positive trend sparklines

// ─── Live Colgate data — Scrunch API, all prompts, Feb 10 – Apr 28 2026 ───────

// Competitive presence (6 brands) → getChartColors(6) alternating sequence
const [c1, c2, c3, c4, c5, c6] = getChartColors(6)
const COMPETITORS = [
  { name: "Colgate",   pct: 80, color: c1 }, // Blue 500   — tracked brand
  { name: "Oral-B",    pct: 28, color: c2 }, // Green 400
  { name: "Crest",     pct: 25, color: c3 }, // Neutral 400
  { name: "Sensodyne", pct: 24, color: c4 }, // Blue 300
  { name: "Aquafresh", pct: 1,  color: c5 }, // Green 600
  { name: "Pepsodent", pct: 0,  color: c6 }, // Neutral 500
]

// Presence donut (2 series) → getChartColors(2)
const [p1, p2] = getChartColors(2)
const presenceData = [
  { name: "Yes", value: 80, color: p1 },        // Blue 500
  { name: "No",  value: 20, color: "#F6EFDC" }, // Neutral 200
]

// Citations donut (5 series) → getChartColors(5)
const [ct1, ct2, ct3, ct4, ct5] = getChartColors(5)
const citationsData = [
  { name: "Your Brand",  value: 8,  color: ct1 }, // Blue 500
  { name: "Third Party", value: 86, color: ct2 }, // Green 400
  { name: "Competitors", value: 1,  color: ct3 }, // Neutral 400
  { name: "Social",      value: 2,  color: ct4 }, // Blue 300
  { name: "Retailer",    value: 3,  color: ct5 }, // Green 600
]

// Weekly presence rate — all prompts, Feb 10 – Apr 28 2026
const presenceSparkline = [
  { v: 88.1 }, { v: 78.3 }, { v: 78.9 }, { v: 78.0 },
  { v: 77.4 }, { v: 80.0 }, { v: 81.7 }, { v: 76.4 },
  { v: 74.8 }, { v: 75.4 }, { v: 78.5 }, { v: 79.3 },
]

// Weekly brand citation % — all prompts, Feb 10 – Apr 28 2026
const citationsSparkline = [
  { v: 9.45 }, { v: 7.51 }, { v: 6.43 }, { v: 6.86 },
  { v: 7.17 }, { v: 7.81 }, { v: 8.14 }, { v: 7.02 },
  { v: 6.50 }, { v: 7.23 }, { v: 6.70 }, { v: 7.69 },
]

const squareIcon = (
  <span className="inline-flex items-center justify-center h-3.5 w-3.5">
    <span className="block h-2 w-2 bg-current" />
  </span>
)

const ITEMS_PER_PAGE = 4

// ─── Table data ───────────────────────────────────────────────────────────────

type TableRow = {
  topic: string
  prompts: number
  responses: number
  shopping: number
  presencePct: number
  presenceDelta: string
  presenceUp: boolean
  presenceSparkline: { v: number }[]
  citationsPct: number
  citationsDelta: string
  citationsUp: boolean
  citationsSparkline: { v: number }[]
  competitors: { name: string; pct: number }[]
  extraCompetitors: number
}

const TABLE_ROWS: TableRow[] = [
  {
    topic: "Teeth Whitening",
    prompts: 42, responses: 1308, shopping: 4,
    presencePct: 84, presenceDelta: "+3%", presenceUp: true,
    presenceSparkline: [{ v:2.8 },{ v:3.0 },{ v:2.9 },{ v:3.3 },{ v:3.1 },{ v:3.5 },{ v:3.4 },{ v:3.7 },{ v:3.6 },{ v:3.9 },{ v:4.0 },{ v:4.2 }],
    citationsPct: 12, citationsDelta: "-5%", citationsUp: false,
    citationsSparkline: [{ v:4.8 },{ v:4.5 },{ v:4.6 },{ v:4.2 },{ v:4.3 },{ v:3.9 },{ v:3.8 },{ v:3.5 },{ v:3.6 },{ v:3.2 },{ v:3.1 },{ v:2.9 }],
    competitors: [{ name: "Crest", pct: 72 }, { name: "Oral-B", pct: 61 }],
    extraCompetitors: 2,
  },
  {
    topic: "Cavity Prevention",
    prompts: 38, responses: 1192, shopping: 2,
    presencePct: 76, presenceDelta: "-2%", presenceUp: false,
    presenceSparkline: [{ v:5 },{ v:4.8 },{ v:5.1 },{ v:4.4 },{ v:4.7 },{ v:4.1 },{ v:4.4 },{ v:3.7 },{ v:3.9 },{ v:3.2 },{ v:3.4 },{ v:2.8 }],
    citationsPct: 9, citationsDelta: "+1%", citationsUp: true,
    citationsSparkline: [{ v:2.5 },{ v:2.7 },{ v:2.6 },{ v:2.9 },{ v:3.0 },{ v:3.2 },{ v:3.1 },{ v:3.4 },{ v:3.3 },{ v:3.6 },{ v:3.5 },{ v:3.8 }],
    competitors: [{ name: "Sensodyne", pct: 68 }, { name: "Crest", pct: 55 }],
    extraCompetitors: 1,
  },
  {
    topic: "Fresh Breath",
    prompts: 35, responses: 1090, shopping: 6,
    presencePct: 71, presenceDelta: "+5%", presenceUp: true,
    presenceSparkline: [{ v:2.2 },{ v:2.5 },{ v:2.4 },{ v:2.8 },{ v:2.7 },{ v:3.1 },{ v:3.0 },{ v:3.4 },{ v:3.5 },{ v:3.8 },{ v:3.9 },{ v:4.3 }],
    citationsPct: 7, citationsDelta: "-8%", citationsUp: false,
    citationsSparkline: [{ v:5.2 },{ v:4.9 },{ v:4.7 },{ v:4.4 },{ v:4.5 },{ v:4.1 },{ v:3.9 },{ v:3.6 },{ v:3.4 },{ v:3.1 },{ v:2.8 },{ v:2.5 }],
    competitors: [{ name: "Oral-B", pct: 64 }, { name: "Aquafresh", pct: 48 }],
    extraCompetitors: 0,
  },
  {
    topic: "Sensitive Teeth",
    prompts: 29, responses: 908, shopping: 1,
    presencePct: 65, presenceDelta: "-4%", presenceUp: false,
    presenceSparkline: [{ v:4.9 },{ v:4.6 },{ v:4.8 },{ v:4.3 },{ v:4.5 },{ v:4.0 },{ v:3.8 },{ v:3.5 },{ v:3.7 },{ v:3.3 },{ v:3.1 },{ v:2.8 }],
    citationsPct: 5, citationsDelta: "-3%", citationsUp: false,
    citationsSparkline: [{ v:4.5 },{ v:4.2 },{ v:4.4 },{ v:4.0 },{ v:4.1 },{ v:3.7 },{ v:3.8 },{ v:3.4 },{ v:3.3 },{ v:3.0 },{ v:2.9 },{ v:2.6 }],
    competitors: [{ name: "Sensodyne", pct: 82 }, { name: "Crest", pct: 41 }],
    extraCompetitors: 1,
  },
  {
    topic: "Kids Oral Care",
    prompts: 24, responses: 752, shopping: 3,
    presencePct: 58, presenceDelta: "+1%", presenceUp: true,
    presenceSparkline: [{ v:3.2 },{ v:3.1 },{ v:3.3 },{ v:3.2 },{ v:3.4 },{ v:3.3 },{ v:3.5 },{ v:3.4 },{ v:3.5 },{ v:3.6 },{ v:3.5 },{ v:3.7 }],
    citationsPct: 11, citationsDelta: "+6%", citationsUp: true,
    citationsSparkline: [{ v:2.0 },{ v:2.3 },{ v:2.2 },{ v:2.5 },{ v:2.7 },{ v:3.0 },{ v:3.1 },{ v:3.4 },{ v:3.5 },{ v:3.8 },{ v:4.0 },{ v:4.3 }],
    competitors: [{ name: "Colgate", pct: 71 }, { name: "Aquafresh", pct: 39 }],
    extraCompetitors: 0,
  },
  {
    topic: "Electric Toothbrush",
    prompts: 22, responses: 688, shopping: 5,
    presencePct: 43, presenceDelta: "-7%", presenceUp: false,
    presenceSparkline: [{ v:5.5 },{ v:5.1 },{ v:5.3 },{ v:4.8 },{ v:4.6 },{ v:4.3 },{ v:4.0 },{ v:3.7 },{ v:3.5 },{ v:3.1 },{ v:2.9 },{ v:2.5 }],
    citationsPct: 3, citationsDelta: "-2%", citationsUp: false,
    citationsSparkline: [{ v:4.0 },{ v:3.8 },{ v:3.9 },{ v:3.6 },{ v:3.7 },{ v:3.4 },{ v:3.3 },{ v:3.1 },{ v:3.0 },{ v:2.8 },{ v:2.7 },{ v:2.5 }],
    competitors: [{ name: "Oral-B", pct: 79 }, { name: "Braun", pct: 52 }],
    extraCompetitors: 2,
  },
  {
    topic: "Gum Care",
    prompts: 18, responses: 564, shopping: 0,
    presencePct: 39, presenceDelta: "+2%", presenceUp: true,
    presenceSparkline: [{ v:2.5 },{ v:2.4 },{ v:2.6 },{ v:2.5 },{ v:2.7 },{ v:2.8 },{ v:2.9 },{ v:3.0 },{ v:3.1 },{ v:3.2 },{ v:3.3 },{ v:3.4 }],
    citationsPct: 2, citationsDelta: "+4%", citationsUp: true,
    citationsSparkline: [{ v:1.5 },{ v:1.7 },{ v:1.9 },{ v:2.1 },{ v:2.3 },{ v:2.5 },{ v:2.6 },{ v:2.8 },{ v:3.0 },{ v:3.2 },{ v:3.3 },{ v:3.5 }],
    competitors: [{ name: "Crest", pct: 44 }, { name: "Pepsodent", pct: 31 }],
    extraCompetitors: 0,
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PromptsMonitoringPage() {
  const [compPage, setCompPage] = useState(0)
  const totalPages = Math.ceil(COMPETITORS.length / ITEMS_PER_PAGE)
  const paged = COMPETITORS.slice(compPage * ITEMS_PER_PAGE, (compPage + 1) * ITEMS_PER_PAGE)
  const [newPromptOpen, setNewPromptOpen] = useState(false)
  const newPromptRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!newPromptRef.current?.contains(e.target as Node)) setNewPromptOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  return (
    <div className="space-y-5 pb-10">

      {/* ── Page title ─────────────────────────────────── */}
      <div className="flex items-center justify-between pb-5">
        <h1 className="font-sans font-semibold text-[36px] text-ink leading-none tracking-[-1px]">Prompts Monitoring</h1>
      </div>

      {/* ── Hero card ──────────────────────────────────── */}
      <div data-export-id="hero" data-export-label="Hero Card" className="relative overflow-hidden rounded-scrunch-xl bg-white shadow-scrunch-sm px-8 py-7">
        <div className="max-w-[520px]">
          <h2 className="text-[18px] font-semibold text-ink leading-snug">
            Monitor Your Prompts Across AI Platforms
          </h2>
          <p className="mt-1.5 text-[14px] text-ink/55 leading-relaxed">
            Track which prompts mention your brand and learn strategies to improve your AI search visibility.
          </p>
          <button className="mt-4 flex items-center gap-1.5 text-[13px] text-ink/60 hover:text-ink transition-colors">
            <Icon name="description" size={15} />
            Prompt Strategy Guide
          </button>
        </div>
        {/* Video thumbnail — matches home page */}
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

      {/* ── Filter bar ─────────────────────────────────── */}
      <div className="flex items-center gap-2 flex-wrap">
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

      {/* ── Stat cards ─────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">

        <div className="rounded-scrunch-lg bg-white px-6 pt-5 pb-4 shadow-scrunch-sm flex flex-col">
          <div className="flex items-center gap-1 text-[12px] text-ink/50">
            Prompts <Icon name="info" size={12} />
          </div>
          <div className="mt-auto pt-2 text-[42px] font-normal text-ink tabular-nums leading-none tracking-tighter">423</div>
        </div>

        <div className="rounded-scrunch-lg bg-white px-6 pt-5 pb-4 shadow-scrunch-sm flex flex-col">
          <div className="flex items-center gap-1 text-[12px] text-ink/50">
            Responses <Icon name="info" size={12} />
          </div>
          <div className="mt-auto pt-2 text-[42px] font-normal text-ink tabular-nums leading-none tracking-tighter">11,969</div>
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

      {/* ── Data cards ─────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">

        {/* Competitive Presence */}
        <div className="rounded-scrunch-lg bg-white px-6 pt-5 pb-4 shadow-scrunch-sm flex flex-col">
          <div className="flex items-center gap-1.5 text-[15px] font-medium text-ink/60 mb-4 shrink-0">
            Competitive Presence
            <span className="text-ink/35 font-normal">(% of total)</span>
            <Icon name="info" size={14} className="text-ink/30" />
          </div>
          <div className="flex-1 space-y-3.5">
            {paged.map((c) => (
              <div key={c.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[14px] text-ink/70">{c.name}</span>
                  <span className="text-[13px] font-normal font-plex-mono text-ink tabular-nums">{c.pct}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-ink/[6%]">
                  <div className="h-1.5 rounded-full transition-all duration-300" style={{ width: `${c.pct}%`, backgroundColor: c.color }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-end gap-1 text-[12px] text-ink/50">
            <button
              onClick={() => setCompPage((p) => Math.max(0, p - 1))}
              disabled={compPage === 0}
              className="rounded p-1 hover:bg-s-neutral-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span>{compPage * ITEMS_PER_PAGE + 1}–{Math.min((compPage + 1) * ITEMS_PER_PAGE, COMPETITORS.length)} of {COMPETITORS.length}</span>
            <button
              onClick={() => setCompPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={compPage === totalPages - 1}
              className="rounded p-1 hover:bg-s-neutral-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Presence */}
        <DonutCard
          title="Presence (% of total)"
          centerValue="80%"
          data={presenceData}
          rows={[
            { icon: <ArrowUp className="h-3.5 w-3.5 inline" />,   label: "Yes", value: 80, color: presenceData[0].color },
            { icon: <ArrowDown className="h-3.5 w-3.5 inline" />, label: "No",  value: 20, color: presenceData[1].color },
          ]}
          sparklineData={presenceSparkline}
          sparklineColor={danger500}
          trendValue="-11%"
        />

        {/* Citations */}
        <DonutCard
          title="Citations (% of total)"
          centerValue="8%"
          data={citationsData}
          rows={[
            { icon: squareIcon, label: "Your Brand",  value: 8,  color: citationsData[0].color },
            { icon: squareIcon, label: "Third Party", value: 86, color: citationsData[1].color },
            { icon: squareIcon, label: "Competitors", value: 1,  color: citationsData[2].color },
            { icon: squareIcon, label: "Social",      value: 2,  color: citationsData[3].color },
            { icon: squareIcon, label: "Retailer",    value: 3,  color: citationsData[4].color },
          ]}
          sparklineData={citationsSparkline}
          sparklineColor={danger500}
          trendValue="-20%"
        />

      </div>

      {/* ── Prompts table ──────────────────────────────── */}
      <div className="rounded-scrunch-lg bg-white shadow-scrunch-sm overflow-hidden">

        {/* Toolbar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-s-neutral-100">
          <div className="flex items-center gap-2 rounded-scrunch-md border border-s-neutral-200 bg-s-neutral-50 px-3 py-1.5 text-[13px] text-ink/40 w-52">
            <Icon name="search" size={14} className="shrink-0" />
            <span>Search prompts…</span>
          </div>
          <button className="flex items-center gap-1.5 rounded-scrunch-md border border-s-neutral-200 bg-white px-3 py-1.5 text-[13px] text-ink/70 hover:bg-s-neutral-50 transition-colors">
            By topic
            <ChevronDown className="h-3.5 w-3.5 text-ink/40" />
          </button>
          {/* New Prompt — split button */}
          <div ref={newPromptRef} className="ml-auto relative flex items-stretch">
            <div className="flex items-stretch rounded-scrunch-sm border border-s-blue-300 bg-s-blue-50 text-s-blue-700 overflow-hidden">
              <button
                onClick={() => setNewPromptOpen(false)}
                className="flex items-center gap-1.5 pl-3.5 pr-3 py-1.5 text-[13px] font-medium hover:bg-s-blue-100 transition-colors"
              >
                <Icon name="add" size={15} />
                New Prompt
              </button>
              <div className="w-px bg-s-blue-300 self-stretch" />
              <button
                onClick={() => setNewPromptOpen((v) => !v)}
                className="flex items-center px-2.5 hover:bg-s-blue-100 transition-colors"
              >
                <ChevronDown className="h-3 w-3 opacity-60" />
              </button>
            </div>

            {newPromptOpen && (
              <div className="absolute top-[calc(100%+6px)] right-0 min-w-[268px] bg-white border border-s-neutral-200 rounded-scrunch-lg shadow-scrunch-md z-50 py-1.5 overflow-hidden">
                {[
                  { icon: "upload",       label: "Bulk Add Prompts"           },
                  { icon: "table_chart",  label: "Import Prompts from CSV"    },
                  { icon: "science",      label: "Convert SEO Keywords"       },
                  { icon: "auto_awesome", label: "Generate Prompts with AI"   },
                  { icon: "unarchive",    label: "Reactivate Archived Prompts"},
                ].map(({ icon, label }) => (
                  <button
                    key={label}
                    onClick={() => setNewPromptOpen(false)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-[14px] text-ink hover:bg-s-neutral-50 transition-colors"
                  >
                    <Icon name={icon} size={18} className="shrink-0 text-ink/50" />
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Column headers */}
        <div className="grid items-center bg-s-neutral-50 border-b border-s-neutral-100 px-4 py-2.5"
          style={{ gridTemplateColumns: "1fr 0.7fr 1.125fr 1.125fr 2fr" }}>
          {(["Topics", "Data", "Presence", "Citations", "Competitors"] as const).map((h, i) => (
            <span key={h} className={`font-plex-mono text-[11px] font-medium uppercase tracking-[0.06em] text-ink/40${i === 2 || i === 3 ? " pr-14" : ""}`}>{h}</span>
          ))}
        </div>

        {/* Rows */}
        {TABLE_ROWS.map((row, i) => (
          <div
            key={row.topic}
            className={`grid items-center px-4 py-3.5 hover:bg-s-neutral-50 transition-colors${i < TABLE_ROWS.length - 1 ? " border-b border-s-neutral-100" : ""}`}
            style={{ gridTemplateColumns: "1fr 0.7fr 1.125fr 1.125fr 2fr" }}
          >
            {/* Topic */}
            <span className="text-[14px] font-medium text-ink">{row.topic}</span>

            {/* Data */}
            <div className="flex flex-col gap-0.5">
              <span className="text-[12.5px] text-ink/65 tabular-nums">{row.prompts} prompts</span>
              <span className="text-[12.5px] text-ink/65 tabular-nums">{row.responses.toLocaleString()} responses</span>
              <span className="text-[12.5px] text-ink/40 tabular-nums">🛒 {row.shopping}</span>
            </div>

            {/* Presence */}
            <div className="flex items-center gap-4 min-w-0 pr-14">
              <div className="flex-1 min-w-0">
                <TinySparkline
                  data={row.presenceSparkline}
                  color={row.presenceUp ? success600 : danger500}
                  gradId={`ps-${i}`}
                />
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[13px] font-plex-mono font-normal text-ink tabular-nums">{row.presencePct}%</span>
                <span className={`text-[12px] font-medium font-plex-mono tabular-nums rounded-scrunch-pill px-2.5 py-1 leading-none ${
                  row.presenceUp ? "bg-s-green-200 text-s-green-800" : "bg-s-danger-100 text-s-danger-700"
                }`}>{row.presenceDelta}</span>
              </div>
            </div>

            {/* Citations */}
            <div className="flex items-center gap-4 min-w-0 pr-14">
              <div className="flex-1 min-w-0">
                <TinySparkline
                  data={row.citationsSparkline}
                  color={row.citationsUp ? success600 : danger500}
                  gradId={`cs-${i}`}
                />
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[13px] font-plex-mono font-normal text-ink tabular-nums">{row.citationsPct}%</span>
                <span className={`text-[12px] font-medium font-plex-mono tabular-nums rounded-scrunch-pill px-2.5 py-1 leading-none ${
                  row.citationsUp ? "bg-s-green-200 text-s-green-800" : "bg-s-danger-100 text-s-danger-700"
                }`}>{row.citationsDelta}</span>
              </div>
            </div>

            {/* Competitors */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {row.competitors.map((c, ci) => (
                <span key={ci} className="inline-flex items-center gap-1 rounded-scrunch-pill border border-s-neutral-200 bg-s-neutral-50 px-2 py-0.5 text-[11.5px] text-ink/70">
                  {c.name}
                  <span className="font-plex-mono text-[11px] text-ink/45">{c.pct}%</span>
                </span>
              ))}
              {row.extraCompetitors > 0 && (
                <span className="inline-flex items-center rounded-scrunch-pill border border-s-neutral-200 bg-s-neutral-50 px-2 py-0.5 text-[11.5px] text-ink/45">
                  +{row.extraCompetitors}
                </span>
              )}
            </div>
          </div>
        ))}

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-s-neutral-100 bg-s-neutral-50">
          <div className="flex items-center gap-1.5 text-[12px] text-ink/40">
            <Icon name="menu" size={14} />
            <span className="font-plex-mono">11 rows</span>
          </div>
          <div className="flex items-center gap-1.5 text-[12px] text-ink/40">
            <Icon name="compare_arrows" size={14} />
            <span className="font-plex-mono">0 filters</span>
          </div>
        </div>
      </div>

    </div>
  )
}

// ─── Platform icons ───────────────────────────────────────────────────────────

function PlatformIcons() {
  const platforms = [
    { src: "/logos/ai/ai-overviews.svg",  label: "AI Overviews"              },
    { src: "/logos/ai/chatgpt.svg",        label: "ChatGPT",   darkInvert: true },
    { src: "/logos/ai/claude.svg",         label: "Claude"                    },
    { src: "/logos/ai/copilot.svg",        label: "Copilot"                   },
    { src: "/logos/ai/gemini.svg",         label: "Gemini"                    },
    { src: "/logos/ai/google.svg",         label: "Google"                    },
    { src: "/logos/ai/grok.svg",           label: "Grok",      darkInvert: true },
    { src: "/logos/ai/meta.svg",           label: "Meta"                      },
    { src: "/logos/ai/perplexity.svg",     label: "Perplexity"                },
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

// ─── Tiny sparkline (for table cells) ────────────────────────────────────────

function TinySparkline({ data, color, gradId }: { data: { v: number }[]; color: string; gradId: string }) {
  return (
    <ResponsiveContainer width="100%" height={32}>
      <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={color} stopOpacity={0.28} />
            <stop offset="100%" stopColor={color} stopOpacity={0}    />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} fill={`url(#${gradId})`} dot={false} isAnimationActive={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

// ─── Sparkline (for donut cards) ──────────────────────────────────────────────

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
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} fill={`url(#${gradId})`} dot={false} isAnimationActive={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

// ─── Donut card ───────────────────────────────────────────────────────────────

type DonutRow = { icon: React.ReactNode; label: string; value: number; color: string }

function DonutCard({
  title, centerValue, data, rows, sparklineData, sparklineColor, trendValue, footer,
}: {
  title: string
  centerValue: string
  data: { name: string; value: number; color: string }[]
  rows: DonutRow[]
  sparklineData: { v: number }[]
  sparklineColor: string
  trendValue: string
  footer?: React.ReactNode
}) {
  const isPositive = trendValue.startsWith("+")
  const gradId = `sg-${title.replace(/[^a-zA-Z]/g, "")}`

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
            <Pie data={data} cx={90} cy={90} innerRadius={58} outerRadius={82} dataKey="value" startAngle={90} endAngle={-270} strokeWidth={0}>
              {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
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

      {/* Sparkline + trend */}
      <div className="mt-3 pt-2 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <Sparkline data={sparklineData} color={sparklineColor} gradId={gradId} />
        </div>
        <div className={`shrink-0 flex items-center gap-1 rounded-scrunch-pill px-2 py-0.5 ${
          isPositive ? "bg-s-green-200 text-s-green-800" : "bg-s-danger-100 text-s-danger-700"
        }`}>
          {isPositive ? <ArrowUp className="h-2.5 w-2.5" /> : <ArrowDown className="h-2.5 w-2.5" />}
          <span className="text-[11px] font-medium tabular-nums">{trendValue}</span>
        </div>
      </div>

      {footer && <div className="mt-3">{footer}</div>}
    </div>
  )
}
