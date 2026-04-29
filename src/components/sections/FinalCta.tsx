'use client';

import { useState } from 'react';
import BookingModal from '@/components/sections/BookingModal';

/* ─── Promo Code Copy Button ─── */
function PromoCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select text
    }
  }

  return (
    <div className="inline-flex items-center gap-3 promo-badge rounded-2xl px-6 py-3 mx-auto">
      <span className="font-mono text-flame font-black text-xl tracking-widest relative z-10">
        {code}
      </span>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? 'Code copied!' : `Copy promo code ${code}`}
        className="relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all duration-200 cursor-pointer"
        style={{
          background: copied ? 'rgba(16,185,129,0.15)' : 'rgba(255,107,26,0.12)',
          border: '1px solid',
          borderColor: copied ? 'rgba(16,185,129,0.4)' : 'rgba(255,107,26,0.35)',
          color: copied ? '#10B981' : '#FF6B1A',
        }}
      >
        {copied ? (
          <>
            <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            COPIED
          </>
        ) : (
          <>
            <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <rect x="5" y="5" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M3 11V3a2 2 0 0 1 2-2h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            COPY
          </>
        )}
      </button>
    </div>
  );
}

/* ─── Decorative water droplet ─── */
function WaterDrop({
  size,
  top,
  left,
  right,
  bottom,
  floatClass,
  opacity = 0.06,
  color = 'rgba(0,180,255,1)',
}: {
  size: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  floatClass: string;
  opacity?: number;
  color?: string;
}) {
  return (
    <div
      className={`drop-shape absolute pointer-events-none select-none ${floatClass}`}
      aria-hidden="true"
      style={{
        width:  `${size}px`,
        height: `${size * 1.25}px`,
        top,
        left,
        right,
        bottom,
        background: color,
        opacity,
        filter: `blur(${Math.round(size * 0.1)}px)`,
      }}
    />
  );
}

export default function FinalCta() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section className="py-28 lg:py-40 relative overflow-hidden">

        {/* ─── Atmospheric base gradient ─── */}
        <div className="absolute inset-0 hero-bg opacity-80" aria-hidden="true" />

        {/* ─── Animated sparkle radials ─── */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div
            className="spark-1 absolute w-64 h-64 rounded-full"
            style={{
              top: '15%',
              left: '10%',
              background: 'radial-gradient(circle, rgba(0,180,255,0.18) 0%, transparent 70%)',
            }}
          />
          <div
            className="spark-2 absolute w-96 h-96 rounded-full"
            style={{
              top: '-5%',
              right: '5%',
              background: 'radial-gradient(circle, rgba(0,180,255,0.10) 0%, transparent 70%)',
            }}
          />
          <div
            className="spark-3 absolute w-48 h-48 rounded-full"
            style={{
              bottom: '10%',
              right: '20%',
              background: 'radial-gradient(circle, rgba(255,107,26,0.14) 0%, transparent 70%)',
            }}
          />
          <div
            className="spark-4 absolute w-72 h-72 rounded-full"
            style={{
              bottom: '5%',
              left: '15%',
              background: 'radial-gradient(circle, rgba(0,180,255,0.08) 0%, transparent 70%)',
            }}
          />
        </div>

        {/* ─── Water droplet decoratives ─── */}
        <WaterDrop size={80}  top="8%"   left="5%"   floatClass="lux-float-a" opacity={0.07} />
        <WaterDrop size={50}  top="20%"  right="8%"  floatClass="lux-float-b" opacity={0.05} color="rgba(255,107,26,0.9)" />
        <WaterDrop size={120} bottom="10%" left="3%"  floatClass="lux-float-c" opacity={0.04} />
        <WaterDrop size={60}  bottom="20%" right="4%" floatClass="lux-float-d" opacity={0.06} />
        <WaterDrop size={35}  top="45%"  left="18%"  floatClass="lux-float-b" opacity={0.05} />
        <WaterDrop size={45}  top="35%"  right="18%" floatClass="lux-float-a" opacity={0.04} color="rgba(0,102,204,0.9)" />

        {/* ─── Content ─── */}
        <div className="max-w-4xl mx-auto px-5 lg:px-8 relative text-center">

          <p className="font-mono text-xs text-flame tracking-widest mb-5">FIRST WASH SPECIAL</p>

          <h2
            className="font-black leading-[0.92] mb-8 tracking-tight"
            style={{ fontSize: 'clamp(2.8rem, 10vw, 6.5rem)' }}
          >
            Your car deserves better{' '}
            <span
              className="block"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, rgba(0,180,255,0.85) 50%, #ffffff 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              than a tunnel.
            </span>
          </h2>

          <p className="text-lg text-muted max-w-xl mx-auto mb-8 leading-relaxed">
            Book your first wash today. Use the code below for 20% off any service.
          </p>

          {/* Promo code badge */}
          <div className="flex justify-center mb-10">
            <PromoCode code="FIRST20" />
          </div>

          {/* Main CTA */}
          <button
            onClick={() => setModalOpen(true)}
            className="btn-mega inline-flex items-center gap-3 px-12 py-5 rounded-full text-lg cursor-pointer"
          >
            Book My Wash
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              aria-hidden="true"
            >
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Trust micro-copy */}
          <p className="mt-6 text-muted text-sm font-mono">
            No commitment · Cancel anytime · SMS confirmation
          </p>

        </div>
      </section>

      <BookingModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
