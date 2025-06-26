import React from 'react';
import Hero from '../components/Hero';
import Navbar from '../components/Navbar'
import JobListing from '../components/JobListing';
import AppDownload from '../components/AppDownload';
import Footer from '../components/Footer';

const Home: React.FC = () => {
  return (
    <div>
      
      <Hero />
      <JobListing/>
      <AppDownload/>
      <Footer/>
    </div>
  );
};

export default Home;
