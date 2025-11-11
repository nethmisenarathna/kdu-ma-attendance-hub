import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  FileText, 
  Bell, 
  User,
  X,
  LogOut
} from 'lucide-react';
import authService from '../services/authService';
import kduLogo from '../assets/images/OIP.jpeg';

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Students",
    url: "/students",
    icon: Users,
  },
  {
    title: "Lecturers",
    url: "/lecturers",
    icon: GraduationCap,
  },
  {
    title: "Lectures",
    url: "/lectures",
    icon: BookOpen,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: FileText,
  },
  {
    title: "Notifications",
    url: "/notifications",
    icon: Bell,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
];

export function AppSidebar({ onClose }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Navigate anyway
      navigate('/login');
    }
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen shadow-lg lg:shadow-none">
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src={kduLogo} 
              alt="KDU Logo" 
              className="h-8 w-8 sm:h-10 sm:w-10 object-contain rounded" 
            />
            <div>
              <h1 className="text-base sm:text-lg font-bold text-gray-900">KDU Faculty</h1>
              <p className="text-xs sm:text-sm text-gray-500">Management Hub</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100 lg:hidden transition-colors"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <nav className="flex-1 px-3 sm:px-4 pb-4">
        <ul className="space-y-1 sm:space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.url;
            
            return (
              <li key={item.title}>
                <Link
                  to={item.url}
                  onClick={() => onClose && onClose()}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate">{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-3 sm:p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}