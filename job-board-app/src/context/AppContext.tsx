import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useUser, useAuth } from "@clerk/clerk-react";

interface User {
  name: string;
  email: string;
  role: 'employer' | 'seeker';
  resume?: string; 
  image?: string;
  _id?: string;
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
  company: {
    _id: string;
    name: string;
    email: string;
    image: string;
  };
}

interface Application {
  _id: string;
  jobId: {
    _id: string;
    title: string;
    location: string;
    category: string;
    level: string;
    salary: number;
    description: string;
  };
  companyId: {
    _id: string;
    name: string;
    email: string;
    image: string;
  };
  status: string;
  appliedAt: string;
}

interface Company {
  id: string;
  name: string;
  email: string;
  image?: string;
}

interface AppContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  companyToken: string | null;
  setCompanyToken: (token: string | null) => void;
  companyData: Company | null;
  setCompanyData: (data: Company | null) => void;
  search: string;
  setSearch: (val: string) => void;
  location: string;
  setLocation: (val: string) => void;
  jobs: Job[];
  fetchJobs: () => Promise<void>;
  onSearch: () => void;

  // new:
  userApplications: Application[];
  fetchUserApplications: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Clerk hooks for user info and session token
  const clerkUser = useUser().user;
  const { getToken } = useAuth();

  // App state
  const [user, setUser] = useState<User | null>(null);   
  const [search, setSearch] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [companyToken, setCompanyToken] = useState<string | null>(
    localStorage.getItem('companyToken') || null
  );
  const [companyData, setCompanyData] = useState<Company | null>(null);

  // New: user applications state
  const [userApplications, setUserApplications] = useState<Application[]>([]);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Fetch jobs from backend
  const fetchJobs = async () => {
    try {
      const res = await axios.get("https://job-portal-3hzr.onrender.com/api/jobs", {
  withCredentials: true
});
      if (res.data.jobs && Array.isArray(res.data.jobs)) {
        setJobs(res.data.jobs);
      } else {
        setJobs([]);
        toast.error('No jobs found');
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      toast.error('Failed to fetch jobs');
      setJobs([]);
    }
  };

  // Fetch company data
  const fetchCompanyData = async () => {
    if (!companyToken) return;
    try {
      const res = await axios.get(`${backendUrl}/api/company/profile`, {
        headers: {
          Authorization: `Bearer ${companyToken}`,
        },
      });
      setCompanyData(res.data.company);
    } catch (err: any) {
      console.error('Failed to fetch company data:', err);
      toast.error('Session expired. Please login again.');
      setCompanyToken(null);
      setCompanyData(null);
      localStorage.removeItem('companyToken');
    }
  };

  // Sync Clerk user to backend MongoDB (ensure user exists in DB)
  useEffect(() => {
    async function syncUserToBackend() {
      if (!clerkUser) {
        setUser(null);
        return;
      }
      const token = await getToken();
      try {
        await axios.post(
          `${backendUrl}/api/user/sync`,
          {
            id: clerkUser.id,
            email: clerkUser.emailAddresses[0]?.emailAddress || "",
            name: clerkUser.fullName || "",
            image: clerkUser.imageUrl || "",
            role: 'seeker'
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        // Now fetch user data from backend for context
        const res = await axios.post(
          `${backendUrl}/api/user/user`,
          {
            userId: clerkUser.id
          }
        );
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
        console.error("Failed to sync/fetch user to backend:", err);
      }
    }
    syncUserToBackend();
    // eslint-disable-next-line
  }, [clerkUser, getToken, backendUrl]);

  // Maintain login on reload for company
  useEffect(() => {
    if (companyToken) {
      fetchCompanyData();
    }
    // eslint-disable-next-line
  }, [companyToken]);

  // New: Fetch user's job applications
  const fetchUserApplications = async () => {
    try {
      const token = await getToken();
      // GET /api/user/applications with Bearer token
      const res = await axios.get(`${backendUrl}/api/user/applications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.success && Array.isArray(res.data.applications)) {
        setUserApplications(res.data.applications);
      } else {
        setUserApplications([]);
      }
    } catch (err) {
      setUserApplications([]);
      toast.error("Failed to fetch applications");
      console.error("Error fetching applications:", err);
    }
  };

  // Keep token in localStorage
  useEffect(() => {
    if (companyToken) {
      localStorage.setItem('companyToken', companyToken);
    } else {
      localStorage.removeItem('companyToken');
    }
  }, [companyToken]);

  // Fetch jobs on mount (always, regardless of user)
  useEffect(() => {
    fetchJobs();
  }, []);

  const onSearch = () => {
    // You can implement actual filtering later
    console.log("Search clicked with:", search, location);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        companyToken,
        setCompanyToken,
        companyData,
        setCompanyData,
        search,
        setSearch,
        location,
        setLocation,
        jobs,
        fetchJobs,
        onSearch,
        userApplications,
        fetchUserApplications,
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