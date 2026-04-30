import { ScrunchSidebar } from "@/components/scrunch-sidebar"

export default function SidebarPage() {
  return (
    <div className="flex h-screen bg-porcelain">
      <ScrunchSidebar />
      <div className="flex flex-1 items-center justify-center">
        <p className="font-sans text-sm text-ink/40">← Sidebar demo</p>
      </div>
    </div>
  )
}
