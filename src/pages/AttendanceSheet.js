import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import attendanceService from '../services/attendanceService';
import { Printer, ArrowLeft, Calendar, Clock, BookOpen, User } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';

const AttendanceSheet = () => {
  const { lectureId, date } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attendanceData, setAttendanceData] = useState(null);

  usePageTitle(`Attendance - ${lectureId || 'Lecture'}`);

  useEffect(() => {
    fetchAttendanceData();
  }, [lectureId, date]);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (date) {
        response = await attendanceService.getAttendanceByLectureAndDate(lectureId, date);
      } else {
        response = await attendanceService.getAttendanceByLecture(lectureId);
      }
      
      setAttendanceData(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load attendance data');
      console.error('Error fetching attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading attendance data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full">
          <div className="text-red-600 text-center">
            <p className="text-lg font-semibold mb-2">Error Loading Attendance</p>
            <p className="text-sm">{error}</p>
            <button
              onClick={handleBack}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!attendanceData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">No attendance data available</p>
      </div>
    );
  }

  const { lecture_info, summary, attendance } = attendanceData;

  const AttendanceTable = ({ title, students, department, totalStudents, absentCount }) => (
    <div className="mb-8 break-inside-avoid">
      <h3 className="text-lg font-bold mb-3 text-gray-800 border-b-2 border-gray-300 pb-2">
        {title}
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">No.</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Index Number</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Student Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Email</th>
              <th className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold">Status</th>
              <th className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold">Time</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((student, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 text-sm">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm font-medium">{student.index_number}</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">{student.student_name}</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">{student.student_email}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Present
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-center text-gray-600">
                    {student.marked_at ? new Date(student.marked_at).toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    }) : 'N/A'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                  No students marked attendance for {department}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex justify-end space-x-6 text-sm">
        <p className="font-semibold">
          Total Present: <span className="text-green-600">{students.length}</span>
        </p>
        <p className="font-semibold">
          Total Absent: <span className="text-red-600">{absentCount}</span>
        </p>
        <p className="font-semibold">
          Total Students: <span className="text-gray-700">{totalStudents}</span>
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Print-hidden navigation */}
      <div className="print:hidden bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 print:shadow-none print:mb-4">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Attendance Sheet</h1>
            <p className="text-gray-600">KDU - MA Attendance Hub</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <p className="text-xs text-gray-500 uppercase">Date</p>
                <p className="font-semibold text-gray-900">
                  {attendanceData.date || new Date().toISOString().split('T')[0]}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <Clock className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <p className="text-xs text-gray-500 uppercase">Time</p>
                <p className="font-semibold text-gray-900">
                  {lecture_info?.start_time || 'N/A'} - {lecture_info?.end_time || 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <BookOpen className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <p className="text-xs text-gray-500 uppercase">Module Name</p>
                <p className="font-semibold text-gray-900">
                  {lecture_info?.lecture_name || 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <BookOpen className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <p className="text-xs text-gray-500 uppercase">Subject Code</p>
                <p className="font-semibold text-gray-900">
                  {lecture_info?.lecture_code || lectureId}
                </p>
              </div>
            </div>

            <div className="flex items-center md:col-span-2">
              <User className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <p className="text-xs text-gray-500 uppercase">Lecturer</p>
                <p className="font-semibold text-gray-900">
                  {lecture_info?.lecturer_name || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Tables */}
        <div className="bg-white rounded-lg shadow-md p-6 print:shadow-none">
          {/* CS Department */}
          {attendance?.cs && (
            <AttendanceTable
              title="Computer Science (CS) Department"
              students={attendance.cs}
              department="CS"
              totalStudents={summary?.cs?.total || 0}
              absentCount={summary?.cs?.absent || 0}
            />
          )}

          {/* SE Department */}
          {attendance?.se && (
            <AttendanceTable
              title="Software Engineering (SE) Department"
              students={attendance.se}
              department="SE"
              totalStudents={summary?.se?.total || 0}
              absentCount={summary?.se?.absent || 0}
            />
          )}

          {/* CE Department */}
          {attendance?.ce && (
            <AttendanceTable
              title="Computer Engineering (CE) Department"
              students={attendance.ce}
              department="CE"
              totalStudents={summary?.ce?.total || 0}
              absentCount={summary?.ce?.absent || 0}
            />
          )}

          {/* Overall Summary */}
          <div className="mt-8 pt-6 border-t-2 border-gray-300">
            <h3 className="text-xl font-bold mb-4">Overall Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Total Present</p>
                <p className="text-3xl font-bold text-green-600">{summary?.total_present || 0}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Total Absent</p>
                <p className="text-3xl font-bold text-red-600">
                  {(summary?.cs?.absent || 0) + (summary?.se?.absent || 0) + (summary?.ce?.absent || 0)}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Total Students</p>
                <p className="text-3xl font-bold text-blue-600">
                  {(summary?.cs?.total || 0) + (summary?.se?.total || 0) + (summary?.ce?.total || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer for print */}
        <div className="hidden print:block mt-8 pt-4 border-t text-center text-sm text-gray-600">
          <p>Generated on {new Date().toLocaleString()}</p>
          <p className="mt-1">KDU - MA Attendance Hub</p>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .break-inside-avoid {
            break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
};

export default AttendanceSheet;
