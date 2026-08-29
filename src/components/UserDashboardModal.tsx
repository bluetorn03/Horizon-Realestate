import React, { useState, useEffect } from 'react';
import { 
  X, 
  Home, 
  Calendar, 
  Layers, 
  Heart, 
  Edit, 
  Trash2, 
  Plus, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  Eye, 
  User, 
  Phone, 
  Mail,
  Building
} from 'lucide-react';
import type { Property, Viewing } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  fetchUserViewings, 
  fetchOwnerViewings, 
  updateViewingStatus, 
  deleteViewing 
} from '../lib/firebase';

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
  const [activeTab, setActiveTab] = useState<'listings' | 'viewings' | 'inquiries' | 'favorites'>(initialTab);
  
  const [myViewings, setMyViewings] = useState<Viewing[]>([]);
  const [ownerInquiries, setOwnerInquiries] = useState<Viewing[]>([]);
  const [loadingViewings, setLoadingViewings] = useState(false);

  const myListedProperties = properties.filter((p) => user && p.ownerId === user.uid);
  const favoriteProperties = properties.filter((p) => favorites.includes(p.id));

  const loadViewingsData = async () => {
    if (!user) return;
    setLoadingViewings(true);
    try {
      const [userBookings, receivedInquiries] = await Promise.all([
        fetchUserViewings(user.uid),
        fetchOwnerViewings(user.uid),
      ]);
      setMyViewings(userBookings);
      setOwnerInquiries(receivedInquiries);
    } catch (err) {
      console.error('Error fetching viewings:', err);
    } finally {
      setLoadingViewings(false);
    }
  };

  useEffect(() => {
    loadViewingsData();
  }, [user]);

  const handleUpdateStatus = async (viewingId: string, newStatus: Viewing['status']) => {
    try {
      await updateViewingStatus(viewingId, newStatus);
      setOwnerInquiries((prev) =>
        prev.map((v) => (v.id === viewingId ? { ...v, status: newStatus } : v))
      );
      setMyViewings((prev) =>
        prev.map((v) => (v.id === viewingId ? { ...v, status: newStatus } : v))
      );
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleCancelBooking = async (viewingId: string) => {
    if (window.confirm('Are you sure you want to cancel this viewing appointment?')) {
      try {
        await deleteViewing(viewingId);
        setMyViewings((prev) => prev.filter((v) => v.id !== viewingId));
      } catch (err) {
        console.error('Error cancelling viewing:', err);
      }
    }
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        id="user-dashboard-modal-container"
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col border border-stone-200 animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-sm">
              {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-serif-luxury">
                Member Portal
              </h3>
              <p className="text-[11px] text-slate-500">{user.email}</p>
            </div>
          </div>
          <button
            id="dashboard-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-200 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-200 bg-stone-100/60 px-4 sm:px-6 overflow-x-auto">
          <button
            id="tab-my-listings"
            onClick={() => setActiveTab('listings')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
              activeTab === 'listings'
                ? 'border-amber-600 text-amber-800 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Home className="w-4 h-4 text-amber-600" />
            <span>My Listed Properties ({myListedProperties.length})</span>
          </button>

          <button
            id="tab-my-viewings"
            onClick={() => setActiveTab('viewings')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
              activeTab === 'viewings'
                ? 'border-amber-600 text-amber-800 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4 text-amber-600" />
            <span>My Booked Viewings ({myViewings.length})</span>
          </button>

          <button
            id="tab-my-inquiries"
            onClick={() => setActiveTab('inquiries')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
              activeTab === 'inquiries'
                ? 'border-amber-600 text-amber-800 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4 text-amber-600" />
            <span>Received Inquiries ({ownerInquiries.length})</span>
          </button>

          <button
            id="tab-my-favorites"
            onClick={() => setActiveTab('favorites')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
              activeTab === 'favorites'
                ? 'border-amber-600 text-amber-800 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-500" />
            <span>Saved Favorites ({favoriteProperties.length})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-4 sm:p-6 flex-1 bg-stone-50/40">
          {/* 1. MY LISTED PROPERTIES */}
          {activeTab === 'listings' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Your Property Listings</h4>
                  <p className="text-xs text-slate-500">Manage, edit details, or remove your properties.</p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenAddProperty();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>List Another Property</span>
                </button>
              </div>

              {myListedProperties.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-stone-200 p-6">
                  <Building className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-700">You have not listed any properties yet.</p>
                  <p className="text-[11px] text-slate-500 mt-1">List your luxury house, apartment, or land parcel to reach high-net-worth buyers.</p>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAddProperty();
                    }}
                    className="mt-4 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800"
                  >
                    List Your First Property
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {myListedProperties.map((prop) => (
                    <div
                      key={prop.id}
                      className="bg-white rounded-xl p-4 border border-stone-200 shadow-xs flex flex-col justify-between"
                    >
                      <div className="flex gap-3">
                        <img
                          src={prop.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80'}
                          alt={prop.title}
                          className="w-20 h-20 rounded-lg object-cover border shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                            {prop.category} • {prop.listingType}
                          </span>
                          <h5 className="text-xs font-bold text-slate-900 truncate mt-1">{prop.title}</h5>
                          <p className="text-[11px] text-slate-500 truncate">{prop.location}</p>
                          <p className="text-xs font-bold text-amber-800 mt-1">
                            ${prop.price.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                        <button
                          onClick={() => {
                            onClose();
                            onSelectProperty(prop);
                          }}
                          className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              onClose();
                              onEditProperty(prop);
                            }}
                            className="text-xs font-semibold text-amber-800 hover:text-amber-900 bg-amber-50 px-2.5 py-1 rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onDeleteProperty(prop)}
                            className="text-xs font-semibold text-rose-700 hover:text-rose-800 bg-rose-50 px-2.5 py-1 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 2. MY BOOKED VIEWINGS */}
          {activeTab === 'viewings' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Your Scheduled Private Viewings</h4>
                <p className="text-xs text-slate-500">Appointments you requested on available properties.</p>
              </div>

              {loadingViewings ? (
                <div className="text-center py-10 text-xs text-slate-500">Loading your viewings...</div>
              ) : myViewings.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-stone-200 p-6">
                  <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-700">No scheduled viewing appointments.</p>
                  <p className="text-[11px] text-slate-500 mt-1">Browse our exclusive properties and click "Book Viewing" on any details page.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {myViewings.map((viewing) => (
                    <div
                      key={viewing.id}
                      className="bg-white rounded-xl p-4 border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5">
                        <img
                          src={viewing.propertyImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80'}
                          alt={viewing.propertyTitle}
                          className="w-16 h-16 rounded-lg object-cover border shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h5 className="text-xs font-bold text-slate-900">{viewing.propertyTitle}</h5>
                          <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                            <MapPin className="w-3 h-3 text-amber-600" />
                            <span>{viewing.propertyLocation}</span>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs">
                            <span className="font-semibold text-slate-800">📅 {viewing.date}</span>
                            <span className="font-semibold text-slate-800">⏰ {viewing.timeSlot}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded ${
                            viewing.status === 'confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : viewing.status === 'completed'
                              ? 'bg-blue-100 text-blue-800'
                              : viewing.status === 'cancelled'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {viewing.status}
                        </span>

                        {viewing.status !== 'cancelled' && (
                          <button
                            onClick={() => handleCancelBooking(viewing.id)}
                            className="text-xs text-rose-600 hover:text-rose-800 font-semibold px-2 py-1 hover:bg-rose-50 rounded"
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

          {/* 3. RECEIVED INQUIRIES */}
          {activeTab === 'inquiries' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Viewing Inquiries on Your Listings</h4>
                <p className="text-xs text-slate-500">Prospective buyers requesting walkthroughs on properties you listed.</p>
              </div>

              {loadingViewings ? (
                <div className="text-center py-10 text-xs text-slate-500">Loading inquiries...</div>
              ) : ownerInquiries.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-stone-200 p-6">
                  <Layers className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-700">No viewing requests received yet.</p>
                  <p className="text-[11px] text-slate-500 mt-1">When buyers schedule viewings on your listed properties, they will appear here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {ownerInquiries.map((inquiry) => (
                    <div
                      key={inquiry.id}
                      className="bg-white rounded-xl p-4 border border-stone-200 shadow-xs space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-stone-100">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-amber-700">Property:</span>
                          <h5 className="text-xs font-bold text-slate-900">{inquiry.propertyTitle}</h5>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-700">Appointment: {inquiry.date} at {inquiry.timeSlot}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 bg-stone-50 p-3 rounded-lg">
                        <div>
                          <span className="font-semibold text-slate-900">Client:</span> {inquiry.userName}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">Email:</span> {inquiry.userEmail}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">Phone:</span> {inquiry.userPhone}
                        </div>
                        {inquiry.notes && (
                          <div className="sm:col-span-2">
                            <span className="font-semibold text-slate-900">Notes:</span> {inquiry.notes}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded ${
                            inquiry.status === 'confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : inquiry.status === 'completed'
                              ? 'bg-blue-100 text-blue-800'
                              : inquiry.status === 'cancelled'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          Status: {inquiry.status}
                        </span>

                        <div className="flex items-center gap-2">
                          {inquiry.status === 'pending' && (
                            <button
                              onClick={() => handleUpdateStatus(inquiry.id, 'confirmed')}
                              className="text-xs font-semibold px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Confirm Appointment</span>
                            </button>
                          )}
                          {inquiry.status === 'confirmed' && (
                            <button
                              onClick={() => handleUpdateStatus(inquiry.id, 'completed')}
                              className="text-xs font-semibold px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                            >
                              Mark Completed
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

          {/* 4. SAVED FAVORITES */}
          {activeTab === 'favorites' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Your Saved Properties</h4>
                <p className="text-xs text-slate-500">Shortlisted homes and plots for quick reference.</p>
              </div>

              {favoriteProperties.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-stone-200 p-6">
                  <Heart className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-700">No properties in your favorites list.</p>
                  <p className="text-[11px] text-slate-500 mt-1">Click the heart icon on any property card to save it here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {favoriteProperties.map((prop) => (
                    <div
                      key={prop.id}
                      className="bg-white rounded-xl p-4 border border-stone-200 shadow-xs flex flex-col justify-between"
                    >
                      <div className="flex gap-3">
                        <img
                          src={prop.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80'}
                          alt={prop.title}
                          className="w-20 h-20 rounded-lg object-cover border shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 flex-1">
                          <h5 className="text-xs font-bold text-slate-900 truncate">{prop.title}</h5>
                          <p className="text-[11px] text-slate-500 truncate">{prop.location}</p>
                          <p className="text-xs font-bold text-amber-800 mt-1">
                            ${prop.price.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                        <button
                          onClick={() => {
                            onClose();
                            onSelectProperty(prop);
                          }}
                          className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Details</span>
                        </button>
                        <button
                          onClick={() => onToggleFavorite(prop.id)}
                          className="text-xs font-semibold text-rose-600 hover:text-rose-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
