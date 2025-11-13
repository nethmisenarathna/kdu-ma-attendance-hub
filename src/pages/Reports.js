import React, { useState, useEffect } from 'react';
import { FileText, Download, TrendingUp, X } from 'lucide-react';
import { StatsCard } from '../components/StatsCard';
import { getReportStats, generateReport, downloadReport } from '../services/reportService';
import { usePageTitle } from '../hooks/usePageTitle';

const reportsData = [
  {
    id: 1,
    name: "Attendance Summary",
    description: "Semester attendance summary for all courses",
    type: "attendance_summary",
  },
  {
    id: 2,
    name: "Monthly Summary",
    description: "Monthly attendance summary by stream",
    type: "monthly_summary",
  },
];

export default function Reports() {
  usePageTitle('Reports');
  const [stats, setStats] = useState({
    totalReports: 0,
    totalDownloads: 0,
    reportTypes: 2
  });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'download' or 'regenerate'
  const [selectedReport, setSelectedReport] = useState(null);
  const [formData, setFormData] = useState({
    stream: 'CS',
    startDate: '',
    endDate: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await getReportStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleOpenModal = (report, type) => {
    setSelectedReport(report);
    setModalType(type);
    setShowModal(true);
    
    // Set default dates for attendance summary
    if (report.type === 'attendance_summary') {
      const today = new Date();
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(today.getMonth() - 6);
      
      setFormData(prev => ({
        ...prev,
        startDate: sixMonthsAgo.toISOString().split('T')[0],
        endDate: today.toISOString().split('T')[0]
      }));
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedReport(null);
    setModalType('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const reportData = {
        type: selectedReport.type,
        stream: formData.stream,
      };

      if (selectedReport.type === 'attendance_summary') {
        reportData.startDate = formData.startDate;
        reportData.endDate = formData.endDate;
      } else if (selectedReport.type === 'monthly_summary') {
        reportData.month = formData.month;
        reportData.year = formData.year;
      }

      if (modalType === 'regenerate') {
        const response = await generateReport(reportData);
        if (response.success) {
          alert('Report regenerated successfully!');
          fetchStats(); // Refresh stats
        }
      } else if (modalType === 'download') {
        await downloadReport(reportData);
        fetchStats(); // Refresh stats
      }

      handleCloseModal();
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <p className="mt-2 text-gray-600">Generate and download various reports</p>
      </div>

      {/* Report Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Reports"
          value={stats.totalReports.toString()}
          icon={FileText}
          change="Generated reports"
          changeType="neutral"
        />
        <StatsCard
          title="Downloads"
          value={stats.totalDownloads.toString()}
          icon={Download}
          change="Total downloads"
          changeType="neutral"
        />
        <StatsCard
          title="Report Types"
          value={stats.reportTypes.toString()}
          icon={TrendingUp}
          change="Available formats"
          changeType="neutral"
        />
      </div>

      <div className="bg-white shadow-sm rounded-lg border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Available Reports</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {reportsData.map((report) => (
            <div key={report.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{report.name}</h4>
                  <p className="text-sm text-gray-500 mt-1">{report.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleOpenModal(report, 'download')}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </button>
                  <button 
                    onClick={() => handleOpenModal(report, 'regenerate')}
                    className="inline-flex items-center px-3 py-1 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
                  >
                    Regenerate
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                {modalType === 'download' ? 'Download' : 'Regenerate'} {selectedReport?.name}
              </h3>
              <button 
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
              {/* Stream Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stream
                </label>
                <select
                  name="stream"
                  value={formData.stream}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="CS">Computer Science (CS)</option>
                  <option value="SE">Software Engineering (SE)</option>
                  <option value="CE">Computer Engineering (CE)</option>
                </select>
              </div>

              {/* Attendance Summary - Date Range */}
              {selectedReport?.type === 'attendance_summary' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </>
              )}

              {/* Monthly Summary - Month Selection */}
              {selectedReport?.type === 'monthly_summary' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Month
                  </label>
                  <select
                    name="month"
                    value={formData.month}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {months.map((month, index) => (
                      <option key={index} value={index + 1}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : modalType === 'download' ? 'Download' : 'Regenerate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}