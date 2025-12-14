"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

function sanitizeFileName(fileName: string): string {
  // Extract extension
  const lastDotIndex = fileName.lastIndexOf(".")
  const extension = lastDotIndex !== -1 ? fileName.slice(lastDotIndex) : ""
  const nameWithoutExt = lastDotIndex !== -1 ? fileName.slice(0, lastDotIndex) : fileName

  // Replace non-ASCII characters with underscores and remove special chars
  const sanitized = nameWithoutExt
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^\x00-\x7F]/g, "_") // Replace non-ASCII with underscore
    .replace(/[^a-zA-Z0-9_-]/g, "_") // Replace special chars with underscore
    .replace(/_+/g, "_") // Replace multiple underscores with single
    .replace(/^_|_$/g, "") // Remove leading/trailing underscores

  return sanitized + extension
}

export async function uploadFile(formData: FormData) {
  try {
    const supabase = await createClient()
    const file = formData.get("file") as File

    if (!file) {
      return { success: false, error: "لم يتم اختيار ملف" }
    }

    const timestamp = Date.now()
    const sanitizedName = sanitizeFileName(file.name)
    const storageFileName = `${timestamp}_${sanitizedName}`

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("arabic-files")
      .upload(storageFileName, file)

    if (uploadError) {
      console.error("[v0] Upload error:", uploadError)
      return { success: false, error: "فشل رفع الملف" }
    }

    // Extract text content (basic implementation for text files)
    let extractedText = ""
    if (file.type.includes("text") || file.type.includes("plain")) {
      extractedText = await file.text()
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from("arabic-files").getPublicUrl(storageFileName)

    const { error: dbError } = await supabase.from("file_uploads").insert({
      file_name: file.name, // Original name with Arabic characters
      file_size: file.size,
      file_type: file.type,
      storage_path: uploadData.path,
      extracted_text: extractedText || null,
      metadata: {
        original_name: file.name,
        sanitized_name: sanitizedName,
        uploaded_at: new Date().toISOString(),
        public_url: urlData.publicUrl,
      },
    })

    if (dbError) {
      console.error("[v0] Database error:", dbError)
      return { success: false, error: "فشل حفظ بيانات الملف" }
    }

    revalidatePath("/files")
    return { success: true }
  } catch (error) {
    console.error("[v0] File upload error:", error)
    return { success: false, error: "حدث خطأ غير متوقع" }
  }
}

export async function searchFiles(query: string) {
  try {
    const supabase = await createClient()

    // Search in file names and extracted text
    const { data, error } = await supabase
      .from("file_uploads")
      .select("*")
      .or(`file_name.ilike.%${query}%,extracted_text.ilike.%${query}%`)
      .order("created_at", { ascending: false })
      .limit(20)

    if (error) {
      console.error("[v0] Search error:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("[v0] File search error:", error)
    return []
  }
}

export async function deleteFile(id: string) {
  try {
    const supabase = await createClient()

    // Get file info
    const { data: fileData } = await supabase.from("file_uploads").select("storage_path").eq("id", id).single()

    if (fileData?.storage_path) {
      // Delete from storage
      await supabase.storage.from("arabic-files").remove([fileData.storage_path])
    }

    // Delete from database
    const { error } = await supabase.from("file_uploads").delete().eq("id", id)

    if (error) {
      console.error("[v0] Delete error:", error)
      throw new Error("فشل حذف الملف")
    }

    revalidatePath("/files")
    return { success: true }
  } catch (error) {
    console.error("[v0] File delete error:", error)
    throw error
  }
}
