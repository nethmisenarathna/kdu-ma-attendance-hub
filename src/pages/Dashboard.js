import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Clock,
  TrendingUp,
  AlertCircle,
  X,
  FileText
} from 'lucide-react';
import { StatsCard } from '../components/StatsCard';
import { StatusBadge } from '../components/StatusBadge';
import { lectureService } from '../services/lectureService';
import { dashboardService } from '../services/dashboardService';
import statsService from '../services/statsService';

export default function Dashboard() {
  const navigate = useNavigate();
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
    },
    courses: {
      total: 0,
      changeText: 'Loading...',
      changeType: 'neutral'
    },
    completionRate: {
      value: 'Loading...',
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
        
        // Fetch real dashboard stats from stats service
        const statsResponse = await statsService.getDashboardStats();
        if (statsResponse) {
          setDashboardStats({
            students: {
              total: statsResponse.students.total,
              changeText: statsResponse.students.changeText,
              changeType: statsResponse.students.changeType
            },
            lecturers: {
              total: 0, // Keep existing lecturer count or fetch separately
              changeText: 'N/A',
              changeType: 'neutral'
            },
            courses: {
              total: statsResponse.courses.total,
              changeText: statsResponse.courses.changeText,
              changeType: statsResponse.courses.changeType
            },
            completionRate: {
              value: statsResponse.completionRate.value,
              changeText: statsResponse.completionRate.changeText,
              changeType: statsResponse.completionRate.changeType
            }
          });
        }
        
        // Optionally still fetch lecturers from old endpoint if needed
        try {
          const dashboardResponse = await dashboardService.getDashboardStats();
          if (dashboardResponse.success && dashboardResponse.data) {
            setDashboardStats(prev => ({
              ...prev,
              lecturers: {
                total: dashboardResponse.data.lecturers.total,
                changeText: dashboardResponse.data.lecturers.changeText,
                changeType: dashboardResponse.data.lecturers.changeType
              }
            }));
          }
        } catch (error) {
          console.log('Old dashboard service not available:', error);
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

  // Handler to navigate to attendance sheet
  const handleViewAttendance = (lecture) => {
    const today = new Date().toISOString().split('T')[0];
    const lectureId = lecture.lecture_id || lecture.lecture_code;
    navigate(`/attendance/${lectureId}/${today}`);
  };

  // Get first 3 lectures for display
  const displayedLectures = showAllLectures ? todaysLectures : todaysLectures.slice(0, 6);
  const hasMoreLectures = todaysLectures.length > 6;

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
          title="Active Courses"
          value={loading ? "..." : dashboardStats.courses.total.toString()}
          icon={BookOpen}
          change={loading ? "Loading..." : dashboardStats.courses.changeText}
          changeType={dashboardStats.courses.changeType}
        />
        <StatsCard
          title="Today's Lectures"
          value={loading ? "..." : lectureStats.todaysLectures.toString()}
          icon={Clock}
          change={loading ? "Loading..." : `${lectureStats.ongoingLectures} ongoing now`}
          changeType="neutral"
        />
        <StatsCard
          title="Completion Rate"
          value={loading ? "..." : dashboardStats.completionRate.value}
          icon={TrendingUp}
          change={loading ? "Loading..." : dashboardStats.completionRate.changeText}
          changeType={dashboardStats.completionRate.changeType}
        />
      </div>

      {/* Today's Lectures - Full Width */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {displayedLectures.map((lecture, index) => (
                <div 
                  key={lecture._id || index} 
                  onClick={() => handleViewAttendance(lecture)}
                  className="flex flex-col p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors duration-200 border border-transparent hover:border-blue-200"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-gray-900 truncate flex-1">{lecture.subject}</h3>
                      <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    </div>
                    <p className="text-sm text-gray-600 truncate mb-1">
                      {lecture.lecturer_name || 'Lecturer TBA'}
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      {lecture.displayTime}
                    </p>
                    <p className="text-xs text-gray-500 mb-3">
                      {lecture.location || 'Location TBA'}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <StatusBadge status={lecture.status} />
                    <div className="text-xs text-gray-500 text-right">
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
            
            {hasMoreLectures && !showAllLectures && (
              <button
                onClick={() => setShowAllLectures(true)}
                className="mt-4 w-full py-2 px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-lg transition-colors duration-200 text-sm"
              >
                Show All Lectures ({todaysLectures.length} total)
              </button>
            )}
            
            {showAllLectures && todaysLectures.length > 6 && (
              <button
                onClick={() => setShowAllLectures(false)}
                className="mt-4 w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200 text-sm"
              >
                Show Less
              </button>
            )}
          </>
        )}
      </div>

      {/* Removed Modal - Now using inline expansion */}
    </div>
  );
}