import type { ReactNode } from "react"

// ─── Primitives ───────────────────────────────────────────────────────────────

function Label({ children }: { children: ReactNode }) {
  return (
    <span className="font-plex-mono text-[10px] uppercase tracking-[0.08em] text-ink/50">
      {children}
    </span>
  )
}

function SectionHead({ id, title }: { id: string; title: string }) {
  return (
    <div id={id} className="flex items-baseline gap-3 mb-6 scroll-mt-8">
      <h2 className="font-newsreader text-[32px] font-normal leading-none tracking-[-0.02em] text-ink">
        {title}
      </h2>
    </div>
  )
}

function SubHead({ title }: { title: string }) {
  return <Label>{title}</Label>
}

// ─── Primary color swatch — square tile, all info inside ─────────────────────

function Swatch({
  bg,
  role,
  name,
  hex,
  dark,
}: {
  bg: string
  role: string
  name: string
  hex: string
  dark?: boolean
}) {
  const textRole = dark ? "rgba(255,255,255,0.62)" : "rgba(21,19,15,0.5)"
  const textName = dark ? "rgba(255,255,255,0.98)" : "rgba(21,19,15,0.92)"
  const textHex  = dark ? "rgba(255,255,255,0.9)"  : "rgba(21,19,15,0.78)"

  return (
    <div
      className="aspect-square flex flex-col justify-between p-[16px_18px]"
      style={{ background: bg }}
    >
      <div className="flex flex-col gap-[5px]">
        <span
          className="font-plex-mono text-[10px] uppercase tracking-[0.08em] leading-none"
          style={{ color: textRole }}
        >
          {role}
        </span>
        <span
          className="font-sans font-semibold text-[16px] leading-[1.1] tracking-[-0.01em]"
          style={{ color: textName }}
        >
          {name}
        </span>
      </div>
      <span
        className="font-plex-mono text-[11px] tracking-[0.02em] leading-[1.3]"
        style={{ color: textHex }}
      >
        #{hex}
      </span>
    </div>
  )
}

// ─── Data palette swatch ──────────────────────────────────────────────────────

function DataSwatch({
  bg,
  set,
  token,
  hex,
  dark,
}: {
  bg: string
  set: string
  token: string
  hex: string
  dark?: boolean
}) {
  const textSet   = dark ? "rgba(255,255,255,0.95)" : "rgba(21,19,15,0.88)"
  const textToken = dark ? "rgba(255,255,255,0.72)" : "rgba(21,19,15,0.52)"
  const textHex   = dark ? "rgba(255,255,255,0.88)" : "rgba(21,19,15,0.78)"

  return (
    <div
      className="aspect-square flex flex-col justify-between p-3"
      style={{ background: bg }}
    >
      <div className="flex flex-col gap-[3px]">
        <span className="font-sans font-semibold text-[14px] leading-none tracking-[-0.005em]" style={{ color: textSet }}>
          {set}
        </span>
        <span className="font-plex-mono text-[10px] leading-none tracking-[0.04em]" style={{ color: textToken }}>
          {token}
        </span>
      </div>
      <span className="font-plex-mono text-[11px] tracking-[0.02em] leading-[1.3]" style={{ color: textHex }}>
        #{hex}
      </span>
    </div>
  )
}

// ─── Scale swatch (compact) ───────────────────────────────────────────────────

function ScaleSwatch({
  bg,
  stop,
  hex,
  dark,
  pinned,
  pinLabel,
}: {
  bg: string
  stop: string
  hex: string
  dark?: boolean
  pinned?: boolean
  pinLabel?: string
}) {
  return (
    <div
      className="relative rounded-[6px] h-16 flex flex-col justify-between p-[6px] text-[8.5px] leading-none font-plex-mono"
      style={{
        background: bg,
        outline: pinned ? "1.5px solid rgba(29,17,7,0.5)" : undefined,
        outlineOffset: pinned ? "-1.5px" : undefined,
      }}
    >
      <span style={{ color: dark ? "rgba(255,255,255,0.85)" : "rgba(21,19,15,0.7)" }}>{stop}</span>
      <span style={{ color: dark ? "rgba(255,255,255,0.75)" : "rgba(21,19,15,0.6)" }}>{hex}</span>
      {pinned && pinLabel && (
        <span
          className="absolute bottom-[5px] right-[5px] rounded-[3px] px-[4px] py-[1px] text-[8px] uppercase tracking-[0.04em]"
          style={{ background: "rgba(21,19,15,0.82)", color: "#FBF9F6" }}
        >
          {pinLabel}
        </span>
      )}
    </div>
  )
}

// ─── Scale row ────────────────────────────────────────────────────────────────

function ScaleRow({
  name,
  sub,
  stops,
}: {
  name: string
  sub: string
  stops: { bg: string; stop: string; hex: string; dark?: boolean; pinned?: boolean; pinLabel?: string }[]
}) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-3 items-center">
      <div>
        <div className="font-sans text-[13px] font-semibold text-ink capitalize">{name}</div>
        <div className="font-plex-mono text-[9px] uppercase tracking-[0.06em] text-ink/40 mt-0.5">{sub}</div>
      </div>
      <div className="grid grid-cols-11 gap-[3px]">
        {stops.map((s) => (
          <ScaleSwatch key={s.stop} {...s} />
        ))}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StyleGuidePage() {
  return (
    <div className="grid grid-cols-[220px_1fr] min-h-screen bg-paper">
      {/* ── Sidebar ─────────────────────────────────── */}
      <aside className="sticky top-0 h-screen overflow-auto border-r border-ink/10 px-5 py-7">
        <div className="font-plex-mono text-[10px] uppercase tracking-[0.1em] text-ink/40 mb-6">
          Scrunch · Style Guide
        </div>

        {(
          [
            ["Colors",      ["#colors-primary", "Primary", "#colors-neutrals", "Neutrals", "#colors-data", "Data palette", "#colors-semantic", "Semantic", "#colors-scales", "Full scales"]],
            ["Type",        ["#type-display", "Display", "#type-scale", "Scale", "#type-mono", "Mono"]],
            ["Spacing",     ["#spacing-scale", "Scale"]],
            ["Foundations", ["#foundations-radius", "Radius", "#foundations-shadows", "Shadows"]],
            ["Components",  ["#components-buttons", "Buttons", "#components-cards", "Cards", "#components-inputs", "Inputs"]],
          ] as [string, string[]][]
        ).map(([section, links]) => (
          <div key={section} className="mb-4">
            <div className="font-plex-mono text-[10px] uppercase tracking-[0.1em] text-ink/40 mb-1.5">
              {section}
            </div>
            {links
              .filter((_, i) => i % 2 === 0)
              .map((href, i) => (
                <a
                  key={href}
                  href={href}
                  className="block py-1 text-[13px] text-clay hover:text-ink transition-colors"
                >
                  {links[i * 2 + 1]}
                </a>
              ))}
          </div>
        ))}
      </aside>

      {/* ── Main ────────────────────────────────────── */}
      <main className="px-14 pb-32">

        {/* Hero */}
        <header className="pt-12 pb-12 border-b border-ink/10 mb-12">
          <div className="font-plex-mono text-[10px] uppercase tracking-[0.1em] text-ink/40 mb-3">
            Design System · Tailwind v4
          </div>
          <h1 className="font-newsreader text-[72px] font-medium leading-[0.98] tracking-[-0.03em] text-ink">
            Scrunch.<br />
            <em style={{ color: "#A8A29A" }}>Style guide.</em>
          </h1>
          <p className="mt-4 text-[17px] leading-[1.55] text-clay max-w-2xl">
            Every design token from the Scrunch Design System expressed as a Tailwind utility class.
            Colors, typography, spacing, radius, shadows, and components — ready to use.
          </p>
        </header>

        {/* ══════════════════════════════════════════════
            COLORS
        ══════════════════════════════════════════════ */}
        <section className="mb-16">
          <SectionHead id="colors-primary" title="Colors" />

          {/* Primary brand — 4 square tiles */}
          <div className="mb-10">
            <SubHead title="Primary brand · 4 colors" />
            <div className="grid grid-cols-4 mt-3" style={{ maxWidth: 820 }}>
              <Swatch bg="#2A4AEA" role="Primary"   name="Scrunch Blue"  hex="2A4AEA" dark />
              <Swatch bg="#D8FC3B" role="Accent"    name="AI Green"      hex="D8FC3B" />
              <Swatch bg="#93C0FE" role="Secondary" name="Cloud Blue"    hex="93C0FE" />
              <Swatch bg="#6E8920" role="Secondary" name="Botanic Green" hex="6E8920" dark />
            </div>
          </div>

          {/* Neutrals — 5 square tiles */}
          <div className="mb-10" id="colors-neutrals">
            <SubHead title="Neutrals · 5 colors" />
            <div className="grid grid-cols-5 mt-3" style={{ maxWidth: 1020 }}>
              <Swatch bg="#FBF9F6" role="Surface" name="Paper"     hex="FBF9F6" />
              <Swatch bg="#F7F3EB" role="Surface" name="Porcelain" hex="F7F3EB" />
              <Swatch bg="#F1E8C7" role="Accent"  name="Glaze"     hex="F1E8C7" />
              <Swatch bg="#40362E" role="Text"    name="Clay"      hex="40362E" dark />
              <Swatch bg="#242220" role="Text"    name="Coal"      hex="242220" dark />
            </div>
          </div>

          {/* Data palette — 3-row grid matching reference */}
          <div className="mb-10" id="colors-data">
            <SubHead title="Data palette · 9 sets + empty" />
            <div
              className="grid grid-cols-4 mt-3"
              style={{ maxWidth: 640, gridTemplateRows: "auto auto auto" }}
            >
              {/* Row 1: Blues */}
              <div style={{ gridColumn: 1, gridRow: 1 }}><DataSwatch bg="#2A4AEA" set="Data set 1" token="blue-600"    hex="2A4AEA" dark /></div>
              <div style={{ gridColumn: 2, gridRow: 1 }}><DataSwatch bg="#618FF9" set="Data set 2" token="blue-400"    hex="618FF9" dark /></div>
              <div style={{ gridColumn: 3, gridRow: 1 }}><DataSwatch bg="#BFD2FE" set="Data set 3" token="blue-200"    hex="BFD2FE" /></div>
              {/* Row 2: Greens */}
              <div style={{ gridColumn: 1, gridRow: 2 }}><DataSwatch bg="#586B16" set="Data set 4" token="green-800"   hex="586B16" dark /></div>
              <div style={{ gridColumn: 2, gridRow: 2 }}><DataSwatch bg="#84A027" set="Data set 5" token="green-600"   hex="84A027" dark /></div>
              <div style={{ gridColumn: 3, gridRow: 2 }}><DataSwatch bg="#AECE31" set="Data set 6" token="green-400"   hex="AECE31" /></div>
              {/* Row 3: Neutrals + Empty */}
              <div style={{ gridColumn: 1, gridRow: 3 }}><DataSwatch bg="#40362E" set="Data set 7" token="neutral-800" hex="40362E" dark /></div>
              <div style={{ gridColumn: 2, gridRow: 3 }}><DataSwatch bg="#B8AB8E" set="Data set 8" token="neutral-400" hex="B8AB8E" /></div>
              <div style={{ gridColumn: 3, gridRow: 3 }}><DataSwatch bg="#F1E8C7" set="Data set 9" token="neutral-300" hex="F1E8C7" /></div>
              <div style={{ gridColumn: 4, gridRow: 3 }}><DataSwatch bg="#F7F3EB" set="Empty"      token="neutral-100" hex="F7F3EB" /></div>
            </div>

            {/* Donut demo */}
            <div className="flex gap-5 items-center mt-5">
              <svg width="120" height="120" viewBox="0 0 100 100" className="shrink-0" style={{ overflow: "visible" }}>
                <circle cx="50" cy="50" r="40" fill="none" stroke="#F7F3EB" strokeWidth="14" transform="rotate(-90 50 50)" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#2A4AEA" strokeWidth="14" strokeDasharray="32 251" strokeDashoffset="0"    transform="rotate(-90 50 50)" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#618FF9" strokeWidth="14" strokeDasharray="22 251" strokeDashoffset="-32"  transform="rotate(-90 50 50)" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#BFD2FE" strokeWidth="14" strokeDasharray="22 251" strokeDashoffset="-54"  transform="rotate(-90 50 50)" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#586B16" strokeWidth="14" strokeDasharray="20 251" strokeDashoffset="-76"  transform="rotate(-90 50 50)" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#84A027" strokeWidth="14" strokeDasharray="20 251" strokeDashoffset="-96"  transform="rotate(-90 50 50)" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#AECE31" strokeWidth="14" strokeDasharray="20 251" strokeDashoffset="-116" transform="rotate(-90 50 50)" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#40362E" strokeWidth="14" strokeDasharray="22 251" strokeDashoffset="-136" transform="rotate(-90 50 50)" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#B8AB8E" strokeWidth="14" strokeDasharray="20 251" strokeDashoffset="-158" transform="rotate(-90 50 50)" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#F1E8C7" strokeWidth="14" strokeDasharray="18 251" strokeDashoffset="-178" transform="rotate(-90 50 50)" />
              </svg>
              <div className="font-plex-mono text-[10px] uppercase tracking-[0.06em] text-ink/40 leading-[1.7]">
                Nine‑set data donut<br />
                blue 600→400→200 · green 800→600→400<br />
                neutral 800→400→300 · empty = neutral-100
              </div>
            </div>
          </div>

          {/* Semantic tokens */}
          <div className="mb-10" id="colors-semantic">
            <SubHead title="Semantic tokens" />
            <div className="grid grid-cols-2 gap-3 mt-3">
              {/* Light */}
              <div className="rounded-scrunch-md border border-ink/10 p-4 bg-paper shadow-scrunch-sm">
                <Label>Light surface</Label>
                {[
                  { swatch: "#1D1107",              token: "text-ink",          desc: "Primary text" },
                  { swatch: "#40362E",              token: "text-clay",         desc: "Secondary text" },
                  { swatch: "rgba(36,34,32,0.5)",   token: "text-ink/50",       desc: "Metadata / labels" },
                  { swatch: "#2A4AEA",              token: "text-scrunch-blue", desc: "CTAs, links" },
                  { swatch: "#D8FC3B",              token: "bg-ai-green",       desc: "Emphasis / highlight" },
                ].map((row) => (
                  <div key={row.token} className="flex items-center gap-3 mt-2 text-[13px]">
                    <span className="w-4 h-4 rounded-[4px] border border-ink/10 shrink-0" style={{ background: row.swatch }} />
                    <code className="font-plex-mono text-[11px] text-ink bg-porcelain px-1.5 py-0.5 rounded-[4px]">{row.token}</code>
                    <span className="text-clay">{row.desc}</span>
                  </div>
                ))}
              </div>
              {/* Dark */}
              <div className="rounded-scrunch-md border border-white/10 p-4 bg-coal shadow-scrunch-sm">
                <Label><span className="text-white/40">Dark surface</span></Label>
                {[
                  { swatch: "#FBF9F6",                token: "text-paper",      desc: "Primary text" },
                  { swatch: "rgba(255,255,255,0.72)",  token: "text-paper/70",   desc: "Secondary" },
                  { swatch: "rgba(255,255,255,0.5)",   token: "text-paper/50",   desc: "Metadata" },
                  { swatch: "#93C0FE",                 token: "text-cloud-blue", desc: "Links on dark" },
                  { swatch: "#D8FC3B",                 token: "bg-ai-green",     desc: "Emphasis" },
                ].map((row) => (
                  <div key={row.token} className="flex items-center gap-3 mt-2 text-[13px]">
                    <span className="w-4 h-4 rounded-[4px] border border-white/10 shrink-0" style={{ background: row.swatch }} />
                    <code className="font-plex-mono text-[11px] text-paper/90 bg-white/10 px-1.5 py-0.5 rounded-[4px]">{row.token}</code>
                    <span className="text-white/60">{row.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Full product scales */}
          <div id="colors-scales">
            <SubHead title="Product palette · Full scales" />
            <div className="mt-3 space-y-2.5">
              <ScaleRow
                name="Blue"
                sub="Cloud → Scrunch"
                stops={[
                  { bg: "#EFF4FF", stop: "50",  hex: "#EFF4FF" },
                  { bg: "#DBE5FE", stop: "100", hex: "#DBE5FE" },
                  { bg: "#BFD2FE", stop: "200", hex: "#BFD2FE" },
                  { bg: "#93C0FE", stop: "300", hex: "#93C0FE", pinned: true, pinLabel: "Cloud" },
                  { bg: "#618FF9", stop: "400", hex: "#618FF9" },
                  { bg: "#3C67F5", stop: "500", hex: "#3C67F5", dark: true },
                  { bg: "#2A4AEA", stop: "600", hex: "#2A4AEA", dark: true, pinned: true, pinLabel: "Scrunch" },
                  { bg: "#1E33D7", stop: "700", hex: "#1E33D7", dark: true },
                  { bg: "#1F2CAE", stop: "800", hex: "#1F2CAE", dark: true },
                  { bg: "#1F2B89", stop: "900", hex: "#1F2B89", dark: true },
                  { bg: "#171C54", stop: "950", hex: "#171C54", dark: true },
                ]}
              />
              <ScaleRow
                name="Green"
                sub="AI → Botanic"
                stops={[
                  { bg: "#FBFFE7", stop: "50",  hex: "#FBFFE7" },
                  { bg: "#F2FFC5", stop: "100", hex: "#F2FFC5" },
                  { bg: "#D8FC3B", stop: "200", hex: "#D8FC3B", pinned: true, pinLabel: "AI Green" },
                  { bg: "#C3E536", stop: "300", hex: "#C3E536" },
                  { bg: "#AECE31", stop: "400", hex: "#AECE31" },
                  { bg: "#99B72C", stop: "500", hex: "#99B72C" },
                  { bg: "#84A027", stop: "600", hex: "#84A027", dark: true },
                  { bg: "#6E8920", stop: "700", hex: "#6E8920", dark: true, pinned: true, pinLabel: "Botanic" },
                  { bg: "#586B16", stop: "800", hex: "#586B16", dark: true },
                  { bg: "#434E0D", stop: "900", hex: "#434E0D", dark: true },
                  { bg: "#2D3003", stop: "950", hex: "#2D3003", dark: true },
                ]}
              />
              <ScaleRow
                name="Neutral"
                sub="Paper → Coal"
                stops={[
                  { bg: "#FBF9F6", stop: "50",  hex: "#FBF9F6", pinned: true, pinLabel: "Paper" },
                  { bg: "#F7F3EB", stop: "100", hex: "#F7F3EB", pinned: true, pinLabel: "Porcelain" },
                  { bg: "#F6EFDC", stop: "200", hex: "#F6EFDC" },
                  { bg: "#F1E8C7", stop: "300", hex: "#F1E8C7", pinned: true, pinLabel: "Glaze" },
                  { bg: "#B8AB8E", stop: "400", hex: "#B8AB8E" },
                  { bg: "#93886F", stop: "500", hex: "#93886F" },
                  { bg: "#67624C", stop: "600", hex: "#67624C", dark: true },
                  { bg: "#514B39", stop: "700", hex: "#514B39", dark: true },
                  { bg: "#40362E", stop: "800", hex: "#40362E", dark: true, pinned: true, pinLabel: "Clay" },
                  { bg: "#242220", stop: "900", hex: "#242220", dark: true, pinned: true, pinLabel: "Coal" },
                  { bg: "#0F0C06", stop: "950", hex: "#0F0C06", dark: true },
                ]}
              />
              <ScaleRow
                name="Warning"
                sub="Amber"
                stops={[
                  { bg: "#FEFDE8", stop: "50",  hex: "#FEFDE8" },
                  { bg: "#FFFCC2", stop: "100", hex: "#FFFCC2" },
                  { bg: "#FFF587", stop: "200", hex: "#FFF587" },
                  { bg: "#FFE843", stop: "300", hex: "#FFE843" },
                  { bg: "#FFDA1F", stop: "400", hex: "#FFDA1F" },
                  { bg: "#EFBE03", stop: "500", hex: "#EFBE03" },
                  { bg: "#CE9300", stop: "600", hex: "#CE9300", dark: true },
                  { bg: "#A46804", stop: "700", hex: "#A46804", dark: true },
                  { bg: "#88520B", stop: "800", hex: "#88520B", dark: true },
                  { bg: "#734210", stop: "900", hex: "#734210", dark: true },
                  { bg: "#432205", stop: "950", hex: "#432205", dark: true },
                ]}
              />
              <ScaleRow
                name="Danger"
                sub="Red"
                stops={[
                  { bg: "#FFF3ED", stop: "50",  hex: "#FFF3ED" },
                  { bg: "#FFE4D4", stop: "100", hex: "#FFE4D4" },
                  { bg: "#FFC5A8", stop: "200", hex: "#FFC5A8" },
                  { bg: "#FF9D70", stop: "300", hex: "#FF9D70" },
                  { bg: "#FF6937", stop: "400", hex: "#FF6937" },
                  { bg: "#FF5021", stop: "500", hex: "#FF5021", dark: true },
                  { bg: "#F02806", stop: "600", hex: "#F02806", dark: true },
                  { bg: "#C71907", stop: "700", hex: "#C71907", dark: true },
                  { bg: "#9E150E", stop: "800", hex: "#9E150E", dark: true },
                  { bg: "#7F150F", stop: "900", hex: "#7F150F", dark: true },
                  { bg: "#450605", stop: "950", hex: "#450605", dark: true },
                ]}
              />
            </div>
            <p className="font-plex-mono text-[10px] uppercase tracking-[0.06em] text-ink/40 mt-4">
              · s-blue-* · s-green-* · s-neutral-* · s-warning-* · s-danger-* · use 500–600 for default UI · 50–200 surfaces · 700–950 text
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            TYPOGRAPHY
        ══════════════════════════════════════════════ */}
        <section className="mb-16 border-t border-ink/10 pt-14">
          <SectionHead id="type-display" title="Typography" />

          {/* Display specimen */}
          <div className="mb-10 rounded-scrunch-md border border-ink/10 p-8 bg-paper shadow-scrunch-sm">
            <Label>01 · Display · Newsreader 64/1.02 · −2.5% · Ink on Paper</Label>
            <div className="font-newsreader font-medium text-[64px] leading-[1.02] tracking-[-0.025em] text-ink mt-4">
              Humans don&apos;t visit<br />
              your website anymore—<br />
              <em style={{ color: "#A8A29A" }}>AI does.</em>
            </div>
            <div className="font-plex-mono text-[10px] text-ink/40 mt-4">
              Newsreader Medium + Italic · text-ink #1D1107 · italic #A8A29A (soft warm grey)
            </div>
          </div>

          {/* Type scale */}
          <div className="mb-10" id="type-scale">
            <SubHead title="Type scale" />
            <div className="mt-3 rounded-scrunch-md border border-ink/10 overflow-hidden shadow-scrunch-sm">
              {[
                {
                  tag:  "H1 · Newsreader 64/1.02 · Regular",
                  cls:  "font-newsreader text-[64px] leading-[1.02] tracking-[-0.02em] font-normal",
                  text: "Scrunch the internet",
                },
                {
                  tag:  "H2 · Newsreader 40/1.1 · Regular",
                  cls:  "font-newsreader text-[40px] leading-[1.1] tracking-[-0.02em] font-normal",
                  text: "Your website, Scrunched for AI",
                },
                {
                  tag:  "H3 · Inter 24 · Regular",
                  cls:  "font-sans text-[24px] leading-[1.25] tracking-[-0.015em] font-normal",
                  text: "Track AI visits",
                },
                {
                  tag:  "H4 · Inter 18 · Regular",
                  cls:  "font-sans text-[18px] leading-[1.35] tracking-[-0.01em] font-normal",
                  text: "Agent experience platform",
                },
                {
                  tag:  "Body · Inter 16",
                  cls:  "font-sans text-[16px] leading-[1.5] tracking-[-0.005em]",
                  text: "Track AI visits, audit performance, optimize content, and deliver an AI‑friendly experience.",
                },
                {
                  tag:  "Caption · 13",
                  cls:  "font-sans text-[13px] leading-[1.4] text-clay",
                  text: "Last updated 04.13.2026",
                },
              ].map((row, i) => (
                <div
                  key={row.tag}
                  className={`flex items-baseline gap-6 px-6 py-4 ${i > 0 ? "border-t border-ink/[8%]" : ""}`}
                >
                  <div className="w-44 shrink-0">
                    <Label>{row.tag}</Label>
                  </div>
                  <span className={`${row.cls} text-ink`}>{row.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mono */}
          <div id="type-mono">
            <SubHead title="Mono — IBM Plex Mono · font-plex-mono" />
            <div className="mt-3 rounded-scrunch-md border border-ink/10 overflow-hidden shadow-scrunch-sm">
              {[
                {
                  tag: "Eyebrow 12",
                  cls: "font-plex-mono text-[12px] uppercase tracking-[0.08em] text-ink",
                  text: "IBM Plex Mono · Local",
                },
                {
                  tag: "Chip 10",
                  cls: "font-plex-mono text-[10px] uppercase tracking-[0.06em] bg-scrunch-blue text-white px-3 py-1.5 rounded-scrunch-pill inline-block",
                  text: "BOOTH #612",
                },
                {
                  tag: "Meta 10",
                  cls: "font-plex-mono text-[10px] tracking-[0.04em] text-ink/50",
                  text: "#2A4AEA · R42 G74 B234 · PANTONE 2727 C",
                },
                {
                  tag: "Data 13",
                  cls: "font-plex-mono text-[13px] text-ink",
                  text: "12,438 AI visits · +18.2%",
                },
                {
                  tag: "Version 14",
                  cls: "font-plex-mono text-[14px] text-ink",
                  text: "v1.0 · 04.13.2026",
                },
              ].map((row, i) => (
                <div
                  key={row.tag}
                  className={`flex items-center gap-6 px-6 py-4 ${i > 0 ? "border-t border-ink/[8%]" : ""}`}
                >
                  <div className="w-44 shrink-0">
                    <Label>{row.tag}</Label>
                  </div>
                  <span className={row.cls}>{row.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            SPACING
        ══════════════════════════════════════════════ */}
        <section className="mb-16 border-t border-ink/10 pt-14">
          <SectionHead id="spacing-scale" title="Spacing" />
          <SubHead title="4px grid · s-1 → s-32" />
          <div className="mt-4 space-y-2.5">
            {[
              { token: "s-1",  px: "4px",   tw: "p-1",  w: 12  },
              { token: "s-2",  px: "8px",   tw: "p-2",  w: 22  },
              { token: "s-3",  px: "12px",  tw: "p-3",  w: 32  },
              { token: "s-4",  px: "16px",  tw: "p-4",  w: 42  },
              { token: "s-6",  px: "24px",  tw: "p-6",  w: 60  },
              { token: "s-8",  px: "32px",  tw: "p-8",  w: 78  },
              { token: "s-12", px: "48px",  tw: "p-12", w: 114 },
              { token: "s-16", px: "64px",  tw: "p-16", w: 150 },
              { token: "s-24", px: "96px",  tw: "p-24", w: 222 },
              { token: "s-32", px: "128px", tw: "p-32", w: 294 },
            ].map((row) => (
              <div key={row.token} className="flex items-center gap-4">
                <div className="font-plex-mono text-[11px] text-ink/50 w-12">{row.token}</div>
                <div className="font-plex-mono text-[11px] text-ink/40 w-14">{row.px}</div>
                <div className="h-2.5 rounded-sm bg-scrunch-blue" style={{ width: row.w }} />
                <div className="font-plex-mono text-[10px] text-ink/30">{row.tw}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            RADIUS + SHADOWS
        ══════════════════════════════════════════════ */}
        <section className="mb-16 border-t border-ink/10 pt-14">
          <SectionHead id="foundations-radius" title="Radius · Shadows" />

          {/* Radius */}
          <div className="mb-10">
            <SubHead title="Border radius · rounded-scrunch-*" />
            <div className="flex gap-4 mt-4 flex-wrap items-center">
              {[
                { cls: "rounded-scrunch-xs",   px: "4px",  label: "xs"   },
                { cls: "rounded-scrunch-sm",   px: "8px",  label: "sm"   },
                { cls: "rounded-scrunch-md",   px: "12px", label: "md"   },
                { cls: "rounded-scrunch-lg",   px: "20px", label: "lg"   },
                { cls: "rounded-scrunch-xl",   px: "24px", label: "xl"   },
                { cls: "rounded-scrunch-pill", px: "pill", label: "pill", wide: true },
              ].map((r) => (
                <div key={r.cls} className="flex flex-col items-center gap-2">
                  <div
                    className={`${r.cls} bg-porcelain border border-ink/10 flex items-center justify-center font-plex-mono text-[10px] text-ink/50`}
                    style={{ width: r.wide ? 90 : 56, height: 56 }}
                  >
                    {r.px}
                  </div>
                  <div className="font-plex-mono text-[9px] text-ink/40">{r.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Shadows — dark cards on paper to match reference */}
          <div id="foundations-shadows">
            <SubHead title="Elevation · shadow-scrunch-*" />
            <div className="flex gap-6 mt-4">
              {[
                { cls: "shadow-scrunch-sm", label: "shadow-scrunch-sm", desc: "0 1px 2px rgba(29,17,7,0.06)",           meta: "Subtle · dividers" },
                { cls: "shadow-scrunch-md", label: "shadow-scrunch-md", desc: "0 4px 14px / 0 1px 2px",                 meta: "Default · cards" },
                { cls: "shadow-scrunch-lg", label: "shadow-scrunch-lg", desc: "0 24px 48px -12px / 0 2px 4px",           meta: "Dramatic · modals" },
              ].map((s) => (
                <div key={s.cls} className="flex-1">
                  <div
                    className={`${s.cls} rounded-scrunch-md bg-paper border border-ink/6 p-5 h-24 flex items-end`}
                  >
                    <span className="font-plex-mono text-[10px] text-ink/40">{s.meta}</span>
                  </div>
                  <div className="mt-2">
                    <div className="font-plex-mono text-[11px] text-ink">{s.label}</div>
                    <div className="font-plex-mono text-[9px] text-ink/40 mt-0.5">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            COMPONENTS
        ══════════════════════════════════════════════ */}
        <section className="mb-16 border-t border-ink/10 pt-14">
          <SectionHead id="components-buttons" title="Components" />

          {/* Buttons */}
          <div className="mb-10">
            <SubHead title="Buttons · pill · font-sans 14px font-medium −1% tracking" />
            <div className="mt-4 space-y-4">
              {/* Variants */}
              <div className="flex gap-2.5 items-center flex-wrap">
                <Label>Variants</Label>
                <button className="inline-flex items-center gap-2 px-5 py-[7px] rounded-scrunch-pill font-sans text-[14px] font-medium tracking-[-0.01em] bg-coal text-white border border-coal hover:bg-scrunch-blue hover:border-scrunch-blue transition-colors">
                  Explore AXP
                </button>
                <button className="inline-flex items-center gap-2 px-5 py-[7px] rounded-scrunch-pill font-sans text-[14px] font-medium tracking-[-0.01em] bg-scrunch-blue text-white hover:bg-s-blue-800 transition-colors">
                  Book a demo
                </button>
                <button className="inline-flex items-center gap-2 px-5 py-[7px] rounded-scrunch-pill font-sans text-[14px] font-medium tracking-[-0.01em] bg-ai-green text-coal hover:bg-botanic-green hover:text-paper transition-colors">
                  Get started
                </button>
                <button className="inline-flex items-center gap-2 px-5 py-[7px] rounded-scrunch-pill font-sans text-[14px] font-medium tracking-[-0.01em] bg-transparent text-ink border border-ink/40 hover:bg-coal hover:text-white hover:border-coal transition-colors">
                  Read more
                </button>
              </div>

              {/* Sizes */}
              <div className="flex gap-2.5 items-center">
                <Label>Sizes</Label>
                <button className="inline-flex items-center px-3.5 py-1 rounded-scrunch-pill font-sans text-[12px] font-medium bg-coal text-white">
                  Small
                </button>
                <button className="inline-flex items-center px-5 py-[7px] rounded-scrunch-pill font-sans text-[14px] font-medium bg-coal text-white">
                  Default
                </button>
                <button className="inline-flex items-center px-7 py-2.5 rounded-scrunch-pill font-sans text-[16px] font-medium bg-coal text-white">
                  Large
                </button>
              </div>

              {/* Token reference */}
              <div className="rounded-scrunch-md bg-porcelain p-4 border border-ink/[8%]">
                <Label>Tailwind classes reference</Label>
                <div className="mt-2 grid grid-cols-2 gap-x-8 gap-y-1">
                  {[
                    ["Primary (Coal)",    "bg-coal text-white hover:bg-scrunch-blue"],
                    ["Accent (Blue)",     "bg-scrunch-blue text-white hover:bg-s-blue-800"],
                    ["Highlight (Green)", "bg-ai-green text-coal hover:bg-botanic-green"],
                    ["Ghost",             "border border-ink/40 text-ink hover:bg-coal"],
                    ["Border radius",     "rounded-scrunch-pill"],
                    ["Font",              "font-sans text-[14px] font-medium tracking-[-0.01em]"],
                  ].map(([label, classes]) => (
                    <div key={label} className="flex gap-2 items-baseline">
                      <span className="font-plex-mono text-[9px] text-ink/40 w-28 shrink-0">{label}</span>
                      <code className="font-plex-mono text-[10px] text-ink/70">{classes}</code>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Cards */}
          <div className="mb-10" id="components-cards">
            <SubHead title="Cards · rounded-[16px] · Newsreader 22px title · Inter 13px body" />
            <div className="grid grid-cols-3 gap-3 mt-4">

              {/* UI Card — porcelain */}
              <div className="rounded-[16px] p-4 bg-porcelain shadow-scrunch-md">
                <div className="font-plex-mono text-[10px] uppercase tracking-[0.08em] text-ink/40">UI · 12px</div>
                <h4 className="font-newsreader font-medium text-[22px] leading-[1.1] tracking-[-0.02em] mt-1.5 mb-2 text-ink">
                  Page audit
                </h4>
                <p className="font-sans text-[13px] leading-[1.5] text-clay">
                  Checks whether AI agents can read and recommend your content.
                </p>
                <div className="mt-3 font-plex-mono text-[9px] text-ink/30">bg-porcelain · rounded-[16px] · shadow-scrunch-md</div>
              </div>

              {/* Editorial Card — clay */}
              <div
                className="rounded-[16px] p-5 bg-clay"
                style={{ boxShadow: "0 4px 14px rgba(0,0,0,0.18), 0 1px 2px rgba(0,0,0,0.10)" }}
              >
                <div className="font-plex-mono text-[10px] uppercase tracking-[0.08em] text-white/50">Editorial · 20px</div>
                <h4 className="font-newsreader font-medium text-[22px] leading-[1.1] tracking-[-0.02em] mt-1.5 mb-2 text-white">
                  Humans don&apos;t visit — <em>AI does.</em>
                </h4>
                <p className="font-sans text-[13px] leading-[1.5] text-white/70">
                  Optimize what the agent actually sees.
                </p>
                <div className="mt-3 font-plex-mono text-[9px] text-white/25">bg-clay · rounded-[16px]</div>
              </div>

              {/* Dark Card — coal */}
              <div
                className="rounded-[16px] p-4 bg-coal"
                style={{ boxShadow: "0 4px 14px rgba(0,0,0,0.18), 0 1px 2px rgba(0,0,0,0.10)" }}
              >
                <div className="font-plex-mono text-[10px] uppercase tracking-[0.08em] text-white/50">Dark · 12px</div>
                <h4 className="font-newsreader font-medium text-[22px] leading-[1.1] tracking-[-0.02em] mt-1.5 mb-2 text-white">
                  Agent traffic
                </h4>
                <p className="font-sans text-[13px] leading-[1.5] text-white/70">
                  See which models are crawling, which queries you&apos;re ranking for.
                </p>
                <div className="mt-3 font-plex-mono text-[9px] text-white/25">bg-coal · rounded-[16px]</div>
              </div>
            </div>
          </div>

          {/* Inputs */}
          <div id="components-inputs">
            <SubHead title="Inputs · rounded-scrunch-sm · border-ink/18 · focus:border-scrunch-blue + ring" />
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <div className="font-plex-mono text-[10px] uppercase tracking-[0.06em] text-ink/40 mb-1.5">URL</div>
                <input
                  className="w-full px-3.5 py-3 font-sans text-[14px] text-ink bg-paper border border-ink/[18%] rounded-scrunch-sm outline-none focus:border-scrunch-blue focus:[box-shadow:0_0_0_3px_rgba(42,74,234,0.15)] transition-[border-color,box-shadow]"
                  defaultValue="https://yourcompany.com"
                  readOnly
                />
              </div>
              <div>
                <div className="font-plex-mono text-[10px] uppercase tracking-[0.06em] text-ink/40 mb-1.5">Industry</div>
                <select className="w-full px-3.5 py-3 font-sans text-[14px] text-ink bg-paper border border-ink/[18%] rounded-scrunch-sm outline-none">
                  <option>Enterprise SaaS</option>
                </select>
              </div>
              <div className="col-span-2">
                <div className="font-plex-mono text-[10px] uppercase tracking-[0.06em] text-ink/40 mb-1.5">Chips</div>
                <div className="flex gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-scrunch-pill bg-scrunch-blue text-white font-plex-mono text-[10px] uppercase tracking-[0.06em]">
                    ChatGPT
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-scrunch-pill bg-cream-200 text-clay font-plex-mono text-[10px] uppercase tracking-[0.06em]">
                    Perplexity
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-scrunch-pill bg-ai-green text-coal font-plex-mono text-[10px] uppercase tracking-[0.06em]">
                    Recommended
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-scrunch-pill bg-cream-200 text-clay font-plex-mono text-[10px] uppercase tracking-[0.06em]">
                    Claude
                  </span>
                </div>
              </div>
            </div>

            {/* Input token reference */}
            <div className="mt-4 rounded-scrunch-md bg-porcelain p-4 border border-ink/[8%]">
              <Label>Input token reference</Label>
              <div className="mt-2 grid grid-cols-2 gap-x-8 gap-y-1">
                {[
                  ["Base",           "bg-paper border border-ink/[18%] rounded-scrunch-sm"],
                  ["Focus",          "focus:border-scrunch-blue focus:[box-shadow:0_0_0_3px_rgba(42,74,234,0.15)]"],
                  ["Font",           "font-sans text-[14px] text-ink"],
                  ["Chip base",      "bg-cream-200 text-clay rounded-scrunch-pill"],
                  ["Chip accent",    "bg-scrunch-blue text-white rounded-scrunch-pill"],
                  ["Chip highlight", "bg-ai-green text-coal rounded-scrunch-pill"],
                ].map(([label, classes]) => (
                  <div key={label} className="flex gap-2 items-baseline">
                    <span className="font-plex-mono text-[9px] text-ink/40 w-28 shrink-0">{label}</span>
                    <code className="font-plex-mono text-[10px] text-ink/70">{classes}</code>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-ink/10 pt-8 pb-4">
          <div className="font-plex-mono text-[10px] uppercase tracking-[0.08em] text-ink/30">
            Scrunch Design System · Tailwind v4 · {new Date().getFullYear()}
          </div>
        </footer>
      </main>
    </div>
  )
}
