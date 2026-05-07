-- Gallery photos table — auto-populated via Telegram bot + Claude Vision
CREATE TABLE public.gallery_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  storage_path text,
  make text NOT NULL DEFAULT '',
  model text NOT NULL DEFAULT '',
  color text NOT NULL DEFAULT '',
  year text,
  label text NOT NULL DEFAULT '',
  service_type text DEFAULT 'detail',
  category text NOT NULL DEFAULT 'detail',
  featured boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  ai_description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_gallery_photos_updated_at
  BEFORE UPDATE ON public.gallery_photos
  FOR EACH ROW
  EXECUTE FUNCTION extensions.moddatetime(updated_at);

ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read featured gallery photos"
  ON public.gallery_photos FOR SELECT
  USING (featured = true);

CREATE POLICY "Service role full access on gallery_photos"
  ON public.gallery_photos FOR ALL
  USING (auth.role() = 'service_role');

CREATE INDEX idx_gallery_featured_sort ON public.gallery_photos (featured, sort_order);
CREATE INDEX idx_gallery_category ON public.gallery_photos (category);
