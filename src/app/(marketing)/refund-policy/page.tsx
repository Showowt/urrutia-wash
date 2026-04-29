import Link from 'next/link';

export const metadata = {
  title: 'Refund & Cancellation Policy — URRUTIA Carwash & Detail',
  description: 'Refund and cancellation policy for URRUTIA Carwash & Detail. Henderson, NV car wash and detailing.',
  robots: { index: true, follow: true },
};

const LAST_UPDATED = 'April 29, 2026';
const CONTACT_EMAIL = 'hello@urrutiawash.com';

function Breadcrumb() {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-muted mb-8">
      <Link href="/" className="hover:text-ink transition-colors duration-200">Home</Link>
      <span aria-hidden="true">/</span>
      <span className="text-ink">Refund Policy</span>
    </nav>
  );
}

function LegalDisclaimer() {
  return (
    <div className="mb-10 p-5 rounded-xl border border-flame/30 bg-flame/5">
      <p className="text-sm text-flame/90 font-semibold mb-1">Attorney Review Required</p>
      <p className="text-sm text-muted">
        This policy is a template and should be reviewed by a Nevada-licensed attorney before publication. MachineMind LLC is not a law firm and this does not constitute legal advice.
      </p>
    </div>
  );
}

export default function RefundPolicyPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-5 lg:px-8">
        <div className="pt-8">
          <Breadcrumb />

          <h1 className="text-4xl font-black mb-3">Refund &amp; Cancellation Policy</h1>
          <p className="text-sm text-muted font-mono mb-10">Last updated: {LAST_UPDATED}</p>

          <LegalDisclaimer />

          <div className="space-y-10 text-ink/85 leading-relaxed">

            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">Overview</h2>
              <p className="text-sm">
                We want you to love every wash and every detail. If something is wrong, we will make it right. This policy explains how refunds and cancellations work across all URRUTIA services. When in doubt, email us at{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-water hover:underline">{CONTACT_EMAIL}</a>
                {' '}and we will work with you.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">1. One-Off Wash Services</h2>

              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-ink">1.1 Quality Issues</h3>
                  <p className="text-sm">
                    If you are unsatisfied with the quality of your wash or detail, contact us within <strong className="text-ink">24 hours of vehicle pickup</strong>. We will schedule a complimentary re-service to correct any deficiencies. If a re-service cannot resolve the issue to your satisfaction, we will issue a full or partial refund at our discretion.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 text-ink">1.2 Cancellations</h3>
                  <p className="text-sm mb-3">
                    We request at least <strong className="text-ink">2 hours advance notice</strong> for appointment cancellations. Our cancellation policy is:
                  </p>
                  <div className="card rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-line bg-surface-2">
                          <th className="text-left p-4 font-semibold text-muted font-mono text-[11px] tracking-widest">NOTICE GIVEN</th>
                          <th className="text-left p-4 font-semibold text-muted font-mono text-[11px] tracking-widest">OUTCOME</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { notice: '2+ hours before appointment', outcome: 'No charge · Full refund if pre-paid' },
                          { notice: 'Less than 2 hours before', outcome: 'No charge for express / classic. Detail and ceramic: 25% of service price applies.' },
                          { notice: 'No-show (no notice given)', outcome: 'Express / classic: no charge. Detail and ceramic: 50% of service price.' },
                        ].map((row, i) => (
                          <tr key={i} className={`border-b border-line/40 ${i % 2 === 0 ? '' : 'bg-white/[0.012]'}`}>
                            <td className="p-4 text-ink/80">{row.notice}</td>
                            <td className="p-4 text-muted">{row.outcome}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-muted mt-2">
                    Repeated no-shows (3+) may require a 50% deposit for future detail or ceramic bookings.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 text-ink">1.3 Service Cannot Be Performed</h3>
                  <p className="text-sm">
                    If URRUTIA is unable to perform your booked service due to circumstances on our end (equipment failure, staffing, inclement weather for mobile), we will contact you immediately to reschedule or issue a full refund with no fees.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">2. Membership Subscriptions</h2>

              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-ink">2.1 Monthly Memberships</h3>
                  <p className="text-sm">
                    Monthly memberships may be cancelled at any time. Cancellation stops future billing immediately. Your membership and benefits remain active through the end of the period already paid. <strong className="text-ink">No refunds are issued for partial months.</strong>
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 text-ink">2.2 Annual Memberships</h3>
                  <p className="text-sm">
                    Annual memberships are billed upfront at a 15% discount. If you cancel within the first 7 days of your annual subscription and have used 2 or fewer wash credits, we will issue a prorated refund for unused full months. After 7 days, annual memberships are non-refundable but remain active through the paid period. You may downgrade to a monthly plan at your next renewal.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 text-ink">2.3 Unused Wash Credits</h3>
                  <p className="text-sm">
                    Unused wash credits are not refundable or transferable. Credits do not roll over between billing periods. The value of the membership is calibrated around regular use — if your circumstances change, we recommend pausing rather than cancelling.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 text-ink">2.4 Membership Pause</h3>
                  <p className="text-sm">
                    Rather than cancelling, you may pause your membership for up to 90 days per calendar year. During a pause, billing is suspended and credits are frozen. This is the recommended option for travel or extended absence.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 text-ink">2.5 Billing Errors</h3>
                  <p className="text-sm">
                    If you were charged incorrectly, contact us within 30 days of the charge at{' '}
                    <a href={`mailto:${CONTACT_EMAIL}`} className="text-water hover:underline">{CONTACT_EMAIL}</a>.
                    {' '}We will investigate and refund any confirmed billing errors promptly.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">3. Ceramic Coating &amp; Paint Correction</h2>
              <p className="text-sm mb-3">
                Due to the materials and labor involved in multi-stage paint correction and ceramic coating applications, these services are subject to modified refund terms:
              </p>
              <ul className="list-none space-y-2 text-sm">
                {[
                  'Full refund: if service has not yet begun and cancelled with 24+ hours notice',
                  '50% refund: if cancelled with less than 24 hours notice but service has not started',
                  'No refund: once service has commenced, due to cost of materials and crew time',
                  'Quality guarantee: if the coating fails to cure correctly due to application error, we will re-apply at no charge',
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-water shrink-0 mt-1">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">4. Gift Cards &amp; Credits</h2>
              <p className="text-sm">
                Gift cards and promotional credits are non-refundable and non-transferable. Referral credits ($25 per qualified referral) are applied to your account automatically and may be used toward any service. Credits have no cash value.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">5. How to Request a Refund</h2>
              <div className="card rounded-xl p-6 text-sm">
                <p className="font-semibold text-ink mb-3">Contact us via any of the following:</p>
                <ul className="space-y-2 text-muted">
                  <li>Email: <a href={`mailto:${CONTACT_EMAIL}`} className="text-water hover:underline">{CONTACT_EMAIL}</a></li>
                  <li>Instagram DM: <a href="https://instagram.com/lvacwashndetail" target="_blank" rel="noopener noreferrer" className="text-water hover:underline">@lvacwashndetail</a></li>
                  <li>In person: 1195 Wellness Pl, Henderson, NV 89074 · Mon–Sat 7:00–4:30</li>
                </ul>
                <p className="mt-4 text-muted">
                  Please include your name, phone number, service date, and a description of the issue. We will respond within 2 business days and process approved refunds within 5–10 business days back to your original payment method.
                </p>
              </div>
            </section>

          </div>

          <div className="mt-12 pt-8 border-t border-line flex flex-wrap gap-4 text-sm text-muted">
            <Link href="/privacy" className="hover:text-water transition-colors duration-200">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-water transition-colors duration-200">Terms of Service</Link>
            <Link href="/sms-consent" className="hover:text-water transition-colors duration-200">SMS Consent</Link>
            <Link href="/accessibility" className="hover:text-water transition-colors duration-200">Accessibility</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
