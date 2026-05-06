import Link from 'next/link';

export const metadata = {
  title: 'SMS Consent & TCPA Disclosure — URRUTIA Carwash & Detail',
  description: 'SMS consent policy and TCPA disclosure for URRUTIA Carwash & Detail. How we use text messaging and how to opt out.',
  robots: { index: true, follow: true },
};

const LAST_UPDATED = 'April 29, 2026';
const CONTACT_EMAIL = 'lvaccarwash@gmail.com';
const BUSINESS_NAME = 'LVAC Carwash and Detailing';

function Breadcrumb() {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-muted mb-8">
      <Link href="/" className="hover:text-ink transition-colors duration-200">Home</Link>
      <span aria-hidden="true">/</span>
      <span className="text-ink">SMS Consent</span>
    </nav>
  );
}

function LegalDisclaimer() {
  return (
    <div className="mb-10 p-5 rounded-xl border border-flame/30 bg-flame/5">
      <p className="text-sm text-flame/90 font-semibold mb-1">Attorney Review Required</p>
      <p className="text-sm text-muted">
        This disclosure is a template and should be reviewed by a Nevada-licensed attorney and a TCPA compliance specialist before publication. MachineMind LLC is not a law firm.
      </p>
    </div>
  );
}

export default function SmsConsentPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-5 lg:px-8">
        <div className="pt-8">
          <Breadcrumb />

          <h1 className="text-4xl font-black mb-3">SMS Consent &amp; TCPA Disclosure</h1>
          <p className="text-sm text-muted font-mono mb-10">Last updated: {LAST_UPDATED}</p>

          <LegalDisclaimer />

          {/* Key disclosure — must be prominent for TCPA compliance */}
          <div className="mb-10 p-6 rounded-2xl border border-water/25 bg-water/5">
            <p className="font-mono text-xs text-water tracking-widest mb-3">IMPORTANT DISCLOSURE</p>
            <p className="text-sm leading-relaxed mb-3">
              By providing your phone number and booking a service or creating an account with {BUSINESS_NAME}, you expressly consent to receive text messages (SMS/MMS) from URRUTIA at the mobile number you provided.
            </p>
            <p className="text-sm leading-relaxed mb-3">
              <strong className="text-ink">Message frequency:</strong> Varies. You will receive messages related to your bookings (typically 3–5 per service: confirmation, wash start, almost ready, ready for pickup). Members may receive additional billing and membership notifications.
            </p>
            <p className="text-sm leading-relaxed mb-3">
              <strong className="text-ink">Message and data rates may apply.</strong> Standard carrier rates apply to all messages sent and received.
            </p>
            <p className="text-sm leading-relaxed">
              <strong className="text-ink">To opt out:</strong> Reply <strong>STOP</strong> to any message at any time. Reply <strong>HELP</strong> for assistance.
            </p>
          </div>

          <div className="space-y-10 text-ink/85 leading-relaxed">

            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">1. Who We Are</h2>
              <p className="text-sm">
                {BUSINESS_NAME} operates a car wash and detailing service at 1195 Wellness Pl, Henderson, NV 89011. Our SMS messages are sent via Twilio using a dedicated long-code number registered to our business. We are the sole sender of messages on this number — we do not share our messaging service with other companies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">2. Types of Messages We Send</h2>

              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-ink">2.1 Transactional / Service Messages</h3>
                  <p className="text-sm mb-3">These messages are directly related to services you have booked or subscriptions you have purchased. They are essential to service delivery and are sent to all customers regardless of marketing preferences:</p>
                  <ul className="list-none space-y-2 text-sm">
                    {[
                      'Booking confirmation (sent immediately upon booking)',
                      'Wash started notification (when your car enters service)',
                      'Almost ready notification (approximately 5 minutes before completion)',
                      'Ready for pickup notification (sent the moment your car is done, with before/after photos)',
                      'Membership billing reminders (3 days before renewal)',
                      'Membership renewal confirmation',
                      'Payment failure alerts',
                      'Referral credit notifications',
                      'Loyalty punch card milestones',
                    ].map((item, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="text-water shrink-0 mt-1">·</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-ink">2.2 Marketing Messages</h3>
                  <p className="text-sm mb-3">
                    We send promotional messages only with your separate, explicit consent. These include special offers, member-exclusive deals, and seasonal campaigns. You can opt in to marketing messages in your account settings and opt out at any time without affecting your service notifications.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">3. How We Obtain Consent</h2>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-semibold text-ink mb-1">Online Booking / Account Creation</p>
                  <p>When you book online or create an account, you provide your phone number and acknowledge that you will receive SMS notifications about your service. This consent is captured with your IP address and timestamp for audit purposes.</p>
                </div>
                <div>
                  <p className="font-semibold text-ink mb-1">In-Person (Walk-In)</p>
                  <p>When you book a walk-in service at our location, our staff records your consent method at the point of sale. You may verbally consent to SMS notifications, which is logged in our system.</p>
                </div>
                <div>
                  <p className="font-semibold text-ink mb-1">Keyword Opt-In</p>
                  <p>If you text a keyword to our number (e.g., JOIN), we will confirm your opt-in and explain the program before sending any other messages.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">4. How to Opt Out</h2>
              <div className="card-glass rounded-2xl p-6">
                <div className="space-y-4 text-sm">
                  <div className="flex gap-4 items-start">
                    <div className="w-16 shrink-0 font-mono font-black text-water text-lg">STOP</div>
                    <div>
                      <p className="font-semibold text-ink mb-1">Opt out of all messages</p>
                      <p className="text-muted">Reply STOP to any message. You will receive one final confirmation message, and then no further messages will be sent. This opts you out of all messages including service notifications. Note: if you opt out, we cannot notify you when your car is ready.</p>
                    </div>
                  </div>
                  <div className="hr-gradient" />
                  <div className="flex gap-4 items-start">
                    <div className="w-16 shrink-0 font-mono font-black text-water text-lg">HELP</div>
                    <div>
                      <p className="font-semibold text-ink mb-1">Get assistance</p>
                      <p className="text-muted">Reply HELP to receive our contact information and a link to this disclosure page.</p>
                    </div>
                  </div>
                  <div className="hr-gradient" />
                  <div className="flex gap-4 items-start">
                    <div className="w-16 shrink-0 font-mono font-black text-water text-lg">Email</div>
                    <div>
                      <p className="font-semibold text-ink mb-1">Manage preferences online</p>
                      <p className="text-muted">Log in to your account and adjust notification preferences, or email <a href={`mailto:${CONTACT_EMAIL}`} className="text-water hover:underline">{CONTACT_EMAIL}</a> to update your preferences without logging in.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">5. Quiet Hours</h2>
              <p className="text-sm">
                We do not send marketing or promotional SMS messages before 8:00 AM or after 9:00 PM local time (Pacific Time, which applies to Henderson, NV). Service-critical messages (e.g., your car is ready for pickup) may be sent outside these hours if your appointment runs into the early morning, but this is rare given our 7:00 AM–4:30 PM operating hours.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">6. Carrier Disclaimer</h2>
              <p className="text-sm">
                Carriers are not liable for delayed or undelivered messages. Message delivery depends on your carrier network and device. If you do not receive a confirmation or notification, please contact us directly at{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-water hover:underline">{CONTACT_EMAIL}</a>
                {' '}or via Instagram DM.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">7. TCPA Compliance</h2>
              <p className="text-sm">
                URRUTIA complies with the Telephone Consumer Protection Act (TCPA), 47 U.S.C. § 227, and implementing regulations. We maintain records of all consent obtained, including method, timestamp, and IP address. Opt-out requests are processed immediately and logged. We do not send messages to numbers on the National Do Not Call Registry without consent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">8. Contact</h2>
              <div className="card rounded-xl p-5 text-sm space-y-1">
                <p className="font-bold text-ink">{BUSINESS_NAME}</p>
                <p className="text-muted">1195 Wellness Pl, Henderson, NV 89011</p>
                <p><a href={`mailto:${CONTACT_EMAIL}`} className="text-water hover:underline">{CONTACT_EMAIL}</a></p>
                <p><a href="https://instagram.com/lvacwashndetail" target="_blank" rel="noopener noreferrer" className="text-water hover:underline">@lvacwashndetail</a></p>
              </div>
            </section>

          </div>

          <div className="mt-12 pt-8 border-t border-line flex flex-wrap gap-4 text-sm text-muted">
            <Link href="/privacy" className="hover:text-water transition-colors duration-200">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-water transition-colors duration-200">Terms of Service</Link>
            <Link href="/refund-policy" className="hover:text-water transition-colors duration-200">Refund Policy</Link>
            <Link href="/accessibility" className="hover:text-water transition-colors duration-200">Accessibility</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
