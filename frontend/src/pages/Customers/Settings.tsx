import React, { useState, useEffect } from 'react';
import { User, Lock, Bell, Shield, ChevronRight, Save, Eye, EyeOff, Camera } from 'lucide-react';

import { API_BASE, getToken } from '../../utils/api';

const CustomerSettings: React.FC = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({ full_name: '', email: '', phone: '', location: '' });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState({ email: true, push: true, sms: false, marketing: false });


  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/user/profile`, {
        headers: { 'Authorization': `Bearer ${getToken()}` },
      });
      if (response.ok) {
        const json = await response.json();
        const data = json.data || json;
        setUser(data);
        setFormData({ full_name: data.full_name || '', email: data.email || '', phone: data.phone || '', location: data.location || '' });
      }
    } catch (error) { console.error('Error:', error); }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE}/api/user/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify(formData),
      });
      if (response.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
    } catch (error) { console.error('Save error:', error); }
    setSaving(false);
  };

  const sections = [
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
    { id: 'security', label: 'Security', icon: <Lock className="w-5 h-5" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
    { id: 'privacy', label: 'Privacy', icon: <Shield className="w-5 h-5" /> },
  ];

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Settings</h2>
        <p className="text-slate-600 text-sm sm:text-base">Manage your account preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Sidebar Nav */}
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
            {activeSection === 'profile' && (
              <>
                <h3 className="text-lg font-bold text-slate-900 mb-4 sm:mb-6">Profile Information</h3>
                {/* Avatar */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                  <div className="relative">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold">
                      {formData.full_name.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700 transition-colors shadow">
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{formData.full_name || 'Your Name'}</div>
                    <div className="text-sm text-slate-500">Customer Account</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {[
                    { key: 'full_name', label: 'Full Name', type: 'text', placeholder: 'Your full name' },
                    { key: 'email', label: 'Email Address', type: 'email', placeholder: 'your@email.com' },
                    { key: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+254 712 345 678' },
                    { key: 'location', label: 'Location', type: 'text', placeholder: 'Nairobi, Kenya' },
                  ].map(field => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">{field.label}</label>
                      <input
                        type={field.type}
                        value={(formData as any)[field.key]}
                        onChange={e => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <button onClick={handleSaveProfile} disabled={saving} className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-green-700 transition-colors text-sm disabled:opacity-60">
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  {saved && <span className="text-green-600 text-sm font-medium">✓ Saved successfully</span>}
                </div>
              </>
            )}

            {activeSection === 'security' && (
              <>
                <h3 className="text-lg font-bold text-slate-900 mb-4 sm:mb-6">Security Settings</h3>
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
                        <button
                          type="button"
                          onClick={() => setShowPasswords(prev => ({ ...prev, [field.key]: !prev[field.key] }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPasswords[field.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="bg-green-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-green-700 transition-colors text-sm">
                  Update Password
                </button>
              </>
            )}

            {activeSection === 'notifications' && (
              <>
                <h3 className="text-lg font-bold text-slate-900 mb-4 sm:mb-6">Notification Preferences</h3>
                <div className="space-y-4">
                  {[
                    { key: 'email', label: 'Email Notifications', desc: 'Receive notifications via email' },
                    { key: 'push', label: 'Push Notifications', desc: 'Receive push notifications on your device' },
                    { key: 'sms', label: 'SMS Notifications', desc: 'Receive text message notifications' },
                    { key: 'marketing', label: 'Marketing Emails', desc: 'Receive updates about promotions and offers' },
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

            {activeSection === 'privacy' && (
              <>
                <h3 className="text-lg font-bold text-slate-900 mb-4 sm:mb-6">Privacy Settings</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Profile Visibility', desc: 'Allow professionals to see your profile', value: true },
                    { label: 'Location Sharing', desc: 'Share your location for better service matching', value: true },
                    { label: 'Review History', desc: 'Make your reviews visible to other users', value: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div>
                        <div className="font-medium text-slate-900 text-sm">{item.label}</div>
                        <div className="text-xs text-slate-500">{item.desc}</div>
                      </div>
                      <button
                        className={`relative w-11 h-6 rounded-full transition-colors ${item.value ? 'bg-green-600' : 'bg-slate-200'}`}
                      >
                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${item.value ? 'translate-x-5' : ''}`} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <h4 className="font-semibold text-red-600 mb-3 text-sm">Danger Zone</h4>
                  <button className="border border-red-200 text-red-600 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors">
                    Delete Account
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSettings;
