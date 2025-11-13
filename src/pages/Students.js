import React, { useState, useMemo, useEffect } from 'react';
import { StatusBadge } from '../components/StatusBadge';
import { List, Grid, Search, ArrowUpDown, RefreshCw } from 'lucide-react';
import { studentService } from '../services/studentService';
import { usePageTitle } from '../hooks/usePageTitle';

// Students data will be fetched from API
const studentsDataStatic = [
  {
    id: 1,
    index_number: "KDU/CS/2024/001",
    name: "Alice Johnson",
    email: "alice.johnson@kdu.ac.lk",
    department: "Computer Science",
    intake: "2024",
    stream: "General Computing",
    status: "active"
  },
  {
    id: 2,
    index_number: "KDU/IT/2023/045",
    name: "Bob Smith",
    email: "bob.smith@kdu.ac.lk",
    department: "Information Technology",
    intake: "2023",
    stream: "Network Security",
    status: "active"
  },
  {
    id: 3,
    index_number: "KDU/SE/2024/012",
    name: "Carol Davis",
    email: "carol.davis@kdu.ac.lk",
    department: "Software Engineering",
    intake: "2024",
    stream: "Web Development",
    status: "inactive"
  },
  {
    id: 4,
    index_number: "KDU/CS/2023/089",
    name: "David Wilson",
    email: "david.wilson@kdu.ac.lk",
    department: "Computer Science",
    intake: "2023",
    stream: "Data Science",
    status: "active"
  },
  {
    id: 5,
    index_number: "KDU/IT/2024/023",
    name: "Emma Brown",
    email: "emma.brown@kdu.ac.lk",
    department: "Information Technology",
    intake: "2024",
    stream: "Mobile Development",
    status: "active"
  },
  {
    id: 6,
    index_number: "KDU/CS/2023/156",
    name: "Frank Miller",
    email: "frank.miller@kdu.ac.lk",
    department: "Computer Science",
    intake: "2023",
    stream: "Artificial Intelligence",
    status: "graduated"
  },
  {
    id: 7,
    index_number: "KDU/SE/2024/078",
    name: "Grace Chen",
    email: "grace.chen@kdu.ac.lk",
    department: "Software Engineering",
    intake: "2024",
    stream: "Game Development",
    status: "active"
  },
  {
    id: 8,
    index_number: "KDU/IT/2023/234",
    name: "Henry Taylor",
    email: "henry.taylor@kdu.ac.lk",
    department: "Information Technology",
    intake: "2023",
    stream: "Cybersecurity",
    status: "inactive"
  },
  {
    id: 9,
    index_number: "KDU/CS/2024/091",
    name: "Ivy Anderson",
    email: "ivy.anderson@kdu.ac.lk",
    department: "Computer Science",
    intake: "2024",
    stream: "Machine Learning",
    status: "active"
  },
  {
    id: 10,
    index_number: "KDU/SE/2023/167",
    name: "Jack Wilson",
    email: "jack.wilson@kdu.ac.lk",
    department: "Software Engineering",
    intake: "2023",
    stream: "Mobile Apps",
    status: "graduated"
  },
  {
    id: 11,
    index_number: "KDU/IT/2024/145",
    name: "Kate Roberts",
    email: "kate.roberts@kdu.ac.lk",
    department: "Information Technology",
    intake: "2024",
    stream: "Cloud Computing",
    status: "active"
  },
  {
    id: 12,
    index_number: "KDU/CS/2023/203",
    name: "Liam Garcia",
    email: "liam.garcia@kdu.ac.lk",
    department: "Computer Science",
    intake: "2023",
    stream: "Database Systems",
    status: "active"
  }
];

export default function Students() {
  usePageTitle('Students');
  
  // API Data State
  const [studentsData, setStudentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'list'
  
  // Search and Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    intake: '',
    stream: '',
    status: ''
  });
  
  // Sorting state
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  
  // Modal states
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  // Fetch students data from API
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await studentService.getAllStudents();
        
        if (response.success && response.data) {
          // Transform the API data to match the frontend structure
          const transformedData = response.data.map((student, index) => ({
            id: index + 1, // Add a frontend ID
            index_number: student.index_number,
            name: student.name,
            email: student.email,
            department: student.department,
            intake: student.intake || 'N/A',
            stream: student.stream || 'N/A',
            status: 'active' // Default status since API doesn't have this field
          }));
          setStudentsData(transformedData);
        } else {
          setError('Failed to load students data');
        }
      } catch (err) {
        console.error('Error fetching students:', err);
        setError('Error connecting to server. Make sure the backend is running on port 5000.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudents();
  }, []); // Empty dependency array means this runs once on component mount
  
  // Function to refresh data
  const refreshStudents = () => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await studentService.getAllStudents();
        
        if (response.success && response.data) {
          const transformedData = response.data.map((student, index) => ({
            id: index + 1,
            index_number: student.index_number,
            name: student.name,
            email: student.email,
            department: student.department,
            intake: student.intake || 'N/A',
            stream: student.stream || 'N/A',
            status: 'active'
          }));
          setStudentsData(transformedData);
        }
      } catch (err) {
        setError('Error refreshing data');
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  };
  
  // Get unique values for filter dropdowns
  const filterOptions = useMemo(() => ({
    intakes: [...new Set(studentsData.map(s => s.intake))].sort(),
    streams: [...new Set(studentsData.map(s => s.stream))].sort(),
    statuses: [...new Set(studentsData.map(s => s.status))]
  }), [studentsData]);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = studentsData.filter(student => {
      const matchesSearch = 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.index_number.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilters = 
        (!filters.intake || student.intake === filters.intake) &&
        (!filters.stream || student.stream === filters.stream) &&
        (!filters.status || student.status === filters.status);
      
      return matchesSearch && matchesFilters;
    });

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [studentsData, searchTerm, filters, sortConfig]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Sorting handler
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Filter handlers
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  const clearFilters = () => {
    setFilters({ intake: '', stream: '', status: '' });
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Action handlers
  const handleEdit = (student) => {
    setSelectedStudent(student);
    setShowEditModal(true);
  };

  const handleDelete = (student) => {
    setSelectedStudent(student);
    setShowDeleteConfirm(true);
  };

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setShowDetailsModal(true);
  };

  const confirmDelete = () => {
    // Here you would typically make an API call to delete the student
    console.log('Deleting student:', selectedStudent);
    setShowDeleteConfirm(false);
    setSelectedStudent(null);
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Students</h1>
            <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">Loading student records...</p>
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Students</h1>
            <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">Error loading student records</p>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-red-800 mb-2">Connection Error</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={refreshStudents}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Students</h1>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">Manage student records and information ({studentsData.length} students)</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          {/* View Toggle - Desktop Only */}
          <div className="hidden lg:flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Grid className="h-4 w-4" />
              Table
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="h-4 w-4" />
              List
            </button>
          </div>
          
          <button 
            onClick={refreshStudents}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-md font-medium text-sm transition-colors"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
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
                placeholder="Search by name, email, or index number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap gap-3">
            <select
              value={filters.intake}
              onChange={(e) => handleFilterChange('intake', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Intakes</option>
              {filterOptions.intakes.map(intake => (
                <option key={intake} value={intake}>{intake}</option>
              ))}
            </select>

            <select
              value={filters.stream}
              onChange={(e) => handleFilterChange('stream', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Streams</option>
              {filterOptions.streams.map(stream => (
                <option key={stream} value={stream}>{stream}</option>
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
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
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
            Showing {paginatedData.length} of {filteredAndSortedData.length} students
            {filteredAndSortedData.length !== studentsData.length && ` (filtered from ${studentsData.length} total)`}
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
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('index_number')}
                    className="flex items-center gap-1 hover:text-gray-700"
                  >
                    Index Number
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-1 hover:text-gray-700"
                  >
                    Name
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
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
                  <button
                    onClick={() => handleSort('intake')}
                    className="flex items-center gap-1 hover:text-gray-700"
                  >
                    Intake
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stream
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{student.index_number}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{student.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.department}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.intake}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.stream}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={student.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      )}

      {/* Desktop List View */}
      {viewMode === 'list' && (
        <div className="hidden lg:block space-y-4">
          {paginatedData.map((student) => (
            <div key={student.id} className="bg-white shadow-sm rounded-lg border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                    <p className="text-sm text-gray-600">{student.index_number}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{student.email}</p>
                    <p className="text-sm text-gray-600">{student.department}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Intake: {student.intake}</p>
                    <p className="text-sm text-gray-600">Stream: {student.stream}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <StatusBadge status={student.status} />
                    <button 
                      onClick={() => handleViewDetails(student)}
                      className="text-blue-600 hover:text-blue-900 font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tablet Table View - Horizontal Scroll */}
      <div className="hidden md:block lg:hidden bg-white shadow-sm rounded-lg border">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Index Number
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{student.index_number}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{student.name}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.email}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.department}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <StatusBadge status={student.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {paginatedData.map((student) => (
          <div key={student.id} className="bg-white shadow-sm rounded-lg border p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                <p className="text-sm text-gray-600">{student.index_number}</p>
              </div>
              <StatusBadge status={student.status} />
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">Email:</span>
                <span className="text-sm text-gray-900 truncate ml-2">{student.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">Department:</span>
                <span className="text-sm text-gray-900">{student.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">Intake:</span>
                <span className="text-sm text-gray-900">{student.intake}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">Stream:</span>
                <span className="text-sm text-gray-900">{student.stream}</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <button 
                onClick={() => handleViewDetails(student)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-md text-sm font-medium"
              >
                View Details
              </button>
              <button 
                onClick={() => handleEdit(student)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-md text-sm font-medium"
              >
                Edit
              </button>
              <button 
                onClick={() => handleDelete(student)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-md text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              
              {/* Page numbers */}
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{selectedStudent.name}</strong>? 
              This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showDetailsModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Student Details</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Index Number</label>
                  <p className="text-gray-900">{selectedStudent.index_number}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <p className="text-gray-900">{selectedStudent.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{selectedStudent.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <StatusBadge status={selectedStudent.status} />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <p className="text-gray-900">{selectedStudent.department}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Intake Year</label>
                  <p className="text-gray-900">{selectedStudent.intake}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Stream</label>
                  <p className="text-gray-900">{selectedStudent.stream}</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  handleEdit(selectedStudent);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Edit Student
              </button>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal - Placeholder */}
      {showEditModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Edit Student</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="text-center py-8">
              <p className="text-gray-600">Edit form will be implemented here</p>
              <p className="text-sm text-gray-500 mt-2">
                This would include form fields for editing: {selectedStudent.name}
              </p>
            </div>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}