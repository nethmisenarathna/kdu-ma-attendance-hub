import React, { useState, useMemo, useEffect } from 'react';
import { Search, Grid, List, ArrowUpDown, RefreshCw, Clock, MapPin, Users, Mail, Phone, User, X } from 'lucide-react';
import { lectureService } from '../services/lectureService';
import { usePageTitle } from '../hooks/usePageTitle';

const Lectures = () => {
  usePageTitle('Lectures');
  
  // API Data State
  const [lecturesData, setLecturesData] = useState([]);
  const [lecturersData, setLecturersData] = useState([]); // Store all lecturers
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    department: '',
    intake: '',
    stream: '',
    day_of_week: ''
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState('table');
  
  // Modal states
  const [viewingLecturer, setViewingLecturer] = useState(null);

  // Fetch lectures data from API
  useEffect(() => {
    fetchLectures();
  }, []);

  const fetchLectures = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch lectures and lecturers in parallel
      const [lecturesResponse, lecturersResponse] = await Promise.all([
        lectureService.getAllLectures(),
        fetch('http://localhost:5000/api/teachers').then(res => res.json())
      ]);
      
      if (lecturesResponse.success && lecturesResponse.data && lecturersResponse.success) {
        // Store lecturers data for profile lookups
        setLecturersData(lecturersResponse.data);
        
        // Create a map for quick lecturer lookup by email
        const lecturerMap = {};
        lecturersResponse.data.forEach(lecturer => {
          lecturerMap[lecturer.email] = lecturer;
        });
        
        // Transform the API data to match the frontend structure
        const transformedData = lecturesResponse.data.map((lecture, index) => {
          const lecturer = lecturerMap[lecture.lecturer_email];
          
          return {
            id: lecture._id || index + 1,
            moduleCode: lecture.lecture_code,
            moduleName: lecture.subject,
            lecturerEmail: lecture.lecturer_email,
            lecturerName: lecturer ? lecturer.name : 'Unknown Lecturer',
            lecturerData: lecturer, // Store full lecturer data for profile
            intake: lecture.intake,
            streams: lecture.streams || [],
            scheduledDay: lecture.day_of_week,
            location: lecture.location,
            startTime: lecture.start_time ? new Date(lecture.start_time).toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: true 
            }) : 'TBA',
            endTime: lecture.end_time ? new Date(lecture.end_time).toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: true 
            }) : 'TBA',
            department: lecture.department,
            duration: lecture.start_time && lecture.end_time ? 
              `${Math.round((new Date(lecture.end_time) - new Date(lecture.start_time)) / (1000 * 60 * 60 * 100)) / 10}h` : 'TBA'
          };
        });
        setLecturesData(transformedData);
      } else {
        setError('Failed to load lectures data');
      }
    } catch (err) {
      console.error('Error fetching lectures:', err);
      setError('Error connecting to server. Make sure the backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  // Function to refresh data
  const handleRefresh = () => {
    fetchLectures();
  };

  // Function to handle lecturer profile click
  const handleLecturerClick = (lecturerData) => {
    if (lecturerData) {
      setViewingLecturer(lecturerData);
    } else {
      // If no lecturer data, show error or placeholder
      setViewingLecturer({
        name: 'Unknown Lecturer',
        email: 'Not available',
        phone: 'Not available',
        department: 'Not available',
        position: 'Not available',
        specialization: 'Not available',
        office: 'Not available',
        qualifications: 'Not available'
      });
    }
  };

  // Filtering and searching logic
  const filteredAndSearchedLectures = useMemo(() => {
    return lecturesData.filter(lecture => {
      const matchesSearch = 
        lecture.moduleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lecture.moduleCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lecture.lecturerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lecture.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lecture.intake.toString().includes(searchTerm.toLowerCase());
      
      const matchesFilters = 
        (filters.department === '' || lecture.department === filters.department) &&
        (filters.intake === '' || lecture.intake.toString() === filters.intake) &&
        (filters.stream === '' || lecture.streams.includes(filters.stream)) &&
        (filters.day_of_week === '' || lecture.scheduledDay === filters.day_of_week);
      
      return matchesSearch && matchesFilters;
    });
  }, [lecturesData, searchTerm, filters]);

  // Sorting logic
  const sortedLectures = useMemo(() => {
    if (!sortConfig.key) return filteredAndSearchedLectures;
    
    return [...filteredAndSearchedLectures].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (typeof aValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      }
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredAndSearchedLectures, sortConfig]);

  // Pagination logic
  const totalPages = Math.ceil(sortedLectures.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLectures = sortedLectures.slice(startIndex, startIndex + itemsPerPage);

  // Get unique values for filter dropdowns
  const uniqueDepartments = [...new Set(lecturesData.map(lecture => lecture.department))];
  const uniqueIntakes = [...new Set(lecturesData.map(lecture => lecture.intake))].sort();
  const uniqueStreams = [...new Set(lecturesData.flatMap(lecture => lecture.streams))];
  const uniqueDays = [...new Set(lecturesData.map(lecture => lecture.scheduledDay))];

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
      intake: '',
      stream: '',
      day_of_week: ''
    });
    setSearchTerm('');
    setCurrentPage(1);
  };
  return (
    <div className="space-y-6">
      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center p-8">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading lectures...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <X className="h-5 w-5 text-red-400 mr-2" />
            <span className="text-red-800">{error}</span>
            <button
              onClick={handleRefresh}
              className="ml-auto bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Main Content - Only show when not loading and no error */}
      {!loading && !error && (
        <>
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Lectures</h1>
              <p className="mt-2 text-gray-600">Manage course lectures and schedules</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              {/* View Toggle */}
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
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg border p-4 space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search by module, code, lecturer, location, or intake..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filters.department}
                  onChange={(e) => handleFilterChange('department', e.target.value)}
                >
                  <option value="">All Departments</option>
                  {uniqueDepartments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filters.intake}
                  onChange={(e) => handleFilterChange('intake', e.target.value)}
                >
                  <option value="">All Intakes</option>
                  {uniqueIntakes.map(intake => (
                    <option key={intake} value={intake}>Intake {intake}</option>
                  ))}
                </select>
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filters.stream}
                  onChange={(e) => handleFilterChange('stream', e.target.value)}
                >
                  <option value="">All Streams</option>
                  {uniqueStreams.map(stream => (
                    <option key={stream} value={stream}>{stream}</option>
                  ))}
                </select>
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filters.day_of_week}
                  onChange={(e) => handleFilterChange('day_of_week', e.target.value)}
                >
                  <option value="">All Days</option>
                  {uniqueDays.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
                {(searchTerm || filters.department || filters.intake || filters.stream || filters.day_of_week) && (
                  <button
                    onClick={clearFilters}
                    className="px-3 py-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Results Summary */}
            <div className="text-sm text-gray-500">
              Showing {paginatedLectures.length} of {sortedLectures.length} lectures
              {searchTerm && ` matching "${searchTerm}"`}
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('moduleCode')}
                    >
                      <div className="flex items-center gap-1">
                        Module Code
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('moduleName')}
                    >
                      <div className="flex items-center gap-1">
                        Module Name
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lecturer
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('intake')}
                    >
                      <div className="flex items-center gap-1">
                        Intake
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stream
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('scheduledDay')}
                    >
                      <div className="flex items-center gap-1">
                        Scheduled Day
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('location')}
                    >
                      <div className="flex items-center gap-1">
                        Location
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedLectures.map((lecture) => (
                    <tr key={lecture.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        {lecture.moduleCode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{lecture.moduleName}</div>
                        <div className="text-sm text-gray-500">{lecture.department}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleLecturerClick(lecture.lecturerData)}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer flex items-center gap-1 transition-colors"
                        >
                          <User className="h-4 w-4" />
                          <div className="text-left">
                            <div className="font-medium">{lecture.lecturerName}</div>
                            <div className="text-xs text-gray-500">{lecture.lecturerEmail}</div>
                          </div>
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <Users className="h-3 w-3 mr-1" />
                          {lecture.intake}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {lecture.streams.map(stream => (
                            <span 
                              key={stream}
                              className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {stream}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {lecture.scheduledDay}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                          {lecture.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-gray-400" />
                            {lecture.startTime} - {lecture.endTime}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">({lecture.duration})</div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tablet Table View - Horizontal Scroll */}
          <div className="hidden md:block lg:hidden bg-white shadow-sm rounded-lg border">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Module
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lecturer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Schedule
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedLectures.map((lecture) => (
                    <tr key={lecture.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-blue-600">{lecture.moduleCode}</div>
                        <div className="text-sm text-gray-900">{lecture.moduleName}</div>
                        <div className="text-xs text-gray-500">{lecture.department}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleLecturerClick(lecture.lecturerData)}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer transition-colors"
                        >
                          {lecture.lecturerName}
                        </button>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{lecture.scheduledDay}</div>
                        <div className="text-xs text-gray-500">
                          {lecture.startTime} - {lecture.endTime}
                        </div>
                        <div className="text-xs text-gray-500">{lecture.location}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1 mb-1">
                          {lecture.streams.map(stream => (
                            <span 
                              key={stream}
                              className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {stream}
                            </span>
                          ))}
                        </div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Intake {lecture.intake}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {paginatedLectures.map((lecture) => (
              <div key={lecture.id} className="bg-white shadow-sm rounded-lg border p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-blue-600">{lecture.moduleCode}</h3>
                    <p className="text-sm font-medium text-gray-900">{lecture.moduleName}</p>
                    <p className="text-xs text-gray-500">{lecture.department}</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ml-2">
                    <Users className="h-3 w-3 mr-1" />
                    {lecture.intake}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Lecturer:</span>
                    <button
                      onClick={() => handleLecturerClick(lecture.lecturerData)}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer transition-colors flex items-center gap-1"
                    >
                      <User className="h-3 w-3" />
                      {lecture.lecturerName}
                    </button>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Streams:</span>
                    <div className="flex flex-wrap gap-1 justify-end">
                      {lecture.streams.map(stream => (
                        <span 
                          key={stream}
                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {stream}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Day:</span>
                    <span className="text-sm text-gray-900">{lecture.scheduledDay}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Time:</span>
                    <span className="text-sm text-gray-900 flex items-center">
                      <Clock className="h-3 w-3 mr-1 text-gray-400" />
                      {lecture.startTime} - {lecture.endTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Location:</span>
                    <span className="text-sm text-gray-900 flex items-center">
                      <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                      {lecture.location}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Duration:</span>
                    <span className="text-sm text-gray-900">{lecture.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(startIndex + itemsPerPage, sortedLectures.length)}
                    </span>{' '}
                    of <span className="font-medium">{sortedLectures.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNumber = i + 1;
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => setCurrentPage(pageNumber)}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                            currentPage === pageNumber
                              ? 'z-10 bg-blue-600 text-white'
                              : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Lecturer Profile Modal */}
      {viewingLecturer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Lecturer Profile</h3>
              <button
                onClick={() => setViewingLecturer(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-base font-medium text-gray-900">{viewingLecturer.name}</h4>
                  <p className="text-sm text-gray-500">{viewingLecturer.position || 'Lecturer'}</p>
                </div>
              </div>
              
              <div className="border-t pt-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{viewingLecturer.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{viewingLecturer.phone || 'Not available'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{viewingLecturer.office || 'Not available'}</span>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h5 className="text-sm font-medium text-gray-900 mb-2">Details</h5>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><span className="font-medium">Department:</span> {viewingLecturer.department}</p>
                  <p><span className="font-medium">Location:</span> {viewingLecturer.location || 'Not available'}</p>
                  <p><span className="font-medium">Employee ID:</span> {viewingLecturer.employee_id || 'Not available'}</p>
                  {viewingLecturer.qualification && (
                    <p><span className="font-medium">Qualification:</span> {viewingLecturer.qualification}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setViewingLecturer(null)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Lectures;
