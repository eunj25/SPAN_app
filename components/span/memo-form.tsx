"use client"

import { useEffect, useState, useRef } from "react"
import { Camera, Calendar, X, ImagePlus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const MAX_PHOTOS = 5

type ChecklistItemDraft = { id: string; text: string; checked: boolean }

export type MemoFormSubmitData = {
  text: string
  date: string
  imageUrl: string
  imageUrls: string[]
  checklist: { id: string; text: string; checked: boolean }[]
}

interface MemoFormProps {
  onSubmit: (data: MemoFormSubmitData) => void
  onCancel: () => void
  projectStartDate: string
  projectEndDate: string
  initialData?: {
    text: string
    date: string
    imageUrl: string
    imageUrls?: string[]
    checklist?: { id: string; text: string; checked: boolean }[]
  }
  title?: string
  submitLabel?: string
}

function isDateInProjectRange(date: string, start: string, end: string): boolean {
  if (!date) return false
  return date >= start && date <= end
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
  const [photos, setPhotos] = useState<string[]>([])
  const [checklist, setChecklist] = useState<ChecklistItemDraft[]>([
    { id: "c1", text: "", checked: false },
    { id: "c2", text: "", checked: false },
  ])
  const [errors, setErrors] = useState<{ text?: string; date?: string }>({})
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

    const initialPhotos =
      initialData.imageUrls && initialData.imageUrls.length > 0
        ? initialData.imageUrls.slice(0, MAX_PHOTOS)
        : initialData.imageUrl
          ? [initialData.imageUrl]
          : []
    setPhotos(initialPhotos)

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

  const addPhotos = (urls: string[]) => {
    setPhotos(prev => [...prev, ...urls].slice(0, MAX_PHOTOS))
  }

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    e.target.value = ""
    if (files.length === 0) return

    const remaining = MAX_PHOTOS - photos.length
    if (remaining <= 0) return

    const toRead = files.slice(0, remaining)
    void Promise.all(
      toRead.map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result as string)
            reader.onerror = () => reject(reader.error)
            reader.readAsDataURL(file)
          })
      )
    )
      .then((urls) => {
        setPhotos(prev => [...prev, ...urls].slice(0, MAX_PHOTOS))
      })
      .catch(() => {})
  }

  const handleSamplePick = (url: string) => {
    if (photos.length >= MAX_PHOTOS) return
    if (photos.includes(url)) return
    addPhotos([url])
  }

  const validate = (): boolean => {
    const next: { text?: string; date?: string } = {}
    const trimmed = text.trim()
    if (!trimmed) {
      next.text = "메모를 입력해 주세요."
    }
    if (!date) {
      next.date = "날짜를 선택해 주세요."
    } else if (!isDateInProjectRange(date, projectStartDate, projectEndDate)) {
      next.date = "프로젝트 기간 안의 날짜를 선택해 주세요."
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return

    const trimmed = text.trim()
    const normalizedChecklist = checklist
      .map(item => ({ ...item, text: item.text.trim() }))
      .filter(item => item.text.length > 0)

    const urls = photos.slice(0, MAX_PHOTOS)

    onSubmit({
      text: trimmed,
      date,
      imageUrl: urls[0] ?? "",
      imageUrls: urls,
      checklist: normalizedChecklist,
    })
  }

  const dateOk = date && isDateInProjectRange(date, projectStartDate, projectEndDate)
  const isValid = Boolean(text.trim() && dateOk)

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-4 py-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold">{title}</h1>
        <div className="h-10 w-10" />
      </div>

      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-6 pb-10">
        <div className="space-y-6">
          {/* Photos — optional, max 5 */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Camera className="h-4 w-4 text-primary" />
              사진
              <span className="text-xs font-normal text-muted-foreground">(선택, 최대 {MAX_PHOTOS}장)</span>
            </label>

            {photos.length > 0 && (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {photos.map((url, index) => (
                  <div key={`${url.slice(0, 32)}-${index}`} className="relative aspect-square overflow-hidden rounded-lg bg-secondary">
                    <img src={url} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm hover:bg-background"
                      aria-label="사진 삭제"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {photos.length < MAX_PHOTOS && (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border py-6 transition-colors hover:border-primary hover:bg-primary/5"
                >
                  <ImagePlus className="h-6 w-6 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">사진 업로드 ({photos.length}/{MAX_PHOTOS})</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
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
                      type="button"
                      key={index}
                      onClick={() => handleSamplePick(url)}
                      disabled={photos.length >= MAX_PHOTOS || photos.includes(url)}
                      className={cn(
                        "aspect-square overflow-hidden rounded-lg transition-all",
                        photos.includes(url) && "ring-2 ring-primary opacity-70"
                      )}
                    >
                      <img src={url} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Date — required */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Calendar className="h-4 w-4 text-primary" />
              날짜 <span className="text-destructive">*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value)
                if (errors.date) setErrors(prev => ({ ...prev, date: undefined }))
              }}
              min={projectStartDate}
              max={projectEndDate}
              className={cn(
                "w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary",
                errors.date && "border-destructive ring-1 ring-destructive/30"
              )}
            />
            {errors.date && (
              <p className="text-xs text-destructive">{errors.date}</p>
            )}
          </div>

          {/* Memo — required */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              메모 <span className="text-destructive">*</span>
            </label>
            <Textarea
              placeholder="오늘 하루를 기록해 보세요..."
              value={text}
              onChange={(e) => {
                setText(e.target.value)
                if (errors.text) setErrors(prev => ({ ...prev, text: undefined }))
              }}
              className={cn(
                "min-h-[120px] resize-none rounded-xl border-border bg-secondary",
                errors.text && "border-destructive ring-1 ring-destructive/30"
              )}
            />
            {errors.text && (
              <p className="text-xs text-destructive">{errors.text}</p>
            )}
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
                <Plus className="mr-1 h-4 w-4" />
                추가
              </Button>
            </div>

            <div className="space-y-2">
              {checklist.map((item, index) => (
                <div key={item.id} className="flex items-center gap-2">
                  <span className="w-6 tabular-nums text-xs text-muted-foreground">
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
                    className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-50 disabled:hover:bg-transparent"
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

        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!isValid}
          className={cn(
            "mt-8 w-full rounded-xl py-3 text-sm font-medium",
            !isValid && "opacity-50"
          )}
        >
          {submitLabel}
        </Button>
      </div>
    </div>
  )
}
