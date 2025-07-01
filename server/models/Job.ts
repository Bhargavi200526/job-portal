import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    location: String,
    category: String,
    level: String,
    salary: { type: Number },
    visible: { type: Boolean, default: true },
    postedAt: { type: Date, default: Date.now },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  },
  { timestamps: true }
);
jobSchema.set('toObject', { getters: true, virtuals: true });
jobSchema.set('toJSON', { getters: true, virtuals: true });
const Job = mongoose.model('Job', jobSchema);
export default Job;
