'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import BookingModal from '@/components/sections/BookingModal';
import RevealOnScroll from '@/components/cinema/RevealOnScroll';

type ModalPreset = 'express' | 'classic' | 'detail' | 'ceramic' | 'solo' | 'duo' | 'fleet' | null;

/* ─── Icon float wrapper ─── */
function FloatIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="icon-bob w-12 h-12 rounded-xl grid place-items-center flex-shrink-0">
      {children}
    </div>
  );
}

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
              No automated brushes. No shared rags. No shortcuts. Every car gets the treatment
              Vegas heat and dust demand.
            </p>
          </RevealOnScroll>

          {/* ─── Service Cards ─── */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Express */}
            <RevealOnScroll>
              <div className="service-card rounded-2xl p-6 flex flex-col h-full">
                <p className="font-mono text-[11px] text-muted tracking-widest mb-1">EXPRESS</p>
                <h3 className="text-2xl font-bold mb-1">Hand Wash</h3>
                <div className="flex items-baseline gap-1 mb-5">
                  <span className="text-3xl font-black price-gradient">$35</span>
                  <span className="text-sm text-muted">/ vehicle</span>
                </div>
                <ul className="space-y-2 text-sm text-muted flex-1 mb-6">
                  <li className="flex gap-2"><span className="text-water">·</span>Full hand wash + dry</li>
                  <li className="flex gap-2"><span className="text-water">·</span>Wheels &amp; tires</li>
                  <li className="flex gap-2"><span className="text-water">·</span>Window cleaning</li>
                  <li className="flex gap-2"><span className="text-water">·</span>Tire shine</li>
                  <li className="flex gap-2"><span className="text-water">·</span>~30 min turnaround</li>
                </ul>
                <button
                  onClick={() => openBooking('express')}
                  className="btn-ghost w-full py-3 rounded-xl text-sm cursor-pointer"
                >
                  Book Express
                </button>
              </div>
            </RevealOnScroll>

            {/* Classic */}
            <RevealOnScroll delay={100}>
              <div className="service-card rounded-2xl p-6 flex flex-col h-full">
                <p className="font-mono text-[11px] text-muted tracking-widest mb-1">CLASSIC</p>
                <h3 className="text-2xl font-bold mb-1">Wash + Interior</h3>
                <div className="flex items-baseline gap-1 mb-5">
                  <span className="text-3xl font-black price-gradient">$75</span>
                  <span className="text-sm text-muted">/ vehicle</span>
                </div>
                <ul className="space-y-2 text-sm text-muted flex-1 mb-6">
                  <li className="flex gap-2"><span className="text-water">·</span>Everything in Express</li>
                  <li className="flex gap-2"><span className="text-water">·</span>Full vacuum</li>
                  <li className="flex gap-2"><span className="text-water">·</span>Dash &amp; console wipe</li>
                  <li className="flex gap-2"><span className="text-water">·</span>Door jambs</li>
                  <li className="flex gap-2"><span className="text-water">·</span>~50 min turnaround</li>
                </ul>
                <button
                  onClick={() => openBooking('classic')}
                  className="btn-ghost w-full py-3 rounded-xl text-sm cursor-pointer"
                >
                  Book Classic
                </button>
              </div>
            </RevealOnScroll>

            {/* Full Detail — most popular */}
            <RevealOnScroll delay={200}>
              <div
                className="service-card rounded-2xl p-6 flex flex-col h-full relative overflow-visible"
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

                <p className="font-mono text-[11px] text-flame tracking-widest mb-1 mt-1">PREMIUM</p>
                <h3 className="text-2xl font-bold mb-1">Full Detail</h3>
                <div className="flex items-baseline gap-1 mb-5">
                  <span className="text-3xl font-black price-gradient">$295</span>
                  <span className="text-sm text-muted">starting</span>
                </div>
                <ul className="space-y-2 text-sm text-muted flex-1 mb-6">
                  <li className="flex gap-2"><span className="text-flame">·</span>Clay bar decontamination</li>
                  <li className="flex gap-2"><span className="text-flame">·</span>Hand wax + sealant</li>
                  <li className="flex gap-2"><span className="text-flame">·</span>Deep interior shampoo</li>
                  <li className="flex gap-2"><span className="text-flame">·</span>Leather conditioning</li>
                  <li className="flex gap-2"><span className="text-flame">·</span>Engine bay cleaning</li>
                </ul>
                <button
                  onClick={() => openBooking('detail')}
                  className="btn-primary w-full py-3 rounded-xl text-sm cursor-pointer"
                >
                  Book Detail
                </button>
              </div>
            </RevealOnScroll>

            {/* Ceramic */}
            <RevealOnScroll delay={300}>
              <div className="service-card rounded-2xl p-6 flex flex-col h-full">
                <p className="font-mono text-[11px] text-muted tracking-widest mb-1">PROTECTION</p>
                <h3 className="text-2xl font-bold mb-1">Ceramic Coating</h3>
                <div className="flex items-baseline gap-1 mb-5">
                  <span className="text-3xl font-black price-gradient">$895</span>
                  <span className="text-sm text-muted">starting</span>
                </div>
                <ul className="space-y-2 text-sm text-muted flex-1 mb-6">
                  <li className="flex gap-2"><span className="text-water">·</span>Multi-stage paint correction</li>
                  <li className="flex gap-2"><span className="text-water">·</span>9H ceramic application</li>
                  <li className="flex gap-2"><span className="text-water">·</span>UV + chemical protection</li>
                  <li className="flex gap-2"><span className="text-water">·</span>2&ndash;5 year durability</li>
                  <li className="flex gap-2"><span className="text-water">·</span>Hydrophobic finish</li>
                </ul>
                <button
                  onClick={() => openBooking('ceramic')}
                  className="btn-ghost w-full py-3 rounded-xl text-sm cursor-pointer"
                >
                  Get Quote
                </button>
              </div>
            </RevealOnScroll>
          </div>

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
