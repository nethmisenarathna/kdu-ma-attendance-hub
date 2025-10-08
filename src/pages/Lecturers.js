import React from 'react';
import { StatusBadge } from '../components/StatusBadge';

const lecturersData = [
  {
    id: 1,
    name: "Dr. Smith Johnson",
    employeeId: "EMP001",
    department: "Computer Science",
    specialization: "Algorithms & Data Structures",
    email: "smith.johnson@kdu.ac.lk",
    phone: "+94 77 987 6543",
    status: "active",
    experience: "8 years"
  },
  {
    id: 2,
    name: "Prof. Sarah Wilson",
    employeeId: "EMP002",
    department: "Information Technology",
    specialization: "Database Systems",
    email: "sarah.wilson@kdu.ac.lk",
    phone: "+94 77 876 5432",
    status: "active",
    experience: "12 years"
  },
  {
    id: 3,
    name: "Dr. Michael Chen",
    employeeId: "EMP003",
    department: "Computer Science",
    specialization: "Machine Learning",
    email: "michael.chen@kdu.ac.lk",
    phone: "+94 77 765 4321",
    status: "active",
    experience: "6 years"
  },
];

export default function Lecturers() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lecturers</h1>
          <p className="mt-2 text-gray-600">Manage faculty members and their information</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium">
          Add Lecturer
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg border">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lecturer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Experience
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {lecturersData.map((lecturer) => (
                <tr key={lecturer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{lecturer.name}</div>
                      <div className="text-sm text-gray-500">{lecturer.employeeId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{lecturer.department}</div>
                    <div className="text-sm text-gray-500">{lecturer.specialization}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{lecturer.email}</div>
                    <div className="text-sm text-gray-500">{lecturer.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{lecturer.experience}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={lecturer.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}