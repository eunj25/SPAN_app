"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export interface Memo {
  id: string
  date: string
  text: string
  imageUrl: string
  checklist?: { id: string; text: string; checked: boolean }[]
}

export interface Project {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  duration: string
  coverImage: string
  color: string
  memos: Memo[]
}

interface AppState {
  projects: Project[]
  currentProject: Project | null
  setCurrentProject: (project: Project | null) => void
  addMemo: (projectId: string, memo: Memo) => void
  updateMemo: (projectId: string, memoId: string, updates: Partial<Memo>) => void
  addProject: (project: Project) => void
}

const sampleProjects: Project[] = [
  {
    id: "1",
    title: "2-Week Workout",
    description: "근력과 지구력 향상하기",
    startDate: "2026-03-17",
    endDate: "2026-03-31",
    duration: "2 weeks",
    coverImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
    color: "bg-primary",
    memos: [
      {
        id: "m1",
        date: "2026-03-17",
        text: "1일차 - 아침 유산소 운동으로 시작. 에너지가 넘친다!",
        imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80"
      },
      {
        id: "m2",
        date: "2026-03-18",
        text: "오늘은 상체 집중 운동. 푸시업과 풀업을 했다.",
        imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c149a?w=800&q=80"
      },
      {
        id: "m3",
        date: "2026-03-19",
        text: "휴식일 - 가벼운 스트레칭과 요가를 했다.",
        imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80"
      },
      {
        id: "m4",
        date: "2026-03-21",
        text: "하체 운동 날! 스쿼트와 런지를 완료했다.",
        imageUrl: "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=800&q=80"
      },
      {
        id: "m5",
        date: "2026-03-24",
        text: "2주 차를 힘차게 시작. 전신 서킷 운동 진행.",
        imageUrl: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800&q=80"
      }
    ]
  },
  {
    id: "2",
    title: "1-Month Travel",
    description: "동남아시아 탐험하기",
    startDate: "2026-03-01",
    endDate: "2026-03-31",
    duration: "1 month",
    coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    color: "bg-foreground/80",
    memos: [
      {
        id: "m6",
        date: "2026-03-01",
        text: "방콕 도착! 길거리 음식이 정말 훌륭하다.",
        imageUrl: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80"
      },
      {
        id: "m7",
        date: "2026-03-05",
        text: "치앙마이에서 사원 투어. 평화로운 아침이었다.",
        imageUrl: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&q=80"
      },
      {
        id: "m8",
        date: "2026-03-10",
        text: "푸켓의 해변 분위기. 완벽한 노을이었다.",
        imageUrl: "https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=800&q=80"
      },
      {
        id: "m9",
        date: "2026-03-15",
        text: "오늘은 아일랜드 호핑 모험을 즐겼다!",
        imageUrl: "https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=800&q=80"
      }
    ]
  },
  {
    id: "3",
    title: "21-Day Reading",
    description: "매일 독서 습관 만들기",
    startDate: "2026-03-10",
    endDate: "2026-03-31",
    duration: "3 weeks",
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80",
    color: "bg-foreground/65",
    memos: [
      {
        id: "m10",
        date: "2026-03-10",
        text: "아토믹 해빗을 읽기 시작했다. 1일 차부터 통찰이 좋다.",
        imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80"
      },
      {
        id: "m11",
        date: "2026-03-12",
        text: "습관 쌓기 챕터를 읽었다. 내일부터 바로 실천할 예정!",
        imageUrl: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=800&q=80"
      }
    ]
  }
]

const AppContext = createContext<AppState | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(sampleProjects)
  const [currentProject, setCurrentProject] = useState<Project | null>(null)

  const addMemo = (projectId: string, memo: Memo) => {
    setProjects(prev =>
      prev.map(p =>
        p.id === projectId
          ? { ...p, memos: [...p.memos, memo] }
          : p
      )
    )
  }

  const updateMemo = (projectId: string, memoId: string, updates: Partial<Memo>) => {
    setProjects(prev =>
      prev.map(p =>
        p.id === projectId
          ? {
              ...p,
              memos: p.memos.map(m => (m.id === memoId ? { ...m, ...updates } : m)),
            }
          : p
      )
    )
  }

  const addProject = (project: Project) => {
    setProjects(prev => [...prev, project])
  }

  return (
    <AppContext.Provider value={{ projects, currentProject, setCurrentProject, addMemo, updateMemo, addProject }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within AppProvider")
  }
  return context
}
