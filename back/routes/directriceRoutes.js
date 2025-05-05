const express = require('express');
const router = express.Router();
const pageController = require('../controllers/directriceController');

router.post('/register', pageController.uploadChercheurPhoto,pageController.submitRequest);

// Ajouter un chercheur
router.post('/', pageController.uploadChercheurPhoto, pageController.addResearcherWithPublications);
router.post('/MAJ', pageController.updatePublications);
router.get('/jobs/:jobId', pageController.getJobStatus);

module.exports = router;
