'use client';

import { useState, useEffect, useRef } from 'react';
import BookingModal from '@/components/sections/BookingModal';
import RevealOnScroll from '@/components/cinema/RevealOnScroll';

type BillingCycle = 'monthly' | 'annual';
type ModalPreset = 'express' | 'classic' | 'detail' | 'ceramic' | 'solo' | 'duo' | 'fleet' | 'mobile' | null;

const PRICES = {
  solo: { monthly: 89, annual: 76 },
  duo: { monthly: 149, annual: 127 },
  fleet: { monthly: 279, annual: 237 },
} as const;

/* ─── Punch card numbers ─── */
const PUNCH_FILLED = [1, 2, 3, 4, 5];
const PUNCH_PARTIAL = [6];
const PUNCH_EMPTY = [7, 8, 9];

export default function MembershipSection() {
  const [billing, setBilling] = useState<BillingCycle>('monthly');
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

  const annualSavingsSolo = (PRICES.solo.monthly - PRICES.solo.annual) * 12;
  const annualSavingsDuo  = (PRICES.duo.monthly  - PRICES.duo.annual)  * 12;

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
            <p className="font-mono text-xs text-water tracking-widest mb-3">03 — URRUTIA CLUB</p>
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
              Become a member. Skip the booking.
            </h2>
            <p className="mt-4 text-muted text-lg">
              Members get priority slots, locked-in pricing, automatic punch-card redemption, and
              free interior wipe-downs. Cancel anytime.
            </p>
          </RevealOnScroll>

          {/* Social proof line */}
          <RevealOnScroll className="mb-8" delay={80}>
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
                <span className="text-ink font-semibold">200+</span> Henderson drivers trust URRUTIA Club
              </p>
            </div>
          </RevealOnScroll>

          {/* Billing toggle */}
          <RevealOnScroll>
            <div className="inline-flex items-center gap-1 p-1 bg-surface-2 border border-line rounded-full mb-10">
              <button
                onClick={() => setBilling('monthly')}
                aria-pressed={billing === 'monthly'}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                  billing === 'monthly'
                    ? 'bg-white text-[#08101F] shadow-md'
                    : 'text-muted hover:text-ink'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling('annual')}
                aria-pressed={billing === 'annual'}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  billing === 'annual'
                    ? 'bg-white text-[#08101F] shadow-md'
                    : 'text-muted hover:text-ink'
                }`}
              >
                Annual
                <span
                  className={`font-mono text-[10px] font-bold ${
                    billing === 'annual' ? 'text-flame' : 'savings-badge'
                  }`}
                >
                  SAVE 15%
                </span>
              </button>
            </div>
          </RevealOnScroll>

          <div className="grid md:grid-cols-3 gap-4">

            {/* SOLO */}
            <RevealOnScroll>
              <div className="card rounded-2xl p-7 flex flex-col h-full">
                <p className="font-mono text-[11px] tracking-widest text-muted mb-1">TIER 01</p>
                <h3 className="text-2xl font-bold mb-1">SOLO</h3>
                <p className="text-sm text-muted mb-5">For one driver, one car.</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-5xl font-black price-gradient">
                    ${PRICES.solo[billing]}
                  </span>
                  <span className="text-muted">/ mo</span>
                </div>
                <div className="mb-7 min-h-[24px]">
                  {billing === 'annual' ? (
                    <p className="text-xs font-mono">
                      <span className="savings-badge font-bold">Save ${annualSavingsSolo}/yr</span>
                      {' '}· billed annually
                    </p>
                  ) : (
                    <p className="text-xs text-muted font-mono">billed monthly</p>
                  )}
                </div>
                <ul className="space-y-3 text-sm flex-1 mb-7">
                  <li className="flex gap-3">
                    <span className="text-water">→</span>
                    <span><b className="text-ink">4</b> hand washes / month</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-water">→</span>
                    <span>15% off all detail packages</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-water">→</span>
                    <span>Priority booking slots</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-water">→</span>
                    <span>Free interior wipe-down on every wash</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-water">→</span>
                    <span>10th wash free (auto-redeemed)</span>
                  </li>
                </ul>
                <button
                  onClick={() => openBooking('solo')}
                  className="btn-ghost w-full py-3 rounded-xl text-sm cursor-pointer"
                >
                  Start Solo
                </button>
              </div>
            </RevealOnScroll>

            {/* DUO — recommended */}
            <RevealOnScroll delay={100}>
              <div
                className="rounded-2xl p-7 flex flex-col h-full relative duo-glow"
                style={{
                  background:
                    'linear-gradient(160deg, rgba(0,180,255,0.07) 0%, rgba(0,180,255,0.02) 50%, rgba(0,100,200,0.03) 100%)',
                  border: '1px solid rgba(0,180,255,0.45)',
                }}
              >
                {/* Water-colored light source */}
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
                  RECOMMENDED
                </div>

                <p className="font-mono text-[11px] tracking-widest text-water mb-1 mt-1">TIER 02</p>
                <h3 className="text-2xl font-bold mb-1">DUO</h3>
                <p className="text-sm text-muted mb-5">Two cars. One household. One bill.</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-5xl font-black price-gradient">
                    ${PRICES.duo[billing]}
                  </span>
                  <span className="text-muted">/ mo</span>
                </div>
                <div className="mb-7 min-h-[24px]">
                  {billing === 'annual' ? (
                    <p className="text-xs font-mono">
                      <span className="savings-badge font-bold">Save ${annualSavingsDuo}/yr</span>
                      {' '}· billed annually
                    </p>
                  ) : (
                    <p className="text-xs text-muted font-mono">billed monthly</p>
                  )}
                </div>
                <ul className="space-y-3 text-sm flex-1 mb-7">
                  <li className="flex gap-3">
                    <span className="text-water">→</span>
                    <span><b className="text-ink">8</b> hand washes / month (2 cars)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-water">→</span>
                    <span>20% off all detail packages</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-water">→</span>
                    <span>Same-day booking guarantee</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-water">→</span>
                    <span>Free interior shampoo quarterly</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-water">→</span>
                    <span>Apple Wallet membership pass</span>
                  </li>
                </ul>
                <button
                  onClick={() => openBooking('duo')}
                  className="btn-primary w-full py-3 rounded-xl text-sm cursor-pointer"
                >
                  Start Duo
                </button>
              </div>
            </RevealOnScroll>

            {/* FLEET */}
            <RevealOnScroll delay={200}>
              <div className="card rounded-2xl p-7 flex flex-col h-full">
                <p className="font-mono text-[11px] tracking-widest text-flame mb-1">TIER 03</p>
                <h3 className="text-2xl font-bold mb-1">FLEET</h3>
                <p className="text-sm text-muted mb-5">Unlimited washes. Up to 4 vehicles.</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-5xl font-black price-gradient">
                    ${PRICES.fleet[billing]}
                  </span>
                  <span className="text-muted">/ mo</span>
                </div>
                <div className="mb-7 min-h-[24px]">
                  <p className="text-xs text-muted font-mono">
                    {billing === 'annual' ? 'billed annually · save 15%' : 'billed monthly'}
                  </p>
                </div>
                <ul className="space-y-3 text-sm flex-1 mb-7">
                  <li className="flex gap-3">
                    <span className="text-flame">→</span>
                    <span><b className="text-ink">Unlimited</b> hand washes</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-flame">→</span>
                    <span>Up to <b className="text-ink">4</b> registered vehicles</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-flame">→</span>
                    <span>30% off all detail packages</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-flame">→</span>
                    <span>Mobile service included monthly</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-flame">→</span>
                    <span>Dedicated account manager</span>
                  </li>
                </ul>
                <button
                  onClick={() => openBooking('fleet')}
                  className="btn-ghost w-full py-3 rounded-xl text-sm cursor-pointer"
                >
                  Start Fleet
                </button>
              </div>
            </RevealOnScroll>
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
