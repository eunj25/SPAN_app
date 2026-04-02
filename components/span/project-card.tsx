"use client"

import { Project } from "@/lib/store"
import { Calendar, Image as ImageIcon } from "lucide-react"
import Image from "next/image"

interface ProjectCardProps {
  project: Project
  onClick: () => void
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const progress = Math.round((project.memos.length / 14) * 100)

  return (
    <button
      onClick={onClick}
      className="group relative w-full overflow-hidden rounded-xl bg-card text-left transition-all hover:ring-1 hover:ring-primary/30"
    >
      <div className="relative h-44 w-full overflow-hidden">
        <Image
          src={project.coverImage}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
      </div>
      <div className="relative p-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
            {project.duration}
          </span>
        </div>
        <h3 className="mb-1 text-lg font-semibold text-foreground">
          {project.title}
        </h3>
        <p className="mb-3 text-sm text-muted-foreground">
          {project.description}
        </p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{new Date(project.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
          </div>
          <div className="flex items-center gap-1">
            <ImageIcon className="h-3.5 w-3.5" />
            <span>{project.memos.length} entries</span>
          </div>
        </div>
        <div className="mt-3">
          <div className="mb-1 flex justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-primary font-medium">{progress}%</span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </button>
  )
}
