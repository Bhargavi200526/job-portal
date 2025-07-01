import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import moment from "moment";
import { assets } from "../assets/assets";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useAppContext } from '../context/AppContext';

const Applications: React.FC = () => {
  const [isedit, setIsEdit] = useState(false);
  const [resume, setResume] = useState<File | null>(null);

  const { user, setUser, userApplications, fetchUserApplications } = useAppContext();
  const { getToken, isLoaded, sessionId } = useAuth();
  const { user: userData } = useUser();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setResume(e.target.files[0]);
    }
  };

  // Resume upload (unchanged)
  const uploadResume = async () => {
    if (!resume) return;
    if (!isLoaded || !sessionId) {
      return toast.error("You must be logged in to upload a resume.");
    }

    const token = await getToken();
    const formData = new FormData();
    formData.append("file", resume);
    formData.append("userId", userData?.id || user?._id || "");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/update-resume`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      const data = await response.json();
      if (data.success) {
        toast.success("Resume uploaded successfully!");
        setUser((prev) => prev ? { ...prev, resume: data.resumeUrl } : prev);
      } else {
        toast.error("Failed to upload resume");
      }
    } catch {
      toast.error("Failed to upload resume");
    }
  };

  // Fetch applications when page mounts or user changes
  useEffect(() => {
    fetchUserApplications();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-12">
        {/* Resume Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Your Resume
          </h2>

          <div className="bg-white shadow-md border border-gray-200 rounded-lg p-6">
            {isedit ? (
              <>
                <label
                  htmlFor="resumeUpload"
                  className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-blue-400 p-6 rounded-lg hover:bg-blue-50 transition"
                >
                  <p className="text-gray-600 mb-2">
                    Click to select your resume
                  </p>
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
                  onClick={() => {
                    uploadResume();
                    setIsEdit(false);
                  }}
                >
                  Save Resume
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-4 items-start">
                {user?.resume ? (
                    <a
                      href={user.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      View Uploaded Resume
                    </a>
                  ) : resume ? (
                    <a
                      href={URL.createObjectURL(resume)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      View Selected Resume
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
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Jobs Applied
          </h2>

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
                {userApplications.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-5 text-center text-gray-500">
                      No job applications found.
                    </td>
                  </tr>
                ) : (
                  userApplications.map((app) => (
                    <tr key={app._id} className="border-t text-gray-700">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img
                          src={app.companyId?.image || assets.profile_upload_icon}
                          alt={app.companyId?.name || "Company"}
                          className="h-8 w-8 rounded"
                        />
                        {app.companyId?.name}
                      </td>
                      <td className="py-3 px-4">{app.jobId?.title}</td>
                      <td className="py-3 px-4">{app.jobId?.location}</td>
                      <td className="py-3 px-4">
                        {moment(app.appliedAt).format("DD MMM, YYYY")}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium 
                            ${
                              app.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : app.status === "accepted"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                        >
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Applications;