"use client"

import { useApp, Project } from "@/lib/store"
import { SpanCalendar } from "./span-calendar"
import { ProjectCard } from "./project-card"

interface HomeScreenProps {
  onSelectProject: (project: Project) => void
  onCreateProject: () => void
}

export function HomeScreen({ onSelectProject }: HomeScreenProps) {
  const { projects } = useApp()
  const sortedProjects = [...projects].sort((a, b) => {
    const aId = Number(a.id.replace(/\D/g, ""))
    const bId = Number(b.id.replace(/\D/g, ""))
    if (!Number.isNaN(aId) && !Number.isNaN(bId)) {
      return bId - aId
    }
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  })

  const allActiveDates = projects.flatMap(p => p.memos.map(m => m.date))

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-center px-4">
          <h1 className="text-xl font-bold tracking-tight">
            <span className="text-primary">Span</span>
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6 space-y-6">
        {/* Calendar Section with Span Bars */}
        <section>
          <SpanCalendar projects={projects} />
        </section>

        {/* This Month Stats - Below Calendar */}
        <section className="rounded-xl bg-card p-4">
          <h3 className="mb-3 text-sm font-medium text-muted-foreground">This Month</h3>
          {/* Project Legend */}
          {projects.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-3 pb-3 border-b border-border">
              {sortedProjects.map((project) => {
                return (
                  <div key={project.id} className="flex items-center gap-1.5">
                    <div className={`h-2 w-4 rounded-full ${project.color || "bg-primary"}`} />
                    <span className="text-xs text-muted-foreground truncate max-w-24">{project.title}</span>
                  </div>
                )
              })}
            </div>
          )}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{allActiveDates.length}</p>
              <p className="text-xs text-muted-foreground">Entries</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{projects.length}</p>
              <p className="text-xs text-muted-foreground">Projects</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {Math.round((allActiveDates.length / 31) * 100)}%
              </p>
              <p className="text-xs text-muted-foreground">Active Days</p>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Your Projects</h2>
            <span className="text-sm text-muted-foreground">{projects.length} active</span>
          </div>
          <div className="space-y-4">
            {sortedProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => onSelectProject(project)}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
