"use client"

import { Project, Memo } from "@/lib/store"
import { getMemoPrimaryImage } from "@/lib/memo-images"
import { Check, Circle } from "lucide-react"
import { cn } from "@/lib/utils"
import { AIInsights } from "./ai-insights"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface ListViewProps {
  project: Project
}

interface WeekData {
  weekNumber: number
  startDate: Date
  endDate: Date
  days: { date: Date; memo: Memo | null }[]
}

export function ListView({ project }: ListViewProps) {
  const startDate = new Date(project.startDate)
  const endDate = new Date(project.endDate)

  const getWeeks = (): WeekData[] => {
    const weeks: WeekData[] = []
    let currentDate = new Date(startDate)
    let weekNumber = 1

    while (currentDate <= endDate) {
      const weekStart = new Date(currentDate)
      const weekDays: { date: Date; memo: Memo | null }[] = []

      for (let i = 0; i < 7 && currentDate <= endDate; i++) {
        const dateStr = currentDate.toISOString().split("T")[0]
        const memo = project.memos.find(m => m.date === dateStr) || null
        weekDays.push({ date: new Date(currentDate), memo })
        currentDate.setDate(currentDate.getDate() + 1)
      }

      weeks.push({
        weekNumber,
        startDate: weekStart,
        endDate: new Date(weekDays[weekDays.length - 1].date),
        days: weekDays
      })
      weekNumber++
    }

    return weeks
  }

  const weeks = getWeeks()

  return (
    <div className="space-y-6">
      {/* AI Insights Section */}
      <AIInsights project={project} />

      {/* Weekly List (Accordion) */}
      <div className="overflow-hidden rounded-xl bg-card">
        <Accordion type="single" collapsible defaultValue={`week-${weeks[0]?.weekNumber ?? 1}`} className="w-full">
          {weeks.map((week) => (
            <AccordionItem key={week.weekNumber} value={`week-${week.weekNumber}`} className="border-border">
              <AccordionTrigger className="bg-secondary/50 px-4 py-3 hover:no-underline">
                <div className="text-left">
                  <h3 className="text-sm font-semibold text-foreground">
                    Week {week.weekNumber}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {week.startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - {" "}
                    {week.endDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-0">
                <div className="divide-y divide-border">
                  {week.days.map((day, index) => {
                    const thumb = day.memo ? getMemoPrimaryImage(day.memo) : null
                    return (
                    <div
                      key={index}
                      className={cn(
                        "flex items-center gap-4 px-4 py-3 transition-colors",
                        day.memo && "bg-primary/5"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                          day.memo
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-muted-foreground"
                        )}
                      >
                        {day.memo ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Circle className="h-3 w-3" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={cn(
                          "text-sm font-medium",
                          day.memo ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {day.date.toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric"
                          })}
                        </p>
                        {day.memo && (
                          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                            {day.memo.text}
                          </p>
                        )}
                      </div>
                      {day.memo && (
                        <div className="h-10 w-10 overflow-hidden rounded-lg bg-muted">
                          {thumb ? (
                            <img
                              src={thumb}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[8px] text-muted-foreground">
                              —
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    )
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}
