'use client';

import { useState, useEffect } from 'react';
import { MapPin, Clock, Phone } from 'lucide-react';
import BookingModal from '@/components/sections/BookingModal';
import RevealOnScroll from '@/components/cinema/RevealOnScroll';

type ModalPreset = 'express' | 'classic' | 'detail' | 'ceramic' | 'solo' | 'duo' | 'fleet' | 'mobile' | null;

/* ─── Operating hours: Mon–Sat 7:00–16:30 PST ─── */
function getOperatingStatus(): { isOpen: boolean; label: string; nextAction: string } {
  // Use PST (UTC-8) / PDT (UTC-7) — Henderson, NV
  const now = new Date();
  const pstOffset = -7; // PDT (daylight saving active in spring/summer)
  const localMs = now.getTime() + now.getTimezoneOffset() * 60000 + pstOffset * 3600000;
  const pst = new Date(localMs);

  const day     = pst.getDay();   // 0=Sun, 1=Mon … 6=Sat
  const hour    = pst.getHours();
  const minute  = pst.getMinutes();
  const timeVal = hour * 60 + minute; // minutes since midnight

  const openMin  = 7 * 60;       // 7:00 AM
  const closeMin = 16 * 60 + 30; // 4:30 PM

  const isWeekday = day >= 1 && day <= 6; // Mon–Sat

  if (isWeekday && timeVal >= openMin && timeVal < closeMin) {
    const remaining = closeMin - timeVal;
    const hrs = Math.floor(remaining / 60);
    const mins = remaining % 60;
    const closes = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
    return { isOpen: true, label: 'Open Now', nextAction: `Closes in ${closes}` };
  }

  if (day === 0) {
    return { isOpen: false, label: 'Closed Today', nextAction: 'Opens Mon at 7:00 AM' };
  }

  if (timeVal < openMin && isWeekday) {
    const minsUntil = openMin - timeVal;
    const hrs = Math.floor(minsUntil / 60);
    const mins = minsUntil % 60;
    return {
      isOpen: false,
      label: 'Closed',
      nextAction: hrs > 0 ? `Opens in ${hrs}h ${mins}m` : `Opens in ${mins}m`,
    };
  }

  // After closing on a weekday
  const nextDay = day === 6 ? 'Mon' : ['Mon','Tue','Wed','Thu','Fri','Sat'][day];
  return { isOpen: false, label: 'Closed', nextAction: `Opens ${nextDay} at 7:00 AM` };
}

export default function LocationSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPreset, setModalPreset] = useState<ModalPreset>(null);
  const [status, setStatus] = useState<ReturnType<typeof getOperatingStatus> | null>(null);

  function openBooking(preset: ModalPreset) {
    setModalPreset(preset);
    setModalOpen(true);
  }

  /* Hydrate status client-side only to avoid SSR mismatch */
  useEffect(() => {
    setStatus(getOperatingStatus());
    const interval = setInterval(() => setStatus(getOperatingStatus()), 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <section id="location" className="py-24 lg:py-32 bg-surface border-y border-line">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-start">

            {/* ─── Info column ─── */}
            <RevealOnScroll>
              <p className="font-mono text-xs text-water tracking-widest mb-3">05 — FIND US</p>
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight mb-2">
                Henderson&rsquo;s premium hand wash &mdash; right where you train.
              </h2>
              <p className="text-water font-mono text-xs tracking-wider mb-8">
                Henderson&rsquo;s only premium hand wash at LVAC
              </p>

              {/* Operating status badge */}
              {status && (
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-line bg-surface-2 mb-8">
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      status.isOpen
                        ? 'bg-success status-live'
                        : 'bg-red-500 status-closed'
                    }`}
                    aria-hidden="true"
                  />
                  <span className={`font-semibold text-sm ${status.isOpen ? 'text-success' : 'text-red-400'}`}>
                    {status.label}
                  </span>
                  <span className="text-muted text-xs font-mono">·</span>
                  <span className="text-muted text-xs font-mono">{status.nextAction}</span>
                </div>
              )}

              <div className="space-y-5">
                {/* Address */}
                <div className="flex gap-4 items-start group">
                  <div className="contact-icon w-10 h-10 rounded-xl bg-water/8 border border-water/25 grid place-items-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-water" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">LVAC Henderson</p>
                    <p className="text-sm text-muted">
                      1195 Wellness Pl
                      <br />
                      Henderson, NV 89074
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex gap-4 items-start group">
                  <div className="contact-icon w-10 h-10 rounded-xl bg-water/8 border border-water/25 grid place-items-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-water" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Hours</p>
                    <p className="text-sm text-muted">
                      Mon &ndash; Sat &middot; 7:00 AM &ndash; 4:30 PM
                      <br />
                      Mobile service available 7 days / week
                    </p>
                  </div>
                </div>

                {/* Contact */}
                <div className="flex gap-4 items-start group">
                  <div className="contact-icon contact-icon-flame w-10 h-10 rounded-xl bg-flame/8 border border-flame/25 grid place-items-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-flame" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Direct line</p>
                    <p className="text-sm text-muted">
                      DM{' '}
                      <a
                        href="https://instagram.com/lvacwashndetail"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-water hover:underline"
                      >
                        @lvacwashndetail
                      </a>{' '}
                      on Instagram
                      <br />
                      Or book through this site &mdash; we&rsquo;ll text you back.
                    </p>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="mt-10 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => openBooking(null)}
                  className="btn-primary px-7 py-3.5 rounded-full text-sm font-bold cursor-pointer shadow-lg hover:shadow-flame/30 transition-shadow"
                >
                  Book at LVAC
                </button>
                <button
                  onClick={() => openBooking('mobile')}
                  className="btn-ghost px-7 py-3.5 rounded-full text-sm cursor-pointer hover:border-water/50 hover:text-water transition-all"
                >
                  Book Mobile Service
                </button>
              </div>
            </RevealOnScroll>

            {/* ─── Map column ─── */}
            <RevealOnScroll delay={100} variant="fade-left">
              <div className="relative">
                {/* Outer glow ring */}
                <div
                  className="absolute -inset-px rounded-2xl pointer-events-none"
                  aria-hidden="true"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0,180,255,0.25), transparent 50%, rgba(0,102,204,0.15))',
                    borderRadius: '18px',
                  }}
                />
                <div className="map-frame relative">
                  <div className="aspect-[4/3]">
                    <iframe
                      src="https://www.openstreetmap.org/export/embed.html?bbox=-115.090%2C36.040%2C-115.045%2C36.075&layer=mapnik&marker=36.0570%2C-115.0680"
                      className="w-full h-full"
                      style={{ filter: 'invert(0.9) hue-rotate(180deg) saturate(0.4) brightness(0.85)' }}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="LVAC Henderson location map"
                    />
                  </div>
                  {/* Map label overlay */}
                  <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-void/90 to-transparent pointer-events-none">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-water status-live flex-shrink-0" aria-hidden="true" />
                      <p className="font-mono text-xs text-ink/80 tracking-wider">LVAC Henderson · 1195 Wellness Pl</p>
                    </div>
                  </div>
                </div>
              </div>
            </RevealOnScroll>

          </div>
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
