"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { BookOpen, ChevronDown, ChevronsUpDown, Search, Video } from "lucide-react"

export function ProductTopBar() {
  const [showLearn, setShowLearn] = useState(false)
  const learnRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!learnRef.current || learnRef.current.contains(e.target as Node)) return
      setShowLearn(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  return (
    <div className="flex h-14 w-full shrink-0 items-center gap-2 border-b border-ink/[12%] bg-paper px-3">
      {/* Logo mark */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center">
        <Image src="/logo-mark.svg" alt="Scrunch" width={28} height={28} className="dark:invert" />
      </div>

      {/* Divider */}
      <div className="mx-1 h-5 w-px bg-ink/15" />

      {/* Workspace switcher */}
      <button className="flex items-center gap-1.5 rounded-scrunch-sm px-1.5 py-1 hover:bg-porcelain transition-colors">
        <span className="font-sans text-[14px] font-medium text-ink leading-none">Scrunch AI</span>
        <span className="inline-flex items-center rounded-full bg-s-neutral-200 px-2 py-0.5 font-plex-mono text-[10px] uppercase tracking-[0.06em] text-ink/80">
          Agency
        </span>
        <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-ink/35" />
      </button>

      {/* Divider */}
      <div className="mx-1 h-5 w-px bg-ink/15" />

      {/* Brand switcher */}
      <button className="flex items-center gap-1.5 rounded-scrunch-sm px-1.5 py-1 hover:bg-porcelain transition-colors">
        <span className="font-sans text-[14px] font-medium text-ink leading-none">Colgate</span>
        <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-ink/35" />
      </button>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-3">

        {/* Learn dropdown */}
        <div className="relative" ref={learnRef}>
          <button
            onClick={() => setShowLearn((v) => !v)}
            className="flex items-center gap-1.5 rounded-scrunch-md border border-s-neutral-200 bg-white px-2.5 py-1.5 text-sm text-ink/70 hover:bg-s-neutral-50 hover:text-ink transition-colors"
          >
            <BookOpen className="h-4 w-4" />
            <span className="font-medium">Learn</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </button>

          {showLearn && (
            <div className="absolute top-[calc(100%+6px)] right-0 min-w-[200px] bg-white border border-s-neutral-200 rounded-scrunch-md shadow-scrunch-md z-50 py-1 overflow-hidden">
              <button
                onClick={() => setShowLearn(false)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-[13.5px] text-ink hover:bg-s-neutral-50 transition-colors"
              >
                <BookOpen className="h-4 w-4 shrink-0 text-ink/60" />
                Getting Started
              </button>
              <button
                onClick={() => setShowLearn(false)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-[13.5px] text-ink hover:bg-s-neutral-50 transition-colors"
              >
                <Video className="h-4 w-4 shrink-0 text-ink/60" />
                Watch an Intro
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 rounded-scrunch-md border border-ink/[12%] bg-white px-3 py-1.5 text-sm text-ink/40 w-52">
          <Search className="h-4 w-4 shrink-0" />
          <span className="flex-1">Search...</span>
          <kbd className="inline-flex items-center gap-0.5 rounded border border-ink/10 px-1 py-px font-plex-mono text-[11px] text-ink/30">
            ⌘K
          </kbd>
        </div>
      </div>
    </div>
  )
}
