"use client"

import { useState, useCallback } from "react"
import { X } from "lucide-react"

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
      { stop: 200, hex: "#E9FE91" },
      { stop: 300, hex: "#D8FC3B", alias: "AI" },
      { stop: 400, hex: "#CCF60E" },
      { stop: 500, hex: "#BEE208" },
      { stop: 600, hex: "#A3BC03" },
      { stop: 700, hex: "#6E8920", alias: "BOTANIC" },
      { stop: 800, hex: "#656B0A" },
      { stop: 900, hex: "#484B0C" },
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
      { stop: 200, hex: "#FFF587" },
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
      { stop: 200, hex: "#FFF587", prefixOverride: "s-warning" },
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

      {/* Named alias */}
      {swatch.alias && (
        <span className="font-plex-mono text-[8px] leading-none text-ink/50 tracking-wide text-center mt-0.5" style={{ maxWidth: 56 }}>
          {swatch.alias}
        </span>
      )}
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
   Full Data Palette — 12 canonical data colors (4 families × 3 stops)
───────────────────────────────────────────────────────── */

type DataSwatch = { hex: string; stop: number; prefix: string; dark: boolean }
type DataFamily = { name: string; swatches: DataSwatch[] }

const DATA_PALETTE: DataFamily[] = [
  {
    name: "Blue",
    swatches: [
      { hex: "#1F2CAE", stop: 800, prefix: "s-blue",    dark: false },
      { hex: "#3C67F5", stop: 500, prefix: "s-blue",    dark: false },
      { hex: "#93C0FE", stop: 300, prefix: "s-blue",    dark: true  },
    ],
  },
  {
    name: "Green",
    swatches: [
      { hex: "#656B0A", stop: 800, prefix: "s-green",   dark: false },
      { hex: "#A3BC03", stop: 600, prefix: "s-green",   dark: false },
      { hex: "#CCF60E", stop: 400, prefix: "s-green",   dark: true  },
    ],
  },
  {
    name: "Neutral",
    swatches: [
      { hex: "#40362E", stop: 800, prefix: "s-neutral", dark: false },
      { hex: "#93886F", stop: 500, prefix: "s-neutral", dark: false },
      { hex: "#F1E8C7", stop: 300, prefix: "s-neutral", dark: true  },
    ],
  },
  {
    name: "Amber",
    swatches: [
      { hex: "#88520B", stop: 800, prefix: "s-warning", dark: false },
      { hex: "#EFBE03", stop: 500, prefix: "s-warning", dark: true  },
      { hex: "#FFE843", stop: 300, prefix: "s-warning", dark: true  },
    ],
  },
]

function DataPaletteGrid({ onCopy }: { onCopy: (cls: string) => void }) {
  return (
    <div className="py-4">
      <p className="text-[11px] text-ink/40 mb-5 leading-snug">
        The 12 canonical data colors — blue, green, neutral, and amber at stops 300 / 500 / 800.
        Click any swatch to copy its utility class.
      </p>
      {/* 4-column grid: one column per family */}
      <div className="grid grid-cols-4 gap-3">
        {DATA_PALETTE.map((family) => (
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

export function ColorPickerOverlay() {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"palette" | "data">("palette")
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
  const dotColor = "#CCF60E"

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
        aria-label="Toggle color palette"
      >
        <span
          className="inline-block rounded-full border border-black/10 flex-shrink-0"
          style={{ width: 10, height: 10, backgroundColor: dotColor }}
          aria-hidden
        />
        Colors
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
            {(["palette", "data"] as const).map((tab) => (
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
                {tab === "palette" ? "All Colors" : "Full Data Palette"}
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
            ) : (
              <DataPaletteGrid onCopy={handleCopy} />
            )}
          </div>
        </div>
      </div>

      {/* Toast notification */}
      {toast && <Toast message={toast} />}
    </>
  )
}
