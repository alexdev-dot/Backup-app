import React, { useState, useEffect } from 'react';
import { Star, MapPin, Briefcase, Plus, X, Camera, Save, Upload, CheckCircle, Clock, Shield } from 'lucide-react';

import { API_BASE, getToken } from '../../utils/api';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [verificationDocs, setVerificationDocs] = useState({
    idDocument: null as File | null,
    certificate: null as File | null,
    additional: null as File | null,
  });
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '', email: '', phone: '', location: '',
    bio: '', hourly_rate: '', category: '', years_experience: '',
    skills: [] as string[],
  });


  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const userRes = await fetch(`${API_BASE}/api/user/profile`, { headers: { 'Authorization': `Bearer ${getToken()}` } });
      if (userRes.ok) {
        const userJson = await userRes.json();
        console.log('Professional profile user response:', userJson);
        const userData = userJson.data?.user || userJson.user || userJson.data || userJson;
        const profRes = await fetch(`${API_BASE}/api/professionals`, { headers: { 'Authorization': `Bearer ${getToken()}` } });
        if (profRes.ok) {
          const profJson = await profRes.json();
          const profData = Array.isArray(profJson.data) ? profJson.data : (Array.isArray(profJson) ? profJson : []);
          const myProf = profData.find((p: any) => p.user_id === userData.id) || {};
          const merged = { ...userData, ...myProf };
          setProfile(merged);
          setFormData({
            full_name: merged.full_name || '',
            email: merged.email || '',
            phone: merged.phone || '',
            location: merged.location || '',
            bio: merged.bio || '',
            hourly_rate: merged.hourly_rate || '',
            category: merged.category || '',
            years_experience: merged.years_experience || '',
            skills: merged.skills || [],
          });
        }
      }
    } catch (error) { console.error('Error:', error); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch(`${API_BASE}/api/user/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify({
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
        }),
      });
      setProfile((prev: any) => ({ ...prev, full_name: formData.full_name, email: formData.email, phone: formData.phone, location: formData.location }));
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) { console.error('Save error:', error); }
    setSaving(false);
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  const handleVerificationUpload = async () => {
    if (!verificationDocs.idDocument) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('id_document', verificationDocs.idDocument);
      if (verificationDocs.certificate) formData.append('certificate', verificationDocs.certificate);
      if (verificationDocs.additional) formData.append('additional', verificationDocs.additional);

      const response = await fetch(`${API_BASE}/api/professionals/verify`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${getToken()}` },
        body: formData,
      });
      if (response.ok) {
        setShowVerification(false);
        setVerificationDocs({ idDocument: null, certificate: null, additional: null });
        fetchProfile();
      }
    } catch (error) {
      console.error('Error uploading verification docs:', error);
    } finally {
      setUploading(false);
    }
  };

  const categories = ['Plumbing', 'Electrical', 'Carpentry', 'Cleaning', 'Painting', 'Landscaping', 'HVAC', 'Appliance Repair', 'Masonry', 'Other'];

  return (
    <div>
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">My Profile</h2>
          <p className="text-slate-600 text-sm sm:text-base">Manage your professional profile</p>
        </div>
        {!editing ? (
          <button onClick={() => setEditing(true)} className="bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors">
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => { setEditing(false); }} className="border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-60">
              <Save className="w-4 h-4" />{saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}
      </div>

      {saved && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium flex items-center gap-2">
          ✓ Profile updated successfully
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-6 text-center">
            <div className="relative inline-block mb-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl font-bold mx-auto">
                {(profile?.full_name || 'P').charAt(0).toUpperCase()}
              </div>
              {editing && (
                <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700 shadow">
                  <Camera className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">{profile?.full_name || 'Professional'}</h3>
            <p className="text-green-600 text-sm font-medium mb-2">{profile?.category || formData.category || 'Your Category'}</p>
            <div className="flex items-center justify-center gap-1 mb-2">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.floor(profile?.rating || 0) ? 'text-amber-500 fill-amber-500' : 'text-slate-200'}`} />
              ))}
              <span className="text-sm text-slate-500 ml-1">({profile?.reviews_count || 0})</span>
            </div>
            {profile?.location && (
              <div className="flex items-center justify-center gap-1 text-slate-500 text-sm">
                <MapPin className="w-3.5 h-3.5" />
                <span>{profile.location}</span>
              </div>
            )}
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-center">
              <div>
                <div className="text-xl font-bold text-slate-900">{profile?.jobs_completed || 0}</div>
                <div className="text-xs text-slate-500">Jobs Done</div>
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900">{formData.years_experience || '0'}y</div>
                <div className="text-xs text-slate-500">Experience</div>
              </div>
            </div>

            {/* Verification Status */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-700">Verification Status</span>
              </div>
              {profile?.verification_status === 'verified' ? (
                <div className="flex items-center justify-center gap-1 text-green-600 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>Verified</span>
                </div>
              ) : profile?.verification_status === 'pending' ? (
                <div className="flex items-center justify-center gap-1 text-amber-600 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>Pending Review</span>
                </div>
              ) : (
                <button
                  onClick={() => setShowVerification(true)}
                  className="flex items-center justify-center gap-1 text-green-600 text-sm font-medium hover:text-green-700"
                >
                  <Upload className="w-4 h-4" />
                  <span>Get Verified</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6">
            <h4 className="font-bold text-slate-900 mb-4">Basic Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'full_name', label: 'Full Name', type: 'text' },
                { key: 'email', label: 'Email', type: 'email' },
                { key: 'phone', label: 'Phone', type: 'tel' },
                { key: 'location', label: 'Location', type: 'text' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">{field.label}</label>
                  {!editing ? (
                    <div className="text-sm text-slate-600 py-2.5 px-4 bg-slate-50 rounded-xl">
                      {(formData as any)[field.key] || 'Not set'}
                    </div>
                  ) : (
                    <input
                      type={field.type}
                      value={(formData as any)[field.key]}
                      onChange={e => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* About */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6">
            <h4 className="font-bold text-slate-900 mb-3">About</h4>
            {editing ? (
              <textarea
                value={formData.bio}
                onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell customers about yourself and your expertise..."
                rows={4}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              />
            ) : (
              <p className="text-slate-600 text-sm leading-relaxed">{profile?.bio || formData.bio || 'No bio added yet.'}</p>
            )}
          </div>

          {/* Details Form */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6">
            <h4 className="font-bold text-slate-900 mb-4">Professional Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'category', label: 'Category', type: 'select' },
                { key: 'hourly_rate', label: 'Hourly Rate (KSh)', type: 'number' },
                { key: 'location', label: 'Service Area', type: 'text' },
                { key: 'years_experience', label: 'Years of Experience', type: 'number' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">{field.label}</label>
                  {!editing ? (
                    <div className="text-sm text-slate-600 py-2.5 px-4 bg-slate-50 rounded-xl">
                      {(formData as any)[field.key] || 'Not set'}
                    </div>
                  ) : field.type === 'select' ? (
                    <select
                      value={formData.category}
                      onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select category</option>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      value={(formData as any)[field.key]}
                      onChange={e => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-slate-900">Skills</h4>
              <Briefcase className="w-5 h-5 text-slate-400" />
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.skills.map(skill => (
                <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-200">
                  {skill}
                  {editing && (
                    <button onClick={() => removeSkill(skill)} className="hover:text-red-500 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
              {formData.skills.length === 0 && <span className="text-sm text-slate-500">No skills added yet.</span>}
            </div>
            {editing && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={e => setNewSkill(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addSkill()}
                  placeholder="Add a skill..."
                  className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button onClick={addSkill} className="flex items-center gap-1 bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Verification Modal */}
      {showVerification && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Get Verified</h3>
              <button onClick={() => setShowVerification(false)} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">ID Document (Required)</label>
                <input
                  type="file"
                  onChange={(e) => setVerificationDocs(prev => ({ ...prev, idDocument: e.target.files?.[0] || null }))}
                  accept="image/*,.pdf"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Certificate (Optional)</label>
                <input
                  type="file"
                  onChange={(e) => setVerificationDocs(prev => ({ ...prev, certificate: e.target.files?.[0] || null }))}
                  accept="image/*,.pdf"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Additional Documents (Optional)</label>
                <input
                  type="file"
                  onChange={(e) => setVerificationDocs(prev => ({ ...prev, additional: e.target.files?.[0] || null }))}
                  accept="image/*,.pdf"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowVerification(false)} className="flex-1 border border-slate-200 text-slate-700 py-2.5 rounded-xl font-medium hover:bg-slate-50 text-sm">Cancel</button>
                <button
                  onClick={handleVerificationUpload}
                  disabled={uploading || !verificationDocs.idDocument}
                  className="flex-1 bg-green-600 text-white py-2.5 rounded-xl font-medium hover:bg-green-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Uploading...' : 'Submit for Verification'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
