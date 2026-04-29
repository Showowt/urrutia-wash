import Image from 'next/image';
import SiteNav from '@/components/sections/SiteNav';
import HeroCtas from '@/components/sections/HeroCtas';
import ServicesSection from '@/components/sections/ServicesSection';
import MembershipSection from '@/components/sections/MembershipSection';
import LocationSection from '@/components/sections/LocationSection';
import FaqSection from '@/components/sections/FaqSection';
import FinalCta from '@/components/sections/FinalCta';
import RevealOnScroll from '@/components/cinema/RevealOnScroll';
// Preloader disabled — video autoplay blocked on most browsers
// import Preloader from '@/components/cinema/Preloader';
import HeroHeadline from '@/components/cinema/HeroHeadline';
import StatsCounter from '@/components/cinema/StatsCounter';
import JsonLd, { type SchemaInput } from '@/components/seo/JsonLd';

// ─── Schema.org structured data ───────────────────────────────────────────────
const BUSINESS_ADDRESS = {
  streetAddress: '1195 Wellness Pl',
  addressLocality: 'Henderson',
  addressRegion: 'NV',
  postalCode: '89074',
  addressCountry: 'US',
};

const BUSINESS_URL = 'https://urrutiawash.com';
const BUSINESS_IMAGE = `${BUSINESS_URL}/gallery/brabus-g63.jpg`;
const OPENING_HOURS = [
  'Mo 07:00-16:30',
  'Tu 07:00-16:30',
  'We 07:00-16:30',
  'Th 07:00-16:30',
  'Fr 07:00-16:30',
  'Sa 07:00-16:30',
];

const homepageSchemas: SchemaInput[] = [
  {
    type: 'LocalBusiness',
    name: 'Urrutia Carwash & Detail',
    description:
      'Premium hand wash and auto detailing at LVAC Henderson. Express washes, full details, and ceramic coating — while you train.',
    url: BUSINESS_URL,
    address: BUSINESS_ADDRESS,
    geo: { latitude: 36.0211, longitude: -115.0707 },
    openingHours: OPENING_HOURS,
    priceRange: '$$',
    image: BUSINESS_IMAGE,
    sameAs: [
      'https://www.instagram.com/lvacwashndetail',
    ],
  },
  {
    type: 'AutoRepair',
    name: 'Urrutia Carwash & Detail',
    description:
      'Premium hand wash, interior detail, paint correction, and ceramic coating services in Henderson, NV.',
    url: BUSINESS_URL,
    address: BUSINESS_ADDRESS,
    openingHours: OPENING_HOURS,
    priceRange: '$$',
    image: BUSINESS_IMAGE,
    hasOfferCatalog: {
      name: 'Car Wash & Detail Services',
      itemListElement: [
        {
          name: 'Express Hand Wash',
          description: 'Full exterior hand wash with spot-free rinse and hand dry.',
          price: '35',
          priceCurrency: 'USD',
        },
        {
          name: 'Wash + Interior',
          description: 'Exterior hand wash plus full interior vacuum, wipe-down, and glass clean.',
          price: '75',
          priceCurrency: 'USD',
        },
        {
          name: 'Full Detail',
          description:
            'Complete paint decontamination, interior deep clean, leather conditioning, and ceramic spray sealant.',
          price: '295',
          priceCurrency: 'USD',
        },
        {
          name: 'Ceramic Coating',
          description:
            'Professional-grade 9H ceramic coating with multi-year paint protection and hydrophobic finish.',
          price: '895',
          priceCurrency: 'USD',
        },
      ],
    },
  },
  {
    type: 'AggregateRating',
    itemReviewed: { name: 'Urrutia Carwash & Detail', url: BUSINESS_URL },
    ratingValue: 4.9,
    bestRating: 5,
    worstRating: 1,
    reviewCount: 120,
  },
  {
    type: 'FAQPage',
    questions: [
      {
        question: 'Where is Urrutia Carwash & Detail located?',
        answer:
          'We are located at 1195 Wellness Pl, Henderson, NV 89074 — inside the LVAC (Las Vegas Athletic Club) parking area.',
      },
      {
        question: 'What are your hours?',
        answer: 'We are open Monday through Saturday from 7:00 AM to 4:30 PM. We are closed on Sundays at this location.',
      },
      {
        question: 'Do you offer mobile detailing?',
        answer:
          'Yes. We offer mobile detailing 7 days a week across the Las Vegas valley. We come to your home, office, or any location within 15 miles of Henderson.',
      },
      {
        question: 'How does the LVAC drop-off service work?',
        answer:
          'Park at LVAC Henderson, hand your keys to your detailer, and work out. We send you an SMS with before/after photos the moment your car is ready. Walk out to a clean car.',
      },
      {
        question: 'Do you offer memberships?',
        answer:
          'Yes. We offer three membership tiers: SOLO ($89/mo, 4 washes), DUO ($149/mo, 8 washes, 2 vehicles), and FLEET ($279/mo, unlimited washes, up to 4 vehicles). Members also receive discounts on details and ceramic coatings.',
      },
      {
        question: 'Do you do ceramic coating?',
        answer:
          'Yes. We offer professional 9H ceramic coating starting at $895. This includes full paint decontamination and a multi-year hydrophobic protection warranty.',
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
            src="/gallery/brabus-g63.jpg"
            alt="Brabus G63 AMG — Urrutia Car Wash"
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
              Park at LVAC. We hand-wash and detail your car while you train. Get an SMS the
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
                OPEN MON–SAT 7:00–4:30
              </span>
              <span className="flex items-center gap-2 shrink-0">
                <span className="w-1 h-1 rounded-full bg-water" aria-hidden="true" />
                MOBILE 7 DAYS / WEEK
              </span>
              <span className="flex items-center gap-2 shrink-0">
                <span className="w-1 h-1 rounded-full bg-flame" aria-hidden="true" />
                HAND WASH FROM $35
              </span>
              <span className="flex items-center gap-2 shrink-0">
                <span className="w-1 h-1 rounded-full bg-ink" aria-hidden="true" />
                FULL DETAIL FROM $295
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
            <span>ROLLS-ROYCE CULLINAN</span><span>·</span>
            <span>MERCEDES G63 AMG</span><span>·</span>
            <span>FORD RAPTOR</span><span>·</span>
            <span>BMW M-SERIES</span><span>·</span>
            <span>JEEP WRANGLER</span><span>·</span>
            <span>FORD F-450 PLATINUM</span><span>·</span>
            <span>ROLLS-ROYCE CULLINAN</span><span>·</span>
            <span>MERCEDES G63 AMG</span><span>·</span>
            <span>FORD RAPTOR</span><span>·</span>
            <span>BMW M-SERIES</span><span>·</span>
            <span>JEEP WRANGLER</span><span>·</span>
            <span>FORD F-450 PLATINUM</span>
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
                  Park at LVAC Henderson. Hand the keys to your detailer. Or book mobile and we
                  come to you &mdash; home, office, anywhere in the valley.
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
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Slot 1 — real Brabus photo */}
              <div className="aspect-[4/3] rounded-2xl relative overflow-hidden group">
                <Image
                  src="/gallery/brabus-g63.jpg"
                  alt="Brabus G63 AMG — Urrutia Detail"
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  style={{ objectFit: 'cover', objectPosition: 'center', transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)' }}
                  className="group-hover:scale-105"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(5,8,16,0.8) 0%, transparent 60%)' }} />
                <div className="absolute bottom-3 left-3 font-mono text-[10px] text-white/90 tracking-widest">
                  G63 AMG · BRABUS
                </div>
              </div>

              {/* Slots 2-6 — styled placeholders with richer gradients */}
              <div className="aspect-[4/3] rounded-2xl relative overflow-hidden group" style={{ background: 'linear-gradient(135deg, #1a0f05 0%, #2a1a08 40%, #1a0a04 100%)' }}>
                <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(ellipse at 30% 40%, rgba(255,107,26,0.4), transparent 60%)' }} />
                <div className="absolute bottom-3 left-3 font-mono text-[10px] text-white/80 tracking-widest">FORD RAPTOR · GRAY</div>
              </div>
              <div className="aspect-[4/3] rounded-2xl relative overflow-hidden group" style={{ background: 'linear-gradient(135deg, #05140f 0%, #0a251a 40%, #031008 100%)' }}>
                <div className="absolute inset-0 opacity-25" style={{ background: 'radial-gradient(ellipse at 70% 30%, rgba(16,185,129,0.5), transparent 60%)' }} />
                <div className="absolute bottom-3 left-3 font-mono text-[10px] text-white/80 tracking-widest">CULLINAN · ROSE GOLD</div>
              </div>
              <div className="aspect-[4/3] rounded-2xl relative overflow-hidden group" style={{ background: 'linear-gradient(135deg, #0a0515 0%, #140a25 40%, #07031a 100%)' }}>
                <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(0,180,255,0.35), transparent 60%)' }} />
                <div className="absolute bottom-3 left-3 font-mono text-[10px] text-white/80 tracking-widest">BMW M3 · INTERIOR DETAIL</div>
              </div>
              <div className="aspect-[4/3] rounded-2xl relative overflow-hidden group" style={{ background: 'linear-gradient(135deg, #080510 0%, #130a1e 40%, #060315 100%)' }}>
                <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(ellipse at 60% 20%, rgba(255,255,255,0.15), transparent 60%)' }} />
                <div className="absolute bottom-3 left-3 font-mono text-[10px] text-white/80 tracking-widest">JEEP WRANGLER · MATTE</div>
              </div>
              <div className="aspect-[4/3] rounded-2xl relative overflow-hidden group" style={{ background: 'linear-gradient(135deg, #150a02 0%, #251503 40%, #100801 100%)' }}>
                <div className="absolute inset-0 opacity-25" style={{ background: 'radial-gradient(ellipse at 40% 70%, rgba(255,107,26,0.3), transparent 60%)' }} />
                <div className="absolute bottom-3 left-3 font-mono text-[10px] text-white/80 tracking-widest">F-450 PLATINUM · CERAMIC</div>
              </div>
            </div>
          </RevealOnScroll>

          <div className="mt-8 flex justify-center">
            <a
              href="https://instagram.com/lvacwashndetail"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost px-6 py-3 rounded-full text-sm flex items-center gap-2"
            >
              See more on Instagram
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M7 17L17 7M17 7H8M17 7V16" />
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
        </div>
      </section>

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
      <footer className="border-t border-line py-12">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-water-deep to-water glow-water grid place-items-center">
                <span className="text-[10px] font-black tracking-tighter text-white">URR</span>
              </div>
              <span className="wordmark text-lg">URRUTIA</span>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              Premium hand wash and detail. LVAC Henderson + mobile valley-wide.
            </p>
          </div>

          <div>
            <p className="font-mono text-[10px] text-muted tracking-widest mb-3">EXPLORE</p>
            <ul className="space-y-2 text-sm">
              <li><a href="#process" className="text-muted hover:text-ink transition">How It Works</a></li>
              <li><a href="#services" className="text-muted hover:text-ink transition">Services</a></li>
              <li><a href="#membership" className="text-muted hover:text-ink transition">Membership</a></li>
              <li><a href="#gallery" className="text-muted hover:text-ink transition">Gallery</a></li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-[10px] text-muted tracking-widest mb-3">LOCATION</p>
            <ul className="space-y-2 text-sm text-muted">
              <li>1195 Wellness Pl</li>
              <li>Henderson, NV 89074</li>
              <li>Mon&ndash;Sat · 7:00&ndash;4:30</li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-[10px] text-muted tracking-widest mb-3">FOLLOW</p>
            <a
              href="https://instagram.com/lvacwashndetail"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink transition"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.81.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.81-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.81-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.81.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.34 4.14.63a5.85 5.85 0 0 0-2.13 1.38A5.85 5.85 0 0 0 .63 4.14C.34 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.27 2.15.56 2.91a5.85 5.85 0 0 0 1.38 2.13 5.85 5.85 0 0 0 2.13 1.38c.76.29 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.27 2.91-.56a5.85 5.85 0 0 0 2.13-1.38 5.85 5.85 0 0 0 1.38-2.13c.29-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.27-2.15-.56-2.91a5.85 5.85 0 0 0-1.38-2.13A5.85 5.85 0 0 0 19.86.63c-.76-.29-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
              </svg>
              @lvacwashndetail
            </a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-5 lg:px-8 mt-10 pt-6 border-t border-line flex flex-col sm:flex-row justify-between gap-3 text-xs text-muted font-mono">
          <p>© 2026 URRUTIA Carwash and Detailing. All rights reserved.</p>
          <p>Crafted by <span className="text-water">MachineMind</span></p>
        </div>
      </footer>
    </div>
  );
}
