import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import type { Notification } from './NotificationTypes';
import NotificationPanel from './NotificationPanel';
import { getToken, API_BASE } from '../../utils/api';

interface NotificationsProps {
  notifications: Notification[];
  onNotificationClick?: (notification: Notification) => void;
  onMarkAsRead?: (notificationId: string) => void;
  onMarkAllAsRead?: () => void;
  onNotificationsUpdate?: (notifications: Notification[]) => void;
}

const Notifications: React.FC<NotificationsProps> = ({
  notifications,
  onNotificationClick,
  onMarkAsRead,
  onMarkAllAsRead,
  onNotificationsUpdate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Real-time polling for notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/notifications`, {
          headers: { 'Authorization': `Bearer ${getToken()}` },
        });
        if (response.ok) {
          const json = await response.json();
          const data = json.data || json;
          const notificationsArray = Array.isArray(data) ? data : data.notifications || [];
          if (onNotificationsUpdate) {
            onNotificationsUpdate(notificationsArray);
          }
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    // Initial fetch
    fetchNotifications();

    // Poll every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, [onNotificationsUpdate]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-slate-100 rounded-xl transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <NotificationPanel
          notifications={notifications}
          onClose={() => setIsOpen(false)}
          onNotificationClick={onNotificationClick}
          onMarkAsRead={onMarkAsRead}
          onMarkAllAsRead={onMarkAllAsRead}
        />
      )}
    </div>
  );
};

export default Notifications;
