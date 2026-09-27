import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Mail,
  Phone,
  FileText,
  Sparkles,
  Lock,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Property, Viewing } from '../types';
import { useAuth } from '../context/AuthContext';
import { bookViewing } from '../lib/firebase';
import { Modal, ModalHeader } from './Modal';
import { MagneticButton } from './MagneticButton';
import { formatPrice } from '../lib/format';
import { PLACEHOLDER_IMAGE, unsplashUrl } from '../lib/images';
import { VIEWING_TIME_SLOTS } from '../lib/locations';

interface BookViewingModalProps {
  property: Property | null;
  onClose: () => void;
  onOpenAuth: () => void;
  onViewingBooked: (viewing: Viewing) => void;
}

const labelClass = 'mb-1 block text-[10px] font-bold uppercase tracking-[0.16em] text-ink-700';
const inputClass =
  'w-full rounded-lg border border-bone-300 bg-bone-50 px-3.5 py-2.5 text-xs font-medium text-ink-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30';

export const BookViewingModal: React.FC<BookViewingModalProps> = ({
  property,
  onClose,
  onOpenAuth,
  onViewingBooked,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [createdViewing, setCreatedViewing] = useState<Viewing | null>(null);
  const [error, setError] = useState<string | null>(null);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split('T')[0];

  const [date, setDate] = useState(defaultDate);
  const [timeSlot, setTimeSlot] = useState(VIEWING_TIME_SLOTS[1]);
  const [userName, setUserName] = useState(user?.displayName || '');
  const [userEmail, setUserEmail] = useState(user?.email || '');
  const [userPhone, setUserPhone] = useState('');
  const [notes, setNotes] = useState('');

  if (!property) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) {
      onOpenAuth();
      return;
    }
    if (!date || !timeSlot || !userName.trim() || !userEmail.trim()) {
      setError('Please complete your name, email and preferred date.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const viewing = await bookViewing({
        propertyId: property.id,
        propertyTitle: property.title,
        propertyLocation: property.location || property.city,
        propertyImage: property.images?.[0] || PLACEHOLDER_IMAGE,
        propertyPrice: property.price,
        propertyOwnerId: property.ownerId,
        userId: user.uid,
        userName: userName.trim(),
        userEmail: userEmail.trim(),
        userPhone: userPhone.trim(),
        date,
        timeSlot,
        notes: notes.trim(),
      });

      setCreatedViewing(viewing);
      setConfirmed(true);
      onViewingBooked(viewing);

      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.62 },
        colors: ['#b08d3f', '#0b1220', '#d3b25f', '#e3c988'],
      });
    } catch (err) {
      console.error('Error booking viewing:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to book the viewing. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose} size="md" id="book-viewing-modal-container">
      titleId="book-viewing-title"
      <ModalHeader
        icon={Calendar}
        title="Schedule a private viewing"
        titleId="book-viewing-title"
        subtitle="Site visits are conducted by a Horizon Estates advisor, in person or over video."
      />

      <div className="overflow-y-auto p-6">
        {/* Property summary */}
        <div className="mb-6 flex items-center gap-3.5 rounded-xl border border-bone-200 bg-bone-100/60 p-3.5">
          <img
            src={unsplashUrl(property.images?.[0] || PLACEHOLDER_IMAGE, { width: 200, quality: 70 })}
            alt=""
            width={56}
            height={56}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className="h-14 w-14 shrink-0 rounded-lg border border-bone-200 object-cover"
          />
          <div className="min-w-0 flex-1">
            <h4 className="truncate text-xs font-bold text-ink-950">{property.title}</h4>
            <div className="mt-0.5 flex items-center gap-1 text-[11px] text-bone-500">
              <MapPin className="h-3 w-3 shrink-0 text-gold-500" />
              <span className="truncate">{property.location || property.city}</span>
            </div>
            <div className="mt-1 font-display text-sm font-bold text-gold-600">
              {formatPrice(property.price, property.listingType)}
            </div>
          </div>
        </div>

        {!user ? (
          <div className="rounded-xl border border-gold-400/40 bg-gold-50/70 px-4 py-8 text-center">
            <span className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-gold-100 text-gold-800">
              <Lock className="h-6 w-6" />
            </span>
            <h4 className="font-display text-base font-bold text-ink-950">
              Sign in to confirm your visit
            </h4>
            <p className="mx-auto mt-1.5 max-w-sm text-xs leading-relaxed text-bone-500">
              A complimentary Horizon Estates account lets you book private viewings, save
              shortlists and receive ₹ per sq ft updates on your preferred micro-markets.
            </p>
            <div className="mt-5">
              <MagneticButton
                id="book-modal-auth-btn"
                variant="ink"
                size="md"
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
              >
                Sign In to Continue
              </MagneticButton>
            </div>
          </div>
        ) : confirmed && createdViewing ? (
          <div className="py-6 text-center">
            <span className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50">
              <CheckCircle2 className="h-9 w-9" />
            </span>
            <h4 className="font-display text-xl font-bold text-ink-950">Viewing reserved</h4>
            <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed text-bone-500">
              Your appointment for{' '}
              <span className="font-semibold text-ink-900">{createdViewing.propertyTitle}</span> has
              been sent to the advisory desk. You will receive a confirmation on{' '}
              {createdViewing.userEmail}.
            </p>

            <dl className="mx-auto mt-5 max-w-md space-y-2 rounded-xl border border-bone-200 bg-bone-100/60 p-4 text-left text-xs">
              {[
                { label: 'Reserved date', value: createdViewing.date },
                { label: 'Time slot', value: createdViewing.timeSlot },
                { label: 'Attendee', value: createdViewing.userName },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-3">
                  <dt className="text-bone-500">{row.label}</dt>
                  <dd className="font-bold text-ink-950">{row.value}</dd>
                </div>
              ))}
              <div className="flex items-center justify-between gap-3">
                <dt className="text-bone-500">Status</dt>
                <dd>
                  <span className="rounded bg-gold-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold-800">
                    {createdViewing.status}
                  </span>
                </dd>
              </div>
            </dl>

            <div className="mt-6">
              <MagneticButton variant="ink" size="md" onClick={onClose}>
                Done
              </MagneticButton>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-700">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="viewing-date" className={labelClass}>
                Preferred date *
              </label>
              <input
                id="viewing-date"
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <span className={labelClass}>Preferred time slot *</span>
              <div className="grid grid-cols-3 gap-2">
                {VIEWING_TIME_SLOTS.map((slot) => {
                  const isActive = timeSlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTimeSlot(slot)}
                      aria-pressed={isActive}
                      className={`flex items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-[11px] font-bold transition-all ${
                        isActive
                          ? 'bg-ink-900 text-bone-50 shadow-sm ring-2 ring-gold-500/40'
                          : 'border border-bone-300 bg-bone-50 text-ink-700 hover:bg-bone-100'
                      }`}
                    >
                      <Clock className="h-3 w-3" />
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="viewing-name" className={labelClass}>
                  Full name *
                </label>
                <input
                  id="viewing-name"
                  type="text"
                  required
                  value={userName}
                  onChange={(event) => setUserName(event.target.value)}
                  placeholder="e.g. Ananya Iyer"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="viewing-phone" className={labelClass}>
                  Phone
                </label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-bone-400" />
                  <input
                    id="viewing-phone"
                    type="tel"
                    value={userPhone}
                    onChange={(event) => setUserPhone(event.target.value)}
                    placeholder="+91 98200 00000"
                    className={`${inputClass} pl-8`}
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="viewing-email" className={labelClass}>
                Email *
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-bone-400" />
                <input
                  id="viewing-email"
                  type="email"
                  required
                  value={userEmail}
                  onChange={(event) => setUserEmail(event.target.value)}
                  placeholder="you@example.in"
                  className={`${inputClass} pl-8`}
                />
              </div>
            </div>

            <div>
              <label htmlFor="viewing-notes" className={labelClass}>
                Notes for the advisor
              </label>
              <div className="relative">
                <FileText className="pointer-events-none absolute left-3 top-3.5 h-3.5 w-3.5 text-bone-400" />
                <textarea
                  id="viewing-notes"
                  rows={3}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Loan status, party size, specific features to inspect, accessibility needs…"
                  className={`${inputClass} resize-none pl-8`}
                />
              </div>
            </div>

            <MagneticButton
              id="submit-booking-btn"
              variant="gold"
              size="md"
              type="submit"
              disabled={loading}
              className="w-full"
            >
              <Calendar className="h-4 w-4" />
              {loading ? 'Confirming…' : 'Confirm Private Viewing'}
            </MagneticButton>

            <p className="flex items-start gap-2 text-[11px] leading-relaxed text-bone-500">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-bone-400" />
              Your details are shared only with the advisor handling this listing. Cancellations are
              free up to 12 hours before the appointment.
            </p>
          </form>
        )}
      </div>
    </Modal>
  );
};
