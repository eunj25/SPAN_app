import type { Memo } from "@/lib/store"

/** 메모에 연결된 이미지 URL 목록 (최대 5장 저장 기준) */
export function getMemoImages(memo: Memo): string[] {
  if (memo.imageUrls && memo.imageUrls.length > 0) {
    return memo.imageUrls
  }
  if (memo.imageUrl) {
    return [memo.imageUrl]
  }
  return []
}

export function getMemoPrimaryImage(memo: Memo): string | null {
  const urls = getMemoImages(memo)
  return urls[0] ?? null
}
