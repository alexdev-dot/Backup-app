import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Briefcase, File, Coins, Star, User,
  Settings2 as SettingsIcon, LogOut, ChartLine, UserCircle,
  FolderOpen, FileText as FileIcon, ChevronLeft, ChevronRight, MessageCircle
} from 'lucide-react';
import logo from '../../assets/logo/Primary-logo-light.png';
import dashboardLogo from '../../assets/dashboard-logo.png';
import Jobs from './Jobs';
import Quotes from './Quotes';
import Earnings from './Earnings';
import Reviews from './Reviews';
import Profile from './Profile';
import SettingsPage from './Settings';
import Messages from './Messages';
import Notifications from '../../components/notifications/Notifications';
import { mockNotifications } from '../../components/notifications/mockNotifications';
import type { Notification } from '../../components/notifications/NotificationTypes';
import MobileBottomNav from '../../components/MobileBottomNav';

import { API_BASE, getToken } from '../../utils/api';

interface ProfessionalDashboardProps {
  onLogout?: () => void;
}

const ProfessionalDashboard: React.FC<ProfessionalDashboardProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalJobs: 0, completedJobs: 0, totalEarnings: 0, rating: 0 });
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const isInitialMount = useRef(true);


  const handleMarkAsRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const handleMarkAllAsRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const handleNotificationClick = (notification: Notification) => { if (notification.actionUrl) navigate(notification.actionUrl); };

  useEffect(() => {
    if (isInitialMount.current) {
      const currentPath = location.pathname.split('/').pop();
      if (currentPath && ['dashboard', 'jobs', 'quotes', 'messages', 'earnings', 'reviews', 'profile', 'settings'].includes(currentPath)) {
        setActiveTab(currentPath);
      }
      isInitialMount.current = false;
    }
  }, []);

  useEffect(() => {
    fetchUserData();
    fetchJobs();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/user/profile`, { headers: { 'Authorization': `Bearer ${getToken()}` } });
      if (response.ok) {
        const json = await response.json();
        const userData = json.data || json;
        setUser(userData);

        const profResponse = await fetch(`${API_BASE}/api/professionals`, { headers: { 'Authorization': `Bearer ${getToken()}` } });
        if (profResponse.ok) {
          const profJson = await profResponse.json();
          const profData = Array.isArray(profJson.data) ? profJson.data : (Array.isArray(profJson) ? profJson : []);
          const myProfile = profData.find((p: any) => p.user_id === userData.id);
          if (myProfile) {
            setStats(prev => ({ ...prev, rating: myProfile.rating || 0 }));
          }
        }
      }
    } catch (error) { console.error('Error fetching user data:', error); }
  };

  const fetchJobs = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/bookings`, { headers: { 'Authorization': `Bearer ${getToken()}` } });
      if (response.ok) {
        const json = await response.json();
        const data = json.data || json;
        const arr = Array.isArray(data) ? data : [];
        setJobs(arr);
        setStats(prev => ({
          ...prev,
          totalJobs: arr.length,
          completedJobs: arr.filter((b: any) => b.status === 'completed').length,
        }));
      }
      setLoading(false);
    } catch (error) { console.error('Error:', error); setLoading(false); }
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  const sidebarItems = [
    { section: 'Main', items: [
      { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
      { id: 'jobs', label: 'Jobs', icon: <Briefcase className="w-5 h-5" /> },
      { id: 'quotes', label: 'Quotes', icon: <File className="w-5 h-5" /> },
    ]},
    { section: 'Management', items: [
      { id: 'messages', label: 'Messages', icon: <MessageCircle className="w-5 h-5" /> },
      { id: 'earnings', label: 'Earnings', icon: <Coins className="w-5 h-5" /> },
      { id: 'reviews', label: 'Reviews', icon: <Star className="w-5 h-5" /> },
    ]},
    { section: 'Account', items: [
      { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
      { id: 'settings', label: 'Settings', icon: <SettingsIcon className="w-5 h-5" /> },
      { id: 'logout', label: 'Logout', icon: <LogOut className="w-5 h-5" /> },
    ]},
  ];

  const mobileNavItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'earnings', label: 'Earnings', icon: Coins },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-slate-200 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <img src={dashboardLogo} alt="GigaFix" className="h-8 w-auto" />
          <div className="flex items-center gap-2">
            <Notifications notifications={notifications} onNotificationClick={handleNotificationClick} onMarkAsRead={handleMarkAsRead} onMarkAllAsRead={handleMarkAllAsRead} />
            <button onClick={onLogout} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
              <LogOut className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Desktop Header */}
      <header className={`hidden lg:block bg-white border-b border-slate-200 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isSidebarCollapsed ? 'pl-24' : 'pl-72'}`}>
        <div className="flex items-center justify-between px-8 py-4">
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <div className="flex items-center gap-4">
            <Notifications notifications={notifications} onNotificationClick={handleNotificationClick} onMarkAsRead={handleMarkAsRead} onMarkAllAsRead={handleMarkAllAsRead} />
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="hidden md:block">
                <div className="font-semibold text-slate-900">{user?.full_name || 'Loading...'}</div>
                <div className="text-sm text-slate-500 capitalize">{user?.role || 'Professional'}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-16 lg:pt-16 pb-16 lg:pb-0">
        {/* Sidebar */}
        <aside className={`${isSidebarCollapsed ? 'w-20' : 'w-72'} bg-white border-r border-slate-200 h-screen p-4 fixed left-0 top-0 z-50 transition-all duration-300 ease-in-out lg:block hidden overflow-y-auto`}>
          <div className="mb-6 px-2 flex items-center justify-between">
            {!isSidebarCollapsed ? <img src={logo} alt="GigaFix" className="h-10 w-auto" /> : <img src={dashboardLogo} alt="GigaFix" className="h-8 w-auto" />}
            <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className={`p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-all duration-300 ${isSidebarCollapsed ? 'mx-auto' : ''}`}>
              {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          </div>

          {sidebarItems.map((section) => (
            <div key={section.section} className="mb-6">
              {!isSidebarCollapsed && (
                <div className="px-3 mb-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{section.section}</span>
                </div>
              )}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { if (item.id === 'logout') { onLogout?.(); } else { setActiveTab(item.id); navigate(`/professional/${item.id}`); } }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 text-sm ${activeTab === item.id ? 'bg-green-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'} ${isSidebarCollapsed ? 'justify-center' : ''}`}
                    title={isSidebarCollapsed ? item.label : ''}
                  >
                    {item.icon}
                    {!isSidebarCollapsed && <span className="font-medium whitespace-nowrap">{item.label}</span>}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </aside>

        {/* Main Content */}
        <main className={`flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 overflow-x-hidden ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'}`}>
          {activeTab === 'dashboard' && (
            <>
              <div className="mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Welcome back, {user?.full_name?.split(' ')[0] || 'User'} 👋</h2>
                <p className="text-slate-600 text-sm sm:text-base">Here's what's happening with your business.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {[
                  { label: 'Total Jobs', value: stats.totalJobs, icon: <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600" />, textColor: 'text-slate-900' },
                  { label: 'Completed Jobs', value: stats.completedJobs, icon: <File className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />, textColor: 'text-green-600' },
                  { label: 'Total Earnings', value: `KSh ${stats.totalEarnings.toLocaleString()}`, icon: <Coins className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600" />, textColor: 'text-slate-900' },
                  { label: 'Rating', value: stats.rating.toFixed(1), icon: <Star className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 fill-amber-500" />, textColor: 'text-slate-900' },
                ].map((card, i) => (
                  <div key={i} className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      {card.icon}
                      <span className="text-xs sm:text-sm text-slate-500">{card.label}</span>
                    </div>
                    <div className={`text-2xl sm:text-3xl font-bold ${card.textColor}`}>{loading ? '...' : card.value}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900">Recent Jobs</h3>
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                      {loading ? (
                        <div className="text-center py-8 text-slate-600">Loading jobs...</div>
                      ) : jobs.length === 0 ? (
                        <div className="text-center py-8 text-slate-600">No jobs yet</div>
                      ) : (
                        jobs.slice(0, 5).map((job) => (
                          <div key={job.id} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0">
                              {getInitials(job.professional_name || 'User')}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-slate-900 text-sm sm:text-base mb-1">{job.service}</h4>
                              <p className="text-xs sm:text-sm text-slate-600 mb-1">{job.location}</p>
                              <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${job.status === 'completed' ? 'bg-green-100 text-green-700' : job.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                                {job.status?.charAt(0).toUpperCase() + job.status?.slice(1)}
                              </span>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="font-bold text-slate-900 text-sm sm:text-base">{job.amount}</div>
                              <div className="text-xs text-slate-500">Payout</div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">Earnings Overview</h3>
                    <div className="flex items-baseline gap-2 mb-4 sm:mb-6">
                      <span className="text-2xl sm:text-3xl font-bold text-slate-900">KSh 345,000</span>
                      <span className="text-xs sm:text-sm text-slate-500">This Month</span>
                    </div>
                    <div className="h-36 sm:h-48 bg-gradient-to-br from-green-50 to-green-100 rounded-xl flex items-center justify-center mb-4">
                      <div className="text-center">
                        <ChartLine className="w-10 h-10 sm:w-12 sm:h-12 text-green-600 mx-auto mb-2" />
                        <p className="text-xs sm:text-sm text-green-600 font-medium">Revenue Trend</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 sm:mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      {[
                        { icon: <UserCircle className="w-6 h-6 sm:w-8 sm:h-8 text-slate-600" />, label: 'Update Profile', bg: 'bg-slate-50', hover: 'hover:bg-slate-100' },
                        { icon: <FolderOpen className="w-6 h-6 sm:w-8 sm:h-8 text-slate-600" />, label: 'Add Portfolio', bg: 'bg-slate-50', hover: 'hover:bg-slate-100' },
                        { icon: <FileIcon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />, label: 'Quote Requests', bg: 'bg-blue-50', hover: 'hover:bg-blue-100' },
                      ].map((action, i) => (
                        <button key={i} className={`flex flex-col items-center gap-1 sm:gap-2 p-3 sm:p-4 ${action.bg} rounded-xl ${action.hover} transition-colors`}>
                          {action.icon}
                          <span className="text-xs font-medium text-slate-700 text-center">{action.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'jobs' && <Jobs />}
          {activeTab === 'quotes' && <Quotes />}
          {activeTab === 'messages' && <Messages />}
          {activeTab === 'earnings' && <Earnings />}
          {activeTab === 'reviews' && <Reviews />}
          {activeTab === 'profile' && <Profile />}
          {activeTab === 'settings' && <SettingsPage />}
        </main>
      </div>

      <MobileBottomNav
        items={mobileNavItems}
        activeTab={activeTab}
        onTabChange={(tabId) => { setActiveTab(tabId); navigate(`/professional/${tabId}`); }}
      />
    </div>
  );
};

export default ProfessionalDashboard;
