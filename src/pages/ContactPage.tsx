import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock, ChevronDown, Building2 } from 'lucide-react';
import { PageHero } from '../components/layout/PageHero';
import { SITE, OFFICES, FAQS } from '../data/site';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interest: 'Buying Luxury House / Villa',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setSubmitted(true);
  };

  return (
    <>
      <PageHero
        crumb="Contact"
        eyebrow="GET IN TOUCH"
        title="Connect with a Senior Private Advisor"
        description="Whether you are acquiring a flagship residence, listing prime acreage or seeking confidential portfolio advice, our team is at your disposal."
        image="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=2000&q=85"
      />

      {/* Contact details + form */}
      <section className="py-20 bg-stone-50 border-b border-stone-200 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div>
            <div className="text-[11px] font-bold tracking-[0.2em] text-amber-700 uppercase mb-2">
              HEADQUARTERS
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-950 font-serif-luxury tracking-tight mb-4">
              We are here to help
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-8">
              Reach us by phone, email or the form, and a designated advisor will respond within two business hours.
            </p>

            <div className="space-y-6">
              {[
                { icon: MapPin, title: 'Headquarters', value: SITE.headquarters },
                { icon: Phone, title: 'Direct Telephone', value: `${SITE.phone} · Toll Free ${SITE.tollFree}` },
                { icon: Mail, title: 'Electronic Mail', value: SITE.email },
                { icon: Clock, title: 'Consultation Hours', value: SITE.hours },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white border border-stone-200 text-amber-600 flex items-center justify-center shrink-0 shadow-xs">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">{item.title}</h4>
                    <p className="text-xs text-slate-600 mt-0.5">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-white border border-stone-200 rounded-xl flex items-center gap-3">
              <Building2 className="w-5 h-5 text-amber-600 shrink-0" />
              <span className="text-[11px] text-slate-600">{SITE.rera}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xl">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold font-serif-luxury text-slate-900">Inquiry Received</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Thank you for contacting Horizon Estates. A designated senior advisor will contact you within 2 business hours.
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
                    placeholder="e.g. Aarav Mehta"
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
                      placeholder="aarav@example.com"
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
                      placeholder="+91 98200 01928"
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
                    <option value="NRI Advisory Services">NRI Advisory Services</option>
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
                    placeholder="Tell us about desired locations, carpet area, budget, or timeframe..."
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
      </section>

      {/* Offices */}
      <section className="py-20 bg-white px-4 sm:px-8 border-b border-stone-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-[11px] font-bold tracking-[0.2em] text-amber-700 uppercase mb-2">
              OUR OFFICES
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-950 font-serif-luxury tracking-tight">
              Visit Us Across India & the Gulf
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {OFFICES.map((office) => (
              <div key={office.city} className="bg-stone-50/70 border border-stone-200/80 rounded-xl p-6">
                <div className="w-10 h-10 rounded-lg bg-[#0b1329] text-white flex items-center justify-center mb-4">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">{office.city}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">{office.address}</p>
                <div className="space-y-1.5 text-xs">
                  <a href={`tel:${office.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 text-slate-700 hover:text-amber-700">
                    <Phone className="w-3.5 h-3.5 text-amber-600" />
                    <span>{office.phone}</span>
                  </a>
                  <a href={`mailto:${office.email}`} className="flex items-center gap-2 text-slate-700 hover:text-amber-700">
                    <Mail className="w-3.5 h-3.5 text-amber-600" />
                    <span>{office.email}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-stone-50 px-4 sm:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-[11px] font-bold tracking-[0.2em] text-amber-700 uppercase mb-2">
              BEFORE YOU CALL
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-950 font-serif-luxury tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={faq.q} className="border border-stone-200 rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="text-sm font-bold text-slate-900">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-amber-600 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-xs text-slate-600 leading-relaxed border-t border-stone-200 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};
