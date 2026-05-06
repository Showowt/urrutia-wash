'use client';

import { useState } from 'react';
import Link from 'next/link';
import RevealOnScroll from '@/components/cinema/RevealOnScroll';
import BookingModal from '@/components/sections/BookingModal';

type BillingCycle = 'monthly' | 'annual';
type ModalPreset = 'solo' | 'duo' | 'fleet';

const PRICES = {
  solo:  { monthly: 89,  annual: 76 },
  duo:   { monthly: 149, annual: 127 },
  fleet: { monthly: 279, annual: 237 },
} as const;

const TIERS = [
  {
    id: 'solo' as const,
    tier: 'TIER 01',
    name: 'SOLO',
    tagline: 'One driver. One car.',
    color: 'water',
    highlighted: false,
    features: {
      washes: '4 hand washes / month',
      vehicles: '1 vehicle',
      detailDiscount: '10% off all detail packages',
      booking: 'Priority booking slots',
      interior: 'Free interior wipe-down on every wash',
      loyalty: '10th wash free (auto-tracked by plate)',
      wallet: '—',
      sameDay: '—',
      mobile: '—',
      manager: '—',
    },
  },
  {
    id: 'duo' as const,
    tier: 'TIER 02',
    name: 'DUO',
    tagline: 'Two cars. One household. One bill.',
    color: 'water',
    highlighted: true,
    badge: 'RECOMMENDED',
    features: {
      washes: '8 hand washes / month (2 cars)',
      vehicles: '2 vehicles',
      detailDiscount: '15% off all detail packages',
      booking: 'Same-day booking guarantee',
      interior: 'Free interior shampoo quarterly',
      loyalty: '10th wash free (both vehicles)',
      wallet: 'Apple Wallet pass included',
      sameDay: 'Same-day availability',
      mobile: '—',
      manager: '—',
    },
  },
  {
    id: 'fleet' as const,
    tier: 'TIER 03',
    name: 'FLEET',
    tagline: 'Unlimited washes. Up to 4 vehicles.',
    color: 'flame',
    highlighted: false,
    features: {
      washes: 'Unlimited hand washes',
      vehicles: 'Up to 4 vehicles',
      detailDiscount: '20% off all detail packages',
      booking: 'Priority + same-day booking',
      interior: 'Free interior shampoo monthly',
      loyalty: 'Every 10th wash free (all vehicles)',
      wallet: 'Apple Wallet pass included',
      sameDay: 'Same-day availability',
      mobile: '—',
      manager: 'Dedicated account manager',
    },
  },
];

const COMPARE_ROWS = [
  { label: 'Washes per month', key: 'washes' as const },
  { label: 'Vehicles covered', key: 'vehicles' as const },
  { label: 'Detail discount', key: 'detailDiscount' as const },
  { label: 'Priority booking', key: 'booking' as const },
  { label: 'Interior service', key: 'interior' as const },
  { label: 'Loyalty program', key: 'loyalty' as const },
  { label: 'Apple Wallet pass', key: 'wallet' as const },
  { label: 'Same-day booking', key: 'sameDay' as const },
  { label: 'Account manager', key: 'manager' as const },
];

const MEMBERSHIP_FAQS = [
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. No contracts, no cancellation fees. Cancel from the member app or email us. Your membership stays active through the end of the billing period you already paid for.',
  },
  {
    q: 'What happens to unused washes?',
    a: 'Unused washes do not roll over to the next month — this is standard in the industry. The value is designed around the assumption you use your membership regularly. If you miss a month, pause it instead.',
  },
  {
    q: 'Can I pause my membership?',
    a: 'Yes. Pause for up to 90 days per year. Billing pauses, your account stays active, and you resume where you left off. Great for travel or extended trips.',
  },
  {
    q: 'How does the 10th wash free work?',
    a: 'We track every wash by your license plate. When you hit 10, your account is automatically credited for one free wash — you get an SMS the moment it lands. No stamp card to carry.',
  },
  {
    q: 'Can I add vehicles to my plan?',
    a: 'SOLO covers 1 vehicle. DUO covers 2. FLEET covers up to 4. To add a vehicle mid-cycle, upgrade your plan — the prorated difference is charged immediately.',
  },
  {
    q: 'Do membership washes cover the full detail or ceramic?',
    a: 'Membership washes cover Express Hand Wash (1 credit) and Wash + Interior (2 credits) for SOLO and DUO. Full Detail and Ceramic are billed separately but receive the member discount (10/15/20% depending on tier).',
  },
  {
    q: 'How does annual billing work?',
    a: 'Annual billing charges 12 months upfront at a 15% discount. If you cancel an annual plan early, you receive a prorated refund for unused full months minus any washes already used.',
  },
];

function Breadcrumb() {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-muted">
      <Link href="/" className="hover:text-ink transition-colors duration-200">Home</Link>
      <span aria-hidden="true">/</span>
      <span className="text-ink">Memberships</span>
    </nav>
  );
}

export default function MembershipsPage() {
  const [billing, setBilling] = useState<BillingCycle>('monthly');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPreset, setModalPreset] = useState<ModalPreset>('solo');
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
              URRUTIA CLUB · CANCEL ANYTIME
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={200}>
            <h1 className="mt-5 text-5xl lg:text-7xl font-black leading-none tracking-tight">
              <span className="text-gradient-luxury">Membership</span>
            </h1>
          </RevealOnScroll>
          <RevealOnScroll delay={300}>
            <p className="mt-6 text-lg text-muted max-w-2xl leading-relaxed">
              Members skip the booking friction. Priority slots, locked-in pricing, automatic punch tracking, and a clean car waiting every time you leave LVAC.
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
                <span className="text-ink font-semibold">200+</span> Henderson drivers are already members
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <div className="section-divider" />

      {/* ─── Billing Toggle + Cards ─── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">

          {/* Toggle */}
          <RevealOnScroll className="flex justify-center mb-10">
            <div className="inline-flex items-center gap-1 p-1 bg-surface-2 border border-line rounded-full">
              {(['monthly', 'annual'] as BillingCycle[]).map((cycle) => (
                <button
                  key={cycle}
                  onClick={() => setBilling(cycle)}
                  aria-pressed={billing === cycle}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                    billing === cycle
                      ? 'bg-white text-[#08101F] shadow-md'
                      : 'text-muted hover:text-ink'
                  }`}
                >
                  {cycle === 'monthly' ? 'Monthly' : 'Annual'}
                  {cycle === 'annual' && (
                    <span
                      className={`font-mono text-[10px] font-bold ${
                        billing === 'annual' ? 'text-flame' : 'savings-badge'
                      }`}
                    >
                      SAVE 15%
                    </span>
                  )}
                </button>
              ))}
            </div>
          </RevealOnScroll>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-5">
            {TIERS.map((tier, i) => {
              const price = PRICES[tier.id][billing];
              const savings = billing === 'annual'
                ? (PRICES[tier.id].monthly - PRICES[tier.id].annual) * 12
                : 0;

              return (
                <RevealOnScroll key={tier.id} delay={i * 100}>
                  <div
                    className={`rounded-2xl p-7 flex flex-col h-full relative ${
                      tier.highlighted
                        ? 'duo-glow'
                        : 'card'
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
                      {tier.tier}
                    </p>
                    <h2 className="text-3xl font-black mb-1">{tier.name}</h2>
                    <p className="text-sm text-muted mb-6">{tier.tagline}</p>

                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-5xl font-black price-gradient">${price}</span>
                      <span className="text-muted text-sm">/ mo</span>
                    </div>
                    <div className="min-h-[24px] mb-8">
                      {billing === 'annual' && savings > 0 ? (
                        <p className="text-xs font-mono">
                          <span className="savings-badge font-bold">Save ${savings}/yr</span>
                          {' '}· billed annually
                        </p>
                      ) : (
                        <p className="text-xs text-muted font-mono">billed monthly · cancel anytime</p>
                      )}
                    </div>

                    <ul className="space-y-3 text-sm flex-1 mb-8">
                      {Object.entries(tier.features).map(([key, val]) => {
                        if (val === '—') return null;
                        return (
                          <li key={key} className="flex gap-3">
                            <span className={`text-${tier.color} shrink-0 mt-0.5`}>→</span>
                            <span>{val}</span>
                          </li>
                        );
                      })}
                    </ul>

                    <button
                      onClick={() => openBooking(tier.id)}
                      className={`w-full py-3.5 rounded-xl text-sm font-bold cursor-pointer ${
                        tier.highlighted ? 'btn-primary' : 'btn-ghost'
                      }`}
                    >
                      Start {tier.name}
                    </button>
                    <p className="text-center text-xs text-muted mt-3">No contract · Pause or cancel anytime</p>
                  </div>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ─── Full Comparison Table ─── */}
      <section className="py-20 lg:py-24 bg-surface">
        <div className="max-w-5xl mx-auto px-5 lg:px-8">
          <RevealOnScroll className="mb-12">
            <p className="font-mono text-xs text-water tracking-widest mb-3">FULL COMPARISON</p>
            <h2 className="text-3xl lg:text-4xl font-bold">Everything side by side.</h2>
          </RevealOnScroll>

          <RevealOnScroll>
            <div className="card rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line">
                    <th className="text-left p-5 text-muted font-mono text-[11px] tracking-widest w-1/3 lg:w-2/5">
                      FEATURE
                    </th>
                    {TIERS.map((t) => (
                      <th key={t.id} className="text-center p-5 font-black text-base">
                        <span className={`text-gradient-${t.highlighted ? 'water' : 'luxury'}`}>
                          {t.name}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_ROWS.map((row, i) => (
                    <tr
                      key={row.key}
                      className={`border-b border-line/50 ${i % 2 === 0 ? '' : 'bg-white/[0.012]'}`}
                    >
                      <td className="p-5 text-muted">{row.label}</td>
                      {TIERS.map((t) => {
                        const val = t.features[row.key];
                        return (
                          <td key={t.id} className="p-5 text-center text-xs">
                            {val === '—' ? (
                              <span className="text-muted/30">—</span>
                            ) : (
                              <span className="text-ink/85">{val}</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  {/* Price row */}
                  <tr>
                    <td className="p-5 font-semibold">Monthly price</td>
                    {TIERS.map((t) => (
                      <td key={t.id} className="p-5 text-center">
                        <span className="font-black price-gradient text-lg">${PRICES[t.id][billing]}</span>
                        <span className="text-muted text-xs"> /mo</span>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <div className="section-divider" />

      {/* ─── FAQ ─── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-3xl mx-auto px-5 lg:px-8">
          <RevealOnScroll className="mb-12">
            <p className="font-mono text-xs text-water tracking-widest mb-3">MEMBERSHIP FAQ</p>
            <h2 className="text-3xl lg:text-4xl font-bold">Questions about membership.</h2>
          </RevealOnScroll>

          <RevealOnScroll>
            <div className="space-y-3">
              {MEMBERSHIP_FAQS.map((faq, i) => {
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
            <h2 className="text-4xl font-black mb-4">Start your membership today.</h2>
            <p className="text-muted mb-8 text-lg">
              First month is full-price. After that, your car is clean on a schedule. Pause or cancel whenever.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => openBooking('duo')}
                className="btn-primary px-8 py-4 rounded-full text-base font-bold cursor-pointer shimmer-btn"
              >
                Start DUO — $149/mo
              </button>
              <Link
                href="/services"
                className="btn-ghost px-8 py-4 rounded-full text-base font-medium"
              >
                See All Services
              </Link>
            </div>
            <p className="text-xs text-muted mt-5 font-mono">No contract · Pause or cancel anytime · Square secure billing</p>
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
