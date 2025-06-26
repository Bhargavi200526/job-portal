import React from 'react';
import moment from 'moment';
import { manageJobsData } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const ManageJobs: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full sm:w-[calc(100%-224px)] ml-0 sm:ml-6 p-6 rounded-lg bg-white shadow border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Jobs</h2>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-700">
              <th className="p-3 border-b">#</th>
              <th className="p-3 border-b">Job Title</th>
              <th className="p-3 border-b">Date</th>
              <th className="p-3 border-b">Location</th>
              <th className="p-3 border-b">Applicants</th>
              <th className="p-3 border-b">Visible</th>
            </tr>
          </thead>
          <tbody>
            {manageJobsData.map((job, index) => (
              <tr key={job._id} className="hover:bg-gray-50 text-gray-700">
                <td className="p-3 border-b">{index + 1}</td>
                <td className="p-3 border-b">{job.title}</td>
                <td className="p-3 border-b">{moment(job.date).format('DD MMM YYYY')}</td>
                <td className="p-3 border-b">{job.location}</td>
                <td className="p-3 border-b">{job.applicants}</td>
                <td className="p-3 border-b">
                  <input type="checkbox" className="h-4 w-4 text-blue-600" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add New Job Button */}
      <div className="flex justify-end mt-6">
        <button
          onClick={() => navigate('/dashboard/add-job')}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition shadow"
        >
           Add New Job
        </button>
      </div>
    </div>
  );
};

export default ManageJobs;
