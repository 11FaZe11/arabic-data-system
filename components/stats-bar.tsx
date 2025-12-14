"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { FileText, FolderOpen, Tag, TrendingUp } from "lucide-react"
import { useLanguage } from "@/lib/contexts/language-context"

export function StatsBar() {
  const { t } = useLanguage()
  const [stats, setStats] = useState({
    totalRecords: 0,
    categories: 0,
    tags: 0,
  })

  useEffect(() => {
    async function fetchStats() {
      const supabase = createClient()

      const { count: totalRecords } = await supabase.from("arabic_data").select("*", { count: "exact", head: true })

      const { data: categories } = await supabase.from("categories").select("*")

      const { data: recentData } = await supabase.from("arabic_data").select("tags").limit(100)

      const allTags = recentData?.flatMap((item) => item.tags || []) || []
      const uniqueTags = new Set(allTags)

      setStats({
        totalRecords: totalRecords || 0,
        categories: categories?.length || 0,
        tags: uniqueTags.size,
      })
    }

    fetchStats()
  }, [])

  const statsData = [
    {
      icon: FileText,
      label: t("إجمالي السجلات", "Total Records"),
      value: stats.totalRecords,
      color: "text-primary",
    },
    {
      icon: FolderOpen,
      label: t("الفئات", "Categories"),
      value: stats.categories,
      color: "text-secondary",
    },
    {
      icon: Tag,
      label: t("الوسوم", "Tags"),
      value: stats.tags,
      color: "text-accent",
    },
    {
      icon: TrendingUp,
      label: t("نشط", "Active"),
      value: t("متصل", "Online"),
      color: "text-success",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
      {statsData.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div
            key={index}
            className="neon-card p-4 md:p-6 rounded-lg hover:scale-105 transition-transform duration-300"
          >
            <div className="flex items-center gap-3 md:gap-4">
              <div className={`p-2 md:p-3 rounded-lg bg-surface-hover ${stat.color}`}>
                <Icon className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div>
                <p className="text-foreground-muted text-xs md:text-sm">{stat.label}</p>
                <p className="text-xl md:text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
