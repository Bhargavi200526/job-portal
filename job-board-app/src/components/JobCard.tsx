import React from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

interface JobCardProps {
  job: {
    _id: string;
    title: string;
    location: string;
    level: string;
    category: string;
    salary: number;
    date: number;
    description: string;
    companyId: {
      _id: string;
      name: string;
      email: string;
      image: string;
    };
  };
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const navigate = useNavigate();

  const handleApplyClick = () => {
    navigate(`/apply-job/${job._id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5 flex flex-col gap-4 hover:shadow-lg transition-all">
      {/* Company Info */}
      <div className="flex items-center gap-3">
        <img
          src={job.companyId.image || assets.company_icon}
          alt="Company"
          className="h-10 w-10 object-contain"
        />
        <div>
          <h4 className="text-lg font-semibold text-gray-800">{job.title}</h4>
          <p className="text-sm text-gray-500">{job.companyId.name}</p>
        </div>
      </div>

      {/* Location and Level Pills */}
      <div className="flex gap-3 text-sm">
        <span className="px-3 py-1 rounded-full border border-green-300 text-green-700">
          {job.location}
        </span>
        <span className="px-3 py-1 rounded-full border border-green-300 text-green-700">
          {job.level}
        </span>
      </div>

      {/* Description Preview */}
      <p
        className="text-gray-700 text-sm"
        dangerouslySetInnerHTML={{
          __html: job.description.slice(0, 150) + '...',
        }}
      ></p>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-auto">
        <button
          onClick={handleApplyClick}
          className="bg-black text-white px-4 py-1 rounded hover:bg-gray-900 text-sm"
        >
          Apply Now
        </button>
        <button className="border border-black text-black px-4 py-1 rounded hover:bg-black hover:text-white text-sm">
          Learn More
        </button>
      </div>
    </div>
  );
};

export default JobCard;
