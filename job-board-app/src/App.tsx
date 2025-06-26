import React from 'react';
import { Routes, Route,useLocation } from 'react-router-dom';
import Home from './pages/Home';
import ApplyJob from './pages/Applyjob';
import Application from './pages/Application';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ViewApplications from './pages/ViewApplications';
import ManageJobs from './pages/ManageJobs';
import AddJob from './pages/AddJob';

const App: React.FC = () => {
  // Inside App component:
const location = useLocation();
const hideNavbarRoutes = ['/dashboard',
  '/dashboard/add-job',
  '/dashboard/view-applications',
  '/dashboard/manage-jobs'
]; 

const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);
  return (
    <div>
      {shouldShowNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apply-job/:id" element={<ApplyJob />} />
        <Route path="/application" element={<Application />} />

        {/* Nested Dashboard Routes */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="view-applications" element={<ViewApplications />} />
          <Route path="manage-jobs" element={<ManageJobs />} />
          <Route path="add-job" element={<AddJob />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
