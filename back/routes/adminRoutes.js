const express = require('express');
const router = express.Router();
// const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');

router.get('/pending', adminController.getAllPendingRequests);
router.put('/approve/:pendingId',  adminController.approveUser);
router.put('/reject/:pendingId',  adminController.rejectUser);
router.get('/jobs/:jobId',  adminController.getJobStatus);
router.get('/jobs', adminController.getAllJobs);

router.post('/createaccount', authMiddleware, adminController.createUser);
router.put('/updatepasswordadmin', authMiddleware, adminController.adminUpdatePassword);

module.exports = router;