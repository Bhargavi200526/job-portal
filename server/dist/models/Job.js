"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const jobSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    description: String,
    location: String,
    category: String,
    level: String,
    salary: { type: Number },
    visible: { type: Boolean, default: true },
    postedAt: { type: Date, default: Date.now },
    company: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Company', required: true },
}, { timestamps: true });
jobSchema.set('toObject', { getters: true, virtuals: true });
jobSchema.set('toJSON', { getters: true, virtuals: true });
const Job = mongoose_1.default.model('Job', jobSchema);
exports.default = Job;
