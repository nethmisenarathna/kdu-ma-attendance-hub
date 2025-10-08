import React from 'react';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Clock,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { StatsCard } from '../components/StatsCard';
import { StatusBadge } from '../components/StatusBadge';

const todaysLectures = [
  {
    id: 1,
    subject: "Advanced Algorithms",
    lecturer: "Dr. Smith Johnson",
    time: "09:00 - 11:00",
    room: "Lab 101",
    status: "ongoing",
    students: 45,
  },
  {
    id: 2,
    subject: "Database Systems",
    lecturer: "Prof. Sarah Wilson",
    time: "11:30 - 13:30",
    room: "Room 204",
    status: "scheduled",
    students: 38,
  },
  {
    id: 3,
    subject: "Machine Learning",
    lecturer: "Dr. Michael Chen",
    time: "14:00 - 16:00",
    room: "Lab 205",
    status: "scheduled",
    students: 42,
  },
];

const recentActivities = [
  {
    id: 1,
    activity: "New student enrolled in Computer Science",
    time: "2 hours ago",
    type: "enrollment"
  },
  {
    id: 2,
    activity: "Lecture 'Web Development' completed",
    time: "4 hours ago",
    type: "lecture"
  },
  {
    id: 3,
    activity: "Dr. Johnson updated course materials",
    time: "6 hours ago",
    type: "update"
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome to KDU Faculty Management Portal
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Students"
          value="1,247"
          icon={Users}
          change="+12% from last month"
          changeType="positive"
        />
        <StatsCard
          title="Active Lecturers"
          value="89"
          icon={GraduationCap}
          change="+3% from last month"
          changeType="positive"
        />
        <StatsCard
          title="Today's Lectures"
          value="24"
          icon={BookOpen}
          change="6 ongoing now"
          changeType="neutral"
        />
        <StatsCard
          title="Completion Rate"
          value="94.2%"
          icon={TrendingUp}
          change="+2.1% from last week"
          changeType="positive"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Lectures */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Today's Lectures</h2>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {todaysLectures.map((lecture) => (
              <div key={lecture.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{lecture.subject}</h3>
                  <p className="text-sm text-gray-600">{lecture.lecturer}</p>
                  <p className="text-sm text-gray-500">{lecture.time} • {lecture.room}</p>
                </div>
                <div className="text-right">
                  <StatusBadge status={lecture.status} />
                  <p className="text-xs text-gray-500 mt-1">{lecture.students} students</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activities</h2>
            <AlertCircle className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.activity}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}