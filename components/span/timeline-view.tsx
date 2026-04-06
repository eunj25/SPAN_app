"use client"

import { Memo } from "@/lib/store"
import { getMemoPrimaryImage } from "@/lib/memo-images"
import Image from "next/image"

interface TimelineViewProps {
  memos: Memo[]
  onSelectMemo?: (memo: Memo) => void
}

export function TimelineView({ memos, onSelectMemo }: TimelineViewProps) {
  const sortedMemos = [...memos].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  if (sortedMemos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
          <span className="text-2xl">📷</span>
        </div>
        <p className="text-muted-foreground">아직 기록이 없어요</p>
        <p className="text-sm text-muted-foreground/70">오늘부터 한 줄씩 남겨 보세요</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {sortedMemos.map((memo, index) => {
        const cover = getMemoPrimaryImage(memo)
        return (
        <button
          key={memo.id}
          type="button"
          onClick={() => onSelectMemo?.(memo)}
          className="group w-full overflow-hidden rounded-xl bg-card text-left transition-all hover:ring-1 hover:ring-primary/30"
        >
          <div className="relative h-44 w-full overflow-hidden bg-muted">
            {cover ? (
            <Image
              src={cover}
              alt={`${memo.date} 기록`}
              fill
              unoptimized={cover.startsWith("data:")}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                사진 없음
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-background/80 px-3 py-1 backdrop-blur-sm">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-xs font-medium text-foreground">
                  {new Date(memo.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric"
                  })}
                </span>
              </div>
            </div>
          </div>
          <div className="p-4">
            <p className="text-sm leading-relaxed text-foreground/90">
              {memo.text}
            </p>
            <div className="mt-2 text-xs text-muted-foreground">
              {index + 1}일차
            </div>
          </div>
        </button>
        )
      })}
    </div>
  )
}
