"use client"

import {
  Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, XAxis, YAxis,
} from "recharts"
import { getChartColors } from "@/lib/chart-palette"

const NEUTRAL_500 = "#93886F"

const PALETTE_DEMO_DATA = [
  { m: "Jan", v: [72, 55, 38, 61, 44, 83, 37, 58, 69, 47, 63, 51] },
  { m: "Feb", v: [81, 43, 67, 55, 68, 52, 61, 44, 74, 39, 57, 66] },
  { m: "Mar", v: [58, 71, 45, 34, 39, 64, 73, 51, 42, 68, 55, 38] },
  { m: "Apr", v: [65, 62, 53, 72, 57, 41, 48, 67, 53, 76, 44, 59] },
]

function makePaletteBarData(n: number): Record<string, string | number>[] {
  return PALETTE_DEMO_DATA.map(row => {
    const obj: Record<string, string | number> = { m: row.m }
    for (let i = 0; i < n; i++) obj[`s${i}`] = row.v[i]
    return obj
  })
}

const variants: { n: number; label: string }[] = [
  { n: 1,  label: "1 series"  },
  { n: 2,  label: "2 series"  },
  { n: 3,  label: "3 series"  },
  { n: 4,  label: "4 series"  },
  { n: 5,  label: "5 series"  },
  { n: 6,  label: "6 series"  },
  { n: 8,  label: "7+ series" },
  { n: 12, label: "12 series" },
]

export function PaletteDemoSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-1.5 text-[15px] font-semibold text-ink">Data Palette Rules</h2>
        <p className="text-[13px] text-ink/50 leading-relaxed">
          1–6 series: hand-picked for contrast — Blue 500 → Green 400 → Neutral 400 → Blue 300 → Green 600 → Neutral 500. At 7+ series: full family cascade, dark to light — all Blues, then Greens, then Neutrals, then Ambers.
        </p>
      </div>

      {/* Bar charts */}
      <div>
        <p className="mb-3 text-[12px] font-medium text-ink/40 uppercase tracking-[0.06em]">Bar</p>
        <div className="grid grid-cols-4 gap-4">
          {variants.map(({ n, label }) => {
            const colors = getChartColors(n)
            const data = makePaletteBarData(n)
            const keys = Array.from({ length: n }, (_, i) => `s${i}`)
            return (
              <div key={n} className="rounded-scrunch-lg bg-white p-5 shadow-scrunch-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[13px] font-medium text-ink/70">{label}</span>
                  <div className="flex items-center gap-1 flex-wrap justify-end" style={{ maxWidth: 100 }}>
                    {colors.map((c, i) => (
                      <span key={i} className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={100}>
                  <BarChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: -30 }} barGap={1} barCategoryGap="30%">
                    <CartesianGrid strokeDasharray="2 3" stroke="var(--chart-grid)" vertical={false} />
                    <XAxis dataKey="m" tick={{ fontSize: 10, fill: NEUTRAL_500 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: NEUTRAL_500 }} tickLine={false} axisLine={false} />
                    {keys.map((k, i) => (
                      <Bar key={k} dataKey={k} fill={colors[i]} radius={[2, 2, 0, 0]} isAnimationActive={false} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )
          })}
        </div>
      </div>

      {/* Donut charts */}
      <div>
        <p className="mb-3 text-[12px] font-medium text-ink/40 uppercase tracking-[0.06em]">Donut</p>
        <div className="grid grid-cols-4 gap-4">
          {variants.map(({ n, label }) => {
            const colors = getChartColors(n)
            const slices = Array.from({ length: n }, (_, i) => ({ v: 1, color: colors[i] }))
            return (
              <div key={n} className="rounded-scrunch-lg bg-white p-5 shadow-scrunch-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[13px] font-medium text-ink/70">{label}</span>
                  <div className="flex items-center gap-1 flex-wrap justify-end" style={{ maxWidth: 100 }}>
                    {colors.map((c, i) => (
                      <span key={i} className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>
                <div className="flex justify-center">
                  <PieChart width={120} height={120} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                    <Pie data={slices} cx={60} cy={60} innerRadius={32} outerRadius={56}
                      dataKey="v" startAngle={90} endAngle={-270} strokeWidth={0}
                      isAnimationActive={false}>
                      {slices.map((s, i) => <Cell key={i} fill={s.color} />)}
                    </Pie>
                  </PieChart>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
