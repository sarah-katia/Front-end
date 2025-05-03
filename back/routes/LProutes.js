const express = require('express');
const router = express.Router();
const pageController = require('../controllers/LandingpageController');

// Pages principales
router.get('/', pageController.getHomePageData);
//router.get('/login', pageController.getLoginPage);
//router.get('/details', pageController.getDetailsPage);

// Formulaire de contact
router.post('/contact', pageController.sendContactEmail);

module.exports = router;
