"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeJobVisibility = exports.changeApplicationStatus = exports.getPostedJobs = exports.getApplicants = exports.postJob = exports.getCompanyData = exports.loginCompany = exports.getCompanyProfile = exports.registerCompany = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Company_1 = __importDefault(require("../models/Company"));
const cloudinary_1 = require("../config/cloudinary");
const generatetoken_1 = require("../utils/generatetoken");
const Job_1 = __importDefault(require("../models/Job"));
const stream_1 = require("stream");
const JobApplication_1 = __importDefault(require("../models/JobApplication"));
// Register a new company
const registerCompany = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const file = req.file;
        // Check if company already exists
        const existingCompany = yield Company_1.default.findOne({ email });
        if (existingCompany) {
            res.status(400).json({ message: 'Company already registered' });
            return;
        }
        // Upload image to Cloudinary
        let imageUrl = '';
        if (file && file.buffer) {
            const streamUpload = (buffer) => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary_1.cloudinary.uploader.upload_stream({ folder: 'company_images' }, (error, result) => {
                        if (result)
                            resolve(result);
                        else
                            reject(error);
                    });
                    stream_1.Readable.from(buffer).pipe(stream);
                });
            };
            const uploaded = yield streamUpload(file.buffer);
            imageUrl = uploaded.secure_url;
        }
        // Hash the password
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        // Create the company
        const company = yield Company_1.default.create({
            name,
            email,
            password: hashedPassword,
            image: imageUrl,
        });
        // Generate token
        const token = (0, generatetoken_1.generateToken)(company._id.toString());
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
    }
    catch (err) {
        console.error('Register error:', err);
        next(err);
    }
});
exports.registerCompany = registerCompany;
const getCompanyProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const company = req.company;
        if (!company) {
            res.status(404).json({ message: 'Company not found' });
            return;
        }
        const companyData = yield Company_1.default.findById(company._id).select('-password');
        res.status(200).json({
            success: true,
            company: {
                id: companyData === null || companyData === void 0 ? void 0 : companyData._id,
                name: companyData === null || companyData === void 0 ? void 0 : companyData.name,
                email: companyData === null || companyData === void 0 ? void 0 : companyData.email,
                image: companyData === null || companyData === void 0 ? void 0 : companyData.image,
            },
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to fetch company profile' });
    }
});
exports.getCompanyProfile = getCompanyProfile;
// Company login
const loginCompany = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        console.log("LOGIN attempt:", email, password);
        // Check if company exists
        const company = yield Company_1.default.findOne({ email });
        if (!company) {
            console.log("Company not found!");
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }
        // Compare hashed password
        const isPasswordValid = yield bcryptjs_1.default.compare(password, company.password);
        console.log("Password valid?", isPasswordValid);
        if (!isPasswordValid) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }
        // Generate token (if using JWT)
        const token = (0, generatetoken_1.generateToken)(company._id.toString());
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
    }
    catch (err) {
        next(err);
    }
});
exports.loginCompany = loginCompany;
// Get company data by ID
const getCompanyData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const companyId = req.params.companyId.trim();
        const company = yield Company_1.default.findById(companyId).select('-password');
        if (!company) {
            res.status(404).json({ success: false, message: 'Company not found' });
            return;
        }
        res.status(200).json({ success: true, company });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});
exports.getCompanyData = getCompanyData;
// Post a new job
const postJob = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, location, category, level, salary } = req.body;
        const company = req.company;
        if (!company) {
            res.status(401).json({ message: 'Company not authenticated' });
            return;
        }
        const job = yield Job_1.default.create({
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
    }
    catch (error) {
        next(error);
    }
});
exports.postJob = postJob;
// Get job applicants
const getApplicants = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const company = req.company;
        if (!company) {
            res.status(401).json({ success: false, message: 'Company not authenticated' });
            return;
        }
        // Find jobs posted by this company
        const jobs = yield Job_1.default.find({ company: company._id }, { _id: 1 });
        const jobIds = jobs.map(j => j._id);
        // Find all applications to these jobs, populate applicant (user) and job
        const applications = yield JobApplication_1.default.find({ jobId: { $in: jobIds } })
            .sort({ createdAt: -1 })
            .populate('userId', 'name image resume')
            .populate('jobId', 'title location');
        res.json({ success: true, applications });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});
exports.getApplicants = getApplicants;
//posted jobs
const getPostedJobs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const company = req.company;
        if (!company) {
            res.status(401).json({ success: false, message: 'Company not authenticated' });
            return;
        }
        // Get all jobs posted by this company
        const jobs = yield Job_1.default.find({ company: company._id }).lean();
        // For each job, count the number of applications in JobApplication
        const jobIds = jobs.map(job => job._id);
        // Get counts for all jobs in a single query (aggregation)
        const applicationCounts = yield JobApplication_1.default.aggregate([
            { $match: { jobId: { $in: jobIds } } },
            { $group: { _id: "$jobId", count: { $sum: 1 } } }
        ]);
        // Map: jobId -> count
        const countMap = new Map();
        applicationCounts.forEach((item) => {
            countMap.set(item._id.toString(), item.count);
        });
        // Attach applicantsCount to each job
        const jobsWithApplicantCount = jobs.map((job) => (Object.assign(Object.assign({}, job), { applicantsCount: countMap.get(job._id.toString()) || 0 })));
        res.status(200).json({
            success: true,
            jobs: jobsWithApplicantCount,
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch jobs', error: err.message });
    }
});
exports.getPostedJobs = getPostedJobs;
// Change application status
const changeApplicationStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, status } = req.body;
        if (!id || !status) {
            res.status(400).json({ success: false, message: "Application ID and status are required" });
            return;
        }
        // Update the application status
        const application = yield JobApplication_1.default.findByIdAndUpdate(id, { status }, { new: true });
        if (!application) {
            res.status(404).json({ success: false, message: "Application not found" });
            return;
        }
        res.json({ success: true, message: "Application status updated", application });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.changeApplicationStatus = changeApplicationStatus;
// Change job visibility
const changeJobVisibility = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { jobId, visible } = req.body;
        const company = req.company;
        if (!company) {
            res.status(401).json({ success: false, message: 'Company not authenticated' });
            return;
        }
        const job = yield Job_1.default.findById(jobId);
        if (!job) {
            res.status(404).json({ success: false, message: 'Job not found' });
            return;
        }
        if (job.company.toString() !== company._id.toString()) {
            res.status(403).json({ success: false, message: 'Unauthorized to modify this job' });
            return;
        }
        job.visible = visible;
        yield job.save();
        console.log('Visible value:', job.visible);
        res.status(200).json({
            success: true,
            job: job.toObject()
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'Failed to update visibility', error: err.message });
    }
});
exports.changeJobVisibility = changeJobVisibility;
