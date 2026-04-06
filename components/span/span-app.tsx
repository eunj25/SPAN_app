"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { AppProvider, Project, useApp } from "@/lib/store"
import { HomeScreen } from "./home-screen"
import { ProjectDetail } from "./project-detail"
import { BottomNav } from "./bottom-nav"
import { MemoForm } from "./memo-form"
import { ProjectForm } from "./project-form"
import { User, ChevronRight, FolderOpen, Calendar, Sun, Moon } from "lucide-react"

function ProfileScreen() {
  const { projects } = useApp()
  const { theme, setTheme } = useTheme()
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const inProgressProjects = projects.filter(p => {
    const endDate = new Date(p.endDate)
    endDate.setHours(0, 0, 0, 0)
    return endDate >= today
  })
  
  const completedProjects = projects.filter(p => {
    const endDate = new Date(p.endDate)
    endDate.setHours(0, 0, 0, 0)
    return endDate < today
  })

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
          <h1 className="text-xl font-bold tracking-tight">Profile</h1>
          <button 
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6 space-y-6">
        {/* Profile Card */}
        <div className="flex items-center gap-4 rounded-xl bg-card p-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Span User</h2>
            <p className="text-sm text-muted-foreground">Tracking life, one day at a time</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col items-center rounded-xl bg-card p-4">
            <FolderOpen className="mb-2 h-5 w-5 text-primary" />
            <p className="text-2xl font-bold text-foreground">{inProgressProjects.length}</p>
            <p className="text-xs text-muted-foreground">In Progress</p>
          </div>
          <div className="flex flex-col items-center rounded-xl bg-card p-4">
            <Calendar className="mb-2 h-5 w-5 text-muted-foreground" />
            <p className="text-2xl font-bold text-foreground">{completedProjects.length}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="rounded-xl bg-card divide-y divide-border overflow-hidden">
          {[
            { label: "Account Settings", icon: User },
            { label: "Notifications", icon: User },
            { label: "Privacy", icon: User },
            { label: "Help & Support", icon: User }
          ].map((item, index) => (
            <button
              key={index}
              className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-secondary"
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{item.label}</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Span v1.0.0
        </p>
      </main>
    </div>
  )
}

type ViewType = "home" | "create" | "profile" | "create-project"

function SpanAppContent() {
  const [currentView, setCurrentView] = useState<ViewType>("home")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [projectDetailFullScreen, setProjectDetailFullScreen] = useState(false)
  const { addMemo, addProject, projects } = useApp()
  const navCurrentView: "home" | "create" | "profile" =
    currentView === "profile"
      ? "profile"
      : currentView === "create"
        ? "create"
        : "home"

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project)
  }

  const handleBackToHome = () => {
    setSelectedProject(null)
  }

  const handleNavigate = (view: "home" | "create" | "profile") => {
    if (view === "create") {
      // Always show project creation form when clicking +
      setCurrentView("create-project")
    } else {
      setCurrentView(view)
    }
    if (view === "home") {
      setSelectedProject(null)
    }
  }

  const handleCreateMemo = (data: {
    text: string
    date: string
    imageUrl: string
    imageUrls: string[]
    checklist: { id: string; text: string; checked: boolean }[]
  }) => {
    if (projects.length > 0) {
      addMemo(projects[0].id, {
        id: `m${Date.now()}`,
        ...data,
        imageUrls: data.imageUrls.length > 0 ? data.imageUrls : undefined
      })
    }
    setCurrentView("home")
  }

  const handleCreateProject = (projectData: Omit<Project, "id" | "memos">) => {
    addProject({
      id: `p${Date.now()}`,
      ...projectData,
      memos: []
    })
    setCurrentView("home")
  }

  // Show project detail
  if (selectedProject) {
    return (
      <>
        <ProjectDetail
          project={selectedProject}
          onBack={handleBackToHome}
          onFullScreenChange={setProjectDetailFullScreen}
        />
        {!projectDetailFullScreen && (
          <BottomNav currentView="home" onNavigate={handleNavigate} />
        )}
      </>
    )
  }

  // Show project creation form
  if (currentView === "create-project") {
    return (
      <ProjectForm
        onSubmit={handleCreateProject}
        onCancel={() => setCurrentView("home")}
      />
    )
  }

  // Show memo creation
  if (currentView === "create" && projects.length > 0) {
    return (
      <MemoForm
        onSubmit={handleCreateMemo}
        onCancel={() => setCurrentView("home")}
        projectStartDate={projects[0].startDate}
        projectEndDate={projects[0].endDate}
      />
    )
  }

  return (
    <>
      {currentView === "home" && (
        <HomeScreen
          onSelectProject={handleSelectProject}
          onCreateProject={() => setCurrentView("create-project")}
        />
      )}
      {currentView === "profile" && <ProfileScreen />}
      <BottomNav currentView={navCurrentView} onNavigate={handleNavigate} />
    </>
  )
}

export function SpanApp() {
  return (
    <AppProvider>
      <SpanAppContent />
    </AppProvider>
  )
}
