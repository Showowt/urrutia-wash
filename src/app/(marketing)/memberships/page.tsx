import type { Metadata } from 'next';
import MembershipsClient from './MembershipsClient';

export const metadata: Metadata = {
  title: 'Weekly Plans — Save on Regular Washes | URRUTIA Car Wash Henderson',
  description: 'Weekly wash plans: Small from $120/mo, Medium from $130/mo, Large from $150/mo. 4 washes per month, paid upfront. Automatic punch tracking.',
  keywords: ['car wash plan henderson nv', 'weekly car wash subscription las vegas', 'LVAC car wash plan', 'auto detailing plan henderson'],
  openGraph: {
    title: 'URRUTIA Weekly Plans — Car Wash Henderson, NV',
    description: 'Weekly wash plans priced by vehicle size. 4 washes per month, paid on the 1st. Automatic punch tracking.',
    type: 'website',
  },
  alternates: {
    canonical: '/memberships',
  },
};

export default function MembershipsPage() {
  return <MembershipsClient />;
}
