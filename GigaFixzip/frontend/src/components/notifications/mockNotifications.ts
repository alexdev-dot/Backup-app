import type { Notification } from './NotificationTypes';

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'message',
    title: 'New message from John Doe',
    message: 'Hi, I have a question about the plumbing job you posted.',
    timestamp: new Date(Date.now() - 5 * 60000),
    read: false,
    actionUrl: '/professional/messages',
  },
  {
    id: '2',
    type: 'job',
    title: 'New job request',
    message: 'Sarah Johnson has requested a quote for electrical work.',
    timestamp: new Date(Date.now() - 30 * 60000),
    read: false,
    actionUrl: '/professional/quotes',
  },
  {
    id: '3',
    type: 'review',
    title: 'New review received',
    message: 'Michael Brown left a 5-star review for your recent service.',
    timestamp: new Date(Date.now() - 2 * 3600000),
    read: false,
    actionUrl: '/professional/reviews',
  },
  {
    id: '4',
    type: 'payment',
    title: 'Payment received',
    message: 'You received KSh 5,000 for completed job #12345.',
    timestamp: new Date(Date.now() - 24 * 3600000),
    read: true,
    actionUrl: '/professional/earnings',
  },
  {
    id: '5',
    type: 'system',
    title: 'Profile updated',
    message: 'Your profile information has been successfully updated.',
    timestamp: new Date(Date.now() - 3 * 24 * 3600000),
    read: true,
  },
];
