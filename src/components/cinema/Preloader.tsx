'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export default function Preloader() {
  const [phase, setPhase] = useState<'loading' | 'exiting' | 'done'>('loading');
  const [wordmarkVisible, setWordmarkVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasExited = useRef(false);

  const triggerExit = useCallback(() => {
    // Guard against double-fire (video onEnded + fallback timeout)
    if (hasExited.current) return;
    hasExited.current = true;

    setPhase('exiting');
    setTimeout(() => {
      document.body.style.overflow = '';
      setPhase('done');
    }, 900);
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    // Skip preloader if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.body.style.overflow = '';
      setPhase('done');
      return;
    }

    // Show wordmark after 500ms
    const wordmarkTimer = setTimeout(() => setWordmarkVisible(true), 500);

    // Explicitly play video (autoplay can be blocked)
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {
        // Autoplay blocked — trigger exit immediately
        triggerExit();
      });
    }

    // Hard fallback: exit after 3.5s no matter what
    const fallbackTimer = setTimeout(triggerExit, 3500);

    return () => {
      clearTimeout(wordmarkTimer);
      clearTimeout(fallbackTimer);
    };
  }, [triggerExit]);

  if (phase === 'done') return null;

  return (
    <div
      className={`preloader${phase === 'exiting' ? ' preloader-exit' : ''}`}
      aria-hidden="true"
    >
      {/* Video */}
      <div
        style={{
          width: 220,
          height: 390,
          borderRadius: 20,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <video
          ref={videoRef}
          poster="/video/logo-poster.jpg"
          muted
          playsInline
          onEnded={triggerExit}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        >
          <source src="/video/logo-anim.webm" type="video/webm" />
          <source src="/video/logo-anim.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Wordmark */}
      <div
        style={{
          marginTop: 28,
          opacity: wordmarkVisible ? 1 : 0,
          letterSpacing: wordmarkVisible ? '0.32em' : '0.06em',
          transform: wordmarkVisible ? 'translateY(0)' : 'translateY(8px)',
          transition:
            'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), letter-spacing 1s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="wordmark text-2xl"
      >
        URRUTIA
      </div>

      {/* Progress bar */}
      <div
        style={{
          marginTop: 24,
          width: 220,
          height: 2,
          background: 'rgba(255,255,255,0.06)',
          borderRadius: 2,
          overflow: 'hidden',
          opacity: wordmarkVisible ? 1 : 0,
          transition: 'opacity 0.4s ease 0.2s',
        }}
      >
        <div
          className="progress-bar-fill"
          style={{
            height: '100%',
            background:
              'linear-gradient(90deg, var(--color-water-deep), var(--color-water))',
            borderRadius: 2,
          }}
        />
      </div>
    </div>
  );
}
