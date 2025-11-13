import React, { useState, useMemo, useEffect } from 'react';
import { StatusBadge } from '../components/StatusBadge';
import { Search, Grid, List, ArrowUpDown, Plus, X, RefreshCw } from 'lucide-react';
import { lecturerService } from '../services/lecturerService';
import { usePageTitle } from '../hooks/usePageTitle';

const Lecturers = () => {
  usePageTitle('Lecturers');
  
  // API Data State
  const [lecturersData, setLecturersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    department: ''
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'list'
  
  // Modal states
  const [viewingLecturer, setViewingLecturer] = useState(null);
  const [editingLecturer, setEditingLecturer] = useState(null);
  const [deletingLecturer, setDeletingLecturer] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Fetch lecturers data from API
  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await lecturerService.getAllLecturers();
        
        if (response.success && response.data) {
          // Transform the API data to match the frontend structure
          const transformedData = response.data.map((teacher, index) => ({
            id: index + 1,
            employee_id: `EMP${String(index + 1).padStart(3, '0')}`, // Generate employee ID
            name: teacher.name,
            email: teacher.email,
            department: teacher.department,
            title: 'Lecturer', // Default title since API doesn't have this field
            specialization: 'General', // Default specialization
            join_date: '2023-01-01', // Default join date
            assigned_lectures_count: Math.floor(Math.random() * 10) + 1, // Random count
            status: 'active' // Default status
          }));
          setLecturersData(transformedData);
        } else {
          setError('Failed to load lecturers data');
        }
      } catch (err) {
        console.error('Error fetching lecturers:', err);
        setError('Error connecting to server. Make sure the backend is running on port 5000.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchLecturers();
  }, []); // Empty dependency array means this runs once on component mount
  
  // Function to refresh data
  const handleRefresh = () => {
    const fetchLecturers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await lecturerService.getAllLecturers();
        
        if (response.success && response.data) {
          const transformedData = response.data.map((teacher, index) => ({
            id: index + 1,
            employee_id: `EMP${String(index + 1).padStart(3, '0')}`,
            name: teacher.name,
            email: teacher.email,
            department: teacher.department,
            title: 'Lecturer',
            specialization: 'General',
            join_date: '2023-01-01',
            assigned_lectures_count: Math.floor(Math.random() * 10) + 1,
            status: 'active'
          }));
          setLecturersData(transformedData);
        }
      } catch (err) {
        setError('Error refreshing data');
      } finally {
        setLoading(false);
      }
    };
    fetchLecturers();
  };

  // Filter options
  const filterOptions = useMemo(() => {
    const departments = [...new Set(lecturersData.map(lecturer => lecturer.department))];

    return {
      departments: departments.sort()
    };
  }, [lecturersData]);

  // Filter and search logic
  const filteredAndSortedData = useMemo(() => {
    let filtered = lecturersData.filter(lecturer => {
      const matchesSearch = searchTerm === '' || 
        lecturer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lecturer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lecturer.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lecturer.specialization.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilters = 
        (filters.department === '' || lecturer.department === filters.department);

      return matchesSearch && matchesFilters;
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === 'join_date') {
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
  }, [lecturersData, searchTerm, filters, sortConfig]);

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
      department: ''
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleView = (lecturer) => {
    setViewingLecturer(lecturer);
  };

  const handleEdit = (lecturer) => {
    setEditingLecturer(lecturer);
  };

  const handleDelete = (lecturer) => {
    setDeletingLecturer(lecturer);
  };

  const handleSaveLecturer = (updatedLecturer) => {
    // In a real app, this would make an API call
    console.log('Saving lecturer:', updatedLecturer);
    setEditingLecturer(null);
  };

  const handleAddLecturer = (newLecturer) => {
    // In a real app, this would make an API call
    console.log('Adding lecturer:', newLecturer);
    setShowAddModal(false);
  };

  const confirmDelete = () => {
    // In a real app, this would make an API call
    console.log('Deleting lecturer:', deletingLecturer);
    setDeletingLecturer(null);
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
      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center p-8">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading lecturers...</span>
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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Lecturers</h1>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">Manage faculty members and their information ({lecturersData.length} lecturers)</p>
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
            onClick={handleRefresh}
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
                placeholder="Search by name, email, employee ID, or specialization..."
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
            Showing {paginatedData.length} of {filteredAndSortedData.length} lecturers
            {filteredAndSortedData.length !== lecturersData.length && ` (filtered from ${lecturersData.length} total)`}
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
                      onClick={() => handleSort('name')}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Name
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('email')}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Email
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
                    <button
                      onClick={() => handleSort('assigned_lectures_count')}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Assigned Lectures
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.map((lecturer) => (
                  <tr key={lecturer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {lecturer.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lecturer.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lecturer.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {lecturer.assigned_lectures_count} lectures
                      </span>
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
          {paginatedData.map((lecturer) => (
            <div key={lecturer.id} className="bg-white shadow-sm rounded-lg border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                    {lecturer.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{lecturer.name}</h3>
                    <p className="text-sm text-gray-600">{lecturer.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{lecturer.department}</p>
                    <p className="text-sm text-gray-600">Employee ID: {lecturer.employee_id}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {lecturer.assigned_lectures_count} lectures
                    </span>
                  </div>
                  <button 
                    onClick={() => handleView(lecturer)}
                    className="text-blue-600 hover:text-blue-900 font-medium"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mobile List View */}
      <div className="md:hidden space-y-4">
        {paginatedData.map((lecturer) => (
          <div key={lecturer.id} className="bg-white shadow-sm rounded-lg border p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{lecturer.name}</h3>
                <p className="text-sm text-gray-600">{lecturer.email}</p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {lecturer.assigned_lectures_count} lectures
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">Employee ID:</span>
                <span className="text-sm text-gray-900">{lecturer.employee_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">Department:</span>
                <span className="text-sm text-gray-900">{lecturer.department}</span>
              </div>
            </div>
            
            <button 
              onClick={() => handleView(lecturer)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-md text-sm font-medium"
            >
              View Details
            </button>
          </div>
        ))}
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
      {viewingLecturer && (
        <ViewLecturerModal
          lecturer={viewingLecturer}
          onClose={() => setViewingLecturer(null)}
        />
      )}

      {editingLecturer && (
        <EditLecturerModal
          lecturer={editingLecturer}
          onSave={handleSaveLecturer}
          onClose={() => setEditingLecturer(null)}
        />
      )}

      {deletingLecturer && (
        <DeleteConfirmModal
          lecturerName={deletingLecturer.name}
          onConfirm={confirmDelete}
          onClose={() => setDeletingLecturer(null)}
        />
      )}

      {showAddModal && (
        <AddLecturerModal
          onSave={handleAddLecturer}
          onClose={() => setShowAddModal(false)}
        />
      )}
        </>
      )}
    </div>
  );
};

// Modal Components (simplified for now)
const ViewLecturerModal = ({ lecturer, onClose }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
      <div className="mt-3">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Lecturer Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="space-y-2">
          <p><strong>Employee ID:</strong> {lecturer.employee_id}</p>
          <p><strong>Name:</strong> {lecturer.name}</p>
          <p><strong>Email:</strong> {lecturer.email}</p>
          <p><strong>Department:</strong> {lecturer.department}</p>
          <p><strong>Title:</strong> {lecturer.title}</p>
          <p><strong>Specialization:</strong> {lecturer.specialization}</p>
          <p><strong>Assigned Lectures:</strong> 
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ml-2">
              {lecturer.assigned_lectures_count} lectures
            </span>
          </p>
          <p><strong>Join Date:</strong> {lecturer.join_date}</p>
          <p><strong>Status:</strong> <StatusBadge status={lecturer.status} /></p>
        </div>
      </div>
    </div>
  </div>
);

const EditLecturerModal = ({ lecturer, onSave, onClose }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
      <div className="mt-3">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Edit Lecturer</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>
        <p className="text-gray-600">Edit functionality will be implemented here.</p>
        <div className="mt-4 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={() => onSave(lecturer)} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
);

const AddLecturerModal = ({ onSave, onClose }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
      <div className="mt-3">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Add New Lecturer</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>
        <p className="text-gray-600">Add lecturer functionality will be implemented here.</p>
        <div className="mt-4 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={() => onSave({})} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
            Add Lecturer
          </button>
        </div>
      </div>
    </div>
  </div>
);

const DeleteConfirmModal = ({ lecturerName, onConfirm, onClose }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div className="mt-3 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <X className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Lecturer</h3>
        <p className="text-sm text-gray-500 mb-4">
          Are you sure you want to delete <strong>{lecturerName}</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-center space-x-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default Lecturers;