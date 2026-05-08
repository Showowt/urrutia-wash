import Link from 'next/link';
import RevealOnScroll from '@/components/cinema/RevealOnScroll';
import JsonLd, { type SchemaInput } from '@/components/seo/JsonLd';

const breadcrumbSchema: SchemaInput[] = [
  {
    type: 'BreadcrumbList',
    items: [
      { name: 'Home', url: 'https://www.washduringworkout.com' },
      { name: 'About', url: 'https://www.washduringworkout.com/about' },
    ],
  },
];

export const metadata = {
  title: 'About — URRUTIA Premium Car Wash & Detail | Henderson, NV',
  description: 'Meet the team behind URRUTIA Carwash & Detail. Premium hand wash and detailing at LVAC Henderson, NV. Serving Henderson, Green Valley, and the Las Vegas valley. 7,200+ vehicles washed. 4.7-star Google rating.',
  keywords: ['about urrutia car wash', 'car wash team henderson nv', 'LVAC car wash owners', 'henderson car wash company', 'car detailing professionals henderson', 'hand car wash experts las vegas'],
  openGraph: {
    title: 'About URRUTIA | Premium Car Wash Henderson, NV',
    description: 'Meet the team behind URRUTIA Carwash & Detail. Premium hand wash and detailing at LVAC Henderson, NV. 7,200+ vehicles. 4.7-star rating.',
    type: 'website',
    images: [{ url: '/gallery/brabus-g63-sunset.jpg', width: 1200, height: 630, alt: 'URRUTIA Car Wash team — Henderson, NV' }],
  },
  twitter: {
    card: 'summary_large_image' as const,
    title: 'About URRUTIA | Car Wash Henderson, NV',
    description: 'Meet the team behind URRUTIA. 7,200+ vehicles washed. Premium hand wash at LVAC Henderson.',
  },
  alternates: {
    canonical: '/about',
  },
};

const TRUST_SIGNALS = [
  {
    stat: '7,200+',
    label: 'Vehicles Washed',
    color: 'water',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
        <rect x="9" y="11" width="14" height="10" rx="2" />
        <circle cx="12" cy="19" r="1" /><circle cx="20" cy="19" r="1" />
      </svg>
    ),
  },
  {
    stat: '4.7★',
    label: 'Customer Rating',
    color: 'flame',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
      </svg>
    ),
  },
  {
    stat: '100%',
    label: 'Hand Wash — No Machines',
    color: 'water',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M18 11V6a3 3 0 0 0-5.45-1.7M18 11H2v2a6 6 0 0 0 12 0V9" />
        <path d="M12 2a5 5 0 0 0-5 5v4" />
      </svg>
    ),
  },
  {
    stat: 'Insured',
    label: 'Fully Insured & Bonded',
    color: 'success',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
];

const LVAC_REASONS = [
  {
    num: '01',
    title: 'Captive Time',
    body: 'Your car sits in the lot while you train anyway. We turn 60 minutes of parked time into a clean car — no detour, no errand, no waiting.',
  },
  {
    num: '02',
    title: 'Controlled Environment',
    body: 'The LVAC lot gives us access to consistent water, space, and lighting. We can perform express washes, full details, and even paint correction under optimal conditions.',
  },
  {
    num: '03',
    title: 'A Customer Base That Cares',
    body: 'LVAC members invest in their health and their lifestyle. They drive vehicles that deserve professional care, and they value the time savings a membership delivers.',
  },
  {
    num: '04',
    title: 'Community Accountability',
    body: 'We see the same customers week after week. That changes everything about the quality standard. You\'re not a ticket number — you\'re a neighbor.',
  },
];

function Breadcrumb() {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-muted">
      <Link href="/" className="hover:text-ink transition-colors duration-200">Home</Link>
      <span aria-hidden="true">/</span>
      <span className="text-ink">About</span>
    </nav>
  );
}

export default function AboutPage() {
  return (
    <>
      <JsonLd schemas={breadcrumbSchema} />
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
              HENDERSON, NV · LVAC CERTIFIED
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={200}>
            <h1 className="mt-5 text-5xl lg:text-7xl font-black leading-none tracking-tight">
              <span className="text-gradient-luxury">About</span>{' '}
              <span className="text-gradient-water">Us</span>
            </h1>
          </RevealOnScroll>
          <RevealOnScroll delay={300}>
            <p className="mt-6 text-lg text-muted max-w-2xl leading-relaxed">
              A car wash built at the intersection of performance culture and obsessive craftsmanship. Henderson drivers deserve better than the tunnel wash. We built something better.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      <div className="section-divider" />

      {/* ─── Owner Bio ─── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Photo placeholder */}
            <RevealOnScroll variant="fade-right">
              <div className="relative">
                <div
                  className="aspect-[4/5] rounded-2xl relative overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, #0a1525 0%, #12203a 50%, #0a1020 100%)' }}
                >
                  <div
                    className="absolute inset-0 opacity-40"
                    style={{ background: 'radial-gradient(ellipse at 40% 30%, rgba(0,180,255,0.3), transparent 60%)' }}
                    aria-hidden="true"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-water/20 border border-water/30 grid place-items-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-water/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                          <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-8 8-8s8 4 8 8" />
                        </svg>
                      </div>
                      <p className="font-mono text-xs text-muted tracking-widest">OWNER HEADSHOT</p>
                      <p className="text-xs text-muted/50 mt-1">Placeholder — Real photo coming soon</p>
                    </div>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-5 -right-5 card-glass rounded-2xl p-4 border border-water/20">
                  <p className="font-mono text-[10px] text-water tracking-widest mb-1">SINCE</p>
                  <p className="text-3xl font-black price-gradient">2024</p>
                  <p className="text-xs text-muted">LVAC Henderson</p>
                </div>
              </div>
            </RevealOnScroll>

            {/* Bio text */}
            <div>
              <RevealOnScroll>
                <p className="font-mono text-xs text-water tracking-widest mb-3">THE OWNER</p>
                <h2 className="text-4xl lg:text-5xl font-black mb-6 leading-tight">
                  Built by someone who actually cares about cars.
                </h2>
              </RevealOnScroll>

              <RevealOnScroll delay={100}>
                <div className="space-y-4 text-muted leading-relaxed">
                  <p>
                    <span className="font-bold text-ink">[Urrutia&rsquo;s story]</span> — Placeholder for the owner&rsquo;s personal bio. This section will feature 2–3 paragraphs about the founder&rsquo;s background, what drove them to start a premium car care operation at LVAC, and their philosophy on craftsmanship.
                  </p>
                  <p>
                    The connection to the LVAC community, the decision to focus on premium vehicles, and the obsession with doing the work right the first time — this is where that story lives. It builds trust because it&rsquo;s real.
                  </p>
                  <p>
                    Based in Henderson, NV. Serving the valley since 2024. Open Monday through Saturday at LVAC. The only car care service built specifically for the desert climate your car actually lives in.
                  </p>
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={200}>
                <div className="mt-8 flex gap-4 flex-wrap">
                  <a
                    href="https://instagram.com/lvacwashndetail"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost px-5 py-3 rounded-full text-sm flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.81.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.81-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.81-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.81.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.34 4.14.63a5.85 5.85 0 0 0-2.13 1.38A5.85 5.85 0 0 0 .63 4.14C.34 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.27 2.15.56 2.91a5.85 5.85 0 0 0 1.38 2.13 5.85 5.85 0 0 0 2.13 1.38c.76.29 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.27 2.91-.56a5.85 5.85 0 0 0 2.13-1.38 5.85 5.85 0 0 0 1.38-2.13c.29-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.27-2.15-.56-2.91a5.85 5.85 0 0 0-1.38-2.13A5.85 5.85 0 0 0 19.86.63c-.76-.29-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
                    </svg>
                    @lvacwashndetail
                  </a>
                  <Link href="/contact" className="btn-primary px-5 py-3 rounded-full text-sm">
                    Get In Touch
                  </Link>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ─── Trust Signals ─── */}
      <section className="py-20 lg:py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <RevealOnScroll className="mb-12">
            <p className="font-mono text-xs text-water tracking-widest mb-3">BY THE NUMBERS</p>
            <h2 className="text-3xl lg:text-4xl font-bold">Trust built on results.</h2>
          </RevealOnScroll>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TRUST_SIGNALS.map((t, i) => (
              <RevealOnScroll key={i} delay={i * 80}>
                <div className={`service-card rounded-2xl p-6 text-center`}>
                  <div className={`w-12 h-12 rounded-xl bg-${t.color}/10 border border-${t.color}/25 grid place-items-center mx-auto mb-4 text-${t.color}`}>
                    {t.icon}
                  </div>
                  <p className={`text-3xl font-black price-gradient mb-1`}>{t.stat}</p>
                  <p className="text-sm text-muted">{t.label}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ─── Why LVAC ─── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <RevealOnScroll className="max-w-2xl mb-14">
            <p className="font-mono text-xs text-flame tracking-widest mb-3">WHY LVAC</p>
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
              The gym lot was the right call.
            </h2>
            <p className="mt-4 text-muted text-lg">
              Not every parking lot is a business. This one is. Here&rsquo;s why LVAC made sense and why it keeps working.
            </p>
          </RevealOnScroll>

          <div className="grid md:grid-cols-2 gap-5">
            {LVAC_REASONS.map((r, i) => (
              <RevealOnScroll key={i} delay={i * 80}>
                <div className="desert-card rounded-2xl p-7">
                  <p className="font-mono text-xs text-flame/60 tracking-widest mb-3">{r.num}</p>
                  <h3 className="text-xl font-bold mb-3">{r.title}</h3>
                  <p className="text-muted leading-relaxed">{r.body}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ─── Team placeholder ─── */}
      <section className="py-20 lg:py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <RevealOnScroll className="mb-12">
            <p className="font-mono text-xs text-water tracking-widest mb-3">THE TEAM</p>
            <h2 className="text-3xl lg:text-4xl font-bold">The people behind every wash.</h2>
            <p className="mt-4 text-muted max-w-xl">
              Every detailer is trained in-house. Every wash is checked before the keys go back.
            </p>
          </RevealOnScroll>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((n) => (
              <RevealOnScroll key={n} delay={n * 80}>
                <div className="card rounded-2xl p-6 text-center">
                  <div
                    className="w-20 h-20 rounded-full mx-auto mb-4 grid place-items-center"
                    style={{ background: 'linear-gradient(135deg, rgba(0,180,255,0.15), rgba(0,100,200,0.1))' }}
                  >
                    <svg className="w-8 h-8 text-water/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-8 8-8s8 4 8 8" />
                    </svg>
                  </div>
                  <p className="font-bold mb-1">Team Member {n}</p>
                  <p className="text-sm text-muted">Lead Detailer</p>
                  <p className="text-xs text-muted/50 mt-2 font-mono">PHOTO &amp; BIO COMING SOON</p>
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
            <h2 className="text-4xl font-black mb-4">Come see the work.</h2>
            <p className="text-muted mb-8 text-lg">
              LVAC Henderson. Monday through Saturday, 8:00 to 5:00. Drop the keys.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-primary px-8 py-4 rounded-full text-base font-bold shimmer-btn">
                Contact Us
              </Link>
              <Link href="/gallery" className="btn-ghost px-8 py-4 rounded-full text-base font-medium">
                View Gallery
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}
