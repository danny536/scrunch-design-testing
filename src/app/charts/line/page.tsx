import { ChartLineInteractive } from "@/components/charts/line/chart-line-interactive"
import { ChartLineDefault } from "@/components/charts/line/chart-line-default"
import { ChartLineLinear } from "@/components/charts/line/chart-line-linear"
import { ChartLineStep } from "@/components/charts/line/chart-line-step"
import { ChartLineDots } from "@/components/charts/line/chart-line-dots"
import { ChartLineDotsColors } from "@/components/charts/line/chart-line-dots-colors"
import { ChartLineMultiple } from "@/components/charts/line/chart-line-multiple"
import { ChartLineLabel } from "@/components/charts/line/chart-line-label"
import { ChartLineLabelCustom } from "@/components/charts/line/chart-line-label-custom"

export default function LineChartsPage() {
  return (
    <div className="space-y-8">
      <ChartLineInteractive />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <ChartLineDefault />
        <ChartLineLinear />
        <ChartLineStep />
        <ChartLineDots />
        <ChartLineDotsColors />
        <ChartLineMultiple />
        <ChartLineLabel />
        <ChartLineLabelCustom />
      </div>
    </div>
  )
}
