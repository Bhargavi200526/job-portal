import mongoose from 'mongoose';

const jobApplicationSchema = new mongoose.Schema(
  {
    userId: { type: String, ref: 'User', required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    appliedAt: { type: Date, default: Date.now }

  }
);

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);
export default JobApplication;
