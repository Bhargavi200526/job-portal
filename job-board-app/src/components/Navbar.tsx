import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets.ts';
import RecruiterLogin from './RecruiterLogin'; 

import {
  useUser,
  UserButton,
  SignUpButton,
} from '@clerk/clerk-react';

const Navbar: React.FC = () => {
  const { isSignedIn, user } = useUser();
  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);

  return (
    <div className="w-full shadow-md relative z-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-8 bg-white flex justify-between items-center py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src={assets.logo} alt="Logo" className="h-10 cursor-pointer" />
        </Link>

        {/* Right: Navigation & Auth */}
        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <>
              <Link to="/application" className="text-gray-700 hover:text-blue-600 transition font-medium">
                Applied Jobs
              </Link>
              <span className="text-gray-700 hidden sm:block">Hi, {user?.firstName || 'User'}</span>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <>
              {/* Trigger Custom Modal */}
              <button
                className="px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-100 transition"
                onClick={() => setShowRecruiterLogin(true)}
              >
                Recruiter Login
              </button>

              <SignUpButton mode="modal">
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                  Register
                </button>
              </SignUpButton>
            </>
          )}
        </div>
      </div>

      
      {showRecruiterLogin && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setShowRecruiterLogin(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl"
            >
              ×
            </button>
            <RecruiterLogin />
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
