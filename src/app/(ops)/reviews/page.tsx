'use client';

import { useState, useEffect, useCallback } from 'react';

interface Review {
  id: string;
  name: string;
  text: string;
  stars: number;
  ago: string;
  vehicle: string | null;
  source: string;
  featured: boolean;
  sort_order: number;
  created_at: string;
}

const EMPTY_FORM = { name: '', text: '', stars: 5, ago: '', vehicle: '', featured: true, sort_order: 0 };

export default function ReviewsAdmin() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiKey, setApiKey] = useState('');
  const [authed, setAuthed] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const headers = useCallback(() => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  }), [apiKey]);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reviews', { headers: { Authorization: `Bearer ${apiKey}` } });
      const json = await res.json();
      if (json.data) {
        setReviews(json.data);
        setAuthed(true);
      } else {
        setError('Failed to load reviews');
      }
    } catch {
      setError('Failed to connect');
    }
    setLoading(false);
  }, [apiKey]);

  useEffect(() => {
    const stored = localStorage.getItem('urrutia_admin_key');
    if (stored) {
      setApiKey(stored);
    }
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    localStorage.setItem('urrutia_admin_key', apiKey);
    fetchReviews();
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      ...form,
      vehicle: form.vehicle || null,
      ...(editingId ? { id: editingId } : {}),
    };

    try {
      const res = await fetch('/api/reviews', {
        method: editingId ? 'PUT' : 'POST',
        headers: headers(),
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const json = await res.json();
        setError(json.error || 'Save failed');
      } else {
        setForm(EMPTY_FORM);
        setEditingId(null);
        await fetchReviews();
      }
    } catch {
      setError('Save failed');
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this review?')) return;
    try {
      await fetch('/api/reviews', {
        method: 'DELETE',
        headers: headers(),
        body: JSON.stringify({ id }),
      });
      await fetchReviews();
    } catch {
      setError('Delete failed');
    }
  }

  async function toggleFeatured(review: Review) {
    await fetch('/api/reviews', {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify({ id: review.id, featured: !review.featured }),
    });
    await fetchReviews();
  }

  function startEdit(review: Review) {
    setEditingId(review.id);
    setForm({
      name: review.name,
      text: review.text,
      stars: review.stars,
      ago: review.ago,
      vehicle: review.vehicle || '',
      featured: review.featured,
      sort_order: review.sort_order,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Login screen
  if (!authed) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center px-5">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
          <h1 className="text-2xl font-bold text-ink">Reviews Admin</h1>
          <p className="text-sm text-muted">Enter your admin API key to manage reviews.</p>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="API Key"
            className="w-full px-4 py-3 rounded-xl bg-surface border border-line text-ink text-sm focus:outline-none focus:border-water/50"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full px-4 py-3 rounded-xl bg-water text-void font-bold text-sm hover:bg-water/90 transition-colors"
          >
            {loading ? 'Loading...' : 'Log In'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-void text-ink">
      <div className="max-w-4xl mx-auto px-5 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Reviews Manager</h1>
            <p className="text-sm text-muted mt-1">{reviews.length} reviews total &middot; {reviews.filter(r => r.featured).length} featured on site</p>
          </div>
          <button
            onClick={() => { setAuthed(false); localStorage.removeItem('urrutia_admin_key'); }}
            className="text-xs text-muted hover:text-ink transition-colors"
          >
            Log Out
          </button>
        </div>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        {/* Add / Edit form */}
        <form onSubmit={handleSave} className="rounded-2xl p-6 mb-10" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h2 className="text-lg font-bold mb-4">{editingId ? 'Edit Review' : 'Add New Review'}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Reviewer name"
              required
              className="px-4 py-3 rounded-xl bg-surface border border-line text-ink text-sm focus:outline-none focus:border-water/50"
            />
            <input
              value={form.ago}
              onChange={(e) => setForm({ ...form, ago: e.target.value })}
              placeholder="Time ago (e.g. 2 weeks ago)"
              className="px-4 py-3 rounded-xl bg-surface border border-line text-ink text-sm focus:outline-none focus:border-water/50"
            />
            <input
              value={form.vehicle}
              onChange={(e) => setForm({ ...form, vehicle: e.target.value })}
              placeholder="Vehicle (optional)"
              className="px-4 py-3 rounded-xl bg-surface border border-line text-ink text-sm focus:outline-none focus:border-water/50"
            />
            <div className="flex gap-4">
              <select
                value={form.stars}
                onChange={(e) => setForm({ ...form, stars: Number(e.target.value) })}
                className="px-4 py-3 rounded-xl bg-surface border border-line text-ink text-sm focus:outline-none focus:border-water/50 flex-1"
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>{n} Stars</option>
                ))}
              </select>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                placeholder="Order"
                className="px-4 py-3 rounded-xl bg-surface border border-line text-ink text-sm focus:outline-none focus:border-water/50 w-24"
              />
            </div>
          </div>
          <textarea
            value={form.text}
            onChange={(e) => setForm({ ...form, text: e.target.value })}
            placeholder="Review text"
            required
            rows={3}
            className="w-full mt-4 px-4 py-3 rounded-xl bg-surface border border-line text-ink text-sm focus:outline-none focus:border-water/50 resize-y"
          />
          <div className="flex items-center gap-4 mt-4">
            <label className="flex items-center gap-2 text-sm text-muted cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="accent-water"
              />
              Featured on site
            </label>
            <div className="flex-1" />
            {editingId && (
              <button
                type="button"
                onClick={() => { setEditingId(null); setForm(EMPTY_FORM); }}
                className="px-5 py-2.5 rounded-xl border border-line text-sm text-muted hover:text-ink transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-water text-void font-bold text-sm hover:bg-water/90 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : editingId ? 'Update Review' : 'Add Review'}
            </button>
          </div>
        </form>

        {/* Review list */}
        <div className="space-y-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-2xl p-5 flex gap-4"
              style={{
                background: review.featured ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.01)',
                border: review.featured ? '1px solid rgba(0,180,255,0.15)' : '1px solid rgba(255,255,255,0.05)',
                opacity: review.featured ? 1 : 0.6,
              }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-sm">{review.name}</p>
                  <span className="text-[11px] text-muted font-mono">#{review.sort_order}</span>
                  <span className="text-[11px] text-muted font-mono">{review.ago}</span>
                  {review.vehicle && <span className="text-[11px] text-water font-mono">{review.vehicle}</span>}
                  {'★'.repeat(review.stars).split('').map((s, i) => (
                    <span key={i} className="text-[11px] text-yellow-400">{s}</span>
                  ))}
                </div>
                <p className="text-sm text-muted leading-relaxed line-clamp-2">{review.text}</p>
              </div>
              <div className="flex flex-col gap-1.5 shrink-0">
                <button
                  onClick={() => toggleFeatured(review)}
                  className={`text-[11px] px-3 py-1 rounded-lg border transition-colors ${
                    review.featured
                      ? 'border-water/30 text-water hover:bg-water/10'
                      : 'border-line text-muted hover:text-ink'
                  }`}
                >
                  {review.featured ? 'Visible' : 'Hidden'}
                </button>
                <button
                  onClick={() => startEdit(review)}
                  className="text-[11px] px-3 py-1 rounded-lg border border-line text-muted hover:text-ink transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(review.id)}
                  className="text-[11px] px-3 py-1 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
