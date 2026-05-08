import type { Metadata } from 'next';
import ServicesClient from './ServicesClient';

export const metadata: Metadata = {
  title: 'Services — Hand Wash & Detailing by Vehicle Size | URRUTIA Henderson, NV',
  description: 'Small cars from $35, medium from $40, large from $45. Interior + exterior packages and full detail ($295). Add-ons available. At LVAC Henderson, NV.',
  keywords: ['car wash henderson nv', 'auto detailing henderson', 'hand car wash las vegas', 'car detail henderson nv', 'full detail henderson', 'LVAC carwash', 'car wash prices henderson'],
  openGraph: {
    title: 'Services — LVAC Carwash and Detailing | Henderson, NV',
    description: 'Hand wash and detailing priced by vehicle size. Small, medium, and large vehicles. Full detail from $295. At LVAC Henderson.',
    type: 'website',
  },
  alternates: {
    canonical: '/services',
  },
};

export default function ServicesPage() {
  return <ServicesClient />;
}
