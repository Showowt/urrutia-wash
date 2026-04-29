'use client';

import { useState } from 'react';
import Link from 'next/link';
import RevealOnScroll from '@/components/cinema/RevealOnScroll';
import BookingModal from '@/components/sections/BookingModal';

type ModalPreset = 'express' | 'classic' | 'detail' | 'ceramic' | null;

const SERVICES = [
  {
    id: 'express' as const,
    tier: 'EXPRESS',
    name: 'Hand Wash',
    price: '$35',
    priceNote: 'per vehicle',
    duration: '~30 minutes',
    color: 'water' as const,
    tagline: 'The daily driver standard.',
    description:
      'Our express hand wash is the foundation of everything we do. No machine brushes, no shared rags — every inch of your car is hand-washed by a trained detailer using premium pH-neutral soap, microfiber mitts, and clean water changed per vehicle. It&rsquo;s the wash that makes your car look like it just left the showroom floor.',
    includes: [
      'Full exterior hand wash with pH-neutral foam',
      'Two-bucket wash method (prevents swirl marks)',
      'Wheel wells and brake dust removal',
      'Tire dressing and shine',
      'Full hand-dry with clean microfiber towels',
      'Window cleaning (exterior)',
      'Door jamb wipe',
    ],
    addOns: [
      'Interior vacuum +$15',
      'Tire shine upgrade (gloss or satin) +$10',
      'Ceramic spray sealant +$25',
    ],
    memberBenefit: '1 wash credit deducted from SOLO or DUO membership',
    ctaLabel: 'Book Express Wash',
  },
  {
    id: 'classic' as const,
    tier: 'CLASSIC',
    name: 'Wash + Interior',
    price: '$75',
    priceNote: 'per vehicle',
    duration: '~50 minutes',
    color: 'water' as const,
    tagline: 'Inside and out. Done right.',
    description:
      'Vegas heat traps dust, pet hair, and odors in your interior faster than anywhere else in the country. Our Classic service tackles both surfaces simultaneously — while one detailer works the exterior, another cleans every crevice inside. You leave with a car that looks clean and feels clean.',
    includes: [
      'Everything in Express Hand Wash',
      'Full interior vacuum (seats, floors, trunk)',
      'Dashboard and console wipe-down',
      'Door panels and door pockets cleaned',
      'Center console interior',
      'Window cleaning (interior and exterior)',
      'Air vent dust removal',
    ],
    addOns: [
      'Leather conditioning +$30',
      'Pet hair removal +$25',
      'Odor elimination treatment +$20',
    ],
    memberBenefit: '2 wash credits deducted from SOLO or DUO membership',
    ctaLabel: 'Book Classic Wash',
  },
  {
    id: 'detail' as const,
    tier: 'PREMIUM',
    name: 'Full Detail',
    price: '$295',
    priceNote: 'starting',
    duration: '3–5 hours',
    color: 'flame' as const,
    popular: true,
    tagline: 'The full restoration.',
    description:
      'A full detail is not a wash — it&rsquo;s a transformation. We decontaminate the paint, correct surface-level defects, apply professional wax or sealant, and restore every interior surface to like-new condition. The vehicles that get detailed regularly hold their value. The vehicles that don&rsquo;t show their age at trade-in.',
    includes: [
      'Clay bar decontamination (removes embedded road fallout)',
      'Single-stage paint polish (removes light scratches and swirls)',
      'Hand wax + professional paint sealant (6-month protection)',
      'Deep interior shampoo (seats, carpet, floor mats)',
      'Leather cleaning and conditioning',
      'Engine bay cleaning and dressing',
      'Headlight polish and UV restoration',
      'Trim and plastic restoration',
      'Before/after photos delivered via SMS',
    ],
    addOns: [
      'Two-stage paint correction +$150',
      'Ceramic spray topper +$75',
      'Pet hair removal +$35',
      'Ozone odor elimination +$50',
    ],
    memberBenefit: 'SOLO members save $50 · DUO members save $75 · FLEET members save $100',
    ctaLabel: 'Book Full Detail',
  },
  {
    id: 'ceramic' as const,
    tier: 'PROTECTION',
    name: 'Ceramic Coating',
    price: '$895',
    priceNote: 'starting',
    duration: '1–2 days',
    color: 'water' as const,
    tagline: 'Semi-permanent protection for the desert.',
    description:
      'Ceramic coating is the highest level of paint protection available outside of paint protection film. A chemically bonded 9H-hardness layer bonds directly to your clear coat, creating a hydrophobic surface that repels UV radiation, alkaline road chemicals, bird etch, and the abrasive silica dust that makes Las Vegas the hardest city in the country to maintain a finish.',
    includes: [
      'Full decontamination wash',
      'Multi-stage paint correction (removes defects before coating)',
      '9H ceramic coating application (IGL, Gtechniq, or equivalent)',
      'UV protection layer',
      'Full hydrophobic treatment (self-cleaning effect)',
      'Wheel ceramic coating included',
      'Glass hydrophobic treatment',
      '2–5 year durability (single or multi-layer)',
      'Certificate of application',
      'Aftercare kit and instructions',
    ],
    addOns: [
      'Paint protection film (PPF) on high-impact zones — custom quote',
      'Interior fabric coating +$150',
      'Graphene top coat upgrade +$200',
    ],
    memberBenefit: 'FLEET members save $100 · All members receive free 6-month maintenance wash',
    ctaLabel: 'Get Ceramic Quote',
  },
];

const DESERT_POINTS = [
  {
    icon: '☀️',
    title: 'UV Radiation',
    body: 'Henderson receives over 294 days of sunshine annually. Unprotected paint oxidizes within 2–3 years. Our wax and ceramic applications are specifically rated for high-UV environments.',
  },
  {
    icon: '🌬',
    title: 'Silica Dust',
    body: 'Desert wind carries microscopic silica particles that micro-scratch clear coats on contact. We use pre-wash decontamination sprays that neutralize these abrasives before any wash mitt touches the paint.',
  },
  {
    icon: '🌧',
    title: 'Monsoon Debris',
    body: 'When June rains hit, they carry alkaline road minerals that etch clear coat on contact. Ceramic-treated cars bead water off before it can dwell. Untreated cars show water spots within 48 hours.',
  },
  {
    icon: '🧂',
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
              Four service tiers. One standard: the kind of hand-care that makes a $35 wash feel like a detailing appointment and a ceramic job protect your paint for years in the Mojave heat.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      <div className="section-divider" />

      {/* ─── Service Sections ─── */}
      {SERVICES.map((svc, i) => (
        <section
          key={svc.id}
          id={svc.id}
          className={`py-20 lg:py-28 ${i % 2 === 1 ? 'bg-surface' : ''}`}
        >
          <div className="max-w-7xl mx-auto px-5 lg:px-8">
            <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">

              {/* Left: info */}
              <div className={`lg:col-span-3 ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                <RevealOnScroll>
                  <p className={`font-mono text-xs tracking-widest mb-2 text-${svc.color}`}>
                    {svc.tier}
                  </p>
                  <div className="flex items-start gap-4 flex-wrap">
                    <h2 className="text-4xl lg:text-5xl font-black">{svc.name}</h2>
                    {svc.popular && (
                      <span className="ribbon-lux px-3 py-1 rounded-full text-[10px] font-black tracking-widest self-center">
                        MOST POPULAR
                      </span>
                    )}
                  </div>
                  <p className={`mt-2 text-lg font-semibold text-${svc.color}`}>{svc.tagline}</p>
                </RevealOnScroll>

                <RevealOnScroll delay={100}>
                  <p
                    className="mt-5 text-muted leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: svc.description }}
                  />
                </RevealOnScroll>

                <RevealOnScroll delay={150}>
                  <div className="mt-8">
                    <p className="font-mono text-[11px] tracking-widest text-muted mb-4">WHAT&rsquo;S INCLUDED</p>
                    <ul className="space-y-2.5">
                      {svc.includes.map((item, idx) => (
                        <li key={idx} className="flex gap-3 text-sm">
                          <span className={`text-${svc.color} mt-0.5 shrink-0`}>✓</span>
                          <span className="text-ink/85">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </RevealOnScroll>

                {svc.addOns.length > 0 && (
                  <RevealOnScroll delay={200}>
                    <div className="mt-6">
                      <p className="font-mono text-[11px] tracking-widest text-muted mb-3">POPULAR ADD-ONS</p>
                      <ul className="space-y-1.5">
                        {svc.addOns.map((a, idx) => (
                          <li key={idx} className="flex gap-3 text-sm text-muted">
                            <span className="text-muted/50 shrink-0">+</span>
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </RevealOnScroll>
                )}
              </div>

              {/* Right: price card */}
              <div className={`lg:col-span-2 ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                <RevealOnScroll variant="fade-left" delay={100}>
                  <div
                    className={`service-card rounded-2xl p-7 sticky top-24 ${
                      svc.popular
                        ? 'border-flame/50 bg-gradient-to-br from-flame/6 to-transparent'
                        : ''
                    }`}
                  >
                    <p className={`font-mono text-[11px] tracking-widest text-${svc.color} mb-2`}>
                      {svc.tier}
                    </p>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-5xl font-black price-gradient">{svc.price}</span>
                      <span className="text-muted text-sm">{svc.priceNote}</span>
                    </div>
                    <p className="text-xs text-muted font-mono mb-6 flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                      </svg>
                      {svc.duration}
                    </p>

                    <div className="hr-gradient mb-5" />

                    <div className="mb-6">
                      <p className="font-mono text-[10px] tracking-widest text-muted mb-2">MEMBER BENEFIT</p>
                      <p className="text-xs text-ink/80 leading-relaxed">{svc.memberBenefit}</p>
                    </div>

                    <button
                      onClick={() => openBooking(svc.id)}
                      className={`w-full py-3.5 rounded-xl text-sm font-bold cursor-pointer ${
                        svc.popular ? 'btn-primary' : 'btn-ghost'
                      }`}
                    >
                      {svc.ctaLabel}
                    </button>

                    <p className="text-center text-xs text-muted mt-3">
                      No deposit required · SMS confirmation
                    </p>
                  </div>
                </RevealOnScroll>
              </div>
            </div>
          </div>
          {i < SERVICES.length - 1 && <div className="section-divider mt-20 lg:mt-28" />}
        </section>
      ))}

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
                onClick={() => openBooking('express')}
                className="btn-primary px-8 py-4 rounded-full text-base font-bold cursor-pointer shimmer-btn"
              >
                Book My Wash
              </button>
              <Link
                href="/memberships"
                className="btn-ghost px-8 py-4 rounded-full text-base font-medium"
              >
                View Memberships
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
