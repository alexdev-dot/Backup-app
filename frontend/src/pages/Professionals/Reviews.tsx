import React, { useState } from 'react';
import { Star, ThumbsUp } from 'lucide-react';

interface Review {
  id: number;
  customer: string;
  service: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

const mockReviews: Review[] = [
  { id: 1, customer: 'Alice Njeri', service: 'Electrical Wiring', rating: 5, comment: 'John did an amazing job! He was professional, on time, and the quality of work was excellent. Will definitely hire again.', date: 'Dec 15, 2024', helpful: 12 },
  { id: 2, customer: 'Bob Kamau', service: 'Plumbing Repair', rating: 4, comment: 'Good work overall. Fixed the problem quickly and cleaned up after himself. Minor issue with punctuality but the work was solid.', date: 'Dec 10, 2024', helpful: 8 },
  { id: 3, customer: 'Carol Otieno', service: 'HVAC Maintenance', rating: 5, comment: 'Excellent service! Very knowledgeable about HVAC systems. Explained everything clearly and gave good advice for maintenance.', date: 'Dec 5, 2024', helpful: 15 },
  { id: 4, customer: 'David Mwangi', service: 'Panel Upgrade', rating: 3, comment: 'The work was done but took longer than expected. Communication could have been better. Result is satisfactory.', date: 'Nov 28, 2024', helpful: 3 },
  { id: 5, customer: 'Eva Wambui', service: 'Outlet Installation', rating: 5, comment: 'Super efficient! Installed 6 outlets in under 2 hours. Very professional and tidy. Highly recommended!', date: 'Nov 20, 2024', helpful: 20 },
];

const Reviews: React.FC = () => {
  const [reviews] = useState<Review[]>(mockReviews);
  const [helpfulClicked, setHelpfulClicked] = useState<Set<number>>(new Set());
  const [filterRating, setFilterRating] = useState(0);

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const ratingCounts = [5, 4, 3, 2, 1].map(r => ({ rating: r, count: reviews.filter(rev => rev.rating === r).length }));

  const filtered = filterRating === 0 ? reviews : reviews.filter(r => r.rating === filterRating);

  const renderStars = (rating: number, size = 'w-4 h-4') =>
    Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`${size} ${i < rating ? 'text-amber-500 fill-amber-500' : 'text-slate-200 fill-slate-200'}`} />
    ));

  const handleHelpful = (id: number) => {
    setHelpfulClicked(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  };

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Reviews</h2>
        <p className="text-slate-600 text-sm sm:text-base">Customer feedback and ratings for your services</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Overall Rating */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col items-center justify-center text-center">
          <div className="text-5xl sm:text-6xl font-bold text-slate-900 mb-2">{avgRating.toFixed(1)}</div>
          <div className="flex gap-1 mb-2">{renderStars(Math.round(avgRating), 'w-5 h-5')}</div>
          <div className="text-sm text-slate-500">{reviews.length} reviews</div>
        </div>

        {/* Rating Breakdown */}
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
                  <div
                    className={`h-full rounded-full transition-all ${filterRating === rating ? 'bg-amber-500' : 'bg-green-500'}`}
                    style={{ width: reviews.length ? `${(count / reviews.length) * 100}%` : '0%' }}
                  />
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

      {/* Reviews List */}
      <div className="space-y-3 sm:space-y-4">
        {filtered.map(review => (
          <div key={review.id} className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {review.customer.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-sm">{review.customer}</div>
                  <div className="text-xs text-slate-500">{review.service}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex gap-0.5 mb-1">{renderStars(review.rating)}</div>
                <div className="text-xs text-slate-400">{review.date}</div>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-3 leading-relaxed">{review.comment}</p>
            <button
              onClick={() => handleHelpful(review.id)}
              className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${helpfulClicked.has(review.id) ? 'text-green-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              Helpful ({review.helpful + (helpfulClicked.has(review.id) ? 1 : 0)})
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
