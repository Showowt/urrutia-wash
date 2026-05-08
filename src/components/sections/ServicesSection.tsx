'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import BookingModal from '@/components/sections/BookingModal';
import RevealOnScroll from '@/components/cinema/RevealOnScroll';

type ModalPreset = 'small_exterior' | 'small_full' | 'medium_exterior' | 'medium_full' | 'large_exterior' | 'large_full' | 'detail' | null;

/* ─── Icon float wrapper ─── */
function FloatIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="icon-bob w-12 h-12 rounded-xl grid place-items-center flex-shrink-0">
      {children}
    </div>
  );
}

const SIZE_CARDS = [
  {
    size: 'SMALL',
    desc: 'Sedans · Coupes · Compacts',
    exterior: { price: '$35', id: 'small_exterior' as const },
    full: { price: '$55', id: 'small_full' as const },
  },
  {
    size: 'MEDIUM',
    desc: 'SUVs · Crossovers · Wagons',
    exterior: { price: '$40', id: 'medium_exterior' as const },
    full: { price: '$65', id: 'medium_full' as const },
  },
  {
    size: 'LARGE',
    desc: 'Trucks · Full-size SUVs · Vans',
    exterior: { price: '$45', id: 'large_exterior' as const },
    full: { price: '$75', id: 'large_full' as const },
  },
];

export default function ServicesSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPreset, setModalPreset] = useState<ModalPreset>(null);
  const [ribbonMounted, setRibbonMounted] = useState(false);

  function openBooking(preset: ModalPreset) {
    setModalPreset(preset);
    setModalOpen(true);
  }

  /* Trigger ribbon animation after mount */
  useEffect(() => {
    const t = setTimeout(() => setRibbonMounted(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <section id="services" className="py-24 lg:py-32 bg-surface border-y border-line overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">

          {/* ─── Header ─── */}
          <RevealOnScroll className="max-w-2xl mb-16">
            <p className="font-mono text-xs text-water tracking-widest mb-3">02 — SERVICES</p>
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
              Hand-finished. Every time.
            </h2>
            <p className="mt-4 text-muted text-lg">
              No automated brushes. No shared rags. No shortcuts. Pricing based on vehicle size —
              every car gets the treatment Vegas heat and dust demand.
            </p>
          </RevealOnScroll>

          {/* ─── Size-based Price Cards ─── */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {SIZE_CARDS.map((card, i) => (
              <RevealOnScroll key={card.size} delay={i * 100}>
                <div className="service-card rounded-2xl p-6 flex flex-col h-full">
                  <p className="font-mono text-[11px] text-muted tracking-widest mb-1">{card.size}</p>
                  <h3 className="text-xl font-bold mb-1">{card.desc}</h3>

                  <div className="mt-4 space-y-3 flex-1">
                    {/* Exterior */}
                    <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(27,34,54,0.8)' }}>
                      <div>
                        <p className="text-sm font-semibold">Exterior Only</p>
                        <p className="text-xs text-muted">Hand wash, dry, wheels, tires, jambs</p>
                      </div>
                      <span className="text-2xl font-black price-gradient">{card.exterior.price}</span>
                    </div>

                    {/* Interior + Exterior */}
                    <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(0,180,255,0.04)', border: '1px solid rgba(0,180,255,0.2)' }}>
                      <div>
                        <p className="text-sm font-semibold">Interior + Exterior</p>
                        <p className="text-xs text-muted">Full exterior + vacuum, wipedown, windows</p>
                      </div>
                      <span className="text-2xl font-black price-gradient">{card.full.price}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-5">
                    <button
                      onClick={() => openBooking(card.exterior.id)}
                      className="btn-ghost py-2.5 rounded-xl text-xs cursor-pointer"
                    >
                      Book Exterior
                    </button>
                    <button
                      onClick={() => openBooking(card.full.id)}
                      className="btn-primary py-2.5 rounded-xl text-xs cursor-pointer"
                    >
                      Book Full
                    </button>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>

          {/* ─── Full Detail Card ─── */}
          <RevealOnScroll delay={300}>
            <div
              className="service-card rounded-2xl p-6 relative overflow-visible"
              style={{
                borderColor: 'rgba(255,107,26,0.5)',
                background: 'linear-gradient(160deg, rgba(255,107,26,0.06) 0%, rgba(255,107,26,0.01) 60%, transparent 100%)',
              }}
            >
              {/* Shimmer ribbon */}
              <div
                className={`absolute -top-3.5 left-5 ribbon-lux px-3.5 py-1 rounded-full text-[10px] font-black tracking-widest z-10 ${
                  ribbonMounted ? '' : 'opacity-0'
                }`}
                style={{ transition: 'opacity 0.4s ease' }}
              >
                MOST POPULAR
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                <div>
                  <p className="font-mono text-[11px] text-flame tracking-widest mb-1 mt-1">PREMIUM</p>
                  <h3 className="text-2xl font-bold mb-1">Full Detail</h3>
                  <ul className="space-y-1.5 text-sm text-muted mt-3">
                    <li className="flex gap-2"><span className="text-flame">·</span>Clay bar decontamination</li>
                    <li className="flex gap-2"><span className="text-flame">·</span>Hand wax + sealant</li>
                    <li className="flex gap-2"><span className="text-flame">·</span>Deep interior shampoo</li>
                    <li className="flex gap-2"><span className="text-flame">·</span>Leather conditioning</li>
                    <li className="flex gap-2"><span className="text-flame">·</span>Engine bay cleaning</li>
                  </ul>
                </div>
                <div className="flex items-center gap-5">
                  <div className="text-right">
                    <span className="text-4xl font-black price-gradient">$295</span>
                    <span className="text-sm text-muted ml-1">starting</span>
                  </div>
                  <button
                    onClick={() => openBooking('detail')}
                    className="btn-primary py-3 px-6 rounded-xl text-sm cursor-pointer whitespace-nowrap"
                  >
                    Book Detail
                  </button>
                </div>
              </div>
            </div>
          </RevealOnScroll>

          {/* ─── Add-Ons Section ─── */}
          <RevealOnScroll className="mt-8">
            <div className="card rounded-2xl p-6">
              <p className="font-mono text-[11px] text-water tracking-widest mb-4">ADD-ONS</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Deep wheel clean', price: '$15' },
                  { label: 'Spray wax', price: '$25' },
                  { label: 'Hand wax', price: '$55–$75' },
                  { label: 'Leather conditioner', price: '$25–$35' },
                  { label: 'Engine bay', price: '$45–$55' },
                  { label: 'Shampoo', price: 'from $65' },
                  { label: 'Headlight restoration', price: '$100/set' },
                ].map((addon) => (
                  <div key={addon.label} className="flex items-center justify-between p-2.5 rounded-lg text-sm" style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <span className="text-muted">{addon.label}</span>
                    <span className="font-mono text-xs text-water font-semibold ml-2 shrink-0">{addon.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </RevealOnScroll>

          {/* ─── Desert Callout ─── */}
          <RevealOnScroll className="mt-10">
            <div className="desert-card rounded-2xl p-6 lg:p-8 flex flex-col lg:flex-row gap-6 lg:items-center">
              <FloatIcon>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-flame to-flame-soft grid place-items-center">
                  <Star className="w-6 h-6 text-[#08101F]" fill="currentColor" />
                </div>
              </FloatIcon>
              <div className="flex-1">
                <h4 className="text-lg font-bold mb-1">Built For Desert Conditions</h4>
                <p className="text-muted leading-relaxed">
                  UV-rated wax. Monsoon-ready sealants. Sandstorm recovery packages. The only car
                  care service in Henderson that builds protocols around the actual climate your car
                  lives in.
                </p>
              </div>
            </div>
          </RevealOnScroll>

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
