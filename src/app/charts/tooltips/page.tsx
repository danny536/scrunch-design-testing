import { ChartTooltipDefault } from "@/components/charts/tooltips/chart-tooltip-default"
import { ChartTooltipIndicatorLine } from "@/components/charts/tooltips/chart-tooltip-indicator-line"
import { ChartTooltipIndicatorNone } from "@/components/charts/tooltips/chart-tooltip-indicator-none"
import { ChartTooltipLabelNone } from "@/components/charts/tooltips/chart-tooltip-label-none"
import { ChartTooltipLabelCustom } from "@/components/charts/tooltips/chart-tooltip-label-custom"
import { ChartTooltipFormatter } from "@/components/charts/tooltips/chart-tooltip-formatter"
import { ChartTooltipIcons } from "@/components/charts/tooltips/chart-tooltip-icons"

export default function TooltipsPage() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <ChartTooltipDefault />
        <ChartTooltipIndicatorLine />
        <ChartTooltipIndicatorNone />
        <ChartTooltipLabelNone />
        <ChartTooltipLabelCustom />
        <ChartTooltipFormatter />
        <ChartTooltipIcons />
      </div>
    </div>
  )
}
