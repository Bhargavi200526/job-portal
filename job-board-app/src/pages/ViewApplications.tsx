import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';

const Loader: React.FC = () => (
  <div className="flex justify-center items-center h-[300px]">
    <div className="animate-spin rounded-full border-4 border-black border-t-transparent h-12 w-12" />
  </div>
);

const ViewApplications: React.FC = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const companyToken = localStorage.getItem('companyToken');
  const [openActionIndex, setOpenActionIndex] = useState<number | null>(null);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch applicants for this company
  const fetchCompanyJobApplicants = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${backendUrl}/api/company/applicants`,
        {
          headers: {
            Authorization: `Bearer ${companyToken}`,
          },
        }
      );
      if (res.data.success) {
        setApplicants(res.data.applications);
      } else {
        setApplicants([]);
      }
    } catch (err) {
      setApplicants([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to update the job application status
  const changeJobApplicationStatus = async (id: string, status: string) => {
    try {
      const res = await axios.put(
        `${backendUrl}/api/company/application-status`,
        { id, status },
        {
          headers: {
            Authorization: `Bearer ${companyToken}`,
          },
        }
      );
      if (res.data.success) {
        toast.success(res.data.message || "Status updated");
        fetchCompanyJobApplicants();
        setOpenActionIndex(null);
      } else {
        toast.error(res.data.message || "Failed to update status");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update status");
    }
  };

  useEffect(() => {
    fetchCompanyJobApplicants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleActionToggle = (index: number) => {
    setOpenActionIndex(openActionIndex === index ? null : index);
  };

  return (
    <div className="w-full sm:w-[calc(100%-224px)] ml-0 sm:ml-6 p-6 rounded-lg bg-white shadow border border-gray-200 min-h-[500px] flex flex-col">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">View Applications</h2>
      <div className="flex-1 flex flex-col justify-center">
        <div className="overflow-x-auto">
          {loading ? (
            <Loader />
          ) : applicants.length === 0 ? (
            <div className="flex justify-center items-center h-[250px]">
              <p className="text-gray-500 text-xl font-medium">No applications received</p>
            </div>
          ) : (
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-700">
                  <th className="p-3 border-b">#</th>
                  <th className="p-3 border-b">Username</th>
                  <th className="p-3 border-b">Job Title</th>
                  <th className="p-3 border-b">Location</th>
                  <th className="p-3 border-b">Resume</th>
                  <th className="p-3 border-b">Status</th>
                  <th className="p-3 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((applicant, index) => (
                  <tr key={applicant._id} className="hover:bg-gray-50">
                    <td className="p-3 border-b text-gray-700">{index + 1}</td>
                    <td className="p-3 border-b flex items-center gap-2">
                      <img
                        src={applicant.userId?.image || assets.profile_upload_icon}
                        alt={applicant.userId?.name || "Applicant"}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-gray-800">{applicant.userId?.name || "--"}</span>
                    </td>
                    <td className="p-3 border-b">{applicant.jobId?.title || "--"}</td>
                    <td className="p-3 border-b">{applicant.jobId?.location || "--"}</td>
                    <td className="p-3 border-b">
                      {applicant.userId?.resume ? (
                        <a
                          href={applicant.userId.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:underline"
                        >
                          Resume
                          <img src={assets.resume_download_icon} alt="Download" className="h-4 w-4" />
                        </a>
                      ) : (
                        <span className="text-gray-400 italic">No resume</span>
                      )}
                    </td>
                    <td className="p-3 border-b">
                      {applicant.status === "accepted" ? (
                        <span className="text-green-600 font-semibold">Accepted</span>
                      ) : applicant.status === "rejected" ? (
                        <span className="text-red-600 font-semibold">Rejected</span>
                      ) : (
                        <span className="text-yellow-600 font-semibold">Pending</span>
                      )}
                    </td>
                    <td className="p-3 border-b relative">
                      <button
                        className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                        onClick={() => handleActionToggle(index)}
                      >
                        ...
                      </button>
                      {openActionIndex === index && (
                        <div className="absolute right-0 mt-2 w-28 bg-white border rounded shadow-md z-10">
                          <button
                            className="w-full px-4 py-2 text-green-600 hover:bg-green-50 text-sm text-left"
                            onClick={() => changeJobApplicationStatus(applicant._id, "accepted")}
                            disabled={applicant.status === "accepted"}
                          >
                            Accept
                          </button>
                          <button
                            className="w-full px-4 py-2 text-red-600 hover:bg-red-50 text-sm text-left"
                            onClick={() => changeJobApplicationStatus(applicant._id, "rejected")}
                            disabled={applicant.status === "rejected"}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewApplications;