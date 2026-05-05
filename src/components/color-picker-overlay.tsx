"use client"

import { useState, useCallback, useEffect } from "react"
import { X, Download, RefreshCw, FileScan, Check, Copy } from "lucide-react"
import { CHART_PALETTE_FAMILIES, type ChartPaletteEntry, type ChartPaletteFamily } from "@/lib/chart-palette"

/* ─────────────────────────────────────────────────────────
   Palette data
───────────────────────────────────────────────────────── */

type Swatch = {
  stop: number
  hex: string
  alias?: string
  prefixOverride?: string // used when a swatch belongs to a different CSS scale
}

type PaletteGroup = {
  name: string
  subtitle: string
  prefix: string
  swatches: Swatch[]
}

const PALETTE: PaletteGroup[] = [
  {
    name: "Blue",
    subtitle: "Cloud → Scrunch",
    prefix: "s-blue",
    swatches: [
      { stop: 50,  hex: "#EFF4FF" },
      { stop: 100, hex: "#DBE5FE" },
      { stop: 200, hex: "#BFD2FE" },
      { stop: 300, hex: "#93C0FE", alias: "CLOUD" },
      { stop: 400, hex: "#618FF9" },
      { stop: 500, hex: "#3C67F5" },
      { stop: 600, hex: "#2A4AEA", alias: "SCRUNCH" },
      { stop: 700, hex: "#1E33D7" },
      { stop: 800, hex: "#1F2CAE" },
      { stop: 900, hex: "#1F2B89" },
      { stop: 950, hex: "#171C54" },
    ],
  },
  {
    name: "Green",
    subtitle: "AI → Botanic",
    prefix: "s-green",
    swatches: [
      { stop: 50,  hex: "#FBFFE7" },
      { stop: 100, hex: "#F2FFC5" },
      { stop: 200, hex: "#D8FC3B", alias: "AI" },
      { stop: 300, hex: "#C3E536" },
      { stop: 400, hex: "#AECE31" },
      { stop: 500, hex: "#99B72C" },
      { stop: 600, hex: "#84A027" },
      { stop: 700, hex: "#6E8920", alias: "BOTANIC" },
      { stop: 800, hex: "#586B16" },
      { stop: 900, hex: "#434E0D" },
      { stop: 950, hex: "#2D3003" },
    ],
  },
  {
    name: "Amber",
    subtitle: "Warning",
    prefix: "s-warning",
    swatches: [
      { stop: 50,  hex: "#FEFDE8" },
      { stop: 100, hex: "#FFFCC2" },
      { stop: 200, hex: "#FFFC0C" },
      { stop: 300, hex: "#FFE843" },
      { stop: 400, hex: "#FFDA1F" },
      { stop: 500, hex: "#EFBE03" },
      { stop: 600, hex: "#CE9300" },
      { stop: 700, hex: "#A46804" },
      { stop: 800, hex: "#88520B" },
      { stop: 900, hex: "#734210" },
      { stop: 950, hex: "#432205" },
    ],
  },
  {
    name: "Danger",
    subtitle: "Red",
    prefix: "s-danger",
    swatches: [
      { stop: 50,  hex: "#FFF3ED" },
      { stop: 100, hex: "#FFE4D4" },
      { stop: 200, hex: "#FFC5A8" },
      { stop: 300, hex: "#FF9D70" },
      { stop: 400, hex: "#FF6937" },
      { stop: 500, hex: "#FF5021" },
      { stop: 600, hex: "#F02806" },
      { stop: 700, hex: "#C71907" },
      { stop: 800, hex: "#9E150E" },
      { stop: 900, hex: "#7F150F" },
      { stop: 950, hex: "#450605" },
    ],
  },
  {
    name: "Neutral",
    subtitle: "Paper → Coal",
    prefix: "s-neutral",
    swatches: [
      { stop: 50,  hex: "#FBF9F6", alias: "PAPER" },
      { stop: 100, hex: "#F7F3EB", alias: "PORCELAIN" },
      { stop: 200, hex: "#F6EFDC" },
      { stop: 300, hex: "#F1E8C7", alias: "GLAZE" },
      { stop: 400, hex: "#B8AB8E" },
      { stop: 500, hex: "#93886F" },
      { stop: 600, hex: "#67624C" },
      { stop: 700, hex: "#514B39" },
      { stop: 800, hex: "#40362E", alias: "CLAY" },
      { stop: 900, hex: "#242220", alias: "COAL" },
      { stop: 950, hex: "#0F0C06" },
    ],
  },
]

const PALETTE_EXTENDED: PaletteGroup[] = [
  {
    name: "Ember",
    subtitle: "Lemon → Espresso",
    prefix: "s-orange",
    swatches: [
      // Yellow (warning scale — stops match exactly)
      { stop: 50,  hex: "#FEFDE8", prefixOverride: "s-warning" },
      { stop: 100, hex: "#FFFCC2", prefixOverride: "s-warning" },
      { stop: 200, hex: "#FFFC0C", prefixOverride: "s-warning" },
      { stop: 300, hex: "#FFE843", prefixOverride: "s-warning", alias: "YELLOW" },
      // Orange scale
      { stop: 400, hex: "#FF9410", alias: "ORANGE" },
      { stop: 500, hex: "#E87A00" },
      // Brown scale
      { stop: 600, hex: "#744620", prefixOverride: "s-brown" },
      { stop: 700, hex: "#563214", alias: "MAHOGANY", prefixOverride: "s-brown" },
      { stop: 800, hex: "#3B2109", prefixOverride: "s-brown" },
      { stop: 900, hex: "#251403", prefixOverride: "s-brown" },
      { stop: 950, hex: "#120A01", prefixOverride: "s-brown" },
    ],
  },
]

/* ─────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────── */

/** Return a contrasting text color (black or white) for a hex background */
function contrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  // Perceived luminance
  const lum = 0.299 * r + 0.587 * g + 0.114 * b
  return lum > 160 ? "#1D1107" : "#FFFFFF"
}

/* ─────────────────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────────────────── */

function SwatchCell({
  swatch,
  prefix,
  onCopy,
}: {
  swatch: Swatch
  prefix: string
  onCopy: (cls: string) => void
}) {
  const utilityClass = `bg-${swatch.prefixOverride ?? prefix}-${swatch.stop}`
  const r = parseInt(swatch.hex.slice(1, 3), 16)
  const g = parseInt(swatch.hex.slice(3, 5), 16)
  const b = parseInt(swatch.hex.slice(5, 7), 16)
  const lum = 0.299 * r + 0.587 * g + 0.114 * b
  const fg = lum > 155 ? "rgba(21,19,15,0.72)" : "rgba(255,255,255,0.85)"

  return (
    <div className="relative flex flex-col items-center gap-0.5 group">
      {/* Tooltip on hover — shows utility class */}
      <div className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center bg-coal text-white text-[10px] leading-tight rounded-scrunch-sm px-2 py-1.5 whitespace-nowrap shadow-scrunch-md z-[60] pointer-events-none">
        <span className="font-plex-mono text-white/70">{utilityClass}</span>
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-coal" aria-hidden />
      </div>

      {/* Swatch */}
      <button
        type="button"
        onClick={() => onCopy(utilityClass)}
        style={{ backgroundColor: swatch.hex, width: 56, height: 60 }}
        className="relative rounded-scrunch-sm border border-black/[0.07] cursor-pointer hover:scale-105 transition-transform duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-s-blue-500 flex-shrink-0 flex flex-col justify-between overflow-hidden p-1.5"
        aria-label={`Copy ${utilityClass}`}
      >
        {/* Stop number */}
        <span className="font-sans text-[10px] font-semibold leading-none" style={{ color: fg }}>
          {swatch.stop}
        </span>
        {/* Hex code */}
        <span className="font-plex-mono text-[8.5px] leading-none" style={{ color: fg }}>
          {swatch.hex}
        </span>
      </button>

      {/* Named alias intentionally hidden */}
    </div>
  )
}

function PaletteRow({
  group,
  onCopy,
}: {
  group: PaletteGroup
  onCopy: (cls: string) => void
}) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-s-neutral-200 last:border-0">
      {/* Label */}
      <div className="w-24 flex-shrink-0 pt-0.5">
        <p className="text-xs font-medium text-ink/80 leading-tight">{group.name}</p>
        <p className="text-[10px] text-ink/40 leading-tight mt-0.5">{group.subtitle}</p>
      </div>

      {/* Swatches */}
      <div className="flex gap-1 flex-wrap">
        {group.swatches.map((swatch) => (
          <SwatchCell
            key={swatch.stop}
            swatch={swatch}
            prefix={group.prefix}
            onCopy={onCopy}
          />
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   Toast
───────────────────────────────────────────────────────── */

function Toast({ message }: { message: string }) {
  return (
    <div
      className="
        fixed bottom-6 left-1/2 -translate-x-1/2 z-[70]
        bg-coal text-paper text-xs font-plex-mono
        px-4 py-2 rounded-scrunch-pill shadow-scrunch-md
        animate-in fade-in slide-in-from-bottom-2 duration-200
      "
    >
      {message}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   Main component
───────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────
   Full Data Palette — sourced from @/lib/chart-palette
   Edit chart-palette.ts to update colors everywhere at once.
───────────────────────────────────────────────────────── */

// Re-export types under local aliases so the rest of this file is unchanged
type DataSwatch = ChartPaletteEntry
type DataFamily = ChartPaletteFamily

function DataPaletteGrid({ onCopy }: { onCopy: (cls: string) => void }) {
  return (
    <div className="py-4">
      <p className="text-[11px] text-ink/40 mb-5 leading-snug">
        The 12 canonical data colors — blue, green, neutral, and amber at stops 300 / 500 / 800.
        Click any swatch to copy its utility class.
      </p>
      {/* 4-column grid: one column per family */}
      <div className="grid grid-cols-4 gap-3">
        {CHART_PALETTE_FAMILIES.map((family) => (
          <div key={family.name} className="flex flex-col gap-2">
            <p className="text-[11px] font-medium text-ink/60 text-center">{family.name}</p>
            {family.swatches.map((sw) => {
              const cls = `bg-${sw.prefix}-${sw.stop}`
              const fg = sw.dark ? "#1D1107" : "#FFFFFF"
              return (
                <button
                  key={sw.stop}
                  type="button"
                  onClick={() => onCopy(cls)}
                  style={{ backgroundColor: sw.hex }}
                  className="relative w-full rounded-scrunch-md border border-black/[0.07] cursor-pointer hover:scale-[1.03] transition-transform duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-s-blue-500 overflow-hidden group"
                  aria-label={`Copy ${cls}`}
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center bg-coal text-white text-[10px] leading-tight rounded-scrunch-sm px-2 py-1.5 whitespace-nowrap shadow-scrunch-md z-[60] pointer-events-none">
                    <span className="font-plex-mono text-white/70">{cls}</span>
                    <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-coal" aria-hidden />
                  </div>
                  <div className="flex flex-col items-start justify-between p-2" style={{ height: 72 }}>
                    <span className="font-sans text-[10px] font-semibold leading-none" style={{ color: fg }}>{sw.stop}</span>
                    <span className="font-plex-mono text-[8.5px] leading-none" style={{ color: fg }}>{sw.hex}</span>
                  </div>
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   Combined Export tab — PNG download + Figma export
───────────────────────────────────────────────────────── */

type DiscoveredSection = { id: string; label: string; el: HTMLElement }
type FigmaOutputMode   = "newFile" | "clipboard"
type FigmaExportTarget = "page" | "sections"

function ExportTab({ onToast }: { onToast: (msg: string) => void }) {
  // PNG state
  const [pngSections, setPngSections] = useState<DiscoveredSection[]>([])
  const [exporting,   setExporting]   = useState<string | null>(null)

  // Figma state
  const [target,       setTarget]      = useState<FigmaExportTarget>("page")
  const [outputMode,   setOutputMode]  = useState<FigmaOutputMode>("newFile")
  const [figmaSections, setFigmaSections] = useState<{ id: string; label: string }[]>([])
  const [selected,     setSelected]    = useState<Set<string>>(new Set())
  const [copied,       setCopied]      = useState(false)
  const [pageUrl,      setPageUrl]     = useState("")
  const [pageName,     setPageName]    = useState("")
  const [delay,        setDelay]       = useState(4)

  const scan = useCallback(() => {
    const pngFound: DiscoveredSection[] = []
    const figmaFound: { id: string; label: string }[] = []
    document.querySelectorAll<HTMLElement>("[data-export-id]").forEach((el) => {
      const id    = el.getAttribute("data-export-id")!
      const label = el.getAttribute("data-export-label") || id
      pngFound.push({ id, label, el })
      figmaFound.push({ id, label })
    })
    setPngSections(pngFound)
    setFigmaSections(figmaFound)
    setSelected(new Set(figmaFound.map((s) => s.id)))
    if (typeof window !== "undefined") {
      setPageUrl(window.location.href)
      const h1 = document.querySelector("h1")
      setPageName(h1?.textContent?.trim() || document.title || "Page")
    }
  }, [])

  useEffect(() => { scan() }, [scan])

  // PNG helpers
  const doPngExport = async (el: HTMLElement, filename: string) => {
    setExporting(filename)
    try {
      const { toPng } = await import("html-to-image")
      el.scrollIntoView({ block: "start", behavior: "instant" })
      await new Promise((r) => setTimeout(r, 120))
      const dataUrl = await toPng(el, {
        backgroundColor: "#ffffff",
        pixelRatio: 2,
        height: el.scrollHeight,
        width: el.scrollWidth,
        style: { overflow: "visible" },
        skipFonts: false,
        cacheBust: true,
      })
      const a = document.createElement("a")
      a.href = dataUrl
      a.download = `${filename}.png`
      a.click()
      onToast(`Downloaded ${filename}.png`)
    } catch (err) {
      onToast(`Export failed: ${err instanceof Error ? err.message : "unknown error"}`)
    } finally {
      setExporting(null)
    }
  }

  const exportFullPage = async () => {
    const content = document.querySelector<HTMLElement>("main > div") ?? document.querySelector<HTMLElement>("main")
    if (!content) { onToast("No page content found"); return }
    await doPngExport(content, "full-page")
  }

  // Figma helpers
  const buildPrompt = () => {
    const selArr = Array.from(selected)
    const targetDesc =
      target === "page"
        ? `the entire "${pageName}" page`
        : selArr.length > 0
          ? `these sections from "${pageName}": ${selArr.join(", ")}`
          : `the entire "${pageName}" page`
    const outputDesc =
      outputMode === "newFile" ? "Create a new Figma file." : "Copy to the Figma clipboard."
    return `Export ${targetDesc} to Figma. Dev server URL: ${pageUrl}. ${outputDesc} Use a ${delay * 1000}ms capture delay.`
  }

  const copyPrompt = async () => {
    const prompt = buildPrompt()
    try {
      await navigator.clipboard.writeText(prompt)
    } catch {
      const ta = document.createElement("textarea")
      ta.value = prompt
      document.body.appendChild(ta); ta.select()
      document.execCommand("copy")
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  const toggleSection = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })

  return (
    <div className="py-4 space-y-6">

      {/* ── PNG Export ── */}
      <div>
        <p className="text-[11px] font-medium text-ink/40 uppercase tracking-[0.06em] mb-3">PNG Export</p>

        <div className="space-y-3">
          {/* Full page */}
          <button
            type="button"
            onClick={exportFullPage}
            disabled={exporting === "full-page"}
            className="flex items-center gap-2 rounded-scrunch-md border border-s-neutral-200 bg-white px-3 py-2 text-[13px] text-ink/70 hover:bg-s-neutral-50 hover:text-ink transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exporting === "full-page"
              ? <RefreshCw size={14} className="animate-spin" />
              : <FileScan size={14} />}
            Export entire page
          </button>

          {/* Named sections */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] text-ink/40">
                Named sections {pngSections.length > 0 && `(${pngSections.length})`}
              </p>
              <button
                type="button"
                onClick={scan}
                className="flex items-center gap-1 text-[11px] text-ink/40 hover:text-ink transition-colors"
              >
                <RefreshCw size={11} /> Scan
              </button>
            </div>

            {pngSections.length === 0 ? (
              <div className="rounded-scrunch-md border border-dashed border-s-neutral-300 px-4 py-4 text-center">
                <p className="text-[12px] text-ink/40 leading-relaxed">No sections found on this page.</p>
                <p className="mt-1.5 text-[11px] text-ink/30 font-plex-mono leading-relaxed">
                  Add <span className="bg-s-neutral-100 px-1 rounded">data-export-id=&quot;name&quot;</span> to any element.
                </p>
              </div>
            ) : (
              <div className="rounded-scrunch-md border border-s-neutral-200 overflow-hidden divide-y divide-s-neutral-100">
                {pngSections.map(({ id, label, el }) => (
                  <div key={id} className="flex items-center justify-between px-3 py-2.5 hover:bg-s-neutral-50 transition-colors">
                    <span className="text-[13px] text-ink/70">{label}</span>
                    <button
                      type="button"
                      onClick={() => doPngExport(el, id)}
                      disabled={exporting === id}
                      className="flex items-center gap-1.5 rounded-scrunch-md border border-s-neutral-200 bg-white px-2.5 py-1 text-[11.5px] text-ink/60 hover:bg-s-neutral-50 hover:text-ink transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {exporting === id
                        ? <RefreshCw size={11} className="animate-spin" />
                        : <Download size={11} />}
                      PNG
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-s-neutral-200" />

      {/* ── Figma Export ── */}
      <div className="space-y-5">
        <p className="text-[11px] font-medium text-ink/40 uppercase tracking-[0.06em]">Figma Export</p>

        {/* Export target */}
        <div>
          <p className="text-[11px] text-ink/40 mb-2">Export target</p>
          <div className="flex gap-1.5">
            {(["page", "sections"] as FigmaExportTarget[]).map((t) => (
              <button key={t} type="button" onClick={() => setTarget(t)}
                className={`px-3 py-1.5 rounded-scrunch-pill text-[12px] font-medium transition-colors ${
                  target === t
                    ? "bg-s-blue-600 text-white"
                    : "bg-s-neutral-100 text-ink/60 hover:bg-s-neutral-200"
                }`}
              >
                {t === "page" ? "Whole page" : "Select sections"}
              </button>
            ))}
          </div>
        </div>

        {/* Section selector */}
        {target === "sections" && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] text-ink/40">
                Sections {figmaSections.length > 0 && `(${figmaSections.length})`}
              </p>
              <button type="button" onClick={scan}
                className="flex items-center gap-1 text-[11px] text-ink/40 hover:text-ink transition-colors">
                <RefreshCw size={11} /> Scan
              </button>
            </div>
            {figmaSections.length === 0 ? (
              <div className="rounded-scrunch-md border border-dashed border-s-neutral-300 px-4 py-4 text-center">
                <p className="text-[12px] text-ink/40">No sections found on this page.</p>
                <p className="mt-1.5 text-[11px] text-ink/30 font-plex-mono">
                  Add <span className="bg-s-neutral-100 px-1 rounded">data-export-id=&quot;name&quot;</span> to any element.
                </p>
              </div>
            ) : (
              <div className="rounded-scrunch-md border border-s-neutral-200 overflow-hidden divide-y divide-s-neutral-100">
                {figmaSections.map(({ id, label }) => (
                  <label key={id}
                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-s-neutral-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={selected.has(id)}
                      onChange={() => toggleSection(id)}
                      className="h-3.5 w-3.5 accent-blue-600 rounded"
                    />
                    <span className="text-[13px] text-ink/70 flex-1">{label}</span>
                    <span className="text-[11px] font-plex-mono text-ink/30">{id}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Output mode */}
        <div>
          <p className="text-[11px] text-ink/40 mb-2">Output</p>
          <div className="flex gap-1.5">
            {([
              ["newFile",   "New Figma file"  ],
              ["clipboard", "Figma clipboard" ],
            ] as [FigmaOutputMode, string][]).map(([m, label]) => (
              <button key={m} type="button" onClick={() => setOutputMode(m)}
                className={`px-3 py-1.5 rounded-scrunch-pill text-[12px] font-medium transition-colors ${
                  outputMode === m
                    ? "bg-s-blue-600 text-white"
                    : "bg-s-neutral-100 text-ink/60 hover:bg-s-neutral-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Capture delay */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] text-ink/40">Capture delay</p>
            <span className="text-[12px] font-plex-mono text-ink/60">{delay}s</span>
          </div>
          <input
            type="range" min={1} max={10} step={0.5} value={delay}
            onChange={(e) => setDelay(Number(e.target.value))}
            className="w-full accent-s-blue-600 h-1.5 rounded-full cursor-pointer"
          />
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-ink/30 font-plex-mono">1s</span>
            <span className="text-[10px] text-ink/30 font-plex-mono">10s</span>
          </div>
          <p className="text-[11px] text-ink/35 mt-1.5 leading-snug">
            Increase if charts or animations haven&apos;t finished loading when captured.
          </p>
        </div>

        {/* How it works */}
        <div className="rounded-scrunch-md bg-s-neutral-100 border border-s-neutral-200 px-4 py-3.5">
          <p className="text-[12px] font-semibold text-ink/70 mb-3">How to export</p>
          <ol className="space-y-2.5">
            {[
              "Choose your target and output mode above.",
              "Click \"Copy prompt\" to copy the export instruction.",
              "Paste it into the Claude Code chat.",
              "Claude captures the page and pushes it to Figma.",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span
                  className="shrink-0 flex items-center justify-center rounded-full bg-s-blue-600 text-white font-bold text-[10px]"
                  style={{ width: 17, height: 17, paddingTop: 0.5 }}
                >
                  {i + 1}
                </span>
                <span className="text-[12px] text-ink/60 leading-snug">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Generated prompt preview */}
        <div>
          <p className="text-[11px] text-ink/40 mb-2">Export prompt</p>
          <div className="rounded-scrunch-md border border-s-neutral-200 bg-s-neutral-50 px-3 py-2.5 mb-2.5">
            <p className="text-[11.5px] font-plex-mono text-ink/55 leading-relaxed break-words">
              {buildPrompt()}
            </p>
          </div>
          <button
            type="button"
            onClick={copyPrompt}
            className={`flex items-center gap-2 w-full justify-center rounded-scrunch-md px-4 py-2.5 text-[13px] font-medium transition-colors ${
              copied
                ? "bg-s-green-200 text-s-green-800 border border-s-green-300"
                : "bg-s-blue-600 text-white hover:bg-s-blue-700"
            }`}
          >
            {copied
              ? <><Check size={14} />Prompt copied!</>
              : <><Copy  size={14} />Copy prompt</>}
          </button>
        </div>
      </div>

    </div>
  )
}

export function ColorPickerOverlay() {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"palette" | "data" | "export">("palette")
  const [toast, setToast] = useState<string | null>(null)

  const handleCopy = useCallback(async (cls: string) => {
    try {
      await navigator.clipboard.writeText(cls)
    } catch {
      // Fallback for non-secure contexts
      const el = document.createElement("textarea")
      el.value = cls
      document.body.appendChild(el)
      el.select()
      document.execCommand("copy")
      document.body.removeChild(el)
    }

    setToast(`Copied! ${cls}`)
    setTimeout(() => setToast(null), 2000)
  }, [])

  // Representative dot color: Green 400
  const dotColor = "#AECE31"

  return (
    <>
      {/* Toggle button — fixed bottom-right */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="
          fixed bottom-5 right-5 z-50
          flex items-center gap-1.5 px-3 py-1.5
          bg-paper border border-s-neutral-200
          rounded-scrunch-pill shadow-scrunch-md
          text-xs font-medium text-ink/70
          hover:bg-s-neutral-100 hover:text-ink
          transition-colors duration-150
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-s-blue-500
        "
        aria-label="Toggle tools panel"
      >
        <span
          className="inline-block rounded-full flex-shrink-0"
          style={{ width: 10, height: 10, backgroundColor: dotColor }}
          aria-hidden
        />
        Tools
      </button>

      {/* Backdrop (closes panel on outside click) */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* Sliding panel */}
      <div
        className={`
          fixed top-0 right-0 z-50 h-full
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
        style={{ width: 580 }}
        aria-hidden={!open}
      >
        <div
          className="
            h-full flex flex-col
            bg-paper shadow-scrunch-lg
            rounded-l-scrunch-lg overflow-hidden
          "
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-s-neutral-200 flex-shrink-0">
            <div>
              <h2 className="text-sm font-semibold text-ink leading-tight">
                Scrunch Color Palette
              </h2>
              <p className="text-[11px] text-ink/50 mt-0.5">
                Click any swatch to copy its Tailwind utility class
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="
                p-1.5 rounded-scrunch-sm text-ink/40
                hover:text-ink hover:bg-s-neutral-100
                transition-colors duration-100
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-s-blue-500
              "
              aria-label="Close color palette"
            >
              <X size={16} />
            </button>
          </div>

          {/* Tab bar */}
          <div className="flex gap-1 px-5 pt-3 pb-0 flex-shrink-0 border-b border-s-neutral-200">
            {(["palette", "data", "export"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`
                  px-3 py-1.5 text-[12px] font-medium rounded-t-scrunch-sm border-b-2 -mb-px transition-colors duration-100
                  ${activeTab === tab
                    ? "border-s-blue-600 text-s-blue-600"
                    : "border-transparent text-ink/40 hover:text-ink/70"}
                `}
              >
                {tab === "palette" ? "All Colors"
                  : tab === "data"  ? "Data Palette"
                  :                  "Export"}
              </button>
            ))}
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-5 py-3">
            {activeTab === "palette" ? (
              <>
                {PALETTE.map((group) => (
                  <PaletteRow key={group.prefix} group={group} onCopy={handleCopy} />
                ))}
              </>
            ) : activeTab === "data" ? (
              <DataPaletteGrid onCopy={handleCopy} />
            ) : (
              <ExportTab onToast={(msg) => { setToast(msg); setTimeout(() => setToast(null), 2500) }} />
            )}
          </div>
        </div>
      </div>

      {/* Toast notification */}
      {toast && <Toast message={toast} />}
    </>
  )
}
