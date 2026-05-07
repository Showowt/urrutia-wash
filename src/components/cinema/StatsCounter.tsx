'use client';

import { useEffect, useRef, useState } from 'react';

interface Stat {
  value: number;
  suffix: string;
  label: string;
  prefix?: string;
}

const STATS: Stat[] = [
  { value: 1200, suffix: '+', label: 'VEHICLES SERVICED' },
  { value: 4.7, suffix: '★', label: 'CLIENT RATING' },
  { value: 100, suffix: '%', label: 'HAND-WASHED' },
  { value: 7, suffix: 'DAY', label: 'MOBILE COVERAGE' },
];

function useCountUp(target: number, duration: number, active: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setCount(target);
      return;
    }

    const isDecimal = target % 1 !== 0;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quart
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = eased * target;
      setCount(isDecimal ? Math.round(current * 10) / 10 : Math.floor(current));
      if (progress < 1) requestAnimationFrame(tick);
      else setCount(target);
    };

    requestAnimationFrame(tick);
  }, [target, duration, active]);

  return count;
}

function StatItem({ stat, active }: { stat: Stat; active: boolean }) {
  const count = useCountUp(stat.value, 2000, active);
  const isDecimal = stat.value % 1 !== 0;

  return (
    <div>
      <dd className="text-4xl lg:text-5xl font-black mb-2 bg-gradient-to-br from-ink to-muted bg-clip-text text-transparent tabular-nums">
        {stat.prefix}{isDecimal ? count.toFixed(1) : count.toLocaleString()}{stat.suffix}
      </dd>
      <dt className="text-sm text-muted font-mono tracking-widest">{stat.label}</dt>
    </div>
  );
}

export default function StatsCounter() {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDListElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <dl ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0">
      {STATS.map((stat, i) => (
        <div
          key={stat.label}
          className={`${i > 0 ? 'lg:border-l lg:border-line lg:pl-10' : ''} ${i === 2 ? 'border-t border-line pt-6 lg:border-t-0 lg:pt-0' : ''} ${i === 3 ? 'border-t border-line pt-6 lg:border-t-0 lg:pt-0' : ''}`}
        >
          <StatItem stat={stat} active={active} />
        </div>
      ))}
    </dl>
  );
}
