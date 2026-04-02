"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Project } from "@/lib/store"

interface SpanCalendarProps {
  projects: Project[]
}

interface ProjectSpan {
  project: Project
  color: string
}

export function SpanCalendar({ projects }: SpanCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDay = firstDay.getDay()

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const dayNames = ["S", "M", "T", "W", "T", "F", "S"]

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const isToday = (day: number) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    )
  }

  // Get project spans for the current month
  const getProjectSpansForDate = (day: number): ProjectSpan[] => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    const date = new Date(dateStr)
    
    return projects
      .filter(project => {
        const start = new Date(project.startDate)
        const end = new Date(project.endDate)
        return date >= start && date <= end
      })
      .map((project) => ({
        project,
        color: project.color || "bg-primary"
      }))
  }

  // Check if date is start/end/middle of a project span
  const getSpanPosition = (day: number, project: Project): "start" | "end" | "middle" | "single" => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    const isStart = project.startDate === dateStr
    const isEnd = project.endDate === dateStr
    
    if (isStart && isEnd) return "single"
    if (isStart) return "start"
    if (isEnd) return "end"
    return "middle"
  }

  // Check if it's the first day of week for a continuing span
  const isWeekStart = (day: number) => {
    const dayOfWeek = new Date(year, month, day).getDay()
    return dayOfWeek === 0
  }

  // Check if it's the last day of week for a continuing span
  const isWeekEnd = (day: number) => {
    const dayOfWeek = new Date(year, month, day).getDay()
    return dayOfWeek === 6
  }

  // Check if span continues from previous month
  const spanContinuesFromPrevMonth = (day: number, project: Project) => {
    if (day !== 1) return false
    const start = new Date(project.startDate)
    return start < firstDay
  }

  // Check if span continues to next month
  const spanContinuesToNextMonth = (day: number, project: Project) => {
    if (day !== daysInMonth) return false
    const end = new Date(project.endDate)
    return end > lastDay
  }

  const totalCells = startingDay + daysInMonth
  const rows = Math.ceil(totalCells / 7)

  return (
    <div className="rounded-xl bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={prevMonth}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-secondary transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-medium">
          {monthNames[month]} {year}
        </span>
        <button
          onClick={nextMonth}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-secondary transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-0 mb-1">
        {dayNames.map((day, i) => (
          <div
            key={i}
            className="flex h-8 items-center justify-center text-xs text-muted-foreground font-medium"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid with spans */}
      <div className="grid grid-cols-7 gap-0">
        {/* Empty cells for starting offset */}
        {Array.from({ length: startingDay }).map((_, i) => (
          <div key={`empty-${i}`} className="h-12 relative" />
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const today = isToday(day)
          const spans = getProjectSpansForDate(day)
          const cellIndex = startingDay + i
          const isFirstInRow = cellIndex % 7 === 0
          const isLastInRow = cellIndex % 7 === 6

          return (
            <div key={day} className="h-10 flex flex-col">
              {/* Day number - always visible on top */}
              <div className="flex justify-center flex-1 items-center">
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full text-xs transition-colors z-10",
                    today && "bg-foreground text-background font-bold",
                    !today && "text-foreground"
                  )}
                >
                  {day}
                </span>
              </div>

              {/* Span bars - positioned below date number (max 4 lines) */}
              <div className="flex flex-col gap-0.5 h-6">
                {spans.slice(0, 4).map(({ project, color }) => {
                  const position = getSpanPosition(day, project)
                  const continuesFromPrev = spanContinuesFromPrevMonth(day, project)
                  const continuesToNext = spanContinuesToNextMonth(day, project)
                  
                  // Determine rounded corners based on position
                  let roundedClass = ""
                  const isActualStart = position === "start" || position === "single"
                  const isActualEnd = position === "end" || position === "single"
                  const showLeftRound = isActualStart || (isFirstInRow && !continuesFromPrev && position === "middle")
                  const showRightRound = isActualEnd || (isLastInRow && !continuesToNext && position === "middle")

                  if (showLeftRound && showRightRound) {
                    roundedClass = "rounded-full mx-0.5"
                  } else if (showLeftRound) {
                    roundedClass = "rounded-l-full ml-0.5"
                  } else if (showRightRound) {
                    roundedClass = "rounded-r-full mr-0.5"
                  } else if (isFirstInRow) {
                    roundedClass = "rounded-l-sm"
                  } else if (isLastInRow) {
                    roundedClass = "rounded-r-sm"
                  }

                  return (
                    <div
                      key={project.id}
                      className={cn(
                        "h-1",
                        color,
                        roundedClass,
                        "opacity-90"
                      )}
                    />
                  )
                })}
                {spans.length > 2 && (
                  <div className="text-center text-[8px] text-muted-foreground leading-none">
                    +{spans.length - 2}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}
