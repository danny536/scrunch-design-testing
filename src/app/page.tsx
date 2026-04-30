import Link from "next/link"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const sections = [
  {
    title: "Shadcn Charts",
    description: "All chart types from the shadcn/ui registry — area, bar, line, pie, radar, radial, and tooltips.",
    href: "/charts/area",
    label: "Browse charts →",
  },
  {
    title: "Product Test Environment",
    description: "Interactive test environment for Scrunch product design and component exploration.",
    href: "/product",
    label: "Open dashboard →",
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight">Design Testing</h1>
          <p className="mt-3 text-muted-foreground text-lg">
            Scrunch product design tooling and component exploration.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {sections.map((section) =>
            section.disabled ? (
              <Card key={section.title} className="opacity-50">
                <CardHeader>
                  <CardTitle>{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                  <p className="text-sm text-muted-foreground pt-2">{section.label}</p>
                </CardHeader>
              </Card>
            ) : (
              <Link key={section.title} href={section.href}>
                <Card className="h-full transition-colors hover:bg-muted/50 cursor-pointer">
                  <CardHeader>
                    <CardTitle>{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                    <p className="text-sm font-medium pt-2">{section.label}</p>
                  </CardHeader>
                </Card>
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  )
}
