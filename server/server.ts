import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
// import * as Sentry from '@sentry/node'; // (Optional, not needed for now)
import webhookHandler from './controllers/Webhooks';
import companyRoutes from './routes/companyRoutes';
import connectDB from './config/db';
import { connectCloudinary } from './config/cloudinary';
// ❌ Remove jobRoutes import
// import jobRoutes from './routes/JobRoutes';
import { clerkMiddleware } from '@clerk/express';
import userRoutes from './routes/userRoutes';

// Connect to MongoDB and Cloudinary
connectDB();
connectCloudinary();

// Set up Express app
const app = express();
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

// Routes
app.get('/', (req, res) => {
  res.send('API is working!');
});

// ✅ This is what you asked for
app.get('/api/jobs', (req, res) => {
  res.json({ message: "jobs is working!" });
});

// Keep other routes if needed
app.post('/webhooks', express.json({ type: '*/*' }), webhookHandler);
app.use('/api/company', companyRoutes);
app.use('/api/user', userRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
