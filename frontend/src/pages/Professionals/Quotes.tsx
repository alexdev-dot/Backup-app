import React, { useState } from 'react';
import { FileText, Clock, CircleCheck, X, Send, ChevronRight } from 'lucide-react';

interface Quote {
  id: number;
  service: string;
  customer: string;
  location: string;
  description: string;
  budget: string;
  status: 'pending' | 'sent' | 'accepted' | 'declined';
  date: string;
}

const mockQuotes: Quote[] = [
  { id: 1, service: 'Electrical Wiring', customer: 'Alice Njeri', location: 'Westlands, Nairobi', description: 'Need to rewire 3 rooms and install new outlets.', budget: 'KSh 8,000 - 12,000', status: 'pending', date: 'Dec 18, 2024' },
  { id: 2, service: 'Plumbing Repair', customer: 'Bob Kamau', location: 'Karen, Nairobi', description: 'Kitchen sink leaking and needs replacement.', budget: 'KSh 3,000 - 5,000', status: 'sent', date: 'Dec 17, 2024' },
  { id: 3, service: 'HVAC Maintenance', customer: 'Carol Otieno', location: 'Kilimani, Nairobi', description: 'Annual AC service and filter replacement.', budget: 'KSh 5,000 - 7,000', status: 'accepted', date: 'Dec 15, 2024' },
  { id: 4, service: 'House Wiring', customer: 'David Mwangi', location: 'Parklands, Nairobi', description: 'New house needs full electrical installation.', budget: 'KSh 25,000 - 40,000', status: 'declined', date: 'Dec 12, 2024' },
];

const Quotes: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>(mockQuotes);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [quoteAmount, setQuoteAmount] = useState('');
  const [quoteNote, setQuoteNote] = useState('');

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'sent', label: 'Sent' },
    { id: 'accepted', label: 'Accepted' },
    { id: 'declined', label: 'Declined' },
  ];

  const filtered = activeFilter === 'all' ? quotes : quotes.filter(q => q.status === activeFilter);

  const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
    pending: { color: 'bg-yellow-100 text-yellow-700', icon: <Clock className="w-3.5 h-3.5" /> },
    sent: { color: 'bg-blue-100 text-blue-700', icon: <Send className="w-3.5 h-3.5" /> },
    accepted: { color: 'bg-green-100 text-green-700', icon: <CircleCheck className="w-3.5 h-3.5" /> },
    declined: { color: 'bg-red-100 text-red-700', icon: <X className="w-3.5 h-3.5" /> },
  };

  const handleSendQuote = (quoteId: number) => {
    setQuotes(prev => prev.map(q => q.id === quoteId ? { ...q, status: 'sent' } : q));
    setSelectedQuote(null);
    setQuoteAmount('');
    setQuoteNote('');
  };

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Quotes</h2>
        <p className="text-slate-600 text-sm sm:text-base">Respond to service requests and send quotes</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        {filters.filter(f => f.id !== 'all').map(f => {
          const sc = statusConfig[f.id];
          return (
            <div key={f.id} className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-slate-900">{quotes.filter(q => q.status === f.id).length}</div>
              <div className="text-xs sm:text-sm text-slate-500">{f.label}</div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 sm:mb-6 scrollbar-hide">
        {filters.map(f => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${activeFilter === f.id ? 'bg-green-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No quotes found</h3>
          <p className="text-slate-500 text-sm">No {activeFilter !== 'all' ? activeFilter : ''} quote requests.</p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {filtered.map((quote) => {
            const sc = statusConfig[quote.status];
            return (
              <div key={quote.id} className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {quote.customer.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base">{quote.service}</h3>
                      <p className="text-xs sm:text-sm text-slate-600">{quote.customer} · {quote.location}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${sc.color}`}>
                    {sc.icon}{quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-3 bg-slate-50 p-3 rounded-lg">{quote.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-500">Budget</div>
                    <div className="font-semibold text-slate-900 text-sm">{quote.budget}</div>
                  </div>
                  <div className="flex gap-2">
                    {quote.status === 'pending' && (
                      <button
                        onClick={() => setSelectedQuote(quote)}
                        className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-green-700 transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" /> Send Quote
                      </button>
                    )}
                    {quote.status !== 'pending' && (
                      <button className="flex items-center gap-1 text-green-600 hover:text-green-700 text-xs sm:text-sm font-medium">
                        View Details <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Send Quote Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl p-6 w-full sm:max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Send Quote</h3>
              <button onClick={() => setSelectedQuote(null)} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="mb-4 p-3 bg-slate-50 rounded-xl">
              <div className="font-semibold text-slate-900 text-sm">{selectedQuote.service}</div>
              <div className="text-xs text-slate-500">{selectedQuote.customer}</div>
              <div className="text-xs text-green-600 mt-1">Budget: {selectedQuote.budget}</div>
            </div>
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Your Quote Amount (KSh)</label>
                <input
                  type="number"
                  value={quoteAmount}
                  onChange={e => setQuoteAmount(e.target.value)}
                  placeholder="e.g. 8500"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Additional Notes</label>
                <textarea
                  value={quoteNote}
                  onChange={e => setQuoteNote(e.target.value)}
                  placeholder="Any additional details, timeline, etc."
                  rows={3}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setSelectedQuote(null)} className="flex-1 border border-slate-200 text-slate-700 py-2.5 rounded-xl font-medium hover:bg-slate-50 text-sm">Cancel</button>
              <button
                onClick={() => handleSendQuote(selectedQuote.id)}
                disabled={!quoteAmount}
                className="flex-1 bg-green-600 text-white py-2.5 rounded-xl font-medium hover:bg-green-700 text-sm disabled:opacity-50"
              >
                Send Quote
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quotes;
