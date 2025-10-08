import React from 'react';
import { FileText, Download, TrendingUp, Users, BookOpen } from 'lucide-react';
import { StatsCard } from '../components/StatsCard';

const reportsData = [
  {
    id: 1,
    name: "Student Enrollment Report",
    description: "Detailed report of student enrollments by course and semester",
    lastGenerated: "2024-01-10",
    type: "PDF",
    size: "2.5 MB"
  },
  {
    id: 2,
    name: "Faculty Performance Report",
    description: "Analysis of lecturer performance and student feedback",
    lastGenerated: "2024-01-08",
    type: "Excel",
    size: "1.8 MB"
  },
  {
    id: 3,
    name: "Attendance Summary",
    description: "Monthly attendance summary for all courses",
    lastGenerated: "2024-01-05",
    type: "PDF",
    size: "950 KB"
  },
];

export default function Reports() {
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
          value="24"
          icon={FileText}
          change="+2 this month"
          changeType="positive"
        />
        <StatsCard
          title="Downloads"
          value="156"
          icon={Download}
          change="+12 this week"
          changeType="positive"
        />
        <StatsCard
          title="Report Types"
          value="8"
          icon={TrendingUp}
          change="Available formats"
          changeType="neutral"
        />
      </div>

      <div className="bg-white shadow-sm rounded-lg border">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Available Reports</h3>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium">
              Generate New Report
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {reportsData.map((report) => (
            <div key={report.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{report.name}</h4>
                  <p className="text-sm text-gray-500 mt-1">{report.description}</p>
                  <div className="flex items-center mt-2 text-xs text-gray-400">
                    <span>Last generated: {report.lastGenerated}</span>
                    <span className="mx-2">•</span>
                    <span>{report.type}</span>
                    <span className="mx-2">•</span>
                    <span>{report.size}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </button>
                  <button className="inline-flex items-center px-3 py-1 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100">
                    Regenerate
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}