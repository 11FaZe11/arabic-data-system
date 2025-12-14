"use client"

import { Suspense } from "react"
import { FileUploadPanel } from "@/components/file-upload-panel"
import { Header } from "@/components/header"
import { LoadingSpinner } from "@/components/loading-spinner"
import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/contexts/language-context"

export default function FilesPage() {
  const { t, language } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      {/* Animated background effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10">
        <Header />

        <main className="container mx-auto px-4 py-6 md:py-8">
          <div className="mb-6">
            <Link href="/">
              <Button variant="ghost" className="text-foreground-muted hover:text-primary">
                {language === "ar" ? <ArrowLeft className="w-4 h-4 ml-2" /> : <ArrowRight className="w-4 h-4 mr-2" />}
                {t("العودة للرئيسية", "Back to Home")}
              </Button>
            </Link>
          </div>

          <Suspense fallback={<LoadingSpinner />}>
            <FileUploadPanel />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
