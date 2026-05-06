'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import RevealOnScroll from '@/components/cinema/RevealOnScroll';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

function Breadcrumb() {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-muted">
      <Link href="/" className="hover:text-ink transition-colors duration-200">Home</Link>
      <span aria-hidden="true">/</span>
      <span className="text-ink">Contact</span>
    </nav>
  );
}

export default function ContactPage() {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  function validate(): boolean {
    const e: Partial<typeof form> = {};
    if (!form.name.trim()) e.name = 'Name is required.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required.';
    if (!form.message.trim() || form.message.trim().length < 10) e.message = 'Message must be at least 10 characters.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus('loading');

    try {
      // Replace with actual API endpoint when backend is ready
      await new Promise((r) => setTimeout(r, 1200));
      setStatus('success');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch {
      setStatus('error');
    }
  }

  function handleChange(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  const CONTACT_ITEMS = [
    {
      label: 'Address',
      value: '1195 Wellness Pl, Henderson, NV 89011',
      sub: 'Inside LVAC parking lot',
      href: 'https://maps.google.com/?q=1195+Wellness+Pl+Henderson+NV+89011',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
    },
    {
      label: 'Hours',
      value: 'Mon–Sat · 7:00 AM – 4:30 PM',
      sub: 'Sunday · Closed',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
        </svg>
      ),
    },
    {
      label: 'Instagram',
      value: '@lvacwashndetail',
      sub: 'Fastest response via DM',
      href: 'https://instagram.com/lvacwashndetail',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.81.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.81-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.81-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.81.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.34 4.14.63a5.85 5.85 0 0 0-2.13 1.38A5.85 5.85 0 0 0 .63 4.14C.34 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.27 2.15.56 2.91a5.85 5.85 0 0 0 1.38 2.13 5.85 5.85 0 0 0 2.13 1.38c.76.29 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.27 2.91-.56a5.85 5.85 0 0 0 2.13-1.38 5.85 5.85 0 0 0 1.38-2.13c.29-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.27-2.15-.56-2.91a5.85 5.85 0 0 0-1.38-2.13A5.85 5.85 0 0 0 19.86.63c-.76-.29-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
        </svg>
      ),
    },
  ];

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
              <span className="w-1.5 h-1.5 rounded-full bg-success status-live" aria-hidden="true" />
              OPEN MON–SAT · 7:00–4:30
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={200}>
            <h1 className="mt-5 text-5xl lg:text-7xl font-black leading-none tracking-tight">
              <span className="text-gradient-luxury">Contact</span>
            </h1>
          </RevealOnScroll>
          <RevealOnScroll delay={300}>
            <p className="mt-6 text-lg text-muted max-w-2xl leading-relaxed">
              Questions about services, memberships, or a custom quote? Reach out below or DM us on Instagram — that&rsquo;s typically the fastest response.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      <div className="section-divider" />

      {/* ─── Contact Info + Form ─── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-16">

            {/* Left: Contact info */}
            <div className="lg:col-span-2 space-y-6">
              <RevealOnScroll>
                <h2 className="text-2xl font-bold mb-6">Find us.</h2>
              </RevealOnScroll>

              {CONTACT_ITEMS.map((item, i) => (
                <RevealOnScroll key={i} delay={i * 80}>
                  <div className="card rounded-2xl p-5 group">
                    <div className="flex gap-4 items-start">
                      <div className="contact-icon contact-icon-flame w-10 h-10 rounded-xl bg-water/8 border border-water/20 grid place-items-center text-water shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <p className="font-mono text-[10px] text-muted tracking-widest mb-1">{item.label.toUpperCase()}</p>
                        {item.href ? (
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold hover:text-water transition-colors duration-200"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="font-semibold">{item.value}</p>
                        )}
                        {item.sub && (
                          <p className="text-sm text-muted mt-0.5">{item.sub}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </RevealOnScroll>
              ))}

              {/* Map embed */}
              <RevealOnScroll delay={300}>
                <div className="map-frame mt-6">
                  <iframe
                    title="URRUTIA Carwash & Detail — LVAC Henderson, NV"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=-115.0950%2C36.0000%2C-115.0550%2C36.0300&layer=mapnik&marker=36.0128%2C-115.0775"
                    width="100%"
                    height="220"
                    loading="lazy"
                    style={{ border: 'none', display: 'block' }}
                    aria-label="Map showing URRUTIA Carwash at LVAC Henderson, NV"
                  />
                </div>
                <p className="text-xs text-muted mt-2 font-mono">
                  1195 Wellness Pl · Henderson, NV 89011 ·{' '}
                  <a
                    href="https://maps.google.com/?q=1195+Wellness+Pl+Henderson+NV+89011"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-water hover:underline"
                  >
                    Open in Maps
                  </a>
                </p>
              </RevealOnScroll>
            </div>

            {/* Right: Contact form */}
            <div className="lg:col-span-3">
              <RevealOnScroll variant="fade-left">
                <div className="card-glass rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-2">Send a message.</h2>
                  <p className="text-muted text-sm mb-8">
                    We&rsquo;ll reply within one business day. For urgent requests, DM us on Instagram.
                  </p>

                  {status === 'success' ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-success/15 border border-success/30 grid place-items-center mx-auto mb-5">
                        <svg className="w-8 h-8 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold mb-2">Message received.</h3>
                      <p className="text-muted text-sm">We&rsquo;ll get back to you within one business day.</p>
                      <button
                        onClick={() => setStatus('idle')}
                        className="btn-ghost mt-6 px-6 py-3 rounded-full text-sm cursor-pointer"
                      >
                        Send another
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} noValidate className="space-y-5">
                      {/* Name */}
                      <div>
                        <label htmlFor="contact-name" className="block text-sm font-medium mb-2">
                          Name <span className="text-flame" aria-hidden="true">*</span>
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          value={form.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                          className="field w-full px-4 py-3 rounded-xl text-sm"
                          placeholder="Your name"
                          aria-required="true"
                          aria-invalid={!!errors.name}
                          aria-describedby={errors.name ? 'name-error' : undefined}
                        />
                        {errors.name && (
                          <p id="name-error" role="alert" className="text-flame text-xs mt-1.5 flex items-center gap-1">
                            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z"/></svg>
                            {errors.name}
                          </p>
                        )}
                      </div>

                      {/* Email + Phone */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="contact-email" className="block text-sm font-medium mb-2">
                            Email <span className="text-flame" aria-hidden="true">*</span>
                          </label>
                          <input
                            id="contact-email"
                            type="email"
                            value={form.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            className="field w-full px-4 py-3 rounded-xl text-sm"
                            placeholder="you@email.com"
                            aria-required="true"
                            aria-invalid={!!errors.email}
                            aria-describedby={errors.email ? 'email-error' : undefined}
                          />
                          {errors.email && (
                            <p id="email-error" role="alert" className="text-flame text-xs mt-1.5">{errors.email}</p>
                          )}
                        </div>
                        <div>
                          <label htmlFor="contact-phone" className="block text-sm font-medium mb-2">
                            Phone <span className="text-muted text-xs">(optional)</span>
                          </label>
                          <input
                            id="contact-phone"
                            type="tel"
                            value={form.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                            className="field w-full px-4 py-3 rounded-xl text-sm"
                            placeholder="(702) 555-0100"
                          />
                        </div>
                      </div>

                      {/* Message */}
                      <div>
                        <label htmlFor="contact-message" className="block text-sm font-medium mb-2">
                          Message <span className="text-flame" aria-hidden="true">*</span>
                        </label>
                        <textarea
                          id="contact-message"
                          value={form.message}
                          onChange={(e) => handleChange('message', e.target.value)}
                          rows={5}
                          className="field w-full px-4 py-3 rounded-xl text-sm resize-none"
                          placeholder="What can we help you with? Include your vehicle make/model if asking about a specific service."
                          aria-required="true"
                          aria-invalid={!!errors.message}
                          aria-describedby={errors.message ? 'message-error' : undefined}
                        />
                        {errors.message && (
                          <p id="message-error" role="alert" className="text-flame text-xs mt-1.5">{errors.message}</p>
                        )}
                      </div>

                      {status === 'error' && (
                        <p role="alert" className="text-flame text-sm text-center py-3 bg-flame/5 rounded-xl border border-flame/20">
                          Something went wrong. Please try again or DM us on Instagram.
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="btn-primary w-full py-4 rounded-xl font-bold text-sm cursor-pointer shimmer-btn disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {status === 'loading' ? 'Sending…' : 'Send Message'}
                      </button>

                      <p className="text-xs text-muted text-center">
                        By submitting, you agree to our{' '}
                        <Link href="/privacy" className="text-water hover:underline">Privacy Policy</Link>
                        {' '}and{' '}
                        <Link href="/sms-consent" className="text-water hover:underline">SMS Consent</Link>.
                      </p>
                    </form>
                  )}
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Direct booking CTA ─── */}
      <div className="section-divider" />
      <section className="py-20 lg:py-24 bg-surface">
        <div className="max-w-3xl mx-auto px-5 lg:px-8 text-center">
          <RevealOnScroll>
            <p className="font-mono text-xs text-water tracking-widest mb-3">SKIP THE FORM</p>
            <h2 className="text-3xl font-black mb-4">Ready to book directly?</h2>
            <p className="text-muted mb-8">
              Book online and get SMS confirmation in under a minute. No deposit required.
            </p>
            <Link
              href="/"
              className="btn-primary px-8 py-4 rounded-full text-base font-bold inline-block shimmer-btn"
            >
              Book My Wash
            </Link>
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}
