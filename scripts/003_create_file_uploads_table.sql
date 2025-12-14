-- Create file uploads table for storing uploaded files and their metadata
CREATE TABLE IF NOT EXISTS public.file_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  extracted_text TEXT,
  metadata JSONB DEFAULT '{}',
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for full-text search on extracted text
CREATE INDEX IF NOT EXISTS idx_file_uploads_search 
ON public.file_uploads 
USING gin(to_tsvector('arabic', coalesce(extracted_text, '') || ' ' || coalesce(file_name, '')));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_file_uploads_user_id ON public.file_uploads(user_id);
CREATE INDEX IF NOT EXISTS idx_file_uploads_category ON public.file_uploads(category);
CREATE INDEX IF NOT EXISTS idx_file_uploads_created_at ON public.file_uploads(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.file_uploads ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY file_uploads_select_all ON public.file_uploads
  FOR SELECT USING (true);

CREATE POLICY file_uploads_insert_own ON public.file_uploads
  FOR INSERT WITH CHECK (true);

CREATE POLICY file_uploads_update_own ON public.file_uploads
  FOR UPDATE USING (true);

CREATE POLICY file_uploads_delete_own ON public.file_uploads
  FOR DELETE USING (true);

-- Create storage bucket for files
INSERT INTO storage.buckets (id, name, public)
VALUES ('arabic-files', 'arabic-files', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Anyone can upload files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'arabic-files');

CREATE POLICY "Anyone can read files" ON storage.objects
  FOR SELECT USING (bucket_id = 'arabic-files');

CREATE POLICY "Anyone can update their files" ON storage.objects
  FOR UPDATE USING (bucket_id = 'arabic-files');

CREATE POLICY "Anyone can delete their files" ON storage.objects
  FOR DELETE USING (bucket_id = 'arabic-files');
