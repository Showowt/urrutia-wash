'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import RevealOnScroll from '@/components/cinema/RevealOnScroll';

type Filter = 'all' | 'express' | 'detail' | 'ceramic' | 'trucks';

interface GalleryItem {
  id: string;
  label: string;
  sub: string;
  category: Filter;
  imageSrc: string;
  imageAlt: string;
  span: string;
  height: string;
}

// Static photos as fallback — these always show
const STATIC_ITEMS: GalleryItem[] = [
  { id: 's1', label: 'G63 AMG · BRABUS', sub: 'Full Detail + Ceramic', category: 'ceramic', imageSrc: '/gallery/brabus-g63-sunset.jpg', imageAlt: 'Brabus G63 AMG at sunset — ceramic coating by LVAC Carwash Henderson', span: 'col-span-2 row-span-2', height: 'h-[460px] sm:h-[520px]' },
  { id: 's2', label: 'Rolls-Royce Cullinan · Rose Gold', sub: 'Full Detail', category: 'detail', imageSrc: '/gallery/rolls-royce-cullinan-rose-gold.jpg', imageAlt: 'Rolls-Royce Cullinan rose gold chrome wrap detailed at LVAC Henderson', span: '', height: 'h-[250px]' },
  { id: 's3', label: 'Corvette C8 · Torch Red', sub: 'Ceramic Coating', category: 'ceramic', imageSrc: '/gallery/corvette-c8-red.jpg', imageAlt: 'Corvette C8 Torch Red ceramic coating at LVAC Carwash', span: '', height: 'h-[250px]' },
  { id: 's4', label: 'Rolls-Royce Ghost · Black', sub: 'Full Detail', category: 'detail', imageSrc: '/gallery/rolls-royce-ghost-black.jpg', imageAlt: 'Rolls-Royce Ghost Black detailed at LVAC Henderson', span: 'col-span-2', height: 'h-[300px]' },
  { id: 's5', label: 'BMW M4 · Isle of Man Green', sub: 'Ceramic Coating', category: 'ceramic', imageSrc: '/gallery/bmw-m4-green.jpg', imageAlt: 'BMW M4 Isle of Man Green with carbon lip — ceramic coating', span: '', height: 'h-[320px]' },
  { id: 's6', label: 'Ford Raptor · Dark Gray', sub: 'Express Hand Wash', category: 'trucks', imageSrc: '/gallery/ford-raptor-gray.jpg', imageAlt: 'Ford Raptor dark gray — express hand wash at LVAC Henderson', span: '', height: 'h-[320px]' },
  { id: 's7', label: 'Porsche 993 · Dark Green', sub: 'Full Detail', category: 'detail', imageSrc: '/gallery/porsche-993-green.jpg', imageAlt: 'Porsche 993 dark green classic detailed at LVAC Henderson', span: '', height: 'h-[280px]' },
  { id: 's8', label: 'Rolls-Royce Cullinan · White', sub: 'Ceramic Coating', category: 'ceramic', imageSrc: '/gallery/rolls-royce-cullinan-white.jpg', imageAlt: 'Rolls-Royce Cullinan white with teal wheels — ceramic coating at LVAC', span: 'col-span-2', height: 'h-[360px]' },
  { id: 's9', label: 'Corvette C8 · Amplify Orange', sub: 'Full Detail', category: 'detail', imageSrc: '/gallery/corvette-c8-orange.jpg', imageAlt: 'Corvette C8 Amplify Orange with gold wheels — full detail', span: '', height: 'h-[280px]' },
  { id: 's10', label: 'Cadillac Escalade · Sport Black', sub: 'Full Detail', category: 'detail', imageSrc: '/gallery/cadillac-escalade-black.jpg', imageAlt: 'Cadillac Escalade Sport Black — full detail at LVAC Henderson', span: '', height: 'h-[300px]' },
  { id: 's11', label: 'Camaro SS + Challenger · Duo', sub: 'Express Hand Wash', category: 'express', imageSrc: '/gallery/camaro-challenger-duo.jpg', imageAlt: 'Camaro SS Blue and Chrome Dodge Challenger — duo wash with mountain backdrop', span: 'col-span-2', height: 'h-[340px]' },
  { id: 's12', label: 'Mercedes S-Class · Black', sub: 'Full Detail', category: 'detail', imageSrc: '/gallery/mercedes-s-class-black.jpg', imageAlt: 'Mercedes S-Class Black — full detail at LVAC Henderson', span: '', height: 'h-[280px]' },
  { id: 's13', label: 'BMW M4 · Yas Marina Blue', sub: 'Ceramic Coating', category: 'ceramic', imageSrc: '/gallery/bmw-m4-blue.jpg', imageAlt: 'BMW M4 Yas Marina Blue — ceramic coating at LVAC wash station', span: '', height: 'h-[280px]' },
  { id: 's14', label: 'Ford F-450 · Platinum', sub: 'Express Hand Wash', category: 'trucks', imageSrc: '/gallery/ford-f450-platinum.jpg', imageAlt: 'Ford F-450 Platinum Stone Gray — express hand wash at LVAC', span: '', height: 'h-[320px]' },
  { id: 's15', label: 'RAM 1500 · Rebel Black', sub: 'Express Hand Wash', category: 'trucks', imageSrc: '/gallery/ram-1500-rebel-black.jpg', imageAlt: 'RAM 1500 Rebel Black — express hand wash at LVAC Henderson', span: '', height: 'h-[320px]' },
  { id: 's16', label: "'64 Impala · Convertible Red", sub: 'Full Detail', category: 'detail', imageSrc: '/gallery/chevy-impala-64-red.jpg', imageAlt: '1964 Chevy Impala Convertible Red — classic car full detail', span: 'col-span-2', height: 'h-[360px]' },
  { id: 's17', label: 'Porsche 911 · Cabriolet White', sub: 'Ceramic Coating', category: 'ceramic', imageSrc: '/gallery/porsche-911-cab-white.jpg', imageAlt: 'Porsche 911 Cabriolet white with red interior — ceramic coating', span: '', height: 'h-[280px]' },
  { id: 's18', label: 'Rolls-Royce Cullinan · Black Badge', sub: 'Ceramic Coating', category: 'ceramic', imageSrc: '/gallery/rolls-royce-cullinan-matte-black.jpg', imageAlt: 'Rolls-Royce Cullinan Black Badge matte black — ceramic coating', span: '', height: 'h-[280px]' },
  { id: 's19', label: 'Corvette C8 · Ceramic Gray', sub: 'Express Hand Wash', category: 'express', imageSrc: '/gallery/corvette-c8-silver.jpg', imageAlt: 'Corvette C8 Ceramic Gray — express wash at LVAC station', span: '', height: 'h-[280px]' },
  { id: 's20', label: 'Indian Scout · Matte Black', sub: 'Full Detail', category: 'detail', imageSrc: '/gallery/indian-scout-matte.jpg', imageAlt: 'Indian Scout motorcycle matte black — hand detailed at LVAC', span: '', height: 'h-[300px]' },
  { id: 's21', label: 'RAM 1500 · Flame Red Lifted', sub: 'Express Hand Wash', category: 'trucks', imageSrc: '/gallery/ram-1500-red-lifted.jpg', imageAlt: 'RAM 1500 flame red lifted truck — express wash at LVAC', span: '', height: 'h-[320px]' },
  { id: 's22', label: 'BMW X5 · Mineral White', sub: 'Express Hand Wash', category: 'express', imageSrc: '/gallery/bmw-x5-white.jpg', imageAlt: 'BMW X5 Mineral White — express hand wash at LVAC Henderson', span: '', height: 'h-[280px]' },
  { id: 's23', label: 'Lexus RC F · Sport White', sub: 'Full Detail', category: 'detail', imageSrc: '/gallery/lexus-rcf-white.jpg', imageAlt: 'Lexus RC F-Sport White — full detail at LVAC Henderson', span: 'col-span-2', height: 'h-[340px]' },
  { id: 's24', label: 'Corvette C7 · Mint Teal', sub: 'Ceramic Coating', category: 'ceramic', imageSrc: '/gallery/corvette-c7-teal.jpg', imageAlt: 'Corvette C7 mint teal — ceramic coating at LVAC Henderson', span: '', height: 'h-[280px]' },
  { id: 's25', label: 'Subaru WRX STI · Dark Gray', sub: 'Full Detail', category: 'detail', imageSrc: '/gallery/subaru-wrx-sti.jpg', imageAlt: 'Subaru WRX STI dark gray with gold wheels — full detail', span: '', height: 'h-[280px]' },
  { id: 's26', label: 'Polaris Slingshot · Black/Red', sub: 'Full Detail', category: 'detail', imageSrc: '/gallery/polaris-slingshot.jpg', imageAlt: 'Polaris Slingshot black and red — full detail at LVAC', span: '', height: 'h-[280px]' },
  { id: 's27', label: 'RAM 1500 · White', sub: 'Express Hand Wash', category: 'trucks', imageSrc: '/gallery/ram-1500-white.jpg', imageAlt: 'RAM 1500 white — express hand wash at LVAC Henderson', span: '', height: 'h-[280px]' },
  { id: 's28', label: 'Spoon S2000 · Race Car', sub: 'Full Detail', category: 'detail', imageSrc: '/gallery/s2000-spoon-racecar.jpg', imageAlt: 'Spoon Sports S2000 race car yellow and blue — detailed at LVAC', span: 'col-span-2', height: 'h-[340px]' },
  { id: 's29', label: 'Isuzu NPR · Commercial', sub: 'Express Hand Wash', category: 'trucks', imageSrc: '/gallery/isuzu-npr-truck.jpg', imageAlt: 'Isuzu NPR box truck — commercial vehicle wash at LVAC', span: '', height: 'h-[260px]' },
];

// Assign span/height patterns for DB photos
const LAYOUT_PATTERNS = [
  { span: '', height: 'h-[280px]' },
  { span: '', height: 'h-[320px]' },
  { span: 'col-span-2', height: 'h-[340px]' },
  { span: '', height: 'h-[280px]' },
  { span: '', height: 'h-[300px]' },
  { span: '', height: 'h-[280px]' },
];

const CATEGORY_LABELS: Record<string, string> = {
  express: 'Express Hand Wash',
  detail: 'Full Detail',
  ceramic: 'Ceramic Coating',
  trucks: 'Trucks & SUVs',
};

function dbToGalleryItem(p: { id: string; image_url: string; label: string; category: string; make: string; model: string; color: string; ai_description: string | null; service_type: string | null }, index: number): GalleryItem {
  const layout = LAYOUT_PATTERNS[index % LAYOUT_PATTERNS.length];
  const cat = (['express', 'detail', 'ceramic', 'trucks'].includes(p.category) ? p.category : 'detail') as Filter;
  return {
    id: p.id,
    label: p.label || `${p.make} ${p.model} · ${p.color}`.toUpperCase(),
    sub: CATEGORY_LABELS[cat] || p.service_type || 'Detail',
    category: cat,
    imageSrc: p.image_url,
    imageAlt: p.ai_description || `${p.make} ${p.model} ${p.color} — detailed at LVAC Henderson`,
    span: layout.span,
    height: layout.height,
  };
}

/* --- Lightbox --- */
function Lightbox({
  item,
  onClose,
  onPrev,
  onNext,
  current,
  total,
}: {
  item: GalleryItem;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  current: number;
  total: number;
}) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    }
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center lightbox-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${item.label} — ${item.sub}`}
    >
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-10 w-12 h-12 rounded-full bg-white/5 border border-white/10 grid place-items-center text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer backdrop-blur-sm"
        aria-label="Close lightbox"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
        </svg>
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/5 border border-white/10 grid place-items-center text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer backdrop-blur-sm"
        aria-label="Previous photo"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/5 border border-white/10 grid place-items-center text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer backdrop-blur-sm"
        aria-label="Next photo"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        className="relative w-[92vw] h-[80vh] sm:w-[85vw] sm:h-[85vh] lightbox-image"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={item.imageSrc}
          alt={item.imageAlt}
          fill
          sizes="92vw"
          quality={90}
          style={{ objectFit: 'contain' }}
          priority
          unoptimized={item.imageSrc.startsWith('http')}
        />
      </div>

      <div className="absolute bottom-0 inset-x-0 p-5 sm:p-8 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
        <div className="max-w-7xl mx-auto flex items-end justify-between">
          <div>
            <p className="font-mono text-[10px] sm:text-xs text-water tracking-widest mb-1">{item.sub.toUpperCase()}</p>
            <p className="font-bold text-base sm:text-xl text-white">{item.label}</p>
          </div>
          <p className="font-mono text-xs text-white/40">
            {current} / {total}
          </p>
        </div>
      </div>
    </div>
  );
}

/* --- Breadcrumb --- */
function Breadcrumb() {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-muted">
      <Link href="/" className="hover:text-ink transition-colors duration-200">Home</Link>
      <span aria-hidden="true">/</span>
      <span className="text-ink">Gallery</span>
    </nav>
  );
}

/* --- Main Gallery Page --- */
export default function GalleryPage() {
  const [allItems, setAllItems] = useState<GalleryItem[]>(STATIC_ITEMS);
  const [activeFilter, setActiveFilter] = useState<Filter>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/gallery?limit=100')
      .then((res) => res.json())
      .then((json) => {
        if (json.data && json.data.length > 0) {
          const dbItems = json.data.map(dbToGalleryItem);
          // DB photos at the top (newest first), then static
          setAllItems([...dbItems, ...STATIC_ITEMS]);
        }
      })
      .catch(() => {});
  }, []);

  const filtered = activeFilter === 'all'
    ? allItems
    : allItems.filter((item) => item.category === activeFilter);

  const filterCounts = {
    all: allItems.length,
    express: allItems.filter(i => i.category === 'express').length,
    detail: allItems.filter(i => i.category === 'detail').length,
    ceramic: allItems.filter(i => i.category === 'ceramic').length,
    trucks: allItems.filter(i => i.category === 'trucks').length,
  };

  const filters: { label: string; value: Filter; count: number }[] = [
    { label: 'All Work', value: 'all', count: filterCounts.all },
    { label: 'Express Wash', value: 'express', count: filterCounts.express },
    { label: 'Full Detail', value: 'detail', count: filterCounts.detail },
    { label: 'Ceramic Coating', value: 'ceramic', count: filterCounts.ceramic },
    { label: 'Trucks & SUVs', value: 'trucks', count: filterCounts.trucks },
  ];

  const openLightbox = useCallback((idx: number) => setLightboxIndex(idx), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const goPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev === null ? null : prev <= 0 ? filtered.length - 1 : prev - 1));
  }, [filtered.length]);

  const goNext = useCallback(() => {
    setLightboxIndex((prev) => (prev === null ? null : prev >= filtered.length - 1 ? 0 : prev + 1));
  }, [filtered.length]);

  return (
    <>
      {/* --- Immersive Hero --- */}
      <section className="relative h-[70vh] sm:h-[80vh] overflow-hidden">
        <Image
          src="/gallery/brabus-g63-sunset.jpg"
          alt="Brabus G63 AMG at sunset — LVAC Carwash showpiece"
          fill
          priority
          quality={90}
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center 35%' }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(5,8,16,0.6) 0%, rgba(5,8,16,0.3) 40%, rgba(5,8,16,0.7) 75%, #050810 100%)',
          }}
        />
        <div className="absolute inset-0 hero-vignette" />
        <div className="film-grain absolute inset-0 pointer-events-none" aria-hidden="true" />

        <div className="absolute inset-0 flex flex-col justify-end z-10">
          <div className="max-w-7xl mx-auto px-5 lg:px-8 w-full pb-12 sm:pb-16">
            <RevealOnScroll>
              <Breadcrumb />
            </RevealOnScroll>
            <RevealOnScroll delay={100}>
              <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-water/25 bg-water/5 text-xs font-mono text-water">
                <span className="w-1.5 h-1.5 rounded-full bg-water pulse-ring" aria-hidden="true" />
                {allItems.length} VEHICLES · @LVACWASHNDETAIL
              </div>
            </RevealOnScroll>
            <RevealOnScroll delay={200}>
              <h1
                className="mt-4 font-black leading-[0.92] tracking-tight"
                style={{ fontSize: 'clamp(3rem, 10vw, 7rem)' }}
              >
                <span className="text-gradient-luxury">The Work.</span>
              </h1>
            </RevealOnScroll>
            <RevealOnScroll delay={300}>
              <p className="mt-4 text-lg sm:text-xl text-muted max-w-xl leading-relaxed">
                From daily drivers to seven-figure builds. Every car gets the same obsessive standard.
              </p>
            </RevealOnScroll>
          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 scroll-indicator">
          <svg className="w-5 h-5 text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </section>

      {/* --- Stats strip --- */}
      <section className="border-y border-line bg-surface-2/50 relative z-20">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4">
            {[
              { value: `${allItems.length}+`, label: 'Vehicles Detailed' },
              { value: '4.7', label: 'Google Rating' },
              { value: '100%', label: 'Hand Finished' },
              { value: '27+', label: 'Five-Star Reviews' },
            ].map((stat, i) => (
              <RevealOnScroll key={i} delay={i * 80}>
                <div className="text-center sm:text-left">
                  <p className="text-2xl sm:text-3xl font-black tracking-tight">{stat.value}</p>
                  <p className="text-xs font-mono text-muted tracking-wider mt-0.5">{stat.label.toUpperCase()}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* --- Filter bar --- */}
      <section className="py-6 bg-surface sticky top-16 z-30 border-b border-line">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => { setActiveFilter(f.value); setLightboxIndex(null); }}
                aria-pressed={activeFilter === f.value}
                className={`shrink-0 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                  activeFilter === f.value
                    ? 'bg-water text-void font-bold'
                    : 'btn-ghost'
                }`}
              >
                {f.label}
                <span className={`text-[10px] font-mono ${
                  activeFilter === f.value ? 'text-void/60' : 'text-muted'
                }`}>
                  {f.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* --- Gallery Grid --- */}
      <section className="py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item, i) => (
              <RevealOnScroll
                key={item.id}
                delay={Math.min(i * 60, 400)}
                className={item.span}
              >
                <button
                  onClick={() => openLightbox(i)}
                  className={`gallery-card relative w-full ${item.height} rounded-2xl overflow-hidden group cursor-pointer block`}
                  aria-label={`View ${item.label} — ${item.sub}`}
                >
                  <Image
                    src={item.imageSrc}
                    alt={item.imageAlt}
                    fill
                    sizes={item.span.includes('col-span-2') ? '(max-width: 640px) 100vw, 66vw' : '(max-width: 640px) 100vw, 33vw'}
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                    className="transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                    unoptimized={item.imageSrc.startsWith('http')}
                  />

                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: 'linear-gradient(to top, rgba(5,8,16,0.85) 0%, rgba(5,8,16,0.15) 40%, transparent 70%)' }}
                  />

                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none gallery-glow" />

                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/5 border border-white/10 grid place-items-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 backdrop-blur-sm">
                    <svg className="w-4 h-4 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="font-mono text-[10px] tracking-widest text-water mb-1.5 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                      {item.sub.toUpperCase()}
                    </p>
                    <p className="font-bold text-sm sm:text-base text-white translate-y-1 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                      {item.label}
                    </p>
                  </div>
                </button>
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

      {/* --- Instagram CTA --- */}
      <section className="py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 hero-bg opacity-60" aria-hidden="true" />
        <div className="max-w-3xl mx-auto px-5 lg:px-8 relative text-center">
          <RevealOnScroll>
            <p className="font-mono text-xs text-water tracking-widest mb-4">FOLLOW THE WORK</p>
            <h2
              className="font-black leading-[0.93] tracking-tight mb-6"
              style={{ fontSize: 'clamp(2rem, 7vw, 4.5rem)' }}
            >
              Every wash.{' '}
              <span className="text-gradient-water">Every detail.</span>
            </h2>
            <p className="text-muted text-lg max-w-md mx-auto mb-10">
              New before/afters posted weekly. Follow us on Instagram to see our latest work.
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={150}>
            <a
              href="https://instagram.com/lvacwashndetail"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-mega inline-flex items-center gap-3 px-10 py-5 rounded-full text-base cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.81.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.81-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.81-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.81.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.34 4.14.63a5.85 5.85 0 0 0-2.13 1.38A5.85 5.85 0 0 0 .63 4.14C.34 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.27 2.15.56 2.91a5.85 5.85 0 0 0 1.38 2.13 5.85 5.85 0 0 0 2.13 1.38c.76.29 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.27 2.91-.56a5.85 5.85 0 0 0 2.13-1.38 5.85 5.85 0 0 0 1.38-2.13c.29-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.27-2.15-.56-2.91a5.85 5.85 0 0 0-1.38-2.13A5.85 5.85 0 0 0 19.86.63c-.76-.29-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
              </svg>
              Follow @lvacwashndetail
            </a>
          </RevealOnScroll>
        </div>
      </section>

      {/* --- Lightbox --- */}
      {lightboxIndex !== null && filtered[lightboxIndex] && (
        <Lightbox
          item={filtered[lightboxIndex]}
          onClose={closeLightbox}
          onPrev={goPrev}
          onNext={goNext}
          current={lightboxIndex + 1}
          total={filtered.length}
        />
      )}
    </>
  );
}
