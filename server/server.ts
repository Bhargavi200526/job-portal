import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
// import * as Sentry from '@sentry/node'; // (Optional, not needed for now)
import webhookHandler from './controllers/Webhooks';
import companyRoutes from './routes/companyRoutes';
import connectDB from './config/db';
import { connectCloudinary } from './config/cloudinary';
import { CorsOptions } from 'cors';
import { clerkMiddleware } from '@clerk/express';
import userRoutes from './routes/userRoutes';
import jobRoutes from './routes/JobRoutes';
// Connect to MongoDB and Cloudinary
connectDB();
connectCloudinary();

// Set up Express app
const app = express();
const allowedOrigins = [
  "http://localhost:5173",
];

const corsOptions: CorsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(clerkMiddleware());

// Routes
app.get('/', (req, res) => {
  res.send('API is working!');
});




// Keep other routes if needed
app.post('/webhooks', express.json({ type: '*/*' }), webhookHandler);
app.use('/api/company', companyRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/user', userRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
