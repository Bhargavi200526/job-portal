
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; 
import App from './App';
import Navbar from './components/Navbar';
import './index.css';
import { AppProvider } from './context/AppContext';
import { ClerkProvider } from '@clerk/clerk-react'
import { useUser, UserButton, SignInButton, SignUpButton } from '@clerk/clerk-react';


// Import  Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
     <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl='/'>
    <BrowserRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
     </ClerkProvider>
  </React.StrictMode>
);