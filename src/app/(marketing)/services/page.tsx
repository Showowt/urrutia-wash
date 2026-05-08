import type { Metadata } from 'next';
import ServicesClient from './ServicesClient';
import JsonLd, { type SchemaInput } from '@/components/seo/JsonLd';

const schemas: SchemaInput[] = [
  {
    type: 'BreadcrumbList',
    items: [
      { name: 'Home', url: 'https://www.washduringworkout.com' },
      { name: 'Services', url: 'https://www.washduringworkout.com/services' },
    ],
  },
];

export const metadata: Metadata = {
  title: 'Car Wash Services & Prices — Hand Wash & Detailing | URRUTIA Henderson, NV',
  description: 'Car wash prices at LVAC Henderson: Small exterior $35, Medium $40, Large $45. Interior+Exterior from $55. Full detail $295. Spray wax, tire shine, clay bar add-ons. Premium hand wash while you work out.',
  keywords: [
    'car wash henderson nv', 'auto detailing henderson', 'hand car wash las vegas', 'car detail henderson nv',
    'full detail henderson', 'LVAC carwash', 'car wash prices henderson', 'car wash cost henderson nv',
    'exterior car wash price', 'interior car detail price henderson', 'ceramic coating price henderson',
    'clay bar treatment near me', 'spray wax car wash', 'tire shine henderson', 'SUV car wash price henderson',
    'truck wash price henderson nv', 'luxury car detail henderson', 'car wash menu henderson',
    'hand wash and detail prices las vegas', 'affordable car wash henderson',
  ],
  openGraph: {
    title: 'Car Wash Services & Prices — URRUTIA | Henderson, NV',
    description: 'Hand wash from $35. Interior+Exterior from $55. Full detail from $295. At LVAC Henderson.',
    type: 'website',
    images: [{ url: '/gallery/brabus-g63-sunset.jpg', width: 1200, height: 630, alt: 'Car wash services at URRUTIA — Henderson, NV' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Car Wash Prices — URRUTIA Henderson, NV',
    description: 'Hand wash from $35. Full detail from $295. Premium hand care at LVAC Henderson.',
  },
  alternates: {
    canonical: '/services',
  },
};

export default function ServicesPage() {
  return (
    <>
      <JsonLd schemas={schemas} />
      <ServicesClient />
    </>
  );
}
