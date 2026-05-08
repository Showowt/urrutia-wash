'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import BookingModal from '@/components/sections/BookingModal';
import RevealOnScroll from '@/components/cinema/RevealOnScroll';

type ModalPreset = 'weekly_small_exterior' | 'weekly_small_full' | 'weekly_medium_exterior' | 'weekly_medium_full' | 'weekly_large_exterior' | 'weekly_large_full' | null;

/* ─── Punch card numbers ─── */
const PUNCH_FILLED = [1, 2, 3, 4, 5];
const PUNCH_PARTIAL = [6];
const PUNCH_EMPTY = [7, 8, 9];

const PLAN_CARDS = [
  {
    size: 'SMALL',
    desc: 'Sedans · Coupes',
    color: 'water',
    highlighted: false,
    exteriorPrice: 120,
    fullPrice: 180,
    exteriorId: 'weekly_small_exterior' as ModalPreset,
    fullId: 'weekly_small_full' as ModalPreset,
  },
  {
    size: 'MEDIUM',
    desc: 'SUVs · Crossovers',
    color: 'water',
    highlighted: true,
    badge: 'RECOMMENDED',
    exteriorPrice: 130,
    fullPrice: 220,
    exteriorId: 'weekly_medium_exterior' as ModalPreset,
    fullId: 'weekly_medium_full' as ModalPreset,
  },
  {
    size: 'LARGE',
    desc: 'Trucks · Full-size SUVs',
    color: 'flame',
    highlighted: false,
    exteriorPrice: 150,
    fullPrice: 250,
    exteriorId: 'weekly_large_exterior' as ModalPreset,
    fullId: 'weekly_large_full' as ModalPreset,
  },
];

export default function MembershipSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPreset, setModalPreset] = useState<ModalPreset>(null);
  const [punchVisible, setPunchVisible] = useState(false);
  const punchRef = useRef<HTMLDivElement>(null);

  function openBooking(preset: ModalPreset) {
    setModalPreset(preset);
    setModalOpen(true);
  }

  /* Trigger punch fill animation on scroll into view */
  useEffect(() => {
    const el = punchRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setPunchVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPunchVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section id="membership" className="py-24 lg:py-32 relative overflow-hidden">

        {/* Subtle atmospheric gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0,180,255,0.04), transparent 60%)',
          }}
        />

        <div className="max-w-7xl mx-auto px-5 lg:px-8 relative">
          <RevealOnScroll className="max-w-2xl mb-4">
            <p className="font-mono text-xs text-water tracking-widest mb-3">03 — WEEKLY PLANS</p>
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
              Come in every week. Stay clean all month.
            </h2>
            <p className="mt-4 text-muted text-lg">
              4 washes per month, paid on the 1st. Priced by vehicle size. Priority slots, automatic punch tracking. Cancel anytime.
            </p>
          </RevealOnScroll>

          {/* Social proof line */}
          <RevealOnScroll className="mb-10" delay={80}>
            <div className="flex items-center gap-2 mt-3">
              <div className="flex -space-x-1.5">
                {['bg-water/60', 'bg-flame/60', 'bg-water-deep/60'].map((c, i) => (
                  <div
                    key={i}
                    className={`w-6 h-6 rounded-full border-2 border-void ${c} grid place-items-center text-[8px] font-black text-white`}
                  >
                    {['J', 'M', 'R'][i]}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted">
                <span className="text-ink font-semibold">200+</span> Henderson drivers on weekly plans
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid md:grid-cols-3 gap-4">
            {PLAN_CARDS.map((card, i) => (
              <RevealOnScroll key={card.size} delay={i * 100}>
                <div
                  className={`rounded-2xl p-7 flex flex-col h-full relative ${
                    card.highlighted ? 'duo-glow' : 'card'
                  }`}
                  style={card.highlighted ? {
                    background:
                      'linear-gradient(160deg, rgba(0,180,255,0.07) 0%, rgba(0,180,255,0.02) 50%, rgba(0,100,200,0.03) 100%)',
                    border: '1px solid rgba(0,180,255,0.45)',
                  } : {}}
                >
                  {card.badge && (
                    <>
                      <div
                        className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-32 pointer-events-none rounded-full"
                        aria-hidden="true"
                        style={{
                          background:
                            'radial-gradient(ellipse at center, rgba(0,180,255,0.22) 0%, transparent 70%)',
                          filter: 'blur(20px)',
                        }}
                      />
                      <div className="absolute -top-3.5 left-5 px-3.5 py-1 rounded-full text-[10px] font-bold tracking-widest bg-gradient-to-r from-water to-water-deep text-white z-10">
                        {card.badge}
                      </div>
                    </>
                  )}

                  <p className={`font-mono text-[11px] tracking-widest text-${card.color} mb-1 ${card.badge ? 'mt-1' : ''}`}>
                    {card.size}
                  </p>
                  <h3 className="text-2xl font-bold mb-1">{card.desc}</h3>
                  <p className="text-sm text-muted mb-5">4 washes/month · Paid on 1st</p>

                  {/* Exterior price */}
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-4xl font-black price-gradient">
                      ${card.exteriorPrice}
                    </span>
                    <span className="text-muted text-sm">/ mo · ext only</span>
                  </div>
                  <div className="flex items-baseline gap-1 mb-5">
                    <span className="text-4xl font-black price-gradient">
                      ${card.fullPrice}
                    </span>
                    <span className="text-muted text-sm">/ mo · int + ext</span>
                  </div>

                  <ul className="space-y-3 text-sm flex-1 mb-7">
                    <li className="flex gap-3">
                      <span className={`text-${card.color}`}>→</span>
                      <span><b className="text-ink">4</b> washes per month</span>
                    </li>
                    <li className="flex gap-3">
                      <span className={`text-${card.color}`}>→</span>
                      <span>Priority booking slots</span>
                    </li>
                    <li className="flex gap-3">
                      <span className={`text-${card.color}`}>→</span>
                      <span>10th wash free (auto-redeemed)</span>
                    </li>
                    <li className="flex gap-3">
                      <span className={`text-${card.color}`}>→</span>
                      <span>SMS confirmation every visit</span>
                    </li>
                  </ul>

                  <div className="space-y-2">
                    <button
                      onClick={() => openBooking(card.exteriorId)}
                      className="btn-ghost w-full py-3 rounded-xl text-sm cursor-pointer"
                    >
                      Start Exterior — ${card.exteriorPrice}/mo
                    </button>
                    <button
                      onClick={() => openBooking(card.fullId)}
                      className={`w-full py-3 rounded-xl text-sm cursor-pointer ${card.highlighted ? 'btn-primary' : 'btn-ghost'}`}
                    >
                      Start Full — ${card.fullPrice}/mo
                    </button>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>

          {/* ─── Punch Card ─── */}
          <RevealOnScroll className="mt-12">
            <div className="card rounded-2xl p-6 lg:p-8" ref={punchRef}>
              <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                <div className="flex-1">
                  <p className="font-mono text-xs text-flame tracking-widest mb-2">
                    EVERY 10TH WASH FREE
                  </p>
                  <h4 className="text-2xl font-bold mb-2">
                    No card to carry. No app to remember.
                  </h4>
                  <p className="text-muted max-w-xl">
                    We track every wash automatically by your license plate. When you hit 10,
                    your next wash is on us &mdash; you&rsquo;ll get an SMS the day it lands.
                  </p>
                </div>

                {/* Punch circles with staggered fill animation */}
                <div className="flex gap-2 flex-wrap" aria-label="Punch card: 5 of 10 washes complete">
                  {PUNCH_FILLED.map((n, idx) => (
                    <div
                      key={n}
                      className={`w-10 h-10 rounded-full bg-water grid place-items-center text-[#08101F] font-black text-sm ${
                        punchVisible ? 'punch-pop' : 'opacity-0'
                      }`}
                      style={punchVisible ? { animationDelay: `${idx * 70}ms` } : undefined}
                    >
                      {n}
                    </div>
                  ))}
                  {PUNCH_PARTIAL.map((n) => (
                    <div
                      key={n}
                      className={`w-10 h-10 rounded-full bg-water/30 grid place-items-center text-ink font-black text-sm ${
                        punchVisible ? 'punch-pop' : 'opacity-0'
                      }`}
                      style={punchVisible ? { animationDelay: '350ms' } : undefined}
                    >
                      {n}
                    </div>
                  ))}
                  {PUNCH_EMPTY.map((n, idx) => (
                    <div
                      key={n}
                      className={`w-10 h-10 rounded-full border-2 border-dashed border-line grid place-items-center text-muted font-black text-sm ${
                        punchVisible ? 'punch-pop' : 'opacity-0'
                      }`}
                      style={punchVisible ? { animationDelay: `${420 + idx * 60}ms` } : undefined}
                    >
                      {n}
                    </div>
                  ))}
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-br from-flame to-flame-soft grid place-items-center text-[#08101F] font-black text-sm ${
                      punchVisible ? 'punch-pop' : 'opacity-0'
                    }`}
                    style={punchVisible ? { animationDelay: '600ms' } : undefined}
                    aria-label="10th wash free"
                  >
                    ★
                  </div>
                </div>
              </div>
            </div>
          </RevealOnScroll>

          {/* Link to full plans page */}
          <RevealOnScroll className="mt-6 text-center">
            <Link
              href="/memberships"
              className="btn-ghost px-6 py-3 rounded-full text-sm inline-flex items-center gap-2"
            >
              See All Weekly Plans
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </RevealOnScroll>

        </div>
      </section>

      <BookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        preset={modalPreset}
      />
    </>
  );
}
