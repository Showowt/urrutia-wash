import type { Metadata } from 'next';
import ServicesClient from './ServicesClient';

export const metadata: Metadata = {
  title: 'Services — Hand Wash, Detail & Ceramic Coating | URRUTIA Henderson, NV',
  description: 'Premium hand wash ($35), wash + interior ($75), full detail ($295), and ceramic coating ($895). Built for desert conditions at LVAC Henderson, NV.',
  keywords: ['car wash henderson nv', 'auto detailing henderson', 'ceramic coating henderson', 'hand car wash las vegas', 'car detail henderson nv', 'full detail henderson', 'LVAC carwash'],
  openGraph: {
    title: 'Services — LVAC Carwash and Detailing | Henderson, NV',
    description: 'Hand wash, interior detail, full detail, and ceramic coating. No machines, no shortcuts. At LVAC Henderson.',
    type: 'website',
  },
  alternates: {
    canonical: '/services',
  },
};

export default function ServicesPage() {
  return <ServicesClient />;
}
