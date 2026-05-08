'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Check, ArrowRight } from 'lucide-react';
import { SERVICES, WEEKLY_PLANS, ADD_ONS } from '@/lib/square/pricing';
import type { ServiceId, WeeklyPlanId } from '@/lib/square/pricing';
import type { BookingInput } from '@/lib/validators/booking';

type LocationType = BookingInput['location'];

type ServiceOption = {
  value: ServiceId | WeeklyPlanId;
  label: string;
};

const SERVICE_OPTIONS: ServiceOption[] = [
  { value: 'small_exterior', label: 'Small — Exterior Only · $35' },
  { value: 'small_full', label: 'Small — Interior + Exterior · $55' },
  { value: 'medium_exterior', label: 'Medium — Exterior Only · $40' },
  { value: 'medium_full', label: 'Medium — Interior + Exterior · $65' },
  { value: 'large_exterior', label: 'Large — Exterior Only · $45' },
  { value: 'large_full', label: 'Large — Interior + Exterior · $75' },
  { value: 'detail', label: 'Full Detail · from $295' },
  { value: 'weekly_small_exterior', label: 'Weekly Plan — Small Exterior · $120/mo' },
  { value: 'weekly_small_full', label: 'Weekly Plan — Small Full · $180/mo' },
  { value: 'weekly_medium_exterior', label: 'Weekly Plan — Medium Exterior · $130/mo' },
  { value: 'weekly_medium_full', label: 'Weekly Plan — Medium Full · $220/mo' },
  { value: 'weekly_large_exterior', label: 'Weekly Plan — Large Exterior · $150/mo' },
  { value: 'weekly_large_full', label: 'Weekly Plan — Large Full · $250/mo' },
];

const VALID_SERVICES: ServiceId[] = ['small_exterior', 'small_full', 'medium_exterior', 'medium_full', 'large_exterior', 'large_full', 'detail'];
const VALID_WEEKLY_PLANS: WeeklyPlanId[] = ['weekly_small_exterior', 'weekly_small_full', 'weekly_medium_exterior', 'weekly_medium_full', 'weekly_large_exterior', 'weekly_large_full'];

type ModalPreset = ServiceOption['value'] | null;

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preset?: ModalPreset;
}

interface FormState {
  name: string;
  phone: string;
  vehicle: string;
  plate: string;
  service: ServiceOption['value'];
  location: LocationType;
  when: string;
  selectedAddOns: string[];
  billingCycle: 'monthly' | 'annual';
  promoCode: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim()) errors.name = 'Name is required';
  if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 10)
    errors.phone = 'Valid phone number required';
  return errors;
}

function isService(val: string): val is ServiceId {
  return VALID_SERVICES.includes(val as ServiceId);
}

function isWeeklyPlan(val: string): val is WeeklyPlanId {
  return VALID_WEEKLY_PLANS.includes(val as WeeklyPlanId);
}

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}

export default function BookingModal({ isOpen, onClose, preset }: BookingModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [promoValid, setPromoValid] = useState<boolean | null>(null);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoChecking, setPromoChecking] = useState(false);

  const [form, setForm] = useState<FormState>({
    name: '',
    phone: '',
    vehicle: '',
    plate: '',
    service: 'small_exterior',
    location: 'lvac',
    when: '',
    selectedAddOns: [],
    billingCycle: 'monthly',
    promoCode: '',
  });

  // Sync preset when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setErrors({});
      setPaymentError(null);
      setPromoValid(null);
      setPromoDiscount(0);
      if (preset) {
        setForm((prev) => ({ ...prev, service: preset, selectedAddOns: [], promoCode: '' }));
      }
    }
  }, [isOpen, preset]);

  // ESC closes modal
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  function showToast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2400);
  }

  function handleField(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    // Reset add-ons when service changes
    if (field === 'service') {
      setForm((prev) => ({ ...prev, service: value as ServiceOption['value'], selectedAddOns: [] }));
    }
  }

  function toggleAddOn(addOnId: string) {
    setForm((prev) => ({
      ...prev,
      selectedAddOns: prev.selectedAddOns.includes(addOnId)
        ? prev.selectedAddOns.filter((id) => id !== addOnId)
        : [...prev.selectedAddOns, addOnId],
    }));
  }

  async function validatePromo() {
    if (!form.promoCode.trim()) return;
    setPromoChecking(true);
    setPromoValid(null);
    try {
      const res = await fetch('/api/promo/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: form.promoCode.trim() }),
      });
      const json = await res.json();
      if (res.ok && json.data?.valid) {
        setPromoValid(true);
        setPromoDiscount(json.data.discount_percent);
      } else {
        setPromoValid(false);
        setPromoDiscount(0);
      }
    } catch {
      setPromoValid(false);
      setPromoDiscount(0);
    }
    setPromoChecking(false);
  }

  // Calculate subtotal (before promo)
  function getSubtotal(): number {
    if (isService(form.service)) {
      const svc = SERVICES[form.service];
      const addOnTotal = form.selectedAddOns.reduce((sum, id) => {
        const addOn = ADD_ONS.find((a) => a.id === id);
        return sum + (addOn?.priceCents ?? 0);
      }, 0);
      return svc.priceCents + addOnTotal;
    }
    if (isWeeklyPlan(form.service)) {
      const plan = WEEKLY_PLANS[form.service];
      return plan.monthlyCents;
    }
    return 0;
  }

  function getTotal(): number {
    const subtotal = getSubtotal();
    if (promoValid && promoDiscount > 0) {
      const discount = Math.round(subtotal * (promoDiscount / 100));
      return Math.max(subtotal - discount, 100);
    }
    return subtotal;
  }

  async function handleSubmit() {
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      showToast('Please fill in the required fields');
      return;
    }

    // Move to add-ons / payment step
    setStep(2);
  }

  async function handlePayment() {
    setSubmitting(true);
    setPaymentError(null);

    // Also submit the booking for tracking
    try {
      const apiServiceType = isService(form.service) ? form.service : 'small_exterior';
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          vehicle: form.vehicle.trim() || undefined,
          plate: form.plate.trim() || undefined,
          service_type: apiServiceType,
          location: form.location,
          scheduled_for: form.when.trim() || undefined,
        }),
      });
    } catch {
      // Non-blocking
    }

    // Create Square checkout
    try {
      const checkoutBody: Record<string, unknown> = {
        customer_name: form.name.trim(),
        customer_phone: form.phone.trim(),
        customer_vehicle: form.vehicle.trim() || undefined,
        customer_plate: form.plate.trim() || undefined,
      };

      if (isService(form.service)) {
        checkoutBody.service_id = form.service;
        checkoutBody.add_on_ids = form.selectedAddOns;
      } else if (isWeeklyPlan(form.service)) {
        checkoutBody.membership_id = form.service;
      }

      // Attach promo code if valid
      if (promoValid && form.promoCode.trim()) {
        checkoutBody.promo_code = form.promoCode.trim();
      }

      const res = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkoutBody),
      });

      const json = await res.json();

      if (!res.ok || json.error) {
        throw new Error(json.message || 'Checkout failed');
      }

      // Redirect to Square payment page
      window.location.href = json.data.checkout_url;
    } catch (err) {
      setPaymentError(err instanceof Error ? err.message : 'Something went wrong');
      setSubmitting(false);
    }
  }

  // Add-ons available for any wash service
  const currentAddOns = isService(form.service) ? ADD_ONS : [];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 modal-backdrop"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Book your wash"
      >
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-surface border border-line rounded-3xl p-7 lg:p-9 max-h-[90vh] overflow-y-auto no-scrollbar relative">
            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close booking modal"
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-surface-2 border border-line grid place-items-center hover:border-white/30 transition cursor-pointer"
            >
              <X className="w-4 h-4" strokeWidth={2.5} />
            </button>

            {/* Step 1: Info Form */}
            {step === 1 && (
              <div>
                <p className="font-mono text-[10px] tracking-widest text-water mb-2">
                  RESERVE YOUR WASH
                </p>
                <h3 className="text-2xl font-bold mb-6">
                  Tell us a little. We&rsquo;ll handle the rest.
                </h3>

                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="b_name"
                      className="block text-xs font-mono text-muted mb-1.5 tracking-widest"
                    >
                      FULL NAME
                    </label>
                    <input
                      id="b_name"
                      type="text"
                      autoComplete="name"
                      value={form.name}
                      onChange={(e) => handleField('name', e.target.value)}
                      placeholder="Your name"
                      className={`field w-full px-4 py-3 rounded-xl text-sm ${errors.name ? 'border-flame' : ''}`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-flame font-mono">{errors.name}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="b_phone"
                      className="block text-xs font-mono text-muted mb-1.5 tracking-widest"
                    >
                      PHONE NUMBER
                    </label>
                    <input
                      id="b_phone"
                      type="tel"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={(e) => handleField('phone', e.target.value)}
                      placeholder="(702) 555-0100"
                      className={`field w-full px-4 py-3 rounded-xl text-sm ${errors.phone ? 'border-flame' : ''}`}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs text-flame font-mono">{errors.phone}</p>
                    )}
                  </div>

                  {/* Vehicle + Plate */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="b_vehicle"
                        className="block text-xs font-mono text-muted mb-1.5 tracking-widest"
                      >
                        VEHICLE
                      </label>
                      <input
                        id="b_vehicle"
                        type="text"
                        value={form.vehicle}
                        onChange={(e) => handleField('vehicle', e.target.value)}
                        placeholder="2023 Raptor"
                        className="field w-full px-4 py-3 rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="b_plate"
                        className="block text-xs font-mono text-muted mb-1.5 tracking-widest"
                      >
                        PLATE
                      </label>
                      <input
                        id="b_plate"
                        type="text"
                        value={form.plate}
                        onChange={(e) => handleField('plate', e.target.value)}
                        placeholder="ABC1234"
                        className="field w-full px-4 py-3 rounded-xl text-sm"
                      />
                    </div>
                  </div>

                  {/* Service */}
                  <div>
                    <label
                      htmlFor="b_service"
                      className="block text-xs font-mono text-muted mb-1.5 tracking-widest"
                    >
                      SERVICE
                    </label>
                    <select
                      id="b_service"
                      value={form.service}
                      onChange={(e) => handleField('service', e.target.value)}
                      className="field w-full px-4 py-3 rounded-xl text-sm cursor-pointer"
                    >
                      {SERVICE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Weekly plan note */}
                  {isWeeklyPlan(form.service) && (
                    <div className="card rounded-xl px-3 py-3 text-sm">
                      <p className="font-semibold">Weekly Plan — 4 washes/month</p>
                      <p className="text-xs text-muted mt-0.5">Paid on the 1st of each month</p>
                    </div>
                  )}

                  {/* Location */}
                  <div>
                    <p className="block text-xs font-mono text-muted mb-1.5 tracking-widest">
                      LOCATION
                    </p>
                    <div
                      className="card rounded-xl px-3 py-3 text-sm border-water/60"
                    >
                      <p className="font-semibold">LVAC Henderson</p>
                      <p className="text-xs text-muted mt-0.5">1195 Wellness Pl · Drop off &amp; train</p>
                    </div>
                  </div>

                  {/* Date/time */}
                  <div>
                    <label
                      htmlFor="b_when"
                      className="block text-xs font-mono text-muted mb-1.5 tracking-widest"
                    >
                      PREFERRED DATE / TIME
                    </label>
                    <input
                      id="b_when"
                      type="text"
                      value={form.when}
                      onChange={(e) => handleField('when', e.target.value)}
                      placeholder="Tomorrow morning, around 9am"
                      className="field w-full px-4 py-3 rounded-xl text-sm"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="btn-primary w-full py-3.5 rounded-xl font-semibold mt-2 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                  >
                    {submitting ? (
                      'Sending...'
                    ) : (
                      <>
                        Continue to Payment
                        <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-center text-muted font-mono leading-relaxed">
                    By submitting this form, you agree to receive SMS messages from URRUTIA regarding your service, including booking confirmations, wash status updates, and occasional check-ins. Message and data rates may apply. Reply STOP to unsubscribe at any time. See our{' '}
                    <a href="/sms-consent" className="underline hover:text-water">SMS Consent Policy</a>.
                    Secure payment via Square.
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Add-ons + Payment */}
            {step === 2 && (
              <div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-mono text-water mb-4 hover:underline cursor-pointer"
                >
                  ← Back to details
                </button>

                <p className="font-mono text-[10px] tracking-widest text-water mb-2">
                  {isWeeklyPlan(form.service) ? 'CONFIRM MEMBERSHIP' : 'CUSTOMIZE YOUR SERVICE'}
                </p>
                <h3 className="text-2xl font-bold mb-6">
                  {isWeeklyPlan(form.service)
                    ? 'Review & pay'
                    : 'Add extras to your wash'}
                </h3>

                {/* Add-ons for services */}
                {isService(form.service) && currentAddOns.length > 0 && (
                  <div className="space-y-2 mb-6">
                    <p className="text-xs font-mono text-muted tracking-widest mb-3">
                      POPULAR ADD-ONS (optional)
                    </p>
                    {currentAddOns.map((addOn) => {
                      const isChecked = form.selectedAddOns.includes(addOn.id);
                      return (
                        <button
                          key={addOn.id}
                          type="button"
                          onClick={() => toggleAddOn(addOn.id)}
                          className={`w-full flex items-center justify-between p-3.5 rounded-xl text-sm transition-all cursor-pointer ${
                            isChecked
                              ? 'bg-water/8 border border-water/40'
                              : 'card'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded-md border-2 grid place-items-center transition-all ${
                                isChecked
                                  ? 'bg-water border-water'
                                  : 'border-line'
                              }`}
                            >
                              {isChecked && <Check className="w-3 h-3 text-void" strokeWidth={3} />}
                            </div>
                            <span className={isChecked ? 'text-ink' : 'text-muted'}>
                              {addOn.label}
                            </span>
                          </div>
                          <span className="font-mono text-xs text-water">
                            +{formatCents(addOn.priceCents)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Weekly plan summary */}
                {isWeeklyPlan(form.service) && (
                  <div className="card rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted">Plan</span>
                      <span className="text-sm font-semibold">
                        {WEEKLY_PLANS[form.service as WeeklyPlanId].label}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted">Frequency</span>
                      <span className="text-sm font-semibold">4 washes / month</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted">Billing</span>
                      <span className="text-sm font-semibold">Paid on 1st of month</span>
                    </div>
                  </div>
                )}

                {/* Promo code input */}
                <div className="mb-4">
                  <p className="text-xs font-mono text-muted tracking-widest mb-2">PROMO CODE</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={form.promoCode}
                      onChange={(e) => {
                        setForm((prev) => ({ ...prev, promoCode: e.target.value.toUpperCase() }));
                        setPromoValid(null);
                        setPromoDiscount(0);
                      }}
                      onKeyDown={(e) => { if (e.key === 'Enter') validatePromo(); }}
                      placeholder="URR-XXXX"
                      className="field flex-1 px-3 py-2.5 rounded-lg text-sm font-mono tracking-widest"
                    />
                    <button
                      type="button"
                      onClick={validatePromo}
                      disabled={promoChecking || !form.promoCode.trim()}
                      className="px-4 py-2.5 rounded-lg text-xs font-bold tracking-wide transition-all disabled:opacity-40 cursor-pointer"
                      style={{
                        background: promoValid ? 'rgba(16,185,129,0.15)' : 'rgba(0,180,255,0.1)',
                        color: promoValid ? '#10B981' : '#00B4FF',
                        border: promoValid ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(0,180,255,0.25)',
                      }}
                    >
                      {promoChecking ? '...' : promoValid ? 'APPLIED' : 'APPLY'}
                    </button>
                  </div>
                  {promoValid === true && (
                    <p className="text-xs font-mono mt-1.5 flex items-center gap-1.5" style={{ color: '#10B981' }}>
                      <Check className="w-3 h-3" strokeWidth={3} />
                      {promoDiscount}% off + free spray wax applied!
                    </p>
                  )}
                  {promoValid === false && (
                    <p className="text-xs font-mono mt-1.5 text-flame">
                      Invalid or expired promo code
                    </p>
                  )}
                </div>

                {/* Total */}
                <div className="p-4 rounded-xl bg-water/5 border border-water/20 mb-6">
                  {promoValid && promoDiscount > 0 && (
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted">Subtotal</span>
                      <span className="text-sm text-muted line-through">{formatCents(getSubtotal())}</span>
                    </div>
                  )}
                  {promoValid && promoDiscount > 0 && (
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm" style={{ color: '#10B981' }}>Promo ({promoDiscount}% off)</span>
                      <span className="text-sm font-semibold" style={{ color: '#10B981' }}>
                        -{formatCents(Math.round(getSubtotal() * (promoDiscount / 100)))}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="text-2xl font-black text-water">
                      {formatCents(getTotal())}
                    </span>
                  </div>
                  {promoValid && (
                    <p className="text-xs font-mono mt-2" style={{ color: '#10B981' }}>
                      + FREE Spray Wax included
                    </p>
                  )}
                </div>

                {/* Payment error */}
                {paymentError && (
                  <div
                    className="p-4 rounded-xl text-sm mb-4"
                    style={{
                      background: 'rgba(239,68,68,0.08)',
                      border: '1px solid rgba(239,68,68,0.3)',
                      color: '#ef4444',
                    }}
                  >
                    {paymentError}
                  </div>
                )}

                {/* Pay button */}
                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={submitting}
                  className="btn-primary w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-void/30 border-t-void rounded-full animate-spin" />
                      Redirecting to Square...
                    </span>
                  ) : (
                    <>
                      Pay {formatCents(getTotal())}
                      <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                    </>
                  )}
                </button>

                <p className="text-[10px] text-center text-muted font-mono mt-3">
                  Secure checkout powered by Square
                </p>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 inset-x-0 mx-auto w-fit z-[60] toast pointer-events-none">
          <div className="bg-surface border border-success text-sm px-5 py-3 rounded-full font-mono flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            <span>{toastMsg}</span>
          </div>
        </div>
      )}
    </>
  );
}
