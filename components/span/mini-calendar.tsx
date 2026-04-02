"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface MiniCalendarProps {
  activeDates?: string[]
}

export function MiniCalendar({ activeDates = [] }: MiniCalendarProps) {
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

  const isActiveDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return activeDates.includes(dateStr)
  }

  const isToday = (day: number) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    )
  }

  const days = []
  for (let i = 0; i < startingDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-8 w-8" />)
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const active = isActiveDate(day)
    const today = isToday(day)
    days.push(
      <div
        key={day}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors",
          active && "bg-primary text-primary-foreground font-medium",
          today && !active && "ring-1 ring-primary",
          !active && !today && "text-muted-foreground hover:bg-secondary"
        )}
      >
        {day}
      </div>
    )
  }

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
      <div className="grid grid-cols-7 gap-1">
        {dayNames.map((day, i) => (
          <div
            key={i}
            className="flex h-8 w-8 items-center justify-center text-xs text-muted-foreground font-medium"
          >
            {day}
          </div>
        ))}
        {days}
      </div>
    </div>
  )
}
