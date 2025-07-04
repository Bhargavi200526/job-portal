import React from 'react';
import { assets } from '../assets/assets.ts';
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
    company: {
      _id: string;
      name: string;
      email: string;
      image?: string;
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
          src={job.company?.image ? job.company.image : assets.company_icon}
          alt="Company"
          className="h-10 w-10 object-contain"
        />
        <div>
          <h4 className="text-lg font-semibold text-gray-800">{job.title}</h4>
          <p className="text-sm text-gray-500">{job.company?.name}</p>
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
      <div
        className="text-gray-700 text-sm line-clamp-2"
        dangerouslySetInnerHTML={{
          __html: job.description.length > 150
            ? job.description.slice(0, 160) + '...'
            : job.description
        }}
      />

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