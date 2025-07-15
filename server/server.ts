import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import * as Sentry from '@sentry/node';
import webhookHandler from './controllers/Webhooks';
import companyRoutes from './routes/companyRoutes';
import connectDB from './config/db';
import { connectCloudinary } from './config/cloudinary';
import { clerkMiddleware } from '@clerk/express';
import userRoutes from './routes/userRoutes';
// import jobRoutes from './routes/JobRoutes'; // Uncomment later when ready

// Sentry setup (optional)
/*
Sentry.init({
  dsn: process.env.SENTRY_DSN || 'https://your-dsn-url',
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  sendDefaultPii: true,
});
*/

// Connect DBs
connectDB();
connectCloudinary();

// Initialize Express app
const app = express();

// ✅ Allow both localhost (for dev) and deployed domains
const allowedOrigins = [
  "http://localhost:5173",
  "https://job-portal-3hzr.onrender.com",
  "https://job-portal-3hzr.onrender.app"
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

app.use(express.json());
app.use(clerkMiddleware());

// ✅ Routes
app.get('/', (req, res) => {
  res.send('API is working!');
});

app.post('/webhooks', express.json({ type: '*/*' }), webhookHandler);

app.use('/api/company', companyRoutes);
app.use('/api/user', userRoutes);

// ✅ Dummy job route for testing
app.get('/api/jobs', (req, res) => {
  res.json({ message: "jobs is working!" });
});

// Later, use this once your route is ready:
// app.use('/api/jobs', jobRoutes);

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
