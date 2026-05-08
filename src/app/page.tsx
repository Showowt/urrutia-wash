import Image from 'next/image';
import SiteNav from '@/components/sections/SiteNav';
import PromoBanner from '@/components/sections/PromoBanner';
import HeroCtas from '@/components/sections/HeroCtas';
import ServicesSection from '@/components/sections/ServicesSection';
import MembershipSection from '@/components/sections/MembershipSection';
import LocationSection from '@/components/sections/LocationSection';
import FaqSection from '@/components/sections/FaqSection';
import FinalCta from '@/components/sections/FinalCta';
import PhotoShowcase from '@/components/sections/PhotoShowcase';
import ReviewsSection from '@/components/sections/ReviewsSection';
import RevealOnScroll from '@/components/cinema/RevealOnScroll';
// Preloader disabled — video autoplay blocked on most browsers
// import Preloader from '@/components/cinema/Preloader';
import HeroHeadline from '@/components/cinema/HeroHeadline';
import StatsCounter from '@/components/cinema/StatsCounter';
import GalleryGrid from '@/components/sections/GalleryGrid';
import JsonLd, { type SchemaInput } from '@/components/seo/JsonLd';

// ─── Schema.org structured data ───────────────────────────────────────────────
const BUSINESS_ADDRESS = {
  streetAddress: '1195 Wellness Pl',
  addressLocality: 'Henderson',
  addressRegion: 'NV',
  postalCode: '89011',
  addressCountry: 'US',
};

const BUSINESS_URL = 'https://www.washduringworkout.com';
const BUSINESS_IMAGE = `${BUSINESS_URL}/gallery/brabus-g63-sunset.jpg`;
const BUSINESS_PHONE = '+1-702-326-4101';
const OPENING_HOURS = [
  'Mo 08:00-17:00',
  'Tu 08:00-17:00',
  'We 08:00-17:00',
  'Th 08:00-17:00',
  'Fr 08:00-17:00',
  'Sa 08:00-17:00',
];

const homepageSchemas: SchemaInput[] = [
  {
    type: 'LocalBusiness',
    name: 'LVAC Carwash and Detailing',
    description:
      'Premium hand wash and auto detailing at LVAC Henderson. Express washes, full details, and ceramic coating — while you train.',
    url: BUSINESS_URL,
    telephone: BUSINESS_PHONE,
    address: BUSINESS_ADDRESS,
    geo: { latitude: 36.0211, longitude: -115.0707 },
    openingHours: OPENING_HOURS,
    priceRange: '$$',
    image: BUSINESS_IMAGE,
    sameAs: [
      'https://www.instagram.com/lvacwashndetail',
      'https://maps.google.com/?cid=LVAC+Carwash+and+Detailing',
    ],
  },
  {
    type: 'AutoRepair',
    name: 'LVAC Carwash and Detailing',
    description:
      'Premium hand wash, interior detail, paint correction, and ceramic coating services in Henderson, NV.',
    url: BUSINESS_URL,
    telephone: BUSINESS_PHONE,
    address: BUSINESS_ADDRESS,
    openingHours: OPENING_HOURS,
    priceRange: '$$',
    image: BUSINESS_IMAGE,
    hasOfferCatalog: {
      name: 'Car Wash & Detail Services',
      itemListElement: [
        {
          name: 'Small Car — Exterior Only',
          description: 'Full exterior hand wash, wheels, tires, hand dry.',
          price: '35',
          priceCurrency: 'USD',
        },
        {
          name: 'Small Car — Interior + Exterior',
          description: 'Exterior hand wash plus full interior vacuum, wipe-down, and glass clean.',
          price: '55',
          priceCurrency: 'USD',
        },
        {
          name: 'Medium Car — Exterior Only',
          description: 'Full exterior hand wash for SUVs and crossovers.',
          price: '40',
          priceCurrency: 'USD',
        },
        {
          name: 'Medium Car — Interior + Exterior',
          description: 'Exterior hand wash plus full interior for SUVs and crossovers.',
          price: '65',
          priceCurrency: 'USD',
        },
        {
          name: 'Large Car — Exterior Only',
          description: 'Full exterior hand wash for trucks and full-size SUVs.',
          price: '45',
          priceCurrency: 'USD',
        },
        {
          name: 'Large Car — Interior + Exterior',
          description: 'Exterior hand wash plus full interior for trucks and full-size SUVs.',
          price: '75',
          priceCurrency: 'USD',
        },
        {
          name: 'Full Detail',
          description:
            'Complete paint decontamination, interior deep clean, leather conditioning, and paint sealant.',
          price: '295',
          priceCurrency: 'USD',
        },
      ],
    },
  },
  {
    type: 'AggregateRating',
    itemReviewed: { name: 'LVAC Carwash and Detailing', url: BUSINESS_URL },
    ratingValue: 4.7,
    bestRating: 5,
    worstRating: 1,
    reviewCount: 27,
  },
  {
    type: 'FAQPage',
    questions: [
      {
        question: 'Where is LVAC Carwash and Detailing located?',
        answer:
          'We are located at 1195 Wellness Pl, Henderson, NV 89011 — inside the LVAC (Las Vegas Athletic Club) parking area.',
      },
      {
        question: 'What are your hours?',
        answer: 'We are open Monday through Saturday from 8:00 AM to 5:00 PM. We are closed on Sundays at this location.',
      },
      {
        question: 'Do you have a first-wash discount?',
        answer:
          'Yes! New customers get 10% off their first wash plus a free spray wax. Enter your phone number in the promo banner at the top of the site to unlock your code.',
      },
      {
        question: 'How does the LVAC drop-off service work?',
        answer:
          'Park at LVAC Henderson, hand your keys to your detailer, and work out. We send you an SMS with before/after photos the moment your car is ready. Walk out to a clean car.',
      },
      {
        question: 'Do you offer weekly plans?',
        answer:
          'Yes. We offer weekly wash plans priced by vehicle size: Small from $120/mo, Medium from $130/mo, Large from $150/mo. Each plan includes 4 washes per month, paid upfront on the 1st.',
      },
      {
        question: 'How much is a full detail?',
        answer:
          'Full detail starts at $295. This includes clay bar decontamination, hand wax, deep interior shampoo, leather conditioning, engine bay cleaning, and before/after photos.',
      },
    ],
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* ─── Structured data ─── */}
      <JsonLd schemas={homepageSchemas} />

      {/* Preloader removed — was blocking page load */}

      {/* ─── Promo Banner ─── */}
      <PromoBanner />

      {/* ─── Navigation ─── */}
      <SiteNav />

      {/* ─── Hero ─── */}
      <section
        id="top"
        className="relative min-h-screen flex flex-col justify-center pt-16 pb-0 overflow-hidden"
      >
        {/* Brabus background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/gallery/brabus-g63-sunset.jpg"
            alt="Brabus G63 AMG at sunset — Urrutia Car Wash"
            fill
            priority
            quality={90}
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
          />
          {/* Dark overlay: bottom-weighted so headline reads clearly */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, rgba(5,8,16,0.75) 0%, rgba(5,8,16,0.55) 40%, rgba(5,8,16,0.82) 80%, #050810 100%)',
            }}
          />
          {/* Vignette */}
          <div className="absolute inset-0 hero-vignette" />
        </div>

        {/* Film grain overlay */}
        <div className="film-grain absolute inset-0 z-[1] pointer-events-none" aria-hidden="true" />

        {/* Hero content */}
        <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10 pt-20 lg:pt-28 pb-16">
          {/* Eyebrow */}
          <RevealOnScroll>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-water/25 bg-water/5 text-xs font-mono text-water mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-water pulse-ring" aria-hidden="true" />
              PREMIUM HAND CARE · LVAC HENDERSON
            </div>
          </RevealOnScroll>

          {/* Headline — animated word-by-word */}
          <HeroHeadline />

          <RevealOnScroll delay={300}>
            <p className="text-lg sm:text-xl text-muted max-w-2xl leading-relaxed mb-10" style={{ maxWidth: '36rem' }}>
              Park at LVAC Henderson. We hand-wash and detail your car while you train. Get an SMS the
              moment it&rsquo;s ready. Walk out to clean.
            </p>
          </RevealOnScroll>

          {/* Hero CTAs + scroll indicator */}
          <HeroCtas />

          {/* Trust strip — horizontally scrollable on mobile */}
          <div className="mt-12">
            <div className="trust-strip flex-wrap sm:flex-nowrap items-center gap-x-8 gap-y-3 font-mono text-xs text-muted">
              <span className="flex items-center gap-2 shrink-0">
                <span className="w-1 h-1 rounded-full bg-success" aria-hidden="true" />
                OPEN MON–SAT 8:00–5:00
              </span>
              <span className="flex items-center gap-2 shrink-0">
                <span className="w-1 h-1 rounded-full bg-water" aria-hidden="true" />
                10% OFF FIRST WASH
              </span>
              <span className="flex items-center gap-2 shrink-0">
                <span className="w-1 h-1 rounded-full bg-flame" aria-hidden="true" />
                WASHES FROM $35
              </span>
              <span className="flex items-center gap-2 shrink-0">
                <span className="w-1 h-1 rounded-full bg-ink" aria-hidden="true" />
                FULL DETAIL $295
              </span>
            </div>
          </div>
        </div>

        {/* Marquee — pinned to bottom of hero */}
        <div
          className="relative z-10 border-y border-line/40 py-6 overflow-hidden"
          style={{ background: 'rgba(5,8,16,0.7)', backdropFilter: 'blur(8px)' }}
          aria-hidden="true"
        >
          <div className="flex marquee-track whitespace-nowrap text-muted font-mono text-sm tracking-widest gap-12 px-8">
            {[0, 1].map(i => (
              <div key={i} className="flex gap-12 shrink-0">
                <span>ROLLS-ROYCE CULLINAN</span><span className="text-water/30">·</span>
                <span>G63 AMG BRABUS</span><span className="text-water/30">·</span>
                <span>CORVETTE C8</span><span className="text-water/30">·</span>
                <span>BMW M4</span><span className="text-water/30">·</span>
                <span>FORD RAPTOR</span><span className="text-water/30">·</span>
                <span>PORSCHE 993</span><span className="text-water/30">·</span>
                <span>CADILLAC ESCALADE</span><span className="text-water/30">·</span>
                <span>FORD F-450 PLATINUM</span><span className="text-water/30">·</span>
                <span>ROLLS-ROYCE GHOST</span><span className="text-water/30">·</span>
                <span>INDIAN SCOUT</span><span className="text-water/30">·</span>
                <span>&apos;64 IMPALA</span><span className="text-water/30">·</span>
                <span>SUBARU WRX STI</span><span className="text-water/30 mr-12">·</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section divider */}
      <div className="section-divider" />

      {/* ─── How It Works ─── */}
      <section id="process" className="py-24 lg:py-36 relative">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <RevealOnScroll className="max-w-2xl mb-16">
            <p className="font-mono text-xs text-water tracking-widest mb-3">01 — HOW IT WORKS</p>
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
              Your car gets clean while you do.
            </h2>
          </RevealOnScroll>

          <div className="grid md:grid-cols-3 gap-5">
            {/* Step 1 */}
            <RevealOnScroll>
              <div className="card rounded-2xl p-7 h-full">
                <div className="w-11 h-11 rounded-xl bg-water/8 border border-water/25 grid place-items-center mb-5">
                  <svg
                    className="w-5 h-5 text-water"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M3 13l7-7 4 4 7-7" />
                    <path d="M14 3h7v7" />
                  </svg>
                </div>
                <p className="font-mono text-xs text-muted mb-2">STEP 01</p>
                <h3 className="text-xl font-semibold mb-3">Drop Off</h3>
                <p className="text-muted leading-relaxed">
                  Park at LVAC Henderson. Hand the keys to your detailer. Hit the gym. We&rsquo;ll text
                  you the moment your car is ready.
                </p>
              </div>
            </RevealOnScroll>

            {/* Step 2 */}
            <RevealOnScroll delay={100}>
              <div className="card rounded-2xl p-7 h-full">
                <div className="w-11 h-11 rounded-xl bg-water/8 border border-water/25 grid place-items-center mb-5">
                  <svg
                    className="w-5 h-5 text-water"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </div>
                <p className="font-mono text-xs text-muted mb-2">STEP 02</p>
                <h3 className="text-xl font-semibold mb-3">Train</h3>
                <p className="text-muted leading-relaxed">
                  Get your workout in. Take a meeting. Run an errand. Your car is in expert
                  hands &mdash; 100% hand wash, premium product, zero shortcuts.
                </p>
              </div>
            </RevealOnScroll>

            {/* Step 3 */}
            <RevealOnScroll delay={200}>
              <div className="card rounded-2xl p-7 h-full">
                <div className="w-11 h-11 rounded-xl bg-flame/8 border border-flame/25 grid place-items-center mb-5">
                  <svg
                    className="w-5 h-5 text-flame"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <p className="font-mono text-xs text-muted mb-2">STEP 03</p>
                <h3 className="text-xl font-semibold mb-3">Drive</h3>
                <p className="text-muted leading-relaxed">
                  We text you the moment your car is ready &mdash; with before/after photos. Walk
                  out, get in, drive off. No waiting. No friction.
                </p>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* ─── Photo showcase strip ─── */}
      <PhotoShowcase />

      {/* Section divider */}
      <div className="section-divider" />

      {/* ─── Services ─── */}
      <ServicesSection />

      {/* Section divider */}
      <div className="section-divider" />

      {/* ─── Membership + Punch Card ─── */}
      <MembershipSection />

      {/* Section divider */}
      <div className="section-divider" />

      {/* ─── Gallery ─── */}
      <section id="gallery" className="py-24 lg:py-36 bg-surface border-y border-line relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <RevealOnScroll className="max-w-2xl mb-12">
            <p className="font-mono text-xs text-water tracking-widest mb-3">04 — THE WORK</p>
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
              From daily drivers to seven-figure builds.
            </h2>
            <p className="mt-4 text-muted text-lg">
              Cullinans, G-Wagons, Raptors, F-450s, M-cars. Owners trust URRUTIA because the
              work shows up the same way every time.
            </p>
          </RevealOnScroll>

          <RevealOnScroll>
            <GalleryGrid />
          </RevealOnScroll>

          <div className="mt-8 flex justify-center">
            <a
              href="/gallery"
              className="btn-ghost px-6 py-3 rounded-full text-sm flex items-center gap-2"
            >
              View Full Gallery
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Section divider */}
      <div className="section-divider" />

      {/* ─── Stats strip ─── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <RevealOnScroll>
            <StatsCounter />
          </RevealOnScroll>

          {/* Google Reviews social proof */}
          <RevealOnScroll delay={200}>
            <div className="mt-16 flex justify-center">
              <div
                className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {/* Google G icon */}
                <div className="flex items-center gap-1">
                  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-black text-ink">4.7</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4].map(i => (
                      <svg key={i} viewBox="0 0 20 20" width="16" height="16" fill="#FBBC05" aria-hidden="true">
                        <path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.27l-4.77 2.51.91-5.32L2.27 6.69l5.34-.78z" />
                      </svg>
                    ))}
                    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
                      <defs>
                        <linearGradient id="half-star">
                          <stop offset="70%" stopColor="#FBBC05" />
                          <stop offset="70%" stopColor="#1B2236" />
                        </linearGradient>
                      </defs>
                      <path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.27l-4.77 2.51.91-5.32L2.27 6.69l5.34-.78z" fill="url(#half-star)" />
                    </svg>
                  </div>
                </div>

                <div className="w-px h-8 bg-line" />

                <div>
                  <p className="text-sm font-semibold text-ink">27 Reviews</p>
                  <p className="text-[10px] font-mono text-muted tracking-wide">GOOGLE VERIFIED</p>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Section divider */}
      <div className="section-divider" />

      {/* ─── Reviews ─── */}
      <ReviewsSection />

      {/* Section divider */}
      <div className="section-divider" />

      {/* ─── Location ─── */}
      <LocationSection />

      {/* Section divider */}
      <div className="section-divider" />

      {/* ─── FAQ ─── */}
      <FaqSection />

      {/* Section divider */}
      <div className="section-divider" />

      {/* ─── Final CTA ─── */}
      <FinalCta />

      {/* ─── Footer ─── */}
      <footer className="border-t border-line">
        {/* Main footer grid */}
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-16 grid md:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-full overflow-hidden shrink-0" style={{ boxShadow: '0 0 16px rgba(0,180,255,0.3)' }}>
                <img src="/video/logo-poster.jpg" alt="URRUTIA" width={36} height={36} className="w-full h-full object-cover" />
              </div>
              <span className="wordmark text-lg">URRUTIA</span>
            </div>
            <p className="text-sm text-muted leading-relaxed mb-6">
              Premium hand wash and detailing at LVAC Henderson.
              Your car gets clean while you do.
            </p>
            <a
              href="https://instagram.com/lvacwashndetail"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted hover:text-water transition"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.81.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.81-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.81-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.81.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.34 4.14.63a5.85 5.85 0 0 0-2.13 1.38A5.85 5.85 0 0 0 .63 4.14C.34 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.27 2.15.56 2.91a5.85 5.85 0 0 0 1.38 2.13 5.85 5.85 0 0 0 2.13 1.38c.76.29 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.27 2.91-.56a5.85 5.85 0 0 0 2.13-1.38 5.85 5.85 0 0 0 1.38-2.13c.29-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.27-2.15-.56-2.91a5.85 5.85 0 0 0-1.38-2.13A5.85 5.85 0 0 0 19.86.63c-.76-.29-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
              </svg>
              @lvacwashndetail
            </a>
          </div>

          {/* Explore */}
          <div className="md:col-span-2">
            <p className="font-mono text-[10px] text-muted tracking-widest mb-4">EXPLORE</p>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#process" className="text-muted hover:text-ink transition">How It Works</a></li>
              <li><a href="#services" className="text-muted hover:text-ink transition">Services</a></li>
              <li><a href="#membership" className="text-muted hover:text-ink transition">Membership</a></li>
              <li><a href="/gallery" className="text-muted hover:text-ink transition">Gallery</a></li>
              <li><a href="/about" className="text-muted hover:text-ink transition">About</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="md:col-span-2">
            <p className="font-mono text-[10px] text-muted tracking-widest mb-4">LEGAL</p>
            <ul className="space-y-2.5 text-sm">
              <li><a href="/terms" className="text-muted hover:text-ink transition">Terms of Service</a></li>
              <li><a href="/privacy" className="text-muted hover:text-ink transition">Privacy Policy</a></li>
              <li><a href="/refund-policy" className="text-muted hover:text-ink transition">Refund Policy</a></li>
              <li><a href="/sms-consent" className="text-muted hover:text-ink transition">SMS Consent</a></li>
              <li><a href="/accessibility" className="text-muted hover:text-ink transition">Accessibility</a></li>
            </ul>
          </div>

          {/* Location */}
          <div className="md:col-span-4">
            <p className="font-mono text-[10px] text-muted tracking-widest mb-4">LOCATION</p>
            <address className="not-italic space-y-2 text-sm text-muted">
              <p className="text-ink font-medium">LVAC Henderson</p>
              <p>1195 Wellness Pl</p>
              <p>Henderson, NV 89011</p>
              <p className="pt-1">Mon&ndash;Sat · 8:00 AM &ndash; 5:00 PM</p>
              <p>
                <a href="tel:+17023264101" className="text-water hover:text-water-deep transition">
                  (702) 326-4101
                </a>
              </p>
            </address>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-line">
          <div className="max-w-7xl mx-auto px-5 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-muted font-mono">
            <p>&copy; 2026 URRUTIA Carwash and Detailing. All rights reserved.</p>
            <p>Crafted by <span className="text-water">MachineMind</span></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
