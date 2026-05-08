import type { Metadata } from 'next';
import GalleryClient from './GalleryClient';
import JsonLd, { type SchemaInput } from '@/components/seo/JsonLd';

const schemas: SchemaInput[] = [
  {
    type: 'BreadcrumbList',
    items: [
      { name: 'Home', url: 'https://www.washduringworkout.com' },
      { name: 'Gallery', url: 'https://www.washduringworkout.com/gallery' },
    ],
  },
];

export const metadata: Metadata = {
  title: 'Gallery — Before & After Car Detailing Photos | URRUTIA Henderson, NV',
  description: 'See our work. Rolls-Royce Cullinans, G63 AMGs, Raptors, F-450s, Corvettes, BMWs, and more. Before/after photos from every service at LVAC Henderson. Follow @lvacwashndetail on Instagram.',
  keywords: [
    'car detailing photos henderson nv', 'before after car wash henderson', 'ceramic coating before after las vegas',
    'auto detail gallery henderson', 'car wash results henderson', 'luxury car detail photos',
    'G wagon detail henderson', 'truck detail before after', 'SUV car wash photos',
    'Rolls Royce detail henderson', 'Corvette detail henderson', 'BMW detail henderson nv',
  ],
  openGraph: {
    title: 'Gallery — URRUTIA Car Wash & Detail | Henderson, NV',
    description: 'Before and after photos. Cullinans, G-Wagons, Raptors, M-cars. Every car gets the same standard.',
    type: 'website',
    images: [{ url: '/gallery/brabus-g63-sunset.jpg', width: 1200, height: 630, alt: 'Car detailing before and after — URRUTIA Henderson, NV' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Before & After Gallery — URRUTIA Henderson, NV',
    description: 'See the work. Cullinans, G-Wagons, Raptors. Before/after from every detail.',
  },
  alternates: {
    canonical: '/gallery',
  },
};

export default function GalleryPage() {
  return (
    <>
      <JsonLd schemas={schemas} />
      <GalleryClient />
    </>
  );
}
