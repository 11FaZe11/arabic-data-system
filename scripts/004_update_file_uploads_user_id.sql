-- Make user_id nullable in file_uploads table
ALTER TABLE public.file_uploads 
ALTER COLUMN user_id DROP NOT NULL;

-- Update the index since user_id is now optional
DROP INDEX IF EXISTS idx_file_uploads_user_id;
CREATE INDEX IF NOT EXISTS idx_file_uploads_user_id ON public.file_uploads(user_id) WHERE user_id IS NOT NULL;
