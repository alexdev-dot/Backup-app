import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard as Home, CalendarDays, MessageCircle, Wallet,
  Briefcase, Settings2, LogOut, Search, CirclePlus, Timer, CircleCheck,
  UserCircle, ChevronLeft, ChevronRight, Star, MapPin, Filter, X,
  Map, List, ChevronDown, Droplets, Zap, Hammer, Sparkles, HardHat, Wrench, CheckCircle
} from 'lucide-react';
import logo from '../../assets/logo/Primary-logo-light.png';
import dashboardLogo from '../../assets/dashboard-logo.png';
import FindServices from './FindServices';
import MyJob from './MyJob';
import MyBookings from './MyBookings';
import Messages from './Messages';
import Payment from './Payment';
import SettingsPage from './Settings';
import MobileBottomNav from '../../components/MobileBottomNav';
import Notifications from '../../components/notifications/Notifications';
import { mockNotifications } from '../../components/notifications/mockNotifications';
import type { Notification } from '../../components/notifications/NotificationTypes';

interface CustomerDashboardProps {
  onLogout?: () => void;
}

import { API_BASE, getToken, getUser } from '../../utils/api';

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [user, setUser] = useState<any>(getUser() || null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalBookings: 0, pendingJobs: 0, completed: 0, messages: 0 });
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [refreshing, setRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [userLocation, setUserLocation] = useState('Ruiru, Kiambu County');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const isInitialMount = useRef(true);
  const startY = useRef(0);
  const currentY = useRef(0);


  const handleMarkAsRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const handleMarkAllAsRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const handleNotificationClick = (notification: Notification) => { if (notification.actionUrl) navigate(notification.actionUrl); };

  // Pull-to-refresh handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    currentY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    currentY.current = e.touches[0].clientY;
    const distance = currentY.current - startY.current;
    if (distance > 0 && window.scrollY === 0) {
      setPullDistance(Math.min(distance, 100));
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance > 60) {
      setRefreshing(true);
      // Simulate refresh
      setTimeout(() => {
        setRefreshing(false);
        setPullDistance(0);
        // Refresh data
        fetchUserData();
        fetchBookings();
      }, 1000);
    } else {
      setPullDistance(0);
    }
  };

  useEffect(() => {
    if (isInitialMount.current) {
      const currentPath = routerLocation.pathname.split('/').pop();
      if (currentPath && ['dashboard', 'services', 'my_job', 'bookings', 'messages', 'payment', 'settings'].includes(currentPath)) {
        setActiveTab(currentPath);
      }
      isInitialMount.current = false;
    }
  }, []);

  useEffect(() => {
    fetchUserData();
    fetchBookings();
    fetchJobs();
    fetchProfessionals();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/user/profile`, { headers: { 'Authorization': `Bearer ${getToken()}` } });
      console.log('User profile response status:', response.status);
      if (response.ok) {
        const json = await response.json();
        console.log('User profile response:', json);
        console.log('User profile full response structure:', JSON.stringify(json, null, 2));
        const userData = json.data?.user || json.user || json.data || json;
        console.log('Extracted userData:', userData);
        console.log('userData.full_name:', userData?.full_name);
        console.log('userData.full_name type:', typeof userData?.full_name);
        console.log('userData.full_name length:', userData?.full_name?.length);
        setUser(userData);
      } else {
        console.error('User profile fetch failed:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error response:', errorText);
      }
    } catch (error) { console.error('Error fetching user data:', error); }
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/bookings`, { headers: { 'Authorization': `Bearer ${getToken()}` } });
      if (response.ok) {
        const json = await response.json();
        const data = json.data || json;
        const arr = Array.isArray(data) ? data : [];
        setBookings(arr);
        setStats({
          totalBookings: arr.length,
          pendingJobs: arr.filter((b: any) => b.status === 'pending' || b.status === 'scheduled').length,
          completed: arr.filter((b: any) => b.status === 'completed').length,
          messages: 0,
        });
      }
    } catch (error) { console.error('Error:', error); }
  };

  const fetchJobs = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/jobs`, { headers: { 'Authorization': `Bearer ${getToken()}` } });
      if (response.ok) {
        const json = await response.json();
        const data = json.data || json;
        const arr = Array.isArray(data) ? data : [];
        setJobs(arr);
      }
    } catch (error) { console.error('Error:', error); }
  };

  const fetchProfessionals = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/professionals`);
      if (response.ok) {
        const json = await response.json();
        const data = json.data || json;
        setProfessionals(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching professionals:', error);
    }
    setLoading(false);
  };

  const sidebarItems = [
    { section: 'Main', items: [
      { id: 'dashboard', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
      { id: 'services', label: 'Find Services', icon: <Search className="w-5 h-5" /> },
      { id: 'my_job', label: 'My Job', icon: <Briefcase className="w-5 h-5" /> },
    ]},
    { section: 'Management', items: [
      { id: 'bookings', label: 'My Bookings', icon: <CalendarDays className="w-5 h-5" /> },
      { id: 'messages', label: 'Chats', icon: <MessageCircle className="w-5 h-5" /> },
      { id: 'payment', label: 'Payment', icon: <Wallet className="w-5 h-5" /> },
    ]},
    { section: 'Account', items: [
      { id: 'settings', label: 'Settings', icon: <Settings2 className="w-5 h-5" /> },
      { id: 'logout', label: 'Logout', icon: <LogOut className="w-5 h-5" /> },
    ]},
  ];

  const mobileNavItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'services', label: 'Search', icon: Search },
    { id: 'bookings', label: 'Bookings', icon: CalendarDays },
    { id: 'messages', label: 'Chats', icon: MessageCircle },
    { id: 'my_job', label: 'My Job', icon: Briefcase },
    { id: 'payment', label: 'Payment', icon: Wallet },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'scheduled': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CircleCheck className="w-4 h-4" />;
      case 'pending': return <Timer className="w-4 h-4" />;
      case 'scheduled': return <CalendarDays className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-slate-200 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <img src={dashboardLogo} alt="GigaFix" className="h-8 w-auto" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-900">{user?.full_name || 'Loading...'}</span>
              <span className="text-xs text-slate-500 capitalize">{user?.role || 'Customer'}</span>
            </div>
          </div>
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
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                {user?.full_name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="hidden md:block">
                <div className="font-semibold text-slate-900">{user?.full_name || 'Loading...'}</div>
                <div className="text-sm text-slate-500 capitalize">{user?.role || 'Customer'}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-16 lg:pt-16 pb-16 lg:pb-0">
        {/* Sidebar */}
        <aside className={`${isSidebarCollapsed ? 'w-20' : 'w-72'} bg-white border-r border-slate-200 min-h-screen p-4 fixed left-0 top-0 z-50 transition-all duration-300 ease-in-out lg:block hidden`}>
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
                    onClick={() => { if (item.id === 'logout') { onLogout?.(); } else { setActiveTab(item.id); navigate(`/customer/${item.id}`); } }}
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
        <main 
          className={`flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 overflow-x-hidden ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'}`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Pull-to-refresh indicator */}
          <div 
            className="flex items-center justify-center transition-all duration-300"
            style={{ 
              height: pullDistance > 0 ? `${pullDistance}px` : '0px',
              opacity: pullDistance / 100
            }}
          >
            <div className="flex items-center gap-2 text-green-600">
              {refreshing ? (
                <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <CirclePlus className="w-6 h-6" />
              )}
              <span className="text-sm font-medium">{refreshing ? 'Refreshing...' : 'Pull to refresh'}</span>
            </div>
          </div>

          {activeTab === 'dashboard' && (
            <>
              {/* Header with Greeting & Location */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Hello, {user?.full_name?.split(' ')[0] || 'User'} 👋</h1>
                  <p className="text-slate-600 mt-1 text-sm sm:text-base">Find trusted professionals near you</p>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                    className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 hover:bg-slate-50 transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-slate-700">{userLocation}</span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>
                  {showLocationDropdown && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-slate-200 shadow-lg z-10 p-2">
                      {['Ruiru, Kiambu County', 'Westlands, Nairobi', 'Nairobi CBD', 'Mombasa Road'].map(loc => (
                        <button
                          key={loc}
                          onClick={() => { setUserLocation(loc); setShowLocationDropdown(false); }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-sm text-slate-700"
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Hero Search Bar */}
              <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl sm:rounded-3xl p-6 sm:p-8 mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">What do you need help with today?</h2>
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search for services or professionals..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 sm:py-4 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-300"
                    />
                  </div>
                  <button
                    onClick={() => { setActiveTab('services'); navigate('/customer/services'); }}
                    className="bg-white text-green-600 px-6 py-3 sm:py-4 rounded-xl font-semibold hover:bg-green-50 transition-colors text-sm sm:text-base whitespace-nowrap"
                  >
                    Post a Job
                  </button>
                </div>
              </div>

              {/* Categories Grid */}
              <div className="mb-6 sm:mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">Popular Services</h3>
                  <button
                    onClick={() => { setActiveTab('services'); navigate('/customer/services'); }}
                    className="text-green-600 text-sm font-medium hover:text-green-700"
                  >
                    View All
                  </button>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                  {[
                    { icon: Droplets, label: 'Plumbing', color: 'bg-blue-100 text-blue-600' },
                    { icon: Zap, label: 'Electrical', color: 'bg-yellow-100 text-yellow-600' },
                    { icon: Hammer, label: 'Carpentry', color: 'bg-orange-100 text-orange-600' },
                    { icon: Sparkles, label: 'Cleaning', color: 'bg-purple-100 text-purple-600' },
                    { icon: HardHat, label: 'Construction', color: 'bg-slate-100 text-slate-600' },
                    { icon: Wrench, label: 'Mechanics', color: 'bg-red-100 text-red-600' },
                  ].map((cat, i) => (
                    <button
                      key={i}
                      onClick={() => { setSearchQuery(cat.label); setActiveTab('services'); navigate('/customer/services'); }}
                      className="flex flex-col items-center gap-2 p-3 sm:p-4 bg-white rounded-xl border border-slate-200 hover:border-green-300 hover:shadow-md transition-all"
                    >
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 ${cat.color} rounded-xl flex items-center justify-center`}>
                        <cat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-slate-700">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Top Rated Near You */}
              <div className="mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">Top Rated Near You</h3>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {professionals.slice(0, 5).map((pro: any) => (
                    <div key={pro.id} className="flex-shrink-0 w-64 bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                          {(pro.full_name || pro.user?.full_name || 'P').charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <h4 className="font-semibold text-slate-900 text-sm truncate">{pro.full_name || pro.user?.full_name || 'Professional'}</h4>
                            {pro.verified && <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />}
                          </div>
                          <p className="text-xs text-slate-500">{pro.service_category || 'Service'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span className="text-sm font-medium text-slate-900">{pro.rating || '4.8'}</span>
                        <span className="text-xs text-slate-500">({pro.reviews_count || '124'} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mb-3">
                        <MapPin className="w-3 h-3" />
                        <span>{pro.distance || '2.5 km away'}</span>
                      </div>
                      <button
                        onClick={() => { setActiveTab('services'); navigate('/customer/services'); }}
                        className="w-full bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                      >
                        View Profile
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'services' && <FindServices />}
          {activeTab === 'my_job' && <MyJob />}
          {activeTab === 'bookings' && <MyBookings />}
          {activeTab === 'messages' && <Messages />}
          {activeTab === 'payment' && <Payment />}
          {activeTab === 'settings' && <SettingsPage />}
        </main>
      </div>

      <MobileBottomNav
        items={mobileNavItems}
        activeTab={activeTab}
        onTabChange={(tabId) => { navigate(`/customer/${tabId}`); setActiveTab(tabId); }}
      />
    </div>
  );
};

export default CustomerDashboard;
