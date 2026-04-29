import { ChartPieInteractive } from "@/components/charts/pie/chart-pie-interactive"
import { ChartPieSimple } from "@/components/charts/pie/chart-pie-simple"
import { ChartPieDonut } from "@/components/charts/pie/chart-pie-donut"
import { ChartPieDonutActive } from "@/components/charts/pie/chart-pie-donut-active"
import { ChartPieDonutText } from "@/components/charts/pie/chart-pie-donut-text"
import { ChartPieLabel } from "@/components/charts/pie/chart-pie-label"
import { ChartPieLabelList } from "@/components/charts/pie/chart-pie-label-list"
import { ChartPieLegend } from "@/components/charts/pie/chart-pie-legend"
import { ChartPieStacked } from "@/components/charts/pie/chart-pie-stacked"

export default function PieChartsPage() {
  return (
    <div className="space-y-8">
      <ChartPieInteractive />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <ChartPieSimple />
        <ChartPieDonut />
        <ChartPieDonutActive />
        <ChartPieDonutText />
        <ChartPieLabel />
        <ChartPieLabelList />
        <ChartPieLegend />
        <ChartPieStacked />
      </div>
    </div>
  )
}
