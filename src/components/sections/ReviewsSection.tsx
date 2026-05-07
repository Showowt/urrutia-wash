'use client';

import { useRef, useState, useEffect } from 'react';

interface Review {
  id?: string;
  name: string;
  text: string;
  stars: number;
  ago: string;
  vehicle?: string | null;
}

// Hardcoded fallback in case DB fetch fails
const FALLBACK_REVIEWS: Review[] = [
  { name: 'Jeffrey Nunn', text: 'I have a brand new Porsche that I trust these guys with more than any place in town. They give it a hand wash and don\'t miss a spot. The paint is still pristine condition. Only place I take my car to get it washed now.', stars: 5, ago: '4 months ago', vehicle: 'Porsche' },
  { name: 'Jeremy Huard', text: 'Jose and his crew are great. Always gets my car looking fresh. Just drop it off, workout, and when you come back your cars looking new again! A+', stars: 5, ago: '6 months ago' },
  { name: 'Lex Tucker', text: 'I contacted so many detailers & Jose answered quickly & gave me an estimate in just a few seconds then offered to have it done in the next hour. He did absolutely amazing & I will definitely be coming back.', stars: 5, ago: '4 months ago' },
  { name: 'Michael Mohfanz', text: 'Hands down the best car detail I\'ve ever had! My car looked brand new when he was done! Every corner, seat, and panel was spotless. You can tell he really takes pride in his work and doesn\'t rush the job.', stars: 5, ago: '6 months ago' },
  { name: 'Jonny O', text: 'Can\'t say enough about Jose and his crew for always coming thru with the BEST car wash in Vegas and does an amazing job. Been going with him for many years and several cars and never disappoint!', stars: 5, ago: '6 months ago' },
  { name: 'Ferhad Alic', text: 'Great prices and amazing service. The owner takes great pride in attention to detail and cares about his clients.', stars: 5, ago: '6 months ago' },
];

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" width="14" height="14" fill="#FBBC05" aria-hidden="true">
          <path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.27l-4.77 2.51.91-5.32L2.27 6.69l5.34-.78z" />
        </svg>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div
      className="flex-shrink-0 w-[340px] sm:w-[380px] rounded-2xl p-6 flex flex-col"
      style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.005) 100%)',
        border: '1px solid rgba(27,34,54,0.8)',
      }}
    >
      <StarRow count={review.stars} />

      <p className="text-[15px] text-ink/90 leading-relaxed mt-4 flex-1">
        &ldquo;{review.text}&rdquo;
      </p>

      <div className="mt-5 pt-4 border-t border-line/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full grid place-items-center text-xs font-black text-white shrink-0"
            style={{
              background: 'linear-gradient(135deg, #0066CC, #00B4FF)',
            }}
          >
            {review.name.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">{review.name}</p>
            <p className="text-[11px] text-muted font-mono">{review.ago}</p>
          </div>
        </div>

        {/* Google icon */}
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" className="shrink-0 opacity-40">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
      </div>
    </div>
  );
}

export default function ReviewsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [reviews, setReviews] = useState<Review[]>(FALLBACK_REVIEWS);

  useEffect(() => {
    fetch('/api/reviews')
      .then((res) => res.json())
      .then((json) => {
        if (json.data && json.data.length > 0) {
          setReviews(json.data);
        }
      })
      .catch(() => {
        // Keep fallback reviews
      });
  }, []);

  function checkScroll() {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    return () => el.removeEventListener('scroll', checkScroll);
  }, [reviews]);

  function scroll(direction: 'left' | 'right') {
    const el = scrollRef.current;
    if (!el) return;
    const amount = direction === 'left' ? -400 : 400;
    el.scrollBy({ left: amount, behavior: 'smooth' });
  }

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="font-mono text-xs text-water tracking-widest mb-3">05 — REVIEWS</p>
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
              Don&rsquo;t take our word for it.
            </h2>
          </div>

          {/* Navigation arrows — desktop */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="w-10 h-10 rounded-full border border-line grid place-items-center text-muted hover:text-ink hover:border-water/40 transition-all disabled:opacity-25 disabled:hover:border-line disabled:hover:text-muted cursor-pointer"
              aria-label="Scroll reviews left"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="w-10 h-10 rounded-full border border-line grid place-items-center text-muted hover:text-ink hover:border-water/40 transition-all disabled:opacity-25 disabled:hover:border-line disabled:hover:text-muted cursor-pointer"
              aria-label="Scroll reviews right"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable review cards */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-hide px-5 lg:px-[max(1.25rem,calc((100vw-80rem)/2+1.25rem))]"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {reviews.map((review, i) => (
          <div key={review.id || i} style={{ scrollSnapAlign: 'start' }}>
            <ReviewCard review={review} />
          </div>
        ))}
      </div>

      {/* Google badge */}
      <div className="max-w-7xl mx-auto px-5 lg:px-8 mt-10">
        <div className="flex items-center gap-3 text-sm text-muted">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span>
            <span className="text-ink font-semibold">4.7</span> out of 5 &middot; {reviews.length} reviews on Google
          </span>
        </div>
      </div>
    </section>
  );
}
