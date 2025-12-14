import { createClient } from "@/lib/supabase/server"
import { DataCard } from "@/components/data-card"
import { AlertCircle } from "lucide-react"

interface SearchParams {
  q?: string
  category?: string
  sort?: string
  order?: string
}

export async function DataDisplay() {
  const supabase = await createClient()

  // Get search params from URL (you'll need to pass these as props in production)
  const searchQuery = ""
  const category = ""
  const sortBy = "created_at"
  const sortOrder = "desc"

  let query = supabase.from("arabic_data").select("*")

  // Apply search filter
  if (searchQuery) {
    query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%,tags.cs.{${searchQuery}}`)
  }

  // Apply category filter
  if (category) {
    query = query.eq("category", category)
  }

  // Apply sorting
  query = query.order(sortBy as any, { ascending: sortOrder === "asc" })

  const { data, error } = await query

  if (error) {
    return (
      <div className="neon-card p-6 md:p-8 rounded-lg text-center">
        <AlertCircle className="w-10 h-10 md:w-12 md:h-12 text-error mx-auto mb-3 md:mb-4" />
        <p className="text-foreground-muted text-sm md:text-base">حدث خطأ أثناء تحميل البيانات</p>
        <p className="text-xs md:text-sm text-foreground-subtle mt-2">{error.message}</p>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="neon-card p-8 md:p-12 rounded-lg text-center">
        <div className="text-5xl md:text-6xl mb-3 md:mb-4">🔍</div>
        <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">لا توجد بيانات</h3>
        <p className="text-sm md:text-base text-foreground-muted">لم يتم العثور على أي سجلات مطابقة لمعايير البحث</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-foreground">النتائج ({data.length})</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {data.map((item) => (
          <DataCard key={item.id} data={item} />
        ))}
      </div>
    </div>
  )
}
