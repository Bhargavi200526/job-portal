import { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import User from '../models/User';
import Job from '../models/Job';
import JobApplication from '../models/JobApplication';
import { AuthObject } from '@clerk/clerk-sdk-node';
import { Readable } from 'stream';

interface ClerkRequest extends Request {
  auth?: () => AuthObject;
}

export const syncUser = async (req: ClerkRequest, res: Response) => {
  try {
    const { id, email, name, image } = req.body;

    let user = await User.findById(id);
    if (!user) {
      user = await User.create({
        _id: id,
        email,
        name,
        image,
        role: 'seeker',
      });
    }

    res.status(200).json({ success: true, user });
  } catch (err: any) {
    console.error("Sync user error:", err); // log exact error
    res.status(500).json({ success: false, message: err.message });
  }
};



// Get user data by Clerk user id (_id)
export const getUserData = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.body.userId;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.status(200).json({ success: true, user });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Apply for a job
export const applyForJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.body.userId;
    const { jobId } = req.body;

    const existingApplication = await JobApplication.findOne({ userId, jobId });
    if (existingApplication) {
      res.status(400).json({ success: false, message: 'Already applied for this job' });
      return;
    }

    const job = await Job.findById(jobId);
    if (!job) {
      res.status(404).json({ success: false, message: 'Job not found' });
      return;
    }

    const newApplication = await JobApplication.create({
      userId,
      jobId,
      companyId: job.company,
      status: 'pending',
      appliedAt: new Date(),
    });

    res.status(201).json({ success: true, application: newApplication });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get user applications
export const getUserApplications = async (req: ClerkRequest, res: Response): Promise<void> => {
  try {
    const userId = req.auth?.().userId || (req as any).body.userId;
    const applications = await JobApplication.find({ userId })
      .populate('companyId', 'name email image')
      .populate('jobId', 'title description location category level salary');

    if (!applications || applications.length === 0) {
      res.status(404).json({ success: false, message: 'No job applications found' });
      return;
    }

    res.status(200).json({ success: true, applications });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update user resume
export const updateUserResume = async (req: ClerkRequest, res: Response): Promise<void> => {
  try {
    const userId = req.auth?.().userId || req.body.userId;
    const resumeFile = req.file;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized. Clerk user not found.' });
      return;
    }

    
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    if (!resumeFile || !resumeFile.buffer) {
      res.status(400).json({ success: false, message: 'No resume file provided' });
      return;
    }

    const streamUpload = (buffer: Buffer): Promise<any> => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'resumes', resource_type: 'auto' },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        Readable.from(buffer).pipe(stream);
      });
    };

    const uploaded = await streamUpload(resumeFile.buffer);
    user.resume = uploaded.secure_url;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Resume uploaded successfully',
      resumeUrl: uploaded.secure_url,
    });
  } catch (err: any) {
    console.error("Resume upload error:", err);
    res.status(500).json({ success: false, message: err.message || "Internal Server Error" });
  }
};