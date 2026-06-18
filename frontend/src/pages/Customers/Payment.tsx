import React, { useEffect, useMemo, useState } from 'react';
import { Wallet, CreditCard, Phone, ArrowUpRight, ArrowDownLeft, Clock, CircleCheck, ChevronRight } from 'lucide-react';
import { apiList, formatCurrency, formatDate } from '../../utils/api';

const Payment: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'methods'>('overview');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPayments = async () => {
      setLoading(true);
      try {
        const [txs, methods] = await Promise.all([
          apiList('/api/payments/transactions', 'transactions'),
          apiList('/api/payments/methods', 'methods'),
        ]);
        setTransactions(txs);
        setPaymentMethods(methods);
      } finally {
        setLoading(false);
      }
    };
    loadPayments();
  }, []);

  const stats = useMemo(() => {
    const spent = transactions.filter(t => Number(t.amount) < 0).reduce((sum, t) => sum + Math.abs(Number(t.amount || 0)), 0);
    const refunds = transactions.filter(t => Number(t.amount) > 0).reduce((sum, t) => sum + Number(t.amount || 0), 0);
    const pending = transactions.filter(t => t.status === 'pending').reduce((sum, t) => sum + Math.abs(Number(t.amount || 0)), 0);
    return { balance: refunds - spent, spent, refunds, pending };
  }, [transactions]);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'history', label: 'Transactions' },
    { id: 'methods', label: 'Methods' },
  ];

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Payment</h2>
        <p className="text-slate-600 text-sm sm:text-base">Manage your payments and transaction history</p>
      </div>

      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-6 sm:p-8 text-white mb-6 sm:mb-8 shadow-lg">
        <div className="flex items-start justify-between mb-4 sm:mb-6">
          <div>
            <p className="text-green-100 text-sm mb-1">Wallet Balance</p>
            <h3 className="text-3xl sm:text-4xl font-bold">{formatCurrency(stats.balance)}</h3>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Wallet className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex-1 bg-white text-green-600 py-2.5 rounded-xl font-semibold text-sm hover:bg-green-50 transition-colors">
            Add Money
          </button>
          <button className="flex-1 bg-white/20 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-white/30 transition-colors">
            Withdraw
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-4 sm:mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {[
            { label: 'Total Spent', value: formatCurrency(stats.spent), icon: <ArrowUpRight className="w-5 h-5 text-red-500" />, bg: 'bg-red-50' },
            { label: 'Total Refunds', value: formatCurrency(stats.refunds), icon: <ArrowDownLeft className="w-5 h-5 text-green-500" />, bg: 'bg-green-50' },
            { label: 'Pending', value: formatCurrency(stats.pending), icon: <Clock className="w-5 h-5 text-amber-500" />, bg: 'bg-amber-50' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 p-4 sm:p-6">
              <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>{stat.icon}</div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900">{stat.value}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-3">
          {loading ? <div className="text-center py-10 text-slate-600">Loading transactions...</div> : transactions.length === 0 ? <div className="text-center py-10 text-slate-600">No transactions yet</div> : transactions.map(tx => (
            <div key={tx.id} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${Number(tx.amount) > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                {Number(tx.amount) > 0 ? <ArrowDownLeft className="w-5 h-5 text-green-600" /> : <ArrowUpRight className="w-5 h-5 text-red-600" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-slate-900 text-sm truncate">{tx.description || tx.method || 'Transaction'}</div>
                <div className="text-xs text-slate-500">{formatDate(tx.date || tx.created_at)}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className={`font-bold text-sm ${Number(tx.amount) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Number(tx.amount) > 0 ? '+' : ''}{formatCurrency(Math.abs(Number(tx.amount || 0)))}
                </div>
                <div className={`text-xs flex items-center justify-end gap-1 ${tx.status === 'completed' ? 'text-green-500' : 'text-amber-500'}`}>
                  {tx.status === 'completed' ? <CircleCheck className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                  {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'methods' && (
        <div className="space-y-3">
          {loading ? <div className="text-center py-10 text-slate-600">Loading payment methods...</div> : paymentMethods.length === 0 ? <div className="text-center py-10 text-slate-600">No payment methods yet</div> : paymentMethods.map(method => (
            <div key={method.id} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${method.type === 'mpesa' ? 'bg-green-100' : 'bg-blue-100'}`}>
                {method.type === 'mpesa' ? <Phone className="w-5 h-5 text-green-600" /> : <CreditCard className="w-5 h-5 text-blue-600" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-900 text-sm">{method.type?.toUpperCase() || 'Payment Method'}</div>
                <div className="text-xs text-slate-500">{method.number}</div>
              </div>
              {method.is_default && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Default</span>
              )}
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          ))}
          <button className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-200 rounded-xl text-sm text-slate-500 hover:border-green-400 hover:text-green-600 transition-colors">
            + Add Payment Method
          </button>
        </div>
      )}
    </div>
  );
};

export default Payment;
