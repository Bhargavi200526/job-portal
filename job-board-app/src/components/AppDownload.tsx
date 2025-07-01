import React from 'react';
import {assets } from '../assets/assets.ts';

const AppDownload: React.FC = () => {
  return (
    <div className="max-w-8xl mx-auto px-4 sm:px-8">
  <div className="w-full bg-gradient-to-r from-pink-100 via-pink-50 to-pink-100 rounded-lg py-6 sm:py-10 mt-10">
    <div className="max-w-screen-lg mx-auto flex flex-col lg:flex-row items-center justify-between gap-2 px-4">
      
      {/* Text and Buttons */}
      <div className="flex flex-col items-center text-center max-w-xl mx-auto lg:items-start lg:text-left lg:mx-0">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3">
          Download Mobile App for Better Experience
        </h1>
        <p className="text-gray-700 mb-5 text-sm sm:text-base">
          Get instant access to job listings and personalized recommendations anytime, anywhere.
        </p>
        <div className="flex items-center justify-center lg:justify-start gap-4">
          <a href="#">
            <img src={assets.play_store} alt="Play Store" className="h-12 sm:h-14" />
          </a>
          <a href="#">
            <img src={assets.app_store} alt="App Store" className="h-12 sm:h-14" />
          </a>
        </div>
      </div>

      {/* App Image */}
     <div className="max-w-xs w-full justify-center hidden lg:flex">
            <img
              src={assets.app_main_img}
              alt="App Preview"
              className="w-full max-h-[260px] object-contain"
            />
          </div>

    </div>
  </div>
</div>

  );
};

export default AppDownload;
