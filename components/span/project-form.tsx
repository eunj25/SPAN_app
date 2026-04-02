"use client"

import { useState } from "react"
import { X, Calendar, ImagePlus, FolderPlus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Project } from "@/lib/store"

interface ProjectFormProps {
  onSubmit: (project: Omit<Project, "id" | "memos">) => void
  onCancel: () => void
}

const COVER_IMAGES = [
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80",
  "https://images.unsplash.com/photo-1490730141103-6cac27abb37f?w=800&q=80",
  "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&q=80",
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
]

const BAR_COLORS = [
  "bg-primary",
  "bg-foreground/80",
  "bg-foreground/65",
  "bg-foreground/50",
  "bg-foreground/35",
]

export function ProjectForm({ onSubmit, onCancel }: ProjectFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [coverImage, setCoverImage] = useState(COVER_IMAGES[0])
  const [color, setColor] = useState(BAR_COLORS[0])
  const [showImagePicker, setShowImagePicker] = useState(false)

  const calculateDuration = () => {
    if (!startDate || !endDate) return ""
    const start = new Date(startDate)
    const end = new Date(endDate)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    
    if (days <= 7) return `${days} days`
    if (days <= 14) return "2 weeks"
    if (days <= 21) return "3 weeks"
    if (days <= 31) return "1 month"
    return `${Math.ceil(days / 7)} weeks`
  }

  const handleSubmit = () => {
    if (!title || !startDate || !endDate) return

    onSubmit({
      title,
      description,
      startDate,
      endDate,
      duration: calculateDuration(),
      coverImage,
      color
    })
  }

  const isValid = title && startDate && endDate && new Date(endDate) >= new Date(startDate)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
          <button
            onClick={onCancel}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-secondary transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold">New Project</h1>
          <div className="h-9 w-9" />
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6 space-y-6">
        {/* Cover Image Preview */}
        <div className="relative aspect-video overflow-hidden rounded-xl bg-secondary">
          <img
            src={coverImage}
            alt="Project cover"
            className="h-full w-full object-cover"
          />
          <button
            onClick={() => setShowImagePicker(!showImagePicker)}
            className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full bg-background/80 px-3 py-1.5 text-xs font-medium backdrop-blur-sm transition-colors hover:bg-background"
          >
            <ImagePlus className="h-3.5 w-3.5" />
            Change Cover
          </button>
        </div>

        {/* Image Picker */}
        {showImagePicker && (
          <div className="grid grid-cols-3 gap-2 rounded-xl bg-card p-3">
            {COVER_IMAGES.map((img, index) => (
              <button
                key={index}
                onClick={() => {
                  setCoverImage(img)
                  setShowImagePicker(false)
                }}
                className={cn(
                  "aspect-video overflow-hidden rounded-lg ring-2 transition-all",
                  coverImage === img ? "ring-primary" : "ring-transparent hover:ring-primary/50"
                )}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Calendar Bar Color */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">캘린더 바 색상</label>
            <div className="flex flex-wrap gap-2 rounded-xl bg-card p-3">
              {BAR_COLORS.map((barColor) => (
                <button
                  type="button"
                  key={barColor}
                  onClick={() => setColor(barColor)}
                  className={cn(
                    "h-7 w-10 rounded-full border border-border transition-all",
                    barColor,
                    color === barColor ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "opacity-80 hover:opacity-100"
                  )}
                  aria-label="캘린더 바 색상 선택"
                />
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Project Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., 2-Week Workout Challenge"
              className="w-full rounded-xl bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none ring-1 ring-border focus:ring-primary transition-colors"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this project about?"
              className="w-full rounded-xl bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none ring-1 ring-border focus:ring-primary transition-colors"
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-xl bg-card px-4 py-3 text-sm text-foreground outline-none ring-1 ring-border focus:ring-primary transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                className="w-full rounded-xl bg-card px-4 py-3 text-sm text-foreground outline-none ring-1 ring-border focus:ring-primary transition-colors"
              />
            </div>
          </div>

          {/* Duration Preview */}
          {startDate && endDate && new Date(endDate) >= new Date(startDate) && (
            <div className="flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-3">
              <FolderPlus className="h-4 w-4 text-primary" />
              <span className="text-sm text-foreground">
                Project duration: <span className="font-semibold text-primary">{calculateDuration()}</span>
              </span>
            </div>
          )}
        </div>

        {/* Quick Presets */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Quick Presets</label>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "1 Week", days: 7 },
              { label: "2 Weeks", days: 14 },
              { label: "3 Weeks", days: 21 },
              { label: "1 Month", days: 30 },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => {
                  const today = new Date()
                  const end = new Date(today)
                  end.setDate(end.getDate() + preset.days - 1)
                  setStartDate(today.toISOString().split("T")[0])
                  setEndDate(end.toISOString().split("T")[0])
                }}
                className="rounded-full bg-secondary px-4 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className={cn(
            "w-full rounded-xl px-4 py-3 text-sm font-medium transition-colors",
            isValid
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-secondary text-muted-foreground"
          )}
        >
          프로젝트 만들기
        </button>
      </main>
    </div>
  )
}
