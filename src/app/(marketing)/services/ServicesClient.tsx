'use client';

import { useState } from 'react';
import Link from 'next/link';
import RevealOnScroll from '@/components/cinema/RevealOnScroll';
import BookingModal from '@/components/sections/BookingModal';

type ModalPreset = 'small_exterior' | 'small_full' | 'medium_exterior' | 'medium_full' | 'large_exterior' | 'large_full' | 'detail' | null;

const SIZE_TIERS = [
  {
    size: 'SMALL',
    name: 'Sedans · Coupes · Compacts',
    color: 'water' as const,
    exteriorPrice: '$35',
    fullPrice: '$55',
    exteriorId: 'small_exterior' as const,
    fullId: 'small_full' as const,
    description:
      'Our foundation service for compact and mid-size sedans. Every inch is hand-washed with pH-neutral soap, microfiber mitts, and clean water changed per vehicle. Interior + Exterior adds full vacuum, dash wipe-down, door jambs, and interior window cleaning.',
    exteriorIncludes: [
      'Full exterior hand wash with pH-neutral foam',
      'Two-bucket wash method (prevents swirl marks)',
      'Wheel wells and brake dust removal',
      'Tire dressing and shine',
      'Full hand-dry with clean microfiber towels',
      'Window cleaning (exterior)',
      'Door jamb wipe',
    ],
    fullExtras: [
      'Full interior vacuum (seats, floors, trunk)',
      'Dashboard and console wipe-down',
      'Door panels and door pockets cleaned',
      'Window cleaning (interior)',
      'Air vent dust removal',
    ],
  },
  {
    size: 'MEDIUM',
    name: 'SUVs · Crossovers · Wagons',
    color: 'water' as const,
    exteriorPrice: '$40',
    fullPrice: '$65',
    exteriorId: 'medium_exterior' as const,
    fullId: 'medium_full' as const,
    description:
      'Mid-size SUVs, crossovers, and wagons require more surface area and longer wash time. Same premium hand-wash protocol, scaled for the larger body. Interior + Exterior includes the same deep interior treatment as small vehicles.',
    exteriorIncludes: [
      'Full exterior hand wash with pH-neutral foam',
      'Two-bucket wash method (prevents swirl marks)',
      'Wheel wells and brake dust removal',
      'Tire dressing and shine',
      'Full hand-dry with clean microfiber towels',
      'Window cleaning (exterior)',
      'Door jamb wipe',
    ],
    fullExtras: [
      'Full interior vacuum (seats, floors, trunk)',
      'Dashboard and console wipe-down',
      'Door panels and door pockets cleaned',
      'Window cleaning (interior)',
      'Air vent dust removal',
    ],
  },
  {
    size: 'LARGE',
    name: 'Trucks · Full-size SUVs · Vans',
    color: 'water' as const,
    exteriorPrice: '$45',
    fullPrice: '$75',
    exteriorId: 'large_exterior' as const,
    fullId: 'large_full' as const,
    description:
      'Full-size trucks, Escalades, Suburbans, Sprinter vans — the big rigs. Extra surface area means extra time and extra product. We treat these vehicles with the same zero-shortcut protocol as every other car on the lot.',
    exteriorIncludes: [
      'Full exterior hand wash with pH-neutral foam',
      'Two-bucket wash method (prevents swirl marks)',
      'Wheel wells and brake dust removal',
      'Tire dressing and shine',
      'Full hand-dry with clean microfiber towels',
      'Window cleaning (exterior)',
      'Door jamb wipe',
    ],
    fullExtras: [
      'Full interior vacuum (seats, floors, trunk/bed)',
      'Dashboard and console wipe-down',
      'Door panels and door pockets cleaned',
      'Window cleaning (interior)',
      'Air vent dust removal',
    ],
  },
];

const ADD_ONS = [
  { label: 'Deep wheel clean', price: '$15' },
  { label: 'Spray wax', price: '$25' },
  { label: 'Hand wax', price: '$55–$75' },
  { label: 'Leather conditioner', price: '$25–$35' },
  { label: 'Engine bay', price: '$45–$55' },
  { label: 'Shampoo', price: 'starting at $65' },
  { label: 'Headlight restoration', price: '$100 per set' },
];

const DETAIL_INCLUDES = [
  'Clay bar decontamination (removes embedded road fallout)',
  'Single-stage paint polish (removes light scratches and swirls)',
  'Hand wax + professional paint sealant (6-month protection)',
  'Deep interior shampoo (seats, carpet, floor mats)',
  'Leather cleaning and conditioning',
  'Engine bay cleaning and dressing',
  'Headlight polish and UV restoration',
  'Trim and plastic restoration',
  'Before/after photos delivered via SMS',
];

const DESERT_POINTS = [
  {
    icon: '\u2600\uFE0F',
    title: 'UV Radiation',
    body: 'Henderson receives over 294 days of sunshine annually. Unprotected paint oxidizes within 2\u20133 years. Our wax and ceramic applications are specifically rated for high-UV environments.',
  },
  {
    icon: '\uD83C\uDF2C',
    title: 'Silica Dust',
    body: 'Desert wind carries microscopic silica particles that micro-scratch clear coats on contact. We use pre-wash decontamination sprays that neutralize these abrasives before any wash mitt touches the paint.',
  },
  {
    icon: '\uD83C\uDF27',
    title: 'Monsoon Debris',
    body: 'When June rains hit, they carry alkaline road minerals that etch clear coat on contact. Ceramic-treated cars bead water off before it can dwell. Untreated cars show water spots within 48 hours.',
  },
  {
    icon: '\uD83E\uDDC2',
    title: 'Road Salt & Minerals',
    body: 'Nevada groundwater is high in calcium and magnesium. Our rinse protocols use pH-balanced water and spot-free drying to eliminate mineral staining that standard washes leave behind.',
  },
];

function Breadcrumb() {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-muted">
      <Link href="/" className="hover:text-ink transition-colors duration-200">Home</Link>
      <span aria-hidden="true">/</span>
      <span className="text-ink">Services</span>
    </nav>
  );
}

export default function ServicesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPreset, setModalPreset] = useState<ModalPreset>(null);

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
              HAND-FINISHED · NO SHORTCUTS
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={200}>
            <h1 className="mt-5 text-5xl lg:text-7xl font-black leading-none tracking-tight">
              <span className="text-gradient-luxury">Our</span>{' '}
              <span className="text-gradient-water">Services</span>
            </h1>
          </RevealOnScroll>
          <RevealOnScroll delay={300}>
            <p className="mt-6 text-lg text-muted max-w-2xl leading-relaxed">
              Pricing based on your vehicle size. Small cars from $35, medium from $40, large from $45. Add interior service or upgrade to a full detail. Every car gets the hand-care that Mojave heat demands.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      <div className="section-divider" />

      {/* ─── Size-Based Service Sections ─── */}
      {SIZE_TIERS.map((tier, i) => (
        <section
          key={tier.size}
          id={tier.size.toLowerCase()}
          className={`py-20 lg:py-28 ${i % 2 === 1 ? 'bg-surface' : ''}`}
        >
          <div className="max-w-7xl mx-auto px-5 lg:px-8">
            <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">

              {/* Left: info */}
              <div className={`lg:col-span-3 ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                <RevealOnScroll>
                  <p className={`font-mono text-xs tracking-widest mb-2 text-${tier.color}`}>
                    {tier.size} VEHICLES
                  </p>
                  <h2 className="text-4xl lg:text-5xl font-black">{tier.name}</h2>
                </RevealOnScroll>

                <RevealOnScroll delay={100}>
                  <p className="mt-5 text-muted leading-relaxed">{tier.description}</p>
                </RevealOnScroll>

                <RevealOnScroll delay={150}>
                  <div className="mt-8">
                    <p className="font-mono text-[11px] tracking-widest text-muted mb-4">EXTERIOR ONLY — WHAT&rsquo;S INCLUDED</p>
                    <ul className="space-y-2.5">
                      {tier.exteriorIncludes.map((item, idx) => (
                        <li key={idx} className="flex gap-3 text-sm">
                          <span className={`text-${tier.color} mt-0.5 shrink-0`}>✓</span>
                          <span className="text-ink/85">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </RevealOnScroll>

                <RevealOnScroll delay={200}>
                  <div className="mt-6">
                    <p className="font-mono text-[11px] tracking-widest text-muted mb-3">INTERIOR + EXTERIOR ADDS</p>
                    <ul className="space-y-1.5">
                      {tier.fullExtras.map((a, idx) => (
                        <li key={idx} className="flex gap-3 text-sm text-muted">
                          <span className="text-muted/50 shrink-0">+</span>
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                </RevealOnScroll>
              </div>

              {/* Right: price card */}
              <div className={`lg:col-span-2 ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                <RevealOnScroll variant="fade-left" delay={100}>
                  <div className="service-card rounded-2xl p-7 sticky top-24">
                    <p className={`font-mono text-[11px] tracking-widest text-${tier.color} mb-4`}>
                      {tier.size} VEHICLES
                    </p>

                    {/* Exterior price */}
                    <div className="mb-4">
                      <p className="text-xs text-muted font-mono mb-1">EXTERIOR ONLY</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black price-gradient">{tier.exteriorPrice}</span>
                        <span className="text-muted text-sm">per wash</span>
                      </div>
                    </div>

                    <div className="hr-gradient mb-4" />

                    {/* Full price */}
                    <div className="mb-6">
                      <p className="text-xs text-muted font-mono mb-1">INTERIOR + EXTERIOR</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black price-gradient">{tier.fullPrice}</span>
                        <span className="text-muted text-sm">per wash</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={() => openBooking(tier.exteriorId)}
                        className="w-full py-3.5 rounded-xl text-sm font-bold cursor-pointer btn-ghost"
                      >
                        Book Exterior — {tier.exteriorPrice}
                      </button>
                      <button
                        onClick={() => openBooking(tier.fullId)}
                        className="w-full py-3.5 rounded-xl text-sm font-bold cursor-pointer btn-primary"
                      >
                        Book Interior + Exterior — {tier.fullPrice}
                      </button>
                    </div>

                    <p className="text-center text-xs text-muted mt-3">
                      No deposit required · SMS confirmation
                    </p>
                  </div>
                </RevealOnScroll>
              </div>
            </div>
          </div>
          {i < SIZE_TIERS.length - 1 && <div className="section-divider mt-20 lg:mt-28" />}
        </section>
      ))}

      {/* ─── Full Detail Section ─── */}
      <div className="section-divider" />
      <section id="detail" className="py-20 lg:py-28 bg-surface">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-3">
              <RevealOnScroll>
                <p className="font-mono text-xs tracking-widest mb-2 text-flame">PREMIUM</p>
                <div className="flex items-start gap-4 flex-wrap">
                  <h2 className="text-4xl lg:text-5xl font-black">Full Detail</h2>
                  <span className="ribbon-lux px-3 py-1 rounded-full text-[10px] font-black tracking-widest self-center">
                    MOST POPULAR
                  </span>
                </div>
                <p className="mt-2 text-lg font-semibold text-flame">The full restoration.</p>
              </RevealOnScroll>

              <RevealOnScroll delay={100}>
                <p className="mt-5 text-muted leading-relaxed">
                  A full detail is not a wash &mdash; it&rsquo;s a transformation. We decontaminate the paint, correct surface-level defects, apply professional wax or sealant, and restore every interior surface to like-new condition. The vehicles that get detailed regularly hold their value. The vehicles that don&rsquo;t show their age at trade-in.
                </p>
              </RevealOnScroll>

              <RevealOnScroll delay={150}>
                <div className="mt-8">
                  <p className="font-mono text-[11px] tracking-widest text-muted mb-4">WHAT&rsquo;S INCLUDED</p>
                  <ul className="space-y-2.5">
                    {DETAIL_INCLUDES.map((item, idx) => (
                      <li key={idx} className="flex gap-3 text-sm">
                        <span className="text-flame mt-0.5 shrink-0">✓</span>
                        <span className="text-ink/85">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealOnScroll>
            </div>

            <div className="lg:col-span-2">
              <RevealOnScroll variant="fade-left" delay={100}>
                <div
                  className="service-card rounded-2xl p-7 sticky top-24"
                  style={{
                    borderColor: 'rgba(255,107,26,0.5)',
                    background: 'linear-gradient(160deg, rgba(255,107,26,0.06) 0%, rgba(255,107,26,0.01) 60%, transparent 100%)',
                  }}
                >
                  <p className="font-mono text-[11px] tracking-widest text-flame mb-2">PREMIUM</p>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-5xl font-black price-gradient">$295</span>
                    <span className="text-muted text-sm">starting</span>
                  </div>
                  <p className="text-xs text-muted font-mono mb-6 flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                    </svg>
                    3–5 hours
                  </p>

                  <div className="hr-gradient mb-5" />

                  <button
                    onClick={() => openBooking('detail')}
                    className="w-full py-3.5 rounded-xl text-sm font-bold cursor-pointer btn-primary"
                  >
                    Book Full Detail
                  </button>

                  <p className="text-center text-xs text-muted mt-3">
                    No deposit required · SMS confirmation
                  </p>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Add-Ons Section ─── */}
      <div className="section-divider" />
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <RevealOnScroll className="max-w-2xl mb-12">
            <p className="font-mono text-xs text-water tracking-widest mb-3">ENHANCEMENTS</p>
            <h2 className="text-3xl lg:text-4xl font-bold">Add-ons for any wash.</h2>
            <p className="mt-3 text-muted">Available with any service. Just ask your detailer or add at booking.</p>
          </RevealOnScroll>

          <RevealOnScroll>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {ADD_ONS.map((addon) => (
                <div
                  key={addon.label}
                  className="card rounded-2xl p-5 flex items-center justify-between"
                >
                  <span className="text-sm font-medium">{addon.label}</span>
                  <span className="font-mono text-sm text-water font-bold ml-3 shrink-0">{addon.price}</span>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ─── Desert Conditions Callout ─── */}
      <div className="section-divider" />
      <section className="py-20 lg:py-28 bg-surface">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <RevealOnScroll className="max-w-2xl mb-12">
            <p className="font-mono text-xs text-flame tracking-widest mb-3">BUILT FOR THE MOJAVE</p>
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
              Desert conditions demand desert protocols.
            </h2>
            <p className="mt-4 text-muted text-lg">
              Most car washes are designed for mild climates. Henderson is not a mild climate. Every product we use, every protocol we follow is chosen for the specific conditions your car lives in.
            </p>
          </RevealOnScroll>

          <div className="grid sm:grid-cols-2 gap-4">
            {DESERT_POINTS.map((point, i) => (
              <RevealOnScroll key={i} delay={i * 80}>
                <div className="desert-card rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <span className="text-2xl" role="img" aria-label={point.title}>{point.icon}</span>
                    <div>
                      <h3 className="font-bold mb-2">{point.title}</h3>
                      <p className="text-muted text-sm leading-relaxed">{point.body}</p>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Bottom CTA ─── */}
      <section className="py-20 lg:py-24">
        <div className="max-w-3xl mx-auto px-5 lg:px-8 text-center">
          <RevealOnScroll>
            <h2 className="text-4xl font-black mb-4">Ready to book?</h2>
            <p className="text-muted mb-8 text-lg">
              Drop the keys. We handle everything else. SMS confirmation in under a minute.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => openBooking('small_exterior')}
                className="btn-primary px-8 py-4 rounded-full text-base font-bold cursor-pointer shimmer-btn"
              >
                Book My Wash
              </button>
              <Link
                href="/memberships"
                className="btn-ghost px-8 py-4 rounded-full text-base font-medium"
              >
                View Weekly Plans
              </Link>
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
