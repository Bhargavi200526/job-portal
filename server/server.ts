import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import * as Sentry from '@sentry/node';
import webhookHandler from './controllers/Webhooks';

import connectDB from './config/db';

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

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('API is working!');
});

app.post('/webhooks', express.json({ type: '*/*' }), webhookHandler);



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

