"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const JobController_1 = require("../controllers/JobController");
const router = express_1.default.Router();
// Get all jobs
router.get('/', JobController_1.getJobs);
// Get single job by ID
router.get('/:id', JobController_1.getJobById);
exports.default = router;
