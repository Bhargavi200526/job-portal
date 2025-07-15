"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const jobApplicationSchema = new mongoose_1.default.Schema({
    userId: { type: String, ref: 'User', required: true },
    jobId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Job', required: true },
    companyId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Company', required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    appliedAt: { type: Date, default: Date.now }
});
const JobApplication = mongoose_1.default.model('JobApplication', jobApplicationSchema);
exports.default = JobApplication;
