import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interest: 'Buying Luxury Property',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setSubmitted(true);
  };

  return (
    <section id="contact-section" className="py-20 bg-stone-50 border-b border-stone-200 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column: Direct Info */}
          <div>
            <div className="text-[11px] font-bold tracking-[0.2em] text-amber-700 uppercase mb-2">
              GET IN TOUCH
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-950 font-serif-luxury tracking-tight mb-4">
              Connect with a Senior Private Advisor
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-8">
              Whether you are acquiring a flagship architectural residence, listing prime acreage, or seeking confidential portfolio advisory, our team is at your disposal.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white border border-stone-200 text-amber-600 flex items-center justify-center shrink-0 shadow-xs">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Headquarters</h4>
                  <p className="text-xs text-slate-600 mt-0.5">123 Skyline Avenue, New York, NY 10001, United States</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white border border-stone-200 text-amber-600 flex items-center justify-center shrink-0 shadow-xs">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Direct Telephone</h4>
                  <p className="text-xs text-slate-600 mt-0.5">+1 (212) 555-7890 (Toll Free 24/7)</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white border border-stone-200 text-amber-600 flex items-center justify-center shrink-0 shadow-xs">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Electronic Mail</h4>
                  <p className="text-xs text-slate-600 mt-0.5">advisory@horizonestates.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white border border-stone-200 text-amber-600 flex items-center justify-center shrink-0 shadow-xs">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Consultation Hours</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Monday - Sunday: 8:00 AM – 9:00 PM EST</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xl">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold font-serif-luxury text-slate-900">Inquiry Received</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Thank you for contacting Horizon Estates. A designated senior luxury advisor will contact you within 2 business hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-5 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 font-serif-luxury mb-2">
                  Request Private Consultation
                </h3>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Jonathan Vance"
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jonathan@example.com"
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 019-2834"
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                    Primary Area of Interest
                  </label>
                  <select
                    value={formData.interest}
                    onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                  >
                    <option value="Buying Luxury House / Villa">Buying Luxury House / Villa</option>
                    <option value="Acquiring Penthouse Apartment">Acquiring Penthouse Apartment</option>
                    <option value="Purchasing Land / Development Plot">Purchasing Land / Development Plot</option>
                    <option value="Listing Property for Sale">Listing Property for Sale</option>
                    <option value="Commercial Real Estate Investment">Commercial Real Estate Investment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                    Message / Specifications
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about desired locations, square footage, budget, or timeframe..."
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0b1329] hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-lg flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-amber-400" />
                  <span>Send Advisory Request</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
