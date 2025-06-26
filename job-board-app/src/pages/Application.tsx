import React, { useState } from 'react';
import Navbar from '../components/Navbar'; 
import moment from 'moment';
import { assets, jobsApplied } from '../assets/assets'; 
import Footer from '../components/Footer';

const Applications: React.FC = () => {
  const [isedit, setIsEdit] = useState(false);
  const [resume, setResume] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setResume(e.target.files[0]);
    }
  };

  return (
    <>
     

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-12">
        {/* Resume Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Resume</h2>

          <div className="bg-white shadow-md border border-gray-200 rounded-lg p-6">
            {isedit ? (
              <>
                <label
                  htmlFor="resumeUpload"
                  className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-blue-400 p-6 rounded-lg hover:bg-blue-50 transition"
                >
                  <p className="text-gray-600 mb-2">Click to select your resume</p>
                  <input
                    type="file"
                    id="resumeUpload"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                  />
                  <img
                    src={assets.profile_upload_icon}
                    alt="Upload Icon"
                    className="h-10 w-10"
                  />
                  {resume && (
                    <p className="mt-3 text-sm text-green-600">{resume.name}</p>
                  )}
                </label>

                <button
                  className="mt-4 px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  onClick={() => setIsEdit(false)}
                >
                  Save Resume
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-4 items-start">
                {resume ? (
                  <a
                    href={URL.createObjectURL(resume)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    View Resume
                  </a>
                ) : (
                  <p className="text-gray-500 italic">No resume uploaded yet.</p>
                )}

                <button
                  className="px-5 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                  onClick={() => setIsEdit(true)}
                >
                  Edit Resume
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Jobs Applied Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Jobs Applied</h2>

          <div className="bg-white shadow-md border border-gray-200 rounded-lg overflow-x-auto">
            <table className="min-w-full table-auto text-left">
              <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
                <tr>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Job Title</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {jobsApplied.map((job, index) => (
                  <tr key={index} className="border-t text-gray-700">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img src={job.logo} alt={job.company} className="h-8 w-8 rounded" />
                      {job.company}
                    </td>
                    <td className="py-3 px-4">{job.title}</td>
                    <td className="py-3 px-4">{job.location}</td>
                    <td className="py-3 px-4">{moment(job.date).format('DD MMM, YYYY')}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium 
                          ${
                            job.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : job.status === 'Accepted'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                      >
                        {job.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Applications;
