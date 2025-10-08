import React from 'react';
import { User, Mail, Phone, MapPin, Calendar } from 'lucide-react';

export default function Profile() {
  const user = {
    name: "Sarah Administrator",
    role: "Management Assistant",
    email: "sarah.admin@kdu.ac.lk",
    phone: "+94 77 123 4567",
    department: "Faculty of Computing",
    location: "Colombo, Sri Lanka",
    joinDate: "January 15, 2020",
    permissions: "Full Access",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="mt-2 text-gray-600">Manage your personal information and settings</p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
        </div>
        <div className="px-6 py-4">
          <div className="flex items-center space-x-6">
            <div className="h-20 w-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-medium">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-600">{user.role}</p>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 border-t border-gray-200">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="flex items-center text-sm font-medium text-gray-500">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
            </div>
            <div>
              <dt className="flex items-center text-sm font-medium text-gray-500">
                <Phone className="h-4 w-4 mr-2" />
                Phone
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{user.phone}</dd>
            </div>
            <div>
              <dt className="flex items-center text-sm font-medium text-gray-500">
                <User className="h-4 w-4 mr-2" />
                Department
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{user.department}</dd>
            </div>
            <div>
              <dt className="flex items-center text-sm font-medium text-gray-500">
                <MapPin className="h-4 w-4 mr-2" />
                Location
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{user.location}</dd>
            </div>
            <div>
              <dt className="flex items-center text-sm font-medium text-gray-500">
                <Calendar className="h-4 w-4 mr-2" />
                Join Date
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{user.joinDate}</dd>
            </div>
          </dl>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}