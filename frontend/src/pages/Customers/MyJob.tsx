import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, Clock, CircleCheck, Timer, Calendar, ChevronRight, X, Star, Plus, FileText, CheckCircle, XCircle } from 'lucide-react';

import { API_BASE, getToken } from '../../utils/api';

const MyJob: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showQuotes, setShowQuotes] = useState<any>(null);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [showApplications, setShowApplications] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    budget: '',
    location: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');


  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/jobs`, {
        headers: { 'Authorization': `Bearer ${getToken()}` },
      });
      if (response.ok) {
        const json = await response.json();
        const data = json.data || json;
        setJobs(Array.isArray(data) ? data : []);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const fetchQuotes = async (jobId: number) => {
    try {
      const response = await fetch(`${API_BASE}/api/jobs/${jobId}/quotes`, {
        headers: { 'Authorization': `Bearer ${getToken()}` },
      });
      if (response.ok) {
        const json = await response.json();
        const data = json.data || json;
        setQuotes(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching quotes:', error);
    }
  };

  const handleQuoteResponse = async (quoteId: number, action: 'accept' | 'reject') => {
    try {
      const response = await fetch(`${API_BASE}/api/quotes/${quoteId}/${action}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${getToken()}` },
      });
      if (response.ok) {
        fetchQuotes(showQuotes.id);
      }
    } catch (error) {
      console.error('Error responding to quote:', error);
    }
  };

  const fetchApplications = async (jobId: number) => {
    try {
      const response = await fetch(`${API_BASE}/api/jobs/${jobId}/applications`, {
        headers: { 'Authorization': `Bearer ${getToken()}` },
      });
      if (response.ok) {
        const json = await response.json();
        const data = json.data || json;
        setApplications(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleHireProfessional = async (applicationId: number) => {
    try {
      const response = await fetch(`${API_BASE}/api/applications/${applicationId}/hire`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${getToken()}` },
      });
      if (response.ok) {
        fetchApplications(showApplications.id);
      }
    } catch (error) {
      console.error('Error hiring professional:', error);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const response = await fetch(`${API_BASE}/api/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify(formData),
      });

      const json = await response.json();

      if (response.ok && json.success) {
        setShowCreateForm(false);
        setFormData({ title: '', description: '', category: '', budget: '', location: '' });
        fetchJobs();
      } else {
        setError(json.message || json.error || 'Failed to create job');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const filters = [
    { id: 'all', label: 'All Jobs' },
    { id: 'active', label: 'Active' },
    { id: 'completed', label: 'Completed' },
    { id: 'draft', label: 'Draft' },
  ];

  const filtered = activeFilter === 'all' ? jobs : jobs.filter(j => j.status === activeFilter);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed': return { color: 'bg-green-100 text-green-700', icon: <CircleCheck className="w-4 h-4" /> };
      case 'active': return { color: 'bg-blue-100 text-blue-700', icon: <Timer className="w-4 h-4" /> };
      case 'draft': return { color: 'bg-slate-100 text-slate-700', icon: <FileText className="w-4 h-4" /> };
      default: return { color: 'bg-slate-100 text-slate-700', icon: null };
    }
  };

  return (
    <div>
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">My Jobs</h2>
          <p className="text-slate-600 text-sm sm:text-base">Track and manage all your service requests</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors text-sm sm:text-base"
        >
          <Plus className="w-4 sm:w-5 h-4 sm:h-5" />
          <span>Post New Job</span>
        </button>
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

      {loading ? (
        <div className="text-center py-16 text-slate-600">Loading jobs...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No jobs found</h3>
          <p className="text-slate-500 text-sm">You don't have any {activeFilter !== 'all' ? activeFilter : ''} jobs yet.</p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {filtered.map((job) => {
            const statusConfig = getStatusConfig(job.status);
            return (
              <div key={job.id} className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 p-4 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0">
                      <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base">{job.title}</h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${statusConfig.color}`}>
                          {statusConfig.icon}
                          {job.status?.charAt(0).toUpperCase() + job.status?.slice(1)}
                        </span>
                      </div>
                      <p className="text-slate-600 text-xs sm:text-sm mb-2 line-clamp-2">{job.description}</p>
                      <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-slate-900">{job.budget}</span>
                          <span>Budget</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-slate-900">{job.proposals_count || 0}</span>
                          <span>Proposals</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                  <div>
                    <span className="text-xs text-slate-500">Posted {new Date(job.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-2">
                    {job.proposals_count > 0 && (
                      <button
                        onClick={() => {
                          setShowQuotes(job);
                          fetchQuotes(job.id);
                        }}
                        className="flex items-center gap-1.5 text-amber-600 hover:text-amber-700 text-xs sm:text-sm font-medium transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        View Quotes ({job.proposals_count})
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setShowApplications(job);
                        fetchApplications(job.id);
                      }}
                      className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium transition-colors"
                    >
                      <Briefcase className="w-4 h-4" />
                      View Applications
                    </button>
                    <button
                      onClick={() => setSelectedJob(job)}
                      className="flex items-center gap-1.5 text-green-600 hover:text-green-700 text-xs sm:text-sm font-medium transition-colors"
                    >
                      View Details
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Job Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl p-6 w-full sm:max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">Post New Job</h3>
              <button onClick={() => setShowCreateForm(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateJob} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Job Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Need a plumber for kitchen sink repair"
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select a category</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Carpentry">Carpentry</option>
                  <option value="Painting">Painting</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Gardening">Gardening</option>
                  <option value="Moving">Moving</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the job in detail..."
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Budget</label>
                <input
                  type="text"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  placeholder="e.g., KSh 5,000 - 10,000"
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Nairobi, Westlands"
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Posting...' : 'Post Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Job Detail Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl p-6 w-full sm:max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">Job Details</h3>
              <button onClick={() => setSelectedJob(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{selectedJob.title}</div>
                    <div className="text-sm text-slate-500">{selectedJob.category}</div>
                  </div>
                </div>
                <p className="text-sm text-slate-700">{selectedJob.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-xs text-slate-500 mb-1">Status</div>
                  <div className="font-semibold text-slate-900 capitalize">{selectedJob.status}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-xs text-slate-500 mb-1">Budget</div>
                  <div className="font-semibold text-slate-900">{selectedJob.budget}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-xs text-slate-500 mb-1">Location</div>
                  <div className="font-semibold text-slate-900">{selectedJob.location}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-xs text-slate-500 mb-1">Proposals</div>
                  <div className="font-semibold text-slate-900">{selectedJob.proposals_count || 0}</div>
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="text-xs text-slate-500 mb-1">Posted</div>
                <div className="font-semibold text-slate-900">{new Date(selectedJob.created_at).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quotes Modal */}
      {showQuotes && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl p-6 w-full sm:max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">Quotes for {showQuotes.title}</h3>
              <button onClick={() => setShowQuotes(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            {quotes.length === 0 ? (
              <div className="text-center py-8 text-slate-600">No quotes received yet</div>
            ) : (
              <div className="space-y-4">
                {quotes.map((quote) => (
                  <div key={quote.id} className="bg-slate-50 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                          {(quote.professional_name || 'P').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{quote.professional_name}</div>
                          <div className="text-xs text-slate-500">{quote.service_category}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900">{quote.amount}</div>
                        <div className="text-xs text-slate-500">Quote</div>
                      </div>
                    </div>
                    {quote.note && (
                      <div className="text-sm text-slate-600 mb-3 bg-white p-3 rounded-lg">
                        {quote.note}
                      </div>
                    )}
                    <div className="flex gap-2">
                      {quote.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleQuoteResponse(quote.id, 'reject')}
                            className="flex-1 px-3 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                          >
                            <XCircle className="w-4 h-4" /> Reject
                          </button>
                          <button
                            onClick={() => handleQuoteResponse(quote.id, 'accept')}
                            className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                          >
                            <CheckCircle className="w-4 h-4" /> Accept
                          </button>
                        </>
                      )}
                      {quote.status === 'accepted' && (
                        <div className="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium text-center">
                          ✓ Accepted
                        </div>
                      )}
                      {quote.status === 'rejected' && (
                        <div className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium text-center">
                          ✗ Rejected
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Applications Modal */}
      {showApplications && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl p-6 w-full sm:max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">Applications for {showApplications.title}</h3>
              <button onClick={() => setShowApplications(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            {applications.length === 0 ? (
              <div className="text-center py-8 text-slate-600">No applications received yet</div>
            ) : (
              <div className="space-y-4">
                {applications.map((application) => (
                  <div key={application.id} className="bg-slate-50 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                          {(application.professional_name || 'P').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{application.professional_name}</div>
                          <div className="text-xs text-slate-500">{application.category}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star className="w-4 h-4 fill-amber-500" />
                          <span className="font-semibold text-slate-900">{application.rating || 'N/A'}</span>
                        </div>
                        <div className="text-xs text-slate-500">Rating</div>
                      </div>
                    </div>
                    {application.cover_letter && (
                      <div className="text-sm text-slate-600 mb-3 bg-white p-3 rounded-lg">
                        {application.cover_letter}
                      </div>
                    )}
                    <div className="flex gap-2">
                      {application.status === 'pending' && (
                        <button
                          onClick={() => handleHireProfessional(application.id)}
                          className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                        >
                          <CheckCircle className="w-4 h-4" /> Hire Professional
                        </button>
                      )}
                      {application.status === 'accepted' && (
                        <div className="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium text-center">
                          ✓ Hired
                        </div>
                      )}
                      {application.status === 'rejected' && (
                        <div className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium text-center">
                          ✗ Rejected
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyJob;
