/**
 * chart-palette.ts — single source of truth for Scrunch data colors
 *
 * Edit hex values here to update every chart, graph, and the color picker
 * panel simultaneously. The 12 slots map 1:1 to --chart-1 … --chart-12 in
 * globals.css (keep those in sync as the CSS fallback for server render).
 */

export type ChartPaletteEntry = {
  hex: string
  /** true = swatch is light; render dark/ink text on top of it */
  dark: boolean
  stop: number    // CSS scale stop (800 / 600 / 400 …)
  prefix: string  // Tailwind color prefix (s-blue, s-green …)
}

export type ChartPaletteFamily = {
  name: string
  swatches: readonly ChartPaletteEntry[]
}

// ─── 12-slot canonical data palette ─────────────────────────────────────────
// 4 families × 3 stops each — Blues → Greens → Neutrals → Ambers
// Slot numbering (1-based) matches --chart-N CSS variables.
export const CHART_PALETTE_FAMILIES: readonly ChartPaletteFamily[] = [
  {
    name: "Blue",
    swatches: [
      { hex: "#1F2CAE", dark: false, stop: 800, prefix: "s-blue"    },  //  1
      { hex: "#3C67F5", dark: false, stop: 500, prefix: "s-blue"    },  //  2
      { hex: "#93C0FE", dark: true,  stop: 300, prefix: "s-blue"    },  //  3
    ],
  },
  {
    name: "Green",
    swatches: [
      { hex: "#586B16", dark: false, stop: 800, prefix: "s-green"   },  //  4
      { hex: "#84A027", dark: false, stop: 600, prefix: "s-green"   },  //  5
      { hex: "#AECE31", dark: true,  stop: 400, prefix: "s-green"   },  //  6
    ],
  },
  {
    name: "Neutral",
    swatches: [
      { hex: "#40362E", dark: false, stop: 800, prefix: "s-neutral" },  //  7
      { hex: "#93886F", dark: false, stop: 500, prefix: "s-neutral" },  //  8
      { hex: "#F1E8C7", dark: true,  stop: 300, prefix: "s-neutral" },  //  9
    ],
  },
  {
    name: "Amber",
    swatches: [
      { hex: "#88520B", dark: false, stop: 800, prefix: "s-warning" },  // 10
      { hex: "#EFBE03", dark: true,  stop: 500, prefix: "s-warning" },  // 11
      { hex: "#FFE843", dark: true,  stop: 300, prefix: "s-warning" },  // 12
    ],
  },
] as const

/**
 * Flat ordered array of 12 hex values.
 * Index 0 = slot 1 (Blue 800), index 11 = slot 12 (Amber 300).
 */
export const CHART_COLORS_12: string[] = CHART_PALETTE_FAMILIES.flatMap(
  (f) => f.swatches.map((s) => s.hex)
)

/**
 * 1–6 series: alternating family picks for contrast.
 * Order: Blue 500 → Green 400 → Neutral 400 → Blue 300 → Green 600 → Neutral 500
 */
export const CHART_COLORS_6: string[] = [
  CHART_PALETTE_FAMILIES[0].swatches[1].hex, // Blue 500
  CHART_PALETTE_FAMILIES[1].swatches[2].hex, // Green 400
  "#B8AB8E",                                  // Neutral 400
  CHART_PALETTE_FAMILIES[0].swatches[2].hex, // Blue 300
  CHART_PALETTE_FAMILIES[1].swatches[1].hex, // Green 600
  CHART_PALETTE_FAMILIES[2].swatches[1].hex, // Neutral 500
]

/**
 * Returns n chart colors using the optimal palette for that series count.
 * ≤6 → contrast-first alternating picks (CHART_COLORS_6)
 * 7–12 → full family cascade (CHART_COLORS_12)
 */
export function getChartColors(n: number): string[] {
  const clamped = Math.min(n, 12)
  if (clamped <= 6) return CHART_COLORS_6.slice(0, clamped)
  return CHART_COLORS_12.slice(0, clamped)
}
