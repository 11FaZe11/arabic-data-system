"use client"

import { Database, Sparkles, Upload } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/contexts/language-context"
import { LanguageToggle } from "@/components/language-toggle"

export function Header() {
  const { t, language } = useLanguage()

  return (
    <header className="border-b border-border-subtle bg-surface/50 backdrop-blur-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="relative flex-shrink-0">
              <Database className="w-8 h-8 md:w-10 md:h-10 text-primary" />
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-accent absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div className="text-center sm:text-right" dir={language === "ar" ? "rtl" : "ltr"}>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold neon-glow text-primary">
                {t("نظام استرجاع البيانات العربية", "Arabic Data Retrieval System")}
              </h1>
              <p className="text-xs md:text-sm text-foreground-muted mt-1 hidden sm:block">
                {t("نظام بحث متقدم مدعوم بالذكاء الاصطناعي", "Advanced AI-Powered Search System")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <Link href="/files">
              <Button className="bg-secondary hover:bg-secondary/80 text-white shadow-neon">
                <Upload className="w-4 h-4" />
                <span className={language === "ar" ? "mr-2" : "ml-2"}>{t("رفع الملفات", "Upload Files")}</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
