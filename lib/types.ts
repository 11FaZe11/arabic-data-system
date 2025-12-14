export interface ArabicData {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  metadata: {
    author?: string
    views?: number
    [key: string]: any
  }
  created_at: string
  updated_at: string
  user_id?: string
}

export interface Category {
  id: string
  name: string
  name_ar: string
  description: string | null
  icon: string | null
  created_at: string
}

export interface SearchFilters {
  query: string
  category: string
  tags: string[]
  sortBy: "created_at" | "title" | "views"
  sortOrder: "asc" | "desc"
}
