"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const express_2 = require("@clerk/express");
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
// Sync Clerk user to MongoDB (call this on login/signup from frontend)
router.post('/sync', (0, express_2.requireAuth)(), userController_1.syncUser);
// Get user data
router.post('/user', userController_1.getUserData);
// Apply for a job
router.post('/apply', userController_1.applyForJob);
// Get user applications
router.get('/applications', (0, express_2.requireAuth)(), userController_1.getUserApplications);
// Upload/update resume
router.post('/update-resume', (0, express_2.requireAuth)(), upload.single('file'), userController_1.updateUserResume);
exports.default = router;
