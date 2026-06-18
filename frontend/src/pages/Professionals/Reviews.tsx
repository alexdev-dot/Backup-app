import React, { useEffect, useMemo, useState } from 'react';
import { Star, ThumbsUp } from 'lucide-react';
import { apiFetch, formatDate } from '../../utils/api';

interface Review {
  id: number;
  customer_name?: string;
  service?: string;
  rating: number;
  comment?: string;
  created_at?: string;
}

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [helpfulClicked, setHelpfulClicked] = useState<Set<number>>(new Set());
  const [filterRating, setFilterRating] = useState(0);

  useEffect(() => {
    const loadReviews = async () => {
      setLoading(true);
      try {
        const profile = await apiFetch('/api/professionals/me');
        const professional = profile?.professional || profile;
        if (!professional?.id) {
          setReviews([]);
          return;
        }
        const data = await apiFetch(`/api/professionals/${professional.id}/reviews`);
        setReviews(Array.isArray(data?.reviews) ? data.reviews : []);
      } finally {
        setLoading(false);
      }
    };
    loadReviews();
  }, []);

  const avgRating = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
  const ratingCounts = [5, 4, 3, 2, 1].map(r => ({ rating: r, count: reviews.filter(rev => rev.rating === r).length }));
  const filtered = filterRating === 0 ? reviews : reviews.filter(r => r.rating === filterRating);

  const renderStars = (rating: number, size = 'w-4 h-4') =>
    Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`${size} ${i < rating ? 'text-amber-500 fill-amber-500' : 'text-slate-200 fill-slate-200'}`} />
    ));

  const handleHelpful = (id: number) => {
    setHelpfulClicked(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  };

  const initials = (name: string) => name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Reviews</h2>
        <p className="text-slate-600 text-sm sm:text-base">Customer feedback and ratings for your services</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col items-center justify-center text-center">
          <div className="text-5xl sm:text-6xl font-bold text-slate-900 mb-2">{avgRating.toFixed(1)}</div>
          <div className="flex gap-1 mb-2">{renderStars(Math.round(avgRating), 'w-5 h-5')}</div>
          <div className="text-sm text-slate-500">{reviews.length} reviews</div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6">
          <h3 className="font-bold text-slate-900 mb-4">Rating Breakdown</h3>
          <div className="space-y-2.5">
            {ratingCounts.map(({ rating, count }) => (
              <button
                key={rating}
                onClick={() => setFilterRating(filterRating === rating ? 0 : rating)}
                className={`w-full flex items-center gap-3 group ${filterRating === rating ? 'opacity-100' : 'hover:opacity-80'}`}
              >
                <div className="flex items-center gap-1 w-16 flex-shrink-0">
                  <span className="text-sm text-slate-600">{rating}</span>
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                </div>
                <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${filterRating === rating ? 'bg-amber-500' : 'bg-green-500'}`} style={{ width: reviews.length ? `${(count / reviews.length) * 100}%` : '0%' }} />
                </div>
                <div className="w-8 text-right text-sm text-slate-500 flex-shrink-0">{count}</div>
              </button>
            ))}
          </div>
          {filterRating !== 0 && (
            <button onClick={() => setFilterRating(0)} className="mt-3 text-xs text-green-600 hover:text-green-700 font-medium">
              Clear filter
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-600">Loading reviews...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-600">No reviews found</div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {filtered.map(review => {
            const customer = review.customer_name || 'Customer';
            return (
              <div key={review.id} className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {initials(customer)}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 text-sm">{customer}</div>
                      <div className="text-xs text-slate-500">{review.service || 'Service review'}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex gap-0.5 mb-1">{renderStars(review.rating)}</div>
                    <div className="text-xs text-slate-400">{formatDate(review.created_at)}</div>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-3 leading-relaxed">{review.comment || 'No comment provided.'}</p>
                <button
                  onClick={() => handleHelpful(review.id)}
                  className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${helpfulClicked.has(review.id) ? 'text-green-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  Helpful ({helpfulClicked.has(review.id) ? 1 : 0})
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Reviews;
