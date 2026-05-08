import type { Metadata } from 'next';
import MembershipsClient from './MembershipsClient';
import JsonLd, { type SchemaInput } from '@/components/seo/JsonLd';

const schemas: SchemaInput[] = [
  {
    type: 'BreadcrumbList',
    items: [
      { name: 'Home', url: 'https://www.washduringworkout.com' },
      { name: 'Weekly Plans', url: 'https://www.washduringworkout.com/memberships' },
    ],
  },
];

export const metadata: Metadata = {
  title: 'Weekly Car Wash Plans & Memberships — Save 20% | URRUTIA Henderson, NV',
  description: 'Weekly car wash plans at LVAC Henderson: Small from $120/mo, Medium from $130/mo, Large from $150/mo. 4 hand washes per month. Automatic punch tracking. Save vs. single washes.',
  keywords: [
    'car wash plan henderson nv', 'weekly car wash subscription las vegas', 'LVAC car wash plan',
    'auto detailing plan henderson', 'car wash membership henderson', 'monthly car wash plan',
    'unlimited car wash henderson', 'car wash subscription near me', 'best car wash deal henderson',
    'car wash savings plan las vegas', 'weekly hand wash subscription',
  ],
  openGraph: {
    title: 'Weekly Car Wash Plans — URRUTIA Henderson, NV',
    description: 'Weekly wash plans from $120/mo. 4 washes per month. Save vs. single washes at LVAC Henderson.',
    type: 'website',
    images: [{ url: '/gallery/brabus-g63-sunset.jpg', width: 1200, height: 630, alt: 'Car wash membership plans — URRUTIA Henderson, NV' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Weekly Wash Plans — URRUTIA Henderson, NV',
    description: 'Weekly hand wash plans from $120/mo. 4 washes/month. Save vs. single washes.',
  },
  alternates: {
    canonical: '/memberships',
  },
};

export default function MembershipsPage() {
  return (
    <>
      <JsonLd schemas={schemas} />
      <MembershipsClient />
    </>
  );
}
