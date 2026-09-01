CREATE TABLE public.books (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  judul text NOT NULL,
  author text NOT NULL DEFAULT '',
  genre text NOT NULL DEFAULT 'General',
  category text NOT NULL DEFAULT 'General',
  deskripsi text NOT NULL DEFAULT '',
  cover text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  pdf_url text NOT NULL DEFAULT '',
  year text NOT NULL DEFAULT '',
  isbn text NOT NULL DEFAULT '',
  publisher text NOT NULL DEFAULT '',
  pages text NOT NULL DEFAULT '',
  language text NOT NULL DEFAULT 'Bahasa Indonesia',
  length text NOT NULL DEFAULT '',
  width text NOT NULL DEFAULT '',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.books TO anon;
GRANT SELECT ON public.books TO authenticated;
GRANT ALL ON public.books TO service_role;

ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Books are publicly readable"
ON public.books FOR SELECT
TO anon, authenticated
USING (true);

CREATE INDEX books_created_at_idx ON public.books (created_at DESC);
CREATE INDEX books_genre_idx ON public.books (lower(genre));

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_books_updated_at
BEFORE UPDATE ON public.books
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();