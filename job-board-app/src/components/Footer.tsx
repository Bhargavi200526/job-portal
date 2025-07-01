import React from 'react';
import { assets } from '../assets/assets.ts';

const Footer: React.FC = () => {
  return (
    <div className="w-full mt-16">
      <div className="max-w-8xl mx-auto px-4 sm:px-8 bg-gray-100 py-6 rounded-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo + Copyright */}
          <div className="flex items-center gap-3">
            <img src={assets.logo} alt="Logo" className="h-8" />
            <p className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} Gcodebasics.dev | All rights reserved
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex gap-4">
            <a href="#">
              <img src={assets.facebook_icon} alt="Facebook" className="h-6 hover:opacity-80" />
            </a>
            <a href="#">
              <img src={assets.twitter_icon} alt="Twitter" className="h-6 hover:opacity-80" />
            </a>
            <a href="#">
              <img src={assets.instagram_icon} alt="Instagram" className="h-6 hover:opacity-80" />
            </a>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Footer;
