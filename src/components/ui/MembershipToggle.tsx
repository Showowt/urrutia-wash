'use client';

import { useState } from 'react';

type BillingCycle = 'monthly' | 'annual';

const PRICES = {
  solo: { monthly: 89, annual: 76 },
  duo: { monthly: 149, annual: 127 },
  fleet: { monthly: 279, annual: 237 },
} as const;

interface MembershipToggleProps {
  onBillingChange?: (billing: BillingCycle) => void;
}

interface PriceDisplayProps {
  tier: keyof typeof PRICES;
  billing: BillingCycle;
}

export function PriceDisplay({ tier, billing }: PriceDisplayProps) {
  return <span>{PRICES[tier][billing]}</span>;
}

export function BillingLabel({ billing }: { billing: BillingCycle }) {
  return (
    <span>
      {billing === 'annual' ? 'billed annually · save 15%' : 'billed monthly'}
    </span>
  );
}

export default function MembershipToggle({ onBillingChange }: MembershipToggleProps) {
  const [billing, setBilling] = useState<BillingCycle>('monthly');

  function handleBilling(v: BillingCycle) {
    setBilling(v);
    onBillingChange?.(v);
  }

  return (
    <div className="inline-flex items-center gap-1 p-1 bg-surface-2 border border-line rounded-full mb-8">
      <button
        onClick={() => handleBilling('monthly')}
        aria-pressed={billing === 'monthly'}
        className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
          billing === 'monthly'
            ? 'bg-white text-[#08101F]'
            : 'text-muted hover:text-ink'
        }`}
      >
        Monthly
      </button>
      <button
        onClick={() => handleBilling('annual')}
        aria-pressed={billing === 'annual'}
        className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
          billing === 'annual'
            ? 'bg-white text-[#08101F]'
            : 'text-muted hover:text-ink'
        }`}
      >
        Annual{' '}
        <span className="text-flame font-mono text-xs ml-1">SAVE 15%</span>
      </button>
    </div>
  );
}
