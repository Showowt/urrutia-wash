import Link from 'next/link';

export const metadata = {
  title: 'Accessibility Statement — URRUTIA Carwash & Detail',
  description: 'Accessibility statement for URRUTIA Carwash & Detail. Our commitment to WCAG 2.1 AA compliance and ADA accessibility.',
  robots: { index: true, follow: true },
};

const LAST_UPDATED = 'April 29, 2026';
const CONTACT_EMAIL = 'hello@urrutiawash.com';
const BUSINESS_NAME = 'URRUTIA Carwash & Detail';

function Breadcrumb() {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-muted mb-8">
      <Link href="/" className="hover:text-ink transition-colors duration-200">Home</Link>
      <span aria-hidden="true">/</span>
      <span className="text-ink">Accessibility</span>
    </nav>
  );
}

export default function AccessibilityPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-5 lg:px-8">
        <div className="pt-8">
          <Breadcrumb />

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-water/25 bg-water/5 text-xs font-mono text-water mb-6">
            WCAG 2.1 AA · ADA COMMITMENT
          </div>

          <h1 className="text-4xl font-black mb-3">Accessibility Statement</h1>
          <p className="text-sm text-muted font-mono mb-10">Last updated: {LAST_UPDATED}</p>

          <div className="space-y-10 text-ink/85 leading-relaxed">

            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">Our Commitment</h2>
              <p className="text-sm mb-3">
                {BUSINESS_NAME} is committed to ensuring that our website and digital services are accessible to everyone, including people with disabilities. We believe every person deserves equal access to information about our services, the ability to book appointments, and the ability to manage their membership.
              </p>
              <p className="text-sm">
                We are actively working to ensure conformance with the Web Content Accessibility Guidelines (WCAG) 2.1, Level AA, as published by the World Wide Web Consortium (W3C). We also aim to comply with the Americans with Disabilities Act (ADA) as it applies to digital services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">Current Conformance Status</h2>
              <div className="card rounded-xl p-5 mb-4">
                <p className="text-sm font-semibold text-ink mb-1">Status: Partially Conformant</p>
                <p className="text-sm text-muted">
                  Our website partially conforms to WCAG 2.1 Level AA. &ldquo;Partially conformant&rdquo; means that some parts of the content do not fully conform to the standard. We are actively addressing known gaps.
                </p>
              </div>
              <p className="text-sm">
                Our current accessibility implementation includes:
              </p>
              <ul className="list-none space-y-2 text-sm mt-3">
                {[
                  'Semantic HTML5 elements for proper document structure',
                  'ARIA labels on interactive elements where semantic HTML is insufficient',
                  'Skip-to-main-content link at the top of every page',
                  'Keyboard-navigable interface — all interactive elements reachable via Tab',
                  'Focus indicators visible on all focusable elements',
                  'Color contrast ratios meeting or exceeding 4.5:1 for body text',
                  'Alt text on all meaningful images; decorative images marked with alt=""',
                  'Form labels associated with all input fields',
                  'Error messages linked to inputs via aria-describedby',
                  'Logical heading hierarchy (one H1 per page, H2–H4 in sequence)',
                  'lang="en" attribute on the HTML element',
                  'prefers-reduced-motion: all animations disabled when user has requested reduced motion',
                  'Touch targets minimum 44x44 CSS pixels on mobile',
                  'No content that flashes more than 3 times per second',
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-success shrink-0 mt-1">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">Known Limitations</h2>
              <p className="text-sm mb-3">
                We are aware of the following accessibility limitations and are working to address them:
              </p>
              <ul className="list-none space-y-3 text-sm">
                {[
                  {
                    issue: 'Gallery placeholder images',
                    detail: 'Several gallery images are gradient placeholders awaiting real photography. Once real images are added, full descriptive alt text will be applied.',
                  },
                  {
                    issue: 'Map embed',
                    detail: 'The OpenStreetMap embed on the Contact page may have limited keyboard accessibility depending on your browser and assistive technology. We provide the address as plain text as an alternative.',
                  },
                  {
                    issue: 'Third-party payment UI',
                    detail: 'The Stripe payment interface is a third-party component. Stripe maintains its own accessibility standards; we cannot directly control its implementation.',
                  },
                  {
                    issue: 'Video content',
                    detail: 'Future hero video content will include captions and audio description alternatives. Currently, video autoplay is disabled and a static image is used.',
                  },
                ].map((item, i) => (
                  <li key={i} className="card rounded-xl p-4">
                    <p className="font-semibold text-ink mb-1">{item.issue}</p>
                    <p className="text-muted text-sm">{item.detail}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">Testing Approach</h2>
              <p className="text-sm mb-3">We test our digital services using:</p>
              <ul className="list-none space-y-2 text-sm">
                {[
                  'axe DevTools browser extension (automated WCAG testing)',
                  'Lighthouse Accessibility audit (Google Chrome DevTools)',
                  'Keyboard-only navigation testing',
                  'VoiceOver (macOS / iOS) screen reader testing',
                  'NVDA (Windows) screen reader testing',
                  'High contrast mode testing',
                  'Mobile device testing at 375px minimum viewport width',
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-water shrink-0 mt-1">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm mt-4">
                We conduct accessibility audits quarterly and after significant site updates.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">Physical Location Accessibility</h2>
              <p className="text-sm mb-3">
                Our service location at LVAC Henderson (1195 Wellness Pl, Henderson, NV 89074) is located within an LVAC parking lot. For physical accessibility information regarding the LVAC facility, please contact LVAC directly.
              </p>
              <p className="text-sm">
                For our service specifically: we offer mobile detailing as an alternative to drop-off service. Mobile detailing can be performed at any accessible location of your choosing — your home, workplace, or any other address in the Henderson / Las Vegas valley.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">Report an Accessibility Issue</h2>
              <p className="text-sm mb-4">
                We take accessibility feedback seriously. If you experience a barrier on our website or in our digital services, please contact us:
              </p>
              <div className="card rounded-xl p-6 text-sm">
                <p className="font-bold text-ink mb-3">Contact for Accessibility Issues</p>
                <ul className="space-y-2 text-muted">
                  <li>
                    Email: <a href={`mailto:${CONTACT_EMAIL}`} className="text-water hover:underline">{CONTACT_EMAIL}</a>
                    {' '}— Subject line: &ldquo;Accessibility&rdquo;
                  </li>
                  <li>
                    Instagram: <a href="https://instagram.com/lvacwashndetail" target="_blank" rel="noopener noreferrer" className="text-water hover:underline">@lvacwashndetail</a>
                  </li>
                  <li>In person: 1195 Wellness Pl, Henderson, NV 89074 · Mon–Sat 7:00–4:30</li>
                </ul>
                <p className="mt-4 text-muted">
                  Please describe the barrier you encountered, the page or feature affected, the assistive technology or browser you use, and how we can best help you. We aim to respond within 2 business days and resolve issues within 30 days.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">Alternative Access</h2>
              <p className="text-sm">
                If you cannot access any content or function on our website due to a disability, please contact us and we will provide the information or service through an alternative accessible method — including by phone, email, or in person.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">Formal Complaints</h2>
              <p className="text-sm">
                If you are not satisfied with our response to your accessibility feedback, you may contact the U.S. Department of Justice Civil Rights Division (
                <a
                  href="https://www.ada.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-water hover:underline"
                >
                  ada.gov
                </a>
                ) or the U.S. Access Board (
                <a
                  href="https://www.access-board.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-water hover:underline"
                >
                  access-board.gov
                </a>
                ).
              </p>
            </section>

          </div>

          <div className="mt-12 pt-8 border-t border-line flex flex-wrap gap-4 text-sm text-muted">
            <Link href="/privacy" className="hover:text-water transition-colors duration-200">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-water transition-colors duration-200">Terms of Service</Link>
            <Link href="/refund-policy" className="hover:text-water transition-colors duration-200">Refund Policy</Link>
            <Link href="/sms-consent" className="hover:text-water transition-colors duration-200">SMS Consent</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
