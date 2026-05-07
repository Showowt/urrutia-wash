'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Photo {
  src: string;
  alt: string;
  label: string;
}

const STATIC_PHOTOS: Photo[] = [
  { src: '/gallery/brabus-g63-sunset.jpg', alt: 'Brabus G63 AMG at sunset — ceramic detail', label: 'G63 AMG · BRABUS' },
  { src: '/gallery/rolls-royce-cullinan-white.jpg', alt: 'Rolls-Royce Cullinan white — ceramic coating', label: 'ROLLS-ROYCE · CULLINAN' },
  { src: '/gallery/corvette-c8-red.jpg', alt: 'Corvette C8 Torch Red — ceramic coating', label: 'CORVETTE C8 · RED' },
  { src: '/gallery/bmw-m4-green.jpg', alt: 'BMW M4 Isle of Man Green — ceramic coating', label: 'BMW M4 · GREEN' },
  { src: '/gallery/rolls-royce-ghost-black.jpg', alt: 'Rolls-Royce Ghost Black — full detail', label: 'RR GHOST · BLACK' },
  { src: '/gallery/porsche-993-green.jpg', alt: 'Porsche 993 dark green — full detail', label: 'PORSCHE 993 · GREEN' },
];

export default function GalleryGrid() {
  const [photos, setPhotos] = useState<Photo[]>(STATIC_PHOTOS);

  useEffect(() => {
    fetch('/api/gallery?limit=6')
      .then((res) => res.json())
      .then((json) => {
        if (json.data && json.data.length > 0) {
          const dbPhotos: Photo[] = json.data.map((p: { image_url: string; label: string; make: string; model: string; color: string; ai_description: string | null }) => ({
            src: p.image_url,
            alt: p.ai_description || `${p.make} ${p.model} ${p.color} — detailed at LVAC Henderson`,
            label: p.label || `${p.make} ${p.model} · ${p.color}`.toUpperCase(),
          }));
          // Show newest DB photos first, fill remaining with static
          const merged = [...dbPhotos, ...STATIC_PHOTOS].slice(0, 6);
          setPhotos(merged);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
      {photos.map((photo, i) => (
        <div key={i} className="aspect-[4/3] rounded-2xl relative overflow-hidden group">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            className="transition-transform duration-700 ease-out group-hover:scale-105"
            unoptimized={photo.src.startsWith('http')}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(5,8,16,0.8) 0%, transparent 60%)' }} />
          <div className="absolute bottom-3 left-3 font-mono text-[10px] text-white/90 tracking-widest">
            {photo.label}
          </div>
        </div>
      ))}
    </div>
  );
}
