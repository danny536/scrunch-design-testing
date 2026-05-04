"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { Icon } from "@/components/icon"

// ─── Nav structure ────────────────────────────────────────────────────────────

type NavItem = {
  id: string
  label: string
  icon: string
  badge?: "NEW" | "BETA"
  href?: string
}

const navigation: { section?: string; items: NavItem[] }[] = [
  {
    items: [
      { id: "home", label: "Home", icon: "house", href: "/product" },
    ],
  },
  {
    section: "Brand Observability",
    items: [
      { id: "explorer",  label: "Explorer",           icon: "explore",       badge: "BETA", href: "/product/explorer" },
      { id: "topics",    label: "Topics",             icon: "sell",          badge: "BETA", href: "/product/topics" },
      { id: "prompts",   label: "Prompts Monitoring", icon: "chat" },
      { id: "citations", label: "Citations",          icon: "link" },
      { id: "insights",  label: "Insights",           icon: "flare" },
      { id: "shopping",  label: "Shopping",           icon: "shopping_cart", badge: "NEW" },
    ],
  },
  {
    section: "Brand Content",
    items: [
      { id: "sitemaps", label: "Site Maps", icon: "account_tree", badge: "NEW" },
    ],
  },
  {
    section: "Audience Activity",
    items: [
      { id: "traffic",   label: "Agent Traffic", icon: "compare_arrows" },
      { id: "trends",    label: "Trends",        icon: "trending_up" },
      { id: "referrals", label: "AI Referrals",  icon: "left_click" },
    ],
  },
  {
    section: "Brand Settings",
    items: [
      { id: "context",      label: "AI Context",   icon: "library_books" },
      { id: "team",         label: "Team Members", icon: "group" },
      { id: "integrations", label: "Integrations", icon: "api" },
    ],
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

export function ScrunchSidebar({ defaultActive = "shopping" }: { defaultActive?: string }) {
  const [active, setActive] = useState(defaultActive)
  const pathname = usePathname()

  const hasRouteMatch = navigation.some((g) =>
    g.items.some((i) => i.href && pathname === i.href)
  )
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const isDark = mounted && theme === "dark"

  return (
    <div className="flex h-full w-[264px] shrink-0 flex-col border-r border-ink/[12%] bg-paper">

      {/* ── Nav ──────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-3">
        {navigation.map((group, gi) => (
          <div key={gi} className={gi > 0 ? "mt-6" : ""}>
            {group.section && (
              <div className="mb-2 px-2 font-plex-mono text-[11px] uppercase tracking-[0.06em] text-ink/40">
                {group.section}
              </div>
            )}
            {group.items.map((item) => {
              const isActive = item.href
                ? pathname === item.href
                : !hasRouteMatch && active === item.id

              const itemClasses = cn(
                "flex w-full items-center gap-2.5 rounded-scrunch-pill px-2 py-[9px] text-left transition-colors",
                isActive
                  ? "bg-s-neutral-200 text-ink"
                  : "text-ink hover:bg-s-neutral-100"
              )

              const content = (
                <>
                  <Icon name={item.icon} size={20} className="shrink-0" />
                  <span className="font-sans text-[14px] leading-none">{item.label}</span>
                  {item.badge === "NEW"  && <NewBadge>{item.badge}</NewBadge>}
                  {item.badge === "BETA" && <BetaBadge>{item.badge}</BetaBadge>}
                </>
              )

              if (item.href) {
                return (
                  <Link key={item.id} href={item.href} className={itemClasses}>
                    {content}
                  </Link>
                )
              }

              return (
                <button key={item.id} onClick={() => setActive(item.id)} className={itemClasses}>
                  {content}
                </button>
              )
            })}
          </div>
        ))}
      </nav>

      {/* ── Bottom ───────────────────────────────── */}
      <div className="border-t border-ink/[12%] px-2.5 py-2.5">
        <button className="flex w-full items-center gap-2.5 rounded-scrunch-pill px-2 py-[7px] text-ink/60 hover:bg-s-neutral-100 hover:text-ink transition-colors">
          <Icon name="left_panel_close" size={20} className="shrink-0" />
          <span className="font-sans text-[14px] leading-none">Collapse menu</span>
        </button>

        {/* ── Theme toggle ─────────────────────── */}
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="flex w-full items-center gap-2.5 rounded-scrunch-pill px-2 py-[7px] text-ink/60 hover:bg-s-neutral-100 hover:text-ink transition-colors"
        >
          <Icon name={isDark ? "light_mode" : "bedtime"} size={20} className="shrink-0" />
          <span className="font-sans text-[14px] leading-none">
            {isDark ? "Light mode" : "Dark mode"}
          </span>
        </button>

        <div className="mt-0.5 flex items-center gap-2.5 px-2 py-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-s-blue-100">
            <Icon name="person" size={16} className="text-s-blue-600" />
          </div>
          <span className="font-sans text-[13px] font-medium text-ink truncate">
            danny@excelsalabs.com
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── NEW badge ────────────────────────────────────────────────────────────────

function NewBadge({ children }: { children: string }) {
  return (
    <span className="ml-auto inline-flex items-center rounded-full bg-s-green-200 px-2 py-0.5 font-sans text-[11px] font-medium text-s-green-900 leading-none outline-none">
      {children}
    </span>
  )
}

// ─── BETA badge ───────────────────────────────────────────────────────────────

function BetaBadge({ children }: { children: string }) {
  return (
    <span className="ml-auto inline-flex items-center rounded-full bg-s-warning-300 px-2 py-0.5 font-sans text-[11px] font-medium text-s-warning-800 leading-none outline-none">
      {children}
    </span>
  )
}
