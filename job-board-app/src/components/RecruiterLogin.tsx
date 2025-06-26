import React, { useState,useEffect  } from 'react';
import { assets } from '../assets/assets';

const RecruiterLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // true = login, false = sign-up
  const [stepTwo, setStepTwo] = useState(false);



  const handleFirstStepSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !companyName)) {
      alert('Please fill in all required fields.');
      return;
    }
    if (isLogin) {
      alert(`Logged in with email: ${email}`);
    } else {
      setStepTwo(true); // proceed to logo upload step
    }
  };

  const handleFinalSubmit = () => {
    if (!logo) {
      alert('Please upload your company logo.');
      return;
    }
    alert('Account created successfully!');
    // Reset after signup if needed
  };
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded shadow-lg">
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
          <h2 className="text-2xl font-bold text-center mb-2">
            Welcome back to login
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Upload your company logo
          </p>

          <div className="flex flex-col items-center gap-4">
            <label htmlFor="logoUpload" className="cursor-pointer">
              <img
                src={
                  logo
                    ? URL.createObjectURL(logo)
                    : assets.upload_area
                }
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
