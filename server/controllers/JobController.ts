import { Request, Response, NextFunction } from 'express';
import Job from '../models/Job';

// Get all jobs
export const getJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const jobs = await Job.find().populate('company', '-password');
    res.status(200).json({
      success: true,
      jobs
    });
  }  catch (error) {
    console.error('Error fetching public jobs:', error);
    res.status(500).json({ message: 'Failed to fetch jobs' });
  }
};

// Get single job by ID
export const getJobById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const job = await Job.findById(req.params.id).populate('company', '-password');

    if (!job) {
      res.status(404).json({ success: false, message: 'Job not found' });
      return;
    }

    res.status(200).json({
      success: true,
      job
    });
  } catch (error) {
    next(error);
  }
};
