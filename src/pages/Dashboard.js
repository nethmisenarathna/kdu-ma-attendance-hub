import React, { useState, useEffect } from 'react';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Clock,
  TrendingUp,
  AlertCircle,
  X
} from 'lucide-react';
import { StatsCard } from '../components/StatsCard';
import { StatusBadge } from '../components/StatusBadge';
import { lectureService } from '../services/lectureService';
import { dashboardService } from '../services/dashboardService';

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
  const [lectureStats, setLectureStats] = useState({
    todaysLectures: 0,
    ongoingLectures: 0
  });
  const [dashboardStats, setDashboardStats] = useState({
    students: {
      total: 0,
      changeText: 'Loading...',
      changeType: 'neutral'
    },
    lecturers: {
      total: 0,
      changeText: 'Loading...',
      changeType: 'neutral'
    }
  });
  const [todaysLectures, setTodaysLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllLectures, setShowAllLectures] = useState(false);

  // Helper function to format time from ISO string or time string
  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    
    // If it's an ISO date string
    if (timeStr.includes('T')) {
      const date = new Date(timeStr);
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    }
    
    // If it's already in HH:MM format
    return timeStr;
  };

  // Helper function to convert time to minutes
  const timeToMinutes = (timeStr) => {
    if (!timeStr) return null;
    
    let hours, minutes;
    
    // If it's an ISO date string
    if (timeStr.includes('T')) {
      const date = new Date(timeStr);
      hours = date.getHours();
      minutes = date.getMinutes();
    } else {
      // If it's in HH:MM format
      [hours, minutes] = timeStr.split(':').map(Number);
    }
    
    return hours * 60 + minutes;
  };

  // Helper function to determine lecture status
  const getLectureStatus = (lecture) => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const startTime = timeToMinutes(lecture.start_time);
    const endTime = timeToMinutes(lecture.end_time);
    
    if (startTime === null || endTime === null) {
      return 'scheduled';
    }
    
    if (currentTime >= startTime && currentTime <= endTime) {
      return 'ongoing';
    } else if (currentTime > endTime) {
      return 'ended';
    } else {
      return 'scheduled';
    }
  };

  // Fetch lecture data and dashboard stats
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        // Fetch lecture stats
        const lectureResponse = await lectureService.getTodaysLectureStats();
        if (lectureResponse.success && lectureResponse.data) {
          setLectureStats({
            todaysLectures: lectureResponse.data.todaysLectures,
            ongoingLectures: lectureResponse.data.ongoingLectures
          });

          // Process lectures with status
          const lecturesWithStatus = lectureResponse.data.todaysLectureList.map(lecture => ({
            ...lecture,
            status: getLectureStatus(lecture),
            displayTime: `${formatTime(lecture.start_time)} - ${formatTime(lecture.end_time)}`
          }));

          setTodaysLectures(lecturesWithStatus);
        }
        
        // Fetch dashboard stats (students and lecturers)
        const dashboardResponse = await dashboardService.getDashboardStats();
        if (dashboardResponse.success && dashboardResponse.data) {
          setDashboardStats({
            students: {
              total: dashboardResponse.data.students.total,
              changeText: dashboardResponse.data.students.changeText,
              changeType: dashboardResponse.data.students.changeType
            },
            lecturers: {
              total: dashboardResponse.data.lecturers.total,
              changeText: dashboardResponse.data.lecturers.changeText,
              changeType: dashboardResponse.data.lecturers.changeType
            }
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch initial data
    fetchAllData();

    // Refresh data every minute
    const interval = setInterval(fetchAllData, 60000);

    return () => clearInterval(interval);
  }, []);

  // Get first 3 lectures for display
  const displayedLectures = todaysLectures.slice(0, 3);
  const hasMoreLectures = todaysLectures.length > 3;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">
          Welcome to KDU Faculty Management Portal
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Total Students"
          value={loading ? "..." : dashboardStats.students.total.toLocaleString()}
          icon={Users}
          change={loading ? "Loading..." : dashboardStats.students.changeText}
          changeType={dashboardStats.students.changeType}
        />
        <StatsCard
          title="Active Lecturers"
          value={loading ? "..." : dashboardStats.lecturers.total.toString()}
          icon={GraduationCap}
          change={loading ? "Loading..." : dashboardStats.lecturers.changeText}
          changeType={dashboardStats.lecturers.changeType}
        />
        <StatsCard
          title="Today's Lectures"
          value={loading ? "..." : lectureStats.todaysLectures.toString()}
          icon={BookOpen}
          change={loading ? "Loading..." : `${lectureStats.ongoingLectures} ongoing now`}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Today's Lectures */}
        <div className="bg-white rounded-lg border p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Today's Lectures</h2>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-sm">Loading lectures...</p>
            </div>
          ) : todaysLectures.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No lectures scheduled for today</p>
            </div>
          ) : (
            <>
              <div className="space-y-3 sm:space-y-4">
                {displayedLectures.map((lecture, index) => (
                  <div key={lecture._id || index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{lecture.subject}</h3>
                      <p className="text-sm text-gray-600 truncate">
                        {lecture.lecturer_name || 'Lecturer TBA'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {lecture.displayTime} • {lecture.location || 'Location TBA'}
                      </p>
                    </div>
                    <div className="flex sm:flex-col items-start sm:items-end sm:text-right gap-2 sm:gap-1">
                      <StatusBadge status={lecture.status} />
                      <div className="text-xs text-gray-500 space-y-0.5">
                        {lecture.student_count !== undefined && lecture.student_count > 0 && (
                          <p>{lecture.student_count} students</p>
                        )}
                        {lecture.intake && (
                          <p>Intake {lecture.intake}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {hasMoreLectures && (
                <button
                  onClick={() => setShowAllLectures(true)}
                  className="mt-4 w-full py-2 px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-lg transition-colors duration-200 text-sm"
                >
                  Show More ({todaysLectures.length - 3} more lectures)
                </button>
              )}
            </>
          )}
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg border p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Recent Activities</h2>
            <AlertCircle className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3 sm:space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.activity}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Show All Lectures Modal */}
      {showAllLectures && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                  All Today's Lectures
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Total: {todaysLectures.length} lectures scheduled
                </p>
              </div>
              <button
                onClick={() => setShowAllLectures(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto flex-1 p-4 sm:p-6">
              <div className="space-y-3">
                {todaysLectures.map((lecture, index) => (
                  <div 
                    key={lecture._id || index} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg gap-3 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2">
                        <span className="text-sm font-semibold text-gray-500 mt-0.5">
                          {index + 1}.
                        </span>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {lecture.subject}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {lecture.lecturer_name || 'Lecturer TBA'}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {lecture.displayTime}
                            </span>
                            {lecture.location && (
                              <span>• {lecture.location}</span>
                            )}
                            {lecture.lecture_code && (
                              <span>• Code: {lecture.lecture_code}</span>
                            )}
                            {lecture.intake && (
                              <span>• Intake {lecture.intake}</span>
                            )}
                            {lecture.student_count !== undefined && lecture.student_count > 0 && (
                              <span>• {lecture.student_count} students</span>
                            )}
                            {lecture.department && (
                              <span>• {lecture.department}</span>
                            )}
                          </div>
                          {lecture.streams && lecture.streams.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {lecture.streams.map((stream, i) => (
                                <span 
                                  key={i}
                                  className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs"
                                >
                                  {stream}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex sm:flex-col items-start sm:items-end gap-2 sm:gap-2">
                      <StatusBadge status={lecture.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t p-4 sm:p-6 bg-gray-50">
              <button
                onClick={() => setShowAllLectures(false)}
                className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}