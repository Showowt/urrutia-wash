'use client';

import { useEffect, useRef } from 'react';

type RevealVariant = 'fade-up' | 'fade-left' | 'fade-right' | 'scale' | 'blur';

interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: RevealVariant;
  stagger?: boolean;
}

const VARIANT_STYLES: Record<RevealVariant, string> = {
  'fade-up':    'opacity-0 translate-y-6',
  'fade-left':  'opacity-0 -translate-x-8',
  'fade-right': 'opacity-0 translate-x-8',
  'scale':      'opacity-0 scale-95',
  'blur':       'opacity-0 blur-[8px]',
};

const REVEAL_STYLES: Record<RevealVariant, string> = {
  'fade-up':    'opacity-100 translate-y-0',
  'fade-left':  'opacity-100 translate-x-0',
  'fade-right': 'opacity-100 translate-x-0',
  'scale':      'opacity-100 scale-100',
  'blur':       'opacity-100 blur-0',
};

export default function RevealOnScroll({
  children,
  className = '',
  delay = 0,
  variant = 'fade-up',
  stagger = false,
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      // Remove hidden classes immediately
      el.classList.remove(...VARIANT_STYLES[variant].split(' '));
      el.classList.add(...REVEAL_STYLES[variant].split(' '));
      if (stagger) {
        el.querySelectorAll('[data-reveal-index]').forEach((child) => {
          (child as HTMLElement).style.opacity = '1';
          (child as HTMLElement).style.transform = 'none';
          (child as HTMLElement).style.filter = 'none';
        });
      }
      return;
    }

    const variantHidden = VARIANT_STYLES[variant].split(' ');
    const variantReveal = REVEAL_STYLES[variant].split(' ');

    // Apply initial hidden state via CSS classes
    el.classList.add(...variantHidden);
    el.style.transition = 'opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1), filter 0.8s cubic-bezier(0.16,1,0.3,1)';

    // Stagger: hide children that have data-reveal-index
    if (stagger) {
      el.querySelectorAll('[data-reveal-index]').forEach((child) => {
        const c = child as HTMLElement;
        c.style.opacity = '0';
        c.style.transform = 'translateY(16px)';
        c.style.transition = 'opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)';
      });
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const reveal = () => {
              el.classList.remove(...variantHidden);
              el.classList.add(...variantReveal);

              if (stagger) {
                el.querySelectorAll('[data-reveal-index]').forEach((child) => {
                  const c = child as HTMLElement;
                  const idx = parseInt(c.dataset.revealIndex ?? '0', 10);
                  setTimeout(() => {
                    c.style.opacity = '1';
                    c.style.transform = 'translateY(0)';
                  }, idx * 80);
                });
              }
            };

            if (delay) {
              setTimeout(reveal, delay);
            } else {
              reveal();
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, variant, stagger]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
