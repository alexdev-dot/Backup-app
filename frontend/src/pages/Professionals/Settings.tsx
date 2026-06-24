import React, { useState } from 'react';
import { Lock, Bell, Shield, ChevronRight, Eye, EyeOff, CreditCard } from 'lucide-react';

import { API_BASE, getToken } from '../../utils/api';

const ProfessionalSettings: React.FC = () => {
  const [activeSection, setActiveSection] = useState('security');
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [notifications, setNotifications] = useState({ email: true, push: true, sms: true, newJob: true, payment: true });

  const sections = [
    { id: 'security', label: 'Security', icon: <Lock className="w-5 h-5" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
    { id: 'payout', label: 'Payout', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'privacy', label: 'Privacy', icon: <Shield className="w-5 h-5" /> },
  ];

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Settings</h2>
        <p className="text-slate-600 text-sm sm:text-base">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 p-2">
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`w-full flex items-center justify-between gap-3 px-3 py-3 rounded-xl text-sm transition-colors ${activeSection === s.id ? 'bg-green-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-3">
                  {s.icon}
                  <span className="font-medium">{s.label}</span>
                </div>
                <ChevronRight className={`w-4 h-4 ${activeSection === s.id ? 'text-white' : 'text-slate-400'}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 p-4 sm:p-6">
            {activeSection === 'security' && (
              <>
                <h3 className="text-lg font-bold text-slate-900 mb-4 sm:mb-6">Security</h3>
                <div className="space-y-4 mb-6">
                  {([
                    { key: 'current', label: 'Current Password' },
                    { key: 'new', label: 'New Password' },
                    { key: 'confirm', label: 'Confirm New Password' },
                  ] as { key: keyof typeof showPasswords; label: string }[]).map(field => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">{field.label}</label>
                      <div className="relative">
                        <input
                          type={showPasswords[field.key] ? 'text' : 'password'}
                          value={passwords[field.key]}
                          onChange={e => setPasswords(prev => ({ ...prev, [field.key]: e.target.value }))}
                          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="••••••••"
                        />
                        <button type="button" onClick={() => setShowPasswords(prev => ({ ...prev, [field.key]: !prev[field.key] }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                          {showPasswords[field.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="bg-green-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-green-700 text-sm">Update Password</button>
              </>
            )}

            {activeSection === 'notifications' && (
              <>
                <h3 className="text-lg font-bold text-slate-900 mb-4 sm:mb-6">Notifications</h3>
                <div className="space-y-3">
                  {[
                    { key: 'email', label: 'Email Notifications', desc: 'Receive booking and update emails' },
                    { key: 'push', label: 'Push Notifications', desc: 'Get real-time alerts on your device' },
                    { key: 'sms', label: 'SMS Notifications', desc: 'Receive text message alerts' },
                    { key: 'newJob', label: 'New Job Alerts', desc: 'Get notified about new job requests' },
                    { key: 'payment', label: 'Payment Notifications', desc: 'Get notified about payment updates' },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div>
                        <div className="font-medium text-slate-900 text-sm">{item.label}</div>
                        <div className="text-xs text-slate-500">{item.desc}</div>
                      </div>
                      <button
                        onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                        className={`relative w-11 h-6 rounded-full transition-colors ${notifications[item.key as keyof typeof notifications] ? 'bg-green-600' : 'bg-slate-200'}`}
                      >
                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notifications[item.key as keyof typeof notifications] ? 'translate-x-5' : ''}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeSection === 'payout' && (
              <>
                <h3 className="text-lg font-bold text-slate-900 mb-4 sm:mb-6">Payout Settings</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="font-semibold text-slate-900 text-sm mb-1">M-PESA (Default)</div>
                    <div className="text-xs text-slate-600">+254 712 345 678</div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">M-PESA Number</label>
                      <input type="tel" placeholder="+254 712 345 678" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Bank Account</label>
                      <input type="text" placeholder="Account number" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                  </div>
                  <button className="bg-green-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-green-700 text-sm">Save Payout Info</button>
                </div>
              </>
            )}

            {activeSection === 'privacy' && (
              <>
                <h3 className="text-lg font-bold text-slate-900 mb-4 sm:mb-6">Privacy</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Profile Visibility', desc: 'Make your profile visible to customers', value: true },
                    { label: 'Show Earnings', desc: 'Display earnings information publicly', value: false },
                    { label: 'Location Sharing', desc: 'Share location for better job matching', value: true },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div>
                        <div className="font-medium text-slate-900 text-sm">{item.label}</div>
                        <div className="text-xs text-slate-500">{item.desc}</div>
                      </div>
                      <button className={`relative w-11 h-6 rounded-full transition-colors ${item.value ? 'bg-green-600' : 'bg-slate-200'}`}>
                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${item.value ? 'translate-x-5' : ''}`} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <h4 className="font-semibold text-red-600 mb-3 text-sm">Danger Zone</h4>
                  <button className="border border-red-200 text-red-600 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-red-50">Delete Account</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalSettings;
