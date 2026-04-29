'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import RevealOnScroll from '@/components/cinema/RevealOnScroll';

type Filter = 'all' | 'express' | 'detail' | 'ceramic' | 'interior';

const GALLERY_ITEMS = [
  {
    id: 1,
    label: 'G63 AMG · BRABUS',
    sub: 'Full Detail + Ceramic',
    category: 'ceramic' as Filter,
    imageSrc: '/gallery/brabus-g63.jpg',
    imageAlt: 'Brabus G63 AMG detailed by URRUTIA — showroom ceramic finish',
    isReal: true,
    bg: '',
    accent: 'rgba(255,107,26,0.4)',
    span: 'md:col-span-2 md:row-span-2',
  },
  {
    id: 2,
    label: 'Ford Raptor · Stealth Gray',
    sub: 'Express Hand Wash',
    category: 'express' as Filter,
    isReal: false,
    bg: 'linear-gradient(135deg, #1a0f05 0%, #2a1a08 40%, #1a0a04 100%)',
    accent: 'rgba(255,107,26,0.4)',
    span: '',
  },
  {
    id: 3,
    label: 'Rolls-Royce Cullinan',
    sub: 'Ceramic Coating',
    category: 'ceramic' as Filter,
    isReal: false,
    bg: 'linear-gradient(135deg, #05140f 0%, #0a251a 40%, #031008 100%)',
    accent: 'rgba(16,185,129,0.5)',
    span: '',
  },
  {
    id: 4,
    label: 'BMW M3 Competition',
    sub: 'Interior Detail',
    category: 'interior' as Filter,
    isReal: false,
    bg: 'linear-gradient(135deg, #0a0515 0%, #140a25 40%, #07031a 100%)',
    accent: 'rgba(0,180,255,0.35)',
    span: '',
  },
  {
    id: 5,
    label: 'Jeep Wrangler · Matte',
    sub: 'Wash + Interior',
    category: 'express' as Filter,
    isReal: false,
    bg: 'linear-gradient(135deg, #080510 0%, #130a1e 40%, #060315 100%)',
    accent: 'rgba(255,255,255,0.15)',
    span: '',
  },
  {
    id: 6,
    label: 'Ford F-450 Platinum',
    sub: 'Paint Correction + Ceramic',
    category: 'ceramic' as Filter,
    isReal: false,
    bg: 'linear-gradient(135deg, #150a02 0%, #251503 40%, #100801 100%)',
    accent: 'rgba(255,107,26,0.3)',
    span: '',
  },
  {
    id: 7,
    label: 'Porsche Cayenne · Black',
    sub: 'Full Detail',
    category: 'detail' as Filter,
    isReal: false,
    bg: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 40%, #0a0a0a 100%)',
    accent: 'rgba(255,255,255,0.1)',
    span: '',
  },
  {
    id: 8,
    label: 'Tesla Model S Plaid',
    sub: 'Ceramic Coating',
    category: 'ceramic' as Filter,
    isReal: false,
    bg: 'linear-gradient(135deg, #0a1020 0%, #15203a 40%, #08101a 100%)',
    accent: 'rgba(0,180,255,0.4)',
    span: '',
  },
  {
    id: 9,
    label: 'Range Rover Sport',
    sub: 'Full Interior Detail',
    category: 'interior' as Filter,
    isReal: false,
    bg: 'linear-gradient(135deg, #0e0905 0%, #1c1208 40%, #0a0804 100%)',
    accent: 'rgba(255,180,50,0.3)',
    span: '',
  },
  {
    id: 10,
    label: 'Mercedes S580',
    sub: 'Full Detail + Paint Correction',
    category: 'detail' as Filter,
    isReal: false,
    bg: 'linear-gradient(135deg, #050810 0%, #0b1025 40%, #050810 100%)',
    accent: 'rgba(0,100,200,0.3)',
    span: '',
  },
  {
    id: 11,
    label: 'Lamborghini Urus',
    sub: 'Ceramic Coating',
    category: 'ceramic' as Filter,
    isReal: false,
    bg: 'linear-gradient(135deg, #1a0500 0%, #2a0a00 40%, #150300 100%)',
    accent: 'rgba(255,107,26,0.6)',
    span: '',
  },
  {
    id: 12,
    label: 'Cadillac Escalade',
    sub: 'Express Hand Wash',
    category: 'express' as Filter,
    isReal: false,
    bg: 'linear-gradient(135deg, #080808 0%, #141414 40%, #060606 100%)',
    accent: 'rgba(180,150,100,0.3)',
    span: '',
  },
];

const FILTERS: { label: string; value: Filter }[] = [
  { label: 'All Work', value: 'all' },
  { label: 'Express Wash', value: 'express' },
  { label: 'Full Detail', value: 'detail' },
  { label: 'Ceramic Coating', value: 'ceramic' },
  { label: 'Interior Detail', value: 'interior' },
];

function Breadcrumb() {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-muted">
      <Link href="/" className="hover:text-ink transition-colors duration-200">Home</Link>
      <span aria-hidden="true">/</span>
      <span className="text-ink">Gallery</span>
    </nav>
  );
}

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>('all');

  const filtered = activeFilter === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === activeFilter);

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
              <span className="w-1.5 h-1.5 rounded-full bg-water pulse-ring" aria-hidden="true" />
              THE WORK · @lvacwashndetail
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={200}>
            <h1 className="mt-5 text-5xl lg:text-7xl font-black leading-none tracking-tight">
              <span className="text-gradient-luxury">The Work</span>
            </h1>
          </RevealOnScroll>
          <RevealOnScroll delay={300}>
            <p className="mt-6 text-lg text-muted max-w-2xl leading-relaxed">
              From daily drivers to seven-figure builds. Every car gets the same standard — the kind that shows up in photos and holds up to Henderson heat.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      <div className="section-divider" />

      {/* ─── Filter bar ─── */}
      <section className="py-8 bg-surface sticky top-16 z-30 border-b border-line">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                aria-pressed={activeFilter === f.value}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                  activeFilter === f.value
                    ? 'bg-water text-void font-bold'
                    : 'btn-ghost'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Gallery Grid ─── */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[220px] gap-3">
            {filtered.map((item, i) => (
              <RevealOnScroll
                key={item.id}
                delay={i * 50}
                className={item.span || ''}
              >
                <div className="relative w-full h-full rounded-2xl overflow-hidden group cursor-pointer">
                  {item.isReal ? (
                    <Image
                      src={item.imageSrc!}
                      alt={item.imageAlt!}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      style={{ objectFit: 'cover', objectPosition: 'center', transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)' }}
                      className="group-hover:scale-105"
                    />
                  ) : (
                    <div
                      className="absolute inset-0"
                      style={{ background: item.bg }}
                    >
                      <div
                        className="absolute inset-0 opacity-30"
                        style={{ background: `radial-gradient(ellipse at 40% 40%, ${item.accent}, transparent 60%)` }}
                        aria-hidden="true"
                      />
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div
                    className="absolute inset-0 transition-opacity duration-400"
                    style={{ background: 'linear-gradient(to top, rgba(5,8,16,0.9) 0%, rgba(5,8,16,0.2) 50%, transparent 100%)' }}
                  />

                  {/* Labels */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="font-mono text-[10px] tracking-widest text-water mb-1">
                      {item.sub.toUpperCase()}
                    </p>
                    <p className="font-bold text-sm text-ink">{item.label}</p>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-24">
              <p className="text-muted text-lg">No photos in this category yet.</p>
              <p className="text-muted text-sm mt-2">Check Instagram for the latest work.</p>
            </div>
          )}
        </div>
      </section>

      <div className="section-divider" />

      {/* ─── Before / After Section ─── */}
      <section className="py-20 lg:py-28 bg-surface">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <RevealOnScroll className="mb-12">
            <p className="font-mono text-xs text-water tracking-widest mb-3">BEFORE / AFTER</p>
            <h2 className="text-3xl lg:text-4xl font-bold">
              The difference is not subtle.
            </h2>
            <p className="mt-4 text-muted text-lg max-w-xl">
              Real results from real vehicles. Photos taken on-site before we start and the moment we hand the keys back.
            </p>
          </RevealOnScroll>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                vehicle: 'G63 AMG · BRABUS',
                service: 'Ceramic Coating',
                beforeBg: 'ph-1',
                afterSrc: '/gallery/brabus-g63.jpg',
                afterAlt: 'Brabus G63 AMG after ceramic coating by URRUTIA — showroom finish',
                isReal: true,
              },
              {
                vehicle: 'Ford F-450 Platinum',
                service: 'Full Detail',
                beforeBg: 'ph-2',
                afterBg: 'ph-6',
                isReal: false,
              },
            ].map((ba, i) => (
              <RevealOnScroll key={i} delay={i * 100}>
                <div className="card rounded-2xl overflow-hidden">
                  <div className="grid grid-cols-2 h-56 sm:h-64">
                    <div className={`relative overflow-hidden ${ba.beforeBg}`}>
                      <div className="absolute inset-0 bg-black/40 flex items-end p-4">
                        <div>
                          <span className="font-mono text-[10px] text-white/70 tracking-widest block">BEFORE</span>
                        </div>
                      </div>
                    </div>
                    <div className="relative overflow-hidden">
                      {ba.isReal ? (
                        <Image
                          src={ba.afterSrc!}
                          alt={ba.afterAlt!}
                          fill
                          className="object-cover"
                          sizes="280px"
                        />
                      ) : (
                        <div className={`absolute inset-0 ${ba.afterBg}`} />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-4">
                        <span className="font-mono text-[10px] text-white/80 tracking-widest">AFTER</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t border-line bg-surface-2">
                    <p className="font-mono text-[10px] text-water tracking-widest">{ba.service.toUpperCase()}</p>
                    <p className="font-semibold mt-0.5">{ba.vehicle}</p>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>

          <RevealOnScroll className="mt-8 flex justify-center" delay={200}>
            <a
              href="https://instagram.com/lvacwashndetail"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary px-8 py-4 rounded-full text-sm font-bold flex items-center gap-2 shimmer-btn"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.81.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.81-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.81-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.81.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.34 4.14.63a5.85 5.85 0 0 0-2.13 1.38A5.85 5.85 0 0 0 .63 4.14C.34 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.27 2.15.56 2.91a5.85 5.85 0 0 0 1.38 2.13 5.85 5.85 0 0 0 2.13 1.38c.76.29 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.27 2.91-.56a5.85 5.85 0 0 0 2.13-1.38 5.85 5.85 0 0 0 1.38-2.13c.29-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.27-2.15-.56-2.91a5.85 5.85 0 0 0-1.38-2.13A5.85 5.85 0 0 0 19.86.63c-.76-.29-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
              </svg>
              Follow @lvacwashndetail
            </a>
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}
