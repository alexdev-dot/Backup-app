import React from 'react';
import { MessageCircle, Briefcase, Star, DollarSign, AlertCircle } from 'lucide-react';
import type { Notification } from './NotificationTypes';

interface NotificationPanelProps {
  notifications: Notification[];
  onClose: () => void;
  onNotificationClick?: (notification: Notification) => void;
  onMarkAsRead?: (notificationId: string) => void;
  onMarkAllAsRead?: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications,
  onClose,
  onNotificationClick,
  onMarkAsRead,
  onMarkAllAsRead,
}) => {
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'message': return <MessageCircle className="w-5 h-5 text-blue-600" />;
      case 'job': return <Briefcase className="w-5 h-5 text-green-600" />;
      case 'review': return <Star className="w-5 h-5 text-amber-600" />;
      case 'payment': return <DollarSign className="w-5 h-5 text-purple-600" />;
      default: return <AlertCircle className="w-5 h-5 text-slate-600" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-xl shadow-lg border border-slate-200 z-50">
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        <h3 className="font-semibold text-slate-900">Notifications</h3>
        {unreadCount > 0 && (
          <button onClick={onMarkAllAsRead} className="text-xs text-green-600 hover:text-green-700 font-medium">
            Mark all as read
          </button>
        )}
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-600">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 text-slate-400" />
            <p className="text-sm">No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors ${!notification.read ? 'bg-blue-50' : ''}`}
              onClick={() => {
                if (!notification.read && onMarkAsRead) onMarkAsRead(notification.id);
                if (onNotificationClick) onNotificationClick(notification);
                onClose();
              }}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 p-2 bg-slate-100 rounded-lg">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-slate-900 text-sm">{notification.title}</p>
                    {!notification.read && <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full" />}
                  </div>
                  <p className="text-sm text-slate-600 mt-1 line-clamp-2">{notification.message}</p>
                  <p className="text-xs text-slate-500 mt-2">{formatTime(notification.timestamp)}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {notifications.length > 0 && (
        <div className="p-3 border-t border-slate-200">
          <button onClick={onClose} className="w-full text-center text-sm text-slate-600 hover:text-slate-900 transition-colors">
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
