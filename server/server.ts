
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import * as Sentry from '@sentry/node';
import webhookHandler from './controllers/Webhooks';
import companyRoutes from './routes/companyRoutes';
import connectDB from './config/db';
import { connectCloudinary } from './config/cloudinary';
import jobRoutes from './routes/JobRoutes';
import { clerkMiddleware } from '@clerk/express';
import userRoutes from './routes/userRoutes';




// Load environment variables
dotenv.config();

// Initialize Sentry (no handlers)
//Sentry.init({
  //dsn: process.env.SENTRY_DSN || 'https://your-dsn-url',
  
  //tracesSampleRate: 1.0,
  //profilesSampleRate: 1.0,
  //sendDefaultPii: true,
//});

// Connect to MongoDB
connectDB();
connectCloudinary();


// CORS middleware
const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "https://job-portal-3hzr.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// THEN middleware
app.use(express.json());
app.use(clerkMiddleware());


// Routes...



// Routes
app.get('/', (req, res) => {
  res.send('API is working!');
});

app.post('/webhooks', express.json({ type: '*/*' }), webhookHandler);
// app.use('/api/company', companyRoutes);
app.get('/api/jobs', (req, res) => {
  // ... your logic to fetch jobs
  res.json({ message: 'List of jobs' });
});
app.use('/api/jobs', jobRoutes);
app.use('/api/user', userRoutes);




// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

