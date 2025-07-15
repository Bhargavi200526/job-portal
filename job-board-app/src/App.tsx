import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useAppContext } from './context/AppContext';
import Home from './pages/Home';
import ApplyJob from './pages/Applyjob';
import Application from './pages/Application';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ViewApplications from './pages/ViewApplications';
import ManageJobs from './pages/ManageJobs';
import AddJob from './pages/AddJob';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
  const location = useLocation();
  const { companyToken } = useAppContext();

  const hideNavbarRoutes = [
    '/dashboard',
    '/dashboard/add-job',
    '/dashboard/view-applications',
    '/dashboard/manage-jobs',
  ];

  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <div>
      {shouldShowNavbar && <Navbar />}
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <Routes>
  {/*  Default route shows Home page */}
        <Route index element={<Home />} />
        
        <Route path="/" element={<Home />} />
        <Route path="/apply-job/:id" element={<ApplyJob />} />
        <Route path="/application" element={<Application />} />

        
        {companyToken ? (
          <Route path="/dashboard" element={<Dashboard />}>
            {/*  Default inside dashboard redirects to manage-jobs */}
            <Route index element={<Navigate to="manage-jobs" replace />} />
            <Route path="view-applications" element={<ViewApplications />} />
            <Route path="manage-jobs" element={<ManageJobs />} />
            <Route path="add-job" element={<AddJob />} />
          </Route>
        ) : (
          // Redirect if no token
          <Route path="/dashboard/*" element={<Navigate to="/" replace />} />
        )}
      </Routes>
    </div>
  );
};

export default App;
