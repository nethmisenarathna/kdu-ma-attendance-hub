import React from 'react';
import { Bell, AlertCircle, Info, CheckCircle } from 'lucide-react';

const notificationsData = [
  {
    id: 1,
    title: "System Maintenance Scheduled",
    message: "The system will be under maintenance on Saturday from 2:00 AM to 6:00 AM.",
    type: "info",
    time: "2 hours ago",
    read: false
  },
  {
    id: 2,
    title: "New Student Registration",
    message: "5 new students have registered for Computer Science program.",
    type: "success",
    time: "4 hours ago",
    read: false
  },
  {
    id: 3,
    title: "Course Material Updated",
    message: "Dr. Johnson has updated the course materials for Advanced Algorithms.",
    type: "info",
    time: "1 day ago",
    read: true
  },
  {
    id: 4,
    title: "Low Attendance Alert",
    message: "Database Systems lecture has low attendance (below 70%).",
    type: "warning",
    time: "2 days ago",
    read: true
  },
];

const getNotificationIcon = (type) => {
  switch (type) {
    case 'info':
      return Info;
    case 'success':
      return CheckCircle;
    case 'warning':
      return AlertCircle;
    default:
      return Bell;
  }
};

const getNotificationColor = (type) => {
  switch (type) {
    case 'info':
      return 'text-blue-500 bg-blue-50';
    case 'success':
      return 'text-green-500 bg-green-50';
    case 'warning':
      return 'text-yellow-500 bg-yellow-50';
    default:
      return 'text-gray-500 bg-gray-50';
  }
};

export default function Notifications() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="mt-2 text-gray-600">Stay updated with system alerts and announcements</p>
        </div>
        <button className="text-blue-600 hover:text-blue-700 font-medium">
          Mark all as read
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg border">
        <div className="divide-y divide-gray-200">
          {notificationsData.map((notification) => {
            const Icon = getNotificationIcon(notification.type);
            const colorClass = getNotificationColor(notification.type);
            
            return (
              <div key={notification.id} className={`p-4 ${!notification.read ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}>
                <div className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${colorClass}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                        {notification.title}
                      </h3>
                      <p className="text-xs text-gray-500">{notification.time}</p>
                    </div>
                    <p className={`mt-1 text-sm ${!notification.read ? 'text-gray-800' : 'text-gray-600'}`}>
                      {notification.message}
                    </p>
                    {!notification.read && (
                      <div className="mt-2">
                        <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                          Mark as read
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}