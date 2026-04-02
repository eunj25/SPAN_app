"use client"

import { useEffect, useState, useRef } from "react"
import { Camera, Calendar, X, ImagePlus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type ChecklistItemDraft = { id: string; text: string; checked: boolean }

interface MemoFormProps {
  onSubmit: (data: {
    text: string
    date: string
    imageUrl: string
    checklist: { id: string; text: string; checked: boolean }[]
  }) => void
  onCancel: () => void
  projectStartDate: string
  projectEndDate: string
  initialData?: {
    text: string
    date: string
    imageUrl: string
    checklist?: { id: string; text: string; checked: boolean }[]
  }
  title?: string
  submitLabel?: string
}

export function MemoForm({
  onSubmit,
  onCancel,
  projectStartDate,
  projectEndDate,
  initialData,
  title = "하루 메모",
  submitLabel = "오늘 하루 저장하기",
}: MemoFormProps) {
  const [text, setText] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [imageUrl, setImageUrl] = useState("")
  const [previewUrl, setPreviewUrl] = useState("")
  const [checklist, setChecklist] = useState<ChecklistItemDraft[]>([
    { id: "c1", text: "", checked: false },
    { id: "c2", text: "", checked: false },
  ])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sampleImages = [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80",
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80",
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80"
  ]

  useEffect(() => {
    if (!initialData) return

    setText(initialData.text ?? "")
    setDate(initialData.date ?? new Date().toISOString().split("T")[0])
    setImageUrl(initialData.imageUrl ?? "")
    setPreviewUrl(initialData.imageUrl ?? "")

    const normalized = (initialData.checklist ?? [])
      .map(item => ({
        id: item.id,
        text: item.text ?? "",
        checked: Boolean(item.checked),
      }))
      .slice(0, 5)

    const padded =
      normalized.length >= 2
        ? normalized
        : [...normalized, ...Array.from({ length: 2 - normalized.length }).map((_, i) => ({
            id: `c${Date.now()}-${i}`,
            text: "",
            checked: false,
          }))]

    setChecklist(padded)
  }, [initialData])

  const handleImageSelect = (url: string) => {
    setImageUrl(url)
    setPreviewUrl(url)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setPreviewUrl(result)
        setImageUrl(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = () => {
    if (text && date && imageUrl) {
      const normalizedChecklist = checklist
        .map(item => ({ ...item, text: item.text.trim() }))
        .filter(item => item.text.length > 0)

      onSubmit({ text, date, imageUrl, checklist: normalizedChecklist })
    }
  }

  const isValid = text.trim() && date && imageUrl

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-4 py-3">
        <button
          onClick={onCancel}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold">{title}</h1>
        <Button
          onClick={handleSubmit}
          disabled={!isValid}
          size="sm"
          className="rounded-full"
        >
          {submitLabel}
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-6">
        {/* Image Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Camera className="h-4 w-4 text-primary" />
            사진
          </label>
          
          {previewUrl ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-xl">
              <img
                src={previewUrl}
                alt="미리보기"
                className="h-full w-full object-cover"
              />
              <button
                onClick={() => {
                  setPreviewUrl("")
                  setImageUrl("")
                }}
                className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border py-8 transition-colors hover:border-primary hover:bg-primary/5"
              >
                <ImagePlus className="h-6 w-6 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">사진 업로드</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">또는 샘플에서 선택</span>
                <div className="h-px flex-1 bg-border" />
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {sampleImages.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => handleImageSelect(url)}
                    className={cn(
                      "aspect-square overflow-hidden rounded-lg transition-all",
                      imageUrl === url && "ring-2 ring-primary"
                    )}
                  >
                    <img
                      src={url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Date Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            날짜
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={projectStartDate}
            max={projectEndDate}
            className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Text Memo */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            메모
          </label>
          <Textarea
            placeholder="오늘 하루를 기록해 보세요..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[120px] resize-none rounded-xl border-border bg-secondary"
          />
        </div>

        {/* Checklist */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <label className="text-sm font-medium text-foreground">
              체크리스트
            </label>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                if (checklist.length >= 5) return
                setChecklist(prev => [...prev, { id: `c${Date.now()}`, text: "", checked: false }])
              }}
              disabled={checklist.length >= 5}
              className="rounded-full"
            >
              <Plus className="h-4 w-4 mr-1" />
              추가
            </Button>
          </div>

          <div className="space-y-2">
            {checklist.map((item, index) => (
              <div key={item.id} className="flex items-center gap-2">
                <span className="w-6 text-xs text-muted-foreground tabular-nums">
                  {index + 1}.
                </span>
                <input
                  value={item.text}
                  onChange={(e) => {
                    const next = e.target.value
                    setChecklist(prev => prev.map(it => it.id === item.id ? { ...it, text: next } : it))
                  }}
                  placeholder={`할 일 ${index + 1}`}
                  className="flex-1 rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => {
                    setChecklist(prev => {
                      if (prev.length <= 2) return prev
                      return prev.filter(it => it.id !== item.id)
                    })
                  }}
                  disabled={checklist.length <= 2}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                  aria-label="체크리스트 항목 삭제"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            *최대 5개까지 추가할 수 있어요.
          </p>
        </div>
      </div>
    </div>
  )
}
