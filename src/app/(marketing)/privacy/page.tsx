import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy — URRUTIA Carwash & Detail',
  description: 'Privacy Policy for URRUTIA Carwash & Detail. How we collect, use, and protect your personal information.',
  robots: { index: true, follow: true },
};

const LAST_UPDATED = 'April 29, 2026';
const EFFECTIVE_DATE = 'April 29, 2026';
const BUSINESS_NAME = 'URRUTIA Carwash and Detailing';
const BUSINESS_ADDRESS = '1195 Wellness Pl, Henderson, NV 89011';
const CONTACT_EMAIL = 'lvaccarwash@gmail.com';

function Breadcrumb() {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-muted mb-8">
      <Link href="/" className="hover:text-ink transition-colors duration-200">Home</Link>
      <span aria-hidden="true">/</span>
      <span className="text-ink">Privacy Policy</span>
    </nav>
  );
}

function LegalDisclaimer() {
  return (
    <div className="mb-10 p-5 rounded-xl border border-flame/30 bg-flame/5">
      <p className="text-sm text-flame/90 font-semibold mb-1">Attorney Review Required</p>
      <p className="text-sm text-muted">
        This policy is a template and should be reviewed by a Nevada-licensed attorney before publication. It is provided as operational guidance only. MachineMind LLC is not a law firm and this document does not constitute legal advice.
      </p>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-5 lg:px-8">
        <div className="pt-8">
          <Breadcrumb />

          <h1 className="text-4xl font-black mb-3">Privacy Policy</h1>
          <p className="text-sm text-muted font-mono mb-2">Last updated: {LAST_UPDATED}</p>
          <p className="text-sm text-muted font-mono mb-10">Effective date: {EFFECTIVE_DATE}</p>

          <LegalDisclaimer />

          <div className="prose-legal space-y-10 text-ink/85 leading-relaxed">

            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">1. Introduction</h2>
              <p>
                {BUSINESS_NAME} (&ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates a premium car wash and detailing service located at {BUSINESS_ADDRESS}. We are committed to protecting your personal information and your right to privacy.
              </p>
              <p className="mt-3">
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, book our services, or interact with us in any way. Please read this policy carefully. If you disagree with its terms, please discontinue use of our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">2. Information We Collect</h2>

              <h3 className="text-lg font-semibold mb-2 text-ink">2.1 Information You Provide Directly</h3>
              <ul className="list-none space-y-2 mb-4">
                {[
                  'Name, email address, and phone number when you create an account or book a service',
                  'Vehicle information (make, model, year, color, license plate number)',
                  'Payment information (processed and stored securely by Square — we never see or store raw card numbers)',
                  'Communication preferences and notification settings',
                  'Messages and inquiries submitted via our contact form or Instagram',
                  'Feedback and ratings you provide after service',
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="text-water shrink-0 mt-1">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <h3 className="text-lg font-semibold mb-2 text-ink">2.2 Information Collected Automatically</h3>
              <ul className="list-none space-y-2 mb-4">
                {[
                  'Log data (IP address, browser type, pages visited, time spent)',
                  'Device information (operating system, device identifiers)',
                  'Usage data (features used, booking patterns, wash frequency)',
                  'Cookies and similar tracking technologies (see Section 7)',
                  'Location data (only if you grant permission for service scheduling)',
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="text-water shrink-0 mt-1">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <h3 className="text-lg font-semibold mb-2 text-ink">2.3 Information from Third Parties</h3>
              <p className="text-sm">
                We may receive information about you from payment processors (Square), SMS providers (Twilio), analytics tools (PostHog), and error monitoring services (Sentry) in the course of providing our services to you.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">3. How We Use Your Information</h2>
              <p className="mb-3">We use the information we collect to:</p>
              <ul className="list-none space-y-2 text-sm">
                {[
                  'Process bookings and payments for car wash and detailing services',
                  'Send appointment confirmations, status updates, and completion notifications via SMS and email',
                  'Manage memberships, billing cycles, and subscription renewals',
                  'Track loyalty punch cards by license plate (automated)',
                  'Send service reminders, membership renewal notices, and account alerts',
                  'Respond to inquiries and provide customer support',
                  'Analyze usage patterns to improve our services and website',
                  'Comply with legal obligations and enforce our terms',
                  'Prevent fraud and protect the security of our platform',
                  'Send marketing communications (only with your explicit consent)',
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-water shrink-0 mt-1">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">4. Sharing Your Information</h2>
              <p className="mb-3">We do not sell your personal information. We may share it with:</p>

              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-semibold text-ink mb-1">Service Providers (Data Processors)</p>
                  <p className="text-muted">Square (payments), Twilio (SMS/voice), Resend (email), Supabase (database), Vercel (hosting), PostHog (analytics), Sentry (error monitoring). These processors are contractually bound to protect your data and may not use it for their own purposes.</p>
                </div>
                <div>
                  <p className="font-semibold text-ink mb-1">Legal Requirements</p>
                  <p className="text-muted">If required by law, subpoena, court order, or to protect the rights, property, or safety of URRUTIA, our customers, or the public.</p>
                </div>
                <div>
                  <p className="font-semibold text-ink mb-1">Business Transfers</p>
                  <p className="text-muted">In connection with a merger, acquisition, or sale of assets, with notice to you.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">5. Data Retention</h2>
              <p className="text-sm">
                We retain your personal information for as long as your account is active plus 7 years thereafter for tax and legal compliance purposes. Vehicle service records may be retained longer as they establish the documented maintenance history of your vehicle. You may request deletion of your account and associated data at any time (see Section 9), subject to our legal retention obligations.
              </p>
              <p className="text-sm mt-3">
                Before/after photos taken during your service are retained for 12 months and then deleted unless you request a copy. You may request your photos at any time by emailing {CONTACT_EMAIL}.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">6. Data Security</h2>
              <p className="text-sm">
                We implement industry-standard security measures including encrypted data transmission (TLS/HTTPS), encrypted data storage (Supabase with AES-256 at rest), row-level security policies on our database, access controls limiting data to authorized personnel, and regular security reviews. No method of electronic storage or transmission is 100% secure, and we cannot guarantee absolute security.
              </p>
              <p className="text-sm mt-3">
                We never log, store, or transmit full credit card numbers. All payment processing is handled by Square, a PCI DSS Level 1 certified provider.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">7. Cookies and Tracking</h2>
              <p className="text-sm">
                We use cookies and similar technologies to maintain session state (authentication), remember your preferences, analyze site usage via PostHog (privacy-respecting, no cross-site tracking), and improve our services. You can control cookies through your browser settings. Disabling cookies may affect site functionality, including the ability to stay logged in.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">8. SMS / Text Messaging</h2>
              <p className="text-sm">
                If you provide your phone number and consent to receive SMS messages, we will send service-related messages (booking confirmations, wash status updates, membership notifications) and, if separately consented, marketing messages. You can opt out at any time by replying STOP to any SMS. See our{' '}
                <Link href="/sms-consent" className="text-water hover:underline">SMS Consent Policy</Link>
                {' '}for full TCPA disclosures.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">9. Your Rights (CCPA / Nevada SB 220)</h2>
              <p className="text-sm mb-3">As a Nevada resident, you have the right to:</p>
              <ul className="list-none space-y-2 text-sm">
                {[
                  'Know what personal information we have collected about you',
                  'Request a copy of the personal information we hold about you',
                  'Request deletion of your personal information (subject to legal retention requirements)',
                  'Opt out of the sale of your personal information (we do not sell personal information)',
                  'Non-discrimination for exercising these rights',
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-water shrink-0 mt-1">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm mt-4">
                To exercise these rights, email <a href={`mailto:${CONTACT_EMAIL}`} className="text-water hover:underline">{CONTACT_EMAIL}</a> with &ldquo;Privacy Request&rdquo; in the subject line. We will respond within 45 days.
              </p>
              <p className="text-sm mt-3">
                <strong className="text-ink">Do Not Sell:</strong>{' '}
                We do not sell, rent, or trade your personal information to third parties for monetary consideration. If that changes, we will provide conspicuous notice and a right to opt out.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">10. Children&rsquo;s Privacy</h2>
              <p className="text-sm">
                Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a minor, contact us immediately at {CONTACT_EMAIL}.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">11. Changes to This Policy</h2>
              <p className="text-sm">
                We may update this Privacy Policy from time to time. We will notify you of material changes by posting the new policy on our website with a revised effective date and, for significant changes, by sending an email or SMS notification to active account holders.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">12. Contact Us</h2>
              <div className="card rounded-xl p-5 text-sm space-y-1">
                <p className="font-bold text-ink">{BUSINESS_NAME}</p>
                <p className="text-muted">{BUSINESS_ADDRESS}</p>
                <p>
                  <a href={`mailto:${CONTACT_EMAIL}`} className="text-water hover:underline">{CONTACT_EMAIL}</a>
                </p>
                <p>
                  <a href="https://instagram.com/lvacwashndetail" target="_blank" rel="noopener noreferrer" className="text-water hover:underline">@lvacwashndetail</a>
                </p>
              </div>
            </section>

          </div>

          <div className="mt-12 pt-8 border-t border-line flex flex-wrap gap-4 text-sm text-muted">
            <Link href="/terms" className="hover:text-water transition-colors duration-200">Terms of Service</Link>
            <Link href="/refund-policy" className="hover:text-water transition-colors duration-200">Refund Policy</Link>
            <Link href="/sms-consent" className="hover:text-water transition-colors duration-200">SMS Consent</Link>
            <Link href="/accessibility" className="hover:text-water transition-colors duration-200">Accessibility</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
