'use client';

import { useState, useRef } from 'react';

export default function PromoBanner() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function formatPhone(raw: string): string {
    const digits = raw.replace(/\D/g, '').slice(0, 10);
    if (digits.length < 4) return digits;
    if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  async function handleUnlock() {
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) {
      setError('Enter a valid 10-digit number');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/promo/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: digits }),
      });

      const json = await res.json();

      if (!res.ok || json.error) {
        if (json.error === 'already_used') {
          setError('You already used your first-wash promo!');
        } else {
          setError(json.message || 'Something went wrong');
        }
        setLoading(false);
        return;
      }

      setCode(json.data.code);
    } catch {
      setError('Connection error. Try again.');
    }

    setLoading(false);
  }

  function handleCopy() {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (dismissed) return null;

  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(0,180,255,0.08) 0%, rgba(255,107,26,0.06) 50%, rgba(0,180,255,0.04) 100%)',
        borderBottom: '1px solid rgba(0,180,255,0.15)',
      }}
    >
      {/* Animated shimmer effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(0,180,255,0.06) 50%, transparent 100%)',
          animation: 'shimmer-slide 3s ease-in-out infinite',
        }}
      />

      <div className="max-w-4xl mx-auto px-5 py-4 relative z-10">
        {/* Close button */}
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-2 right-3 w-7 h-7 grid place-items-center text-muted/50 hover:text-muted transition-colors cursor-pointer"
          aria-label="Dismiss promo"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {!code ? (
          /* ── Phase 1: Collect phone ── */
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-3 shrink-0">
              {/* Pulsing dot */}
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-flame opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-flame" />
              </span>
              <div className="text-center sm:text-left">
                <p className="font-black text-sm sm:text-base tracking-tight">
                  <span className="text-flame">10% OFF</span>
                  <span className="text-ink"> + FREE Spray Wax</span>
                </p>
                <p className="text-[11px] text-muted font-mono tracking-wide">
                  FIRST WASH SPECIAL — ENTER YOUR NUMBER
                </p>
              </div>
            </div>

            <div className="flex gap-2 w-full sm:w-auto sm:ml-auto">
              <input
                ref={inputRef}
                type="tel"
                inputMode="numeric"
                placeholder="(702) 555-0000"
                value={phone}
                onChange={(e) => {
                  setPhone(formatPhone(e.target.value));
                  setError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleUnlock();
                }}
                className="flex-1 sm:w-44 h-10 px-3 rounded-lg text-sm font-mono outline-none transition-all"
                style={{
                  background: 'rgba(5,8,16,0.6)',
                  border: error ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(0,180,255,0.25)',
                  color: '#F5F7FA',
                }}
                aria-label="Phone number for promo code"
              />
              <button
                onClick={handleUnlock}
                disabled={loading || phone.replace(/\D/g, '').length < 10}
                className="h-10 px-5 rounded-lg text-sm font-bold tracking-wide transition-all active:scale-[0.97] disabled:opacity-50 cursor-pointer shrink-0"
                style={{
                  background: loading ? '#11172A' : 'linear-gradient(135deg, #FF6B1A, #FF8B4A)',
                  color: loading ? '#8B95A8' : '#050810',
                  border: 'none',
                }}
              >
                {loading ? '...' : 'UNLOCK'}
              </button>
            </div>

            {error && (
              <p className="text-xs text-flame font-mono w-full text-center sm:text-right sm:absolute sm:bottom-1 sm:right-12">
                {error}
              </p>
            )}
          </div>
        ) : (
          /* ── Phase 2: Show code ── */
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5">
            <div className="flex items-center gap-3 shrink-0">
              <div
                className="w-8 h-8 rounded-full grid place-items-center shrink-0"
                style={{
                  background: 'rgba(16,185,129,0.12)',
                  border: '1.5px solid rgba(16,185,129,0.4)',
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" className="w-4 h-4">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-sm text-ink">Your promo code is ready!</p>
                <p className="text-[11px] text-muted font-mono">10% off + free spray wax on your first wash</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:ml-auto">
              {/* Code display */}
              <div
                className="flex items-center gap-3 px-4 py-2 rounded-lg"
                style={{
                  background: 'rgba(5,8,16,0.6)',
                  border: '1.5px dashed rgba(255,107,26,0.5)',
                }}
              >
                <span className="font-black font-mono text-lg tracking-widest text-flame">
                  {code}
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer"
                  style={{
                    background: copied ? 'rgba(16,185,129,0.15)' : 'rgba(255,107,26,0.12)',
                    color: copied ? '#10B981' : '#FF8B4A',
                    border: copied ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(255,107,26,0.25)',
                  }}
                >
                  {copied ? (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3"><path d="M20 6L9 17l-5-5" /></svg>
                      COPIED
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                      COPY
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
