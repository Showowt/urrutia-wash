-- Reviews table for Google review management
-- Allows owner to add/edit/remove reviews via admin panel at /reviews

CREATE EXTENSION IF NOT EXISTS moddatetime WITH SCHEMA extensions;

CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  text text NOT NULL,
  stars integer NOT NULL DEFAULT 5 CHECK (stars >= 1 AND stars <= 5),
  ago text NOT NULL DEFAULT '',
  vehicle text,
  source text NOT NULL DEFAULT 'google',
  featured boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION extensions.moddatetime(updated_at);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read featured reviews"
  ON public.reviews FOR SELECT
  USING (featured = true);

CREATE POLICY "Service role full access"
  ON public.reviews FOR ALL
  USING (auth.role() = 'service_role');

CREATE INDEX idx_reviews_featured_sort ON public.reviews (featured, sort_order);
