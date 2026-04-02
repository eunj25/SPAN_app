"use client"

import { Home, Plus, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface BottomNavProps {
  currentView: "home" | "create" | "profile"
  onNavigate: (view: "home" | "create" | "profile") => void
}

export function BottomNav({ currentView, onNavigate }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/80 backdrop-blur-lg safe-area-inset-bottom">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-6">
        <button
          onClick={() => onNavigate("home")}
          className={cn(
            "flex flex-col items-center gap-1 transition-colors",
            currentView === "home" ? "text-primary" : "text-muted-foreground"
          )}
        >
          <Home className="h-5 w-5" />
          <span className="text-[10px] font-medium">Home</span>
        </button>
        
        <button
          onClick={() => onNavigate("create")}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-105 active:scale-95"
        >
          <Plus className="h-6 w-6" />
        </button>
        
        <button
          onClick={() => onNavigate("profile")}
          className={cn(
            "flex flex-col items-center gap-1 transition-colors",
            currentView === "profile" ? "text-primary" : "text-muted-foreground"
          )}
        >
          <User className="h-5 w-5" />
          <span className="text-[10px] font-medium">Profile</span>
        </button>
      </div>
    </nav>
  )
}
