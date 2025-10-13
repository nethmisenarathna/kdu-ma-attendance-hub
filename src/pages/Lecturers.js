import React, { useState, useMemo } from 'react';
import { StatusBadge } from '../components/StatusBadge';
import { Search, Grid, List, ArrowUpDown, Plus, X } from 'lucide-react';

// Enhanced lecturers data
const lecturersData = [
  {
    id: 1,
    employee_id: "EMP001",
    name: "Dr. Smith Johnson",
    email: "smith.johnson@kdu.ac.lk",
    department: "Computer Science",
    title: "Professor",
    specialization: "Algorithms & Data Structures",
    join_date: "2018-03-15",
    assigned_lectures_count: 8,
    status: "active"
  },
  {
    id: 2,
    employee_id: "EMP002",
    name: "Prof. Sarah Wilson",
    email: "sarah.wilson@kdu.ac.lk",
    department: "Information Technology",
    title: "Associate Professor",
    specialization: "Database Systems",
    join_date: "2019-08-22",
    assigned_lectures_count: 6,
    status: "active"
  },
  {
    id: 3,
    employee_id: "EMP003",
    name: "Dr. Michael Chen",
    email: "michael.chen@kdu.ac.lk",
    department: "Computer Science",
    title: "Assistant Professor",
    specialization: "Machine Learning",
    join_date: "2020-01-10",
    assigned_lectures_count: 5,
    status: "active"
  },
  {
    id: 4,
    employee_id: "EMP004",
    name: "Ms. Emily Davis",
    email: "emily.davis@kdu.ac.lk",
    department: "Information Technology",
    title: "Senior Lecturer",
    specialization: "Web Development",
    join_date: "2021-05-18",
    assigned_lectures_count: 7,
    status: "active"
  },
  {
    id: 5,
    employee_id: "EMP005",
    name: "Dr. Robert Kumar",
    email: "robert.kumar@kdu.ac.lk",
    department: "Software Engineering",
    title: "Associate Professor",
    specialization: "Software Architecture",
    join_date: "2017-11-30",
    assigned_lectures_count: 0,
    status: "on_leave"
  },
  {
    id: 6,
    employee_id: "EMP006",
    name: "Prof. Lisa Anderson",
    email: "lisa.anderson@kdu.ac.lk",
    department: "Business Studies",
    title: "Professor",
    specialization: "Business Management",
    join_date: "2016-09-12",
    assigned_lectures_count: 9,
    status: "active"
  },
  {
    id: 7,
    employee_id: "EMP007",
    name: "Dr. James Wilson",
    email: "james.wilson@kdu.ac.lk",
    department: "Engineering",
    title: "Senior Lecturer",
    specialization: "Engineering Mathematics",
    join_date: "2019-02-28",
    assigned_lectures_count: 4,
    status: "active"
  },
  {
    id: 8,
    employee_id: "EMP008",
    name: "Dr. Amanda Taylor",
    email: "amanda.taylor@kdu.ac.lk",
    department: "Computer Science",
    title: "Assistant Professor",
    specialization: "Computer Networks",
    join_date: "2022-01-15",
    assigned_lectures_count: 3,
    status: "active"
  },
  {
    id: 9,
    employee_id: "EMP009",
    name: "Mr. David Brown",
    email: "david.brown@kdu.ac.lk",
    department: "Information Technology",
    title: "Lecturer",
    specialization: "Mobile App Development",
    join_date: "2023-03-20",
    assigned_lectures_count: 2,
    status: "active"
  },
  {
    id: 10,
    employee_id: "EMP010",
    name: "Prof. Jennifer Garcia",
    email: "jennifer.garcia@kdu.ac.lk",
    department: "Software Engineering",
    title: "Professor",
    specialization: "Project Management",
    join_date: "2015-07-08",
    assigned_lectures_count: 0,
    status: "inactive"
  }
];

const Lecturers = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    department: ''
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState('table');
  
  // Modal states
  const [viewingLecturer, setViewingLecturer] = useState(null);
  const [editingLecturer, setEditingLecturer] = useState(null);
  const [deletingLecturer, setDeletingLecturer] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Filter options
  const filterOptions = useMemo(() => {
    const departments = [...new Set(lecturersData.map(lecturer => lecturer.department))];

    return {
      departments: departments.sort()
    };
  }, []);

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
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lecturers</h1>
          <p className="mt-2 text-gray-600">Manage faculty members and their information</p>
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
            Add Lecturer
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleView(lecturer)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEdit(lecturer)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(lecturer)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
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
          {paginatedData.map((lecturer) => (
            <div key={lecturer.id} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{lecturer.name}</h3>
                  <p className="text-xs text-gray-500">{lecturer.email}</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {lecturer.assigned_lectures_count} lectures
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Department:</span>
                  <span className="text-gray-900">{lecturer.department}</span>
                </div>
              </div>

              <div className="mt-4 flex space-x-3">
                <button
                  onClick={() => handleView(lecturer)}
                  className="flex-1 text-center py-2 px-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  View
                </button>
                <button
                  onClick={() => handleEdit(lecturer)}
                  className="flex-1 text-center py-2 px-3 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(lecturer)}
                  className="text-center py-2 px-3 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                >
                  Delete
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