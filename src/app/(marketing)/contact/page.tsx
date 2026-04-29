import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact — URRUTIA Car Wash & Detail | Henderson, NV',
  description: 'Contact URRUTIA Carwash & Detail. Located at 1195 Wellness Pl, Henderson, NV 89074. Mon–Sat 7:00–4:30. DM us on Instagram @lvacwashndetail.',
  openGraph: {
    title: 'Contact URRUTIA | Car Wash Henderson, NV',
    description: '1195 Wellness Pl, Henderson, NV 89074. Mon–Sat 7:00–4:30. @lvacwashndetail on Instagram.',
    type: 'website',
  },
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
