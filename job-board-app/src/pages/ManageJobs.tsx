import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

// Simple custom Loader for center screen usage
const Loader: React.FC = () => (
  <div className="flex justify-center items-center h-[300px]">
    <div className="animate-spin rounded-full border-4 border-black border-t-transparent h-12 w-12" />
  </div>
);

interface Job {
  _id: string;
  title: string;
  date: string;
  location: string;
  applicantsCount: number;
  visible: boolean;
}

const ManageJobs: React.FC = () => {
  const navigate = useNavigate();
  const { companyToken } = useAppContext();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/company/jobs`, {
        headers: {
          Authorization: `Bearer ${companyToken}`,
        },
      });
      setJobs(response.data.jobs);
    } catch (error) {
      toast.error('Failed to fetch jobs');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (jobId: string, currentVisibility: boolean) => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/company/visibility`,
        { jobId, visible: !currentVisibility },
        {
          headers: {
            Authorization: `Bearer ${companyToken}`,
          },
        }
      );

      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job._id === jobId ? { ...job, visible: response.data.job.visible } : job
        )
      );
    } catch (error) {
      toast.error('Failed to update job visibility');
    }
  };

  useEffect(() => {
    if (companyToken) fetchJobs();
    // eslint-disable-next-line
  }, [companyToken]);

  return (
    <div className="w-full sm:w-[calc(100%-224px)] ml-0 sm:ml-6 p-6 rounded-lg bg-white shadow border border-gray-200 min-h-[500px] flex flex-col">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Jobs</h2>
      <div className="flex-1 flex flex-col justify-center">
        <div className="overflow-x-auto">
          {loading ? (
            <Loader />
          ) : jobs.length === 0 ? (
            <div className="flex justify-center items-center h-[250px]">
              <p className="text-gray-500 text-xl font-medium">No posts available to show</p>
            </div>
          ) : (
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
                {jobs.map((job, index) => (
                  <tr key={job._id} className="hover:bg-gray-50 text-gray-700">
                    <td className="p-3 border-b">{index + 1}</td>
                    <td className="p-3 border-b">{job.title}</td>
                    <td className="p-3 border-b">{moment(job.date || (job as any).createdAt).format('DD MMM YYYY')}</td>
                    <td className="p-3 border-b">{job.location}</td>
                    <td className="p-3 border-b">{job.applicantsCount ?? 0}</td>
                    <td className="p-3 border-b">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600"
                        checked={job.visible}
                        onChange={() => toggleVisibility(job._id, job.visible)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
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