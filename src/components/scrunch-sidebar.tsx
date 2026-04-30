"use client"

import { useState } from "react"
import {
  Home,
  Link2,
  ShoppingCart,
  Code2,
  TrendingUp,
  Library,
  UserRound,
  Puzzle,
  PanelLeftClose,
  FileText,
  Waypoints,
  Network,
  SquareArrowOutUpRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Nav structure ────────────────────────────────────────────────────────────

const navigation = [
  {
    items: [
      { id: "home", label: "Home", icon: Home },
    ],
  },
  {
    section: "Brand Observability",
    items: [
      { id: "prompts",   label: "Prompts Monitoring", icon: FileText },
      { id: "citations", label: "Citations",          icon: Link2 },
      { id: "insights",  label: "Insights",           icon: Waypoints },
      { id: "shopping",  label: "Shopping",           icon: ShoppingCart, badge: "NEW" },
    ],
  },
  {
    section: "Brand Content",
    items: [
      { id: "sitemaps", label: "Site Maps", icon: Network, badge: "NEW" },
    ],
  },
  {
    section: "Audience Activity",
    items: [
      { id: "traffic",   label: "Agent Traffic", icon: Code2 },
      { id: "trends",    label: "Trends",        icon: TrendingUp },
      { id: "referrals", label: "AI Referrals",  icon: SquareArrowOutUpRight },
    ],
  },
  {
    section: "Brand Settings",
    items: [
      { id: "context",      label: "AI Context",    icon: Library },
      { id: "team",         label: "Team Members",  icon: UserRound },
      { id: "integrations", label: "Integrations",  icon: Puzzle },
    ],
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

export function ScrunchSidebar({ defaultActive = "shopping" }: { defaultActive?: string }) {
  const [active, setActive] = useState(defaultActive)

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
              const Icon = item.icon
              const isActive = active === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActive(item.id)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-scrunch-md px-2 py-[9px] text-left transition-colors",
                    isActive
                      ? "bg-s-neutral-100 text-ink"
                      : "text-ink hover:bg-s-neutral-100/70"
                  )}
                >
                  <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.6} />
                  <span className="font-sans text-[14px] leading-none">{item.label}</span>
                  {"badge" in item && item.badge && (
                    <NewBadge>{item.badge}</NewBadge>
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </nav>

      {/* ── Bottom ───────────────────────────────── */}
      <div className="border-t border-ink/[12%] px-2.5 py-2.5">
        <button className="flex w-full items-center gap-2.5 rounded-scrunch-md px-2 py-[7px] text-ink/60 hover:bg-s-neutral-100 hover:text-ink transition-colors">
          <PanelLeftClose className="h-[18px] w-[18px] shrink-0" strokeWidth={1.6} />
          <span className="font-sans text-[14px] leading-none">Collapse menu</span>
        </button>

        <div className="mt-0.5 flex items-center gap-2.5 px-2 py-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-s-blue-100">
            <UserRound className="h-4 w-4 text-s-blue-600" strokeWidth={1.6} />
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
    <span className="ml-0.5 inline-flex items-center rounded-full border border-s-green-400 bg-s-green-100 px-1.5 py-px font-plex-mono text-[9px] uppercase tracking-[0.05em] text-s-green-700 leading-none">
      {children}
    </span>
  )
}
