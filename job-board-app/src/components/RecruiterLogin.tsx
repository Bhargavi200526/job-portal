import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets.ts';
import axios from 'axios';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RecruiterLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [stepTwo, setStepTwo] = useState(false);

  const { setCompanyToken, setCompanyData } = useAppContext();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleFirstStepSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || (!isLogin && !companyName)) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (isLogin) {
      try {
        const res = await axios.post(`${backendUrl}/api/company/login`, {
          email,
          password,
        });

        setCompanyToken(res.data.token);
        setCompanyData(res.data.company);
        toast.success('Login successful!');
        navigate('/dashboard');
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Invalid credentials!');
      }
    } else {
      setStepTwo(true);
    }
  };

  const handleFinalSubmit = async () => {
    if (!logo) {
      toast.error('Please upload your company logo.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      formData.append('name', companyName);
      formData.append('image', logo);

      const res = await axios.post(`${backendUrl}/api/company/register`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setCompanyToken(res.data.token);
      setCompanyData(res.data.company);
      localStorage.setItem('companyToken', res.data.token);

      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Signup failed!');
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded shadow-lg">
      <ToastContainer position="top-right" autoClose={3000} />

      {!stepTwo ? (
        <>
          <h2 className="text-2xl font-bold text-center mb-2">
            {isLogin ? 'Recruiter Login' : 'Recruiter Signup'}
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Welcome back! Please {isLogin ? 'login' : 'register'} to continue.
          </p>

          <form onSubmit={handleFirstStepSubmit} className="space-y-5">
            <div className="flex items-center border rounded px-3 py-2">
              <img src={assets.email_icon} alt="Email" className="w-5 h-5 mr-2" />
              <input
                type="email"
                placeholder="Email"
                className="w-full outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center border rounded px-3 py-2">
                <img src={assets.lock_icon} alt="Password" className="w-5 h-5 mr-2" />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {isLogin && (
                <p className="text-right text-sm text-blue-600 cursor-pointer hover:underline">
                  Forgot Password?
                </p>
              )}
            </div>

            {!isLogin && (
              <div className="flex items-center border rounded px-3 py-2">
                <img src={assets.person_icon} alt="Company" className="w-5 h-5 mr-2" />
                <input
                  type="text"
                  placeholder="Company Name"
                  className="w-full outline-none"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              {isLogin ? 'Login' : 'Next'}
            </button>
          </form>

          <p className="text-center mt-4 text-sm text-gray-600">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <span
              onClick={() => {
                setIsLogin(!isLogin);
                setStepTwo(false);
              }}
              className="text-blue-600 cursor-pointer hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </span>
          </p>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-center mb-2">Almost done!</h2>
          <p className="text-center text-gray-500 mb-6">Upload your company logo</p>

          <div className="flex flex-col items-center gap-4">
            <label htmlFor="logoUpload" className="cursor-pointer">
              <img
                src={logo ? URL.createObjectURL(logo) : assets.upload_area}
                alt="Upload Logo"
                className="h-32 w-32 rounded-full object-cover border border-gray-300"
              />
            </label>
            <input
              id="logoUpload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setLogo(e.target.files[0]);
                }
              }}
            />
          </div>

          <button
            onClick={handleFinalSubmit}
            className="mt-6 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            Create
          </button>
        </>
      )}
    </div>
  );
};

export default RecruiterLogin;
