import { ChartBarInteractive } from "@/components/charts/bar/chart-bar-interactive"
import { ChartBarDefault } from "@/components/charts/bar/chart-bar-default"
import { ChartBarHorizontal } from "@/components/charts/bar/chart-bar-horizontal"
import { ChartBarMultiple } from "@/components/charts/bar/chart-bar-multiple"
import { ChartBarStacked } from "@/components/charts/bar/chart-bar-stacked"
import { ChartBarActive } from "@/components/charts/bar/chart-bar-active"
import { ChartBarNegative } from "@/components/charts/bar/chart-bar-negative"
import { ChartBarMixed } from "@/components/charts/bar/chart-bar-mixed"
import { ChartBarLabel } from "@/components/charts/bar/chart-bar-label"
import { ChartBarLabelCustom } from "@/components/charts/bar/chart-bar-label-custom"

export default function BarChartsPage() {
  return (
    <div className="space-y-8">
      <ChartBarInteractive />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <ChartBarDefault />
        <ChartBarHorizontal />
        <ChartBarMultiple />
        <ChartBarStacked />
        <ChartBarActive />
        <ChartBarNegative />
        <ChartBarMixed />
        <ChartBarLabel />
        <ChartBarLabelCustom />
      </div>
    </div>
  )
}
