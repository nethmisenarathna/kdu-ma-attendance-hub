import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppSidebar } from './components/AppSidebar';
import { UserProfile } from './components/UserProfile';
import authService from './services/authService';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Lecturers from './pages/Lecturers';
import Lectures from './pages/Lectures';
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import AttendanceSheet from './pages/AttendanceSheet';
import NotFound from './pages/NotFound';
import { Menu } from 'lucide-react';
import './App.css';

const queryClient = new QueryClient();

// Protected Route Component
function ProtectedRoute({ children }) {
  const isAuthenticated = authService.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function AppLayout() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());

  // Check authentication on mount and location change
  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      // If not authenticated and not on login page, redirect to login
      if (!authenticated && !isLoginPage) {
        window.location.href = '/login';
      }
    };
    
    checkAuth();
  }, [location.pathname, isLoginPage]);

  // Prevent body scroll when sidebar is open on mobile
  React.useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('sidebar-open');
    };
  }, [sidebarOpen]);

  if (isLoginPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div className="lg:flex lg:h-screen">
        {/* Sidebar - Hidden on mobile by default, toggleable */}
        <div className={`
          fixed lg:static top-0 left-0 h-screen z-50 lg:flex-shrink-0
          transform transition-transform duration-300 ease-in-out
          lg:transform-none lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <AppSidebar onClose={() => setSidebarOpen(false)} />
        </div>
        
        {/* Main content area */}
        <div className="flex flex-col min-h-screen lg:flex-1 lg:min-w-0 lg:overflow-hidden">
        <header className="h-14 flex items-center justify-between border-b bg-white px-4 shadow-sm sticky top-0 z-30">
          <div className="flex items-center">
            <button 
              className="p-2 rounded-md hover:bg-gray-100 mr-4 lg:hidden transition-colors"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="font-semibold text-gray-900 text-sm sm:text-base md:text-lg truncate">
              KDU Faculty Management Portal
            </h2>
          </div>
          <UserProfile />
        </header>
          <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto">
            <Routes>
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/students" element={<ProtectedRoute><Students /></ProtectedRoute>} />
              <Route path="/lecturers" element={<ProtectedRoute><Lecturers /></ProtectedRoute>} />
              <Route path="/lectures" element={<ProtectedRoute><Lectures /></ProtectedRoute>} />
              <Route path="/attendance/:lectureId/:date" element={<ProtectedRoute><AttendanceSheet /></ProtectedRoute>} />
              <Route path="/attendance/:lectureId" element={<ProtectedRoute><AttendanceSheet /></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
