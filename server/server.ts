import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
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
Sentry.init({
  dsn: process.env.SENTRY_DSN || 'https://your-dsn-url',
  
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  sendDefaultPii: true,
});

// Connect to MongoDB
connectDB();
connectCloudinary();


// Create Express app
const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "https://job-portal-client-jade-one.vercel.app",
  "https://job-portal-client-jvcoi7c4w-bhargavis-projects-6383a334.vercel.app",
  "https://job-portal-client-k11gtoezd-bhargavis-projects-6383a334.vercel.app" 
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());
app.use(clerkMiddleware())

// Routes
app.get('/', (req, res) => {
  res.send('API is working!');
});

app.post('/webhooks', express.json({ type: '*/*' }), webhookHandler);
app.use('/api/company', companyRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/user', userRoutes);




// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

