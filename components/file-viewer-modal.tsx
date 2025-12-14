"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Download, FileText, Loader2 } from "lucide-react"
import { useLanguage } from "@/lib/contexts/language-context"
import { highlightText } from "@/lib/utils/text-highlighter"
import { ScrollArea } from "@/components/ui/scroll-area"

interface FileViewerModalProps {
  isOpen: boolean
  onClose: () => void
  file: {
    id: string
    file_name: string
    extracted_text: string | null
    file_type: string
    storage_path: string
    metadata: any
  } | null
  searchQuery?: string
}

export function FileViewerModal({ isOpen, onClose, file, searchQuery = "" }: FileViewerModalProps) {
  const { t, language } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [fileContent, setFileContent] = useState<string>("")

  useEffect(() => {
    if (file && isOpen) {
      loadFileContent()
    }
  }, [file, isOpen])

  const loadFileContent = async () => {
    if (!file) return

    setLoading(true)
    try {
      // If we already have extracted text, use it
      if (file.extracted_text) {
        setFileContent(file.extracted_text)
      } else if (file.metadata?.public_url) {
        // Try to fetch and display the file content
        const response = await fetch(file.metadata.public_url)
        const content = await response.text()
        setFileContent(content)
      } else {
        setFileContent(t("لا يمكن عرض محتوى هذا الملف", "Cannot display this file content"))
      }
    } catch (error) {
      console.error("[v0] Error loading file content:", error)
      setFileContent(t("حدث خطأ في تحميل الملف", "Error loading file"))
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (file?.metadata?.public_url) {
      window.open(file.metadata.public_url, "_blank")
    }
  }

  if (!file) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl h-[90vh] bg-surface border-border-subtle neon-border"
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        <DialogHeader>
          <div className="flex items-center justify-between gap-4">
            <DialogTitle className="text-xl md:text-2xl font-bold text-primary neon-glow flex items-center gap-3 flex-1">
              <FileText className="w-6 h-6" />
              <span className="truncate">{file.file_name}</span>
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDownload}
                className="text-secondary hover:text-secondary/80 hover:bg-secondary/10"
                title={t("تحميل الملف", "Download File")}
              >
                <Download className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-foreground-muted hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 mt-4 border border-border-subtle rounded-lg bg-background overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <ScrollArea className="h-full">
              <div className="p-6">
                {searchQuery ? (
                  <div
                    className="prose prose-invert max-w-none text-foreground whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: highlightText(fileContent, searchQuery) }}
                    dir={language === "ar" ? "rtl" : "ltr"}
                  />
                ) : (
                  <div
                    className="text-foreground whitespace-pre-wrap leading-relaxed"
                    dir={language === "ar" ? "rtl" : "ltr"}
                  >
                    {fileContent}
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </div>

        {searchQuery && (
          <div className="mt-3 p-3 bg-secondary/10 border border-secondary/30 rounded-lg">
            <p className="text-sm text-secondary">
              <span className="font-semibold">{t("البحث عن:", "Searching for:")}</span>{" "}
              <span className="bg-secondary/30 px-2 py-1 rounded">{searchQuery}</span>
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
