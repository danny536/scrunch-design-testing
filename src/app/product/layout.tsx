import { ScrunchSidebar } from "@/components/scrunch-sidebar"
import { ProductTopBar } from "@/components/product/top-bar"
import { ColorPickerOverlayMount } from "@/components/color-picker-overlay-mount"

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <ProductTopBar />
      <div className="flex flex-1 overflow-hidden">
        <ScrunchSidebar defaultActive="home" />
        <main className="flex-1 overflow-y-auto bg-[#FBF9F6] px-8 py-6">
          {children}
        </main>
      </div>
      <ColorPickerOverlayMount />
    </div>
  )
}
