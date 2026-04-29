import { ChartAreaDefault } from "@/components/charts/area/chart-area-default"
import { ChartAreaLinear } from "@/components/charts/area/chart-area-linear"
import { ChartAreaStep } from "@/components/charts/area/chart-area-step"
import { ChartAreaStacked } from "@/components/charts/area/chart-area-stacked"
import { ChartAreaStackedExpand } from "@/components/charts/area/chart-area-stacked-expand"
import { ChartAreaAxes } from "@/components/charts/area/chart-area-axes"
import { ChartAreaGradient } from "@/components/charts/area/chart-area-gradient"
import { ChartAreaIcons } from "@/components/charts/area/chart-area-icons"
import { ChartAreaLegend } from "@/components/charts/area/chart-area-legend"
import { ChartAreaInteractive } from "@/components/charts/area/chart-area-interactive"

export default function AreaChartsPage() {
  return (
    <div className="space-y-8">
      {/* Full-width interactive chart at the top, matching shadcn layout */}
      <ChartAreaInteractive />

      {/* 3-column grid for the rest */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <ChartAreaDefault />
        <ChartAreaLinear />
        <ChartAreaStep />
        <ChartAreaStacked />
        <ChartAreaStackedExpand />
        <ChartAreaAxes />
        <ChartAreaGradient />
        <ChartAreaIcons />
        <ChartAreaLegend />
      </div>
    </div>
  )
}
