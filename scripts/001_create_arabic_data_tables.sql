-- Create the main Arabic data table
CREATE TABLE IF NOT EXISTS public.arabic_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_arabic_data_category ON public.arabic_data(category);
CREATE INDEX IF NOT EXISTS idx_arabic_data_tags ON public.arabic_data USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_arabic_data_user_id ON public.arabic_data(user_id);
CREATE INDEX IF NOT EXISTS idx_arabic_data_created_at ON public.arabic_data(created_at DESC);

-- Enable full-text search for Arabic content
CREATE INDEX IF NOT EXISTS idx_arabic_data_title_search ON public.arabic_data USING gin(to_tsvector('arabic', title));
CREATE INDEX IF NOT EXISTS idx_arabic_data_content_search ON public.arabic_data USING gin(to_tsvector('arabic', content));

-- Enable Row Level Security
ALTER TABLE public.arabic_data ENABLE ROW LEVEL SECURITY;

-- RLS Policies for CRUD operations
CREATE POLICY "arabic_data_select_all"
  ON public.arabic_data FOR SELECT
  USING (true);

CREATE POLICY "arabic_data_insert_own"
  ON public.arabic_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "arabic_data_update_own"
  ON public.arabic_data FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "arabic_data_delete_own"
  ON public.arabic_data FOR DELETE
  USING (auth.uid() = user_id);

-- Create categories table for better organization
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  name_ar TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO public.categories (name, name_ar, description, icon) VALUES
  ('technology', 'تقنية', 'Technology and computing related data', '💻'),
  ('science', 'علوم', 'Scientific research and discoveries', '🔬'),
  ('literature', 'أدب', 'Arabic literature and poetry', '📚'),
  ('history', 'تاريخ', 'Historical records and events', '📜'),
  ('education', 'تعليم', 'Educational content and resources', '🎓'),
  ('business', 'أعمال', 'Business and economics', '💼')
ON CONFLICT (name) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
DROP TRIGGER IF EXISTS update_arabic_data_updated_at ON public.arabic_data;
CREATE TRIGGER update_arabic_data_updated_at
  BEFORE UPDATE ON public.arabic_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
