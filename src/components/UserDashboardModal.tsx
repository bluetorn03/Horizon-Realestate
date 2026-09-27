import React, { useState, useEffect } from 'react';
import {
  Home,
  Calendar,
  Layers,
  Heart,
  Plus,
  Clock,
  CheckCircle2,
  MapPin,
  User,
  Phone,
  Mail,
  Building2,
  XCircle,
} from 'lucide-react';
import type { Property, Viewing } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  fetchUserViewings,
  fetchOwnerViewings,
  updateViewingStatus,
  deleteViewing,
} from '../lib/firebase';
import { Modal, ModalHeader } from './Modal';
import { MagneticButton } from './MagneticButton';
import { PropertyRow } from './PropertyCard';
import { formatPrice } from '../lib/format';

interface UserDashboardModalProps {
  initialTab?: 'listings' | 'viewings' | 'inquiries' | 'favorites';
  properties: Property[];
  favorites: string[];
  onClose: () => void;
  onSelectProperty: (property: Property) => void;
  onEditProperty: (property: Property) => void;
  onDeleteProperty: (property: Property) => void;
  onOpenAddProperty: () => void;
  onToggleFavorite: (propertyId: string) => void;
}

const STATUS_STYLES: Record<Viewing['status'], string> = {
  pending: 'bg-gold-100 text-gold-800',
  confirmed: 'bg-emerald-100 text-emerald-800',
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-rose-100 text-rose-800',
};

export const UserDashboardModal: React.FC<UserDashboardModalProps> = ({
  initialTab = 'listings',
  properties,
  favorites,
  onClose,
  onSelectProperty,
  onEditProperty,
  onDeleteProperty,
  onOpenAddProperty,
  onToggleFavorite,
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'listings' | 'viewings' | 'inquiries' | 'favorites'>(
    initialTab,
  );
  const [myViewings, setMyViewings] = useState<Viewing[]>([]);
  const [ownerInquiries, setOwnerInquiries] = useState<Viewing[]>([]);
  const [loadingViewings, setLoadingViewings] = useState(false);

  const myListedProperties = properties.filter((property) => user && property.ownerId === user.uid);
  const favoriteProperties = properties.filter((property) => favorites.includes(property.id));

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    const load = async () => {
      setLoadingViewings(true);
      try {
        const [bookings, inquiries] = await Promise.all([
          fetchUserViewings(user.uid),
          fetchOwnerViewings(user.uid),
        ]);
        if (cancelled) return;
        setMyViewings(bookings);
        setOwnerInquiries(inquiries);
      } catch (error) {
        console.error('Error loading viewing data:', error);
      } finally {
        if (!cancelled) setLoadingViewings(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const handleUpdateStatus = async (viewingId: string, status: Viewing['status']) => {
    try {
      await updateViewingStatus(viewingId, status);
      const patch = (viewing: Viewing) =>
        viewing.id === viewingId ? { ...viewing, status } : viewing;
      setOwnerInquiries((current) => current.map(patch));
      setMyViewings((current) => current.map(patch));
    } catch (error) {
      console.error('Error updating viewing status:', error);
    }
  };

  const handleCancelBooking = async (viewingId: string) => {
    if (!window.confirm('Cancel this viewing appointment?')) return;
    try {
      await deleteViewing(viewingId);
      setMyViewings((current) => current.filter((viewing) => viewing.id !== viewingId));
    } catch (error) {
      console.error('Error cancelling viewing:', error);
    }
  };

  if (!user) return null;

  const tabs = [
    { id: 'listings' as const, label: 'My Listings', icon: Home, count: myListedProperties.length },
    { id: 'viewings' as const, label: 'My Viewings', icon: Calendar, count: myViewings.length },
    { id: 'inquiries' as const, label: 'Inquiries', icon: Layers, count: ownerInquiries.length },
    { id: 'favorites' as const, label: 'Shortlist', icon: Heart, count: favoriteProperties.length },
  ];

  const EmptyState: React.FC<{
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    copy: string;
    cta?: { label: string; onClick: () => void };
  }> = ({ icon: Icon, title, copy, cta }) => (
    <div className="rounded-xl border border-bone-200 bg-white p-8 text-center">
      <Icon className="mx-auto mb-3 h-9 w-9 text-bone-300" />
      <p className="text-sm font-bold text-ink-900">{title}</p>
      <p className="mx-auto mt-1.5 max-w-sm text-xs leading-relaxed text-bone-500">{copy}</p>
      {cta ? (
        <div className="mt-5">
          <MagneticButton variant="ink" size="sm" onClick={cta.onClick}>
            <Plus className="h-3.5 w-3.5" />
            {cta.label}
          </MagneticButton>
        </div>
      ) : null}
    </div>
  );

  return (
    <Modal onClose={onClose} size="xl" id="user-dashboard-modal-container" showCloseButton={false}>
      titleId="dashboard-title"
      <ModalHeader
        tone="ink"
        icon={Building2}
        title="Member Portal"
        titleId="dashboard-title"
        subtitle={user.email || 'Horizon Estates member'}
      >
        <div className="flex items-center gap-3">
          <span className="hidden text-right text-[11px] text-bone-400 sm:block">
            {user.displayName || 'Member'}
          </span>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gold-500 font-bold text-ink-950">
            {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
          </span>
          <button
            type="button"
            id="dashboard-close-btn"
            onClick={onClose}
            aria-label="Close dashboard"
            className="grid h-9 w-9 place-items-center rounded-full text-bone-400 transition-colors hover:bg-white/10 hover:text-bone-50"
          >
            ✕
          </button>
        </div>
      </ModalHeader>

      {/* Tabs */}
      <div className="scrollbar-none flex overflow-x-auto border-b border-bone-200 bg-bone-100/50 px-4 sm:px-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              id={`tab-my-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              aria-current={isActive}
              className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3.5 text-[11px] font-bold uppercase tracking-[0.14em] transition-all ${
                isActive
                  ? 'border-gold-500 bg-white text-gold-800'
                  : 'border-transparent text-bone-500 hover:text-ink-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label} ({tab.count})
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto bg-bone-100/40 p-4 sm:p-6">
        {/* Listings */}
        {activeTab === 'listings' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-ink-950">Your property listings</h4>
                <p className="text-xs text-bone-500">
                  Manage pricing, areas and viewing availability for each residence.
                </p>
              </div>
              <MagneticButton
                variant="gold"
                size="sm"
                onClick={() => {
                  onClose();
                  onOpenAddProperty();
                }}
              >
                <Plus className="h-3.5 w-3.5" />
                List Another
              </MagneticButton>
            </div>

            {myListedProperties.length === 0 ? (
              <EmptyState
                icon={Building2}
                title="You have not listed a property yet"
                copy="Publish a house, apartment, villa, plot or office to reach pre-qualified buyers and tenants."
                cta={{
                  label: 'List Your First Property',
                  onClick: () => {
                    onClose();
                    onOpenAddProperty();
                  },
                }}
              />
            ) : (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {myListedProperties.map((property) => (
                  <div key={property.id} className="space-y-2">
                    <PropertyRow
                      property={property}
                      onSelect={(item) => {
                        onClose();
                        onSelectProperty(item);
                      }}
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onEditProperty(property);
                        }}
                        className="rounded-md bg-gold-50 px-3 py-1.5 text-[11px] font-bold text-gold-800 transition-colors hover:bg-gold-100"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteProperty(property)}
                        className="rounded-md bg-rose-50 px-3 py-1.5 text-[11px] font-bold text-rose-700 transition-colors hover:bg-rose-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* My viewings */}
        {activeTab === 'viewings' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-bold text-ink-950">Your scheduled viewings</h4>
              <p className="text-xs text-bone-500">
                Appointments you have requested on available residences.
              </p>
            </div>

            {loadingViewings ? (
              <p className="py-10 text-center text-xs text-bone-500">Loading your viewings…</p>
            ) : myViewings.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="No viewings scheduled yet"
                copy="Open any residence and choose “Book Viewing” to reserve a private visit with an advisor."
              />
            ) : (
              <div className="space-y-3">
                {myViewings.map((viewing) => (
                  <div
                    key={viewing.id}
                    className="flex flex-col items-start justify-between gap-4 rounded-xl border border-bone-200 bg-white p-4 shadow-lux-sm sm:flex-row sm:items-center"
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={viewing.propertyImage}
                        alt=""
                        width={64}
                        height={64}
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        className="h-16 w-16 shrink-0 rounded-lg border border-bone-200 object-cover"
                      />
                      <div>
                        <h5 className="text-xs font-bold text-ink-950">{viewing.propertyTitle}</h5>
                        <div className="mt-0.5 flex items-center gap-1 text-[11px] text-bone-500">
                          <MapPin className="h-3 w-3 shrink-0 text-gold-500" />
                          {viewing.propertyLocation}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] font-semibold text-ink-800">
                          <span>{viewing.date}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-bone-400" />
                            {viewing.timeSlot}
                          </span>
                          <span className="text-gold-600">
                            {formatPrice(viewing.propertyPrice, 'sale')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end">
                      <span
                        className={`rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[viewing.status]}`}
                      >
                        {viewing.status}
                      </span>
                      {viewing.status !== 'cancelled' && (
                        <button
                          type="button"
                          onClick={() => handleCancelBooking(viewing.id)}
                          className="text-[11px] font-bold text-rose-600 transition-colors hover:text-rose-800"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Inquiries received */}
        {activeTab === 'inquiries' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-bold text-ink-950">Viewing inquiries on your listings</h4>
              <p className="text-xs text-bone-500">
                Prospective buyers requesting walkthroughs of residences you have listed.
              </p>
            </div>

            {loadingViewings ? (
              <p className="py-10 text-center text-xs text-bone-500">Loading inquiries…</p>
            ) : ownerInquiries.length === 0 ? (
              <EmptyState
                icon={Layers}
                title="No viewing requests received yet"
                copy="When buyers schedule viewings on your listings, their requests will appear here for confirmation."
              />
            ) : (
              <div className="space-y-3">
                {ownerInquiries.map((inquiry) => (
                  <div
                    key={inquiry.id}
                    className="space-y-3 rounded-xl border border-bone-200 bg-white p-4 shadow-lux-sm"
                  >
                    <div className="flex flex-col items-start justify-between gap-2 border-b border-bone-100 pb-3 sm:flex-row sm:items-center">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gold-700">
                          Property
                        </span>
                        <h5 className="text-xs font-bold text-ink-950">{inquiry.propertyTitle}</h5>
                      </div>
                      <span className="text-[11px] font-bold text-ink-700">
                        {inquiry.date} · {inquiry.timeSlot}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-2 rounded-lg bg-bone-100/60 p-3 text-xs text-ink-600 sm:grid-cols-2">
                      <p className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-bone-400" />
                        <span className="font-bold text-ink-900">Client:</span> {inquiry.userName}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-bone-400" />
                        <span className="font-bold text-ink-900">Email:</span> {inquiry.userEmail}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-bone-400" />
                        <span className="font-bold text-ink-900">Phone:</span>{' '}
                        {inquiry.userPhone || 'Not shared'}
                      </p>
                      {inquiry.notes ? (
                        <p className="sm:col-span-2">
                          <span className="font-bold text-ink-900">Notes:</span> {inquiry.notes}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span
                        className={`rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[inquiry.status]}`}
                      >
                        {inquiry.status}
                      </span>
                      <div className="flex items-center gap-2">
                        {inquiry.status === 'pending' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(inquiry.id, 'confirmed')}
                            className="flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-emerald-700"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Confirm
                          </button>
                        )}
                        {inquiry.status === 'confirmed' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(inquiry.id, 'completed')}
                            className="rounded-md bg-blue-600 px-3 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-blue-700"
                          >
                            Mark Completed
                          </button>
                        )}
                        {inquiry.status !== 'cancelled' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(inquiry.id, 'cancelled')}
                            className="flex items-center gap-1.5 rounded-md bg-rose-50 px-3 py-1.5 text-[11px] font-bold text-rose-700 transition-colors hover:bg-rose-100"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            Decline
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Shortlist */}
        {activeTab === 'favorites' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-bold text-ink-950">Your shortlisted residences</h4>
              <p className="text-xs text-bone-500">
                Saved homes and plots for quick reference and comparison.
              </p>
            </div>

            {favoriteProperties.length === 0 ? (
              <EmptyState
                icon={Heart}
                title="Your shortlist is empty"
                copy="Tap the heart icon on any residence card to save it here for later."
              />
            ) : (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {favoriteProperties.map((property) => (
                  <PropertyRow
                    key={property.id}
                    property={property}
                    onSelect={(item) => {
                      onClose();
                      onSelectProperty(item);
                    }}
                    onToggleFavorite={onToggleFavorite}
                    actionLabel="Remove"
                    onAction={(item) => onToggleFavorite(item.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
