import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  User, 
  Mail, 
  Phone, 
  FileText,
  Sparkles,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Property, Viewing } from '../types';
import { useAuth } from '../context/AuthContext';
import { bookViewing } from '../lib/firebase';

interface BookViewingModalProps {
  property: Property | null;
  onClose: () => void;
  onOpenAuth: () => void;
  onViewingBooked: (viewing: Viewing) => void;
}

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

  // Tomorrow as default date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const formattedDefaultDate = tomorrow.toISOString().split('T')[0];

  const [date, setDate] = useState(formattedDefaultDate);
  const [timeSlot, setTimeSlot] = useState('11:30 AM');
  const [userName, setUserName] = useState(user?.displayName || '');
  const [userEmail, setUserEmail] = useState(user?.email || '');
  const [userPhone, setUserPhone] = useState('+1 (555) 234-5678');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!property) return null;

  const timeSlots = [
    '09:30 AM',
    '11:00 AM',
    '01:30 PM',
    '03:00 PM',
    '04:30 PM',
    '06:00 PM'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth();
      return;
    }

    if (!date || !timeSlot || !userName || !userEmail) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const primaryImg = property.images && property.images.length > 0
        ? property.images[0]
        : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';

      const viewing = await bookViewing({
        propertyId: property.id,
        propertyTitle: property.title,
        propertyLocation: property.location || property.city,
        propertyImage: primaryImg,
        propertyPrice: property.price,
        propertyOwnerId: property.ownerId,
        userId: user.uid,
        userName,
        userEmail,
        userPhone,
        date,
        timeSlot,
        notes,
      });

      setCreatedViewing(viewing);
      setConfirmed(true);
      onViewingBooked(viewing);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d8a853', '#0b1329', '#10b981', '#f59e0b']
      });
    } catch (err: any) {
      console.error('Error booking viewing:', err);
      setError(err.message || 'Failed to book viewing appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        id="book-viewing-modal-container"
        className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden my-auto border border-stone-200 animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold text-slate-900 font-serif-luxury">
              Schedule Private Viewing
            </h3>
          </div>
          <button
            id="book-viewing-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-200 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Property Summary Pill */}
          <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200 mb-6">
            <img
              src={property.images && property.images.length > 0 ? property.images[0] : ''}
              alt={property.title}
              className="w-14 h-14 rounded-lg object-cover border border-stone-200 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-slate-900 truncate">{property.title}</h4>
              <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                <span className="truncate">{property.location || property.city}</span>
              </div>
              <div className="text-xs font-bold text-amber-800 mt-1">
                ${property.price.toLocaleString()}
              </div>
            </div>
          </div>

          {!user ? (
            /* Unauthenticated state */
            <div className="text-center py-8 px-4 bg-amber-50/60 rounded-xl border border-amber-200">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-3">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 font-serif-luxury">
                Authentication Required
              </h4>
              <p className="text-xs text-slate-600 mt-1.5 max-w-sm mx-auto">
                Please sign in or create a complimentary account to book private viewings and connect with our licensed advisors.
              </p>
              <div className="mt-5 flex items-center justify-center gap-3">
                <button
                  id="book-modal-auth-btn"
                  onClick={() => {
                    onClose();
                    onOpenAuth();
                  }}
                  className="px-6 py-2.5 bg-[#0b1329] hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md"
                >
                  Sign In to Continue
                </button>
              </div>
            </div>
          ) : confirmed && createdViewing ? (
            /* Success confirmation */
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <h4 className="text-xl font-bold font-serif-luxury text-slate-900">
                  Viewing Appointment Reserved!
                </h4>
                <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                  Your appointment for <span className="font-semibold text-slate-900">{createdViewing.propertyTitle}</span> has been securely submitted to our advisory desk.
                </p>
              </div>

              <div className="bg-stone-50 rounded-xl p-4 text-left border border-stone-200 text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-slate-500">Reserved Date:</span>
                  <span className="font-bold text-slate-900">{createdViewing.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Time Window:</span>
                  <span className="font-bold text-slate-900">{createdViewing.timeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Attendee:</span>
                  <span className="font-bold text-slate-900">{createdViewing.userName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-bold text-amber-700 uppercase bg-amber-50 px-2 py-0.5 rounded">
                    {createdViewing.status}
                  </span>
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
                  {error}
                </div>
              )}

              {/* Date Selection */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                  Select Viewing Date *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Time Slots Grid */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1.5">
                  Preferred Time Slot *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTimeSlot(slot)}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                        timeSlot === slot
                          ? 'bg-[#0b1329] text-white shadow-sm ring-2 ring-amber-500/40'
                          : 'bg-stone-50 hover:bg-stone-100 text-slate-700 border border-stone-200'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* User details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="e.g. Eleanor Vance"
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                  Special Notes / Accessibility Requests
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional: financing status, specific features to inspect, or party size..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  id="submit-booking-btn"
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#d8a853] hover:bg-[#c9973e] text-slate-950 font-bold text-xs uppercase tracking-wider py-3 rounded-lg flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{loading ? 'Confirming Appointment...' : 'Confirm Private Viewing'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
