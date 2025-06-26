import React, { useState } from 'react';
import { viewApplicationsPageData, assets } from '../assets/assets';

const ViewApplications: React.FC = () => {
  const [openActionIndex, setOpenActionIndex] = useState<number | null>(null);

  const handleActionToggle = (index: number) => {
    setOpenActionIndex(openActionIndex === index ? null : index);
  };

  return (
    <div className="w-full sm:w-[calc(100%-224px)] ml-0 sm:ml-6 p-6 rounded-lg bg-white shadow border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">View Applications</h2>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-700">
              <th className="p-3 border-b">#</th>
              <th className="p-3 border-b">Username</th>
              <th className="p-3 border-b">Job Title</th>
              <th className="p-3 border-b">Location</th>
              <th className="p-3 border-b">Resume</th>
              <th className="p-3 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {viewApplicationsPageData.map((applicant, index) => (
              <tr key={applicant._id} className="hover:bg-gray-50">
                <td className="p-3 border-b text-gray-700">{index + 1}</td>
                <td className="p-3 border-b flex items-center gap-2">
                  <img
                    src={applicant.imgSrc}
                    alt={applicant.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-gray-800">{applicant.name}</span>
                </td>
                <td className="p-3 border-b">{applicant.jobTitle}</td>
                <td className="p-3 border-b">{applicant.location}</td>
                <td className="p-3 border-b">
                  <a
                    href="#"
                    target="_blank"
                    className="flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    Resume
                    <img src={assets.resume_download_icon} alt="Download" className="h-4 w-4" />
                  </a>
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
                      <button className="w-full px-4 py-2 text-green-600 hover:bg-green-50 text-sm text-left">
                        Accept
                      </button>
                      <button className="w-full px-4 py-2 text-red-600 hover:bg-red-50 text-sm text-left">
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewApplications;
