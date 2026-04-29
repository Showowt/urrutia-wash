import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service — URRUTIA Carwash & Detail',
  description: 'Terms of Service for URRUTIA Carwash & Detail. Car wash and detailing services in Henderson, NV.',
  robots: { index: true, follow: true },
};

const LAST_UPDATED = 'April 29, 2026';
const BUSINESS_NAME = 'URRUTIA Carwash & Detail';
const BUSINESS_ADDRESS = '1195 Wellness Pl, Henderson, NV 89074';
const CONTACT_EMAIL = 'hello@urrutiawash.com';

function Breadcrumb() {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-muted mb-8">
      <Link href="/" className="hover:text-ink transition-colors duration-200">Home</Link>
      <span aria-hidden="true">/</span>
      <span className="text-ink">Terms of Service</span>
    </nav>
  );
}

function LegalDisclaimer() {
  return (
    <div className="mb-10 p-5 rounded-xl border border-flame/30 bg-flame/5">
      <p className="text-sm text-flame/90 font-semibold mb-1">Attorney Review Required</p>
      <p className="text-sm text-muted">
        This document is a template and should be reviewed by a Nevada-licensed attorney before publication. MachineMind LLC is not a law firm and this does not constitute legal advice.
      </p>
    </div>
  );
}

export default function TermsPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-5 lg:px-8">
        <div className="pt-8">
          <Breadcrumb />

          <h1 className="text-4xl font-black mb-3">Terms of Service</h1>
          <p className="text-sm text-muted font-mono mb-10">Last updated: {LAST_UPDATED}</p>

          <LegalDisclaimer />

          <div className="space-y-10 text-ink/85 leading-relaxed">

            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">1. Agreement to Terms</h2>
              <p className="text-sm">
                By accessing our website, booking our services, or creating an account, you agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;) and our <Link href="/privacy" className="text-water hover:underline">Privacy Policy</Link>. These Terms constitute a legally binding agreement between you and {BUSINESS_NAME} (&ldquo;URRUTIA,&rdquo; &ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). If you do not agree to these Terms, do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">2. Services Description</h2>
              <p className="text-sm mb-3">
                URRUTIA provides premium hand car wash and detailing services at {BUSINESS_ADDRESS} and mobile detailing services throughout the Las Vegas valley. Our services include:
              </p>
              <ul className="list-none space-y-2 text-sm">
                {[
                  'Express hand wash ($35 per vehicle)',
                  'Wash + interior cleaning ($75 per vehicle)',
                  'Full detail (starting at $295)',
                  'Ceramic coating (starting at $895)',
                  'Mobile detailing (surcharge applies)',
                  'URRUTIA Club membership subscriptions (SOLO/DUO/FLEET)',
                ].map((s, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-water shrink-0 mt-1">·</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm mt-3">Prices are subject to change with 30 days notice to active members.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">3. Bookings and Appointments</h2>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-semibold text-ink mb-1">3.1 Booking Confirmation</p>
                  <p>Bookings are confirmed upon receipt of your booking request and SMS confirmation from URRUTIA. A booking is not confirmed until you receive this confirmation message.</p>
                </div>
                <div>
                  <p className="font-semibold text-ink mb-1">3.2 Cancellations and No-Shows</p>
                  <p>Please see our <Link href="/refund-policy" className="text-water hover:underline">Refund and Cancellation Policy</Link> for complete details. We request at least 2 hours advance notice for cancellations. Repeated no-shows may result in a pre-payment requirement for future bookings.</p>
                </div>
                <div>
                  <p className="font-semibold text-ink mb-1">3.3 Service Times</p>
                  <p>Estimated service times are provided as guidance. Actual times may vary based on vehicle condition, vehicle size, and service volume. We are not liable for delays outside our control.</p>
                </div>
                <div>
                  <p className="font-semibold text-ink mb-1">3.4 Vehicle Condition</p>
                  <p>You represent that you have the legal right to authorize work on the vehicle presented. Extreme vehicle conditions (heavy biological contamination, structural damage, significant pre-existing paint damage) may require additional fees, which will be communicated before work commences.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">4. Membership Subscriptions</h2>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-semibold text-ink mb-1">4.1 Subscription Terms</p>
                  <p>Membership subscriptions (SOLO, DUO, FLEET) are billed monthly or annually via Stripe. By subscribing, you authorize recurring charges at the stated interval until you cancel.</p>
                </div>
                <div>
                  <p className="font-semibold text-ink mb-1">4.2 Auto-Renewal Disclosure (Nevada Law)</p>
                  <p className="border border-water/20 bg-water/5 p-3 rounded-lg">
                    <strong className="text-ink">IMPORTANT:</strong> Your membership will automatically renew at the end of each billing period at the then-current rate unless you cancel. You may cancel at any time through the member portal, by email, or by contacting us directly. Cancellation stops future charges; it does not entitle you to a refund for the current billing period.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-ink mb-1">4.3 Unused Washes</p>
                  <p>Unused wash credits do not roll over to the next billing period. Credits expire at the end of each monthly billing cycle. FLEET memberships include unlimited washes with no credits to track.</p>
                </div>
                <div>
                  <p className="font-semibold text-ink mb-1">4.4 Membership Pause</p>
                  <p>Members may pause their membership for up to 90 days per calendar year. During a pause, billing is suspended and wash credits are frozen. Resume at any time from the member portal.</p>
                </div>
                <div>
                  <p className="font-semibold text-ink mb-1">4.5 Price Changes</p>
                  <p>We will provide 30 days advance written notice (email) of any price increases to active members. Your continued use of the membership after the notice period constitutes acceptance of the new price.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">5. Payments</h2>
              <div className="space-y-3 text-sm">
                <p>All payments are processed securely by Stripe. We do not store credit card information on our servers. By providing payment information, you authorize URRUTIA to charge the applicable fees.</p>
                <p>In the event of a payment failure, we will attempt to retry the charge and notify you via SMS and email. Continued failure may result in suspension of membership services until payment is resolved.</p>
                <p>All prices are in USD and include applicable Nevada sales tax where required.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">6. Vehicle Liability</h2>
              <div className="space-y-3 text-sm">
                <p>
                  URRUTIA takes reasonable care with every vehicle. We photograph vehicles before and after service to document condition. Pre-existing damage noted during intake is documented and communicated to you.
                </p>
                <p>
                  URRUTIA is fully insured and bonded. In the unlikely event of damage caused by our services, report it within 24 hours of vehicle pickup. We will work with our insurer to address legitimate claims. URRUTIA is not responsible for:
                </p>
                <ul className="list-none space-y-1.5 pl-4">
                  {[
                    'Pre-existing damage, scratches, chips, or dents not noted at intake',
                    'Items left in the vehicle',
                    'Electronic or mechanical issues',
                    'Normal wear and tear to paint, trim, or rubber seals',
                    'Damage from storm, vandalism, or third parties while vehicle is parked at LVAC',
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3 text-muted">
                      <span className="text-muted/40 shrink-0 mt-1">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">7. Limitation of Liability</h2>
              <p className="text-sm">
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE NEVADA LAW, URRUTIA&rsquo;S TOTAL LIABILITY TO YOU FOR ANY CLAIM ARISING FROM OR RELATED TO THESE TERMS OR OUR SERVICES SHALL NOT EXCEED THE AMOUNT YOU PAID TO URRUTIA IN THE 90 DAYS PRECEDING THE CLAIM. IN NO EVENT SHALL URRUTIA BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">8. Dispute Resolution</h2>
              <div className="space-y-3 text-sm">
                <p>
                  We prefer to resolve disputes informally. Please contact us at {CONTACT_EMAIL} with your concern before taking any legal action. We will make a good-faith effort to resolve your issue within 10 business days.
                </p>
                <p>
                  These Terms are governed by the laws of the State of Nevada, without regard to its conflict of law provisions. Any dispute not resolved informally shall be submitted to binding arbitration in Clark County, Nevada, under the rules of the American Arbitration Association, unless the amount in controversy is less than $10,000, in which case small claims court in Clark County, Nevada shall be the venue.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">9. Intellectual Property</h2>
              <p className="text-sm">
                All content on our website, application, and marketing materials — including text, photographs, graphics, logos, and software — is the property of URRUTIA or its licensors and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without express written permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">10. Modifications to Terms</h2>
              <p className="text-sm">
                We reserve the right to modify these Terms at any time. We will provide at least 14 days advance notice of material changes by posting on our website and notifying active account holders by email. Your continued use after the effective date constitutes acceptance.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">11. Contact</h2>
              <div className="card rounded-xl p-5 text-sm space-y-1">
                <p className="font-bold text-ink">{BUSINESS_NAME}</p>
                <p className="text-muted">{BUSINESS_ADDRESS}</p>
                <p><a href={`mailto:${CONTACT_EMAIL}`} className="text-water hover:underline">{CONTACT_EMAIL}</a></p>
              </div>
            </section>

          </div>

          <div className="mt-12 pt-8 border-t border-line flex flex-wrap gap-4 text-sm text-muted">
            <Link href="/privacy" className="hover:text-water transition-colors duration-200">Privacy Policy</Link>
            <Link href="/refund-policy" className="hover:text-water transition-colors duration-200">Refund Policy</Link>
            <Link href="/sms-consent" className="hover:text-water transition-colors duration-200">SMS Consent</Link>
            <Link href="/accessibility" className="hover:text-water transition-colors duration-200">Accessibility</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
