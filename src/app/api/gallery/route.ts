import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

// GET /api/gallery — public, returns featured gallery photos
export async function GET(req: NextRequest) {
  const supabase = createServiceClient();

  const category = req.nextUrl.searchParams.get('category');
  const limit = parseInt(req.nextUrl.searchParams.get('limit') || '50', 10);

  let query = supabase
    .from('gallery_photos')
    .select('*')
    .eq('featured', true)
    .order('sort_order', { ascending: false })
    .limit(limit);

  if (category && category !== 'all') {
    // Only allow known category values to prevent injection
    const validCategories = ['express', 'detail', 'ceramic', 'trucks'];
    if (validCategories.includes(category)) {
      query = query.eq('category', category);
    } else {
      return NextResponse.json({ data: [] });
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error('[GET /api/gallery]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
