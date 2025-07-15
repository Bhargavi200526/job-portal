"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("../config/multer"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const companyController_1 = require("../controllers/companyController");
const router = express_1.default.Router();
// Route setup
router.post('/register', multer_1.default.single('image'), companyController_1.registerCompany);
router.post('/login', companyController_1.loginCompany);
router.get('/company/:companyId', companyController_1.getCompanyData);
router.get('/profile', authMiddleware_1.protectCompany, companyController_1.getCompanyProfile);
router.post('/job', authMiddleware_1.protectCompany, companyController_1.postJob);
router.get('/applicants', authMiddleware_1.protectCompany, companyController_1.getApplicants);
router.get('/jobs', authMiddleware_1.protectCompany, companyController_1.getPostedJobs);
router.put('/application-status', authMiddleware_1.protectCompany, companyController_1.changeApplicationStatus);
router.put('/visibility', authMiddleware_1.protectCompany, companyController_1.changeJobVisibility);
exports.default = router;
