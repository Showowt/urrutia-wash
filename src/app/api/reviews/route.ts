import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

const ADMIN_KEY = process.env.ADMIN_API_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

function checkAuth(req: NextRequest): boolean {
  const auth = req.headers.get('authorization');
  if (!auth || !ADMIN_KEY) return false;
  return auth === `Bearer ${ADMIN_KEY}`;
}

// GET /api/reviews — public (featured only) or all (with auth)
export async function GET(req: NextRequest) {
  const supabase = createServiceClient();
  const isAdmin = checkAuth(req);

  let query = supabase.from('reviews').select('*').order('sort_order', { ascending: true });

  if (!isAdmin) {
    query = query.eq('featured', true);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[GET /api/reviews]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

// POST /api/reviews — admin only, create a review
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return unauthorized();

  const body = await req.json();
  const { name, text, stars, ago, vehicle, featured, sort_order } = body;

  if (!name || !text) {
    return NextResponse.json({ error: 'name and text are required' }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      name,
      text,
      stars: stars ?? 5,
      ago: ago ?? '',
      vehicle: vehicle || null,
      featured: featured ?? true,
      sort_order: sort_order ?? 0,
    })
    .select()
    .single();

  if (error) {
    console.error('[POST /api/reviews]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}

// PUT /api/reviews — admin only, update a review
export async function PUT(req: NextRequest) {
  if (!checkAuth(req)) return unauthorized();

  const body = await req.json();
  const { id, ...updates } = body;

  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('reviews')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[PUT /api/reviews]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

// DELETE /api/reviews — admin only
export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return unauthorized();

  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { error } = await supabase.from('reviews').delete().eq('id', id);

  if (error) {
    console.error('[DELETE /api/reviews]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
