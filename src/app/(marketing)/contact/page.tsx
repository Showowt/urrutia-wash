import type { Metadata } from 'next';
import ContactClient from './ContactClient';
import JsonLd, { type SchemaInput } from '@/components/seo/JsonLd';

const schemas: SchemaInput[] = [
  {
    type: 'BreadcrumbList',
    items: [
      { name: 'Home', url: 'https://www.washduringworkout.com' },
      { name: 'Contact', url: 'https://www.washduringworkout.com/contact' },
    ],
  },
];

export const metadata: Metadata = {
  title: 'Contact — URRUTIA Car Wash & Detail | Henderson, NV',
  description: 'Contact URRUTIA Carwash & Detail. Located at 1195 Wellness Pl, Henderson, NV 89011 inside LVAC parking. Mon–Sat 8:00–5:00. Call (702) 326-4101 or DM @lvacwashndetail on Instagram.',
  keywords: ['contact urrutia car wash', 'car wash phone number henderson', 'LVAC car wash address', 'car wash henderson nv directions', 'car detailing appointment henderson', 'car wash 1195 wellness pl'],
  openGraph: {
    title: 'Contact URRUTIA | Car Wash Henderson, NV',
    description: '1195 Wellness Pl, Henderson, NV 89011. Mon–Sat 8:00–5:00. Call (702) 326-4101.',
    type: 'website',
    images: [{ url: '/gallery/brabus-g63-sunset.jpg', width: 1200, height: 630, alt: 'URRUTIA Car Wash location — Henderson, NV' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact URRUTIA | Car Wash Henderson, NV',
    description: '1195 Wellness Pl, Henderson, NV 89011. Mon–Sat 8:00–5:00. (702) 326-4101.',
  },
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd schemas={schemas} />
      <ContactClient />
    </>
  );
}
