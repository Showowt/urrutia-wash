'use client';

import { useState, useRef, useEffect, type FormEvent, type KeyboardEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// ─── Phone formatting ──────────────────────────────────────────────────────────
function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

// ─── Step type ─────────────────────────────────────────────────────────────────
type Step = 'phone' | 'otp' | 'success';

// ─── OTP input group ───────────────────────────────────────────────────────────
function OtpInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (idx: number, char: string) => {
    const digit = char.replace(/\D/g, '').slice(-1);
    const next = value.split('');
    next[idx] = digit;
    const joined = next.join('').padEnd(6, ' ').slice(0, 6);
    // trim trailing spaces but keep internal ones for partial state
    onChange(joined.trimEnd());
    if (digit && idx < 5) {
      inputs.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (idx: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!value[idx] && idx > 0) {
        const next = value.split('');
        next[idx - 1] = '';
        onChange(next.join('').trimEnd());
        inputs.current[idx - 1]?.focus();
      } else {
        const next = value.split('');
        next[idx] = '';
        onChange(next.join('').trimEnd());
      }
    }
    if (e.key === 'ArrowLeft' && idx > 0) inputs.current[idx - 1]?.focus();
    if (e.key === 'ArrowRight' && idx < 5) inputs.current[idx + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(pasted);
    const nextFocus = Math.min(pasted.length, 5);
    inputs.current[nextFocus]?.focus();
  };

  return (
    <div className="flex gap-2.5 justify-center" role="group" aria-label="One-time passcode">
      {Array.from({ length: 6 }).map((_, idx) => (
        <input
          key={idx}
          ref={(el) => { inputs.current[idx] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[idx]?.trim() ?? ''}
          onChange={(e) => handleChange(idx, e.target.value)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          onPaste={idx === 0 ? handlePaste : undefined}
          aria-label={`Digit ${idx + 1} of 6`}
          className="
            w-11 h-14 sm:w-12 sm:h-16
            text-center text-xl font-mono font-bold
            field rounded-xl
            focus:ring-2 focus:ring-water/30
            transition-all duration-200
            caret-transparent
            select-none
          "
        />
      ))}
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);

  const phoneInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    phoneInputRef.current?.focus();
  }, []);

  // Countdown timer for resend
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const t = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCountdown]);

  // Auto-submit when 6 digits are entered
  useEffect(() => {
    if (step === 'otp' && otp.length === 6 && !otp.includes(' ')) {
      handleVerify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp, step]);

  const isPhoneValid = phone.replace(/\D/g, '').length === 10;

  // ── Send code ───────────────────────────────────────────────────────────────
  async function handleSend(e?: FormEvent) {
    e?.preventDefault();
    if (!isPhoneValid) {
      setError('Please enter a valid 10-digit US phone number.');
      return;
    }
    setError('');
    setLoading(true);

    // Demo mode: skip real Twilio call
    await new Promise((r) => setTimeout(r, 800));

    setLoading(false);
    setStep('otp');
    setResendCountdown(30);
  }

  // ── Verify code ─────────────────────────────────────────────────────────────
  async function handleVerify() {
    if (otp.length < 6 || otp.includes(' ')) return;
    setError('');
    setLoading(true);

    // Demo mode: any 6-digit code works
    await new Promise((r) => setTimeout(r, 900));

    setLoading(false);
    setStep('success');

    // Brief success state, then redirect
    await new Promise((r) => setTimeout(r, 1200));
    router.push('/dashboard');
  }

  // ── Resend ──────────────────────────────────────────────────────────────────
  async function handleResend() {
    if (resendCountdown > 0) return;
    setOtp('');
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    setResendCountdown(30);
  }

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Background radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0,180,255,0.12), transparent 65%),' +
            'radial-gradient(ellipse 50% 40% at 20% 100%, rgba(255,107,26,0.07), transparent 60%)',
        }}
      />

      {/* Film grain */}
      <div className="film-grain absolute inset-0 pointer-events-none" aria-hidden="true" />

      {/* Grid overlay */}
      <div className="absolute inset-0 hero-grid opacity-40 pointer-events-none" aria-hidden="true" />

      {/* Card */}
      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <Link href="/" aria-label="Back to URRUTIA homepage">
            <div className="flex items-center gap-3 group">
              <div
                className="w-12 h-12 rounded-full glow-water grid place-items-center transition-transform duration-300 group-hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #0066CC, #00B4FF)' }}
              >
                <span className="text-xs font-black tracking-tighter text-white">URR</span>
              </div>
              <span className="wordmark text-2xl tracking-luxury">URRUTIA</span>
            </div>
          </Link>
          <p className="mt-2 font-mono text-xs text-muted tracking-widest">PREMIUM HAND CARE</p>
        </div>

        {/* Login card */}
        <div className="card-glass rounded-2xl p-8 sm:p-10">

          {/* ── STEP: PHONE ─────────────────────────────────────────────── */}
          {step === 'phone' && (
            <form onSubmit={handleSend} noValidate>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-ink mb-1.5">
                  Welcome back
                </h1>
                <p className="text-sm text-muted leading-relaxed">
                  Enter your phone number and we&rsquo;ll send you a verification code.
                </p>
              </div>

              <div className="mb-5">
                <label htmlFor="phone" className="block text-xs font-mono text-muted tracking-widest mb-2">
                  PHONE NUMBER
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-sm font-mono pointer-events-none">
                    +1
                  </span>
                  <input
                    ref={phoneInputRef}
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="numeric"
                    value={phone}
                    onChange={(e) => {
                      setPhone(formatPhone(e.target.value));
                      setError('');
                    }}
                    placeholder="(702) 555-0100"
                    aria-describedby={error ? 'phone-error' : undefined}
                    aria-invalid={!!error}
                    className="
                      field w-full h-14 rounded-xl
                      pl-12 pr-4 text-lg font-mono
                      placeholder:text-muted/40
                    "
                  />
                </div>

                {error && (
                  <p
                    id="phone-error"
                    role="alert"
                    className="mt-2 text-xs text-flame flex items-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                      <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm.75 3.25v4a.75.75 0 0 1-1.5 0v-4a.75.75 0 0 1 1.5 0zM8 11.5a.875.875 0 1 1 0 1.75.875.875 0 0 1 0-1.75z" />
                    </svg>
                    {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !isPhoneValid}
                className="
                  btn-primary shimmer-btn w-full h-14 rounded-xl text-base font-bold
                  flex items-center justify-center gap-2
                  disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none
                "
                aria-label="Send verification code"
              >
                {loading ? (
                  <>
                    <SpinnerIcon />
                    Sending code&hellip;
                  </>
                ) : (
                  <>
                    Send Code
                    <ArrowRightIcon />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ── STEP: OTP ───────────────────────────────────────────────── */}
          {step === 'otp' && (
            <div>
              <button
                onClick={() => { setStep('phone'); setOtp(''); setError(''); }}
                className="flex items-center gap-1.5 text-xs text-muted hover:text-ink transition mb-6"
                aria-label="Back to phone number entry"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M10 12L6 8l4-4" />
                </svg>
                Change number
              </button>

              <div className="mb-6">
                <h1 className="text-2xl font-bold text-ink mb-1.5">
                  Check your messages
                </h1>
                <p className="text-sm text-muted leading-relaxed">
                  We sent a 6-digit code to{' '}
                  <span className="text-ink font-mono">{phone}</span>.
                  Enter it below.
                </p>
              </div>

              <div className="mb-6">
                <OtpInput value={otp} onChange={setOtp} />
                {error && (
                  <p
                    role="alert"
                    className="mt-3 text-xs text-flame text-center flex items-center justify-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                      <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm.75 3.25v4a.75.75 0 0 1-1.5 0v-4a.75.75 0 0 1 1.5 0zM8 11.5a.875.875 0 1 1 0 1.75.875.875 0 0 1 0-1.75z" />
                    </svg>
                    {error}
                  </p>
                )}
              </div>

              <button
                onClick={handleVerify}
                disabled={loading || otp.length < 6 || otp.includes(' ')}
                className="
                  btn-primary shimmer-btn w-full h-14 rounded-xl text-base font-bold
                  flex items-center justify-center gap-2
                  disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none
                "
                aria-label="Verify code and sign in"
              >
                {loading ? (
                  <>
                    <SpinnerIcon />
                    Verifying&hellip;
                  </>
                ) : (
                  <>
                    Verify &amp; Sign In
                    <CheckIcon />
                  </>
                )}
              </button>

              {/* Resend */}
              <div className="mt-5 text-center">
                {resendCountdown > 0 ? (
                  <p className="text-xs text-muted font-mono">
                    Resend in <span className="text-ink tabular-nums">{resendCountdown}s</span>
                  </p>
                ) : (
                  <button
                    onClick={handleResend}
                    className="text-xs text-water hover:text-ink transition font-mono"
                    aria-label="Resend verification code"
                  >
                    Resend code
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── STEP: SUCCESS ───────────────────────────────────────────── */}
          {step === 'success' && (
            <div className="flex flex-col items-center text-center py-4">
              <div
                className="w-16 h-16 rounded-full grid place-items-center mb-5"
                style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)' }}
                aria-hidden="true"
              >
                <svg className="w-8 h-8 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-ink mb-1.5">You&rsquo;re in</h2>
              <p className="text-sm text-muted">Taking you to your dashboard&hellip;</p>
            </div>
          )}

        </div>

        {/* Trust signal */}
        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-muted font-mono">
          <LockIcon />
          Your data is encrypted and secure
        </div>

        {/* New customer CTA */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted">
            New to Urrutia?{' '}
            <Link
              href="/#membership"
              className="text-water hover:text-ink transition font-medium"
            >
              Book your first wash
            </Link>
          </p>
        </div>

        {/* Demo notice */}
        <div className="mt-4 rounded-xl border border-water/15 bg-water/4 px-4 py-3 text-center">
          <p className="text-xs text-muted">
            <span className="text-water font-mono">DEMO MODE</span> — any 6-digit code works.
            Real SMS auth via Twilio ships with Drop 003.
          </p>
        </div>

        {/* Footer credit */}
        <p className="mt-8 text-center text-xs text-muted/40 font-mono">
          Crafted by <span className="text-water/60">MachineMind</span>
        </p>
      </div>
    </div>
  );
}

// ─── Icon components ───────────────────────────────────────────────────────────
function SpinnerIcon() {
  return (
    <svg
      className="w-4 h-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M3 8.5l3.5 3.5 6.5-7.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M5 6V4.5a3 3 0 0 1 6 0V6h.5A1.5 1.5 0 0 1 13 7.5v5A1.5 1.5 0 0 1 11.5 14h-7A1.5 1.5 0 0 1 3 12.5v-5A1.5 1.5 0 0 1 4.5 6H5zm1.5 0h3V4.5a1.5 1.5 0 0 0-3 0V6zm.75 4.75a.75.75 0 1 1 1.5 0v1a.75.75 0 0 1-1.5 0v-1z" clipRule="evenodd" />
    </svg>
  );
}
