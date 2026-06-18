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
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'scheduled', label: 'Scheduled' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
  ];

  const filtered = activeFilter === 'all' ? jobs : jobs.filter(j => j.status === activeFilter);

  const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
    completed: { color: 'bg-green-100 text-green-700', icon: <CircleCheck className="w-3.5 h-3.5" /> },
    pending: { color: 'bg-yellow-100 text-yellow-700', icon: <Timer className="w-3.5 h-3.5" /> },
    scheduled: { color: 'bg-blue-100 text-blue-700', icon: <Calendar className="w-3.5 h-3.5" /> },
    in_progress: { color: 'bg-purple-100 text-purple-700', icon: <Clock className="w-3.5 h-3.5" /> },
  };

  const getStatusConfig = (status: string) => statusConfig[status] || { color: 'bg-slate-100 text-slate-700', icon: null };

  const handleStatusUpdate = async (jobId: number, newStatus: string) => {
    try {
      await fetch(`${API_BASE}/api/bookings/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify({ status: newStatus }),
      });
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: newStatus } : j));
      setSelectedJob(null);
    } catch (error) { console.error('Error updating job:', error); }
  };

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Jobs</h2>
        <p className="text-slate-600 text-sm sm:text-base">View and manage all your assigned jobs</p>
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
                    {(job.customer_name || job.service || 'J').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base">{job.service}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${sc.color}`}>
                        {sc.icon}{job.status?.charAt(0).toUpperCase() + job.status?.slice(1)}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 mb-2">{job.customer_name || 'Customer'}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                      {job.location && <div className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /><span>{job.location}</span></div>}
                      {job.date && <div className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /><span>{job.date}{job.time && ` at ${job.time}`}</span></div>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                  <div className="font-bold text-slate-900 text-sm sm:text-base">{job.amount || 'TBD'}</div>
                  <button onClick={() => setSelectedJob(job)} className="flex items-center gap-1 text-green-600 hover:text-green-700 text-xs sm:text-sm font-medium">
                    Manage <ChevronRight className="w-4 h-4" />
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
              <h3 className="text-lg font-bold text-slate-900">Manage Job</h3>
              <button onClick={() => setSelectedJob(null)} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="mb-4 p-3 bg-slate-50 rounded-xl">
              <div className="font-semibold text-slate-900">{selectedJob.service}</div>
              <div className="text-sm text-slate-500">{selectedJob.customer_name || 'Customer'}</div>
              <div className="text-sm text-slate-500 mt-1">{selectedJob.date}{selectedJob.time && ` at ${selectedJob.time}`}</div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="text-sm font-medium text-slate-700 mb-2">Update Status</div>
              {['scheduled', 'in_progress', 'completed'].map(status => (
                <button
                  key={status}
                  onClick={() => handleStatusUpdate(selectedJob.id, status)}
                  disabled={selectedJob.status === status}
                  className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors ${selectedJob.status === status ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
                >
                  Mark as {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
                </button>
              ))}
            </div>
            <button onClick={() => setSelectedJob(null)} className="w-full border border-slate-200 text-slate-700 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;
