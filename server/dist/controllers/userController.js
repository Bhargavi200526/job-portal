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
exports.updateUserResume = exports.getUserApplications = exports.applyForJob = exports.getUserData = exports.syncUser = void 0;
const cloudinary_1 = require("cloudinary");
const User_1 = __importDefault(require("../models/User"));
const Job_1 = __importDefault(require("../models/Job"));
const JobApplication_1 = __importDefault(require("../models/JobApplication"));
const stream_1 = require("stream");
const syncUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, email, name, image } = req.body;
        let user = yield User_1.default.findById(id);
        if (!user) {
            user = yield User_1.default.create({
                _id: id,
                email,
                name,
                image,
                role: 'seeker',
            });
        }
        res.status(200).json({ success: true, user });
    }
    catch (err) {
        console.error("Sync user error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});
exports.syncUser = syncUser;
// Get user data by Clerk user id (_id)
const getUserData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.body.userId;
        const user = yield User_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        res.status(200).json({ success: true, user });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});
exports.getUserData = getUserData;
// Apply for a job
const applyForJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.body.userId;
        const { jobId } = req.body;
        const existingApplication = yield JobApplication_1.default.findOne({ userId, jobId });
        if (existingApplication) {
            res.status(400).json({ success: false, message: 'Already applied for this job' });
            return;
        }
        const job = yield Job_1.default.findById(jobId);
        if (!job) {
            res.status(404).json({ success: false, message: 'Job not found' });
            return;
        }
        const newApplication = yield JobApplication_1.default.create({
            userId,
            jobId,
            companyId: job.company,
            status: 'pending',
            appliedAt: new Date(),
        });
        res.status(201).json({ success: true, application: newApplication });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});
exports.applyForJob = applyForJob;
// Get user applications
const getUserApplications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = ((_a = req.auth) === null || _a === void 0 ? void 0 : _a.call(req).userId) || req.body.userId;
        const applications = yield JobApplication_1.default.find({ userId })
            .populate('companyId', 'name email image')
            .populate('jobId', 'title description location category level salary');
        if (!applications || applications.length === 0) {
            res.status(404).json({ success: false, message: 'No job applications found' });
            return;
        }
        res.status(200).json({ success: true, applications });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});
exports.getUserApplications = getUserApplications;
// Update user resume
const updateUserResume = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = ((_a = req.auth) === null || _a === void 0 ? void 0 : _a.call(req).userId) || req.body.userId;
        const resumeFile = req.file;
        if (!userId) {
            res.status(401).json({ success: false, message: 'Unauthorized. Clerk user not found.' });
            return;
        }
        const user = yield User_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        if (!resumeFile || !resumeFile.buffer) {
            res.status(400).json({ success: false, message: 'No resume file provided' });
            return;
        }
        const streamUpload = (buffer) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary_1.v2.uploader.upload_stream({ folder: 'resumes', resource_type: 'auto' }, (error, result) => {
                    if (result)
                        resolve(result);
                    else
                        reject(error);
                });
                stream_1.Readable.from(buffer).pipe(stream);
            });
        };
        const uploaded = yield streamUpload(resumeFile.buffer);
        user.resume = uploaded.secure_url;
        yield user.save();
        res.status(200).json({
            success: true,
            message: 'Resume uploaded successfully',
            resumeUrl: uploaded.secure_url,
        });
    }
    catch (err) {
        console.error("Resume upload error:", err);
        res.status(500).json({ success: false, message: err.message || "Internal Server Error" });
    }
});
exports.updateUserResume = updateUserResume;
