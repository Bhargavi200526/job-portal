import express from 'express';
import multer from 'multer';
import upload from '../config/multer'; 
import { protectCompany } from '../middleware/authMiddleware';

import {
  loginCompany,
  registerCompany,
  getCompanyData,
  postJob,
  getApplicants,
  getPostedJobs,
  changeApplicationStatus,
  changeJobVisibility,
  getCompanyProfile
} from '../controllers/companyController';

const router = express.Router();


// Route setup
router.post('/register', upload.single('image'),registerCompany);
router.post('/login', loginCompany);
router.get('/company/:companyId', getCompanyData);
router.get('/profile', protectCompany, getCompanyProfile);

router.post('/job',protectCompany,postJob);
router.get('/applicants',protectCompany, getApplicants);
router.get('/jobs', protectCompany,getPostedJobs);
router.put('/application-status', protectCompany,changeApplicationStatus);
router.put('/visibility',protectCompany, changeJobVisibility);

export default router;
