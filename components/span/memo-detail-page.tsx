"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { ArrowLeft, Pencil, CheckSquare, Square } from "lucide-react"
import { Memo } from "@/lib/store"
import { getMemoImages } from "@/lib/memo-images"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { MemoForm } from "./memo-form"

interface MemoDetailPageProps {
  memo: Memo
  projectStartDate: string
  projectEndDate: string
  onClose: () => void
  onUpdate: (updates: Partial<Memo>) => void
}

export function MemoDetailPage({
  memo,
  projectStartDate,
  projectEndDate,
  onClose,
  onUpdate,
}: MemoDetailPageProps) {
  const [isEditing, setIsEditing] = useState(false)

  const checklist = useMemo(() => memo.checklist ?? [], [memo.checklist])
  const galleryImages = useMemo(() => getMemoImages(memo), [memo])

  if (isEditing) {
    return (
      <MemoForm
        title="메모 수정"
        submitLabel="수정 완료"
        initialData={{
          text: memo.text,
          date: memo.date,
          imageUrl: memo.imageUrl,
          imageUrls: memo.imageUrls,
          checklist: memo.checklist ?? [],
        }}
        projectStartDate={projectStartDate}
        projectEndDate={projectEndDate}
        onCancel={() => setIsEditing(false)}
        onSubmit={(data) => {
          onUpdate({
            text: data.text,
            date: data.date,
            imageUrl: data.imageUrl,
            imageUrls: data.imageUrls.length > 0 ? data.imageUrls : undefined,
            checklist: data.checklist,
          })
          setIsEditing(false)
        }}
      />
    )
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-4 py-3">
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary transition-colors"
          aria-label="뒤로가기"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold">메모 상세</h1>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="rounded-full"
          onClick={() => setIsEditing(true)}
        >
          <Pencil className="h-4 w-4 mr-1" />
          수정
        </Button>
      </div>

      <main className="flex-1 space-y-6 overflow-auto p-4">
        {galleryImages.length > 0 ? (
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {galleryImages.map((src, i) => (
              <div
                key={`${memo.id}-img-${i}`}
                className="relative h-52 w-full min-w-[85%] shrink-0 overflow-hidden rounded-xl bg-secondary sm:min-w-[70%]"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  unoptimized={src.startsWith("data:")}
                  className="object-cover"
                  sizes="(max-width: 768px) 85vw, 360px"
                />
                {i === 0 && (
                  <div className="absolute left-3 top-3 rounded-full bg-background/80 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
                    {new Date(memo.date).toLocaleDateString("ko-KR", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              {new Date(memo.date).toLocaleDateString("ko-KR", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </p>
            <div className="flex h-52 w-full items-center justify-center rounded-xl border border-dashed border-border bg-muted/40 text-sm text-muted-foreground">
              등록된 사진이 없어요
            </div>
          </div>
        )}

        <div className="rounded-xl bg-card p-4">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
            {memo.text}
          </p>
        </div>

        {checklist.length > 0 && (
          <div className="rounded-xl bg-card p-4">
            <div className="mb-3 text-sm font-semibold text-foreground">체크리스트</div>
            <div className="space-y-2">
              {checklist.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onUpdate({
                      checklist: checklist.map(ci =>
                        ci.id === item.id ? { ...ci, checked: !ci.checked } : ci
                      ),
                    })
                  }}
                  className={cn(
                    "flex w-full items-start gap-2 rounded-lg px-2 py-2 text-left transition-colors hover:bg-secondary",
                  )}
                >
                  {item.checked ? (
                    <CheckSquare className="mt-0.5 h-4 w-4 text-foreground" />
                  ) : (
                    <Square className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  )}
                  <span className={cn("text-sm", item.checked ? "text-foreground line-through opacity-80" : "text-foreground")}>
                    {item.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

