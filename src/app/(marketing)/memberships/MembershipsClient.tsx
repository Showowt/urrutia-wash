'use client';

import { useState } from 'react';
import Link from 'next/link';
import RevealOnScroll from '@/components/cinema/RevealOnScroll';
import BookingModal from '@/components/sections/BookingModal';

type ModalPreset = 'weekly_small_exterior' | 'weekly_small_full' | 'weekly_medium_exterior' | 'weekly_medium_full' | 'weekly_large_exterior' | 'weekly_large_full';

const PLAN_TIERS = [
  {
    size: 'SMALL',
    desc: 'Sedans · Coupes · Compacts',
    color: 'water',
    highlighted: false,
    plans: [
      { label: 'Exterior Only', price: 120, id: 'weekly_small_exterior' as ModalPreset, singlePrice: 35 },
      { label: 'Interior + Exterior', price: 180, id: 'weekly_small_full' as ModalPreset, singlePrice: 55 },
    ],
  },
  {
    size: 'MEDIUM',
    desc: 'SUVs · Crossovers · Wagons',
    color: 'water',
    highlighted: true,
    badge: 'MOST POPULAR',
    plans: [
      { label: 'Exterior Only', price: 130, id: 'weekly_medium_exterior' as ModalPreset, singlePrice: 40 },
      { label: 'Interior + Exterior', price: 220, id: 'weekly_medium_full' as ModalPreset, singlePrice: 65 },
    ],
  },
  {
    size: 'LARGE',
    desc: 'Trucks · Full-size SUVs · Vans',
    color: 'flame',
    highlighted: false,
    plans: [
      { label: 'Exterior Only', price: 150, id: 'weekly_large_exterior' as ModalPreset, singlePrice: 45 },
      { label: 'Interior + Exterior', price: 250, id: 'weekly_large_full' as ModalPreset, singlePrice: 75 },
    ],
  },
];

const PLAN_FAQS = [
  {
    q: 'How does the weekly plan work?',
    a: 'You pay once on the 1st of each month for 4 washes that month. Come in once a week and your car stays clean all month. No per-visit payments needed.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. No contracts, no cancellation fees. Cancel before the 1st and you won\u2019t be charged for the next month. Your plan stays active through the current paid month.',
  },
  {
    q: 'What happens if I miss a wash?',
    a: 'Unused washes do not roll over to the next month. The value is designed around coming in weekly. If you need to skip a month, contact us before the 1st.',
  },
  {
    q: 'How does the 10th wash free work?',
    a: 'We track every wash by your license plate. When you hit 10, your account is automatically credited for one free wash \u2014 you get an SMS the moment it lands. No stamp card to carry.',
  },
  {
    q: 'How do I know which size my vehicle is?',
    a: 'Small: sedans, coupes, compacts (Civic, Camry, 3 Series). Medium: crossovers, SUVs, wagons (RAV4, X5, Tahoe). Large: trucks, full-size SUVs, vans (F-150, Escalade, Sprinter). If you\u2019re not sure, just ask your detailer.',
  },
  {
    q: 'Can I upgrade from Exterior to Interior + Exterior?',
    a: 'Yes. Contact us or just ask at your next visit. The prorated difference is applied to your next billing cycle.',
  },
];

function Breadcrumb() {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-muted">
      <Link href="/" className="hover:text-ink transition-colors duration-200">Home</Link>
      <span aria-hidden="true">/</span>
      <span className="text-ink">Weekly Plans</span>
    </nav>
  );
}

export default function MembershipsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPreset, setModalPreset] = useState<ModalPreset>('weekly_small_exterior');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  function openBooking(preset: ModalPreset) {
    setModalPreset(preset);
    setModalOpen(true);
  }

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative pt-28 pb-20 overflow-hidden hero-bg">
        <div className="hero-grid absolute inset-0 z-0" aria-hidden="true" />
        <div className="film-grain absolute inset-0 z-[1] pointer-events-none" aria-hidden="true" />
        <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
          <RevealOnScroll>
            <Breadcrumb />
          </RevealOnScroll>
          <RevealOnScroll delay={100}>
            <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-water/25 bg-water/5 text-xs font-mono text-water">
              <span className="w-1.5 h-1.5 rounded-full bg-water pulse-ring" aria-hidden="true" />
              4 WASHES / MONTH · PAID UPFRONT
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={200}>
            <h1 className="mt-5 text-5xl lg:text-7xl font-black leading-none tracking-tight">
              <span className="text-gradient-luxury">Weekly</span>{' '}
              <span className="text-gradient-water">Plans</span>
            </h1>
          </RevealOnScroll>
          <RevealOnScroll delay={300}>
            <p className="mt-6 text-lg text-muted max-w-2xl leading-relaxed">
              Come in once a week, your car stays clean all month. Pay on the 1st, wash every week. Priced by vehicle size — no surprises.
            </p>
          </RevealOnScroll>

          {/* Social proof */}
          <RevealOnScroll delay={400}>
            <div className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-2">
                {['bg-water/60', 'bg-flame/60', 'bg-water-deep/60', 'bg-success/60'].map((c, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full border-2 border-void ${c} grid place-items-center text-[9px] font-black text-white`}
                  >
                    {['J', 'M', 'R', 'A'][i]}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted">
                <span className="text-ink font-semibold">200+</span> Henderson drivers on weekly plans
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <div className="section-divider" />

      {/* ─── Plan Cards ─── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="grid md:grid-cols-3 gap-5">
            {PLAN_TIERS.map((tier, i) => (
              <RevealOnScroll key={tier.size} delay={i * 100}>
                <div
                  className={`rounded-2xl p-7 flex flex-col h-full relative ${
                    tier.highlighted ? 'duo-glow' : 'card'
                  }`}
                  style={tier.highlighted ? {
                    background: 'linear-gradient(160deg, rgba(0,180,255,0.07) 0%, rgba(0,180,255,0.02) 50%, rgba(0,100,200,0.03) 100%)',
                    border: '1px solid rgba(0,180,255,0.45)',
                  } : {}}
                >
                  {tier.badge && (
                    <div className="absolute -top-3.5 left-5 px-3.5 py-1 rounded-full text-[10px] font-bold tracking-widest bg-gradient-to-r from-water to-water-deep text-white z-10">
                      {tier.badge}
                    </div>
                  )}

                  <p className={`font-mono text-[11px] tracking-widest text-${tier.color} mb-1 ${tier.badge ? 'mt-2' : ''}`}>
                    {tier.size} VEHICLES
                  </p>
                  <h2 className="text-2xl font-black mb-1">{tier.desc}</h2>
                  <p className="text-sm text-muted mb-6">4 washes per month · Paid on the 1st</p>

                  <div className="space-y-4 flex-1 mb-6">
                    {tier.plans.map((plan) => {
                      const savings = (plan.singlePrice * 4) - plan.price;
                      return (
                        <div
                          key={plan.id}
                          className="p-4 rounded-xl"
                          style={{
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(27,34,54,0.8)',
                          }}
                        >
                          <div className="flex items-baseline justify-between mb-1">
                            <span className="text-sm font-semibold">{plan.label}</span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-3xl font-black price-gradient">${plan.price}</span>
                              <span className="text-muted text-xs">/ mo</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted">${plan.singlePrice} x 4 = ${plan.singlePrice * 4} single</span>
                            {savings > 0 && (
                              <span className="savings-badge text-[10px] font-bold">Save ${savings}/mo</span>
                            )}
                          </div>
                          <button
                            onClick={() => openBooking(plan.id)}
                            className={`w-full py-2.5 rounded-xl text-sm font-bold cursor-pointer mt-3 ${
                              plan.label.includes('Interior') ? 'btn-primary' : 'btn-ghost'
                            }`}
                          >
                            Start Plan — ${plan.price}/mo
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <ul className="space-y-2 text-sm mb-4">
                    <li className="flex gap-3">
                      <span className={`text-${tier.color}`}>→</span>
                      <span>Priority booking slots</span>
                    </li>
                    <li className="flex gap-3">
                      <span className={`text-${tier.color}`}>→</span>
                      <span>10th wash free (auto-tracked)</span>
                    </li>
                    <li className="flex gap-3">
                      <span className={`text-${tier.color}`}>→</span>
                      <span>SMS confirmation every visit</span>
                    </li>
                  </ul>

                  <p className="text-center text-xs text-muted">No contract · Cancel anytime</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ─── FAQ ─── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-3xl mx-auto px-5 lg:px-8">
          <RevealOnScroll className="mb-12">
            <p className="font-mono text-xs text-water tracking-widest mb-3">WEEKLY PLAN FAQ</p>
            <h2 className="text-3xl lg:text-4xl font-bold">Questions about weekly plans.</h2>
          </RevealOnScroll>

          <RevealOnScroll>
            <div className="space-y-3">
              {PLAN_FAQS.map((faq, i) => {
                const isOpen = openFaq === i;
                return (
                  <div
                    key={i}
                    className={`faq-item rounded-2xl overflow-hidden ${isOpen ? 'active' : ''}`}
                    style={{
                      background: isOpen
                        ? 'linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.008) 100%)'
                        : 'linear-gradient(180deg, rgba(255,255,255,0.018) 0%, rgba(255,255,255,0.005) 100%)',
                      border: isOpen
                        ? '1px solid rgba(0,180,255,0.22)'
                        : '1px solid rgba(27,34,54,1)',
                    }}
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
                      aria-expanded={isOpen}
                    >
                      <span className="font-semibold pr-4">{faq.q}</span>
                      <span
                        className="text-water shrink-0 transition-transform duration-300"
                        style={{ transform: isOpen ? 'rotate(45deg)' : 'none' }}
                        aria-hidden="true"
                      >
                        +
                      </span>
                    </button>
                    <div className={`faq-body ${isOpen ? 'open' : ''}`} aria-hidden={!isOpen}>
                      <div className="faq-body-inner px-5 pb-5">
                        <p className="text-muted leading-relaxed">{faq.a}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ─── Bottom CTA ─── */}
      <div className="section-divider" />
      <section className="py-20 lg:py-24">
        <div className="max-w-3xl mx-auto px-5 lg:px-8 text-center">
          <RevealOnScroll>
            <h2 className="text-4xl font-black mb-4">Start your weekly plan today.</h2>
            <p className="text-muted mb-8 text-lg">
              Pay on the 1st. Come in every week. Your car stays clean all month.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => openBooking('weekly_medium_full')}
                className="btn-primary px-8 py-4 rounded-full text-base font-bold cursor-pointer shimmer-btn"
              >
                Start a Weekly Plan
              </button>
              <Link
                href="/services"
                className="btn-ghost px-8 py-4 rounded-full text-base font-medium"
              >
                See Single Wash Prices
              </Link>
            </div>
            <p className="text-xs text-muted mt-5 font-mono">No contract · Cancel anytime · Square secure billing</p>
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
