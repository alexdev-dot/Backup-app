import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, Clock, CircleCheck, Timer, Calendar, ChevronRight, X, Star } from 'lucide-react';

import { API_BASE, getToken } from '../../utils/api';

const MyJob: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedJob, setSelectedJob] = useState<any>(null);


  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/bookings`, {
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

  const filters = [
    { id: 'all', label: 'All Jobs' },
    { id: 'pending', label: 'Pending' },
    { id: 'scheduled', label: 'Scheduled' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
  ];

  const filtered = activeFilter === 'all' ? jobs : jobs.filter(j => j.status === activeFilter);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed': return { color: 'bg-green-100 text-green-700', icon: <CircleCheck className="w-4 h-4" /> };
      case 'pending': return { color: 'bg-yellow-100 text-yellow-700', icon: <Timer className="w-4 h-4" /> };
      case 'scheduled': return { color: 'bg-blue-100 text-blue-700', icon: <Calendar className="w-4 h-4" /> };
      case 'in_progress': return { color: 'bg-purple-100 text-purple-700', icon: <Clock className="w-4 h-4" /> };
      default: return { color: 'bg-slate-100 text-slate-700', icon: null };
    }
  };

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">My Jobs</h2>
        <p className="text-slate-600 text-sm sm:text-base">Track and manage all your service requests</p>
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
                      {(job.professional_name || 'P').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base">{job.service}</h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${statusConfig.color}`}>
                          {statusConfig.icon}
                          {job.status?.charAt(0).toUpperCase() + job.status?.slice(1)}
                        </span>
                      </div>
                      <p className="text-slate-600 text-xs sm:text-sm mb-2">{job.professional_name}</p>
                      <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                        {job.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{job.location}</span>
                          </div>
                        )}
                        {job.date && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{job.date} {job.time && `at ${job.time}`}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                  <div>
                    <span className="font-bold text-slate-900 text-sm sm:text-base">{job.amount || 'TBD'}</span>
                    {job.amount && <span className="text-slate-500 text-xs ml-1">Total</span>}
                  </div>
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="flex items-center gap-1.5 text-green-600 hover:text-green-700 text-xs sm:text-sm font-medium transition-colors"
                  >
                    View Details
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
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
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                  {(selectedJob.professional_name || 'P').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-slate-900">{selectedJob.service}</div>
                  <div className="text-sm text-slate-500">{selectedJob.professional_name}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-xs text-slate-500 mb-1">Status</div>
                  <div className="font-semibold text-slate-900 capitalize">{selectedJob.status}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-xs text-slate-500 mb-1">Amount</div>
                  <div className="font-semibold text-slate-900">{selectedJob.amount || 'TBD'}</div>
                </div>
                {selectedJob.date && (
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <div className="text-xs text-slate-500 mb-1">Date</div>
                    <div className="font-semibold text-slate-900">{selectedJob.date}</div>
                  </div>
                )}
                {selectedJob.time && (
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <div className="text-xs text-slate-500 mb-1">Time</div>
                    <div className="font-semibold text-slate-900">{selectedJob.time}</div>
                  </div>
                )}
              </div>
              {selectedJob.description && (
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-xs text-slate-500 mb-1">Description</div>
                  <div className="text-sm text-slate-700">{selectedJob.description}</div>
                </div>
              )}
            </div>
            {selectedJob.status === 'completed' && (
              <div className="mt-6">
                <div className="text-sm font-medium text-slate-700 mb-2">Rate this service</div>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(star => (
                    <button key={star} className="p-1">
                      <Star className="w-7 h-7 text-slate-300 hover:text-amber-500 hover:fill-amber-500 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyJob;
