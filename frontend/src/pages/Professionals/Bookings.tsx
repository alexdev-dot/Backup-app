import React, { useState, useEffect } from 'react';
import { CalendarDays, MapPin, Clock, CircleCheck, Timer, X, Search, ChevronDown, Play, CheckCircle, DollarSign, Camera, Upload } from 'lucide-react';
import { API_BASE, getToken } from '../../utils/api';

const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [actionModal, setActionModal] = useState<{ type: string; booking: any } | null>(null);
  const [completionModal, setCompletionModal] = useState<any>(null);
  const [completionPhotos, setCompletionPhotos] = useState<File[]>([]);
  const [completionNotes, setCompletionNotes] = useState('');
  const [uploadingCompletion, setUploadingCompletion] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/bookings`, {
        headers: { 'Authorization': `Bearer ${getToken()}` },
      });
      if (response.ok) {
        const json = await response.json();
        const data = json.data || json;
        setBookings(Array.isArray(data) ? data : []);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const filtered = bookings.filter(b => {
    const matchesSearch = !search ||
      b.service?.toLowerCase().includes(search.toLowerCase()) ||
      b.customer_name?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    scheduled: 'bg-blue-100 text-blue-700 border-blue-200',
    in_progress: 'bg-purple-100 text-purple-700 border-purple-200',
    completed: 'bg-green-100 text-green-700 border-green-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200',
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CircleCheck className="w-3.5 h-3.5" />;
      case 'pending': return <Timer className="w-3.5 h-3.5" />;
      case 'scheduled': return <CalendarDays className="w-3.5 h-3.5" />;
      case 'in_progress': return <Play className="w-3.5 h-3.5" />;
      default: return <Clock className="w-3.5 h-3.5" />;
    }
  };

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    scheduled: bookings.filter(b => b.status === 'scheduled').length,
    in_progress: bookings.filter(b => b.status === 'in_progress').length,
    completed: bookings.filter(b => b.status === 'completed').length,
  };

  const updateBookingStatus = async (bookingId: number, newStatus: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
        setActionModal(null);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleCompletionConfirmation = async () => {
    if (!completionModal) return;
    setUploadingCompletion(true);
    try {
      const formData = new FormData();
      formData.append('booking_id', completionModal.id);
      formData.append('notes', completionNotes);
      completionPhotos.forEach((photo, index) => {
        formData.append(`photo_${index}`, photo);
      });

      const response = await fetch(`${API_BASE}/api/bookings/${completionModal.id}/complete`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${getToken()}` },
        body: formData,
      });
      if (response.ok) {
        setCompletionModal(null);
        setCompletionPhotos([]);
        setCompletionNotes('');
        fetchBookings();
      }
    } catch (error) {
      console.error('Error submitting completion:', error);
    } finally {
      setUploadingCompletion(false);
    }
  };

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">My Bookings</h2>
        <p className="text-slate-600 text-sm sm:text-base">Manage all your service bookings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-6">
        {[
          { label: 'Total', value: stats.total, color: 'text-slate-900' },
          { label: 'Pending', value: stats.pending, color: 'text-yellow-600' },
          { label: 'Scheduled', value: stats.scheduled, color: 'text-blue-600' },
          { label: 'In Progress', value: stats.in_progress, color: 'text-purple-600' },
          { label: 'Completed', value: stats.completed, color: 'text-green-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 text-center">
            <div className={`text-xl sm:text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs sm:text-sm text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3 mb-4 sm:mb-6">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search bookings..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-white"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="appearance-none bg-white border border-slate-200 rounded-xl px-3 py-2.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
          >
            {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-600">Loading bookings...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <CalendarDays className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No bookings found</h3>
          <p className="text-slate-500 text-sm">You don't have any bookings matching your search.</p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {filtered.map((booking) => (
            <div key={booking.id} className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {(booking.customer_name || 'C').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base">{booking.service}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap ${statusColors[booking.status] || 'bg-slate-100 text-slate-700'}`}>
                        {getStatusIcon(booking.status)}
                        {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)?.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm mb-2">{booking.customer_name}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                      {booking.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{booking.location}</span>
                        </div>
                      )}
                      {booking.date && (
                        <div className="flex items-center gap-1">
                          <CalendarDays className="w-3.5 h-3.5" />
                          <span>{booking.date} {booking.time && `at ${booking.time}`}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 gap-3">
                <div className="font-bold text-slate-900 text-sm sm:text-base">{booking.amount || 'TBD'}</div>
                <div className="flex gap-2">
                  {booking.status === 'pending' && (
                    <>
                      <button
                        onClick={() => setActionModal({ type: 'reject', booking })}
                        className="px-3 py-1.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-xs sm:text-sm font-medium"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => setActionModal({ type: 'accept', booking })}
                        className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs sm:text-sm font-medium"
                      >
                        Accept
                      </button>
                    </>
                  )}
                  {booking.status === 'scheduled' && (
                    <button
                      onClick={() => setActionModal({ type: 'start', booking })}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm font-medium flex items-center gap-1"
                    >
                      <Play className="w-3.5 h-3.5" /> Start Work
                    </button>
                  )}
                  {booking.status === 'in_progress' && (
                    <button
                      onClick={() => setCompletionModal(booking)}
                      className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs sm:text-sm font-medium flex items-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Complete Work
                    </button>
                  )}
                  {booking.status === 'completed' && (
                    <button
                      onClick={() => setActionModal({ type: 'payment', booking })}
                      className="px-3 py-1.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-xs sm:text-sm font-medium flex items-center gap-1"
                    >
                      <DollarSign className="w-3.5 h-3.5" /> Request Payment
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="px-3 py-1.5 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-xs sm:text-sm font-medium"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Modal */}
      {actionModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {actionModal.type === 'accept' && 'Accept Booking'}
              {actionModal.type === 'reject' && 'Reject Booking'}
              {actionModal.type === 'start' && 'Start Work'}
              {actionModal.type === 'complete' && 'Complete Work'}
              {actionModal.type === 'payment' && 'Request Payment'}
            </h3>
            <p className="text-slate-600 text-sm mb-6">
              {actionModal.type === 'accept' && `Accept booking for ${actionModal.booking.service}?`}
              {actionModal.type === 'reject' && `Reject booking for ${actionModal.booking.service}?`}
              {actionModal.type === 'start' && `Start work for ${actionModal.booking.service}?`}
              {actionModal.type === 'complete' && `Mark ${actionModal.booking.service} as completed?`}
              {actionModal.type === 'payment' && `Request payment for ${actionModal.booking.service}?`}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setActionModal(null)} className="flex-1 border border-slate-200 text-slate-700 py-2.5 rounded-xl font-medium hover:bg-slate-50 text-sm">Cancel</button>
              <button
                onClick={() => {
                  const statusMap: Record<string, string> = {
                    accept: 'scheduled',
                    reject: 'cancelled',
                    start: 'in_progress',
                    complete: 'completed',
                    payment: 'payment_requested',
                  };
                  updateBookingStatus(actionModal.booking.id, statusMap[actionModal.type]);
                }}
                className={`flex-1 py-2.5 rounded-xl font-medium text-sm ${
                  actionModal.type === 'reject' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {actionModal.type === 'accept' && 'Accept'}
                {actionModal.type === 'reject' && 'Reject'}
                {actionModal.type === 'start' && 'Start'}
                {actionModal.type === 'complete' && 'Complete'}
                {actionModal.type === 'payment' && 'Request'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Booking Details</h3>
              <button onClick={() => setSelectedBooking(null)} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="text-xs text-slate-500 mb-1">Service</div>
                <div className="font-semibold text-slate-900">{selectedBooking.service}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-xs text-slate-500 mb-1">Customer</div>
                  <div className="font-semibold text-slate-900">{selectedBooking.customer_name}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-xs text-slate-500 mb-1">Amount</div>
                  <div className="font-semibold text-slate-900">{selectedBooking.amount}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-xs text-slate-500 mb-1">Date</div>
                  <div className="font-semibold text-slate-900">{selectedBooking.date}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-xs text-slate-500 mb-1">Time</div>
                  <div className="font-semibold text-slate-900">{selectedBooking.time}</div>
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="text-xs text-slate-500 mb-1">Location</div>
                <div className="font-semibold text-slate-900">{selectedBooking.location}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="text-xs text-slate-500 mb-1">Status</div>
                <div className="font-semibold text-slate-900 capitalize">{selectedBooking.status?.replace('_', ' ')}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Completion Confirmation Modal */}
      {completionModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Confirm Work Completion</h3>
              <button onClick={() => setCompletionModal(null)} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="text-xs text-slate-500 mb-1">Service</div>
                <div className="font-semibold text-slate-900">{completionModal.service}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Completion Notes</label>
                <textarea
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  placeholder="Describe the work completed..."
                  rows={3}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Upload Photos (Optional)</label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setCompletionPhotos(Array.from(e.target.files || []))}
                    className="hidden"
                    id="completion-photos"
                  />
                  <label htmlFor="completion-photos" className="cursor-pointer">
                    <Camera className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-600">Click to upload photos</p>
                    <p className="text-xs text-slate-400">{completionPhotos.length} files selected</p>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setCompletionModal(null)} className="flex-1 border border-slate-200 text-slate-700 py-2.5 rounded-xl font-medium hover:bg-slate-50 text-sm">Cancel</button>
                <button
                  onClick={handleCompletionConfirmation}
                  disabled={uploadingCompletion}
                  className="flex-1 bg-green-600 text-white py-2.5 rounded-xl font-medium hover:bg-green-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadingCompletion ? 'Submitting...' : 'Submit Completion'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
