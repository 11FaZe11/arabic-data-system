"use client"

import type { ArabicData } from "@/lib/types"
import { Calendar, Eye, Tag, User } from "lucide-react"
import { useState } from "react"
import { DataModal } from "@/components/data-modal"

interface DataCardProps {
  data: ArabicData
}

export function DataCard({ data }: DataCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  const categoryColors: Record<string, string> = {
    technology: "bg-primary/20 text-primary border-primary/50",
    science: "bg-accent/20 text-accent border-accent/50",
    literature: "bg-secondary/20 text-secondary border-secondary/50",
    history: "bg-warning/20 text-warning border-warning/50",
    education: "bg-success/20 text-success border-success/50",
    business: "bg-info/20 text-info border-info/50",
  }

  const categoryLabels: Record<string, string> = {
    technology: "تقنية",
    science: "علوم",
    literature: "أدب",
    history: "تاريخ",
    education: "تعليم",
    business: "أعمال",
  }

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="neon-card p-4 md:p-6 rounded-lg cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] group active:scale-95"
      >
        <div className="flex items-start justify-between mb-3 md:mb-4">
          <div
            className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold border ${
              categoryColors[data.category] || categoryColors.technology
            }`}
          >
            {categoryLabels[data.category] || data.category}
          </div>

          {data.metadata?.views && (
            <div className="flex items-center gap-1 text-foreground-muted text-xs md:text-sm">
              <Eye className="w-3 h-3 md:w-4 md:h-4" />
              <span>{data.metadata.views}</span>
            </div>
          )}
        </div>

        <h3
          className="text-lg md:text-xl font-bold text-foreground mb-2 md:mb-3 line-clamp-2 group-hover:text-primary transition-colors"
          dir="rtl"
        >
          {data.title}
        </h3>

        <p className="text-foreground-muted text-sm mb-3 md:mb-4 line-clamp-3" dir="rtl">
          {data.content}
        </p>

        {data.tags && data.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3 md:mb-4">
            {data.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="flex items-center gap-1 px-2 py-0.5 md:py-1 rounded bg-surface-hover text-foreground-subtle text-xs border border-border-subtle"
                dir="rtl"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
            {data.tags.length > 3 && (
              <span className="px-2 py-0.5 md:py-1 text-xs text-foreground-muted">+{data.tags.length - 3}</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-foreground-subtle pt-3 md:pt-4 border-t border-border-subtle">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{new Date(data.created_at).toLocaleDateString("ar-EG")}</span>
          </div>

          {data.metadata?.author && (
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>{data.metadata.author}</span>
            </div>
          )}
        </div>
      </div>

      <DataModal data={data} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
