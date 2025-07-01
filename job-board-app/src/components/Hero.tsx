import React from 'react';
import { assets } from '../assets/assets.ts';
import { useAppContext } from '../context/AppContext';

const Hero: React.FC = () => {
    const { search, setSearch, setLocation, onSearch } = useAppContext();
  return (

    <div className="px-4 sm:px-6 lg:px-8 mt-10">
      {/* Black Gradient Search Box */}
      <div className="max-w-8xl mx-auto bg-gradient-to-r from-gray-900 via-black to-gray-800 
                      text-white rounded-xl shadow-lg p-10 flex flex-col gap-6 items-center 
                      text-center transition-transform duration-300 hover:scale-[1.01] hover:shadow-2xl">
        
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
          Over 10,000+ Jobs to Apply
        </h2>

        <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl">
          Your Next Big Career Move Starts Right Here — Explore the Best Job Opportunities and Take the First Step Towards Your Future.
        </p>

        {/* Search Fields */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full justify-center">
          {/* Job Search Input */}
          <div className="flex items-center bg-white rounded px-3 py-2 w-full sm:w-1/2 max-w-sm 
                          transition-all duration-300 hover:ring-2 hover:ring-blue-500">
            <img src={assets.search_icon} alt="search" className="h-5 w-5 mr-2" />
            <input
              type="text"
              placeholder="Search for jobs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-black focus:outline-none"
            />
          </div>

          {/* Location Input */}
          <div className="flex items-center bg-white rounded px-3 py-2 w-full sm:w-1/2 max-w-sm 
                          transition-all duration-300 hover:ring-2 hover:ring-blue-500">
            <img src={assets.location_icon} alt="location" className="h-5 w-5 mr-2" />
            <input
              type="text"
              placeholder="Location"
              onChange={(e) => setLocation(e.target.value)}
              className="w-full text-black focus:outline-none"
            />
          </div>

          {/* Search Button */}
          <button 
          onClick={onSearch}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 
                             transition duration-300 shadow-md hover:shadow-lg">
            Search
          </button>
        </div>
      </div>

      {/* Trusted Logos Section */}
      <div className="max-w-8xl mx-auto mt-8 border rounded-xl shadow-md p-6 bg-white text-center">
        
        <div className="flex flex-wrap justify-center items-center gap-14">
          <p className="text-gray-700 font-bold mb-4">Trusted by</p>
          <img className="h-8" src={assets.microsoft_logo} alt="Microsoft" />
          <img className="h-8" src={assets.walmart_logo} alt="Walmart" />
          <img className="h-8" src={assets.accenture_logo} alt="Accenture" />
          <img className="h-8" src={assets.samsung_logo} alt="Samsung" />
          <img className="h-8" src={assets.adobe_logo} alt="Adobe" />
          <img className="h-8" src={assets.amazon_logo} alt="Amazon" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
