"use client"

import { ColorPickerOverlay } from "@/components/color-picker-overlay"

/**
 * Thin client boundary shim so ColorPickerOverlay (which uses useState/
 * clipboard APIs) can be imported from a server-component layout without
 * turning the layout itself into a client component.
 */
export function ColorPickerOverlayMount() {
  return <ColorPickerOverlay />
}
