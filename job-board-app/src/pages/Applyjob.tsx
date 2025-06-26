import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import Footer from '../components/Footer';
import moment from 'moment';
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import JobCard from '../components/JobCard';

const ApplyJob: React.FC = () => {
  const { id } = useParams();
  const [jobData, setJobData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { jobs } = useAppContext();

  useEffect(() => {
    if (jobs.length > 0) {
      const data = jobs.find((job) => job._id === id);
      if (data) {
        setJobData(data);
      }
    }
  }, [id, jobs]);

  const handleApply = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Application submitted successfully!');
    }, 2000);
  };

  if (!jobData) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  // Filter more jobs from same company
  const moreJobs = jobs
    .filter((job) => job._id !== jobData._id && job.companyId._id === jobData.companyId._id)
    .slice(0, 4);

  return (
    <>
      <div className="max-w-8xl mx-auto px-4 sm:px-8 mt-10">
        {/* Header Container */}
        <div className="bg-gradient-to-br from-white via-gray-50 to-rose-100 
            border border-rose-200 rounded-xl 
            p-6 shadow-md hover:shadow-xl 
            transition-all duration-300 
            min-h-[250px] flex flex-col lg:flex-row 
            justify-between items-start lg:items-center gap-6"
        >
          {/* Left Info */}
          <div className="flex items-start gap-5">
            <img
              src={jobData.companyId.image}
              alt="Company Logo"
              className="h-16 w-16 object-cover rounded-md"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-3">{jobData.title}</h1>
              <div className="text-gray-600 text-sm flex flex-wrap gap-x-4 gap-y-4 mt-3">
                <span className="flex items-center gap-2">
                  <img src={assets.suitcase_icon} alt="Role" className="h-4 w-4" />
                  {jobData.companyId.name}
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

          {/* Right Apply Button */}
          <div className="flex flex-col items-end gap-3">
            <button
              onClick={handleApply}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? <Loader small /> : 'Apply Now'}
            </button>
            <p className="text-xs text-gray-500 mt-1">
              Posted {moment(jobData.date).fromNow()}
            </p>
          </div>
        </div>

        {/* Main Content Split */}
        <div className="mt-10 flex flex-col lg:flex-row gap-10">
          {/* Left Column - Description */}
          <div className="w-full lg:w-2/3 bg-white border border-gray-200 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Job Description</h2>
            <div
                className="prose prose-sm max-w-none text-gray-700 leading-relaxed 
    prose-h3:mt-6 prose-h4:mt-4 prose-p:mb-3"
              dangerouslySetInnerHTML={{ __html: jobData.description }}
            ></div>

            <div className="mt-8 flex justify-start">
              <button
                onClick={handleApply}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                disabled={loading}
              >
                {loading ? <Loader small /> : 'Apply Now'}
              </button>
            </div>
          </div>

          {/* Right Column - More Jobs */}
          <div className="w-full lg:w-1/3">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              More jobs from {jobData.companyId.name}
            </h2>
            <div className="flex flex-col gap-4">
              {moreJobs.length > 0 ? (
                moreJobs.map((job, index) => (
                  <JobCard key={index} job={job} />
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
