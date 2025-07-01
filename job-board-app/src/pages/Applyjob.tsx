import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';
import Footer from '../components/Footer';
import moment from 'moment';
import { assets } from '../assets/assets.ts';
import JobCard from '../components/JobCard';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { useAuth, useUser } from '@clerk/clerk-react';

const ApplyJob: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, setUser, jobs, fetchJobs, userApplications, fetchUserApplications } = useAppContext();
  const [jobData, setJobData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isAlreadyApplied, setIsAlreadyApplied] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { getToken } = useAuth();
  const { user: userData } = useUser();
  const userId = userData?.id;

  // Get current job & resume info
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/jobs/${id}`);
        setJobData(res.data.job);
      } catch (err) {
        toast.error("Failed to load job");
      }
    };

    const fetchUserData = async () => {
      try {
        const token = await getToken();
        if (!token) return;
        if (userId) {
          const { data } = await axios.post(
            `${backendUrl}/api/user/user`,
            { userId }
          );
          setUser(data?.user);
          localStorage.setItem("userData", JSON.stringify(data?.user));
        } else {
          const dataTest: any = localStorage.getItem("userData");
          const getDataFromLocalStorage = JSON.parse(dataTest);
          setUser(getDataFromLocalStorage);
        }
      } catch (err) {
        setUser(null);
      }
    };

    fetchUserData();
    fetchJob();
    fetchJobs();
    fetchUserApplications();
    // eslint-disable-next-line
  }, [id]);

  // Check if already applied for this job
  useEffect(() => {
    if (userApplications && id) {
      const applied = userApplications.some(
        (app) =>
          (typeof app.jobId === "object" && app.jobId !== null && app.jobId._id === id) ||
          (typeof app.jobId === "string" && app.jobId === id)
      );
      setIsAlreadyApplied(applied);
    }
  }, [userApplications, id]);

  const handleApply = async () => {
    if (!user) {
      toast.error("You must be logged in to apply.");
      return;
    }
    if (!user?.resume || user.resume === "") {
      toast.warning("Please upload your resume before applying.");
      navigate("/application");
      return;
    }
    if (isAlreadyApplied) {
      toast.info("Already applied for this job");
      return;
    }
    try {
      setLoading(true);
      const token = await getToken();
      const res = await axios.post(
        `${backendUrl}/api/user/apply`,
        { jobId: id, userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        toast.success("Applied successfully!");
        // Re-fetch user applications to update the state
        fetchUserApplications();
        setIsAlreadyApplied(true);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      if (msg === "Already applied for this job") {
        toast.info("Already applied for this job");
        setIsAlreadyApplied(true);
      } else {
        toast.error("Error applying to job");
      }
    } finally {
      setLoading(false);
    }
  };

  // NEW: filter out jobs the user has already applied for
  const appliedJobIds = new Set(userApplications.map(app => app.jobId?._id || app.jobId));

  const moreJobs = jobData
    ? jobs
        .filter(
          (j) =>
            j._id !== jobData._id &&
            j.companyId?._id === jobData.companyId?._id &&
            !appliedJobIds.has(j._id)
        )
        .slice(0, 4)
    : [];

  if (!jobData) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <div className="max-w-8xl mx-auto px-4 sm:px-8 mt-10">
        <div className="bg-gradient-to-br from-white via-gray-50 to-rose-100 border border-rose-200 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 min-h-[250px] flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-start gap-5">
            <img
              src={jobData.companyId?.image||jobData.company?.image  || assets.company_icon}
              alt="Company Logo"
              className="h-16 w-16 object-cover rounded-md"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-3">{jobData.title}</h1>
              <div className="text-gray-600 text-sm flex flex-wrap gap-x-4 gap-y-4 mt-3">
                <span className="flex items-center gap-2">
                  <img src={assets.suitcase_icon} alt="Role" className="h-4 w-4" />
                  {jobData.companyId?.name}
                </span>
                <span className="flex items-center gap-2">
                  <img src={assets.location_icon} alt="Location" className="h-4 w-4" />
                  {jobData.location}
                </span>
                <span className="flex items-center gap-2">
                  <img src={assets.person_icon} alt="Level" className="h-4 w-4" />
                  {jobData.level}
                </span>
                <span className="flex items-center gap-2">
                  <img src={assets.money_icon} alt="Salary" className="h-4 w-4" />
                  CTC: ₹{(jobData.salary / 1000).toFixed(0)}K
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            {isAlreadyApplied ? (
              <button
                className="bg-gray-400 text-white px-6 py-2 rounded cursor-not-allowed"
                disabled
              >
                Already Applied
              </button>
            ) : (
              <button
                onClick={handleApply}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                disabled={loading}
              >
                {loading ? <Loader /> : "Apply Now"}
              </button>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Posted {moment(jobData.date).fromNow()}
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col lg:flex-row gap-10">
          <div className="w-full lg:w-2/3 bg-white border border-gray-200 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Job Description</h2>
            <div
              className="prose prose-sm max-w-none text-gray-700 leading-relaxed prose-h3:mt-6 prose-h4:mt-4 prose-p:mb-3"
              dangerouslySetInnerHTML={{ __html: jobData.description }}
            />
            <div className="mt-8 flex justify-start">
              {isAlreadyApplied ? (  
                <button
                  className="bg-gray-400 text-white px-6 py-2 rounded cursor-not-allowed"
                  disabled
                >
                  Already Applied
                </button>
              ) : (
                <button
                  onClick={handleApply}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                  disabled={loading}
                >
                  {loading ? <Loader /> : "Apply Now"}
                </button>
              )}
            </div>
          </div>

          <div className="w-full lg:w-1/3">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              More jobs from {jobData.companyId?.name}
            </h2>
            <div className="flex flex-col gap-4">
              {moreJobs.length > 0 ? (
                moreJobs.map((job, index) => (
                  <JobCard key={index} job={{ ...job, company: job.companyId }} />
                ))
              ) : (
                <p className="text-sm text-gray-500">No more jobs available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ApplyJob;