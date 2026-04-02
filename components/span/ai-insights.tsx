"use client"

import { Project } from "@/lib/store"
import { Brain, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react"

interface AIInsightsProps {
  project: Project
}

export function AIInsights({ project }: AIInsightsProps) {
  const startDate = new Date(project.startDate)
  const endDate = new Date(project.endDate)
  const today = new Date()
  
  // Calculate total days in project
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
  
  // Calculate days passed
  const daysPassed = Math.min(
    Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1,
    totalDays
  )
  
  const recordedDays = project.memos.length
  const completionRate = Math.round((recordedDays / Math.max(daysPassed, 1)) * 100)

  // Analyze patterns - find day of week with most/least entries
  const dayOfWeekCounts: Record<string, number> = {
    "일요일": 0, "월요일": 0, "화요일": 0, "수요일": 0,
    "목요일": 0, "금요일": 0, "토요일": 0
  }
  const dayNames = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"]
  
  project.memos.forEach(memo => {
    const date = new Date(memo.date)
    const dayName = dayNames[date.getDay()]
    dayOfWeekCounts[dayName]++
  })

  const sortedDays = Object.entries(dayOfWeekCounts).sort((a, b) => b[1] - a[1])
  const highActivityDays = sortedDays.filter(([, count]) => count > 0).slice(0, 2).map(([day]) => day)
  const lowActivityDays = sortedDays.filter(([, count]) => count === 0).map(([day]) => day)

  // Find missing dates in the past
  const missingDates: string[] = []
  const currentDate = new Date(startDate)
  const checkUntil = today < endDate ? today : endDate

  while (currentDate <= checkUntil) {
    const dateStr = currentDate.toISOString().split("T")[0]
    if (!project.memos.find(m => m.date === dateStr)) {
      missingDates.push(dateStr)
    }
    currentDate.setDate(currentDate.getDate() + 1)
  }

  const recentMissing = missingDates.slice(-3)

  // Generate pattern message
  let patternMessage = ""
  if (highActivityDays.length > 0 && lowActivityDays.length > 0) {
    const highDaysStr =
      highActivityDays.length > 1
        ? `${highActivityDays.slice(0, -1).join(", ")} 및 ${highActivityDays.slice(-1)}`
        : highActivityDays[0]
    const lowDaysSample = lowActivityDays.slice(0, 2)
    const lowDaysStr =
      lowDaysSample.length > 1
        ? lowDaysSample.join(" 및 ")
        : lowDaysSample[0]
    patternMessage = `${highDaysStr}에 기록이 많고, ${lowDaysStr}에는 기록이 적어요.`
  } else if (recordedDays > 0) {
    patternMessage = "꾸준한 패턴이 만들어지고 있어요. 계속 이어가 보세요!"
  } else {
    patternMessage = "기록을 시작하면 패턴을 분석해 드릴 수 있어요."
  }

  return (
    <div className="rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
          <Brain className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">AI 분석</h3>
          <p className="text-xs text-muted-foreground">기록을 바탕으로 인사이트를 정리했어요</p>
        </div>
      </div>

      <div className="space-y-3">
        {/* Summary */}
        <div className="flex items-start gap-3 rounded-lg bg-background/50 p-3">
          <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">요약</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              지난 {daysPassed}일 중 {recordedDays}일을 기록했어요. (달성률 {completionRate}%)
            </p>
          </div>
        </div>

        {/* Pattern */}
        <div className="flex items-start gap-3 rounded-lg bg-background/50 p-3">
          <TrendingUp className="mt-0.5 h-4 w-4 text-foreground shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">패턴</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {patternMessage}
            </p>
          </div>
        </div>

        {/* Reminder */}
        {recentMissing.length > 0 && (
          <div className="flex items-start gap-3 rounded-lg bg-background/50 p-3">
            <AlertCircle className="mt-0.5 h-4 w-4 text-foreground/70 shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">리마인드</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {recentMissing.length === 1 
                  ? `${formatDate(recentMissing[0])} 기록이 비어 있어요.`
                  : `${recentMissing.map(formatDate).join(", ")} 기록이 비어 있어요.`
                }
              </p>
            </div>
          </div>
        )}

        {/* Encouragement when no missing */}
        {recentMissing.length === 0 && recordedDays > 0 && (
          <div className="flex items-start gap-3 rounded-lg bg-background/50 p-3">
            <AlertCircle className="mt-0.5 h-4 w-4 text-primary shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">잘하고 있어요!</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {"최근 기록이 모두 채워져 있어요. 이 흐름 그대로 이어가 봐요!"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("ko-KR", { month: "short", day: "numeric" })
}
