import { ChartRadarDefault } from "@/components/charts/radar/chart-radar-default"
import { ChartRadarDots } from "@/components/charts/radar/chart-radar-dots"
import { ChartRadarMultiple } from "@/components/charts/radar/chart-radar-multiple"
import { ChartRadarLegend } from "@/components/charts/radar/chart-radar-legend"
import { ChartRadarGridFill } from "@/components/charts/radar/chart-radar-grid-fill"
import { ChartRadarGridCircle } from "@/components/charts/radar/chart-radar-grid-circle"
import { ChartRadarGridNone } from "@/components/charts/radar/chart-radar-grid-none"
import { ChartRadarGridCircleFill } from "@/components/charts/radar/chart-radar-grid-circle-fill"
import { ChartRadarGridCircleNoLines } from "@/components/charts/radar/chart-radar-grid-circle-no-lines"
import { ChartRadarGridCustom } from "@/components/charts/radar/chart-radar-grid-custom"
import { ChartRadarIcons } from "@/components/charts/radar/chart-radar-icons"
import { ChartRadarLabelCustom } from "@/components/charts/radar/chart-radar-label-custom"
import { ChartRadarLinesOnly } from "@/components/charts/radar/chart-radar-lines-only"
import { ChartRadarRadius } from "@/components/charts/radar/chart-radar-radius"

export default function RadarChartsPage() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <ChartRadarDefault />
        <ChartRadarDots />
        <ChartRadarMultiple />
        <ChartRadarLegend />
        <ChartRadarGridFill />
        <ChartRadarGridCircle />
        <ChartRadarGridNone />
        <ChartRadarGridCircleFill />
        <ChartRadarGridCircleNoLines />
        <ChartRadarGridCustom />
        <ChartRadarIcons />
        <ChartRadarLabelCustom />
        <ChartRadarLinesOnly />
        <ChartRadarRadius />
      </div>
    </div>
  )
}
