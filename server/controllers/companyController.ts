
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import Company from '../models/Company';
import { cloudinary } from '../config/cloudinary';
import { generateToken }  from '../utils/generatetoken';
import Job from '../models/Job';
import { Readable } from 'stream';
import JobApplication from '../models/JobApplication';

// Register a new company
export const registerCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    const file = req.file;

    // Check if company already exists
    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      res.status(400).json({ message: 'Company already registered' });
      return;
    }

    // Upload image to Cloudinary
    let imageUrl = '';
    if (file && file.buffer) {
      const streamUpload = (buffer: Buffer) => {
        return new Promise<any>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'company_images' },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          Readable.from(buffer).pipe(stream);
        });
      };
      const uploaded = await streamUpload(file.buffer);
      imageUrl = uploaded.secure_url;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the company
    const company = await Company.create({
      name,
      email,
      password: hashedPassword,
      image: imageUrl,
    });

    // Generate token
    const token = generateToken(company._id.toString());

    res.status(201).json({
      message: 'Company registered successfully',
      company: {
        id: company._id,
        name: company.name,
        email: company.email,
        image: company.image,
      },
      token,
    });
  } catch (err) {
    console.error('Register error:', err);
    next(err);
  }
};


export const getCompanyProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const company = (req as any).company;

    if (!company) {
      res.status(404).json({ message: 'Company not found' });
      return;
    }

    const companyData = await Company.findById(company._id).select('-password');

    res.status(200).json({
      success: true,
      company: {
        id: companyData?._id,
        name: companyData?.name,
        email: companyData?.email,
        image: companyData?.image,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch company profile' });
  }
};





// Company login
export const loginCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    console.log("LOGIN attempt:", email, password);

    // Check if company exists
    const company = await Company.findOne({ email });
    if (!company) {
      console.log("Company not found!");
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, company.password);
    console.log("Password valid?", isPasswordValid);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Generate token (if using JWT)
    const token = generateToken(company._id.toString());

    // Success response
    res.status(200).json({
      message: 'Login successful',
      company: {
        id: company._id,
        name: company.name,
        email: company.email,
        image: company.image,
      },
      token,
    });
  } catch (err) {
    next(err);
  }
};


// Get company data by ID
export const getCompanyData = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const companyId = req.params.companyId.trim(); 

    const company = await Company.findById(companyId).select('-password');

    if (!company) {
      res.status(404).json({ success: false, message: 'Company not found' });
      return;
    }

    res.status(200).json({ success: true, company });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};




// Post a new job
export const postJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, description, location, category, level, salary } = req.body;
    const company = (req as any).company;

    if (!company) {
      res.status(401).json({ message: 'Company not authenticated' });
      return;
    }

    const job = await Job.create({
      title,
      description,
      location,
      category,
      level,
      salary,
      visible: true,
      company: company._id,
    });

    
    res.status(201).json({ message: 'Job posted successfully', job });
  } catch (error) {
    next(error);
  }
};


// Get job applicants
export const getApplicants = async (req: Request, res: Response): Promise<void> => {
  try {
    const company = (req as any).company;
    if (!company) {
      res.status(401).json({ success: false, message: 'Company not authenticated' });
      return;
    }

    // Find jobs posted by this company
    const jobs = await Job.find({ company: company._id }, { _id: 1 });
    const jobIds = jobs.map(j => j._id);

    // Find all applications to these jobs, populate applicant (user) and job
    const applications = await JobApplication.find({ jobId: { $in: jobIds } })
      .sort({ createdAt: -1 })
      .populate('userId', 'name image resume')
      .populate('jobId', 'title location');

    res.json({ success: true, applications });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//posted jobs
export const getPostedJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const company = (req as any).company;

    if (!company) {
      res.status(401).json({ success: false, message: 'Company not authenticated' });
      return;
    }

    // Get all jobs posted by this company
    const jobs = await Job.find({ company: company._id }).lean();

    // For each job, count the number of applications in JobApplication
    const jobIds = jobs.map(job => job._id);
    // Get counts for all jobs in a single query (aggregation)
    const applicationCounts = await JobApplication.aggregate([
      { $match: { jobId: { $in: jobIds } } },
      { $group: { _id: "$jobId", count: { $sum: 1 } } }
    ]);

    // Map: jobId -> count
    const countMap = new Map<string, number>();
    applicationCounts.forEach((item: any) => {
      countMap.set(item._id.toString(), item.count);
    });

    // Attach applicantsCount to each job
    const jobsWithApplicantCount = jobs.map((job: any) => ({
      ...job,
      applicantsCount: countMap.get(job._id.toString()) || 0
    }));

    res.status(200).json({
      success: true,
      jobs: jobsWithApplicantCount,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch jobs', error: (err as any).message });
  }
};


// Change application status
export const changeApplicationStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, status } = req.body;
    if (!id || !status) {
      res.status(400).json({ success: false, message: "Application ID and status are required" });
      return;
    }
    // Update the application status
    const application = await JobApplication.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!application) {
      res.status(404).json({ success: false, message: "Application not found" });
      return;
    }
    res.json({ success: true, message: "Application status updated", application });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Change job visibility
export const changeJobVisibility = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { jobId, visible } = req.body;
    const company = (req as any).company;

    if (!company) {
      res.status(401).json({ success: false, message: 'Company not authenticated' });
      return;
    }

    const job = await Job.findById(jobId);

    if (!job) {
      res.status(404).json({ success: false, message: 'Job not found' });
      return;
    }

    if (job.company.toString() !== company._id.toString()) {
      res.status(403).json({ success: false, message: 'Unauthorized to modify this job' });
      return;
    }

    job.visible = visible;
    await job.save();
   console.log('Visible value:', job.visible);

    res.status(200).json({
  success: true,
  job: job.toObject()
});
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update visibility', error: (err as any).message });
  }
};

