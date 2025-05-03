const express = require('express');
const router = express.Router();
const authController = require('../controllers/authcontroller');
const authMiddleware = require('../middlewares/authMiddleware');
const adminController = require('../controllers/adminController');



router.post('/createaccount', authMiddleware, adminController.createUser);
router.put('/updatepasswordadmin', authMiddleware, adminController.adminUpdatePassword);

module.exports = router;