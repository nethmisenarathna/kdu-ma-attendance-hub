import React, { useState, useMemo } from 'react';
import { StatusBadge } from '../components/StatusBadge';
import { Search, Grid, List, ArrowUpDown, Plus, X } from 'lucide-react';

// Enhanced lectures data
const lecturesData = [
  {
    id: 1,
    lecture_code: "CS401",
    subject: "Advanced Algorithms",
    lecturer: "Dr. Smith Johnson",
    lecturer_id: "EMP001",
    date: "2024-01-15",
    time: "09:00 - 11:00",
    room: "Lab 101",
    department: "Computer Science",
    course_code: "CS401",
    semester: "7th Semester",
    status: "ongoing",
    enrolled_students: 45,
    max_capacity: 50,
    duration: "2 hours",
    attendance_marked: true,
    attendance_count: 42,
    attendance_percentage: 93.3
  },
  {
    id: 2,
    lecture_code: "CS301",
    subject: "Database Systems",
    lecturer: "Prof. Sarah Wilson",
    lecturer_id: "EMP002",
    date: "2024-01-15",
    time: "11:30 - 13:30",
    room: "Room 204",
    department: "Computer Science",
    course_code: "CS301",
    semester: "5th Semester",
    status: "scheduled",
    enrolled_students: 38,
    max_capacity: 40,
    duration: "2 hours",
    attendance_marked: false,
    attendance_count: 0,
    attendance_percentage: 0
  },
  {
    id: 3,
    lecture_code: "CS501",
    subject: "Machine Learning",
    lecturer: "Dr. Michael Chen",
    lecturer_id: "EMP003",
    date: "2024-01-15",
    time: "14:00 - 16:00",
    room: "Lab 205",
    department: "Computer Science",
    course_code: "CS501",
    semester: "8th Semester",
    status: "scheduled",
    enrolled_students: 42,
    max_capacity: 45,
    duration: "2 hours",
    attendance_marked: false,
    attendance_count: 0,
    attendance_percentage: 0
  },
  {
    id: 4,
    lecture_code: "IT201",
    subject: "Web Development",
    lecturer: "Ms. Emily Davis",
    lecturer_id: "EMP004",
    date: "2024-01-16",
    time: "10:00 - 12:00",
    room: "Lab 102",
    department: "Information Technology",
    course_code: "IT201",
    semester: "3rd Semester",
    status: "completed",
    enrolled_students: 35,
    max_capacity: 40,
    duration: "2 hours",
    attendance_marked: true,
    attendance_count: 33,
    attendance_percentage: 94.3
  },
  {
    id: 5,
    lecture_code: "SE301",
    subject: "Software Engineering",
    lecturer: "Dr. Robert Kumar",
    lecturer_id: "EMP005",
    date: "2024-01-16",
    time: "13:00 - 15:00",
    room: "Room 301",
    department: "Software Engineering",
    course_code: "SE301",
    semester: "5th Semester",
    status: "cancelled",
    enrolled_students: 28,
    max_capacity: 30,
    duration: "2 hours",
    attendance_marked: false,
    attendance_count: 0,
    attendance_percentage: 0
  },
  {
    id: 6,
    lecture_code: "BS101",
    subject: "Business Fundamentals",
    lecturer: "Prof. Lisa Anderson",
    lecturer_id: "EMP006",
    date: "2024-01-17",
    time: "09:30 - 11:30",
    room: "Room 401",
    department: "Business Studies",
    course_code: "BS101",
    semester: "1st Semester",
    status: "scheduled",
    enrolled_students: 55,
    max_capacity: 60,
    duration: "2 hours",
    attendance_marked: false,
    attendance_count: 0,
    attendance_percentage: 0
  },
  {
    id: 7,
    lecture_code: "EN201",
    subject: "Engineering Mathematics",
    lecturer: "Dr. James Wilson",
    lecturer_id: "EMP007",
    date: "2024-01-17",
    time: "12:00 - 14:00",
    room: "Room 501",
    department: "Engineering",
    course_code: "EN201",
    semester: "3rd Semester",
    status: "ongoing",
    enrolled_students: 48,
    max_capacity: 50,
    duration: "2 hours",
    attendance_marked: false,
    attendance_count: 45,
    attendance_percentage: 93.8
  },
  {
    id: 8,
    lecture_code: "CS402",
    subject: "Computer Networks",
    lecturer: "Dr. Amanda Taylor",
    lecturer_id: "EMP008",
    date: "2024-01-18",
    time: "08:00 - 10:00",
    room: "Lab 301",
    department: "Computer Science",
    course_code: "CS402",
    semester: "7th Semester",
    status: "scheduled",
    enrolled_students: 33,
    max_capacity: 35,
    duration: "2 hours",
    attendance_marked: false,
    attendance_count: 0,
    attendance_percentage: 0
  },
  {
    id: 9,
    lecture_code: "IT401",
    subject: "Mobile App Development",
    lecturer: "Mr. David Brown",
    lecturer_id: "EMP009",
    date: "2024-01-18",
    time: "15:00 - 17:00",
    room: "Lab 401",
    department: "Information Technology",
    course_code: "IT401",
    semester: "7th Semester",
    status: "completed",
    enrolled_students: 25,
    max_capacity: 30,
    duration: "2 hours",
    attendance_marked: true,
    attendance_count: 24,
    attendance_percentage: 96.0
  },
  {
    id: 10,
    lecture_code: "SE401",
    subject: "Project Management",
    lecturer: "Prof. Jennifer Garcia",
    lecturer_id: "EMP010",
    date: "2024-01-19",
    time: "11:00 - 13:00",
    room: "Room 201",
    department: "Software Engineering",
    course_code: "SE401",
    semester: "7th Semester",
    status: "scheduled",
    enrolled_students: 30,
    max_capacity: 35,
    duration: "2 hours",
    attendance_marked: false,
    attendance_count: 0,
    attendance_percentage: 0
  }
];

const Lectures = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    department: '',
    status: '',
    lecturer: '',
    semester: '',
    room: ''
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState('table');
  
  // Modal states
  const [viewingLecture, setViewingLecture] = useState(null);
  const [editingLecture, setEditingLecture] = useState(null);
  const [deletingLecture, setDeletingLecture] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Filter options
  const filterOptions = useMemo(() => {
    const departments = [...new Set(lecturesData.map(lecture => lecture.department))];
    const statuses = [...new Set(lecturesData.map(lecture => lecture.status))];
    const lecturers = [...new Set(lecturesData.map(lecture => lecture.lecturer))];
    const semesters = [...new Set(lecturesData.map(lecture => lecture.semester))];
    const rooms = [...new Set(lecturesData.map(lecture => lecture.room))];

    return {
      departments: departments.sort(),
      statuses: statuses.sort(),
      lecturers: lecturers.sort(),
      semesters: semesters.sort(),
      rooms: rooms.sort()
    };
  }, []);

  // Filter and search logic
  const filteredAndSortedData = useMemo(() => {
    let filtered = lecturesData.filter(lecture => {
      const matchesSearch = searchTerm === '' || 
        lecture.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lecture.lecturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lecture.lecture_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lecture.course_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lecture.room.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilters = 
        (filters.department === '' || lecture.department === filters.department) &&
        (filters.status === '' || lecture.status === filters.status) &&
        (filters.lecturer === '' || lecture.lecturer === filters.lecturer) &&
        (filters.semester === '' || lecture.semester === filters.semester) &&
        (filters.room === '' || lecture.room === filters.room);

      return matchesSearch && matchesFilters;
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === 'date') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        } else if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [searchTerm, filters, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedData, currentPage, itemsPerPage]);

  // Event handlers
  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      department: '',
      status: '',
      lecturer: '',
      semester: '',
      room: ''
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleView = (lecture) => {
    setViewingLecture(lecture);
  };

  const handleEdit = (lecture) => {
    setEditingLecture(lecture);
  };

  const handleDelete = (lecture) => {
    setDeletingLecture(lecture);
  };

  const handleSaveLecture = (updatedLecture) => {
    // In a real app, this would make an API call
    console.log('Saving lecture:', updatedLecture);
    setEditingLecture(null);
  };

  const handleAddLecture = (newLecture) => {
    // In a real app, this would make an API call
    console.log('Adding lecture:', newLecture);
    setShowAddModal(false);
  };

  const confirmDelete = () => {
    // In a real app, this would make an API call
    console.log('Deleting lecture:', deletingLecture);
    setDeletingLecture(null);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lectures</h1>
          <p className="mt-2 text-gray-600">Manage lecture schedules and sessions</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          {/* View Toggle - Desktop only */}
          <div className="hidden lg:flex border border-gray-300 rounded-md">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-2 text-sm font-medium rounded-l-md ${
                viewMode === 'table' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 text-sm font-medium rounded-r-md ${
                viewMode === 'list' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Schedule Lecture
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border p-4 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by subject, lecturer, course code, or room..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap gap-3">
            <select
              value={filters.department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Departments</option>
              {filterOptions.departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              {filterOptions.statuses.map(status => (
                <option key={status} value={status}>
                  {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
                </option>
              ))}
            </select>

            <select
              value={filters.lecturer}
              onChange={(e) => handleFilterChange('lecturer', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Lecturers</option>
              {filterOptions.lecturers.map(lecturer => (
                <option key={lecturer} value={lecturer}>{lecturer}</option>
              ))}
            </select>

            <select
              value={filters.semester}
              onChange={(e) => handleFilterChange('semester', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Semesters</option>
              {filterOptions.semesters.map(semester => (
                <option key={semester} value={semester}>{semester}</option>
              ))}
            </select>

            <select
              value={filters.room}
              onChange={(e) => handleFilterChange('room', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Rooms</option>
              {filterOptions.rooms.map(room => (
                <option key={room} value={room}>{room}</option>
              ))}
            </select>

            <button
              onClick={clearFilters}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing {paginatedData.length} of {filteredAndSortedData.length} lectures
            {filteredAndSortedData.length !== lecturesData.length && ` (filtered from ${lecturesData.length} total)`}
          </span>
          <div className="flex items-center gap-2">
            <span>Items per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded px-2 py-1"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      {viewMode === 'table' && (
        <div className="hidden lg:block bg-white shadow-sm rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('lecture_code')}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Code
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('subject')}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Subject
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('lecturer')}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Lecturer
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('date')}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Schedule
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('room')}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Room
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('department')}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Department
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Students
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('status')}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Status
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.map((lecture) => (
                  <tr key={lecture.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {lecture.lecture_code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{lecture.subject}</div>
                      <div className="text-sm text-gray-500">{lecture.semester}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lecture.lecturer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lecture.date}</div>
                      <div className="text-sm text-gray-500">{lecture.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lecture.room}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lecture.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {lecture.enrolled_students}/{lecture.max_capacity}
                      </div>
                      <div className="text-sm text-gray-500">
                        {Math.round((lecture.enrolled_students / lecture.max_capacity) * 100)}% full
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {lecture.attendance_marked ? (
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {lecture.attendance_count}/{lecture.enrolled_students}
                          </div>
                          <div className="text-sm text-gray-500">
                            {lecture.attendance_percentage.toFixed(1)}%
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Not marked</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={lecture.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleView(lecture)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEdit(lecture)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(lecture)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Mobile List View */}
      <div className="lg:hidden bg-white shadow-sm rounded-lg border">
        <div className="divide-y divide-gray-200">
          {paginatedData.map((lecture) => (
            <div key={lecture.id} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{lecture.subject}</h3>
                  <p className="text-xs text-gray-500">{lecture.lecture_code} • {lecture.semester}</p>
                </div>
                <StatusBadge status={lecture.status} />
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Lecturer:</span>
                  <span className="text-gray-900">{lecture.lecturer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Schedule:</span>
                  <span className="text-gray-900">{lecture.date} • {lecture.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Room:</span>
                  <span className="text-gray-900">{lecture.room}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Department:</span>
                  <span className="text-gray-900">{lecture.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Students:</span>
                  <span className="text-gray-900">
                    {lecture.enrolled_students}/{lecture.max_capacity} 
                    ({Math.round((lecture.enrolled_students / lecture.max_capacity) * 100)}% full)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Attendance:</span>
                  <span className="text-gray-900">
                    {lecture.attendance_marked 
                      ? `${lecture.attendance_count}/${lecture.enrolled_students} (${lecture.attendance_percentage.toFixed(1)}%)`
                      : 'Not marked'
                    }
                  </span>
                </div>
              </div>

              <div className="mt-4 flex space-x-3">
                <button
                  onClick={() => handleView(lecture)}
                  className="flex-1 text-center py-2 px-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  View
                </button>
                <button
                  onClick={() => handleEdit(lecture)}
                  className="flex-1 text-center py-2 px-3 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(lecture)}
                  className="text-center py-2 px-3 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-lg border px-4 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-700">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedData.length)} of {filteredAndSortedData.length} results
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <div className="flex space-x-1">
                {getPageNumbers().map((pageNum, index) => (
                  pageNum === '...' ? (
                    <span key={index} className="px-3 py-2 text-sm text-gray-500">...</span>
                  ) : (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        currentPage === pageNum
                          ? 'text-white bg-blue-600 border border-blue-600'
                          : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                ))}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {viewingLecture && (
        <ViewLectureModal
          lecture={viewingLecture}
          onClose={() => setViewingLecture(null)}
        />
      )}

      {editingLecture && (
        <EditLectureModal
          lecture={editingLecture}
          onSave={handleSaveLecture}
          onClose={() => setEditingLecture(null)}
        />
      )}

      {deletingLecture && (
        <DeleteConfirmModal
          lectureName={deletingLecture.subject}
          onConfirm={confirmDelete}
          onClose={() => setDeletingLecture(null)}
        />
      )}

      {showAddModal && (
        <AddLectureModal
          onSave={handleAddLecture}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
};

// Modal Components
const ViewLectureModal = ({ lecture, onClose }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
      <div className="mt-3">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Lecture Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Lecture Code</label>
              <p className="mt-1 text-sm text-gray-900">{lecture.lecture_code}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Subject</label>
              <p className="mt-1 text-sm text-gray-900">{lecture.subject}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Lecturer</label>
              <p className="mt-1 text-sm text-gray-900">{lecture.lecturer}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Department</label>
              <p className="mt-1 text-sm text-gray-900">{lecture.department}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Course Code</label>
              <p className="mt-1 text-sm text-gray-900">{lecture.course_code}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Semester</label>
              <p className="mt-1 text-sm text-gray-900">{lecture.semester}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Date</label>
              <p className="mt-1 text-sm text-gray-900">{lecture.date}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Time</label>
              <p className="mt-1 text-sm text-gray-900">{lecture.time}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Room</label>
              <p className="mt-1 text-sm text-gray-900">{lecture.room}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Duration</label>
              <p className="mt-1 text-sm text-gray-900">{lecture.duration}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Students</label>
              <p className="mt-1 text-sm text-gray-900">
                {lecture.enrolled_students}/{lecture.max_capacity} 
                ({Math.round((lecture.enrolled_students / lecture.max_capacity) * 100)}% capacity)
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Attendance</label>
              <p className="mt-1 text-sm text-gray-900">
                {lecture.attendance_marked 
                  ? `${lecture.attendance_count}/${lecture.enrolled_students} (${lecture.attendance_percentage.toFixed(1)}%)`
                  : 'Not marked yet'
                }
              </p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-500">Status</label>
              <div className="mt-1">
                <StatusBadge status={lecture.status} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const EditLectureModal = ({ lecture, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    lecture_code: lecture.lecture_code,
    subject: lecture.subject,
    lecturer: lecture.lecturer,
    lecturer_id: lecture.lecturer_id,
    date: lecture.date,
    time: lecture.time,
    room: lecture.room,
    department: lecture.department,
    course_code: lecture.course_code,
    semester: lecture.semester,
    enrolled_students: lecture.enrolled_students,
    max_capacity: lecture.max_capacity,
    duration: lecture.duration,
    status: lecture.status
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...lecture, ...formData });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Edit Lecture</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Lecture Code</label>
                <input
                  type="text"
                  value={formData.lecture_code}
                  onChange={(e) => setFormData({...formData, lecture_code: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Lecturer</label>
                <input
                  type="text"
                  value={formData.lecturer}
                  onChange={(e) => setFormData({...formData, lecturer: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Time</label>
                <input
                  type="text"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  placeholder="e.g., 09:00 - 11:00"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Room</label>
                <input
                  type="text"
                  value={formData.room}
                  onChange={(e) => setFormData({...formData, room: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Department</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Business Studies">Business Studies</option>
                  <option value="Engineering">Engineering</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Course Code</label>
                <input
                  type="text"
                  value={formData.course_code}
                  onChange={(e) => setFormData({...formData, course_code: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Semester</label>
                <select
                  value={formData.semester}
                  onChange={(e) => setFormData({...formData, semester: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Semester</option>
                  <option value="1st Semester">1st Semester</option>
                  <option value="2nd Semester">2nd Semester</option>
                  <option value="3rd Semester">3rd Semester</option>
                  <option value="4th Semester">4th Semester</option>
                  <option value="5th Semester">5th Semester</option>
                  <option value="6th Semester">6th Semester</option>
                  <option value="7th Semester">7th Semester</option>
                  <option value="8th Semester">8th Semester</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Enrolled Students</label>
                <input
                  type="number"
                  value={formData.enrolled_students}
                  onChange={(e) => setFormData({...formData, enrolled_students: parseInt(e.target.value)})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Max Capacity</label>
                <input
                  type="number"
                  value={formData.max_capacity}
                  onChange={(e) => setFormData({...formData, max_capacity: parseInt(e.target.value)})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Duration</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  placeholder="e.g., 2 hours"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const AddLectureModal = ({ onSave, onClose }) => {
  const [formData, setFormData] = useState({
    lecture_code: '',
    subject: '',
    lecturer: '',
    lecturer_id: '',
    date: '',
    time: '',
    room: '',
    department: '',
    course_code: '',
    semester: '',
    enrolled_students: 0,
    max_capacity: 0,
    duration: '',
    status: 'scheduled'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Schedule New Lecture</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Lecture Code</label>
                <input
                  type="text"
                  value={formData.lecture_code}
                  onChange={(e) => setFormData({...formData, lecture_code: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Lecturer</label>
                <input
                  type="text"
                  value={formData.lecturer}
                  onChange={(e) => setFormData({...formData, lecturer: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Time</label>
                <input
                  type="text"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  placeholder="e.g., 09:00 - 11:00"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Room</label>
                <input
                  type="text"
                  value={formData.room}
                  onChange={(e) => setFormData({...formData, room: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Department</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Business Studies">Business Studies</option>
                  <option value="Engineering">Engineering</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Course Code</label>
                <input
                  type="text"
                  value={formData.course_code}
                  onChange={(e) => setFormData({...formData, course_code: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Semester</label>
                <select
                  value={formData.semester}
                  onChange={(e) => setFormData({...formData, semester: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Semester</option>
                  <option value="1st Semester">1st Semester</option>
                  <option value="2nd Semester">2nd Semester</option>
                  <option value="3rd Semester">3rd Semester</option>
                  <option value="4th Semester">4th Semester</option>
                  <option value="5th Semester">5th Semester</option>
                  <option value="6th Semester">6th Semester</option>
                  <option value="7th Semester">7th Semester</option>
                  <option value="8th Semester">8th Semester</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Enrolled Students</label>
                <input
                  type="number"
                  value={formData.enrolled_students}
                  onChange={(e) => setFormData({...formData, enrolled_students: parseInt(e.target.value) || 0})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Max Capacity</label>
                <input
                  type="number"
                  value={formData.max_capacity}
                  onChange={(e) => setFormData({...formData, max_capacity: parseInt(e.target.value) || 0})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Duration</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  placeholder="e.g., 2 hours"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                Schedule Lecture
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const DeleteConfirmModal = ({ lectureName, onConfirm, onClose }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div className="mt-3 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <X className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Cancel Lecture</h3>
        <p className="text-sm text-gray-500 mb-4">
          Are you sure you want to cancel <strong>{lectureName}</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-center space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Keep Lecture
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
          >
            Cancel Lecture
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default Lectures;