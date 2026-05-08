import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact — URRUTIA Car Wash & Detail | Henderson, NV',
  description: 'Contact URRUTIA Carwash & Detail. Located at 1195 Wellness Pl, Henderson, NV 89011. Mon–Sat 8:00–5:00. DM us on Instagram @lvacwashndetail.',
  openGraph: {
    title: 'Contact URRUTIA | Car Wash Henderson, NV',
    description: '1195 Wellness Pl, Henderson, NV 89011. Mon–Sat 8:00–5:00. @lvacwashndetail on Instagram.',
    type: 'website',
  },
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
