/**
 * chart-palette.ts — single source of truth for Scrunch data colors
 *
 * Edit hex values here to update every chart, graph, and the color picker
 * panel simultaneously. The 12 slots map 1:1 to --chart-1 … --chart-12 in
 * globals.css (keep those in sync as the CSS fallback for server render).
 *
 * ─── Color logic ────────────────────────────────────────────────────────────
 *  1–6 series  → alternating family picks for maximum contrast:
 *                Blue 500 → Green 400 → Neutral 400 → Blue 300 → Green 600 → Neutral 500
 *
 *  7–12 series → family cascade (all blues, then greens, then neutrals, then ambers):
 *                Blue 500 → Blue 300 → Blue 800 →
 *                Green 400 → Green 600 → Green 800 →
 *                Neutral 400 → Neutral 500 → Neutral 800 →
 *                Amber 800 → Amber 500 → Amber 300
 */

export type ChartPaletteEntry = {
  hex: string
  /** true = swatch is light; render dark/ink text on top of it */
  dark: boolean
  stop: number    // CSS scale stop (500 / 400 / 800 …)
  prefix: string  // Tailwind color prefix (s-blue, s-green …)
}

export type ChartPaletteFamily = {
  name: string
  swatches: readonly ChartPaletteEntry[]
}

// ─── 12-slot canonical data palette ─────────────────────────────────────────
// Swatches within each family are ordered by cascade priority (first = highest).
// CHART_COLORS_12 is derived via flatMap, so swatch order here = slot order there.
export const CHART_PALETTE_FAMILIES: readonly ChartPaletteFamily[] = [
  {
    name: "Blue",
    swatches: [
      { hex: "#3C67F5", dark: false, stop: 500, prefix: "s-blue"    },  //  1
      { hex: "#93C0FE", dark: true,  stop: 300, prefix: "s-blue"    },  //  2
      { hex: "#1F2CAE", dark: false, stop: 800, prefix: "s-blue"    },  //  3
    ],
  },
  {
    name: "Green",
    swatches: [
      { hex: "#AECE31", dark: true,  stop: 400, prefix: "s-green"   },  //  4
      { hex: "#84A027", dark: false, stop: 600, prefix: "s-green"   },  //  5
      { hex: "#586B16", dark: false, stop: 800, prefix: "s-green"   },  //  6
    ],
  },
  {
    name: "Neutral",
    swatches: [
      { hex: "#B8AB8E", dark: true,  stop: 400, prefix: "s-neutral" },  //  7
      { hex: "#93886F", dark: false, stop: 500, prefix: "s-neutral" },  //  8
      { hex: "#40362E", dark: false, stop: 800, prefix: "s-neutral" },  //  9
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
 * 7–12 series: family cascade — all Blues, then Greens, then Neutrals, then Ambers.
 * Derived from CHART_PALETTE_FAMILIES so swatch edits propagate automatically.
 */
export const CHART_COLORS_12: string[] = CHART_PALETTE_FAMILIES.flatMap(
  (f) => f.swatches.map((s) => s.hex)
)

/**
 * 1–6 series: alternating family picks for maximum inter-series contrast.
 * Order: Blue 500 → Green 400 → Neutral 400 → Blue 300 → Green 600 → Neutral 500
 */
export const CHART_COLORS_6: string[] = [
  CHART_PALETTE_FAMILIES[0].swatches[0].hex, // Blue 500   — slot 1
  CHART_PALETTE_FAMILIES[1].swatches[0].hex, // Green 400  — slot 4
  CHART_PALETTE_FAMILIES[2].swatches[0].hex, // Neutral 400 — slot 7
  CHART_PALETTE_FAMILIES[0].swatches[1].hex, // Blue 300   — slot 2
  CHART_PALETTE_FAMILIES[1].swatches[1].hex, // Green 600  — slot 5
  CHART_PALETTE_FAMILIES[2].swatches[1].hex, // Neutral 500 — slot 8
]

/**
 * Returns n chart colors using the optimal palette for that series count.
 *   n ≤ 6  → contrast-first alternating picks (CHART_COLORS_6)
 *   n 7–12 → family cascade (CHART_COLORS_12)
 */
export function getChartColors(n: number): string[] {
  const clamped = Math.min(n, 12)
  if (clamped <= 6) return CHART_COLORS_6.slice(0, clamped)
  return CHART_COLORS_12.slice(0, clamped)
}
