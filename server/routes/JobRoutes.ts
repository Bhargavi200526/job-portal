import express from 'express';
import { getJobs, getJobById } from '../controllers/JobController';

const router = express.Router();

// Get all jobs
router.get('/', getJobs);

// Get single job by ID
router.get('/:id', getJobById);



export default router;
