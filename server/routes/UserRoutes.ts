import express from 'express';
import multer from 'multer';
import { requireAuth } from '@clerk/express';
import {
  syncUser,
  getUserData,
  applyForJob,
  getUserApplications,
  updateUserResume,
} from '../controllers/userController';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Sync Clerk user to MongoDB (call this on login/signup from frontend)
router.post('/sync', requireAuth(), syncUser);

// Get user data
router.post('/user', getUserData);

// Apply for a job
router.post('/apply', applyForJob);

// Get user applications
router.get('/applications', requireAuth(), getUserApplications);

// Upload/update resume
router.post(
  '/update-resume',
  requireAuth(),
  upload.single('file'),
  updateUserResume
);

export default router;