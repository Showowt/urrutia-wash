'use client';

import { useState } from 'react';
import RevealOnScroll from '@/components/cinema/RevealOnScroll';

const FAQS = [
  {
    q: 'How long does a wash actually take?',
    a: 'Express hand wash: ~30 minutes. Wash + interior: ~50 minutes. Full detail: 2\u20134 hours depending on vehicle and condition. Ceramic coating is multi-day. We\u2019ll text you a precise ETA after intake.',
  },
  {
    q: 'Do I need to be an LVAC member?',
    a: 'No. Anyone can drop their car at the LVAC parking lot during our hours. LVAC members do get priority slots and bundled member pricing \u2014 ask us how.',
  },
  {
    q: 'How does the SMS notification work?',
    a: 'When you book, we capture your phone number. You\u2019ll get a text when we start, when we\u2019re halfway, and the moment your car is ready \u2014 with before/after photos. No app needed.',
  },
  {
    q: 'Where are you located?',
    a: '1195 Wellness Pl, Henderson, NV 89011 — inside the LVAC (Las Vegas Athletic Club) parking area. Drop your car, train, drive home clean.',
  },
  {
    q: 'Can I cancel my membership?',
    a: 'Anytime. No fees, no contracts. Pause for a month if you\u2019re traveling. Resume when you\u2019re back.',
  },
  {
    q: 'Do you handle exotic / specialty paint?',
    a: 'Yes. Ceramic, matte, satin, PPF, custom wraps \u2014 we use product-specific protocols. We\u2019ve worked on Cullinans, G63s, Raptors, M-cars, and custom builds. Bring it.',
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-3xl mx-auto px-5 lg:px-8">
        <RevealOnScroll className="mb-14">
          <p className="font-mono text-xs text-water tracking-widest mb-3">06 — FAQ</p>
          <h2 className="text-4xl lg:text-5xl font-bold leading-tight">Quick answers.</h2>
          <p className="mt-4 text-muted text-lg max-w-lg">
            Everything you need to know before you drop the keys.
          </p>
        </RevealOnScroll>

        <RevealOnScroll>
          <div className="space-y-3">
            {FAQS.map((faq, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={i}
                  className={`faq-item rounded-2xl overflow-hidden ${isOpen ? 'active' : ''}`}
                  style={{
                    background: isOpen
                      ? 'linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.008) 100%)'
                      : 'linear-gradient(180deg, rgba(255,255,255,0.018) 0%, rgba(255,255,255,0.005) 100%)',
                    border: isOpen
                      ? '1px solid rgba(0,180,255,0.22)'
                      : '1px solid rgba(27,34,54,1)',
                    transition: 'background 0.3s ease, border-color 0.3s ease',
                  }}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex justify-between items-center cursor-pointer w-full text-left gap-4 px-6 py-5"
                  >
                    <span
                      className="font-semibold text-base lg:text-lg leading-snug"
                      style={{
                        color: isOpen ? '#F5F7FA' : '#C8D0DC',
                      }}
                    >
                      {faq.q}
                    </span>
                    {/* + rotates to × */}
                    <span
                      className="flex-shrink-0 w-7 h-7 rounded-full grid place-items-center text-base font-light"
                      aria-hidden="true"
                      style={{
                        background: isOpen
                          ? 'rgba(0,180,255,0.14)'
                          : 'rgba(255,255,255,0.04)',
                        color: isOpen ? '#00B4FF' : '#8B95A8',
                        transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                        transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), background 0.25s ease, color 0.25s ease',
                      }}
                    >
                      +
                    </span>
                  </button>

                  {/* Smooth height via CSS grid trick */}
                  <div className={`faq-body ${isOpen ? 'open' : ''}`}>
                    <div className="faq-body-inner">
                      <p className="px-6 pb-6 text-muted leading-relaxed text-[15px]">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
