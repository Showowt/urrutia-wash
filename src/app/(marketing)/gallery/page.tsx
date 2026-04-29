import type { Metadata } from 'next';
import GalleryClient from './GalleryClient';

export const metadata: Metadata = {
  title: 'Gallery — Before & After Car Detailing Photos | URRUTIA Henderson, NV',
  description: 'See our work. Rolls-Royce Cullinans, G63 AMGs, Raptors, F-450s, and more. Before/after photos from every service. Follow @lvacwashndetail on Instagram.',
  keywords: ['car detailing photos henderson nv', 'before after car wash henderson', 'ceramic coating before after las vegas', 'auto detail gallery henderson'],
  openGraph: {
    title: 'Gallery — URRUTIA Car Wash & Detail | Henderson, NV',
    description: 'Before and after photos. Cullinans, G-Wagons, Raptors, M-cars. Every car gets the same standard.',
    type: 'website',
  },
  alternates: {
    canonical: '/gallery',
  },
};

export default function GalleryPage() {
  return <GalleryClient />;
}
