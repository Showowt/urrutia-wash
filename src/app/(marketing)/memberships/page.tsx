import type { Metadata } from 'next';
import MembershipsClient from './MembershipsClient';

export const metadata: Metadata = {
  title: 'Memberships — SOLO, DUO & FLEET Plans | URRUTIA Car Wash Henderson',
  description: 'Join URRUTIA Club. SOLO ($89/mo), DUO ($149/mo), FLEET ($279/mo). Unlimited priority booking, automatic punch tracking, Apple Wallet pass. Cancel anytime.',
  keywords: ['car wash membership henderson nv', 'unlimited car wash subscription las vegas', 'LVAC car wash membership', 'auto detailing membership henderson'],
  openGraph: {
    title: 'URRUTIA Club Memberships — Car Wash Henderson, NV',
    description: 'SOLO, DUO, and FLEET membership plans. Priority booking, locked-in pricing, punch card loyalty. Cancel anytime.',
    type: 'website',
  },
  alternates: {
    canonical: '/memberships',
  },
};

export default function MembershipsPage() {
  return <MembershipsClient />;
}
