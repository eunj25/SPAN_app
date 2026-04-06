"use client"

import { useLayoutEffect, useMemo, useState } from "react"
import { Project, Memo, useApp } from "@/lib/store"
import { TimelineView } from "./timeline-view"
import { ListView } from "./list-view"
import { MemoForm } from "./memo-form"
import { MemoDetailPage } from "./memo-detail-page"
import { ArrowLeft, LayoutGrid, List, Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface ProjectDetailProps {
  project: Project
  onBack: () => void
  /** 메모 작성·상세 등 전체 화면 오버레이 시 하단 탭 숨김용 */
  onFullScreenChange?: (fullScreen: boolean) => void
}

export function ProjectDetail({ project, onBack, onFullScreenChange }: ProjectDetailProps) {
  const [viewMode, setViewMode] = useState<"timeline" | "list">("timeline")
  const [showMemoForm, setShowMemoForm] = useState(false)
  const [activeMemoId, setActiveMemoId] = useState<string | null>(null)
  const { addMemo, updateMemo, projects } = useApp()

  const currentProject = projects.find(p => p.id === project.id) || project
  const activeMemo = useMemo(
    () => (activeMemoId ? currentProject.memos.find(m => m.id === activeMemoId) ?? null : null),
    [activeMemoId, currentProject.memos]
  )

  const handleAddMemo = (data: {
    text: string
    date: string
    imageUrl: string
    imageUrls: string[]
    checklist: { id: string; text: string; checked: boolean }[]
  }) => {
    const newMemo: Memo = {
      id: `m${Date.now()}`,
      date: data.date,
      text: data.text,
      imageUrl: data.imageUrl,
      imageUrls: data.imageUrls.length > 0 ? data.imageUrls : undefined,
      checklist: data.checklist
    }
    addMemo(project.id, newMemo)
    setShowMemoForm(false)
  }

  useLayoutEffect(() => {
    const fullScreen = Boolean(showMemoForm || activeMemoId)
    onFullScreenChange?.(fullScreen)
    return () => onFullScreenChange?.(false)
  }, [showMemoForm, activeMemoId, onFullScreenChange])

  if (showMemoForm) {
    return (
      <MemoForm
        onSubmit={handleAddMemo}
        onCancel={() => setShowMemoForm(false)}
        projectStartDate={project.startDate}
        projectEndDate={project.endDate}
      />
    )
  }

  if (activeMemo) {
    return (
      <MemoDetailPage
        memo={activeMemo}
        projectStartDate={project.startDate}
        projectEndDate={project.endDate}
        onClose={() => setActiveMemoId(null)}
        onUpdate={(updates) => updateMemo(project.id, activeMemo.id, updates)}
      />
    )
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Hero Header */}
      <div className="relative">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={currentProject.coverImage}
            alt={currentProject.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background" />
        </div>
        
        {/* Navigation */}
        <div className="absolute top-0 left-0 right-0 z-10">
          <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
            <button
              onClick={onBack}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-colors hover:bg-background"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowMemoForm(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Project Info */}
        <div className="relative -mt-12 mx-auto max-w-lg px-4">
          <div className="rounded-xl bg-card p-4 shadow-lg">
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
                {currentProject.duration}
              </span>
              <span className="text-xs text-muted-foreground">
                {currentProject.memos.length} entries
              </span>
            </div>
            <h1 className="text-xl font-bold text-foreground">{currentProject.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{currentProject.description}</p>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <span>
                {new Date(currentProject.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
              <span className="text-primary">→</span>
              <span>
                {new Date(currentProject.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="mx-auto max-w-lg px-4 py-4">
        <div className="flex items-center justify-center gap-1 rounded-xl bg-card p-1">
          <button
            onClick={() => setViewMode("timeline")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              viewMode === "timeline"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <LayoutGrid className="h-4 w-4" />
            Timeline
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              viewMode === "list"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <List className="h-4 w-4" />
            List
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-lg px-4">
        {viewMode === "timeline" ? (
          <TimelineView
            memos={currentProject.memos}
            onSelectMemo={(memo) => setActiveMemoId(memo.id)}
          />
        ) : (
          <ListView project={currentProject} />
        )}
      </div>
    </div>
  )
}
