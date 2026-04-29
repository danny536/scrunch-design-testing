import Link from "next/link"

const categories = [
  { label: "Area", href: "/charts/area" },
  { label: "Bar", href: "/charts/bar" },
  { label: "Line", href: "/charts/line" },
  { label: "Pie", href: "/charts/pie" },
  { label: "Radar", href: "/charts/radar" },
  { label: "Radial", href: "/charts/radial" },
  { label: "Tooltips", href: "/charts/tooltips" },
]

export default function ChartsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <h1 className="text-3xl font-bold tracking-tight">Charts</h1>
          <p className="mt-2 text-muted-foreground text-base">
            Beautiful charts built with Recharts and shadcn/ui.
          </p>
        </div>
        {/* Category nav */}
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex gap-1 overflow-x-auto pb-0">
            {categories.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground border-b-2 border-transparent hover:border-foreground/30 transition-colors whitespace-nowrap"
              >
                {cat.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <main className="max-w-7xl mx-auto px-6 py-10">
        {children}
      </main>
    </div>
  )
}
