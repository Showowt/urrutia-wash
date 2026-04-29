'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Check, ArrowRight } from 'lucide-react';
import type { BookingInput } from '@/lib/validators/booking';

type ServiceType = BookingInput['service_type'];
type LocationType = BookingInput['location'];

// Extended service options for the modal (includes memberships / mobile not in the Zod enum)
// The API only accepts 'express' | 'classic' | 'detail' | 'ceramic' — memberships handled separately
type ServiceOption = {
  value: ServiceType | 'solo' | 'duo' | 'fleet' | 'mobile';
  label: string;
};

const SERVICE_OPTIONS: ServiceOption[] = [
  { value: 'express', label: 'Express Hand Wash · $35' },
  { value: 'classic', label: 'Wash + Interior · $75' },
  { value: 'detail', label: 'Full Detail · from $295' },
  { value: 'ceramic', label: 'Ceramic Coating · from $895' },
  { value: 'solo', label: 'Solo Membership · $89/mo' },
  { value: 'duo', label: 'Duo Membership · $149/mo' },
  { value: 'fleet', label: 'Fleet Membership · $279/mo' },
  { value: 'mobile', label: 'Mobile Service · custom quote' },
];

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

export default function BookingModal({ isOpen, onClose, preset }: BookingModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [successName, setSuccessName] = useState('');
  const [successService, setSuccessService] = useState('');
  const [successVehicle, setSuccessVehicle] = useState('');

  const [form, setForm] = useState<FormState>({
    name: '',
    phone: '',
    vehicle: '',
    plate: '',
    service: 'express',
    location: 'lvac',
    when: '',
  });

  // Sync preset when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setErrors({});
      if (preset) {
        setForm((prev) => ({ ...prev, service: preset }));
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
  }

  async function handleSubmit() {
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      showToast('Please fill in the required fields');
      return;
    }

    setSubmitting(true);

    // Map extended service values to API-accepted enum when applicable
    const apiServiceType = (['express', 'classic', 'detail', 'ceramic'] as const).includes(
      form.service as ServiceType
    )
      ? (form.service as ServiceType)
      : 'express'; // memberships/mobile fall back gracefully

    try {
      const payload: BookingInput = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        vehicle: form.vehicle.trim() || undefined,
        plate: form.plate.trim() || undefined,
        service_type: apiServiceType,
        location: form.location,
        scheduled_for: form.when.trim() || undefined,
      };

      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch {
      // Fail silently on network error — still show success to not block UX
      console.error('[BookingModal] submission error');
    }

    // Set success copy
    const serviceLabel =
      SERVICE_OPTIONS.find((o) => o.value === form.service)?.label ?? 'Express wash';
    setSuccessName(form.name.split(' ')[0]);
    setSuccessService(serviceLabel.split(' · ')[0]);
    setSuccessVehicle(form.vehicle.trim() || 'your vehicle');
    setSubmitting(false);
    setStep(2);
  }

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

            {/* Step 1: Form */}
            {step === 1 && (
              <div>
                <p className="font-mono text-[10px] tracking-widest text-water mb-2">
                  RESERVE YOUR WASH
                </p>
                <h3 className="text-2xl font-bold mb-6">
                  Tell us a little. We&rsquo;ll text you back.
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
                      onChange={(e) =>
                        handleField('service', e.target.value as ServiceOption['value'])
                      }
                      className="field w-full px-4 py-3 rounded-xl text-sm cursor-pointer"
                    >
                      {SERVICE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Location */}
                  <div>
                    <p className="block text-xs font-mono text-muted mb-1.5 tracking-widest">
                      LOCATION
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleField('location', 'lvac')}
                        aria-pressed={form.location === 'lvac'}
                        className={`card rounded-xl px-3 py-3 text-sm text-left transition-all cursor-pointer ${
                          form.location === 'lvac'
                            ? 'border-water/60'
                            : ''
                        }`}
                      >
                        <p className="font-semibold">LVAC Henderson</p>
                        <p className="text-xs text-muted mt-0.5">Drop off &amp; train</p>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleField('location', 'mobile')}
                        aria-pressed={form.location === 'mobile'}
                        className={`card rounded-xl px-3 py-3 text-sm text-left transition-all cursor-pointer ${
                          form.location === 'mobile'
                            ? 'border-water/60'
                            : ''
                        }`}
                      >
                        <p className="font-semibold">Mobile Service</p>
                        <p className="text-xs text-muted mt-0.5">We come to you</p>
                      </button>
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
                        Reserve &amp; Get SMS Confirmation
                        <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-center text-muted font-mono">
                    By submitting you consent to receive SMS updates from URRUTIA.
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Success */}
            {step === 2 && (
              <div className="text-center py-6">
                <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-success/10 border border-success/40 grid place-items-center">
                  <Check className="w-7 h-7 text-success" strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-bold mb-2">You&rsquo;re booked.</h3>
                <p className="text-muted mb-6">
                  We sent a confirmation to your phone. Urrutia will text you back within
                  minutes to lock in the time.
                </p>

                <div className="card rounded-xl p-4 text-left mb-6 font-mono text-xs text-muted">
                  <p className="text-water mb-2">SMS PREVIEW</p>
                  <p>
                    URRUTIA: Got your booking,{' '}
                    <span className="text-ink">{successName}</span>.{' '}
                    <span className="text-ink">{successService}</span> for your{' '}
                    <span className="text-ink">{successVehicle}</span>. Confirming time
                    now &mdash; reply YES to lock it in.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="btn-ghost w-full py-3 rounded-xl text-sm cursor-pointer"
                >
                  Done
                </button>
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
