"use client"

import type { ArabicData } from "@/lib/types"
import { X, Calendar, Eye, Tag, User, Share2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DataModalProps {
  data: ArabicData
  isOpen: boolean
  onClose: () => void
}

export function DataModal({ data, isOpen, onClose }: DataModalProps) {
  if (!isOpen) return null

  const categoryLabels: Record<string, string> = {
    technology: "تقنية",
    science: "علوم",
    literature: "أدب",
    history: "تاريخ",
    education: "تعليم",
    business: "أعمال",
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: data.title,
        text: data.content,
        url: window.location.href,
      })
    }
  }

  const handleDownload = () => {
    const content = `العنوان: ${data.title}\n\nالمحتوى:\n${data.content}\n\nالفئة: ${categoryLabels[data.category]}\n\nالوسوم: ${data.tags.join(", ")}`
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${data.title}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="neon-card max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-lg p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6">
          <h2 className="text-3xl font-bold text-foreground flex-1 pl-4" dir="rtl">
            {data.title}
          </h2>
          <button onClick={onClose} className="text-foreground-muted hover:text-foreground transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-wrap gap-4 mb-6 text-sm text-foreground-muted">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{new Date(data.created_at).toLocaleDateString("ar-EG", { dateStyle: "long" })}</span>
          </div>

          {data.metadata?.author && (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{data.metadata.author}</span>
            </div>
          )}

          {data.metadata?.views && (
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{data.metadata.views} مشاهدة</span>
            </div>
          )}

          <div className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold">
            {categoryLabels[data.category]}
          </div>
        </div>

        <div className="prose prose-invert max-w-none mb-6">
          <p className="text-foreground-muted leading-relaxed whitespace-pre-wrap" dir="rtl">
            {data.content}
          </p>
        </div>

        {data.tags && data.tags.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-foreground-muted mb-3 flex items-center gap-2" dir="rtl">
              <Tag className="w-4 h-4" />
              الوسوم
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full bg-surface-hover text-foreground-subtle text-sm border border-border-subtle"
                  dir="rtl"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-6 border-t border-border-subtle">
          <Button
            onClick={handleShare}
            variant="outline"
            className="flex-1 border-border-subtle hover:bg-surface-hover hover:border-primary bg-transparent"
          >
            <Share2 className="w-4 h-4 ml-2" />
            مشاركة
          </Button>

          <Button onClick={handleDownload} className="flex-1 bg-primary hover:bg-primary-dark text-white neon-border">
            <Download className="w-4 h-4 ml-2" />
            تحميل
          </Button>
        </div>
      </div>
    </div>
  )
}
