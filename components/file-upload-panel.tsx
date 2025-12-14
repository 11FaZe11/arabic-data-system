"use client"

import type React from "react"

import { useState } from "react"
import { Upload, File, X, Loader2, Search, FileText, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { uploadFile, searchFiles, deleteFile } from "@/lib/actions/file-actions"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { useLanguage } from "@/lib/contexts/language-context"
import { highlightText, extractContext } from "@/lib/utils/text-highlighter"
import { FileViewerModal } from "@/components/file-viewer-modal"

export function FileUploadPanel() {
  const [uploading, setUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)
  const [selectedFile, setSelectedFile] = useState<any | null>(null)
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const router = useRouter()
  const { t, language } = useLanguage()

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: t("خطأ", "Error"),
        description: t("حجم الملف كبير جداً. الحد الأقصى 10 ميجابايت", "File size too large. Maximum 10MB"),
        variant: "destructive",
      })
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const result = await uploadFile(formData)

      if (result.success) {
        toast({
          title: t("تم الرفع بنجاح", "Upload Successful"),
          description: t("تم رفع الملف وفهرسته للبحث", "File uploaded and indexed for search"),
        })
        router.refresh()
        e.target.value = ""
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: t("خطأ في الرفع", "Upload Error"),
        description: error instanceof Error ? error.message : t("فشل رفع الملف", "Failed to upload file"),
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setSearching(true)
    try {
      const results = await searchFiles(searchQuery)
      setSearchResults(results)
    } catch (error) {
      toast({
        title: t("خطأ في البحث", "Search Error"),
        description: t("فشل البحث في الملفات", "Failed to search files"),
        variant: "destructive",
      })
    } finally {
      setSearching(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteFile(id)
      toast({
        title: t("تم الحذف", "Deleted"),
        description: t("تم حذف الملف بنجاح", "File deleted successfully"),
      })
      setSearchResults(searchResults.filter((r) => r.id !== id))
      router.refresh()
    } catch (error) {
      toast({
        title: t("خطأ", "Error"),
        description: t("فشل حذف الملف", "Failed to delete file"),
        variant: "destructive",
      })
    }
  }

  const handleViewFile = (file: any) => {
    setSelectedFile(file)
    setIsViewerOpen(true)
  }

  return (
    <div className="space-y-6" dir={language === "ar" ? "rtl" : "ltr"}>
      {/* Upload Section */}
      <Card className="p-4 md:p-6 bg-surface border-border-subtle neon-border">
        <h2 className="text-xl md:text-2xl font-bold text-primary neon-glow mb-4">
          {t("رفع الملفات", "Upload Files")}
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
          <label className="flex-1 cursor-pointer">
            <div className="flex items-center justify-center gap-2 px-4 py-3 md:py-4 bg-primary/10 hover:bg-primary/20 border-2 border-primary rounded-lg transition-all hover:shadow-neon">
              {uploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  <span className="text-primary font-medium">{t("جاري الرفع...", "Uploading...")}</span>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 text-primary" />
                  <span className="text-primary font-medium">{t("اختر ملف للرفع", "Choose File to Upload")}</span>
                </>
              )}
            </div>
            <input
              type="file"
              className="hidden"
              accept=".txt,.pdf,.doc,.docx"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>
        </div>
        <p className="text-sm text-foreground-muted mt-3 text-center sm:text-right">
          {t(
            "الملفات المدعومة: PDF, TXT, DOC, DOCX (حد أقصى: 10 ميجابايت)",
            "Supported files: PDF, TXT, DOC, DOCX (Max: 10MB)",
          )}
        </p>
      </Card>

      {/* Search Section */}
      <Card className="p-4 md:p-6 bg-surface border-border-subtle neon-border">
        <h2 className="text-xl md:text-2xl font-bold text-secondary neon-glow mb-4">
          {t("البحث في الملفات", "Search Files")}
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder={t("ابحث في محتوى الملفات...", "Search file contents...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 bg-background border-border-subtle text-foreground text-base"
            dir={language === "ar" ? "rtl" : "ltr"}
          />
          <Button
            onClick={handleSearch}
            disabled={searching || !searchQuery.trim()}
            className="bg-secondary hover:bg-secondary/80 text-white shadow-neon w-full sm:w-auto"
          >
            {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span className={language === "ar" ? "mr-2" : "ml-2"}>{t("بحث", "Search")}</span>
          </Button>
        </div>
      </Card>

      {/* Search Results with Highlighting */}
      {searchResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg md:text-xl font-bold text-accent">
            {t(`نتائج البحث (${searchResults.length})`, `Search Results (${searchResults.length})`)}
          </h3>
          <div className="grid gap-4">
            {searchResults.map((result) => {
              const contexts = result.extracted_text ? extractContext(result.extracted_text, searchQuery, 80) : []

              return (
                <Card
                  key={result.id}
                  className="p-4 md:p-5 bg-surface border-border-subtle hover:border-accent transition-all hover:shadow-neon"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        {result.file_type?.includes("pdf") ? (
                          <FileText className="w-5 h-5 text-primary" />
                        ) : (
                          <File className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4
                          className="text-base md:text-lg font-semibold text-foreground"
                          dangerouslySetInnerHTML={{ __html: highlightText(result.file_name, searchQuery) }}
                        />
                        {contexts.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {contexts.map((context, idx) => (
                              <p
                                key={idx}
                                className="text-sm text-foreground-muted bg-background/50 p-2 rounded border border-border-subtle"
                                dangerouslySetInnerHTML={{ __html: highlightText(context, searchQuery) }}
                              />
                            ))}
                          </div>
                        )}
                        <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-foreground-muted">
                          <span>{(result.file_size / 1024).toFixed(1)} KB</span>
                          <span>•</span>
                          <span>{new Date(result.created_at).toLocaleDateString(language === "ar" ? "ar" : "en")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-start">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewFile(result)}
                        className="text-primary hover:text-primary/80 hover:bg-primary/10"
                      >
                        <Eye className="w-4 h-4" />
                        <span className={`${language === "ar" ? "mr-1" : "ml-1"} hidden sm:inline`}>
                          {t("عرض", "View")}
                        </span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(result.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {searchQuery && !searching && searchResults.length === 0 && (
        <Card className="p-8 bg-surface border-border-subtle text-center">
          <p className="text-foreground-muted">{t("لم يتم العثور على نتائج", "No results found")}</p>
        </Card>
      )}

      {/* File Viewer Modal */}
      <FileViewerModal
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        file={selectedFile}
        searchQuery={searchQuery}
      />
    </div>
  )
}
