'use client';

import { useState, useEffect, useRef } from 'react';

export default function Preloader() {
  const [phase, setPhase] = useState<'loading' | 'exiting' | 'done'>('loading');
  const [wordmarkVisible, setWordmarkVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Lock scroll during preload
    document.body.style.overflow = 'hidden';

    // Respect prefers-reduced-motion — skip preloader entirely
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      document.body.style.overflow = '';
      setPhase('done');
      return;
    }

    // Wordmark fades in after 600ms
    const wordmarkTimer = setTimeout(() => setWordmarkVisible(true), 600);

    // Primary exit: triggered by video end event (via onEnded)
    // Fallback: 3.8s hard timeout in case autoplay is blocked
    const fallbackTimer = setTimeout(() => {
      triggerExit();
    }, 3800);

    return () => {
      clearTimeout(wordmarkTimer);
      clearTimeout(fallbackTimer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function triggerExit() {
    setPhase('exiting');
    // After transition completes, remove from DOM and restore scroll
    setTimeout(() => {
      document.body.style.overflow = '';
      setPhase('done');
    }, 1000);
  }

  if (phase === 'done') return null;

  return (
    <div
      className={`preloader${phase === 'exiting' ? ' preloader-exit' : ''}`}
      aria-hidden="true"
    >
      {/* Video container */}
      <div className="video-mask" style={{ width: 240, height: 240 * (960 / 536) > 420 ? 420 : Math.round(240 * (960 / 536)) }}>
        <video
          ref={videoRef}
          src="/video/logo-anim.mp4"
          poster="/video/logo-poster.jpg"
          autoPlay
          muted
          playsInline
          onEnded={triggerExit}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        >
          <source src="/video/logo-anim.webm" type="video/webm" />
          <source src="/video/logo-anim.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Wordmark */}
      <div
        style={{
          marginTop: 32,
          opacity: wordmarkVisible ? 1 : 0,
          letterSpacing: wordmarkVisible ? '0.36em' : '0.08em',
          transform: wordmarkVisible ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), letter-spacing 1.1s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="wordmark text-2xl"
      >
        URRUTIA
      </div>

      {/* Progress bar */}
      <div
        style={{
          marginTop: 28,
          width: 240,
          height: 1,
          background: 'rgba(255,255,255,0.08)',
          borderRadius: 1,
          overflow: 'hidden',
          opacity: wordmarkVisible ? 1 : 0,
          transition: 'opacity 0.5s ease 0.3s',
        }}
      >
        <div
          className="progress-bar-fill"
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, var(--color-water-deep), var(--color-water))',
            borderRadius: 1,
          }}
        />
      </div>
    </div>
  );
}
