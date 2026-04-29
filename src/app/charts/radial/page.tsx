import { ChartRadialSimple } from "@/components/charts/radial/chart-radial-simple"
import { ChartRadialLabel } from "@/components/charts/radial/chart-radial-label"
import { ChartRadialGrid } from "@/components/charts/radial/chart-radial-grid"
import { ChartRadialText } from "@/components/charts/radial/chart-radial-text"
import { ChartRadialStacked } from "@/components/charts/radial/chart-radial-stacked"

export default function RadialChartsPage() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <ChartRadialSimple />
        <ChartRadialLabel />
        <ChartRadialGrid />
        <ChartRadialText />
        <ChartRadialStacked />
      </div>
    </div>
  )
}
