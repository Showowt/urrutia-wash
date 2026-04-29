'use client';

import { useEffect, useRef } from 'react';

interface WordProps {
  text: string;
  delay: number;
  gradient?: boolean;
}

function AnimatedWord({ text, delay, gradient = false }: WordProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      el.style.opacity = '1';
      el.style.transform = 'none';
      return;
    }

    // Start hidden
    el.style.opacity = '0';
    el.style.transform = 'translateY(36px) skewY(3deg)';

    const timer = setTimeout(() => {
      el.style.transition = `opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1), transform 0.75s cubic-bezier(0.16, 1, 0.3, 1)`;
      el.style.opacity = '1';
      el.style.transform = 'translateY(0px) skewY(0deg)';
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <span
      ref={ref}
      className={`block${gradient ? ' bg-gradient-to-r from-water via-white to-flame bg-clip-text text-transparent' : ''}`}
      style={{ display: 'block', willChange: 'transform, opacity' }}
    >
      {text}
    </span>
  );
}

export default function HeroHeadline() {
  return (
    <h1
      className="font-black tracking-tight leading-[0.93] mb-6"
      style={{ fontSize: 'clamp(3rem, 11vw, 7.5rem)' }}
    >
      <AnimatedWord text="Drop." delay={120} />
      <AnimatedWord text="Train." delay={280} gradient />
      <AnimatedWord text="Drive." delay={440} />
    </h1>
  );
}
