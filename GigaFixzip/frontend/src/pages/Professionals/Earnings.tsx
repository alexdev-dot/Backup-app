import React, { useState } from 'react';
import { Coins, ArrowUpRight, CircleCheck, Clock, TrendingUp, Calendar } from 'lucide-react';

const Earnings: React.FC = () => {
  const [activePeriod, setActivePeriod] = useState<'week' | 'month' | 'year'>('month');

  const transactions = [
    { id: 1, service: 'Electrical Wiring', customer: 'Alice Njeri', date: 'Dec 18, 2024', amount: 8500, status: 'completed' },
    { id: 2, service: 'Plumbing Repair', customer: 'Bob Kamau', date: 'Dec 15, 2024', amount: 3500, status: 'completed' },
    { id: 3, service: 'HVAC Maintenance', customer: 'Carol Otieno', date: 'Dec 12, 2024', amount: 6000, status: 'completed' },
    { id: 4, service: 'Panel Upgrade', customer: 'David Mwangi', date: 'Dec 10, 2024', amount: 15000, status: 'pending' },
    { id: 5, service: 'Outlet Installation', customer: 'Eva Wambui', date: 'Dec 8, 2024', amount: 2500, status: 'completed' },
  ];

  const periodData = {
    week: { total: 'KSh 12,000', jobs: 3, avg: 'KSh 4,000' },
    month: { total: 'KSh 35,500', jobs: 5, avg: 'KSh 7,100' },
    year: { total: 'KSh 345,000', jobs: 48, avg: 'KSh 7,187' },
  };

  const current = periodData[activePeriod];

  const barHeights = [40, 65, 50, 80, 70, 90, 75];
  const barDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Earnings</h2>
        <p className="text-slate-600 text-sm sm:text-base">Track your income and payment history</p>
      </div>

      {/* Period Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-4 sm:mb-6 w-fit">
        {(['week', 'month', 'year'] as const).map(period => (
          <button
            key={period}
            onClick={() => setActivePeriod(period)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${activePeriod === period ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            {period === 'week' ? 'This Week' : period === 'month' ? 'This Month' : 'This Year'}
          </button>
        ))}
      </div>

      {/* Main Earnings Card */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-6 sm:p-8 text-white mb-4 sm:mb-6 shadow-lg">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-green-100 text-sm mb-1">Total Earned</p>
            <h3 className="text-3xl sm:text-4xl font-bold">{current.total}</h3>
            <p className="text-green-100 text-sm mt-2 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" /> +12% from last {activePeriod}
            </p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Coins className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Bar Chart */}
        <div>
          <p className="text-green-100 text-xs mb-3">Revenue trend</p>
          <div className="flex items-end gap-2 h-16">
            {barHeights.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-sm bg-white/30 hover:bg-white/50 transition-colors cursor-pointer"
                  style={{ height: `${h}%` }}
                />
                <span className="text-green-200 text-xs">{barDays[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        {[
          { label: 'Total Jobs', value: current.jobs.toString(), icon: <Calendar className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-50' },
          { label: 'Average per Job', value: current.avg, icon: <ArrowUpRight className="w-5 h-5 text-green-600" />, bg: 'bg-green-50' },
          { label: 'Completion Rate', value: '95%', icon: <CircleCheck className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 p-4 sm:p-5">
            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>{stat.icon}</div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900">{stat.value}</div>
            <div className="text-sm text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm">
        <div className="p-4 sm:p-6 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-900">Transaction History</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {transactions.map(tx => (
            <div key={tx.id} className="p-4 sm:p-5 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${tx.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'}`}>
                {tx.status === 'completed' ? <CircleCheck className="w-5 h-5 text-green-600" /> : <Clock className="w-5 h-5 text-yellow-600" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-slate-900 text-sm">{tx.service}</div>
                <div className="text-xs text-slate-500">{tx.customer} · {tx.date}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-bold text-slate-900 text-sm">+KSh {tx.amount.toLocaleString()}</div>
                <div className={`text-xs ${tx.status === 'completed' ? 'text-green-500' : 'text-yellow-500'}`}>
                  {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Earnings;
