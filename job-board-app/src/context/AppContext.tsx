import React, { createContext, useContext, useState, useEffect } from 'react';
import { jobsData } from '../assets/assets'; // import your jobs data

interface User {
  name: string;
  email: string;
  role: 'employer' | 'seeker';
}

interface Job {
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
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  search: string;
  setSearch: (val: string) => void;
  location: string;
  setLocation: (val: string) => void;
  jobs: Job[];
  fetchJobs: () => Promise<void>;
  onSearch: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [search, setSearch] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [jobs, setJobs] = useState<Job[]>([]);

  const fetchJobs = async () => {
    // simulate API call
    setJobs(jobsData);
  };

  const onSearch = () => {
    // logic for search filtering (you can add filtering later)
  };

  useEffect(() => {
    fetchJobs(); // load jobs on mount
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        search,
        setSearch,
        location,
        setLocation,
        jobs,
        fetchJobs,
        onSearch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
