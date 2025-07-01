
import React, { useState } from 'react';
import { assets } from '../assets/assets.ts';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Dashboard: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { companyData, setCompanyToken, setCompanyData } = useAppContext();
  const navigate = useNavigate();

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleLogout = () => {
    setCompanyToken(null);
    setCompanyData(null);
    localStorage.removeItem('companyToken');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <div className="w-full bg-white shadow-md px-6 py-4 flex items-center justify-between">
        <img src={assets.logo} alt="Logo" className="h-10 cursor-pointer" onClick={() => navigate('/')} />
        <div className="flex items-center gap-4 relative">
          <p className="text-gray-700 font-medium hidden sm:block">
            Welcome, {companyData?.name || 'Recruiter'}
          </p>
          <img
            src={companyData?.image || assets.company_icon}
            alt="Company"
            className="h-10 w-10 rounded-full cursor-pointer border border-gray-300"
            onClick={toggleDropdown}
          />
          {showDropdown && (
            <ul className="absolute top-14 right-0 bg-white border rounded shadow-md py-2 w-36 z-50">
              <li className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>
                Logout
              </li>
            </ul>
          )}
        </div>
      </div>

      {/* Layout */}
      <div className="flex flex-grow">
        {/* Sidebar */}
        <div className="w-20 sm:w-56 bg-white border-r p-4 space-y-6">
          <ul className="flex flex-col gap-4">
            <NavLink to="/dashboard/add-job" className={navLinkClass}>
              <img src={assets.add_icon} alt="Add Job" className="h-6 w-6" />
              <span className="hidden sm:inline">Add Job</span>
            </NavLink>
            <NavLink to="/dashboard/manage-jobs" className={navLinkClass}>
              <img src={assets.home_icon} alt="Manage Job" className="h-6 w-6" />
              <span className="hidden sm:inline">Manage Jobs</span>
            </NavLink>
            <NavLink to="/dashboard/view-applications" className={navLinkClass}>
              <img src={assets.person_tick_icon} alt="Applications" className="h-6 w-6" />
              <span className="hidden sm:inline">Applications</span>
            </NavLink>
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-grow p-4 bg-gray-50">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 px-2 py-2 rounded hover:bg-blue-50 transition ${
    isActive ? 'bg-blue-100 text-blue-600 font-semibold' : 'text-gray-700'
  }`;

export default Dashboard;