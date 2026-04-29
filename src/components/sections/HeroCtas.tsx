'use client';

import { useState, useRef, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';
import BookingModal from '@/components/sections/BookingModal';

/* ─── Magnetic hover helper ─── */
function useMagnetic(strength = 0.35) {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * strength;
      const dy = (e.clientY - cy) * strength;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    },
    [strength]
  );

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'translate(0px, 0px)';
    el.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    setTimeout(() => {
      if (el) el.style.transition = '';
    }, 500);
  }, []);

  return { ref, handleMouseMove, handleMouseLeave };
}

export default function HeroCtas() {
  const [modalOpen, setModalOpen] = useState(false);
  const primaryMag = useMagnetic(0.3);
  const ghostMag = useMagnetic(0.3);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Primary — Book My Wash with shimmer + magnetic */}
        <button
          ref={primaryMag.ref as React.RefObject<HTMLButtonElement>}
          onMouseMove={primaryMag.handleMouseMove}
          onMouseLeave={primaryMag.handleMouseLeave}
          onClick={() => setModalOpen(true)}
          className="btn-primary shimmer-btn px-7 py-4 rounded-full text-base flex items-center justify-center gap-2 cursor-none"
          style={{ willChange: 'transform' }}
        >
          Book My Wash
          <ArrowRight className="w-4 h-4" strokeWidth={2.5} aria-hidden="true" />
        </button>

        {/* Ghost — See Membership with magnetic */}
        <a
          ref={ghostMag.ref as React.RefObject<HTMLAnchorElement>}
          onMouseMove={ghostMag.handleMouseMove}
          onMouseLeave={ghostMag.handleMouseLeave}
          href="#membership"
          className="btn-ghost px-7 py-4 rounded-full text-base flex items-center justify-center gap-2 cursor-none"
          style={{ willChange: 'transform' }}
        >
          See Membership
        </a>
      </div>

      {/* Scroll indicator */}
      <div className="mt-16 flex flex-col items-start gap-2">
        <div className="scroll-indicator flex flex-col items-center gap-1">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-muted"
            aria-hidden="true"
          >
            <path d="M10 4v12M5 11l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-mono text-[10px] text-muted tracking-widest">SCROLL</span>
        </div>
      </div>

      <BookingModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
