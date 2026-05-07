'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Photo {
  src: string;
  alt: string;
  label: string;
}

const STATIC_PHOTOS: Photo[] = [
  { src: '/gallery/brabus-g63-sunset.jpg', alt: 'Brabus G63 AMG at sunset — LVAC Henderson', label: 'G63 BRABUS' },
  { src: '/gallery/rolls-royce-cullinan-white.jpg', alt: 'Rolls-Royce Cullinan white — ceramic coating', label: 'CULLINAN' },
  { src: '/gallery/corvette-c8-red.jpg', alt: 'Corvette C8 Torch Red — ceramic coating', label: 'CORVETTE C8' },
  { src: '/gallery/bmw-m4-green.jpg', alt: 'BMW M4 Isle of Man Green — ceramic coating', label: 'BMW M4' },
  { src: '/gallery/rolls-royce-ghost-black.jpg', alt: 'Rolls-Royce Ghost Black — full detail', label: 'RR GHOST' },
  { src: '/gallery/porsche-993-green.jpg', alt: 'Porsche 993 dark green — full detail', label: 'PORSCHE 993' },
  { src: '/gallery/cadillac-escalade-black.jpg', alt: 'Cadillac Escalade Sport Black — full detail', label: 'ESCALADE' },
  { src: '/gallery/ford-raptor-gray.jpg', alt: 'Ford Raptor dark gray — express wash', label: 'RAPTOR' },
  { src: '/gallery/chevy-impala-64-red.jpg', alt: '1964 Chevy Impala Convertible Red', label: "'64 IMPALA" },
  { src: '/gallery/corvette-c8-orange.jpg', alt: 'Corvette C8 Amplify Orange — full detail', label: 'C8 ORANGE' },
  { src: '/gallery/mercedes-s-class-black.jpg', alt: 'Mercedes S-Class Black — full detail', label: 'S-CLASS' },
  { src: '/gallery/indian-scout-matte.jpg', alt: 'Indian Scout matte black — hand detailed', label: 'INDIAN SCOUT' },
  { src: '/gallery/rolls-royce-cullinan-rose-gold.jpg', alt: 'Rolls-Royce Cullinan rose gold chrome', label: 'RR ROSE GOLD' },
  { src: '/gallery/camaro-challenger-duo.jpg', alt: 'Camaro SS + Challenger duo shot', label: 'MUSCLE DUO' },
];

export default function PhotoShowcase() {
  const [photos, setPhotos] = useState<Photo[]>(STATIC_PHOTOS);

  useEffect(() => {
    fetch('/api/gallery?limit=30')
      .then((res) => res.json())
      .then((json) => {
        if (json.data && json.data.length > 0) {
          const dbPhotos: Photo[] = json.data.map((p: { image_url: string; label: string; make: string; model: string; color: string; ai_description: string | null }) => ({
            src: p.image_url,
            alt: p.ai_description || `${p.make} ${p.model} ${p.color} — detailed at LVAC Henderson`,
            label: p.label || `${p.make} ${p.model}`.toUpperCase(),
          }));
          // DB photos first (newest), then static
          setPhotos([...dbPhotos, ...STATIC_PHOTOS]);
        }
      })
      .catch(() => {});
  }, []);

  // Duplicate for seamless infinite scroll
  const doubled = [...photos, ...photos];

  return (
    <section className="py-12 lg:py-16 overflow-hidden relative">
      {/* Edge fades */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, var(--color-void), transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, var(--color-void), transparent)' }} />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-5 lg:px-8 mb-8 flex items-end justify-between">
        <div>
          <p className="font-mono text-[10px] text-water tracking-widest mb-1">OUR WORK</p>
          <p className="text-muted text-sm">Real cars. Real results. No stock photos.</p>
        </div>
        <Link
          href="/gallery"
          className="text-xs font-mono text-water hover:text-white transition-colors duration-200 flex items-center gap-1.5"
        >
          VIEW ALL
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      {/* Scrolling strip */}
      <div className="photo-strip-track flex gap-4 px-4" aria-hidden="true">
        {doubled.map((photo, i) => (
          <div
            key={i}
            className="photo-strip-item relative w-[220px] sm:w-[280px] h-[160px] sm:h-[200px] rounded-xl overflow-hidden flex-shrink-0 group"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="280px"
              style={{ objectFit: 'cover' }}
              className="transition-transform duration-700 group-hover:scale-110"
              unoptimized={photo.src.startsWith('http')}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(to top, rgba(5,8,16,0.8) 0%, rgba(5,8,16,0.1) 50%, transparent 100%)' }}
            />
            <div className="absolute bottom-3 left-3">
              <p className="font-mono text-[9px] tracking-widest text-white/60">{photo.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
