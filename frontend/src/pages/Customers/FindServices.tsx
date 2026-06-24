import React, { useState, useEffect } from 'react';
import { Search, Star, MapPin, Briefcase, ChevronRight, Filter, X, Map, List, CheckCircle } from 'lucide-react';
import { apiFetch, API_BASE, getToken } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const FindServices: React.FC = () => {
  const navigate = useNavigate();
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<any>(null);
  const [bookingForm, setBookingForm] = useState({ date: '', time: '', location: '', details: '' });
  const [bookingError, setBookingError] = useState('');
  const [bookingSaving, setBookingSaving] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [filters, setFilters] = useState({
    maxDistance: 10,
    minRating: 0,
    verifiedOnly: false
  });

  const categories = ['All', 'Plumbing', 'Electrical', 'Carpentry', 'Cleaning', 'Painting', 'Landscaping', 'HVAC', 'Appliance Repair'];

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const fetchProfessionals = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/professionals`);
      if (response.ok) {
        const json = await response.json();
        const data = json.data || json;
        setProfessionals(Array.isArray(data) ? data : []);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching professionals:', error);
      setLoading(false);
    }
  };

  const filtered = professionals.filter(p => {
    const matchesSearch = !searchQuery ||
      p.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.service_category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.skills?.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || p.service_category === selectedCategory;
    const matchesRating = (p.rating || 0) >= filters.minRating;
    const matchesVerified = !filters.verifiedOnly || p.verified;
    const matchesDistance = !p.distance || (p.distance || 0) <= filters.maxDistance;
    return matchesSearch && matchesCategory && matchesRating && matchesVerified && matchesDistance;
  });

  const handleRequestBooking = async () => {
    if (!selectedProfessional) return;
    setBookingSaving(true);
    setBookingError('');
    try {
      await apiFetch('/api/bookings', {
        method: 'POST',
        body: JSON.stringify({
          professional_id: selectedProfessional.user_id,
          service: selectedProfessional.service_category,
          date: bookingForm.date,
          time: bookingForm.time,
          location: bookingForm.location || selectedProfessional.location || selectedProfessional.user_location,
          amount: selectedProfessional.hourly_rate || 0,
        }),
      });
      setSelectedProfessional(null);
      setBookingForm({ date: '', time: '', location: '', details: '' });
    } catch (error: any) {
      setBookingError(error.message || 'Could not request booking');
    } finally {
      setBookingSaving(false);
    }
  };

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`} />
    ));

  return (
    <div>
      {/* Sticky Search & Filter Bar */}
      <div className="sticky top-0 bg-white border-b border-slate-200 z-10 p-4 mb-6">
        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search professionals..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium transition-colors ${showFilters ? 'bg-green-600 text-white border-green-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
          </button>
          <div className="flex border border-slate-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 ${viewMode === 'list' ? 'bg-green-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-2.5 ${viewMode === 'map' ? 'bg-green-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
            >
              <Map className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${selectedCategory === cat ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-slate-50 rounded-xl space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Maximum Distance: {filters.maxDistance} km</label>
              <input
                type="range"
                min="1"
                max="50"
                value={filters.maxDistance}
                onChange={e => setFilters({ ...filters, maxDistance: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Minimum Rating: {filters.minRating}+ stars</label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={filters.minRating}
                onChange={e => setFilters({ ...filters, minRating: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="verified"
                checked={filters.verifiedOnly}
                onChange={e => setFilters({ ...filters, verifiedOnly: e.target.checked })}
                className="w-4 h-4 text-green-600 rounded"
              />
              <label htmlFor="verified" className="text-sm text-slate-700">Verified professionals only</label>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-slate-600">Loading professionals...</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No professionals found in your area</h3>
          <p className="text-slate-500 text-sm mb-6">Try adjusting your filters or post a job to the public board</p>
          <button
            onClick={() => navigate('/customer/my_job')}
            className="bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors"
          >
            Post a Job to the Public Board Instead
          </button>
        </div>
      ) : viewMode === 'list' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filtered.map((pro) => (
            <div key={pro.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
              <div className="p-4 sm:p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {(pro.full_name || pro.user?.full_name || 'P').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <h3 className="font-bold text-slate-900 text-base truncate">{pro.full_name || pro.user?.full_name || 'Professional'}</h3>
                      {pro.verified && <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />}
                    </div>
                    <p className="text-green-600 text-xs sm:text-sm font-medium">{pro.service_category}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span className="text-sm font-medium text-slate-900">{pro.rating || '4.8'}</span>
                      <span className="text-xs text-slate-500">({pro.reviews_count || '124'} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-slate-500 text-xs sm:text-sm mb-3">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{pro.distance || '2.5 km away'}</span>
                </div>

                {pro.skills && pro.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {pro.skills.slice(0, 3).map((skill: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs">{skill}</span>
                    ))}
                    {pro.skills.length > 3 && <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full text-xs">+{pro.skills.length - 3}</span>}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-slate-900">KSh {pro.hourly_rate || '0'}</span>
                    <span className="text-slate-500 text-xs sm:text-sm">/hr</span>
                  </div>
                  <button
                    onClick={() => setSelectedProfessional(pro)}
                    className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-100 rounded-xl h-96 flex items-center justify-center">
          <div className="text-center text-slate-500">
            <Map className="w-12 h-12 mx-auto mb-2" />
            <p>Map view coming soon</p>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {selectedProfessional && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Book Service</h3>
              <button onClick={() => setSelectedProfessional(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-3 mb-6 p-3 bg-slate-50 rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                {(selectedProfessional.full_name || 'P').charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-semibold text-slate-900">{selectedProfessional.full_name}</div>
                <div className="text-sm text-green-600">{selectedProfessional.service_category}</div>
              </div>
            </div>
            {bookingError && <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">{bookingError}</div>}
            <div className="space-y-3 mb-6">
              <input type="date" value={bookingForm.date} onChange={e => setBookingForm({ ...bookingForm, date: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              <input type="time" value={bookingForm.time} onChange={e => setBookingForm({ ...bookingForm, time: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              <input type="text" value={bookingForm.location} onChange={e => setBookingForm({ ...bookingForm, location: e.target.value })} placeholder="Service location" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              <textarea value={bookingForm.details} onChange={e => setBookingForm({ ...bookingForm, details: e.target.value })} placeholder="Describe what you need..." rows={3} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setSelectedProfessional(null)} className="flex-1 border border-slate-200 text-slate-700 py-3 rounded-xl font-medium hover:bg-slate-50 transition-colors text-sm">Cancel</button>
              <button onClick={handleRequestBooking} disabled={bookingSaving || !bookingForm.date || !bookingForm.time} className="flex-1 bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-colors text-sm disabled:opacity-50">Request Booking</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindServices;
