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
exports.getJobById = exports.getJobs = void 0;
const Job_1 = __importDefault(require("../models/Job"));
// Get all jobs
const getJobs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobs = yield Job_1.default.find().populate('company', '-password');
        res.status(200).json({
            success: true,
            jobs
        });
    }
    catch (error) {
        console.error('Error fetching public jobs:', error);
        res.status(500).json({ message: 'Failed to fetch jobs' });
    }
});
exports.getJobs = getJobs;
// Get single job by ID
const getJobById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const job = yield Job_1.default.findById(req.params.id).populate('company', '-password');
        if (!job) {
            res.status(404).json({ success: false, message: 'Job not found' });
            return;
        }
        res.status(200).json({
            success: true,
            job
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getJobById = getJobById;
