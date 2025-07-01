
import React, { useState, useMemo } from 'react';
import { assets, JobCategories, JobLocations } from '../assets/assets.ts';
import { useAppContext } from '../context/AppContext';
import JobCard from './JobCard';

const JOBS_PER_PAGE = 6;

const JobListing: React.FC = () => {
  const {
    search,
    location,
    setSearch,
    setLocation,
    jobs,
  } = useAppContext();

  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  const isSearched = search !== '' || location !== '' || selectedCategories.length > 0 || selectedLocations.length > 0;

  const filteredJobs = useMemo(() => {
  return jobs.filter((job) => {
    const titleMatch = search ? job.title.toLowerCase().includes(search.toLowerCase()) : false;
    const locationMatchInput = location ? job.location.toLowerCase().includes(location.toLowerCase()) : false;
    const inputMatch = search || location ? (titleMatch || locationMatchInput) : true;

    const categoryMatch = selectedCategories.length > 0 ? selectedCategories.includes(job.category) : true;
    const sidebarLocationMatch = selectedLocations.length > 0 ? selectedLocations.includes(job.location) : true;

    return inputMatch && categoryMatch && sidebarLocationMatch;
  });
}, [search, location, selectedCategories, selectedLocations, jobs]);

  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
  const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
  const currentJobs = filteredJobs.slice(startIndex, startIndex + JOBS_PER_PAGE);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
    setCurrentPage(1);
  };

  const handleLocationChange = (loc: string) => {
    setSelectedLocations((prev) =>
      prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc]
    );
    setCurrentPage(1);
  };

  return (
    <div className="max-w-8xl mx-auto px-4 sm:px-8 mt-10">

      {/* Toggle Button for Mobile */}
      <div className="flex justify-end lg:hidden mb-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
          onClick={() => setShowFilters(prev => !prev)}
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* Sidebar Filters */}
        {(showFilters || window.innerWidth >= 1024) && (
          <div className="bg-white shadow-md rounded-lg p-4 w-full lg:w-1/3">
            {isSearched && (
              <>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Current Filters</h3>
                <div className="flex flex-wrap gap-3">
                  {search && (
                    <span className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full shadow-sm">
                      {search}
                      <img
                        onClick={() => setSearch('')}
                        src={assets.cross_icon}
                        alt="Remove"
                        className="ml-2 h-4 w-4 cursor-pointer"
                      />
                    </span>
                  )}
                  {location && (
                    <span className="flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-full shadow-sm">
                      {location}
                      <img
                        onClick={() => setLocation('')}
                        src={assets.cross_icon}
                        alt="Remove"
                        className="ml-2 h-4 w-4 cursor-pointer"
                      />
                    </span>
                  )}
                </div>
              </>
            )}

            <div className="mt-6">
              <h4 className="text-md font-semibold text-gray-700 mb-2">Search by Categories</h4>
              <ul className="flex flex-col gap-3">
                {JobCategories.map((category, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`cat-${index}`}
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                      className="accent-blue-500 h-4 w-4 cursor-pointer"
                    />
                    <label htmlFor={`cat-${index}`} className="text-sm text-gray-800 cursor-pointer">
                      {category}
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <h4 className="text-md font-semibold text-gray-700 mb-2">Search by Location</h4>
              <ul className="flex flex-col gap-3">
                {JobLocations.map((loc, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`loc-${index}`}
                      checked={selectedLocations.includes(loc)}
                      onChange={() => handleLocationChange(loc)}
                      className="accent-blue-500 h-4 w-4 cursor-pointer"
                    />
                    <label htmlFor={`loc-${index}`} className="text-sm text-gray-800 cursor-pointer">
                      {loc}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Job Listings */}
        <section className="w-full">
          <h3 className="text-xl font-semibold text-gray-800 mb-1">Latest Jobs</h3>
          <p className="text-gray-600 mb-4">Get Your Desired Job From Top Companies</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentJobs.length > 0 ? (
              currentJobs.map((job, index) => (
                <JobCard key={index} job={{
        ...job,
        company: job.companyId // use companyId if company is missing
      }} />
              ))
            ) : (
              <p className="text-gray-500 col-span-full">No jobs found matching your filters.</p>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-wrap justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-white bg-black rounded-md disabled:opacity-30"
              >
                ←
              </button>

              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-1 text-white rounded-md ${
                    currentPage === index + 1
                      ? 'bg-gradient-to-r from-black to-gray-800'
                      : 'bg-black/70 hover:bg-black'
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-white bg-black rounded-md disabled:opacity-30"
              >
                →
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default JobListing;
