'use client';

import { useState, useEffect, useRef } from 'react';
import BookingModal from '@/components/sections/BookingModal';

export default function SiteNav() {
  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      setRevealed(y > 80);
    };

    // Run once on mount to handle refresh-at-scroll-position
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Trap body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  const navLinks = [
    { href: '#process',    label: 'How It Works' },
    { href: '#services',   label: 'Services' },
    { href: '#membership', label: 'Membership' },
    { href: '#gallery',    label: 'Gallery' },
    { href: '#location',   label: 'Location' },
  ];

  return (
    <>
      {/* ─── Main nav ─── */}
      <nav
        style={{
          opacity: revealed ? 1 : 0,
          transform: revealed ? 'translateY(0)' : 'translateY(-8px)',
          transition: 'opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1), transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease, background 0.4s ease',
          borderBottomColor: scrolled ? 'rgba(27,34,54,0.9)' : 'transparent',
        }}
        className="fixed top-0 inset-x-0 z-40 backdrop-blur-md bg-void/80 border-b"
      >
        <div className="max-w-7xl mx-auto px-5 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#top"
            className="flex items-center gap-2.5 group"
            style={{ cursor: 'none' }}
          >
            <div
              className="w-9 h-9 rounded-full relative grid place-items-center bg-gradient-to-br from-water-deep to-water glow-water"
              style={{
                transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'scale(1.12)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 0 28px rgba(0,180,255,0.6), inset 0 0 1px rgba(0,180,255,0.5)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                (e.currentTarget as HTMLElement).style.boxShadow = '';
              }}
            >
              <span className="text-[10px] font-black tracking-tighter text-white">URR</span>
            </div>
            <span className="wordmark text-lg">URRUTIA</span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8 text-sm text-muted">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="nav-link hover:text-ink transition-colors duration-200"
                style={{ cursor: 'none' }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA + Mobile hamburger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setModalOpen(true)}
              className="btn-primary px-4 py-2 rounded-full text-sm cursor-none hidden md:block"
            >
              Book Now
            </button>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMenuOpen(true)}
              className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 cursor-none"
              aria-label="Open menu"
            >
              <span
                className="block w-6 h-px bg-ink transition-all duration-300"
                style={{ transform: menuOpen ? 'rotate(45deg) translateY(2.5px)' : 'none' }}
              />
              <span
                className="block w-6 h-px bg-ink transition-all duration-300"
                style={{ transform: menuOpen ? 'rotate(-45deg) translateY(-2.5px)' : 'none', opacity: menuOpen ? 0 : 1 }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* ─── Mobile fullscreen overlay menu ─── */}
      <div
        aria-hidden={!menuOpen}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          pointerEvents: menuOpen ? 'all' : 'none',
          opacity: menuOpen ? 1 : 0,
          transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0"
          style={{ background: 'rgba(5,8,16,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setMenuOpen(false)}
        />

        {/* Slide-in panel from right */}
        <div
          ref={menuRef}
          className="card-glass absolute right-0 top-0 bottom-0"
          style={{
            width: 'min(88vw, 360px)',
            padding: '1.5rem',
            transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Close button */}
          <div className="flex justify-between items-center mb-10">
            <span className="wordmark text-base">URRUTIA</span>
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="w-10 h-10 grid place-items-center rounded-full border border-line text-muted hover:text-ink transition-colors duration-200"
              style={{ cursor: 'none' }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Links */}
          <nav className="flex flex-col gap-1 flex-1">
            {navLinks.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-3xl font-black tracking-tight text-ink/80 hover:text-ink py-3 border-b border-line/50 last:border-0 transition-colors duration-200"
                style={{
                  cursor: 'none',
                  transitionDelay: menuOpen ? `${i * 60}ms` : '0ms',
                  transform: menuOpen ? 'translateX(0)' : 'translateX(24px)',
                  opacity: menuOpen ? 1 : 0,
                  transition: `transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 60}ms, opacity 0.4s ease ${i * 60}ms, color 0.2s ease`,
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Book CTA at bottom */}
          <button
            onClick={() => { setMenuOpen(false); setModalOpen(true); }}
            className="btn-primary shimmer-btn w-full py-4 rounded-full text-base mt-8 cursor-none"
          >
            Book My Wash
          </button>
        </div>
      </div>

      <BookingModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
