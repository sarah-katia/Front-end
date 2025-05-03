const express = require('express');
const router = express.Router();
const pageController = require('../controllers/directriceController');

// Ajouter un chercheur
router.post('/', pageController.addResearcherWithPublications);
router.post('/MAJ', pageController.updatePublications);
router.get('/jobs/:jobId', pageController.getJobStatus);

module.exports = router;
