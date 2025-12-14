"use client"

import type React from "react"

import { useState } from "react"
import { Search, Filter, SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter, useSearchParams } from "next/navigation"
import { useLanguage } from "@/lib/contexts/language-context"

export function SearchPanel() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const { t, language } = useLanguage()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (searchQuery) {
      params.set("q", searchQuery)
    } else {
      params.delete("q")
    }
    router.push(`/?${params.toString()}`)
  }

  const clearSearch = () => {
    setSearchQuery("")
    router.push("/")
  }

  return (
    <div className="neon-card p-4 md:p-6 rounded-lg space-y-4" dir={language === "ar" ? "rtl" : "ltr"}>
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search
            className={`absolute ${language === "ar" ? "right-3 md:right-4" : "left-3 md:left-4"} top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted`}
          />
          <Input
            type="text"
            placeholder={t(
              "ابحث في البيانات العربية... (العنوان، المحتوى، الوسوم)",
              "Search in data... (Title, Content, Tags)",
            )}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`${language === "ar" ? "pr-11 md:pr-12" : "pl-11 md:pl-12"} bg-surface border-border-subtle text-foreground placeholder:text-foreground-subtle focus:border-primary focus:ring-2 focus:ring-primary/20 text-base`}
            dir={language === "ar" ? "rtl" : "ltr"}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className={`absolute ${language === "ar" ? "left-3 md:left-4" : "right-3 md:right-4"} top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground`}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex gap-2 sm:gap-3">
          <Button
            type="submit"
            className="flex-1 sm:flex-none bg-primary hover:bg-primary-dark text-white px-6 md:px-8 neon-border"
          >
            <Search className={`w-5 h-5 ${language === "ar" ? "ml-2" : "mr-2"}`} />
            {t("بحث", "Search")}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex-1 sm:flex-none border-border-subtle hover:bg-surface-hover hover:border-primary"
          >
            <SlidersHorizontal className={`w-5 h-5 ${language === "ar" ? "ml-2" : "mr-2"}`} />
            <span className="hidden sm:inline">{t("فلترة", "Filter")}</span>
          </Button>
        </div>
      </form>

      {showFilters && (
        <div className="pt-4 border-t border-border-subtle">
          <FilterOptions />
        </div>
      )}
    </div>
  )
}

function FilterOptions() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [category, setCategory] = useState(searchParams.get("category") || "")
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "created_at")
  const [sortOrder, setSortOrder] = useState(searchParams.get("order") || "desc")
  const { t, language } = useLanguage()

  const categories = [
    { value: "", label: t("جميع الفئات", "All Categories") },
    { value: "technology", label: t("تقنية", "Technology") },
    { value: "science", label: t("علوم", "Science") },
    { value: "literature", label: t("أدب", "Literature") },
    { value: "history", label: t("تاريخ", "History") },
    { value: "education", label: t("تعليم", "Education") },
    { value: "business", label: t("أعمال", "Business") },
  ]

  const sortOptions = [
    { value: "created_at", label: t("تاريخ الإنشاء", "Created Date") },
    { value: "title", label: t("العنوان", "Title") },
    { value: "views", label: t("المشاهدات", "Views") },
  ]

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())

    if (category) {
      params.set("category", category)
    } else {
      params.delete("category")
    }

    params.set("sort", sortBy)
    params.set("order", sortOrder)

    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium text-foreground-muted mb-2">{t("الفئة", "Category")}</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-surface border border-border-subtle text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          dir={language === "ar" ? "rtl" : "ltr"}
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground-muted mb-2">{t("الترتيب حسب", "Sort By")}</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-surface border border-border-subtle text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          dir={language === "ar" ? "rtl" : "ltr"}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground-muted mb-2">{t("الترتيب", "Order")}</label>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-surface border border-border-subtle text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          dir={language === "ar" ? "rtl" : "ltr"}
        >
          <option value="desc">{t("تنازلي", "Descending")}</option>
          <option value="asc">{t("تصاعدي", "Ascending")}</option>
        </select>
      </div>

      <div className="md:col-span-3">
        <Button onClick={applyFilters} className="w-full bg-secondary hover:bg-secondary/90 text-white neon-border">
          <Filter className={`w-5 h-5 ${language === "ar" ? "ml-2" : "mr-2"}`} />
          {t("تطبيق الفلاتر", "Apply Filters")}
        </Button>
      </div>
    </div>
  )
}
