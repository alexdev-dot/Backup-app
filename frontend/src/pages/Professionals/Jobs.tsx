import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, Calendar, Clock, CircleCheck, Timer, ChevronRight, X } from 'lucide-react';

import { API_BASE, getToken } from '../../utils/api';

const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedJob, setSelectedJob] = useState<any>(null);


  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/jobs/public`, {
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
    { id: 'active', label: 'Active' },
    { id: 'completed', label: 'Completed' },
  ];

  const filtered = activeFilter === 'all' ? jobs : jobs.filter(j => j.status === activeFilter);

  const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
    completed: { color: 'bg-green-100 text-green-700', icon: <CircleCheck className="w-3.5 h-3.5" /> },
    active: { color: 'bg-blue-100 text-blue-700', icon: <Timer className="w-3.5 h-3.5" /> },
  };

  const getStatusConfig = (status: string) => statusConfig[status] || { color: 'bg-slate-100 text-slate-700', icon: null };

  const handleApplyToJob = async (jobId: number) => {
    try {
      const response = await fetch(`${API_BASE}/api/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${getToken()}` },
      });
      if (response.ok) {
        alert('Application submitted successfully!');
        setSelectedJob(null);
      } else {
        const json = await response.json();
        alert(json.message || json.error || 'Failed to apply');
      }
    } catch (error) {
      console.error('Error applying to job:', error);
      alert('Network error. Please try again.');
    }
  };

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Available Jobs</h2>
        <p className="text-slate-600 text-sm sm:text-base">Browse and apply to jobs posted by customers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        {filters.filter(f => f.id !== 'all').map(f => (
          <div key={f.id} className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-slate-900">{jobs.filter(j => j.status === f.id).length}</div>
            <div className="text-xs sm:text-sm text-slate-500 capitalize">{f.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 sm:mb-6 scrollbar-hide">
        {filters.map(f => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${activeFilter === f.id ? 'bg-green-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
          >
            {f.label} {f.id !== 'all' && `(${jobs.filter(j => j.status === f.id).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-600">Loading jobs...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No jobs found</h3>
          <p className="text-slate-500 text-sm">No {activeFilter !== 'all' ? activeFilter : ''} jobs at the moment.</p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {filtered.map((job) => {
            const sc = getStatusConfig(job.status);
            return (
              <div key={job.id} className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 hover:shadow-md transition-all">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base">{job.title}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${sc.color}`}>
                        {sc.icon}{job.status?.charAt(0).toUpperCase() + job.status?.slice(1)}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 mb-2 line-clamp-2">{job.description}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                      <div className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /><span>{job.location}</span></div>
                      <div className="flex items-center gap-1"><span className="font-semibold text-slate-900">{job.budget}</span><span>Budget</span></div>
                      <div className="flex items-center gap-1"><span className="font-semibold text-slate-900">{job.proposals_count || 0}</span><span>Proposals</span></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                  <div className="text-xs text-slate-500">Posted {new Date(job.created_at).toLocaleDateString()}</div>
                  <button onClick={() => setSelectedJob(job)} className="flex items-center gap-1 text-green-600 hover:text-green-700 text-xs sm:text-sm font-medium">
                    View Details <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Job Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl p-6 w-full sm:max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Job Details</h3>
              <button onClick={() => setSelectedJob(null)} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="mb-4 p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">{selectedJob.title}</div>
                  <div className="text-sm text-slate-500">{selectedJob.category}</div>
                </div>
              </div>
              <p className="text-sm text-slate-700 mb-3">{selectedJob.description}</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-slate-500">Budget:</span> <span className="font-semibold text-slate-900">{selectedJob.budget}</span></div>
                <div><span className="text-slate-500">Location:</span> <span className="font-semibold text-slate-900">{selectedJob.location}</span></div>
              </div>
            </div>
            <button
              onClick={() => handleApplyToJob(selectedJob.id)}
              className="w-full bg-green-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
            >
              Apply for this Job
            </button>
            <button onClick={() => setSelectedJob(null)} className="w-full border border-slate-200 text-slate-700 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50 mt-2">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;
