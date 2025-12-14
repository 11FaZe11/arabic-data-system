"use client"

import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/contexts/language-context"

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
      className="border-border-subtle hover:border-primary transition-colors"
    >
      <Globe className="w-4 h-4" />
      <span className="mr-2">{language === "ar" ? "EN" : "ع"}</span>
    </Button>
  )
}
