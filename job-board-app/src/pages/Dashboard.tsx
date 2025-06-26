import React, { useState } from 'react';
import { assets } from '../assets/assets';
import { NavLink, Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Dashboard Navbar */}
      <div className="w-full bg-white shadow-md px-6 py-4 flex items-center justify-between">
        {/* Left: Logo */}
        <Link to="/">
          <img src={assets.logo} alt="Logo" className="h-10 cursor-pointer" />
        </Link>
        {/* Right: Welcome + Dropdown */}
        <div className="flex items-center gap-4 relative">
          <p className="text-gray-700 font-medium hidden sm:block">Welcome, Codebasics</p>
          <img
            src={assets.company_icon}
            alt="Company"
            className="h-10 w-10 rounded-full cursor-pointer border border-gray-300"
            onClick={toggleDropdown}
          />
          {showDropdown && (
            <ul className="absolute top-14 right-0 bg-white border border-gray-200 rounded shadow-md py-2 w-36 z-50">
              <li
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={() => alert('Logging out...')}
              >
                Logout
              </li>
            </ul>
          )}
        </div>
      </div>

      {/* Main Layout: Sidebar + Content */}
      <div className="flex flex-grow">
        {/* Sidebar */}
        <div className="w-20 sm:w-56 bg-white border-r p-4 space-y-6">
          <ul className="flex flex-col gap-4">
            <NavLink
              to="/dashboard/add-job"
              className={({ isActive }: { isActive: boolean }) =>
                `flex items-center gap-3 px-2 py-2 rounded hover:bg-blue-50 transition ${
                  isActive ? 'bg-blue-100 text-blue-600 font-semibold' : 'text-gray-700'
                }`
              }
            >
              <img src={assets.add_icon} alt="Add Job" className="h-6 w-6" />
              <span className="hidden sm:inline">Add Job</span>
            </NavLink>

            <NavLink
              to="/dashboard/manage-jobs"
              className={({ isActive }: { isActive: boolean }) =>
                `flex items-center gap-3 px-2 py-2 rounded hover:bg-blue-50 transition ${
                  isActive ? 'bg-blue-100 text-blue-600 font-semibold' : 'text-gray-700'
                }`
              }
            >
              <img src={assets.home_icon} alt="Manage Job" className="h-6 w-6" />
              <span className="hidden sm:inline">Manage Jobs</span>
            </NavLink>

            <NavLink
              to="/dashboard/view-applications"
              className={({ isActive }: { isActive: boolean }) =>
                `flex items-center gap-3 px-2 py-2 rounded hover:bg-blue-50 transition ${
                  isActive ? 'bg-blue-100 text-blue-600 font-semibold' : 'text-gray-700'
                }`
              }
            >
              <img src={assets.person_tick_icon} alt="View Applications" className="h-6 w-6" />
              <span className="hidden sm:inline">Applications</span>
            </NavLink>
          </ul>
        </div>

        {/* Right Content Area */}
        <div className="flex-grow p-4 bg-gray-50">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
