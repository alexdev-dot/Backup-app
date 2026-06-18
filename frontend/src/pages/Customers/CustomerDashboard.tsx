import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard as Home, CalendarDays, MessageCircle, Wallet,
  Briefcase, Settings2, LogOut, Search, CirclePlus, Timer, CircleCheck,
  UserCircle, ChevronLeft, ChevronRight
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

import { API_BASE, getToken } from '../../utils/api';

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalBookings: 0, pendingJobs: 0, completed: 0, messages: 0 });
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const isInitialMount = useRef(true);


  const handleMarkAsRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const handleMarkAllAsRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const handleNotificationClick = (notification: Notification) => { if (notification.actionUrl) navigate(notification.actionUrl); };

  useEffect(() => {
    if (isInitialMount.current) {
      const currentPath = location.pathname.split('/').pop();
      if (currentPath && ['dashboard', 'services', 'my_job', 'bookings', 'messages', 'payment', 'settings'].includes(currentPath)) {
        setActiveTab(currentPath);
      }
      isInitialMount.current = false;
    }
  }, []);

  useEffect(() => {
    fetchUserData();
    fetchBookings();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/user/profile`, { headers: { 'Authorization': `Bearer ${getToken()}` } });
      if (response.ok) {
        const json = await response.json();
        setUser(json.data || json);
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
      setLoading(false);
    } catch (error) { console.error('Error:', error); setLoading(false); }
  };

  const sidebarItems = [
    { section: 'Main', items: [
      { id: 'dashboard', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
      { id: 'services', label: 'Find Services', icon: <Search className="w-5 h-5" /> },
      { id: 'my_job', label: 'My Job', icon: <Briefcase className="w-5 h-5" /> },
    ]},
    { section: 'Management', items: [
      { id: 'bookings', label: 'My Bookings', icon: <CalendarDays className="w-5 h-5" /> },
      { id: 'messages', label: 'Messages', icon: <MessageCircle className="w-5 h-5" /> },
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
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'settings', label: 'Settings', icon: Settings2 },
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
                <UserCircle className="w-6 h-6 text-white" />
              </div>
              <div className="hidden md:block">
                <div className="font-semibold text-slate-900">{user?.full_name || 'Loading...'}</div>
                <div className="text-sm text-slate-500">Customer</div>
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
        <main className={`flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 overflow-x-hidden ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'}`}>
          {activeTab === 'dashboard' && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Welcome back, {user?.full_name?.split(' ')[0] || 'User'}!</h1>
                  <p className="text-slate-600 mt-1 text-sm sm:text-base">Here's what's happening with your bookings</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {[
                  { label: 'Total Bookings', value: stats.totalBookings, icon: <CalendarDays className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />, bg: 'bg-green-100', badge: 'Total', badgeColor: 'text-green-600' },
                  { label: 'Pending Jobs', value: stats.pendingJobs, icon: <Timer className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />, bg: 'bg-blue-100', badge: 'Active', badgeColor: 'text-blue-600' },
                  { label: 'Completed', value: stats.completed, icon: <CircleCheck className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />, bg: 'bg-purple-100', badge: 'Done', badgeColor: 'text-purple-600' },
                  { label: 'Messages', value: stats.messages, icon: <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />, bg: 'bg-yellow-100', badge: 'New', badgeColor: 'text-yellow-600' },
                ].map((card, i) => (
                  <div key={i} className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 ${card.bg} rounded-xl flex items-center justify-center`}>{card.icon}</div>
                      <span className={`${card.badgeColor} text-xs sm:text-sm font-medium`}>{card.badge}</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-slate-900">{loading ? '...' : card.value}</div>
                    <div className="text-slate-600 text-xs sm:text-sm">{card.label}</div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm">
                <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">Recent Bookings</h2>
                  <button className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors text-sm sm:text-base">
                    <CirclePlus className="w-4 sm:w-5 h-4 sm:h-5" /><span>New Booking</span>
                  </button>
                </div>
                <div className="p-4 sm:p-6 overflow-x-auto">
                  {loading ? (
                    <div className="text-center py-8 text-slate-600">Loading bookings...</div>
                  ) : bookings.length === 0 ? (
                    <div className="text-center py-8 text-slate-600">No bookings yet</div>
                  ) : (
                    <>
                      <div className="lg:hidden space-y-4">
                        {bookings.slice(0, 5).map((booking) => (
                          <div key={booking.id} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <div className="font-semibold text-slate-900 text-sm">{booking.service}</div>
                                <div className="text-slate-600 text-xs mt-1">{booking.professional_name}</div>
                              </div>
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                {getStatusIcon(booking.status)}
                                {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-slate-600">
                              <div>{booking.date} at {booking.time}</div>
                              <div className="font-semibold text-slate-900">{booking.amount}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <table className="hidden lg:table w-full min-w-[600px]">
                        <thead>
                          <tr className="text-left text-slate-600 text-xs sm:text-sm">
                            <th className="pb-4 font-medium">Service</th>
                            <th className="pb-4 font-medium">Professional</th>
                            <th className="pb-4 font-medium">Date & Time</th>
                            <th className="pb-4 font-medium">Status</th>
                            <th className="pb-4 font-medium">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookings.slice(0, 5).map((booking) => (
                            <tr key={booking.id} className="border-t border-slate-100">
                              <td className="py-3 sm:py-4"><div className="font-medium text-slate-900 text-sm sm:text-base">{booking.service}</div></td>
                              <td className="py-3 sm:py-4 text-slate-600 text-sm sm:text-base">{booking.professional_name}</td>
                              <td className="py-3 sm:py-4 text-slate-600 text-xs sm:text-sm">{booking.date} at {booking.time}</td>
                              <td className="py-3 sm:py-4">
                                <span className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                  {getStatusIcon(booking.status)}
                                  {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                                </span>
                              </td>
                              <td className="py-3 sm:py-4 font-medium text-slate-900 text-sm sm:text-base">{booking.amount}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  )}
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
